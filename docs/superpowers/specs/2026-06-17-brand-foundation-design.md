# Zeluu Brand Foundation — Design Spec

> **Sub-project 1 of 3** in the Zeluu revamp (Brand → Homepage → Login/Signup).
> **Direction (owner-chosen):** premium / trust-forward · hand-authored SVG assets.
> **Status:** APPROVED 2026-06-17 — **logo A (Spark ✦)**, **deep-teal primary confirmed** (amber kept
> as accent). Built in branch `design/brand-foundation`.
> **Risk:** Low — frontend assets + CSS tokens only. No auth/payment/schema/migration/deploy.
> **Grounds in:** the market research (trust = the conversion lever; calm/proof-forward beats
> playful for parent buy-in), the existing `public/css/zeluu-tokens.css` (warm-OKLCH + dark theme),
> and the current emoji-based identity (💡 + Fraunces wordmark) this replaces.

---

## 1. Goal & rationale

Move Zeluu's identity from "warm playful, orange-forward, 💡 emoji" to **premium and trust-forward**:
calmer color, more whitespace, a real ownable mark, and type that reads credible to parents — while
staying warm enough for a children's product and preserving the dark theme + bilingual/RTL goal.

Research backing: parents convert on **trust** (data privacy, no misinformation, "guides not gives
answers" + transparency), not on playfulness. The brand should *look* like something a parent trusts
with their child.

## 2. Logo system

Three candidates were authored as SVG and previewed on light + dark at lockup, app-icon, and 16px sizes
(`design-scratch/brand/preview.html`, `mark-*.svg`):

- **A — Spark** (recommended): a single 4-point spark = the moment of understanding. Premium, abstract,
  best small-size legibility.
- **B — Steps**: three ascending bars = step-by-step method / implied "Z".
- **C — Dialogue** (recommended alternate): a speech bubble holding a spark = guided conversation that
  sparks insight — the most literal match to the trust story.

**Decision needed:** owner picks A, B, or C. The rest of this spec is mark-agnostic; only the chosen
`mark-*.svg` becomes `logo` going forward.

**Lockup:** chosen mark (in `--brand-primary`) + "Zeluu" in **Fraunces 600**, mark height ≈ cap height,
gap ≈ 0.35× mark height. **Mark-only** variant for favicon / app icon / PWA.

**Usage rules:** mark uses `currentColor` (so it inherits teal/amber/ink/white by context); never place
the amber mark on amber, or teal on teal; minimum mark size 16px; clear space = 0.5× mark height.

## 3. Color — refined palette (premium trust-forward)

A deep-teal **trust anchor** with the existing **amber kept as a warm accent**, on warm-neutral surfaces.
Extends (does not replace) `zeluu-tokens.css`; existing semantic token names stay so pages don't break.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-primary` (teal) | `#1E6E78` | `#4FB3C0` | primary brand, links, key CTAs |
| `--brand-primary-strong` | `#13525A` | `#6FC7D2` | hover/active, headings on tint |
| `--brand-accent` (amber) | `#E08A3C` | `#F0A35C` | warmth, highlights, secondary CTA — used sparingly |
| `--brand-safe` (green) | `#3B9B6E` | `#5CC494` | safety/"verified" affordances |
| `--ink` | `#16222B` | `#EAEAE4` | primary text |
| `--muted` | `#5C6B72` | `#9BA6AB` | secondary text |
| `--surface` | `#FBFAF7` | `#14181A` | page background |
| `--surface-card` | `#FFFFFF` | `#1E2426` | cards |
| `--border` | `#E8E3DA` | `#2C3438` | hairlines |

- **Contrast:** every text/surface pair must clear **WCAG AA** (re-audit on build, same method as the
  prior dark-theme work). Teal `#1E6E78` on cream ≈ AA for large/UI; body text uses `--ink`.
- **PWA `theme_color`** changes from the legacy indigo `#4F46E5` → `--brand-primary` teal; `background_color`
  → cream surface.

## 4. Typography

Keep the pairing (it already reads premium) but formalize the scale:
- **Display:** Fraunces (serif) — 600/700, optical sizing on; headlines, wordmark, section titles.
- **Body/UI:** Plus Jakarta Sans — 400/500/600/700.
- **Arabic (RTL goal):** pick an Arabic companion at build (research pointed to modern Arabic UI faces);
  set `dir="rtl"` + mirrored layout for the Arabic locale. Latin/Arabic share weights/scale.

## 5. Deliverables (build phase, after approval)

1. **`public/logo.svg`** (chosen mark + wordmark lockup) + **`public/logo-mark.svg`** (mark only).
2. **Favicon + PWA icon set** regenerated from the mark on a teal tile: replace `public/icons/icon-*.png`
   (72→512 + maskable), `favicon`, apple-touch-icon. (PNG export from the SVG at build.)
3. **`public/css/zeluu-tokens.css`** — add the `--brand-*` tokens + map existing accent tokens to them;
   keep all current token names working.
4. **`public/manifest.json`** — `theme_color`/`background_color` to the new brand; name/short_name unchanged.
5. **Service worker** — bump `CACHE_NAME` (`v9`→`v10`) and precache the new logo asset.

> Homepage and login/signup *apply* this foundation — they are sub-projects 2 and 3 with their own specs.

## 6. Out of scope / gates

- **No homepage/login rebuild here** — this slice ships only the brand foundation (logo, tokens, icons).
- **No auth/payment/schema/migration/deploy.** Frontend assets + CSS only.
- The logo files under `design-scratch/` are exploration; only the approved mark is promoted to `public/`.

## 7. Decisions (resolved 2026-06-17)

1. **Logo:** ✅ **A — Spark ✦** (`design-scratch/brand/mark-spark.svg` → `public/logo-mark.svg`).
2. **Color:** ✅ **Deep teal primary** confirmed; amber kept as warm accent.
3. **Arabic type:** deferred to the homepage/login build (will pick a modern Arabic UI face then).

## 8. Build status

Shipped in this slice: `public/logo-mark.svg`, `public/favicon.svg`, regenerated `public/icons/*` (10 PNGs:
Spark on teal, 72–512 + maskable), additive `--brand-*` tokens in `zeluu-tokens.css` (light + dark), and
`sw.js` `v9→v10` precaching the new SVGs. Icon sources + the 3 candidates kept under `design-scratch/brand/`
for reproducibility. **No HTML pages recolored** (staged rollout); existing icon refs pick up the new PNGs
automatically. Verified: favicon legible at 16px, app icon renders correctly, `npm test` unaffected.
