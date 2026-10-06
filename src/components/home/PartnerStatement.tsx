import { partnerStatement, sectionTops } from '@/data/home-layout';
import { PlacedLines } from './PlacedLines';
import { url } from '@/lib/url';

/** "One partner. Complete power reliability" – the statement band between the solutions and the portfolio. */
export function PartnerStatement() {
  const { title, text, squiggles, height } = partnerStatement;
  return (
    <section
      aria-label="Our approach"
      className="relative px-6 py-16 text-center md:px-10 xl:h-(--h) xl:p-0"
      style={{ '--h': `${height}px` } as React.CSSProperties}
    >
      <img
        src={url(squiggles)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute hidden xl:block xl:left-[max(0px,calc((100%-1623px)/2))] xl:top-0 xl:h-[731px] xl:w-[1623px] xl:max-w-none"
      />
      <PlacedLines
        block={title}
        sectionTop={sectionTops.partner}
        as="h2"
        stage
        className="mx-auto max-w-[760px] text-[28px] font-bold uppercase leading-tight text-navy md:text-[40px]"
      />
      <PlacedLines
        block={text}
        sectionTop={sectionTops.partner}
        stage
        className="mx-auto mt-6 max-w-[640px] text-[18px] font-normal leading-[1.4] text-accent md:text-[20px]"
      />
    </section>
  );
}
