import { ServiceLLMClient } from '@clean-stack/grpc-proto/llm';
import { credentials } from '@grpc/grpc-js';

const LLM_SERVICE_ADDRESS = 'localhost:9902';

let llm_service_client: ServiceLLMClient;

export default {
  connect: () => {
    llm_service_client = new ServiceLLMClient(LLM_SERVICE_ADDRESS, credentials.createInsecure());
  },
  close: () => llm_service_client.close(),
  name: 'llm-service',
  address: LLM_SERVICE_ADDRESS,
};

const checkClientInitialized = () => {
  if (!llm_service_client) throw new Error('LLM service client is not initialized');
};

export const enhanceQueryText = () => {
  checkClientInitialized();
  return llm_service_client.enhanceQueryText.bind(llm_service_client);
};

export const mongooseAggregation = () => {
  checkClientInitialized();
  return llm_service_client.mongooseAggregation.bind(llm_service_client);
};
