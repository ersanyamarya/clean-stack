import { Option, program } from 'commander';
import { addAction, defaultAction, listConfigAction, removeAction } from './actions/config';
import { runCommandOnServer, updateServer } from './actions/server';
import { logError, logger } from './utils/logger';
import { logoLarge } from './utils/logo';

// Display banner at startup
logger.success(logoLarge);

program.name('server-operations').description('CLI to perform server operations').version('0.0.1');

const configCommand = program.command('config').description('Manage server configuration');

configCommand.command('list').option('-l, --list', 'List view').option('-t, --table', 'Table view').action(actionWithTryCatch(listConfigAction));
configCommand.command('add').description('Add a new server from the ssh config').action(actionWithTryCatch(addAction));
configCommand.command('remove').description('Remove a server from configuration').action(actionWithTryCatch(removeAction));
configCommand.command('default').description('Set or view default server').action(actionWithTryCatch(defaultAction));

const serverCommand = program.command('server').description('Manage servers');

serverCommand
  .command('run')
  .description('Run a command on a server')

  .addOption(new Option('-d, --default', 'Run command on default server').conflicts('server').default(false))
  .addOption(new Option('-s, --server <server>', 'Server to run command on').conflicts('default'))
  .argument('<command>', 'Command to run on server')
  .action(actionWithTryCatch(runCommandOnServer));

serverCommand
  .command('update')
  .description('Update server packages')
  .addOption(new Option('-d, --default', 'Update default server').conflicts('server').default(false))
  .addOption(new Option('-s, --server <server>', 'Server to update').conflicts('default'))
  .addOption(new Option('-r, --raspberry-pi', 'Update firmware on Raspberry Pi').default(false))
  .action(actionWithTryCatch(updateServer));

program.parse(process.argv);

function actionWithTryCatch(action: (...args: any[]) => any) {
  return async (...args: any[]) => {
    try {
      await action(...args);
    } catch (error) {
      logError(error);
    }
  };
}
