'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generatePostAction, suggestHashtagsAction } from '@/app/actions';
import { Loader2, WandSparkles, Tag } from 'lucide-react';
import CopyButton from '../copy-button';
import { Badge } from '../ui/badge';

const postSchema = z.object({
  topic: z.string().min(10, 'Please describe your topic in more detail.'),
  tone: z.string().optional(),
});

const hashtagSchema = z.object({
  postContent: z
    .string()
    .min(10, 'Please provide some post content to get hashtags.'),
});

function PostWriterForm() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { topic: '', tone: 'Professional' },
  });

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setIsLoading(true);
    setError(null);
    setResult('');
    const res = await generatePostAction(values);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.post);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the topic of your post?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Announcing my new certification in Google Cloud, or sharing key takeaways from a recent marketing conference."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Excited">Excited</SelectItem>
                  <SelectItem value="Thankful">Thankful</SelectItem>
                  <SelectItem value="Motivational">Motivational</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="mr-2 h-4 w-4" />
          )}
          Generate Post
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="rounded-md border bg-muted p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm whitespace-pre-wrap">{result}</p>
              <CopyButton textToCopy={result} className="-mr-2" />
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

function HashtagOptimizerForm() {
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof hashtagSchema>>({
    resolver: zodResolver(hashtagSchema),
    defaultValues: { postContent: '' },
  });

  async function onSubmit(values: z.infer<typeof hashtagSchema>) {
    setIsLoading(true);
    setError(null);
    setResult([]);
    const res = await suggestHashtagsAction(values);
    if (res.error) {
      setError(res.error);
    } else if (res.hashtags) {
      setResult(res.hashtags);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="postContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste your post content here</FormLabel>
              <FormControl>
                <Textarea placeholder="Your LinkedIn post..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Tag className="mr-2 h-4 w-4" />
          )}
          Suggest Hashtags
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result.length > 0 && (
          <div className="rounded-md border bg-muted p-4 space-y-3">
             <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Suggested Hashtags:</h4>
              <CopyButton textToCopy={result.join(' ')} />
            </div>
            <div className="flex flex-wrap gap-2">
              {result.map((tag, i) => (
                <Badge key={i} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

export default function PostWriter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Engine</CardTitle>
        <CardDescription>
          Generate posts and find the best hashtags for maximum reach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="writer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="writer">AI Post Writer</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtag Optimizer</TabsTrigger>
          </TabsList>
          <TabsContent value="writer" className="pt-6">
            <PostWriterForm />
          </TabsContent>
          <TabsContent value="hashtags" className="pt-6">
            <HashtagOptimizerForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
