import type { missionVision } from '@/data/about';
import { url } from '@/lib/url';

type MissionVisionProps = typeof missionVision;

export function MissionVision({ background, cards }: MissionVisionProps) {
  return (
    <section className="relative isolate bg-page px-6 py-16 md:px-10 xl:h-[879px] xl:p-0">
      {/* The photo has a white background: multiply blends it into the page colour, and the opacity keeps the text readable. */}
      <img src={url(background)} alt="" className="absolute left-0 top-0 -z-10 h-full w-full object-cover mix-blend-multiply opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_82%,transparent)] xl:h-[766px] xl:w-full" />
      <div className="mx-auto grid max-w-[1623px] gap-8 md:grid-cols-2 xl:relative xl:block xl:h-full">
        {cards.map((card) => (
          <article
            key={card.title}
            data-rv-inner
            className="glass-shine relative rounded-[40px] border border-[#2b6a80] bg-white/40 p-8 backdrop-blur-[10px] xl:absolute xl:left-(--x) xl:top-[241px] xl:h-[243px] xl:w-[683px] xl:p-0"
            style={{ '--x': `${card.x}px` } as React.CSSProperties}
          >
            <h3
              className="relative z-10 m-0 text-[26px] font-semibold leading-8 text-black xl:absolute xl:left-(--bx) xl:top-(--ty) xl:leading-[1]"
              style={{ '--bx': `${card.bodyX - card.x - 1}px`, '--ty': `${card.titleTop - 12}px` } as React.CSSProperties}
            >
              {card.title}
            </h3>
            <p
              className="relative z-10 m-0 mt-4 text-justify text-[18px] leading-[1.5] text-black [hyphens:manual] md:text-[20px] xl:absolute xl:left-(--bx) xl:top-[84px] xl:mt-0 xl:w-[603px] xl:text-[23px] xl:leading-[28px]"
              style={{ '--bx': `${card.bodyX - card.x - 1}px` } as React.CSSProperties}
            >
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
