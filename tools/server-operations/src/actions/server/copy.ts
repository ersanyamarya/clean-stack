import { generateSCPCommand, getServerToRunOn, RunOnServerOptions } from '../../helpers';
import { compressDirectory } from '../../utils/compress';
import { executeBash } from '../../utils/execute-bash';
import { bytesToOthers, fileCount, getAboslutePath, getDirectorySize, sizeUnits } from '../../utils/files';
import { logger } from '../../utils/logger';

const SPLIT_SIZE = '16m'; // 16 MB

export const copyToServer = async (source: string, destination: string, options: RunOnServerOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  const absoluteSourcePath = getAboslutePath(source);
  const sourceSize = await getDirectorySize(absoluteSourcePath);
  const sourceSizeInMB = bytesToOthers(sourceSize) + ' MB';
  logger.info(`Source size: ${sourceSizeInMB}`);

  if (isLargeTransfer(sourceSize)) {
    logger.warning(`The source is too large (${sourceSizeInMB}). Compress -> Split -> Transfer`);

    const numberOfFiles = await fileCount(absoluteSourcePath);
    const compressResult = await compressDirectory(absoluteSourcePath, numberOfFiles);

    logger.success(`Compressed ${sourceSizeInMB} or ${numberOfFiles} files into ${bytesToOthers(parseInt(compressResult))} MB`);
  } else {
    const sshCommand = generateSCPCommand(serverToRunOn, absoluteSourcePath, destination);
    logger.info(`Executing : ${sshCommand.join(' ')}`);
    const output = await executeBash(sshCommand);
    logger.info(`Output: ${output}`);
  }
  logger.success(`Successfully copied ${source} to ${destination} on ${serverToRunOn.name}`);
};

const isLargeTransfer = (bytes: number): boolean => {
  const splitSizeUnits = sizeUnits[SPLIT_SIZE.slice(-1).toUpperCase()];
  const splitSize = Number(SPLIT_SIZE.slice(0, -1)) * splitSizeUnits;
  return bytes > splitSize * 2;
};
