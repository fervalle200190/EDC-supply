/** Measured, absolutely-positioned layout of the 1623px desktop frames (see product-layouts.ts). */
export interface PlacedImage {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** The picture is larger than its frame: drawn at this size, `y` px from the frame's top (the rest is clipped). */
  crop?: { w: number; h: number; y: number };
}

export interface PlacedText {
  lines: readonly string[];
  /** Left edge of the text box (centre-aligned boxes use `width` too). */
  left: number;
  /** Top of the first line box. */
  top: number;
  width?: number;
  size: number;
  weight: number;
  /** Line height in px. */
  lh: number;
}

export interface CarouselCardLayout {
  slug: string;
  x: number;
  y: number;
  image: { x: number; y: number; w: number; h: number };
  title: PlacedText;
  link: { x: number; y: number; h: number };
}

/** Geometry of the footer in a frame (the design nudges it by a few px from page to page). */
export interface FooterLayout {
  top: number;
  offsetX: number;
  height: number;
  hrTop: number;
  copyrightTop: number;
  shiftY: number;
}

export interface ProductPageLayout {
  footerTop: number;
  footerOffsetX: number;
  footer: FooterLayout;
  hero: {
    photo: PlacedImage;
    overlay?: PlacedImage;
    /** CSS gradient laid over the photo instead of the PNG overlay (Power Quality Compensators). */
    cssGradient?: { x: number; y: number; w: number; h: number; background: string };
    /** Decorative squiggle lines on the left edge. */
    lines?: { x: number; y: number };
  };
  title: PlacedText;
  subtitle: PlacedText;
  button: { x: number; y: number; w: number; h: number };
  features: ReadonlyArray<{ icon: PlacedImage; heading: PlacedText; description: PlacedText }>;
  showcase: readonly PlacedImage[];
  showcaseSvg?: PlacedImage;
  gradient: { x: number; y: number; w: number; h: number };
  explore: PlacedText;
  carousel: { arrows: ReadonlyArray<{ x: number; y: number }>; cards: readonly CarouselCardLayout[] };
}

export interface ProductsPageLayout {
  footerTop: number;
  footerOffsetX: number;
  footer: FooterLayout;
  hero: PlacedImage;
  heroTitle: PlacedText;
  heading: PlacedText;
  items: ReadonlyArray<{
    slug: string;
    image: PlacedImage;
    title: PlacedText;
    link: { x: number; y: number };
    arrow: { x: number; y: number };
  }>;
}
