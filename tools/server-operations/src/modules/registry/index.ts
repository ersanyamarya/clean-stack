import { logger } from '../../utils/logger';
import { createExecuteBashModule, NAME as EXECUTE_BASH_NAME, ExecuteBashModuleType } from './execute-bash-module';
import { createExecuteOnServerModule, NAME as EXECUTE_ON_SERVER_NAME } from './execute-on-server-module';

export const moduleRegistry = {
  [EXECUTE_BASH_NAME]: createExecuteBashModule(logger),
  [EXECUTE_ON_SERVER_NAME]: createExecuteOnServerModule(logger),
} as const;

export type ModuleRegistryType = typeof moduleRegistry;
export type ModuleName = keyof ModuleRegistryType;

export type { ExecuteBashModuleType as ExecuteBashToolType };
