import { initTRPC } from '@trpc/server';
// Create custom tRPC middleware for telemetry

const ALL_USERS = [
  { id: 1, name: 'bob' },
  { id: 2, name: 'alice' },
];

const trpc = initTRPC.create();

// const telemetryMiddleware = trpc.middleware(async ({ path, type, next, input }) => {
//   const tracer = trace.getTracer('trpc-server');

//   return tracer.startActiveSpan(`tRPC.${type}.${path}`, async span => {
//     try {
//       // Add input details as span attributes for better tracing
//       span.setAttribute('trpc.path', path);
//       span.setAttribute('trpc.type', type);
//       if (input) {
//         span.setAttribute('trpc.input', JSON.stringify(input));
//       }

//       // Use context to propagate the span
//       return context.with(trace.setSpan(context.active(), span), async () => {
//         const result = await next();

//         // Optional: Add result details to span
//         span.setAttribute('trpc.result', JSON.stringify(result));
//         span.setStatus({ code: SpanStatusCode.OK });

//         return result;
//       });
//     } catch (error) {
//       span.setStatus({
//         code: SpanStatusCode.ERROR,
//         message: error instanceof Error ? error.message : 'Unknown error',
//       });

//       if (error instanceof Error) {
//         span.recordException(error);
//         span.setAttribute('error.stack', error.stack || 'No stack trace');
//       }

//       throw error;
//     } finally {
//       span.end();
//     }
//   });
// });

export const publicProcedure = trpc.procedure;
// .use(telemetryMiddleware);
const trpcRouter = trpc.router({
  user: publicProcedure
    .input(Number)
    .output(Object)
    .query(req => {
      return ALL_USERS.find(user => req.input === user.id);
    }),
  users: publicProcedure.query(() => {
    // throw new Error('Not implemented');
    return ALL_USERS;
  }),
});

export { trpcRouter };

export type AppRouter = typeof trpcRouter;
