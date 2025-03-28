import { $, fs, path } from 'zx';
export const sizeUnits = {
  K: 1024,
  M: 1024 ** 2,
  G: 1024 ** 3,
  T: 1024 ** 4,
} as const;
export type SizeUnit = keyof typeof sizeUnits;

const isFileOrDirectory = (path: string): 'file' | 'directory' => {
  return fs.lstatSync(path).isDirectory() ? 'directory' : 'file';
};

export const getDirectorySize = async (dir: string): Promise<number> => {
  const { stdout } = await $`du -sh ${dir}`;
  const size = stdout.split('\t')[0];
  return parseSize(size);
};

const parseSize = (size: string): number => {
  const unit = size.slice(-1);
  const value = parseFloat(size.slice(0, -1));
  if (unit in sizeUnits) {
    return value * sizeUnits[unit as keyof typeof sizeUnits];
  }
  if (!isNaN(Number(size))) {
    return Number(size);
  }
  throw new Error(`Unknown size format: ${size}`);
};

export const getFileSize = (filePath: string): number => {
  return fs.statSync(filePath);
};

export const getAboslutePath = (relativePath: string) => {
  const absolutePath = path.resolve(relativePath);
  return absolutePath;
};

export const fileCount = async (dir: string): Promise<number> => {
  const { stdout: fileCount } = await $`find ${dir} -type f ! -path "*/\.*" | wc -l`;
  return parseInt(fileCount.trim());
};

export const bytesToOthers = (bytes: number, unit: SizeUnit = 'M'): number => {
  return parseFloat((bytes / sizeUnits[unit]).toFixed(2));
};
