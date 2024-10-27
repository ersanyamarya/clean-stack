---
sidebar_position: 3
---

# Backend-Telemetry Library and Usage

The Backend-Telemetry Library is a crucial component of Clean Stack, providing a standardized way to implement observability across different services. Let's break down its implementation and usage:

## Backend-Telemetry Library (backend-telemetry.ts)

The library sets up OpenTelemetry instrumentation for Node.js applications. Here are the key aspects:

1. **Diagnostic Logging Setup**:

   ```typescript
   import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
   diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);
   ```

   This configures the OpenTelemetry diagnostic logger to only show ERROR level logs, reducing noise during development and production.

2. **NodeSDK Configuration**:

   ```typescript
   const telemetrySdk = new NodeSDK({
     resource: new Resource({
       'service.name': config.serviceName,
       'service.version': config.serviceVersion,
     }),
     // ... other configurations
   });
   ```

   The SDK is set up with service name and version, which are crucial for identifying the source of telemetry data in a microservices architecture.

3. **Exporters Setup**:

   ```typescript
   traceExporter: new OTLPTraceExporter({
     url: config.collectorUrl,
   }),
   metricReader: new PeriodicExportingMetricReader({
     exporter: new OTLPMetricExporter({
       url: config.collectorUrl,
     }),
   }),
   ```

   These configurations ensure that traces and metrics are sent to the OpenTelemetry Collector specified in the config.

4. **Auto-Instrumentations**:

   ```typescript
   instrumentations: [
     getNodeAutoInstrumentations({
       '@opentelemetry/instrumentation-fs': { enabled: false },
     }),
   ],
   ```

   This sets up automatic instrumentation for various Node.js modules, with the file system instrumentation disabled to reduce noise.

5. **Pino Logger Initialization**:
   ```typescript
   const mainLogger = require('pino')({
     level: 'debug',
     transport: {
       target: 'pino-pretty',
       options: {
         colorize: true,
       },
     },
   });
   ```
   :::tip[The Pino logger is initialized after the telemetry SDK starts.] This order is important because some instrumentations might affect logging, and we want to ensure all telemetry is properly set up before any logging occurs. :::

## Usage in User Service

The user service demonstrates how to use the Backend-Telemetry Library effectively:

1. **Initialization (init.ts)**:
   ```typescript
   import { initTelemetry } from '@clean-stack/backend-telemetry';
   import { config, loadConfig } from './config';
   loadConfig();
   const { mainLogger, telemetrySdk } = initTelemetry({
     serviceName: config.service.name,
     serviceVersion: config.service.version,
     collectorUrl: 'http://localhost:4317',
   });
   ```
   :::tip[This file initializes telemetry before anything else in the service.] It's in a separate file to:
   - Ensure telemetry is set up before any other operations
   - Keep the main application code clean and focused
   - Make it easier to manage telemetry configuration :::
2. **Usage in Main Application (main.ts)**:

   ```typescript
   import { mainLogger, telemetrySdk } from './init';

   // ... application code ...

   const onsShutdown = () => {
     mainLogger.info('Shutting down server');
     telemetrySdk.shutdown();
   };
   ```

   The main application imports the initialized logger and telemetry SDK. It also ensures proper shutdown of the telemetry SDK when the application terminates.

## Key Takeaways

1. **Early Initialization**: Telemetry is initialized at the very beginning to capture all possible data.
2. **Separation of Concerns**: Keeping telemetry initialization in a separate file (`init.ts`) improves code organization and maintainability.
3. **Consistent Configuration**: The library allows for consistent telemetry setup across different services in the Clean Stack.
4. **Proper Shutdown**: The telemetry SDK is properly shut down when the application terminates, ensuring all data is flushed.
5. **Flexible Configuration**: The library accepts configuration parameters, allowing each service to specify its name, version, and collector URL.

This setup ensures that Clean Stack has a robust, consistent, and easily manageable observability solution across all its services, facilitating easier debugging, monitoring, and performance optimization.
