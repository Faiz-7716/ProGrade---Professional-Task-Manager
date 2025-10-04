'use client';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import Sidebar from './sidebar';
import MobileSidebar from './mobile-sidebar';
import { useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const noNavPaths = ['/login', '/sign-up'];
  const showNav = user && !noNavPaths.includes(pathname);

  if (!showNav) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="min-h-screen w-full">
      <Sidebar />
      <MobileSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-muted-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </button>
           <h1 className="font-semibold text-lg">Prograde</h1>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
