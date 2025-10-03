
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { JournalEntry, Course } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  topicsLearned: z
    .string()
    .min(10, 'Please describe what you learned in at least 10 characters.'),
  reflection: z
    .string()
    .min(10, 'Please describe your reflection in at least 10 characters.'),
  course: z.string().optional(),
});

interface JournalEntryFormProps {
  selectedDate: string; // YYYY-MM-DD
}

export default function JournalEntryForm({
  selectedDate,
}: JournalEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [existingEntry, setExistingEntry] = useState<JournalEntry | null>(
    null
  );
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicsLearned: '',
      reflection: '',
      course: '',
    },
  });

  const journalEntriesCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'journalEntries');
  }, [user, firestore]);
  
  const coursesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'courses'),
      orderBy('addedAt', 'desc')
    );
  }, [user, firestore]);

  const { data: courses } = useCollection<Course>(coursesQuery);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!journalEntriesCollection) return;

      form.reset({ topicsLearned: '', reflection: '', course: '' });
      setExistingEntry(null);
      setIsLoading(true);

      const q = query(
        journalEntriesCollection,
        where('entryDate', '==', selectedDate)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const entry = { id: doc.id, ...doc.data() } as JournalEntry;
        setExistingEntry(entry);
        form.reset({
          topicsLearned: entry.topicsLearned,
          reflection: entry.reflection,
          course: entry.courseId ? `${entry.courseId}::${entry.courseName}` : '',
        });
      }
      setIsLoading(false);
    };

    fetchEntry();
  }, [selectedDate, journalEntriesCollection, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!journalEntriesCollection) return;

    setIsLoading(true);

    const {course, ...entryData} = values;
    const [courseId, courseName] = course?.split('::') || [undefined, undefined];
    
    const dataToSave = {
        ...entryData,
        courseId: courseId || null,
        courseName: courseName || null,
    }

    try {
      if (existingEntry) {
        // Update existing entry
        const entryRef = doc(
          firestore,
          'users',
          user!.uid,
          'journalEntries',
          existingEntry.id
        );
        await updateDoc(entryRef, {
          ...dataToSave,
        });
        toast({
          title: 'Journal Updated!',
          description: `Your entry for ${format(
            new Date(selectedDate),
            'PPP'
          )} has been updated.`,
        });
      } else {
        // Add new entry
        await addDoc(journalEntriesCollection, {
          ...dataToSave,
          userId: user!.uid,
          entryDate: selectedDate,
          createdAt: serverTimestamp(),
        });
        toast({
          title: 'Journal Entry Added!',
          description: `Your entry for ${format(
            new Date(selectedDate),
            'PPP'
          )} has been saved.`,
        });
      }
      // Re-fetch entry after submission
      const q = query(
        journalEntriesCollection,
        where('entryDate', '==', selectedDate)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setExistingEntry({ id: doc.id, ...doc.data() } as JournalEntry);
      }
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
        <CardTitle>
          {existingEntry ? 'Edit Entry for' : 'New Entry for'}
        </CardTitle>
        <CardDescription>
          {format(new Date(selectedDate), 'PPP')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
          <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to a Course (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <ScrollArea className="h-72">
                        {courses?.map((c) => (
                          <SelectItem key={c.id} value={`${c.id}::${c.name}`}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topicsLearned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What topics did you learn today?</FormLabel>
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
              {existingEntry ? 'Save Changes' : 'Add Entry'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
