import { $, spinner } from 'zx';
$.shell = '/bin/bash';

export const executeBash = async (command: string[]) => {
  const output = await spinner('working...', () => $`${command}`);

  if (output.exitCode === 0) {
    return output.stdout;
  } else {
    throw new Error(output.stderr.toString());
  }
};
