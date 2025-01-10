import { grpcClientPromisify } from '@clean-stack/framework/grpc-essentials';
import { EnhanceQueryTextRequest, EnhanceQueryTextResponse, MongooseAggregationRequest, MongooseAggregationResponse } from '@clean-stack/grpc-proto/llm';
import { ListUsersRequest, ListUsersResponse } from '@clean-stack/grpc-proto/user';
import { enhanceQueryText, mongooseAggregation } from './service-clients/llm-service';
import { listUsers } from './service-clients/user-service';

import { SpanStatusCode, trace } from '@opentelemetry/api';

import { pedestrianSchema } from '@clean-stack/domain_pedestrian_data';
import { mongooseSchemaToText } from '@clean-stack/mongodb-connector';
import { initTRPC } from '@trpc/server';
import { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter';
import { z } from 'zod';

const schema = mongooseSchemaToText(pedestrianSchema);
const RefineContext =
  `This dataset contains real-time pedestrian traffic counts, weather conditions (temperature, rain, cloudiness), timestamps, and precise geo-coordinates (longitude/latitude)
for multiple streets in Würzburg, Germany, structured as GeoJSON features with polygon boundaries and location-specific properties
Only queries related to a dataset is possible and not abstract and general queries like "What is the weather today?" or "What is the population of Germany?"

Here is the schema for the dataset:
${schema}
` as const;

export const getTracer = () => trace.getTracer('trpc-server');

export const sanitizeForAttribute = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const createContext = ({ req, res }: CreateTrpcKoaContextOptions) => {
  // console.log({
  //   auth: req.headers.authorization,
  // });

  // const tracingContext = propagation.extract(context.active(), req.headers);
  // const activeSpan = trace.getSpan(tracingContext);

  // if (!activeSpan) {
  //   console.warn('No active span found in extracted context');
  // }

  // return { tracingContext };
  return {
    auth: req.headers.authorization,
    devToken: req.headers['x-dev-token'],
  };
};

type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const trpc = initTRPC.context<TrpcContext>().create();

const telemetryMiddleware = trpc.middleware(async ({ path, type, next, input, meta }) => {
  const tracer = getTracer();
  const spanName = `tRPC ${type.toUpperCase()} ${path}`;

  return tracer.startActiveSpan(
    spanName,
    {
      attributes: {
        'trpc.path': path,
        'trpc.type': type,
        'trpc.input': input ? sanitizeForAttribute(input) : undefined,
        'span.kind': 'server',
      },
    },
    undefined, // Let it automatically use the active context
    async span => {
      try {
        const result = await next();

        // span.setAttribute('trpc.result', sanitizeForAttribute(result));
        span.setStatus({ code: SpanStatusCode.OK });

        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });

        if (error instanceof Error) {
          span.recordException(error);
          span.setAttribute('error.type', error.constructor.name);
          span.setAttribute('error.message', error.message);
          span.setAttribute('error.stack', error.stack || '');
        }

        throw error;
      } finally {
        span.end();
      }
    }
  );
});

export const publicProcedure = trpc.procedure.use(telemetryMiddleware);
const trpcRouter = trpc.router({
  user: publicProcedure
    .input(String)
    .output(Object)
    .query(async req => {
      const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(listUsers())({ limit: 10, page: 1 });
      return users.users.find(user => req.input === user.id);
    }),
  users: publicProcedure.query(async () => {
    const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(listUsers())({ limit: 10, page: 1 });
    return users;
  }),
  enhanceQueryText: publicProcedure
    .input(z.string())
    // .output(EnhanceQueryTextResponse)
    .mutation(async req => {
      const response = await grpcClientPromisify<EnhanceQueryTextRequest, EnhanceQueryTextResponse>(enhanceQueryText())({
        enhancementContext: RefineContext,
        prompt: req.input.toString(),
      });

      return { response };
    }),
  generateMongooseAggregation: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const response = await grpcClientPromisify<MongooseAggregationRequest, MongooseAggregationResponse>(mongooseAggregation())({
      query: input,
      schema,
    });

    const result = JSON.parse(response.result);
    return result;
  }),
});

export { createContext, trpcRouter };

export type AppRouter = typeof trpcRouter;
