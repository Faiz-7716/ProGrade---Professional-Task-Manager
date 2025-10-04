'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { Expense } from '@/lib/types';
import { format, getDaysInMonth, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

interface ExpenseChartProps {
  expenses: Expense[];
  isLoading: boolean;
}

export default function ExpenseChart({ expenses, isLoading }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const daysInMonth = getDaysInMonth(now);
    const monthStart = startOfMonth(now);

    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
        return {
            date: format(date, 'MMM d'),
            day,
            total: 0,
        };
    });

    expenses.forEach(expense => {
        const dayOfMonth = expense.date.toDate().getDate();
        if (dailyTotals[dayOfMonth - 1]) {
            dailyTotals[dayOfMonth - 1].total += expense.amount;
        }
    });

    return dailyTotals;
  }, [expenses]);
  
  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-64 w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>{format(new Date(), 'MMMM yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-64">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
            <Tooltip
                cursor={false}
                content={<ChartTooltipContent
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                    labelFormatter={(label, payload) => {
                        const data = payload[0]?.payload;
                        if (data) {
                            return data.date;
                        }
                        return label;
                    }}
                 />}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
