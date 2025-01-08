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
import { z } from 'zod';

const enhanceQueryResponseSchema = z.object({
  relevantToContext: z.boolean(),
  enhancedPrompt: z.string().nullable(),
  suggestions: z.array(z.string()).nullable(),
});

export function llmServiceServer(llm: AzureChatOpenAI, errorHandler: ServiceControllerErrorHandler, logger: Logger): ServiceLLMServer {
  return {
    enhanceQueryText: serviceController<EnhanceQueryTextRequest, EnhanceQueryTextResponse>(
      async (request, logger) => {
        logger.debug('Executing query text enhancement');
        const resultLlm = await llm.invoke([
          [
            'system',
            `You are an expert prompt engineer. Use the enhancement context to refine the prompt.

            Respond ONLY with a clean JSON object in this exact format:
            {
              "relevantToContext": boolean,
              "enhancedPrompt": string or null,
              "suggestions": array of strings or null
            }

            Rules:
            1. If prompt is relevant to context:
               - Set relevantToContext: true
               - Set enhancedPrompt to the improved prompt
               - Set suggestions to null
            2. If prompt is not relevant:
               - Set relevantToContext: false
               - Set enhancedPrompt to null
               - Set suggestions to array of 2-3 relevant examples (use real street names and specific queries)

            Do not include any markdown formatting, code blocks, or additional text.`,
          ],
          ['assistant', `I will return only a clean JSON object.`],
          [
            'user',
            `Enhancement Context: ${request.enhancementContext}
             Prompt: ${request.prompt}`,
          ],
        ]);

        try {
          const content = resultLlm.content
            .toString()
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          const validationResult = enhanceQueryResponseSchema.parse(JSON.parse(content));
          console.log('validationResult', validationResult);

          return EnhanceQueryTextResponse.fromJSON({
            enhancedPrompt: validationResult.enhancedPrompt || '',
            relevantToContext: validationResult.relevantToContext,
            suggestions: validationResult.suggestions || [],
          });
        } catch (error) {
          logger.error(
            {
              error,
              rawContent: resultLlm.content,
              errorType: error instanceof SyntaxError ? 'JSON Parse Error' : error instanceof z.ZodError ? 'Schema Validation Error' : 'Unknown Error',
            },
            'Failed to process LLM response'
          );
          throw new Error(`Failed to process LLM response: ${error.message}`);
        }
      },
      errorHandler,
      logger
    ),
    mongooseAggregation: serviceController<MongooseAggregationRequest, MongooseAggregationResponse>(
      async (request, logger) => {
        const { schema, query } = request;
        logger.debug('Executing mongoose aggregation');
        const resultLlm = await llm.invoke([
          [
            'system',
            `You are a MongoDB aggregation pipeline expert for pedestrian and weather data analysis.

Schema:
${schema}

Example Queries with Expected Output:

1. Query: "Show average pedestrians by weather"
Output:
[
  { $group: {
      _id: "$properties.weather_condition",
      avgPedestrians: { $avg: "$properties.pedestrians_count" }
    }
  },
  { $sort: { avgPedestrians: -1 } }
]

2. Query: "Peak hours in Schönbornstraße"
Output:
[
  { $match: { "properties.location_name": "Schönbornstraße" } },
  { $group: {
      _id: { $hour: { $toDate: "$properties.timestamp" } },
      count: { $sum: "$properties.pedestrians_count" }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 5 }
]

3. Query: "Locations with most pedestrians during rain"
Output:
[
  { $match: { "properties.weather_condition": "rain" } },
  { $group: {
      _id: "$properties.location_name",
      totalPedestrians: { $sum: "$properties.pedestrians_count" }
    }
  },
  { $sort: { totalPedestrians: -1 } }
]

Rules:
- Start with $match for filtering
- Use proper date operations for timestamps
- Consider weather and temperature conditions
- Implement geospatial queries when needed
- Return only the aggregation pipeline array`,
          ],
          ['user', `Query: ${query}`],
        ]);

        return MongooseAggregationResponse.fromJSON({ aggregation: resultLlm.content });
      },
      errorHandler,
      logger
    ),
  };
}
