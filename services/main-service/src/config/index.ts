import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/framework/utilities';
import { z } from 'zod';

const configSchema = z.object({
  service: z.object({
    name: z.string().describe('MAIN_SERVICE_NAME'),
    version: z.string().describe('MAIN_SERVICE_VERSION'),
  }),
  server: z.object({
    address: z.string().describe('MAIN_SERVICE_ADDRESS'),
    port: numberTransformSchema.describe('MAIN_SERVICE_PORT'),
  }),
  otelCollectorUrl: z.string().describe('OTEL_COLLECTOR_ADDRESS'),
});

export type AppConfig = z.infer<typeof configSchema>;

export let config: AppConfig;

export const loadConfig = () => {
  const envConfig = loadConfigFromEnv(configSchema);
  config = envConfig;
};
