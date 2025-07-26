'use server';

/**
 * @fileOverview A conversational chat flow.
 * 
 * - chat - A function that handles the chat conversation.
 */

import { ai } from '@/ai/genkit';
import { ChatRequest, ChatRequestSchema, ChatResponse, ChatResponseSchema } from '@/types/chat';

export async function chat(input: ChatRequest): Promise<ChatResponse> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatRequestSchema },
  output: { schema: ChatResponseSchema },
  prompt: `You are a helpful assistant for the MapMarks application.
Your responses should be in Markdown format.

Here is the conversation history:
{{#each history}}
**{{role}}**: {{content}}
{{/each}}

**user**: {{{message}}}
**model**:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: ChatResponseSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
