# SPEC-STAGE1-C — Environment Variable / Secret Validation Plan

> Docs-only plan for environment-variable and secret validation, built **read-only**
> from repo files (`api/*`, `lib/*`, `public/*`, `vercel.json`, `package.json`,
> `.gitignore`) and the STAGE1-A/STAGE1-B findings. **No env validation implemented, no
> `.env.example` created, no secret values read or printed, no source files edited.**
> Companion to STAGE1-A (baseline audit) and STAGE1-B (schema/RLS/API inventory).

**Status:** Drafted / awaiting GPT and user review. **No implementation authorized.**
**Audit date:** 2026-06-03
**Risk class:** Low execution (docs-only); medium security relevance (concerns secrets,
payment keys, AI keys, service-role and JWT/HMAC handling).

## 1. Purpose

Define — without implementing — a fail-fast environment-variable and secret-validation
plan for Zeluu, so that later Stage 1 work (tests, webhook idempotency, RLS tests) is
built on a known, validated configuration surface. STAGE1-A and STAGE1-B established that
**8 server env vars are referenced, there is no env validation anywhere, and no
`.env.example` exists.** This spec turns that gap into a concrete, gated plan: which vars
exist, which are required, how they are classified, where each is referenced, what
validation should later be implemented, what `.env.example` should later contain, what
must never be logged, what tests should verify, and what the next safe slice is.

## 2. Scope

Read-only inspection + documentation only. Sources inspected: all `api/*`, all `lib/*`,
`public/js/supabase-config.js` (+ `public/*` grep), `vercel.json`, `package.json`,
`.gitignore`, and the existing specs. Output is this spec plus index/tracker/brief
updates.

## 3. Non-Goals / Hard Stops Honoured

This task did **not** and must **not**: implement env-validation code · create
`.env.example` · install Zod or any dependency · modify package scripts · edit
`api/*`/`public/*`/`lib/*`/`scripts/*`/`supabase/migrations/*`/`.github/*` · edit
`package.json`/`package-lock.json`/`vercel.json`/root `README.md` · change
auth/RLS/payment/webhook/credit/token logic · create/run tests · run build/SQL · connect
to Supabase · apply migrations · deploy · start React/Vite · **open or print real `.env`
secret values.**

## 4. Evidence Method

* **Env-name discovery:** `grep -rEno "process\.env\.[A-Z0-9_]+" api lib` → 18 reference
  sites, **8 distinct names** (see §5). `grep` of `public/` for `process.env` /
  `import.meta.env` / `VITE_` → **0 matches** (no env access in the browser bundle).
* **`.env` files:** none present in the repo. **`.env.example`: MISSING** (planning gap).
* **`.gitignore`:** lines `.env` and `.env.*` (see §10.1 — important `.env.example`
  caveat). No secret values were read or printed at any point.

## 5. Env Var Source Inventory

Names only. **No secret values were read or printed.** Reference sites are
`file:line` from the grep above (line numbers are evidence, not edit targets).

### 5.1 `SUPABASE_URL`
* **Files:** `lib/supabase.js:6` (`createServerClient`), `lib/supabase.js:17`
  (`createAuthClient`). Indirectly every endpoint via `lib/supabase.js`.
* **Side:** server. **Required:** yes. **Classification:** public-safe runtime config
  (the URL is also hardcoded in the public frontend by design).
* **Purpose:** Supabase project base URL for both the service-role and per-request anon
  clients.
* **Failure if missing (observed):** `createClient(undefined, …)` → `@supabase/supabase-js`
  throws "supabaseUrl is required" on **first request that builds a client** (late, generic
  library error — not a clear config message).
* **Validation later:** non-empty; must be a valid `https://` URL; should match the
  hostname embedded in `public/js/supabase-config.js` (consistency check).
* **Tests later:** missing/blank → fail-fast with a clear message; malformed URL rejected.

### 5.2 `SUPABASE_ANON_KEY`
* **Files:** `lib/supabase.js:18` (`createAuthClient`). **Also hardcoded** (not via env) in
  `public/js/supabase-config.js` as a literal anon/publishable JWT — public by design.
* **Side:** server (env) **and** client (hardcoded literal in the browser bundle).
* **Required:** yes (server). **Classification:** **public-safe client config** — safe to
  expose **only if RLS is correctly enforced on every table** (STAGE1-B confirmed RLS is
  enabled on all 11 tables but is **parent-scoped only**; child isolation is app-layer).
* **Purpose:** anon key for the per-request, user-JWT-scoped Supabase client.
* **Failure if missing (observed):** `createAuthClient` builds `createClient(url, undefined)`
  → throws when a request carries a bearer token; requests without a token short-circuit
  earlier (`return null`).
* **Validation later:** non-empty; JWT-shaped (`eyJ…`); **must equal** the literal used in
  `public/js/supabase-config.js` so server and browser agree.
* **Tests later:** missing → clear failure; server/browser anon-key parity check.

### 5.3 `SUPABASE_SERVICE_ROLE_KEY`
* **Files:** `lib/supabase.js:7` (`createServerClient`) only. Used by nearly all endpoints
  and the webhook (RLS-bypassing writes).
* **Side:** **server only** — confirmed **0** references in `public/`.
* **Required:** yes. **Classification:** **service-role / privileged secret (BYPASSRLS).**
* **Purpose:** admin client for service-role reads/writes and child-context data access
  (no child RLS exists — STAGE1-B §6).
* **Failure if missing (observed):** `createClient(url, undefined)` throws on first
  service-client build (late, generic).
* **Validation later:** non-empty; JWT-shaped; **assert it is NOT equal to the anon key**
  (guards against a copy-paste that would silently downgrade privileges); a build/CI guard
  should assert this value never appears in `public/`.
* **Tests later:** missing → fail-fast; anon≠service assertion; static check that the
  service-role key name/value never appears in any client bundle.

### 5.4 `OPENAI_API_KEY`
* **Files:** `api/chat.js:69` and `api/exams.js:6` — both `new OpenAI({ apiKey:
  process.env.OPENAI_API_KEY })` at **module top-level** (import time).
* **Side:** server. **Required:** yes (for chat + exams). **Classification:** **AI provider
  secret.**
* **Purpose:** OpenAI client for tutoring chat and exam generation.
* **Failure if missing (observed):** the OpenAI SDK throws at construction → because
  construction is at module top-level, the **function module fails to load → 500 on first
  invocation (cold start)** of `chat`/`exams`. Other endpoints are unaffected.
* **Validation later:** non-empty; expected prefix shape (`sk-…`); validate at **import
  time** for `chat`/`exams` (it already effectively fails there) but with a clear message.
* **Tests later:** missing → clear failure for chat/exams only; **OpenAI mocked in both
  seams** (no live calls) per STAGE1-B §14.

### 5.5 `LEMONSQUEEZY_API_KEY`
* **Files:** `api/credits/checkout.js:70` (Bearer auth on the LS `fetch`).
* **Side:** server. **Required:** yes (for checkout). **Classification:** **payment API
  secret.**
* **Purpose:** authorize the LemonSqueezy `POST /v1/checkouts` call.
* **Failure if missing (observed):** request-time `Bearer undefined` → LS returns 401 →
  checkout fails as a generic `500/502` ("Failed to create checkout session"). **Silent /
  late / confusing** — no explicit guard today.
* **Validation later:** non-empty; validate at request time (or import time for the
  checkout function) with a clear message instead of a downstream 401.
* **Tests later:** missing → clear failure; **LS `fetch` mocked** (no live payment call);
  correct `custom_data` asserted.

### 5.6 `LEMONSQUEEZY_WEBHOOK_SECRET`
* **Files:** `api/webhooks/lemonsqueezy.js:16` inside `verifySignature(rawBody, signature)`.
* **Side:** server. **Required:** yes. **Classification:** **webhook signature secret.**
* **Purpose:** HMAC-SHA256 verification of the **raw** request body (`bodyParser` disabled).
* **Failure if missing (observed):** **explicit guard** — `if (!secret) throw new
  Error('LEMONSQUEEZY_WEBHOOK_SECRET not set')`. This is the **only env var with fail-fast
  validation today** (good pattern to generalise).
* **Validation later:** non-empty; **only ever used for raw-body signature verification** —
  never logged, never returned.
* **Tests later:** valid sig accepted; tampered/invalid → 401; missing secret → explicit
  error; raw-body integrity preserved (no JSON re-parse before verify).

### 5.7 `CHILD_JWT_SECRET`
* **Files:** `lib/child-auth.js:4` — read at **module top-level** into `JWT_SECRET`; used
  by `signChildToken`/`verifyChildToken` (HMAC-SHA256).
* **Side:** server. **Required:** yes. **Classification:** **auth / JWT / HMAC secret.**
* **Purpose:** sign and verify the custom child session token (the child app does not use a
  Supabase session — STAGE1-B §6).
* **Failure if missing (observed):** `crypto.createHmac('sha256', undefined)` throws a
  `TypeError` at request time on any sign/verify; `verifyChildToken` swallows it in a
  `try/catch` and returns `null` → **child auth silently fails closed** (no token ever
  validates), while `signChildToken` throws. Late + partly silent.
* **Validation later:** non-empty; minimum length / entropy threshold; validate at import
  time of `lib/child-auth.js`. **Never log; never return in errors.**
* **Tests later:** missing → clear failure (not a silent always-`null`); valid token round
  trips; tampered token rejected; expired token rejected.

### 5.8 `ALLOWED_ORIGIN`
* **Files:** `api/auth/child-login.js:7`, `api/auth/profile.js:75`, `api/chat.js:140`,
  `api/children.js:14`, `api/credits/balance.js:5`, `api/credits/checkout.js:26`,
  `api/exams.js:13`, `api/sessions/create.js:5`, `api/sessions/history.js:5` (CORS header on
  every endpoint).
* **Side:** server (CORS). **Required:** yes (for correct cross-origin behavior).
* **Classification:** **deployment / runtime config** (not a secret).
* **Purpose:** value of `Access-Control-Allow-Origin`.
* **Failure if missing (observed):** header becomes `undefined` → browsers block
  cross-origin calls **silently** (no server error; appears as a frontend/CORS failure).
* **Validation later:** non-empty; valid origin (scheme + host, no trailing slash/path);
  flagged as a **known remaining risk** in the tracker ("must be configured in Vercel").
* **Tests later:** missing → clear startup/config warning; preflight (`OPTIONS`) returns the
  configured origin.

### 5.9 Hardcoded config that is NOT (but arguably should be) an env var
> Not secrets, but configuration currently baked into source — recorded so the future
> validation/`.env.example` work can decide whether to externalise them. **No change now.**

* **`STORE_ID = '315398'`** — `api/credits/checkout.js:3` (LemonSqueezy store id, hardcoded).
* **Variant IDs** — `api/credits/checkout.js:10–22` (11 hardcoded LS variant ids per plan).
* **Checkout redirect fallback** — `api/credits/checkout.js:57`
  `${req.headers.origin || 'https://zeluu.com'}/dashboard.html?payment=success`
  (hardcoded production URL fallback; relates to the A0.5 `payment=success` flow).
* **Supabase URL + anon key** — `public/js/supabase-config.js` (hardcoded literals; public
  by design).

**Planning note (no change now):** store id, variant ids, and the redirect base URL are
candidates to become env/config later (e.g. `LEMONSQUEEZY_STORE_ID`, `APP_BASE_URL`) so
test/staging environments do not transact against production LS objects. This is a
**future, gated** decision, not part of the current 8-var contract.

## 6. Secret Classification Summary

| Env var | Classification | May appear in client bundle? |
|---|---|---|
| `SUPABASE_URL` | Public-safe runtime config | Yes (already hardcoded, by design) |
| `SUPABASE_ANON_KEY` | Public-safe client config (safe **only if RLS enforced**) | Yes (already hardcoded, by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Service-role / privileged secret (BYPASSRLS)** | **NEVER** |
| `OPENAI_API_KEY` | **AI provider secret** | **NEVER** |
| `LEMONSQUEEZY_API_KEY` | **Payment API secret** | **NEVER** |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | **Webhook signature secret** | **NEVER** |
| `CHILD_JWT_SECRET` | **Auth / JWT / HMAC secret** | **NEVER** |
| `ALLOWED_ORIGIN` | Deployment / runtime config | Value harmless; set server-side |

**Explicit invariants (must hold; do not implement here):**

* `SUPABASE_SERVICE_ROLE_KEY` **must never** appear in any frontend/public bundle. (Today:
  0 references in `public/` — preserve this.)
* `OPENAI_API_KEY` and the Lemon Squeezy secrets **must never** appear in any
  frontend/public bundle.
* `LEMONSQUEEZY_WEBHOOK_SECRET` **must only** be used for raw-body HMAC signature
  verification (never logged, never returned).
* `CHILD_JWT_SECRET` **must never** be logged or returned in any error.
* `SUPABASE_ANON_KEY` is acceptable in the frontend **only because** RLS is enforced — this
  classification is conditional on RLS correctness (STAGE1-B / future STAGE1-H tests).

## 7. Exposure / Logging Risk Review (read-only)

Scan: `grep -rnE "console\.(log|error|warn|info).*(process\.env|SECRET|API_KEY|
SERVICE_ROLE|JWT_SECRET|token|password)" api lib`.

* **No direct secret-name logging found** — no `console.*` prints a secret env var by name.
  ✅
* **`api/children.js:196`** — `console.error('set_child_password error:', error)`. Logs an
  **error object**, not a secret directly; the object *could* carry sensitive context from
  the child-password RPC. **Needs implementation review** (scrub/limit before any logging
  hardening — out of scope here).
* **`api/credits/checkout.js:87`** — `console.error('No checkout URL in response:',
  JSON.stringify(lsData))` logs the **full LemonSqueezy response**. It does not contain the
  API key, but may contain order/customer detail. **Needs implementation review.**
* **`api/credits/checkout.js:93`** — `console.error('LemonSqueezy checkout error:', error)`
  logs the raw error object. **Needs implementation review** (ensure the LS request, incl.
  the `Authorization: Bearer <key>` header, is never serialised into logs).
* **`process.env` usage location check:** **0** `process.env` references in `public/` →
  service-role / OpenAI / LS / JWT secrets are **not** read in client code. ✅
* **Error-response bodies:** observed handlers return generic messages (e.g. "Failed to
  create checkout session", "Invalid signature") — no secret echoed. The webhook’s
  `throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET not set')` names the **variable**, not its
  value (acceptable; a missing-config signal, not a leak).
* **Service-role outside server code:** none. **OpenAI key outside server code:** none.
  **LS key outside checkout:** none. **Webhook secret outside webhook:** none. **Child JWT
  secret outside `lib/child-auth.js`:** none. ✅ (All confirmed by grep; "needs
  implementation review" items above are about error-object verbosity, not direct leaks.)

## 8. Missing Env Validation Plan (design only — do not implement)

**Where validation should live (proposed):** a single new server module (e.g.
`lib/env.js`) that exports a validated, frozen config object and is imported by
`lib/supabase.js`, `lib/child-auth.js`, and the endpoints — so there is **one** validation
seam, mirroring the existing single-seam pattern of `lib/supabase.js`/`lib/child-auth.js`.
**Creating this module is a future, approved implementation slice — not part of STAGE1-C.**

**Validator choice (recommendation):**

* **Prefer a no-dependency custom validator first** (a small pure function that checks
  presence + basic shape and throws a clear, secret-free error). Rationale: STAGE1-A found
  **no devDependencies and no lockfile**; adding a dependency is a hard gate.
* **Zod is the fallback** if richer schemas/coercion are wanted later. **Using Zod requires
  explicit dependency-install approval** (hard gate) and a lockfile.

**Fail-fast behavior (proposed):**

* **Import-time (boot) validation** for always-needed secrets used at module top-level
  today: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`,
  `CHILD_JWT_SECRET`, and (for chat/exams) `OPENAI_API_KEY`. These already fail at
  import/first-build — the plan only makes the failure **explicit and clearly messaged**.
* **Request-time validation** for per-endpoint secrets: `LEMONSQUEEZY_API_KEY` (checkout),
  `LEMONSQUEEZY_WEBHOOK_SECRET` (webhook — already guarded), and `ALLOWED_ORIGIN` (CORS).
  Generalise the webhook’s existing `if (!secret) throw` guard to these.
* **Serverless caveat (Vercel):** each function is its own cold-start. Import-time
  validation must therefore be cheap and per-function, and must **fail closed** (throw → the
  function returns 500 with a generic body) rather than fall back to a default. A missing
  secret must never silently downgrade behavior (e.g. child auth silently returning `null`,
  or `Bearer undefined` to LS).

**Safe error-message style (proposed):**

* Name the **variable**, never the value. Example: `"Missing required env var:
  CHILD_JWT_SECRET"`. Never interpolate, log, or return any secret value or partial value.
* No stack traces or upstream payloads in client-facing responses; keep generic
  ("Server configuration error").

**Import-time vs request-time split (summary):**

| Validate at import time | Validate at request time |
|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (via `lib/supabase.js`) | `LEMONSQUEEZY_API_KEY` (checkout) |
| `CHILD_JWT_SECRET` (via `lib/child-auth.js`) | `LEMONSQUEEZY_WEBHOOK_SECRET` (webhook — already) |
| `OPENAI_API_KEY` (chat + exams modules) | `ALLOWED_ORIGIN` (CORS, all endpoints) |

**How tests should mock envs (plan):** set required vars via the test runner’s env setup
(or per-test overrides); never use real secrets; cover both "present & valid" and
"missing/blank" paths. Pairs with the future runner-install slice (STAGE1-E) — **no test
files or installs in STAGE1-C.**

## 9. `.env.example` Proposal (DRAFT ONLY — do not create the file)

> Names + placeholder values only. The real file is **not** created in this task.
> **Critical caveat (see §10.1):** the current `.gitignore` `.env.*` rule would also ignore
> `.env.example`; the future creation slice must add a negation (`!.env.example`) or the
> example will not be committable.

```env
# Supabase (URL + anon key are public-safe; service role is a privileged secret)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI provider secret (server only)
OPENAI_API_KEY=

# Payment (LemonSqueezy) — API secret + webhook signature secret (server only)
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=

# Custom child session token signing secret (server only; never log)
CHILD_JWT_SECRET=

# CORS allowed origin (runtime config, e.g. https://zeluu.com)
ALLOWED_ORIGIN=
```

**Optional, future-only (NOT part of the current contract; see §5.9):** if store/variant
ids and the app base URL are externalised later, the example would also gain
`LEMONSQUEEZY_STORE_ID=`, per-plan variant ids (or a single JSON map), and `APP_BASE_URL=`.
Deferred pending a separate decision.

## 10. Planning Gaps & Caveats

### 10.1 `.gitignore` would ignore `.env.example`
`.gitignore` contains `.env` and **`.env.*`**. The `.env.*` glob matches `.env.example`
too, so a naively-added `.env.example` would be **silently untracked**. The future creation
slice must add a negation line (`!.env.example`) **or** the example will never reach the
repo. (Recorded; **not changed here** — `.gitignore` edits are out of scope.)

### 10.2 No `.env`/`.env.example` present
No `.env*` files exist in the repo (confirmed by listing names only; no values read). The
absence of `.env.example` is an onboarding + validation gap that this plan addresses for a
later slice.

### 10.3 Only one var is guarded today
`LEMONSQUEEZY_WEBHOOK_SECRET` is the **only** env var with an explicit presence check. All
others fail late, generically, or (for `CHILD_JWT_SECRET` verify and `ALLOWED_ORIGIN`)
partly silently. This is the core justification for a centralised validator.

### 10.4 Conditional safety of the public anon key
The hardcoded frontend anon key is only safe because RLS is enforced. STAGE1-B found RLS is
**parent-scoped only** (child isolation is app-layer). So anon-key safety depends on
**both** RLS correctness **and** the server-side child-context guards — to be verified by
future STAGE1-H tests, not assumed here.

## 11. What Future Tests Should Verify (plan only — no tests created)

* Each required var **missing/blank → fail-fast with a clear, secret-free message** (not a
  late generic 500, not a silent `null`).
* `SUPABASE_SERVICE_ROLE_KEY` ≠ `SUPABASE_ANON_KEY` (privilege-downgrade guard).
* Server `SUPABASE_ANON_KEY` matches the literal in `public/js/supabase-config.js`.
* Secrets never appear in logs or error responses (assert the webhook/checkout/child-auth
  paths return generic messages; no value echoed).
* Static check: service-role / OpenAI / LS / JWT secret names never appear in `public/`.
* Webhook: valid/invalid/tampered signature behavior with the secret present; explicit
  error when the secret is absent.
* All external services (Supabase, OpenAI, LemonSqueezy) **mocked** — no live calls, no real
  secrets, no production data.

## 12. Recommended Next Slice

Two docs-only candidates remain; **either** is safe next, neither implements anything:

1. **STAGE1-G — Webhook-Idempotency Design Spec** (recommended) — highest-value open risk
   (confirmed double-grant risk; no `processed_webhooks` table). Env validation (this spec)
   is its prerequisite because a missing `LEMONSQUEEZY_WEBHOOK_SECRET` would otherwise mask
   webhook test results.
2. **STAGE1-D — Test Tooling Proposal** (docs-only) — proposes the runner/mocks (Vitest/MSW)
   and the dependency-approval list, enabling the eventual env-validation **implementation**
   slice and its tests.

**First implementation slice, when approved (not now):** create `lib/env.js` (no-dependency
custom validator), wire it into `lib/supabase.js` / `lib/child-auth.js` / chat / exams /
checkout / webhook with the import-vs-request split in §8, add `.env.example` **with the
`!.env.example` gitignore negation**, then add the §11 tests. **Each of these is gated**
(source edits + `.env.example` + tests + any install all require explicit approval).

## 13. Hard Gates (must stay closed)

Implementing env validation · creating `.env.example` · editing `.gitignore` · installing
Zod/any dependency · modifying package scripts · editing `api/*`/`lib/*`/`public/*` ·
migrations/SQL/Supabase connection · changing auth/RLS/payment/webhook/credit/token logic ·
creating/running tests · build · deploy · React/Vite.

## 14. Acceptance Criteria

Accepted if: the env inventory is evidence-based (names + reference sites, no values);
every var is classified (public-safe vs server/service-role/webhook/payment/AI/JWT/config);
exposure/logging risks are recorded (with "needs implementation review" where uncertain);
a fail-fast validation plan (location, validator choice, import-vs-request split, safe error
style, serverless behavior, test mocking) is defined without implementation; an
`.env.example` proposal (names + placeholders, plus the `.gitignore` caveat) is drafted but
**not created**; no source files changed; no installs/tests/build/SQL/migrations/deploy; no
secret values read or printed; tracker + specs index updated; **session brief updated
last**; the next safe slice is clear.

## 15. Status

**Drafted / awaiting GPT and user review. No implementation authorized.**
