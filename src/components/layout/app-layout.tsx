
'use client';
import { usePathname } from 'next/navigation';
import Header from './header';
import { useAuth } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const noHeaderPaths = ['/login', '/sign-up'];
  const showHeader = user && !noHeaderPaths.includes(pathname);

  if (!user && !noHeaderPaths.includes(pathname)) {
    return (
      <>
        <Header />
        <main className="flex-1">{children}</main>
      </>
    );
  }
  
  if (!user && noHeaderPaths.includes(pathname)) {
     return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
    </>
  );
}
