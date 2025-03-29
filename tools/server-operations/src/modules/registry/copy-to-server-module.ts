import { Server } from '../../sources/config';
import { copyToServer } from '../../utils/copy-to-server';
import { ModuleError, ModuleFactory } from '../module-framework';

export type CopyToServerModuleOptions = {
  source: string;
  destination: string;
  server: Server;
  verbose?: boolean;
  splitSize?: string;
  tempDir?: string;
  archiveFileName?: string;
};

export const NAME = 'COPY_TO_SERVER';
const DESCRIPTION = 'Copies a file to a remote server via SCP. For large files, it will split the file into smaller chunks and transfer them in parallel.';
export const createCopyToServerModule: ModuleFactory<CopyToServerModuleOptions, string> = logger => {
  return {
    name: NAME,
    description: DESCRIPTION,
    async run(options: CopyToServerModuleOptions) {
      await this.validate(options);
      const { source, destination, server, verbose = false, splitSize = '16M', tempDir = 'tmp/archives/', archiveFileName = 'archive.tar.gz' } = options;

      try {
        return await copyToServer(source, destination, server, verbose);
      } catch (error) {
        throw new ModuleError(NAME, 'Copy failed', {
          source,
          destination,
          server,
          error: (error as Error).message,
        });
      }
    },
    async validate({ source, destination, server }: CopyToServerModuleOptions) {
      if (!source || source.length === 0) {
        throw new ModuleError(NAME, 'Source is required', { source });
      }
      if (!destination || destination.length === 0) {
        throw new ModuleError(NAME, 'Destination is required', { destination });
      }
      if (!server) {
        throw new ModuleError(NAME, 'Server is required', { server });
      }
      return true;
    },
  };
};
