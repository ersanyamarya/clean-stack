import { initFETelemetry } from '@clean-stack/frontend-telemetry';

initFETelemetry({
  appName: 'my-react-app',
  appVersion: '1.0.0',
  collectorUrl: 'http://localhost:4318',
  initiateTelemetry: true,
});
