import { Context } from 'koa';

type RequestInfo = {
  ip: string | string[] | undefined;
  userAgent: {
    browser: string;
    os: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  acceptLanguage: string[];
  acceptEncoding: string[];
  host: string;
  protocol: string;
  url: string;
  secure: boolean;
};

export default function getRequestInfo(context: Context): RequestInfo {
  const request = context.request;
  const acptEnc = request.headers['accept-encoding'];
  let acceptEncoding: string[] = ['unknown'];
  if (typeof acptEnc === 'string') {
    acceptEncoding = acptEnc.split(',').map(e => e.trim());
  }

  return {
    ip: request.ip || request.ips || request.header['x-forwarded-for'] || request.socket.remoteAddress,
    userAgent: parseUserAgent(request.headers['user-agent']),
    acceptLanguage: request.headers['accept-language'] ? request.headers['accept-language'].split(',') : ['unknown'],
    acceptEncoding,
    host: request.headers['host'] || 'unknown',
    protocol: request.protocol || 'http',
    url: request.url || 'unknown',
    secure: request.secure || false,
  };
}

function parseUserAgent(ua: string | undefined) {
  if (!ua) {
    return {
      browser: 'unknown',
      os: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  }

  return {
    browser: getBrowser(ua),
    os: getOS(ua),
    isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua),
    isTablet: /Tablet|iPad/i.test(ua),
    isDesktop: !/Mobile|Android|iPhone|iPad|iPod|Tablet/i.test(ua),
  };
}

function getBrowser(ua: string): string {
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  return 'unknown';
}

function getOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS';
  if (ua.includes('Mac OS')) return 'MacOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'unknown';
}
