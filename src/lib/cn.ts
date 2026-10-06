/** Joins truthy class names. Tiny on purpose: no runtime dependency for a landing page. */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');
