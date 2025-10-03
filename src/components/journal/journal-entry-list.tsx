
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { JournalEntry } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface JournalEntryListProps {
  selectedDate: string; // YYYY-MM-DD
}

function JournalEntryItem({ entry }: { entry: JournalEntry }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    if (!user || !firestore) return;
    const entryRef = doc(
      firestore,
      'users',
      user.uid,
      'journalEntries',
      entry.id
    );
    const newStatus = entry.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateDoc(entryRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Entry marked as ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status.',
      });
    }
  };
  
  const handleDelete = async () => {
    if (!user || !firestore) return;
    const entryRef = doc(
      firestore,
      'users',
      user.uid,
      'journalEntries',
      entry.id
    );
     try {
      await deleteDoc(entryRef);
      toast({
        title: 'Entry Deleted',
        description: 'The journal entry has been removed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete entry.',
      });
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Badge
            variant={entry.status === 'Completed' ? 'default' : 'secondary'}
            className={
              entry.status === 'Completed'
                ? 'bg-green-100 text-green-800'
                : ''
            }
          >
            {entry.status}
          </Badge>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleToggleStatus}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Topics Learned</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {entry.topicsLearned}
          </p>
        </div>
         <div>
          <h4 className="font-semibold text-sm mb-1">Scheduled Tasks</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.scheduledTasks}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Reflection</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.reflection}</p>
        </div>
      </div>
    </div>
  );
}

export default function JournalEntryList({
  selectedDate,
}: JournalEntryListProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const entriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'journalEntries'),
      where('entryDate', '==', selectedDate)
    );
  }, [user, firestore, selectedDate]);

  const {
    data: entries,
    isLoading,
    error,
  } = useCollection<JournalEntry>(entriesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
        <CardDescription>
          Your saved entries for the selected date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-32 w-full" />
            </>
          )}

          {!isLoading && entries && entries.length > 0 && (
            entries.map((entry) => (
              <JournalEntryItem key={entry.id} entry={entry} />
            ))
          )}

          {!isLoading && (!entries || entries.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No journal entry for this date.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the form to add a new entry for this day.
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-destructive">
              <p>Error loading journal entries. Please try again later.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
