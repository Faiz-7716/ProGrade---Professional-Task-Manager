'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import ProfileStrength from '@/components/dashboard/profile-strength';
import DailyGrowth from '@/components/dashboard/daily-growth';
import ConnectionTemplates from '@/components/dashboard/connection-templates';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Lightbulb, PenSquare, ListChecks, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between">
          <span>{title}</span>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" asChild>
          <Link href={href}>
            Open <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* The AuthProvider shows a skeleton loader, so this can be empty */}
      </div>
    );
  }

  if (!user) {
    redirect('/login');
    return null; // Return null to prevent rendering anything while redirecting
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold font-headline mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your LinkedIn growth overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <QuickLinkCard
          href="/profile-optimizer"
          title="Profile Optimizer"
          description="Tools to enhance your profile."
          icon={Lightbulb}
        />
        <QuickLinkCard
          href="/content-studio"
          title="Content Studio"
          description="Craft engaging LinkedIn content."
          icon={PenSquare}
        />
        <QuickLinkCard
          href="/action-plan"
          title="Action Plan"
          description="Your personal to-do list."
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
