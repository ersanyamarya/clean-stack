import ProgressBar from 'progress';
import { $, fs } from 'zx';
import { fileCount } from './files';
import { logger } from './logger';

interface CompressResult {
  numberOfFiles: number;
  compressedSize: number;
  totalCompressionTime: number;
  compressedOutputFile: string;
}

export const compressDirectory = async (dir: string, outputfile: string): Promise<CompressResult> => {
  const startTime = Date.now();
  logger.info(`Compressing directory ${dir} into ${outputfile}`);
  const numberOfFiles = await fileCount(dir);
  const progressBar = new ProgressBar('Progress: [:bar] :percent :etas', {
    complete: '█',
    incomplete: '░',
    width: 50,
    total: numberOfFiles,
    clear: true,
  });

  return new Promise((resolve, reject) => {
    $.quiet = true;

    const shellProcess = $`tar -czvf ${outputfile} ${dir}`;
    const handleOutput = (data: unknown) => {
      const lines: Array<string> = data.toString().split('\n');
      lines.forEach(line => {
        if (line) {
          progressBar.tick(1);
        }
      });
    };

    shellProcess.stdout.on('data', handleOutput);
    shellProcess.stderr.on('data', handleOutput);

    shellProcess.exitCode.then(code => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        const stats = fs.statSync(outputfile);
        resolve({
          numberOfFiles: numberOfFiles,
          compressedSize: stats.size,
          totalCompressionTime: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
          compressedOutputFile: outputfile,
        });
      }
      $.quiet = false;
      shellProcess.kill();
    });
  });
};
