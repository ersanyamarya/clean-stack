import { Server } from '../../../sources/config';

/** Configuration options for the CopyToServer module */
export type CopyToServerModuleOptions = {
  /** Source file or directory to copy */
  source: string;
  /** Destination path on the remote server */
  destination: string;
  /** Remote server configuration */
  server: Server;
  /** Enable verbose logging */
  verbose?: boolean;
  /** Size threshold for splitting files (e.g. '16M') */
  splitSize?: string;
  /** Temporary directory for processing */
  tempDir?: string;
  /** Name of the archive file */
  archiveFileName?: string;
};

export type TransferOptions = {
  verbose: boolean;
  splitSize: string;
  tempDir: string;
  archiveFileName: string;
};