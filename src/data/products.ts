export interface Product {
  /** Name as printed on the carousel cards (the grid prints the UPS acronym, the cards do not). */
  cardNameLines?: readonly string[];
  slug: string;
  /** Name split into the lines used by the design. */
  nameLines: readonly string[];
  /** Cut-out product shot used by the product grid and the carousels. */
  thumb: string;
  /** Size (design px) of the shot inside the carousel cards. */
  carouselImage: { w: number; h: number };
}

/** Catalogue order = the order of the grid on the Products page (and of the Figma frames). */
export const products: readonly Product[] = [
  { slug: 'surge-protection-devices', nameLines: ['Surge Protection', 'Devices (SPDs)'], thumb: '/assets/products/thumb-surge-protection-devices.png', carouselImage: { w: 107, h: 166 } },
  { slug: 'active-harmonic-filters', nameLines: ['Active', 'Harmonic', 'Filters'], thumb: '/assets/products/thumb-active-harmonic-filters.png', carouselImage: { w: 80, h: 212 } },
  { slug: 'power-quality-compensators', nameLines: ['Power Quality', 'Compensators'], thumb: '/assets/products/thumb-power-quality-compensators.png', carouselImage: { w: 99, h: 186 } },
  { slug: 'uninterruptible-power-supplies', nameLines: ['Uninterruptible', 'Power Supplies (UPS)'], cardNameLines: ['Uninterruptible', 'Power Supplies'], thumb: '/assets/products/thumb-uninterruptible-power-supplies.png', carouselImage: { w: 138, h: 136 } },
  { slug: 'passive-harmonic-filters', nameLines: ['Passive', 'Harmonic', 'Filters'], thumb: '/assets/products/thumb-passive-harmonic-filters.png', carouselImage: { w: 122, h: 198 } },
  { slug: 'fire-pump-controllers', nameLines: ['Fire Pump', 'Controllers'], thumb: '/assets/products/thumb-fire-pump-controllers.png', carouselImage: { w: 96, h: 212 } },
  { slug: 'nickel-cadmium-and-lead-acid-batteries', nameLines: ['Nickel-Cadmium', 'and Lead-Acid', 'Batteries'], thumb: '/assets/products/thumb-nickel-cadmium-and-lead-acid-batteries.png', carouselImage: { w: 116, h: 200 } },
  { slug: 'machine-health-monitoring', nameLines: ['Machine', 'Health', 'Monitoring'], thumb: '/assets/products/thumb-machine-health-monitoring.png', carouselImage: { w: 170, h: 121 } },
];

export const productHref = (slug: string) => `/products/${slug}`;

export const getProduct = (slug: string): Product => {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
};

/**
 * Products shown in "Keep exploring our products": every other product, starting right after the
 * current one and wrapping around (so the last product is followed by the first).
 */
export const relatedProducts = (slug: string): readonly Product[] => {
  const i = products.findIndex((p) => p.slug === slug);
  if (i < 0) throw new Error(`Unknown product: ${slug}`);
  return [...products.slice(i + 1), ...products.slice(0, i)];
};

