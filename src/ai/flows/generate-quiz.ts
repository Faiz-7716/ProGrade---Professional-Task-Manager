'use server';
/**
 * @fileOverview AI Quiz Generator.
 *
 * This file defines a Genkit flow to generate a multiple-choice quiz
 * based on a user's learning topic.
 *
 * - generateQuiz: The function to generate the quiz.
 * - GenerateQuizInput: The input type for the function.
 * - GenerateQuizOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
  learningTopic: z.string().describe('The topic the user has learned about.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  isBonus: z.boolean().describe('Whether this is a bonus question worth extra points.'),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert quiz creator. Based on the following learning topic, generate a multiple-choice quiz with 10 questions to test the user's knowledge.

The quiz should consist of:
- 9 standard questions.
- 1 "bonus" question that is slightly more difficult than the others.

Each question must have exactly 4 options.

Learning Topic: {{{learningTopic}}}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
