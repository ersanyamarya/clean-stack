import { $, spinner } from 'zx';
import { logger } from '../utils/logger';
$.shell = '/bin/bash';

export const executeBash = async (command: string[]) => {
  logger.info(`Executing command: ${command.join(' ')}`);
  const output = await spinner('working...', () => $`${command}`);

  if (output.exitCode === 0) {
    return output.stdout;
  } else {
    throw new Error(output.stderr.toString());
  }
};
