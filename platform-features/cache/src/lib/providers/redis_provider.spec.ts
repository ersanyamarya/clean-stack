import { RedisClientType } from 'redis';
import { describe, expect, it, Mocked, vi } from 'vitest';
import { CacheProvider } from '../cache';
import { gerRedisCacheProvider } from './redis';

describe('gerRedisCacheProvider', () => {
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

    cacheProvider = gerRedisCacheProvider(mockClient);
  });

  it('should set a value with TTL', async () => {
    await cacheProvider.set('key', 'value', 3600);
    expect(mockClient.set).toHaveBeenCalledWith('key', 'value', { EX: 3600 });
  });

  it('should get a value', async () => {
    mockClient.get.mockResolvedValue('value');
    const result = await cacheProvider.get('key');
    expect(result).toBe('value');
    expect(mockClient.get).toHaveBeenCalledWith('key');
  });

  it('should delete a key', async () => {
    await cacheProvider.delete('key');
    expect(mockClient.del).toHaveBeenCalledWith('key');
  });

  it('should delete multiple keys', async () => {
    await cacheProvider.deleteManyKeys(['key1', 'key2']);
    expect(mockClient.del).toHaveBeenCalledWith(['key1', 'key2']);
  });

  it('should clear all keys', async () => {
    await cacheProvider.clear();
    expect(mockClient.flushAll).toHaveBeenCalled();
  });

  it('should get all keys', async () => {
    mockClient.keys.mockResolvedValue(['key1', 'key2']);
    const result = await cacheProvider.getAllKeys();
    expect(result).toEqual(['key1', 'key2']);
    expect(mockClient.keys).toHaveBeenCalledWith('*');
  });
});
