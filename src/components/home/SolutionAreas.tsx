import type { SolutionArea } from '@/data/home';
import { sectionTops, solutionsTitle } from '@/data/home-layout';
import { url } from '@/lib/url';

interface SolutionAreasProps {
  title: string;
  areas: readonly SolutionArea[];
}

export function SolutionAreas({ title, areas }: SolutionAreasProps) {
  return (
    <section className="m-screen relative bg-page px-6 py-16 md:px-10 xl:h-[909px] xl:p-0">
      <img
        src={url('/assets/home/squiggles.svg')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute hidden xl:block xl:-left-[2px] xl:top-[99px] xl:h-[881px] xl:w-[1105px]"
      />
      <div className="relative mx-auto max-w-[1623px] xl:h-full">
        {/* Scroll target of the hero buttons: just above the title. */}
        <span id="solutions" aria-hidden="true" className="absolute left-0 top-0 xl:top-[190px]" />
        <h2
          className="m-0 text-[30px] font-semibold leading-tight text-black md:text-[40px] xl:absolute xl:left-(--x) xl:top-(--y) xl:[font-size:var(--fs)] xl:[font-weight:var(--fw)] xl:[line-height:var(--lh)]"
          style={{ '--x': `${solutionsTitle.lines[0]!.left}px`, '--y': `${solutionsTitle.top - sectionTops.solutions}px`, '--fs': `${solutionsTitle.size}px`, '--fw': solutionsTitle.weight, '--lh': `${solutionsTitle.lh}px` } as React.CSSProperties}
        >
          {title}
        </h2>
        {/* Four equal columns on the same 131px–1494px content grid as the headings and the footer. */}
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:absolute xl:left-[131px] xl:top-[351px] xl:mt-0 xl:w-[1363px] xl:grid-cols-4 xl:gap-8">
          {areas.map((a) => (
            <li key={a.title.join(' ')} className="relative flex flex-col rounded-[40px] bg-card px-[32px] pt-10 transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.05] hover:shadow-[0_18px_40px_rgba(13,49,71,0.28)] motion-reduce:transition-none motion-reduce:hover:scale-100 max-xl:gap-6 xl:h-[453px] xl:pt-[66px]">
              <div>
                <h3 className="m-0 text-[23.6px] font-normal leading-[26px] text-black">
                  {a.title.map((line, k) => (
                    <span key={k} className="block">{line}</span>
                  ))}
                </h3>
                <p className="m-0 mt-4 min-h-[57px] whitespace-pre-line text-[16.35px] font-medium leading-[19px] text-accent">{a.summary}</p>
                <p className="m-0 mt-[11px] whitespace-pre-line text-[16.56px] font-normal leading-[19px] text-muted">{a.detail}</p>
              </div>
              <div className="mt-auto pb-8 max-xl:pt-6 xl:h-[116px] xl:pb-0">
                <hr className="m-0 h-px w-full border-0 bg-[#737474]" />
                <p className="m-0 mt-[12px] whitespace-pre-line text-[16.57px] font-normal leading-[19px] text-muted">{a.brands}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
