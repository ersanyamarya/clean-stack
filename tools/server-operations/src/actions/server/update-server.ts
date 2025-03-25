import { generateSSHCommand, getServerToRunOn, RunOnServerOptions } from '../../helpers';
import { Server } from '../../sources/config';
import { executeBash } from '../../utils/execute-bash';
import { logger } from '../../utils/logger';
interface UpdateServerOptions extends RunOnServerOptions {
  isRaspberryPi: boolean;
}

export const updateServer = async (options: UpdateServerOptions) => {
  const serverToRunOn: Server = getServerToRunOn(options);
  logger.info(`Updating packages on ${serverToRunOn.name}`);
  await executeBash(generateSSHCommand(serverToRunOn, `sudo apt update -y`));

  logger.info(`Upgrading packages on ${serverToRunOn.name}`);
  await executeBash(generateSSHCommand(serverToRunOn, `sudo apt upgrade -y`));
  if (options.isRaspberryPi) {
    logger.info(`Upgrading firmware on ${serverToRunOn.name}`);
    await executeBash(generateSSHCommand(serverToRunOn, `sudo rpi-update`));
  }
  logger.info(`Auto removing packages on ${serverToRunOn.name}`);
  await executeBash(generateSSHCommand(serverToRunOn, `sudo apt autoremove -y`));

  logger.info(`Cleaning up packages on ${serverToRunOn.name}`);
  await executeBash(generateSSHCommand(serverToRunOn, `sudo apt clean`));

  logger.info(`Done updating ${serverToRunOn.name}`);
};
