import type { CSSProperties } from 'react';
import type { PlacedText } from '@/data/product-layout-types';

/** Height of the site header on the product pages: the design frames start at the top of the page, `main` starts here. */
export const STAGE_TOP = 128;

/** Distance from the top of a line box to its baseline, for Montserrat (ascent .968 / descent .251). */
export const baselineOffset = (size: number, lh: number) => (lh - 1.219 * size) / 2 + 0.968 * size;

/** Top of a line box (frame px) whose baseline sits at `baseline`. */
export const topFromBaseline = (baseline: number, size: number, lh: number) => baseline - baselineOffset(size, lh);

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Frame px -> CSS custom properties consumed by `xl:` utilities (frame y is shifted by the header height). */
export const placed = (v: { x: number; y: number; w?: number; h?: number }, top = STAGE_TOP): Vars => ({
  '--x': `${v.x}px`,
  '--y': `${v.y - top}px`,
  ...(v.w === undefined ? {} : { '--w': `${v.w}px` }),
  ...(v.h === undefined ? {} : { '--h': `${v.h}px` }),
});

export const textVars = (t: PlacedText, top = STAGE_TOP): Vars => ({
  '--x': `${t.left}px`,
  '--y': `${t.top - top}px`,
  '--fs': `${t.size}px`,
  '--fw': t.weight,
  '--lh': `${t.lh}px`,
  ...(t.width ? { '--w': `${t.width}px` } : {}),
});
