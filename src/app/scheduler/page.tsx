
'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import EventList from '@/components/scheduler/event-list';
import EventCalendar from '@/components/scheduler/event-calendar';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Scheduler</h1>
      <p className="text-muted-foreground mb-8">
        Manage your events and plan your day.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventList selectedDate={formattedDate} />
        </div>
        <div className="lg:col-span-1">
          <EventCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
