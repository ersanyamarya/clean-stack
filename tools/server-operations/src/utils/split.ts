import { $, fs, path } from 'zx';
import { sizeUnits, type SizeUnit } from './files';
import { logger } from './logger';

/**
 * Result of a file splitting operation
 */
type SplitResult = {
  numberOfParts: number;
  totalSplittingTime: number;
  splitFiles: string[];
};

/**
 * Validates that a string is a valid size unit
 */
const isValidSizeUnit = (unit: string): unit is SizeUnit => Object.keys(sizeUnits).includes(unit);

/**
 * Validates and parses a size string (e.g., "100M", "2G") into bytes
 * @throws Error if size format is invalid
 */
const parseSplitSize = (size: string): number => {
  const unit = size.slice(-1).toUpperCase();
  const value = Number(size.slice(0, -1));

  if (isNaN(value) || !isValidSizeUnit(unit)) {
    throw new Error(`Invalid split size format: ${size}. Expected format: number followed by K, M, G, or T`);
  }

  return value * sizeUnits[unit];
};

/**
 * Calculates the number of parts needed for splitting
 */
const calculateNumberOfParts = (fileSize: number, splitSizeInBytes: number): number => Math.ceil(fileSize / splitSizeInBytes);

/**
 * Gets the list of split files in a directory matching the pattern
 */
const getSplitFiles = (directory: string, pattern: string): string[] => {
  return fs
    .readdirSync(directory)
    .filter(file => file.startsWith(pattern))
    .sort();
};

/**
 * Splits a file into multiple parts of specified size
 * @param inputFile - Path to the file to split
 * @param splitSize - Size of each part (e.g., "100M", "2G")
 * @throws Error if file doesn't exist or split operation fails
 */
export const splitFile = async (inputFile: string, splitSize: string): Promise<SplitResult> => {
  const startTime = Date.now();
  const outputPattern = `${inputFile}.part`;

  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file does not exist: ${inputFile}`);
  }

  logger.info(`Splitting file ${inputFile} into ${outputPattern} with size ${splitSize}`);

  const fileSize = fs.statSync(inputFile).size;
  const splitSizeInBytes = parseSplitSize(splitSize);
  const numberOfParts = calculateNumberOfParts(fileSize, splitSizeInBytes);

  const output = await $`split -d -b ${splitSize} ${inputFile} ${outputPattern}`;

  if (output.exitCode !== 0) {
    throw new Error(`Failed to split file: ${output.stderr}`);
  }

  const directory = path.dirname(inputFile);
  const basePattern = path.basename(outputPattern);
  const splitFiles = getSplitFiles(directory, basePattern);

  return {
    numberOfParts,
    totalSplittingTime: (Date.now() - startTime) / 1000,
    splitFiles,
  };
};
