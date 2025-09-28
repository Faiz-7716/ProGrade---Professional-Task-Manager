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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { suggestHeadlineAction } from '@/app/actions';
import { Loader2, WandSparkles } from 'lucide-react';
import CopyButton from '../copy-button';

const formSchema = z.object({
  careerField: z.string().min(2, 'Career field is required.'),
  experience: z
    .string()
    .min(10, 'Please provide some details about your experience.'),
  currentHeadline: z.string().optional(),
});

export default function HeadlineGenerator() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { careerField: '', experience: '', currentHeadline: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult('');
    const res = await suggestHeadlineAction(values);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.headline);
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Headline Generator</CardTitle>
        <CardDescription>
          Suggests professional, attention-grabbing headlines.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="careerField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Field</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Product Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 3+ years in B2B SaaS, skilled in roadmap planning and user research."
                      rows={3}
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
                  <p className="text-sm font-semibold">{result}</p>
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
