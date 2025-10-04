'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { Expense } from '@/lib/types';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';

import ExpenseChart from '@/components/expense-tracker/expense-chart';
import ExpenseSummary from '@/components/expense-tracker/expense-summary';
import RecentExpenses from '@/components/expense-tracker/recent-expenses';
import AddExpenseSheet from '@/components/expense-tracker/add-expense-sheet';

export default function ExpenseTrackerPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);

  const expensesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'expenses'),
      where('date', '>=', Timestamp.fromDate(monthStart)),
      where('date', '<=', Timestamp.fromDate(monthEnd)),
      orderBy('date', 'desc')
    );
  }, [user, firestore, monthStart, monthEnd]);

  const { data: expenses, isLoading, error } = useCollection<Expense>(expensesQuery);

  const totalBalance = expenses
    ? expenses.reduce((sum, exp) => sum - exp.amount, 32500) // Mock starting balance
    : 32500;

  const monthExpenses = expenses || [];
  const weekExpenses =
    expenses?.filter(
      (exp) => exp.date.toDate() >= weekStart && exp.date.toDate() <= weekEnd
    ) || [];
  const dayExpenses =
    expenses?.filter(
      (exp) => exp.date.toDate() >= dayStart && exp.date.toDate() <= dayEnd
    ) || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Monitor your spending and manage your budget.
          </p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">Total Balance</p>
        <p className="text-4xl font-bold font-headline">
          {totalBalance.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <ExpenseChart expenses={monthExpenses} isLoading={isLoading} />
        </div>
         <div className="flex flex-col gap-6">
            <ExpenseSummary
                dayTotal={dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
                weekTotal={weekExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
                monthTotal={monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
                isLoading={isLoading}
            />
        </div>
      </div>
      
      <div className="mt-6">
        <RecentExpenses expenses={monthExpenses.slice(0, 5)} isLoading={isLoading} />
      </div>

      <AddExpenseSheet isOpen={isSheetOpen} setIsOpen={setSheetOpen} />
    </div>
  );
}
