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
