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

  /**
   * Initializes the main logger using the 'pino' library with a 'pino-pretty' transport.
   * The logger is configured to display debug level messages with colorized output.
   *
   * @remarks
   * The logger is instantiated only after the instrumentation has started to ensure
   * that all necessary configurations and dependencies are properly set up. If the
   * logger is instantiated before the instrumentation, it may not function correctly
   * due to missing or incomplete setup.
   */
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
