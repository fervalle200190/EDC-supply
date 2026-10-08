import { useRef } from 'react';
import type { PortfolioItem } from '@/data/home';
import { closingCta, portfolioLayout, portfolioTitleBlock, sectionTops } from '@/data/home-layout';
import { PlacedLines } from './PlacedLines';
import { url } from '@/lib/url';

interface PortfolioCarouselProps {
  title: string;
  items: readonly PortfolioItem[];
}

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
    <path d={dir === 'left' ? 'M9 1 1 9l8 8' : 'm1 1 8 8-8 8'} stroke="#0d3147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Arrow = () => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
    <path d="M0 4.5h13m-3-4 3.5 4-3.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const arrowStyle = (x: number) =>
  ({ '--ax': `${x}px`, '--ay': `${portfolioLayout.arrows.top - sectionTops.portfolio}px` }) as React.CSSProperties;

export function PortfolioCarousel({ title, items }: PortfolioCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    // Loops: past the last card it glides back to the first one and vice versa.
    const pitch = (track.firstElementChild?.clientWidth ?? 300) + 40;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: direction * pitch, behavior: 'smooth' });
  };

  return (
    <section
      className="portfolio-bg relative px-6 pb-20 pt-16 md:px-10 xl:h-(--h) xl:p-0"
      style={{ '--bg-desktop': portfolioLayout.background, '--h': `${sectionTops.footer - sectionTops.portfolio}px` } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1623px] xl:relative xl:h-full">
        {/* Phones: title + cards take one screen, the closing call to action the next. */}
        <div className="m-screen relative xl:contents">
        <PlacedLines
          block={portfolioTitleBlock}
          sectionTop={sectionTops.portfolio}
          as="h2"
          className="text-[28px] font-semibold leading-tight text-black md:text-[40px]"
        />

        {/* Four cards in view on the 131px–1494px content grid; the arrows slide through the whole catalogue. The padding
            leaves room for the hover zoom and shadow, which a scroll container would otherwise clip. */}
        <ul
          ref={trackRef}
          style={{ '--cy': `${portfolioLayout.cardsTop - sectionTops.portfolio}px` } as React.CSSProperties}
          className="m-0 mt-8 flex snap-x list-none gap-6 overflow-x-auto p-0 pb-4 [scrollbar-width:none] xl:absolute xl:left-[115px] xl:top-[calc(var(--cy)-30px)] xl:mt-0 xl:w-[1395px] xl:scroll-pl-4 xl:gap-10 xl:px-4 xl:py-[30px]"
        >
          {items.map((item) => {
            const { w, h } = item.size;
            return (
              <li
                key={item.title}
                className="group relative h-[422px] w-[280px] shrink-0 snap-start rounded-[20px] bg-card transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.05] hover:shadow-[0_18px_40px_rgba(13,49,71,0.28)] motion-reduce:transition-none motion-reduce:hover:scale-100 xl:w-[310.75px]"
              >
                <a href={url(item.href)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10 rounded-[20px]" />
                <h3 className="absolute left-[28px] top-[34px] m-0 whitespace-pre-line text-[20px] font-bold leading-[20px] text-black">
                  {item.title}
                </h3>
                <img
                  src={url(item.image)}
                  alt={item.title.replace(/\n/g, ' ')}
                  width={w}
                  height={h}
                  className="absolute left-1/2 top-[216px] max-h-[220px] -translate-x-1/2 -translate-y-1/2"
                  style={{ width: w, height: h, maxHeight: 'none' }}
                />
                <a
                  href={url(item.href)}
                  className="absolute left-[28px] top-[372px] z-20 flex items-center gap-2 text-[12.2px] font-medium text-navy no-underline"
                >
                  Learn more <Arrow />
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          style={arrowStyle(portfolioLayout.arrows.left)}
          className="cta absolute left-2 top-[60%] hidden size-[34px] cursor-pointer place-items-center rounded-full border-0 bg-white sm:grid xl:left-(--ax) xl:top-(--ay)"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          style={arrowStyle(portfolioLayout.arrows.right)}
          className="cta absolute right-2 top-[60%] hidden size-[34px] cursor-pointer place-items-center rounded-full border-0 bg-white sm:grid xl:left-(--ax) xl:right-auto xl:top-(--ay)"
        >
          <Chevron dir="right" />
        </button>

        </div>

        {/* Closing call to action, drawn on the same gradient. */}
        <div className="m-screen mt-16 text-center text-page max-md:mt-0 max-md:items-center xl:mt-0 xl:text-left">
          <PlacedLines
            block={closingCta.title}
            sectionTop={sectionTops.portfolio}
            as="h2"
            className="text-[32px] font-bold leading-[1.1] md:text-[52px]"
          />
          <PlacedLines
            block={closingCta.text}
            sectionTop={sectionTops.portfolio}
            className="mx-auto mt-5 block max-w-[640px] text-[18px] font-normal leading-[1.4] md:text-[20px]"
          />
          <a
            href={url(closingCta.link.href)}
            className="cta origin-left mt-8 inline-flex items-center gap-2 text-[22px] font-bold text-page no-underline xl:absolute xl:left-(--x) xl:top-(--y) xl:mt-0 xl:gap-0 xl:whitespace-nowrap xl:[font-size:var(--fs)] xl:[font-weight:var(--fw)] xl:[line-height:var(--lh)]"
            style={
              {
                '--x': `${closingCta.link.left}px`,
                '--y': `${closingCta.link.top - sectionTops.portfolio}px`,
                '--fs': `${closingCta.link.size}px`,
                '--fw': closingCta.link.weight,
                '--lh': `${closingCta.link.lh}px`,
              } as React.CSSProperties
            }
          >
            {closingCta.link.label}
            <svg
              aria-hidden="true"
              viewBox="0 0 15 12"
              fill="none"
              className="h-3 w-[15px] xl:absolute xl:left-(--ax) xl:top-(--ay)"
              style={{ '--ax': `${closingCta.link.arrow.x - closingCta.link.left}px`, '--ay': `${closingCta.link.arrow.y - closingCta.link.top}px` } as React.CSSProperties}
            >
              <path d="M0.5 6h12m-4.5-4.5L13 6l-5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
