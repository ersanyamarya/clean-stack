import { Logger } from '@clean-stack/global_types';

/**
 * The function `exceptions` sets up event listeners for unhandled rejections and uncaught exceptions,
 * throwing the reason for unhandled rejections and logging the error message for uncaught exceptions.
 * @param {Logger} logger - The `logger` parameter is an instance of a Logger class that is used for
 * logging errors and messages in the application.
 */
export const exceptions = (logger: Logger): void => {
  process.on('unhandledRejection', reason => {
    throw reason;
  });

  process.on('uncaughtException', error => {
    logger.error(error.message, {
      err: error,
      context: { message: 'Uncaught exception' },
    });
  });
};
