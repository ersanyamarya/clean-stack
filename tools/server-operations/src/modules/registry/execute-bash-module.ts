import { executeBash } from '../../utils/execute-bash';
import { ModuleError, ModuleFactory } from '../module-framework';

export type ExecuteBashModuleOptions = {
  command: string[];
  verbose?: boolean;
};

export const NAME = 'EXECUTE_BASH_COMMANDS';
const DESCRIPTION = 'Executes a bash command';

export const createExecuteBashModule: ModuleFactory<ExecuteBashModuleOptions, string> = logger => {
  return {
    name: NAME,
    description: DESCRIPTION,
    async run(options: ExecuteBashModuleOptions) {
      await this.validate(options);
      const { command, verbose = true } = options;
      try {
        return await executeBash(command, verbose);
      } catch (error) {
        throw new ModuleError(NAME, 'Command execution failed', {
          command,
          error: (error as Error).message,
        });
      }
    },
    async validate({ command }: ExecuteBashModuleOptions) {
      if (!command || command.length === 0) {
        throw new ModuleError(NAME, 'Command is required', { command });
      }
      return true;
    },
  };
};

export type ExecuteBashModuleType = ReturnType<typeof createExecuteBashModule>;
