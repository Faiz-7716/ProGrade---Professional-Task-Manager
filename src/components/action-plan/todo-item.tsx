'use client';
import { Todo } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleStatusChange = async () => {
        if (!user || !firestore) return;
        const todoRef = doc(firestore, 'users', user.uid, 'todos', todo.id);
        const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
        try {
            await updateDoc(todoRef, { status: newStatus });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update task status.'
            });
        }
    }

    const handleDelete = async () => {
        if (!user || !firestore) return;
        const todoRef = doc(firestore, 'users', user.uid, 'todos', todo.id);
        try {
            await deleteDoc(todoRef);
            toast({
                title: "Task Deleted",
                description: `"${todo.title}" has been removed.`
            })
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete task.'
            });
        }
    }

  return (
    <div className="flex items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors group">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.status === 'completed'}
        onCheckedChange={handleStatusChange}
        className="mr-4"
      />
      <label htmlFor={`todo-${todo.id}`} className={cn(
          "flex-grow cursor-pointer",
          todo.status === 'completed' && "line-through text-muted-foreground"
      )}>
        {todo.title}
      </label>
      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
