import type { Partner } from '@/data/home';
import { url } from '@/lib/url';

interface PartnersStripProps {
  partners: readonly Partner[];
}

/** Number of copies of the logo list. The track slides by exactly one copy, so it must stay wider than the screen + 1 copy. */
const COPIES = 4;

/** Infinite right-to-left logo marquee (seamless on screens up to ~4800px). */
export function PartnersStrip({ partners }: PartnersStripProps) {
  const renderSet = (copy: number) =>
    partners.map((p) => (
      <li key={`${copy}-${p.name}`} className="flex shrink-0 items-center pr-[96px] max-xl:pr-12" aria-hidden={copy > 0 || undefined}>
        <img src={url(p.logo)} alt={copy > 0 ? '' : p.name} width={p.width} height={p.height} style={{ width: p.width, height: p.height }} className="max-w-none max-xl:[zoom:0.7]" />
      </li>
    ));

  return (
    <section aria-label="Technology partners" className="marquee relative overflow-hidden bg-page">
      <ul className="marquee-track m-0 flex h-[133px] list-none items-center p-0 max-xl:h-[110px]">
        {Array.from({ length: COPIES }, (_, copy) => renderSet(copy))}
      </ul>
    </section>
  );
}
