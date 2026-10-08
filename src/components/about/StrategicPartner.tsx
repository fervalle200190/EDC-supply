import type { DecorArt } from '@/data/about';
import { url } from '@/lib/url';

interface TitledText {
  title: readonly string[];
  paragraphs: readonly string[];
}

interface StrategicPartnerProps {
  partner: TitledText;
  technology: TitledText;
  decor: Record<'blocks' | 'pills' | 'lines', DecorArt>;
}

const Lines = ({ lines }: { lines: readonly string[] }) => (
  <>
    {lines.map((line) => (
      <span key={line} className="block">{line}</span>
    ))}
  </>
);

const bodyClass = 'm-0 text-justify text-[18px] font-normal leading-[1.45] text-black [hyphens:manual] md:text-[20px] xl:text-[21.1px] xl:leading-[26px]';

const place = (a: DecorArt) =>
  ({ '--x': `${a.x}px`, '--y': `${a.y}px`, '--w': `${a.width}px`, '--h': `${a.height}px`, '--r': `${1623 - a.x - a.width}px` }) as React.CSSProperties;

export function StrategicPartner({ partner, technology, decor }: StrategicPartnerProps) {
  const art = 'pointer-events-none absolute xl:top-(--y) xl:h-(--h) xl:w-(--w) xl:max-w-none';

  return (
    <section className="relative px-6 py-16 md:px-10 xl:h-[1522px] xl:p-0">
      {/* Decorative art is pinned to the screen edges (left pieces left, the line art right) like in Figma. */}
      <img src={url(decor.lines.src)} alt="" aria-hidden="true" className={`${art} hidden xl:right-(--r) xl:block`} style={place(decor.lines)} />
      <img src={url(decor.pills.src)} alt="" aria-hidden="true" className={`${art} hidden xl:left-(--x) xl:block`} style={place(decor.pills)} />
      <img src={url(decor.blocks.src)} alt="" aria-hidden="true" className={`${art} hidden xl:left-(--x) xl:block`} style={place(decor.blocks)} />
      <div className="mx-auto grid max-w-[1623px] gap-12 xl:relative xl:block xl:h-full">
        {/* Tablet only: the block art flows between the two copy sections (on desktop it hugs the screen edge above). */}
        <img src={url(decor.blocks.src)} alt="" aria-hidden="true" className="mx-auto hidden h-auto w-[300px] md:block xl:hidden" />

        {/* Phones: each copy block gets a screen of its own. */}
        <div className="m-screen flex flex-col gap-12 xl:contents">
        <h2 className="m-0 text-[34px] font-bold leading-[1.15] text-navy md:text-[44px] xl:absolute xl:left-[131px] xl:top-[221px] xl:text-[49.96px] xl:leading-[49px]">
          <Lines lines={partner.title} />
        </h2>
        <div className="flex flex-col gap-[26px] xl:absolute xl:left-[789px] xl:top-[180px] xl:w-[703px] xl:gap-[26px]">
          {partner.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className={bodyClass}>{p}</p>
          ))}
        </div>
        </div>


        <div className="m-screen flex flex-col gap-12 xl:contents">
        <h2 className="m-0 text-center text-[34px] font-bold leading-[1.15] text-navy md:text-[44px] xl:absolute xl:left-[789px] xl:top-[983px] xl:w-[703px] xl:text-[49.8px] xl:leading-[50px]">
          <Lines lines={technology.title} />
        </h2>
        <div className="flex flex-col gap-[26px] xl:absolute xl:left-[789px] xl:top-[1157px] xl:w-[703px]">
          {technology.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className={bodyClass}>{p}</p>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
