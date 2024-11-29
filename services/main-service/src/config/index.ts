import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/framework/utilities';
import { z } from 'zod';

const configSchema = z.object({
  service: z.object({
    name: z.string(),
    version: z.string(),
  }),
  server: z.object({
    address: z.string(),
    port: numberTransformSchema,
  }),
  otelCollectorUrl: z.string(),
});

const configMapping: Record<keyof z.infer<typeof configSchema>, unknown> = {
  service: {
    name: 'MAIN_SERVICE_NAME',
    version: 'MAIN_SERVICE_VERSION',
  },
  server: {
    address: 'MAIN_SERVICE_ADDRESS',
    port: 'MAIN_SERVICE_PORT',
  },
  otelCollectorUrl: 'OTEL_COLLECTOR_ADDRESS',
};

export type AppConfig = z.infer<typeof configSchema>;

export let config: AppConfig;

export const loadConfig = () => {
  const envConfig = loadConfigFromEnv(configSchema, configMapping);
  config = envConfig;
};
