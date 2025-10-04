'use client';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { SidebarContent } from './sidebar';

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
      <SheetContent side="left" className="w-[300px] p-0 border-r-0 glassmorphism">
        <SidebarContent isMobile={true} onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
