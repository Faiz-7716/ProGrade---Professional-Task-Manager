'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
}

export default function CopyButton({
  textToCopy,
  className,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8',
              className
            )}
            onClick={copyToClipboard}
            {...props}
          >
            {hasCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasCopied ? 'Copied!' : 'Copy to clipboard'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
