# Zeluu — AI Math Tutor

AI tutoring for children (Grades 1–9) in **Math, Science & English**, aligned with
GCC/MENA/UK/US curricula, in English and Arabic. Children get Socratic, step-by-step
guidance (hints first, never just answers); parents get full visibility, safety alerts,
usage limits, and a credit-based subscription.

**Live:** https://zeluu.com

## Stack

| Layer | Tech |
|---|---|
| Frontend | 12 static HTML pages (no framework), shared design tokens (`public/css/zeluu-tokens.css`), PWA (manifest + service worker) |
| Backend | 10 Vercel serverless functions (`api/`), Node ESM, no runtime framework |
| Database | Supabase (Postgres 17) — RLS on every table, `SECURITY DEFINER` RPCs, pgvector RAG, pg_cron lifecycle job |
| AI | OpenAI `gpt-4o-mini` (chat + vision) and `text-embedding-3-small` (RAG over teacher-transcript knowledge base) |
| Payments | Lemon Squeezy — card-required 14-day trial, 10 trial credits, subscriptions + credit packs, HMAC-verified webhooks with DB-level idempotency |

## Architecture in one paragraph

Parents authenticate with Supabase Auth (email + OTP) and use `dashboard.html`; children
log in at `child-login.html` with parent-email + username + password, verified by a
bcrypt `SECURITY DEFINER` RPC, and receive a short-lived HMAC-signed JWT for the child
app (`app.html`). All API endpoints accept either token through one auth seam
(`lib/child-auth.js`) that pins child tokens to their own `child_id`. Credits live in an
append-only ledger; the Lemon Squeezy webhook grants them (signature-verified,
idempotent via a partial unique index); chat deducts them (1 credit per 5 text / 2 image
messages) and enforces parent-set per-child limits. The chat pipeline layers safety:
prompt-injection blocking, distress + personal-info detection with parent notifications,
stuck-loop detection, and escaped rendering of all model output. Replies stream
token-by-token over SSE (with a non-streaming JSON fallback) and render as XSS-safe
markdown + KaTeX math; tutoring stays method-first (L1–L4 scaffolding, hint/step modes),
and a "worked example" button demonstrates a parallel problem without solving the
student's own.

## Repository layout

```
api/            Serverless endpoints (auth, chat, children, credits, exams, sessions, webhooks)
lib/            Shared server code (env contract, supabase clients, child-token auth, prompts, rate limit, webhook verify)
public/         Static frontend (12 pages, css/, js/, sw.js, manifest)
supabase/
  migrations/         Repo-authored migrations 001–004 (001 is stale — see README there)
  migrations/live/    Authoritative production migration history (22 files, checksum-verified)
tests/          Node test suite (`npm test`, zero dependencies)
docs/           Operating docs — START HERE:
  SESSION_BRIEF.md      Current state, recent work, open gates (read first)
  PROJECT_TRACKER.md    Workstream status, task log, decisions, risks
  specs/                Specifications per workstream
  runbooks/             Production runbooks (migrations, Lemon Squeezy verification)
  checklists/           Production env & deploy checklist
```

## Development

```bash
npm test          # 53 tests, no dependencies to install
```

There is no local server harness; the API runs on Vercel. Required env vars (8) are
documented in `.env.example` and enforced by `lib/env.js` — secret-free fail-fast
errors, names only.

## Deploying

Vercel Git auto-deploy is **disabled deliberately** — deploys are explicit:

```bash
npx vercel deploy --prod   # after `vercel login` / project link
```

Production gates (migrations, payment changes, RLS/auth changes) require explicit owner
approval — see `CLAUDE.md` for the agent operating rules and `docs/runbooks/` for the
production runbooks.

## Operating model

This repo is driven by a Human + GPT + Claude workflow with hard safety gates
(`CLAUDE.md`, `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md`). Every
meaningful change lands as a small reviewed slice with evidence recorded in
`docs/PROJECT_TRACKER.md` and `docs/SESSION_BRIEF.md`.
