import { copyLargeToServer, generateSCPCommand, getServerToRunOn, isLargeTransfer, RunOnServerOptions } from '../../helpers';
import { executeBash } from '../../utils/execute-bash';
import { bytesToOthers, getAboslutePath, getDirectorySize } from '../../utils/files';
import { logger } from '../../utils/logger';

export const copyToServer = async (source: string, destination: string, options: RunOnServerOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  const absoluteSourcePath = getAboslutePath(source);
  const sourceSize = await getDirectorySize(absoluteSourcePath);
  const sourceSizeInMB = bytesToOthers(sourceSize) + ' MB';
  logger.info(`Source size: ${sourceSizeInMB}`);

  if (isLargeTransfer(sourceSize)) {
    logger.warning(`The source is too large (${sourceSizeInMB}). Compress -> Split -> Transfer`);

    await copyLargeToServer(absoluteSourcePath, sourceSizeInMB, destination, serverToRunOn);
  } else {
    const sshCommand = generateSCPCommand(serverToRunOn, absoluteSourcePath, destination);
    logger.info(`Executing : ${sshCommand.join(' ')}`);
    const output = await executeBash(sshCommand);
    logger.info(`Output: ${output}`);
  }
  logger.success(`Successfully copied ${source} to ${destination} on ${serverToRunOn.name}`);
};
