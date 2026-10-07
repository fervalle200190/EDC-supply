import { Fragment, type ElementType, type ReactNode } from 'react';
import type { PlacedText } from '@/data/product-layout-types';
import { cn } from '@/lib/cn';
import { textVars, type Vars } from './layout';

interface TxtProps {
  spec: PlacedText;
  as?: ElementType;
  /** Classes for the small-screen (flow) layout and colour. */
  className?: string;
  centered?: boolean;
  /** Keep the design's line breaks on every screen size (used inside fixed-size cards). */
  keepBreaks?: boolean;
  /** Shift of the desktop frame (px) – defaults to the header height. */
  top?: number;
  style?: Vars;
  children?: ReactNode;
}

/**
 * Text that keeps the design's explicit line breaks on desktop (absolute, pixel-measured box) and
 * reflows naturally on small screens. Lines that end in a hyphen were split mid-word by the design.
 */
export function Txt({ spec, as: Tag = 'p', className, centered = false, keepBreaks = false, top, style, children }: TxtProps) {
  return (
    <Tag
      className={cn(
        'm-0 xl:absolute stage-x xl:top-(--y) xl:whitespace-nowrap xl:[font-size:var(--fs)] xl:[font-weight:var(--fw)] xl:[line-height:var(--lh)]',
        centered ? 'text-center xl:w-(--w)' : 'xl:text-left',
        'xl:m-0 xl:max-w-none xl:p-0',
        className,
      )}
      style={{ ...textVars(spec, top), ...style }}
    >
      {children ??
        spec.lines.map((line, i) => {
          const last = i === spec.lines.length - 1;
          const split = !last && line.endsWith('-') && /[a-z]-$/.test(line);
          return (
            <Fragment key={i}>
              {split ? line.slice(0, -1) : line}
              {split && <span className={keepBreaks ? undefined : 'hidden xl:inline'}>-</span>}
              {!last && <br className={keepBreaks ? undefined : 'hidden xl:inline'} />}
              {!last && !split && !keepBreaks && ' '}
            </Fragment>
          );
        })}
    </Tag>
  );
}
