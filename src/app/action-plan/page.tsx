
import AllEventsList from "@/components/scheduler/all-events-list";

export default function ActionPlanPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Action Plan</h1>
            <p className="text-muted-foreground mb-8">
                A complete overview of all your upcoming scheduled events and tasks.
            </p>

            <div className="max-w-4xl mx-auto">
                <AllEventsList />
            </div>
        </div>
    );
}
