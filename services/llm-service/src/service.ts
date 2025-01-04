import { Logger } from '@clean-stack/framework/global-types';
import { serviceController, ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import { EnhanceQueryTextRequest, EnhanceQueryTextResponse, ServiceLLMServer } from '@clean-stack/grpc-proto/llm';

export function llmServiceServer(errorHandler: ServiceControllerErrorHandler, logger: Logger): ServiceLLMServer {
  return {
    enhanceQueryText: serviceController<EnhanceQueryTextRequest, EnhanceQueryTextResponse>(
      async (request, logger) => {
        logger.debug('Enhancing query text');
        return EnhanceQueryTextResponse.fromJSON({ enhancedPrompt: 'Enhanced query text ' + request.prompt });
      },
      errorHandler,
      logger
    ),
  };
}
