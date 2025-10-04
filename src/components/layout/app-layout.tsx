'use client';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import Sidebar from './sidebar';
import Header from './header';
import MobileSidebar from './mobile-sidebar';
import { useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Don't show nav on login/signup
  const noNavPaths = ['/login', '/sign-up'];
  if (!user || noNavPaths.includes(pathname)) {
    return <main className="flex-1 bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar />
      <MobileSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
