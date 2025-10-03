'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { JournalEntry, Course } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  topicsLearned: z.string().min(10, 'Please describe what you learned in at least 10 characters.'),
  reflection: z.string().min(10, 'Please describe your reflection in at least 10 characters.'),
  linkedCourses: z.array(z.string()).optional(),
});

interface EditJournalEntryDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  entry: JournalEntry;
}

export default function EditJournalEntryDialog({
  isOpen,
  setIsOpen,
  entry,
}: EditJournalEntryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicsLearned: entry.topicsLearned,
      reflection: entry.reflection,
      linkedCourses: entry.linkedCourses ? entry.linkedCourses.map(c => `${c.id}::${c.name}`) : [],
    },
  });
  
  const coursesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'courses'),
      orderBy('addedAt', 'desc')
    );
  }, [user, firestore]);

  const { data: courses } = useCollection<Course>(coursesQuery);
  const selectedCourses = form.watch('linkedCourses') || [];

  useEffect(() => {
    if (isOpen) {
      form.reset({
        topicsLearned: entry.topicsLearned,
        reflection: entry.reflection,
        linkedCourses: entry.linkedCourses ? entry.linkedCourses.map(c => `${c.id}::${c.name}`) : [],
      });
    }
  }, [isOpen, entry, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const entryRef = doc(firestore, 'users', user.uid, 'journalEntries', entry.id);
      
      const linkedCourses = values.linkedCourses?.map(courseString => {
        const [id, name] = courseString.split('::');
        return { id, name };
      }) || [];

      const dataToSave = {
          topicsLearned: values.topicsLearned,
          reflection: values.reflection,
          linkedCourses: linkedCourses,
      }

      await updateDoc(entryRef, dataToSave);

      toast({
        title: 'Success',
        description: 'Journal entry has been updated.',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update entry. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
          <DialogDescription>
            Make changes to your journal entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Topics Learned</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
                  <FormLabel>Reflection</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
