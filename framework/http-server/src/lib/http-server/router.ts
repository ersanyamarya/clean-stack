import { IncomingMessage, ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';
import { ZodSchema } from 'zod';
import { HTTP_METHODS, METHODS_WITH_BODY } from './meta-data';
import { getRequestBody } from './request-body';

export type RouteContext<Query = unknown, Body = unknown, Cookie = unknown> = {
  method: HTTP_METHODS;
  pathName: string;
  sessionCookie: Cookie | undefined;
  query: Query | undefined;
  body: Body | undefined;
  authToken: string;
  refreshToken: string;
  devToken: string;
};

// Handler now receives validated types
export type Handler<Query = unknown, Body = unknown> = (
  context: RouteContext<Query, Body>,
  req: IncomingMessage,
  res: ServerResponse
) => Promise<Record<string, unknown>> | undefined;

// Route registration with schemas
// Use unknown for the registry to avoid type conflicts between different routes
export type RouteEntry<Query = unknown, Body = unknown> = {
  handler: Handler<Query, Body>;
  querySchema?: ZodSchema<Query>;
  bodySchema?: ZodSchema<Body>;
};

export const routes: Record<string, RouteEntry<any, any>> = {};

export function getRoutes(baseURL: string) {
  return Object.keys(routes).reduce(
    (acc, key) => {
      const [method, path] = key.split(':');
      acc.push({
        method: method as HTTP_METHODS,
        path: `${baseURL}${path}`,
      });
      return acc;
    },
    [] as Array<{ method: HTTP_METHODS; path: string }>
  );
}

type Prettify<T> = {
  [K in keyof T]: T[K];
};
// Add route with optional query/body schemas
export function addRoute<Query = unknown, Body = unknown>(
  method: HTTP_METHODS,
  path: string,
  handler: Handler<Query, Body>,
  options?: { querySchema?: ZodSchema<Query>; bodySchema?: ZodSchema<Body> }
) {
  routes[`${method}:${path}`] = {
    handler,
    querySchema: options?.querySchema,
    bodySchema: options?.bodySchema,
  } as RouteEntry<Query, Body>;
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse, context: Prettify<RouteContext>) {
  const { method, pathName, query } = context;

  const routeEntry = routes[`${method}:${pathName}`] as RouteEntry;

  if (!routeEntry) {
    sendErrorResponse(res, httpStatusCodes.NOT_FOUND, 'Not Found');
    return;
  }

  // Validate query if schema provided
  if (routeEntry.querySchema) {
    const result = routeEntry.querySchema.safeParse(query);
    if (!result.success) {
      sendErrorResponse(res, httpStatusCodes.BAD_REQUEST, {
        error: 'Invalid query',
        details: result.error.flatten(),
      });
      return;
    }
    context.query = result.data;
  }

  // Validate body if schema provided
  if (METHODS_WITH_BODY.includes(method) && routeEntry.bodySchema) {
    try {
      const body = await getRequestBody(req).json<unknown>();
      const result = routeEntry.bodySchema.safeParse(body);
      if (!result.success) {
        sendErrorResponse(res, httpStatusCodes.BAD_REQUEST, {
          error: 'Invalid body',
          details: result.error.flatten(),
        });
        return;
      }
      context.body = result.data;
    } catch {
      sendErrorResponse(res, httpStatusCodes.BAD_REQUEST, 'Invalid JSON');
      return;
    }
  }

  const response = await routeEntry.handler(context, req, res);
  if (response) {
    sendResponse(res, httpStatusCodes.OK, response);
  } else {
    sendErrorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

export function sendErrorResponse(res: ServerResponse, statusCode: number, message: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(typeof message === 'string' ? { error: message } : message));
}

export function sendResponse(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
