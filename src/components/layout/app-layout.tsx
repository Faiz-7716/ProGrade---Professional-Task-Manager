
'use client';
import { usePathname } from 'next/navigation';
import Header from './header';
import { useAuth } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const noHeaderPaths = ['/login', '/sign-up'];
  const showHeader = user && !noHeaderPaths.includes(pathname);

  // When not logged in and on a public page like login/signup, we don't want the main layout.
  // The useAuth hook handles the loading state.
  if (!user && noHeaderPaths.includes(pathname)) {
    return <main className="flex-1">{children}</main>;
  }

  // For all other cases (logged in, or loading, or on public homepage)
  return (
    <>
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
    </>
  );
}
