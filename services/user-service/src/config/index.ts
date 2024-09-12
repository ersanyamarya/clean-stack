import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/utilities';
import { z } from 'zod';

const configSchema = z.object({
  service: z.object({
    name: z.string(),
    version: z.string(),
  }),
  server: z.object({
    host: z.string(),
    port: numberTransformSchema,
  }),
});

const configMapping: Record<keyof z.infer<typeof configSchema>, unknown> = {
  service: {
    name: 'USER_SERVICE_NAME',
    version: 'USER_SERVICE_VERSION',
  },
  server: {
    host: 'USER_SERVICE_HOST',
    port: 'USER_SERVICE_PORT',
  },
};

type AppConfig = z.infer<typeof configSchema> & {
  address: string;
};

export let config: AppConfig;

export const loadConfig = () => {
  const envConfig = loadConfigFromEnv(configSchema, configMapping);
  config = { ...envConfig, address: `${envConfig.server.host}:${envConfig.server.port}` };
};
