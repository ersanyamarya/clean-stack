import { ServiceLLMClient } from '@clean-stack/grpc-proto/llm';
import { credentials } from '@grpc/grpc-js';

import { config } from '../config';
const llmServiceAddress = config.llmServiceAddress;

let llm_service_client: ServiceLLMClient;

export default {
  initializeConnection: () => {
    llm_service_client = new ServiceLLMClient(llmServiceAddress, credentials.createInsecure());
  },
  close: () => llm_service_client.close(),
  name: 'llm-service',
  address: llmServiceAddress,
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
