import { diag, DiagConsoleLogger, DiagLogLevel, metrics, trace } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ATTR_CLIENT_ADDRESS, ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
export type FETelemetryConfig = {
  appName: string;
  appVersion: string;
  collectorUrl: string;
  initiateTelemetry?: boolean;
};

const createExporters = (collectorUrl: string): { otlpExporter: OTLPTraceExporter; otlpMetricExporter: OTLPMetricExporter } => {
  const otlpExporter = new OTLPTraceExporter({
    headers: {
      'Content-Type': 'application/json',
    },
    url: collectorUrl + '/v1/traces',
  });

  const otlpMetricExporter = new OTLPMetricExporter({
    headers: {
      'Content-Type': 'application/json',
    },
    url: collectorUrl + '/v1/metrics',
  });

  return { otlpExporter, otlpMetricExporter };
};

export const initFETelemetry = ({ appName, appVersion, collectorUrl, initiateTelemetry = true }: FETelemetryConfig): void => {
  if (!initiateTelemetry) {
    return;
  }

  // Enable debug logging for OpenTelemetry
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  // Override console methods to include trace context
  const originalConsole = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  function addTraceContext(method: 'log' | 'debug' | 'info' | 'warn' | 'error', ...args: any[]) {
    const span = trace.getActiveSpan();
    if (span) {
      const context = span.spanContext();
      const traceInfo = {
        trace_id: context.traceId,
        span_id: context.spanId,
      };
      originalConsole[method](...args, traceInfo);
    } else {
      originalConsole[method](...args);
    }
  }

  // Override console methods
  console.log = (...args) => addTraceContext('log', ...args);
  console.debug = (...args) => addTraceContext('debug', ...args);
  console.info = (...args) => addTraceContext('info', ...args);
  console.warn = (...args) => addTraceContext('warn', ...args);
  console.error = (...args) => addTraceContext('error', ...args);

  // Create a custom resource
  const resource = new Resource({
    [ATTR_SERVICE_NAME]: appName,
    [ATTR_SERVICE_VERSION]: appVersion,
    [ATTR_CLIENT_ADDRESS]: window.location.origin,
  });

  const { otlpExporter, otlpMetricExporter } = createExporters(collectorUrl);

  const tracingProvider = new WebTracerProvider({
    resource: resource,
    spanProcessors: [new BatchSpanProcessor(otlpExporter)],
  });
  tracingProvider.register({
    contextManager: new ZoneContextManager(),
    propagator: new B3Propagator(),
  });

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: otlpMetricExporter,
        exportIntervalMillis: 30 * 1000, // 30 seconds
      }),
    ],
    mergeResourceWithDefaults: true,
  });

  metrics.setGlobalMeterProvider(meterProvider);

  initWebVitals(meterProvider);

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          enabled: true,
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [/^http:\/\/localhost(:\d+)?\/.*$/], // Match localhost and IP addresses
          applyCustomAttributesOnSpan: span => {
            const spanData = Object.assign({}, span) as any;
            const url = spanData.attributes?.['http.url'];
            span.updateName(createSpanName(url, spanData.name));
          },
        },
        '@opentelemetry/instrumentation-xml-http-request': {
          enabled: true,
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [/^http:\/\/localhost(:\d+)?\/.*$/], // Match localhost and IP addresses
        },
        '@opentelemetry/instrumentation-document-load': { enabled: true },
        '@opentelemetry/instrumentation-user-interaction': { enabled: false },
      }),
    ],
    tracerProvider: tracingProvider,
    meterProvider: meterProvider,
  });

  // Debug log to confirm initialization
  console.debug('OpenTelemetry initialization completed');
};

function initWebVitals(meterProvider: MeterProvider) {
  function sendMetric(metric: any) {
    const { name, value, rating } = metric;
    console.log(`Web Vitals - ${name}: ${value} (${rating})`);

    const meter = meterProvider.getMeter('web-vitals');

    const vitalMetric = meter.createHistogram(`web_vital_${name.toLowerCase()}`, {
      description: `Web Vital - ${name}`,
    });

    vitalMetric.record(value, {
      rating: rating,
      metric_name: name,
    });
  }

  onCLS(sendMetric);
  onLCP(sendMetric);
  onTTFB(sendMetric);
  onINP(sendMetric);
}

function createSpanName(url: string, name: string) {
  const { host, pathname } = new URL(url);
  return `${name} ${host} ${pathname}`;
}
