'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import ProfileStrength from '@/components/dashboard/profile-strength';
import DailyGrowth from '@/components/dashboard/daily-growth';
import ConnectionTemplates from '@/components/dashboard/connection-templates';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Lightbulb, PenSquare, ListChecks, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function QuickLinkCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Icon className="h-6 w-6 text-secondary" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 h-10">{description}</CardDescription>
        <Button size="sm" variant="outline" asChild className="group">
          <Link href={href}>
            Open <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

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
         <h1 className="text-4xl font-bold font-headline mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.displayName || user.email}! Here's your growth overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <QuickLinkCard
          href="/profile-optimizer"
          title="Profile Optimizer"
          description="AI tools to enhance your headline, about section, and more."
          icon={Lightbulb}
        />
        <QuickLinkCard
          href="/content-studio"
          title="Content Studio"
          description="Craft engaging LinkedIn posts and find trending hashtags."
          icon={PenSquare}
        />
        <QuickLinkCard
          href="/action-plan"
          title="Action Plan"
          description="Your personal to-do list for tracking growth tasks."
          icon={ListChecks}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyGrowth />
        </div>
        <ProfileStrength />
      </div>

      <div className="mt-6">
        <ConnectionTemplates />
      </div>
    </div>
  );
}
