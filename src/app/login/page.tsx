
import LoginForm from '@/components/auth/login-form';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const loginIllustration = getPlaceholderImage('login-illustration');
  return (
    <div className="min-h-screen font-sans antialiased">
      <div className="grid md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-primary/5">
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105 w-fit">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg font-headline">Prograde</span>
          </Link>
          {loginIllustration && (
            <div className="flex justify-center">
              <Image
                src={loginIllustration.imageUrl}
                alt={loginIllustration.description}
                width={500}
                height={500}
                className="object-contain"
                data-ai-hint={loginIllustration.imageHint}
              />
            </div>
          )}
          <div className="text-sm">
            <p className="font-semibold">Your AI-powered LinkedIn assistant.</p>
            <p className="text-muted-foreground">Supercharge your presence.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
