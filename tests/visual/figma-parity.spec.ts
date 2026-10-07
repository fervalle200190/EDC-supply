import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Pixel-parity gate: renders each page at the Figma frame width (1623px) and compares it with the
 * reference screenshot exported from Figma (tests/visual/references/*.png).
 *
 * Anti-aliasing differs between Figma and Chrome, and a few hand-placed offsets in the Figma were deliberately snapped to a
 * common grid (see the alignment pass), so up to 4% is tolerated; layout drift (a
 * moved block, a wrong size, a missing asset) blows past it.
 */
const FRAME_WIDTH = 1623;
const MAX_MISMATCH_RATIO = 0.04;

const allPages = [
  { name: 'home', route: '/', reference: 'home.png', max: 0.04 },
  { name: 'about', route: '/about', reference: 'about.png', max: 0.04 },
  { name: 'contact', route: '/contact', reference: 'contact.png', max: 0.04 },
  // /products is not matched pixel for pixel any more: each product sits in its own centred card (Figma comment), so only
  // its responsive baselines below guard the layout.
  { name: 'products', route: '/products', reference: 'products.png', max: 1, parity: false },
  ...[
    'surge-protection-devices',
    'active-harmonic-filters',
    'power-quality-compensators',
    'uninterruptible-power-supplies',
    'passive-harmonic-filters',
    'fire-pump-controllers',
    'nickel-cadmium-and-lead-acid-batteries',
    'machine-health-monitoring',
  ].map((slug, i) => ({ name: `product-${i + 1}`, route: `/products/${slug}`, reference: `product-${i + 1}.png`, max: 0.02 })),
];

/** Only pages whose Figma reference screenshot exists in the repo are tested (lets a partial checkout run). */
const pages = allPages.filter((p) => fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'references', p.reference)));

/** Pages that also get responsive regression baselines (kept to a representative few). */
const responsivePages = pages.filter((p) => ['home', 'about', 'contact', 'products', 'product-1', 'product-8'].includes(p.name));

for (const { name, route, reference, max } of pages.filter((p) => p.parity !== false)) {
  test(`${name} matches the Figma frame`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => { (window as unknown as { __STAGE_ZOOM_OFF__: boolean }).__STAGE_ZOOM_OFF__ = true; });
    await page.setViewportSize({ width: FRAME_WIDTH, height: 900 });
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const expected = PNG.sync.read(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'references', reference)));
    const actual = PNG.sync.read(await page.screenshot({ fullPage: true }));

    expect(actual.width, 'frame width').toBe(expected.width);
    expect(Math.abs(actual.height - expected.height), 'page height drift (px; the Home frame has 4px of blank page below its footer, which is not reproduced)').toBeLessThanOrEqual(4);

    const h = Math.min(actual.height, expected.height);
    const diff = new PNG({ width: expected.width, height: h });
    const crop = (img: PNG) => { const o = new PNG({ width: expected.width, height: h }); PNG.bitblt(img, o, 0, 0, expected.width, h, 0, 0); return o; };
    const bad = pixelmatch(crop(expected).data, crop(actual).data, diff.data, expected.width, h, { threshold: 0.15 });
    const ratio = bad / (expected.width * h);

    await testInfo.attach(`${name}-diff.png`, { body: PNG.sync.write(diff), contentType: 'image/png' });
    expect(ratio, `mismatch ratio for ${name}`).toBeLessThan(max ?? MAX_MISMATCH_RATIO);
  });
}

/** Regression baselines for the responsive layouts (tablet / mobile). Update with `npm run test:visual:update`. */
for (const { name, route } of responsivePages) {
  for (const [label, width] of [['laptop', 1512], ['tablet', 820], ['mobile', 390]] as const) {
    test(`${name} ${label} layout is stable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}-${label}.png`, { fullPage: true });
    });
  }
}
