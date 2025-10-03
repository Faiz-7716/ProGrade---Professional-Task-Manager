'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const courseProgressSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  notes: z.string().min(1, 'Notes cannot be empty.'),
});

const formSchema = z.object({
  reflection: z.string().min(10, 'Please describe your reflection in at least 10 characters.'),
  courseProgress: z.array(courseProgressSchema).min(1, "Please add notes for at least one course."),
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
      reflection: entry.reflection,
      courseProgress: entry.courseProgress,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courseProgress',
    keyName: 'key',
  });
  
  const coursesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'courses'),
      orderBy('addedAt', 'desc')
    );
  }, [user, firestore]);

  const { data: courses } = useCollection<Course>(coursesQuery);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        reflection: entry.reflection,
        courseProgress: entry.courseProgress,
      });
    }
  }, [isOpen, entry, form]);

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
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const entryRef = doc(firestore, 'users', user.uid, 'journalEntries', entry.id);

      await updateDoc(entryRef, {
          reflection: values.reflection,
          courseProgress: values.courseProgress,
      });

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
  
  const selectedCourseNames = fields.map(f => f.courseName).join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
          <DialogDescription>
            Make changes to your journal entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
