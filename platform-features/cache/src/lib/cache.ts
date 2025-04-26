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
  delete: (key: string) => Promise<void>;
  deleteManyKeys: (keys: string[]) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
};

/**
 * MD5 hash function for cache keys.
 * @param key - The original cache key.
 * @returns The hashed key string.
 */
export function computeHash(key: string): string {
  return createHash('md5').update(key).digest('hex');
}

type InvalidationGroups = Record<string, string[]>;

/**
 * Removes duplicate entries from an array of strings.
 * @param items - Array of strings.
 * @returns Array with unique values.
 */
function removeDuplicates(items: string[]): string[] {
  return [...new Set(items)];
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
  const stats: CacheStats = { hits: 0, misses: 0, entries: 0 };

  async function loadGroups(): Promise<InvalidationGroups> {
    const data = await cacheProvider.get('invalidationGroups');
    return data ? JSON.parse(data) : {};
  }

  async function saveGroups(groups: InvalidationGroups): Promise<void> {
    await cacheProvider.set('invalidationGroups', JSON.stringify(groups));
  }

  async function updateGroupsForKey(key: string, newGroups: string[]): Promise<void> {
    const groupsMap = await loadGroups();
    // Remove key from groups no longer applicable
    const cleaned = Object.fromEntries(
      Object.entries(groupsMap).map(([grp, keys]) => [grp, newGroups.includes(grp) ? keys : keys.filter(k => k !== key)])
    ) as InvalidationGroups;
    // Add key to each new group
    newGroups.forEach(grp => {
      cleaned[grp] = removeDuplicates([...(cleaned[grp] ?? []), key]);
    });
    await saveGroups(cleaned);
  }

  return {
    async addOrReplace(key, value, { ttl, groups } = {}) {
      const hashed = computeHash(key);
      const existing = await cacheProvider.get(hashed);
      await cacheProvider.set(hashed, value, ttl);
      if (groups?.length) await updateGroupsForKey(hashed, groups);
      // Increment entry count only for new keys
      if (existing === null) stats.entries++;
    },
    async get(key) {
      const hashed = computeHash(key);
      const result = await cacheProvider.get(hashed);
      if (result !== null) {
        stats.hits++;
        return result;
      }
      stats.misses++;
      return null;
    },
    async invalidateGroup(group) {
      const groupsMap = await loadGroups();
      const toDelete = groupsMap[group] ?? [];
      if (toDelete.length) {
        await cacheProvider.deleteManyKeys(toDelete);
        delete groupsMap[group];
        // Clean remaining groups
        const updated = Object.fromEntries(
          Object.entries(groupsMap).map(([grp, keys]) => [grp, keys.filter(k => !toDelete.includes(k))])
        ) as InvalidationGroups;
        await saveGroups(updated);
        stats.entries = Math.max(0, stats.entries - toDelete.length);
      }
    },
    async clear() {
      await cacheProvider.clear();
      stats.entries = 0;
    },
    stats: () => ({ ...stats }),
    getAllKeys: () => cacheProvider.getAllKeys(),
  };
}
