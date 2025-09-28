// src/ai/flows/suggest-headline.ts
'use server';
/**
 * @fileOverview A LinkedIn headline suggestion AI agent.
 *
 * - suggestHeadline - A function that suggests professional and attention-grabbing headlines.
 * - SuggestHeadlineInput - The input type for the suggestHeadline function.
 * - SuggestHeadlineOutput - The return type for the suggestHeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHeadlineInputSchema = z.object({
  careerField: z.string().describe('The career field of the user.'),
  currentHeadline: z.string().optional().describe('The user\'s current LinkedIn headline, if any.'),
  experience: z.string().describe('A brief summary of the user\'s professional experience.'),
});
export type SuggestHeadlineInput = z.infer<typeof SuggestHeadlineInputSchema>;

const SuggestHeadlineOutputSchema = z.object({
  headline: z.string().describe('A suggested professional and attention-grabbing LinkedIn headline.'),
});
export type SuggestHeadlineOutput = z.infer<typeof SuggestHeadlineOutputSchema>;

export async function suggestHeadline(input: SuggestHeadlineInput): Promise<SuggestHeadlineOutput> {
  return suggestHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHeadlinePrompt',
  input: {schema: SuggestHeadlineInputSchema},
  output: {schema: SuggestHeadlineOutputSchema},
  prompt: `You are a professional career coach specializing in LinkedIn profile optimization.

  Based on the user's career field, current headline (if any), and experience, suggest a new LinkedIn headline that is professional and attention-grabbing.

  Career Field: {{{careerField}}}
Current Headline: {{{currentHeadline}}}
  Experience: {{{experience}}}

  Headline:`, // Ensure the model generates only the headline.
});

const suggestHeadlineFlow = ai.defineFlow(
  {
    name: 'suggestHeadlineFlow',
    inputSchema: SuggestHeadlineInputSchema,
    outputSchema: SuggestHeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
