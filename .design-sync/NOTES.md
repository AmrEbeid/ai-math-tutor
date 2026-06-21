# design-sync notes — ai-math-tutor

## Shape: package (full-product component library) — off-script origin

`ai-math-tutor` is a **static multi-page HTML/CSS/JS product**, not a shipped
component-library repo. There is no production `dist/`, Storybook, or React.

To sync a *real component library* (not just tokens), this run authored an
**isolated design-sync source package under `ds-src/`** — it is a design-sync
artifact ONLY, never a production migration. The production app (public/*.html,
api/, package.json) is untouched. `ds-src/` contains thin, typed React wrappers
that emit the product's **real CSS class names**; the styling is the product's
**real CSS, extracted verbatim** from the page `<style>` blocks.

### Pipeline (what re-sync re-runs)
- `ds-src/styles/components.css` — component CSS lifted verbatim from the product
  pages (marketing/base ← `public/index.html`; pricing ← `public/pricing.html`;
  app/dashboard ← `public/app.html` + `public/dashboard.html`).
- `ds-src/styles/build-css.mjs` — assembles the self-contained `cssEntry`
  (`ds-src/styles/ds-bundle.css`): Google-Fonts `@import` → real tokens from
  `public/css/zeluu-tokens.css` (source of truth) → component CSS. Tokens are
  inlined here (not via `tokensPkg`) because they live in `public/css/`, not in
  node_modules.
- `ds-src/src/*.tsx` + `index.ts` — 18 typed components; `tsc` emits
  `dist/*.js` + `dist/*.d.ts` (the API contract the design agent codes against).
- `buildCmd`: `cd ds-src && npx tsc -p tsconfig.json && node styles/build-css.mjs`.
- Converter: `node .ds-sync/package-build.mjs --config .design-sync/config.json
  --node-modules ds-src/node_modules --entry ./ds-src/dist/index.js --out ./ds-bundle`,
  then `package-validate.mjs ./ds-bundle`.

### Components (18)
Button, NavBar, LiveBadge, Card, Feature, Step, Stat, StatCard, PlanCard,
FormField, Modal, Spinner, CreditBadge, InfoCell, SubjectTab, TopicTag,
ChatBubble, Container.

### Key facts / gotchas (folded from authoring)
- **Fonts load remotely** (`[FONT_REMOTE]`, non-blocking): Fraunces + Plus Jakarta
  Sans come from a Google-Fonts `@import` at the top of `ds-bundle.css`. They are
  NOT shipped as `@font-face`; they load at runtime. Designs render in the real
  type as long as the host has network access.
- **`.btn` divergence**: marketing (index) and app (dashboard) each ship their own
  `.btn`. The **marketing** definition is canonical (`Button`); the app's compact
  button is exposed as `size="sm"`. Recorded so re-syncs don't "fix" it.
- **Stat** (`.stat-num`/`.stat-text`) is designed to sit on the marketing accent
  band and inherits its color (white). Its preview wraps it in a terracotta
  gradient band so the number is legible — that is faithful to product usage.
- **Modal** renders a `position: fixed` `.modal-overlay`. Its preview wraps the
  dialog in a `transform: translateZ(0)` frame so the fixed overlay resolves to
  the card (not the page viewport) and the full dialog + title render. Config:
  `overrides.Modal = {cardMode: single, viewport: 640x520}`.
- **Grid presentation overrides** (`[GRID_OVERFLOW]`, presentation-only):
  `overrides.{Button,InfoCell,SubjectTab} = {cardMode: column}` so wide stories
  get full card width.
- **TopicTag** base CSS in the product has no background (colored per-subject in
  page context); the DS gives it a sensible default `accent-light` bg so the
  standalone component is visible.
- `typescript` is installed in `.ds-sync/` so `package-validate` runs the `.d.ts`
  parse check.

## Known render warns (triaged legitimate — re-syncs should expect these)
- `[FONT_REMOTE]` for "Fraunces" / "Plus Jakarta Sans" — by design (remote fonts).

## Re-sync procedure
1. `cd ds-src && npx tsc -p tsconfig.json && node styles/build-css.mjs` (or just
   trust `buildCmd`).
2. Re-copy staged scripts: `cp -r "<skill-base>"/{package-build,package-validate,package-capture,resync}.mjs "<skill-base>"/lib "<skill-base>"/storybook .ds-sync/`.
3. On a fresh clone: re-install `.ds-sync` deps (`esbuild ts-morph @types/react
   typescript playwright` + `npx playwright install chromium`) and `ds-src` deps.
4. Fetch the project anchor → `.design-sync/.cache/remote-sync.json`, then
   `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules
   ds-src/node_modules --entry ./ds-src/dist/index.js --out ./ds-bundle --remote
   .design-sync/.cache/remote-sync.json`.

### Gotchas (cost real debugging — read before a re-sync)
- **The driver does NOT run `build-css.mjs`.** `resync.mjs` rebuilds the JS bundle
  but uses the pre-built `ds-src/styles/ds-bundle.css` (cssEntry). If you change
  `components.css` or `build-css.mjs` (e.g. add a component's CSS, change the
  brand), run `cd ds-src && node styles/build-css.mjs` FIRST, then the driver —
  otherwise the new/changed CSS never reaches the bundle and renders unstyled.
- **Duplicate group dir (`general 2`).** Repeated incremental rebuilds into
  `ds-bundle/` can leave a duplicate group directory that splits the components
  (e.g. 12 in `general`, 7 in `general 2`) even though every `@dsCard` says
  `group="general"`. Fix with a CLEAN rebuild: `rm -rf ds-bundle` then
  `package-build.mjs` (not the incremental driver) → single `general` group.
  Always `list_files` the project after upload to confirm one group, no orphans.

## Brand (teal rollout)
- The product is mid-rebrand **terracotta → teal**. `build-css.mjs` applies the
  product's brand rollout (route `--color-accent`/`-dark`/`-light` →
  `--brand-primary`/`-strong`/`-tint`, light+dark), so the synced library renders
  **teal** to match the app. The teal VALUES live in `zeluu-tokens.css` (auto-pulled);
  only the mapping is hardcoded.
- **Rollout is incomplete**: 12/13 product pages route to teal, but **`index.html`
  (landing) is still terracotta** (no rollout block). When index is migrated and the
  brand is consistent, nothing here needs changing (the mapping already points at
  `--brand-primary`). If the brand DIRECTION reverses, revert the `ROLLOUT` block in
  `build-css.mjs` and re-sync.

## Re-sync risks (what can silently go stale)
- **Source of truth is the product CSS/tokens.** If `public/css/zeluu-tokens.css`
  or the page `<style>` blocks change, `ds-src/styles/components.css` is a
  *manual* extraction and will NOT auto-update — re-extract when the product UI
  changes. `build-css.mjs` DOES re-pull tokens automatically.
- **Remote fonts**: a network-blocked render falls back to system fonts.
- **Preview content** (child names Layla/Omar, plan prices, dates) is illustrative,
  not pulled from the app — safe but not authoritative.
- This is a **superset** of the earlier tokens-only sync into the same project
  (`bdb471bb-…`); the full-product upload replaces it and removes the orphaned
  tokens-only `tokens/zeluu-tokens.css` (tokens now ship inlined in `_ds_bundle.css`).

## Local artifacts
- **Commit** (durable, design-sync inputs): `.design-sync/{config.json, NOTES.md,
  conventions.md, previews/}` and the `ds-src/` source (`src/`, `styles/components.css`,
  `styles/build-css.mjs`, `package.json`, `tsconfig.json`).
- **Gitignore** (generated/installed): `ds-bundle/`, `.ds-sync/`,
  `.design-sync/.cache/`, `.design-sync/learnings/`, `.design-sync/node_modules`,
  `ds-src/node_modules/`, `ds-src/dist/`, `ds-src/styles/ds-bundle.css` (generated).

## Verifying the worked screens

Run `node .design-sync/verify-screens.mjs` (after building ds-bundle/) to re-check
every `.design-sync/examples/*.html` renders without errors in **light + dark** and
has **no horizontal overflow at 390px**. Pass a screen name to scope it. Exits
non-zero on any failure — handy after a brand/CSS change or a re-sync.
