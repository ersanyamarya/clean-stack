import { mainLogger, telemetrySdk } from './init';

import { errorHandler } from '@clean-stack/custom-errors';
import { ErrorCallback, getKoaServer, setupRootRoute } from '@clean-stack/koa-server-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/utilities';
import Router from '@koa/router';
import controllers from './controllers';
import clients from './service-clients';

import { config } from './config';

const errorCallback: ErrorCallback = (error, ctx) => {
  const errorData = errorHandler(error, ctx.logger);

  ctx.status = errorData.status;
  ctx.body = errorData;
};
const router = new Router();

async function main() {
  exceptions(mainLogger);

  const {
    server: { address, port },
    service: { name: serviceName, version: serviceVersion },
  } = config;
  const koaApp = await getKoaServer({
    logger: mainLogger,
    errorCallback,
    serviceName,
    serviceVersion,
  });

  setupRootRoute(
    {
      serviceName,
      serviceVersion,
      healthChecks: {},
      showRoutes: true,
      nodeEnv: process.env.NODE_ENV,
    },
    router
  );
  clients.forEach(client => {
    mainLogger.info(`Connecting to client: ${client.name}`);
    client.connect();
  });
  controllers.forEach(({ name, method, path, callback }) => {
    mainLogger.info(`Setting up route ${method.toUpperCase()} ${path}`);
    // eslint-disable-next-line security/detect-object-injection
    router[method](name, path, callback);
  });

  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

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
