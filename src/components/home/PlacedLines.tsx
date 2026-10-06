import type { CSSProperties, ElementType } from 'react';
import type { PlacedBlock } from '@/data/home-layout';
import { cn } from '@/lib/cn';

interface PlacedLinesProps {
  block: PlacedBlock;
  /** y of the top of the section the block sits in (frame px). */
  sectionTop: number;
  as?: ElementType;
  /** `stage`: the section is full-width, so the 1623px design frame is centred (see `.stage-x`). */
  stage?: boolean;
  /** Classes for the small-screen flow layout and colour. */
  className?: string;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Text laid out line by line at the design's coordinates on desktop; a normal paragraph on small screens. */
export function PlacedLines({ block, sectionTop, as: Tag = 'p', stage = false, className }: PlacedLinesProps) {
  return (
    <Tag className={cn('m-0 xl:contents', className)}>
      {block.lines.map((line, i) => (
        <span
          key={line.text}
          className={cn(
            'inline xl:absolute xl:top-(--y) xl:whitespace-nowrap xl:[font-size:var(--fs)] xl:[font-weight:var(--fw)] xl:[line-height:var(--lh)]',
            stage ? 'stage-x' : 'xl:left-(--x)',
          )}
          style={
            {
              '--x': `${line.left}px`,
              '--y': `${block.top - sectionTop + i * block.lh}px`,
              '--fs': `${block.size}px`,
              '--fw': block.weight,
              '--lh': `${block.lh}px`,
            } as Vars
          }
        >
          {line.text}
          {i < block.lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
