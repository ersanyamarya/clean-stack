import { gracefulShutdown } from '@clean-stack/framework/utilities';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/node';
import { os } from '@orpc/server';
import { RPCHandler } from '@orpc/server/node';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod';
import { mainLogger, telemetrySdk } from './init.js';

import { createHttpServer, RequestContext, setCookie } from '@clean-stack/http-server';
import { z } from 'zod';
import { config } from './config/index.js';

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});
const base = os.$context<RequestContext>();
const listPlanet = base
  .route({
    method: 'GET',
    path: '/planets',
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .output(z.array(PlanetSchema).describe('List of planets'))
  .handler(async ({ input }) => {
    // your list code here
    return [{ id: 1, name: 'name' }];
  });

const findPlanet = base
  .route({
    method: 'GET',
    path: '/planets/{id}',
  })
  .input(z.object({ id: z.coerce.number().int().min(1) }))
  .output(PlanetSchema.describe('Applee'))
  .handler(async ({ input, context }) => {
    // your find code here
    return { id: 1, name: 'name', cookies: context };
  });

const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
  },
};

const handler = new RPCHandler<RequestContext>(router, {
  plugins: [new CORSPlugin()],
});

const openApiHandler = new OpenAPIHandler<RequestContext>(router, {
  plugins: [new CORSPlugin(), new ZodSmartCoercionPlugin()],
});
const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});
async function main() {
  const gatewayServer = createHttpServer(
    {
      port: config.server.port,
      host: config.server.host,
      serverAddress: config.server.address,
    },
    async (req, res, context) => {
      const header = req.headers;
      console.log(header);

      const rpcResult = await handler.handle(req, res, {
        prefix: '/rpc',
        context,
      });

      const result = await openApiHandler.handle(req, res, {
        prefix: '/openapi',
        context,
      });

      if (result.matched) {
        return;
      }

      if (rpcResult.matched) {
        return;
      }
      if (req.url === '/spec.json') {
        const spec = await openAPIGenerator.generate(router, {
          info: {
            title: 'My Playground',
            version: '1.0.0',
          },
          servers: [{ url: '/openapi' } /** Should use absolute URLs in production */],
          security: [{ bearerAuth: [] }],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
              },
            },
          },
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(spec));
        return;
      }
      if (context.pathName === '/swagger') {
        const html = `
      <!doctype html>
      <html>
        <head>
          <title>My Client</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/svg+xml" href="https://orpc.unnoq.com/icon.svg" />
        </head>
        <body>
          <div id="app"></div>

          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
          <script>
            Scalar.createApiReference('#app', {
              url: '/spec.json',
              authentication: {
                securitySchemes: {
                  bearerAuth: {
                    token: 'default-token',
                  },
                },
              },
            })
          </script>
        </body>
      </html>
    `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      if (context.pathName === '/') {
        setCookie(res, 'name', 'API Gateway Cookie', {
          maxAge: 3600, // 1 hour
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(context));
        return;
      }

      res.statusCode = 404;
      res.end('Not found');
    },
    mainLogger
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
