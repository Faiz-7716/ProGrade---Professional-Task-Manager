'use client';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarContent } from './sidebar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[280px] p-0 border-r-0 bg-card">
        <SidebarContent onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
