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

  return { telemetrySdk };
}
