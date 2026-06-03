# RUNBOOK — Apply Migration 002 (Webhook Idempotency + Notification Types)

> Manual apply pack for `supabase/migrations/002_webhook_idempotency_and_notification_types.sql`.
> **Claude does not run any of this.** Apply only via an approved layer after preflight.

**Status:** Authored, NOT applied. **Approval:** owner + DBA review required. **Date:** 2026-06-03

## 1. File

`supabase/migrations/002_webhook_idempotency_and_notification_types.sql`

## 2. Purpose / what it changes

1. **Partial UNIQUE index** `credit_ledger_stripe_payment_id_unique` on
   `credit_ledger(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL` — closes the
   webhook double-grant race at the DB level (the handler keys grants on
   `ls_order_<id>`/`ls_sub_<id>`/`ls_payment_<id>`; a concurrent duplicate INSERT now fails
   with `23505` instead of double-granting).
2. **`processed_webhooks`** table (`event_id text UNIQUE`) — explicit idempotency ledger
   (not yet wired into the handler; for the future insert-first slice).
3. **`notifications.type` CHECK** extended to add the 4 types the code already emits but the
   original CHECK omitted: `payment_failed`, `child_distress`, `exam_completed`,
   `personal_info_shared` (today those inserts fail the CHECK and are silently swallowed).

## 3. Preflight (read-only — run first)

Run `supabase/sql/preflight_002_webhook_idempotency.sql`. Required outcomes:

- [ ] **0 duplicate** non-null `credit_ledger.stripe_payment_id` values. If > 0, **STOP** and
      de-duplicate first (manual DBA task) — otherwise the unique index creation fails.
- [ ] Note the current `notifications_type_check` definition (to confirm the rewrite is additive).
- [ ] `processed_webhooks` does not already exist (or exists with the same shape).
- [ ] The unique index does not already exist (migration not yet applied).

## 4. Apply (manual, approved layer)

- [ ] Take/confirm a DB backup or rely on the platform's PITR.
- [ ] Apply `002_*.sql` via Supabase SQL editor / `supabase db push` / approved apply layer.
- [ ] Apply in a low-traffic window (the unique index builds against existing rows).

## 5. Post-apply verification (read-only)

- [ ] `SELECT to_regclass('public.processed_webhooks');` → not null.
- [ ] Unique index present: `SELECT indexname FROM pg_indexes WHERE indexname = 'credit_ledger_stripe_payment_id_unique';`
- [ ] CHECK includes the 4 new types: inspect `pg_get_constraintdef` of `notifications_type_check`.
- [ ] A test `payment_failed` notification insert succeeds (in staging, not prod data).

## 6. Rollback considerations (manual DBA review required)

> Keep rollback in this runbook only; review before use.

- `DROP INDEX IF EXISTS credit_ledger_stripe_payment_id_unique;`
- `DROP TABLE IF EXISTS processed_webhooks;` (only if empty / created by this migration)
- Restore the prior `notifications_type_check` definition (re-add the original 6-type CHECK).
  Note: reverting the CHECK while rows of the new types exist would fail — clean up first.

## 7. Known risks

- Unique-index creation fails if duplicate payment ids exist (preflight gate).
- The CHECK rewrite (`DROP CONSTRAINT` + `ADD CONSTRAINT`) briefly has no type check; run in one transaction.
- The migration does not retro-fix already-double-granted rows (data remediation is separate).
- `processed_webhooks` is created but not yet used by code — no behavior change from it alone.

## 8. Owner / approval

Owner: Amr. Requires explicit approval + DBA review before apply. Claude must not apply it.
