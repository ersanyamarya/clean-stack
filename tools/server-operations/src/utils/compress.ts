import type { Stats } from 'fs';
import ProgressBar, { ProgressBarOptions } from 'progress';
import { $, fs } from 'zx';
import { fileCount } from './files';
import { logger } from './logger';

/**
 * Result of a compression operation
 */
type CompressResult = {
  readonly numberOfFiles: number;
  readonly compressedSize: number;
  readonly totalCompressionTime: number;
  readonly compressedOutputFile: string;
};

/**
 * Creates a progress bar with the given configuration
 */
const createProgressBar = (total: number): ProgressBar => {
  const config: ProgressBarOptions = {
    complete: '█',
    incomplete: '░',
    width: 50,
    total,
    clear: true,
  };
  return new ProgressBar('Progress: [:bar] :percent :etas', config);
};

/**
 * Handles the output from the compression process
 */
const createOutputHandler =
  (progressBar: ProgressBar, verbose: boolean) =>
  (data: unknown): void => {
    const lines = String(data).split('\n');
    lines.forEach(line => {
      if (line) {
        progressBar.tick(1);
        if (verbose) {
          logger.info(`Processing: ${line}`);
        }
      }
    });
  };

/**
 * Calculates compression metrics from the start time and file stats
 */
const calculateCompressionMetrics = (startTime: number, stats: Stats, numberOfFiles: number, outputfile: string): CompressResult => ({
  numberOfFiles,
  compressedSize: stats.size,
  totalCompressionTime: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
  compressedOutputFile: outputfile,
});

/**
 * Compresses files in a directory using tar
 * @param dir - Directory to compress
 * @param outputfile - Output file path for the compressed archive
 * @param verbose - Whether to log verbose output
 * @returns Promise resolving to compression results
 * @throws Error if compression fails
 */
export const compressFiles = async (dir: string, outputfile: string, verbose = false): Promise<CompressResult> => {
  const startTime = Date.now();

  logger.info(`Create the temporary directory if it doesn't exist`);
  await fs.ensureDir(outputfile.split('/').slice(0, -1).join('/'));

  logger.info(`Compressing directory ${dir} into ${outputfile}`);

  const numberOfFiles = await fileCount(dir);
  const progressBar = createProgressBar(numberOfFiles);

  return new Promise((resolve, reject) => {
    try {
      $.quiet = true;

      const shellProcess = $`COPYFILE_DISABLE=1 tar --exclude-vcs --exclude=".DS_Store" --no-xattrs -czvf ${outputfile} -C ${dir} .`;
      const handleOutput = createOutputHandler(progressBar, verbose);

      shellProcess.stdout.on('data', handleOutput);
      shellProcess.stderr.on('data', data => {
        handleOutput(data);
        if (verbose) logger.error(`Error: ${data}`);
      });

      shellProcess.exitCode.then(code => {
        if (code !== 0) {
          reject(new Error(`Compression failed with exit code ${code}`));
          return;
        }

        try {
          const stats = fs.statSync(outputfile);
          resolve(calculateCompressionMetrics(startTime, stats, numberOfFiles, outputfile));
        } catch (error) {
          reject(new Error(`Failed to get stats for compressed file: ${error instanceof Error ? error.message : String(error)}`));
        } finally {
          $.quiet = false;
          shellProcess.kill();
        }
      });
    } catch (error) {
      $.quiet = false;
      reject(new Error(`Compression process failed: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
};
