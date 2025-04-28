import { Logger } from '@clean-stack/framework/global-types';
import { RedisMemoryServer } from 'redis-memory-server';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { QueDataSchema } from '../queues';
import { addJobProcessor, getQueue } from './service-queue';

// Simple logger stub for testing
const mockLogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

describe('service-queue module', () => {
  let redisServer: RedisMemoryServer;
  let connection: { host: string; port: number };

  beforeAll(async () => {
    redisServer = new RedisMemoryServer();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    connection = { host, port };
  });

  afterAll(async () => {
    await redisServer.stop();
  });

  afterEach(async () => {
    // Clean up all jobs in the queue after each test
    const { queue } = getQueue('sendEmail', connection);
    await queue.drain(true);
    await queue.close();
  });

  describe('getQueue()', () => {
    it('should add and list a valid job', async () => {
      const { queue, addJob } = getQueue('sendEmail', connection);
      const payload: QueDataSchema<'sendEmail'> = { to: 'test@example.com', subject: 'Hello', text: 'World' };
      await addJob(payload);
      const waiting = await queue.getWaiting();
      expect(waiting).toHaveLength(1);
      expect(waiting[0].data).toEqual(payload);
      await queue.close();
    });

    it('should throw when adding invalid data', async () => {
      const { addJob } = getQueue('sendEmail', connection);
      // @ts-expect-error invalid payload
      await expect(addJob({ to: 'invalid', subject: 123, text: null })).rejects.toThrow();
    });

    it('should throw when requesting an unknown queue', () => {
      expect(() => getQueue('unknownQueue' as any, connection)).toThrowError('Queue unknownQueue not found');
    });
  });

  describe('addJobProcessor()', () => {
    it('should process jobs and call workerController', async () => {
      const processed: QueDataSchema<'sendEmail'>[] = [];
      const worker = addJobProcessor(
        'sendEmail', // Queue name
        async data => {
          processed.push(data);
        },
        mockLogger,
        connection
      );

      const { addJob } = getQueue('sendEmail', connection);
      const payload: QueDataSchema<'sendEmail'> = { to: 'x@y.com', subject: 'S', text: 'T' };
      await addJob(payload);
      // wait for 1 second to ensure the job is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(processed).toHaveLength(1);

      expect(processed).toEqual([payload]);
      await worker.close();
    });
    it('should handle errors in workerController', async () => {
      const error = new Error('Test error');
      const worker = addJobProcessor(
        'sendEmail',
        async () => {
          throw error;
        },
        mockLogger,
        connection
      );

      const { addJob } = getQueue('sendEmail', connection);
      const payload: QueDataSchema<'sendEmail'> = { to: 'a@b.com', subject: 'b', text: 'c' };
      await addJob(payload);

      // wait for 1 second to ensure the job is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(mockLogger.error).toHaveBeenCalledWith(`Job sendEmail failed with error: ${error.message}`);
      await worker.close();
    });
  });
});
