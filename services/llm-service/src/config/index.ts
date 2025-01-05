import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/framework/utilities';
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
  otelCollectorUrl: z.string(),
  mongoConnectionUri: z.string(),
  azureOpenAi: z.object({
    model: z.string(),
    azureOpenAIApiKey: z.string(),
    azureOpenAIApiInstanceName: z.string(),
    azureOpenAIApiDeploymentName: z.string(),
    azureOpenAIApiVersion: z.string(),
    maxTokens: numberTransformSchema,
    timeout: numberTransformSchema,
    maxRetries: numberTransformSchema,
  }),
});

const configMapping: Record<keyof z.infer<typeof configSchema>, unknown> = {
  service: {
    name: 'LLM_SERVICE_NAME',
    version: 'LLM_SERVICE_VERSION',
  },
  server: {
    host: 'LLM_SERVICE_HOST',
    port: 'LLM_SERVICE_PORT',
  },
  otelCollectorUrl: 'OTEL_COLLECTOR_ADDRESS',
  mongoConnectionUri: 'MONGO_CONNECTION_URI',
  azureOpenAi: {
    model: 'AZURE_OPENAI_MODEL',
    azureOpenAIApiKey: 'AZURE_OPENAI_API_KEY',
    azureOpenAIApiInstanceName: 'AZURE_OPENAI_API_INSTANCE_NAME',
    azureOpenAIApiDeploymentName: 'AZURE_OPENAI_API_DEPLOYMENT_NAME',
    azureOpenAIApiVersion: 'AZURE_OPENAI_API_VERSION',
    maxTokens: 'AZURE_OPENAI_MAX_TOKENS',
    timeout: 'AZURE_OPENAI_TIMEOUT',
    maxRetries: 'AZURE_OPENAI_MAX_RETRIES',
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
