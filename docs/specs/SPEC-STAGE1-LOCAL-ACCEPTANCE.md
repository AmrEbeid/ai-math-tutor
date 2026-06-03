# SPEC-STAGE1-LOCAL-ACCEPTANCE — Stage 1 Local Readiness

> Records what was implemented **locally** for Stage 1 (no deploy, no live SQL, no live
> Supabase/Lemon Squeezy/OpenAI calls). Produced by FINISH-STAGE1-STAGE2-LOCAL Phases 1–8.

**Status:** Stage 1 **complete locally** (env validation now fully wired + tested —
LOCAL-CORRECTION-1); **blocked externally** on live gates (below).
**Date:** 2026-06-03 (updated by LOCAL-CORRECTION-1)
**Risk class:** High execution (source edits, migration files, commits); no production actions.

> **LOCAL-CORRECTION-1 (2026-06-03):** the earlier "complete locally" claim was overstated —
> env validation had been wired only at the Supabase seam. It is now wired for **all 8**
> required vars through `lib/env.js` (`getEnv`), with the `ALLOWED_ORIGIN` request-time
> fallback explicitly documented. Tests raised to **36**. See §5a.

## 1. What Was Implemented Locally

* **Docs committed** (pre-existing waves C1–C3 + this work's STAGE1-1R review commit).
* **Source committed in clean, risk-separated slices** (the previously-uncommitted Stage 0/A0.5 diffs):
  * **C4a** — 7 API CORS one-liners (`'*'` → `process.env.ALLOWED_ORIGIN || '*'`).
  * **C4b** — `api/chat.js` (credit-count reorder + 24h low-credit-notif dedup) + `api/children.js`
    (signed HMAC `verifyChildToken`, service-role consolidation). Added a **test seam**:
    `lib/child-auth.js` now lazy-imports `lib/supabase.js` so the token crypto is unit-testable.
  * **C4c** — `api/webhooks/lemonsqueezy.js` now uses a pure, length-safe signature helper
    `lib/webhook-verify.js`; migration `002` created (not applied).
  * **C5** — 4 A0.5 frontend files (card-required trial copy + pendingPlan persistence + activation UX).
* **Env validation** — `lib/env.js` (no-dependency validator; names-only errors), wired into
  `lib/supabase.js`; `.env.example` (placeholders only) created; `.gitignore` updated with
  `!.env.example` so the example is trackable while real `.env*` stay ignored.
* **Local test baseline** — `npm test` → `node --test tests/*.test.mjs`, **22 tests, 0 deps installed**.

## 2. Commits Created (this task)

| Hash | Message |
|------|---------|
| `8b89292` | docs: review source diffs before Stage 1 commits |
| `15d62f5` | fix: use configured CORS origin for API endpoints (C4a) |
| `8a60d2d` | fix: harden child auth and chat credit handling (C4b) |
| `b3f043f` | fix: harden Lemon Squeezy webhook signature, idempotency, and notification types (C4c) |
| `f0b4c87` | fix: improve card-required trial onboarding flow (C5) |
| `2a32f76` | feat: add server env validation and example config |
| `84d2084` | test: add Stage 1 local validation baseline (node:test) |

## 3. Tests Run

`npm test` → **36 passed / 0 failed** (Node built-in `node:test`, no network, no real secrets):
* `tests/child-auth.test.mjs` (7) — signed-token round-trip; forged/tampered/expired/malformed rejected; **missing-secret: sign throws / verify fails closed**.
* `tests/webhook-verify.test.mjs` (6) — valid accepted; wrong-secret/tampered/length-mismatch/blank rejected; missing-secret throws.
* `tests/frontend-copy.test.mjs` (6) — no no-card contradiction; card-required/14-day/10-credit/activation copy present; no leaked secret.
* `tests/env.test.mjs` (8) — present/missing/blank handling; **all 8 required vars fail secret-free via `getEnv`**; missing-names-only errors; `getAllowedOrigin` fallback; `.env.example` placeholders-only.
* `tests/child-chat-ux.test.mjs` (9) — Stage 2 child-chat UX invariants.

## 4. Migrations Created But NOT Applied

* `supabase/migrations/002_webhook_idempotency_and_notification_types.sql`:
  * partial **UNIQUE index** on `credit_ledger(stripe_payment_id) WHERE NOT NULL` → closes the webhook double-grant race at the DB level;
  * `processed_webhooks` table (event-id UNIQUE) — the STAGE1-7/8 idempotency ledger (not yet wired into the handler);
  * ~~extends `notifications.type` CHECK~~ — **REMOVED after the PROD-APPLY-1A live preflight** (the prod CHECK already allows those 4 types + `subscription_expired`/`subscription_expiring`; the rewrite would have regressed prod). Migration 002 now does only the unique index + `processed_webhooks`.
* **NOT applied.** Review against the live schema first (esp. de-dup existing `stripe_payment_id` before the unique index can be created).

## 5a. Env Validation — Full Wiring (LOCAL-CORRECTION-1, commit `948baa8`)

All 8 required env vars now flow through `lib/env.js` and fail secret-free:

| Var | Validated at | Behavior when missing/blank |
|-----|--------------|------------------------------|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase.js` via `getEnv` | throw `Missing required env var: <NAME>` at client creation |
| `OPENAI_API_KEY` | `api/chat.js` + `api/exams.js` via `getEnv` | throw at module load (cold start) → 500 |
| `LEMONSQUEEZY_API_KEY` | `api/credits/checkout.js` via `getEnv` (request-time) | throw → 500 before the LS fetch |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | webhook via `getEnv` (request-time) | throw → caught → 500 (secret-free) |
| `CHILD_JWT_SECRET` | `lib/child-auth.js` via `getEnv` (call-time) | sign **throws** (login); verify **fails closed → null** |
| `ALLOWED_ORIGIN` | `getAllowedOrigin()` helper (request-time) | **documented `'*'` fallback** (CORS config, not a secret); flagged by `validateServerEnv()` for boot/CI; prod must set it |

Error messages name the variable only — never the value (covered by tests).

## 5. Findings Carried Forward

* Webhook idempotency remains **best-effort in code** until migration 002 is applied (race window).
* **CORRECTION (PROD-APPLY-1A):** the earlier "notifications.type CHECK silently fails for 4 types" finding was true only against the **repo** migration 001 — the **live** DB already allows all of them (+2 more). There is **no production notification bug**; it was repo-vs-live drift. The CHECK rewrite was removed from migration 002.
* `ALLOWED_ORIGIN` is intentionally request-time with a documented `'*'` fallback (not fail-fast) — prod must set a concrete origin (external gate).
* `console.error('set_child_password error:', error)` (children.js) logs an error object — pre-existing; flagged in STAGE1-C for a future log-scrub review (no password value logged).

## 6. External Gates Remaining (NOT done — require approval/live access)

* Apply migration `002` to live Supabase (after de-dup review).
* Manual Lemon Squeezy webhook **replay** verification (grant-exactly-once) + card-required/14-day/10-credit dashboard config.
* Production env verification in Vercel (all 8 vars set; `ALLOWED_ORIGIN` correct).
* Deployment + production smoke test.
* RLS / SECURITY-DEFINER `search_path` hardening review + migration (STAGE1-9/10).
* Child token-storage hardening (localStorage → httpOnly cookie) — hard gate.

## 7. Stage 1 Local Status

**Complete locally** (all local checks pass; source committed; **env validation fully wired
for all 8 vars + tested**; `.env.example` + 36-test baseline in place; migration authored).
**Blocked externally** on the §6 live gates — no production completion is claimed.
