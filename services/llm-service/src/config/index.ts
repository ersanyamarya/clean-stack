import { loadConfigFromEnv, numberTransformSchema } from '@clean-stack/framework/utilities';
import { z } from 'zod';

const configSchema = z.object({
  service: z.object({
    name: z.string().describe('LLM_SERVICE_NAME'),
    version: z.string().describe('LLM_SERVICE_VERSION'),
  }),
  server: z.object({
    host: z.string().describe('LLM_SERVICE_HOST'),
    port: numberTransformSchema.describe('LLM_SERVICE_PORT'),
  }),
  otelCollectorUrl: z.string().describe('OTEL_COLLECTOR_ADDRESS'),
  mongoConnectionUri: z.string().describe('MONGO_CONNECTION_URI'),
  azureOpenAi: z.object({
    model: z.string().describe('AZURE_OPENAI_MODEL'),
    azureOpenAIApiKey: z.string().describe('AZURE_OPENAI_API_KEY'),
    azureOpenAIApiInstanceName: z.string().describe('AZURE_OPENAI_API_INSTANCE_NAME'),
    azureOpenAIApiDeploymentName: z.string().describe('AZURE_OPENAI_API_DEPLOYMENT_NAME'),
    azureOpenAIApiVersion: z.string().describe('AZURE_OPENAI_API_VERSION'),
    maxTokens: numberTransformSchema.describe('AZURE_OPENAI_MAX_TOKENS'),
    timeout: numberTransformSchema.describe('AZURE_OPENAI_TIMEOUT'),
    maxRetries: numberTransformSchema.describe('AZURE_OPENAI_MAX_RETRIES'),
  }),
  address: z.string().describe('$LLM_SERVICE_HOST:$LLM_SERVICE_PORT'),
});

export let config: z.infer<typeof configSchema>;

export const loadConfig = () => {
  const envConfig = loadConfigFromEnv(configSchema);
  config = envConfig;
};
