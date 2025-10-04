
'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileStrength from '@/components/dashboard/profile-strength';
import DailyGrowth from '@/components/dashboard/daily-growth';
import ConnectionTemplates from '@/components/dashboard/connection-templates';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  if (isUserLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">
          Welcome back, {user?.displayName || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here's your dashboard to supercharge your LinkedIn presence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileStrength />
        </div>
        <div className="lg:col-span-2">
          <DailyGrowth />
        </div>
        <div className="lg:col-span-3">
          <ConnectionTemplates />
        </div>
      </div>
    </div>
  );
}
