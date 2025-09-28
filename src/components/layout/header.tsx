import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function Header() {
  const userAvatar = getPlaceholderImage('user-avatar');

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
          <Avatar>
            <AvatarImage
              src={userAvatar?.imageUrl}
              alt={userAvatar?.description}
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
