'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Todo } from '@/lib/types';
import TodoItem from './todo-item';

export default function TodoList() {
  const { user } = useUser();
  const firestore = useFirestore();

  const todosQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'todos'),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: todos, isLoading, error } = useCollection<Todo>(todosQuery);

  return (
    <div className="mt-6 space-y-2">
      {isLoading && (
        <>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </>
      )}

      {!isLoading && todos && todos.length > 0 && (
        todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
      )}

      {!isLoading && (!todos || todos.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You have no tasks yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Add a task above to get started!
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-destructive">
          <p>Error loading tasks. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
