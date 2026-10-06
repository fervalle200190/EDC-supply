import type { ClientLogo } from '@/data/about';
import { url } from '@/lib/url';

interface TrustedByProps {
  title: readonly string[];
  background: string;
  clients: readonly ClientLogo[];
}

export function TrustedBy({ title, background, clients }: TrustedByProps) {
  return (
    <section className="relative isolate bg-page px-6 py-16 md:px-10 xl:h-[1423px] xl:p-0">
      <img
        src={url(background)}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 -z-10 h-[60%] w-full xl:left-0 xl:top-[423px] xl:h-[1000px] xl:w-full xl:max-w-none"
      />
      <div className="mx-auto max-w-[1623px] xl:relative xl:h-full">
        <h2 className="m-0 text-center text-[26px] font-medium leading-[1.2] text-black md:text-[34px] xl:absolute xl:left-[399px] xl:top-[197px] xl:w-[825px] xl:text-[39.57px] xl:leading-[42px]">
          {title.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </h2>
        <ul className="m-0 mt-10 grid list-none grid-cols-2 items-center justify-items-center gap-6 p-0 sm:grid-cols-3 xl:static xl:mt-0 xl:block">
          {clients.map((c) => (
            <li
              key={c.name}
              className="xl:absolute xl:left-(--x) xl:top-(--y)"
              style={{ '--x': `${c.x - 23.5}px`, '--y': `${c.y}px` } as React.CSSProperties}
            >
              <img
                src={url(c.src)}
                alt={c.name}
                width={c.width}
                height={c.height}
                className="h-auto max-h-[110px] w-auto max-w-[170px] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.12] motion-reduce:transition-none motion-reduce:hover:scale-100 xl:h-(--h) xl:max-h-none xl:w-(--w) xl:max-w-none"
                style={{ '--w': `${c.width}px`, '--h': `${c.height}px` } as React.CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
