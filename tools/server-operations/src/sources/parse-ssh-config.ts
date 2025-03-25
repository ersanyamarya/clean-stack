const SSH_CONFIG_PATH = process.env.HOME + '/.ssh/config';

import { readFileSync } from 'fs';

export type SSHConfig = {
  host: string;
  user: string;
  port: number;
  privateKey: string;
  password: string;
  name: string;
};
export type SSHConfigList = {
  [key: string]: SSHConfig;
};

export const parseSSHConfig = (): SSHConfigList => {
  const sshConfigContent = readFileSync(SSH_CONFIG_PATH, 'utf-8');
  const lines = sshConfigContent.split('\n');

  const sshConfigList: SSHConfigList = {};
  let currentConfig: SSHConfig | null = null;

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Host ')) {
      if (currentConfig) {
        sshConfigList[currentConfig.name] = currentConfig;
      }
      currentConfig = {
        host: '',
        user: '',
        port: 22,
        privateKey: '',
        password: '',
        name: line.split(' ')[1],
      };
    } else if (line.startsWith('HostName ')) {
      if (currentConfig) {
        currentConfig.host = line.split(' ')[1];
      }
    } else if (line.startsWith('User ')) {
      if (currentConfig) {
        currentConfig.user = line.split(' ')[1];
      }
    } else if (line.startsWith('Port ')) {
      if (currentConfig) {
        currentConfig.port = parseInt(line.split(' ')[1]);
      }
    } else if (line.startsWith('IdentityFile ')) {
      if (currentConfig) {
        currentConfig.privateKey = line.split(' ')[1];
      }
    } else if (line.startsWith('Password ')) {
      if (currentConfig) {
        currentConfig.password = line.split(' ')[1];
      }
    }
  });

  // Add the last config
  if (currentConfig) {
    sshConfigList[currentConfig.name] = currentConfig;
  }

  return sshConfigList;
};
