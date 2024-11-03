import { ConnectorFactory, HealthCheck } from '@clean-stack/framework/global-types';
import { createClient, RedisClientType } from 'redis';

export type RedisConfig = {
  url: string;
  name: string;
  maxRetries?: number;
  retryInterval?: number;
};
let redisClient: RedisClientType;
export const createRedisConnector: ConnectorFactory<RedisConfig> = (logger, { url, name, maxRetries = 20, retryInterval = 500 }) => {
  let status: HealthCheck['status'] = 'disconnected';
  return {
    async connect() {
      redisClient = createClient({
        url,
        name,
        socket: {
          reconnectStrategy: function (retries, cause) {
            if (retries > maxRetries) {
              logger.error(cause.message);
              return false;
            } else {
              return retries * retryInterval;
            }
          },
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
      redisClient.on('reconnect', () => {
        logger.warn('Reconnected to Redis');
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
        name: 'redis',
        healthCheck: async () => {
          try {
            await redisClient.ping();
            return { status, connected: status === 'connected' };
          } catch (error) {
            return { status: 'disconnected' };
          }
        },
      };
    },
    async disconnect() {
      await redisClient.disconnect();
    },
  };
};
export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client is not initialized');
  }

  return redisClient;
}
