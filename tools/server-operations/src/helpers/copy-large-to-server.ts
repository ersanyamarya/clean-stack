import ProgressBar from 'progress';
import { Server } from '../sources/config';
import { batchProcessArray } from '../utils/batch-processing';
import { compressFiles } from '../utils/compress';
import { executeBash } from '../utils/execute-bash';
import { bytesToOthers, sizeUnits } from '../utils/files';
import { logger } from '../utils/logger';
import { splitFile } from '../utils/split';
import { generateSCPCommand, generateSSHCommand } from './ssh-helper';

const SPLIT_SIZE = '16m'; // 16 MB
const TEMP_DIR = 'tmp/archives/';
const ARCHIVE_FILE_NAME = 'archive.tar.gz';
const TAR_FILE_OUTPUT = `${TEMP_DIR}${ARCHIVE_FILE_NAME}`;

export const copyLargeToServer = async (filePath: string, sourceSizeInMB: string, destination: string, serverToRunOn: Server): Promise<void> => {
  await cleanTempDir();

  const { numberOfFiles, compressedSize, totalCompressionTime, compressedOutputFile } = await compressFiles(filePath, TAR_FILE_OUTPUT);
  logger.success(`Compressed ${sourceSizeInMB} or ${numberOfFiles} files into ${bytesToOthers(compressedSize)} MB in ${totalCompressionTime} seconds`);

  const { numberOfParts, totalSplittingTime, splitFiles } = await splitFile(compressedOutputFile, SPLIT_SIZE);
  logger.success(`Split ${compressedOutputFile} into ${numberOfParts} parts in ${totalSplittingTime} seconds`);

  logger.info(`Transferring ${numberOfParts} parts to server ${serverToRunOn.name}`);

  const tempDestinationPath = `${destination}/${TEMP_DIR}`;
  await cleanServerDestination(serverToRunOn, tempDestinationPath);

  const progressBar = new ProgressBar('Copying... : [:bar] :percent :etas', {
    complete: '█',
    incomplete: '░',
    width: 50,
    total: numberOfParts,
    clear: true,
  });

  await batchProcessArray(splitFiles, async file => {
    const sshCommand = generateSCPCommand(serverToRunOn, TEMP_DIR + file, `${tempDestinationPath}${file}`);
    await executeBash(sshCommand, false);
    progressBar.tick(1);
  });

  logger.success(`Successfully transferred ${numberOfParts} parts to server ${serverToRunOn.name}`);
  await cleanTempDir();

  logger.info(`Merging files on server ${serverToRunOn.name}`);
  const sshCommandForServerToMerge = generateSSHCommand(serverToRunOn, `cd ${tempDestinationPath} && cat ${ARCHIVE_FILE_NAME}.part* > ${ARCHIVE_FILE_NAME}`);
  await executeBash(sshCommandForServerToMerge);
  logger.success(`Successfully merged files on server ${serverToRunOn.name}`);

  logger.info(`Unzipping files on server ${serverToRunOn.name}`);
  const sshCommandForServerToUnzip = generateSSHCommand(serverToRunOn, `cd ${destination} && tar -xzf ${TAR_FILE_OUTPUT}`);
  await executeBash(sshCommandForServerToUnzip);
  logger.success(`Successfully unzipped files on server ${serverToRunOn.name}`);

  await cleanServerDestination(serverToRunOn, tempDestinationPath);
};

export const isLargeTransfer = (bytes: number): boolean => {
  const splitSizeUnits = sizeUnits[SPLIT_SIZE.slice(-1).toUpperCase()];
  const splitSize = Number(SPLIT_SIZE.slice(0, -1)) * splitSizeUnits;
  return bytes > splitSize * 2;
};

const cleanTempDir = async () => {
  logger.info(`Cleaning and preparing local temporary directory: ${TEMP_DIR}`);
  await executeBash(['rm', '-rf', TEMP_DIR]);
  await executeBash(['mkdir', '-p', TEMP_DIR]);
  logger.success(`Local temporary directory cleaned and prepared: ${TEMP_DIR}`);
};

async function cleanServerDestination(serverToRunOn: Server, tempDestinationPath: string) {
  const sshCommandForServerToDeleteDestination = generateSSHCommand(serverToRunOn, `rm -rf ${tempDestinationPath}`);
  const deleteDestinationOutput = await executeBash(sshCommandForServerToDeleteDestination);
  logger.success(`Removing destination temporary directory: ${deleteDestinationOutput}`);

  const sshCommandForServerToCreateDestination = generateSSHCommand(serverToRunOn, `mkdir -p ${tempDestinationPath}`);
  const createDestinationOutput = await executeBash(sshCommandForServerToCreateDestination);
  logger.success(`Destination temporary directory cleaned and created: ${createDestinationOutput}`);
}
