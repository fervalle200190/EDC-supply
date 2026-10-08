import { url } from '@/lib/url';

interface AboutHeroProps {
  title: string;
  image: string;
  overlay: string;
  lines: string;
}

export function AboutHero({ title, image, overlay, lines }: AboutHeroProps) {
  return (
    <section className="relative isolate h-[320px] overflow-hidden bg-navy md:h-[440px] xl:h-[639px]">
      <img src={url(image)} alt="" className="absolute left-0 top-0 -z-30 h-full w-full object-cover object-left" />
      <img
        src={url(overlay)}
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 -z-20 h-full w-full object-fill max-xl:opacity-0 xl:left-[14px] xl:h-[639px] xl:w-[max(1609px,calc(100%-14px))]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/40 xl:hidden" />
      <img src={url(lines)} alt="" aria-hidden="true" className="absolute left-0 top-0 -z-10 hidden xl:top-[4px] xl:block xl:h-[671px] xl:w-[138px]" />
      <div className="relative mx-auto h-full max-w-[1623px]">
        <h1 className="absolute bottom-0 right-6 m-0 translate-y-[0.22em] text-[72px] font-bold leading-none text-page md:right-10 md:text-[110px] xl:left-[828px] xl:right-auto xl:top-[507px] xl:translate-y-0 xl:whitespace-nowrap xl:text-[166px]">
          {title}
        </h1>
      </div>
    </section>
  );
}
