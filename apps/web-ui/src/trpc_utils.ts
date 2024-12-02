// eslint-disable-next-line @nx/enforce-module-boundaries
import type { AppRouter } from '@clean-stack/trpc-router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
