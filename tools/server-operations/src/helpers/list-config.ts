import { getDefaultServer, listServers } from '../sources/config';

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
