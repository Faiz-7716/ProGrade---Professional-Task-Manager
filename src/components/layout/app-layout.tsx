'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from './sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const noNavPaths = ['/login', '/sign-up'];
  const showSidebar = user && !noNavPaths.includes(pathname);

  if (!showSidebar) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
