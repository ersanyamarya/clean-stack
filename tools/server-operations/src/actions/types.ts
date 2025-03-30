import { getDefaultServer, getServerByName } from '../sources/config';

export interface ServerSelectionOptions {
  default?: boolean;
  server?: string;
  verbose?: boolean;
}

export const getServerToRunOn = (options: ServerSelectionOptions) => {
  if (!options.default && !options.server) {
    throw new Error('You must provide a server name or set the default flag to true');
  }

  return getServerByName(options.server || getDefaultServer());
};
