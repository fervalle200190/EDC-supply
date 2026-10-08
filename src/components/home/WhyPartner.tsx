import { assets } from '@/data/assets';
import type { WhyItem } from '@/data/home';
import { url } from '@/lib/url';

interface WhyPartnerProps {
  title: string;
  items: readonly WhyItem[];
}

export function WhyPartner({ title, items }: WhyPartnerProps) {
  return (
    <section className="m-screen relative isolate overflow-hidden px-6 py-16 md:px-10 xl:h-[672px] xl:p-0">
      <img src={url(assets.home.whyBg)} alt="" className="absolute left-0 top-0 -z-20 h-full w-full object-cover xl:-left-[82px] xl:w-[max(1973px,calc(100%+82px))]" />
      <div className="absolute inset-0 -z-10 bg-page/90" />

      <div className="mx-auto max-w-[724px] xl:pt-[164px]">
        <h2 className="m-0 text-center text-[28px] font-bold leading-tight text-black md:text-[36px] xl:text-[38.73px] xl:leading-[50px]">{title}</h2>
        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-x-6 xl:mt-[66px] xl:grid-cols-[337px_337px] xl:gap-x-[50px] xl:gap-y-[40px]">
          {items.map((item) => (
            <li key={item.label} className="relative flex h-[59px] items-center rounded-full bg-[#ccc] max-xl:pl-[88px] max-xl:pr-4">
              <img
                src={url(item.icon)}
                alt=""
                width={item.iconBox.width}
                height={item.iconBox.height}
                className="absolute"
                style={{ left: item.iconBox.x, top: item.iconBox.y }}
              />
              <span
                className="text-center text-[18px] font-semibold leading-5 whitespace-pre max-xl:flex-1 text-black xl:absolute xl:left-(--tx) xl:flex xl:w-(--tw) xl:justify-center xl:text-[20.5px]"
                style={{ '--tx': `${item.text.x}px`, '--tw': `${item.text.width}px` } as React.CSSProperties}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
