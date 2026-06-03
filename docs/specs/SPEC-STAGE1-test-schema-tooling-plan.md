# SPEC-STAGE1 — Test / Schema / Tooling Planning Spec

> **Planning / docs only.** This spec defines the safest plan for Stage 1 *before* any
> implementation. Nothing here authorizes code changes, package installs, migrations,
> SQL, or deployment. Every implementation slice below requires its own approved prompt.
> See `SPEC-001-human-gpt-claude-operating-flow.md` for the operating loop and
> `SPEC-A0.6-public-repo-benchmark.md` for the research this plan draws on.

**Status:** Drafted / awaiting GPT and user review. No implementation authorized.
**Last Updated:** 2026-06-03

## 1. Purpose

Stage 1 is a **stabilization and safety-planning stage** that comes before any further
product work (child chat UX, parent dashboard, landing/pricing, advanced learning). Its
job is to put a safety net under the existing Stage 0 / A0.5 work — automated tests,
documented schema, validated environment, and CI — so that later changes to
payment/credit, auth/RLS, and AI behavior can be made with confidence and evidence.
This document is the **plan**; implementation happens later, slice by slice, only after
approval.

## 2. Scope

Stage 1 covers the planning and (later, with approval) safe implementation of:

* a **test baseline** for the serverless API surface
* **schema documentation** (tables, relationships, RLS, RPCs)
* **environment-variable validation**
* **webhook idempotency design** (no code change in this spec)
* **RLS / security checks** (tests + documentation, not migrations)
* **CI / tooling** setup
* **AI mocking / evaluation** strategy (no real provider calls)
* **payment / credit safety tests** (against the existing logic, not changing it)

## 3. Non-Goals

Stage 1 explicitly does **not** include:

* React / Vite migration
* UI redesign
* payment-logic implementation or refactor
* webhook code changes
* RLS migrations or any DB migrations
* package installation without explicit approval
* any source-code changes during this planning task
* deployment

## 4. Current Repo Observations (read-only)

Verified by read-only inspection on 2026-06-03:

* **Stack:** Node ESM (`"type": "module"`), Vercel serverless. Dependencies:
  `@supabase/supabase-js ^2.45.0`, `openai ^4.56.0`. No dev dependencies.
* **package scripts:** only `"dev": "vercel dev"`. No `test`, `lint`, `build`, or
  `typecheck` scripts.
* **Tests:** **none found** — no `*.test.*` / `*.spec.*` files; no Vitest/Jest/Playwright
  config; no ESLint/Prettier config present.
* **API surface (10 functions):** `api/chat.js`, `api/children.js`, `api/exams.js`,
  `api/auth/profile.js`, `api/auth/child-login.js`, `api/sessions/create.js`,
  `api/sessions/history.js`, `api/webhooks/lemonsqueezy.js`, `api/credits/balance.js`,
  `api/credits/checkout.js`.
* **Shared libs (4):** `lib/prompts.js`, `lib/child-auth.js`, `lib/supabase.js`,
  `lib/rate-limit.js`.
* **Migrations:** one file — `supabase/migrations/001_initial_schema.sql` (~29 KB).
  The full live schema/RLS/RPC set is **unknown from the repo alone** (RPCs like
  `verify_child_login`, `set_child_password`, `deduct_credit`, `add_credits` are
  referenced in docs but their definitions must be confirmed against the actual
  Supabase project — mark as **unknown / to verify**).
* **CI:** only `.github/workflows/knowledge-pipeline.yml` (the knowledge pipeline). **No
  application CI** (no test/lint workflow).
* **Docs:** operating docs exist (`CLAUDE.md`, `docs/PROJECT_TRACKER.md`,
  `docs/SESSION_BRIEF.md`, `docs/specs/*`), plus legacy `PROJECT_BRIEF.md`,
  `IMPLEMENTATION_SUMMARY.md`, `DEPLOYMENT_CHECKLIST.md`, `SETUP_GUIDE.md`.
* **Working-tree caveat:** `api/*` (10 files) and `public/*` (4 files) are **modified
  but uncommitted** (Stage 0 / A0.5 work), plus untracked `PROJECT_BRIEF.md`. These
  predate Stage 1 and must **not** be touched by Stage 1; they should be reviewed and
  committed under S0 / A0.5 first to avoid confusing later diffs.

> Unknowns are marked as such above; this spec does not overclaim live DB/Supabase
> configuration that cannot be verified from the repo.

### 4.1 Audit update (STAGE1-A, 2026-06-03)

The read-only **STAGE1-A** audit is complete — see
`SPEC-STAGE1-A-read-only-tooling-baseline-audit.md`. It confirmed: no tests/CI/lint
tooling, no lockfile/`node_modules`, AI client scattered across `api/chat.js` +
`api/exams.js`, and **no webhook-idempotency table** in the schema. It surfaced one
**material doc-drift finding**: the live migration uses **`credit_ledger`** (not
`credit_transactions`), has **no `knowledge_*` tables** in repo, and adds
consent/DSAR/notifications/report tables the brief under-describes. **Recommended
immediate next slice: `STAGE1-B — Schema / RLS / API Inventory Documentation`** (docs/
read-only) to reconcile this drift before any tooling install. No implementation
authorized by the audit.

### 4.2 Inventory update (STAGE1-B, 2026-06-03)

The read-only **STAGE1-B** schema/RLS/API inventory is complete — see
`SPEC-STAGE1-B-schema-rls-api-inventory.md`. Major findings: 11 tables / 13 RLS policies
(all **parent-scoped raw `auth.uid()`**, **no child-role policies** → child isolation is
app-layer, not RLS) / 14 functions (**all SECURITY DEFINER, 0 `set search_path`** —
hardening gap) / 2 triggers; the **exam tables** (`exams`/`exam_questions`/
`exam_attempts`/`exam_answers`) and **`knowledge_*` RAG tables** are **not in repo
migrations** (used by code → `Implied by code / not verified`); `subscriptions`/
`credit_ledger` carry **Stripe-named columns + `trialing` status** despite LemonSqueezy;
two `verify_child_login` definitions; two child-token localStorage keys (`child_token`
vs `zeluu_child_token`). **Recommended next slice: `STAGE1-C — Env Var / Secret
Validation Plan`** (docs/plan). No implementation authorized.

### 4.3 Env / secret validation plan (STAGE1-C, 2026-06-03)

The docs-only **STAGE1-C** env/secret validation plan is complete — see
`SPEC-STAGE1-C-env-secret-validation-plan.md` (this supersedes the high-level sketch in
§5.5 below). Confirmed by read-only grep: **8 distinct server env vars** across 18
reference sites; **0** `process.env`/`import.meta.env`/`VITE_` references in `public/`
(no secrets read in the browser). Key findings: **only `LEMONSQUEEZY_WEBHOOK_SECRET` has
an explicit guard today** (`if (!secret) throw`); all others fail late, generically, or
partly silently (`CHILD_JWT_SECRET` verify fails closed to `null`; `ALLOWED_ORIGIN`
missing → silent CORS break). **`.gitignore`'s `.env.*` rule would also ignore a future
`.env.example`** (needs a `!.env.example` negation when created). `STORE_ID`, 11 LS
variant ids, and a `https://zeluu.com` redirect fallback are **hardcoded** in
`api/credits/checkout.js` (config candidates for later, not in the current 8-var
contract). No direct secret-name logging found, but three `console.error` sites
(`children.js:196`, `checkout.js:87`, `checkout.js:93`) log error/response objects →
**needs implementation review**. Plan: a single `lib/env.js` seam, **no-dependency
custom validator preferred** (Zod = dependency-install hard gate), import-time vs
request-time split, secret-free fail-fast messages. **Recommended next slice: `STAGE1-G`
(webhook-idempotency design) or `STAGE1-D` (test-tooling proposal).** No implementation
authorized.

### 4.4 Stage 1 planning/readiness package closed (STAGE1-FINAL + STAGE2-P, 2026-06-03)

Stage 1's **planning/readiness package is complete** — see
`SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md`, which reconciles STAGE1-P/A/B/C
into a single readiness artifact (scope completed, baseline, key findings, a STAGE1-1…13
implementation backlog with risk/approval/source-file flags, hard gates, implemented-Stage-1
acceptance criteria, and the recommended first implementation slice). The full **Stage 2**
child-chat-UX plan is now drafted in `SPEC-STAGE2-child-chat-ux-master-plan.md` (goal,
principles, tutor UX flow, chat-UI/tutoring/safety/credit requirements, static-vs-React
options, A0.6 inspiration mapping, STAGE2-A…J workstreams + slices, testing plan,
acceptance criteria, risks). **Stage 1 implementation has not started.** Recommended next
action: GPT/user review of the Stage 1 final package and the Stage 2 plan, then — before
any implementation — **`STAGE1-1 — Working-Tree Cleanup and Commit Plan`** (the repo still
carries pre-existing uncommitted Stage 0/A0.5 `api/*`+`public/*` changes). No
implementation authorized.

## 5. Stage 1 Workstreams

### 5.1 Test Baseline Plan
Likely later tests (all with mocked external services — see 5.8):
* **Serverless API tests** for each function's contract (status codes, shape, auth gating).
* **`api/auth/profile.js`** — parent auth required; returns expected profile shape.
* **`api/auth/child-login.js`** — valid creds → token; invalid → 401; rate-limit path.
* **`api/credits/balance.js`** — dual-auth; correct balance/transactions/subscription shape.
* **`api/credits/checkout.js`** — builds checkout with correct custom_data; auth required.
* **`api/webhooks/lemonsqueezy.js`** — signature valid/invalid/tampered; idempotent
  replay grants credits once (see 5.3).
* **`api/sessions/create.js`** — ownership verification via parentId; auth required.
* **`api/sessions/history.js`** — only own sessions returned.
* **`api/children.js`** — list/add/set-credentials/delete; parent-only; validation rules.
* **`api/chat.js`** — with **mocked OpenAI**: prompt assembly, RAG block injection,
  credit deduction call, response persistence; rate-limit path.
* **`lib/child-auth.js`** — `signChildToken`/`verifyChildToken` round-trip, expiry,
  tampered-signature rejection; `getChildOrUser` precedence (parent first, child JWT
  fallback).
* **`lib/rate-limit.js`** — window/limit behavior, 429 emission.
* **Negative / error tests** across all endpoints (missing auth, malformed body, wrong
  method, CORS preflight).

### 5.2 Schema Documentation Plan
Document (no migration creation in this task; later as a docs export, read-only against
the project):
* tables and columns (per STAGE1-A: `profiles`, `children`, `sessions`, `messages`,
  `subscriptions`, `credit_ledger`, `notifications`, `consent_records`,
  `data_subject_requests`, `report_subscriptions`, `weekly_reports`; verify whether
  `knowledge_*` RAG tables live outside repo migrations)
* relationships (parent→child, session→messages, subscription→parent)
* **RLS policies** per table (who can read/write)
* **`SECURITY DEFINER` functions / RPCs** (`verify_child_login`, `set_child_password`,
  `deduct_credit`, `add_credits`, `match_knowledge_chunks`, etc.) — confirm definitions
* triggers (if any)
* the **credit ledger** model (`credit_ledger` table; `deduct_credit` /
  `get_valid_credit_balance` RPCs)
* **subscription state** lifecycle fields (status, trial_ends_at, renews_at, ends_at)
* the **parent-child relationship** access model
* **audit-log redaction** expectations (no child PII / messages)
* a **migrations inventory** (currently just `001_initial_schema.sql`; note any drift
  between the migration file and the live project as a finding).

### 5.3 Payment / Webhook / Credit Safety Plan
Plan future **tests and a design spec** (not code changes) for:
* raw-body HMAC-SHA256 signature verification (verify before JSON parse)
* timing-safe comparison (`crypto.timingSafeEqual`)
* **webhook idempotency** — a `processed_webhooks` table keyed by the LS event id with
  `INSERT ... ON CONFLICT DO NOTHING`, dedup + credit grant in **one transaction**
* exactly-once trial credit grant (the 10 free credits granted once per order)
* retry safety / duplicate delivery (at-least-once delivery assumption)
* checkout-abandoned state (no credits without a paid/verified event)
* webhook-delayed state (pending "activating your trial" UX; poll own DB)
* subscription lifecycle states (`on_trial`/`active`/`past_due`/`unpaid`/`cancelled`/
  `expired`/`paused`; grant access except `expired`)
* **LemonSqueezy vs Stripe** event/status differences (do not copy Stripe names)

> **High risk.** Any change to payment/webhook/credit **implementation** is a hard gate
> requiring explicit approval, a rollback plan, and manual Lemon Squeezy verification.
> Stage 1 may add **tests around existing behavior** and a **design spec**, but must not
> alter the logic without a separate approved high-risk prompt.

### 5.4 Supabase Auth / RLS / Security Plan
Plan future **tests and documentation** (not migrations) for:
* service-role key is **server-only**; never in frontend / `*_PUBLIC` / `VITE_*` / logs
* RLS **enabled** on every table holding parent/child data
* a parent can access only their own children
* a child cannot access another child's or another family's data
* role-scoped policies (`TO authenticated`, not `public`)
* `(select auth.uid())` performance wrapping pattern
* indexed policy columns / parent FKs
* `security definer set search_path = ''` helper pattern (non-recursive RLS)
* no PII in logs; audit redaction

> **High risk.** RLS / auth migrations are a hard gate requiring explicit approval.
> Stage 1 may **document** current RLS and **write tests** (e.g. pgTAP against a local /
> branch DB with synthetic data), but must not create or apply RLS migrations here.

### 5.5 Environment Validation Plan
Plan a future fail-fast validation (e.g. a small Zod schema parsed at module load) for
required env vars — **do not edit env files**, **do not print secret values**:
* `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
* `OPENAI_API_KEY`
* `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET`, and store/variant IDs (if used)
* `CHILD_JWT_SECRET` (HMAC secret)
* allowed origin / CORS origin (`ALLOWED_ORIGIN`)
* app URL / checkout success/cancel URLs
Validation must fail closed (a function must refuse to boot without its signing secret)
and must never log secret values.

### 5.6 Tooling / Dependencies Plan
Recommended future tools (evaluated in A0.6). **None installed by this task.**

| Tool | Why useful | Risk | Dependency approval required? | Can wait? |
|------|-----------|------|-------------------------------|-----------|
| **Vitest** | Fast ESM unit/integration runner for serverless fns | Low | Yes | First batch |
| **MSW** | Network-level mocking of OpenAI/LS; `onUnhandledRequest:'error'` blocks real calls | Low | Yes | First batch |
| **Zod** | Fail-fast env + payload validation | Low | Yes | First batch |
| **Supabase CLI + pgTAP** (+ supabase-test-helpers) | RLS isolation tests at DB layer | Med (local DB tooling) | Yes | Second batch |
| **ESLint + Prettier** | Lint/format (none present today) | Low | Yes | Optional, early |
| **GitHub Actions (app CI)** | Run lint+tests on PR/main | Low | No install (config only) — approval to add workflow | After first tests |
| **Playwright** | E2E smoke; best after frontend stabilizes | Med | Yes | Later (post-frontend) |
| **@axe-core/playwright + Lighthouse CI** | a11y / perf budgets | Low/Med | Yes | Later (with new frontend) |
| **promptfoo** | AI safety/age-appropriateness regression eval | Low | Yes | After unit baseline |

### 5.7 CI Plan
Plan future CI stages (config only, added with approval — no real external calls):
* install (cached)
* lint (ESLint/Prettier) and optional typecheck
* unit tests (Vitest)
* API tests (Vitest + MSW; `onUnhandledRequest:'error'`)
* optional RLS tests (Supabase `test db` / pgTAP on a local/branch DB)
* optional Playwright smoke (later)
* optional accessibility (later)
* **No real external API calls, no production DB, no real payment webhooks.** Secrets
  via CI secret store only; never echoed.

### 5.8 AI Testing / Mocking Plan
Avoid all real OpenAI / provider calls in tests:
* **mocked LLM responses** (MSW handlers / `vi.mock`) — deterministic fixtures
* **snapshot / golden outputs** where output shape is stable
* **safety / moderation** test cases (distress, PII-sharing, jailbreak redirect)
* **Arabic + English** test cases (RTL/locale-aware prompt assembly)
* a small **math-correctness** sample set (answers checked, not the model)
* **child age-appropriate tone** checks (no answer-dumping before the allowed release
  level; word-count / participation-prompt expectations)

### 5.9 Manual Verification Plan
Still required from the user / dashboards (external gates):
* Lemon Squeezy: trial requires card; 14-day length; **all** subscription variants
* Lemon Squeezy: webhook events enabled and reaching the endpoint
* Checkout success/cancel URLs (`/dashboard.html?payment=success`)
* Vercel env vars present (incl. `ALLOWED_ORIGIN`, `CHILD_JWT_SECRET`)
* Supabase project settings (RLS on; RPC definitions confirmed)
* Production CORS origin correct
* No service-role exposure anywhere client-side

## 6. Proposed Stage 1 Implementation Slices

Each slice is a separate future prompt. **Planning/docs-only slices** can proceed at low
risk; **implementation slices** require explicit approval (and high-risk ones a rollback
plan + manual verification).

| Slice | Title | Type | Approval to implement? |
|-------|-------|------|------------------------|
| STAGE1-A | Read-only tooling / scripts / test-baseline audit | Read-only | No (read-only) |
| STAGE1-B | Schema / RLS / RPC documentation export | Docs (read-only against project) | No edits; verify-only |
| STAGE1-C | Env validation plan + var inventory (no install, no env edits) | Docs/plan | No |
| STAGE1-D | Test tooling proposal + dependency list (no install) | Docs/plan | No |
| STAGE1-E | Install approved test tools (Vitest/MSW/Zod) | Implementation | **Yes** (dependency install gate) |
| STAGE1-F | Add API tests with mocked OpenAI/LS | Implementation | **Yes** (creates test files) |
| STAGE1-G | Webhook idempotency **design spec** (no code) | Docs/plan | No (design only) |
| STAGE1-H | RLS / security test plan (pgTAP, synthetic data) | Plan → later impl | Plan: No · Tests: **Yes** |
| STAGE1-I | CI proposal (workflow config) | Plan → later impl | Plan: No · Workflow: **Yes** |
| STAGE1-J | Final Stage 1 acceptance checklist | Docs | No |

**Planning-only:** STAGE1-A, B, C, D, G, J (and the plan halves of H, I).
**Require approval to implement:** STAGE1-E (installs), STAGE1-F (test files), the
implementation halves of STAGE1-H (DB tests) and STAGE1-I (CI workflow). Any actual
payment/webhook/credit or RLS/auth/token **logic** change is out of Stage 1's default
scope and needs its own high-risk approved prompt.

## 7. Risk Register

| Risk | Area | Severity | Why it matters | Mitigation | Approval required |
|------|------|----------|----------------|------------|-------------------|
| Double credit grant | Payment/credit | High | Re-delivered webhook grants 10 credits twice | `processed_webhooks` UNIQUE event id + same-txn grant; idempotency tests | Yes (logic change) |
| Webhook replay | Payment | High | At-least-once delivery → duplicate side effects | Idempotency store; verify signature on raw body | Yes |
| Service-role exposure | Security | Critical | Key bypasses RLS; leak = full data access | Audit server-only usage; never in frontend/`*_PUBLIC`/logs | Yes (if any change) |
| Broad / disabled RLS | Security | High | Anon key reads everything if RLS off / `public` policy | RLS-enabled + role-scoped tests; document policies | Yes (migrations) |
| Child data leakage | Privacy | High | Parent/child isolation failure exposes a child's data | Negative RLS tests (cross-family blocked); no PII logs | Yes (RLS) |
| Tests hitting production services | Testing | High | Could mutate real data / spend / leak | MSW `onUnhandledRequest:'error'`; local/branch DB; synthetic data | No (test design) |
| Real OpenAI calls in tests | Testing/cost | Medium | Cost + non-determinism + child content to provider | Mock all LLM calls; golden fixtures | No |
| Uncommitted source changes | Process | Medium | Pre-existing `api/*`/`public/*` diffs confuse Stage 1 diffs | Review/commit under S0/A0.5 before Stage 1 impl | User decision |
| Dependency install without approval | Tooling/supply-chain | Medium | Unvetted packages / scope creep | Install only the approved list (STAGE1-E) | Yes |
| Migration drift | Schema | Medium | Repo migration ≠ live schema | Document drift in STAGE1-B; reconcile before new migrations | Yes (migrations) |
| React/Vite scope creep | Architecture | Medium | Stage 1 is not a migration | Hard non-goal; reject in-slice | Yes (separate decision) |

## 8. Dependency Approval List

To approve **later** (do **not** install now):

| Package / tool | Purpose | Stage slice | Risk | Approval needed |
|----------------|---------|-------------|------|-----------------|
| `vitest` | Test runner | STAGE1-E/F | Low | Yes |
| `msw` | Network mocking (no real API calls) | STAGE1-E/F | Low | Yes |
| `zod` | Env + payload validation | STAGE1-E (+env plan) | Low | Yes |
| `supabase` CLI + pgTAP / supabase-test-helpers | RLS DB tests | STAGE1-H | Med | Yes |
| `eslint` + `prettier` (+ configs) | Lint/format | STAGE1-E (optional) | Low | Yes |
| `@playwright/test` | E2E smoke (later) | post-frontend | Med | Yes |
| `@axe-core/playwright`, Lighthouse CI | a11y/perf (later) | post-frontend | Low/Med | Yes |
| `promptfoo` | AI safety eval | after unit baseline | Low | Yes |

## 9. Acceptance Criteria for Stage 1 Planning

This planning spec is accepted when:
* no source files are changed
* no packages installed
* no migrations created
* Stage 1 slices are clear
* hard gates are identified
* the next prompt is safe and narrow
* tracker and session brief are updated
* session brief updated last

## 10. Recommended Next Prompt

```
# STAGE1-A — Read-only Tooling / Scripts / Test Baseline Audit

Type: Read-only audit (no edits). Risk: Low.

Read first: CLAUDE.md, docs/SESSION_BRIEF.md, docs/PROJECT_TRACKER.md,
docs/specs/SPEC-STAGE1-test-schema-tooling-plan.md.

Task: Produce a read-only audit of the current tooling and test-readiness:
- enumerate package.json scripts and dependencies/devDependencies
- confirm absence/presence of test runner, lint, typecheck, CI-for-app
- list every api/* and lib/* file with its external dependencies (Supabase, OpenAI,
  LemonSqueezy, crypto) and which env vars each reads
- note the single migration file and flag that live schema/RLS/RPCs need verification
- restate the pre-existing uncommitted api/*/public/* working-tree caveat
Output a findings report only. Optionally (only if approved) update
docs/specs/SPEC-STAGE1-... with an "Audit findings" subsection.

Hard stops: do not install packages, do not create test files, do not edit source
files, do not run tests/build, do not run SQL/migrations, do not deploy, do not start
React/Vite, do not copy public repo code. Read-only or docs-only.
```

## 11. Status

**Drafted / awaiting GPT and user review. No implementation authorized.**
