import { listServers } from '../sources/config';
import { parseSSHConfig } from '../sources/parse-ssh-config';

export const addServersFromSShConfig = () => {
  const parsedSSHConfig = parseSSHConfig();
  const serverList = listServers();
  const serverNames = Object.keys(parsedSSHConfig);
  const choices = serverNames
    .filter(name => !serverList.find(s => s.name === name))
    .sort()
    .map(name => ({
      name: name,
      value: name,
    }));
  return {
    choices,
    getParsedServer: (name: string) => {
      if (!Object.prototype.hasOwnProperty.call(parsedSSHConfig, name)) {
        throw new Error(`Server "${name}" not found in SSH config`);
      }
      // eslint-disable-next-line security/detect-object-injection
      return parsedSSHConfig[name];
    },
  };
};
