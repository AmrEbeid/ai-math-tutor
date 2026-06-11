# RUNBOOK — Lemon Squeezy Manual Verification

> Manual verification plan for the card-required trial + webhook credit grants. **Manual
> only** — performed by the owner against a real/sandbox LS store. Claude does not create
> orders, call LS, or use real keys. Do not paste secrets, full payloads, or tokens here.

**Status:** Ready (manual); prereqs met. **Owner:** Amr. **Prereq:** migration 002
applied (DONE 2026-06-11, PROD-APPLY-1B; live `notifications` CHECK already allowed
`payment_failed` per PROD-APPLY-1A). **Date:** 2026-06-03 (updated 2026-06-11)

## PROD-LS-1 automated pre-verification (2026-06-11 — read-only, no LS API/keys used)

Verified without touching Lemon Squeezy (per this runbook, Claude does not call LS):

- **Webhook endpoint live + publicly reachable:** `GET https://zeluu.com/api/webhooks/lemonsqueezy`
  → 405 (handler's non-POST response). The LS webhook URL should be exactly this.
- **Signing secret configured in prod:** `POST` with an invalid dummy `X-Signature` → **401
  "Invalid signature"** (a missing `LEMONSQUEEZY_WEBHOOK_SECRET` would 500). Fail-closed
  raw-body HMAC-SHA256, constant-time compare. No event processed; no data touched.
- **Idempotency prereq in place:** unique index live (PROD-APPLY-1B) → runbook test 6
  (replay) is now DB-enforced, not just code-enforced.
- **Code expectations** (for the dashboard cross-check): store id `315398`; 11 variants —
  monthly 1401741/1401764/1401745/1401766, annual 1401776/1401777/1401788/1401789,
  packs 1401809/1401816/1401821; events consumed: `order_created`, `subscription_created`,
  `subscription_updated`, `subscription_cancelled`, `subscription_payment_success`,
  `subscription_payment_failed`, `subscription_expired`, `subscription_resumed`;
  redirect `…/dashboard.html?payment=success`; trial = subscription order with total 0 →
  exactly 10 credits + 14-day `trialing`.
- **⚠️ Deployment findings (owner attention):** the project's `*.vercel.app` domains return
  401 (deployment protection) — LS must point at `zeluu.com`, not the vercel.app URL; and
  Vercel's GitHub integration **auto-deploys pushes to `origin/main`** (see tracker finding
  2026-06-11 — the deploy gate is not enforceable while that is on; latest two deployments
  are BLOCKED in Vercel and need owner review).

**Still owner-manual (cannot be done by Claude per this runbook):** LS dashboard checks —
store/product/variant existence + prices, card-required + 14-day trial settings per variant,
webhook URL = `https://zeluu.com/api/webhooks/lemonsqueezy`, enabled events list matches the
8 above, signing secret matches the Vercel env value, live-vs-test mode — and tests 1–10 below.

## Business rules under test
Card required before trial · 14-day trial · 10 free credits · no charge today · credits
granted **only** after the verified webhook · access in every LS status **except** `expired`.

## Tests

### 1. New user signup
- Setup: fresh email. Action: sign up → verify email. Expected: account created; `pendingPlan` survives OTP/email verify. DB: `profiles` row. UI: lands on plan/checkout. Stop if: plan lost after verify.

### 2. Card-required trial checkout
- Action: start trial for a plan. Expected: LS checkout requires a card; states "no charge today". Stop if: checkout allows no-card, or copy contradicts card-required.

### 3. Return from checkout
- Action: complete checkout → redirect to `/dashboard.html?payment=success`. Expected: "Activating your trial…" overlay, then pending state if webhook not yet landed (no bounce to pricing). Stop if: paid user bounced to pricing.

### 4. Webhook received
- Expected: LS sends `order_created`/`subscription_created`; signature verified (raw-body HMAC). DB: `subscriptions` row written. Stop if: signature failures (secret mismatch).

### 5. 10 trial credits granted
- Expected: exactly **10** credits. DB: one `credit_ledger` row `type` trial/signup_bonus with `stripe_payment_id = ls_order_<id>`. UI: credit badge shows 10. Stop if: ≠ 10 or none.

### 6. Duplicate webhook replay does NOT double-grant
- Action: replay the same `order_created` event from the LS dashboard. Expected: **no second grant** (unique index on `stripe_payment_id` blocks the duplicate insert; code SELECT-skips). DB: still exactly one grant row for that order id. Stop if: credits double (regression / migration not applied).

### 7. `payment_failed` notification path (post-migration 002)
- Action: trigger a `subscription_payment_failed` event. Expected: a `notifications` row of `type = 'payment_failed'` is created (CHECK now allows it). Stop if: insert silently fails (migration 002 not applied).

### 8. Expired subscription blocks access only when intended
- Action: set/simulate status `expired`. Expected: app access blocked. Other statuses (`on_trial`/`active`/`past_due`/`unpaid`/`cancelled`/`paused`) allow access. Stop if: access blocked for a non-`expired` status.

### 9. Active/trialing lifecycle allows access
- Expected: `on_trial`/`active` → access granted. DB: subscription status reflects lifecycle.

### 10. Dashboard activation/waiting state
- Expected: activation overlay then content once the subscription row exists (dashboard polls its own DB, not LS). Stop if: stuck overlay or premature access before webhook confirmation.

## Evidence (no secrets)
Record per test: pass/fail, the relevant DB row id/count (e.g. "1 credit_ledger row for ls_order_123, amount 10"), and UI outcome. Never paste the webhook secret, API key, full payload, or child/parent PII.
