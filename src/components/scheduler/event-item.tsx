
'use client';

import { ScheduledEvent } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface EventItemProps {
  event: ScheduledEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    if (!user || !firestore) return;
    const eventRef = doc(firestore, 'users', user.uid, 'scheduledEvents', event.id);
    const newStatus = event.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateDoc(eventRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Event marked as ${newStatus.toLowerCase()}.`,
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
    const eventRef = doc(firestore, 'users', user.uid, 'scheduledEvents', event.id);
     try {
      await deleteDoc(eventRef);
      toast({
        title: 'Event Deleted',
        description: 'The event has been removed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete event.',
      });
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-card flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
            <Badge
                variant={event.status === 'Completed' ? 'default' : 'secondary'}
                className={
                event.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : ''
                }
            >
                {event.status}
            </Badge>
            <h4 className="font-semibold text-base">{event.title}</h4>
        </div>
        {event.description && <p className="text-sm text-muted-foreground ml-3">{event.description}</p>}
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
  );
}
