import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe("The user's current message."),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  reply: z.string().describe("The AI's response in Markdown format."),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
