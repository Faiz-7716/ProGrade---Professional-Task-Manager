'use client';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import Sidebar from './sidebar';
import MobileSidebar from './mobile-sidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Icons } from '../icons';
import Link from 'next/link';

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

      <div className="flex flex-col pl-0 md:pl-20">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/50 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold">Prograde</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted-foreground md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
