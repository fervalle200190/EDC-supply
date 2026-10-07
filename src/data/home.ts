import { assets } from './assets';
import { productHref, products } from './products';

export interface HeroSlide {
  /** Headline split into the lines used by the design. */
  title: readonly string[];
  description: readonly string[];
  cta: { label: string; href: string };
  image: string;
  /** Slide 1's photo is a bare picture and gets the navy gradient overlay; slides 2–6 already have it baked in. */
  overlay?: boolean;
}

/** Every hero button scrolls to "Our four solution areas". */
const solutions = '#solutions';

export const heroSlides: readonly HeroSlide[] = [
  {
    title: ['Engineered Reliability', 'for Critical Operations'],
    description: [
      'Power quality and energy reliability solutions engineered',
      'to keep your operations protected, efficient, and running.',
    ],
    cta: { label: 'Explore Our Solutions', href: solutions },
    image: assets.home.heroPhoto,
    overlay: true,
  },
  {
    title: ['Cleaner Power.', 'Better Performance.'],
    description: ['Reduce harmonics, improve power factor, and protect sensitive', 'equipment from electrical disturbances.'],
    cta: { label: 'Power Quality Solutions', href: solutions },
    image: '/assets/home/hero-2.jpg',
  },
  {
    title: ['Protect What Keeps', 'You Running.'],
    description: ['Advanced surge and transient protection for sensitive', 'equipment and mission-critical systems.'],
    cta: { label: 'Electrical Protection', href: solutions },
    image: '/assets/home/hero-3.jpg',
  },
  {
    title: ['Power That', 'Never Stops.'],
    description: ['Critical power and backup solutions designed to maintain', 'operational continuity when it matters most.'],
    cta: { label: 'Critical Power Solutions', href: solutions },
    image: '/assets/home/hero-4.jpg',
  },
  {
    title: ['Know Before It Fails.'],
    description: [
      'Smart monitoring and predictive maintenance solutions',
      'that help identify equipment issues before they become',
      'costly failures.',
    ],
    cta: { label: 'Monitoring Solutions', href: solutions },
    image: '/assets/home/hero-5.jpg',
  },
  {
    title: ['Make Your Electrical', 'System Work Better.'],
    description: ['Engineered solutions to improve electrical performance,', 'efficiency, reliability, and equipment life.'],
    cta: { label: 'Optimize Your Facility', href: solutions },
    image: '/assets/home/hero-6.jpg',
  },
];

export interface Partner {
  name: string;
  logo: string;
  /** Display size (design px). */
  width: number;
  height: number;
}

export const partners: readonly Partner[] = [
  { name: 'Comsys', logo: '/assets/home/partner-comsys.png', width: 164, height: 88 },
  { name: 'Firetrol', logo: '/assets/home/partner-firetrol.png', width: 101, height: 25 },
  { name: 'Eaton', logo: '/assets/home/partner-eaton.png', width: 211, height: 69 },
  { name: 'Hoppecke', logo: '/assets/home/partner-hoppecke.png', width: 154, height: 37 },
  { name: 'Mirus International', logo: '/assets/home/partner-mirus.png', width: 114, height: 68 },
  { name: 'SineTamer', logo: '/assets/home/partner-sinetamer.png', width: 101, height: 40 },
  { name: 'Sensemore', logo: '/assets/home/partner-sensemore.png', width: 102, height: 102 },
];

export interface WhyItem {
  label: string;
  icon: string;
  /** Icon box and text box inside the 337x59 pill (design px). */
  iconBox: { x: number; y: number; width: number; height: number };
  text: { x: number; width: number };
}

export const whyTitle = 'Why partner with EDC Supply?';
export const whyItems: readonly WhyItem[] = [
  { label: 'Proven Technology', icon: '/assets/home/icon-proven.png', iconBox: { x: 28.7, y: 9, width: 39.4, height: 39.4 }, text: { x: 86, width: 201 } },
  { label: 'Leading Technology\nPartners', icon: '/assets/home/icon-partners.png', iconBox: { x: 28.65, y: 7.83, width: 42.57, height: 42.54 }, text: { x: 91, width: 214 } },
  { label: 'Expert Sizing', icon: '/assets/home/icon-sizing.png', iconBox: { x: 27, y: 8.65, width: 42.3, height: 42.3 }, text: { x: 105, width: 138 } },
  { label: 'Long-Term Support', icon: '/assets/home/icon-support.png', iconBox: { x: 27.9, y: 10.65, width: 38.5, height: 38.5 }, text: { x: 92, width: 197 } },
];

export const flagship = {
  title: 'Flagship Protection Technology',
  subtitle: 'SINETAMER® – Advanced 5th Generation',
  tagline: 'Surge & Transient Protection System',
  cta: { label: 'Request a quote', href: productHref('surge-protection-devices') },
  image: assets.home.sinetamerProducts,
} as const;

export interface SolutionArea {
  title: readonly string[];
  summary: string;
  detail: string;
  brands: string;
}

export const solutionsTitle = 'Our four solution areas';
export const solutionAreas: readonly SolutionArea[] = [
  {
    title: ['Power Quality &', 'Optimization'],
    summary: 'Improve power quality and\nelectrical performance across\nyour facility',
    detail: 'Active and passive filtering\nand dynamic compensation',
    brands: 'Comsys, Mirus International\nand Perfectsine',
  },
  {
    title: ['Electrical', 'Protection'],
    summary: 'Protect sensitive equipment\nfrom surges and transients.',
    detail: 'Protection of sensitive\nequipment and critical\nsystems',
    brands: 'SineTamer',
  },
  {
    title: ['Critical Power', '& Backup'],
    summary: 'Support continuity for\nyour most critical operations.',
    detail: 'UPS and batteries',
    brands: 'GEMI Power, Eaton\nand Hoppecke.',
  },
  {
    title: ['Monitoring &', 'Reliability'],
    summary: 'Turn equipment insights\ninto timely maintenance\ndecisions.',
    detail: 'Predictive maintenance\nand condition monitoring',
    brands: 'Sensemore',
  },
];

export interface PortfolioItem {
  title: string;
  image: string;
  href: string;
  /** Size (design px) of the product shot inside the card. */
  size: { w: number; h: number };
}

export const portfolioTitle = 'Complete energy & power quality portfolio';
export const portfolioItems: readonly PortfolioItem[] = products.map((p) => ({
  title: (p.cardNameLines ?? p.nameLines).join('\n'),
  image: p.thumb,
  href: productHref(p.slug),
  size: p.carouselImage,
}));
