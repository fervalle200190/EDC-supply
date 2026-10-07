import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'navy' | 'green';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  navy: 'bg-navy text-white',
  green: 'bg-green text-white',
};

/** Pill-shaped link button. Sizing is left to the caller so each section can match its frame. */
export function Button({ variant = 'navy', className, children, ...rest }: ButtonProps) {
  return (
    <a
      className={cn(
        'cta inline-flex items-center justify-center rounded-full font-medium no-underline',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
