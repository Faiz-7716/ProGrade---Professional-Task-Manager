'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Update LinkedIn headline', completed: false },
    { id: 2, text: 'Engage with 5 posts in your feed', completed: true },
    { id: 3, text: 'Share an article about your industry', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskObj: Task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Plan</CardTitle>
        <CardDescription>Your personal to-do list for LinkedIn.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-sm cursor-pointer ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.text}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {tasks.length === 0 && (
                <p className="text-center text-sm text-muted-foreground pt-8">
                    Your to-do list is empty. Add a task to get started!
                </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
