import { ConnectorFactory, HealthCheck } from '@clean-stack/framework/global-types';
import Redis from 'ioredis';

export type RedisConfig = {
  url: string;
  name: string;
  maxRetries?: number;
  retryInterval?: number;
};
let redisClient: Redis;
export const createRedisConnector: ConnectorFactory<RedisConfig> = (logger, { url, name, maxRetries = 20, retryInterval = 500 }) => {
  let status: HealthCheck['status'] = 'disconnected';
  return {
    async connect() {
      redisClient = new Redis(url, {
        maxRetriesPerRequest: maxRetries,
        retryStrategy: times => {
          if (times > maxRetries) {
            logger.error(`Max retries reached: ${times}`);
            return null;
          }
          return times * retryInterval;
        },
      });
      redisClient.on('error', error => {
        logger.error(error.message);
        status = 'error';
      });
      redisClient.on('connect', () => {
        logger.info('Connected to Redis');
        status = 'connected';
      });
      redisClient.on('reconnecting', () => {
        logger.warn('Reconnecting to Redis');
        status = 'reconnecting';
      });
      redisClient.on('end', () => {
        logger.warn('Redis connection was terminated');
        status = 'disconnected';
      });

      await redisClient.connect();

      return {
        name,
        healthCheck: async () => {
          try {
            await redisClient.ping();
            return { status, connected: status === 'connected' };
          } catch {
            return { status: 'disconnected' };
          }
        },
      };
    },
    async disconnect() {
      await redisClient.quit();
    },
  };
};
export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client is not initialized');
  }

  return redisClient;
}
