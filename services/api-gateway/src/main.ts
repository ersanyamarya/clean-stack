import { exceptions, gracefulShutdown } from '@clean-stack/framework/utilities';
import { createHttpServer, sendResponse, setCookie } from '@clean-stack/http-server';
import { config } from './config/index';
import { mainLogger, telemetrySdk } from './init';
import { createOrpcServer } from './orpc';
import { router } from './router';
import clients from './service-clients';
async function main() {
  exceptions(mainLogger);

  clients.forEach(client => {
    mainLogger.info(`Connecting to client: ${client.name}`);
    client.connect();
  });

  const orpcServerHandler = await createOrpcServer(router);

  const gatewayServer = createHttpServer(
    {
      port: config.server.port,
      host: config.server.host,
      serverAddress: config.server.address,
    },
    async (req, res, context) => {
      if (['rpc', 'api', 'openapi', 'spec.json'].includes(context.pathName.split('/')[1] || '')) {
        await orpcServerHandler(req, res, context);
        return;
      }
      if (context.pathName === '/') {
        setCookie(res, 'name', 'API Gateway Cookie', {
          maxAge: 3600, // 1 hour
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });
        sendResponse(res, 200, {
          context,
          message: 'Welcome to the API Gateway',
        });
        return;
      }

      res.statusCode = 404;
      res.end('Not found');
    },
    mainLogger
  );

  gracefulShutdown(mainLogger, async () => {
    mainLogger.info('Shutting down server');
    gatewayServer.close();
    telemetrySdk.shutdown();
    clients.forEach(client => {
      mainLogger.warn(`Closing client: ${client.name}`);
      client.close();
    });
  });
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
