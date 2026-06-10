# Zeluu Project Tracker

> Single source of truth for workstream status, active tasks, decisions, external
> gates, and remaining risks. Update this file as part of every meaningful task,
> and update `SESSION_BRIEF.md` last.

**Last Updated:** 2026-06-10

## Global Status Table

| ID     | Workstream                                          | Status                                                  | Current Spec                                | Current Task                      | Risk        | Last Updated | Notes                                                |
| ------ | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- | --------------------------------- | ----------- | ------------ | ---------------------------------------------------- |
| S0     | Stage 0 Emergency Backend/Security/Payment Fixes    | Accepted / pending manual verification where applicable | TBD                                         | Carry risks forward               | High        | 2026-06-03   | Stage 0 accepted earlier; remaining risks documented. NOTE: `api/*` changes currently sit uncommitted in the working tree. |
| A0.5   | Trial Signup, Card-Based Onboarding & Activation UX | Implemented / pending manual LS verification            | `SPEC-A0.5-trial-signup-onboarding-flow.md` | Manual Lemon Squeezy verification | Low/Medium  | 2026-06-03   | Frontend-only flow/copy fix completed. NOTE: 4 `public/*` files currently sit uncommitted in the working tree. |
| A0.6   | Public Repo Benchmark & Product Inspiration Sprint  | Complete (all 8 categories researched)                  | `SPEC-A0.6-public-repo-benchmark.md`        | Report complete; awaiting next gate | Low       | 2026-06-03   | Research only; docs/spec output. All 8 categories done incl. SaaS-billing + Supabase-security. No code copied. |
| A0.OS  | Install Project Operating Docs                      | Complete / accepted                                     | n/a (process task)                          | Operating docs installed          | Low         | 2026-06-03   | CLAUDE.md + docs tracker/session/specs created; docs-only; no source changes. |
| STAGE1 | Tests, Schema Documentation & Tooling Evaluation    | **Complete locally** (env validation fully wired + tested) / blocked externally on live gates | `SPEC-STAGE1-LOCAL-ACCEPTANCE.md` | External gate review (apply migration 002; manual LS verify; deploy) | Medium | 2026-06-03   | Source committed C4a `15d62f5` / C4b `8a60d2d` / C4c `b3f043f` / C5 `f0b4c87`; env validation + `.env.example` `2a32f76`; **LOCAL-CORRECTION-1 `948baa8` wired all 8 env vars through `lib/env.js`** (OpenAI/LS-key/webhook-secret/CHILD_JWT now fail secret-free; ALLOWED_ORIGIN documented fallback); test baseline now **36 tests** (`84d2084`+correction), 0 installs. Migration `002` (webhook unique index + processed_webhooks) **created, NOT applied** — its notification-CHECK part was **removed after PROD-APPLY-1A live preflight** (prod CHECK already allows all needed types +2 more; rewrite would regress). Preflight PASS for parts 1–2 (0 dup payment refs, no index, processed_webhooks absent). Live gates: apply migration 002 parts 1–2, manual LS replay, deploy, RLS hardening, token storage, live↔repo schema reconciliation. No React/Vite. |
| STAGE2 | Child Chat UX Upgrade                               | Static UX improved locally (partial) / deeper items deferred | `SPEC-STAGE2-LOCAL-ACCEPTANCE.md` | External gate review; later slices (moderation, math, token storage) | Medium      | 2026-06-03   | Static `public/app.html` improvements committed `4360957` (a11y live region + labels, hint-first copy, session-expired state, no child payment surface, 9 smoke tests). No React/Vite, no new providers, no token-storage change, no deploy. Deferred: streaming, KaTeX, moderation, httpOnly token, full a11y/Arabic QA. |
| STAGE3 | Parent Dashboard Upgrade                            | Blocked                                                 | TBD                                         | Await Stage 2                     | Medium      | 2026-06-03   |                                                      |
| STAGE4 | Landing/Pricing Upgrade                             | Blocked                                                 | TBD                                         | Await earlier stages              | Low/Medium  | 2026-06-03   |                                                      |
| STAGE5 | Advanced Learning Features                          | Future                                                  | TBD                                         | Not started                       | Medium/High | 2026-06-03   |                                                      |

## Active Task List

| ID       | Task                                | Status              | Branch/PR/Migration | Notes                                    |
| -------- | ----------------------------------- | ------------------- | ------------------- | ---------------------------------------- |
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

## Decision Log

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

## External Gates

| Gate                                          | Owner               | Required Evidence                                         | Status                                                    |
| --------------------------------------------- | ------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Lemon Squeezy trial requires payment method   | User / LS dashboard | screenshots or confirmation for all subscription variants | Pending                                                   |
| Lemon Squeezy 14-day trial configured         | User / LS dashboard | confirmation for all subscription variants                | Pending                                                   |
| Success URL `/dashboard.html?payment=success` | User / LS dashboard | confirmation                                              | Pending                                                   |
| Webhook events enabled                        | User / LS dashboard | confirmation                                              | Pending                                                   |
| Stage 0 manual verification                   | User                | checklist / evidence                                      | Pending / partially complete depending on user confirmation |
| React/Vite approval                           | User                | explicit approval                                         | Not approved                                              |
| Model provider / privacy approval             | User / legal        | provider review                                           | Not approved                                              |

## Remaining Risks

* `ALLOWED_ORIGIN` must be configured in Vercel if not already (missing → silent CORS
  break; STAGE1-C recommends request-time validation for it).
* Webhook idempotency is improved but a DB-level unique / idempotency mechanism is
  still recommended.
* Credit deduction is improved but not fully transactional under high concurrency.
* Low-credit notification dedupe is improved but not atomic.
* `subscription_updated` trial-to-active credit path should be reviewed for explicit
  idempotency.
* Trial expiry enforcement in `/api/credits/balance` must be verified.
* Lemon Squeezy "require payment method for trial" must be manually verified.
* Child token storage remains unchanged and should be reviewed separately.
* Public repo research must not result in copied code without license / security review.
* **Working-tree hygiene:** `api/*` and `public/*` files are currently modified but
  uncommitted. These predate A0.OS and were NOT touched by the docs setup. They
  should be reviewed and committed under their proper workstream (S0 / A0.5) before
  further implementation work.
