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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters.'),
  platform: z.string().min(1, 'Please select a platform.'),
  totalModules: z.coerce.number().min(1, 'Must have at least 1 module.'),
  estimatedHours: z.coerce
    .number()
    .min(1, 'Estimated hours must be at least 1.'),
});

const platforms = [
  'Coursera',
  'Udemy',
  'edX',
  'Khan Academy',
  'Skillshare',
  'FutureLearn',
  'LinkedIn Learning',
  'freeCodeCamp',
  'Codecademy',
  'LeetCode',
  'HackerRank',
  'Codewars',
  'SoloLearn',
  'Pluralsight',
  'IBM Skills Network',
  'Tata STRIVE',
  'Google Digital Garage',
  'Microsoft Learn',
  'Simplilearn',
  'Byju’s',
  'Toppr',
  'Vedantu',
  'Unacademy',
  'DataCamp',
  'Treehouse',
  'Brilliant',
  'Duolingo',
  'Other',
];

export default function AddCourseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      platform: '',
      totalModules: 10,
      estimatedHours: 20,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to add a course.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const coursesCollection = collection(
        firestore,
        'users',
        user.uid,
        'courses'
      );
      await addDoc(coursesCollection, {
        ...values,
        userId: user.uid,
        modulesCompleted: 0,
        status: 'Not Started',
        addedAt: serverTimestamp(),
      });
      toast({
        title: 'Course Added!',
        description: `${values.name} has been added to your list.`,
      });
      form.reset();
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not add the course. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
        <CardDescription>
          Fill in the details of the course you want to track.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., The Complete Web Developer Guide"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-72">
                        {platforms.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalModules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Modules</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Hours</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Add Course
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
