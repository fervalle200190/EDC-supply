import { describe, expect, it } from 'vitest';
import { contactCta, copyright, footerColumns, navItems } from '@/data/site';
import { flagship, heroSlides, partners, portfolioItems, solutionAreas, whyItems } from '@/data/home';
import { decor, missionVision, trustedBy } from '@/data/about';

describe('site data', () => {
  it('exposes the three primary nav links plus the contact CTA', () => {
    expect(navItems.map((n) => n.label)).toEqual(['Home', 'About Us', 'Products']);
    expect(contactCta.label).toBe('Contact Us');
  });

  it('keeps the footer to four columns', () => {
    expect(footerColumns.map((c) => c.title)).toEqual(['EDC SUPPLY', 'ADDRESS', 'CONTACT', 'BUSINESS HOURS']);
    expect(copyright).toMatch(/EDC SUPPLY LLC/);
  });
});

describe('home data', () => {
  it('has six hero slides (design shows six pagination dots)', () => {
    expect(heroSlides).toHaveLength(6);
  });

  it('lists the seven technology partners with unique names', () => {
    expect(new Set(partners.map((p) => p.name)).size).toBe(7);
  });

  it('has four "why partner" items, four solution areas and four portfolio cards', () => {
    expect(whyItems).toHaveLength(4);
    expect(solutionAreas).toHaveLength(4);
    expect(portfolioItems).toHaveLength(4);
  });

  it('sends the flagship button to the star product (SPDs)', () => {
    expect(flagship.cta.href).toBe('/products/surge-protection-devices');
  });
});

describe('about data', () => {
  it('shows 15 client logos in a 3-column grid', () => {
    expect(trustedBy.clients).toHaveLength(15);
    expect(new Set(trustedBy.clients.map((c) => c.name)).size).toBe(15);
  });

  it('has mission and vision cards', () => {
    expect(missionVision.cards.map((c) => c.title)).toEqual(['Mission', 'Vision']);
  });

  it('has three decorative vector pieces', () => {
    expect(Object.keys(decor)).toHaveLength(3);
  });
});
