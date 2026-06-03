# SPEC-000 — Zeluu Project Overview

> Factual overview. Where a detail is not directly verified from the current repo,
> it is labeled as such. Do not invent unverified schema details.

## 1. Product Summary

Zeluu is a parent-controlled AI tutoring product for children (Grades 1–9) in Math,
Science, and English, targeting the GCC/MENA region and the UK, with English and
Arabic language support. Parents purchase credits and manage child accounts; children
log in separately and chat with an AI tutor. The tutor is designed around child-safety
and pedagogy (scaffolded hint-first answering, curriculum awareness), grounded with
RAG over curated educational content.

## 2. Current Stack

* **Frontend:** Static HTML/CSS/JS in `public/` (no React/Vite yet), served via Vercel.
  PWA with a service worker (`public/sw.js`).
* **Backend:** Vercel serverless functions in `api/*` (Node, ESM).
* **Database/Auth:** Supabase (Postgres + RLS; pgvector for RAG embeddings).
* **AI:** OpenAI — GPT-4 for chat/exams, `text-embedding-3-small` for embeddings
  (per project brief).
* **Payments:** Lemon Squeezy (checkout + `order_created` webhook).
* **Shared libs:** `lib/supabase.js`, `lib/child-auth.js`, `lib/prompts.js`,
  `lib/rate-limit.js`.
* **Knowledge pipeline:** Python scripts + a scheduled GitHub Action that ingest
  educational YouTube transcripts into embeddings (per project brief).

## 3. User Types

* **New parent** — signs up, is taken through card-required trial onboarding, adds a
  child, sets child login credentials.
* **Returning parent** — logs in (Supabase email/password) to the dashboard; manages
  children, views credits and session transcripts.
* **Child** — logs in separately at `/child-login` with a parent-set
  username/password; receives a custom JWT; uses the chat tutor at `/app`.

## 4. Business Model

* **Card / payment method required** before trial activation.
* **14-day trial.**
* **10 free credits** included in the trial.
* **No charge today.**
* **Lemon Squeezy** processes payments; **trial credits are granted only after the
  Lemon Squeezy webhook confirms** the order.
* No-card trial is **not** the current model.

## 5. Current Architecture

* **Static frontend** (`public/*.html` + `public/js`, `public/css`) — landing,
  pricing, parent login, child login, dashboard, chat app, legal pages.
* **Vercel serverless APIs** (`api/*`): chat, sessions (create/history), credits
  (balance/checkout), children management, exams, auth (child-login/profile),
  webhooks (Lemon Squeezy). CORS + `maxDuration` configured via `vercel.json`.
* **Supabase**: parent/child/session/message tables, knowledge tables (pgvector),
  subscriptions and credit transactions, with RLS isolating parent/child data, plus
  RPCs for credentials, login verification, and credit operations (per project brief;
  exact schema lives in Supabase, not fully reproduced here).
* **OpenAI** (currently the sole AI provider): chat completions + embeddings.
* **Lemon Squeezy**: checkout session creation and `order_created` webhook with
  HMAC-SHA256 signature verification on the raw body.

**Authentication model (dual-auth):**
* Parents → Supabase email/password; Supabase JWT in the `Authorization` header.
* Children → custom HMAC-SHA256 JWT (signed with `CHILD_JWT_SECRET`), stored in
  `localStorage`, 24-hour expiry. A `getChildOrUser(req)` helper tries parent auth
  first, then child JWT.

## 6. Known Workstreams

* **S0** — Stage 0 emergency backend/security/payment fixes (accepted; some changes
  currently uncommitted in the working tree).
* **A0.5** — Trial signup, card-based onboarding & activation UX (frontend-only;
  implemented; pending manual Lemon Squeezy verification).
* **A0.6** — Public repo benchmark & product inspiration (research/spec; in progress).
* **A0.OS** — Install project operating docs (this docs/process setup).
* **Stage 1** — Tests, schema documentation & tooling (not started).
* **Stage 2** — Child chat UX upgrade (blocked).
* **Stage 3** — Parent dashboard upgrade (blocked).
* **Stage 4** — Landing/pricing upgrade (blocked).
* **Stage 5** — Advanced learning features (future).

## 7. Key Risks

* Lemon Squeezy "require payment method for trial" must be manually verified.
* Webhook idempotency improved but not yet enforced at the DB level.
* Credit deduction not fully transactional under high concurrency.
* Trial expiry enforcement in `/api/credits/balance` must be verified.
* Child token stored in `localStorage` (XSS-exposed) — review separately.
* Children's data → strict privacy/data-minimization required; no logging of child
  messages/identifiers; no session replay for children.
* `ALLOWED_ORIGIN` must be configured in Vercel if not already.

## 8. Current Roadmap

A0.5 (done, pending verification) → A0.6 research → A0.OS docs → Stage 1
tests/schema/tooling → Stage 2 child chat UX → Stage 3 parent dashboard → Stage 4
landing/pricing → Stage 5 advanced learning. React/Vite migration is a separate,
not-yet-approved decision gating Stages 2–4.

## 9. Hard Gates

Stop and ask before: migrations, SQL, RLS/auth changes, production data mutation,
backfills, payment/webhook changes, dependency installs, destructive DB changes,
deployment, starting React/Vite, or editing outside an approved scope. (See
`CLAUDE.md` for the full list.)

## 10. Next Planned Work

Finish A0.OS docs setup → resume A0.6 research (pending SaaS-billing + Supabase
security category) → plan Stage 1 (tests/schema/tooling) — all without installing
packages, applying migrations, copying repo code, or starting React/Vite.
