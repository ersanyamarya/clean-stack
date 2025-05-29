import { RequestContext } from '@clean-stack/http-server';
import { os } from '@orpc/server';
import { z } from 'zod';

// Define schemas and routes
export const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

const base = os.$context<RequestContext>();

export const listPlanet = base
  .route({
    method: 'GET',
    path: '/planets',
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .output(z.array(PlanetSchema).describe('List of planets'))
  .handler(async ({ input }) => {
    // your list code here
    return [{ id: 1, name: 'name' }];
  });

export const findPlanet = base
  .route({
    method: 'GET',
    path: '/planets/{id}',
  })
  .input(z.object({ id: z.coerce.number().int().min(1) }))
  .output(PlanetSchema.describe('Applee'))
  .handler(async ({ input, context }) => {
    // your find code here
    return { id: 1, name: 'name', cookies: context };
  });

export const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
  },
};

export type APIGatewayRouter = typeof router;
