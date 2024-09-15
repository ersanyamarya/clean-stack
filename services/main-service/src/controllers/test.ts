import { AppError } from '@clean-stack/custom-errors';
import { Controller, koaCallback } from '@clean-stack/koa-server-essentials';
import { z, infer as ZodInfer } from 'zod';

import { grpcClientPromisify } from '@clean-stack/grpc-essentials';
import { ListUsersRequest, ListUsersResponse } from '@clean-stack/grpc-proto';
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

const ListUsersController: Controller<undefined, undefined, undefined> = async ({ ctx }) => {
  ctx.logger.info('ListUsersController called');
  const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(listUsers())({ limit: 10, page: 1 });

  return {
    status: 200,
    body: users,
  };
};

const TestController: Controller<ZodInfer<typeof querySchema>, ZodInfer<typeof paramsSchema>, ZodInfer<typeof bodySchema>> = async ({
  query,
  params,
  method,
  path,
  body,
  headers,
  ctx,
}) => {
  ctx.logger.info('TestController called');

  if (query.search === 'error') throw new AppError('RESOURCE_NOT_FOUND', { metadata: { resource: 'Test' } });
  if (params.id === 'error') throw new AppError('USER_UNAUTHENTICATED', { metadata: { resource: 'Test' } });

  return {
    status: 200,
    body: { query, params, method, path, body, locale: ctx.locale, version: ctx.serviceVersion, service: ctx.serviceName },
  };
};

export default [
  {
    name: 'listUsers',
    method: 'get',
    path: '/listUsers',
    callback: koaCallback(ListUsersController),
  },
  {
    name: 'postTest',
    method: 'post',
    path: '/postTest/:id',
    callback: koaCallback(TestController, { querySchema, paramsSchema, bodySchema }),
  },
  {
    name: 'getTest',
    method: 'get',
    path: '/getTest',
    callback: koaCallback(TestController, { querySchema }),
  },
];
