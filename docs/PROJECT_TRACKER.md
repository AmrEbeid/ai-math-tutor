# Zeluu Project Tracker

> Single source of truth for workstream status, active tasks, decisions, external
> gates, and remaining risks. Update this file as part of every meaningful task,
> and update `SESSION_BRIEF.md` last.

**Last Updated:** 2026-06-15 (RESEARCH-STRATEGY-1 — competitive/product research saved;
product repositioned math-only → all-subject learning companion (math-first); pricing/credits,
roadmap, and task-backlog specs created. Docs-only.) Prior: 2026-06-11 (DOCS-SYNC-2 — full
consistency pass after the production sprint: migration 002 + RLS + search_path + temp_transfer
drop applied; UI polish + review fixes deployed; env verified; schema history reconciled)

## Product Strategy & Roadmap (2026-06-15, RESEARCH-STRATEGY-1) — docs-only

> Concise pointer section (no research duplicated here — see the linked docs).

* **Research saved:** [`docs/research/RESEARCH-competitive-product-strategy-2026-06-15.md`](research/RESEARCH-competitive-product-strategy-2026-06-15.md)
  — two adversarially-verified deep-research passes (landscape/safety/UX/GCC + pricing/Arabic),
  with confirmed facts, citations, NCC flags, and refuted-claim warnings preserved.
* **Positioning change:** Zeluu reframed from a **math-only tutor** to a **child-safe bilingual
  AI learning companion for school subjects, math-first** →
  [`SPEC-PRODUCT-learning-companion-strategy`](specs/SPEC-PRODUCT-learning-companion-strategy.md).
* **Pricing/credits spec:** [`SPEC-PRICING-packages-credits-cost-model`](specs/SPEC-PRICING-packages-credits-cost-model.md)
  — Free Trial (7-day / 50-credit / 10-per-day / 15-min), Family, Family Premium, optional Student
  Plus + School Pilot (later); per-action credit metering; cost/MoR/margin model. Parent-facing copy =
  "fair daily learning usage"; credits are an internal lever.
* **Roadmap spec:** [`SPEC-ROADMAP-product-revamp-implementation`](specs/SPEC-ROADMAP-product-revamp-implementation.md)
  — Quick wins (1–2 wk) → MVP (2–6 wk) → Strategic (2–4 mo) → Differentiating (4–12 mo).
* **Task backlog:** [`TASKS-product-strategy-roadmap`](tasks/TASKS-product-strategy-roadmap.md)
  — 24 gate-aware tasks (T-01…T-24) with priority/complexity/code-required/legal/React-gate flags.
* **MVP foundation plan:** [`PLAN-MVP-foundation`](plans/PLAN-MVP-foundation.md) — execution-ready,
  file-exact, test-backed plan for the MVP sprint, **reconciled against the actual codebase**
  (key finding: age-banding, subjects, scaffolding L1–L4, and credit-limit RPCs already exist — MVP
  is mostly frontend polish + small backend extensions). Each task carries its gate; all code tasks
  are **BLOCKED pending owner approval**. Docs-only deliverable — no product code written.
* **Immediate next sprint:** (1) KaTeX/rich formatting, (2) streaming spike, (3) weekly parent digest,
  (4) free-trial time+credit enforcement **design**, (5) COPPA/VPC research + legal gate, (6) Safety &
  Privacy page, (7) age-banded tutor tone, (8) pricing/credits implementation **design**.
* **Open validation gaps:** competitor pricing needs periodic refresh; competitor Arabic *quality*
  (QANDA/Gauth/Photomath) needs hands-on testing; bilingual GCC positioning is a hypothesis until
  validated; school/teacher pricing deferred until classroom mode is scoped; AI cost assumptions to be
  reviewed against real usage logs post-launch.
* **Gates unchanged:** no product code, credit/payment/auth/RLS/migration/deploy/install/React-Vite
  changes without explicit owner approval (CLAUDE.md). This work is **docs-only**.

## Global Status Table

| ID     | Workstream                                          | Status                                                  | Current Spec                                | Current Task                      | Risk        | Last Updated | Notes                                                |
| ------ | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- | --------------------------------- | ----------- | ------------ | ---------------------------------------------------- |
| S0     | Stage 0 Emergency Backend/Security/Payment Fixes    | **Complete — committed (C4a–C4c) and DEPLOYED 2026-06-11**; DB-level idempotency added (migration 002) | TBD | — | High | 2026-06-11 | All Stage 0 `api/*` fixes live on zeluu.com. Webhook double-grant race closed at the DB level. |
| A0.5   | Trial Signup, Card-Based Onboarding & Activation UX | **Complete — committed (C5) and DEPLOYED 2026-06-11** / LS dashboard settings still owner-manual | `SPEC-A0.5-trial-signup-onboarding-flow.md` | Manual Lemon Squeezy verification (runbook tests 1–10) | Low/Medium | 2026-06-11 | Trial flow live and end-to-end testable at zeluu.com. |
| A0.6   | Public Repo Benchmark & Product Inspiration Sprint  | Complete (all 8 categories researched)                  | `SPEC-A0.6-public-repo-benchmark.md`        | Report complete; awaiting next gate | Low       | 2026-06-03   | Research only; docs/spec output. All 8 categories done incl. SaaS-billing + Supabase-security. No code copied. |
| A0.OS  | Install Project Operating Docs                      | Complete / accepted                                     | n/a (process task)                          | Operating docs installed          | Low         | 2026-06-03   | CLAUDE.md + docs tracker/session/specs created; docs-only; no source changes. |
| STAGE1 | Tests, Schema Documentation & Tooling Evaluation    | **Complete — local AND live gates closed (2026-06-11)** | `SPEC-STAGE1-LOCAL-ACCEPTANCE.md` | — | Medium | 2026-06-11   | Env validation (8 vars) wired + verified in prod (`ALLOWED_ORIGIN` found missing → fixed, CORS exact-origin); 53-test baseline (52 pass / 1 skip, 0 installs); migration 002 **APPLIED** (webhook unique index + `processed_webhooks` w/ RLS); `search_path` pinned on all DB functions (003); `temp_transfer` dropped (004); **schema reconciliation DONE** (`supabase/migrations/live/`, 22 files checksum-verified). Remaining from the old gate list: STAGE1-8 insert-first wiring (gated), RLS policy hardening (gated). No React/Vite. |
| STAGE2 | Child Chat UX Upgrade                               | Static UX improved locally (partial) / deeper items deferred | `SPEC-STAGE2-LOCAL-ACCEPTANCE.md` | External gate review; later slices (moderation, math, token storage) | Medium      | 2026-06-03   | Static `public/app.html` improvements committed `4360957` and **DEPLOYED 2026-06-11** (plus XSS output-escaping hardening, REVIEW-FIX-1) (a11y live region + labels, hint-first copy, session-expired state, no child payment surface, 9 smoke tests). No React/Vite, no new providers, no token-storage change, no deploy. Deferred: streaming, KaTeX, moderation, httpOnly token, full a11y/Arabic QA. |
| STAGE3 | Parent Dashboard Upgrade                            | Blocked                                                 | TBD                                         | Await Stage 2                     | Medium      | 2026-06-03   |                                                      |
| STAGE4 | Landing/Pricing Upgrade                             | Blocked                                                 | TBD                                         | Await earlier stages              | Low/Medium  | 2026-06-03   |                                                      |
| STAGE5 | Advanced Learning Features                          | Future                                                  | TBD                                         | Not started                       | Medium/High | 2026-06-03   |                                                      |

## Active Task List

| ID       | Task                                | Status              | Branch/PR/Migration | Notes                                    |
| -------- | ----------------------------------- | ------------------- | ------------------- | ---------------------------------------- |
| AUTH-PAGES-REBRAND | Login / child-login / verify-email visual rebrand to teal Spark (revamp sub-project 3/3, visual half) | **Built** — PR open → `main` | branch `feat/auth-pages-rebrand` | Surgical, **visual-only** rebrand of the 3 auth pages to the new brand — **all Supabase auth / OTP / child-login JS, forms, and IDs untouched**. Routed each page's `--color-accent` → teal `--brand-*` for **both light + dark** (one override block per page), added the inline **Spark** logo (replaces the 💡/🧠/✉ emojis in the wordmarks), teal primary buttons (pill), teal-tinted plan box, SVG favicon. `sw.js` `v11→v12`. Verified via headless-Chrome screenshots (all 3 pages, dark); `npm test` 123/1 green (`frontend-copy` login card/14-day disclosure intact). **Frontend CSS/markup only; no auth/payment/schema/migration/deploy.** Companion **flow design** (neutral age-gate, parent-verify→child, mobile-first consent) is a separate design doc — auth-logic build stays gated. |
| HOMEPAGE-REVAMP | Premium trust-forward homepage (`index.html`) — revamp sub-project 2/3 | **Done — MERGED to `main` 2026-06-17** (PR #20, merge `e4bee97`) | branch `feat/homepage-revamp`; plan `docs/superpowers/plans/2026-06-17-homepage-revamp.md` | Full rebuild of `public/index.html` adopting the new brand: inline **Spark** logo (replaces 💡), **deep-teal `--brand-*`** primary + amber accent, dark-default + light, mobile-first, **RTL-ready** (logical properties), `prefers-reduced-motion`. **Trust-led structure**: hero ("learns *how*, not just the answer") → **3 trust pillars** (guides-not-answers · you-see-everything · safe-by-design) placed high → "how it teaches" beats (Asks/Hints/Checks) → parent-control checklist → features → steps → teal proof band → pricing teaser (keeps card-required 14-day/10-credit disclosure) → CTA → footer. Kept PWA-install + scroll-reveal JS. SVG icon sprite (no emoji). `sw.js` `v10→v11`. Verified via headless-Chrome screenshots (desktop+mobile, dark+light); `npm test` 123/1 green (frontend-copy intact). **Frontend only; CTAs unchanged (`/pricing`,`/login`); no auth/payment/schema/migration/deploy.** |
| BRAND-FOUNDATION | Premium trust-forward brand: Spark logo + icon set + teal tokens (revamp sub-project 1/3) | **Done — MERGED to `main` 2026-06-17** (PR #19, merge `bf31488`) | branch `design/brand-foundation`; spec `docs/superpowers/specs/2026-06-17-brand-foundation-design.md` | Owner-approved direction (research → brainstorm → design): **premium/trust-forward**, **logo A "Spark ✦"**, **deep-teal primary** (#1E6E78) + warm-amber accent. Hand-authored `public/logo-mark.svg` + `favicon.svg`; regenerated all 10 `public/icons/*` (Spark on teal, 72–512 + maskable) from SVG via headless Chrome; **additive `--brand-*` tokens** in `zeluu-tokens.css` (light+dark); `sw.js` `v9→v10`. **Staged rollout: no HTML pages recolored** — existing icon refs auto-pick the new PNGs; homepage (sub-project 2) adopts teal next. Candidates/sources kept under `design-scratch/brand/`. Verified favicon legible at 16px; `npm test` 123/1 unaffected. **Frontend assets + CSS only; no auth/payment/schema/migration/deploy.** |
| STEP-REVEAL-DESIGN | Step-reveal / guided-explanation layout design (roadmap B4 / T-09) | **Done (design-only) — MERGED to `main` 2026-06-17** (PR #14, merge `a73140c`) | branch `docs/step-reveal-design`; new `docs/specs/SPEC-SLICE-step-reveal.md` | Design for one-step-at-a-time guided explanations + comprehension checks, **including on image/photo problems** (anti-QANDA / research M3). Splits by risk: **Slice A** = frontend progressive-reveal **stepper** (parse steps client-side after `renderMarkdown`, "Next step"/"I've got it", a11y via existing `aria-live`, single-bubble fallback — medium risk, **no backend**); **Slice B** = a chat-backend **no-dump-on-image** prompt guard (sibling of the worked-example guard, append-after scaffolding, prompt-only — high risk, owner review). Reuses the live `step_by_step` mode + L1–L4 + Math Answer Release Policy. Indexed in `docs/specs/README.md`. **Docs-only; no migration/auth/payment/install/React.** |
| GATED-DECISION-REGISTER | Consolidated owner-decision register to unblock the designed gated slices | **Done (docs-only) — MERGED to `main` 2026-06-17** (PR #13, merge `d2fa926`) | branch `docs/gated-work-decision-register`; new `docs/DECISIONS-gated-work-register.md` | Synthesizes the recurring "open gaps" across the 5 design slices into **5 cross-cutting owner decisions** (D1 email/push provider · D2 migration approvals · D3 legal sign-offs · D4 Lemon Squeezy verification · D5 React/Vite gate), each with the features it blocks + a fill-in decision/date line. Includes a "what unblocks fastest" path (in-app-first digest/alerts need only one small `notifications.type` CHECK migration; D4 is verification-only). Turns scattered gates into one actionable checklist. **Docs-only; nothing started until a decision is recorded + the impl slice passes review (CLAUDE.md).** |
| TRY-BEFORE-SIGNUP-DESIGN | Try-before-signup first session design (roadmap B1 / T-06) | **Done (design-only) — MERGED to `main` 2026-06-17** (PR #10, merge `4dbac91`) | branch `docs/try-before-signup-design`; new `docs/specs/SPEC-SLICE-try-before-signup.md` | Design for a **one-question pre-signup teaser** storing **no child PII before consent** (COPPA). Proposes an **isolated anonymous `POST /api/try`** endpoint — deliberately separate from the authed `api/chat.js` so its auth invariants stay untouched — running one method-only guided turn (reuses scaffolding + worked-example guards), **IP/daily rate-capped**, **persisting nothing child-identifying** (at most an anonymous aggregate counter), converting to the parent-account/consent step (A0.5). Grounded in the COPPA/VPC research + A0.5. Indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (unauthenticated AI entry, COPPA/PII boundary, abuse surface) + legal sign-off prerequisite.** |
| SAFETY-ALERTS-DESIGN | Instant dual-channel safety alerts design (roadmap B5 / T-10) | **Done (design-only) — MERGED to `main` 2026-06-17** (PR #9, merge `f522e9c`) | branch `docs/safety-alerts-design`; new `docs/specs/SPEC-SLICE-safety-alerts.md` | Design to upgrade the existing distress/PII/stuck **in-app** notifications to **instant, dual-channel** alerts: severity model (distress=High → in-app **+ email/push**, PII=Medium, stuck=Low in-app-only), in-app stays the durable record + fallback, second-channel dispatch is **best-effort/non-blocking** to the chat turn, distress **re-alerts across new sessions**, and **no child content/PII** in any email/push payload (CLAUDE.md). Shares the email-channel decision with the weekly-digest slice; proposes a phase-1 non-blocking `dispatchAlert()` seam (in-app only). Indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (child-safety path, email/push provider+secret, migration for delivery-status + alert-pref columns).** |
| WEEKLY-DIGEST-DESIGN | Weekly parent digest design (roadmap A4 / T-04) | **Done (design-only) — MERGED to `main` 2026-06-17** (PR #8, merge `a78197f`) | branch `docs/weekly-digest-design`; new `docs/specs/SPEC-SLICE-weekly-digest.md` | Design for a weekly per-parent digest (per-child time-on-task, subjects/topics, **safety-flag counts**) delivered in-app + (phase 2) email on a `pg_cron` job. **Surfaces the blocking decision: no email-sending infra exists in the repo** — recommends phasing (in-app digest first, email once a provider is chosen). Aggregates only — **no child message content / no PII** (CLAUDE.md). Grounded in the live `notifications` pipeline + `sessions`/`messages` schema + the existing `enforce-subscription-expiry` pg_cron job. Indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (email provider+secret, pg_cron, migration for `weekly_digest` type + opt-out column).** |
| PRICING-IMPL-DESIGN | Pricing/credits implementation design (roadmap B7 / T-12) | **Done (design-only) — MERGED to `main` 2026-06-17** (PR #6, merge `cb2e9fc`) | branch `docs/pricing-credit-metering-design`; new `docs/specs/SPEC-SLICE-pricing-credits-impl.md` | Maps the approved pricing spec to gate-aware build slices: product-wide **per-action credit metering** (replaces the `1/5 text · 1/2 image` modulo; text=1/image=3/voice=2/practice=2/quiz=2/mistake=1/weekly=0/reread=0), plan/package definitions as config, **Lemon Squeezy variant mapping** for subscriptions + extra packs incl. **PPP currency** (SAR/AED/EGP), and an ordered current→per-action **migration path with rollback** (shadow-mode config → RPC amount → flag-guarded cutover → variants → retire modulo). Becomes the per-action-metering source of truth for `SPEC-SLICE-trial-enforcement` (its forward-ref now resolved). Updated `docs/specs/README.md`. **Docs-only; no code; all implementation steps remain hard-gated (credit/payment/webhook/LS/migration).** |
| WORKED-EXAMPLE | Worked-example escape hatch (roadmap A3 / T-03) — "show me a worked example" button | **Done — MERGED to `main` 2026-06-17** (PR #5, merge `12fd0a6`; no deploy) | branch `feat/worked-example-escape-hatch` | Adds a `📝 Worked example` button (`public/app.html`) that posts `worked_example:true`; `api/chat.js` appends a prompt guard (new testable `getWorkedExampleGuard()` in `lib/prompts.js`) for that one turn and tags the turn `tutoring_mode:'worked_example'`. The guard makes the tutor invent a NEW, clearly-different parallel problem and solve THAT — and **explicitly forbids solving/revealing the student's own submitted problem** (anti-cheat, addresses research K4). Reuses the existing auth/credit/streaming/`finalizeTurn()` flow unchanged — **no schema/auth/payment/credit/migration/install/deploy**. `npm test` **87 pass / 1 skip** (+4 guard tests `worked-example`); `node --check` clean. Not verified: live model behavior vs real OpenAI (manual smoke before deploy). |
| STREAMING-SSE | SSE token streaming for tutor chat + non-stream fallback | **Done — MERGED to `main` 2026-06-17** (PR #4, merge `31daae0`; no deploy — auto-deploy off) | branch `feat/streaming-sse`; [PR #4](https://github.com/amrabdelglill-pixel/ai-math-tutor/pull/4) | Opt-in per request (`body.stream=true`); `api/chat.js` streams OpenAI deltas as SSE else single JSON. Credit/payment steps 11–13 extracted verbatim into a shared `finalizeTurn()` (single source of truth, unchanged). New `lib/sse.js` framing + `public/js/stream.js` buffer parser (JSON-framed, chunk-split tolerant, skips malformed frames). **Security review (this session):** pre-AI checks (ownership, `child_id`-from-session, rate limit, blocked-content) untouched; distress/PII parent notifications fire before the split on both paths with per-session dedup; streamed + finalized text both pass through escape-first `renderMarkdown` (XSS-safe); mid-stream errors emit an SSE error event + `[DONE]`. `npm test` **83 pass / 1 skip** (+10 tests `sse`/`stream`); `node --check` clean. **No migrations/auth/payment/RLS/installs/deploy.** Not verified: a live end-to-end stream vs real OpenAI+Supabase (manual smoke before deploy). |
| UI-DARK | Site-wide warm-dark theme | **Done — MERGED to `main` 2026-06-17** ([PR #3](https://github.com/amrabdelglill-pixel/ai-math-tutor/pull/3)) | merged via `gh pr merge --merge` (`07a1362`); `main` synced on `origin` + `fork`; **not deployed** (auto-deploy off) | Added a high-specificity `html[data-theme="dark"]` token block to `public/css/zeluu-tokens.css` (warm dark surfaces/text/border/gray-scale/accent/status/child-variants/shadows + `--color-surface-glass` + `color-scheme:dark`); opted all 13 pages in via `<html ... data-theme="dark">`. Converted hardcoded light surfaces to tokens (white/rgba(255) → surface/glass) and darkened hardcoded light `oklch()` pastel surfaces (info boxes, badges, subject/difficulty chips, score circles, legal-page glass navs) with hue preserved, lightening their paired dark text. Fixed the inverted-surface pattern (`background:var(--color-text-dark)` flips light): pricing featured card → lifted warm surface + accent ring; dashboard refresh button → accent. SW cache `v7→v8` so returning users fetch fresh CSS. **Verified with headless Chrome screenshots** of landing/login/dashboard-gate/pricing/child-login/legal/exam-prep — plus the **authed child chat** (via a temporary, reverted auth shim) and the **authed dashboard components** (child cards, credit history, subject chips, usage bar — via a throwaway harness using the verbatim render markup). **WCAG AA contrast-audited** (OKLCH→sRGB→WCAG): all text/surface pairs pass AA — body 16.5, muted 6.9–8.0, accent 5.9–6.9, status 5.3–8.1, chips 6.1; bumped tertiary `--color-text-light` 56%→63% L to clear 4.5:1 (was 3.53). `npm test` 73 pass / 1 skip. **Frontend/docs only; no backend/auth/payment/Supabase/installs/deploy/React-Vite; `PROJECT_BRIEF.md` held out.** |
| MVP-FOUNDATION-WAVE-1 | Approved no-/low-gate MVP foundation wave (5 tasks) | Done | branch `docs/research-product-strategy-specs` (PR #2) | Owner-approved low-gate wave: (1) COPPA/VPC research `docs/research/RESEARCH-coppa-vpc-options.md` (final decision **pending legal review**); (2) KaTeX math rendering — shared `public/js/render.js` (escape-first, XSS-safe), pinned CDN, **no install**, wired into `app.html`+`exam-prep.html`, sw `v6→v7`, +9 tests; (3) Safety & Privacy page `public/safety.html` (claims limited to implemented/clearly-planned; "Available now" vs "Coming soon"), linked from index, +5 tests; (4) age-banded tone (G1-3/4-6/7-9) verified + regression-locked, +7 tests; (5) trial-enforcement design `SPEC-SLICE-trial-enforcement.md` (7d/50cr/10-day/15min, design-only, migration authored-not-applied). Commits `47a46c4`/`2c4d385`/`28b3c8d`/`2c501be`/`25b528b`. `npm test` **73 pass / 1 skip**. **NOT done (not approved): streaming, worked-example, try-before-signup, weekly digest, email, cron, credit/payment enforcement, migrations, React/Vite, deploy.** |
| RESEARCH-STRATEGY-1 | Save competitive research; create product strategy, pricing/credits, roadmap & task-backlog specs; reposition math-only → all-subject (math-first) | Done (docs-only) | branch `docs/research-product-strategy-specs` | Created `docs/research/RESEARCH-competitive-product-strategy-2026-06-15.md` + `docs/specs/SPEC-PRODUCT-learning-companion-strategy.md` + `SPEC-PRICING-packages-credits-cost-model.md` + `SPEC-ROADMAP-product-revamp-implementation.md` + `docs/tasks/TASKS-product-strategy-roadmap.md`; updated tracker/brief/specs-README. No product code; no installs; no live actions. Confirmed facts/NCC/refuted warnings preserved. |
| A0.OS    | Install project operating docs      | Done                | local docs only     | Operating docs installed; docs-only; no source changes. |
| A0.OS-GPT | Document Amr's GPT → Claude operating workflow | Done       | local docs only     | Docs-only; no source changes. Created SPEC-001. |
| A0.5-LS  | Verify Lemon Squeezy trial settings | External gate       | none                | Must verify 14-day trial + card required. |
| A0.6-R   | Public repo benchmark               | Done                | docs spec only      | Research only; all 8/8 categories complete. No code copied. |
| STAGE1-P | Draft Stage 1 test/schema/tooling planning spec | Done    | local docs only     | Docs-only; no source changes. Created SPEC-STAGE1. |
| STAGE1-A | Read-only tooling/scripts/test baseline audit | Done       | local docs only     | Docs-only; no source changes; no installs/tests/build. Created SPEC-STAGE1-A. |
| STAGE1-B | Schema / RLS / API inventory documentation | Done          | local docs only     | Docs-only; no source changes; no SQL/migrations. Created SPEC-STAGE1-B. Accepted. |
| STAGE1-C | Env var / secret validation plan    | Done                | local docs only     | Docs-only; no source changes; no installs; no env files created; no secret values read. Created SPEC-STAGE1-C. |
| STAGE1-FINAL | Stage 1 readiness and implementation gates | Done         | local docs only     | Docs-only; no source changes; implementation not started. Created SPEC-STAGE1-FINAL. |
| STAGE2-P | Draft full Stage 2 child chat UX master plan | Done       | local docs only     | Docs-only; no source changes; implementation not authorized. Created SPEC-STAGE2. |
| STAGE1-1 | Working-tree cleanup and commit plan | Done                | local docs only     | Docs-only; read-only source diff audit; no staging/commits/source changes. Created SPEC-STAGE1-1. |
| STAGE1-1A | Review and commit docs only | Done                       | 3 commits (590e67b/09b8142/d5f7d0d) | Committed only approved docs in 3 waves; no source staged/committed; PROJECT_BRIEF held out. |
| STAGE1-1R | Source diff review before commit | Done                  | local docs only     | Docs-only; read-only review of 14 source diffs; no staging/commits/source changes. Created SPEC-STAGE1-1R. |
| STAGE1-LOCAL | Finish Stage 1 locally (commit source, env validation, tests, migration) | Done | commits 8b89292…84d2084 | Source committed C4a/C4b/C4c/C5; env validation + `.env.example`; 22-test baseline; migration 002 NOT applied. Created SPEC-STAGE1-LOCAL-ACCEPTANCE. Local only; no deploy/live SQL. |
| STAGE2-LOCAL | Stage 2 static child chat UX (local) | Done | commit 4360957 | Additive `public/app.html` a11y/hint-first/session-expired/error UX + 9 smoke tests. No React/Vite/providers/token-storage change/deploy. Created SPEC-STAGE2-LOCAL-ACCEPTANCE. **Partially complete locally** — deeper items (streaming, KaTeX, moderation, httpOnly token, full a11y/Arabic QA, React/Vite) deferred. |
| LOCAL-CORRECTION-1 | Close remaining local Stage 1/2 gaps (full env wiring) | Done | commit 948baa8 | Wired all 8 env vars through `lib/env.js`; added 5 tests (36 total); documented ALLOWED_ORIGIN request-time fallback. Corrected overstated Stage 1 acceptance. No deploy/live SQL. |
| PENDING-CLOSURE-1 | Close non-live pending tasks + prepare production gate pack | Done | local docs only | Created runbooks (PROD-GATE-1 master, migration-002, Lemon Squeezy), prod env/deploy checklist, read-only preflight SQL, security/RLS backlog, token-storage plan, Stage 2 deferred plan, PROJECT_BRIEF drift reconciliation. Docs-only; no live SQL/deploy/installs. PROD-GATE-1 is now ready as a manual/external gate. |
| UI-1 | Shared static design token + base stylesheet | Done (local) | local commit (this slice) | Created `public/css/zeluu-tokens.css` (warm OKLCH tokens = union of the 7 pages' inline blocks + spacing/radius/shadow/motion/z-index, minimal reset, `:focus-visible` baseline, `prefers-reduced-motion`). Linked on the 7 warm pages before their inline `<style>` (cascade preserves appearance); 19 insertions total. Inline tokens NOT yet removed; `styles.css` NOT retired; legal pages untouched; `npm test` 36/36; no installs/React/Vite/deploy/backend. Next: UI-2. |
| UIUX-AUDIT-1 | Read-only frontend UI/UX audit + design improvement plan | Done | local docs only | Created `SPEC-003-frontend-uiux-audit-and-design-plan.md`. Read-only; no `public/*`/CSS/JS edits; no installs; no React/Vite. Findings: two coexisting design systems (warm OKLCH/Fraunces vs. legacy purple `styles.css` on 5 legal pages), inline-token duplication (~7 pages), `dashboard.html` 171 inline styles, a11y gaps (no reduced-motion, sparse ARIA, weak focus), no RTL. Plan = 7 gate-aware static slices (UI-1…UI-7); React/Vite still gated. |
| EVAL-SPECKIT-1 | Evaluate GitHub Spec Kit vs. existing specs workflow (docs-only) | Done | local docs only | Created `SPEC-002-spec-kit-evaluation.md`. Recommendation: inspiration-only; do NOT install/`specify init`/adopt in Zeluu now. No tooling installed; no scaffolding; no source changes. |
| PROD-APPLY-1A | Live preflight + revise migration 002 | Done (preflight run; migration revised; NOT applied) | read-only SQL + migration/docs edit | Resumed prod project `gstjvjynkdvqncjyybwm` (was INACTIVE→ACTIVE_HEALTHY); ran read-only preflight via MCP. Found live↔repo drift: live `notifications_type_check` already has all needed types +2 more → **removed 002's CHECK rewrite** (would regress). Parts 1–2 PASS (0 dup payment refs, no unique index, processed_webhooks absent). No migration applied; no data mutated. |
| SEC-FIX-3 | Restrict balance.js billing data to parent tokens | Done (local) | commit `57626f9` (main) | `api/credits/balance.js` returned the parent's `credit_ledger` (incl. `stripe_payment_id`/amounts) and subscription/billing metadata to any caller; a child token (widened to parent scope, service-role client, RLS bypassed) received the family's payment history. Billing detail is now fetched/returned only when `authContext.type === 'parent'`; child tokens get just the credit count (response keys stay present-but-empty, so the parent dashboard contract and the child app — which reads only `credits` — are unaffected). 2 handler tests (`tests/credits-balance.test.mjs`). `npm test` = 50 pass / 1 skip. **Medium-risk source; manual review before deploy; not pushed.** This closes the last finding from the 360 review. |
| SEC-FIX-2 | Fix child-login password-flag bypass from 360 review | Done (local) | commit `37d87d5` (main) | `api/auth/child-login.js` issued a token whenever the RPC returned a `child_id`, ignoring the `success` flag — and `verify_child_login` returns the child id even on a wrong password (`success:false`), so knowing `parent_email`+`username` let an attacker log in with any password. Handler now normalizes the result shape (object or one-row array) and rejects when `child_id` is missing **or `success === false`** (closes the bypass without assuming the live function shape; never requires a success field, so it can't false-reject a deployed function that only returns a row on a correct password). 7 handler tests (`tests/child-login.test.mjs`). `npm test` = 48 pass / 1 skip. **Defense-in-depth DB hardening (return no row on failed password) still recommended — gated.** **Medium/High-risk source; manual review before deploy; not pushed.** |
| SCHEMA-RECON-1 | Capture live schema history into the repo | **Done (2026-06-11, read-only)** | `supabase/migrations/live/` (22 files) + README | Pulled all 22 applied migrations verbatim from `supabase_migrations.schema_migrations` and verified each against the live DB with whitespace-normalized MD5 checksums (**22/22 match**). New `supabase/migrations/README.md` documents: `live/` is the authoritative history (CLI naming); root `001` is stale/reference-only; `002`–`004` map to their `live/2026-06-11` counterparts; out-of-history state captured too (pg_cron `enforce-subscription-expiry` @ `0 3 * * *` verified live, with recreate command; Auth settings dashboard-managed). Secret scan clean. Closes the live↔repo schema-reconciliation gap (STAGE1-SCHEMA-RECON / backlog items 4 & 6 tail). No SQL writes; no schema changes. |
| PROD-SQL-3 | Drop leftover `temp_transfer` table | **Done (2026-06-11)** | live migration `drop_temp_transfer_table` (= repo `004_*.sql`) | Applied after exact owner phrase `DROP TEMP_TRANSFER CONFIRMED` (owner reviewed the single row first; zero code references). Verified: table gone; 19 public tables remain, all RLS-enabled. |
| PROD-SQL-2 | Pin search_path on remaining DB functions | **Done (2026-06-11)** | live migration `pin_search_path_on_remaining_functions` (= repo `003_*.sql`) | Applied after exact owner phrase `APPLY SEARCH_PATH HARDENING CONFIRMED`. 14 functions pinned (11 SECDEF + 3 invoker): `public` for 13 (crypt calls already `extensions.`-qualified — verified in live prosrc pre-apply), `public, extensions` for `match_knowledge_chunks` (pgvector operator). Post-apply: 0 functions with NULL proconfig; functional probes (verify_child_login/bcrypt, get_valid_credit_balance, get_child_limits_summary, match_knowledge_chunks/vector) all pass; live child-login → 401. Closes advisor `function_search_path_mutable` + security backlog item 3. |
| REVIEW-FIX-1 | Fix full-stack review findings (code-fixable set) | **Done + deployed (2026-06-11)** | commits `15e299a` (backend) + `27ca598` (frontend); deployed + smoked | From the full-stack review: **(1)** child tokens pinned to own `child_id` in `/api/exams` generate/submit/history (intra-family sibling gap, same class as SEC-FIX-1) via new centralized `resolveChildId()` in `lib/child-auth.js`; **(2)** `timingSafeEqual` for child-token signature compare; **(3)** distress/PII parent notifications dedup to once per session (flooding fix); **(4)** `/api/credits/balance` now uses expiry-aware `get_valid_credit_balance` (badge matches chat gating); **(5)** XSS hardening in child app — `app.html` escapes model output before markdown/innerHTML (incl. stored-message replay), user bubbles via `textContent`, escaped name interpolations; `exam-prep.html` escapes all AI/user content in templates. Tests 53 (52 pass / 1 skip; 2 new `resolveChildId` tests; balance test updated to new RPC). Live smoke green. **Gated remainder (await owner):** SECDEF `search_path` migration (11 fns confirmed live), `temp_transfer` drop (holds 1 row — owner must review contents first), Supabase Auth leaked-password protection (dashboard toggle), schema reconciliation (big slice). |
| UI-2B | Retire legacy `styles.css` (sw precache edit) | **Done (2026-06-11)** | local commit | `public/sw.js`: precache `/css/styles.css` → `/css/zeluu-tokens.css`, cache `zeluu-v5`→`v6` (old caches auto-purged on activate). Deleted `public/css/styles.css` after confirming zero references across `public/`/`api/`/`lib/`/`tests/`. Legacy purple design system fully retired. `npm test` 50 pass / 1 skip. |
| PROD-ENV-1 | Verify production env vars in Vercel | **Done (2026-06-11)** | env add + redeploy `dpl_3rccRhRKpYHfEAwPeSoXFEsyhQef` | Names-only `vercel env ls` (no values): 7/8 required vars set in Production; **`ALLOWED_ORIGIN` was missing** (API fell back to `*` — confirmed live pre-fix). Added `ALLOWED_ORIGIN=https://zeluu.com` (checklist-prescribed public origin; `www` non-resolving) to Production only and redeployed the same tree. Verified: preflight now returns `access-control-allow-origin: https://zeluu.com`; full re-smoke green (pages 200, webhook 405/401, balance 401, UI-2 fingerprint intact). Extra unused var `LEMONSQUEEZY_STORE_ID` noted; hygiene follow-up: secrets shared across Dev/Preview/Prod scopes — owner may split preview values later. No values read/printed. |
| PROD-DEPLOY-1 | Deploy UI slices to production + smoke | **Done (2026-06-11)** | deployment `dpl_E2Xbt6CWzdByRuUggYscUHY1ehoC` | Owner explicitly approved ("deploy 92109b7 to production"; dashboard redeploy never registered, so deployed via Vercel CLI after owner completed device login). Deployed working tree `2c677c9` (product files byte-identical to `92109b7`; delta is 3 unserved docs). **Smoke PASS:** all 13 pages + 8 rewrites → 200; webhook GET→405, invalid-signature POST→401 (secret loaded, fail-closed); `/api/credits/balance` unauth→401; child-login bad creds→401 (Supabase connectivity OK); runtime logs show only the 4 smoke requests, no errors. Fingerprints confirm UI-2/UI-3/UI-7 live on zeluu.com (zeluu.com confirmed as the project's production domain via logs). **All of `92109b7` is now live: SEC-FIX-1/2/3 + UI-1…UI-7.** `.gitignore` gained `.vercel` (CLI link dir). Vercel Git auto-deploy remains disabled — future deploys are explicit. |
| PROD-LS-1 | Lemon Squeezy production verification | **Partially verified / BLOCKED on owner-manual dashboard checks** | read-only probes only | Verified (no LS API/keys used, per runbook): webhook endpoint live + public at `https://zeluu.com/api/webhooks/lemonsqueezy` (GET→405); signing secret configured (invalid-signature POST→401, would 500 if unset; no event processed); 8 handled events + store/variant IDs + trial/credit logic documented from code; DB idempotency live. BLOCKED items (owner-manual per runbook): LS dashboard store/variant/trial/card-required settings, webhook URL + enabled-events list, secret match, live-vs-test mode, runbook tests 1–10. **CRITICAL incidental finding:** Vercel auto-deploys `origin/main` pushes — see Decision Log 2026-06-11. No code/SQL/deploy/push/charges; docs-only commit. |
| PROD-RLS-1 | Enable RLS on `processed_webhooks` in production | **Done (2026-06-11)** | live SQL: 1 statement | Applied `ALTER TABLE processed_webhooks ENABLE ROW LEVEL SECURITY;` after the exact owner phrase `ENABLE RLS ON PROCESSED_WEBHOOKS CONFIRMED`. Preflight: RLS was disabled, 0 rows, 0 policies. Post-apply: RLS enabled (not forced), still 0 policies (deny-by-default for anon/authenticated — no permissive policies added), table empty, `credit_ledger` intact (53 rows), **no public table has RLS disabled anymore**. Service-role webhook handler (`lib/supabase.js` `createServerClient`) bypasses RLS → unaffected; handler not edited. No migration file applied; no deploy; no push; docs-only commit. |
| PROD-APPLY-1B | Apply revised migration 002 to production | **Done (APPLIED 2026-06-11)** | remote migration `20260611085209` | Applied after the exact owner confirmation phrase. Parts 1–2 only (unique index `credit_ledger_stripe_payment_id_unique` + `processed_webhooks` table). Preflight re-run pre-apply: PASS. Post-apply verification: PASS (index present, table present/empty, `credit_ledger` intact 53 rows). **Webhook double-grant race is now closed at the DB level.** New gated follow-up: enable RLS on `processed_webhooks` (only RLS-disabled public table; anon-visible via GraphQL; service-role handler unaffected). Prod project left ACTIVE — re-pause is owner's call. Remaining PROD-GATE-1 items: LS verification, prod env verify, deploy + smoke. |
| UI-MASTER-STATIC-1 | Complete static frontend design polish UI-2…UI-7 | Done (local) | commits `1758578` / `b9b5b7e` / `3299658` / `85256a4` / `a3c09f2` / `750ad19` (main) | One commit per slice. **UI-2:** 5 legal/utility pages migrated off legacy purple `styles.css` onto the warm system (legal copy preserved verbatim; `styles.css` now has 0 HTML refs but stays on disk — `public/sw.js` still precaches it, follow-up slice needed). **UI-3:** a11y baseline — `<main>` landmark on all 12 pages, skip links, nav aria-labels, `role="alert"` errors, dialog roles + labelled close buttons, keyboard support for div-based toggles (pricing FAQ, login tabs, dashboard credit history). **UI-4:** dashboard static inline styles 65→25 (file 167→127) via extracted classes; JS-template styles intentionally untouched. **UI-5:** all 12 pages share one identical Google Fonts URL (app/exam-prep upgraded to weighted Fraunces). **UI-6:** tap targets + mobile padding + policy-table overflow guards; no hamburger needed (≤3 links/page). **UI-7:** `[dir="rtl"]` foundation in tokens css + app.html; full Arabic localization deferred. `npm test` 50 pass / 1 skip after every slice. **Medium-risk frontend-only; no backend/auth/payment/Supabase/installs/deploy/React-Vite; PROJECT_BRIEF held out.** |
| SEC-FIX-1 | Fix cross-tenant access bugs from 360 security review (sessions/history + chat) | Done (local) | commit `e6b1696` (main) | **Vuln 1** `api/sessions/history.js`: child tokens were widened to parent scope and could read every sibling's session transcripts by omitting `child_id`; now pinned to own `child_id` (client value ignored), parents may still filter. **Vuln 4** `api/chat.js`: `child_id` came from the request body (spoofable to skip parent-set usage limits); now the session is ownership-checked up front, `child_id` is derived from the session row, a child acting on another child's session gets 403, and ownership is validated before content-flag writes (also closes the write-before-ownership gap). 8 handler tests added (`tests/sessions-history.test.mjs` 5 pass via real signed-token pipeline + mocked `lib/supabase.js`; `tests/chat-handler.test.mjs` 3, self-skip until `node_modules` present because `api/chat.js` imports `openai`). `package.json` test script gains `--experimental-test-module-mocks`. `npm test` = 41 pass / 1 skip. **Medium/High-risk source — manual review required before deploy; not yet pushed.** |

## Decision Log

* 2026-06-17 — **Decision (UI-DARK): ship a site-wide warm-dark theme as the default, via a
  `data-theme="dark"` opt-in rather than replacing the light tokens.** **Reason:** the warm-editorial
  light system is deliberately differentiated and worth preserving as the underlying light layer; a
  high-specificity `html[data-theme="dark"]` token block in the shared sheet overrides the inline
  `:root` blocks several pages still ship (specificity 0,1,1 > 0,1,0) without editing each, and keeps a
  clean path to a future light/dark toggle or `prefers-color-scheme`. **Impact:** all 13 pages set
  `data-theme="dark"`; hardcoded light surfaces (white/rgba/pastel `oklch()`) were tokenized/darkened
  with hue preserved; the inverted-surface pattern (`background:var(--color-text-dark)`) was fixed where
  it was a card (kept where it was an intentional inverted primary button). Verified by headless
  screenshots. Frontend-only; React/Vite + deploy remain gated. **Open follow-up:** the authed-only
  views (child chat `app.html`, authed dashboard/exam-prep) were verified by code + the landing chat
  mock, not a live authed screenshot — confirm in a real session before deploy.
* 2026-06-15 — **Decision (RESEARCH-STRATEGY-1): reposition Zeluu from "AI math tutor" to a
  "child-safe bilingual AI learning companion for school subjects, starting with math as the first
  polished vertical."** **Reason:** the codebase, RAG, chat pipeline, credits, and safety layer are
  subject-agnostic; naming the product "math tutor" caps the addressable market, the pricing narrative,
  and the long-term vision. Math stays the first wedge (objective correctness, KaTeX, exam relevance).
  **Impact:** all surfaces and docs use "learning companion, math-first"; subject features are built
  subject-agnostic; science/English are the next verticals (ship only at the math quality bar). See
  `SPEC-PRODUCT-learning-companion-strategy.md`.
* 2026-06-15 — **Finding (research, verified):** the defensible market lane is guided "build
  understanding" tutoring (Khanmigo pattern), not scan-and-answer homework help (crowded/commoditized,
  QANDA archetype). Safety is table stakes (COPPA binding now; UK Children's Code extraterritorial) —
  *communicating* it is the differentiator. Bilingual GCC differentiation is **Arabic quality, not
  Arabic presence**, and remains a **hypothesis to validate**. **Standing warnings preserved in the
  research doc:** do not claim QANDA lacks Arabic, do not claim no bilingual K-12 competitor exists, do
  not use the refuted Duolingo retention stat or unsupported market-size numbers.

* Card / payment method is required before trial activation.
* Trial is 14 days.
* Trial includes 10 free credits.
* Trial credits are granted only after Lemon Squeezy webhook confirmation.
* No-card trial is **not** the current business model.
* A0.5 used existing pages; no new `/signup.html` or `/trial-activation.html` page yet.
* React / Vite migration is **not** approved yet.
* A0.6 is research / spec only.
* A0.OS established `CLAUDE.md` (not `AGENTS.md`) as the active agent-rules file,
  because no in-repo `AGENTS.md` exists and the parent-folder `AGENTS.md` is an
  out-of-repo one-line stub.
* 2026-06-03 — **Decision:** Document the Human + GPT + Claude operating workflow as
  `SPEC-001-human-gpt-claude-operating-flow.md`. **Reason:** the real project workflow
  includes GPT planning/review and Claude execution, not just Claude repo rules.
  **Impact:** future prompts and reviews should follow this loop.
* 2026-06-03 — **Finding (A0.6 complete):** the official LemonSqueezy billing template
  (`lmsqueezy/nextjs-billing`) has **no webhook idempotency guard**, and LS subscription
  statuses/event names differ from Stripe's. **Impact:** Stage 1 must add a
  `processed_webhooks` table (UNIQUE event id + `ON CONFLICT DO NOTHING` + same-txn
  credit grant) and gate app access on the LS lifecycle (block only `expired`). Confirms
  the fixed card-required/14-day/10-credit/webhook-confirmed model. Migration/RLS/token
  changes remain hard gates — research authorizes none of them.
* 2026-06-03 — **Finding (STAGE1-C complete):** 8 server env vars confirmed by read-only
  grep (18 sites); **0** env references in `public/` (no browser secrets). **Only
  `LEMONSQUEEZY_WEBHOOK_SECRET` is guarded today**; the rest fail late/silently
  (`CHILD_JWT_SECRET` verify fails closed to `null`; missing `ALLOWED_ORIGIN` → silent
  CORS break). **`.gitignore`'s `.env.*` rule would also ignore a future `.env.example`**
  → the creation slice must add `!.env.example`. **Impact:** the env-validation
  implementation slice should add a single `lib/env.js` seam (no-dependency validator
  preferred; Zod = install gate), with an import- vs request-time split and secret-free
  fail-fast messages, before tests/webhook-idempotency work depends on configured envs.
  Env-validation code, `.env.example`, `.gitignore` edits, and installs remain hard gates.

* 2026-06-10 — **Finding (EVAL-SPECKIT-1):** Zeluu has already independently reinvented
  ~80% of GitHub Spec Kit (constitution≈`CLAUDE.md`, specs, plans, task lists, clarify,
  analyze, checklists, acceptance) but as **human/GPT-driven docs and prompts** rather than
  agent slash-commands. Spec Kit's `/speckit.implement` runs task lists autonomously, which
  **conflicts with Zeluu's hard-stop / human-gate model** (SPEC-001 + CLAUDE.md), and
  `specify init` (CLI install + scaffolding + slash-command install) trips multiple hard
  gates. **Decision recommendation:** inspiration-only — keep the current workflow; later,
  as docs-only slices, optionally borrow a standardized spec/plan/tasks template and an
  `analyze`-style cross-artifact reconciliation step. Reconsider `specify init` only for the
  *next greenfield* project, with Zeluu's risk/gate model pre-loaded into its constitution.
  Full adoption/install in Zeluu remains a hard gate. See `SPEC-002-spec-kit-evaluation.md`.

* 2026-06-11 — **Fix (SEC-FIX-3 / balance billing-data leak):** `api/credits/balance.js` served the
  parent's `credit_ledger` (incl. `stripe_payment_id`/amounts) and subscription/billing metadata to
  any authenticated caller. Because a child token is widened to its parent's scope and the handler
  uses the service-role client (RLS bypassed), a logged-in child received the family's payment
  history and billing details. Fixed in `57626f9`: the two billing queries now run only when
  `authContext.type === 'parent'`; child tokens receive just the credit count (the only field their
  app uses). Closes the last finding from the 360 review. Optional further hardening (not done):
  replace `select('*')` with explicit columns so `stripe_*` ids are never serialized even to parents.

* 2026-06-11 — **Fix (SEC-FIX-2 / child-login bypass):** `api/auth/child-login.js` ignored the
  `verify_child_login` `success` flag and minted a 24h token on any result carrying a `child_id`.
  The repo function (`001_initial_schema.sql`) returns `(child_id, parent_id, false)` on a wrong
  password, so the presence of a `child_id` was not proof of authentication — knowing a valid
  `parent_email`+`username` allowed login with any password (exploitability depended on the live
  function's return shape; the live function drifted from repo, returning extra `name`/`grade`/
  `credits` fields). Fixed in `37d87d5`: normalize object/one-row-array results and reject when
  `child_id` is absent **or `success === false`**. Chose reject-on-explicit-false rather than
  require-`success===true` so the fix cannot false-reject a deployed function that returns a row
  only on a correct password (and therefore omits the flag) — it closes the bypass under every
  plausible shape. **Recommended follow-up (gated):** harden the DB function to return no row on a
  failed password as defense in depth, and reconcile the live↔repo `verify_child_login` drift.

* 2026-06-11 — **Finding (SEC-FIX-1 / 360 security review):** a full read-only review of the
  whole codebase (one finder + five adversarial verifiers) surfaced two confirmed cross-tenant
  authorization bugs, both fixed in `e6b1696`. (1) `api/sessions/history.js` accepted a child
  HMAC token, widened it to the parent's scope via the service-role client, and — with no
  `child_id` query param — returned **all of the parent's children's** session transcripts; a
  child could read siblings' private conversations. (2) `api/chat.js` trusted a body-supplied
  `child_id` for parent-set daily/weekly/monthly usage limits, so a child could pass a bogus or
  sibling `child_id` to bypass the cap and drain the shared family credit pool. Fixes pin child
  tokens to their own `child_id` and derive `child_id` from the ownership-checked session row.
  **Still open (lower confidence, not in this slice):** `api/auth/child-login.js:44` ignores the
  `verify_child_login` `success` flag — a potential password-bypass that depends on the live
  function's return shape; must be verified against the **live** DB function as part of the
  schema-reconciliation task. Also a Low-severity intra-family billing-metadata disclosure in
  `api/credits/balance.js` (child token receives parent `credit_ledger`/`subscriptions`). Neither
  is fixed yet.

* 2026-06-10 — **Finding (UIUX-AUDIT-1):** the frontend runs **two design systems at once** —
  the intended warm OKLCH + Fraunces/Plus-Jakarta system on the primary surfaces
  (`index`/`pricing`/`login`/`child-login`/`app`/`dashboard`/`exam-prep`) and a **legacy
  indigo/purple-gradient `styles.css`** still powering 5 legal/utility pages
  (`gdpr`/`refund`/`terms`/`privacy`/`verify-email`). Design tokens are **duplicated inline
  across ~7 pages** (drift already present), `dashboard.html` uses **171 inline styles**, and
  accessibility is thin outside `app.html` (no `prefers-reduced-motion`, ~0 ARIA on
  index/dashboard/login/pricing, weak focus-visible, missing alt text); no RTL/Arabic.
  **Recommendation:** keep the warm-editorial aesthetic (it is genuinely differentiated, not
  AI-slop) and *finish migrating to it as one shared system* — extract a single token/base
  stylesheet (UI-1), retire/migrate the purple `styles.css` (UI-2), then a11y baseline (UI-3),
  de-inline dashboard (UI-4), font/nav/RTL (UI-5–7). All slices fit the static stack; React/Vite
  stays a hard gate. See `SPEC-003-frontend-uiux-audit-and-design-plan.md`.

* 2026-06-11 — **CRITICAL finding (PROD-LS-1): Vercel auto-deploys `origin/main` pushes.**
  The `amrabdelglill-pixel/ai-math-tutor` repo is connected to Vercel project
  `ai-math-tutor` (team `amrabdelglill-7962s-projects`) with Git auto-deploy on. The
  PUSH-2 origin push (2026-06-11) therefore **deployed `d0c7b2a` to production
  (zeluu.com) without an explicit deploy step** — the live site now runs the 28 commits
  incl. SEC-FIX-1/2/3 + UI-1 (verified by page fingerprint: `index.html` has
  `zeluu-tokens.css`, `gdpr.html` still legacy). The two later pushes (`34d4562`,
  `92109b7`, incl. UI-2…UI-7) produced deployments in **BLOCKED** state on Vercel
  (deployment meta shows the GitHub repo flipped public→private between them — possible
  cause; owner must check the Vercel dashboard). **Impact:** the "no deploy" hard gate is
  not enforceable while auto-deploy is on — pushing IS deploying. **Owner decision
  needed:** (a) disable Vercel Git auto-deploy (or add an Ignored Build Step) to restore
  the gate, or (b) accept push-to-deploy and treat any push to origin as deploy-gated.
  Also: the `*.vercel.app` project domains return 401 (deployment protection) — only
  `zeluu.com` serves publicly, so the LS webhook URL must use `zeluu.com`.

## External Gates

> For the **designed-but-gated feature slices** (digest, alerts, pricing/credits, trial, try-before-signup),
> the consolidated owner decisions that unblock them live in
> [`docs/DECISIONS-gated-work-register.md`](DECISIONS-gated-work-register.md).

| Gate                                          | Owner               | Required Evidence                                         | Status                                                    |
| --------------------------------------------- | ------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Lemon Squeezy trial requires payment method   | User / LS dashboard | screenshots or confirmation for all subscription variants | Pending                                                   |
| Lemon Squeezy 14-day trial configured         | User / LS dashboard | confirmation for all subscription variants                | Pending                                                   |
| Success URL `/dashboard.html?payment=success` | User / LS dashboard | confirmation                                              | Pending                                                   |
| Webhook events enabled                        | User / LS dashboard | confirmation                                              | Pending                                                   |
| Stage 0 manual verification                   | User                | checklist / evidence                                      | Superseded — Stage 0 fixes deployed 2026-06-11; remaining behavioral checks folded into the LS runbook tests 1–10 |
| React/Vite approval                           | User                | explicit approval                                         | Not approved                                              |
| Model provider / privacy approval             | User / legal        | provider review                                           | Not approved                                              |

## Remaining Risks

* ~~`ALLOWED_ORIGIN` must be configured in Vercel if not already~~ **CLOSED 2026-06-11
  (PROD-ENV-1):** it was indeed missing (API served `Access-Control-Allow-Origin: *`);
  now set to `https://zeluu.com` in Production and verified live post-redeploy.
* ~~Webhook idempotency is improved but a DB-level unique / idempotency mechanism is
  still recommended.~~ **CLOSED 2026-06-11 (PROD-APPLY-1B):** partial unique index on
  `credit_ledger.stripe_payment_id` + `processed_webhooks` table applied to production.
  (Handler wiring of `processed_webhooks` insert-first remains a future slice; new
  gated follow-up: enable RLS on `processed_webhooks`.)
* Credit deduction is improved but not fully transactional under high concurrency.
* Low-credit notification dedupe is improved but not atomic. (Distress/PII alerts now dedup once-per-session — REVIEW-FIX-1.)
* `subscription_updated` trial-to-active credit path should be reviewed for explicit
  idempotency.
* ~~Trial expiry enforcement in `/api/credits/balance` must be verified.~~ **CLOSED 2026-06-11 (REVIEW-FIX-1):** balance.js now uses expiry-aware `get_valid_credit_balance`, matching chat gating.
* Lemon Squeezy "require payment method for trial" must be manually verified.
* Child token storage remains unchanged and should be reviewed separately.
* Public repo research must not result in copied code without license / security review.
* ~~**Working-tree hygiene:** `api/*` and `public/*` uncommitted.~~ **CLOSED:** all source committed (C4a–C5, 2026-06-03) and deployed (2026-06-11).
