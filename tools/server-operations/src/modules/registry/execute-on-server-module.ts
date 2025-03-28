import { Server } from '../../sources/config';
import { executeOnServer } from '../../utils/execute-on-server';
import { ModuleError, ModuleFactory } from '../module-framework';

export type ExecuteOnServerModuleOptions = {
  command: string;
  server: Server;
  verbose?: boolean;
};

export const NAME = 'EXECUTE_ON_SERVER';
const DESCRIPTION = 'Executes a command on a remote server via SSH';
export const createExecuteOnServerModule: ModuleFactory<ExecuteOnServerModuleOptions, string> = logger => {
  return {
    name: NAME,
    description: DESCRIPTION,
    async run(options: ExecuteOnServerModuleOptions) {
      await this.validate(options);
      const { command, server, verbose = false } = options;
      try {
        return await executeOnServer(command, server, verbose);
      } catch (error) {
        throw new ModuleError(NAME, 'Command execution failed', {
          command,
          error: (error as Error).message,
        });
      }
    },
    async validate({ command, server }: ExecuteOnServerModuleOptions) {
      if (!command || command.length === 0) {
        throw new ModuleError(NAME, 'Command is required', { command });
      }
      if (!server) {
        throw new ModuleError(NAME, 'Server is required', { server });
      }
      return true;
    },
  };
};
