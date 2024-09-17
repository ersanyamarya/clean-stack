import { initTelemetry } from '@clean-stack/backend-telemetry';
initTelemetry({ serviceName: 'main-service', serviceVersion: '1.0.0', collectorUrl: 'http://localhost:4317' });
