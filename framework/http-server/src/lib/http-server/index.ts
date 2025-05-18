import { Logger } from '@clean-stack/framework/global-types';
import * as http from 'http';
import httpStatusCodes from 'http-status-codes';
import { ALLOWED_METHODS, extractRequestMeta, METHODS_WITH_BODY } from './meta-data';
import { getRequestBody } from './request-body';
import { handleRequest, RouteContext, sendErrorResponse } from './router';
export { addRoute, getRoutes } from './router';
type HttpServerOptions = {
  port: number;
  host: string;
};

export function createHttpServer(options: HttpServerOptions, logger: Logger) {
  const server = http.createServer(async (req, res) => {
    const { cookie, method, allowedMethodsString, pathname, query, origin } = extractRequestMeta(req);

    if (!ALLOWED_METHODS.includes(method)) {
      sendErrorResponse(res, httpStatusCodes.METHOD_NOT_ALLOWED, `Method Not Allowed. Allowed methods: ${allowedMethodsString}`);
      return;
    }
    if (method === 'OPTIONS') {
      res.writeHead(httpStatusCodes.OK, { 'Access-Control-Allow-Methods': allowedMethodsString });
      res.end();
      return;
    }
    const context: RouteContext = {
      method,
      pathName: pathname,
      cookie,
      query,
      body: undefined,
    };

    if (METHODS_WITH_BODY.includes(method)) {
      try {
        const body = await getRequestBody(req).json<Record<string, unknown>>();
        context.body = body;
      } catch {
        sendErrorResponse(res, httpStatusCodes.BAD_REQUEST, 'Invalid JSON');
        return;
      }
    }
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Dev-Token');
      res.setHeader('Access-Control-Allow-Methods', allowedMethodsString);
    }
    res.setHeader('Set-Cookie', 'name=monkey; HttpOnly; Secure; SameSite=None');

    await handleRequest(req, res, context);
  });

  server.listen(options.port, options.host, () => {
    logger.info(`HTTP server listening on ${options.host}:${options.port}`);
  });

  return server;
}

function extractCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  const cookieArray = cookieHeader.split('; ');
  for (const cookie of cookieArray) {
    const [key, value] = cookie.split('=');
    if (key && value) {
      cookies[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }
  return cookies;
}
