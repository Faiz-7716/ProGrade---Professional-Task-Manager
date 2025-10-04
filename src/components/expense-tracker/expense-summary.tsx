'use client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface ExpenseSummaryProps {
    dayTotal: number;
    weekTotal: number;
    monthTotal: number;
    isLoading: boolean;
}

function SummaryCard({ title, amount, isLoading }: { title: string, amount: number, isLoading: boolean }) {
    return (
        <Card className="text-center">
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                {isLoading ? <Skeleton className="h-7 w-24 mx-auto" /> : (
                    <p className="text-2xl font-bold">
                        {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ExpenseSummary({ dayTotal, weekTotal, monthTotal, isLoading }: ExpenseSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Day" amount={dayTotal} isLoading={isLoading} />
        <SummaryCard title="Week" amount={weekTotal} isLoading={isLoading} />
        <SummaryCard title="Month" amount={monthTotal} isLoading={isLoading} />
    </div>
  );
}
