'use client';
import { useState, useEffect } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useMemoFirebase,
  useCollection,
} from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Course } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  topicsLearned: z
    .string()
    .min(10, 'Please describe what you learned in at least 10 characters.'),
  reflection: z
    .string()
    .min(10, 'Please describe your reflection in at least 10 characters.'),
  linkedCourses: z.array(z.string()).optional(),
});

interface JournalEntryFormProps {
  selectedDate: string; // YYYY-MM-DD
}

export default function JournalEntryForm({
  selectedDate,
}: JournalEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicsLearned: '',
      reflection: '',
      linkedCourses: [],
    },
  });

  // Reset form when the selected date changes
  useEffect(() => {
    form.reset({
      topicsLearned: '',
      reflection: '',
      linkedCourses: [],
    });
  }, [selectedDate, form]);


  const coursesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'courses'),
      orderBy('addedAt', 'desc')
    );
  }, [user, firestore]);

  const { data: courses } = useCollection<Course>(coursesQuery);
  const selectedCourses = form.watch('linkedCourses') || [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in to add a journal entry.',
        });
        return
    };

    setIsLoading(true);

    const linkedCourses = values.linkedCourses?.map(courseString => {
      const [id, name] = courseString.split('::');
      return { id, name };
    }) || [];

    const dataToSave = {
      topicsLearned: values.topicsLearned,
      reflection: values.reflection,
      linkedCourses: linkedCourses,
      userId: user.uid,
      entryDate: selectedDate,
      createdAt: serverTimestamp(),
    };

    try {
      const journalEntriesCollection = collection(firestore, 'users', user.uid, 'journalEntries');
      await addDoc(journalEntriesCollection, dataToSave);
      toast({
        title: 'Journal Entry Added!',
        description: `Your entry for ${format(
          new Date(selectedDate),
          'PPP'
        )} has been saved.`,
      });
      form.reset(); // Clear form after successful submission
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save the journal entry. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Entry for</CardTitle>
        <CardDescription>
          {format(new Date(selectedDate), 'PPP')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="linkedCourses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to Courses (Optional)</FormLabel>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <span className="truncate">
                            {selectedCourses.length > 0
                              ? selectedCourses.map(c => c.split('::')[1]).join(', ')
                              : "Select courses"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Your Courses</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {courses?.map(course => (
                          <DropdownMenuCheckboxItem
                            key={course.id}
                            checked={field.value?.includes(`${course.id}::${course.name}`)}
                            onCheckedChange={(checked) => {
                              const courseString = `${course.id}::${course.name}`;
                              if (checked) {
                                field.onChange([...(field.value || []), courseString]);
                              } else {
                                field.onChange(field.value?.filter(val => val !== courseString));
                              }
                            }}
                          >
                            {course.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topicsLearned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What topics did you learn?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Advanced React Hooks, Firestore data modeling..."
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
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Reflection</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Today was productive. I feel more confident with..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Add Entry
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
