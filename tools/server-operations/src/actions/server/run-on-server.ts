import { generateSSHCommand, getServerToRunOn, RunOnServerOptions } from '../../helpers';
import { Server } from '../../sources/config';
import { executeBash } from '../../utils/execute-bash';
import { logger } from '../../utils/logger';
export const runCommandOnServer = async (commandToRun: string, options: RunOnServerOptions) => {
  const serverToRunOn: Server = getServerToRunOn(options);
  const sshCommand = generateSSHCommand(serverToRunOn, commandToRun);
  const output = await executeBash(sshCommand);
  logger.info(`Output: ${output}`);
};
