import { executeBash, generateSSHCommand } from '../../helpers';
import { Server } from '../../sources/config';
import { logger } from '../../utils/logger';
import { getServerToRunOn, RunOnServerOptions } from './utils';

export const runCommandOnServer = async (commandToRun: string, options: RunOnServerOptions) => {
  const serverToRunOn: Server = getServerToRunOn(options);
  const sshCommand = generateSSHCommand(serverToRunOn, commandToRun);
  logger.info(`Executing: ${sshCommand.join(' ')}`);
  const output = await executeBash(sshCommand);
  logger.info(output);
};
