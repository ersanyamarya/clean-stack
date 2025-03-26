import { generateSCPCommand, getServerToRunOn, RunOnServerOptions } from '../../helpers';
import { compressDirectory } from '../../utils/compress';
import { executeBash } from '../../utils/execute-bash';
import { bytesToOthers, getAboslutePath, getDirectorySize, sizeUnits } from '../../utils/files';
import { logger } from '../../utils/logger';
import { splitFile } from '../../utils/split';

const SPLIT_SIZE = '16m'; // 16 MB
const TEMP_DIR = 'temp';
const TAR_FILE_OUTPUT = `${TEMP_DIR}/archive.tar.gz`;

export const copyToServer = async (source: string, destination: string, options: RunOnServerOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  const absoluteSourcePath = getAboslutePath(source);
  const sourceSize = await getDirectorySize(absoluteSourcePath);
  const sourceSizeInMB = bytesToOthers(sourceSize) + ' MB';
  logger.info(`Source size: ${sourceSizeInMB}`);

  if (isLargeTransfer(sourceSize)) {
    logger.warning(`The source is too large (${sourceSizeInMB}). Compress -> Split -> Transfer`);
    await executeBash(['mkdir', '-p', TEMP_DIR]);
    await executeBash(['rm', '-rf', TAR_FILE_OUTPUT]);

    const { numberOfFiles, compressedSize, timeInS, outputFile } = await compressDirectory(absoluteSourcePath, TAR_FILE_OUTPUT);
    logger.success(`Compressed ${sourceSizeInMB} or ${numberOfFiles} files into ${bytesToOthers(compressedSize)} MB in ${timeInS} seconds`);
    const { numberOfParts, timeInS: splitTime, splitFiles } = await splitFile(outputFile, SPLIT_SIZE);
    logger.success(`Split ${outputFile} into ${numberOfParts} parts in ${splitTime} seconds`);

    logger.info(`Deleting ${outputFile}`);
    await executeBash(['rm', '-rf', outputFile]);
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
