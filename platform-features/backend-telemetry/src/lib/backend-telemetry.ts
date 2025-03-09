import { Logger } from '@clean-stack/framework/global-types';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { IncomingMessage } from 'http';
import 'pino-pretty';
export type TelemetryConfig = {
  serviceName: string;
  serviceVersion: string;
  collectorUrl: string;
  initiateTelemetry?: boolean;
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
export function initTelemetry({ serviceName, serviceVersion, collectorUrl, initiateTelemetry = true }: TelemetryConfig): {
  telemetrySdk: NodeSDK | null;
  mainLogger: Logger;
} {
  let telemetrySdk: NodeSDK | null = null;
  if (initiateTelemetry) {
    console.log('Initializing telemetry SDK...');

    telemetrySdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: serviceVersion,
      }),
      traceExporter: new OTLPTraceExporter({
        url: collectorUrl + '/v1/traces',
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: collectorUrl + '/v1/metrics',
        }),
      }),
      // logRecordProcessors: [
      //   new logs.SimpleLogRecordProcessor(
      //     new OTLPLogExporter({
      //       url: collectorUrl + '/v1/logs',
      //     })
      //   ),
      // ],
      textMapPropagator: new B3Propagator(),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': { enabled: false },
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            requestHook: (span, request) => {
              if (request instanceof IncomingMessage) {
                const path = request.url?.split('?')[0] || '';
                const method = request.method || '';
                span.updateName(`${method} ${path}`);
              }
            },
          },
        }),
      ],
    });

    telemetrySdk.start();
  }

  const mainLogger = require('pino')({
    messageKey: 'message',
    // base: {
    //   serviceName,
    //   serviceVersion,
    //   environment: process.env['NODE_ENV'] || 'development',
    // },
    // mixin: () => {
    //   try {
    //     const span = trace.getActiveSpan();
    //     if (span) {
    //       const context = span.spanContext();
    //       if (context.traceId && context.spanId) {
    //         return {
    //           trace_id: context.traceId,
    //           span_id: context.spanId,
    //           trace_flags: context.traceFlags.toString(16),
    //         };
    //       }
    //     }
    //   } catch (error) {
    //     console.warn('Error extracting trace context:', error);
    //   }
    //   return {};
    // },
    // serializers: {
    //   err: require('pino').stdSerializers.err,
    // },
    level: process.env['LOG_LEVEL'] || 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        // colorize: true,
        levelFirst: true,
      },
    },
  });

  mainLogger.info('Telemetry SDK initialized successfully.');
  return { telemetrySdk, mainLogger };
}
