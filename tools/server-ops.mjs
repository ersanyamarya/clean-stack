import { z } from 'zod';
import { $, useBash } from 'zx';

useBash();

// Configuration Constants
const SPLIT_SIZE = '16m';
const MAX_CONCURRENT_TRANSFERS = 4;

// ANSI Color Constants
const Colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

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

// Utility Functions
function log(message, color = Colors.reset) {
  console.log(`${color}${message}${Colors.reset}`);
}

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
    throw new Error(`Invalid server configuration: ${error.message}`);
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
    log(`Failed to generate SSH options string: ${error.message}`, Colors.red);
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
    log(`Executing: ${sshCommand.join(' ')}`, Colors.blue);
    const output = await $`${sshCommand}`;
    log('Command executed successfully', Colors.green);
    return output;
  } catch (error) {
    log(`Failed to run command on server: ${error.message}`, Colors.red);
    throw error;
  }
}

async function updateServer(server) {
  try {
    validateServer(server);
    const commands = ['sudo apt update -y', 'sudo apt upgrade -y', 'sudo apt autoremove -y', 'sudo apt autoclean'];

    log('Starting server update...', Colors.yellow);
    for (const command of commands) {
      await runOnServer(command, server);
    }
    log('Server updated successfully', Colors.green);
  } catch (error) {
    log(`Failed to update server: ${error.message}`, Colors.red);
    throw error;
  }
}

async function installPackagesOnServer(server, packages) {
  try {
    validateServer(server);
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new Error('Please provide a valid packages array');
    }

    log('Starting package installation...', Colors.yellow);
    for (const pkg of packages) {
      const command = `sudo apt install -y ${pkg}`;
      await runOnServer(command, server);
    }
    log('Packages installed successfully', Colors.green);
  } catch (error) {
    log(`Failed to install packages on server: ${error.message}`, Colors.red);
    throw error;
  }
}

// File Operations
async function getDirectorySize(path) {
  try {
    const { stdout: macSize } = await $`du -sk ${path} | cut -f1`.nothrow();
    if (macSize) return parseInt(macSize) * 1024;

    const { stdout: linuxSize } = await $`du -s --bytes ${path} | cut -f1`;
    return parseInt(linuxSize);
  } catch (error) {
    const { stdout: nodeSize } = await $`find ${path} -type f -exec ls -l {} \\; | awk '{sum += $5} END {print sum}'`;
    return parseInt(nodeSize || '0');
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
async function copyToServer(server, sourcePath, destinationPath) {
  const abortController = new AbortController();

  try {
    validateServer(server);
    if (!sourcePath || !destinationPath || typeof sourcePath !== 'string' || typeof destinationPath !== 'string') {
      throw new Error('Please provide valid source and destination paths');
    }

    log('Creating directories on server...', Colors.yellow);
    await runOnServer(`mkdir -p ${destinationPath}`, server);
    await runOnServer(`mkdir -p ${destinationPath}/temp`, server);

    log('Creating temporary directory locally', Colors.yellow);
    await $`mkdir -p temp`;

    log('Compressing data...', Colors.yellow);
    const startTime = Date.now();
    process.stdout.write('\x1B[?25l');

    await monitorCompressionWithZip(sourcePath, (progress, current, total) => {
      process.stdout.write('\r\x1B[K');
      process.stdout.write(`${createProgressBar(progress)} ${(progress * 100).toFixed(1)}% | ` + `${current}/${total} files compressed`);
    });

    process.stdout.write('\x1B[?25h\n');

    const zipSize = (await $`stat -f %z temp/data.zip`).stdout.trim();
    log(`Final compressed size: ${formatBytes(parseInt(zipSize))}`, Colors.blue);

    log('Splitting data...', Colors.yellow);
    const splitStartTime = Date.now();
    await $`split -b ${SPLIT_SIZE} temp/data.zip temp/data.zip.part`;
    const splitEndTime = Date.now();
    log(`Split completed in ${formatTime((splitEndTime - splitStartTime) / 1000)}`, Colors.blue);

    const splitFiles = (await $`ls temp/data.zip.part*`).stdout.trim().split('\n');
    const totalFiles = splitFiles.length;
    const totalSize = parseInt(zipSize);

    log(`Copying ${totalFiles} parts to server (${formatBytes(totalSize)} total)...`, Colors.yellow);
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

    log('Merging files on server...', Colors.yellow);
    await runOnServer(`cd ${destinationPath}/temp && cat data.zip.part* > data.zip`, server);

    log('Unzipping files on server...', Colors.yellow);
    await runOnServer(`cd ${destinationPath}/temp && unzip -o data.zip -d ${destinationPath}`, server);

    log('Cleaning up temporary files...', Colors.yellow);
    await runOnServer(`rm -rf ${destinationPath}/temp`, server);
    await $`rm -rf temp`;

    const totalTime = (Date.now() - startTime) / 1000;
    const avgSpeed = totalSize / totalTime;
    log(`Transfer completed in ${totalTime.toFixed(1)}s (avg. ${formatSpeed(avgSpeed)})`, Colors.green);
  } catch (error) {
    abortController.abort();
    process.stdout.write('\x1B[?25h');
    log(`Failed to copy files to server: ${error.message}`, Colors.red);
    throw error;
  }
}

// Main Execution
await copyToServer(server, 'node_modules', '/home/azureuser/smart-city');
