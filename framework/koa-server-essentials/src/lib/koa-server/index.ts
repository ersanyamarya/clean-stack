import cors from '@koa/cors';
import Koa, { Context, Next } from 'koa';

import { Logger } from '@clean-stack/framework/global-types';
import { bodyParser } from '@koa/bodyparser';
import helmet from 'koa-helmet';
import getRequestInfo from './request-parser';

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
  async function setupContextMiddleware(ctx: Context, next: Next) {
    const childLogger = logger.child({ reqInfo: getRequestInfo(ctx) });
    try {
      ctx.logger = childLogger;
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
  }

  app.use(async function securityHeadersMiddleware(ctx, next) {
    return helmet()(ctx, next);
  });
  app.use(setupContextMiddleware);
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
