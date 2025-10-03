'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthProvider,
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
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

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
          'An account already exists with the same email address but different sign-in credentials.';
      } else {
        description = `Failed to sign in with ${provider}. Please check your Firebase project configuration and try again later.`;
      }
    } else if (error.code === 'auth/invalid-credential') {
      description = 'Invalid email or password.';
    }

    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description,
    });
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
    try {
      let provider: AuthProvider;
      if (providerName === 'Google') {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
      } else {
        provider = new GithubAuthProvider();
      }
      await signInWithPopup(auth, provider);
      handleSuccess();
    } catch (error: any) {
      handleError(error, providerName);
    } finally {
      setSocialLoading(null);
    }
  }

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
                      disabled={!!isSocialLoading}
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
                      disabled={!!isSocialLoading}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary hover:underline">
                Having trouble signing in?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-6">
            <Button type="submit" disabled={isLoading || !!isSocialLoading} size="lg" className="h-12 text-base">
              {isLoading && <Loader2 className="animate-spin" />}
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
                disabled={!!isSocialLoading}
                onClick={() => handleSocialLogin('Google')}
              >
                {isSocialLoading === 'Google' ? (
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
                disabled={!!isSocialLoading}
                onClick={() => handleSocialLogin('GitHub')}
              >
                {isSocialLoading === 'GitHub' ? (
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
                className="font-medium text-primary hover:underline"
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
