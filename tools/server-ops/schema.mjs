import { z } from 'zod';

export const ServerSchema = z.object({
  username: z.string(),
  hostname: z.string(),
  publicKeyPath: z.string().optional(),
});
