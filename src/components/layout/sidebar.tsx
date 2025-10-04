'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ListChecks,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import Image from 'next/image';

export const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListChecks, badge: '12+' },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/team', label: 'Team', icon: Users },
];

export const generalLinks = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 rounded-lg px-4 py-2.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary relative',
        isActive && 'bg-primary/10 text-primary'
      )}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />}
      <Icon className="h-5 w-5" />
      <span className="font-medium flex-grow">{label}</span>
      {badge && <span className="text-xs bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </Link>
  );
}

export function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-20 shrink-0 items-center border-b px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl text-foreground"
        >
          <Icons.logo className="h-8 w-8 text-primary" />
          <span>Donezo</span>
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-between p-4">
        <nav className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">Menu</p>
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} onClick={onLinkClick} />
          ))}
        </nav>

        <div>
            <div className="bg-primary/90 text-primary-foreground p-4 rounded-lg text-center relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-primary-foreground/10 rounded-full"></div>
                <h4 className="font-semibold">Download our Mobile App</h4>
                <p className="text-xs text-primary-foreground/80 mt-1 mb-3">Get easy in another way</p>
                <Button variant="secondary" className="bg-primary-foreground text-primary w-full">Download</Button>
            </div>
        </div>

        <nav className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">General</p>
          {generalLinks.map((link) => (
            <NavLink key={link.href} {...link} onClick={onLinkClick} />
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-2.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card md:flex">
      <SidebarContent />
    </aside>
  );
}

    