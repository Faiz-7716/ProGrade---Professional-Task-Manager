'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
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

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setSocialLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSuccess = () => {
    toast({
      title: 'Account Created!',
      description: 'You have been successfully signed up.',
    });
    router.push('/');
  };

  const handleError = (error: any, provider?: string) => {
    let description = 'An unexpected error occurred. Please try again.';
    if (provider) {
       if (error.code === 'auth/account-exists-with-different-credential') {
        description =
          'An account already exists with the same email address but different sign-in credentials. Please log in with the original method.';
      } else {
        description = `Failed to sign up with ${provider}. Please check your Firebase project configuration and try again later.`;
      }
    } else if (error.code === 'auth/email-already-in-use') {
      description = 'This email is already associated with an account. Please log in instead.';
    }

    toast({
      variant: 'destructive',
      title: 'Sign Up Failed',
      description,
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      handleSuccess();
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialSignUp(providerName: 'Google' | 'GitHub') {
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Choose a sign-up method below to get started.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                disabled={!!isSocialLoading}
                onClick={() => handleSocialSignUp('Google')}
              >
                {isSocialLoading === 'Google' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Icons.google className="size-5" />
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={!!isSocialLoading}
                onClick={() => handleSocialSignUp('GitHub')}
              >
                {isSocialLoading === 'GitHub' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Icons.github className="size-5" />
                )}
              </Button>
            </div>

             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

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
                    <Input type="password" placeholder="••••••••" {...field} 
                    disabled={!!isSocialLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading || !!isSocialLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              Create Account with Email
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
