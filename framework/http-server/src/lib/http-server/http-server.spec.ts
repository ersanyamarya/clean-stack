import type { Logger } from '@clean-stack/framework/global-types';
import type { IncomingMessage, Server, ServerResponse } from 'http';
import http from 'http';
import supertest from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHttpServer, sendErrorResponse, sendResponse } from './index';

// Mocks
const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(() => mockLogger),
};

type MinimalContext = Record<string, unknown>;

describe('createHttpServer', () => {
  let server: Server | undefined;
  const port = 0;
  const host = '127.0.0.1';
  let handleRequest: (req: IncomingMessage, res: ServerResponse, ctx: MinimalContext) => Promise<void>;

  beforeEach(() => {
    handleRequest = vi.fn(async (req, res) => {
      res.statusCode = 200;
      res.end('ok');
    });
  });

  afterEach(async () => {
    if (server) await new Promise(res => (server as Server).close(res));
    vi.clearAllMocks();
  });

  describe('when started with valid options', () => {
    it('returns an HTTP server instance', () => {
      server = createHttpServer({ port, host }, handleRequest, mockLogger);
      expect(server).toBeInstanceOf(http.Server);
    });
  });

  describe('when receiving a valid request', () => {
    it('invokes handleRequest and returns expected response', async () => {
      server = createHttpServer({ port, host }, handleRequest, mockLogger);
      await new Promise(resolve => (server as Server).listen(0, host, () => resolve(undefined)));
      const response = await supertest(server as Server).get('/test');
      expect(response.text).toBe('ok');
      expect(handleRequest).toHaveBeenCalled();
    });
  });

  describe('when receiving a request with a disallowed method', () => {
    it('returns 405 Method Not Allowed', async () => {
      server = createHttpServer({ port, host }, handleRequest, mockLogger);
      await new Promise(resolve => (server as Server).listen(0, host, () => resolve(undefined)));
      const response = await supertest(server as Server).trace('/test');
      expect(response.status).toBe(405);
      expect(response.body.error).toMatch(/Method Not Allowed/);
      expect(handleRequest).not.toHaveBeenCalled();
    });
  });

  describe('when receiving an OPTIONS request', () => {
    it('returns 200 and CORS headers', async () => {
      server = createHttpServer({ port, host }, handleRequest, mockLogger);
      await new Promise(resolve => (server as Server).listen(0, host, () => resolve(undefined)));
      const response = await supertest(server as Server)
        .options('/test')
        .set('Origin', 'http://localhost');
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost');
      expect(handleRequest).not.toHaveBeenCalled();
    });
  });
});

describe('sendErrorResponse', () => {
  it('sends a JSON error response with the given status code and message', () => {
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    } as Partial<ServerResponse> as ServerResponse;
    sendErrorResponse(res, 400, 'Bad Request');
    expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Bad Request' }));
  });

  it('sends a JSON error response with an object message', () => {
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    } as Partial<ServerResponse> as ServerResponse;
    sendErrorResponse(res, 500, { error: 'Internal Error', code: 123 });
    expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Error', code: 123 }));
  });
});

describe('sendResponse', () => {
  it('sends a JSON response with the given status code and data', () => {
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    } as Partial<ServerResponse> as ServerResponse;
    sendResponse(res, 200, { success: true });
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ success: true }));
  });
});
