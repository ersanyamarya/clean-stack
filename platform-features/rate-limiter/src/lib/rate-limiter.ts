import { createHash } from 'crypto';

export type RateLimiterProvider = {
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  get: (key: string) => Promise<string | null>;
};

export function computeHash(key: string): string {
  return createHash('md5').update(key).digest('hex');
}

export type RateLimiter = {
  isAllowedRateLimit: (key: string) => Promise<boolean>;
};

export function createRateLimiter(rateLimiterProvider: RateLimiterProvider, options: { maxRequests: number; duration: number }): RateLimiter {
  async function isAllowedRateLimit(key: string): Promise<boolean> {
    const rateLimiterKey = `rate-limiter:${key}`;
    const hashedKey = computeHash(rateLimiterKey);
    const rateLimiterData = Number(await rateLimiterProvider.get(hashedKey));
    if (rateLimiterData >= options.maxRequests) {
      return false;
    }
    await rateLimiterProvider.set(hashedKey, String(rateLimiterData + 1), options.duration);
    return true;
  }
  return {
    isAllowedRateLimit,
  };
}
