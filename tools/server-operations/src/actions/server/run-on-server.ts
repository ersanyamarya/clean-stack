import { moduleRegistry } from '../../modules/registry';
import { Server } from '../../server';
import { logger } from '../../utils/logger';
import { ServerSelectionOptions, getServerToRunOn } from '../types';
export const runCommandOnServer = async (commandToRun: string, options: ServerSelectionOptions) => {
  const serverToRunOn: Server = getServerToRunOn(options);
  const executeOnServer = moduleRegistry['EXECUTE_ON_SERVER'];

  const output = await executeOnServer.run({
    command: commandToRun,
    server: serverToRunOn,
    verbose: options.verbose,
  });
  logger.info(`Output: ${output}`);
};
