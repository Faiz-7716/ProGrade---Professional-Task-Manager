'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { redirect, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const userAvatar = getPlaceholderImage('user-avatar');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage
                src={user.photoURL || userAvatar?.imageUrl}
                alt={user.displayName || 'User avatar'}
                />
                <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left pt-2">
                <h1 className="text-3xl font-bold font-headline">
                {user.displayName || 'Welcome!'}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                    <Mail className="h-4 w-4" />
                    {user.email}
                </p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>My Account</CardTitle>
                <CardDescription>Manage your profile and settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <h3 className="font-semibold">Logged in as</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <h3 className="font-semibold">Need Help?</h3>
                            <p className="text-sm text-muted-foreground">Contact our support team.</p>
                        </div>
                        <Button variant="outline" asChild>
                           <Link href="#">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
