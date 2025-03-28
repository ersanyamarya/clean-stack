import { $ } from 'zx';
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
      $.shell = '/bin/bash';
      $.verbose = verbose;
      return new Promise((resolve, reject) => {
        const shellProcess = $`${command}`;
        shellProcess.stderr.on('data', data => {
          if (verbose) logger.error(data.toString());
        });

        shellProcess.exitCode.then(code => {
          if (code !== 0) {
            reject(new ModuleError(NAME, `Command failed with exit code ${code}`, { command }));
          } else {
            resolve('Command executed successfully');
          }
          $.verbose = false;
          shellProcess.kill();
        });
      });
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
