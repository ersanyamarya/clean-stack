import * as http2 from 'http';
import { AddressInfo, Socket } from 'net';
import { parse } from 'url';
type Protocol = 'http' | 'https';

const server = http2.createServer(async (req, res) => {
  const protocol: Protocol = (req.socket as any).encrypted ? 'https' : 'http';

  const baseURL = protocol === 'https' ? protocol + '://' + req.headers[':authority'] : protocol + '://' + req.headers.host;

  const { query, pathname, path } = parse(baseURL + req.url || '', true);

  const { headers, method } = req;
  const { 'content-type': contentType, cookie } = headers;

  const body = await getBody(req, contentType as string);
  const info = {
    path,
    pathname,
    baseURL,
    httpVersion: req.httpVersion,
    body,
    query,
    client: getClientInfo(headers as Record<string, string>, req.socket as Socket),
    contentType,
    cookies: extractCookies(cookie as string),
    AuthHeader: headers['authorization'] || '',
    DevTokenHeader: headers['dev-token'] || '',
    method,
  };

  //apply cors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  // set cookie
  res.setHeader('Set-Cookie', 'name=monkey; HttpOnly; Secure; SameSite=None');

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(info));
});

server.listen(3000, '0.0.0.0', () => {
  const serverHost: AddressInfo = server.address() as AddressInfo;
  console.log(`✅ Secure HTTP/2 server running at http://${serverHost?.address}:${serverHost?.port}/apple/monkey/?id=123&name=monkey&age=2500`);
});

const extractCookies = (cookieHeader: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  const cookieArray = cookieHeader.split('; ');
  for (const cookie of cookieArray) {
    const [key, value] = cookie.split('=');
    if (key && value) {
      cookies[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }
  return cookies;
};

const getClientInfo = (
  headers: Record<string, string | undefined>,
  socket: Socket
): {
  browser: string;
  os: string;
  ip: string;
  isMobile: boolean;
} => {
  const userAgent = headers['user-agent'] || '';

  const ip = headers['x-forwarded-for']?.toString().split(',')[0].trim() || headers['remoteAddress'] || socket.remoteAddress || '';

  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent);
  const browser = getBrowser(userAgent);
  const os = getOS(userAgent);

  return {
    browser,
    os,
    ip,
    isMobile,
  };
};

const getBrowser = (userAgent: string): string => {
  const browsers: { name: string; regex: RegExp }[] = [
    { name: 'Edge', regex: /Edg\// },
    { name: 'Opera', regex: /OPR\// },
    { name: 'Chrome', regex: /Chrome\// },
    { name: 'Safari', regex: /Safari\/(?!.*Chrome)/ },
    { name: 'Firefox', regex: /Firefox\// },
    { name: 'Internet Explorer', regex: /MSIE|Trident/ },
    { name: 'Curl', regex: /curl/ },
  ];
  for (const { name, regex } of browsers) {
    if (regex.test(userAgent)) return name;
  }
  return 'Unknown';
};

const getOS = (userAgent: string): string => {
  const osMap: { [key: string]: RegExp } = {
    Android: /Android/,
    iOS: /iPhone|iPad|iPod/,
    macOS: /Mac OS X/,
    Windows: /Windows NT/,
    Linux: /Linux/,
  };
  for (const [os, regex] of Object.entries(osMap)) {
    if (regex.test(userAgent)) return os;
  }
  return 'Unknown';
};
type ParsedBody = object | string | undefined;

async function getBody(req: http2.IncomingMessage, contentType = 'application/text'): Promise<ParsedBody> {
  return new Promise((resolve, reject) => {
    let rawData = '';
    req.on('data', chunk => {
      rawData += chunk;
    });
    req.on('end', () => {
      try {
        resolve(parseBody(rawData, contentType));
      } catch (err) {
        console.error('Error parsing request body:', err);
        reject(err);
      }
    });
    req.on('error', err => {
      console.error('Error reading request body:', err);
      reject(err);
    });
  });
}

function parseBody(rawData: string, contentType: string): ParsedBody {
  if (!rawData) {
    return undefined;
  }
  if (contentType.includes('application/json')) {
    return JSON.parse(rawData);
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return parseUrlEncoded(rawData);
  }
  if (contentType.startsWith('text/')) {
    return rawData;
  }
  if (contentType.startsWith('multipart/form-data')) {
    // For simplicity, just return raw data. For real parsing, use a library like 'busboy' or 'formidable'.
    return rawData;
  }
  return rawData;
}

function parseUrlEncoded(rawData: string): Record<string, string> {
  const params = new URLSearchParams(rawData);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}
