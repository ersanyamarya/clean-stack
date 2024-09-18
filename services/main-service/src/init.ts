import { initTelemetry } from '@clean-stack/backend-telemetry';
import { config, loadConfig } from './config';
loadConfig();
const serviceName = config.service.name;
const serviceVersion = config.service.version;
const collectorUrl = config.otelCollectorUrl;

const { mainLogger, telemetrySdk } = initTelemetry({ serviceName, serviceVersion, collectorUrl });

export { mainLogger, telemetrySdk };
