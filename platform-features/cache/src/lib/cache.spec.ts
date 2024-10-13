/* eslint-disable security/detect-object-injection */
import { beforeEach, describe, expect, it } from 'vitest';
import { CacheStore, computeHash, createCacheStore } from './cache';

const mockCacheProvider = () => {
  const store: Record<string, string> = {};
  return {
    set: async (key: string, value: string) => {
      store[key] = value;
    },
    get: async (key: string) => {
      return store[key] || null;
    },
    delete: async (key: string) => {
      delete store[key];
    },
    deleteManyKeys: async (keys: string[]) => {
      keys.forEach(key => {
        delete store[key];
      });
    },
    clear: async () => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    },
    getAllKeys: async () => {
      return Object.keys(store);
    },
  };
};

describe('createCacheStore', () => {
  let cacheStore: CacheStore;
  let cacheProvider: ReturnType<typeof mockCacheProvider>;

  beforeEach(() => {
    cacheProvider = mockCacheProvider();
    cacheStore = createCacheStore(cacheProvider);
  });

  describe('addOrReplace', () => {
    it('should add a cache entry', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      const value = await cacheStore.get('key1');
      expect(value).toBe('value1');
    });

    it('should replace an existing cache entry', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      await cacheStore.addOrReplace('key1', 'value2', {});
      const value = await cacheStore.get('key1');
      expect(value).toBe('value2');
    });

    it('should update invalidation groups', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key2', 'value2', { groups: ['group1'] });
      await cacheStore.invalidateGroup('group1');
      const value1 = await cacheStore.get('key1');
      const value2 = await cacheStore.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });
  });

  describe('get', () => {
    it('should retrieve a cache entry', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      const value = await cacheStore.get('key1');
      expect(value).toBe('value1');
    });

    it('should return null for a non-existent cache entry', async () => {
      const value = await cacheStore.get('nonExistentKey');
      expect(value).toBeNull();
    });

    it('should increment hits and misses correctly', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      await cacheStore.get('key1'); // hit
      await cacheStore.get('key2'); // miss
      const stats = cacheStore.stats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });
  });

  describe('invalidateGroup', () => {
    it('should invalidate a group of cache entries', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key2', 'value2', { groups: ['group1'] });
      await cacheStore.invalidateGroup('group1');
      const value1 = await cacheStore.get('key1');
      const value2 = await cacheStore.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      await cacheStore.addOrReplace('key2', 'value2', {});
      await cacheStore.clear();
      const value1 = await cacheStore.get('key1');
      const value2 = await cacheStore.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });
  });

  describe('stats', () => {
    it('should update cache statistics correctly', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      await cacheStore.addOrReplace('key2', 'value2', {});
      const stats = cacheStore.stats();
      expect(stats.entries).toBe(2);
    });
  });

  describe('getAllKeys', () => {
    it('should return all cache keys', async () => {
      await cacheStore.addOrReplace('key1', 'value1', {});
      await cacheStore.addOrReplace('key2', 'value2', {});
      const keys = await cacheStore.getAllKeys();
      expect(keys).toContain(computeHash('key1'));
      expect(keys).toContain(computeHash('key2'));
    });
  });
  describe('updateGroupsForKey', () => {
    it('should add key to new groups', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      const invalidationGroups = await cacheProvider.get('invalidationGroups');

      if (!invalidationGroups) {
        return;
      }
      const parsedGroups = JSON.parse(invalidationGroups);
      expect(parsedGroups['group1']).toContain(computeHash('key1'));
    });

    it('should remove key from old groups if not in new groups', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key1', 'value2', { groups: ['group2'] });
      const invalidationGroups = await cacheProvider.get('invalidationGroups');
      if (!invalidationGroups) {
        return;
      }
      const parsedGroups = JSON.parse(invalidationGroups);
      expect(parsedGroups['group1']).not.toContain(computeHash('key1'));
      expect(parsedGroups['group2']).toContain(computeHash('key1'));
    });

    it('should handle keys in multiple groups correctly', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1', 'group2'] });
      const invalidationGroups = await cacheProvider.get('invalidationGroups');
      if (!invalidationGroups) {
        return;
      }
      const parsedGroups = JSON.parse(invalidationGroups);
      expect(parsedGroups['group1']).toContain(computeHash('key1'));
      expect(parsedGroups['group2']).toContain(computeHash('key1'));
    });

    it('should not modify groups if no groups are provided', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key1', 'value2', {});
      const invalidationGroups = await cacheProvider.get('invalidationGroups');

      if (!invalidationGroups) {
        return;
      }
      const parsedGroups = JSON.parse(invalidationGroups);
      expect(parsedGroups['group1']).toContain(computeHash('key1'));
    });
  });
  describe('invalidateGroup', () => {
    it('should invalidate a group of cache entries', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key2', 'value2', { groups: ['group1'] });
      await cacheStore.invalidateGroup('group1');
      const value1 = await cacheStore.get('key1');
      const value2 = await cacheStore.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });

    it('should remove keys from other groups when invalidating a group', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1', 'group2'] });
      await cacheStore.addOrReplace('key2', 'value2', { groups: ['group1'] });
      await cacheStore.invalidateGroup('group1');
      const invalidationGroups = await cacheProvider.get('invalidationGroups');
      if (!invalidationGroups) {
        return;
      }
      const parsedGroups = JSON.parse(invalidationGroups);
      expect(parsedGroups['group1']).toBeUndefined();
      expect(parsedGroups['group2']).not.toContain('key1');
    });

    it('should update the stats correctly after invalidating a group', async () => {
      await cacheStore.addOrReplace('key1', 'value1', { groups: ['group1'] });
      await cacheStore.addOrReplace('key2', 'value2', { groups: ['group1'] });
      await cacheStore.invalidateGroup('group1');
      const stats = cacheStore.stats();
      expect(stats.entries).toBe(0);
    });

    it('should handle invalidating a non-existent group gracefully', async () => {
      await cacheStore.invalidateGroup('nonExistentGroup');
      const stats = cacheStore.stats();
      expect(stats.entries).toBe(0);
    });
  });
});
