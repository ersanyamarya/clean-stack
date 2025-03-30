import ProgressBar from 'progress';
import { $ } from 'zx';
$.shell = '/bin/bash';

export const executeBash = async (command: string[], verbose = true): Promise<string> => {
  $.verbose = verbose;
  const output = await $`${command}`;
  if (output.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${output.exitCode}`);
  }
  return output.stdout;
};

export const executeBashWithProgress = async (command: string[], total: number, title: string, progressString = 'PROGRESS'): Promise<string> => {
  $.verbose = false;
  $.quiet = true;

  const progressBar = new ProgressBar(`${title} : [:bar] :percent :etas`, {
    complete: '█',
    incomplete: '░',
    width: 50,
    total,
    clear: true,
  });

  return new Promise<string>((resolve, reject) => {
    const process = $`${command}`;
    process.stdout.on('data', (chunk: string) => {
      const lines = chunk.toString().split('\n');
      lines.forEach(line => {
        if (line.includes(progressString)) {
          progressBar.tick(1);
        }
      });
    });
    // exitcode  check
    process.exitCode.then(code => {
      if (code !== 0) {
        reject(new Error(`${title} failed with exit code ${code}`));
        return;
      }
      resolve(`${title} completed successfully`);
    });
  });
};
