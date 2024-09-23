import { RedisClientType } from 'redis';
import { CacheProvider } from '../cache';

export function gerRedisCacheProvider(client: RedisClientType): CacheProvider {
  return {
    set: async (key: string, value: string, ttl?: number) => {
      await client.set(key, value, { EX: ttl });
    },
    get: async (key: string) => {
      return await client.get(key);
    },

    delete: async (key: string) => {
      await client.del(key);
    },
    deleteManyKeys: async (keys: string[]) => {
      await client.del(keys);
    },
    clear: async () => {
      await client.flushAll();
    },
    getAllKeys: async () => {
      return await client.keys('*');
    },
  };
}
