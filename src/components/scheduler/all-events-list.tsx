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
import { format } from 'date-fns';

export default function AllEventsList() {
  const { user } = useUser();
  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'scheduledEvents'),
      where('status', '==', 'Pending'),
      orderBy('eventDate', 'asc'),
      orderBy('createdAt', 'asc')
    );
  }, [user, firestore]);

  const {
    data: events,
    isLoading,
    error,
  } = useCollection<ScheduledEvent>(eventsQuery);

  const groupedEvents = useMemoFirebase(() => {
    if (!events) return {};
    return events.reduce((acc, event) => {
      const date = format(new Date(event.eventDate), 'PPP');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, ScheduledEvent[]>);
  }, [events]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>
          All your pending events and tasks, sorted by date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading && (
            <>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          )}

          {!isLoading && events && events.length > 0 && groupedEvents && (
            Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <div key={date}>
                    <h3 className="text-lg font-semibold mb-3 sticky top-0 bg-background/95 py-2 backdrop-blur-sm">
                        {date}
                    </h3>
                    <div className="space-y-4">
                        {dateEvents.map((event) => (
                           <EventItem key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            ))
          )}

          {!isLoading && (!events || events.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You have no pending tasks.
              </p>
              <p className="text-sm text-muted-foreground">
                Go to the Scheduler to add a new event.
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
