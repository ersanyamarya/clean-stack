---
sidebar_position: 1
---

# Framework Components

Clean Stack provides several core framework components that handle common concerns in a type-safe and maintainable way.

## Koa Server Essentials

Located in `framework/koa-server-essentials`, this package provides a standardized Koa server setup with:

### Core Features
- Built-in middleware for security, CORS, and body parsing
- Request validation using Zod schemas
- Standardized error handling
- Automatic OpenTelemetry instrumentation
- Type-safe route handlers

### Usage Example

```typescript
import { createKoaServer, koaCallback } from '@clean-stack/framework/koa-server-essentials';
import { z } from 'zod';

const querySchema = z.object({
  search: z.string(),
  page: z.number()
});

const server = await createKoaServer({
  name: 'my-service',
  port: 3000,
  errorCallback: handleError
});

router.get('/search', koaCallback(searchController, { querySchema }));
```

## gRPC Essentials

Located in `framework/grpc-essentials`, this package provides abstractions for gRPC service communication:

### Core Features
- Service controller patterns for protected and public endpoints
- Built-in error handling and metadata propagation
- Automatic request logging and tracing
- Clean separation between client and server implementations

### Usage Example

```typescript
import { protectedServiceController } from '@clean-stack/framework/grpc-essentials';

const serviceController = protectedServiceController(
  handleRequest,
  handleError,
  authMiddleware,
  logger
);
```

## Framework Utilities

Located in `framework/utilities`, this package provides common utilities:

### Key Features
- Graceful shutdown handling for services
- Environment configuration loader
- Custom Zod validation types
- Exception handlers with proper logging

### Usage Example

```typescript
import { gracefulShutdown } from '@clean-stack/framework/utilities';

gracefulShutdown(logger, async () => {
  await cleanupResources();
}, server);
```

## Common Features Across Framework

All framework components share these characteristics:

1. **Type Safety**
   - Extensive use of TypeScript
   - Zod validation schemas
   - Strong typing for all APIs

2. **Error Handling**
   - Consistent error patterns
   - Proper error propagation
   - Error tracking and logging

3. **Observability**
   - OpenTelemetry integration
   - Request metadata tracking
   - Unified logging approach

4. **Middleware Composition**
   - Pluggable middleware architecture
   - Consistent middleware patterns
   - Easy extensibility
