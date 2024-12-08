import { grpcClientPromisify } from '@clean-stack/framework/grpc-essentials';
import { ListUsersRequest, ListUsersResponse } from '@clean-stack/grpc-proto';
import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';

import { initTRPC } from '@trpc/server';
import { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter';
import { listUsers } from './service-clients/user-service';

export const getTracer = () => trace.getTracer('trpc-server');

export const sanitizeForAttribute = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const createContext = ({ req, res }: CreateTrpcKoaContextOptions) => {
  const tracingContext = propagation.extract(context.active(), req.headers);
  const activeSpan = trace.getSpan(tracingContext);

  if (!activeSpan) {
    console.warn('No active span found in extracted context');
  }

  return { tracingContext };
};

type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const trpc = initTRPC.context<TrpcContext>().create();

const telemetryMiddleware = trpc.middleware(async ({ path, type, next, input, ctx }) => {
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

        span.setAttribute('trpc.result', sanitizeForAttribute(result));
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
});

export { createContext, trpcRouter };

export type AppRouter = typeof trpcRouter;
