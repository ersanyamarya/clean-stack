import { AppLogger } from '@clean-stack/appLogger';
import { errorHandler } from '@clean-stack/custom-errors';
import { ErrorCallback, getKoaServer, setupRootRoute } from '@clean-stack/koa-server-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/utilities';
import Router from '@koa/router';
import controllers from './controllers';
import clients from './service-clients';

const errorCallback: ErrorCallback = (error, ctx) => {
  const errorData = errorHandler(error, ctx.logger);

  ctx.status = errorData.status;
  ctx.body = errorData;
};
const router = new Router();

async function main() {
  exceptions(AppLogger);
  const koaApp = await getKoaServer({
    logger: AppLogger,
    errorCallback,
    serviceName: 'main-service',
    serviceVersion: '1.0.0',
  });

  setupRootRoute(
    {
      serviceName: 'main-service',
      serviceVersion: '1.0.0',
      healthChecks: {},
      showRoutes: true,
      nodeEnv: process.env.NODE_ENV,
    },
    router
  );
  clients.forEach(client => {
    AppLogger.info(`Connecting to client: ${client.name}`);
    client.connect();
  });
  controllers.forEach(({ name, method, path, callback }) => {
    AppLogger.info(`Setting up route ${method.toUpperCase()} ${path}`);
    // eslint-disable-next-line security/detect-object-injection
    router[method](name, path, callback);
  });

  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

  const server = koaApp
    .listen(9900, () => {
      AppLogger.info(`Server listening on http://localhost:9900`);
    })
    .on('error', error => {
      AppLogger.error(error.message);
      process.exit(1);
    });

  gracefulShutdown(
    AppLogger,
    () => {
      clients.forEach(client => {
        AppLogger.warn(`Closing client: ${client.name}`);
        client.close();
      });
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
