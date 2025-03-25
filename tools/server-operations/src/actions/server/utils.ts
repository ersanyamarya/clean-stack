import { getDefaultServer, getServerByName } from '../../sources/config';
import { logger } from '../../utils/logger';

export interface RunOnServerOptions {
  default?: boolean;
  server?: string;
}

export const getServerToRunOn = (options: RunOnServerOptions) => {
  if (!options.default && !options.server) {
    logger.error('No server specified. Use the --server flag to specify a server, or use the --default flag to use the default server.');
    return;
  }

  return getServerByName(options.server || getDefaultServer());
};
