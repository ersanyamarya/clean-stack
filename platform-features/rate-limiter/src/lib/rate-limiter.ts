import { createHash } from 'crypto';

export type RateLimiterProvider = {
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  get: (key: string) => Promise<string | null>;
};

/**
 * Generates an MD5 hash of the provided key string.
 * @param key - The input string to hash.
 * @returns The hexadecimal representation of the MD5 hash.
 */
export function computeHash(key: string): string {
  return createHash('md5').update(key).digest('hex');
}

export type RateLimiter = {
  /**
   * Checks if a request under the given key is allowed based on configured limits.
   * @param key - Unique identifier for rate limiting (e.g., user ID, IP address).
   * @returns True if request is within allowed rate, false if rate limit is exceeded.
   */
  isAllowedRateLimit: (key: string) => Promise<boolean>;
};

export function createRateLimiter(rateLimiterProvider: RateLimiterProvider, options: Readonly<{ maxRequests: number; duration: number }>): RateLimiter {
  const { maxRequests, duration } = options;

  async function isAllowedRateLimit(key: string): Promise<boolean> {
    const rawKey = `rate-limiter:${key}`;
    const hashedKey = computeHash(rawKey);
    const value = await rateLimiterProvider.get(hashedKey);
    const currentCount = parseInt(value ?? '0', 10);
    if (currentCount >= maxRequests) {
      return false;
    }
    // increment count and set TTL in seconds
    await rateLimiterProvider.set(hashedKey, String(currentCount + 1), duration);
    return true;
  }

  return { isAllowedRateLimit };
}
