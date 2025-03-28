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
