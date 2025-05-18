export type Client = {
  browser: string;
  os: string;
  ip: string;
  isMobile: boolean;
};

/**
 * Extracts client information from HTTP headers and socket.
 * @param headers - HTTP request headers
 * @param socket - Socket object with remoteAddress
 * @returns Client info (browser, os, ip, isMobile)
 */
export function getClientInfo(headers: Record<string, string | undefined>, socket: { remoteAddress?: string | null }): Client {
  const userAgent = headers['user-agent'] ?? '';
  const ip = extractIp(headers, socket);
  return {
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    ip,
    isMobile: isMobileUserAgent(userAgent),
  };
}

const extractIp = (headers: Record<string, string | undefined>, socket: { remoteAddress?: string | null }): string => {
  const forwarded = headers['x-forwarded-for']?.toString().split(',')[0].trim();
  return forwarded || headers['remoteAddress'] || socket.remoteAddress || '';
};

const isMobileUserAgent = (userAgent: string): boolean => /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent);

const BROWSER_REGEXES = [
  { name: 'Edge', regex: /Edg\// },
  { name: 'Opera', regex: /OPR\// },
  { name: 'Chrome', regex: /Chrome\// },
  { name: 'Safari', regex: /Safari\/(?!.*Chrome)/ },
  { name: 'Firefox', regex: /Firefox\// },
  { name: 'Internet Explorer', regex: /MSIE|Trident/ },
  { name: 'Curl', regex: /curl/ },
] as const;

const detectBrowser = (userAgent: string): string => BROWSER_REGEXES.find(({ regex }) => regex.test(userAgent))?.name ?? 'Unknown';

const OS_REGEXES = [
  { name: 'Android', regex: /Android/ },
  { name: 'iOS', regex: /iPhone|iPad|iPod/ },
  { name: 'macOS', regex: /Mac OS X/ },
  { name: 'Windows', regex: /Windows NT/ },
  { name: 'Linux', regex: /Linux/ },
] as const;

const detectOs = (userAgent: string): string => OS_REGEXES.find(({ regex }) => regex.test(userAgent))?.name ?? 'Unknown';
