import { Option, program } from 'commander';
import { addAction, defaultAction, listConfigAction, removeAction } from './actions/config';
import { copyToServer, runCommandOnServer, updateServer } from './actions/server';
import { isModuleError } from './modules/module-framework';
import { logError, logger } from './utils/logger';
import { logoLarge } from './utils/logo';

type ActionFunction = (...args: unknown[]) => Promise<void>;

const createCommandWrapper = (action: ActionFunction): ActionFunction => {
  return async (...args: unknown[]) => {
    try {
      await action(...args);
    } catch (error) {
      if (isModuleError(error)) {
        logger.error(error.toJSONString());
      } else {
        logError(error);
      }
    }
  };
};

const setupConfigCommands = () => {
  const configCommand = program.command('config').description('Manage server configuration');

  configCommand.command('list').option('-l, --list', 'List view').option('-t, --table', 'Table view').action(createCommandWrapper(listConfigAction));

  configCommand.command('add').description('Add a new server from the ssh config').action(createCommandWrapper(addAction));

  configCommand.command('remove').description('Remove a server from configuration').action(createCommandWrapper(removeAction));

  configCommand.command('default').description('Set or view default server').action(createCommandWrapper(defaultAction));

  return configCommand;
};

const setupServerCommands = () => {
  const serverCommand = program.command('server').description('Manage servers');

  serverCommand
    .command('run')
    .description('Run a command on a server')
    .addOption(new Option('-d, --default', 'Run command on default server').conflicts('server').default(false))
    .addOption(new Option('-s, --server <server>', 'Server to run command on').conflicts('default'))
    .addOption(new Option('-v, --verbose', 'Verbose output').default(false))
    .argument('<command>', 'Command to run on server')
    .action(createCommandWrapper(runCommandOnServer));

  serverCommand
    .command('update')
    .description('Update server packages')
    .addOption(new Option('-d, --default', 'Update default server').conflicts('server').default(false))
    .addOption(new Option('-s, --server <server>', 'Server to update').conflicts('default'))
    .addOption(new Option('-r, --raspberry-pi', 'Update firmware on Raspberry Pi').default(false))
    .addOption(new Option('-v, --verbose', 'Verbose output').default(false))
    .action(createCommandWrapper(updateServer));

  serverCommand
    .command('copy')
    .description('Copy files to a server')
    .addOption(new Option('-d, --default', 'Copy files to default server').conflicts('server').default(false))
    .addOption(new Option('-s, --server <server>', 'Server to copy files to').conflicts('default'))
    .addOption(new Option('-v, --verbose', 'Verbose output').default(false))
    .argument('<source>', 'Source file or directory to copy')
    .argument('<destination>', 'Destination path on the server')
    .action(createCommandWrapper(copyToServer));

  return serverCommand;
};

const initializeCLI = () => {
  logger.success(logoLarge);
  program.name('server-operations').description('CLI to perform server operations').version('0.0.1');

  setupConfigCommands();
  setupServerCommands();
  program.parse(process.argv);
};

initializeCLI();
