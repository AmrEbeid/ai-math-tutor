# Zeluu Runbooks

> Manual, owner-executed operational runbooks. Claude does **not** run these. No secrets
> belong in any runbook — record outcomes (pass/fail, row counts/ids) only.

| Runbook | Purpose |
|---------|---------|
| [RUNBOOK-PROD-GATE-1-production-readiness.md](RUNBOOK-PROD-GATE-1-production-readiness.md) | Master local→production gate sequence, stop conditions, evidence. |
| [RUNBOOK-migration-002-webhook-idempotency.md](RUNBOOK-migration-002-webhook-idempotency.md) | Preflight / apply / verify / rollback for migration 002 (NOT applied). |
| [RUNBOOK-lemon-squeezy-manual-verification.md](RUNBOOK-lemon-squeezy-manual-verification.md) | Manual trial/checkout/webhook verification (grant-once, payment_failed). |

Related read-only SQL: `supabase/sql/preflight_002_webhook_idempotency.sql` (SELECT-only).
Related checklist: `docs/checklists/CHECKLIST-production-env-and-deploy.md`.
