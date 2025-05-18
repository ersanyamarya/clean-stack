import { IncomingMessage, ServerResponse } from 'http';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { addRoute, getRoutes, Handler, handleRequest, RouteContext, routes, sendErrorResponse, sendResponse } from './router';

const createMockRes = () => {
  const res: Partial<ServerResponse> = {
    writeHead: vi.fn(),
    end: vi.fn(),
  };
  return res as ServerResponse;
};

describe('router', () => {
  beforeEach(() => {
    // Clear routes registry before each test
    Object.keys(routes).forEach(key => delete routes[key]);
  });

  describe('addRoute', () => {
    it('registers a route with handler and schemas', () => {
      const handler: Handler = vi.fn();
      const querySchema = z.object({ q: z.string() });
      const bodySchema = z.object({ b: z.number() });
      addRoute('GET', '/test', handler, { querySchema, bodySchema });
      expect(routes['GET:/test']).toBeDefined();
      expect(routes['GET:/test'].handler).toBe(handler);
      expect(routes['GET:/test'].querySchema).toBe(querySchema);
      expect(routes['GET:/test'].bodySchema).toBe(bodySchema);
    });
  });

  describe('getRoutes', () => {
    it('returns all registered routes with baseURL', () => {
      const handler: Handler = vi.fn();
      addRoute('GET', '/foo', handler);
      addRoute('POST', '/bar', handler);
      const result = getRoutes('/api');
      expect(result).toEqual([
        { method: 'GET', path: '/api/foo' },
        { method: 'POST', path: '/api/bar' },
      ]);
    });
  });

  describe('handleRequest', () => {
    it('calls handler and sends response for valid route (happy path)', async () => {
      const handler: Handler = vi.fn().mockResolvedValue({ ok: true });
      addRoute('GET', '/happy', handler);
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'GET',
        pathName: '/happy',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequest(req, res, context);
      expect(handler).toHaveBeenCalled();
      expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ ok: true }));
    });

    it('returns 404 for missing route', async () => {
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'GET',
        pathName: '/not-found',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequest(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Not Found' }));
    });

    it('returns 400 for invalid query', async () => {
      const handler: Handler = vi.fn();
      const querySchema = z.object({ q: z.string() });
      addRoute('GET', '/query', handler, { querySchema });
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'GET',
        pathName: '/query',
        sessionCookie: undefined,
        query: { q: 123 }, // invalid type
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequest(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalled();
    });

    it('returns 400 for invalid body', async () => {
      const handler: Handler = vi.fn();
      const bodySchema = z.object({ b: z.number() });
      // Mock getRequestBody to return invalid body

      vi.doMock('./request-body', () => ({
        getRequestBody: () => ({
          json: async () => ({ b: 'not-a-number' }),
        }),
      }));
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'POST',
        pathName: '/body',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      // Re-import handleRequest to use the mocked getRequestBody
      const { handleRequest: handleRequestMocked, addRoute: addRouteMocked } = await import('./router');
      addRouteMocked('POST', '/body', handler, { bodySchema });
      await handleRequestMocked(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalled();
      vi.resetModules();
    });

    it('returns 400 for invalid JSON body', async () => {
      const handler: Handler = vi.fn();
      const bodySchema = z.object({ b: z.number() });
      vi.doMock('./request-body', () => ({
        getRequestBody: () => ({
          json: async () => {
            throw new Error('bad json');
          },
        }),
      }));
      const { handleRequest: handleRequestMocked, addRoute: addRouteMocked } = await import('./router');
      addRouteMocked('POST', '/json', handler, { bodySchema });
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'POST',
        pathName: '/json',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequestMocked(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Invalid JSON' }));
      vi.resetModules();
    });

    it('returns 400 for invalid body when getRequestBody returns undefined', async () => {
      const handler: Handler = vi.fn();
      const bodySchema = z.object({ b: z.number() });
      vi.doMock('./request-body', () => ({
        getRequestBody: () => ({
          json: async () => undefined,
        }),
      }));
      const { handleRequest: handleRequestMocked, addRoute: addRouteMocked } = await import('./router');
      addRouteMocked('POST', '/body-undefined', handler, { bodySchema });
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'POST',
        pathName: '/body-undefined',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequestMocked(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalled();
      vi.resetModules();
    });

    it('calls handler and sends response for valid body', async () => {
      const handler: Handler = vi.fn().mockResolvedValue({ ok: 'body' });
      const bodySchema = z.object({ b: z.number() });
      vi.doMock('./request-body', () => ({
        getRequestBody: () => ({
          json: async () => ({ b: 42 }),
        }),
      }));
      const { handleRequest: handleRequestMocked, addRoute: addRouteMocked } = await import('./router');
      addRouteMocked('POST', '/body-valid', handler, { bodySchema });
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'POST',
        pathName: '/body-valid',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequestMocked(req, res, context);
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ body: { b: 42 } }), req, res);
      expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ ok: 'body' }));
      vi.resetModules();
    });

    it('calls handler and sends response for valid query', async () => {
      const handler: Handler = vi.fn().mockResolvedValue({ ok: 'query' });
      const querySchema = z.object({ q: z.string() });
      const { handleRequest: handleRequestMocked, addRoute: addRouteMocked } = await import('./router');
      addRouteMocked('GET', '/query-valid', handler, { querySchema });
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'GET',
        pathName: '/query-valid',
        sessionCookie: undefined,
        query: { q: 'test' },
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequestMocked(req, res, context);
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ query: { q: 'test' } }), req, res);
      expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ ok: 'query' }));
      vi.resetModules();
    });

    it('returns 500 if handler returns undefined', async () => {
      const handler: Handler = vi.fn().mockResolvedValue(undefined);
      addRoute('GET', '/fail', handler);
      const req = {} as IncomingMessage;
      const res = createMockRes();
      const context: RouteContext = {
        method: 'GET',
        pathName: '/fail',
        sessionCookie: undefined,
        query: undefined,
        body: undefined,
        authToken: '',
        refreshToken: '',
        devToken: '',
      };
      await handleRequest(req, res, context);
      expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error' }));
    });
  });

  describe('sendErrorResponse', () => {
    it('writes error response as JSON', () => {
      const res = createMockRes();
      sendErrorResponse(res, 400, 'Bad Request');
      expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Bad Request' }));
    });
    it('writes error object as JSON', () => {
      const res = createMockRes();
      sendErrorResponse(res, 401, { error: 'Unauthorized', details: { reason: 'token' } });
      expect(res.writeHead).toHaveBeenCalledWith(401, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Unauthorized', details: { reason: 'token' } }));
    });
  });

  describe('sendResponse', () => {
    it('writes data as JSON with status', () => {
      const res = createMockRes();
      sendResponse(res, 201, { ok: 1 });
      expect(res.writeHead).toHaveBeenCalledWith(201, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ ok: 1 }));
    });
  });
});
