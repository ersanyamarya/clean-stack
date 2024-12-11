import { Context } from 'koa';
import { describe, expect, it } from 'vitest';
import getRequestInfo from './request-parser';

describe('Request Parser', () => {
  describe('getRequestInfo', () => {
    it('should parse basic request info', () => {
      const mockContext = createMockContext({
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9',
          'accept-encoding': 'gzip, deflate',
          host: 'localhost:3000',
        },
        url: '/test',
        protocol: 'https',
        secure: true,
      });

      const result = getRequestInfo(mockContext);

      expect(result).toEqual({
        ip: '127.0.0.1',
        userAgent: {
          browser: 'Chrome',
          os: 'MacOS',
          isMobile: false,
          isTablet: false,
          isDesktop: true,
        },
        acceptLanguage: ['en-US', 'en;q=0.9'],
        acceptEncoding: ['gzip', 'deflate'],
        host: 'localhost:3000',
        protocol: 'https',
        url: '/test',
        secure: true,
      });
    });

    it('should handle missing or undefined values', () => {
      const mockContext = createMockContext({});
      const result = getRequestInfo(mockContext);

      expect(result).toEqual({
        ip: undefined,
        userAgent: {
          browser: 'unknown',
          os: 'unknown',
          isMobile: false,
          isTablet: false,
          isDesktop: false,
        },
        acceptLanguage: ['unknown'],
        acceptEncoding: ['unknown'],
        host: 'unknown',
        protocol: 'http',
        url: 'unknown',
        secure: false,
      });
    });

    it('should detect different browsers correctly', () => {
      const browsers = [
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          expected: 'Chrome',
        },
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          expected: 'Firefox',
        },
        {
          ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
          expected: 'Safari',
        },
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
          expected: 'Edge',
        },
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.277',
          expected: 'Opera',
        },
        {
          ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          expected: 'unknown',
        },
      ];

      browsers.forEach(({ ua, expected }) => {
        const mockContext = createMockContext({
          headers: { 'user-agent': ua },
        });
        const result = getRequestInfo(mockContext);
        expect(result.userAgent.browser).toBe(expected);
      });
    });

    it('should detect different operating systems correctly', () => {
      const operatingSystems = [
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
          expected: 'Windows',
        },
        {
          ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/91.0.4472.124',
          expected: 'MacOS',
        },
        {
          ua: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/91.0.4472.124',
          expected: 'Linux',
        },
        {
          ua: 'Mozilla/5.0 (Linux; Android 10) Chrome/91.0.4472.124',
          expected: 'Android',
        },
        {
          ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Chrome/91.0.4472.124',
          expected: 'iOS',
        },
        {
          ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          expected: 'unknown',
        },
      ];

      operatingSystems.forEach(({ ua, expected }) => {
        const mockContext = createMockContext({
          headers: { 'user-agent': ua },
        });
        const result = getRequestInfo(mockContext);
        expect(result.userAgent.os).toBe(expected);
      });
    });

    it('should detect device types correctly', () => {
      const devices = [
        {
          ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Chrome/91.0.4472.124',
          expected: { isMobile: true, isTablet: false, isDesktop: false },
        },
        {
          ua: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) Chrome/91.0.4472.124',
          expected: { isMobile: true, isTablet: true, isDesktop: false },
        },
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
          expected: { isMobile: false, isTablet: false, isDesktop: true },
        },
      ];

      devices.forEach(({ ua, expected }) => {
        const mockContext = createMockContext({
          headers: { 'user-agent': ua },
        });
        const result = getRequestInfo(mockContext);
        expect(result.userAgent).toEqual(expect.objectContaining(expected));
      });
    });
  });
});

function createMockContext(
  options: Partial<{
    ip: string;
    headers: Record<string, string>;
    url: string;
    protocol: string;
    secure: boolean;
  }> = {}
): Context {
  return {
    request: {
      ip: options.ip,
      ips: undefined,
      header: options.headers || {},
      headers: options.headers || {},
      url: options.url,
      protocol: options.protocol,
      secure: options.secure,
      socket: {
        remoteAddress: undefined,
      },
    },
  } as unknown as Context;
}
