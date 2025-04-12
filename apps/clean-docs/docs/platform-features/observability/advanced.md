---
sidebar_position: 4
---

# Advanced Configuration

This guide covers advanced configuration options for OpenTelemetry in Clean Stack.

## Custom Sampling

Clean Stack supports custom sampling strategies for traces:

```typescript
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBased(0.1), // Sample 10% of traces
});

sdk.setGlobalTracerProvider(
  new NodeTracerProvider({
    sampler,
    resource: createResource(),
  })
);
```

## Batch Processor Configuration

Customize the batch processor settings for better performance:

```typescript
const spanProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,
  scheduledDelayMillis: 5000,
  maxExportBatchSize: 512,
});
```

## Custom Attributes

Add custom attributes to all spans and metrics:

```typescript
const resource = Resource.default().merge(
  new Resource({
    'service.name': 'my-service',
    'deployment.environment': process.env.NODE_ENV,
    'custom.attribute': 'value',
  })
);
```

## Manual Instrumentation

For custom business logic:

```typescript
const tracer = trace.getTracer('my-custom-tracer');

tracer.startActiveSpan('operation-name', span => {
  span.setAttribute('custom.attribute', 'value');
  try {
    // Your code here
  } finally {
    span.end();
  }
});
```

## Context Propagation

Configure custom context propagation:

```typescript
const propagator = new CompositePropagator({
  propagators: [new W3CTraceContextPropagator(), new B3Propagator(), new JaegerPropagator()],
});

propagation.setGlobalPropagator(propagator);
```

## Custom Metrics

Define and record custom metrics:

```typescript
const meter = metrics.getMeter('my-custom-metrics');

const requestCounter = meter.createCounter('requests', {
  description: 'Count of requests',
});

const requestDuration = meter.createHistogram('request_duration', {
  description: 'Duration of requests',
  unit: 'ms',
});
```

## Error Handling

Configure error handling for exporters:

```typescript
exporter.on('error', error => {
  console.error('Exporter error:', error);
  // Custom error handling logic
});
```

For more information about exporters, see the [Exporters](./exporters) guide.
