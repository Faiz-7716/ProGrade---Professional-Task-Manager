'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseResumeAction } from '@/app/actions';
import { Loader2, FileUp, Briefcase, GraduationCap, Star } from 'lucide-react';
import type { ParseResumeOutput } from '@/ai/flows/parse-resume';

const formSchema = z.object({
  resume: z.any().refine((file) => file, 'Please upload your resume.'),
});

export default function ResumeParser() {
  const [result, setResult] = useState<ParseResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('resume');

  function fileToDataURI(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const file = values.resume[0];
      if (!file) {
        setError('No file selected');
        setIsLoading(false);
        return;
      }

      const resumeDataUri = await fileToDataURI(file);
      const res = await parseResumeAction({ resumeDataUri });

      if (res.error) {
        setError(res.error);
      } else {
        setResult(res);
      }
    } catch (e) {
      setError('An error occurred while parsing the resume.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Parser</CardTitle>
        <CardDescription>
          Upload your resume to automatically extract your experience, education,
          and skills.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileUp className="mr-2 h-4 w-4" />
              )}
              Parse Resume
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {result && (
              <div className="space-y-4 rounded-md border bg-muted p-4">
                <div>
                  <h3 className="font-semibold flex items-center mb-2">
                    <Briefcase className="mr-2 h-4 w-4" /> Experience
                  </h3>
                  <div className="space-y-3">
                    {result.experience.map((exp, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-bold">{exp.role}</p>
                        <p>{exp.company} &middot; {exp.duration}</p>
                        <p className="text-muted-foreground mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                   <h3 className="font-semibold flex items-center mb-2">
                    <GraduationCap className="mr-2 h-4 w-4" /> Education
                  </h3>
                  <div className="space-y-2">
                     {result.education.map((edu, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-bold">{edu.institution}</p>
                        <p>{edu.degree} &middot; {edu.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
                 <div>
                   <h3 className="font-semibold flex items-center mb-2">
                    <Star className="mr-2 h-4 w-4" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {result.skills.map((skill, i) => (
                      <div key={i} className="text-xs bg-primary/10 text-primary-foreground font-semibold px-2 py-1 rounded-full">{skill}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
