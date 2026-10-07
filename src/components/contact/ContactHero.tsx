interface ContactHeroProps {
  title: string;
}

/** Navy band under the header with the oversized title, cropped by the frame edges like in the design. */
export function ContactHero({ title }: ContactHeroProps) {
  return (
    <section className="relative h-[170px] overflow-hidden bg-navy [container-type:inline-size] sm:h-[230px] md:h-[250px] xl:h-[374px]">
      <h1 className="absolute inset-x-0 bottom-0 m-0 translate-y-[0.16em] whitespace-nowrap text-center text-[13.4vw] font-black leading-none text-page xl:top-[158px] xl:bottom-auto xl:translate-y-0 xl:translate-x-[clamp(-88px,calc((100cqw_-_1800px)/2),0px)] xl:text-[255px]">
        {title}
      </h1>
    </section>
  );
}
