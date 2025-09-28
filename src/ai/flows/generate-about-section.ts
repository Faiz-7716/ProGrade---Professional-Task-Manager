'use server';

/**
 * @fileOverview LinkedIn About Section Generator.
 *
 * This file defines a Genkit flow to generate a compelling "About Me"
 * section for a LinkedIn profile based on user input.
 *
 * @exports generateAboutSection - The function to generate the About Me section.
 * @exports GenerateAboutSectionInput - The input type for the function.
 * @exports GenerateAboutSectionOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutSectionInputSchema = z.object({
  userInput: z.string().describe('Details about you and what you want to convey in your about section.'),
});
export type GenerateAboutSectionInput = z.infer<typeof GenerateAboutSectionInputSchema>;

const GenerateAboutSectionOutputSchema = z.object({
  aboutSection: z.string().describe('The generated About Me section for LinkedIn.'),
});
export type GenerateAboutSectionOutput = z.infer<typeof GenerateAboutSectionOutputSchema>;

export async function generateAboutSection(input: GenerateAboutSectionInput): Promise<GenerateAboutSectionOutput> {
  return generateAboutSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutSectionPrompt',
  input: {schema: GenerateAboutSectionInputSchema},
  output: {schema: GenerateAboutSectionOutputSchema},
  prompt: `You are a LinkedIn expert. Craft a compelling and professional "About Me" section for a LinkedIn profile based on the user's input. Make it engaging and highlight their key skills and experiences.\n\nUser Input: {{{userInput}}}`,
});

const generateAboutSectionFlow = ai.defineFlow(
  {
    name: 'generateAboutSectionFlow',
    inputSchema: GenerateAboutSectionInputSchema,
    outputSchema: GenerateAboutSectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
