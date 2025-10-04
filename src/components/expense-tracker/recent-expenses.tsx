'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Expense } from '@/lib/types';
import {
  ShoppingBag,
  Gift,
  Utensils,
  Car,
  HeartPulse,
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const categoryIcons: { [key: string]: LucideIcon } = {
  Shopping: ShoppingBag,
  Gifts: Gift,
  Food: Utensils,
  Transport: Car,
  Health: HeartPulse,
  Other: MoreHorizontal,
};

interface RecentExpensesProps {
    expenses: Expense[];
    isLoading: boolean;
}

export default function RecentExpenses({ expenses, isLoading }: RecentExpensesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your last few expenses this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-4 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="ml-auto h-5 w-20" />
              </div>
          ))}
          {!isLoading && expenses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No expenses recorded yet.</p>
          )}
          {!isLoading && expenses.map(expense => {
            const Icon = categoryIcons[expense.category] || MoreHorizontal;
            return (
              <div key={expense.id} className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold">{expense.category}</p>
                  <p className="text-sm text-muted-foreground">{expense.paymentMethod}</p>
                </div>
                <p className="ml-auto font-semibold">
                    {expense.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
