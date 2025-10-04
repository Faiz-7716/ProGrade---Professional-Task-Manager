'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TodoList from "@/components/action-plan/todo-list";
import AddTodoForm from "@/components/action-plan/add-todo-form";

export default function ActionPlanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Action Plan</h1>
      <p className="text-muted-foreground mb-8">
        Your personal to-do list for tracking growth tasks.
      </p>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My To-Do List</CardTitle>
          <CardDescription>
            A place to organize your tasks and stay on track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddTodoForm />
          <TodoList />
        </CardContent>
      </Card>
    </div>
  );
}
