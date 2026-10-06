/**
 * Prefixes site-absolute paths ("/assets/x.png", "/about") with the deploy base (e.g. "/EDC-supply" on GitHub Pages).
 * Works in Astro templates and in React islands (Vite replaces `import.meta.env.BASE_URL` at build time).
 * External URLs, anchors ("#solutions"), mailto:/tel: and already-prefixed paths are returned untouched.
 */
const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');

export const url = (path: string): string => {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE && (path === BASE || path.startsWith(BASE + '/'))) return path;
  return BASE + path;
};

/** Current pathname without the deploy base, for active-link checks. */
export const stripBase = (pathname: string): string => {
  if (BASE && (pathname === BASE || pathname.startsWith(BASE + '/'))) return pathname.slice(BASE.length) || '/';
  return pathname;
};
