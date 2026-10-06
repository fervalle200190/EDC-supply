# EDC Supply

Landing site for EDC Supply. Built with **Astro 5**, **React 19** and **Tailwind CSS 4**, laid out pixel-for-pixel from the Figma design.

Pages in this release: **Home** (`/`) and **About Us** (`/about`).

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm test             # unit tests (Vitest + Testing Library)
npm run build        # static site in dist/
```

Visual regression (`npm run test:visual`) compares each page with the Figma frame screenshots in `tests/visual/references/`
and keeps responsive baselines in `tests/visual/__snapshots__/` (generated on macOS).

## Deploy

Pushing to `main` builds and publishes to GitHub Pages (`.github/workflows/deploy.yml`).
The workflow sets `BASE_PATH=/EDC-supply`; internal links and assets go through `src/lib/url.ts`, so the same code
also works at the root of a domain.

## Notes

- Desktop is drawn on a 1623px frame; on narrower laptops the whole stage is scaled (see `BaseLayout.astro`).
- Links to Products and Contact are present in the navigation but those pages are not part of this release.
