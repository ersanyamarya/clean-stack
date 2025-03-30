import { z } from 'zod';

export const serverSchema = z
  .object({
    name: z.string(),
    host: z.string(),
    user: z.string(),
    password: z.string().optional(),
    privateKey: z.string().optional(),
    port: z.number().default(22),
  })
  .refine(data => data.password || data.privateKey, {
    message: 'Either password or privateKey is required',
    path: ['password'],
  });

export type Server = z.infer<typeof serverSchema>;
