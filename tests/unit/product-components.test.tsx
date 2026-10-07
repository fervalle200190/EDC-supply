import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RelatedCarousel } from '@/components/products/RelatedCarousel';
import { Txt } from '@/components/products/Txt';
import { cardTemplates } from '@/data/carousel-templates';
import { productPageLayouts } from '@/data/product-layouts';
import { productHref, products, relatedProducts } from '@/data/products';

const slug = 'surge-protection-devices';
const templates = Object.fromEntries(products.map((p) => [p.slug, cardTemplates[p.slug]!]));

describe('RelatedCarousel', () => {
  const setup = () => render(<RelatedCarousel slug={slug} carousel={productPageLayouts[slug]!.carousel} templates={templates} />);

  it('renders every other product as a card linking to its page, in order', () => {
    setup();
    const list = screen.getByRole('list', { name: 'Related products' });
    const links = within(list).getAllByRole('link', { name: /Learn more/ });
    expect(links.map((a) => a.getAttribute('href'))).toEqual(relatedProducts(slug).map((p) => productHref(p.slug)));
  });

  const xs = () => screen.getAllByRole('listitem').map((li) => parseFloat((li as HTMLElement).style.getPropertyValue('--x')));

  it('slides one card per click and loops forever in both directions', async () => {
    setup();
    const initial = xs();
    const n = initial.length;
    expect(n).toBe(7);
    const pitch = initial[1]! - initial[0]!;

    await userEvent.click(screen.getByRole('button', { name: 'Next products' }));
    const afterNext = xs();
    // every card moves one slot left; the first one parks just off the left edge
    expect(afterNext[1]).toBeCloseTo(initial[0]!, 0);
    expect(afterNext[0]).toBeLessThan(initial[0]!);
    // ...and on the next click it wraps to the far right
    await userEvent.click(screen.getByRole('button', { name: 'Next products' }));
    expect(xs()[0]).toBeGreaterThan(initial[n - 1]!);
    await userEvent.click(screen.getByRole('button', { name: 'Previous products' }));
    expect(xs()).toEqual(afterNext);

    // n clicks later the carousel is back where it started (infinite loop)
    for (let i = 1; i < n; i++) await userEvent.click(screen.getByRole('button', { name: 'Next products' }));
    expect(xs()).toEqual(initial);

    // going backwards from the start wraps around too
    await userEvent.click(screen.getByRole('button', { name: 'Previous products' }));
    const afterPrev = xs();
    expect(afterPrev[0]).toBeCloseTo(initial[1]!, 0);
    expect(afterPrev[n - 2]).toBeLessThan(initial[0]!);
    expect(pitch).toBeGreaterThan(300);
  });
});

describe('Txt', () => {
  const spec = { lines: ['Significantly reduces', 'in applica-', 'tions with drives'], left: 0, top: 0, size: 22, weight: 400, lh: 24 };

  it('joins lines that the design split mid-word', () => {
    const { container } = render(<Txt spec={spec} />);
    expect(container.textContent).toContain('applica-tions');
    expect(container.textContent).not.toContain('applica- tions');
  });

  it('keeps explicit breaks when asked', () => {
    const { container } = render(<Txt spec={{ ...spec, lines: ['Power Quality', 'Compensators'] }} keepBreaks />);
    expect(container.querySelectorAll('br')).toHaveLength(1);
    expect(container.querySelector('br')?.className).toBe('');
  });
});
