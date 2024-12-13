import { mainLogger, telemetrySdk } from './init';
import { createContext, trpcRouter } from './trpc_router';

import { errorHandler } from '@clean-stack/custom-errors';
import { ErrorCallback, getKoaServer, setupRootRoute } from '@clean-stack/framework/koa-server-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/framework/utilities';
import { createCacheStore, gerRedisCacheProvider } from '@clean-stack/platform-features/cache';
import { createRedisConnector, getRedisClient } from '@clean-stack/redis';
import Router from '@koa/router';
import { createKoaMiddleware } from 'trpc-koa-adapter';
import { config } from './config';
import controllers from './controllers';
import clients from './service-clients';

const {
  server: { address, port },
  service: { name: serviceName, version: serviceVersion },
} = config;
const errorCallback: ErrorCallback = (error, ctx) => {
  const errorData = errorHandler(error, (error: unknown) => {
    ctx.logger.error(error);
  });

  ctx.status = errorData.status;
  ctx.body = errorData;
};
const router = new Router();
const redisConnector = createRedisConnector(mainLogger, {
  url: 'redis://0.0.0.0:6379',
  name: serviceName,
  maxRetries: 20,
  retryInterval: 500,
});

async function main() {
  exceptions(mainLogger);

  const { name: redisName, healthCheck: redisHealthCheck } = await redisConnector.connect();
  const redisClient = getRedisClient();
  const redisProvider = gerRedisCacheProvider(redisClient);
  const cacheStore = createCacheStore(redisProvider);

  const koaApp = await getKoaServer({
    logger: mainLogger,
    errorCallback,
    serviceName,
    serviceVersion,
  });

  // add ctx info to trace spans

  // koaApp.use(async function addContextToTraces(ctx, next) {
  //   const currentSpan = trace.getSpan(context.active());
  //   const requestInfo = ctx.requestInfo;
  //   if (currentSpan) {
  //     currentSpan.setAttribute('req.info', JSON.stringify(requestInfo));
  //     ctx.tracer = currentSpan;
  //   }
  //   await next();
  // });

  setupRootRoute(
    {
      serviceName,
      serviceVersion,
      healthChecks: {
        [redisName]: async () => {
          return {
            ...(await redisHealthCheck()),
            store: cacheStore.stats(),
          };
        },
      },
      showRoutes: true,
      nodeEnv: process.env.NODE_ENV,
    },
    router
  );
  clients.forEach(client => {
    mainLogger.info(`Connecting to client: ${client.name}`);
    client.connect();
  });
  controllers.forEach(({ name, method, path, getCallback }) => {
    mainLogger.info(`Setting up route ${method.toUpperCase()} ${path}`);
    const callback = getCallback(cacheStore);
    // eslint-disable-next-line security/detect-object-injection
    router[method](name, path, callback);
  });

  koaApp.use(router.routes());

  koaApp.use(async function allowedMethodsMiddleware(ctx, next) {
    await router.allowedMethods()(ctx as any, next);
  });

  koaApp.use(async function setupTrpcAdapterMiddleware(ctx, next) {
    const adapter = createKoaMiddleware({
      router: trpcRouter,
      createContext,
      prefix: '/trpc',
    });

    return adapter(ctx, next);
  });

  const server = koaApp
    .listen(port, () => {
      mainLogger.info(`Server listening on ${address}`);
    })
    .on('error', error => {
      mainLogger.error(error.message);
      process.exit(1);
    });

  gracefulShutdown(
    mainLogger,
    () => {
      clients.forEach(client => {
        mainLogger.warn(`Closing client: ${client.name}`);
        client.close();
      });
      telemetrySdk.shutdown();
      redisConnector.disconnect();
    },
    server
  );
}

main().catch(error => {
  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
});
