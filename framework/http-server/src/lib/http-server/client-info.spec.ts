import { describe, expect, it } from 'vitest';
import { getClientInfo } from './client-info';

// Helper to create headers and socket
const makeHeaders = (userAgent?: string, forwarded?: string, remoteAddress?: string) => {
  const headers: Record<string, string | undefined> = {};
  if (userAgent) headers['user-agent'] = userAgent;
  if (forwarded) headers['x-forwarded-for'] = forwarded;
  if (remoteAddress) headers['remoteAddress'] = remoteAddress;
  return headers;
};

describe('getClientInfo', () => {
  describe('when user-agent is present', () => {
    it('returns correct browser, os, ip, and isMobile for Chrome on Android', () => {
      const headers = makeHeaders('Mozilla/5.0 (Linux; Android 10; Chrome/90.0.4430.91)');
      const socket = { remoteAddress: '1.2.3.4' };
      const info = getClientInfo(headers, socket);
      expect(info.browser).toBe('Chrome');
      expect(info.os).toBe('Android');
      expect(info.ip).toBe('1.2.3.4');
      expect(info.isMobile).toBe(true);
    });

    it('returns correct browser, os, ip, and isMobile for Safari on iPhone', () => {
      const headers = makeHeaders(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1'
      );
      const socket = { remoteAddress: '5.6.7.8' };
      const info = getClientInfo(headers, socket);
      expect(info.browser).toBe('Safari');
      expect(info.os).toBe('iOS');
      expect(info.ip).toBe('5.6.7.8');
      expect(info.isMobile).toBe(true);
    });

    it('returns correct browser, os, ip, and isMobile for Firefox on Windows', () => {
      const headers = makeHeaders('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0');
      const socket = { remoteAddress: '9.8.7.6' };
      const info = getClientInfo(headers, socket);
      expect(info.browser).toBe('Firefox');
      expect(info.os).toBe('Windows');
      expect(info.ip).toBe('9.8.7.6');
      expect(info.isMobile).toBe(false);
    });

    it('returns correct browser for Curl', () => {
      const headers = makeHeaders('curl/7.64.1');
      const socket = { remoteAddress: '127.0.0.1' };
      const info = getClientInfo(headers, socket);
      expect(info.browser).toBe('Curl');
      expect(info.os).toBe('Unknown');
      expect(info.isMobile).toBe(false);
    });
  });

  describe('when x-forwarded-for is present', () => {
    it('extracts the first IP from x-forwarded-for', () => {
      const headers = makeHeaders('Mozilla/5.0', '10.0.0.1, 10.0.0.2');
      const socket = { remoteAddress: '192.168.1.1' };
      const info = getClientInfo(headers, socket);
      expect(info.ip).toBe('10.0.0.1');
    });
  });

  describe('when no user-agent is present', () => {
    it('returns Unknown for browser and os', () => {
      const headers = makeHeaders();
      const socket = { remoteAddress: '8.8.8.8' };
      const info = getClientInfo(headers, socket);
      expect(info.browser).toBe('Unknown');
      expect(info.os).toBe('Unknown');
      expect(info.isMobile).toBe(false);
    });
  });

  describe('when no IP is present', () => {
    it('returns empty string for ip', () => {
      const headers = makeHeaders();
      const socket = { remoteAddress: undefined };
      const info = getClientInfo(headers, socket);
      expect(info.ip).toBe('');
    });
  });
});
