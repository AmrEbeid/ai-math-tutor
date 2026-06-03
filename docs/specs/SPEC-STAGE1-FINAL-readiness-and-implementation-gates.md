# SPEC-STAGE1-FINAL — Readiness and Implementation Gates

> Closes the Stage 1 **planning / audit** workstream and prepares the project for future
> implementation slices. Built read-only from the accepted Stage 1 specs (STAGE1-P / A /
> B / C) and the repo baseline they recorded. **No source files changed, no installs, no
> migrations, no SQL, no deploy, no React/Vite, no secret values read.**

**Status:** Drafted / awaiting GPT and user review. **No implementation authorized.**
**Date:** 2026-06-03
**Risk class:** Medium planning, low execution (docs-only).

## 1. Purpose

This document closes Stage 1's planning and audit work and converts it into a single,
reviewable **readiness package**: what was audited, what was found, what remains risky,
which implementation slices are required later, which approvals gate each, and what
should be built first once implementation is approved. It is the hand-off artifact GPT/
Amr review before authorizing the first Stage 1 *implementation* slice. It does **not**
authorize or perform any implementation.

## 2. Stage 1 Scope Completed

All Stage 1 work to date is **planning + read-only audit + documentation**:

* **STAGE1-P** — `SPEC-STAGE1-test-schema-tooling-plan.md`. The planning spec: test
  baseline, schema-doc plan, env-validation plan, webhook-idempotency design intent,
  RLS/security plan, tooling/dependency list, CI plan, AI-mocking plan, the STAGE1-A…J
  slice map, risk register, and dependency-approval list. **Accepted.**
* **STAGE1-A** — `SPEC-STAGE1-A-read-only-tooling-baseline-audit.md`. Evidence-based
  baseline: git/worktree, package/scripts, Vercel/API, frontend, libs, Supabase/
  migrations, tests/CI, env usage. Surfaced schema doc-drift and the missing
  webhook-idempotency table. **Accepted.**
* **STAGE1-B** — `SPEC-STAGE1-B-schema-rls-api-inventory.md`. Evidence-based schema/RLS/
  function/trigger inventory + endpoint→tables/RPCs/env/external map + frontend
  touchpoints + env inventory + a 9+ item drift register. Established that RLS is
  **parent-scoped only** (child isolation is app-layer) and that **exam/knowledge tables
  are not in repo migrations**. **Accepted.**
* **STAGE1-C** — `SPEC-STAGE1-C-env-secret-validation-plan.md`. Docs-only env/secret
  validation plan: 8 env vars inventoried (names + reference sites, no values), secret
  classification, exposure/logging review, fail-fast validation plan (single `lib/env.js`
  seam, no-dependency validator preferred, import- vs request-time split), an
  `.env.example` proposal (drafted, not created), and the `.gitignore` `.env.*` caveat.
  **Complete; awaiting acceptance** (this package treats it as the env baseline).

**Reconciliation result:** the four specs together cover tests, schema, env/secrets,
webhook idempotency intent, RLS/security, tooling, CI, and AI mocking. **Stage 1
planning is complete; no critical planning gap remains.** The only "incomplete" items are
deliberately deferred to *implementation* slices (below), not planning gaps.

## 3. Stage 1 Non-Goals (what Stage 1 did NOT do)

Stage 1 did **not**: implement tests · install packages · create migrations · run SQL ·
deploy · start React/Vite · edit source files (`api/*`/`lib/*`/`public/*`/`scripts/*`) as
part of Stage 1 · create `.env.example` · change package scripts · change
auth/RLS/payment/webhook/credit/token logic · connect to live Supabase · copy public-repo
code. Every Stage 1 task was read-only or docs-only.

## 4. Current Repo Baseline (from STAGE1-A/B/C; unknowns marked)

* **Git / worktree:** branch `main`. **Pre-existing uncommitted changes predate Stage 1**
  — 10 modified `api/*` files (Stage 0) + 4 modified `public/*` files (A0.5), plus
  untracked `CLAUDE.md`, `PROJECT_BRIEF.md`, and `docs/`. Stage 1 must not touch, stage,
  or commit these.
* **Package / scripts:** `"type":"module"`, `private:true`. Scripts: **only `dev: vercel
  dev`** — no `test`/`lint`/`build`/`typecheck`. Deps: `@supabase/supabase-js`, `openai`.
  **No devDependencies; no lockfile; no `node_modules`.**
* **Tests / CI:** **no test files, no runner, no lint/format config.** CI = only
  `.github/workflows/knowledge-pipeline.yml`; **no application CI.**
* **Frontend:** static HTML + vanilla JS (no React/Vite). Logic is in inline page scripts
  → low testability. `public/js/supabase-config.js` hardcodes the Supabase URL + anon key
  (public by design; safe only if RLS enforced).
* **API / serverless:** 10 ESM functions under `api/*`; shared seams in `lib/`
  (`supabase.js`, `child-auth.js`, `prompts.js`, `rate-limit.js`). OpenAI client is
  **scattered** across `api/chat.js` + `api/exams.js` (two mock seams). Webhook verifies
  HMAC-SHA256 on the raw body.
* **Supabase / migrations:** one migration `001_initial_schema.sql` — 11 tables, 13 RLS
  policies (**all parent-scoped raw `auth.uid()`, no child-role policies**), 14
  `SECURITY DEFINER` functions (**0 set `search_path`**), 2 triggers. **No
  webhook-idempotency table.** **`exam*` and `knowledge_*` tables are referenced by code
  but absent from the repo migration** → `Implied by code / not verified`. Live RLS/RPC
  behavior is **unknown** (no Supabase connection made).
* **Env / secrets:** 8 server env vars; **0** env refs in `public/`. Service-role key
  server-only ✅. **No env validation; no `.env.example`.** Only
  `LEMONSQUEEZY_WEBHOOK_SECRET` is guarded today.
* **Docs:** operating docs (`CLAUDE.md`, tracker, brief, `docs/specs/*`) are the current
  source of truth; legacy root docs (`PROJECT_BRIEF.md`, `IMPLEMENTATION_SUMMARY.md`,
  `DEPLOYMENT_CHECKLIST.md`, `SETUP_GUIDE.md`, 1-line `README.md`) contain drift vs the
  live schema (e.g. `credit_transactions` vs the real `credit_ledger`).

> Unknowns (live schema for exam/knowledge tables, which `verify_child_login` signature is
> active, live RLS/RPC behavior) are **verification** items — none authorize implementation.

## 5. Key Findings

* **No test baseline exists** (no test files, runner, or mocks). *(confirmed, STAGE1-A)*
* **No `lint`/`build`/`test`/`typecheck` scripts exist** — only `dev`. *(confirmed)*
* **No env validation exists**; only `LEMONSQUEEZY_WEBHOOK_SECRET` is guarded; others fail
  late/generically/silently. *(confirmed, STAGE1-C)*
* **No `.env.example` exists**; and `.gitignore`'s `.env.*` rule would ignore one if
  naively added (needs `!.env.example`). *(confirmed, STAGE1-C)*
* **Webhook idempotency table appears missing** → re-delivered event risks a double
  10-credit grant. *(confirmed in repo migration; live DB unverified)*
* **RLS uses raw `auth.uid()`** (not `(select auth.uid())`) and policies omit explicit
  `TO authenticated` → review for correctness + performance hardening. *(confirmed in repo)*
* **14 SQL functions are `SECURITY DEFINER` with 0 `set search_path`** → check/pin
  `search_path` to avoid search-path hijacking. *(confirmed in repo)*
* **Child token storage:** child JWT (HMAC) in `localStorage` (XSS-exposed); **two key
  names** (`child_token` vs `zeluu_child_token`) → needs review/standardization.
* **Schema/code documentation drift exists:** `credit_ledger` (not `credit_transactions`);
  `knowledge_*`/`exam*` tables not in repo migrations; duplicate `verify_child_login`.
* **Stripe-style naming/statuses vs Lemon Squeezy** (`stripe_*` columns, `trialing`
  status) need reconciliation to LS lifecycle (`on_trial`/`active`/…/`expired`).
* **Pre-existing uncommitted Stage 0/A0.5 source changes** must be reviewed/committed (or
  intentionally separated) **before** any Stage 1 implementation, to keep diffs clean.

## 6. Stage 1 Implementation Backlog

> Future slices. **Docs-only** slices are low-risk and can proceed on review;
> **implementation** slices each require explicit approval (high-risk ones also need a
> rollback plan + manual verification). Nothing here is authorized by this document.

| Slice | Name | Type | Risk | Purpose | Requires Approval? | Source Files Later? |
|---|---|---|---|---|---|---|
| STAGE1-1 | Working-tree cleanup / commit plan | Docs/plan (then user-run git) | Low/Med | Review & commit/separate the pre-existing `api/*`+`public/*` diffs so Stage 1 diffs are clean | Yes (commit strategy = user decision) | No (plan); commits touch existing files |
| STAGE1-2 | Dependency approval for test tooling | Docs/decision | Low | Approve the Vitest/MSW/Zod (+later pgTAP/ESLint) list | Yes (approval gate) | No |
| STAGE1-3 | Env validation implementation | Implementation | Med | Add `lib/env.js` fail-fast validator + wire in (per STAGE1-C) | **Yes** | **Yes** (`lib/*`, endpoints) |
| STAGE1-4 | `.env.example` creation | Implementation | Low | Create `.env.example` (names only) + `!.env.example` gitignore negation | **Yes** | **Yes** (new file + `.gitignore`) |
| STAGE1-5 | Test tooling install | Implementation | Low/Med | Install approved Vitest/MSW/Zod; add scripts; create lockfile | **Yes** (install + `package.json`) | **Yes** |
| STAGE1-6 | API unit tests with mocks | Implementation | Med | Vitest + MSW (`onUnhandledRequest:'error'`); mock OpenAI (2 seams) + LS + Supabase | **Yes** (test files) | **Yes** (test files) |
| STAGE1-7 | Webhook-idempotency design finalization | Docs/plan | Low | Finalize `processed_webhooks` design (UNIQUE event id + ON CONFLICT + same-txn grant) | No (design) | No |
| STAGE1-8 | Webhook-idempotency migration | Implementation | **High** | Apply the `processed_webhooks` migration + handler change | **Yes** (migration + webhook logic) | **Yes** (migration, `api/webhooks/*`) |
| STAGE1-9 | RLS policy hardening design | Docs/plan | Low | Design `(select auth.uid())` wrap, `TO authenticated`, indexes, SECDEF `search_path`, child-access helper | No (design) | No |
| STAGE1-10 | RLS / security migration | Implementation | **High** | Apply approved RLS/SECDEF hardening migration | **Yes** (migration + RLS) | **Yes** (migration) |
| STAGE1-11 | Child token-storage design | Docs/plan | Low (plan) | Design httpOnly/Secure/SameSite cookie migration + key-name standardization | No (design); impl is a **hard gate** | No (plan) |
| STAGE1-12 | CI setup | Implementation | Low/Med | Add GitHub Actions app CI (lint + tests; no real external calls) | **Yes** (workflow) | **Yes** (`.github/*`) |
| STAGE1-13 | Stage 1 acceptance test checklist | Docs | Low | Final acceptance checklist proving §8 criteria met | No | No |

**Docs-only:** STAGE1-1 (plan half), STAGE1-2, STAGE1-7, STAGE1-9, STAGE1-11 (plan),
STAGE1-13. **Implementation (approval required):** STAGE1-3, 4, 5, 6, 8, 10, 12, and the
git execution of STAGE1-1.

## 7. Hard Gates Before Stage 1 Implementation

All must be satisfied/approved before the relevant slice runs:

* **User approval** for any implementation slice.
* **Working-tree cleanup / commit strategy** decided (STAGE1-1) — do not implement over
  uncommitted Stage 0/A0.5 diffs.
* **Dependency install approval** (Vitest/MSW/Zod/pgTAP/ESLint…).
* **Package-script approval** (adding `test`/`lint`/`build`).
* **Test-file creation approval.**
* **`.env.example` creation approval** (+ `.gitignore` edit approval).
* **Env-validation implementation approval.**
* **Migration approval** (idempotency table, RLS/SECDEF hardening, exam/knowledge schema,
  `verify_child_login` cleanup).
* **RLS / auth review** (high risk).
* **Payment / webhook / credit review** (high risk).
* **Token-storage approval** (child JWT → cookie is a hard gate).
* **Vercel env-change approval** (e.g. confirming `ALLOWED_ORIGIN`, secrets).
* **Deployment approval.**
* **React/Vite still blocked** (not approved; separate decision).

## 8. Stage 1 Acceptance Criteria (for the future *implemented* Stage 1)

Stage 1 may later be accepted as **implemented** when:

* working tree is clean or its state is intentionally documented;
* required env validation exists and fails fast on missing/blank secrets;
* `.env.example` exists with names/placeholders and **no real secrets**;
* tests exist and pass locally;
* mocks structurally prevent real OpenAI/LemonSqueezy/production calls
  (`onUnhandledRequest:'error'`);
* webhook idempotency has a safe design and an approved, applied migration (exactly-once
  10-credit grant under replay);
* RLS / security review is completed (and any approved hardening applied);
* the service-role key is confirmed server-only (never in `public/`/`*_PUBLIC`/logs);
* no secrets are leaked in logs or error bodies;
* CI exists or is explicitly deferred with a reason;
* no production data was touched;
* manual Lemon Squeezy checks (card-required, 14-day, 10-credit, webhook) are completed;
* docs / tracker / session brief are updated (brief last).

## 9. Recommended First Implementation Slice

**`STAGE1-1 — Working-Tree Cleanup and Commit Plan`** (recommended first).

**Reason:** the repo carries pre-existing uncommitted `api/*` (Stage 0) and `public/*`
(A0.5) changes plus untracked `CLAUDE.md`/`PROJECT_BRIEF.md`/`docs/`. Starting any Stage 1
implementation on top of this would entangle unrelated diffs, make review unreliable, and
risk accidentally committing or reformatting Stage 0/A0.5 work. Cleaning/committing or
intentionally separating those changes first is the lowest-risk, highest-leverage step and
unblocks every subsequent slice. STAGE1-1 is a plan + a user-run git commit strategy (no
new source logic), so it carries low technical risk while resolving a process blocker.
After STAGE1-1, the natural order is STAGE1-2 (tooling approval) → STAGE1-3/4 (env
validation + `.env.example`) → STAGE1-5/6 (install + tests) → STAGE1-7/8 (idempotency) →
STAGE1-9/10 (RLS) → STAGE1-12 (CI) → STAGE1-13 (acceptance).

## 9a. STAGE1-1 Cleanup/Commit Plan Drafted (2026-06-03)

The recommended first slice (§9) has been **planned** in
`SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md`: a read-only audit of the 14 modified
source files (classified Stage 0 `api/*` security/payment/auth vs A0.5 `public/*`
onboarding) + the untracked `docs/` tree, with an explicit, file-listed commit plan
(C1–C3 docs → C4 Stage 0 → C5 A0.5), review gates, and safe example git commands.
**No commits were made; no files were staged; no source files were changed; no
implementation started.** Recommended next action: GPT/user review, then either
`STAGE1-1A — Review and Commit Docs Only` or `STAGE1-1R — Source Diff Review Before Commit`.

## 10. Stage 1 Status

**Stage 1 planning/readiness package complete. Stage 1 implementation not started. No
implementation authorized.** Awaiting GPT/user review and approval of the first
implementation slice (recommended: STAGE1-1).
