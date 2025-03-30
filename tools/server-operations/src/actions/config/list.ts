import { logger } from '../../utils/logger';
import { listServersFromConfig } from './helpers';

interface ConfigOptions {
  list?: boolean;
  table?: boolean;
}

export const listConfigAction = async (options: ConfigOptions): Promise<void> => {
  const serverList = listServersFromConfig();
  if (serverList.length === 0) {
    logger.warning('No servers available. Use the command "server-operations add" to add a new server.');
    return;
  }
  logger.info('Available servers:');
  if (options.table) {
    logger.table(serverList);
    return;
  }
  serverList.forEach((server, index) => {
    logger.info(`${index + 1}. ${server.name} (${server.host})`);
  });
};
