import { Server } from '../../../sources/config';
import { batchProcessArray } from '../../../utils/batch-processing';
import { compressFiles } from '../../../utils/compress';
import { copyToServer } from '../../../utils/copy-to-server';
import { executeBash, executeBashWithProgress } from '../../../utils/execute-bash';
import { fileCount, sizeUnits } from '../../../utils/files';
import { Logger } from '../../../utils/logger';
import { splitFile } from '../../../utils/split';
import { generateSSHCommand } from '../../../utils/ssh-utils';
import { createProgressBar } from './progress';
import { TransferOptions } from './types';

/** Determines if a file is large enough to require splitting */
export const isLargeTransfer = (bytes: number, splitSize: string): boolean => {
  const splitSizeUnits = sizeUnits[splitSize.slice(-1).toUpperCase()];
  const splitSizeBytes = Number(splitSize.slice(0, -1)) * splitSizeUnits;
  return bytes > splitSizeBytes * 2;
};

/** Handles merging and extracting files on the remote server */
export const processSplitFilesOnServer = async (
  sourceFileCount: number,
  server: Server,
  destination: string,
  tempDir: string,
  archiveFileName: string,
  logger: Logger,
  verbose: boolean
): Promise<void> => {
  logger.info(`Merging parts on server ${server.name}`);
  const mergeCommand = generateSSHCommand(server, `cd ${destination}/${tempDir} && cat ${archiveFileName}.part* > ${archiveFileName}`);
  await executeBash(mergeCommand, verbose);

  logger.info(`Extracting ${sourceFileCount} files on server ${server.name}`);
  const extractCommand = generateSSHCommand(server, `cd ${destination} && tar -xzvf ${tempDir}${archiveFileName} | while read line; do echo "PROGRESS"; done`);
  const output = await executeBashWithProgress(extractCommand, sourceFileCount, 'Extracting files', 'PROGRESS');
  logger.success(output);
};

/** Handles the transfer of large files by splitting them into chunks */
export const handleLargeTransfer = async (
  source: string,
  destination: string,
  server: Server,
  totalSourceSize: number,
  options: TransferOptions,
  logger: Logger
): Promise<void> => {
  const { verbose, splitSize, tempDir, archiveFileName } = options;
  const tarFileOutput = `${tempDir}${archiveFileName}`;
  const sourceFileCount = await fileCount(source);

  const compressResult = await compressFiles(source, tarFileOutput, verbose);
  logger.success(`Compressed ${totalSourceSize} bytes into ${compressResult.compressedSize} bytes in ${compressResult.totalCompressionTime}s`);

  const splitResult = await splitFile(compressResult.compressedOutputFile, splitSize);
  logger.success(`Split ${compressResult.compressedSize} bytes into ${splitResult.numberOfParts} parts`);

  const createTempDirCommand = generateSSHCommand(server, `mkdir -p ${destination}/${tempDir}`);
  await executeBash(createTempDirCommand, verbose);

  logger.info(`Transferring ${splitResult.numberOfParts} parts to server ${server.name}`);
  const progressBar = createProgressBar(splitResult.numberOfParts);

  await batchProcessArray(splitResult.splitFiles, async file => {
    await copyToServer(`${tempDir}${file}`, `${destination}/${tempDir}${file}`, server, verbose);
    progressBar.tick(1);
  });

  logger.success(`Successfully transferred ${splitResult.numberOfParts} parts to server ${server.name}`);
  await processSplitFilesOnServer(sourceFileCount, server, destination, tempDir, archiveFileName, logger, verbose);
};
