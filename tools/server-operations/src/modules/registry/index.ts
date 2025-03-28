import { logger } from '../../utils/logger';
import { createExecuteBashModule, NAME as EXECUTE_BASH_NAME, ExecuteBashModuleType } from './execute-bash-module';

export const moduleRegistry = {
  [EXECUTE_BASH_NAME]: createExecuteBashModule(logger),
} as const;
export type ModuleRegistry = typeof moduleRegistry;
export type ModuleName = keyof ModuleRegistry;

export type { ExecuteBashModuleType as ExecuteBashToolType };
