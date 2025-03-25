// tar -cf temp/data.tar

import { $ } from 'zx';
import { logger } from './logger';

/**
 * Compress a directory into a tar file.
 * @param {string} dir - The directory to compress.
 * @param {string} output - The output tar file.
 */
export const compressDirectory = async (dir: string, output: string): Promise<string> => {
  logger.info(`Compressing directory ${dir} into ${output}`);
  return new Promise((resolve, reject) => {
    const shellProcess = $`tar -cf ${output} ${dir}`;
    shellProcess.stdout.on('data', data => {
      logger.info(data.toString());
    });
    shellProcess.stderr.on('data', data => {
      logger.error(data.toString());
    });

    shellProcess.exitCode.then(code => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        resolve('Directory compressed successfully');
      }
      shellProcess.kill();
    });
  });
};
