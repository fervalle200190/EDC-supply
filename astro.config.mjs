import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static output: `dist/` can be uploaded to any host (no Node runtime required).
// GitHub Pages serves the site from /<repo>/, so CI sets BASE_PATH (see .github/workflows/deploy.yml).
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  output: 'static',
  base,
  site,
  // Hover/viewport prefetch + the client router make page changes instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
