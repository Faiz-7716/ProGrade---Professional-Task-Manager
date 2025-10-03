'use client';

import { cn } from '@/lib/utils';
import CopyButton from './copy-button';

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  textToCopy: string;
}

export function CodeBlock({
  textToCopy,
  className,
  children,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-border bg-[#282c34] shadow-lg',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between h-10 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <CopyButton
          textToCopy={textToCopy}
          className="text-gray-400 hover:text-white hover:bg-white/10"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-300 whitespace-pre-wrap font-code">
            {children}
        </p>
      </div>
    </div>
  );
}
