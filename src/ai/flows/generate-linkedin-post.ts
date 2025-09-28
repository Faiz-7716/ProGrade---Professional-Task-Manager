'use server';

/**
 * @fileOverview LinkedIn post generation flow.
 *
 * This file defines a Genkit flow that generates professional LinkedIn posts based on user input.
 *
 * @remarks
 * - generateLinkedInPost - A function that takes a topic or achievement as input and returns a generated LinkedIn post with relevant hashtags.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the LinkedIn post generation flow.
 */
const GenerateLinkedInPostInputSchema = z.object({
  topic: z.string().describe('The topic or achievement to generate a LinkedIn post about.'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

/**
 * Output schema for the LinkedIn post generation flow.
 */
const GenerateLinkedInPostOutputSchema = z.object({
  post: z.string().describe('The generated LinkedIn post with relevant hashtags.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

/**
 * Wrapper function to generate a LinkedIn post.
 *
 * @param input - The input for the LinkedIn post generation flow.
 * @returns The generated LinkedIn post.
 */
export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

/**
 * Prompt definition for generating a LinkedIn post.
 */
const generateLinkedInPostPrompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are a professional social media manager specializing in LinkedIn.

  Based on the provided topic or achievement, generate a professional LinkedIn post.
  Include relevant and trending hashtags to maximize reach and engagement. Make sure the post is engaging and well-written.

  Topic/Achievement: {{{topic}}}

  Post:`,
});

/**
 * Flow definition for generating a LinkedIn post.
 */
const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await generateLinkedInPostPrompt(input);
    return output!;
  }
);
