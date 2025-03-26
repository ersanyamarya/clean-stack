import ProgressBar from 'progress';
import { Server } from '../sources/config';
import { batchProcessArray } from '../utils/batch-processing';
import { compressDirectory } from '../utils/compress';
import { executeBash } from '../utils/execute-bash';
import { bytesToOthers, sizeUnits } from '../utils/files';
import { logger } from '../utils/logger';
import { splitFile } from '../utils/split';
import { generateSCPCommand, generateSSHCommand } from './ssh-helper';

const SPLIT_SIZE = '16m'; // 16 MB
const TEMP_DIR = 'temp/';
const TAR_FILE_OUTPUT = `${TEMP_DIR}archive.tar.gz`;

export const copyLargeToServer = async (filePath: string, sourceSizeInMB: string, destination: string, serverToRunOn: Server): Promise<void> => {
  await prepareTempDirectory();

  const { numberOfFiles, compressedSize, totalCompressionTime, compressedOutputFile } = await compressDirectory(filePath, TAR_FILE_OUTPUT);
  logger.success(`Compressed ${sourceSizeInMB} or ${numberOfFiles} files into ${bytesToOthers(compressedSize)} MB in ${totalCompressionTime} seconds`);

  const { numberOfParts, totalSplittingTime, splitFiles } = await splitFile(compressedOutputFile, SPLIT_SIZE);
  logger.success(`Split ${compressedOutputFile} into ${numberOfParts} parts in ${totalSplittingTime} seconds`);

  logger.info(`Transferring ${numberOfParts} files to server ${serverToRunOn.name}`);

  const tempDestinationPath = `${destination}/${TEMP_DIR}`;
  await prepareServerDestination(serverToRunOn, tempDestinationPath);

  const progressBar = new ProgressBar('Progress: [:bar] :percent :etas', {
    complete: '█',
    incomplete: '░',
    width: 50,
    total: numberOfParts,
    clear: true,
  });

  await batchProcessArray(splitFiles, async file => {
    const sshCommand = generateSCPCommand(serverToRunOn, TEMP_DIR + file, `${tempDestinationPath}${file}`);
    await executeBash(sshCommand, true);
    progressBar.tick(1);
  });

  logger.success(`Successfully transferred ${numberOfParts} files to server ${serverToRunOn.name}`);

  logger.info(`Deleting ${compressedOutputFile}`);
  await executeBash(['rm', '-rf', compressedOutputFile]);
};

export const isLargeTransfer = (bytes: number): boolean => {
  const splitSizeUnits = sizeUnits[SPLIT_SIZE.slice(-1).toUpperCase()];
  const splitSize = Number(SPLIT_SIZE.slice(0, -1)) * splitSizeUnits;
  return bytes > splitSize * 2;
};

const prepareTempDirectory = async () => {
  logger.info(`Preparing local temporary directory: ${TEMP_DIR}`);
  await executeBash(['rm', '-rf', TEMP_DIR]);
  await executeBash(['mkdir', '-p', TEMP_DIR]);
  logger.success(`Temporary directory ${TEMP_DIR} is ready`);
};
async function prepareServerDestination(serverToRunOn: Server, tempDestinationPath: string) {
  const sshCommandForServerToDeleteDestination = generateSSHCommand(serverToRunOn, `rm -rf ${tempDestinationPath}`);
  const deleteDestinationOutput = await executeBash(sshCommandForServerToDeleteDestination);
  logger.success(`Removing destination temporary directory: ${deleteDestinationOutput}`);

  const sshCommandForServerToCreateDestination = generateSSHCommand(serverToRunOn, `mkdir -p ${tempDestinationPath}`);
  const createDestinationOutput = await executeBash(sshCommandForServerToCreateDestination);
  logger.success(`Creating destination temporary directory: ${createDestinationOutput}`);
}
