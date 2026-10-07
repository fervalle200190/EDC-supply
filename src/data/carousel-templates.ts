import { toRelative, type RelativeCard } from './carousel-cards';
import { productPageLayouts } from './product-layouts';

/**
 * Card layout of every product, taken from the first Figma frame that shows it. Used for the cards the
 * design does not draw (the carousel has 7 related products but each frame only shows the first four).
 * Server-side only: it pulls in every page layout.
 */
export const cardTemplates: Record<string, RelativeCard> = (() => {
  const templates: Record<string, RelativeCard> = {};
  for (const layout of Object.values(productPageLayouts)) {
    for (const card of layout.carousel.cards) templates[card.slug] ??= toRelative(card);
  }
  return templates;
})();
