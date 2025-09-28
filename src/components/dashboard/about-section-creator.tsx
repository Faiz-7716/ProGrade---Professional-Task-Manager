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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateAboutSectionAction } from '@/app/actions';
import { Loader2, WandSparkles } from 'lucide-react';
import CopyButton from '../copy-button';

const formSchema = z.object({
  userInput: z
    .string()
    .min(20, 'Please provide more details for a better result.'),
});

export default function AboutSectionCreator() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userInput: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult('');
    const res = await generateAboutSectionAction({ userInput: values.userInput });
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.aboutSection);
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section Creator</CardTitle>
        <CardDescription>
          Generate a strong "About Me" section based on your input.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="userInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I'm a software engineer with 5 years of experience in React and Node.js. Passionate about building scalable web applications and contributing to open-source."
                      rows={5}
                      {...field}
                    />
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
                <WandSparkles className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {result && (
              <div className="rounded-md border bg-muted p-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm whitespace-pre-wrap">{result}</p>
                  <CopyButton textToCopy={result} />
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
