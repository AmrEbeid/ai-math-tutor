# RUNBOOK — Lemon Squeezy Manual Verification

> Manual verification plan for the card-required trial + webhook credit grants. **Manual
> only** — performed by the owner against a real/sandbox LS store. Claude does not create
> orders, call LS, or use real keys. Do not paste secrets, full payloads, or tokens here.

**Status:** Ready (manual). **Owner:** Amr. **Prereq:** migration 002 applied (so the
unique index + `payment_failed` CHECK are in place). **Date:** 2026-06-03

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
