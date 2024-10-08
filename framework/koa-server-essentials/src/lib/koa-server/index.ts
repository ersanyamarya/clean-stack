import cors from '@koa/cors';
import Koa, { Context } from 'koa';

import { Logger } from '@clean-stack/framework/global-types';
import { bodyParser } from '@koa/bodyparser';
import helmet from 'koa-helmet';

declare module 'koa' {
  interface BaseContext {
    logger: Logger;
    serviceName: string;
    serviceVersion: string;
    locale: string;
  }
}

export type ErrorCallback = (error: unknown, ctx: Context) => void;

export type ServerEssentialsOptions = {
  logger: Logger;
  errorCallback: ErrorCallback;
  serviceName: string;
  serviceVersion: string;
  localeCookieName?: string;
};

export async function getKoaServer({ logger, errorCallback, serviceName, serviceVersion, localeCookieName }: ServerEssentialsOptions) {
  logger.info('Setting up Koa Server');
  const app = new Koa();
  app.use(helmet());
  app.use(async (ctx, next) => {
    try {
      ctx.logger = logger;
      ctx.serviceName = serviceName;
      ctx.serviceVersion = serviceVersion;

      if (localeCookieName) {
        const cookies = ctx.cookies;
        ctx.locale = cookies.get(localeCookieName) || 'en';
      } else {
        ctx.locale = 'en';
      }
      await next();
    } catch (error) {
      errorCallback(error, ctx);
    }
  });
  app.use(cors());

  app.use(
    bodyParser({
      encoding: 'utf-8',
      enableTypes: ['json', 'form', 'text', 'xml'],
      formLimit: '56kb',
      onError: errorCallback,
    })
  );

  return app;
}
