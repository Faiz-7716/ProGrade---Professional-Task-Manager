
'use client';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EventForm from '@/components/scheduler/event-form';
import EventList from '@/components/scheduler/event-list';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { ScheduledEvent } from '@/lib/types';
import { DayPicker, DayContentProps, DayProps } from 'react-day-picker';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUser();
  const firestore = useFirestore();

  const allEventsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'scheduledEvents'));
  }, [user, firestore]);

  const { data: allEvents } = useCollection<ScheduledEvent>(allEventsQuery);

  const scheduledDays = useMemoFirebase(() => {
    return allEvents
      ? allEvents.map((event) => parseISO(event.eventDate))
      : [];
  }, [allEvents]);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
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
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">
            Scheduler
          </h1>
          <p className="text-muted-foreground">
            Manage your events, tasks, and appointments.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(day) => day && setSelectedDate(day)}
              modifiers={{}}
              components={{
                Day: (props) => <Day {...props} dayNumber={props.date.getDate()} />,
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventList selectedDate={formattedDate} />
        </div>
        <div className="lg:col-span-1">
          <EventForm selectedDate={formattedDate} key={formattedDate} />
        </div>
      </div>
    </div>
  );
}
