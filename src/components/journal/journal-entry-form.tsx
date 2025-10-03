
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { JournalEntry } from '@/lib/types';

const formSchema = z.object({
  topicsLearned: z
    .string()
    .min(10, 'Please describe what you learned in at least 10 characters.'),
  nextSteps: z
    .string()
    .min(10, 'Please describe your next steps in at least 10 characters.'),
});

interface JournalEntryFormProps {
  selectedDate: string; // YYYY-MM-DD
}

export default function JournalEntryForm({
  selectedDate,
}: JournalEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [existingEntry, setExistingEntry] = useState<JournalEntry | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicsLearned: '',
      nextSteps: '',
    },
  });

  const journalEntriesCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'journalEntries');
  }, [user, firestore]);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!journalEntriesCollection) return;
      
      form.reset({ topicsLearned: '', nextSteps: '' });
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
          nextSteps: entry.nextSteps,
        });
      }
      setIsLoading(false);
    };

    fetchEntry();
  }, [selectedDate, journalEntriesCollection, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!journalEntriesCollection) return;

    setIsLoading(true);
    try {
      if (existingEntry) {
        // Update existing entry
        const entryRef = doc(firestore, 'users', user!.uid, 'journalEntries', existingEntry.id);
        await updateDoc(entryRef, {
            ...values
        });
        toast({
          title: 'Journal Updated!',
          description: `Your entry for ${format(new Date(selectedDate), 'PPP')} has been updated.`,
        });

      } else {
        // Add new entry
        await addDoc(journalEntriesCollection, {
          ...values,
          userId: user!.uid,
          entryDate: selectedDate,
          status: 'Pending',
          createdAt: serverTimestamp(),
        });
        toast({
          title: 'Journal Entry Added!',
          description: `Your entry for ${format(new Date(selectedDate), 'PPP')} has been saved.`,
        });
      }
      // Re-fetch entry after submission
      const q = query(journalEntriesCollection, where('entryDate', '==', selectedDate));
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
        <CardDescription>{format(new Date(selectedDate), 'PPP')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
              name="nextSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your next steps or tasks?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Build a small project with custom hooks, start the 'Quiz Generator' feature..."
                      rows={4}
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
