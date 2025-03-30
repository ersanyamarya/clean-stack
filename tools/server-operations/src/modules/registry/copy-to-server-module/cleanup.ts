import { Server } from '../../../sources/config';
import { executeBash } from '../../../utils/execute-bash';
import { executeOnServer } from '../../../utils/execute-on-server';
/** Handles the cleanup of temporary files both locally and on the remote server */
export const cleanup = async (server: Server, tempDir: string, destination: string, verbose: boolean): Promise<void> => {
  const destinationTempPath = `${destination}/${tempDir}`.replace(/\/$/, '');
  await executeOnServer(`rm -rf ${destinationTempPath}`, server, verbose);
  await executeBash(['rm', '-rf', tempDir]);
};
