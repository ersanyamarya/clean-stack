import { initTelemetry } from '@clean-stack/platform-features/backend-telemetry-plugin';
import { config, loadConfig } from './config';
loadConfig();
const serviceName = config.service.name;
const serviceVersion = config.service.version;

/**
 * Initializes telemetry for the user service.
 *
 * This function sets up the main logger and telemetry SDK with the specified service name,
 * service version, and collector URL. It is crucial to initialize telemetry before anything
 * else in the codebase to ensure that all subsequent operations are properly logged and monitored.
 *
 * Having this initialization in a separate file helps in maintaining a clean and modular codebase,
 * making it easier to manage and update the telemetry configuration without affecting other parts
 * of the application.
 *
 * @param serviceName - The name of the service.
 * @param serviceVersion - The version of the service.
 * @param collectorUrl - The URL of the telemetry collector.
 * @returns An object containing the main logger and telemetry SDK.
 */
const { mainLogger, telemetrySdk } = initTelemetry({ serviceName, serviceVersion, collectorUrl: 'http://localhost:4317' });

export { mainLogger, telemetrySdk };
