import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/framework/utilities';
import { z } from 'zod';

const configSchema = z.object({
  service: z.object({
    name: z.string().describe('API_GATEWAY_SERVICE_NAME'),
    version: z.string().describe('API_GATEWAY_SERVICE_VERSION'),
  }),
  server: z.object({
    host: z.string().describe('API_GATEWAY_SERVICE_HOST'),
    port: numberTransformSchema.describe('API_GATEWAY_SERVICE_PORT'),
    address: z.string().describe('API_GATEWAY_SERVICE_ADDRESS'),
  }),
  otelCollectorUrl: z.string().describe('OTEL_COLLECTOR_ADDRESS'),
  mongoConnectionUri: z.string().describe('MONGO_CONNECTION_URI'),
  userServiceAddress: z.string().describe('USER_SERVICE_ADDRESS'),
  llmServiceAddress: z.string().describe('LLM_SERVICE_ADDRESS'),
});

export let config: z.infer<typeof configSchema>;

export const loadConfig = () => {
  const envConfig = loadConfigFromEnv(configSchema);
  config = envConfig;
};
