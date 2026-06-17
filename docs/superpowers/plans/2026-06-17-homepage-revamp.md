# Zeluu Homepage Revamp — Implementation Plan

> **For agentic workers:** single-file static-page redesign (`public/index.html`). No unit tests —
> verification is visual (headless-Chrome screenshots, desktop + mobile, light + dark) + WCAG AA
> contrast + the existing `tests/frontend-copy.test.mjs` staying green. Ships as one reviewed PR.

**Goal:** Rebuild the homepage as a premium, trust-forward landing page that leads with the
research-validated trust story, adopts the new deep-teal Spark brand, and is dark-theme + mobile-first
+ RTL-ready — all in static HTML/CSS/JS.

**Architecture:** One self-contained `index.html` (inline `<style>` + small vanilla JS), linking the
shared `zeluu-tokens.css`. Replace the page's local orange `:root` accent with the shared `--brand-*`
teal tokens; replace the 💡 emoji with an inline Spark SVG. Keep the existing functional JS (PWA install,
scroll-reveal) and the dark-theme default.

**Tech Stack:** HTML5, CSS (OKLCH custom props, CSS Grid/Flex, logical properties for RTL), vanilla JS,
Fraunces + Plus Jakarta Sans, KaTeX-free.

## Global Constraints (verbatim)
- **No React/Vite/build step** — static HTML/CSS/JS only (hard gate).
- **No auth/payment/schema/migration/deploy** changes. CTAs keep current targets (`/pricing.html`, `/login.html`).
- Keep `<html lang="en" data-theme="dark">` default; both light + dark must look right.
- Use `--brand-primary` (teal) as primary, `--brand-accent` (amber) sparingly; **WCAG AA** on every text/surface pair.
- RTL-ready: use logical properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align:start`)
  so a future `dir="rtl"` mirrors cleanly. (Full Arabic copy is a later i18n task — not this PR.)
- Keep the favicon/manifest/icon links and the Google-Fonts + `zeluu-tokens.css` links.

---

## File structure
- **Modify:** `public/index.html` (full redesign — head stays, body + inline CSS rebuilt).
- **Modify:** `public/sw.js` — bump `CACHE_NAME` `v10 → v11` (HTML is network-first, but bump so the
  token/asset graph refreshes cleanly).
- No other files. (Brand tokens/logo already on `main`.)

## New page structure (top-to-bottom) — trust-led

1. **Nav** — inline Spark SVG (teal) + "Zeluu" (Fraunces 700). Right: "Sign in" (text) + "Start free"
   (primary teal button). Sticky, glass surface.
2. **Hero** — headline leads with the promise: **"Your child learns *how* to get the answer — not just the answer."** Subhead: bilingual Math/Science/English tutor that *guides* step by step, with full parent
   oversight. CTAs: **Start free** (primary) + **See how it teaches** (ghost, scrolls to §4). Trust chips:
   `✦ Guides, never gives answers` · `🛡 Parent-controlled & private` · `🌍 English + Arabic`.
   Visual: restyled guided-chat mockup showing a **hint, not an answer** (tutor asks a question back).
3. **Trust pillars** (NEW, placed high — the research-validated core): section title
   *"Built around what parents actually worry about."* Three cards:
   - **Guides, never gives answers** — Socratic step-by-step; no answer-dumping (links to §4).
   - **You see everything** — full chat transcripts + instant alerts (distress / personal-info / stuck).
   - **Safe by design** — content filtering, prompt-injection blocking, no ads, no data selling.
4. **How it teaches** (NEW demo) — a 3-step worked mini-example rendered as a styled "chat": child asks →
   tutor gives a *hint + a check-for-understanding* → child tries → tutor confirms. Makes "guides not
   gives" concrete. Caption: *"This is a real teaching pattern, not a screenshot of an answer."*
5. **Parent control / transparency** — what the parent dashboard shows: every conversation, usage limits,
   weekly summaries, safety alerts. Reassurance copy.
6. **Features grid** (kept, restyled, secondary) — Subjects (Math/Science/English), Photo problems,
   Bilingual + RTL, Weekly reports, Curriculum-aligned, Works offline (PWA).
7. **How it works** (4 steps) — Create account → Add your child → Child learns (guided) → You track progress.
8. **Proof band** — reframe the stats as trust proof: *13 curricula · 9 grade levels · 2 languages ·
   every answer earned, not given*. Calm, premium.
9. **Pricing teaser** → `/pricing.html` ("Simple family plans · free to start").
10. **Final CTA** — "Help your child build real understanding." → Start free.
11. **Footer** — Spark mark + links (Safety & Privacy, Privacy, Terms, GDPR, Refund). Keep all.

## Visual / brand spec
- **Primary** `--brand-primary` (teal) for logo, primary buttons, links, key accents; **`--brand-accent`**
  (amber) only for small highlights (e.g. the trust chip ✦, a single underline). Surfaces stay cream
  (light) / warm-charcoal (dark) from existing tokens.
- **Type:** Fraunces 600–800 for H1/H2 + wordmark; Plus Jakarta 400–600 for body/UI. Generous whitespace,
  larger line-height, restrained color — "premium" = restraint + space, not more decoration.
- **Spark logo:** inline SVG (the `mark-spark` path) using `fill: var(--brand-primary)`; nav + footer.
- **Motion:** keep the existing scroll-reveal; subtle, `prefers-reduced-motion` respected.

## Build steps
- [ ] **1.** In a worktree off `main`, rewrite `public/index.html`: keep `<head>` (fonts, favicon,
  manifest, tokens link); replace the local orange `:root` accent vars with usage of `--brand-*`; rebuild
  the body to the 11-section structure above; inline the Spark SVG for nav + footer; keep the PWA-install
  + scroll-reveal `<script>`.
- [ ] **2.** Use logical properties throughout new CSS (RTL-ready). Mobile-first media queries.
- [ ] **3.** Bump `public/sw.js` `CACHE_NAME` `v10 → v11`.
- [ ] **4.** Render screenshots (headless Chrome) at 1280px + 390px, in dark (default) **and** light
  (`data-theme` removed); eyeball layout + brand.
- [ ] **5.** WCAG AA audit: teal/amber/ink on cream + on dark — every text pair ≥ 4.5:1 (≥3:1 large/UI).
  Adjust token usage (not the tokens) where a pair fails.
- [ ] **6.** Run `npm test` — `tests/frontend-copy.test.mjs` and the suite must stay green (update copy
  assertions only if they assert exact old headlines that we intentionally changed; prefer keeping
  assertions valid).
- [ ] **7.** Update `docs/PROJECT_TRACKER.md` + `docs/SESSION_BRIEF.md`; commit; open PR with the Vercel
  preview link and the screenshots noted.

## Verification (acceptance)
- Homepage renders correctly desktop + mobile, light + dark; no orange primary remains (teal brand throughout).
- "Guides, not answers" + transparency + safety are the **first** things a visitor reads (above features).
- The Spark logo replaces 💡 in nav + footer; favicon already teal.
- All CTAs still point at `/pricing.html` / `/login.html`; no auth/payment change.
- `npm test` green; AA contrast holds; `prefers-reduced-motion` respected; RTL-ready (logical properties).

## Out of scope
- Full Arabic translation / `dir="rtl"` content (later i18n slice).
- Login/signup pages (sub-project 3).
- Any auth/payment/dashboard logic.
