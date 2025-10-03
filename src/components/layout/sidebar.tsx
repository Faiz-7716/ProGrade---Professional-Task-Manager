'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Lightbulb,
  PenSquare,
  ListChecks,
  User,
  LogOut,
  Settings,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/profile-optimizer', label: 'Profile Optimizer', icon: Lightbulb },
  { href: '/content-studio', label: 'Content Studio', icon: PenSquare },
  { href: '/action-plan', label: 'Action Plan', icon: ListChecks },
];

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const userAvatar = getPlaceholderImage('user-avatar');

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return null;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="">LinkedSpark</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="w-full justify-start gap-2 px-2"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src={user.photoURL || userAvatar?.imageUrl}
                    alt={user.displayName || userAvatar?.description}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold leading-none">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    View Profile
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-xs">Signed in as</p>
                <p className="truncate text-sm font-medium">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
