'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthProvider,
  sendPasswordResetEmail,
  getRedirectResult,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Icons } from '../icons';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setSocialLoading] = useState<string | null>(null);
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true); // New state
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // A redirect has just completed.
          // The onAuthStateChanged listener in useUser will handle the user state.
          // We can now redirect to the dashboard.
          handleSuccess();
        }
      } catch (error: any) {
        handleError(error, error.customData?._tokenResponse?.providerId);
      } finally {
        // Finished checking for a redirect result.
        setIsCheckingRedirect(false);
      }
    };

    checkRedirectResult();
  }, [auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSuccess = () => {
    toast({
      title: 'Success!',
      description: "You've been successfully logged in.",
    });
    router.push('/');
  };

  const handleError = (error: any, provider?: string) => {
    let description = 'An unexpected error occurred. Please try again.';
    if (provider) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        description =
          'An account already exists with this email. Please sign in with the original method.';
      } else {
        description = `Failed to sign in with ${provider}. Please ensure this provider is enabled in your Firebase console.`;
      }
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      description = 'Invalid email or password.';
    }

    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description,
    });
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: `A password reset link has been sent to ${email}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send password reset email. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      handleSuccess();
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(providerName: 'Google' | 'GitHub') {
    setSocialLoading(providerName);
    setIsLoading(true); // Keep the UI in a loading state
    try {
      let provider: AuthProvider;
      if (providerName === 'Google') {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
      } else {
        provider = new GithubAuthProvider();
      }
      await signInWithRedirect(auth, provider);
      // The page will redirect from here. The result is handled by the useEffect hook on page load.
    } catch (error: any) {
      handleError(error, providerName);
      setIsLoading(false);
      setSocialLoading(null);
    }
  }
  
  const isOverallLoading = isLoading || isCheckingRedirect || !!isSocialLoading;

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your details to sign in to your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      disabled={isOverallLoading}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isOverallLoading}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary hover:underline p-0 h-auto"
                onClick={handlePasswordReset}
                disabled={isOverallLoading}
              >
                Having trouble signing in?
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-6">
            <Button type="submit" disabled={isOverallLoading} size="lg" className="h-12 text-base">
              {(isLoading && !isSocialLoading) && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or Sign in with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="h-12"
                disabled={isOverallLoading}
                onClick={() => handleSocialLogin('Google')}
              >
                {isSocialLoading === 'Google' || isCheckingRedirect ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Icons.google className="mr-2 size-5" />
                    Google
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="h-12"
                disabled={isOverallLoading}
                onClick={() => handleSocialLogin('GitHub')}
              >
                {isSocialLoading === 'GitHub' || isCheckingRedirect ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Icons.github className="mr-2 size-5" />
                    GitHub
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/sign-up"
                className={cn("font-medium text-primary hover:underline", isOverallLoading && "pointer-events-none opacity-50")}
              >
                Request Now
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
