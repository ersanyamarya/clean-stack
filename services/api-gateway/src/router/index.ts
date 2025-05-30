import { grpcClientPromisify } from '@clean-stack/framework/grpc-essentials';
import { ListUsersRequest, ListUsersResponse } from '@clean-stack/grpc-proto/user';
import { RequestContext } from '@clean-stack/http-server';
import { os } from '@orpc/server';
import z from 'zod';
import { listUsers } from '../service-clients/user-service';
// Define schemas and routes

const base = os.$context<RequestContext>();

export const getAllUsers = base
  .route({
    method: 'GET',
    path: '/user/getAll',
  })
  .errors({
    NOT_FOUND: {
      code: 404,
      message: 'Resource not found',
    },
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      page: z.number().int().min(1).optional(),
    })
  )
  .output(
    z.object({
      users: z.array(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          photoUrl: z.string().optional(),
          id: z.string(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })
      ),
    })
  )

  .handler(async ({ input, errors }) => {
    const { limit = 10, page = 1 } = input;
    // throw new AppError('RESOURCE_NOT_FOUND', {
    //   context: { limit, page },
    //   metadata: { resource: 'Users' },
    // });
    const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(listUsers())({ limit, page });
    return users;
  });

export const router = {
  user: {
    getAll: getAllUsers,
  },
};

export type APIGatewayRouter = typeof router;
