import { useState } from 'react';
import { assets } from '@/data/assets';
import { contactCta, navItems, whatsapp } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { url } from '@/lib/url';

/** Desktop header height (px) – identical on every page. */
export const HEADER_HEIGHT = 128;

interface HeaderProps {
  currentPath?: string;
  /** Desktop height in design px. */
  height?: number;
}

const isActive = (current: string | undefined, href: string) =>
  current !== undefined && (href === '/' ? current === '/' : current.startsWith(href));

export function Header({ currentPath, height = HEADER_HEIGHT }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative bg-page xl:h-(--hh)" style={{ '--hh': `${height}px` } as React.CSSProperties}>
      <div className="mx-auto flex h-[84px] max-w-[1623px] items-center justify-between px-6 md:px-10 xl:h-full xl:items-center xl:pl-[80px] xl:pr-[94px]">
        <a href={url('/')} aria-label="EDC Supply – Power Solutions" className="block">
          <img src={url(assets.logo)} alt="EDC Supply Power Solutions" width={151} height={43} className="h-[38px] w-auto xl:h-[43px]" />
        </a>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-navy xl:hidden"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-[2px] w-6 bg-current before:absolute before:-top-[7px] before:h-[2px] before:w-6 before:bg-current after:absolute after:top-[7px] after:h-[2px] after:w-6 after:bg-current" />
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={[
            'absolute inset-x-0 top-full z-20 flex-col gap-1 bg-page px-6 pb-6 pt-2 shadow-md md:px-10',
            open ? 'flex' : 'hidden',
            'xl:static xl:z-auto xl:flex xl:flex-row xl:items-center xl:gap-0 xl:bg-transparent xl:p-0 xl:shadow-none',
          ].join(' ')}
        >
          <ul className="m-0 flex list-none flex-col gap-1 p-0 xl:flex-row xl:gap-[54px]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={url(item.href)}
                  data-text={item.label}
                  aria-current={isActive(currentPath, item.href) ? 'page' : undefined}
                  // The invisible bold copy (::after) reserves the bold width, so selecting an item never shifts the nav.
                  className="flex flex-col py-3 text-[20.2px] font-medium leading-none text-navy no-underline after:invisible after:block after:h-0 after:overflow-hidden after:font-bold after:content-[attr(data-text)] aria-[current=page]:font-bold xl:py-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            href={url(contactCta.href)}
            className="mt-2 h-[41px] w-[150px] text-[20.2px] leading-none xl:ml-[45px] xl:mt-0"
          >
            {contactCta.label}
          </Button>
          <a
            href={whatsapp.href}
            aria-label={whatsapp.label}
            className="mt-3 block w-fit xl:ml-[39px] xl:mt-0"
          >
            <img src={url(assets.whatsapp)} alt="" width={40} height={37} className="h-[37px] w-[40px] object-contain" />
          </a>
        </nav>
      </div>
    </header>
  );
}
