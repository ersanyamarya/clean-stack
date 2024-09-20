import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

export type TelemetryConfig = {
  serviceName: string;
  serviceVersion: string;
  collectorUrl: string;
};

/**
 * Initializes the telemetry SDK and main logger for the backend service.
 *
 * @param {TelemetryConfig} config - The configuration object for telemetry setup.
 * @returns {{ telemetrySdk: NodeSDK, mainLogger: pino.Logger }} An object containing the initialized telemetry SDK and main logger.
 *
 * @remarks
 * This function sets up the telemetry SDK using the provided configuration, including
 * resource attributes, trace and metric exporters, and auto-instrumentations. It also
 * initializes the main logger using the 'pino' library with a 'pino-pretty' transport,
 * configured to display debug level messages with colorized output.
 *
 * The logger is instantiated only after the instrumentation has started to ensure
 * that all necessary configurations and dependencies are properly set up. If the
 * logger is instantiated before the instrumentation, it may not function correctly
 * due to missing or incomplete setup.
 */
export function initTelemetry(config: TelemetryConfig) {
  const telemetrySdk = new NodeSDK({
    resource: new Resource({
      'service.name': config.serviceName,
      'service.version': config.serviceVersion,
    }),
    traceExporter: new OTLPTraceExporter({
      url: config.collectorUrl,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: config.collectorUrl,
      }),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  telemetrySdk.start();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mainLogger = require('pino')({
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  return { telemetrySdk, mainLogger };
}
