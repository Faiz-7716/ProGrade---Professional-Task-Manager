'use client';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeleteCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  courseId: string;
  courseName: string;
}

export default function DeleteCourseDialog({
  isOpen,
  setIsOpen,
  courseId,
  courseName,
}: DeleteCourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const courseRef = doc(firestore, 'users', user.uid, 'courses', courseId);
      await deleteDoc(courseRef);
      toast({
        title: 'Success',
        description: `"${courseName}" has been deleted.`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete course. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your course
            "{courseName}" from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
             <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
             </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
