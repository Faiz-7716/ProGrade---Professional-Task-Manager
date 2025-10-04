'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Lightbulb,
  PenSquare,
  User,
  LogOut,
  Settings,
  BookMarked,
  BrainCircuit,
  History,
  BookText,
  ListChecks,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { useUser, useAuth } from '@/firebase';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '../theme-toggle';

export const navLinks = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/daily-journal', label: 'Daily Journal', icon: BookText },
  { href: '/profile-optimizer', label: 'Profile Optimizer', icon: Lightbulb },
  { href: '/content-studio', label: 'Content Studio', icon: PenSquare },
  { href: '/course-manager', label: 'Course Manager', icon: BookMarked },
  { href: '/quiz-generator', label: 'Knowledge Forge', icon: BrainCircuit },
  { href: '/quiz-history', label: 'Quiz History', icon: History },
  { href: '/expense-tracker', label: 'Expense Tracker', icon: Wallet },
];

export function NavLink({
  href,
  label,
  icon: Icon,
  isMobile = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isMobile?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-4 rounded-lg px-4 py-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground',
          isActive && 'bg-primary/10 text-primary'
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={onClick}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground',
              isActive && 'bg-primary/20 text-primary'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-popover text-popover-foreground">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function SidebarContent({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) {
  const { user } = useUser();
  const auth = useAuth();
  const userAvatar = getPlaceholderImage('user-avatar');
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

  if (!user) return null;
  
  if (isMobile) {
      return (
         <div className="flex h-full flex-col">
            <header className="flex h-16 shrink-0 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
                    <Icons.logo className="h-7 w-7 text-primary" />
                    <span>Prograde</span>
                </Link>
            </header>
            <nav className="flex-1 space-y-2 p-4">
                {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} isMobile={true} onClick={onLinkClick} />
                ))}
            </nav>
            <footer className="mt-auto border-t p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2">
                           <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarImage
                                src={user.photoURL || userAvatar?.imageUrl}
                                alt={user.displayName || userAvatar?.description}
                                />
                                <AvatarFallback>
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                             <div className="flex flex-col items-start text-left">
                                <span className="font-semibold leading-none truncate max-w-[150px]">
                                {user.displayName || user.email}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                View Profile
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <ThemeToggle />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </footer>
        </div>
      )
  }

  return (
    <div className="flex h-full flex-col items-center justify-between py-4">
      <Link href="/" className="mb-4">
        <Icons.logo className="h-8 w-8 text-primary" />
        <span className="sr-only">Prograde</span>
      </Link>
      <nav className="flex flex-col items-center gap-3">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage
                  src={user.photoURL || userAvatar?.imageUrl}
                  alt={user.displayName || userAvatar?.description}
                />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="center" className="ml-2">
            <DropdownMenuLabel className="max-w-[200px]">
              <p className="truncate text-sm font-medium">{user.displayName || user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <ThemeToggle />
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
  );
}


export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-border/50 bg-background/50 backdrop-blur-sm md:flex">
      <SidebarContent />
    </aside>
  );
}
