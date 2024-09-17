import pino from 'pino';

const mainLogger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
export { mainLogger };
