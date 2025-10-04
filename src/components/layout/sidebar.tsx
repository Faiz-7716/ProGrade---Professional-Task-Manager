'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  MessageSquare,
  BookOpenCheck,
  ClipboardList,
  History,
  Wallet,
} from 'lucide-react';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const navLinks = [
  {
    category: 'Growth Tools',
    links: [
      {
        href: '/profile-optimizer',
        label: 'Profile Optimizer',
        icon: BrainCircuit,
      },
      { href: '/content-studio', label: 'Content Studio', icon: FileText },
      { href: '/action-plan', label: 'Action Plan', icon: ClipboardList },
    ],
  },
  {
    category: 'Learning',
    links: [
      { href: '/course-manager', label: 'Course Manager', icon: BookOpenCheck },
      { href: '/daily-journal', label: 'Daily Journal', icon: History },
      {
        href: '/quiz-generator',
        label: 'Knowledge Forge',
        icon: 'Sparkles',
      },
       {
        href: '/quiz-history',
        label: 'Quiz History',
        icon: 'History',
      }
    ],
  },
   {
    category: 'Finance',
    links: [
      { href: '/expense-tracker', label: 'Expense Tracker', icon: Wallet },
    ],
  },
];

export function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const IconComponent =
    Icon === 'Sparkles' ? (
      <Icons.logo className="h-5 w-5" />
    ) : (
      <Icon className="h-5 w-5" />
    );

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
        isActive && 'bg-primary/10 text-primary'
      )}
    >
      {IconComponent}
      {label}
    </Link>
  );
}

export function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  const getActiveCategory = () => {
    for (const group of navLinks) {
      if (group.links.some((link) => pathname.startsWith(link.href))) {
        return group.category;
      }
    }
    // Check for dashboard separately
    if (pathname === '/') return 'Dashboard';
    return undefined;
  };
  
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Prograde</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          <Link
            href="/"
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
              pathname === '/' && 'bg-primary/10 text-primary'
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={[getActiveCategory()].filter(Boolean) as string[]}
          >
            {navLinks.map((group) => (
              <AccordionItem
                value={group.category}
                key={group.category}
                className="border-b-0"
              >
                <AccordionTrigger className="py-2 hover:no-underline text-muted-foreground hover:text-primary">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {group.category}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-1 pl-4">
                  {group.links.map((link) => (
                    <NavLink
                      key={link.href}
                      {...link}
                      onClick={onLinkClick}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-card md:flex">
      <SidebarContent />
    </aside>
  );
}
