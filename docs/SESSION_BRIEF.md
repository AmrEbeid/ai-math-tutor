# Zeluu Session Brief

> Compact, fast-loading orientation for the start of every session.
> **This file is updated LAST after every meaningful action.**

## 1. Project

Zeluu AI Math Tutor — AI tutoring product for children and parents with a
card-required 14-day trial, 10 free credits, Lemon Squeezy payments, Supabase
backend, and a static frontend currently under stabilization.

## 2. Current Priority

Docs are committed (3 waves: `590e67b`/`09b8142`/`d5f7d0d`), and the **STAGE1-1R source diff
review is now drafted** (`SPEC-STAGE1-1R-source-diff-review-before-commit.md`): all 14
uncommitted source diffs were reviewed read-only with a **C4a/C4b/C4c/C5 commit-split
recommendation**. The next priority is **GPT/user review of STAGE1-1R**, then approve a
source commit/review slice — preferred **`STAGE1-1C4A`** (commit the 7 low-risk CORS
one-liners). Source remains **uncommitted and unchanged**; `PROJECT_BRIEF.md` still held out.
No implementation, installs, migrations, React/Vite, or Stage 2 code without approval.

## 3. Must-Read Files

* `CLAUDE.md`
* `docs/PROJECT_TRACKER.md`
* `docs/SESSION_BRIEF.md`
* `docs/specs/README.md`
* the active spec (currently `docs/specs/SPEC-A0.6-public-repo-benchmark.md`)

## 4. Current Branch / PRs

* **Branch:** `main`.
* **Worktree has UNCOMMITTED changes that predate this task** — do not assume prior
  work is committed:
  * Modified (uncommitted): `api/auth/child-login.js`, `api/auth/profile.js`,
    `api/chat.js`, `api/children.js`, `api/credits/balance.js`,
    `api/credits/checkout.js`, `api/exams.js`, `api/sessions/create.js`,
    `api/sessions/history.js`, `api/webhooks/lemonsqueezy.js` (Stage 0 work),
    and `public/dashboard.html`, `public/index.html`, `public/login.html`,
    `public/pricing.html` (A0.5 work).
  * Untracked: `PROJECT_BRIEF.md`.
* A0.OS adds only documentation files (`CLAUDE.md`, `docs/**`); it did not touch the
  above.

## 5. Recently Completed

* Stage 0 accepted earlier.
* A0.5 frontend-only flow/copy implementation completed.
* A0.5 changed only four public files (`index.html`, `pricing.html`, `login.html`,
  `dashboard.html`).
* No backend changes in A0.5.
* No deployment in A0.5.
* A0.6 research **complete: all 8 categories** (AI chat UX + routing; AI
  tutoring/education; UI/UX design systems; testing/CI + child safety; **SaaS billing**;
  **Supabase auth/RLS/security**). Findings saved into `SPEC-A0.6`. No code copied.
* STAGE1-A, STAGE1-B accepted. **STAGE1-C drafted** — docs-only env/secret validation
  plan (`SPEC-STAGE1-C-...`): 8 env vars inventoried (no values read), classified,
  exposure/logging reviewed, fail-fast validation planned, `.env.example` proposed (not
  created). No source changes; no installs; no env files created.
* **STAGE1-FINAL + STAGE2-P drafted** — Stage 1 planning closed as a readiness package
  (`SPEC-STAGE1-FINAL-...`: reconciled STAGE1-P/A/B/C, STAGE1-1…13 backlog, gates,
  acceptance, first slice = STAGE1-1 working-tree cleanup) and the full Stage 2 child-chat-UX
  master plan (`SPEC-STAGE2-...`: tutor flow, chat-UI/safety/credit requirements,
  static-vs-React options, STAGE2-A…J slices). Docs-only; no source changes; implementation
  not started.
* **STAGE1-1 drafted** — read-only diff audit of all 14 uncommitted source files +
  untracked `docs/` inventory → `SPEC-STAGE1-1-...` with a file-listed commit plan
  (C1–C3 docs → C4 Stage 0 `api/*` → C5 A0.5 `public/*`), review gates, and safe example
  git commands. Confirmed diffs are intentional & match Stage 0/A0.5. Notable: webhook
  already has code-level idempotency (best-effort on `credit_ledger.stripe_payment_id`) but
  still no DB unique table; `children.js` now uses real HMAC token verify; `PROJECT_BRIEF.md`
  held out (drift). **No commits/staging/source changes.**
* **STAGE1-1A done** — committed the 15 approved docs in 3 waves (`590e67b` operating docs,
  `09b8142` A0.6+Stage 1 readiness, `d5f7d0d` Stage 2 plan). No source staged/committed;
  `PROJECT_BRIEF.md` excluded; safety-scanned (no secrets / no false impl claims).
* **STAGE1-1R drafted** — reviewed all 14 source diffs read-only → `SPEC-STAGE1-1R-...`:
  per-file risk, cross-file interactions, **C4a/C4b/C4c/C5 split recommendation**, manual
  verification checklist. New findings: webhook idempotency best-effort only (no UNIQUE on
  `credit_ledger.stripe_payment_id` → concurrent-replay race; STAGE1-7/8 still needed);
  `payment_failed` notification violates the `notifications.type` CHECK (silently caught);
  `children.js` token change confirmed a security upgrade (HMAC verify). **No source committed/changed.**

## 6. Current Blockers / Gates

* Lemon Squeezy trial / card settings verification.
* Stage 0 manual verification evidence, if not fully confirmed.
* No React / Vite approval.
* No dependency install approval.
* No migration approval.
* A0.6 is complete; **no implementation is authorized** from it — all adoptions remain
  gated (license/security/privacy review; migrations, RLS/auth, token storage, payment
  logic, dependency installs, React/Vite are hard gates).
* Doc-sync follow-up resolved: `docs/specs/README.md` A0.6 entry now reads "Complete".
* **Stage 1 implementation is gated** — the recommended first slice (STAGE1-1 working-tree
  cleanup) and all later implementation slices (env validation, `.env.example`, test
  install/files, idempotency/RLS migrations, CI) require explicit approval; see
  `SPEC-STAGE1-FINAL` §6–§7.
* **Stage 2 is blocked** pending Stage 1 implementation readiness; its plan is drafted but
  no Stage 2 code is authorized (token-storage change, moderation, and React/Vite remain
  hard gates).
* Docs are committed (C1–C3). Pre-existing Stage 0/A0.5 `api/*`+`public/*` diffs remain
  **uncommitted**; STAGE1-1R recommends splitting **C4a** (CORS, Low — safe to commit) /
  **C4b** (chat+children, High — verify) / **C4c** (webhook, High — manual LS replay verify)
  / **C5** (A0.5 frontend); `PROJECT_BRIEF.md` still held out (drift).
* **Two source findings to action later (gated, no source edits yet):** (1) webhook
  idempotency is best-effort only — no UNIQUE on `credit_ledger.stripe_payment_id`, so
  concurrent replay can still double-grant → DB `processed_webhooks` migration (STAGE1-7/8)
  required; (2) the webhook `payment_failed` notification violates the `notifications.type`
  CHECK constraint and fails silently (`.catch`) → fix `type`/CHECK in a future approved slice.

## 7. Do Not Do

* Do not edit app / API / frontend / source files during A0.OS.
* Do not install packages.
* Do not apply migrations.
* Do not deploy.
* Do not continue Stage 1.
* Do not start React / Vite.
* Do not copy public repo code.

## 8. Next Action

Docs are committed (C1–C3) and the **STAGE1-1R source diff review** is drafted. The next
safe action is **GPT/user review of
`docs/specs/SPEC-STAGE1-1R-source-diff-review-before-commit.md`**; then approve a source
commit/review slice — preferred **STAGE1-1C4A — Commit Low-Risk API CORS Changes** (the 7
backward-compatible CORS one-liners), with **STAGE1-1C4R** (backend chat/children/webhook
review + manual LS verification) and **STAGE1-1C5R** (A0.5 frontend flow review) before C4b/
C4c/C5. The Stage 0 `api/*` + A0.5 `public/*` diffs remain **uncommitted and unmodified**;
`PROJECT_BRIEF.md` is held out (drift). Stage 2's first slice (when reached) is the read-only
**STAGE2-A** audit. Do not commit, stage source, reset/revert/stash, start
any Stage 1/Stage 2 implementation, write env-validation code, create `.env.example`, edit
`.gitignore`, install packages, apply migrations, or start React/Vite without approval.

> **Key STAGE1-C findings to action later (all gated):** only
> `LEMONSQUEEZY_WEBHOOK_SECRET` is guarded today; others fail late/silently
> (`CHILD_JWT_SECRET` verify fails closed to `null`; missing `ALLOWED_ORIGIN` → silent
> CORS break). **`.gitignore`'s `.env.*` rule would also ignore a future `.env.example`**
> → add `!.env.example` when creating it. Plan: single `lib/env.js` seam, no-dependency
> validator preferred (Zod = install gate), import- vs request-time split, secret-free
> errors. 3 `console.error` sites (`children.js:196`, `checkout.js:87`/`:93`) log
> error/response objects → needs implementation review. Hardcoded `STORE_ID`/variant
> ids/redirect URL in `checkout.js` are config candidates (not in the 8-var contract).

> **Key STAGE1-B findings to action later (all gated):** no webhook-idempotency table
> (double-grant risk); 15 SECURITY DEFINER fns with no `set search_path`; **exam +
> `knowledge_*` tables not in repo migrations** (implied by code); RLS is parent-scoped
> only (child isolation is app-layer); `credit_ledger` (not `credit_transactions`);
> Stripe-named billing columns despite LemonSqueezy; two child-token localStorage keys.
> `SPEC-000`/`PROJECT_BRIEF` still need reconciliation (out of scope so far).

> **Operating workflow:** Amr's GPT → Claude operating workflow is now documented in
> `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` (created under A0.OS-GPT).
> Read it for any task involving planning, prompts, review, or process.

## 9. Latest Session Log

| Date       | Action                                                                 | Evidence                                              | Next                                                |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| 2026-06-03 | A0.OS — installed project operating docs (CLAUDE.md, tracker, brief, specs index, SPEC-000/A0.5/A0.6). Preserved 4/8 A0.6 research categories into SPEC-A0.6. | `git status` shows only new docs added; `api/*`+`public/*` pre-existing uncommitted changes untouched. | Await approval to continue A0.6 (pending category). |
| 2026-06-03 | A0.OS correction — re-opened SESSION_BRIEF.md and updated it **last** (after specs were written), fixing the execution-order issue. Confirmed: (a) A0.OS docs created; (b) SPEC-A0.6 created with partial research preserved; (c) SaaS-billing + Supabase/auth-security research remains **pending**; (d) A0.OS touched **no source files** (`api/*`/`public/*` untouched); (e) pre-existing Stage 0/A0.5 uncommitted changes still in working tree; (f) a separate "Amr's GPT → Claude operating workflow" doc is still needed (note added in §8). | `git diff --name-only` lists only the pre-existing `api/*`+`public/*` mods (A0.OS docs are untracked, so not shown there); scoped intent-to-add diff confirms only `docs/SESSION_BRIEF.md` + `docs/PROJECT_TRACKER.md` changed. | Next safe action: user approval to continue A0.6 research (pending category). |
| 2026-06-03 | A0.OS-GPT — created `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` documenting Amr's Human + GPT + Claude operating workflow. Updated `docs/specs/README.md` (index) and `docs/PROJECT_TRACKER.md` (decision log + A0.OS-GPT task). Replaced the prior "workflow doc still needed" open note in §8. **No source files changed.** | Scoped diff shows only `docs/` files (SPEC-001, README, tracker, this brief). | Next safe action remains: user approval to continue A0.6 research (pending category). |
| 2026-06-03 | A0.6 continued — completed the final 2 research categories (SaaS billing/trial/checkout + Supabase auth/RLS/security; 16 sources). Folded findings into `SPEC-A0.6` (candidate tables for Cat 3 & 4, shortlist rows, Q4/Q7 picks, billing + Supabase/security lessons, roadmap rows, what-to-avoid), flipped its status to **Complete (8/8)**. Updated `PROJECT_TRACKER.md` (A0.6 + A0.6-R status, decision/finding). **No source files changed; no code copied; no installs/migrations.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped intent-to-add diff confirms only `docs/SPEC-A0.6 + PROJECT_TRACKER + SESSION_BRIEF` changed. | Next safe action: user approval to draft a Stage 1 test/schema/tooling **planning** spec (docs only). |
| 2026-06-03 | A0.6 README sync correction — updated the A0.6 entry in `docs/specs/README.md` from "In progress (4/8)" to "Complete (8/8)". Docs-only. **No source files changed.** | Scoped diff shows only `docs/specs/README.md` + this brief. | Next safe action unchanged: approval to draft Stage 1 planning spec (docs only). |
| 2026-06-03 | Tracker status sync — updated the A0.OS workstream row in `docs/PROJECT_TRACKER.md` from "In progress (this task)" to "Complete / accepted" (current task: "Operating docs installed"). Docs-only. **No source files changed.** | Scoped diff shows only `docs/PROJECT_TRACKER.md` + this brief. | Next safe action: GPT/user review of Stage 1 planning spec, then STAGE1-A. |
| 2026-06-03 | STAGE1-1R — read-only review of all 14 uncommitted source diffs (`git diff` per file + schema/lib cross-checks; no mutation) → created `docs/specs/SPEC-STAGE1-1R-source-diff-review-before-commit.md` (per-file risk, cross-file interactions, C4a/C4b/C4c/C5 split recommendation, manual verification checklist, gates). Findings: 7 CORS one-liners (Low, C4a); `chat.js` credit-count reorder + notif dedup (High, C4b); `children.js` unsigned→HMAC token verify + service-role consolidation (High, security-positive, C4b); `lemonsqueezy.js` best-effort idempotency (no UNIQUE on `credit_ledger.stripe_payment_id` → race) + logging cut + `message`→`body`, and **`payment_failed` violates `notifications.type` CHECK (silently caught)** (High, C4c). Updated `SPEC-STAGE1-1` (§13a), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 row + STAGE1-1A/1R task rows). **No staging; no commits; no source/files reset/reverted/stashed; no source changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite.** | `git status --short`: 14 `M` source + `?? PROJECT_BRIEF.md`; `git diff --cached` empty; HEAD `d5f7d0d`; only allowed docs edited (now uncommitted). | Next safe action: GPT/user review of STAGE1-1R, then approve STAGE1-1C4A (commit low-risk CORS) or STAGE1-1C4R/1C5R review slices. |
| 2026-06-03 | STAGE1-1A — committed the 15 approved docs in **3 waves** with a programmatic staged-set guard: `590e67b` operating docs (CLAUDE.md + tracker/brief/README + SPEC-000/001), `09b8142` A0.6+Stage 1 readiness (SPEC-A0.5/A0.6/STAGE1/A/B/C/FINAL/1), `d5f7d0d` Stage 2 plan (SPEC-STAGE2). Safety-scanned docs (no real secrets; no false impl claims). **No source staged/committed; `PROJECT_BRIEF.md` excluded; no source changed; no installs/tests/build/SQL/migrations/deploy.** | `git log --oneline -3` = the 3 docs commits atop `f5e6028`; `git diff --cached` empty post-commit; 14 source files still `M`/uncommitted; guard confirmed no source/forbidden file in any commit. | Next safe action: STAGE1-1R source diff review. |
| 2026-06-03 | STAGE1-1 — read-only `git` diff audit of all 14 uncommitted source files (`git status/diff/log`, no mutation) + untracked `docs/` inventory → created `docs/specs/SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md` (source inventory, docs inventory, workstream classification, commit-strategy Options A/B/C, file-listed commit plan C1–C5, review gates, safe example git commands, risks, next prompt). Classified: 7×CORS one-liner + `chat.js` credit-count/notif-dedup + `children.js` HMAC token verify/service-role consolidation + `lemonsqueezy.js` idempotency/logging/field-fix = Stage 0; 4×`public/*` trial copy + pendingPlan persistence + activation UX = A0.5. Updated `SPEC-STAGE1-FINAL` (§9a), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-1 row). **No commits; no files staged; no source/docs files reset/reverted/stashed; no source changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite.** | `git status --short`: 14 `M` source + `?? CLAUDE.md PROJECT_BRIEF.md docs/`; `git diff --name-only` = same 14 source (unchanged by this task); only the allowed docs were edited (under untracked `docs/`). | Next safe action: GPT/user review of STAGE1-1, then approve STAGE1-1A (docs-only commit) or STAGE1-1R (source-diff review). |
| 2026-06-03 | STAGE1-FINAL + STAGE2-P — reconciled STAGE1-P/A/B/C and created the Stage 1 readiness package `docs/specs/SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md` (scope completed, baseline, key findings, STAGE1-1…13 backlog with risk/approval/source-file flags, hard gates, implemented-Stage-1 acceptance, first slice = STAGE1-1) + the full Stage 2 plan `docs/specs/SPEC-STAGE2-child-chat-ux-master-plan.md` (tutor UX flow, chat-UI/tutoring/safety/credit requirements, static-vs-React options, A0.6 inspiration map, STAGE2-A…J slices, tests, acceptance, risks). Confirmed STAGE1-C already complete (not recreated). Updated `SPEC-STAGE1` (§4.4), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1+STAGE2 rows, STAGE1-FINAL+STAGE2-P tasks). **Docs-only; no source files changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite; no secret values read; `.env.example` not created.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; new specs + doc edits live under the (already-untracked) `docs/`. | Next safe action: GPT/user review of the Stage 1 final package + Stage 2 plan; then STAGE1-1 working-tree cleanup before any implementation. |
| 2026-06-03 | STAGE1-C — read-only env/secret inventory (grep `process.env` across `api`+`lib`: 8 vars / 18 sites; 0 refs in `public/`) → created `docs/specs/SPEC-STAGE1-C-env-secret-validation-plan.md` (per-var inventory, secret classification, exposure/logging review, fail-fast validation plan, `.env.example` proposal + `.gitignore` `.env.*` caveat, future tests, next slice). Updated `SPEC-STAGE1` (§4.3), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 row + STAGE1-C task + decision-log finding). **Read-only; no source files changed; no `.env*` read/created; no secret values printed; no installs/tests/build/SQL/migrations/deploy.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; new spec + doc edits live under the (already-untracked) `docs/`; `.env.example` confirmed still absent. | Next safe action: GPT/user review of STAGE1-C, then (if approved) docs-only STAGE1-G or STAGE1-D. |
| 2026-06-03 | STAGE1-B — read-only schema/RLS/API inventory of `001_initial_schema.sql` + all `api/*`/`lib/*` + frontend touchpoints → created `docs/specs/SPEC-STAGE1-B-schema-rls-api-inventory.md` (11 tables, 13 RLS policies, 14 SECDEF fns, 2 triggers, endpoint→data map, env inventory, 9-item drift register). Updated `SPEC-STAGE1` (§4.2 note), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-B row). **Read-only; no source files changed; no SQL/Supabase/migrations; no installs/tests/build.** Findings: missing idempotency table, SECDEF search_path gap, exam/knowledge tables not in repo, parent-only RLS. | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 5 allowed `docs/` files changed; root `README.md`/package/vercel untouched. | Next safe action: GPT/user review of STAGE1-B, then (if approved) docs-only STAGE1-C. |
| 2026-06-03 | STAGE1-A — Phase 0 confirmed A0.OS tracker already in sync (no change). Phase 1 read-only audit (git/package/vercel/api/frontend/lib/supabase/tests/CI/env) → created `docs/specs/SPEC-STAGE1-A-read-only-tooling-baseline-audit.md`. Updated `SPEC-STAGE1` (audit note + corrected `credit_ledger`/table list), specs `README.md` (index), `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-A row). **Read-only; no source files changed; no installs/tests/build; no SQL/migrations.** Material finding: schema doc-drift + missing webhook-idempotency table. | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 5 allowed `docs/` files changed; root `README.md` untouched. | Next safe action: GPT/user review of STAGE1-A, then (if approved) docs-only STAGE1-B. |
| 2026-06-03 | STAGE1-P — drafted `docs/specs/SPEC-STAGE1-test-schema-tooling-plan.md` (test baseline, schema docs, env validation, webhook-idempotency design, RLS/security plan, tooling/deps, CI, AI mocking, slices STAGE1-A…J, risk register, dependency-approval list). Updated `docs/specs/README.md` (index) and `docs/PROJECT_TRACKER.md` (STAGE1 status + STAGE1-P task). Read-only repo inspection only. **No source files changed; no packages installed; no migrations; no SQL.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 4 allowed `docs/` files changed; root `README.md` untouched. | Next safe action: GPT/user review of the Stage 1 planning spec, then (if approved) STAGE1-A read-only audit. |
