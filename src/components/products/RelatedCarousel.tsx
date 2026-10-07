import { useEffect, useRef, useState } from 'react';
import { toRelative, type RelativeCard } from '@/data/carousel-cards';
import type { ProductPageLayout } from '@/data/product-layout-types';
import { productHref, relatedProducts } from '@/data/products';
import { Txt } from './Txt';
import { placed, topFromBaseline } from './layout';

interface RelatedCarouselProps {
  slug: string;
  carousel: ProductPageLayout['carousel'];
  /** Card layout for every product (cards the design does not draw reuse another frame's). */
  templates: Record<string, RelativeCard>;
}

const CARD = { w: 311, h: 422 } as const;
const LINK = { size: 12.2, lh: 14, arrow: 14, arrowDx: 78.1, arrowDy: -2.5 } as const;

const textStyle = 'absolute left-(--x) top-(--y) whitespace-nowrap text-black [font-size:var(--fs)] [font-weight:var(--fw)] [line-height:var(--lh)]';

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="9" height="17" viewBox="0 0 9 17" fill="none" aria-hidden="true">
    <path d={dir === 'left' ? 'M8 1 1 8.5 8 16' : 'm1 1 7 7.5L1 16'} stroke="#0d3147" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function RelatedCarousel({ slug, carousel, templates }: RelatedCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const related = relatedProducts(slug);
  const drawn = carousel.cards;
  const first = drawn[0]!;
  const last = drawn.at(-1)!;
  const pitch = (last.x - first.x) / (drawn.length - 1);

  // The design draws the first four related products by hand; the rest follow the same rhythm.
  const cards = related.map((product, i) => {
    const hand = drawn[i];
    if (hand && hand.slug === product.slug) return { slug: product.slug, x: hand.x, y: hand.y, rel: toRelative(hand) };
    const rel = templates[product.slug] as RelativeCard;
    return { slug: product.slug, x: first.x + i * pitch, y: last.y, rel };
  });

  const n = cards.length;

  // Infinite loop (desktop): `start` is the index of the card in the first slot. Slots run from -1 (just off the
  // left edge) to n-2 (off the right edge); a card that wraps from one end to the other jumps without animating.
  const [start, setStart] = useState(0);
  const slotX = (pos: number) => (pos >= 0 && pos < drawn.length ? drawn[pos]!.x : pos < 0 ? first.x + pos * pitch : last.x + (pos - (drawn.length - 1)) * pitch);
  const posOf = (i: number) => (((i - start + 1) % n) + n) % n - 1;
  const prevPos = useRef<number[]>(cards.map((_, i) => i));
  const instant = cards.map((_, i) => Math.abs(posOf(i) - (prevPos.current[i] ?? 0)) > 1);
  useEffect(() => {
    prevPos.current = cards.map((_, i) => posOf(i));
  });

  const winLeft = first.x - 16;
  const winRight = last.x + CARD.w + 16;
  // Room around the cards so the hover zoom is not clipped by the window.
  const winTop = Math.min(...drawn.map((c) => c.y)) - 14;
  const [arrowL, arrowR] = carousel.arrows;

  const isDesktop = () => typeof window.matchMedia !== 'function' || window.matchMedia('(min-width: 1280px)').matches;

  const go = (dir: -1 | 1) => {
    if (isDesktop()) {
      setStart((v) => (((v + dir) % n) + n) % n);
      return;
    }
    // Small screens: native scroll-snap list, wrapping around at either end.
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (dir === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: dir * pitch, behavior: 'smooth' });
  };

  return (
    <div className="relative px-6 pb-16 md:px-10 xl:static xl:p-0">
      <ul
        ref={trackRef}
        aria-label="Related products"
        className="m-0 flex snap-x list-none gap-6 overflow-x-auto p-0 pb-4 [scrollbar-width:none] xl:absolute stage-x xl:top-(--y) xl:block xl:h-(--h) xl:w-(--w) xl:snap-none xl:overflow-hidden xl:pb-0"
        style={placed({ x: winLeft, y: winTop, w: winRight - winLeft, h: CARD.h + 36 })}
      >
        {cards.map(({ slug: s, y, rel }, i) => {
          const name = related.find((p) => p.slug === s)!;
          return (
            <li
              key={s}
              className="relative h-[422px] w-[311px] shrink-0 snap-start rounded-[20px] bg-card xl:absolute xl:left-(--x) xl:top-(--y) transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.05] hover:shadow-[0_18px_40px_rgba(13,49,71,0.28)] motion-reduce:transition-none motion-reduce:hover:scale-100 xl:transition-[left,transform,box-shadow]"
              style={{ ...placed({ x: slotX(posOf(i)) - winLeft, y: y - winTop }, 0), ...(instant[i] ? { transition: 'none' } : {}) }}
            >
              <a href={productHref(s)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10 rounded-[20px]" />
              <Txt spec={rel.title} as="h3" top={0} keepBreaks className={textStyle} />
              <img
                src={`/assets/products/thumb-${s}.png`}
                alt={name.nameLines.join(' ')}
                width={rel.image.w}
                height={rel.image.h}
                className="absolute left-(--x) top-(--y) h-(--h) w-(--w) max-w-none"
                style={placed(rel.image, 0)}
              />
              <a
                href={productHref(s)}
                className="absolute left-(--x) top-(--y) z-20 block whitespace-nowrap text-navy no-underline [font-size:12.2px] [font-weight:500] [line-height:14px]"
                style={{ '--x': `${rel.link.x}px`, '--y': `${topFromBaseline(rel.link.y + rel.link.h, LINK.size, LINK.lh)}px` } as React.CSSProperties}
              >
                Learn more
                <img
                  src="/assets/shared/arrow-right.png"
                  alt=""
                  width={LINK.arrow}
                  height={LINK.arrow}
                  className="absolute max-w-none"
                  style={{ left: LINK.arrowDx, top: LINK.arrowDy + (rel.link.y - (topFromBaseline(rel.link.y + rel.link.h, LINK.size, LINK.lh))), width: LINK.arrow, height: LINK.arrow }}
                />
              </a>
            </li>
          );
        })}
      </ul>

      {[arrowL, arrowR].map((a, i) =>
        a ? (
          <button
            key={i}
            type="button"
            aria-label={i === 0 ? 'Previous products' : 'Next products'}
            onClick={() => go(i === 0 ? -1 : 1)}
            className={`absolute top-[40%] hidden size-[34px] cursor-pointer place-items-center rounded-full border-0 bg-[#e4e6ef] p-0 sm:grid xl:right-auto xl:top-(--y) stage-x ${i === 0 ? 'left-2' : 'right-2'}`}
            style={placed({ x: a.x, y: a.y })}
          >
            <Chevron dir={i === 0 ? 'left' : 'right'} />
          </button>
        ) : null,
      )}
    </div>
  );
}
