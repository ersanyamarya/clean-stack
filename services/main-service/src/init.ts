import { initTelemetry } from '@clean-stack/backend-telemetry';
const { mainLogger, telemetrySdk } = initTelemetry({ serviceName: 'main-service', serviceVersion: '1.0.0', collectorUrl: 'http://localhost:4317' });
export { mainLogger, telemetrySdk };
