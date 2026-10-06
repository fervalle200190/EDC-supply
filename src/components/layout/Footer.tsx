import { copyright, footerColumns } from '@/data/site';

export interface FooterGeometry {
  /** Footer height on desktop (px). */
  height: number;
  /** Top of the divider and of the copyright line, measured from the top of the footer. */
  hrTop: number;
  copyrightTop: number;
  /** Vertical nudge of the four columns. */
  shiftY: number;
}

export const defaultFooterGeometry: FooterGeometry = { height: 329, hrTop: 262, copyrightTop: 282, shiftY: 0 };

interface FooterProps {
  /** Horizontal nudge of the content in design px (frames differ by a few px between pages). */
  offsetX?: number;
  /** Vertical geometry; the design nudges it by a few px on some pages. */
  geometry?: FooterGeometry;
}

export function Footer({ offsetX = 0, geometry = defaultFooterGeometry }: FooterProps) {
  return (
    <footer className="bg-navy text-white shadow-[0_2px_0_0_var(--color-navy)]" style={{ '--fx': `${offsetX}px`, '--fh': `${geometry.height}px`, '--hr': `${geometry.hrTop}px`, '--cr': `${geometry.copyrightTop}px`, '--fy': `${59 + geometry.shiftY}px` } as React.CSSProperties}>
      <div className="mx-auto max-w-[1623px] px-6 pb-8 pt-12 md:px-10 xl:relative xl:h-(--fh) xl:p-0">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:ml-[calc(131px+var(--fx))] xl:grid-cols-[310px_368px_375px_1fr] xl:gap-0 xl:pt-(--fy)">
          {footerColumns.map((column) => (
            <section key={column.title}>
              <h3 className="m-0 text-[20px] font-semibold leading-6">{column.title}</h3>
              <div className="mt-[24px] text-[20px] font-normal leading-6">
                {column.lines.map((line, i) =>
                  typeof line === 'string' ? (
                    <p key={i} className="m-0">{line}</p>
                  ) : (
                    <p key={i} className={`m-0 ${i > 0 ? 'mt-2' : ''}`}>
                      {line.label}
                      <a href={line.href} className={`text-white no-underline ${line.label.startsWith('Phone') ? 'font-medium' : ''}`}>
                        {line.strong}
                      </a>
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
        <hr className="m-0 mt-10 h-px border-0 bg-[#687e8c] xl:absolute xl:left-[calc(131px+var(--fx))] xl:right-[calc(131px-var(--fx))] xl:top-(--hr) xl:mt-0" />
        <p className="m-0 py-4 text-center text-[20px] font-normal leading-6 xl:absolute xl:inset-x-0 xl:ml-(--fx) xl:top-(--cr) xl:py-0">{copyright}</p>
      </div>
    </footer>
  );
}
