-- READ-ONLY PREFLIGHT for migration 002 (webhook idempotency + notification types).
-- Created: 2026-06-03 (PENDING-CLOSURE-1). Run MANUALLY before applying 002.
-- SAFETY: SELECT-only. Contains NO ALTER / UPDATE / DELETE / INSERT / DROP / CREATE.
-- Claude does not execute this; it is a manual DBA/owner preflight aid.

-- 1. BLOCKER CHECK — duplicate non-null payment refs in credit_ledger.
--    Must return ZERO rows. If any rows return, the partial UNIQUE index in 002 will FAIL;
--    de-duplicate (manual review) before applying the migration.
SELECT stripe_payment_id, COUNT(*) AS occurrences
FROM credit_ledger
WHERE stripe_payment_id IS NOT NULL
GROUP BY stripe_payment_id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;

-- 2. Current notifications.type CHECK definition (confirm the 002 rewrite is additive:
--    it should add payment_failed / child_distress / exam_completed / personal_info_shared).
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.notifications'::regclass
  AND contype = 'c';

-- 3. Does processed_webhooks already exist? (NULL = not present = 002 will create it.)
SELECT to_regclass('public.processed_webhooks') AS processed_webhooks_table;

-- 4. Has migration 002 already been applied? (index present = already applied.)
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname = 'credit_ledger_stripe_payment_id_unique';

-- 5. Context: count of ledger rows carrying a payment ref (informational only).
SELECT COUNT(*) AS rows_with_payment_ref
FROM credit_ledger
WHERE stripe_payment_id IS NOT NULL;
