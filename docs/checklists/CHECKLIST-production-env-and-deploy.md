# CHECKLIST — Production Env & Deployment

> Manual pre-deploy checklist. Verify env presence **without printing values** (Vercel
> shows "Set" without revealing the value). Claude does not read Vercel env or deploy.

**Status:** **VERIFIED 2026-06-11 (PROD-ENV-1)** — names-only `vercel env ls` (no values
read or printed): 7/8 vars were set in Production; **`ALLOWED_ORIGIN` was missing**
(API fell back to permissive `*`, the exact STAGE1-C-predicted failure). Fixed: added
`ALLOWED_ORIGIN=https://zeluu.com` (Production only; public origin, not a secret;
`www.zeluu.com` confirmed non-resolving so the exact origin is safe) and redeployed
(`dpl_3rccRhRKpYHfEAwPeSoXFEsyhQef`). Verified live: preflight now returns
`access-control-allow-origin: https://zeluu.com`; full re-smoke green. Extra var
present: `LEMONSQUEEZY_STORE_ID` (unused by code — checkout hardcodes the store id).
**Hygiene note for owner:** all secrets are scoped to Development+Preview+Production
together — §2 wants separate preview values; split when convenient.
**Owner:** Amr. **Date:** 2026-06-03 (verified 2026-06-11)

## 1. Required env vars (all 8, validated via `lib/env.js`)

| Var | Prod required? | Scope | Where used | Verify (no value) | Failure mode if missing |
|-----|----------------|-------|------------|-------------------|--------------------------|
| `SUPABASE_URL` | Yes | public-safe | `lib/supabase.js` (both clients) | Vercel shows "Set"; matches `public/js/supabase-config.js` host | `getEnv` throws → 500 on first DB call |
| `SUPABASE_ANON_KEY` | Yes | public-safe (RLS-dependent) | `lib/supabase.js` (auth client) | "Set"; equals the literal in `supabase-config.js` | `getEnv` throws when a bearer token is present |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **server secret (BYPASSRLS)** | `lib/supabase.js` (server client) | "Set"; **never** in `public/`/`*_PUBLIC` | `getEnv` throws → 500 |
| `OPENAI_API_KEY` | Yes | **AI secret** | `api/chat.js`, `api/exams.js` | "Set" | `getEnv` throws at cold start → 500 (chat/exams) |
| `LEMONSQUEEZY_API_KEY` | Yes | **payment secret** | `api/credits/checkout.js` | "Set" | `getEnv` throws → 500 before LS fetch |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Yes | **webhook secret** | webhook | "Set"; matches the LS store webhook secret | `getEnv` throws → caught → 500 (secret-free) |
| `CHILD_JWT_SECRET` | Yes | **auth/HMAC secret** | `lib/child-auth.js` | "Set"; strong/random | sign throws; verify fails closed → child login broken |
| `ALLOWED_ORIGIN` | Yes (prod) | runtime config | all endpoints + `getAllowedOrigin()` | "Set" to exact prod origin (e.g. `https://zeluu.com`) | falls back to `'*'` (permissive) — set it for prod |

- [x] All 8 set in Vercel **Production** (2026-06-11; `ALLOWED_ORIGIN` added this day).
- [x] No `*_PUBLIC` / `NEXT_PUBLIC_*` duplicates in the env list (names-only check).
- [x] `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ANON_KEY` are distinct entries (values not compared — runtime behavior correct: anon-auth 401s, service-role queries work).

## 2. Vercel environment scope
- [ ] Production scope holds all 8.
- [ ] Preview scope: separate (non-prod) values where used; never prod secrets in shared previews.
- [ ] `ALLOWED_ORIGIN` per environment (preview origin ≠ prod origin).

## 3. `ALLOWED_ORIGIN` exact value
- [ ] Production: the exact prod web origin, scheme + host, **no trailing slash/path** (e.g. `https://zeluu.com`).

## 4. Deployment smoke test (post-deploy)
- [ ] Parent login works (Supabase auth).
- [ ] Child login issues a token; tutor chat at `/app` responds (mocked-safe, real OpenAI in prod).
- [ ] `credits/balance` returns a value; credit badge renders.
- [ ] Pricing/landing show card-required/14-day/10-credit copy (no "no card required").
- [ ] Checkout opens LS; return shows activation state.
- [ ] CORS: requests from the prod origin succeed; preflight returns the configured origin.
- [ ] No secret/PII in Vercel runtime logs.

## 5. Rollback
- [ ] Know the previous good deployment (Vercel "Promote to Production" / instant rollback).
- [ ] If migration 002 was applied this cycle, see the migration rollback section in its runbook (DBA review).

## 6. No-secret logging reminder
- [ ] Confirm error responses are generic; no env values, tokens, or webhook payloads logged.
