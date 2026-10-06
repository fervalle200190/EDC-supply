import { useEffect, useState } from 'react';
import { assets } from '@/data/assets';
import type { HeroSlide } from '@/data/home';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { url } from '@/lib/url';

interface HeroProps {
  slides: readonly HeroSlide[];
  /** Milliseconds each slide stays on screen. Set to 0 to disable autoplay. */
  interval?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Backdrop({ slide, eager, mirror = false }: { slide: HeroSlide; eager: boolean; mirror?: boolean }) {
  return (
    <div
      aria-hidden={mirror || undefined}
      className={cn(
        'absolute inset-y-0 overflow-hidden',
        mirror
          ? // Frame left edge = max(0px,(100%-1623px)/2). Written out in full so Tailwind can see the classes.
            'hidden xl:block xl:right-[calc(100%-max(0px,calc((100%-1623px)/2)))] xl:w-[calc(100%-max(0px,calc((100%-1623px)/2)))] xl:[transform:scaleX(-1)]'
          : 'inset-x-0 xl:left-[max(0px,calc((100%-1623px)/2))] xl:right-0',
      )}
    >
      <img
        src={url(slide.image)}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        className={cn('h-full w-full object-cover', slide.overlay ? 'max-md:object-[68%_center] xl:w-[max(1620px,100%)]' : 'max-md:object-[82%_center] md:object-left xl:w-full')}
      />
      {slide.overlay ? (
        // Clipped to the hero box: every slide must occupy exactly the same area (no overlay tail under slide 1).
        <div className="absolute inset-x-0 top-0 hidden h-full overflow-hidden md:block xl:-ml-px xl:h-[617px] xl:w-[max(1640px,100%)]">
          <img src={url(assets.home.heroOverlay)} alt="" className="h-full w-full object-fill max-md:opacity-90 xl:-mt-[27px] xl:h-[652px]" />
        </div>
      ) : null}
      {/* Extra navy under the copy: slide 1's bare photo is brighter than the other slides' baked-in gradient. */}
      {slide.overlay ? (
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[min(1000px,100%)] md:block xl:w-[1000px] [background:linear-gradient(90deg,rgb(13_49_71/0.55)_0%,rgb(13_49_71/0.5)_55%,rgb(13_49_71/0)_100%)]" />
      ) : null}
    </div>
  );
}

export function Hero({ slides, interval = 6000 }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // One timer per slide: a manual click changes `index`, which restarts the countdown.
  useEffect(() => {
    if (!interval || paused || slides.length < 2 || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => window.clearTimeout(id);
  }, [index, paused, interval, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate grid bg-navy [overflow-x:clip] max-md:min-h-[calc(88svh-84px)] xl:z-10 xl:h-[617px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!active}
            inert={!active}
            className={cn(
              'relative col-start-1 row-start-1 transition-opacity duration-700 ease-in-out motion-reduce:transition-none',
              active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0',
            )}
          >
            {/* On screens wider than the 1623px frame the picture starts at the frame's left edge, so the dark gradient always
                sits behind the copy. The strip to its left is a mirrored copy of the picture, which keeps the colours seamless. */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
              <Backdrop slide={slide} eager={i === 0} />
              <Backdrop slide={slide} eager={i === 0} mirror />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/55 max-md:bg-gradient-to-t max-md:from-navy/95 max-md:via-navy/60 max-md:to-navy/15 xl:hidden" />

            <div className="relative mx-auto flex min-h-[calc(88svh-84px)] max-w-[1623px] flex-col justify-end px-6 pb-24 pt-20 md:block md:min-h-[520px] md:px-10 md:pb-32 md:pt-28 xl:h-[617px] xl:min-h-0 xl:p-0">
              {slide.title.length > 0 ? (
                <h1 className="m-0 max-w-[620px] text-[34px] font-bold leading-[1.15] text-white md:max-w-[720px] md:text-[44px] xl:absolute xl:left-[80px] xl:top-[113px] xl:max-w-none xl:text-[50.44px] xl:leading-[58px]">
                  {slide.title.map((line, k) => (
                    <span key={line}>
                      {k > 0 ? <br className="hidden xl:block" /> : null}
                      {k > 0 ? ' ' : null}
                      {line}
                    </span>
                  ))}
                </h1>
              ) : null}
              {slide.description.length > 0 ? (
                <p className="mt-6 max-w-[640px] text-[18px] font-medium leading-[1.4] text-white md:text-[20px] xl:absolute xl:left-[80px] xl:top-[272px] xl:m-0 xl:max-w-none xl:text-[21.95px] xl:leading-[25px]">
                  {slide.description.map((line, k) => (
                    <span key={line}>
                      {k > 0 ? <br className="hidden xl:block" /> : null}
                      {k > 0 ? ' ' : null}
                      {line}
                    </span>
                  ))}
                </p>
              ) : null}
              <Button
                href={url(slide.cta.href)}
                variant="green"
                tabIndex={active ? undefined : -1}
                className="mt-8 h-[54px] w-[298px] text-[19.94px] font-semibold leading-none xl:absolute xl:left-[80px] xl:top-[385px] xl:mt-0"
              >
                {slide.cta.label}
              </Button>
            </div>
          </div>
        );
      })}

      {/* Same centred 1623px frame as the slide copy, so the dots line up with the text and the button. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="relative mx-auto h-full max-w-[1623px]">
          <div
            role="tablist"
            aria-label="Slides"
            className="pointer-events-auto absolute bottom-8 left-6 flex gap-2 md:left-10 xl:bottom-auto xl:left-[80px] xl:top-[541px]"
          >
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'size-[18px] cursor-pointer rounded-full border-0 p-0 transition-colors duration-300',
              i === index ? 'bg-[#d9d9d9]' : 'bg-[#72848f] hover:bg-[#9fb0ba]',
            )}
          />
        ))}
          </div>
        </div>
      </div>
    </section>
  );
}
