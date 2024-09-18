import { initTelemetry } from '@clean-stack/backend-telemetry';
import { config, loadConfig } from './config';
loadConfig();
const serviceName = config.service.name;
const serviceVersion = config.service.version;

const { mainLogger, telemetrySdk } = initTelemetry({ serviceName, serviceVersion, collectorUrl: 'http://localhost:4317' });

export { mainLogger, telemetrySdk };
