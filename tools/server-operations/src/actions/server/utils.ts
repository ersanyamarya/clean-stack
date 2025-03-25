import { getDefaultServer, getServerByName } from '../../sources/config';

export interface RunOnServerOptions {
  default?: boolean;
  server?: string;
}

export const getServerToRunOn = (options: RunOnServerOptions) => {
  if (!options.default && !options.server) {
    throw new Error('You must provide a server name or set the default flag to true');
  }

  return getServerByName(options.server || getDefaultServer());
};
