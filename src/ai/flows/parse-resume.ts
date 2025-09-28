'use server';

/**
 * @fileOverview Resume Parser AI Agent.
 *
 * This file defines a Genkit flow to parse a resume and extract key information
 * like education, experience, and skills.
 *
 * @exports parseResume - The function to parse the resume.
 * @exports ParseResumeInput - The input type for the function.
 * @exports ParseResumeOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ExperienceSchema = z.object({
  company: z.string().describe('The name of the company.'),
  role: z.string().describe('The role or title.'),
  duration: z.string().describe('The duration of the employment.'),
  description: z.string().describe('A summary of the responsibilities and achievements.'),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or qualification obtained.'),
  duration: z.string().describe('The duration of the study.'),
});

const ParseResumeOutputSchema = z.object({
  experience: z.array(ExperienceSchema).describe('The extracted work experience.'),
  education: z.array(EducationSchema).describe('The extracted education history.'),
  skills: z.array(z.string()).describe('A list of extracted skills.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Extract the work experience, education, and skills from the provided resume.

Resume: {{media url=resumeDataUri}}`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
