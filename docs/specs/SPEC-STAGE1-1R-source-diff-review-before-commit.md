# SPEC-STAGE1-1R — Source Diff Review Before Commit

> Detailed **read-only** review of the 14 uncommitted source diffs (Stage 0 `api/*` +
> A0.5 `public/*`) before any source commit. **Nothing was staged, committed, reset,
> reverted, stashed, or edited; no tests/build/SQL/migrations/deploy; no live Supabase.**
> Evidence: `git diff` per file + targeted read-only checks against
> `supabase/migrations/001_initial_schema.sql` and `lib/child-auth.js`. Companion to
> STAGE1-1 (cleanup plan), STAGE1-B (schema/RLS/API), STAGE1-C (env/secrets).

**Status:** Drafted / awaiting GPT and user review. **No source commit authorized yet.**
**Date:** 2026-06-03
**Risk class:** High planning relevance (auth/payment/credit/frontend), low execution (read-only + docs-only).

## 1. Purpose

Review the remaining 14 uncommitted source diffs in enough depth to decide whether (and how)
they are safe to commit later, and to define the manual verification each needs. This
sharpens the STAGE1-1 commit plan (C4/C5) into a risk-rated, possibly-split recommendation,
and surfaces correctness findings — without changing or committing any code.

## 2. Scope

Read-only `git diff` of all 14 files + read-only schema/lib cross-checks; docs-only output
(this spec + index/tracker/brief updates).

## 3. Non-Goals

Did **not**: commit · stage · reset/revert/stash · edit source · run tests/build · install
packages · run SQL · apply migrations · connect to Supabase · deploy · start Stage 1 or
Stage 2 implementation · start React/Vite.

## 4. Git Baseline

* Branch `main`; HEAD `d5f7d0d` (docs C3). Last 3 commits = the docs waves
  (`d5f7d0d`/`09b8142`/`590e67b`); source untouched beneath them.
* **Staged: none.** 14 source files `M` unstaged (unchanged since STAGE1-1: +157/−85).
  `PROJECT_BRIEF.md` untracked (held out). No unexpected docs modified after STAGE1-1A.

## 5. API Source Diff Review (Stage 0)

### 5.1 The 7 CORS-only one-liners
**Files:** `api/auth/child-login.js`, `api/auth/profile.js`, `api/credits/balance.js`,
`api/credits/checkout.js`, `api/exams.js`, `api/sessions/create.js`, `api/sessions/history.js`.

| Field | Finding |
|---|---|
| Change | `Access-Control-Allow-Origin: '*'` → `process.env.ALLOWED_ORIGIN || '*'` (identical edit) |
| Purpose | Restrict CORS to the configured origin (Stage 0 hardening) |
| Risk area | CORS/env | Risk | **Low** |
| Intentional / matches Stage 0 | yes / yes |
| New risk | If `ALLOWED_ORIGIN` is unset, falls back to `'*'` → **no hardening in that env** (silent). No credentialed-CORS issue (no `Allow-Credentials: true` is set, so `'*'` is legal). |
| Manual verify | behavior with `ALLOWED_ORIGIN` set vs unset |
| Commit later | **C4a** (low-risk batch) | Hold? | no |
| Link | tie to STAGE1-C env validation: `ALLOWED_ORIGIN` should be **required** so the `'*'` fallback isn't relied on in prod |

### 5.2 `api/chat.js` — CORS + credit-count reorder + low-credit dedup
| Field | Finding |
|---|---|
| Change | (a) CORS one-liner; (b) **save user+assistant messages BEFORE the credit-count query** (was after); (c) gate changed `(msgCount\|\|0) % n === 0` → `msgCount !== null && msgCount % n === 0`; (d) low-credit notification now suppressed if a `credits_low` notif exists in the last 24h |
| Purpose | Correct the "1 credit per 5 text / 2 image msgs" modulo (count must include the just-saved message) + stop low-credit notification flooding |
| Risk area | credit deduction + chat + CORS + notifications | Risk | **High** (credit logic) |
| Intentional / matches Stage 0 | yes / yes |
| Behavior change | deduction timing shifts: old counted **before** save (first msg → count 0 → `0%5==0` → deduct on msg 1,6,11…); new counts **after** save (msg 5,10,15…). New = "5 free interactions then 1 credit", which reads as the intended model — **must be confirmed against product intent.** |
| Good properties | messages+deduction happen **after** a successful OpenAI response (failed AI call → no save, no deduct ✅); zero-balance is gated earlier via `get_valid_credit_balance` (STAGE1-B). |
| Residual risk | not transactional — concurrent chat requests can interleave count/deduct (race; pre-existing, not introduced). Low-credit dedup query filters on `created_at`+`type` but `notifications` is indexed on `(parent_id, read)` only (minor perf note). **No tests exist** to lock this in. |
| Manual verify | deduct fires exactly on the Nth message; no double/again on retries; low-credit notif at most once/24h |
| Commit later | **C4b** | Hold? | until manual verification |

### 5.3 `api/children.js` — CORS + real token verify + service-role consolidation
| Field | Finding |
|---|---|
| Change | (a) removes a local inline `verifyChildToken(req)` that decoded the JWT body via `base64` **without verifying the HMAC signature**; (b) imports and uses `verifyChildToken` from `lib/child-auth.js` (confirmed: `createHmac` + `signature !== expectedSignature → null` + expiry); (c) `createClient(NEXT_PUBLIC_SUPABASE_URL\|\|SUPABASE_URL, SERVICE_ROLE)` → `createServerClient()`; (d) CORS one-liner |
| Purpose | Genuine **security upgrade**: child-limits endpoint now requires a *signed* token; service-role client centralized |
| Risk area | child auth/token + service-role + CORS | Risk | **High** (security-positive) |
| Intentional / matches Stage 0 | yes / yes |
| Impact | a forged/unsigned child token that previously passed `handleCheckLimits` is now **rejected** — strictly safer. Drops a `NEXT_PUBLIC_SUPABASE_URL` reference (good; that var wasn't in the STAGE1-C inventory). |
| Residual | child token still lives in `localStorage` (XSS) — unchanged here; token-storage remains a separate hard gate (STAGE2-4). No cross-family leakage introduced; `getParentId` scoping unchanged. |
| Manual verify | valid child token → limits OK; invalid/expired/forged → 401; parent cannot read another family's child |
| Commit later | **C4b** | Hold? | recommend manual verify (high-value, low regression risk) |

### 5.4 `api/webhooks/lemonsqueezy.js` — idempotency + logging + field fix
| Field | Finding |
|---|---|
| Change | (a) **per-event idempotency**: `order_created`, `subscription_created`, `subscription_payment_success` each SELECT `credit_ledger` by `stripe_payment_id` (`ls_order_<id>` / `ls_sub_<id>` / `ls_payment_<id>`) and skip the grant if found; (b) `subscription_created` dup-check widened to `['active','trialing']` + 24h window (was `active` + 60s); (c) **reduced logging** — drops `customData`/`userId`/full-payload logs (privacy-positive); (d) `payment_failed` notification `message:` → `body:` |
| Purpose | Reduce double-credit-grant on webhook replay; reduce PII/payload logging; fix notification field |
| Risk area | payment / webhook / credit / idempotency / logging | Risk | **High** |
| Intentional / matches Stage 0 | yes / yes |
| Signature safety | **unchanged** — raw-body HMAC-SHA256 + `timingSafeEqual` before JSON parse is intact (not in this diff). ✅ |
| ⚠️ Idempotency is best-effort, NOT DB-enforced | `credit_ledger.stripe_payment_id` is plain `text` with **no UNIQUE constraint** (migration line 112). The SELECT-then-INSERT has a **TOCTOU race**: two concurrent deliveries can both pass the SELECT and double-insert. Mitigates the common sequential-replay case but does **not** close the race. Confirms STAGE1-B/FINAL: the `processed_webhooks` (UNIQUE event id + `ON CONFLICT`) design (STAGE1-7/8) is still required. |
| 🐛 Correctness finding (`payment_failed`) | `notifications.type` CHECK = `('stuck_loop','credits_low','credits_empty','session_flagged','weekly_report','credit_limit_reached')` — **`payment_failed` is NOT allowed**, so this INSERT violates the CHECK and fails. The handler wraps it in `.catch(() => {})`, so the failure is **silently swallowed** (parent never gets the alert). The `message`→`body` fix is correct but insufficient; the `type` value (or the CHECK) must change in a future approved slice. **Not introduced by this diff's intent, but surfaced here.** |
| Manual verify | valid sig accepted; tampered rejected; **replayed event grants 10 trial credits exactly once**; concurrent-delivery race acknowledged; payment_failed path |
| Commit later | **C4c** | Hold? | until manual Lemon Squeezy replay verification; consider committing **before** the DB-idempotency migration (it's an improvement), but document the residual race + the `payment_failed` bug |

## 6. Frontend Source Diff Review (A0.5)

| File | Change summary | UX area | Intentional / matches A0.5 | New risk | Manual verify | Commit |
|---|---|---|---|---|---|---|
| `public/index.html` | hero copy "7-day, no card" → "14-day, 10 credits, card required, no charge today" | card-required messaging / 14-day / 10 credits | yes / yes | none | landing copy reads correctly | **C5** |
| `public/pricing.html` | meta + trial-tag + 4 plan notes + FAQ → card-required/no-charge-today; removes "No payment information required" | pricing copy / card-required | yes / yes | none | **no "no card required" contradiction remains** anywhere | C5 |
| `public/login.html` | `pendingPlan` persisted to **localStorage** (in addition to sessionStorage) + read-fallback + cleared before checkout; checkout-failure **error UX**; subtitle copy ("enter your card details… not charged for 14 days") | signup/login flow / pendingPlan persistence / checkout return | yes / yes | Low/Med — adds localStorage write + retry/error branches; verify existing-user login still works and plan isn't "stuck" across unrelated sessions | plan survives OTP/email verify; cleared after checkout; checkout-fail shows the new error; existing login unaffected | C5 |
| `public/dashboard.html` | "Activating your trial…" full-screen overlay on `payment=success`; **pending state** (don't bounce paid users to pricing) instead of redirect; webhook-wait retries **5→8** | dashboard activation / waiting state | yes / yes | Low/Med — overlay covers screen; ensure it's removed after polling (diff removes it before the `subscriptionFound` check ✅) | activation overlay shows then clears; paid-but-unconfirmed users see pending (not pricing); non-payment visits unaffected | C5 |

**Frontend safety:** no payment logic moved to the frontend; credits/subscription still
server-confirmed; no secret beyond the public anon key (STAGE1-C); copy now consistently
card-required.

## 7. Cross-File Interaction Review

**Stage 0 API:**
* CORS `ALLOWED_ORIGIN` now read in 9 endpoints (the 7 one-liners + chat + children) →
  one env var gates cross-origin behavior everywhere; ties directly to STAGE1-C (make it
  required so `'*'` fallback isn't used in prod).
* `child-login` issues the signed token; `children.handleCheckLimits` now verifies it with
  the **same** `lib/child-auth.js` HMAC — producer/verifier are now consistent.
* `chat` credit deduction writes `credit_ledger`; `credits/balance` reads it; webhook grants
  to it — all keyed on `parent_id` (+ `stripe_payment_id` for webhook dedup). The chat
  low-credit notification and the webhook share the `notifications` table (and its `type`
  CHECK — see the `payment_failed` bug).
* `checkout` creates the LS checkout; `webhook` grants credits on the confirmed event — the
  frontend must not assume credits before the webhook (it doesn't).

**A0.5 frontend:**
* `index`/`pricing` copy (card-required) must match `login` subtitle + the actual LS
  card-required checkout — now aligned.
* `login` writes `pendingPlan` (session+local); `dashboard` reads `payment=success` and
  polls its **own** DB (subscription row written by the webhook) — not LS — matching A0.6/A0.5.

**Stage 0 + A0.5 seam:**
* The dashboard "activating" overlay + 8 retries depends on the **webhook** writing the
  subscription/credits in time → if the webhook double-grant race or the silent
  `payment_failed` failure occur, the UX still degrades gracefully (pending state), but the
  underlying backend idempotency (STAGE1-7/8) is the real fix.
* Card-required copy now matches webhook-confirmed credit grants → consistent story.

## 8. Risk Matrix and Commit Recommendation

| File | Change type | Risk | Commit? | Hold? | Reason | Required verification |
|---|---|---|---|---|---|---|
| child-login, profile, balance, checkout, exams, sessions/create, sessions/history | CORS/env one-liner | Low | **C4a** | no | backward-compatible hardening | CORS w/ & w/o `ALLOWED_ORIGIN` |
| chat.js | credit-count reorder + notif dedup + CORS | High | C4b | until verify | changes credit timing | deduct-once on Nth msg; dedup 24h |
| children.js | signed-token verify + service-role + CORS | High | C4b | recommend verify | security-positive | valid/invalid/expired token; cross-family |
| webhooks/lemonsqueezy.js | idempotency + logging + field fix | High | C4c | until LS verify | best-effort dedup; `payment_failed` CHECK bug; race remains | LS replay grant-once; payment_failed |
| index/pricing/login/dashboard | trial UX/copy + flow | Low/Med | **C5** | optional verify | onboarding clarity | browser flow smoke |

**Recommendation: split C4 into C4a / C4b / C4c** — they are meaningfully different risk
areas (trivial CORS vs credit logic vs payment/webhook). C4a is safe to commit on its own;
C4b and C4c each need manual verification (and C4c carries a known `payment_failed` CHECK
bug + a residual race that the future DB-idempotency migration must close). **Do not combine
API and frontend (keep C5 separate).** C5 may commit after a browser flow smoke check.

## 9. Manual Verification Checklist

**Backend/API:**
- [ ] CORS works with `ALLOWED_ORIGIN` set (exact origin echoed); known behavior with it unset (`'*'`).
- [ ] Parent auth/profile GET/PUT works.
- [ ] Child login issues a token; child-limits works with a valid token.
- [ ] Child-limits rejects invalid/expired/forged (unsigned) tokens → 401.
- [ ] Parent A cannot access Parent B's children.
- [ ] Chat deducts a credit only on a successful AI response, exactly on the intended Nth message.
- [ ] Low-credit notification fires at most once per 24h.
- [ ] `credits/balance` returns the expected value.
- [ ] Checkout creates an LS checkout with the correct plan/variant + `custom_data`.
- [ ] Webhook validates signature (valid accepted; tampered rejected).
- [ ] Webhook grants the 10 trial credits **once**; sequential replay does not double-grant.
- [ ] Acknowledge remaining **concurrent**-delivery race (no DB UNIQUE on `stripe_payment_id`).
- [ ] Note the `payment_failed` notification CHECK-constraint failure (silently caught).

**Frontend/UX:**
- [ ] Landing + pricing say card required; no "no card required" left anywhere.
- [ ] New-user signup/login flow works; existing-user login works.
- [ ] `pendingPlan` persists through OTP/email verify and is cleared after checkout.
- [ ] Checkout redirect works; failure shows the new error message.
- [ ] Return from checkout shows the "Activating your trial…" state, then pending (not a bounce to pricing).
- [ ] Dashboard only shows active after backend confirmation.
- [ ] Mobile layout smoke check.
- [ ] No secret values in page source beyond the public anon key.

## 10. Source Commit Gates

User approval · clean staged set (explicit file lists, no `git add .`) · no source/docs
mixing · CORS/env review (C4a) · child-auth review (C4b) · service-role review (C4b) ·
credit/race review (C4b) · payment/webhook review + **manual Lemon Squeezy replay**
verification (C4c) · frontend flow review (C5) · confirm no secrets · no package/env/
migration changes in these commits.

## 11. Recommended Next Prompt

**`STAGE1-1C4A — Commit Low-Risk API CORS Changes`** (preferred): commit only the 7
backward-compatible CORS one-liners (explicit list), leaving the High-risk logic for review.
It's the smallest safe forward step and unblocks a partially-clean tree.

Alternatives: `STAGE1-1C4R — Backend Source Review / Manual Verification Before Commit`
(deeper verification of C4b chat/children + C4c webhook, incl. the `payment_failed` bug and
race, before committing them) · `STAGE1-1C5R — Frontend A0.5 Flow Review Before Commit`.

## 12. Acceptance Criteria

Accepted if: all 14 source diffs reviewed; risks classified; commit-split recommendation
clear (C4a/C4b/C4c/C5); manual verification checklist complete; no files staged/committed;
no source changed; tracker + index updated; session brief updated last.

## 13. Status

**Drafted / awaiting GPT and user review. No source commit authorized yet.**
