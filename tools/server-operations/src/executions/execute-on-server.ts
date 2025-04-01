import ProgressBar from 'progress';
import { $ } from 'zx';
import { Server } from '../server';
import { generateSSHCommand } from './ssh-utils';
export const executeOnServer = async (command: string, server: Server, verbose = false): Promise<string> => {
  const sshCommand = generateSSHCommand(server, command);
  $.verbose = verbose;
  $.shell = '/bin/bash';
  const output = await $`${sshCommand}`;

  if (output.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${output.exitCode}`);
  }
  $.verbose = false;
  return output.stdout;
};

export const executeOnServerWithProgress = async (
  command: string,
  server: Server,
  total: number,
  title: string,
  progressString = 'PROGRESS'
): Promise<string> => {
  $.verbose = false;
  $.quiet = true;

  const progressBar = new ProgressBar(`${title} : [:bar] :percent :etas`, {
    complete: '█',
    incomplete: '░',
    width: 50,
    total,
    clear: true,
  });
  const sshCommand = generateSSHCommand(server, command);
  return new Promise<string>((resolve, reject) => {
    const process = $`${sshCommand}`;
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
