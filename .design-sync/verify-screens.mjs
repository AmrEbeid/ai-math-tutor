#!/usr/bin/env node
// Repeatable multi-axis verifier for the worked example screens.
//
// Serves the built ds-bundle/, then for each screen renders it in several modes
// and reports a pass/fail matrix:
//   • light   — mounts without pageerrors
//   • dark    — same, with data-theme="dark"
//   • mobile  — no horizontal overflow at 390px
// Screens are the .design-sync/examples/*.html files; each is copied into the
// bundle (its asset paths are bundle-relative) before loading.
//
// Usage (from repo root, after building the bundle — see NOTES.md):
//   node .design-sync/verify-screens.mjs                 # all example screens
//   node .design-sync/verify-screens.mjs auth pricing    # a subset
//
// Requires the design-sync dev deps (playwright) under .ds-sync/node_modules,
// which the sync driver installs. Exits non-zero if any check fails.

import http from 'node:http';
import { readFile, readdir, copyFile } from 'node:fs/promises';
import { extname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const BUNDLE = join(ROOT, 'ds-bundle');
const EXAMPLES = join(ROOT, '.design-sync', 'examples');
const PW = join(ROOT, '.ds-sync', 'node_modules', 'playwright', 'index.mjs');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

const want = process.argv.slice(2);
const screens = (await readdir(EXAMPLES))
  .filter((f) => f.endsWith('.html'))
  .map((f) => basename(f, '.html'))
  .filter((s) => want.length === 0 || want.includes(s));

if (!screens.length) {
  console.error('No matching example screens. Available:', (await readdir(EXAMPLES)).filter((f) => f.endsWith('.html')).join(', '));
  process.exit(2);
}

// stage each screen into the bundle (examples carry a bundle-relative asset path)
for (const s of screens) await copyFile(join(EXAMPLES, `${s}.html`), join(BUNDLE, `${s}.html`));

const { chromium } = await import(PW);
const srv = http.createServer((req, res) => {
  (async () => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      const buf = await readFile(join(BUNDLE, p));
      res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      if (!res.headersSent) res.writeHead(404);
      res.end('nf');
    }
  })();
});
await new Promise((r) => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch();

async function check(screen, { dark, width }) {
  const pg = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.goto(`${base}/${screen}.html`, { waitUntil: 'networkidle' });
  // set the theme after load — the html[data-theme="dark"] CSS re-applies reactively
  if (dark) await pg.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await pg.waitForTimeout(300);
  const mounted = (await pg.locator('#root').innerHTML().catch(() => '')).length > 50;
  const { sw, cw } = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  await pg.close();
  return { ok: mounted && errs.length === 0 && sw <= cw + 2, errs, overflow: sw > cw + 2 ? `${sw}>${cw}` : null };
}

let failed = 0;
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log(pad('screen', 22) + 'light   dark    mobile');
for (const s of screens) {
  const light = await check(s, { dark: false, width: 780 });
  const dark = await check(s, { dark: true, width: 780 });
  const mobile = await check(s, { dark: false, width: 390 });
  const cell = (r) => (r.ok ? '  ✓   ' : '  ✗   ');
  console.log(pad(s, 22) + cell(light) + cell(dark) + cell(mobile) +
    [light, dark, mobile].flatMap((r) => [...(r.errs || []), r.overflow && `overflow ${r.overflow}`]).filter(Boolean).slice(0, 1).map((x) => '  ' + x).join(''));
  for (const r of [light, dark, mobile]) if (!r.ok) failed++;
}
await browser.close();
srv.close();
console.log(failed ? `\n${failed} check(s) failed.` : '\nAll screens pass (light · dark · mobile).');
process.exit(failed ? 1 : 0);
