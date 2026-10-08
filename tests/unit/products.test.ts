import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getProduct, productHref, products, relatedProducts } from '@/data/products';
import { productPageLayouts, productsPageLayout } from '@/data/product-layouts';
import { cardTemplates } from '@/data/carousel-templates';
import { portfolioItems } from '@/data/home';

const publicFile = (src: string) => join(process.cwd(), 'public', src);

describe('product catalogue', () => {
  it('keeps the order of the design (grid order = frame order)', () => {
    expect(products.map((p) => p.slug)).toEqual([
      'surge-protection-devices',
      'active-harmonic-filters',
      'power-quality-compensators',
      'uninterruptible-power-supplies',
      'passive-harmonic-filters',
      'fire-pump-controllers',
      'nickel-cadmium-and-lead-acid-batteries',
      'machine-health-monitoring',
    ]);
  });

  it('lists the products on the Products page in catalogue order', () => {
    expect(productsPageLayout.items.map((i) => i.slug)).toEqual(products.map((p) => p.slug));
  });

  it('links every product to /products/<slug>', () => {
    expect(productHref('fire-pump-controllers')).toBe('/products/fire-pump-controllers');
    expect(() => getProduct('nope')).toThrow(/Unknown product/);
  });

  it('shows the same first four products on the home carousel', () => {
    expect(portfolioItems.map((i) => i.href)).toEqual(products.map((p) => productHref(p.slug)));
  });
});

describe('related products ("Keep exploring")', () => {
  it('starts right after the current product and wraps around', () => {
    expect(relatedProducts('surge-protection-devices').map((p) => p.slug)).toEqual(products.slice(1).map((p) => p.slug));
    expect(relatedProducts('machine-health-monitoring')[0]?.slug).toBe('surge-protection-devices');
    expect(relatedProducts('fire-pump-controllers').map((p) => p.slug)).toEqual([
      'nickel-cadmium-and-lead-acid-batteries',
      'machine-health-monitoring',
      'surge-protection-devices',
      'active-harmonic-filters',
      'power-quality-compensators',
      'uninterruptible-power-supplies',
      'passive-harmonic-filters',
    ]);
  });

  it('never includes the current product and always has the other seven', () => {
    for (const p of products) {
      const related = relatedProducts(p.slug);
      expect(related).toHaveLength(products.length - 1);
      expect(related.map((r) => r.slug)).not.toContain(p.slug);
    }
  });

  it('matches the four cards drawn in each Figma frame', () => {
    for (const p of products) {
      const drawn = productPageLayouts[p.slug]!.carousel.cards.map((c) => c.slug);
      expect(drawn).toEqual(relatedProducts(p.slug).slice(0, 4).map((r) => r.slug));
    }
  });

  it('has a card template for every product', () => {
    for (const p of products) expect(cardTemplates[p.slug]).toBeDefined();
  });
});

describe('product page layouts', () => {
  it('has a layout for every product, with three features', () => {
    for (const p of products) {
      const layout = productPageLayouts[p.slug];
      expect(layout, p.slug).toBeDefined();
      expect(layout!.features).toHaveLength(3);
      expect(layout!.title.lines.length).toBeGreaterThan(0);
    }
  });

  it('only references assets that exist on disk', () => {
    const missing: string[] = [];
    const check = (src?: string) => src && !existsSync(publicFile(src)) && missing.push(src);
    for (const p of products) {
      const l = productPageLayouts[p.slug]!;
      check(p.thumb);
      check(l.hero.photo.src);
      check(l.hero.overlay?.src);
      check(l.showcaseSvg?.src);
      l.features.forEach((f) => check(f.icon.src));
      l.showcase.forEach((s) => check(s.src));
    }
    productsPageLayout.items.forEach((i) => check(i.image.src));
    check(productsPageLayout.hero.src);
    expect(missing).toEqual([]);
  });
});

describe('showcase trim boxes', () => {
  it('exist for every raster showcase picture and stay inside the file', async () => {
    const { productPageLayouts } = await import('@/data/product-layouts');
    const { showcaseTrim } = await import('@/data/showcase-trim');
    for (const L of Object.values(productPageLayouts)) {
      for (const img of L.showcase) {
        const t = showcaseTrim[img.src];
        expect(t, `run "node scripts/showcase-trim.mjs" after adding ${img.src}`).toBeDefined();
        expect(t!.x + t!.w).toBeLessThanOrEqual(t!.width);
        expect(t!.y + t!.h).toBeLessThanOrEqual(t!.height);
      }
    }
  });
});
