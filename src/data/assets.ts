/** Single source of truth for static asset paths (served from /public). */
export const assets = {
  logo: '/assets/shared/edc-logo.svg',
  whatsapp: '/assets/shared/whatsapp.png',
  home: {
    heroPhoto: '/assets/home/hero-photo.jpg',
    heroOverlay: '/assets/home/hero-overlay.png',
    whyBg: '/assets/home/why-bg.jpg',
    sinetamerProducts: '/assets/home/sinetamer-products.png',
  },
} as const;
