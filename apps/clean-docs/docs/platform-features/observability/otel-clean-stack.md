---
sidebar_label: OpenTelemetry Setup
---

# OpenTelemetry Implementation Guide

This guide covers the practical implementation of observability in Clean Stack using OpenTelemetry.

## Quick Setup

```typescript
import { initTelemetry } from '@clean-stack/backend-telemetry';

await initTelemetry('user-service', {
  tracing: true,
  metrics: true,
  logging: true,
});
```

## Configuration Options

### Basic Configuration

```typescript
interface TelemetryConfig {
  serviceName: string;
  environment?: 'development' | 'staging' | 'production';
  version?: string;
  tracing?: boolean | TracingConfig;
  metrics?: boolean | MetricsConfig;
  logging?: boolean | LoggingConfig;
}
```

### Advanced Options

```typescript
interface AdvancedConfig extends TelemetryConfig {
  exporters?: {
    tracing?: TracingExporter[];
    metrics?: MetricsExporter[];
    logging?: LoggingExporter[];
  };
  samplers?: {
    tracing?: TracingSamplerConfig;
  };
  propagators?: PropagatorConfig[];
}
```

## Tracing

### Request Tracing

```typescript
import { trace } from '@clean-stack/backend-telemetry';

// Create a span
const span = trace.getTracer('my-service').startSpan('operation-name');

try {
  // Add attributes
  span.setAttribute('user.id', userId);

  // Add events
  span.addEvent('cache.miss');

  // Your business logic
  await doSomething();
} catch (error) {
  // Record errors
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Automatic Instrumentation

Clean Stack automatically instruments:

- HTTP/HTTPS requests
- gRPC calls
- Database operations
- Cache operations
- Queue operations

## Metrics

### Custom Metrics

```typescript
import { metrics } from '@clean-stack/backend-telemetry';

// Create counter
const requestCounter = metrics.getMetric('requests_total', {
  description: 'Total number of requests',
  unit: '1',
  valueType: ValueType.INT64,
});

// Increment counter
requestCounter.add(1, {
  endpoint: '/users',
  method: 'GET',
});
```

### Default Metrics

Automatically collected metrics include:

- CPU usage
- Memory usage
- Event loop lag
- HTTP request duration
- gRPC call latency
- Cache hit/miss ratio

## Structured Logging

### Basic Logging

```typescript
import { logger } from '@clean-stack/backend-telemetry';

logger.info('User action completed', {
  userId: '123',
  action: 'login',
  duration: 150,
});
```

### Context Enrichment

```typescript
import { enrichContext } from '@clean-stack/backend-telemetry';

// Add context to all logs in this scope
enrichContext(
  {
    requestId: '456',
    tenant: 'acme-corp',
  },
  async () => {
    logger.info('Processing request');
    await processRequest();
    logger.info('Request completed');
  }
);
```

## Best Practices

1. **Span Management**

   ```typescript
   // DO: Use the withSpan helper
   await withSpan('operation-name', async span => {
     // Your code here
   });

   // DON'T: Forget to end spans
   const span = tracer.startSpan('operation');
   // ... code without ending span
   ```

2. **Error Handling**

   ```typescript
   // DO: Record exceptions with context
   try {
     await riskyOperation();
   } catch (error) {
     span.recordException(error, {
       attributes: {
         'error.type': error.name,
         'error.message': error.message,
       },
     });
     throw error;
   }
   ```

3. **Performance Impact**
   ```typescript
   // DO: Use sampling for high-throughput operations
   const config: TracingSamplerConfig = {
     type: 'probabilistic',
     ratio: 0.1, // Sample 10% of traces
   };
   ```

## Troubleshooting

### Common Issues

1. **Missing Traces**

   - Check exporter configuration
   - Verify sampling settings
   - Ensure spans are being ended

2. **High Cardinality**

   - Limit number of unique tag values
   - Use enumerated values where possible
   - Configure appropriate sampling

3. **Performance Impact**
   - Adjust sampling rates
   - Optimize attribute collection
   - Monitor telemetry overhead

## Next Steps

- [Grafana Integration](./grafana-stack)
- [Custom Exporters Setup](./exporters)
- [Advanced Configurations](./advanced)
