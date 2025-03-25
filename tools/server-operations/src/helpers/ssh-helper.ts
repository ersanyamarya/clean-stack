import { getDefaultServer, getServerByName, Server } from '../sources/config';
export const generateSSHOptionsString = (server: Server, isPortP = false) => {
  const sshOptions = [];
  if (server.port) {
    sshOptions.push(isPortP ? '-P' : '-p');
    sshOptions.push(server.port);
  }
  if (server.privateKey) {
    sshOptions.push('-i');
    sshOptions.push(server.privateKey);
  }

  return sshOptions;
};

export const generateSSHCommand = (server: Server, command: string): string[] => {
  const sshOptions = generateSSHOptionsString(server);
  sshOptions.push(`${server.user}@${server.host}`);
  const sshCommand = ['ssh', ...sshOptions, '-t', command];
  return sshCommand;
};

export const generateSCPCommand = (server: Server, sourcePath: string, destinationPath: string): string[] => {
  const sshOptions = generateSSHOptionsString(server, true);
  const scpCommand = ['scp', ...sshOptions, '-r', sourcePath, `${server.user}@${server.host}:${destinationPath}`];
  return scpCommand;
};

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
