'use client';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Course } from '@/lib/types';
import { Slider } from '../ui/slider';

const formSchema = z.object({
  modulesCompleted: z.coerce.number().min(0),
});

interface EditCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  course: Course;
}

export default function EditCourseDialog({
  isOpen,
  setIsOpen,
  course,
}: EditCourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modulesCompleted: course.modulesCompleted,
    },
  });

  const modulesCompleted = form.watch('modulesCompleted');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const courseRef = doc(firestore, 'users', user.uid, 'courses', course.id);
      
      let newStatus: Course['status'] = 'Ongoing';
      if (values.modulesCompleted <= 0) {
        newStatus = 'Not Started';
      } else if (values.modulesCompleted >= course.totalModules) {
        newStatus = 'Completed';
      }

      await updateDoc(courseRef, { 
        modulesCompleted: values.modulesCompleted,
        status: newStatus
      });

      toast({
        title: 'Success',
        description: 'Course progress has been updated.',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update course. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course Progress</DialogTitle>
          <DialogDescription>
            Update the number of modules you've completed for "{course.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="modulesCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modules Completed: {modulesCompleted} / {course.totalModules}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={course.totalModules}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
