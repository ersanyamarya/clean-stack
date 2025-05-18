// Unit tests for meta-data.ts using Vitest

import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Socket } from 'net';
import { describe, expect, it } from 'vitest';
import { ALLOWED_METHODS, extractRequestMeta } from './meta-data';

function createMockSocket(opts: Partial<Socket & { encrypted?: boolean; remoteAddress?: string | undefined }> = {}): Socket {
  // Provide required Socket methods as no-ops (non-empty for lint)
  const base: Partial<Socket> = {
    destroySoon: () => {
      return undefined;
    },
    write: () => true,
    connect: () => base as Socket,
    setEncoding: () => base as Socket,
  };
  return Object.assign(base, opts) as Socket;
}

function createMockReq(options: Partial<IncomingMessage & { headers: IncomingHttpHeaders; socket: Partial<Socket> }> = {}): IncomingMessage {
  return {
    url: '/test?foo=bar',
    method: 'POST',
    headers: {
      host: 'localhost:3000',
      'content-type': 'application/json',
      cookie: 'session=abc',
      authorization: 'Bearer token',
      'dev-token': 'dev123',
      origin: 'http://localhost:3000',
      ...options.headers,
    },
    socket: createMockSocket({ encrypted: false, remoteAddress: '127.0.0.1', ...options.socket }),
    httpVersion: '1.1',
    ...options,
  } as unknown as IncomingMessage;
}

describe('extractRequestMeta', () => {
  describe('when request is HTTP', () => {
    it('returns correct meta-data for a typical HTTP request', () => {
      // Arrange
      const req = createMockReq();
      // Act
      const meta = extractRequestMeta(req);
      // Assert
      expect(meta.protocol).toBe('http');
      expect(meta.baseURL).toBe('http://localhost:3000');
      expect(meta.query).toEqual({ foo: 'bar' });
      expect(meta.path).toBe('/test?foo=bar');
      expect(meta.pathname).toBe('/test');
      expect(meta.headers.host).toBe('localhost:3000');
      expect(meta.contentType).toBe('application/json');
      expect(meta.cookie).toBe('session=abc');
      expect(meta.method).toBe('POST');
      expect(meta.allowedMethodsString).toBe(ALLOWED_METHODS.join(', '));
      expect(meta.origin).toBe('http://localhost:3000');
      expect(meta.httpVersion).toBe('1.1');
      expect(meta.AuthToken).toBe('Bearer token');
      expect(meta.DevToken).toBe('dev123');
      expect(meta.client).toBeDefined();
    });
  });

  describe('when request is HTTPS', () => {
    it('sets protocol to https and uses :authority header', () => {
      // Arrange
      const req = createMockReq({
        socket: createMockSocket({ encrypted: true }),
        headers: { ':authority': 'securehost:443', host: undefined },
      });
      // Act
      const meta = extractRequestMeta(req);
      // Assert
      expect(meta.protocol).toBe('https');
      expect(meta.baseURL).toBe('https://securehost:443');
    });
  });

  describe('when headers are missing or minimal', () => {
    it('handles missing headers gracefully', () => {
      // Arrange
      const req = createMockReq({ headers: {} });
      // Act
      const meta = extractRequestMeta(req);
      // Assert
      expect(meta.headers).toBeDefined();
      expect(meta.contentType).toBeUndefined();
      expect(meta.cookie).toBeUndefined();
      expect(meta.AuthToken).toBe('');
      expect(meta.DevToken).toBe('');
    });
  });

  describe('when method is missing', () => {
    it('defaults method to GET', () => {
      // Arrange
      const req = createMockReq({ method: undefined });
      // Act
      const meta = extractRequestMeta(req);
      // Assert
      expect(meta.method).toBe('GET');
    });
  });

  describe('when socket has no remoteAddress', () => {
    it('origin falls back to unknown', () => {
      // Arrange
      const req = createMockReq({
        headers: {},
        socket: createMockSocket({ remoteAddress: undefined }),
      });
      // Act
      const meta = extractRequestMeta(req);
      // Assert
      expect(meta.origin).toBe('unknown');
    });
  });
});
