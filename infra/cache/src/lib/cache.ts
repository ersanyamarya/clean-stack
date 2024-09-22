/* eslint-disable security/detect-object-injection */
import { createHash } from 'crypto';
type CacheStats = {
  hits: number;
  misses: number;
  entries: number;
};

export type CacheProvider = {
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  // getManyKeys: (keys: string[]) => Promise<Record<string, string | null>>;
  delete: (key: string) => Promise<void>;
  deleteManyKeys: (keys: string[]) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
};

// make hash from key
export function computeHash(key: string): string {
  return createHash('md5').update(key).digest('hex');
}

export type CacheStore = {
  addOrReplace: (key: string, value: string, { ttl, groups }: { ttl?: number; groups?: string[] }) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  invalidateGroup: (group: string) => Promise<void>;
  clear: () => Promise<void>;
  stats: () => CacheStats;
  getAllKeys: () => Promise<string[]>;
};

/**
 * Creates a cache store with the provided cache provider.
 *
 * @param cacheProvider - The cache provider to use for storing cache entries.
 * @returns An object representing the cache store with methods to add, retrieve, invalidate, and clear cache entries.
 *
 * The returned cache store object includes the following methods:
 *
 * - `addOrReplace(key: string, value: string, options: { ttl?: number; groups?: string[] })`: Adds or replaces a cache entry with the specified key and value. Optionally, a TTL (time-to-live) and groups can be provided.
 * - `get(key: string)`: Retrieves the cache entry for the specified key. Returns `null` if the entry is not found.
 * - `invalidateGroup(group: string)`: Invalidates all cache entries associated with the specified group.
 * - `clear()`: Clears all cache entries.
 * - `stats()`: Returns the current cache statistics, including hits, misses, and entries.
 * - `getAllKeys()`: Returns an array of all cache keys.
 *
 * The cache store maintains statistics on cache hits, misses, and entries, and supports invalidation groups for managing related cache entries.
 */
export function createCacheStore(cacheProvider: CacheProvider): CacheStore {
  const stats: CacheStats = {
    hits: 0,
    misses: 0,
    entries: 0,
  };
  async function getInvalidationGroups(): Promise<Record<string, string[]>> {
    const groups = await cacheProvider.get('invalidationGroups');
    return groups ? JSON.parse(groups) : {};
  }

  const updateGroupsForKey = async (key: string, newGroups: string[]) => {
    const invalidationGroups = await getInvalidationGroups();
    for (const group in invalidationGroups) {
      if (invalidationGroups[group].includes(key) && !newGroups.includes(group)) {
        invalidationGroups[group] = invalidationGroups[group].filter(k => k !== key);
      }
    }

    // Add key to newGroups
    for (const group of newGroups) {
      if (!invalidationGroups[group]) {
        invalidationGroups[group] = [];
      }
      invalidationGroups[group].push(key);
    }
    await cacheProvider.set('invalidationGroups', JSON.stringify(invalidationGroups));
  };

  return {
    async addOrReplace(key: string, value: string, { ttl, groups }: { ttl?: number; groups?: string[] }) {
      const hashedKey = computeHash(key);
      await cacheProvider.set(hashedKey, value, ttl);
      if (groups) {
        await updateGroupsForKey(key, groups);
      }
      stats.entries++;
    },
    async get(key: string) {
      const hashedKey = computeHash(key);
      const cached = await cacheProvider.get(hashedKey);
      if (cached) {
        stats.hits++;
        return cached;
      }
      stats.misses++;
      return null;
    },
    async invalidateGroup(group: string) {
      const invalidationGroups = await getInvalidationGroups();
      const keys = invalidationGroups[group] ?? [];
      await cacheProvider.deleteManyKeys(keys.map(computeHash));
      delete invalidationGroups[group];
      for (const group in invalidationGroups) {
        invalidationGroups[group] = invalidationGroups[group].filter(k => !keys.includes(k));
      }
      await cacheProvider.set('invalidationGroups', JSON.stringify(invalidationGroups));

      stats.entries -= keys.length;
    },
    async clear() {
      await cacheProvider.clear();
      stats.entries = 0;
    },
    stats: () => stats,
    getAllKeys: async () => {
      return cacheProvider.getAllKeys();
    },
  };
}
