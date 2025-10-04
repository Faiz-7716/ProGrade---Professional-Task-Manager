
'use client';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BrainCircuit,
  Check,
  CheckCircle,
  Clock,
  ListChecks,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Label, Pie, PieChart } from 'recharts';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
  { day: 'S', tasks: 10 },
  { day: 'M', tasks: 25 },
  { day: 'T', tasks: 74 },
  { day: 'W', tasks: 80 },
  { day: 'T', tasks: 30 },
  { day: 'F', tasks: 20 },
  { day: 'S', tasks: 15 },
];

const progressChartData = [
  { status: 'completed', value: 41, fill: 'hsl(var(--primary))' },
  { status: 'empty', value: 59, fill: 'hsl(var(--muted))' },
];

const teamMembers = [
  {
    name: 'Alexandra Deff',
    task: 'Working on Github Project Repository',
    status: 'Completed',
    avatarId: 'user-avatar-1',
  },
  {
    name: 'Edwin Adenike',
    task: 'Working on Integrate User Authentication System',
    status: 'In Progress',
    avatarId: 'user-avatar-2',
  },
  {
    name: 'Isaac Oluwatemilorun',
    task: 'Working on Develop Search and Filter Functionality',
    status: 'Pending',
    avatarId: 'user-avatar-3',
  },
];

function StatCard({
  title,
  value,
  change,
  changeType,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'on-discuss';
}) {
  const isPrimary = title === 'Total Projects';
  return (
    <Card
      className={
        isPrimary
          ? 'bg-primary text-primary-foreground'
          : 'bg-card hover:bg-card'
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className={isPrimary ? 'text-primary-foreground/90' : ''}>
            {title}
          </p>
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <div className="flex items-center gap-1 text-sm mt-1">
          {changeType !== 'on-discuss' && (
            <Activity
              className={`h-4 w-4 ${changeType === 'increase' ? '' : 'rotate-180'}`}
            />
          )}
          <span className={isPrimary ? 'text-primary-foreground/90' : ''}>
            {change}
          </span>
        </div>
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
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import Data</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value="24"
          change="Increased from last month"
          changeType="increase"
        />
        <StatCard
          title="Ended Projects"
          value="10"
          change="Increased from last month"
          changeType="increase"
        />
        <StatCard
          title="Running Projects"
          value="12"
          change="Increased from last month"
          changeType="increase"
        />
        <StatCard
          title="Pending Project"
          value="2"
          change="On Discuss"
          changeType="on-discuss"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer config={{}} className="h-full w-full">
              <BarChart data={chartData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <Bar dataKey="tasks" radius={8}>
                  {chartData.map((entry, index) => (
                     <div key={`cell-${index}`} fill={entry.day === 'T' && entry.tasks === 74 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
             <h3 className="text-lg font-semibold">Meeting with Arc Company</h3>
             <p className="text-muted-foreground text-sm">Time: 02:00 pm - 04:00 pm</p>
             <Button className="mt-4 w-full">
                <Play className="mr-2 h-4 w-4" /> Start Meeting
             </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Team Collaboration</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member, index) => {
              const avatar = getPlaceholderImage(member.avatarId);
              return (
                <div key={index} className="flex items-center gap-4">
                  {avatar && <Image src={avatar.imageUrl} alt={member.name} width={40} height={40} className="rounded-full" />}
                  <div className="flex-grow">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.task}</p>
                  </div>
                  <Badge variant={
                      member.status === 'Completed' ? 'default' :
                      member.status === 'In Progress' ? 'secondary' : 'destructive'
                  } className="bg-opacity-20 text-opacity-100">
                    {member.status}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Develop API Endpoints', 'Onboarding Flow', 'Build Dashboard'].map((task, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{task}</p>
                  <p className="text-xs text-muted-foreground">Due date: Nov 26, 2024</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
               <div className="h-[150px] w-full">
                <ChartContainer config={{}} className="mx-auto aspect-square h-full">
                  <PieChart>
                    <Pie data={progressChartData} dataKey="value" startAngle={90} endAngle={450} innerRadius="70%" outerRadius="85%" cornerRadius={50} cy="50%">
                       <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">41%</tspan>
                                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-sm">Project Ended</tspan>
                                </text>
                              );
                            }
                          }}
                        />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2"> <div className="h-2 w-2 rounded-full bg-primary" /> Completed </div>
                <div className="flex items-center gap-2 text-muted-foreground"> <div className="h-2 w-2 rounded-full bg-muted" /> In Progress </div>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-primary/90 text-primary-foreground dark:bg-primary/90 dark:text-primary-foreground">
             <CardHeader>
                <CardTitle className="text-primary-foreground">Time Tracker</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="text-6xl font-bold font-mono tracking-widest">
                  01:24:08
                </div>
                <div className="flex gap-4">
                  <Button size="icon" className="rounded-full h-14 w-14 bg-primary-foreground text-primary hover:bg-primary-foreground/90"> <Pause className="h-6 w-6" /> </Button>
                  <Button size="icon" className="rounded-full h-14 w-14 bg-red-500 text-white hover:bg-red-600"> <Play className="h-6 w-6" /> </Button>
                </div>
             </CardContent>
          </Card>
       </div>
    </div>
  );
}

    