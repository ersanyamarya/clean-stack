import { errorHandler } from '@clean-stack/custom-errors';
import { RequestContext, sendResponse } from '@clean-stack/http-server';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/node';
import { ContractRouter, onError, ORPCError, Router } from '@orpc/server';
import { RPCHandler } from '@orpc/server/node';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod';
import { IncomingMessage, ServerResponse } from 'http';
export const createOrpcServer = async <T extends { [k: string]: ContractRouter<unknown> }>(router: Router<T, RequestContext>) => {
  const rpcHandler = new RPCHandler<RequestContext>(router, {
    plugins: [new CORSPlugin()],
  });
  const openApiHandler = new OpenAPIHandler<RequestContext>(router, {
    plugins: [new CORSPlugin(), new ZodSmartCoercionPlugin()],
    interceptors: [
      onError(error => {
        const errorData = errorHandler(error, (error: unknown) => {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            name: 'InternalServerError',
            message: 'An internal server error occurred',
            status: 500,
            errorCode: 'INTERNAL_SERVER_ERROR',
          });
        });

        throw new ORPCError(errorData.errorCode, {
          name: errorData.name,
          message: errorData.message,
          status: errorData.status,
        });
      }),
    ],
  });
  const openAPIGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });
  const spec = await openAPIGenerator.generate(router, {
    info: {
      title: 'ORPC Playground',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }], // Should use absolute URLs in production
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

  return async (req: IncomingMessage, res: ServerResponse, context: RequestContext) => {
    const { matched: rpcMatched } = await rpcHandler.handle(req, res, {
      prefix: '/rpc',
      context,
    });
    const { matched: openApiMatched } = await openApiHandler.handle(req, res, {
      prefix: '/api',
      context,
    });
    if (rpcMatched || openApiMatched) {
      return;
    }
    if (req.url === '/spec.json') {
      sendResponse(res, 200, spec);
      return;
    }
    if (context.pathName === '/openapi') {
      const html = `
      <!doctype html>
      <html>
        <head>
          <title>ORPC Playground</title>
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
  };
};
