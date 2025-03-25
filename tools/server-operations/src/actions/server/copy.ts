import { executeBash, generateSCPCommand, getServerToRunOn, RunOnServerOptions } from '../../helpers';
import { getAboslutePath, getDirectorySize, sizeUnits } from '../../utils/files';
import { logger } from '../../utils/logger';

const SPLIT_SIZE = '16m'; // 16 MB

export const copyToServer = async (source: string, destination: string, options: RunOnServerOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  const absoluteSourcePath = getAboslutePath(source);
  const sourceSize = await getDirectorySize(absoluteSourcePath);
  const isLarge = isLargeTransfer(sourceSize);
  logger.info(`Source size: ${sourceSize} bytes`);

  if (isLarge) {
    logger.info(`The source is too large (${sourceSize} bytes). Splitting the transfer into smaller chunks.`);
  } else {
    const sshCommand = generateSCPCommand(serverToRunOn, absoluteSourcePath, destination);
    logger.info(`Executing : ${sshCommand.join(' ')}`);
    const output = await executeBash(sshCommand);
  }
  logger.success(`Successfully copied ${source} to ${destination} on ${serverToRunOn.name}`);
};

const isLargeTransfer = (bytes: number): boolean => {
  const splitSizeUnits = sizeUnits[SPLIT_SIZE.slice(-1).toUpperCase()];
  const splitSize = Number(SPLIT_SIZE.slice(0, -1)) * splitSizeUnits;
  return bytes > splitSize * 2;
};
