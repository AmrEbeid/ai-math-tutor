# SPEC-SECURITY-RLS-SECDEF — Security / RLS / SECURITY DEFINER Hardening Backlog

> Actionable backlog from the STAGE1-A/B/C findings. **Backlog/plan only — no RLS/SECDEF
> changes or migrations implemented here.** Each item names a future, approved prompt.

**Status:** Drafted / awaiting GPT and user review.
**Date:** 2026-06-03
**Risk class:** High (RLS/auth/payment relevance); but this doc is plan-only.

| # | Item | Risk | Affected | Fix direction | Type | Approval | Tests | Priority | Future prompt |
|---|------|------|----------|---------------|------|----------|-------|----------|---------------|
| 1 | RLS uses **raw `auth.uid()`**, no explicit `TO authenticated` | Med (perf + correctness) | all 13 policies | wrap `(select auth.uid())`; add `TO authenticated`; index policy columns | migration | **Yes** (RLS) | pgTAP isolation | High | `STAGE1-9 — RLS hardening design` → `STAGE1-10 — RLS migration` |
| 2 | **No child-role RLS**; child isolation is app-layer (service-role + JWT) | High | `children`/`sessions`/`messages`/`credit_ledger` via service-role endpoints | document + **negative app-layer tests** (family A cannot reach family B via child JWT); consider `has_access_to_child()` SECDEF helper | tests + (later) migration | Yes (tests/migration) | API negative tests | High | `STAGE1-H — child isolation tests` |
| 3 | **14 SECURITY DEFINER fns, 0 `set search_path`** | High (search-path hijack/priv-esc) | all SECDEF fns in migration 001 | add `SET search_path = ''` (or explicit schema) to each | migration | **Yes** (migration) | re-run RPC tests | High | `STAGE1-9/10` (same slice as #1) |
| 4 | **Exam/knowledge tables not in repo migrations** (used by code) | Med/High (schema not version-controlled) | `exams*`, `knowledge_*` | locate/author the real migrations; bring schema under version control | migration (after verify) | **Yes** | schema tests | Med | `STAGE1-SCHEMA-RECON — exam/knowledge migration` |
| 5 | **Webhook idempotency** best-effort until 002 applied | High (double-grant race) | `credit_ledger`, webhook | apply migration 002 (unique index) + later wire `processed_webhooks` insert-first | migration + code | **Yes** | webhook replay | High | PROD-GATE-1 (apply) → `STAGE1-8 — insert-first idempotency` |
| 6 | **`notifications.type` CHECK** omits 4 emitted types | Med (silent notif loss) | `notifications` | apply migration 002 (CHECK fix) | migration | **Yes** | insert tests | High | PROD-GATE-1 (apply) |
| 7 | **Child token in localStorage** (XSS-exfiltratable); two key names | High | `lib/child-auth.js`, child pages | httpOnly/Secure/SameSite cookie + key standardization | code (hard gate) | **Yes** (token storage) | auth tests | High | `SPEC-child-token-storage-httpOnly-migration-plan.md` → impl prompt |
| 8 | **Service-role must stay server-only** | Critical if leaked | `lib/supabase.js` | keep server-only; add CI static check that the key name never appears in `public/` | CI/test | No (test) | static scan test | Med | `STAGE1-12 — CI` |
| 9 | **Anon key public only if RLS correct** | High (conditional) | `public/js/supabase-config.js` | depends on #1/#2 being correct; verify RLS on every table | depends | tied to #1/#2 | RLS tests | High | tied to #1/#2 |
| 10 | Error-object logging (`children.js:196`, checkout logs) | Low/Med (verbosity) | a few `console.error` | scrub error objects before logging; never log payloads/secrets | code (small) | Yes (small) | n/a | Low | `STAGE1-LOG-SCRUB` |

**Rules:** no RLS/SECDEF changes or migrations in plan slices; implementation slices require explicit approval (+ rollback plan for migrations). Items 5 & 6 are realized by **applying migration 002** at PROD-GATE-1.
