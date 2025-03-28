import { Server } from '../sources/config';

export enum SSHPortFlag {
  P = '-P',
  p = '-p',
}

export const generateSSHOptionsString = (server: Server, sshPortFlag: SSHPortFlag = SSHPortFlag.p): string[] => {
  const sshOptions = [];
  if (server.port) {
    sshOptions.push(sshPortFlag);
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
  const sshOptions = generateSSHOptionsString(server, SSHPortFlag.P);
  const scpCommand = ['scp', ...sshOptions, '-r', sourcePath, `${server.user}@${server.host}:${destinationPath}`];
  return scpCommand;
};
