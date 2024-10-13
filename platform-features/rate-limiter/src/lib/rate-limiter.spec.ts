import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRateLimiter, RateLimiterProvider } from './rate-limiter';

describe('RateLimiter', () => {
  let mockProvider: RateLimiterProvider;
  let rateLimiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    const store = new Map<string, { value: string; expiresAt: number }>();
    mockProvider = {
      set: vi.fn((key: string, value: string, ttl?: number) => {
        const expiresAt = ttl ? Date.now() + ttl * 1000 : Infinity;
        store.set(key, { value, expiresAt });
        return Promise.resolve();
      }),
      get: vi.fn((key: string) => {
        const entry = store.get(key);
        if (entry && entry.expiresAt > Date.now()) {
          return Promise.resolve(entry.value);
        }
        store.delete(key);
        return Promise.resolve(null);
      }),
    };
    rateLimiter = createRateLimiter(mockProvider, { maxRequests: 2, duration: 60 });
  });

  it('should allow requests under the limit', async () => {
    const key = 'user-1';
    expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
    expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
  });

  it('should block requests over the limit', async () => {
    const key = 'user-2';
    await rateLimiter.isAllowedRateLimit(key);
    await rateLimiter.isAllowedRateLimit(key);
    expect(await rateLimiter.isAllowedRateLimit(key)).toBe(false);
  });

  it('should reset the limit after the duration', async () => {
    vi.useFakeTimers();
    const key = 'user-3';
    await rateLimiter.isAllowedRateLimit(key);
    await rateLimiter.isAllowedRateLimit(key);
    vi.advanceTimersByTime(60000); // Advance time by 60 seconds
    expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
    vi.useRealTimers();
  });
});
