import { moduleRegistry } from '../../modules/registry';
import { resolveRelativePath } from '../../utils/files';
import { logger } from '../../utils/logger';
import { ServerSelectionOptions, getServerToRunOn } from '../types';

export const copyToServer = async (source: string, destination: string, options: ServerSelectionOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  const copyToServerModule = moduleRegistry['COPY_TO_SERVER'];
  const output = await copyToServerModule.run({
    source: resolveRelativePath(source),
    destination,
    server: serverToRunOn,
    verbose: options.verbose,
  });

  logger.success(output);
};
