import { $, fs, path } from 'zx';

/**
 * Size units in bytes for file size conversions
 * K = Kilobytes, M = Megabytes, G = Gigabytes, T = Terabytes
 */
export const sizeUnits = {
  K: 1024,
  M: 1024 ** 2,
  G: 1024 ** 3,
  T: 1024 ** 4,
} as const;

/** Available size units for conversion */
export type SizeUnit = keyof typeof sizeUnits;

/** Error type for size parsing failures */
type SizeParseError = {
  type: 'SizeParseError';
  message: string;
  rawSize: string;
};

/**
 * Gets the total size of a directory in bytes
 * @param dir - Directory path to measure
 * @returns Promise resolving to size in bytes
 * @throws {Error} If directory doesn't exist or permission denied
 */
export const getDirectorySize = async (dir: string): Promise<number> => {
  const { stdout } = await $`du -sh ${dir}`;
  const size = stdout.split('\t')[0];
  return parseSize(size);
};

/**
 * Parses a size string with unit into bytes
 * @param size - Size string like "10M" or "1.5G"
 * @returns Size in bytes
 * @throws {SizeParseError} If size format is invalid
 */
const parseSize = (size: string): number => {
  const unit = size.slice(-1);
  const value = parseFloat(size.slice(0, -1));

  if (unit in sizeUnits) {
    return value * sizeUnits[unit as SizeUnit];
  }

  const numericSize = Number(size);
  if (!Number.isNaN(numericSize)) {
    return numericSize;
  }

  throw {
    type: 'SizeParseError',
    message: `Invalid size format: ${size}`,
    rawSize: size,
  } as SizeParseError;
};

/**
 * Gets size of a single file in bytes
 * @param filePath - Path to the file
 * @returns File size in bytes
 * @throws {Error} If file doesn't exist or permission denied
 */
export const getFileSize = (filePath: string): number => {
  const stats = fs.statSync(filePath);
  return stats.size;
};

/**
 * Converts a relative path to absolute path
 * @param relativePath - Relative file/directory path
 * @returns Absolute path
 */
export const resolveRelativePath = (relativePath: string): string => path.resolve(relativePath);

/**
 * Counts number of non-hidden files in a directory recursively
 * @param dir - Directory path to count files in
 * @returns Promise resolving to number of files
 * @throws {Error} If directory doesn't exist or permission denied
 */
export const fileCount = async (dir: string): Promise<number> => {
  const { stdout } = await $`find ${dir} -type f ! -path "*/\.*" | wc -l`;
  return parseInt(stdout.trim(), 10);
};

/**
 * Converts bytes to a specified unit (MB by default)
 * @param bytes - Size in bytes to convert
 * @param unit - Target unit to convert to (K/M/G/T)
 * @returns Converted size in specified unit
 */
export const bytesToOthers = (bytes: number, unit: SizeUnit = 'M'): number => {
  // Using type assertion to ensure type safety since unit is already constrained by SizeUnit type
  const divisor = Object.entries(sizeUnits).find(([key]) => key === unit)?.[1] ?? sizeUnits.M;
  return Number((bytes / divisor).toFixed(2));
};
