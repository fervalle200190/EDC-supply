import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface HeadingProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Heading({ as: Tag = 'h2', className, children }: HeadingProps) {
  return <Tag className={cn('m-0 font-sans', className)}>{children}</Tag>;
}
