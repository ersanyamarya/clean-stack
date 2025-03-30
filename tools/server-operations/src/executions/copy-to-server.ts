import { $ } from 'zx';

import { Server } from '../server';
import { generateSCPCommand } from './ssh-utils';

export const copyToServer = async (source: string, destination: string, server: Server, verbose = false): Promise<string> => {
  const sshCommand = generateSCPCommand(server, source, destination);
  $.verbose = verbose;
  $.shell = '/bin/bash';
  const output = await $`${sshCommand}`;

  if (output.exitCode !== 0) {
    throw new Error(`Copy failed with exit code ${output.exitCode}`);
  }
  $.verbose = false;
  return output.stdout;
};
