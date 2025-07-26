
'use server';

/**
 * @fileOverview A conversational chat flow.
 * 
 * - chat - A function that handles the chat conversation.
 * - ChatMessage - The type for a single chat message.
 * - ChatRequest - The input type for the chat function.
 * - ChatResponse - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The user\'s current message.'),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  reply: z.string().describe('The AI\'s response in Markdown format.'),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

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
