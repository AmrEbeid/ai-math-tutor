# SPEC-STAGE1-B — Schema / RLS / API Inventory Documentation

> Evidence-based inventory built **only** from repo files (`supabase/migrations/`,
> `api/`, `lib/`, `public/`). No SQL run, no Supabase connection, no live-schema
> inference. Items only implied by code are marked **`Implied by code / not verified in
> migrations`**; items in migrations but unused by the API scan are marked **`Defined in
> migrations / usage not found in current API scan`**. Companion to STAGE1-A.

**Status:** Drafted / awaiting GPT and user review. No implementation authorized.
**Audit date:** 2026-06-03

## 1. Purpose

Create a trusted inventory of the actual database schema (tables, RLS, functions,
triggers, indexes), API data-access (endpoint → tables/RPCs/env/external/auth), shared
libs, frontend touchpoints, and env vars — so later Stage 1 work (tests, env validation,
idempotency design, RLS tests) is built on verified facts and documented drift, not
assumptions.

## 2. Scope

Read-only file inspection + documentation only. Source: `supabase/migrations/001_initial_schema.sql`,
all `api/*`, all `lib/*`, `public/*` (for data/API touchpoints), and existing docs as
reference.

## 3. Non-Goals

This task did **not**: run SQL · connect to Supabase · apply/create migrations · change
source files · install packages · create tests · run tests/build · deploy · start
React/Vite · copy public repo code. It did not edit `SPEC-000`/root docs (drift is
recorded here for a later reconciliation slice).

## 4. Migration Inventory

* **File:** `supabase/migrations/001_initial_schema.sql` — 882 lines; self-described as
  idempotent (`IF NOT EXISTS` tables, `CREATE OR REPLACE` functions, triggers dropped
  before recreate). **Only migration in the repo.**
* **Theme:** full initial schema — auth/profiles, parent-child, sessions/messages,
  billing (subscriptions/credit_ledger), notifications, weekly reports/report
  subscriptions, and GDPR governance (consent, data-subject-requests).
* **Tables created (11):** `profiles`, `children`, `subscriptions`, `credit_ledger`,
  `sessions`, `messages`, `notifications`, `weekly_reports`, `report_subscriptions`,
  `consent_records`, `data_subject_requests`.
* **Functions created (14, all `SECURITY DEFINER`):** `handle_new_user`,
  `check_child_limit`, `deduct_credit`, `get_credit_balance`, `get_valid_credit_balance`,
  `set_child_password`, `verify_child_login` (**defined twice — two signatures**),
  `get_child_credit_usage`, `get_child_limits_summary`, `record_signup_consent`,
  `record_child_consent`, `check_policy_acceptance`, `delete_parent_account`,
  `delete_child_profile`.
* **Triggers (2):** `on_auth_user_created` (AFTER INSERT on `auth.users` → `handle_new_user`),
  `check_child_limit_trigger` (BEFORE INSERT on `children` → `check_child_limit`).
* **Policies:** 13 (see §6). **RLS enabled** on all 11 tables.
* **Indexes:** 16, incl. `idx_children_parent`, `idx_children_username`, unique
  `children_parent_username_unique (parent_id, username) WHERE username IS NOT NULL`,
  `idx_subscriptions_parent`, `idx_subscriptions_stripe`, `idx_credit_ledger_parent`,
  `idx_credit_ledger_created`, `idx_sessions_parent`, `idx_sessions_child`,
  `idx_messages_session`, `idx_notifications_parent(parent_id, read)`, consent/DSR indexes.
* **Grants/Revokes:** **none** in the migration (functions rely on default execute grants).
* **Audit/redaction:** `delete_parent_account` anonymizes the credit ledger before
  deletion (privacy-positive). No dedicated audit-log table.
* **Payment/credit/subscription logic:** `subscriptions` + `credit_ledger` tables +
  `deduct_credit`/`get_*_balance` RPCs.
* **⚠️ No webhook-idempotency table** and **no `knowledge_*` / `exam*` tables** in this
  migration (see §5/§13).

## 5. Table Inventory

| Table | Purpose | Key cols | Sensitive/PII | Parent/Child link | RLS | API refs | Notes / drift |
|-------|---------|----------|---------------|-------------------|-----|----------|----------------|
| `profiles` | Parent account | `id`=auth.users id, `email`, `full_name`, `phone`, `country`, `preferred_language` | email, name, phone | is the parent | ✅ | `auth/profile` | "users/parents" = `profiles` |
| `children` | Child profiles | `id`, `parent_id`→profiles, `name`, `grade`, `username`, `password_hash`, `birthdate`, credit limits | name, username, **password_hash**, birthdate | `parent_id` | ✅ | `chat`, `children`, `sessions/create`, `exams` | child creds hashed by RPC |
| `subscriptions` | Parent subscription | `parent_id`, `plan_name`, `status`, `credits_per_month`, `current_period_*`, `max_children`, `billing_cycle` | — | `parent_id` | ✅ | `credits/balance`, `webhooks/lemonsqueezy` | **`stripe_customer_id`/`stripe_subscription_id` cols + status `trialing`** (Stripe naming; product is LemonSqueezy) |
| `credit_ledger` | Credit movements | `parent_id`, `amount`, `balance_after`, `type`, `expires_at`, `stripe_payment_id` | — | `parent_id` | ✅ | `credits/balance`, `webhooks/lemonsqueezy` | **This is the real credit table — not `credit_transactions`**; `type` enum incl. `trial`/`signup_bonus`; `stripe_payment_id` col (LS uses order id) |
| `sessions` | Tutoring sessions | `parent_id`, `child_id`, `status`, `interaction_count`, `credits_used`, `grade`, `topic` | — | both | ✅ | `chat`, `sessions/create`, `sessions/history` | status incl. `stuck_loop`/`flagged` |
| `messages` | Chat messages | `session_id`, `role`, `content`, `tokens_used`, `flagged`, `flag_reason` | **`content` = child message text** | via session→child | ✅ | `chat` | content is child data — keep out of logs |
| `notifications` | Parent alerts | `parent_id`, `type`, `title`, `body`, `read`, `session_id`, `child_id` | — | `parent_id` | ✅ | `chat`, `exams`, `webhooks/lemonsqueezy` | types incl. `credits_low`/`session_flagged` |
| `weekly_reports` | Progress reports | `parent_id`, `child_id`, `summary`, strengths/areas | learning data | both | ✅ | *(none in API scan)* | `Defined in migrations / usage not found in current API scan` |
| `report_subscriptions` | Per-child report sub | `parent_id`, `child_id`, `status`, `stripe_subscription_id` | — | both | ✅ | *(none in API scan)* | `Defined in migrations / usage not found in current API scan` |
| `consent_records` | Consent log | `parent_id`, `child_id`, `consent_type`, policy versions, `ip_address`, `user_agent`, `jurisdiction` | **ip_address, user_agent** | both | ✅ | via frontend RPCs `record_signup_consent`/`record_child_consent` | GDPR-positive; IP/UA are PII |
| `data_subject_requests` | DSAR log | `parent_id`, `request_type` (access/deletion/export/rectification), `status` | — | `parent_id` | ✅ | *(none in API scan)* | GDPR DSAR workflow scaffolding |
| `knowledge_chunks` (+ `knowledge_*`) | RAG content | — | — | — | unknown | `chat` (via `match_knowledge_chunks` RPC) | **`Implied by code / not verified in migrations`** — RAG tables not in repo migration (pipeline/out-of-repo) |
| `exams`, `exam_questions`, `exam_attempts`, `exam_answers` | Exam/quiz | — | child answers | — | unknown | `exams` | **`Implied by code / not verified in migrations`** — entire exam schema absent from migration 001 |

## 6. RLS Policy Inventory

All 13 policies are **parent-scoped** and use **raw `auth.uid()`** (not the
`(select auth.uid())` perf-wrapped form) and specify **no explicit role** (`TO
authenticated` absent).

| Table | Policy | Cmd | USING / WITH CHECK | uid pattern | Scope | Notes (needs review) |
|-------|--------|-----|--------------------|-------------|-------|----------------------|
| profiles | Users can view/update own profile | ALL | `auth.uid() = id` | raw | parent | wrap `(select auth.uid())`; add role scope |
| children | Parents can CRUD own children | ALL | `auth.uid() = parent_id` | raw | parent | indexed (`idx_children_parent`) ✅ |
| subscriptions | Parents can view own subscriptions | SELECT | `auth.uid() = parent_id` | raw | parent | writes happen via service-role webhook (RLS-bypassing) |
| credit_ledger | Parents can view own credit ledger | SELECT | `auth.uid() = parent_id` | raw | parent | writes via service-role (deduct/grant) |
| sessions | view/create own | SELECT | `auth.uid() = parent_id` | raw | parent | + separate INSERT WITH CHECK |
| sessions | insert own | INSERT | WITH CHECK `auth.uid() = parent_id` | raw | parent | |
| messages | view in own sessions | SELECT | EXISTS(session where parent_id = auth.uid()) | raw (subquery) | parent via session | join-based; index on `messages.session_id` ✅ |
| messages | insert in own sessions | INSERT | WITH CHECK EXISTS(session…) | raw (subquery) | parent via session | |
| notifications | view/update own | ALL | `auth.uid() = parent_id` | raw | parent | |
| weekly_reports | view own | SELECT | `auth.uid() = parent_id` | raw | parent | |
| report_subscriptions | CRUD own | ALL | `auth.uid() = parent_id` | raw | parent | |
| consent_records | view own | SELECT | `auth.uid() = parent_id` | raw | parent | inserted via SECURITY DEFINER RPC |
| data_subject_requests | view/insert own | ALL | `auth.uid() = parent_id` | raw | parent | |

**Critical structural note:** there are **no child-role RLS policies**. The child app
authenticates with a custom HMAC JWT (not a Supabase session), so child data access is
performed by **server-side functions using the service-role client** (which bypasses
RLS) plus the `verify_child_login` RPC. → **Child↔child / child↔family isolation is
enforced in application code + JWT, NOT by RLS.** This is the single most important
thing for STAGE1-H test planning (test isolation at the app layer, since RLS won't catch
a child-context bug).

## 7. SQL Function / RPC Inventory

All 14 functions are `SECURITY DEFINER`; **none set `search_path`** (0 occurrences).

| Function | Purpose | SECDEF | search_path | Touches | Sensitivity | Notes |
|----------|---------|--------|-------------|---------|-------------|-------|
| `handle_new_user` | create profile on signup | ✅ | ❌ | profiles | auth | trigger fn |
| `check_child_limit` | enforce max_children | ✅ | ❌ | children, subscriptions | — | trigger fn |
| `deduct_credit(parent,session)` | −1 credit, return balance | ✅ | ❌ | credit_ledger | **credit** | exactly-once concerns (concurrency) |
| `get_credit_balance(parent)` | total incl. expired | ✅ | ❌ | credit_ledger | credit | |
| `get_valid_credit_balance(parent)` | balance excl. expired | ✅ | ❌ | credit_ledger | credit | used by chat gate |
| `set_child_password(...)` | hash + set child creds | ✅ | ❌ | children | **auth/PII** | password hashing |
| `verify_child_login(...)` ×2 | validate child creds | ✅ | ❌ | children | **auth** | **two definitions — confirm active signature** |
| `get_child_credit_usage(child,period)` | usage window | ✅ | ❌ | credit_ledger, sessions | credit | |
| `get_child_limits_summary(child)` | daily/weekly/monthly | ✅ | ❌ | children, sessions | — | used by chat |
| `record_signup_consent(...)` | log signup consent | ✅ | ❌ | consent_records | PII (ip/ua) | frontend-invoked |
| `record_child_consent(...)` | log child consent | ✅ | ❌ | consent_records | PII | frontend-invoked |
| `check_policy_acceptance(...)` | has accepted? | ✅ | ❌ | consent_records | — | |
| `delete_parent_account(parent)` | account deletion | ✅ | ❌ | many (anonymizes ledger) | **critical** | GDPR deletion; destructive |
| `delete_child_profile(...)` | child deletion | ✅ | ❌ | children + related | high | GDPR deletion |

**⚠️ High-value finding:** **15 `SECURITY DEFINER` blocks, 0 `set search_path`.** Per
Supabase/A0.6 guidance, SECURITY DEFINER functions should pin `set search_path = ''` (or
explicit schema) to avoid search-path hijacking / privilege-escalation. **Recommended
hardening (needs review; do not change here)** — a future approved migration slice.

## 8. Trigger Inventory

| Trigger | Table | Timing/Event | Function | Purpose | Audit/PII | Risk |
|---------|-------|--------------|----------|---------|-----------|------|
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_user` | auto-create `profiles` row | writes profile (email) | low; confirm idempotency |
| `check_child_limit_trigger` | `children` | BEFORE INSERT | `check_child_limit` | enforce `max_children` per subscription | — | low; depends on subscription row |

## 9. API Endpoint Inventory

| Endpoint | Methods | Auth | Env (direct) | Tables read/written | RPCs | External | Sensitivity | Mock needs / key negative tests |
|----------|---------|------|--------------|---------------------|------|----------|-------------|---------------------------------|
| `auth/child-login.js` | OPTIONS, POST | public → issues child JWT | `ALLOWED_ORIGIN` (+ Supabase via lib) | — | `verify_child_login` | — | **auth** | mock RPC; tests: bad creds→401, rate-limit, token issued/expiry |
| `auth/profile.js` | GET, OPTIONS, PUT | parent (`createAuthClient`/`getUser`) | `ALLOWED_ORIGIN` | profiles | — | — | auth/PII | tests: no token→401, cannot read other profile |
| `chat.js` | OPTIONS, POST | dual (`getChildOrUser`/`getParentId`) | `ALLOWED_ORIGIN`, `OPENAI_API_KEY` | children, sessions, messages, notifications | `deduct_credit`, `get_valid_credit_balance`, `get_child_limits_summary`, `match_knowledge_chunks` | **OpenAI** | **credit + child content + AI** | mock OpenAI (seam #1) + RPCs; tests: zero-balance gate, credit deducted once, blocked-content redirect, no real OpenAI |
| `children.js` | OPTIONS, POST | parent (`getUser`) + `verifyChildToken` | `ALLOWED_ORIGIN` | children | `set_child_password`, `get_child_limits_summary` | — | auth/PII | tests: parent-only, validation (username/pw), cannot set creds for another parent's child |
| `credits/balance.js` | GET, OPTIONS | dual | `ALLOWED_ORIGIN` | credit_ledger, subscriptions | `get_credit_balance` | — | credit | tests: dual-auth, balance shape, trial/expiry gating |
| `credits/checkout.js` | OPTIONS, POST | parent (`getUser`) | `ALLOWED_ORIGIN`, `LEMONSQUEEZY_API_KEY` | — | — | **Lemon Squeezy (fetch)** | **payment** | mock LS fetch; tests: auth required, correct custom_data, no live LS call |
| `exams.js` | OPTIONS, POST | dual | `ALLOWED_ORIGIN`, `OPENAI_API_KEY` | children, **exams, exam_questions, exam_attempts, exam_answers** | — | **OpenAI** | AI + child answers | mock OpenAI (seam #2); ⚠️ exam tables not in migrations |
| `sessions/create.js` | OPTIONS, POST | dual | `ALLOWED_ORIGIN` | children, sessions | — | — | ownership | tests: ownership via parentId, cannot create for other family's child |
| `sessions/history.js` | GET, OPTIONS | dual | `ALLOWED_ORIGIN` | sessions | — | — | data isolation | tests: only own sessions returned |
| `webhooks/lemonsqueezy.js` | POST | **HMAC signature** (`createHmac`+`timingSafeEqual`) | `LEMONSQUEEZY_WEBHOOK_SECRET` (+ Supabase via lib) | credit_ledger, subscriptions, notifications | `get_credit_balance` | — | **payment/credit, critical** | tests: valid/invalid/tampered sig, raw-body, **idempotent replay (no dedup table → likely double-grant)** |

## 10. Shared Library Inventory

| File | Purpose | Imported by | Env (direct) | Mock-seam quality | Risks |
|------|---------|-------------|--------------|-------------------|-------|
| `lib/supabase.js` | `createServerClient` (service role), `createAuthClient(req)`, `getUser(req)` | nearly all endpoints | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` | **Good** — single seam to mock Supabase | service-role here → keep server-only |
| `lib/child-auth.js` | HMAC JWT sign/verify; `getChildOrUser`/`getParentId`/`getChildId` | chat, exams, children, credits/balance, sessions/* | `CHILD_JWT_SECRET` | **Good** — single auth seam | token logic = hard gate |
| `lib/prompts.js` | `getSystemPrompt`, safety detectors, curriculum maps, `CHILD_SAFETY` | chat, exams | — | **Excellent** — pure functions | easy unit tests |
| `lib/rate-limit.js` | `checkRateLimit`, `getClientIP`, `RATE_LIMITS` | chat, child-login | — | Good | in-memory state per serverless instance (not shared) |

**AI client is NOT centralized** — `new OpenAI()` lives in `api/chat.js` and `api/exams.js`
(two seams to mock). A future `lib/ai.js` wrapper would consolidate mocking + routing.

## 11. Frontend Data/API Touchpoints

* **Pages → `/api/*`:** `app.html` (chat, children, credits/balance, sessions/create,
  sessions/history) · `child-login.html` (auth/child-login) · `dashboard.html` (children,
  credits/balance, credits/checkout, sessions/history) · `exam-prep.html` (exams) ·
  `login.html` + `pricing.html` (credits/checkout).
* **Pages using Supabase directly:** pricing, login, dashboard, verify-email, sw.js,
  `js/supabase-config.js` (parent auth + anon key, public by design).
* **Frontend Supabase RPCs:** `record_signup_consent`, `record_child_consent` (explains
  why these RPCs weren't in the API scan — they're frontend-invoked).
* **localStorage/sessionStorage keys:** `pendingPlan` (×11, A0.5 flow), **`child_token`
  (×7)**, **`zeluu_child_token` (×3)**, `zeluu_child_id` (×3), `parent_email` (×2).
  * ⚠️ **Two child-token key names** (`child_token` vs `zeluu_child_token`) — naming
    inconsistency to reconcile; both confirm the **child JWT lives in localStorage
    (XSS-exposed)** (A0.6/STAGE1-A finding).
* **A0.5 trial touchpoints:** `pendingPlan` / "Activating your trial" / `payment=success`
  in `dashboard.html`, `login.html`, `verify-email.html`.
* **Testability:** logic is in inline page scripts → E2E (later) more practical than unit
  for the frontend.

## 12. Env Var Inventory

> Names only. No secret values read/printed. `.gitignore` covers `.env`/`.env.*`; **no
> `.env`/`.env.example` in repo** (future onboarding/validation gap). **No env validation
> present** anywhere.

| Env var | Use | Referenced in | Required? | Classification |
|---------|-----|---------------|-----------|----------------|
| `SUPABASE_URL` | server | `lib/supabase.js` | required | server config |
| `SUPABASE_ANON_KEY` | server + frontend (hardcoded in `supabase-config.js`) | `lib/supabase.js`, public | required | public-safe (only if RLS on) |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | `lib/supabase.js` | required | **server secret (BYPASSRLS)** |
| `OPENAI_API_KEY` | server | `api/chat.js`, `api/exams.js` | required | **AI provider secret** |
| `LEMONSQUEEZY_API_KEY` | server | `api/credits/checkout.js` | required | **payment secret** |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | server | `api/webhooks/lemonsqueezy.js` | required | **webhook secret** |
| `CHILD_JWT_SECRET` | server | `lib/child-auth.js` | required | **JWT/HMAC secret** |
| `ALLOWED_ORIGIN` | server (CORS) | all endpoints | required (CORS) | server config |

Service-role key referenced **only** server-side (not in `public/`) ✅.

## 13. Documentation Drift Register

| Drift item | Source says | Evidence | Risk | Recommended fix | Now/Later |
|------------|-------------|----------|------|-----------------|-----------|
| Credit table name | `SPEC-000`/`PROJECT_BRIEF`: `credit_transactions` | Migration: `credit_ledger` (+ `type` enum, `deduct_credit`/`get_valid_credit_balance`) | Med (wrong tests/docs) | Update SPEC-000 to `credit_ledger` | Later (SPEC-000 out of scope here) |
| Knowledge/RAG tables | Brief: `knowledge_channels/transcripts/chunks` | Not in migration 001; `chat` calls `match_knowledge_chunks` RPC | Med | Mark as out-of-repo/pipeline-managed; verify & document source | Later |
| Exam schema | Brief: exams referenced | `exams`/`exam_questions`/`exam_attempts`/`exam_answers` used by `api/exams.js`, **absent from migration 001** | Med/High (schema not version-controlled) | Locate/author the exam migration; document | Later (needs migration approval) |
| Webhook idempotency table | A0.6: needed | Not in migration; webhook has no dedup access | **High** (double credit grant) | Design `processed_webhooks` (STAGE1-G), implement later | Later (migration gate) |
| Stripe naming | product uses LemonSqueezy | `subscriptions.stripe_*`, `credit_ledger.stripe_payment_id`, status `trialing` | Low/Med (confusing; LS statuses differ) | Document mapping; consider rename later | Later |
| `verify_child_login` duplicate | one login fn expected | two `CREATE OR REPLACE FUNCTION verify_child_login` (different signatures) | Med | Confirm active signature; drop the stale one | Later (migration) |
| SECURITY DEFINER search_path | hardening expected | 15 SECDEF, 0 `set search_path` | **High** (priv-esc/search-path) | Add `set search_path=''` in a future migration | Later (migration gate) |
| Child token key name | single token | `child_token` and `zeluu_child_token` both used | Low/Med | Standardize one key | Later (frontend, gated) |
| RLS child isolation | implied by RLS | no child-role policies; isolation in app/JWT | High | Document + test at app layer (STAGE1-H) | Later |
| React/Vite as "Stage 1" | (not found) | No Stage-1 doc claims React/Vite | — | None | — |

> Per scope, `SPEC-000`/root docs were **not** edited here; reconciliation is a later
> docs slice.

## 14. Test Planning Implications

(Plan only — no tests created.)
* **Auth negatives:** every endpoint → missing/blank/invalid token = 401; wrong method;
  CORS preflight; expired child JWT.
* **Parent isolation:** parent A cannot read/write parent B's children/sessions/messages/
  credit_ledger/subscriptions (RLS-level via pgTAP).
* **Child isolation (app-layer — RLS won't catch):** child JWT for family A cannot reach
  family B's data through the service-role-backed endpoints (`chat`, `sessions/*`,
  `credits/balance`) — assert in API tests, since there are no child RLS policies.
* **Webhook:** valid sig accepted; tampered/invalid rejected; raw-body integrity;
  **duplicate delivery grants the 10 credits exactly once** (currently no dedup → likely
  fails → motivates STAGE1-G).
* **Credit:** `deduct_credit` removes exactly one and is safe under concurrent calls;
  balance excludes expired (`get_valid_credit_balance`); zero-balance blocks chat.
* **Trial gating:** access in `on_trial`/`active`; blocked when expired (note schema uses
  `trialing` — reconcile vs LS lifecycle).
* **Env:** missing `LEMONSQUEEZY_WEBHOOK_SECRET`/`CHILD_JWT_SECRET`/Supabase keys → fail
  fast (motivates STAGE1-C).
* **AI:** OpenAI mocked in **both** `chat` and `exams`; safety detectors
  (`checkForBlockedContent`, `detectChildDistress`, `detectPersonalInfo`) unit-tested;
  no real provider calls.
* **No real external services / no production data** in any test.

## 15. Stage 1 Readiness Update

STAGE1-B clarified (vs STAGE1-A): exact tables/columns, that all RLS is **parent-scoped
raw `auth.uid()`** with **no child-role policies** (isolation is app-layer), the full
RPC/SECDEF list (search_path hardening gap), the endpoint→data map, and that **exam +
knowledge schemas are not in repo migrations**. **Still unknown (needs verification, not
in repo):** live exam/knowledge table definitions, whether the second `verify_child_login`
is the active one, and live RLS/RPC behavior in the actual Supabase project. These remain
**read-only/verification** items — none authorize implementation.

## 16. Recommended Next Slice

**`STAGE1-C — Environment Variable / Secret Validation Plan`** (docs/plan only). The env
inventory (§12) is now complete and there is **no validation + no `.env.example`**, so a
fail-fast validation **plan** + an `.env.example` (names only) proposal is the natural,
lowest-risk next docs step, and it gates safe testing later (a missing webhook secret
silently breaks verification). This is preferred over installing test tools (STAGE1-E)
because: (a) the exam/knowledge **schema gaps** mean some tests can't be written reliably
yet, and (b) env validation underpins both tests and the webhook-idempotency work. (If
preferred, **STAGE1-G webhook-idempotency design** is the other high-value docs-only
candidate, given the confirmed double-grant risk — but env validation is the smaller,
foundational step.)

## 17. Hard Gates

Migrations (incl. idempotency table, exam/knowledge schema, SECDEF search_path,
`verify_child_login` cleanup) · RLS changes · webhook/credit logic changes · child
token-storage changes · package installs · test-file creation · CI creation · React/Vite.

## 18. Acceptance Criteria

Accepted if: schema/table/policy/function/trigger inventory is evidence-based; API
inventory maps files→tables/env/external; drift captured; no source files changed; no
SQL/migration/deploy/install/test/build; tracker + session brief updated; session brief
updated last; next slice clear.

## 19. Status

**Drafted / awaiting GPT and user review. No implementation authorized.**
