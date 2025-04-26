import { beforeEach, describe, expect, it } from 'vitest';
import { CacheProvider, CacheStore, computeHash, createCacheStore } from './cache';

function createMockCacheProvider(): CacheProvider {
  const store = new Map<string, string>();
  return {
    set: async (key, value) => {
      store.set(key, value);
    },
    get: async key => store.get(key) ?? null,
    delete: async key => {
      store.delete(key);
    },
    deleteManyKeys: async keys => {
      keys.forEach(k => store.delete(k));
    },
    clear: async () => {
      store.clear();
    },
    getAllKeys: async () => Array.from(store.keys()),
  };
}

describe('CacheStore', () => {
  let cacheProvider: CacheProvider;
  let cacheStore: CacheStore;

  beforeEach(() => {
    cacheProvider = createMockCacheProvider();
    cacheStore = createCacheStore(cacheProvider);
  });

  describe('addOrReplace', () => {
    it('adds a new cache entry and increments entries count', async () => {
      // Arrange
      const key = 'item1';
      const value = 'value1';

      // Act
      await cacheStore.addOrReplace(key, value, {});

      // Assert
      const stored = await cacheProvider.get(computeHash(key));
      expect(stored).toBe(value);
      expect(cacheStore.stats().entries).toBe(1);
    });

    it('replaces existing entry without changing entries count', async () => {
      // Arrange
      const key = 'item1';
      await cacheStore.addOrReplace(key, 'value1', {});

      // Act
      await cacheStore.addOrReplace(key, 'value2', {});

      // Assert
      const stored = await cacheProvider.get(computeHash(key));
      expect(stored).toBe('value2');
      expect(cacheStore.stats().entries).toBe(1);
    });
  });

  describe('get', () => {
    it('retrieves existing entry and increments hits', async () => {
      // Arrange
      const key = 'item1';
      await cacheStore.addOrReplace(key, 'value1', {});

      // Act
      const result = await cacheStore.get(key);

      // Assert
      expect(result).toBe('value1');
      expect(cacheStore.stats().hits).toBe(1);
    });

    it('returns null for missing key and increments misses', async () => {
      // Act
      const result = await cacheStore.get('unknown');

      // Assert
      expect(result).toBeNull();
      expect(cacheStore.stats().misses).toBe(1);
    });
  });

  describe('invalidateGroup', () => {
    it('invalidates all entries in a group and updates entries count', async () => {
      // Arrange
      const key1 = 'k1';
      const key2 = 'k2';
      await cacheStore.addOrReplace(key1, 'v1', { groups: ['grp'] });
      await cacheStore.addOrReplace(key2, 'v2', { groups: ['grp'] });
      expect(cacheStore.stats().entries).toBe(2);

      // Act
      await cacheStore.invalidateGroup('grp');

      // Assert
      expect(await cacheStore.get(key1)).toBeNull();
      expect(await cacheStore.get(key2)).toBeNull();
      expect(cacheStore.stats().entries).toBe(0);
    });

    it('does nothing when invalidating a non-existent group', async () => {
      // Act
      await cacheStore.invalidateGroup('nope');

      // Assert
      expect(cacheStore.stats().entries).toBe(0);
    });
  });

  describe('clear', () => {
    it('clears all entries and resets entries count', async () => {
      // Arrange
      await cacheStore.addOrReplace('a', '1', {});
      await cacheStore.addOrReplace('b', '2', {});
      expect(cacheStore.stats().entries).toBe(2);

      // Act
      await cacheStore.clear();

      // Assert
      expect(cacheStore.stats().entries).toBe(0);
      expect(await cacheStore.get('a')).toBeNull();
      expect(await cacheStore.get('b')).toBeNull();
    });
  });

  describe('stats', () => {
    it('reports correct hits, misses, and entries counts', async () => {
      // Arrange
      await cacheStore.addOrReplace('x', '1', {});
      await cacheStore.get('x');
      await cacheStore.get('y');

      // Act
      const stats = cacheStore.stats();

      // Assert
      expect(stats.entries).toBe(1);
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });
  });

  describe('getAllKeys', () => {
    it('returns all hashed keys stored in the cache', async () => {
      // Arrange
      const keys = ['a', 'b'];
      for (const k of keys) {
        await cacheStore.addOrReplace(k, 'v', {});
      }

      // Act
      const allKeys = await cacheStore.getAllKeys();

      // Assert
      expect(allKeys).toEqual(expect.arrayContaining(keys.map(computeHash)));
    });
  });

  describe('group management', () => {
    const parseGroups = (raw: string | null) => {
      if (!raw) return new Map<string, string[]>();
      try {
        const parsed = JSON.parse(raw) as Record<string, string[]>;
        return new Map(Object.entries(parsed));
      } catch {
        return new Map<string, string[]>();
      }
    };

    it('adds key to specified groups', async () => {
      // Arrange
      const key = 'item';
      const group = 'G1';

      // Act
      await cacheStore.addOrReplace(key, 'v', { groups: [group] });

      // Assert
      const raw = await cacheProvider.get('invalidationGroups');
      const groupsMap = parseGroups(raw);
      const groupKeys = groupsMap.get(group) ?? [];
      expect(groupKeys).toContain(computeHash(key));
    });

    it('updates groups when groups change on replace', async () => {
      // Arrange
      const key = 'item';
      await cacheStore.addOrReplace(key, 'v1', { groups: ['G1'] });

      // Act
      await cacheStore.addOrReplace(key, 'v2', { groups: ['G2'] });

      // Assert
      const groupsMap = parseGroups(await cacheProvider.get('invalidationGroups'));
      const g1Keys = groupsMap.get('G1') ?? [];
      const g2Keys = groupsMap.get('G2') ?? [];
      expect(g1Keys).not.toContain(computeHash(key));
      expect(g2Keys).toContain(computeHash(key));
    });

    it('preserves existing groups when no new groups provided on replace', async () => {
      // Arrange
      const key = 'item';
      await cacheStore.addOrReplace(key, 'v1', { groups: ['G1'] });

      // Act
      await cacheStore.addOrReplace(key, 'v2', {});

      // Assert
      const groupsMap = parseGroups(await cacheProvider.get('invalidationGroups'));
      const groupKeys = groupsMap.get('G1') ?? [];
      expect(groupKeys).toContain(computeHash(key));
    });
  });
});
