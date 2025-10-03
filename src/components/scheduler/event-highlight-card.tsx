
'use client';
import { ScheduledEvent } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Calendar } from 'lucide-react';

interface EventHighlightCardProps {
  event: ScheduledEvent;
}

export default function EventHighlightCard({ event }: EventHighlightCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description || "No description."}</CardDescription>
      </CardHeader>
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-6 pb-4">
        <Calendar className="h-4 w-4" />
        <span>{format(new Date(event.eventDate), 'PPP')}</span>
      </div>
    </Card>
  );
}
