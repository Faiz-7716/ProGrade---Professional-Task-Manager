
import TodoList from "@/components/dashboard/todo-list";

export default function ActionPlanPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Action Plan</h1>
            <p className="text-muted-foreground mb-8">
                Your personal to-do list for LinkedIn growth. Use this space to track your tasks and stay on top of your goals.
            </p>

            <div className="max-w-3xl mx-auto">
                <TodoList />
            </div>
        </div>
    );
}
