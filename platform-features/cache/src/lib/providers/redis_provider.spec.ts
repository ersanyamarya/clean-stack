import { RedisClientType } from 'redis';
import { describe, Mocked, vi } from 'vitest';
import { CacheProvider } from '../cache';
import { getRedisCacheProvider } from './redis';

describe('getRedisCacheProvider', () => {
  let mockClient: Mocked<RedisClientType>;
  let cacheProvider: CacheProvider;

  beforeEach(() => {
    mockClient = {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
      flushAll: vi.fn(),
      keys: vi.fn(),
    } as unknown as Mocked<RedisClientType>;

    cacheProvider = getRedisCacheProvider(mockClient);
  });

  // Happy Path: set without TTL
  describe('when setting a key without TTL', () => {
    it('calls client.set with key and value', async () => {
      await cacheProvider.set('key1', 'value1');
      expect(mockClient.set).toHaveBeenCalledWith('key1', 'value1');
    });
  });

  // Happy Path: set with TTL
  describe('when setting a key with TTL', () => {
    it('calls client.set with EX option', async () => {
      await cacheProvider.set('key2', 'value2', 60);
      expect(mockClient.set).toHaveBeenCalledWith('key2', 'value2', { EX: 60 });
    });
  });

  // Happy Path: get
  describe('when getting a key', () => {
    it('returns the value from client.get', async () => {
      vi.mocked(mockClient.get).mockResolvedValue('value3');
      const result = await cacheProvider.get('key3');
      expect(mockClient.get).toHaveBeenCalledWith('key3');
      expect(result).toBe('value3');
    });
  });

  // Happy Path: delete single key
  describe('when deleting a key', () => {
    it('calls client.del with key', async () => {
      await cacheProvider.delete('key4');
      expect(mockClient.del).toHaveBeenCalledWith('key4');
    });
  });

  // Happy Path: delete multiple keys
  describe('when deleting multiple keys', () => {
    it('calls client.del with array of keys', async () => {
      const keys = ['a', 'b', 'c'];
      await cacheProvider.deleteManyKeys(keys);
      expect(mockClient.del).toHaveBeenCalledWith(keys);
    });
  });

  // Happy Path: clear cache
  describe('when clearing the cache', () => {
    it('calls client.flushAll', async () => {
      await cacheProvider.clear();
      expect(mockClient.flushAll).toHaveBeenCalled();
    });
  });

  // Happy Path: getAllKeys
  describe('when retrieving all keys', () => {
    it('returns all keys using client.keys', async () => {
      vi.mocked(mockClient.keys).mockResolvedValue(['x', 'y']);
      const result = await cacheProvider.getAllKeys();
      expect(mockClient.keys).toHaveBeenCalledWith('*');
      expect(result).toEqual(['x', 'y']);
    });
  });
});
