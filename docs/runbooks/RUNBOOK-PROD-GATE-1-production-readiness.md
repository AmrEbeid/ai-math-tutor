# RUNBOOK — PROD-GATE-1 Production Readiness (Master)

> Master checklist to move Zeluu from **local completion** to **production**. Every step
> here is a **manual / approved** action performed by the owner (or an approved apply
> layer) — Claude does not execute any of it. No secrets belong in this file.

**Status:** Ready to execute (manual). **Owner:** Amr. **Date:** 2026-06-03

## 1. Preconditions (verify before starting)

- [ ] Stage 1 complete locally (`SPEC-STAGE1-LOCAL-ACCEPTANCE.md`); LOCAL-CORRECTION-1 accepted.
- [ ] `npm test` passes locally (36/36).
- [ ] `.env.example` exists with placeholders only; real secrets live in Vercel, not git.
- [ ] `supabase/migrations/002_*.sql` authored but **NOT applied**.
- [ ] No pending source diffs; working tree clean except `PROJECT_BRIEF.md` (held out).
- [ ] Production secrets are managed outside git (Vercel env).

## 2. Production gate sequence (in order)

1. **Verify production env** — `CHECKLIST-production-env-and-deploy.md` (all 8 vars set; `ALLOWED_ORIGIN` = exact prod origin).
2. **Migration 002 preflight** — run `supabase/sql/preflight_002_webhook_idempotency.sql` (read-only) per `RUNBOOK-migration-002-webhook-idempotency.md`.
3. **Check duplicate webhook/payment IDs** — preflight query for duplicate `credit_ledger.stripe_payment_id`; de-dup first if any (else the unique index fails).
4. **Apply migration 002** — manually, via the approved apply layer (Supabase SQL editor / CLI / Lovable). Not by Claude.
5. **Verify migration applied** — unique index exists; `processed_webhooks` exists; `notifications.type` CHECK includes the 4 added types.
6. **Lemon Squeezy replay/test** — `RUNBOOK-lemon-squeezy-manual-verification.md`.
7. **Verify 10 trial credits grant once only** — including a duplicate-delivery replay.
8. **Verify `payment_failed` notification path** — now that the CHECK allows it (insert no longer silently fails).
9. **Deploy** — Vercel production deploy.
10. **Production smoke test** — `CHECKLIST-production-env-and-deploy.md` smoke section.
11. **Record evidence** — update `PROJECT_TRACKER.md` external-gates rows + `SESSION_BRIEF.md`.

## 3. Stop conditions (halt + report)

- Duplicate `credit_ledger.stripe_payment_id` rows exist → unique index would fail.
- Any production env var missing/blank.
- Lemon Squeezy webhook secret mismatch (signature failures).
- Migration apply errors.
- Webhook replay **double-grants** credits.
- Production smoke test fails.
- Unexpected source diff appears mid-gate.
- Any secret appears in logs / error bodies.
- `npm test` fails locally.

## 4. Evidence required per gate

| Gate | Proof (no secrets) |
|------|--------------------|
| Env verified | each of 8 vars shows "Set" in Vercel (value hidden); `ALLOWED_ORIGIN` exact origin noted |
| Preflight | preflight query results: 0 duplicate payment ids; constraint/table/index state |
| Migration applied | post-apply verification query results (index/table/constraint present) |
| LS replay | DB shows exactly one `credit_ledger` grant row per order id on replay |
| `payment_failed` | a `notifications` row of type `payment_failed` exists after a failed-payment event |
| Deploy/smoke | smoke checklist all green; key flows work; no secret in logs |

> Do not paste secret values, tokens, or full webhook payloads into evidence. Record
> outcomes (pass/fail + row counts/ids) only.
