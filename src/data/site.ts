export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  lines: ReadonlyArray<string | { label: string; strong: string; href?: string }>;
}

export const navItems: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
];

export const contactCta: NavItem = { label: 'Contact Us', href: '/contact' };


export const footerColumns: readonly FooterColumn[] = [
  { title: 'EDC SUPPLY', lines: ['Your Strategic Partner', 'in Reliable Power'] },
  { title: 'ADDRESS', lines: ['3105 NW 107 Ave. Suite 506-A', 'Doral, FL 33172, USA'] },
  {
    title: 'CONTACT',
    lines: [
      { label: 'Phone: ', strong: '+1 (754) 230 0816', href: 'tel:+17542300816' },
      { label: 'Email: ', strong: 'info@edcsupplyllc.com', href: 'mailto:info@edcsupplyllc.com' },
    ],
  },
  {
    title: 'BUSINESS HOURS',
    lines: ['Monday – Friday (09:00 – 17:00)', 'Saturday – Sunday (Closed)'],
  },
];

export const copyright = '© Copyright 2026 EDC SUPPLY LLC. All rights reserved.';
