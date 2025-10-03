
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
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { ScheduledEvent } from '@/lib/types';
import EventItem from './event-item';

interface EventListProps {
  selectedDate: string; // YYYY-MM-DD
}

export default function EventList({
  selectedDate,
}: EventListProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'scheduledEvents'),
      where('eventDate', '==', selectedDate),
      orderBy('createdAt', 'asc')
    );
  }, [user, firestore, selectedDate]);

  const {
    data: events,
    isLoading,
    error,
  } = useCollection<ScheduledEvent>(eventsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Events</CardTitle>
        <CardDescription>
          Your events and tasks for the selected date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          )}

          {!isLoading && events && events.length > 0 && (
            events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))
          )}

          {!isLoading && (!events || events.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No events scheduled for this date.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the form to add a new event.
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-destructive">
              <p>Error loading events. Please try again later.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
