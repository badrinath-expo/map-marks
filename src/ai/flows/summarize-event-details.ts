'use server';

/**
 * @fileOverview Summarizes event details using GenAI.
 *
 * - summarizeEventDetails - A function that summarizes the event details.
 * - SummarizeEventDetailsInput - The input type for the summarizeEventDetails function.
 * - SummarizeEventDetailsOutput - The return type for the summarizeEventDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEventDetailsInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('The detailed description of the event to be summarized.'),
});
export type SummarizeEventDetailsInput = z.infer<typeof SummarizeEventDetailsInputSchema>;

const SummarizeEventDetailsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the event details.'),
});
export type SummarizeEventDetailsOutput = z.infer<typeof SummarizeEventDetailsOutputSchema>;

export async function summarizeEventDetails(
  input: SummarizeEventDetailsInput
): Promise<SummarizeEventDetailsOutput> {
  return summarizeEventDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEventDetailsPrompt',
  input: {schema: SummarizeEventDetailsInputSchema},
  output: {schema: SummarizeEventDetailsOutputSchema},
  prompt: `Summarize the following event details into a concise description:

Event Details:
{{{eventDetails}}}`,
});

const summarizeEventDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeEventDetailsFlow',
    inputSchema: SummarizeEventDetailsInputSchema,
    outputSchema: SummarizeEventDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
