'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import ProfileStrength from '@/components/dashboard/profile-strength';
import DailyGrowth from '@/components/dashboard/daily-growth';
import ConnectionTemplates from '@/components/dashboard/connection-templates';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Lightbulb, PenSquare, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function QuickLink({
  href,
  title,
  icon: Icon,
}: {
  href: string;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <div className="p-6 bg-card hover:bg-muted rounded-lg border transition-all h-full flex flex-col justify-center items-center text-center">
        <Icon className="h-8 w-8 mb-2 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
    </Link>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  // While loading or redirecting, you can show a loader or nothing
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* You can add a loading spinner here if you want */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back! Here's your LinkedIn growth overview.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <QuickLink
          href="/profile-optimizer"
          title="Profile Optimizer"
          icon={Lightbulb}
        />
        <QuickLink
          href="/content-studio"
          title="Content Studio"
          icon={PenSquare}
        />
        <QuickLink
          href="/action-plan"
          title="Action Plan"
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
