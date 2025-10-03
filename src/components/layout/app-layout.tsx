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
    <div className="min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
