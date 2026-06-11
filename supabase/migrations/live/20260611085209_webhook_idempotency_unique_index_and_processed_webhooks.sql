-- Migration 002 (revised): Webhook idempotency
-- Part 1: close the webhook double-grant race at the DB level.
-- Partial UNIQUE (WHERE NOT NULL) because deduct / trial / signup-bonus
-- ledger rows legitimately carry a NULL payment reference.
CREATE UNIQUE INDEX IF NOT EXISTS credit_ledger_stripe_payment_id_unique
  ON credit_ledger (stripe_payment_id)
  WHERE stripe_payment_id IS NOT NULL;

-- Part 2: explicit processed-webhooks idempotency ledger (not yet wired
-- into the handler; provided for the future insert-first slice).
CREATE TABLE IF NOT EXISTS processed_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_name text,
  processed_at timestamptz DEFAULT now()
);

COMMENT ON TABLE processed_webhooks IS 'Idempotency ledger: one row per processed LemonSqueezy webhook event id.';