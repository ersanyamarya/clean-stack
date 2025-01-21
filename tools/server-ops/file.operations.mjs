import { $, fs } from 'zx';
import logger from '../utils/color-level-logger.mjs';

export function getDirectorySize(path) {
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

export function isLargeTransfer(bytes, SPLIT_SIZE) {
  const inMbs = (bytes / 1024 / 1024).toFixed(2);
  console.log(inMbs);
  const splitSize = SPLIT_SIZE.split('m')[0];

  return inMbs > splitSize * 2;
}

export async function monitorCompressionWithZip(sourcePath, onProgress) {
  // eslint-disable-next-line no-async-promise-executor
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
