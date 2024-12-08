import { initFETelemetry } from '@clean-stack/frontend-telemetry';
import { app, collectorUrl } from './config';

initFETelemetry({
  ...app,
  collectorUrl,
  initiateTelemetry: true,
});
