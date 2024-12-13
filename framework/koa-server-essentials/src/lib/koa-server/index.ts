import cors from '@koa/cors';
import Koa, { Context, Next } from 'koa';

import { Logger } from '@clean-stack/framework/global-types';
import { bodyParser } from '@koa/bodyparser';
import helmet from 'koa-helmet';
import getRequestInfo, { RequestInfo } from './request-parser';

declare module 'koa' {
  interface BaseContext {
    logger: Logger;
    serviceName: string;
    serviceVersion: string;
    locale: string;
    requestInfo: RequestInfo;
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
    const reqInfo = getRequestInfo(ctx);
    const childLogger = logger.child({ reqInfo });
    try {
      ctx.logger = childLogger;
      ctx.serviceName = serviceName;
      ctx.serviceVersion = serviceVersion;
      // ctx.requestInfo = reqInfo;

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
