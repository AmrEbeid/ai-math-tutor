-- Migration 002: Webhook idempotency + notification-type fix
-- Created: 2026-06-03 (FINISH-STAGE1-STAGE2-LOCAL, Phase 4 / C4c)
-- STATUS: NOT APPLIED. Local file only — review against the live schema before applying.
-- Idempotent style (IF NOT EXISTS / DROP CONSTRAINT IF EXISTS) consistent with 001.
--
-- Addresses two STAGE1 findings:
--   (1) Webhook credit grants are deduped only in app code (SELECT-then-INSERT on
--       credit_ledger.stripe_payment_id) with NO DB constraint, so concurrent
--       re-delivery can race and double-grant credits.
--   (2) Several notifications.type values used by the code (payment_failed,
--       child_distress, exam_completed, personal_info_shared) are NOT in the current
--       CHECK constraint, so those notification INSERTs fail the CHECK and are
--       silently swallowed by the callers' .catch handlers.

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
-- 3. Fix the notifications.type CHECK constraint
-- ============================================================================
-- Add the four notification types the application already emits but the original
-- CHECK omitted. Evidence (code): payment_failed (api/webhooks/lemonsqueezy.js),
-- child_distress + personal_info_shared (api/chat.js), exam_completed (api/exams.js).
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'stuck_loop',
    'credits_low',
    'credits_empty',
    'session_flagged',
    'weekly_report',
    'credit_limit_reached',
    'payment_failed',
    'child_distress',
    'exam_completed',
    'personal_info_shared'
  ));
