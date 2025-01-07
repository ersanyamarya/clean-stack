import { Logger } from '@clean-stack/framework/global-types';
import { serviceController, ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import {
  EnhanceQueryTextRequest,
  EnhanceQueryTextResponse,
  MongooseAggregationRequest,
  MongooseAggregationResponse,
  ServiceLLMServer,
} from '@clean-stack/grpc-proto/llm';
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

    Return only the enhanced prompt text and nothing else.
    make sure that the text is properly formatted and trimmed.
    Do not include any additional information or comments.

    Example:
      Original: "How many calories are in an apple?"
      Enhanced: "Provide the number of calories in an apple.

      Original: "What is the capital of France?"
      Enhanced: "Identify the capital of France."

      Original: "What is the weather like today?"
      Enhanced: "Describe the current weather conditions."

    Do you understand the task?

    `,
          ],
          [
            'user',
            `Context: ${request.enhancementContext}
    Prompt: ${request.prompt}`,
          ],
          [
            'assistant',
            `Yes, I understand the task. I will enhance the prompt text and provide you with the improved version.
            I will not include any additional information or comments and not use any special characters.
            Give me the prompt text you want me to enhance.
            `,
          ],
        ]);

        // remove all special characters and spaces from the result
        const enhancedPrompt = resultLlm.content.toString().replace(/[^a-zA-Z0-9 ]/g, '');
        return EnhanceQueryTextResponse.fromJSON({ enhancedPrompt });
      },
      errorHandler,
      logger
    ),
    mongooseAggregation: serviceController<MongooseAggregationRequest, MongooseAggregationResponse>(
      async (request, logger) => {
        logger.debug('Executing mongoose aggregation');
        const resultLlm = await llm.invoke([
          [
            'system',
            `You are a MongoDB aggregation pipeline expert who specializes in converting natural language to MongoDB queries. Focus on:
    - Schema analysis
    - Query optimization
    - Pipeline stages
    - Index utilization
    Return only valid MongoDB aggregation query, not the whole code, only the query string.
    `,
          ],
          [
            'user',
            `Schema: ${request.schema}

    Query: ${request.query}`,
          ],
          ['assistant', `I'll convert the natural language query to a valid MongoDB aggregation query.`],
        ]);

        return MongooseAggregationResponse.fromJSON({ aggregation: resultLlm.content });
      },
      errorHandler,
      logger
    ),
  };
}
