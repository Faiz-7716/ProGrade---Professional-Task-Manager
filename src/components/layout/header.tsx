// src/components/layout/header.tsx
'use client';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
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
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const userAvatar = getPlaceholderImage('user-avatar');

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-4 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg font-headline">LinkedSpark</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user.photoURL || userAvatar?.imageUrl}
                    alt={user.displayName || userAvatar?.description}
                    data-ai-hint={userAvatar?.imageHint}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p>Signed in as</p>
                  <p className="font-medium truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
