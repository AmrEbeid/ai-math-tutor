# SPEC-PROJECT-BRIEF-drift-reconciliation — `PROJECT_BRIEF.md` Decision

> Read-only reconciliation of the untracked root `PROJECT_BRIEF.md` against the current
> accepted specs. **`PROJECT_BRIEF.md` was NOT committed** (it carries stale schema/payment
> claims). This doc records the drift and the recommended disposition.

**Status:** Drafted / awaiting GPT and user review.
**Date:** 2026-06-03
**Risk class:** Low (docs-only; read-only inspection).

## 1. What `PROJECT_BRIEF.md` is

A 261-line architecture/product overview (system overview, DB schema, prompts/tutor
behavior, auth, rate limits, API routes, RAG pipeline, Vercel config, PWA, knowledge
pipeline, LemonSqueezy integration, env vars, commit history). Useful as narrative
background, but it predates the STAGE1-A/B audits and contains drift.

## 2. Drift found (stale vs current accepted docs)

| Brief claims | Reality (STAGE1-A/B + migration 001) | Severity |
|---|---|---|
| `credit_transactions` (transaction_type, order_id) | Real table is **`credit_ledger`** (`type`, `stripe_payment_id`, `balance_after`) | High (wrong table/columns) |
| `knowledge_channels` / `knowledge_transcripts` / `knowledge_chunks` tables | **Not in repo migrations** (pipeline/out-of-repo; only `match_knowledge_chunks` RPC referenced) | Med |
| `subscriptions.status (active/cancelled/expired)` | Code/schema also use **`trialing`/`on_trial`** (LS lifecycle); Stripe-named `stripe_subscription_id` columns | Med |
| Chat returns `{ message: ... }` | Handler returns `{ response: ... }` (frontend reads `data.response`) | Low/Med |
| Env var list | Authoritative list is the 8 in `lib/env.js` / `.env.example` / SPEC-STAGE1-C | Low |
| "GPT-4" chat model | Code uses `gpt-4o-mini` | Low |

No secrets are present in the brief (env section lists names only). It does **not** reflect
the Stage 0/A0.5/Stage 1 work or the migration-002 fixes.

## 3. Evergreen (still-useful) material

Product intent (Grades 1–9; Math/Science/English; EN/AR; GCC/MENA + UK; card-required
14-day/10-credit trial; hint-first tutor; RAG over curated educational content; PWA;
knowledge pipeline via GitHub Actions). These are already captured accurately in
`SPEC-000-project-overview.md` and the Stage specs.

## 4. Recommended disposition

**Option 1 (recommended): archive as legacy, do not treat as current truth.** Keep it out
of `git` (or, if the user wants it tracked, move it to `docs/legacy/PROJECT_BRIEF.legacy.md`
with a header banner pointing to `SPEC-000` + the Stage specs as the source of truth).
Rationale: `SPEC-000` + the Stage specs already carry the accurate, current architecture;
committing the brief as-is would re-introduce `credit_transactions`/`knowledge_*`/Stripe-naming
drift into the tracked record.

Alternatives: (2) replace it with a one-page pointer to current specs; (3) delete/ignore it;
(4) later rewrite it as a current brief (only after PROD-GATE-1, low priority).

## 5. Action taken now

* Documented the drift (above).
* **Did NOT commit `PROJECT_BRIEF.md`** — it remains untracked (held out).
* No content from it was copied into tracked docs as current truth.

## 6. Suggested future prompt

`DOCS-BRIEF-1 — Archive or Rewrite PROJECT_BRIEF` (docs-only) — execute Option 1/2/4 once
the user picks a disposition. Low priority; not blocking PROD-GATE-1.
