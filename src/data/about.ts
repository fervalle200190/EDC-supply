export const aboutHero = {
  title: 'About Us',
  image: '/assets/about/hero.jpg',
  overlay: '/assets/about/hero-overlay.png',
  lines: '/assets/about/hero-lines.svg',
} as const;

export const strategicPartner = {
  title: ['Your Strategic Partner', 'in Reliable Power'],
  paragraphs: [
    'Founded in 2010 by a team of electrical engineers, EDC Supply specializes in power quality and backup power solutions. We help industrial customers address electrical disturbances and select equipment suited to their operating requirements.',
    'Our engineering background and experience in industrial applica­tions guide our approach. We work with customers to understand their needs and provide practical solutions that support reliable equipment operation and continuity of power.',
  ],
} as const;

export const rightTechnology = {
  title: ['The Right Technology', 'for Your Application'],
  paragraphs: [
    'We offer power quality and reliability solutions for industrial and mission-critical environments, helping customers address the electrical challenges that affect their operations.',
    'By combining global technologies with application-focused ex­pertise, we help customers select solutions that protect equip­ment, improve electrical performance, and support operational continuity.',
  ],
} as const;

export interface DecorArt {
  src: string;
  /** Position/size in the 1623px frame, relative to the top of the section. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export const decor: Record<'blocks' | 'pills' | 'lines', DecorArt> = {
  blocks: { src: '/assets/about/blocks.svg', x: 0, y: 750, width: 601, height: 611 },
  pills: { src: '/assets/about/deco-left-pills.svg', x: 0, y: 430, width: 209, height: 138 },
  lines: { src: '/assets/about/deco-right.svg', x: 814, y: 218, width: 809, height: 656 },
};

export const missionVision = {
  background: '/assets/about/mission-bg.jpg',
  cards: [
    {
      title: 'Mission',
      body: 'To develop integrated power quality solutions that meet the needs of each application and support the reliable operation of electrical systems and critical equipment.',
      x: 112.5,
      titleTop: 45,
      bodyX: 144.5,
    },
    {
      title: 'Vision',
      body: 'To become a leading provider of power quality solu­tions in the United States and international markets, recognized for technical expertise, innovative equip­ment and dependable customer support.',
      x: 827.5,
      titleTop: 48,
      bodyX: 863.5,
    },
  ],
} as const;

/** The map artwork already contains the headline text, so it is exposed to assistive tech only. */
export const basedInFlorida = {
  image: '/assets/about/map.jpg',
  title: 'Based in Florida',
  subtitle: 'Serving North America & LATAM',
} as const;

export interface ClientLogo {
  name: string;
  src: string;
  /** Box in the 1623px frame, relative to the top of the "Trusted by" section. */
  x: number;
  y: number;
  width: number;
  height: number;
}

const T = 3963; // top of the "Trusted by" section in the design frame
const logo = (name: string, file: string, x: number, y: number, width: number, height: number): ClientLogo => ({
  name,
  src: `/assets/about/logo-${file}.png`,
  x,
  y: y - T,
  width,
  height,
});

export const trustedBy = {
  title: ['Trusted by Leading Global & Industrial', 'Organizations'],
  background: '/assets/about/trusted-bg.png',
  clients: [
    logo('Bayer', 'bayer', 413, 4333, 152, 87),
    logo('Cameron', 'cameron', 712, 4249, 253, 253),
    logo('Pemex', 'pemex', 1117, 4327, 129, 76),
    logo('Kern Energy', 'kern-energy', 399, 4517, 195, 66),
    logo('Nestlé', 'nestle', 807, 4502, 78, 81),
    logo('Unilever', 'unilever', 1088, 4474, 152, 152),
    logo('Alpla', 'alpla', 404, 4711, 175, 50),
    logo('Telcel', 'telcel', 780, 4698, 136, 77),
    logo('Vibracoustic', 'vibracoustic', 1068, 4720, 211, 32),
    logo('Gestamp', 'gestamp', 380, 4873, 234, 42),
    logo('AB InBev', 'abinbev', 763, 4809, 187, 140),
    logo('TenarisTamsa', 'tenaris', 1045, 4829, 277, 87),
    logo('Chevron', 'chevron', 467, 5021, 73, 82),
    logo('Coca-Cola', 'coca-cola', 748, 5032, 197, 62),
    logo('McArthur Dairy', 'mcarthur', 1078, 4973, 177, 177),
  ],
} as const;
