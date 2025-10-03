'use server';

/**
 * @fileOverview An AI agent that provides feedback on a journal entry.
 *
 * - provideJournalFeedback - A function that analyzes a journal entry and provides advice.
 * - ProvideJournalFeedbackInput - The input type for the function.
 * - ProvideJournalFeedbackOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideJournalFeedbackInputSchema = z.object({
  journalContent: z.string().describe('The combined content of a daily journal entry, including reflections and course progress notes.'),
});
export type ProvideJournalFeedbackInput = z.infer<typeof ProvideJournalFeedbackInputSchema>;

const ProvideJournalFeedbackOutputSchema = z.object({
  advice: z.array(z.string()).describe('A list of actionable pieces of advice based on the journal entry.'),
  tasks: z.array(z.string()).describe('A list of concrete tasks or to-do items suggested by the AI.'),
});
export type ProvideJournalFeedbackOutput = z.infer<typeof ProvideJournalFeedbackOutputSchema>;

export async function provideJournalFeedback(input: ProvideJournalFeedbackInput): Promise<ProvideJournalFeedbackOutput> {
  return provideJournalFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideJournalFeedbackPrompt',
  input: {schema: ProvideJournalFeedbackInputSchema},
  output: {schema: ProvideJournalFeedbackOutputSchema},
  prompt: `You are a professional career coach and mentor. Analyze the following journal entry, which includes the user's reflections and progress in their online courses.

Based on their entry, provide:
1.  A list of 2-3 actionable pieces of advice to help them improve their skills, learning process, or career trajectory.
2.  A to-do list of 2-3 concrete, simple tasks they can do to act on your advice.

Journal Entry:
"{{{journalContent}}}"`,
});

const provideJournalFeedbackFlow = ai.defineFlow(
  {
    name: 'provideJournalFeedbackFlow',
    inputSchema: ProvideJournalFeedbackInputSchema,
    outputSchema: ProvideJournalFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
