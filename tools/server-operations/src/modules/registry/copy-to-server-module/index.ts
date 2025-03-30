import { copyToServer } from '../../../utils/copy-to-server';
import { getDirectorySize } from '../../../utils/files';
import { ModuleError, ModuleFactory } from '../../module-framework';
import { cleanup } from './cleanup';

import { handleLargeTransfer, isLargeTransfer } from './transfer';
import { CopyToServerModuleOptions } from './types';

export const NAME = 'COPY_TO_SERVER';
const DESCRIPTION = 'Copies a file to a remote server via SCP. For large files, it will split the file into smaller chunks and transfer them in parallel.';

/** Creates a CopyToServer module with the given logger */
export const createCopyToServerModule: ModuleFactory<CopyToServerModuleOptions, string> = moduleLogger => {
  return {
    name: NAME,
    description: DESCRIPTION,

    async validate({ source, destination }: CopyToServerModuleOptions): Promise<boolean> {
      if (!source?.length) throw createValidationError(NAME, 'source', source);
      if (!destination?.length) throw createValidationError(NAME, 'destination', destination);
      return true;
    },

    async run(options: CopyToServerModuleOptions): Promise<string> {
      await this.validate(options);

      const { source, destination, server, verbose = false, splitSize = '16M', tempDir = 'tmp/archives/', archiveFileName = 'archive.tar.gz' } = options;

      try {
        const totalSourceSize = await getDirectorySize(source);

        if (isLargeTransfer(totalSourceSize, splitSize)) {
          await handleLargeTransfer(source, destination, server, totalSourceSize, { verbose, splitSize, tempDir, archiveFileName }, moduleLogger);
          await cleanup(server, tempDir, destination, verbose);
        } else {
          moduleLogger.info(`Transferring file directly to server ${server.name}`);
          await copyToServer(source, destination, server, verbose);
        }

        return `Successfully copied ${source} to ${destination} on ${server.name}`;
      } catch (error) {
        throw new ModuleError(NAME, error instanceof Error ? error.message : String(error), {
          source,
          destination,
          server: `${server.user}@${server.host}`,
        });
      }
    },
  };
};
function createValidationError(NAME: string, arg1: string, source: string) {
  throw new ModuleError(NAME, `Invalid argument: ${arg1} is required`, {
    source,
    destination: source,
  });
}
