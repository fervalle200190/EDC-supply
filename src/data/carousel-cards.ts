import type { CarouselCardLayout, PlacedText } from './product-layout-types';

/** A carousel card's contents positioned relative to the card's own top-left corner. */
export interface RelativeCard {
  image: { x: number; y: number; w: number; h: number };
  title: PlacedText;
  link: { x: number; y: number; h: number };
}

export const toRelative = (card: CarouselCardLayout): RelativeCard => ({
  image: { x: card.image.x - card.x, y: card.image.y - card.y, w: card.image.w, h: card.image.h },
  title: { ...card.title, left: card.title.left - card.x, top: card.title.top - card.y },
  link: { x: card.link.x - card.x, y: card.link.y - card.y, h: card.link.h },
});
