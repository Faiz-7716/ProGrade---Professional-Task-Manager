
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

interface DeleteEntryDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  entryId: string;
  entryTopic: string;
}

export default function DeleteEntryDialog({
  isOpen,
  setIsOpen,
  entryId,
  entryTopic,
}: DeleteEntryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const entryRef = doc(firestore, 'users', user.uid, 'journalEntries', entryId);
      await deleteDoc(entryRef);
      toast({
        title: 'Success',
        description: `Entry for "${entryTopic}" has been deleted.`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete entry. Please try again.',
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
            This action cannot be undone. This will permanently delete your journal entry
            for "{entryTopic}".
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
