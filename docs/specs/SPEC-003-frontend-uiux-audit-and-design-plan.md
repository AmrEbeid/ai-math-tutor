# SPEC-003 — Frontend UI/UX Audit & Design Improvement Plan (Read-Only)

> Read-only UI/UX audit of the static frontend (`public/*`) plus a prioritized design
> improvement plan, viewed through a frontend-design lens. **No code was written, no
> `public/*`/CSS files were edited, no dependencies installed, no React/Vite started.**
> This is a planning/decision document only.

## 1. Purpose & Scope

* **Goal:** Assess the current frontend's design quality and consistency, then propose a
  prioritized, gate-aware improvement plan.
* **In scope (read-only):** `public/*.html`, `public/css/styles.css`, font/asset usage,
  design tokens, accessibility/responsive signals.
* **Out of scope (hard gates — NOT done here):** any edit to `public/*`, CSS, or JS;
  dependency installs; React/Vite/Tailwind/shadcn migration; KaTeX/streaming/moderation
  (already tracked in `SPEC-STAGE2-deferred-work-closure-plan.md`); backend/API changes.
* **Risk class:** Low for this audit (docs only). Implementation later is **Medium**
  (frontend edits) per `CLAUDE.md`; React/Vite remains a **hard gate**.

## 2. Method & Evidence

Read `public/css/styles.css` in full; read the head/`<style>`/structure of `index.html`
and `app.html`; static analysis across all 12 HTML pages for fonts, gradients, inline
styles, tokens, ARIA, focus, reduced-motion, `lang`/`dir`, and alt text. Counts cited
below are from that static pass (2026-06-10).

## 3. Current State — What Exists

* **12 HTML pages**, each with a single inline `<style>` block, plus a shared
  `public/css/styles.css` and `public/js/supabase-config.js`. PWA manifest + service
  worker present.
* **Two distinct design languages are live at the same time:**
  * **System A — "Warm Editorial" (current/intended):** OKLCH palette on a warm cream
    background, **terracotta/amber accent** (`oklch(55% 0.15 50)`), **Fraunces** display +
    **Plus Jakarta Sans** body. Used by the primary surfaces: `index`, `pricing`, `login`,
    `child-login`, `app` (child chat), `dashboard`, `exam-prep`.
  * **System B — "Indigo/Purple" (legacy):** `styles.css` with `--primary:#4F46E5`,
    hard-coded purple gradients (`#6366F1→#8B5CF6→#EC4899`), and system fonts
    (`-apple-system…`). Still the **only** stylesheet for 5 pages: `gdpr`, `refund`,
    `terms`, `privacy`, `verify-email`.

## 4. Findings (severity-ranked)

### F1 — Two design systems coexist; legacy purple-gradient remnant (HIGH)
The marketing/app surfaces moved to the warm editorial system, but the legal/utility
pages still render in the old indigo + purple-gradient look with system fonts. A user
flows from a refined cream/terracotta landing into a generic purple legal page — a
visible brand break, and the purple-gradient palette is exactly the "generic AI"
aesthetic the product otherwise avoids.

### F2 — Design tokens are duplicated inline, no single source of truth (HIGH, maintainability)
The OKLCH token block (`--color-*`, `--font-*`, legacy aliases) is **copy-pasted into
~7 pages**. They already drift (e.g., `app.html` adds `--color-error/--color-warning/
--color-surface`; legacy `--gray-*`/`--primary` aliases differ per page). Any palette or
type change must be edited in 7+ places → high regression risk.

### F3 — `dashboard.html` is styled with 171 inline `style=` attributes (MEDIUM, maintainability)
The most complex page (1,646 lines, parent dashboard) leans on 171 inline styles. This
makes spacing/typography inconsistent and changes hard to reason about — a strong signal
the page is doing too much without a component/utility layer.

### F4 — Accessibility gaps outside the child chat (HIGH for an education product)
* **`prefers-reduced-motion`: absent everywhere**, yet there are continuous animations
  (mascot blink/pulse, fade-ins). Vestibular-sensitivity risk.
* **ARIA/landmarks**: `app.html` has ~6 (Stage 2 a11y work), but `index`, `dashboard`,
  `login`, `pricing` have **0** roles/landmarks/live regions.
* **Focus visibility**: only ad-hoc `:focus`; no consistent `:focus-visible` ring strategy.
* **Images**: 2 `<img>` but only 1 `alt`.
This matters extra for a product used by children and reviewed by safety-minded parents.

### F5 — No RTL / Arabic support (MEDIUM; aligns with a known deferred item)
All pages are `<html lang="en">` with no `dir`/RTL handling, while Arabic/RTL QA is an
acknowledged deferred Stage 2 item. Layouts use physical properties (`left/right`,
`margin-left`) that will not mirror cleanly.

### F6 — Font loading is inconsistent (LOW, perf/visual)
`index.html` loads Fraunces with full weights + italic; `app.html` loads only
`Fraunces:opsz@9..144` (no explicit weights → display headings may fall back to a
non-800 weight). Per-page `<link>`s also can't be cached as one shared font request.

### F7 — No responsive navigation pattern (LOW/MEDIUM)
No hamburger/collapse on `index`/`dashboard`; the shared CSS only stacks grids at
≤768px. Nav links likely crowd or overflow on small screens.

## 5. Design Direction Assessment (frontend-design lens)

The **Warm Editorial** system (System A) is a genuinely good, differentiated direction:
Fraunces is a characterful display serif (not Inter/Roboto), OKLCH gives perceptually
even color, and the terracotta-on-cream palette reads warm and trustworthy — well suited
to a children's learning brand and the opposite of purple-gradient AI slop. **The
strategic move is not to redesign — it's to finish migrating to System A and make it a
real, shared system.** Keep the aesthetic; fix the fragmentation, debt, and a11y.

Opportunities to deepen the identity (later, optional): lean harder on the Zeluu mascot
as a friendly guide in empty/loading states; add warm depth (subtle grain/paper texture,
soft layered shadows) instead of flat fills; one well-orchestrated staggered load on the
landing rather than scattered micro-animations.

## 6. Improvement Plan (prioritized, gate-aware slices)

Each slice is **docs-or-static-frontend only**; none requires React/Vite or installs.
Suggested order:

| # | Slice | Addresses | Risk | Effort |
| --- | --- | --- | --- | --- |
| **UI-1** | **DONE locally (2026-06-10).** Created `public/css/zeluu-tokens.css` — shared OKLCH/warm tokens (union of all 7 pages' inline tokens, incl. child variants + legacy aliases), spacing/radius/shadow/motion/z-index scales, minimal reset, `:focus-visible` accent-ring baseline, `prefers-reduced-motion` guard. Linked on the 7 warm pages **before** their inline `<style>` so page styles still win → appearance preserved. Inline token blocks intentionally **not yet removed** (that's UI-2+); `styles.css` not retired; legal pages untouched. `npm test` 36/36. | F2 (foundation; F4 partially — focus + reduced-motion now global on the 7 pages) | Medium | M |
| **UI-2** | **DONE locally (2026-06-11, UI-MASTER-STATIC-1).** Migrated all 5 legacy pages (`gdpr`/`privacy`/`refund`/`terms`/`verify-email`) off purple `styles.css` onto System A: warm nav (Fraunces brand + Beta chip), cream editorial `policy-header` (gradient removed), tokenized document styles, warm footer, skip-link + `header`/`main`/`footer` landmarks. Legal copy preserved verbatim. **`styles.css` has 0 HTML references left but stays on disk** — `public/sw.js` still precaches `/css/styles.css` and `sw.js` was out of scope; retiring the file requires a tiny follow-up slice that edits the sw precache list (and bumps its cache version). | F1 | Medium | M |
| **UI-3** | **DONE locally (2026-06-11, UI-MASTER-STATIC-1).** All 12 pages now have a `<main>` landmark; skip-link added to the long pages (`index`/`pricing`/`dashboard` + the 5 legal pages from UI-2) with the `.skip-link` style moved into `zeluu-tokens.css`; nav `aria-label`s; `role="alert"` on form-error/limit/banner elements; `role="dialog" aria-modal` + labelled close buttons on static modals (dashboard ×3, app credits, index install popup); keyboard + `aria-expanded` support for the pricing FAQ toggles, login tabs, and dashboard credit-history disclosure; alt text on the app image preview; decorative emoji `aria-hidden`. `prefers-reduced-motion` + `:focus-visible` are global via UI-1 tokens (now linked on all 12 pages). Remaining (noted, not done): ARIA inside JS-generated dashboard modals; pricing billing toggle `aria-pressed`. | F4 | Medium | M |
| **UI-4** | **DONE locally (2026-06-11, UI-MASTER-STATIC-1; partial by design).** Static-HTML inline styles reduced 65→25 (file total 167→127) by extracting repeated patterns into page classes (`.info-cell`/`-label`/`-value`, `.card-header`, `.m-0`, `.empty-note`, `.modal-close`, `.btn-sm`, `.btn-block-lg`, `.btn-row-item`, `.stack-12`). **Intentionally remaining:** ~102 inline styles inside JS template strings (modals/lists built in script — editing scripts was out of scope for this slice) and ~25 one-off static styles (usage bar, billing-toggle buttons whose `className` is rewritten by `setBilling()`, nav paddings). Appearance preserved — classes carry identical declarations. | F3 | Medium | L |
| **UI-5** | **Consolidate font loading** into one shared `<link>` with the correct Fraunces weights; verify display weight 800 renders. | F6 | Low | S |
| **UI-6** | **Responsive nav** pattern (accessible disclosure menu) for `index`/`dashboard`. | F7 | Low/Medium | S |
| **UI-7** | **RTL/Arabic readiness** (logical CSS properties + `dir` switch) — coordinate with the deferred Stage 2 RTL item, don't duplicate it. | F5 | Medium | M |

**Deliberately deferred / already tracked elsewhere (do not duplicate here):** KaTeX math
rendering, response streaming, per-turn moderation, httpOnly token storage, and the
React/Vite decision — see `SPEC-STAGE2-deferred-work-closure-plan.md` and
`SPEC-child-token-storage-httpOnly-migration-plan.md`.

## 7. Constraints, Gates & Risks

* **No React/Vite assumed.** All slices fit the current static-HTML stack. A framework
  migration remains a separate hard gate (`CLAUDE.md`, `SPEC-001`).
* **Frontend edits are Medium risk** → each slice should be its own small PR with manual
  verification; do not mix UI slices with backend/payment/security work.
* **Child-safety invariants hold:** no payment surface in the child app, no logging of
  child messages, no new analytics/session-replay for children, no new AI providers.
* **Regression risk** is concentrated in UI-1/UI-2 (they touch every page) — land behind
  visual review; the existing `tests/frontend-copy.test.mjs` should be extended, not
  broken.

## 8. Status & Next Action

* **Status:** Audit accepted; **UI-1 implemented locally (2026-06-10)** — shared token
  stylesheet `public/css/zeluu-tokens.css` created and linked on the 7 warm pages.
  UI-2…UI-7 not started.
* **Risk level:** Low for the audit; UI-1 was a Medium-risk frontend slice (link-only page
  edits; `npm test` 36/36; no backend/legal-page/`styles.css` changes).
* **Next action:** **UI-2** — migrate the 5 legal/utility pages off the legacy purple
  `styles.css` onto the shared system (separate approved slice). React/Vite, installs,
  and deploy remain hard gates.
