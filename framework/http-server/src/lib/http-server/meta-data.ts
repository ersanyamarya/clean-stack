import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Socket } from 'net';
import { parse } from 'url';
import { Client, getClientInfo } from './client-info';

export type Protocol = 'http' | 'https';
export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export const ALLOWED_METHODS: HTTP_METHODS[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
export const METHODS_WITH_BODY: HTTP_METHODS[] = ['POST', 'PUT', 'DELETE'];

type MetaData = {
  protocol: Protocol;
  baseURL: string;
  query: Record<string, unknown>;
  path: string;
  pathname: string;
  headers: IncomingHttpHeaders;
  contentType: string | undefined;
  cookie: string | undefined;
  client: Client;
  method: HTTP_METHODS;
  allowedMethodsString: string;
  origin: string;
  httpVersion: string;
  AuthToken: string;
  DevToken: string;
};

/**
 * Extracts meta-data from an HTTP request in a functional, readable way.
 * @param req IncomingMessage
 * @returns MetaData
 */
export function extractRequestMeta(req: IncomingMessage): MetaData {
  const protocol: Protocol = isEncrypted(req) ? 'https' : 'http';
  const baseURL = getBaseURL(protocol, req.headers);
  const { query, pathname, path } = parse(baseURL + (req.url || ''), true);
  const { headers, method } = req;
  const contentType = headers['content-type'];
  const cookie = headers.cookie;
  const client = getClientInfo(headers as Record<string, string>, req.socket as Socket);
  const allowedMethodsString = ALLOWED_METHODS.join(', ');
  const origin = getOrigin(headers, req.socket);
  const httpVersion = req.httpVersion;
  const AuthToken = headers['authorization'] || '';
  const DevToken = (headers['dev-token'] as string) || '';

  return {
    protocol,
    baseURL,
    query,
    path: path || '',
    pathname: pathname || '',
    headers,
    contentType,
    cookie,
    client,
    method: (method || 'GET') as HTTP_METHODS,
    allowedMethodsString,
    origin,
    httpVersion,
    AuthToken,
    DevToken,
  };
}

/**
 * Determines if the request is encrypted (HTTPS).
 */
const isEncrypted = (req: IncomingMessage): boolean => {
  // NOTE: Node's Socket type does not expose 'encrypted', so we use type assertion.
  return Boolean((req.socket as unknown as { encrypted?: boolean }).encrypted);
};

/**
 * Constructs the base URL from protocol and headers.
 */
const getBaseURL = (protocol: Protocol, headers: IncomingHttpHeaders): string => {
  const host = protocol === 'https' ? headers[':authority'] : headers.host;
  return protocol + '://' + (host || '');
};

/**
 * Determines the request origin from headers or socket.
 */
const getOrigin = (headers: IncomingHttpHeaders, socket: Socket): string => {
  // NOTE: Node's Socket type does not expose 'remoteAddress', so we use type assertion.
  return headers.origin || (socket as unknown as { remoteAddress?: string }).remoteAddress || 'unknown';
};
