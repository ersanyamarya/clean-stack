import { Logger } from '@clean-stack/framework/global-types';
import * as http from 'http';
import { ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';
import { extractCookies } from './cookies';
import type { HTTP_METHODS } from './meta-data';
import { ALLOWED_METHODS, extractRequestMeta } from './meta-data';
export { clearAllCookies, setCookie } from './cookies';

export type RequestContext = {
  method: HTTP_METHODS;
  pathName: string;
  sessionCookie: Record<string, string> | undefined;
  query: Record<string, unknown> | undefined;
  body: unknown;
  baseURL: string;
  authToken: string | undefined;
  refreshToken: string | undefined;
  devToken: string | undefined;
};

/**
 * Options for creating the HTTP server.
 */
type HttpServerOptions = {
  port: number;
  host: string;
  serverAddress?: string;
};

/**
 * Sets CORS headers on the response if an origin is provided.
 * @param res - HTTP response object
 * @param origin - Origin header value
 * @param allowedMethodsString - Allowed HTTP methods as a string
 */
const setCorsHeaders = (res: http.ServerResponse, origin: string | undefined, allowedMethodsString: string) => {
  if (!origin) return;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Dev-Token');
  res.setHeader('Access-Control-Allow-Methods', allowedMethodsString);
};

/**
 * Handles HTTP OPTIONS requests for CORS preflight.
 * Returns true if the request was handled, false otherwise.
 * @param method - HTTP method
 * @param res - HTTP response object
 * @param allowedMethodsString - Allowed HTTP methods as a string
 */
const handleOptionsMethod = (method: string, res: http.ServerResponse, allowedMethodsString: string): boolean => {
  if (method !== 'OPTIONS') return false;
  res.writeHead(httpStatusCodes.OK, { 'Access-Control-Allow-Methods': allowedMethodsString });
  res.end();
  return true;
};

/**
 * Checks if the HTTP method is allowed.
 * @param method - HTTP method string
 */
const isMethodAllowed = (method: string) => ALLOWED_METHODS.includes(method as HTTP_METHODS);

/**
 * Creates and starts an HTTP server with Clean Stack conventions.
 * Handles CORS, method validation, and delegates routing.
 * @param options - Server options (port, host)
 * @param logger - Logger instance
 */
export function createHttpServer(
  options: HttpServerOptions,
  handleRequest: (req: http.IncomingMessage, res: http.ServerResponse, context: RequestContext) => Promise<void>,
  logger: Logger
) {
  const server = http.createServer(async (req, res) => {
    // Extract request meta-data (method, path, headers, etc.)
    const meta = extractRequestMeta(req);

    // Reject disallowed HTTP methods early
    if (!isMethodAllowed(meta.method)) {
      sendErrorResponse(res, httpStatusCodes.METHOD_NOT_ALLOWED, `Method Not Allowed. Allowed methods: ${meta.allowedMethodsString}`);
      return;
    }

    // Set CORS headers if needed
    setCorsHeaders(res, meta.origin, meta.allowedMethodsString);

    // Handle CORS preflight requests
    if (handleOptionsMethod(meta.method, res, meta.allowedMethodsString)) return;

    const sessionCookie = extractCookies(meta.cookie);
    const authToken = meta.AuthToken || sessionCookie['authToken'];
    const refreshToken = sessionCookie['refreshToken'];
    const devToken = meta.DevToken || sessionCookie['devToken'];

    // Build route context for downstream handlers
    const context: RequestContext = {
      method: meta.method,
      pathName: meta.pathname,
      sessionCookie,
      query: meta.query,
      body: undefined,
      baseURL: meta.baseURL,
      authToken,
      refreshToken,
      devToken,
    };

    await handleRequest(req, res, context);
  });

  // Start listening on the specified host/port
  server.listen(options.port, options.host, () => {
    if (options.serverAddress) {
      logger.info(`HTTP server listening on ${options.serverAddress}`);
    } else {
      logger.info(`HTTP server listening on ${options.host}:${options.port}`);
    }
  });
  return server;
}

export function sendErrorResponse(res: ServerResponse, statusCode: number, message: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(typeof message === 'string' ? { error: message } : message));
}

export function sendResponse(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
