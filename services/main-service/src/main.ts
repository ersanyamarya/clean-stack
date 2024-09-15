import { errorHandler } from '@clean-stack/custom-errors';
import { Logger } from '@clean-stack/global_types';
import { ErrorCallback, getKoaServer, setupRootRoute } from '@clean-stack/koa-server-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/utilities';
import Router from '@koa/router';
import controllers from './controllers';
import clients from './service-clients';
const ConsoleTextColorLogger: Logger = {
  info: (...optionalParams: unknown[]) => console.log('\x1b[32m', 'ℹ️ ', ...optionalParams, '\x1b[0m'),
  warn: (...optionalParams: unknown[]) => console.log('\x1b[33m', '🚧 ', ...optionalParams, '\x1b[0m'),
  error: (...optionalParams: unknown[]) => console.log('\x1b[31m', '❌ ', ...optionalParams, '\x1b[0m'),
  debug: (...optionalParams: unknown[]) => console.log('\x1b[34m', '🐛 ', ...optionalParams, '\x1b[0m'),
};

const errorCallback: ErrorCallback = (error, ctx) => {
  const errorData = errorHandler(error, ctx.logger);

  ctx.status = errorData.status;
  ctx.body = errorData;
};
const router = new Router();

async function main() {
  exceptions(ConsoleTextColorLogger);
  const koaApp = await getKoaServer({
    logger: ConsoleTextColorLogger,
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
    ConsoleTextColorLogger.info(`Connecting to client: ${client.name}`);
    client.connect();
  });
  controllers.forEach(({ name, method, path, callback }) => {
    ConsoleTextColorLogger.info(`Setting up route ${method.toUpperCase()} ${path}`);
    // eslint-disable-next-line security/detect-object-injection
    router[method](name, path, callback);
  });

  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

  const server = koaApp
    .listen(9900, () => {
      ConsoleTextColorLogger.info(`Server listening on http://localhost:9900`);
    })
    .on('error', error => {
      ConsoleTextColorLogger.error(error.message);
      process.exit(1);
    });

  gracefulShutdown(
    ConsoleTextColorLogger,
    () => {
      clients.forEach(client => {
        ConsoleTextColorLogger.warn(`Closing client: ${client.name}`);
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
