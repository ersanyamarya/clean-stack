import { moduleRegistry } from '../../modules/registry';
import { Server } from '../../server';
import { logger } from '../../utils/logger';
import { ServerSelectionOptions, getServerToRunOn } from '../types';

interface UpdateServerOptions extends ServerSelectionOptions {
  isRaspberryPi: boolean;
}

export const updateServer = async (options: UpdateServerOptions) => {
  const serverToRunOn: Server = getServerToRunOn(options);
  const executeOnServer = moduleRegistry['EXECUTE_ON_SERVER'];

  logger.info(`Updating packages on ${serverToRunOn.name}`);
  await executeOnServer.run({
    command: 'sudo apt update -y',
    server: serverToRunOn,
    verbose: options.verbose,
  });

  logger.info(`Upgrading packages on ${serverToRunOn.name}`);
  await executeOnServer.run({
    command: 'sudo apt upgrade -y',
    server: serverToRunOn,
    verbose: options.verbose,
  });

  if (options.isRaspberryPi) {
    logger.info(`Dist upgrading packages on ${serverToRunOn.name}`);
    await executeOnServer.run({
      command: 'sudo apt dist-upgrade -y',
      server: serverToRunOn,
      verbose: options.verbose,
    });
  }
  logger.info(`Auto removing packages on ${serverToRunOn.name}`);
  await executeOnServer.run({
    command: 'sudo apt autoremove -y',
    server: serverToRunOn,
    verbose: options.verbose,
  });

  logger.info(`Cleaning up packages on ${serverToRunOn.name}`);
  await executeOnServer.run({
    command: 'sudo apt autoclean -y',
    server: serverToRunOn,
    verbose: options.verbose,
  });

  logger.info(`Done updating ${serverToRunOn.name}`);
};
