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
import { getDailyGrowthSuggestionsAction } from '@/app/actions';
import { Loader2, Rocket, WandSparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  careerField: z.string().min(2, 'Career field is required.'),
});

export default function DailyGrowth() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { careerField: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const result = await getDailyGrowthSuggestionsAction({
      careerField: values.careerField,
      currentProfileSummary: `My career field is ${values.careerField}. I am looking for ways to grow my presence on LinkedIn.`,
    });

    if (result.error) {
      setError(result.error);
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Growth Suggestions</CardTitle>
        <CardDescription>
          Get custom AI-powered tasks to improve your profile visibility.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="careerField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your career field?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineering" {...field} />
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
              Get My Suggestions
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {suggestions.length > 0 && (
              <Alert>
                <Rocket className="h-4 w-4" />
                <AlertTitle>Your Daily Growth Plan!</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc list-inside space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
