
'use client';

import { LearningJournalEntry } from '@/lib/types';
import JournalEntryItem from './journal-entry-item';
import { Skeleton } from '../ui/skeleton';
import { BookOpen } from 'lucide-react';
import { FirestoreError } from 'firebase/firestore';

interface JournalEntryListProps {
  entries: LearningJournalEntry[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

export default function JournalEntryList({ entries, isLoading, error }: JournalEntryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Error loading journal entries. Please try again later.</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No entries for today</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click "Add Entry" to log your learning activities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
