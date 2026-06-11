# RUNBOOK — Apply Migration 002 (Webhook Idempotency + Notification Types)

> Manual apply pack for `supabase/migrations/002_webhook_idempotency_and_notification_types.sql`.
> **Claude does not run any of this.** Apply only via an approved layer after preflight.

**Status:** **APPLIED to production 2026-06-11 (PROD-APPLY-1B)** as remote migration
`20260611085209_webhook_idempotency_unique_index_and_processed_webhooks`, after the owner
gave the exact confirmation phrase. Pre-apply preflight re-run same day: PASS (0 dup
payment refs, no index, `processed_webhooks` absent). Post-apply verification: PASS
(`to_regclass('public.processed_webhooks')` not null; unique index present;
`credit_ledger` intact, 53 rows; `processed_webhooks` empty). **New follow-up finding
(gated):** `processed_webhooks` is the only public table with RLS disabled and is
anon/authenticated-visible via GraphQL — enable RLS (service-role webhook handler is
unaffected) in a future approved slice. **Date:** 2026-06-11

> **PROD-APPLY-1A live preflight finding (project `gstjvjynkdvqncjyybwm`, PRODUCTION):**
> the notification-CHECK section was **removed** from migration 002. The live
> `notifications_type_check` already allows all needed types **plus** `subscription_expired`
> and `subscription_expiring`, so the rewrite would have regressed the live schema. Migration
> 002 now does **only** the unique index + `processed_webhooks`. Preflight confirmed: 0
> duplicate payment refs (3 rows), no existing unique index, `processed_webhooks` absent,
> `notifications` empty. The repo migration 001 CHECK is stale vs live (separate
> schema-reconciliation task).

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
3. ~~`notifications.type` CHECK rewrite~~ — **REMOVED** (see preflight finding above). Live
   already allows all needed types; no production CHECK change is needed.

## 3. Preflight (read-only — run first)

Run `supabase/sql/preflight_002_webhook_idempotency.sql`. Required outcomes:

- [x] **0 duplicate** non-null `credit_ledger.stripe_payment_id` values (preflight: 0, 3 rows). If > 0, **STOP** and de-duplicate first — otherwise the unique index creation fails.
- [x] `processed_webhooks` does not already exist (preflight: absent).
- [x] The unique index does not already exist (preflight: absent → migration not yet applied).
- [i] `notifications_type_check` is informational only now (rewrite removed). Preflight: 12 live types (superset of needs).

## 4. Apply (manual, approved layer)

- [ ] Take/confirm a DB backup or rely on the platform's PITR.
- [ ] Apply `002_*.sql` via Supabase SQL editor / `supabase db push` / approved apply layer.
- [ ] Apply in a low-traffic window (the unique index builds against existing rows).

## 5. Post-apply verification (read-only)

- [ ] `SELECT to_regclass('public.processed_webhooks');` → not null.
- [ ] Unique index present: `SELECT indexname FROM pg_indexes WHERE indexname = 'credit_ledger_stripe_payment_id_unique';`
- (notifications CHECK is unchanged by this migration — no verification needed.)

## 6. Rollback considerations (manual DBA review required)

> Keep rollback in this runbook only; review before use.

- `DROP INDEX IF EXISTS credit_ledger_stripe_payment_id_unique;`
- `DROP TABLE IF EXISTS processed_webhooks;` (only if empty / created by this migration)
- (No notifications CHECK rollback needed — this migration no longer touches it.)

## 7. Known risks

- Unique-index creation fails if duplicate payment ids exist (preflight gate — confirmed 0).
- The migration does not retro-fix already-double-granted rows (data remediation is separate).
- `processed_webhooks` is created but not yet used by code — no behavior change from it alone.
- **Repo-vs-live schema drift:** live has notification types + (likely) other objects not in
  repo migrations. Reconcile the live schema into version control as a separate task before
  treating the repo migrations as authoritative.

## 8. Owner / approval

Owner: Amr. Requires explicit approval + DBA review before apply. Claude must not apply it.
