import { select } from '@inquirer/prompts';
import { listServersAsChoices, setDefaultServerInConfig } from '../../helpers';
import { logger } from '../../utils/logger';

export const defaultAction = async () => {
  const choices = listServersAsChoices();

  if (choices.length === 0) {
    logger.warning('No servers available to set as default.');
    return;
  }

  const serverName = await select({
    message: 'Select a server to set as default',
    choices,
  });

  try {
    setDefaultServerInConfig(serverName);
    logger.success(`Server ${serverName} set as default.`);
  } catch (error) {
    logger.error(error.message);
  }
};
