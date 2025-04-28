import { Logger } from '@clean-stack/framework/global-types';
import { ConnectionOptions, Queue, Worker } from 'bullmq';
import { AllQueueNames, QueDataSchema, queueList } from '../queues';

/**
 * Default job options for all queues
 */
const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: true,
} as const;

/**
 * Validates queue data against its schema
 * @throws {AppError} If validation fails
 */
const validateQueueData = <Q extends AllQueueNames>(queueName: Q, data: QueDataSchema<Q>) => {
  // eslint-disable-next-line security/detect-object-injection
  const currentJob = queueList[queueName];
  if (!currentJob) {
    throw new Error(`Queue ${queueName} not found`);
  }

  const dataValidation = currentJob.safeParse(data);
  if (!dataValidation.success) {
    throw new Error(`Invalid data for queue ${queueName}: ${dataValidation.error.errors.map(error => error.message).join(', ')}`);
  }

  return dataValidation.data;
};

/**
 * Creates a queue instance with job management capabilities
 */
export const getQueue = <Q extends AllQueueNames>(queueName: Q, connection: ConnectionOptions) => {
  if (!Object.prototype.hasOwnProperty.call(queueList, queueName)) {
    throw new Error(`Queue ${queueName} not found`);
  }

  const queue = new Queue(queueName, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });

  const addJob = async (data: QueDataSchema<Q>, jobName?: string) => {
    const validatedData = validateQueueData(queueName, data);
    await queue.add(jobName || queueName, validatedData);
  };

  return { queue, addJob };
};

/**
 * Creates a worker with error handling and logging
 */
export const addJobProcessor = <Q extends AllQueueNames>(
  queueName: Q,
  workerController: (data: QueDataSchema<Q>) => Promise<void>,
  logger: Logger,
  connection: ConnectionOptions
) => {
  const worker = new Worker<QueDataSchema<Q>, void, Q>(
    queueName,
    async job => {
      const validatedData = validateQueueData(queueName, job.data);
      await workerController(validatedData);
    },
    { connection }
  );

  // Event handlers for observability
  worker
    .on('completed', job => logger.debug(`Job ${job.id} completed successfully`))
    .on('failed', (job, err) => logger.error(`Job ${job?.name} failed with error: ${err.message}`))
    .on('progress', (job, progress) => logger.debug(`Job ${job.id} progress: ${progress}`))
    .on('stalled', job => logger.warn(`Job ${job} stalled`))
    .on('error', err => logger.error(`Worker error: ${err.message}`));

  return worker;
};
