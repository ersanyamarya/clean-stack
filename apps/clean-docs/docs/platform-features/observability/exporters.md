---
sidebar_position: 3
---

# OpenTelemetry Exporters

This guide explains how Clean Stack configures and uses OpenTelemetry exporters for sending telemetry data to various backends.

## Configured Exporters

Clean Stack comes pre-configured with the following exporters:

### Trace Exporters

- **OTLP Trace Exporter**: Sends trace data to the OpenTelemetry Collector using gRPC
  - Default endpoint: `localhost:4317`
  - Protocol: gRPC
  - Configurable via environment variables:
    - `OTEL_EXPORTER_OTLP_ENDPOINT`
    - `OTEL_EXPORTER_OTLP_HEADERS`

### Metrics Exporters

- **OTLP Metrics Exporter**: Sends metrics data to the OpenTelemetry Collector using gRPC
  - Same configuration options as the trace exporter
  - Supports aggregation and temporality options

## Configuration

The exporters are configured in the following locations:

- Backend: `platform-features/backend-telemetry/src/config.ts`
- Frontend: `frontend-libs/frontend-telemetry/src/config.ts`

Example configuration:

```typescript
export const tracerConfig = {
  collectorOptions: {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
    headers: JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS || '{}'),
  },
};
```

## Custom Exporters

To add a custom exporter:

1. Install the exporter package
2. Configure the exporter in the relevant configuration file
3. Register the exporter with the SDK

For more advanced configuration options, see the [Advanced Configuration](./advanced) guide.
