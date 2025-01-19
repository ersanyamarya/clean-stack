/* eslint-disable no-async-promise-executor */
import { z } from 'zod';
import { $, fs, useBash } from 'zx';
import logger from '../utils/color-level-logger.mjs';

useBash();

// Configuration Constants
const SPLIT_SIZE = '16m'; // 16 MB
const MAX_CONCURRENT_TRANSFERS = 4;

// Schema Definitions
const ServerSchema = z.object({
  username: z.string(),
  hostname: z.string(),
  publicKeyPath: z.string().optional(),
});

// Server Configuration
const server = {
  username: 'azureuser',
  hostname: '20.86.27.245',
  publicKeyPath: '~/.ssh/the-one.pem',
};

function isLargeTransfer(bytes) {
  const inMbs = (bytes / 1024 / 1024).toFixed(2);
  console.log(inMbs);
  const splitSize = SPLIT_SIZE.split('m')[0];

  return inMbs > splitSize * 2;
}

// Utility Functions
function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function formatSpeed(bytesPerSecond) {
  return `${formatBytes(bytesPerSecond)}/s`;
}

function formatTime(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Progress Monitoring Functions
function createProgressBar(progress, length = 30) {
  const normalizedProgress = Math.max(0, Math.min(1, progress));
  const filled = Math.max(0, Math.round(normalizedProgress * length));
  const empty = Math.max(0, length - filled);
  return `[${'='.repeat(filled)}${' '.repeat(empty)}]`;
}

function formatProgressStats({ progress, transferredSize, totalSize, speed, eta, completedParts, totalParts }) {
  const stats = [
    `${createProgressBar(progress)} ${(progress * 100).toFixed(1)}%`,
    `${formatBytes(transferredSize)}/${formatBytes(totalSize)}`,
    `Speed: ${formatSpeed(speed)}`,
    `ETA: ${formatTime(eta)}`,
    `Parts: ${completedParts}/${totalParts}`,
  ];
  return stats.join(' | ');
}

// Server Operations
function validateServer(server) {
  try {
    return ServerSchema.parse(server);
  } catch (error) {
    logger.error(`Invalid server configuration: ${error.message}`);
    throw error;
  }
}

function generateSSHOptionsString(server) {
  try {
    const validatedServer = validateServer(server);
    const { username, hostname, publicKeyPath } = validatedServer;
    const sshOptions = [];
    if (publicKeyPath) {
      sshOptions.push(`-i ${publicKeyPath}`);
    }
    sshOptions.push(`${username}@${hostname}`);
    return sshOptions.join(' ');
  } catch (error) {
    logger.error(`Failed to generate SSH options string: ${error.message}`);
    throw error;
  }
}

async function runOnServer(command, server) {
  try {
    if (!command || typeof command !== 'string') {
      throw new Error('Please provide a valid command string');
    }

    validateServer(server);
    const sshOptions = await generateSSHOptionsString(server);
    const sshCommand = ['ssh', ...sshOptions.split(' '), '-t', command];
    logger.info(`Executing: ${sshCommand.join(' ')}`);
    const output = await $`${sshCommand}`;
    logger.success('Command executed successfully');
    return output;
  } catch (error) {
    logger.error(`Failed to run command on server: ${error.message}`);
    throw error;
  }
}

async function updateServer(server) {
  try {
    validateServer(server);
    const commands = ['sudo apt update -y', 'sudo apt upgrade -y', 'sudo apt autoremove -y', 'sudo apt autoclean'];

    logger.warn('Starting server update...');
    for (const command of commands) {
      await runOnServer(command, server);
    }
    logger.success('Server updated successfully');
  } catch (error) {
    logger.error(`Failed to update server: ${error.message}`);
    throw error;
  }
}

async function installPackagesOnServer(server, packages) {
  try {
    validateServer(server);
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new Error('Please provide a valid packages array');
    }

    logger.warn('Starting package installation...');
    for (const pkg of packages) {
      const command = `sudo apt install -y ${pkg}`;
      await runOnServer(command, server);
    }
    logger.success('Packages installed successfully');
  } catch (error) {
    logger.error(`Failed to install packages on server: ${error.message}`);
    throw error;
  }
}

// File Operations
function getDirectorySize(path) {
  try {
    const stats = fs.statSync(path);
    if (!stats.isDirectory()) {
      return stats.size;
    }

    const files = fs.readdirSync(path, { withFileTypes: true });
    return files.reduce((acc, file) => {
      const filePath = `${path}/${file.name}`;
      return acc + (file.isDirectory() ? getDirectorySize(filePath) : fs.statSync(filePath).size);
    }, 0);
  } catch (error) {
    logger.error(`Failed to get directory size: ${error.message}`);
    return 0;
  }
}

async function monitorCompressionWithZip(sourcePath, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get total file count
      const { stdout: fileCount } = await $`find ${sourcePath} -type f ! -path "*/\.*" | wc -l`;
      const totalFiles = parseInt(fileCount.trim());
      let processedFiles = 0;
      let lastUpdate = Date.now();
      let lastProgress = -1;

      const updateProgress = files => {
        const now = Date.now();
        const actualFiles = Math.min(files, totalFiles);
        const progress = Math.min(actualFiles / totalFiles, 1);

        if (files === totalFiles || files === 1 || (now - lastUpdate >= 100 && Math.abs(progress - lastProgress) >= 0.01)) {
          lastUpdate = now;
          lastProgress = progress;
          onProgress(progress, actualFiles, totalFiles);
        }
      };

      const process = $`zip -r temp/data.zip ${sourcePath}`;

      const handleOutput = data => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          if (line.includes('adding:')) {
            processedFiles++;
            updateProgress(processedFiles);
          }
        }
      };

      process.stdout.on('data', handleOutput);
      process.stderr.on('data', handleOutput);

      await process;
      onProgress(1, totalFiles, totalFiles);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function transferFileWithProgress(file, options, onProgress) {
  const { scpOptions, username, hostname, destinationPath, fileSize } = options;
  await $`scp ${scpOptions} ${file} ${username}@${hostname}:${destinationPath}/temp/`;
  onProgress(fileSize);
}

// Main Transfer Function
async function transferLargeToServer(server, sourcePath, destinationPath) {
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

async function transferSmallToServer(server, sourcePath, destinationPath) {
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

async function transferToServer(server, sourcePath, destinationPath) {
  const sizeOfFile = getDirectorySize(sourcePath);
  if (isLargeTransfer(sizeOfFile)) {
    logger.warn('Transferring large ');
    await transferLargeToServer(server, sourcePath, destinationPath);
  } else {
    logger.info('Transferring Small');
    await transferSmallToServer(server, sourcePath, destinationPath);
  }
}

// Main Execution
// await transferSmallToServer(server, 'dist', '/home/azureuser/smart-city');
await transferToServer(server, 'dist', '/home/azureuser/smart-city');
