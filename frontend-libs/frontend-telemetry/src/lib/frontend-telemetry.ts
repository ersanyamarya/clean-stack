import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export type FETelemetryConfig = {
  appName: string;
  appVersion: string;
  collectorUrl: string;
  initiateTelemetry?: boolean;
};

export const initFETelemetry = ({ appName, appVersion, collectorUrl, initiateTelemetry = true }: FETelemetryConfig): void => {
  if (!initiateTelemetry) {
    return;
  }

  // Create a custom resource
  const resource = new Resource({
    [ATTR_SERVICE_NAME]: appName,
    [ATTR_SERVICE_VERSION]: appVersion,
  });

  // Initialize the OTLP exporter
  const otlpExporter = new OTLPTraceExporter({
    url: `${collectorUrl}/v1/traces`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const provider = new WebTracerProvider({
    resource: resource,
    spanProcessors: [new BatchSpanProcessor(otlpExporter)],
  });

  const contextManager = new ZoneContextManager();
  const propagator = new B3Propagator();

  // Register the tracer provider with propagator
  provider.register({
    contextManager,
    propagator,
  });

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          enabled: true,
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [/.*/], // Match all URLs
          // applyCustomAttributesOnSpan: span => {
          //   span.setAttribute('client.name', appName);
          //   // Debug log the trace context
          //   const currentContext = context.active();
          //   const spanContext = trace.getSpan(currentContext)?.spanContext();
          //   console.debug('Current trace context:', spanContext);
          // },
        },
        '@opentelemetry/instrumentation-xml-http-request': {
          enabled: true,
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [/.*/], // Match all URLs
        },
        '@opentelemetry/instrumentation-document-load': { enabled: true },
        '@opentelemetry/instrumentation-user-interaction': { enabled: true },
      }),
    ],
    tracerProvider: provider,
  });

  // Debug log to confirm initialization
  console.debug('OpenTelemetry initialization completed');
};
