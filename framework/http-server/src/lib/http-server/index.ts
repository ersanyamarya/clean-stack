import { Logger } from '@clean-stack/framework/global-types';
import * as http from 'http';
import httpStatusCodes from 'http-status-codes';
import { ALLOWED_METHODS, extractRequestMeta, METHODS_WITH_BODY } from './meta-data';
import { getRequestBody } from './request-body';

type HttpServerOptions = {
  port: number;
  host: string;
  onRequest: (req: http.IncomingMessage, res: http.ServerResponse, context: any) => void;
};

export function createHttpServer(options: HttpServerOptions, logger: Logger) {
  const server = http.createServer(async (req, res) => {
    const { headers, cookie, method, allowedMethodsString, ...otherMetaData } = extractRequestMeta(req);

    if (!ALLOWED_METHODS.includes(method)) {
      sendErrorResponse(res, httpStatusCodes.METHOD_NOT_ALLOWED, `Method Not Allowed. Allowed methods: ${allowedMethodsString}`);
      return;
    }
    if (method === 'OPTIONS') {
      res.writeHead(httpStatusCodes.OK, { 'Access-Control-Allow-Methods': allowedMethodsString });
      res.end();
      return;
    }

    const info = {
      cookie,
      method,
      allowedMethodsString,
      body: METHODS_WITH_BODY.includes(method) ? await getRequestBody(req).json() : undefined,
      ...otherMetaData,
    };

    options.onRequest(req, res, info);
  });

  server.listen(options.port, options.host, () => {
    logger.info(`HTTP server listening on ${options.host}:${options.port}`);
  });

  return server;
}

function sendErrorResponse(res: http.ServerResponse, statusCode: number, message: string) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}
function sendResponse(res: http.ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
