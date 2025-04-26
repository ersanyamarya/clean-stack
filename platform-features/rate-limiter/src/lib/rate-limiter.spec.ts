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

  describe('when under the request limit', () => {
    it('allows requests under the limit', async () => {
      // Arrange
      const key = 'user-1';

      // Act & Assert
      expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
      expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
    });
  });

  describe('when request count exceeds the limit', () => {
    it('blocks requests over the limit', async () => {
      // Arrange
      const key = 'user-2';

      // Act
      await rateLimiter.isAllowedRateLimit(key);
      await rateLimiter.isAllowedRateLimit(key);

      // Assert
      expect(await rateLimiter.isAllowedRateLimit(key)).toBe(false);
    });
  });

  describe('when duration has passed', () => {
    it('resets limit after duration', async () => {
      // Arrange
      vi.useFakeTimers();
      const key = 'user-3';

      // Act
      await rateLimiter.isAllowedRateLimit(key);
      await rateLimiter.isAllowedRateLimit(key);
      vi.advanceTimersByTime(60000);

      // Assert
      expect(await rateLimiter.isAllowedRateLimit(key)).toBe(true);
      vi.useRealTimers();
    });
  });
});
