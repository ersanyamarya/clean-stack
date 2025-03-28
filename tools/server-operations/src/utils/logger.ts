import chalk from 'chalk';
const NODE_ENV = process.env.NODE_ENV || 'development';

export type Logger = {
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  debug: (message: string) => void;
  log: (message: string) => void;
  table: (data: any) => void;
};

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
  if (NODE_ENV === 'development' && error.stack) {
    console.error(chalk.gray(error.stack));
  }
};
