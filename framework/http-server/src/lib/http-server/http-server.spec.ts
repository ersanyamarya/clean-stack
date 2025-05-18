import { Logger } from '@clean-stack/framework/global-types';
import http from 'http';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createHttpServer } from './index';

// Mock logger
const infoMock = vi.fn();
const logger: Logger = {
  info: infoMock,
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  child: () => logger,
};

const HOST = '127.0.0.1';
const PORT = 0; // Use 0 for dynamic port assignment

let server: http.Server;
let address: string;

beforeAll(async () => {
  server = createHttpServer({ port: PORT, host: HOST }, logger);
  await new Promise<void>(resolve => {
    server.on('listening', () => {
      const addr = server.address();
      if (typeof addr === 'object' && addr && 'port' in addr) {
        address = `http://${HOST}:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()));
});

describe('createHttpServer', () => {
  describe('when receiving a valid GET request', () => {
    it('responds with 404 for unknown route and sets CORS headers', async () => {
      const res = await request(address).get('/unknown').set('Origin', 'http://test-origin.com').expect(404);
      expect(res.headers['access-control-allow-origin']).toBe('http://test-origin.com');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
      expect(res.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('when receiving a disallowed HTTP method', () => {
    it('responds with 405 Method Not Allowed', async () => {
      const res = await request(address).patch('/any').expect(405);
      expect(res.text).toContain('Method Not Allowed');
    });
  });

  describe('when receiving an OPTIONS request (CORS preflight)', () => {
    it('responds with 200 and CORS headers', async () => {
      const res = await request(address).options('/any').set('Origin', 'http://test-origin.com').expect(200);
      expect(res.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('when server starts', () => {
    it('calls logger.info with listening message', () => {
      expect(infoMock).toHaveBeenCalled();
      const call = infoMock.mock.calls.find(args => typeof args[0] === 'string' && args[0].includes('HTTP server listening'));
      expect(call).toBeDefined();
    });
  });
});
