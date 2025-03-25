import ProgressBar from 'progress';
import { $, fs } from 'zx';
import { logger } from './logger';

const OUTPUT_FILE = 'temp/archive.tar.gz';

export const compressDirectory = async (dir: string, numberOfFiles: number): Promise<string> => {
  logger.info(`Compressing directory ${dir} into ${OUTPUT_FILE}`);

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
      // logger.error(data.toString());
    });

    shellProcess.exitCode.then(code => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        resolve(fs.statSync(OUTPUT_FILE).size);
      }
      $.quiet = false;
      shellProcess.kill();
    });
  });
};
