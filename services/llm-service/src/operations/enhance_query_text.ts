import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { z } from 'zod';

const enhanceQueryResponseSchema = z.object({
  relevantToContext: z.boolean(),
  enhancedPrompt: z.string().nullable(),
  suggestions: z.array(z.string()).nullable(),
});

type IEnhanceQueryResponse = z.infer<typeof enhanceQueryResponseSchema>;

const QUERY_ENHANCEMENT_PROMPT = `You are an expert prompt engineer. Use the enhancement context to refine the prompt.

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

export async function enhanceTheQuery(llm: BaseChatModel, enhancementContext: string, originalPrompt: string): Promise<IEnhanceQueryResponse> {
  const model = llm.withStructuredOutput(enhanceQueryResponseSchema);

  return await model.invoke([
    ['system', QUERY_ENHANCEMENT_PROMPT],
    ['assistant', 'I will return only a clean JSON object.'],
    [
      'user',
      `Enhancement Context: ${enhancementContext}
       Prompt: ${originalPrompt}`,
    ],
  ]);
}
