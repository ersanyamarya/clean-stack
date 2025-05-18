import { IncomingMessage, ServerResponse } from 'http';

/**
 * Extracts cookies from a cookie header string.
 * @param cookieHeader The raw Cookie header string from the request.
 * @returns A record of cookie key-value pairs.
 */
export function extractCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split('; ').reduce(
    (cookies, cookie) => {
      const [key, value] = cookie.split('=');
      if (key && value) {
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return cookies;
    },
    {} as Record<string, string>
  );
}

/**
 * Options for setting cookies.
 */
export interface CookieOptions {
  /**
   * Expiry date of the cookie.
   */
  expires?: Date;
  /**
   * Max-Age of the cookie in seconds.
   */
  maxAge?: number;
  /**
   * Domain for which the cookie is valid.
   */
  domain?: string;
  /**
   * Path for which the cookie is valid.
   */
  path?: string;
  /**
   * Whether the cookie is only sent over HTTPS.
   */
  secure?: boolean;
  /**
   * Whether the cookie is inaccessible to JavaScript (HttpOnly).
   */
  httpOnly?: boolean;
  /**
   * SameSite attribute for the cookie.
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Sets a cookie header on the response.
 * Supports multiple Set-Cookie headers.
 * @param res The HTTP server response object.
 * @param name The cookie name.
 * @param value The cookie value.
 * @param options Optional cookie attributes.
 */
export function setCookie(res: ServerResponse, name: string, value: string, options: CookieOptions = {}): void {
  const cookieParts = buildCookieParts(name, value, options);
  const newCookie = cookieParts.join('; ');
  const existing = res.getHeader('Set-Cookie');

  if (!existing) {
    res.setHeader('Set-Cookie', newCookie);
    return;
  }
  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, newCookie]);
    return;
  }
  res.setHeader('Set-Cookie', [existing as string, newCookie]);
}

/**
 * Builds the parts of a Set-Cookie header value.
 * @param name The cookie name.
 * @param value The cookie value.
 * @param options Cookie options.
 * @returns An array of cookie parts.
 */
function buildCookieParts(name: string, value: string, options: CookieOptions): string[] {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.secure) parts.push('Secure');
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts;
}

export function clearAllCookies(req: IncomingMessage, res: ServerResponse): void {
  const cookies = extractCookies(req.headers.cookie);
  if (!cookies) return;
  Object.keys(cookies).forEach(cookieName => {
    setCookie(res, cookieName, '', { maxAge: -1 });
    // Escape cookieName for use in RegExp
    const escapedName = cookieName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    // eslint-disable-next-line security/detect-non-literal-regexp
    const pattern = new RegExp(`(^|;\\s*)${escapedName}=[^;]*`);
    req.headers.cookie = req.headers.cookie?.replace(pattern, '');
  });
}
