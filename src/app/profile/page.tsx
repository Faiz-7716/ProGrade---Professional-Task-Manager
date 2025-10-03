
'use client';

import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { redirect, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, LogOut, Edit, KeyRound, Calendar } from 'lucide-react';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
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

  const handleChangePassword = async () => {
    if (!user?.email) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not send password reset email. User email not found."
        });
        return;
    }
    try {
        await sendPasswordResetEmail(auth, user.email);
        toast({
            title: "Password Reset Email Sent",
            description: `A password reset link has been sent to ${user.email}.`
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send password reset email. Please try again later."
        });
    }
  }

  if (isUserLoading) {
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
  
  const creationDate = user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "PPP") : 'N/A';

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
                <div className="text-muted-foreground mt-2 space-y-2">
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                      <Mail className="h-4 w-4" />
                      {user.email}
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar className="h-4 w-4" />
                    Account created on {creationDate}
                  </p>
                </div>
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
                            <h3 className="font-semibold">Edit Profile</h3>
                            <p className="text-sm text-muted-foreground">Update your name, avatar, and email.</p>
                        </div>
                        <Button variant="outline" disabled>
                           <Edit className="mr-2 h-4 w-4" />
                           Edit
                        </Button>
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <h3 className="font-semibold">Change Password</h3>
                            <p className="text-sm text-muted-foreground">Send a password reset link to your email.</p>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword}>
                           <KeyRound className="mr-2 h-4 w-4" />
                           Change
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <h3 className="font-semibold">Logout</h3>
                            <p className="text-sm text-muted-foreground">Sign out of your account.</p>
                        </div>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
