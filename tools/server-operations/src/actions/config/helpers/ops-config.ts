import { getDefaultServer, listServers, removeServers, setDefaultServer } from '../../../sources/config';

export const listServersFromConfig = () => {
  const serverList = listServers();
  return serverList;
};

export const listServersAsChoices = () => {
  const serverList = listServers();
  const defaultServer = getDefaultServer();
  return serverList.map(server => ({
    value: server.name,
    name: `${server.name} (${server.host}) ${server.name === defaultServer ? '(DEFAULT)' : ''}`,
  }));
};

export const removeServersFromConfig = (serverNames: string[]) => {
  removeServers(serverNames);
};

export const setDefaultServerInConfig = (serverName: string) => {
  setDefaultServer(serverName);
};

export const getDefaultServerFromConfig = () => {
  return getDefaultServer();
};
