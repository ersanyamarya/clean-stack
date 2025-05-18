import { IncomingMessage, ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';
import { HTTP_METHODS } from './meta-data';
export type RouteContext<Query = unknown, Body = unknown> = {
  method: HTTP_METHODS;
  pathName: string;
  cookie: string | undefined;
  query: Query | undefined;
  body: Body | undefined;
};

type Handler<Query = unknown, Body = unknown> = (
  req: IncomingMessage,
  res: ServerResponse,
  context: RouteContext<Query, Body>
) => Promise<Record<string, unknown>> | undefined;

type Route = {
  [key: string]: Handler;
};
const routes: Route = {};

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

export function addRoute(method: HTTP_METHODS, path: string, handler: Route['handler']) {
  routes[`${method}:${path}`] = handler;
  console.log(`routes: ${JSON.stringify(routes)}`);
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse, context: RouteContext) {
  const { method, pathName } = context;

  const route = routes[`${method}:${pathName}`];
  console.log(`routes: ${JSON.stringify(routes)}`);

  console.log(`Route: ${method}:${pathName}`);

  if (route) {
    const response = await route(req, res, context);
    if (response) {
      sendResponse(res, httpStatusCodes.OK, response);
    } else {
      sendErrorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  } else {
    sendErrorResponse(res, httpStatusCodes.NOT_FOUND, 'Not Found');
  }
  return routes;
}

export function sendErrorResponse(res: ServerResponse, statusCode: number, message: string) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

export function sendResponse(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
