# Supabase migrations

## `live/` — authoritative production migration history

`live/` contains the **complete, verified production migration history** of project
`gstjvjynkdvqncjyybwm`, captured 2026-06-11 (SCHEMA-RECON-1) from
`supabase_migrations.schema_migrations`. All 22 files were verified against the live
database with whitespace-normalized MD5 checksums (trailing per-line whitespace and
leading/trailing newlines normalized; content otherwise byte-identical) — 22/22 matched
at capture time.

These files use the Supabase CLI naming convention (`<timestamp>_<name>.sql`) and are
the correct starting point for rebuilding the database or for `supabase db diff`/`db
reset` workflows (move them up to `supabase/migrations/` and remove the legacy files
below if adopting the CLI).

Replaying `live/` in order reproduces the production schema. Note that the history
contains self-corrections (e.g. `verify_child_login` is redefined four times;
`fix_pgcrypto_schema_prefix_v2` swaps the `set_child_password` parameter order) — that
is the real history, kept verbatim on purpose.

## Root `00N_*.sql` — legacy repo-authored files

| File | Status vs production |
|---|---|
| `001_initial_schema.sql` | **Stale.** A repo-authored approximation that was never the applied history — the live base is `live/20260301124338_create_core_schema.sql` plus the migrations after it. Live drift examples: `notifications_type_check` (live allows 12 types), `verify_child_login` shape, exam/knowledge tables absent from 001. Kept for historical reference only — do not apply. |
| `002_webhook_idempotency_and_notification_types.sql` | Applied 2026-06-11 = `live/20260611085209_*` (repo file carries extra status headers). |
| `003_pin_search_path_on_remaining_functions.sql` | Applied 2026-06-11 = `live/20260611153013_*`. |
| `004_drop_temp_transfer_table.sql` | Applied 2026-06-11 = `live/20260611153318_*`. |

## Things the live history does NOT contain

Captured history covers schema DDL applied via migrations. Known production state that
lives outside it:

* The **pg_cron subscription-lifecycle job** was applied outside the migration history.
  Verified live 2026-06-11: `cron.job` contains `enforce-subscription-expiry`
  scheduled `0 3 * * *` (daily 03:00 UTC), running `enforce_subscription_expiry()`.
  To recreate: `SELECT cron.schedule('enforce-subscription-expiry', '0 3 * * *',
  'SELECT public.enforce_subscription_expiry()');`
* Supabase Auth settings (OTP signup flow, leaked-password protection toggle) and
  storage/config are dashboard-managed, not in SQL migrations.
