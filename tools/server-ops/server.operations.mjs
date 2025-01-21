import { $ } from 'zx';
import logger from '../utils/color-level-logger.mjs';
import { ServerSchema } from './schema.mjs';

export function validateServer(server) {
  try {
    return ServerSchema.parse(server);
  } catch (error) {
    logger.error(`Invalid server configuration: ${error.message}`);
    throw error;
  }
}

export function generateSSHOptionsString(server) {
  try {
    const validatedServer = validateServer(server);
    const { username, hostname, publicKeyPath } = validatedServer;
    const sshOptions = [];
    if (publicKeyPath) {
      sshOptions.push(`-i ${publicKeyPath}`);
    }
    sshOptions.push(`${username}@${hostname}`);
    return sshOptions.join(' ');
  } catch (error) {
    logger.error(`Failed to generate SSH options string: ${error.message}`);
    throw error;
  }
}

export async function runOnServer(command, server) {
  try {
    if (!command || typeof command !== 'string') {
      throw new Error('Please provide a valid command string');
    }

    validateServer(server);
    const sshOptions = await generateSSHOptionsString(server);
    const sshCommand = ['ssh', ...sshOptions.split(' '), '-t', command];
    logger.info(`Executing: ${sshCommand.join(' ')}`);
    const output = await $`${sshCommand}`;
    logger.success('Command executed successfully');
    return output;
  } catch (error) {
    logger.error(`Failed to run command on server: ${error.message}`);
    throw error;
  }
}

export async function updateServer(server) {
  try {
    validateServer(server);
    const commands = ['sudo apt update -y', 'sudo apt upgrade -y', 'sudo apt autoremove -y', 'sudo apt autoclean'];

    logger.warn('Starting server update...');
    for (const command of commands) {
      await runOnServer(command, server);
    }
    logger.success('Server updated successfully');
  } catch (error) {
    logger.error(`Failed to update server: ${error.message}`);
    throw error;
  }
}

export async function installPackagesOnServer(server, packages) {
  try {
    validateServer(server);
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new Error('Please provide a valid packages array');
    }

    logger.warn('Starting package installation...');
    for (const pkg of packages) {
      const command = `sudo apt install -y ${pkg}`;
      await runOnServer(command, server);
    }
    logger.success('Packages installed successfully');
  } catch (error) {
    logger.error(`Failed to install packages on server: ${error.message}`);
    throw error;
  }
}
