import { getDefaultServer, setDefaultServer } from '../sources/config';

export const setDefaultServerInConfig = (serverName: string) => {
  setDefaultServer(serverName);
};

export const getDefaultServerFromConfig = () => {
  return getDefaultServer();
};
