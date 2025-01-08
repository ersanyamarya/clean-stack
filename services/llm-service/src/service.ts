import { PedestrianDataRepository } from '@clean-stack/domain_pedestrian_data';
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

// Schema Definitions
const enhanceQueryResponseSchema = z.object({
  relevantToContext: z.boolean(),
  enhancedPrompt: z.string().nullable(),
  suggestions: z.array(z.string()).nullable(),
});

// Prompt Templates
const QUERY_ENHANCEMENT_PROMPT = `You are an expert prompt engineer. Use the enhancement context to refine the prompt.

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

Do not include any markdown formatting, code blocks, or additional text.`;

const MONGOOSE_AGGREGATION_PROMPT = (
  schema: string
) => `You are a MongoDB aggregation pipeline generator. Given a schema and a question, generate a MongoDB aggregation pipeline.
Ensure that the pipeline returns the correct data based on the question and is highly optimized and minimal.

Schema:
${schema}

NOTE: Use only one of the most prominent fields, don't use all similar field types in the $match block.
For example, when matching properties.location_name, properties.location_id, or properties.geo_point_2d, use only properties.location_name and remove the others.

Use createdAt fields if the question is related to time-based queries.

Instructions:
- Return ONLY the aggregation pipeline array in valid JSON format
- No explanations or additional text
- No code blocks or formatting

Here are two examples:

Example 1:
Question: "Count pedestrians by hour of day"
[
  {
    "$group": {
      "_id": { "$hour": { "$toDate": "$properties.timestamp" } },
      "total": { "$sum": "$properties.pedestrians_count" }
    }
  },
  {
    "$sort": { "_id": 1 }
  }
]

Example 2:
Question: "Find top 5 locations with highest average pedestrians during rainy weather"
[
  {
    "$match": {
      "properties.weather_condition": "rain"
    }
  },
  {
    "$group": {
      "_id": "$properties.location_name",
      "avgPedestrians": { "$avg": "$properties.pedestrians_count" }
    }
  },
  {
    "$sort": { "avgPedestrians": -1 }
  },
  {
    "$limit": 5
  }
]`;

// Helper Functions
function cleanJsonContent(content: string): string {
  return content
    .toString()
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/\n\s*/g, ' ')
    .trim();
}

function processLlmResponse<T>(content: string, schema: z.ZodType<T>, logger: Logger): T {
  try {
    const cleanContent = cleanJsonContent(content);
    const parsed = JSON.parse(cleanContent);
    return schema.parse(parsed);
  } catch (error) {
    logger.error(
      {
        error,
        rawContent: content,
        errorType: error instanceof SyntaxError ? 'JSON Parse Error' : error instanceof z.ZodError ? 'Schema Validation Error' : 'Unknown Error',
      },
      'Failed to process LLM response'
    );
    throw new Error(`Failed to process LLM response: ${error.message}`);
  }
}

// Service Methods
async function enhanceQueryText(llm: AzureChatOpenAI, request: EnhanceQueryTextRequest, logger: Logger): Promise<EnhanceQueryTextResponse> {
  logger.debug('Executing query text enhancement');
  const resultLlm = await llm.invoke([
    ['system', QUERY_ENHANCEMENT_PROMPT],
    ['assistant', 'I will return only a clean JSON object.'],
    [
      'user',
      `Enhancement Context: ${request.enhancementContext}
       Prompt: ${request.prompt}`,
    ],
  ]);

  const validationResult = processLlmResponse(resultLlm.content.toString(), enhanceQueryResponseSchema, logger);

  return EnhanceQueryTextResponse.fromJSON({
    enhancedPrompt: validationResult.enhancedPrompt || '',
    relevantToContext: validationResult.relevantToContext,
    suggestions: validationResult.suggestions || [],
  });
}

async function mongooseAggregation(
  pedestrianRepository: PedestrianDataRepository,
  llm: AzureChatOpenAI,
  request: MongooseAggregationRequest,
  logger: Logger
): Promise<MongooseAggregationResponse> {
  const { schema, query } = request;
  logger.debug('Executing mongoose aggregation');

  const resultLlm = await llm.invoke([
    ['system', MONGOOSE_AGGREGATION_PROMPT(schema)],
    ['assistant', 'I understand the schema. I will return only the aggregation pipeline based on the question. I will also optimize the pipeline.'],
    ['user', query],
  ]);

  const parsedPipeline = processLlmResponse(resultLlm.content.toString(), z.array(z.any()), logger);

  const result = await pedestrianRepository.aggregatePedestrianData(parsedPipeline);

  logger.debug({ result, parsedPipeline }, 'Aggregation result');

  return MongooseAggregationResponse.fromJSON({
    result: JSON.stringify(result),
  });
}

// Main Service Export
export function llmServiceServer(
  pedestrianRepository: PedestrianDataRepository,
  llm: AzureChatOpenAI,
  errorHandler: ServiceControllerErrorHandler,
  logger: Logger
): ServiceLLMServer {
  return {
    enhanceQueryText: serviceController((request, logger) => enhanceQueryText(llm, request, logger), errorHandler, logger),
    mongooseAggregation: serviceController((request, logger) => mongooseAggregation(pedestrianRepository, llm, request, logger), errorHandler, logger),
  };
}
