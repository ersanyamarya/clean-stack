import { logger } from '../../utils/logger';
import { NAME as COPY_TO_SERVER_NAME, createCopyToServerModule } from './copy-to-server-module';
import { createExecuteBashModule, NAME as EXECUTE_BASH_NAME } from './execute-bash-module';
import { createExecuteOnServerModule, NAME as EXECUTE_ON_SERVER_NAME } from './execute-on-server-module';

export const moduleRegistry = {
  [EXECUTE_BASH_NAME]: createExecuteBashModule(logger),
  [EXECUTE_ON_SERVER_NAME]: createExecuteOnServerModule(logger),
  [COPY_TO_SERVER_NAME]: createCopyToServerModule(logger),
} as const;

export type ModuleRegistryType = typeof moduleRegistry;
export type ModuleName = keyof ModuleRegistryType;
