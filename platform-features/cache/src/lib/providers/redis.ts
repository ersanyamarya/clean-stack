import { RedisClientType } from 'redis';
import { CacheProvider } from '../cache';

/**
 * Creates a Redis-backed cache provider.
 * @param client Redis client instance
 */
export function getRedisCacheProvider(client: RedisClientType): CacheProvider {
  const setEntry = async (key: string, value: string, ttl?: number): Promise<void> => {
    if (ttl != null) {
      await client.set(key, value, { EX: ttl });
    } else {
      await client.set(key, value);
    }
  };

  return {
    set: setEntry,
    get: async (key: string) => {
      return await client.get(key);
    },

    delete: async (key: string): Promise<void> => {
      await client.del(key);
    },
    deleteManyKeys: async (keys: string[]): Promise<void> => {
      await client.del(keys);
    },
    clear: async (): Promise<void> => {
      await client.flushAll();
    },
    getAllKeys: () => client.keys('*'),
  };
}
