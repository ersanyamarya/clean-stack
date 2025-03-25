import { checkbox } from '@inquirer/prompts';
import { listServersAsChoices, removeServersFromConfig } from '../../helpers';
import { logger } from '../../utils/logger';

export const removeAction = async () => {
  const choices = listServersAsChoices();

  if (choices.length === 0) {
    logger.warning('No servers available to remove.');
    return;
  }

  const serverNames = await checkbox({
    message: 'Select a server to remove',
    choices,
  });

  if (!serverNames || serverNames.length === 0) {
    logger.warning('No servers selected. Exiting...');
    return;
  }

  try {
    removeServersFromConfig(serverNames);
    logger.success(`Server(s) removed: ${serverNames.join(', ')}`);
  } catch (error) {
    logger.error(error.message);
  }
};
