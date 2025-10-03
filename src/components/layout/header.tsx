
'use client';
import { useState, useEffect } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/profile-optimizer', label: 'Profile Optimizer' },
  { href: '/content-studio', label: 'Content Studio' },
  { href: '/action-plan', label: 'Action Plan' },
];

function NavLink({
  href,
  label,
  isMobile = false,
}: {
  href: string;
  label: string;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
        isMobile
          ? 'block w-full p-3 text-base hover:bg-muted rounded-md'
          : 'px-3 py-2 rounded-md'
      )}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const { user } = useAuth();
  const userAvatar = getPlaceholderImage('user-avatar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'border-b bg-card/80 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg font-headline">LinkedSpark</span>
          </Link>
          {user && (
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer transition-transform duration-200 hover:scale-110">
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
              <div className="md:hidden">
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full max-w-xs">
                    <div className="flex justify-between items-center mb-6">
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2"
                      >
                        <Icons.logo className="h-8 w-8 text-primary" />
                        <span className="font-bold text-lg font-headline">LinkedSpark</span>
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-6 w-6" />
                          <span className="sr-only">Close Menu</span>
                        </Button>
                      </SheetClose>
                    </div>
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <NavLink
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          isMobile
                        />
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </>
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
