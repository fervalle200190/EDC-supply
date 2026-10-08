import { Button } from '@/components/ui/Button';
import { url } from '@/lib/url';

interface FlagshipBannerProps {
  title: string;
  subtitle: string;
  tagline: string;
  cta: { label: string; href: string };
  image: string;
}

export function FlagshipBanner({ title, subtitle, tagline, cta, image }: FlagshipBannerProps) {
  return (
    <section className="m-screen relative z-10 bg-teal-band xl:h-[370px]">
      <div className="mx-auto max-w-[1623px] px-6 py-12 md:px-10 xl:relative xl:h-full xl:p-0">
        <img
          src={url(image)}
          alt="SineTamer surge protection devices"
          className="mx-auto mb-6 h-auto w-full max-w-[560px] xl:absolute xl:-top-[101px] xl:left-[789px] xl:m-0 xl:h-[542px] xl:w-[813px] xl:max-w-none xl:object-contain"
        />
        <h2 className="m-0 text-[30px] font-bold leading-tight text-navy md:text-[40px] xl:absolute xl:left-[80px] xl:top-[79px] xl:text-[45.12px] xl:leading-[54px]">{title}</h2>
        <p className="m-0 mt-3 text-[22px] font-bold leading-tight text-page md:text-[30px] xl:absolute xl:left-[80px] xl:top-[145px] xl:m-0 xl:text-[34.92px] xl:leading-[44px]">{subtitle}</p>
        <p className="m-0 mt-2 text-[20px] font-medium leading-tight text-page md:text-[26px] xl:absolute xl:left-[80px] xl:top-[194px] xl:m-0 xl:text-[31.88px] xl:leading-[40px]">{tagline}</p>
        <Button href={url(cta.href)} className="mt-8 h-[54px] w-[298px] text-[20.2px] leading-none xl:absolute xl:left-[80px] xl:top-[262px] xl:mt-0">
          {cta.label}
        </Button>
      </div>
    </section>
  );
}
