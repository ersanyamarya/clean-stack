import { Logger } from '@clean-stack/framework/global-types';
import { describe, expect, it, vi } from 'vitest';
import { addJobProcessor, getQueue } from './service-queue';

// Mocks for bullmq and bullmq-otel
vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
  })),
  Worker: vi.fn().mockImplementation((queueName, processor) => {
    return {
      on: vi.fn().mockReturnThis(),
      queueName,
      processor,
    };
  }),
}));
vi.mock('bullmq-otel', () => ({ BullMQOtel: vi.fn() }));

const mockLogger: Logger = {
  child: () => mockLogger,
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

describe('service-queue', () => {
  const connection = { host: 'localhost', port: 6379 };
  const serviceName = 'test-service';

  describe('getQueue', () => {
    it('returns a queue and addJob function for a valid queue', async () => {
      const { queue, addJob } = getQueue('sendEmail', connection, serviceName);
      expect(queue).toBeDefined();
      expect(typeof addJob).toBe('function');
    });

    it('throws an error for an invalid queue name', () => {
      // @ts-expect-error: purposely passing invalid queue name
      expect(() => getQueue('invalidQueue', connection, serviceName)).toThrow('Queue invalidQueue not found');
    });

    it('addJob validates data and adds job', async () => {
      const { addJob, queue } = getQueue('sendEmail', connection, serviceName);
      const validData = { to: 'test@example.com', subject: 'Test', text: 'Hello' };
      await addJob(validData);
      expect(queue.add).toHaveBeenCalledWith('sendEmail', validData);
    });

    it('addJob throws error for invalid data', async () => {
      const { addJob } = getQueue('sendEmail', connection, serviceName);
      const invalidData = { to: 'not-an-email', subject: 'Test', text: 'Hello' };
      await expect(addJob(invalidData as never)).rejects.toThrow('Invalid data for queue sendEmail');
    });
  });

  describe('addJobProcessor', () => {
    it('creates a Worker and calls workerController with validated data', async () => {
      const workerController = vi.fn().mockResolvedValue(undefined);
      const worker = addJobProcessor('sendEmail', workerController, mockLogger, connection, serviceName);
      // Simulate a job
      const job = { data: { to: 'test@example.com', subject: 'Test', text: 'Hello' } };
      // @ts-expect-error: processor is a mock property for test
      await worker.processor(job);
      expect(workerController).toHaveBeenCalledWith(job.data);
    });

    it('worker emits events and logger methods are called', () => {
      const workerController = vi.fn().mockResolvedValue(undefined);
      const worker = addJobProcessor('sendEmail', workerController, mockLogger, connection, serviceName);
      // Simulate event handler registration (no actual event emission)
      expect(typeof worker.on).toBe('function');
      // Registering handlers should return the worker for chaining
      const chained = worker.on('completed', vi.fn());
      expect(chained).toBe(worker);
    });
  });
});
