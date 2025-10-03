'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const courseProgressSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  notes: z.string().min(1, 'Notes cannot be empty.'),
});

const formSchema = z.object({
  reflection: z
    .string()
    .min(10, 'Please describe your reflection in at least 10 characters.'),
  courseProgress: z.array(courseProgressSchema).min(1, "Please add notes for at least one course."),
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
      reflection: '',
      courseProgress: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'courseProgress',
    keyName: 'key',
  });

  // Reset form when the selected date changes
  useEffect(() => {
    form.reset({
      reflection: '',
      courseProgress: [],
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
  
  const handleCourseSelection = (courseId: string, courseName: string, isSelected: boolean) => {
    const fieldIndex = fields.findIndex(field => field.courseId === courseId);
    
    if (isSelected) {
      if (fieldIndex === -1) {
        append({ courseId, courseName, notes: '' });
      }
    } else {
      if (fieldIndex !== -1) {
        remove(fieldIndex);
      }
    }
  }

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

    const dataToSave = {
      ...values,
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
  
  const selectedCourseNames = fields.map(f => f.courseName).join(', ');

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
             <FormItem>
                <FormLabel>Select Courses</FormLabel>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <span className="truncate">
                        {fields.length > 0 ? selectedCourseNames : "Select courses to log progress"}
                        </span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Your Courses</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {courses?.map(course => (
                        <DropdownMenuCheckboxItem
                        key={course.id}
                        checked={fields.some(f => f.courseId === course.id)}
                        onCheckedChange={(checked) => {
                            handleCourseSelection(course.id, course.name, checked);
                        }}
                        >
                        {course.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage>{form.formState.errors.courseProgress?.root?.message}</FormMessage>
            </FormItem>

            {fields.map((field, index) => (
               <FormField
                key={field.key}
                control={form.control}
                name={`courseProgress.${index}.notes`}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Progress for: <span className="font-semibold">{field.courseName}</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`e.g., Finished module 3 on state management...`}
                        rows={3}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Daily Reflection</FormLabel>
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
