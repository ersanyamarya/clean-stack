import { AppError } from '@clean-stack/custom-errors';
import { koaCallback } from '@clean-stack/framework/koa-server-essentials';
import { z } from 'zod';

import { grpcClientPromisify } from '@clean-stack/framework/grpc-essentials';
import { ListUsersRequest, ListUsersResponse } from '@clean-stack/grpc-proto/user';
import { CacheStore } from '@clean-stack/platform-features/cache';
import { listUsers } from '../service-clients/user-service';

// Define Zod schemas
const querySchema = z.object({
  search: z.string().optional(),
});

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  name: z.string(),
  age: z.number().min(0),
});

function getTestCallback(cacheStore: CacheStore) {
  return koaCallback(
    async ({ query, params, method, path, body, headers, ctx }) => {
      ctx.logger.info('TestController called');
      if (query.search === 'error') throw new AppError('RESOURCE_NOT_FOUND', { metadata: { resource: 'Test' } });
      if (query.search === 'invalidate') {
        await cacheStore.invalidateGroup('test');
        return {
          status: 200,
          body: 'Cache invalidated',
        };
      }
      const cacheKey = JSON.stringify({ query, params, method, path, body, locale: ctx.locale, version: ctx.serviceVersion, service: ctx.serviceName });

      const cached = await cacheStore.get(cacheKey);

      if (cached) {
        return {
          status: 200,
          body: JSON.parse(cached),
        };
      }

      const returnData = { query, params, method, path, body, locale: ctx.locale, version: ctx.serviceVersion, service: ctx.serviceName, headers };

      //delay

      /* The line `await new Promise(resolve => setTimeout(resolve, 3000));` is creating a delay of
      3000 milliseconds (3 seconds) in the execution of the code. */
      await new Promise(resolve => setTimeout(resolve, 3000));

      await cacheStore.addOrReplace(cacheKey, JSON.stringify(returnData), { ttl: 60, groups: ['test'] });

      return {
        status: 200,
        body: returnData,
      };
    },
    { querySchema }
    // { querySchema, paramsSchema, bodySchema }
  );
}

function getListUsersCallback() {
  return koaCallback(async ({ ctx }) => {
    ctx.logger.info('ListUsersController called');
    const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(listUsers())({ limit: 10, page: 1 });

    return {
      status: 200,
      body: users,
    };
  }, {});
}

export default [
  {
    name: 'listUsers',
    method: 'get',
    path: '/listUsers',
    getCallback: getListUsersCallback,
  },
  {
    name: 'postTest',
    method: 'post',
    path: '/postTest/:id',
    getCallback: getTestCallback,
  },
  {
    name: 'getTest',
    method: 'get',
    path: '/getTest',
    getCallback: getTestCallback,
  },
];
