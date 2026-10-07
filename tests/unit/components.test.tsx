import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { PortfolioCarousel } from '@/components/home/PortfolioCarousel';
import { SolutionAreas } from '@/components/home/SolutionAreas';
import { TrustedBy } from '@/components/about/TrustedBy';
import { heroSlides, portfolioItems, solutionAreas } from '@/data/home';
import { trustedBy } from '@/data/about';

describe('Header', () => {
  it('renders the primary navigation and marks the current page', () => {
    render(<Header currentPath="/about" />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'About Us' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(within(nav).getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
  });

  it('toggles the mobile menu', async () => {
    render(<Header currentPath="/" />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Footer', () => {
  it('renders contact details as links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '+1 (754) 230 0816' })).toHaveAttribute('href', 'tel:+17542300816');
    expect(screen.getByRole('link', { name: 'info@edcsupplyllc.com' })).toHaveAttribute('href', 'mailto:info@edcsupplyllc.com');
  });
});

describe('Hero', () => {
  it('shows the headline and one pagination dot per slide', () => {
    render(<Hero slides={heroSlides} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Engineered Reliability for Critical Operations');
    expect(screen.getAllByRole('tab')).toHaveLength(heroSlides.length);
  });

  it('selects the clicked slide', async () => {
    render(<Hero slides={heroSlides} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(tabs[3]!);
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });
});

describe('Hero autoplay', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const selected = () => screen.getAllByRole('tab').findIndex((t) => t.getAttribute('aria-selected') === 'true');

  it('has six slides whose buttons all scroll to "Our four solution areas"', () => {
    const { container } = render(<Hero slides={heroSlides} />);
    expect(heroSlides).toHaveLength(6);
    const links = [...container.querySelectorAll('a')];
    expect(links).toHaveLength(6);
    for (const a of links) expect(a).toHaveAttribute('href', '#solutions');
  });

  it('gives every slide its own headline and button label', () => {
    expect(new Set(heroSlides.map((s) => s.title.join(' '))).size).toBe(6);
    expect(new Set(heroSlides.map((s) => s.cta.label)).size).toBe(6);
    expect(heroSlides.map((s) => s.cta.label)).toEqual([
      'Explore Our Solutions',
      'Power Quality Solutions',
      'Electrical Protection',
      'Critical Power Solutions',
      'Monitoring Solutions',
      'Optimize Your Facility',
    ]);
  });

  it('advances every interval and loops back to the first slide', () => {
    render(<Hero slides={heroSlides} interval={1000} />);
    expect(selected()).toBe(0);
    act(() => void vi.advanceTimersByTime(1000));
    expect(selected()).toBe(1);
    // each slide schedules its own timer once React has rendered it, so step one interval at a time
    for (let i = 0; i < 5; i++) act(() => void vi.advanceTimersByTime(1000));
    expect(selected()).toBe(0);
  });

  it('pauses while the pointer is over the hero and resumes afterwards', async () => {
    render(<Hero slides={heroSlides} interval={1000} />);
    const hero = screen.getByRole('region', { name: 'Featured' });
    act(() => void hero.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
    // React's onMouseEnter listens to mouseover/mouseout
    act(() => void vi.advanceTimersByTime(3500));
    expect(selected()).toBe(0);
    act(() => void hero.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body })));
    act(() => void vi.advanceTimersByTime(1000));
    expect(selected()).toBe(1);
  });

  it('restarts the countdown when a dot is clicked', () => {
    render(<Hero slides={heroSlides} interval={1000} />);
    act(() => void vi.advanceTimersByTime(900));
    act(() => screen.getAllByRole('tab')[4]!.click());
    expect(selected()).toBe(4);
    act(() => void vi.advanceTimersByTime(900));
    expect(selected()).toBe(4);
    act(() => void vi.advanceTimersByTime(200));
    expect(selected()).toBe(5);
  });
});

describe('SolutionAreas', () => {
  it('renders every area with its brands', () => {
    render(<SolutionAreas title="Our four solution areas" areas={solutionAreas} />);
    expect(screen.getByRole('heading', { name: 'Our four solution areas' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText(/Sensemore/)).toBeInTheDocument();
  });
});

describe('PortfolioCarousel', () => {
  it('renders the cards and navigation buttons', () => {
    render(<PortfolioCarousel title="Complete energy & power quality portfolio" items={portfolioItems} />);
    expect(screen.getAllByRole('link', { name: /Learn more/ })).toHaveLength(portfolioItems.length);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('lists every product, not just the first four', () => {
    render(<PortfolioCarousel title="t" items={portfolioItems} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(8);
  });

  it('slides one card per arrow press and wraps around at both ends', async () => {
    render(<PortfolioCarousel title="t" items={portfolioItems} />);
    const track = screen.getAllByRole('list')[0]!;
    Object.defineProperty(track, 'clientWidth', { value: 1000, configurable: true });
    Object.defineProperty(track, 'scrollWidth', { value: 3000, configurable: true });
    const calls: string[] = [];
    track.scrollBy = ((o: ScrollToOptions) => calls.push(`by:${o.left! > 0 ? '+' : '-'}`)) as typeof track.scrollBy;
    track.scrollTo = ((o: ScrollToOptions) => calls.push(`to:${o.left}`)) as typeof track.scrollTo;

    track.scrollLeft = 0;
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous' })); // at the start: jumps to the end
    track.scrollLeft = 2000;
    await userEvent.click(screen.getByRole('button', { name: 'Next' })); // at the end: back to the start
    expect(calls).toEqual(['by:+', 'to:3000', 'to:0']);
  });
});

describe('TrustedBy', () => {
  it('renders every client logo with alt text', () => {
    render(<TrustedBy title={trustedBy.title} background={trustedBy.background} clients={trustedBy.clients} />);
    for (const c of trustedBy.clients) expect(screen.getByAltText(c.name)).toBeInTheDocument();
  });
});

describe('Header selected item', () => {
  it('marks the current page (styled bold) and keeps parent sections active on detail pages', () => {
    render(<Header currentPath="/products/fire-pump-controllers" />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Products' }).className).toContain('aria-[current=page]:font-bold');
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
