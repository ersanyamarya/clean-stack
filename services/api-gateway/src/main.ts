import { gracefulShutdown } from '@clean-stack/framework/utilities';
import { mainLogger, telemetrySdk } from './init';

import { addRoute, clearAllCookies, createHttpServer, getRoutes } from '@clean-stack/http-server';
import { z } from 'zod';
import { config } from './config';

async function main() {
  const gatewayServer = createHttpServer(
    {
      port: config.server.port,
      host: config.server.host,
    },
    mainLogger
  );

  addRoute(
    'POST',
    '/',
    async (context, req, res) => {
      return {
        status: 'ok',
        routes: getRoutes(context.pathName),
        context,
      };
    },
    {
      bodySchema: z.object({
        age: z.number().min(0),
      }),
      querySchema: z.object({
        name: z.coerce.string(),
      }),
    }
  );

  addRoute(
    'GET',
    '/',
    async (context, req, res) => {
      clearAllCookies(req, res);

      // const query = context.query;
      // Object.keys(query).forEach(key => {
      //   setCookie(res, key, query[key], { httpOnly: true, secure: true, sameSite: 'None' });
      // });
      return {
        status: 'ok',
        context,
        // routes: getRoutes(context.pathName),
      };
    },
    {
      querySchema: z.object({
        name: z.coerce.string(),
      }),
    }
  );

  const onsShutdown = async () => {
    mainLogger.info('Shutting down server');
    gatewayServer.close();
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
