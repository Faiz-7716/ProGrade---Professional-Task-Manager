
'use client';
import { useState, useEffect } from 'react';
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
import JournalEntryForm from '@/components/journal/journal-entry-form';
import JournalEntryList from '@/components/journal/journal-entry-list';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { JournalEntry } from '@/lib/types';
import { DayPicker, DayContentProps, DayProps } from 'react-day-picker';

export default function DailyJournalPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUser();
  const firestore = useFirestore();

  const allEntriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'journalEntries'));
  }, [user, firestore]);

  const { data: allEntries } = useCollection<JournalEntry>(allEntriesQuery);

  const scheduledDays = useMemoFirebase(() => {
    return allEntries
      ? allEntries.map((entry) => parseISO(entry.entryDate))
      : [];
  }, [allEntries]);

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
  
  const Day = (props: DayProps) => {
     return <DayContent {...props} dayNumber={props.date.getDate()}/>
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">
            Daily Journal
          </h1>
          <p className="text-muted-foreground">
            Track your learnings, schedule tasks, and reflect on your progress.
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
              components={{ Day: Day }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <JournalEntryList selectedDate={formattedDate} />
        </div>
        <div className="lg:col-span-1">
          <JournalEntryForm selectedDate={formattedDate} key={formattedDate} />
        </div>
      </div>
    </div>
  );
}
