# SPEC-STAGE1-A — Read-Only Tooling / Scripts / Test Baseline Audit

> Evidence-based snapshot of the current repo **before** any Stage 1 implementation.
> Read-only + docs-only. All observations were gathered with safe read-only commands
> (no installs, no tests, no build, no SQL, no network calls). Companion to
> `SPEC-STAGE1-test-schema-tooling-plan.md`.

**Status:** Drafted / awaiting GPT and user review. No implementation authorized.
**Audit date:** 2026-06-03

## 1. Purpose

Record the exact current baseline of the Zeluu repo (tooling, scripts, API/frontend/
lib structure, schema, tests/CI, env usage) so Stage 1 implementation can be planned
against verified facts rather than assumptions, and so doc-drift is surfaced before any
code is written.

## 2. Scope

Read-only inspection and documentation only. No source files were changed, no packages
installed, no tests/build run, no SQL/migrations executed, no deployment, no external
service calls.

## 3. Non-Goals

This audit did **not**: implement tests · install packages · edit source files · change
package scripts · run tests · run build · apply migrations · run SQL · deploy · start
React/Vite · copy public repo code.

## 4. Git / Worktree Baseline

* **Branch:** `main`.
* **Staged:** nothing (`git diff --cached` empty).
* **Tracked modified (pre-existing, NOT this task) — 14 files:** `api/auth/child-login.js`,
  `api/auth/profile.js`, `api/chat.js`, `api/children.js`, `api/credits/balance.js`,
  `api/credits/checkout.js`, `api/exams.js`, `api/sessions/create.js`,
  `api/sessions/history.js`, `api/webhooks/lemonsqueezy.js`, `public/dashboard.html`,
  `public/index.html`, `public/login.html`, `public/pricing.html` (Stage 0 / A0.5 work).
* **Untracked:** `CLAUDE.md`, `PROJECT_BRIEF.md`, `docs/` (the operating docs + specs are
  not yet committed).
* **Recent commits:** mobile-layout fix, service-worker cache fixes, child-app/session
  fixes, subscription-lifecycle enforcement.
* **Caution:** the 14 modified source files must **not** be confused with Stage 1 work,
  staged, formatted, or committed by Stage 1 tasks. They should be reviewed/committed
  under S0 / A0.5 first to keep future diffs clean.

## 5. Package / Script Baseline

* **Name/type:** `ai-math-tutor`, `"type": "module"` (ESM), `private: true`.
* **Scripts:** only `"dev": "vercel dev"`. **No `test`, `lint`, `build`, or `typecheck`.**
* **dependencies:** `@supabase/supabase-js ^2.45.0`, `openai ^4.56.0`. **No
  devDependencies.**
* **Testing libs:** none. **Validation libs (Zod/etc.):** none. **AI SDK:** `openai`.
  **Supabase SDK:** `@supabase/supabase-js`. **Lemon Squeezy SDK:** none (webhook uses
  Node `crypto` directly).
* **Package manager / lockfile:** **no lockfile** (`package-lock.json`/`yarn.lock`/
  `pnpm-lock.yaml` absent); **no `node_modules`**. Manager not pinned (npm assumed via
  Vercel). → A lockfile should be produced when the first approved install happens.

## 6. Vercel / API Baseline

* **Routing:** `vercel.json` v2; `api/**/*.js` functions with `maxDuration: 30`; HTML
  rewrites for `/login`, `/child-login`, `/app`, `/dashboard`, `/pricing`,
  `/verify-email`, `/privacy`, `/terms`, `/refund`, `/gdpr`.
* **Security headers:** strong — CSP (self + jsdelivr/unpkg scripts, Supabase +
  Lemon Squeezy connect/frame), `X-Content-Type-Options: nosniff`, `X-Frame-Options:
  DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and
  `Permissions-Policy: camera=(), microphone=(), geolocation=()` (**geolocation already
  off — aligns with ICO Children's Code Std 10**).
* **Endpoints (10, all ESM):** `auth/child-login`, `auth/profile`, `chat`, `children`,
  `credits/balance`, `credits/checkout`, `exams`, `sessions/create`, `sessions/history`,
  `webhooks/lemonsqueezy`.
* **Shared-helper pattern (good):** every function imports from `lib/` —
  `lib/supabase.js` (`createServerClient`/`createAuthClient`/`getUser`), `lib/child-auth.js`
  (`getChildOrUser`/`getParentId`/`signChildToken`/`verifyChildToken`), `lib/prompts.js`,
  `lib/rate-limit.js`.
* **Webhook:** `api/webhooks/lemonsqueezy.js` imports Node `crypto` + `createServerClient`
  → HMAC signature verification done in-function (consistent with A0.6 raw-body pattern).
* **AI client (scattered):** `OpenAI` is instantiated directly in **`api/chat.js`** and
  **`api/exams.js`** (not centralized in `lib/`). → Tests must mock the `openai` module
  in **two** entry points; a future `lib/ai.js` wrapper would simplify mocking/routing.

## 7. Frontend Baseline

* **Type:** static HTML + vanilla JS. **No React/Vite** (no `react`/`vite`/`createRoot`
  markers anywhere in `public/`).
* **Files:** `index/app/child-login/dashboard/login/pricing/exam-prep/verify-email` +
  legal pages, `manifest.json`, `sw.js`, `css/`, `icons/`, and `public/js/supabase-config.js`.
* **Supabase in browser:** `pricing/login/dashboard/verify-email/sw.js` +
  `js/supabase-config.js` reference Supabase directly (parent auth). `supabase-config.js`
  hardcodes the Supabase URL + **anon/publishable key** — public by design, **safe only
  if RLS is enforced on every table** (verify in STAGE1-B). No service-role key client-side
  (server env grep shows service-role used only server-side — good).
* **Script structure:** `pricing/login/dashboard` use ~2 external `<script src>` each
  (Supabase CDN + config) plus inline logic; `index/app/child-login` are inline-only. →
  Auth/trial/dashboard logic lives in **inline page scripts**, so current frontend
  **testability is low** (no modules, no test harness, logic coupled to the DOM).
* **a11y/RTL/i18n:** prompts support EN/AR server-side, but no visible structured
  frontend i18n/RTL framework — to assess later.

## 8. Shared Library Baseline

* **`lib/supabase.js`** — centralizes client creation: `createServerClient()` (service
  role), `createAuthClient(req)` (per-request bearer), `getUser(req)`. **Single seam to
  mock Supabase.**
* **`lib/child-auth.js`** — `crypto`-based JWT: `signChildToken`/`verifyChildToken` +
  dual-auth `getChildOrUser`/`getParentId`/`getChildId`. **Single seam for auth tests.**
* **`lib/prompts.js`** — large: `getSystemPrompt(...)`, `BLOCKED_PATTERNS`,
  `checkForBlockedContent`, `detectStuckLoop`, `detectChildDistress`, `detectPersonalInfo`,
  curriculum maps, `CHILD_SAFETY`. **Pure functions → easy to unit test.**
* **`lib/rate-limit.js`** — in-memory `checkRateLimit`, `getClientIP`, `RATE_LIMITS`.
  **Testable, but in-memory state is per-instance (serverless caveat to note).**
* **AI:** **not** centralized in `lib/` (instantiated in `api/chat.js`/`api/exams.js`).
  Supabase/auth/CORS-ish helpers are centralized; no dedicated billing/credits helper
  (credit ops go through Supabase RPCs).

## 9. Supabase / Migration Baseline

* **Migrations:** **one** file — `supabase/migrations/001_initial_schema.sql` (self-described
  as idempotent).
* **Tables (11):** `profiles`, `children`, `sessions`, `messages`, `subscriptions`,
  `credit_ledger`, `notifications`, `consent_records`, `data_subject_requests`,
  `report_subscriptions`, `weekly_reports`.
* **RLS:** `ENABLE ROW LEVEL SECURITY` ×11; `CREATE POLICY` ×13.
* **Functions:** 14, incl. `verify_child_login`, `set_child_password`, `deduct_credit`,
  `get_credit_balance`, `get_valid_credit_balance`, `check_child_limit`,
  `delete_child_profile`, `delete_parent_account`, `record_child_consent`,
  `record_signup_consent`, `check_policy_acceptance`, `handle_new_user`,
  `get_child_credit_usage`, `get_child_limits_summary`. **`SECURITY DEFINER` ×15.**
* **Triggers (2):** `on_auth_user_created` (→ `handle_new_user`), `check_child_limit_trigger`.
* **Webhook idempotency table:** **none present** (only comments say the migration is
  idempotent) → **confirms the A0.6 gap**; a `processed_webhooks`-style table does not exist.
* **⚠️ MATERIAL DOC-DRIFT (see §10 + Phase 3 note):** the real schema differs from
  `SPEC-000`/`PROJECT_BRIEF`:
  * credit model is **`credit_ledger`**, not `credit_transactions`.
  * **No `knowledge_channels` / `knowledge_transcripts` / `knowledge_chunks`** tables in
    this migration — the RAG tables referenced in the brief are **not** in repo
    migrations (managed by the Python pipeline or an out-of-repo migration → **to verify**).
  * Extra governance tables present that the brief under-describes: `consent_records`,
    `data_subject_requests`, `notifications`, `report_subscriptions`, `weekly_reports`.
* **No SQL was run; no Supabase connection made.** Live RLS/RPC behavior still needs
  verification against the actual project (STAGE1-B).

## 10. Existing Docs Baseline

* **New operating docs (current source of truth):** `CLAUDE.md`, `docs/PROJECT_TRACKER.md`,
  `docs/SESSION_BRIEF.md`, `docs/specs/*` (000, 001, A0.5, A0.6, STAGE1, and this STAGE1-A).
* **Legacy root docs:** `README.md` (1-line stub `# AI Math Tutor`), `PROJECT_BRIEF.md`,
  `IMPLEMENTATION_SUMMARY.md`, `DEPLOYMENT_CHECKLIST.md`, `SETUP_GUIDE.md` — useful for
  setup/deploy detail and history.
* **Contradiction found:** `PROJECT_BRIEF.md` and `SPEC-000` describe `credit_transactions`
  + `knowledge_*` tables that the migration does not match (see §9). `SPEC-000` is **out
  of scope** for this task (not in the allowed list), so it was **not edited**; this is
  recorded as a finding for a later docs-reconciliation slice (STAGE1-B).
* Legacy docs do mention env vars, deployment steps, and the manual LS verification —
  candidates to later link/migrate into `docs/specs` (not in this task).

## 11. Existing Test / CI Baseline

* **Test files:** none (`*.test.*` / `*.spec.*` absent). **Test dirs:** none.
* **Frameworks/config:** no Vitest/Jest/Playwright/Cypress config; **no ESLint/Prettier/
  Biome/lint-staged config.**
* **CI:** only `.github/workflows/knowledge-pipeline.yml` (knowledge pipeline) — **no
  application CI** (no test/lint workflow).
* **Accessibility / AI-eval tooling:** none.
* → Greenfield for tests, lint, CI, a11y, and AI evaluation.

## 12. Env Var / Secret Usage Baseline

> Names only — **no secret values printed or read from `.env`.**

* **Server-side `process.env` (api/ + lib/):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `LEMONSQUEEZY_API_KEY`,
  `LEMONSQUEEZY_WEBHOOK_SECRET`, `CHILD_JWT_SECRET`, `ALLOWED_ORIGIN`.
* **Service-role safety:** `SUPABASE_SERVICE_ROLE_KEY` appears only in server-side
  code (via `lib/supabase.js`); not referenced in `public/`. ✅ consistent with A0.6.
* **Frontend:** `public/js/supabase-config.js` hardcodes the Supabase URL + anon key
  (public by design; safe only if RLS on every table — verify).
* **`.gitignore`:** covers `.env` and `.env.*`. **No `.env` or `.env.example` present in
  repo** → an `.env.example` (names only) would help onboarding + env validation later.
* **Env validation:** **none present** (no schema/parse on boot) → confirms the STAGE1
  env-validation gap; a missing signing secret would currently fail silently/late.

## 13. Stage 1 Readiness Matrix

| Workstream | Current Evidence | Gap | Risk | Recommended Next Action | Approval Required? |
|---|---|---|---|---|---|
| Test baseline | No tests/framework; helpers centralized in `lib/` (good seams); AI scattered in 2 API files | No runner, no mocks, low frontend testability | Med | STAGE1-D tooling proposal → STAGE1-E install (Vitest/MSW) → STAGE1-F tests | Yes (install + test files) |
| Schema documentation | 1 migration: 11 tables, 13 policies, 14 fns, 2 triggers; **drift vs SPEC-000** | No authoritative schema doc; `knowledge_*` not in repo; doc drift | Med | STAGE1-B: document schema/RLS/RPCs + reconcile SPEC-000/brief | No (docs/read-only) |
| Environment validation | 8 server env vars enumerated; no `.env.example`; no validation | No fail-fast on missing secret | Med | STAGE1-C: env inventory + Zod-validation **plan** (no install) | No (plan); Yes to implement |
| Webhook idempotency design | Webhook verifies HMAC; **no idempotency table** in schema | Replay → double credit grant | High | STAGE1-G: idempotency **design spec** (no code/migration) | No (design); Yes to implement |
| RLS / security planning | RLS on 11 tables, 13 policies, 15 SECURITY DEFINER | Live RLS correctness/perf unverified; no tests | High | STAGE1-B doc + STAGE1-H pgTAP **plan** | No (plan); Yes to implement tests/migrations |
| Parent/child access planning | `children.parent_id` model; dual-auth helper; RPCs | Cross-family isolation untested | High | STAGE1-H negative RLS tests **plan** | No (plan); Yes to implement |
| Service-role safety audit | Service-role server-only (not in `public/`) | Not codified/tested | High | STAGE1-B note + a focused static-audit slice | No (audit) |
| Child token storage review | Child JWT (HMAC) stored client-side (localStorage per docs) | XSS exposure | High | Review **plan** only; httpOnly migration later | Yes (token-storage = hard gate) |
| AI provider/router eval | `openai` only; client scattered in 2 files | No provider abstraction; mocking needs 2 seams | Med | Plan a `lib/ai.js` wrapper concept (no code now) | Yes to implement |
| CI / tooling plan | Only knowledge-pipeline workflow; no app CI/lint | No CI gate; no lint/format | Low/Med | STAGE1-I CI **proposal** (config later) | No (plan); Yes to add workflow |

## 14. Recommended Immediate Next Slice

**`STAGE1-B — Schema / RLS / API Inventory Documentation`** (docs-only / read-only).
Rationale: the audit found **material schema doc-drift** (`credit_ledger` vs
`credit_transactions`; missing `knowledge_*`; extra consent/DSAR/report tables) and a
**missing webhook-idempotency table**. Documenting the *actual* schema/RLS/RPC surface
and reconciling `SPEC-000`/`PROJECT_BRIEF` is the highest-value, lowest-risk next step,
and it underpins every later high-risk slice (idempotency, RLS tests, env validation).
This is preferred over jumping to tooling install (STAGE1-E) because tests written
against an undocumented/incorrectly-documented schema would be built on sand.

## 15. Hard Gates Before Implementation

* Dependency install approval (Vitest/MSW/Zod/etc.)
* Package-script approval (adding `test`/`lint`/`build`)
* Test-file creation approval
* Migration approval (any schema/RLS change, incl. idempotency table)
* RLS / auth review (high risk)
* Payment / webhook / credit review (high risk)
* Child token-storage approval (hard gate)
* External-service mocking approval (test design)
* CI workflow approval
* **React/Vite still blocked** (not approved)

## 16. Acceptance Criteria

Accepted if: all observations are evidence-based; no source files changed; no packages
installed; no tests/build run; no migrations/SQL/deploy; docs/tracker/session updated;
session brief updated last; next slice clearly recommended.

## 17. Status

**Drafted / awaiting GPT and user review. No implementation authorized.**
