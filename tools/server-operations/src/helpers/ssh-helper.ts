import { Server } from '../sources/config';
export const generateSSHOptionsString = (server: Server) => {
  const sshOptions = [];
  if (server.port) {
    sshOptions.push('-p');
    sshOptions.push(server.port);
  }
  if (server.privateKey) {
    sshOptions.push('-i');
    sshOptions.push(server.privateKey);
  }
  sshOptions.push(`${server.user}@${server.host}`);
  return sshOptions;
};

export const generateSSHCommand = (server: Server, command: string) => {
  const sshOptions = generateSSHOptionsString(server);
  const sshCommand = ['ssh', ...sshOptions, '-t', command];
  return sshCommand;
};
