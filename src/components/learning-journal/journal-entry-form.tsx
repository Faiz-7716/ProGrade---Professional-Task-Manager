
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, startOfToday } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { LearningJournalEntry } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  timeSpent: z.coerce.number().min(1, 'Time spent must be at least 1 minute.'),
  notes: z.string().min(10, 'Notes must be at least 10 characters long.'),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  courseName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JournalEntryFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  entry?: LearningJournalEntry; // For editing
}

export default function JournalEntryForm({ isOpen, setIsOpen, entry }: JournalEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!entry;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      timeSpent: 30,
      notes: '',
      status: 'In Progress',
      courseName: '',
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        topic: entry.topic,
        timeSpent: entry.timeSpent,
        notes: entry.notes,
        status: entry.status,
        courseName: entry.courseName,
      });
    } else {
        form.reset({
            topic: '',
            timeSpent: 30,
            notes: '',
            status: 'In Progress',
            courseName: '',
        });
    }
  }, [entry, form]);

  async function onSubmit(values: FormValues) {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    setIsLoading(true);
    try {
      if (isEditing && entry) {
        // Update existing entry
        const entryRef = doc(firestore, 'users', user.uid, 'journalEntries', entry.id);
        await updateDoc(entryRef, values);
        toast({ title: 'Success!', description: 'Journal entry has been updated.' });
      } else {
        // Add new entry
        const collectionRef = collection(firestore, 'users', user.uid, 'journalEntries');
        await addDoc(collectionRef, {
          ...values,
          userId: user.uid,
          entryDate: format(startOfToday(), 'yyyy-MM-dd'),
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success!', description: 'New journal entry has been added.' });
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the entry.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Learning Entry</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of your learning activity.' : 'Log a new learning activity for today.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic / Lesson</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React Hooks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What did you work on? Any key insights?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Ultimate React Course" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Entry'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
