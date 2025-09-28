'use client';
import ProfileStrength from '@/components/dashboard/profile-strength';
import DailyGrowth from '@/components/dashboard/daily-growth';
import HeadlineGenerator from '@/components/dashboard/headline-generator';
import AboutSectionCreator from '@/components/dashboard/about-section-creator';
import PostWriter from '@/components/dashboard/post-writer';
import ConnectionTemplates from '@/components/dashboard/connection-templates';
import ResumeParser from '@/components/dashboard/resume-parser';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold font-headline mb-4">
          Welcome to LinkedSpark
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your AI-powered assistant for supercharging your LinkedIn presence.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">
              Login to Your Account <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Create an Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Your AI-powered assistant for LinkedIn growth.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <ProfileStrength />
        </div>
        <div className="lg:col-span-2">
          <DailyGrowth />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeadlineGenerator />
        <AboutSectionCreator />
        <PostWriter />
        <ResumeParser />
        <ConnectionTemplates />
      </div>
    </div>
  );
}
