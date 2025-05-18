import { IncomingMessage } from 'http';
import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';
import { getRequestBody } from './request-body';

function createMockReqWithBody(body: string | Buffer, opts: Partial<IncomingMessage> = {}): IncomingMessage {
  const stream = new Readable({
    read() {
      this.push(body);
      this.push(null);
    },
  });
  Object.assign(stream, opts);
  return stream as unknown as IncomingMessage;
}

describe('getRequestBody', () => {
  describe('when body is valid JSON', () => {
    it('returns parsed object from json()', async () => {
      // Arrange
      const obj = { foo: 'bar', n: 42 };
      const req = createMockReqWithBody(JSON.stringify(obj));
      const body = getRequestBody(req);
      // Act
      const result = await body.json<typeof obj>();
      // Assert
      expect(result).toEqual(obj);
    });
  });

  describe('when body is plain text', () => {
    it('returns text from text()', async () => {
      // Arrange
      const text = 'hello world';
      const req = createMockReqWithBody(text);
      const body = getRequestBody(req);
      // Act
      const result = await body.text();
      // Assert
      expect(result).toBe(text);
    });
  });

  describe('when body is a Buffer', () => {
    it('returns buffer from buffer()', async () => {
      // Arrange
      const buf = Buffer.from('buffered data');
      const req = createMockReqWithBody(buf);
      const body = getRequestBody(req);
      // Act
      const result = await body.buffer();
      // Assert
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('buffered data');
    });
  });

  describe('when body is invalid JSON', () => {
    it('throws error from json()', async () => {
      // Arrange
      const req = createMockReqWithBody('not-json');
      const body = getRequestBody(req);
      // Act & Assert
      await expect(body.json()).rejects.toThrow('Invalid JSON body');
    });
  });

  describe('when stream errors', () => {
    it('propagates error from buffer()', async () => {
      // Arrange
      const error = new Error('Stream error');
      const stream = new Readable({
        read() {
          this.emit('error', error);
        },
      });
      const req = stream as unknown as IncomingMessage;
      const body = getRequestBody(req);
      // Act & Assert
      await expect(body.buffer()).rejects.toThrow('Stream error');
    });
  });

  describe('when body is empty', () => {
    it('returns empty string from text()', async () => {
      // Arrange
      const req = createMockReqWithBody('');
      const body = getRequestBody(req);
      // Act
      const result = await body.text();
      // Assert
      expect(result).toBe('');
    });
    it('returns empty buffer from buffer()', async () => {
      // Arrange
      const req = createMockReqWithBody(Buffer.alloc(0));
      const body = getRequestBody(req);
      // Act
      const result = await body.buffer();
      // Assert
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });
  });
});
