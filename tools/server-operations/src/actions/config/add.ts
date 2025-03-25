import { checkbox } from '@inquirer/prompts';
import { addServersFromSShConfig } from '../../helpers';
import { addServers } from '../../sources/config';
import { logger } from '../../utils/logger';

export const addAction = async () => {
  logger.info('Adding a new server from the ssh config');
  const { choices, getParsedServer } = addServersFromSShConfig();
  const answers = await checkbox({
    message: 'Select servers to add',
    choices: choices,
  }).catch(error => {
    logger.error(error);
  });

  if (!answers || answers.length === 0) {
    logger.warning('No servers selected. Exiting...');
    return;
  }

  addServers(answers.map(getParsedServer));
};
