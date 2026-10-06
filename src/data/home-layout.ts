// Measured from the Figma "home" frame (1623px wide). Coordinates are frame px; section tops are the y of each
// section in the frame. Lines are positioned one by one because the design centres them by hand.
export interface PlacedLine {
  text: string;
  /** x of the text origin. */
  left: number;
}

export interface PlacedBlock {
  size: number;
  weight: number;
  /** Line height (px) – the baseline pitch of the design. */
  lh: number;
  /** y of the first line box. */
  top: number;
  lines: readonly PlacedLine[];
}

export const sectionTops = { solutions: 1920, partner: 2829, portfolio: 3485, footer: 5041 } as const;

export const solutionsTitle: PlacedBlock = {
  size: 31.37, weight: 600, lh: 37.6, top: 2189.2,
  lines: [{ text: 'Our four solution areas', left: 130.6 }],
};

export const partnerStatement = {
  title: {
    size: 51.5, weight: 700, lh: 49.4, top: 3060,
    lines: [
      { text: '“ONE PARTNER.', left: 592.5 },
      { text: 'COMPLETE POWER RELIABILITY”', left: 353 },
    ],
  } satisfies PlacedBlock,
  text: {
    size: 22.1, weight: 400, lh: 21.1, top: 3194.9,
    lines: [
      { text: 'From power quality and surge protection to critical backup and intelligent', left: 387.5 },
      { text: 'monitoring, EDC Supply engineers integrated solutions designed around', left: 393.7 },
      { text: 'your facility—not around a single product.', left: 565.7 },
    ],
  } satisfies PlacedBlock,
  /** Decorative lines hug the screen edges (left piece x≥0, right piece x≤1700 of the 1623px frame). */
  squiggles: {
    left: '/assets/home/partner-squiggles-left.svg',
    right: '/assets/home/partner-squiggles-right.svg',
  },
  height: sectionTops.portfolio - sectionTops.partner,
};

export const portfolioTitleBlock: PlacedBlock = {
  size: 29.95, weight: 600, lh: 35.9, top: 3668.4,
  lines: [{ text: 'Complete energy & power quality portfolio', left: 127.7 }],
};

export const portfolioLayout = {
  cardsTop: 3763,
  arrows: { left: 65, right: 1551, top: 3945 },
  /** Gradient of the section background, as CSS stops measured from the section top. */
  background:
    'linear-gradient(to bottom, #f2f2f2 0, #f2f2f2 471px, #e6e8e9 515px, #cbd1d5 590px, #aab5bc 665px, #8495a0 740px, #718591 815px, #617785 890px, #506a79 965px, #425e6f 1040px, #345264 1115px, #28485b 1190px, #1c3e52 1265px, #13364c 1340px, #0d3147 1399px, #0d3147 100%)',
};

export const closingCta = {
  title: {
    size: 64.64, weight: 700, lh: 59.9, top: 4471.7,
    lines: [
      { text: 'Let’s Build More', left: 546.3 },
      { text: 'Reliable Operations', left: 485.6 },
    ],
  } satisfies PlacedBlock,
  text: {
    size: 21.6, weight: 400, lh: 20.5, top: 4632.1,
    lines: [
      { text: 'Tell us about your facility and the electrical challenges affecting your', left: 447.9 },
      { text: 'operations. Let’s explore the right solution for your application.', left: 479.6 },
    ],
  } satisfies PlacedBlock,
  link: { label: 'Talk to Our Team', href: '/contact', size: 29.02, weight: 700, lh: 34.8, top: 4714.7, left: 683.9, arrow: { x: 952, y: 4730, w: 15, h: 12 } },
};
