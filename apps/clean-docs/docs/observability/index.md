---
sidebar_label: Overview
sidebar_position: 1
---

# Observability in Clean Stack

Clean Stack provides comprehensive observability through OpenTelemetry integration, giving you complete visibility into your applications.

## Quick Links
- [Understanding OpenTelemetry](./what-is-otel)
- [Observability Stack Setup](./otel-clean-stack)
- [Backend Telemetry Integration](./backend-telemetry)

## Observability Components

```mermaid
graph TB
    A[Observability Stack]
    B[Data Collection]
    C[Storage]
    D[Visualization]
    
    A --> B
    A --> C
    A --> D
    
    B --> B1[OpenTelemetry SDK]
    B --> B2[Auto-Instrumentation]
    B --> B3[Custom Metrics]
    
    C --> C1[Prometheus]
    C --> C2[Loki]
    C --> C3[Tempo]
    
    D --> D1[Grafana]
    D --> D2[Dashboards]
    D --> D3[Alerts]

    classDef highlight fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class B1,C1,D1 highlight;
```

## Features at a Glance

### 1. Metrics
- Application performance metrics
- Resource utilization tracking
- Custom business metrics
- Pre-configured Grafana dashboards

### 2. Logging
- Structured logging with Pino
- Log aggregation in Loki
- Correlation with traces
- Log-based alerts

### 3. Tracing
- Distributed tracing with Tempo
- Request flow visualization
- Performance bottleneck detection
- Error tracking

### 4. Visualization
- Unified Grafana interface
- Pre-built dashboards
- Custom visualization options
- Alert configuration

## Getting Started

1. Start the observability stack:
   ```bash
   cd PLATFORM_SETUP/observability_stack
   docker-compose up -d
   ```

2. Access the interfaces:
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090
   - Tempo: http://localhost:3200

## Next Steps

1. [Learn about OpenTelemetry](./what-is-otel)
2. [Set up the observability stack](./otel-clean-stack)
3. [Implement backend telemetry](./backend-telemetry)
