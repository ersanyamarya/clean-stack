import ProgressBar from 'progress';
import { $ } from 'zx';
import { logger } from './logger';
$.shell = '/bin/bash';

const progressBar = new ProgressBar('Progress: [:bar] :percent :etas', {
  complete: '█',
  incomplete: '░',
  width: 50,
  total: 100,
  clear: true,
});

export const executeBash = async (command: string[]): Promise<string> => {
  logger.info(`Executing command: ${command.join(' ')}`);

  return new Promise((resolve, reject) => {
    const shellProcess = $`${command}`;
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
        resolve('Command executed successfully');
      }
      shellProcess.kill();
    });
  });
};

export const executeBashWithProgress = async (command: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const shellProcess = $`${command}`;
    shellProcess.stdout.on('data', data => {
      // logger.info(data.toString());
      progressBar.tick();
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
