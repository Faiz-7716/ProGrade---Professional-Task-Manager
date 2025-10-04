'use server';
/**
 * @fileOverview AI Quiz Title Generator.
 *
 * This file defines a Genkit flow to generate a formal title for a quiz
 * based on a user's learning topic.
 *
 * - generateQuizTitle: The function to generate the quiz title.
 * - GenerateQuizTitleInput: The input type for the function.
 * - GenerateQuizTitleOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateQuizTitleInputSchema = z.object({
  learningTopic: z.string().describe('The topic the user has learned about.'),
});
export type GenerateQuizTitleInput = z.infer<typeof GenerateQuizTitleInputSchema>;

const GenerateQuizTitleOutputSchema = z.object({
  title: z.string().describe('The generated formal title for the quiz.'),
});
export type GenerateQuizTitleOutput = z.infer<typeof GenerateQuizTitleOutputSchema>;

export async function generateQuizTitle(
  input: GenerateQuizTitleInput
): Promise<GenerateQuizTitleOutput> {
  return generateQuizTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizTitlePrompt',
  input: { schema: GenerateQuizTitleInputSchema },
  output: { schema: GenerateQuizTitleOutputSchema },
  prompt: `You are an expert at creating concise and professional titles. Based on the following learning topic, generate a short, formal title for a quiz.

The title should be no more than 5 words.

Example:
Topic: "a javascript program to create a pyramid pattern"
Title: "JavaScript Pyramid Program Quiz"

Topic: "I learned about the Next.js App Router and how server components work."
Title: "Next.js App Router Quiz"

Learning Topic: {{{learningTopic}}}`,
});

const generateQuizTitleFlow = ai.defineFlow(
  {
    name: 'generateQuizTitleFlow',
    inputSchema: GenerateQuizTitleInputSchema,
    outputSchema: GenerateQuizTitleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
