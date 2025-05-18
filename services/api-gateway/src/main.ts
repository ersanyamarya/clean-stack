import { gracefulShutdown } from '@clean-stack/framework/utilities';
import { mainLogger, telemetrySdk } from './init';

import { addRoute, createHttpServer, getRoutes } from '@clean-stack/http-server';
import { config } from './config';

async function main() {
  const server2 = createHttpServer(
    {
      port: config.server.port,
      host: config.server.host,
    },
    mainLogger
  );

  addRoute('POST', '/', async (req, res, context) => {
    return {
      status: 'ok',
      routes: getRoutes(context.pathName),
      context,
    };
  });

  const onsShutdown = async () => {
    mainLogger.info('Shutting down server');
    server2.close();
    telemetrySdk.shutdown();
  };

  gracefulShutdown(mainLogger, onsShutdown);
}

main().catch(error => {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
});
