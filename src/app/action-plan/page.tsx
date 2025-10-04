
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export default function ActionPlanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Action Plan</h1>
        <p className="text-muted-foreground mb-8">
            Your personal to-do list for tracking growth tasks.
        </p>
        <Card>
            <CardHeader>
                <CardTitle>My To-Do List</CardTitle>
                <CardDescription>A place to organize your tasks and stay on track.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                        The to-do list is currently under maintenance.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please check back later!
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
