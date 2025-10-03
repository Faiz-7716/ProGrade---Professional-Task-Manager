
import AddTodoForm from "@/components/action-plan/add-todo-form";
import TodoList from "@/components/action-plan/todo-list";

export default function ActionPlanPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Action Plan</h1>
            <p className="text-muted-foreground mb-8">
                Your personal to-do list to track your daily and weekly growth tasks.
            </p>

            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <AddTodoForm />
                </div>
                <TodoList />
            </div>
        </div>
    );
}
