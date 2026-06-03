# Zeluu Project Tracker

> Single source of truth for workstream status, active tasks, decisions, external
> gates, and remaining risks. Update this file as part of every meaningful task,
> and update `SESSION_BRIEF.md` last.

**Last Updated:** 2026-06-03

## Global Status Table

| ID     | Workstream                                          | Status                                                  | Current Spec                                | Current Task                      | Risk        | Last Updated | Notes                                                |
| ------ | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- | --------------------------------- | ----------- | ------------ | ---------------------------------------------------- |
| S0     | Stage 0 Emergency Backend/Security/Payment Fixes    | Accepted / pending manual verification where applicable | TBD                                         | Carry risks forward               | High        | 2026-06-03   | Stage 0 accepted earlier; remaining risks documented. NOTE: `api/*` changes currently sit uncommitted in the working tree. |
| A0.5   | Trial Signup, Card-Based Onboarding & Activation UX | Implemented / pending manual LS verification            | `SPEC-A0.5-trial-signup-onboarding-flow.md` | Manual Lemon Squeezy verification | Low/Medium  | 2026-06-03   | Frontend-only flow/copy fix completed. NOTE: 4 `public/*` files currently sit uncommitted in the working tree. |
| A0.6   | Public Repo Benchmark & Product Inspiration Sprint  | Complete (all 8 categories researched)                  | `SPEC-A0.6-public-repo-benchmark.md`        | Report complete; awaiting next gate | Low       | 2026-06-03   | Research only; docs/spec output. All 8 categories done incl. SaaS-billing + Supabase-security. No code copied. |
| A0.OS  | Install Project Operating Docs                      | Complete / accepted                                     | n/a (process task)                          | Operating docs installed          | Low         | 2026-06-03   | CLAUDE.md + docs tracker/session/specs created; docs-only; no source changes. |
| STAGE1 | Tests, Schema Documentation & Tooling Evaluation    | Docs committed (3 waves); source review done / source commit not authorized | `SPEC-STAGE1-1R-source-diff-review-before-commit.md` | Review STAGE1-1R source diff review | Medium | 2026-06-03   | Docs committed (590e67b/09b8142/d5f7d0d). **STAGE1-1R source diff review done** (`SPEC-STAGE1-1R-...`): all 14 diffs reviewed read-only; recommend split **C4a** (CORS, Low) / **C4b** (chat+children, High) / **C4c** (webhook, High) / **C5** (A0.5). Findings: webhook idempotency best-effort only (no UNIQUE on `credit_ledger.stripe_payment_id` → race; STAGE1-7/8 needed); `payment_failed` violates `notifications.type` CHECK (silently caught). **Source still uncommitted; no source changes.** No React/Vite. |
| STAGE2 | Child Chat UX Upgrade                               | Master plan drafted / blocked pending Stage 1 implementation readiness | `SPEC-STAGE2-child-chat-ux-master-plan.md`  | Review Stage 2 master plan        | Medium      | 2026-06-03   | Docs-only plan (child chat UX, tutor flow, safety/privacy, credit boundaries, static-vs-React options, STAGE2-A…J slices). No migration/React/Vite approved. First slice: STAGE2-A audit (read-only). |
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
