import { removeServers } from '../sources/config';

export const removeServersFromConfig = (serverNames: string[]) => {
  removeServers(serverNames);
};
