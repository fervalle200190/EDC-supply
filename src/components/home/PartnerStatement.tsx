import { partnerStatement, sectionTops } from '@/data/home-layout';
import { PlacedLines } from './PlacedLines';
import { url } from '@/lib/url';

/** "One partner. Complete power reliability" – the statement band between the solutions and the portfolio. */
export function PartnerStatement() {
  const { title, text, squiggles, height } = partnerStatement;
  return (
    <section
      aria-label="Our approach"
      className="relative px-6 py-16 text-center [overflow-x:clip] md:px-10 xl:z-10 xl:h-(--h) xl:p-0"
      style={{ '--h': `${height}px` } as React.CSSProperties}
    >
      {/* Pinned to the screen edges (not the 1623px frame) so they never look cut on wide screens. */}
      <img
        src={url(squiggles.left)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[731px] w-[700px] max-w-none xl:block"
      />
      <img
        src={url(squiggles.right)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-[77px] top-0 hidden h-[731px] w-[500px] max-w-none xl:block"
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
