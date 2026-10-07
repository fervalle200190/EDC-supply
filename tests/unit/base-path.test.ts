import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/** GitHub Pages serves the site under /EDC-supply: a root-relative asset or link that skips the base 404s there. */
const BASE = '/sub-path';

const htmlFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []));

/** Vitest injects BASE_URL/MODE/NODE_ENV into the environment, which would override Astro's own values in the child build. */
const cleanEnv = () => {
  const env: NodeJS.ProcessEnv = { ...process.env, BASE_PATH: BASE };
  for (const key of Object.keys(env)) if (key.startsWith('VITEST') || ['BASE_URL', 'MODE', 'NODE_ENV', 'DEV', 'PROD', 'SSR'].includes(key)) delete env[key];
  return env;
};

describe('base path', () => {
  it('prefixes every internal src, href and url() in the built pages', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'edc-base-'));
    execFileSync('npx', ['astro', 'build', '--outDir', out], { env: cleanEnv(), stdio: 'pipe' });

    const offenders: string[] = [];
    for (const file of htmlFiles(out)) {
      const html = fs.readFileSync(file, 'utf8');
      for (const m of html.matchAll(/(?:src|href|srcset)="(\/[^"\s]*)|url\(['"]?(\/[^'")\s]*)/g)) {
        const target = m[1] ?? m[2]!;
        if (target.startsWith('//') || target === BASE || target.startsWith(`${BASE}/`)) continue;
        offenders.push(`${path.relative(out, file)} -> ${target}`);
      }
    }
    fs.rmSync(out, { recursive: true, force: true });
    expect(offenders).toEqual([]);
  }, 180_000);
});
