'use server';

/**
 * @fileOverview A flow that provides daily growth suggestions for LinkedIn profiles.
 *
 * - provideDailyGrowthSuggestions - A function that provides daily growth suggestions.
 * - ProvideDailyGrowthSuggestionsInput - The input type for the provideDailyGrowthSuggestions function.
 * - ProvideDailyGrowthSuggestionsOutput - The return type for the provideDailyGrowthSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideDailyGrowthSuggestionsInputSchema = z.object({
  currentProfileSummary: z
    .string()
    .describe('A summary of the user\'s current LinkedIn profile, including headline, about section, and recent activity.'),
  careerField: z
    .string()
    .describe('The user\'s career field or industry, e.g., software engineering, marketing, etc.'),
});
export type ProvideDailyGrowthSuggestionsInput = z.infer<
  typeof ProvideDailyGrowthSuggestionsInputSchema
>;

const ProvideDailyGrowthSuggestionsOutputSchema = z.object({
  growthSuggestions: z
    .array(z.string())
    .describe('A list of daily growth suggestions tailored to the user\'s profile and career field.'),
});
export type ProvideDailyGrowthSuggestionsOutput = z.infer<
  typeof ProvideDailyGrowthSuggestionsOutputSchema
>;

export async function provideDailyGrowthSuggestions(
  input: ProvideDailyGrowthSuggestionsInput
): Promise<ProvideDailyGrowthSuggestionsOutput> {
  return provideDailyGrowthSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideDailyGrowthSuggestionsPrompt',
  input: {schema: ProvideDailyGrowthSuggestionsInputSchema},
  output: {schema: ProvideDailyGrowthSuggestionsOutputSchema},
  prompt: `You are a LinkedIn growth expert. Given a user's profile summary and career field, provide 3 daily growth suggestions to improve their profile visibility.

Profile Summary: {{{currentProfileSummary}}}
Career Field: {{{careerField}}}

Suggestions should be actionable and specific. Format as a list.

Example:
- Update your headline to include relevant keywords.
- Engage with posts from industry leaders.
- Share a post about a recent achievement or learning experience.`,
});

const provideDailyGrowthSuggestionsFlow = ai.defineFlow(
  {
    name: 'provideDailyGrowthSuggestionsFlow',
    inputSchema: ProvideDailyGrowthSuggestionsInputSchema,
    outputSchema: ProvideDailyGrowthSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
