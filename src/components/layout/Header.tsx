import { useEffect, useState } from 'react';
import { assets } from '@/data/assets';
import { contactCta, navItems } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { url } from '@/lib/url';

/** Desktop header height (px) – identical on every page. */
export const HEADER_HEIGHT = 128;

interface HeaderProps {
  currentPath?: string;
  /** Desktop height in design px. */
  height?: number;
  /** "dark": navy bar with white copy (the Contact frame). Phones keep the light menu curtain. */
  variant?: 'light' | 'dark';
}

const isActive = (current: string | undefined, href: string) =>
  current !== undefined && (href === '/' ? current === '/' : current.startsWith(href));

export function Header({ currentPath, height = HEADER_HEIGHT, variant = 'light' }: HeaderProps) {
  const dark = variant === 'dark';
  const [open, setOpen] = useState(false);

  // Esc closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /** Staggered entrance of each menu row on phones/tablets (no effect on desktop). */
  const row = (i: number) => ({
    className: `transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none xl:translate-y-0 xl:opacity-100 xl:transition-none ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`,
    style: { transitionDelay: open ? `${120 + i * 70}ms` : '0ms' },
  });

  return (
    <header className={`relative xl:h-(--hh) ${dark ? 'bg-navy' : 'bg-page'}`} style={{ '--hh': `${height}px` } as React.CSSProperties}>
      <div className={`mx-auto flex h-[84px] max-w-[1623px] items-center justify-between px-6 md:px-10 xl:h-[128px] xl:items-center xl:pl-[80px] xl:pr-[80px]`}>
        <a href={url('/')} aria-label="EDC Supply – Power Solutions" className="block">
          <img src={url(assets.logo)} alt="EDC Supply Power Solutions" width={151} height={43} className={`h-[38px] w-auto xl:h-[43px] ${dark ? 'brightness-0 invert' : ''}`} />
        </a>

        <button
          type="button"
          className={`grid size-11 place-items-center rounded-full xl:hidden ${dark ? 'text-white' : 'text-navy'}`}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className={`relative block h-[2px] w-6 rounded-full bg-current transition-colors duration-200 before:absolute before:left-0 before:h-[2px] before:w-6 before:rounded-full before:bg-current before:transition-all before:duration-300 after:absolute after:left-0 after:h-[2px] after:w-6 after:rounded-full after:bg-current after:transition-all after:duration-300 motion-reduce:before:transition-none motion-reduce:after:transition-none ${
              open ? 'bg-transparent before:top-0 before:rotate-45 after:top-0 after:-rotate-45' : 'before:-top-[7px] after:top-[7px]'
            }`}
          />
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={[
            // Mobile/tablet: a curtain that drops from the header (clip-path + fade), always mounted so it can animate.
            'absolute inset-x-0 top-full z-20 flex flex-col gap-1 bg-page px-6 pb-6 pt-2 shadow-md transition-[opacity,clip-path,visibility,translate] duration-500 ease-[cubic-bezier(0.22,0.8,0.28,1)] motion-reduce:transition-none md:px-10',
            open ? 'visible translate-y-0 opacity-100 [clip-path:inset(0_0_-48px_0)]' : 'invisible -translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0)]',
            'xl:visible xl:static xl:z-auto xl:flex xl:translate-y-0 xl:flex-row xl:items-center xl:gap-0 xl:bg-transparent xl:p-0 xl:opacity-100 xl:shadow-none xl:transition-none xl:[clip-path:none]',
          ].join(' ')}
        >
          <ul className={`m-0 flex list-none flex-col gap-1 p-0 xl:flex-row xl:gap-[54px]`}>
            {navItems.map((item, i) => (
              <li key={item.href} {...row(i)}>
                <a
                  href={url(item.href)}
                  onClick={() => setOpen(false)}
                  data-text={item.label}
                  aria-current={isActive(currentPath, item.href) ? 'page' : undefined}
                  // The invisible bold copy (::after) reserves the bold width, so selecting an item never shifts the nav.
                  className={`flex flex-col py-3 text-[20.2px] font-medium leading-none text-navy no-underline ${dark ? 'xl:text-white' : ''} after:invisible after:block after:h-0 after:overflow-hidden after:font-bold after:content-[attr(data-text)] aria-[current=page]:font-bold xl:py-0`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div {...row(navItems.length)} className={`mt-2 xl:ml-[45px] xl:mt-0 ${row(navItems.length).className}`}>
            <Button href={url(contactCta.href)} className={`w-[150px] text-[20.2px] leading-none h-[41px] ${dark ? 'xl:bg-page xl:text-navy' : ''}`}>
              {contactCta.label}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
