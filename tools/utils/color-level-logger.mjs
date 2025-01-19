const Colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const logger = {
  error: message => {
    console.error(`${Colors.red}${message}${Colors.reset}`);
  },
  warn: message => {
    console.warn(`${Colors.yellow}${message}${Colors.reset}`);
  },
  info: message => {
    console.info(`${Colors.blue}${message}${Colors.reset}`);
  },
  success: message => {
    console.log(`${Colors.green}${message}${Colors.reset}`);
  },
  debug: message => {
    console.debug(`${Colors.yellow}${message}${Colors.reset}`);
  },
};

export default logger;
