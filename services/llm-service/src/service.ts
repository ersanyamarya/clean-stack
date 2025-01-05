import { Logger } from '@clean-stack/framework/global-types';
import { serviceController, ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import { EnhanceQueryTextRequest, EnhanceQueryTextResponse, ServiceLLMServer } from '@clean-stack/grpc-proto/llm';
import { AzureChatOpenAI } from '@langchain/openai';

export function llmServiceServer(llm: AzureChatOpenAI, errorHandler: ServiceControllerErrorHandler, logger: Logger): ServiceLLMServer {
  return {
    enhanceQueryText: serviceController<EnhanceQueryTextRequest, EnhanceQueryTextResponse>(
      async (request, logger) => {
        logger.debug('Enhancing query text');
        const resultLlm = await llm.invoke([
          [
            'system',
            `You are an expert prompt engineer. Enhance prompts by:
    - Adding necessary context and constraints
    - Maintaining original intent
    - Improving clarity and specificity
    - Removing ambiguity

    Return only the enhanced prompt text and nothing else.`,
          ],
          [
            'user',
            `Context: ${request.enhancementContext}
    Prompt: ${request.prompt}`,
          ],
          ['assistant', `I'll enhance the prompt while preserving its core purpose.`],
        ]);

        return EnhanceQueryTextResponse.fromJSON({ enhancedPrompt: resultLlm.content });
      },
      errorHandler,
      logger
    ),
  };
}
