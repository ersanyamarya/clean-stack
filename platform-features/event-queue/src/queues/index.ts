import { z, infer as ZodInfer } from 'zod';

export const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
});

export type EmailData = ZodInfer<typeof emailSchema>;

export const queueList = {
  sendEmail: emailSchema,
  deleteUser: z.string(),
} as const;

export type QueueList = typeof queueList;
export type AllQueueNames = keyof QueueList;
export type QueDataSchema<Q extends AllQueueNames> = ZodInfer<(typeof queueList)[Q]>;
