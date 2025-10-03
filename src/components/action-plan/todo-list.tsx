'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const pendingTodos = todos?.filter(t => t.status === 'pending');
  const completedTodos = todos?.filter(t => t.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          A list of all your tasks to complete.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
             <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pending</h3>
             <div className="space-y-2">
                {isLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                {!isLoading && pendingTodos && pendingTodos.length > 0 && (
                    pendingTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
                )}
                {!isLoading && (!pendingTodos || pendingTodos.length === 0) && (
                    <p className="text-sm text-center py-4 text-muted-foreground">No pending tasks. Great job!</p>
                )}
             </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Completed</h3>
            <div className="space-y-2">
                {!isLoading && completedTodos && completedTodos.length > 0 && (
                    completedTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
                )}
                {!isLoading && (!completedTodos || completedTodos.length === 0) && (
                    <p className="text-sm text-center py-4 text-muted-foreground">No completed tasks yet.</p>
                )}
            </div>
          </div>
           {error && (
            <div className="text-center py-12 text-destructive">
                <p>Error loading tasks. Please try again later.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
