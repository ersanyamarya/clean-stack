import { $ } from 'zx';
import { logger } from './logger';
$.shell = '/bin/bash';

export const executeBash = async (command: string[], silent = false): Promise<string> => {
  if (!silent) logger.info(`Executing command: ${command.join(' ')}`);

  return new Promise((resolve, reject) => {
    const shellProcess = $`${command}`;
    shellProcess.stdout.on('data', data => {
      if (!silent) logger.info(data.toString());
    });
    shellProcess.stderr.on('data', data => {
      logger.error(data.toString());
    });

    shellProcess.exitCode.then(code => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        resolve('Command executed successfully');
      }
      shellProcess.kill();
    });
  });
};
