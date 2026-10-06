import type { basedInFlorida } from '@/data/about';
import { url } from '@/lib/url';

type BasedInFloridaProps = typeof basedInFlorida;

/** The artwork already carries the visible headline, so the text is exposed to assistive tech only. */
export function BasedInFlorida({ image, title, subtitle }: BasedInFloridaProps) {
  return (
    <section className="relative w-full overflow-hidden bg-page xl:h-[795px]">
      <img
        src={url(image)}
        alt="Map highlighting the Americas, with Doral, Florida marked"
        width={1616}
        height={795}
        className="h-auto w-full object-cover object-left mix-blend-multiply [filter:brightness(1.045)] xl:h-[795px] xl:w-[max(1616px,100%)] xl:max-w-none"
      />
      <h2 className="sr-only">{title}</h2>
      <p className="sr-only">{subtitle}</p>
    </section>
  );
}
