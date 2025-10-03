
'use client';

import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import EventForm from './event-form';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { ScheduledEvent } from '@/lib/types';
import { DayPicker, DayContentProps, DayProps } from 'react-day-picker';

interface EventCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function EventCalendar({
  selectedDate,
  setSelectedDate,
}: EventCalendarProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const allEventsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'scheduledEvents'));
    }, [user, firestore]);

    const { data: allEvents } = useCollection<ScheduledEvent>(allEventsQuery);

    const scheduledDays = useMemoFirebase(() => {
        return allEvents
        ? allEvents.map((event) => parseISO(event.date))
        : [];
    }, [allEvents]);

  const DayContent = (props: DayContentProps) => {
    const isScheduled = scheduledDays.some(
      (scheduledDay) => format(scheduledDay, 'yyyy-MM-dd') === format(props.date, 'yyyy-MM-dd')
    );
    return (
      <div className="relative flex items-center justify-center h-full w-full">
        <span>{format(props.date, 'd')}</span>
        {isScheduled && (
          <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </div>
    );
  };
  
  const Day = (props: DayProps & { dayNumber: number }) => {
     return <DayContent {...props} />;
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(day) => day && setSelectedDate(day)}
        className="rounded-md border"
        components={{
            Day: (props) => <Day {...props} dayNumber={props.date.getDate()} />,
        }}
      />
      <EventForm
        key={format(selectedDate, 'yyyy-MM-dd')}
        selectedDate={format(selectedDate, 'yyyy-MM-dd')}
      />
    </div>
  );
}
