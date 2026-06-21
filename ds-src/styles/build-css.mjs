// Assemble the design-system bundle stylesheet (cssEntry) from the real,
// shipped sources — single source of truth, regenerated on every build:
//   1. Google Fonts @import (must be first — CSS @import precedes all rules)
//   2. the real token layer  (../public/css/zeluu-tokens.css)  ← source of truth
//   3. the component rules    (./components.css, minus its own font @import)
// Run from ds-src (buildCmd does `cd ds-src`).
import { readFileSync, writeFileSync } from 'node:fs';

const FONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');\n";

const tokens = readFileSync('../public/css/zeluu-tokens.css', 'utf8');
const components = readFileSync('./styles/components.css', 'utf8')
  // drop the components file's own @import line — fonts are emitted first, above
  .replace(/@import url\([^)]*\);\n?/g, '');

const out =
  FONTS +
  '\n/* ===== Tokens (generated from public/css/zeluu-tokens.css) ===== */\n' +
  tokens +
  '\n/* ===== Components ===== */\n' +
  components;

writeFileSync('./styles/ds-bundle.css', out);
console.error(`ds-bundle.css written (${out.length} bytes)`);
