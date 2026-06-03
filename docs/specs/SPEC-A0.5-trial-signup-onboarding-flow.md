# SPEC-A0.5 — Trial Signup, Card-Based Onboarding & Activation UX

> Documentation of completed work. This spec is a record only — **do not edit the
> A0.5 implementation files based on this document.**

## 1. Purpose

Fix the trial signup, card-based onboarding, and post-checkout activation experience
so that the messaging is accurate, the chosen plan survives email/OTP verification,
and the user sees a clear "activating" state after checkout instead of being bounced
back to pricing.

## 2. Business Rules

* Card / payment method is **required** before trial activation.
* Trial is **14 days**.
* Trial includes **10 free credits**.
* **No charge today.**
* Trial credits are granted **only after the Lemon Squeezy webhook confirms** the order.
* No-card trial is **not** the current business model.

## 3. Problem Found

* Misleading "No card required" / "No credit card required" copy contradicted the
  card-required business rule.
* Incorrect "7-day trial" copy contradicted the 14-day trial rule.
* The user's selected plan (`pendingPlan`) could be lost during OTP / email
  verification, breaking the onboarding flow.
* After checkout, the dashboard did not communicate the webhook-confirmation wait,
  so users could be redirected back to pricing before activation completed.

## 4. Implemented Scope

Frontend flow and copy only. No backend logic changed. No deployment performed.

## 5. Files Changed

* `public/index.html`
* `public/pricing.html`
* `public/login.html`
* `public/dashboard.html`

> Note: As of A0.OS these four files appear as modified-but-uncommitted in the working
> tree, alongside Stage 0 `api/*` changes. A0.OS did not touch them.

## 6. What Was Fixed

* Removed misleading "No card required" / "No credit card required" copy.
* Corrected the wrong "7-day trial" copy to the 14-day trial.
* Preserved the pending plan through OTP / email verification using a `localStorage`
  fallback for `pendingPlan`.
* Added a dashboard post-checkout waiting state using "Activating your trial…".
* Delayed the webhook-timeout UX so the user is not immediately redirected back to
  pricing while activation is still pending.

## 7. What Was Not Changed

* No backend logic.
* No payment / webhook code.
* No Supabase schema or RLS.
* No new pages (no `/signup.html`, no `/trial-activation.html`).
* No dependency installs, migrations, or deployment.

## 8. Manual Lemon Squeezy Verification Checklist

* [ ] Trial **requires a payment method** for all subscription variants.
* [ ] Trial length is configured to **14 days** for all subscription variants.
* [ ] Checkout success URL is `/dashboard.html?payment=success`.
* [ ] Webhook events are enabled and reaching the endpoint.
* [ ] `order_created` (and trial-related) events grant the expected **10 credits**.
* [ ] No charge occurs at trial start.

## 9. Remaining Risks

* "Require payment method for trial" depends on Lemon Squeezy dashboard config —
  must be manually verified (external gate).
* Webhook idempotency improved but not enforced at the DB level.
* `subscription_updated` trial-to-active credit path should be reviewed for explicit
  idempotency.
* Trial expiry enforcement in `/api/credits/balance` must be verified.
* Activation UX depends on timely webhook delivery; slow webhooks degrade the
  experience even with the improved waiting state.

## 10. Follow-Up Candidates

* DB-level idempotency for credit grants.
* Explicit trial-expiry enforcement and tests.
* A dedicated activation/confirmation page (future; not approved).
* Card-required-trial messaging consistency audit across all surfaces.

## 11. Acceptance Criteria

* No surface advertises a no-card or 7-day trial.
* All trial messaging states card-required, 14 days, 10 credits, no charge today.
* Selected plan survives OTP / email verification.
* After checkout, the dashboard shows an "Activating your trial…" state and does not
  prematurely bounce the user to pricing.
* No backend behavior changed by A0.5.

## 12. Status

**Implemented (frontend-only); pending manual Lemon Squeezy verification; not
deployed.**
