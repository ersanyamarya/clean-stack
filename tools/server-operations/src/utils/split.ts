import { $, fs } from 'zx';
import { sizeUnits } from './files';
import { logger } from './logger';

interface SplitResult {
  numberOfParts: number;
  timeInS: number;
  splitFiles: string[];
}

export const splitFile = async (inputFile: string, splitSize: string): Promise<SplitResult> => {
  const startTime = Date.now();
  const outputPattern = `${inputFile}.part`;
  logger.info(`Splitting file ${inputFile} into ${outputPattern} with size ${splitSize}`);
  const fileSize = fs.statSync(inputFile).size;
  const splitSizeUnits = sizeUnits[splitSize.slice(-1).toUpperCase()];
  const splitSizeNumber = Number(splitSize.slice(0, -1)) * splitSizeUnits;
  const numberOfParts = Math.ceil(fileSize / splitSizeNumber);

  const output = await $`split -d -b ${splitSize} ${inputFile} ${outputPattern}`;

  if (output.exitCode !== 0) {
    throw new Error(`Failed to split file: ${output.stderr}`);
  }

  const directory = inputFile.split('/').slice(0, -1).join('/');
  const fileName = outputPattern.split('/').pop();
  const splitFiles = fs.readdirSync(directory).filter(file => file.startsWith(fileName));

  return {
    numberOfParts,
    timeInS: (Date.now() - startTime) / 1000,
    splitFiles,
  };
};
