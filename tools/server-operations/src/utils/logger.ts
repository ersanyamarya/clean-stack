import chalk from 'chalk';

export const logger = {
  info: (message: string) => console.log(chalk.blue(message)),
  success: (message: string) => console.log(chalk.green(message)),
  error: (message: string) => console.log(chalk.red(`🚨 ${message}`)),
  warning: (message: string) => console.log(chalk.yellow(message)),
  debug: (message: string) => console.log(chalk.gray(message)),
  log: (message: string) => console.log(message),
  table: (data: any) => {
    console.table(data);
  },
};
export const logError = (error: Error) => {
  console.error(chalk.red(error.message));
  if (error.stack) {
    console.error(chalk.gray(error.stack));
  }
};
