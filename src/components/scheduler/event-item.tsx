
'use client';
import { ScheduledEvent } from '@/lib/types';
import { Button } from '../ui/button';
import { Check, Trash2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EventItemProps {
  event: ScheduledEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    if (!user || !firestore) return;
    const eventRef = doc(
      firestore,
      'users',
      user.uid,
      'scheduledEvents',
      event.id
    );
    const newStatus = event.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateDoc(eventRef, { status: newStatus });
      toast({
        title: 'Event Updated',
        description: `"${event.title}" marked as ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update event status.',
      });
    }
  };

  const handleDelete = async () => {
    if (!user || !firestore) return;
    const eventRef = doc(
      firestore,
      'users',
      user.uid,
      'scheduledEvents',
      event.id
    );
    try {
      await deleteDoc(eventRef);
      toast({
        title: 'Event Deleted',
        description: `"${event.title}" has been removed.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete event.',
      });
    }
  };

  const isCompleted = event.status === 'Completed';

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <Button
        variant={isCompleted ? 'default' : 'outline'}
        size="icon"
        className={cn(
          'h-8 w-8 rounded-full',
          isCompleted && 'bg-green-500 hover:bg-green-600'
        )}
        onClick={handleToggleStatus}
      >
        <Check className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <p
          className={cn(
            'font-medium',
            isCompleted && 'text-muted-foreground line-through'
          )}
        >
          {event.title}
        </p>
        {event.description && (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              isCompleted && 'line-through'
            )}
          >
            {event.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
