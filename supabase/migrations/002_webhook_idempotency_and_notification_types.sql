-- Migration 002: Webhook idempotency (credit-grant unique index + processed_webhooks)
-- Created: 2026-06-03 (FINISH-STAGE1-STAGE2-LOCAL, Phase 4 / C4c)
-- Revised: 2026-06-03 (PROD-APPLY-1A) — removed the notifications.type CHECK rewrite
--   after the live preflight (project gstjvjynkdvqncjyybwm) showed the live constraint
--   ALREADY allows all needed types AND two more (subscription_expired,
--   subscription_expiring). Rewriting it here would have REGRESSED the live schema by
--   dropping those two. The repo's migration 001 CHECK is stale vs live; reconciling the
--   full live schema into version control is a separate task — see the migration runbook.
-- STATUS: NOT APPLIED. Local file only — review against the live schema before applying.
-- Idempotent style (IF NOT EXISTS) consistent with 001.
--
-- Addresses one confirmed live gap:
--   Webhook credit grants are deduped only in app code (SELECT-then-INSERT on
--   credit_ledger.stripe_payment_id) with NO DB constraint, so concurrent re-delivery
--   can race and double-grant credits. Live preflight confirmed: no unique index on that
--   column, 0 duplicate non-null values (3 payment-ref rows), processed_webhooks absent.

-- ============================================================================
-- 1. Close the webhook double-grant race at the DB level
-- ============================================================================
-- The webhook stores a stable payment reference per grant in
-- credit_ledger.stripe_payment_id (ls_order_<id> / ls_sub_<id> / ls_payment_<id>).
-- A partial UNIQUE index makes a concurrent duplicate INSERT fail with 23505 instead
-- of double-granting. Partial (WHERE NOT NULL) because deduct / trial / signup-bonus
-- ledger rows legitimately carry a NULL payment reference.
--
-- ⚠️ BEFORE APPLYING: if the live credit_ledger already contains duplicate non-null
-- stripe_payment_id values, this index creation will fail. De-duplicate first.
CREATE UNIQUE INDEX IF NOT EXISTS credit_ledger_stripe_payment_id_unique
  ON credit_ledger (stripe_payment_id)
  WHERE stripe_payment_id IS NOT NULL;

-- ============================================================================
-- 2. Explicit processed-webhooks idempotency ledger (STAGE1-7/8 design)
-- ============================================================================
-- Records each processed LemonSqueezy event id exactly once. Not yet wired into the
-- handler (an insert-first pattern would use this); provided for the future approved
-- slice. The UNIQUE(event_id) + ON CONFLICT DO NOTHING is the canonical guard.
CREATE TABLE IF NOT EXISTS processed_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_name text,
  processed_at timestamptz DEFAULT now()
);

COMMENT ON TABLE processed_webhooks IS 'Idempotency ledger: one row per processed LemonSqueezy webhook event id.';

-- ============================================================================
-- (REMOVED) notifications.type CHECK rewrite
-- ============================================================================
-- A prior draft rewrote notifications_type_check to add payment_failed / child_distress
-- / exam_completed / personal_info_shared. The PROD-APPLY-1A live preflight showed the
-- production constraint ALREADY allows those four PLUS subscription_expired and
-- subscription_expiring. Re-adding a 10-type CHECK here would DROP the two extra live
-- types (a regression), so the rewrite was removed. No change to notifications.type is
-- needed in production. (Bringing the live CHECK + other live-only objects into
-- version-controlled migrations is a separate schema-reconciliation task.)
