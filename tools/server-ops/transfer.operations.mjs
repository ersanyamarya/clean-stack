import { $, fs } from 'zx';
import logger from '../utils/color-level-logger.mjs';
import { getDirectorySize, isLargeTransfer, monitorCompressionWithZip } from './file.operations.mjs';
import { formatBytes, formatSpeed, formatTime } from './format.utils.mjs';
import { createProgressBar, formatProgressStats } from './progress.utils.mjs';
import { runOnServer, validateServer } from './server.operations.mjs';
// Configuration Constants
const SPLIT_SIZE = '16m'; // 16 MB
const MAX_CONCURRENT_TRANSFERS = 4;

async function transferFileWithProgress(file, options, onProgress) {
  const { scpOptions, username, hostname, destinationPath, fileSize } = options;
  await $`scp ${scpOptions} ${file} ${username}@${hostname}:${destinationPath}/temp/`;
  onProgress(fileSize);
}

export async function transferLargeToServer(server, sourcePath, destinationPath) {
  //check if the sourcePath is valid
  if (!fs.existsSync(sourcePath)) {
    logger.error('Source path does not exist: ' + sourcePath);
    return;
  }

  const abortController = new AbortController();

  try {
    validateServer(server);
    if (!sourcePath || !destinationPath || typeof sourcePath !== 'string' || typeof destinationPath !== 'string') {
      throw new Error('Please provide valid source and destination paths');
    }

    logger.warn('Creating directories on server...');
    await runOnServer(`mkdir -p ${destinationPath}`, server);
    await runOnServer(`rm -rf ${destinationPath}/temp && rm -rf ${destinationPath}/${sourcePath.split('/').pop()}`, server);
    await runOnServer(`mkdir -p ${destinationPath}/temp`, server);

    logger.warn('Creating temporary directory locally');
    await $`mkdir -p temp`;

    logger.warn('Compressing data...');
    const startTime = Date.now();
    process.stdout.write('\x1B[?25l');

    await monitorCompressionWithZip(sourcePath, (progress, current, total) => {
      process.stdout.write('\r\x1B[K');
      process.stdout.write(`${createProgressBar(progress)} ${(progress * 100).toFixed(1)}% | ` + `${current}/${total} files compressed`);
    });

    process.stdout.write('\x1B[?25h\n');

    const zipSize = (await $`stat -f %z temp/data.zip`).stdout.trim();
    logger.info(`Final compressed size: ${formatBytes(parseInt(zipSize))}`);

    logger.warn('Splitting data...');
    const splitStartTime = Date.now();
    await $`split -b ${SPLIT_SIZE} temp/data.zip temp/data.zip.part`;
    const splitEndTime = Date.now();
    logger.info(`Split completed in ${formatTime((splitEndTime - splitStartTime) / 1000)}`);

    const splitFiles = (await $`ls temp/data.zip.part*`).stdout.trim().split('\n');
    const totalFiles = splitFiles.length;
    const totalSize = parseInt(zipSize);

    logger.warn(`Copying ${totalFiles} parts to server (${formatBytes(totalSize)} total)...`);
    const { username, hostname, publicKeyPath } = server;
    const scpOptions = publicKeyPath ? ['-i', publicKeyPath] : [];

    process.stdout.write('\x1B[?25l');

    const chunks = [];
    for (let i = 0; i < splitFiles.length; i += MAX_CONCURRENT_TRANSFERS) {
      chunks.push(splitFiles.slice(i, i + MAX_CONCURRENT_TRANSFERS));
    }

    const updateProgress = (() => {
      let transferredSize = 0;
      let completedParts = 0;
      const transferStartTime = Date.now();
      const speedHistory = [];
      const HISTORY_LENGTH = 5;
      const UPDATE_INTERVAL = 1000;
      let lastUpdate = Date.now();

      return (addedSize, partCompleted = true) => {
        transferredSize += addedSize;
        if (partCompleted) {
          completedParts++;
        }

        const now = Date.now();
        if (now - lastUpdate >= UPDATE_INTERVAL) {
          const elapsed = (now - transferStartTime) / 1000;
          const currentSpeed = transferredSize / elapsed;

          speedHistory.push(currentSpeed);
          if (speedHistory.length > HISTORY_LENGTH) {
            speedHistory.shift();
          }

          const averageSpeed = speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;

          const remainingSize = totalSize - transferredSize;
          const eta = averageSpeed > 0 ? remainingSize / averageSpeed : 0;

          const progress = transferredSize / totalSize;

          process.stdout.write(
            '\r\x1B[K' +
              formatProgressStats({
                progress,
                transferredSize,
                totalSize,
                speed: averageSpeed,
                eta,
                completedParts,
                totalParts: totalFiles,
              })
          );

          lastUpdate = now;
        }
      };
    })();

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async file => {
        const fileSize = parseInt((await $`stat -f %z ${file}`).stdout.trim());
        return transferFileWithProgress(
          file,
          {
            scpOptions,
            username,
            hostname,
            destinationPath,
            fileSize,
          },
          size => updateProgress(size, true)
        );
      });

      await Promise.all(chunkPromises);
    }

    process.stdout.write('\x1B[?25h\n');

    logger.warn('Merging files on server...');
    await runOnServer(`cd ${destinationPath}/temp && cat data.zip.part* > data.zip`, server);

    logger.warn('Unzipping files on server...');
    await runOnServer(`cd ${destinationPath}/temp && unzip -o data.zip -d ${destinationPath}`, server);

    logger.warn('Cleaning up temporary files...');
    await runOnServer(`rm -rf ${destinationPath}/temp`, server);
    await $`rm -rf temp`;

    const totalTime = (Date.now() - startTime) / 1000;
    const avgSpeed = totalSize / totalTime;
    logger.success(`Transfer completed in ${totalTime.toFixed(1)}s (avg. ${formatSpeed(avgSpeed)})`);
  } catch (error) {
    abortController.abort();
    process.stdout.write('\x1B[?25h');
    logger.error(`Failed to copy files to server: ${error.message}`);
    throw error;
  }
}

export async function transferSmallToServer(server, sourcePath, destinationPath) {
  try {
    validateServer(server);
    if (!sourcePath || !destinationPath || typeof sourcePath !== 'string' || typeof destinationPath !== 'string') {
      throw new Error('Please provide valid source and destination paths');
    }

    logger.warn('Creating directories on server...');
    await runOnServer(`mkdir -p ${destinationPath}`, server);
    await runOnServer(`rm -rf ${destinationPath}/${sourcePath.split('/').pop()}`, server);

    logger.warn('Copying files to server...');
    const { username, hostname, publicKeyPath } = server;
    const scpOptions = publicKeyPath ? ['-i', publicKeyPath] : [];
    await $`scp -q ${scpOptions} -r ${sourcePath} ${username}@${hostname}:${destinationPath}`;

    logger.success('Files copied successfully');
  } catch (error) {
    logger.error(`Failed to copy files to server: ${error.message}`);
    throw error;
  }
}

export async function transferToServer(server, sourcePath, destinationPath) {
  const sizeOfFile = getDirectorySize(sourcePath);
  if (isLargeTransfer(sizeOfFile, SPLIT_SIZE)) {
    logger.warn('Transferring large ');
    await transferLargeToServer(server, sourcePath, destinationPath);
  } else {
    logger.info('Transferring Small');
    await transferSmallToServer(server, sourcePath, destinationPath);
  }
}
