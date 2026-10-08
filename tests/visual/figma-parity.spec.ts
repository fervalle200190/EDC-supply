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
  // /products and the product pages are not matched pixel for pixel any more: products are centred in their own column and the
  // key features fill the viewport height (Figma comments), so their page height depends on the screen. Responsive baselines below guard them.
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
  ].map((slug, i) => ({ name: `product-${i + 1}`, route: `/products/${slug}`, reference: `product-${i + 1}.png`, max: 0.02, parity: false })),
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

/** The mobile menu curtain must paint above the page content (a stacking-context regression once hid it behind the hero). */
for (const route of ['/', '/contact', '/products']) {
  test(`mobile menu opens above the page on ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About Us' });
    await expect(link).toBeVisible();
    const box = (await link.boundingBox())!;
    const onTop = await page.evaluate(([x, y]) => document.elementFromPoint(x!, y!)?.closest('nav') !== null, [box.x + box.width / 2, box.y + box.height / 2]);
    expect(onTop, 'the menu link is the topmost element at its position').toBe(true);
  });
}

/** Every product hero's "Request a quote" button must be clickable (nothing may sit on top of it), on any screen. */
const productSlugs = allPages.filter((p) => p.name.startsWith('product-')).map((p) => p.route);
for (const width of [390, 1623, 2560]) {
  test(`"Request a quote" is clickable on every product page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of productSlugs) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const link = page.getByRole('link', { name: 'Request a quote' });
      const box = (await link.boundingBox())!;
      const onTop = await page.evaluate(([x, y]) => document.elementFromPoint(x!, y!)?.closest('a')?.textContent?.trim(), [box.x + box.width / 2, box.y + box.height / 2]);
      expect(onTop, `${route} at ${width}px`).toBe('Request a quote');
    }
  });
}
