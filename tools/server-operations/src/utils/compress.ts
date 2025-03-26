import ProgressBar from 'progress';
import { $, fs } from 'zx';
import { fileCount } from './files';
import { logger } from './logger';

const OUTPUT_FILE = 'temp/archive.tar.gz';

interface CompressResult {
  numberOfFiles: number;
  compressedSize: number;
  timeInS: number;
}

export const compressDirectory = async (dir: string): Promise<CompressResult> => {
  const startTime = Date.now();
  logger.info(`Compressing directory ${dir} into ${OUTPUT_FILE}`);
  const numberOfFiles = await fileCount(dir);

  await $`mkdir -p temp`;
  await $`rm -rf ${OUTPUT_FILE}`;

  const progressBar = new ProgressBar('Progress: [:bar] :percent :etas', {
    complete: '█',
    incomplete: '░',
    width: 50,
    total: numberOfFiles,
    clear: true,
  });

  return new Promise((resolve, reject) => {
    $.quiet = true;

    const shellProcess = $`tar -czvf ${OUTPUT_FILE} ${dir}`;
    const handleOutput = (data: unknown) => {
      const lines: Array<string> = data.toString().split('\n');
      lines.forEach(line => {
        if (line) {
          progressBar.tick(1);
        }
      });
    };

    shellProcess.stdout.on('data', handleOutput);
    shellProcess.stderr.on('data', data => {
      handleOutput(data);
      logger.error(`Error: ${data.toString()}`);
    });

    shellProcess.exitCode.then(code => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        const stats = fs.statSync(OUTPUT_FILE);
        resolve({
          numberOfFiles: numberOfFiles,
          compressedSize: stats.size,
          timeInS: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
        });
      }
      $.quiet = false;
      shellProcess.kill();
    });
  });
};
