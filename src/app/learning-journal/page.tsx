
'use client';
import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { format, startOfToday } from 'date-fns';
import { LearningJournalEntry } from '@/lib/types';
import JournalEntryForm from '@/components/learning-journal/journal-entry-form';
import JournalEntryList from '@/components/learning-journal/journal-entry-list';

export default function LearningJournalPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const today = format(startOfToday(), 'yyyy-MM-dd');

  const entriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'journalEntries'),
      where('entryDate', '==', today),
      orderBy('createdAt', 'asc')
    );
  }, [user, firestore, today]);

  const { data: entries, isLoading, error } = useCollection<LearningJournalEntry>(entriesQuery);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-1">Daily Learning Journal</h1>
          <p className="text-muted-foreground">
            Track your learning activities for {format(new Date(), "PPP")}.
          </p>
        </div>
        <JournalEntryForm
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <JournalEntryList
          entries={entries}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
