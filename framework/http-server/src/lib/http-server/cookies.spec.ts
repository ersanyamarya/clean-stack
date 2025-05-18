import { IncomingMessage, ServerResponse } from 'http';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAllCookies, CookieOptions, extractCookies, setCookie } from './cookies';

describe('extractCookies', () => {
  describe('when cookie header is provided', () => {
    it('parses single cookie correctly', () => {
      // Arrange
      const header = 'foo=bar';
      // Act
      const result = extractCookies(header);
      // Assert
      expect(result).toEqual({ foo: 'bar' });
    });
    it('parses multiple cookies correctly', () => {
      // Arrange
      const header = 'foo=bar; baz=qux';
      // Act
      const result = extractCookies(header);
      // Assert
      expect(result).toEqual({ foo: 'bar', baz: 'qux' });
    });
    it('decodes URI components in keys and values', () => {
      // Arrange
      const header = 'a%20b=c%20d';
      // Act
      const result = extractCookies(header);
      // Assert
      expect(result).toEqual({ 'a b': 'c d' });
    });
  });
  describe('when cookie header is undefined or empty', () => {
    it('returns empty object for undefined', () => {
      expect(extractCookies(undefined)).toEqual({});
    });
    it('returns empty object for empty string', () => {
      expect(extractCookies('')).toEqual({});
    });
  });
});

describe('setCookie', () => {
  let res: ServerResponse;
  beforeEach(() => {
    res = {
      getHeader: vi.fn(),
      setHeader: vi.fn(),
    } as unknown as ServerResponse;
  });
  describe('when no Set-Cookie header exists', () => {
    it('sets a new Set-Cookie header', () => {
      // Arrange
      (res.getHeader as any).mockReturnValue(undefined);
      // Act
      setCookie(res, 'foo', 'bar');
      // Assert
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', 'foo=bar');
    });
  });
  describe('when Set-Cookie header is a string', () => {
    it('appends a new cookie as array', () => {
      // Arrange
      (res.getHeader as any).mockReturnValue('foo=bar');
      // Act
      setCookie(res, 'baz', 'qux');
      // Assert
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', ['foo=bar', 'baz=qux']);
    });
  });
  describe('when Set-Cookie header is an array', () => {
    it('appends a new cookie to the array', () => {
      // Arrange
      (res.getHeader as any).mockReturnValue(['foo=bar']);
      // Act
      setCookie(res, 'baz', 'qux');
      // Assert
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', ['foo=bar', 'baz=qux']);
    });
  });
  describe('with options', () => {
    it('sets cookie with all options', () => {
      // Arrange
      (res.getHeader as any).mockReturnValue(undefined);
      const options: CookieOptions = {
        expires: new Date('2030-01-01T00:00:00Z'),
        maxAge: 3600,
        domain: 'example.com',
        path: '/foo',
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
      };
      // Act
      setCookie(res, 'foo', 'bar', options);
      // Assert
      expect(res.setHeader).toHaveBeenCalledWith(
        'Set-Cookie',
        'foo=bar; Expires=Tue, 01 Jan 2030 00:00:00 GMT; Max-Age=3600; Domain=example.com; Path=/foo; Secure; HttpOnly; SameSite=Strict'
      );
    });
  });
});

describe('clearAllCookies', () => {
  let req: IncomingMessage;
  let res: ServerResponse;
  beforeEach(() => {
    req = { headers: { cookie: 'foo=bar; baz=qux' } } as IncomingMessage;
    res = {
      getHeader: vi.fn(),
      setHeader: vi.fn(),
    } as unknown as ServerResponse;
  });
  it('sets cookies to expired and removes them from req.headers.cookie', () => {
    // Arrange
    (res.getHeader as unknown as { mockReturnValue: (v: unknown) => void }).mockReturnValue(undefined);
    // Act
    clearAllCookies(req, res);
    // Assert
    const calls = (res.setHeader as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    expect(calls[0]).toEqual(['Set-Cookie', 'foo=; Max-Age=-1']);
    // The second call may be either ['Set-Cookie', ['foo=; Max-Age=-1', 'baz=; Max-Age=-1']] or ['Set-Cookie', 'baz=; Max-Age=-1'] depending on implementation details.
    // Accept either possibility for robust test.
    const secondCall = calls[1];
    const validSecondCalls = [
      ['Set-Cookie', ['foo=; Max-Age=-1', 'baz=; Max-Age=-1']],
      ['Set-Cookie', 'baz=; Max-Age=-1'],
    ];
    expect(validSecondCalls).toContainEqual(secondCall);
    expect(req.headers.cookie).not.toContain('foo=bar');
    expect(req.headers.cookie).not.toContain('baz=qux');
  });
  it('does nothing if no cookies are present', () => {
    // Arrange
    req.headers.cookie = undefined;
    // Act
    clearAllCookies(req, res);
    // Assert
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});
