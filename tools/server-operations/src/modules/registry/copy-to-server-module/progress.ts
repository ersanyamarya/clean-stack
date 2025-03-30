import ProgressBar from 'progress';

/** Creates a progress bar for file transfer */
export const createProgressBar = (total: number): ProgressBar =>
  new ProgressBar('Copying... : [:bar] :percent :etas', {
    complete: '█',
    incomplete: '░',
    width: 50,
    total,
    clear: true,
  });
