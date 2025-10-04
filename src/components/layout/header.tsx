'use client';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Icons } from '../icons';
import { ThemeToggle } from '../theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Button } from '../ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const userAvatar = getPlaceholderImage('user-avatar');

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">Prograde</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary transition-colors">
                  <AvatarImage
                    src={user?.photoURL || userAvatar?.imageUrl}
                    alt={user?.displayName || 'User'}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
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
    </header>
  );
}
