# Zeluu Session Brief

> Compact, fast-loading orientation for the start of every session.
> **This file is updated LAST after every meaningful action.**

## 1. Project

Zeluu AI Math Tutor — AI tutoring product for children and parents with a
card-required 14-day trial, 10 free credits, Lemon Squeezy payments, Supabase
backend, and a static frontend currently under stabilization.

## 2. Current Priority

**The product is live, hardened, and fully deployed at zeluu.com (2026-06-11).** In one
day the project closed: migration 002 (webhook idempotency, APPLIED), RLS on
`processed_webhooks`, the full static design polish UI-2…UI-7 + UI-2B (legacy purple
system retired), a full-stack review with all code-fixable findings fixed AND deployed
(XSS escaping in the child app, exams child-token pinning via centralized
`resolveChildId`, timing-safe token compare, distress/PII notification dedup, expiry-aware
balance), `search_path` pinned on all DB functions (migration 003), `temp_transfer`
dropped (004), production env verified with the missing `ALLOWED_ORIGIN` found+fixed
(CORS now exact-origin), and the **schema-reconciliation gap closed** —
`supabase/migrations/live/` holds the checksum-verified 22-migration production history.
Vercel auto-deploy is OFF (deploys are explicit); both remotes in sync.
**Remaining items are owner-only:** Supabase Auth leaked-password toggle, Lemon Squeezy
dashboard checks + runbook tests 1–10, and the prod re-pause decision (note: pausing now
takes the live product down). `PROJECT_BRIEF.md` still held out (drift).

## 2b. Product Strategy & Roadmap (NEW — 2026-06-15, RESEARCH-STRATEGY-1)

**Zeluu is repositioned from a math-only tutor to a child-safe bilingual AI learning companion
for school subjects, with math as the first polished vertical.** Competitive/product research was
saved and converted into specs + a task backlog (docs-only; no product code). Links:

* Research: [`docs/research/RESEARCH-competitive-product-strategy-2026-06-15.md`](research/RESEARCH-competitive-product-strategy-2026-06-15.md)
* Product strategy: [`SPEC-PRODUCT-learning-companion-strategy`](specs/SPEC-PRODUCT-learning-companion-strategy.md)
* Pricing/credits: [`SPEC-PRICING-packages-credits-cost-model`](specs/SPEC-PRICING-packages-credits-cost-model.md)
* Roadmap: [`SPEC-ROADMAP-product-revamp-implementation`](specs/SPEC-ROADMAP-product-revamp-implementation.md)
* Tasks: [`TASKS-product-strategy-roadmap`](tasks/TASKS-product-strategy-roadmap.md)

**Immediate next sprint (recommended):** KaTeX/rich formatting · streaming spike · weekly parent
digest · free-trial time+credit enforcement design · COPPA/VPC research+legal gate · Safety &
Privacy page · age-banded tutor tone · pricing/credits implementation design.

**Open validation gaps:** competitor pricing needs periodic refresh; competitor Arabic *quality*
needs hands-on testing; bilingual GCC positioning is a hypothesis until validated; school/teacher
pricing deferred until classroom mode scoped; AI cost assumptions reviewed against real logs
post-launch. **Standing warnings (do not violate):** don't claim QANDA lacks Arabic; don't claim no
bilingual K-12 competitor exists; don't use the refuted Duolingo retention stat or unsupported
market-size numbers.

## 3. Must-Read Files

* `CLAUDE.md`
* `docs/PROJECT_TRACKER.md`
* `docs/SESSION_BRIEF.md`
* `docs/specs/README.md`
* the spec for whatever you touch (UI: `SPEC-003`; security/RLS backlog:
  `SPEC-SECURITY-RLS-SECDEF-hardening-backlog`; payments: the LS runbook; schema:
  `supabase/migrations/README.md`)

## 4. Current Branch / PRs

* **UI-DARK is MERGED into `main`** (2026-06-17, [PR #3](https://github.com/amrabdelglill-pixel/ai-math-tutor/pull/3), merge commit `07a1362`); `main` synced on `origin` + `fork`; **not deployed** (auto-deploy off). The
  site-wide warm-dark theme now lives on `main`. ⚠️ **Incident fixed in the same session:**
  a `git add -A` in slice `8f5062e` accidentally committed the held-out `PROJECT_BRIEF.md`,
  which rode into `main` via the merge; it was untracked again (`d9e525d`, kept on disk) and
  **added to `.gitignore`** (`8c9e4da`) so it can't recur.
* **Still open:** `feat/streaming-sse` — the SSE streaming spike ([PR #4](https://github.com/amrabdelglill-pixel/ai-math-tutor/pull/4), pushed, reviewed,
  unmerged; now behind `main` after the UI-DARK merge — rebase before merging). The notes
  below describe `main` itself.
* **Branch:** `main`. **Both remotes (`origin` = `amrabdelglill-pixel/ai-math-tutor`,
  `fork` = `AmrEbeid/ai-math-tutor`) stay in sync** — pushed after every slice since
  PUSH-2 resolved the origin access limitation. Older "not pushed" notes in §5/§9
  predate the pushes.
* **Vercel Git auto-deploy is DISABLED** (owner, 2026-06-11, after the PROD-LS-1
  finding that a push had auto-deployed) — production deploys are explicit
  (`npx vercel deploy --prod`; CLI authorized + project linked this day).
* **Production = zeluu.com** serves the latest deployed slice; only `zeluu.com` is
  public (the `*.vercel.app` project domains sit behind deployment protection, 401).
* **The 14 former source diffs (Stage 0 `api/*` + A0.5 `public/*`) are COMMITTED** —
  landed in the earlier source slices C4a `15d62f5` / C4b `8a60d2d` / C4c `b3f043f` /
  C5 `f0b4c87` (plus env validation `2a32f76` and LOCAL-CORRECTION-1 `948baa8`).
  Do not re-review them as uncommitted work.
* **Working tree is clean except untracked `PROJECT_BRIEF.md`**, which remains
  intentionally held out due to drift (see `SPEC-PROJECT-BRIEF-drift-reconciliation`).
  Verify with `git status` at session start rather than assuming.
* ~~The main production gate remains `PROD-APPLY-1B`~~ — **DONE 2026-06-11**: migration
  002 applied to prod (`20260611085209`). RLS-on-`processed_webhooks` also **DONE**
  (PROD-RLS-1, 2026-06-11). Remaining gates: LS verification, prod env verification,
  deploy + smoke.
* (Corrected 2026-06-10 in DOCS-SYNC-UIUX-SPECKIT-1 — this section previously listed
  the 14 files as uncommitted, which was stale.)

## 5. Recently Completed

* **RESEARCH-STRATEGY-1 done (2026-06-15, docs-only)** — saved the verified competitive/product
  research and converted it into 4 docs: `RESEARCH-competitive-product-strategy-2026-06-15.md`,
  `SPEC-PRODUCT-learning-companion-strategy.md`, `SPEC-PRICING-packages-credits-cost-model.md`,
  `SPEC-ROADMAP-product-revamp-implementation.md`, plus `TASKS-product-strategy-roadmap.md`
  (24 gate-aware tasks). **Repositioned Zeluu from math-only → all-subject child-safe bilingual
  learning companion, math-first.** Tracker + this brief + specs README updated. Confirmed facts,
  citations, NCC flags, and refuted-claim warnings preserved. Branch `docs/research-product-strategy-specs`.
  **No product code; no installs; no live SQL/deploy; no React/Vite.**
* **PROD-ENV-1 done (2026-06-11)** — production env verification via names-only
  `vercel env ls` (no values read/printed): 7/8 required vars were set;
  **`ALLOWED_ORIGIN` was missing** and the live API confirmed the permissive `*`
  fallback. Fixed: added `ALLOWED_ORIGIN=https://zeluu.com` to Production (public
  origin, checklist-prescribed; `www` non-resolving) and redeployed
  (`dpl_3rccRhRKpYHfEAwPeSoXFEsyhQef`, READY). Verified live: preflight returns
  `access-control-allow-origin: https://zeluu.com`; full re-smoke green. Follow-ups
  noted: unused `LEMONSQUEEZY_STORE_ID` env entry; secrets shared across
  Dev/Preview/Prod scopes (owner may split preview values).
* **PROD-DEPLOY-1 done (2026-06-11)** — production deploy + smoke, owner-approved.
  Owner disabled Vercel Git auto-deploy and cleared the platform block; the dashboard
  redeploy never registered, so the deploy ran via Vercel CLI (owner completed the
  device login; project linked; `npx vercel deploy --prod`). Deployment
  `dpl_E2Xbt6CWzdByRuUggYscUHY1ehoC` READY; tree `2c677c9` (product-identical to
  `92109b7`). **Smoke PASS:** 13 pages + 8 rewrites → 200; webhook GET→405 /
  invalid-signature POST→401; balance unauth→401; child-login bad creds→401; runtime
  logs clean (only the 4 smoke probes). Fingerprints confirm UI-2/3/7 live; zeluu.com
  confirmed as the production domain. **Everything through `92109b7` is now live:
  SEC-FIX-1/2/3 + UI-1…UI-7.** `.gitignore` gained `.vercel`. Auto-deploy stays OFF —
  future deploys are explicit/gated.
* **PROD-LS-1 partially done / BLOCKED on owner-manual checks (2026-06-11)** — read-only
  LS pre-verification without calling LS (per runbook): webhook endpoint **live and
  publicly reachable** at `https://zeluu.com/api/webhooks/lemonsqueezy` (GET→405);
  **signing secret configured** in prod (invalid-signature POST→401 "Invalid signature";
  a missing secret would 500; no event processed, no data touched); code expectations
  documented (store `315398`, 11 variant IDs, 8 handled events, trial = $0 subscription
  order → 10 credits/14 days); DB idempotency live since PROD-APPLY-1B. **Remaining
  owner-manual (runbook):** LS dashboard store/variant/trial/card settings, webhook URL +
  events list, secret match, live-vs-test mode, runbook tests 1–10. **CRITICAL incidental
  finding: Vercel auto-deploys `origin/main`** — PUSH-2 unintentionally deployed
  `d0c7b2a` to zeluu.com (SEC-FIX-1/2/3 + UI-1 now LIVE, verified by page fingerprint);
  the newer pushes (`34d4562`/`92109b7`, incl. UI-2…7) are **BLOCKED** in Vercel (repo
  flipped public→private between deploys — owner must review the Vercel dashboard).
  The "no deploy" gate is not enforceable while auto-deploy is on; `*.vercel.app`
  domains return 401 (deployment protection) so LS must target `zeluu.com`. See the
  tracker Decision Log finding (2026-06-11).
* **PROD-RLS-1 done (2026-06-11)** — enabled RLS on production `processed_webhooks`
  with the single approved statement (`ALTER TABLE processed_webhooks ENABLE ROW LEVEL
  SECURITY;`) after the exact owner phrase `ENABLE RLS ON PROCESSED_WEBHOOKS CONFIRMED`.
  Preflight: RLS disabled, 0 rows, 0 policies. Post-apply: RLS enabled (not forced),
  **0 policies = deny-by-default for anon/authenticated** (no permissive policies added),
  table empty, `credit_ledger` intact (53 rows), and **no public table has RLS disabled
  anymore**. Service-role webhook handler unaffected (bypasses RLS); handler not edited.
  No migration file applied; no deploy; no push.
* **UI-MASTER-STATIC-1 done locally (2026-06-11)** — completed the full static frontend
  polish UI-2…UI-7 from SPEC-003, one commit per slice: UI-2 legal-page migration
  `1758578` (5 pages off purple `styles.css` onto the warm system, copy verbatim;
  `styles.css` kept on disk because `public/sw.js` still precaches it — follow-up slice
  to retire it must edit the sw precache list); UI-3 a11y baseline `b9b5b7e` (`<main>` on
  all 12 pages, skip links, aria-labels, alert/dialog roles, keyboard toggles); UI-4
  dashboard de-inline `3299658` (static inline styles 65→25; JS-template styles
  intentionally untouched); UI-5 typography `85256a4` (one identical font URL on all 12
  pages); UI-6 responsive polish `a3c09f2` (tap targets, mobile padding, policy-table
  overflow guards; hamburger judged unnecessary); UI-7 RTL foundation `750ad19`
  (`[dir="rtl"]` rules in tokens css + app.html; full Arabic localization deferred).
  `npm test` 50 pass / 1 skip after every slice. **Frontend + docs only; no backend/auth/
  payment/Supabase changes; no installs; no deploy; no React/Vite.**
* **PROD-APPLY-1B done (2026-06-11)** — owner gave the exact confirmation phrase;
  **migration 002 (parts 1–2) is APPLIED to production** as remote migration
  `20260611085209_webhook_idempotency_unique_index_and_processed_webhooks`. Pre-apply
  preflight re-run: PASS (0 duplicate payment refs, 3 payment-ref rows, no index,
  `processed_webhooks` absent). Post-apply verification: PASS (unique index present;
  `processed_webhooks` present and empty; `credit_ledger` intact, 53 rows). **The
  webhook double-grant race is now closed at the DB level.** New gated follow-up from
  the security advisors: `processed_webhooks` is the only RLS-disabled public table
  (anon/authenticated-visible via GraphQL) — enable RLS in an approved slice
  (service-role webhook handler unaffected). Prod project left **ACTIVE**; re-pause is
  the owner's call. Repo migration file + runbook updated with applied status.
* **SEC-FIX-3 done locally** (`57626f9`) — closed the last 360-review finding: the
  `api/credits/balance.js` billing-data leak. The endpoint returned the parent's `credit_ledger`
  (incl. `stripe_payment_id`/amounts) and subscription/billing metadata to any caller, so a child
  token (widened to parent scope, service-role client, RLS bypassed) received the family's payment
  history. Billing queries now run only for `authContext.type === 'parent'`; child tokens get just
  the credit count (response keys stay present-but-empty → parent dashboard + child app both
  unaffected). 2 handler tests (`tests/credits-balance.test.mjs`). `npm test` = **50 pass / 1 skip**.
  **All three confirmed cross-tenant findings + the child-login bypass are now fixed locally
  (SEC-FIX-1/2/3); no review-flagged findings remain open. Medium-risk source; manual review before
  deploy; not pushed.**
* **SEC-FIX-2 done locally** (`37d87d5`) — fixed the child-login password bypass from the 360
  review. `api/auth/child-login.js` minted a 24h token whenever the `verify_child_login` RPC
  returned a `child_id`, ignoring the `success` flag; since the function returns the child id even
  on a wrong password (`success:false`), knowing a valid `parent_email`+`username` allowed login
  with any password. The handler now normalizes the RPC result shape (object or one-row array) and
  rejects when `child_id` is missing **or `success === false`** — chosen over requiring
  `success === true` so it can't false-reject a deployed function that returns a row only on a
  correct password. 7 handler tests (`tests/child-login.test.mjs`). `npm test` = **48 pass / 1
  skip**. **DB defense-in-depth (return no row on failed password) + live↔repo function
  reconciliation still recommended (gated). Medium/High-risk source; manual review before deploy;
  not pushed.** The remaining open finding is the Low-severity `api/credits/balance.js` intra-family
  billing-metadata leak.
* **SEC-FIX-1 done locally** (`e6b1696`) — fixed two cross-tenant authorization bugs from a full
  360 security review. `api/sessions/history.js`: child tokens are now pinned to their own
  `child_id` (a child could previously read every sibling's session transcripts by omitting the
  `child_id` query param). `api/chat.js`: the session is ownership-checked up front and `child_id`
  is derived from the session row instead of the spoofable request body (which let a child bypass
  parent-set usage limits), with a 403 when a child acts on another child's session and ownership
  validated before the content-flag writes. Added 8 handler tests (`tests/sessions-history.test.mjs`
  5 pass via the real signed-token pipeline + mocked `lib/supabase.js`; `tests/chat-handler.test.mjs`
  3 self-skip until `node_modules` is installed because `api/chat.js` imports `openai`); test script
  now uses `--experimental-test-module-mocks`. `npm test` = **41 pass / 1 skip**. **Medium/High-risk
  source — needs manual review before deploy; not pushed.** Two lower-confidence findings remain
  UNFIXED: `api/auth/child-login.js` ignores the `verify_child_login` `success` flag (possible
  password bypass — verify against the live DB function during schema reconciliation), and a
  Low-severity intra-family billing-metadata leak in `api/credits/balance.js`.
* Stage 0 accepted earlier.
* A0.5 frontend-only flow/copy implementation completed.
* A0.5 changed only four public files (`index.html`, `pricing.html`, `login.html`,
  `dashboard.html`).
* No backend changes in A0.5.
* No deployment in A0.5.
* A0.6 research **complete: all 8 categories** (AI chat UX + routing; AI
  tutoring/education; UI/UX design systems; testing/CI + child safety; **SaaS billing**;
  **Supabase auth/RLS/security**). Findings saved into `SPEC-A0.6`. No code copied.
* STAGE1-A, STAGE1-B accepted. **STAGE1-C drafted** — docs-only env/secret validation
  plan (`SPEC-STAGE1-C-...`): 8 env vars inventoried (no values read), classified,
  exposure/logging reviewed, fail-fast validation planned, `.env.example` proposed (not
  created). No source changes; no installs; no env files created.
* **STAGE1-FINAL + STAGE2-P drafted** — Stage 1 planning closed as a readiness package
  (`SPEC-STAGE1-FINAL-...`: reconciled STAGE1-P/A/B/C, STAGE1-1…13 backlog, gates,
  acceptance, first slice = STAGE1-1 working-tree cleanup) and the full Stage 2 child-chat-UX
  master plan (`SPEC-STAGE2-...`: tutor flow, chat-UI/safety/credit requirements,
  static-vs-React options, STAGE2-A…J slices). Docs-only; no source changes; implementation
  not started.
* **STAGE1-1 drafted** — read-only diff audit of all 14 uncommitted source files +
  untracked `docs/` inventory → `SPEC-STAGE1-1-...` with a file-listed commit plan
  (C1–C3 docs → C4 Stage 0 `api/*` → C5 A0.5 `public/*`), review gates, and safe example
  git commands. Confirmed diffs are intentional & match Stage 0/A0.5. Notable: webhook
  already has code-level idempotency (best-effort on `credit_ledger.stripe_payment_id`) but
  still no DB unique table; `children.js` now uses real HMAC token verify; `PROJECT_BRIEF.md`
  held out (drift). **No commits/staging/source changes.**
* **STAGE1-1A done** — committed the 15 approved docs in 3 waves (`590e67b` operating docs,
  `09b8142` A0.6+Stage 1 readiness, `d5f7d0d` Stage 2 plan). No source staged/committed;
  `PROJECT_BRIEF.md` excluded; safety-scanned (no secrets / no false impl claims).
* **STAGE1-1R drafted** — reviewed all 14 source diffs read-only → `SPEC-STAGE1-1R-...`:
  per-file risk, cross-file interactions, **C4a/C4b/C4c/C5 split recommendation**, manual
  verification checklist. New findings: webhook idempotency best-effort only (no UNIQUE on
  `credit_ledger.stripe_payment_id` → concurrent-replay race; STAGE1-7/8 still needed);
  `payment_failed` notification violates the `notifications.type` CHECK (silently caught);
  `children.js` token change confirmed a security upgrade (HMAC verify). **No source committed/changed.**
* **FINISH-STAGE1-STAGE2-LOCAL done** — committed source in clean slices (C4a CORS,
  C4b chat+children, C4c webhook, C5 A0.5 frontend); added `lib/env.js` validation +
  `.env.example` + `!.env.example` gitignore; created migration `002` (webhook unique
  index + `processed_webhooks` + extends `notifications.type` CHECK for **4** missing types
  found in code: payment_failed/child_distress/exam_completed/personal_info_shared) — **NOT
  applied**; added a **31-test** Node `node:test` baseline (`npm test`, 0 deps installed);
  improved `public/app.html` child UX (a11y live region + labels, hint-first copy,
  session-expired state). Created `SPEC-STAGE1-LOCAL-ACCEPTANCE` + `SPEC-STAGE2-LOCAL-ACCEPTANCE`.
  Test seams added: `lib/child-auth.js` lazy-imports supabase; `lib/webhook-verify.js` extracted.
  **No deploy, no live SQL, no live Supabase/LS/OpenAI, no React/Vite, no installs.**
* **LOCAL-CORRECTION-1 done** (`948baa8`) — corrected the overstated Stage 1 acceptance:
  wired **all 8** required env vars through `lib/env.js` (`getEnv` in chat/exams for OpenAI,
  checkout for LS key, webhook for LS secret, child-auth for CHILD_JWT; `getAllowedOrigin()`
  documented request-time `'*'` fallback for ALLOWED_ORIGIN). Added 5 tests (now 36, 0 installs):
  per-var secret-free failure + child-auth sign-throws/verify-fail-closed. Stage 1 now genuinely
  complete locally; Stage 2 remains partially complete. No deploy/live SQL.
* **PENDING-CLOSURE-1 done** (docs-only) — production-gate pack: `docs/runbooks/` (PROD-GATE-1
  master, migration-002 apply, Lemon Squeezy verification) + `docs/checklists/` (prod env &
  deploy) + read-only `supabase/sql/preflight_002_*.sql`; backlogs `SPEC-SECURITY-RLS-SECDEF-...`,
  `SPEC-child-token-storage-httpOnly-...`, `SPEC-STAGE2-deferred-work-...`; and
  `SPEC-PROJECT-BRIEF-drift-reconciliation` (brief held out, recommend archive as legacy).
  No live SQL/deploy/installs/React-Vite; `PROJECT_BRIEF.md` not committed.
* **PROD-APPLY-1A done** — connected to Supabase (read-only), resumed the prod project
  `gstjvjynkdvqncjyybwm` (INACTIVE→ACTIVE_HEALTHY), ran the SELECT-only preflight. **Finding:**
  live↔repo drift — live `notifications_type_check` already allows all needed types +2 more, so
  **migration 002's CHECK rewrite was removed** (would regress prod). Parts 1–2 (unique index +
  `processed_webhooks`) PASS preflight and remain valid/needed; **migration NOT applied**.
  Corrected the earlier "notifications silently failing" claim (it was repo-only, not prod).
  Project is currently **ACTIVE** (was paused) — re-pause is the owner's call.

* **UI-1 done locally** — created `public/css/zeluu-tokens.css`, the shared static design
  foundation for the warm-editorial system: OKLCH color tokens (union of all 7 warm pages'
  inline blocks, incl. child variants + legacy aliases), font/spacing/radius/shadow/motion/
  z-index scales, minimal reset, global `:focus-visible` accent ring, and a
  `prefers-reduced-motion` guard. Linked on the 7 warm pages (`index`/`pricing`/`login`/
  `child-login`/`app`/`dashboard`/`exam-prep`) **before** each inline `<style>` so existing
  page styles win → appearance preserved (pure link inserts, 19 lines). **Inline tokens not
  yet removed; legacy `styles.css` not retired; legal pages untouched; `npm test` 36/36;
  no installs; no React/Vite; no backend/deploy.** Next UI slice: UI-2 (migrate legal pages).
* **UIUX-AUDIT-1 done (read-only)** — frontend UI/UX audit + design improvement plan →
  `docs/specs/SPEC-003-frontend-uiux-audit-and-design-plan.md`. Finding: **two design
  systems run at once** — warm OKLCH/Fraunces on main surfaces vs. a legacy purple-gradient
  `styles.css` on 5 legal pages; tokens duplicated inline across ~7 pages; `dashboard.html`
  has 171 inline styles; a11y thin outside `app.html` (no reduced-motion, sparse ARIA, weak
  focus); no RTL. Recommendation: keep the warm-editorial aesthetic, finish migrating to it
  as one shared system (UI-1 tokens → UI-2 retire purple CSS → UI-3 a11y → UI-4 de-inline
  dashboard → UI-5–7 font/nav/RTL). All slices fit the static stack; React/Vite stays gated.
  **Read-only; no `public/*`/CSS/JS edits; no installs; no React/Vite; no source/backend.**
* **EVAL-SPECKIT-1 done (docs-only)** — evaluated GitHub Spec Kit vs. the existing
  specs workflow → `docs/specs/SPEC-002-spec-kit-evaluation.md`. Finding: Zeluu already
  reinvented ~80% of Spec Kit as human/GPT-driven docs; `/speckit.implement` conflicts
  with the hard-gate model and `specify init` trips install/scaffolding gates.
  **Recommendation: inspiration-only — do NOT install/adopt in Zeluu now**; optionally
  borrow a spec/plan/tasks template + an `analyze`-style reconciliation step later as
  docs slices. No tooling installed; no scaffolding; no source changes. (The stale §4
  note spotted during this task was corrected in DOCS-SYNC-UIUX-SPECKIT-1.)

## 6. Current Blockers / Gates

**Owner-only items (open):**

* Supabase Auth **leaked-password protection** — dashboard toggle (no API).
* **Lemon Squeezy dashboard checks + runbook tests 1–10** (`RUNBOOK-lemon-squeezy-…`):
  store/variant/trial/card settings, webhook URL = `https://zeluu.com/api/webhooks/lemonsqueezy`,
  enabled events, secret match, live-vs-test mode, then the end-to-end real-card trial test.
  (The automatable half was pre-verified PASS in PROD-LS-1.)
* **Prod Supabase re-pause decision** — project is ACTIVE and now backs the live
  product; pausing takes zeluu.com's data layer down.
* Vercel env hygiene (optional): split preview-scope secrets from production values;
  unused `LEMONSQUEEZY_STORE_ID` env entry.

**Still-gated future work (needs explicit approval per slice):**

* Child token storage → httpOnly cookie (`SPEC-child-token-storage-httpOnly-…`).
* Wire `processed_webhooks` insert-first into the webhook handler (STAGE1-8; payment logic).
* RLS policy hardening (`(select auth.uid())` + `TO authenticated`; backlog item 1).
* React / Vite / Tailwind migration; dependency installs; per-turn moderation; streaming;
  KaTeX; distributed rate limiting (Upstash).

**Resolved this cycle (no longer gates):** migration 002 applied; RLS on
`processed_webhooks`; SECDEF/invoker `search_path` pinned (003); `temp_transfer`
dropped (004); prod env verified + `ALLOWED_ORIGIN` fixed; deploy + smoke done; schema
reconciliation done (`supabase/migrations/live/`); Vercel auto-deploy disabled.

## 7. Do Not Do

* Do not apply migrations / run write-SQL on production without an exact owner
  confirmation phrase.
* Do not change Lemon Squeezy webhook/payment/credit-grant logic without approval.
* Do not change RLS/auth or child token storage without approval.
* Do not push secrets or child/parent PII into the repo, logs, or docs.
* Do not install dependencies or start React / Vite without approval.
* Do not re-enable Vercel Git auto-deploy (deploys must stay explicit).
* Do not copy public repo code without license/security review.

## 8. Next Action

**Everything automatable is done and live** (see §2). `npm test` green (**52 pass /
1 skip** — the skip is the chat handler test, which needs `node_modules` to import
`openai`). The next actions are the three owner-only items in §6: (1) flip the Supabase
Auth leaked-password toggle; (2) run the Lemon Squeezy dashboard checks + runbook tests
1–10 against zeluu.com (the full trial flow is now end-to-end testable); (3) decide
whether the prod Supabase project stays ACTIVE (it backs the live site). After those,
the next engineering slices, each gated on explicit approval, are in priority order:
httpOnly child-token migration, `processed_webhooks` insert-first wiring (STAGE1-8),
and RLS policy hardening (backlog item 1). `PROJECT_BRIEF.md` remains held out (drift —
recommend archiving as legacy per its reconciliation spec).

> **Key STAGE1-C findings to action later (all gated):** only
> `LEMONSQUEEZY_WEBHOOK_SECRET` is guarded today; others fail late/silently
> (`CHILD_JWT_SECRET` verify fails closed to `null`; missing `ALLOWED_ORIGIN` → silent
> CORS break). **`.gitignore`'s `.env.*` rule would also ignore a future `.env.example`**
> → add `!.env.example` when creating it. Plan: single `lib/env.js` seam, no-dependency
> validator preferred (Zod = install gate), import- vs request-time split, secret-free
> errors. 3 `console.error` sites (`children.js:196`, `checkout.js:87`/`:93`) log
> error/response objects → needs implementation review. Hardcoded `STORE_ID`/variant
> ids/redirect URL in `checkout.js` are config candidates (not in the 8-var contract).

> **Key STAGE1-B findings to action later (all gated):** no webhook-idempotency table
> (double-grant risk); 15 SECURITY DEFINER fns with no `set search_path`; **exam +
> `knowledge_*` tables not in repo migrations** (implied by code); RLS is parent-scoped
> only (child isolation is app-layer); `credit_ledger` (not `credit_transactions`);
> Stripe-named billing columns despite LemonSqueezy; two child-token localStorage keys.
> `SPEC-000`/`PROJECT_BRIEF` still need reconciliation (out of scope so far).

> **Operating workflow:** Amr's GPT → Claude operating workflow is now documented in
> `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` (created under A0.OS-GPT).
> Read it for any task involving planning, prompts, review, or process.

## 9. Latest Session Log

| Date       | Action                                                                 | Evidence                                              | Next                                                |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| 2026-06-17 | AUTH-FLOW-DESIGN (revamp 3/3, flow half) — **MERGED auth-visual PR #21** (`0fc7db1`), then authored `docs/superpowers/specs/2026-06-17-login-signup-flow-design.md`: the signup/consent funnel redesign grounded in the verified research + COPPA. **Neutral age-gate** (plain DOB/grade, no nudge), **explicit logged consent screen** (not a buried checkbox), **VPC method legal-gated** (keep card-with-notice for paid; design an email-plus path since card-VPC converts poorly in MENA), **no child PII before a consent record**, **"Grown-Ups Only"** boundary, mobile-first. References COPPA research + A0.5 + trial-enforcement; consent-ledger = gated migration. **Docs-only; every flow change is a hard gate (auth/consent/schema) + legal sign-off before build.** This **completes the homepage/brand/login revamp** (3/3 sub-projects). PR open → `main`. | New + 2 edited docs; `npm test` unaffected. | Owner/GPT + **legal** review of the flow design; pick the VPC method; then gated implementation slices. **Revamp complete** — brand+homepage+auth-visual live; flow design awaiting legal. | 
| 2026-06-17 | AUTH-PAGES-REBRAND (revamp 3/3, visual half) — **MERGED homepage PR #20** (`e4bee97`), then surgically rebranded the 3 auth pages (`login.html`, `child-login.html`, `verify-email.html`) to the teal Spark brand — **visual only, all Supabase auth/OTP/child-login JS + form IDs untouched**. Per page: an override block routing `--color-accent` → `--brand-*` teal for **both light + dark** (handles the shared-token dark override), inline **Spark** logo replacing the 💡/🧠/✉ wordmark emojis, teal pill primary buttons, teal-tinted plan box, SVG favicon. `sw.js` v11→v12. Verified via headless-Chrome screenshots (all 3, dark) — cohesive premium teal look. `npm test` 123/1 green (login card/14-day `frontend-copy` assertion intact). **Frontend CSS/markup only; no auth/payment/schema/migration/deploy.** PR open → `main`. Next: the **flow design** doc (neutral age-gate, parent-verify→child 'Grown-Ups Only', mobile-first consent) — auth-logic build stays gated. | `npm test` 123/1; 3 page screenshots reviewed. | Owner review/merge of the visual PR; then I write the login/signup flow design (gated build). | 
| 2026-06-17 | HOMEPAGE-REVAMP (revamp 2/3) — **MERGED brand PR #19** (`bf31488`), then ran `writing-plans` (`docs/superpowers/plans/2026-06-17-homepage-revamp.md`) and fully rebuilt `public/index.html` premium/trust-forward: inline **Spark** logo (replaces 💡), deep-teal `--brand-*` primary + amber accent, dark-default+light, mobile-first, **RTL-ready** (logical properties), reduced-motion. **Trust-led order**: hero ("learns *how*, not just the answer") → 3 trust pillars (guides-not-answers/see-everything/safe) high up → "how it teaches" Asks/Hints/Checks beats → parent-control checklist → features → steps → teal proof band → pricing teaser (kept card-required 14-day/10-credit disclosure so `frontend-copy` test stays green) → CTA → footer. SVG icon sprite, no emoji. Kept PWA-install + scroll-reveal JS; `sw.js` v10→v11. Verified via headless-Chrome screenshots (desktop+mobile, dark+light). **Frontend only; CTAs unchanged; no auth/payment/schema/migration/deploy.** PR open → `main`. | `npm test` 123/1 green; screenshots reviewed (dark teal premium look confirmed). | Owner review/merge; then sub-project 3 = login/signup (visual redesign now; auth-flow design, auth-logic build gated). | 
| 2026-06-17 | BRAND-FOUNDATION (revamp 1/3) — ran the owner-requested workflow (deep market research → brainstorm → design → build) for a homepage/brand/login revamp. Research (110-agent deep-research) verified **trust = the conversion lever** (guides-not-answers + transparency; neutral COPPA age-gates; mobile-first consent ~10×; card-VPC poor for MENA) and refuted 4 myths. Owner picked: **premium/trust-forward**, order **Brand→Home→Login**, hand-authored SVG, login flow to be redesigned (auth-logic build stays gated). Built **sub-project 1 — brand foundation**: logo **A "Spark ✦"** + **deep-teal primary** (#1E6E78) + amber accent. New `public/logo-mark.svg`+`favicon.svg`, all 10 `public/icons/*` regenerated (Spark on teal) from SVG via headless Chrome, **additive `--brand-*` tokens** (light+dark) in `zeluu-tokens.css`, `sw.js` v9→v10. **Staged: no pages recolored** (icon refs auto-update; homepage adopts teal next). Spec `docs/superpowers/specs/2026-06-17-brand-foundation-design.md`; candidates under `design-scratch/`. **Frontend assets+CSS only; no auth/payment/schema/migration/deploy.** PR open → `main`. | `npm test` 123/1 unaffected; favicon verified legible at 16px; app icon screenshot reviewed. | Owner review/merge; then sub-project 2 = homepage revamp (writing-plans → build) adopting teal; sub-project 3 = login/signup (visual now, auth-flow gated). | 
| 2026-06-17 | PLANS-CATALOG-CONFIG — added `lib/plans.js` (+`tests/plans.test.mjs`, +7 tests), the **plan/package catalog** from the pricing design (T-12 §3 / SPEC-PRICING §4): frozen per-plan numbers (free_trial 50/7d/10-daily/1-child, family 600/20/2, family_premium 1500/30/4+voice, student_plus 1000/40/1 *inactive-later*, school_pilot *deferred/null*) + `getPlan`/`listActivePlans`/`isActivePlan`/`resolvePlanKey` (normalizes a webhook `plan_name` → key, **null for unknown — no default assumed**). Completes the **config half of step-1** alongside `lib/credits.js`. **Pure config, intentionally UNWIRED** (grants still flow through the LS webhook's own `custom_data`; caps still read `children.credit_limit_*`). Updated the design doc. `npm test` 123 pass / 1 skip. **Additive pure module; no schema/auth/payment/grant/migration/install/deploy.** PR opened → `main` (low-risk). | `npm test` 123 pass / 1 skip (+7); `node --check` clean; grep confirms zero runtime importers. | Owner merge (or self, low-risk); the shadow-mode logging wire-in to `api/chat.js` is the next (reviewed) slice. | 
| 2026-06-17 | CREDITS-COST-CONFIG — added `lib/credits.js` (+`tests/credits.test.mjs`, +7 tests), the **per-action credit-cost config** from the pricing impl design (T-12 §2): frozen `ACTION_CREDIT_COSTS` table (text=1/image=3/voice=2/practice=2/quiz=2/mistake=1/weekly=0/reread=0), `creditCostForAction()` with a safe default (unknown → base text cost, never free), and `creditCostForTurn({image})` deriving the action **server-side from request shape**. This is step-1 ("catalog first") of the per-action-metering migration — **pure config, intentionally UNWIRED** (no importer in `api/`, so deduction is unchanged and no gate is crossed). Makes the future gated cutover a small edit. Updated the design doc to mark the config half done. `npm test` 116 pass / 1 skip. **Additive pure module; no schema/auth/payment/credit-deduction/migration/install/deploy.** PR opened → `main` (low-risk). | `npm test` 116 pass / 1 skip (+7); `node --check` clean; grep confirms zero runtime importers. | Owner merge (or self, low-risk); next step (shadow-mode logging wire-in to `api/chat.js`) is a separate reviewed slice. | 
| 2026-06-17 | STREAM-FINALIZE-FIX — **MERGED PR #7** (`ac808b0`, after resolving a SESSION_BRIEF conflict). Hardened the SSE streaming error path in `api/chat.js` (latent bug flagged in the PR #4 review). After the stream headers are flushed, `finalizeTurn()` now runs inside its own try/catch: on a DB error it emits an SSE `error` event + `[DONE]` and ends, instead of falling through to the JSON catch (which would throw "headers after sent" and leave the stream hung with no terminator). Client already keeps streamed text on stream-end, so no UX regression. Streaming-path error handling is integration-level (repo unit-tests only the pure SSE helpers/parser), so no brittle handler mock added; `node --check` + full suite green. **Medium-risk chat backend; no schema/auth/payment/credit/migration/install/deploy.** PR opened → `main`; held at merge (chat backend = owner review). | `npm test` 87 pass / 1 skip (unchanged); `node --check` clean. | Owner review/merge; a live mid-stream-failure smoke before deploy. |
| 2026-06-17 | SYSTEM-PROMPT-TESTS — added `tests/prompts-systemprompt.test.mjs` (+9 tests) covering `getSystemPrompt`'s previously untested dimensions (age bands were already covered): subject selection (math/science/english label + topic line + math fallback for unknown), ISO→curriculum resolution (`AE`→UAE, `SA`→Saudi, `EG`→Egypt; full names; **unknown country → UAE safe default**), sub-subject FOCUS AREA injection/omission, always-present `CHILD_SAFETY.coreRules`, and curriculum scaffolding sections. Locks the most-used prompt builder so edits can't silently drop curriculum/subject/safety framing. Pure function; no `chat.js` change (no conflict with open PR #7). `npm test` 109 pass / 1 skip. **Test-only; no product code.** PR opened → `main` (low-risk). | `npm test` 109 pass / 1 skip (+9). | Owner merge (or self, low-risk). | 
| 2026-06-17 | README-ACCURACY — updated the root `README.md` architecture paragraph to reflect features shipped since 2026-06-11: SSE token streaming (+ non-stream fallback), XSS-safe markdown + KaTeX rendering, method-first tutoring (L1–L4 / hint/step modes), and the worked-example button. Accuracy-only (no claims beyond what's live; per-action metering still described as the current `1/5 text · 1/2 image` modulo since that's unchanged). **Docs-only; no code.** PR opened → `main` (low-risk). | `git diff` README only; `npm test` unaffected. | None — keeps docs honest vs. shipped behavior. | 
| 2026-06-17 | STEP-REVEAL-DESIGN (T-09) — authored `docs/specs/SPEC-SLICE-step-reveal.md`, the design (roadmap B4) for one-step-at-a-time guided explanations + comprehension checks, **including on image/photo problems** (anti-QANDA / research M3). Split by risk: **Slice A** = frontend progressive-reveal **stepper** (parse steps client-side *after* `renderMarkdown` escape, "Next step"/"I've got it" controls, a11y via the existing `aria-live` log, single-bubble fallback when no steps detected — medium risk, **no backend**); **Slice B** = a chat-backend **no-dump-on-image** prompt guard (sibling of the worked-example guard, append-after scaffolding so it wins, prompt-only, server-derived from `image` present — high risk, owner review). Reuses the live `step_by_step` mode + L1–L4 scaffolding + Math Answer Release Policy; completes Phase-B design coverage. Indexed in `docs/specs/README.md`. **Docs-only; no migration/auth/payment/install/React.** PR opened → `main` (docs/low-risk). | New + 2 edited docs; `npm test` unaffected. | Owner review; ship Slice A (frontend stepper) first, then Slice B via a reviewed chat-backend slice. | 
| 2026-06-17 | GATED-DECISION-REGISTER — authored `docs/DECISIONS-gated-work-register.md`, consolidating the recurring "open gaps" across the 5 design slices into **5 cross-cutting owner decisions** (D1 email/push provider · D2 migration approvals · D3 legal sign-offs · D4 Lemon Squeezy verification · D5 React/Vite gate), each with the features it blocks + a fill-in decision/date line, plus a "what unblocks fastest" path (in-app-first digest/alerts need only one small `notifications.type` CHECK migration; D4 is verification-only). Linked from the tracker's External Gates section. Capstone of the session's design work — gives the owner one actionable place to unblock multiple features. **Docs-only; nothing starts until a decision is recorded + the impl slice passes review.** PR opened → `main` (docs/low-risk). | New doc + tracker/brief edits; `npm test` unaffected. | Owner records D1–D5; fastest unblock = D1 "in-app first" + the two small D2 migrations + D4 verification. | 
| 2026-06-17 | WORKED-EXAMPLE-UI-TESTS — extended `tests/worked-example.test.mjs` (+3 tests) to lock the T-03 **client** wiring in `public/app.html` (the prior +4 tests only covered the server-side guard string): the `worked-example-btn` exists + is labelled + calls `sendMessage({workedExample:true})`; `sendMessage` sets `body.worked_example=true` (what makes the server apply the guard); `sendMessage(opts={})` default-param keeps the no-arg callers (Enter/Send) working. Static string checks; no `chat.js` change (no conflict with open PR #7). `npm test` 100 pass / 1 skip. **Test-only; no product code.** PR opened → `main` (low-risk). | `npm test` 100 pass / 1 skip (+3). | Owner merge (or self, low-risk); T-03 now locked client + server. | 
| 2026-06-17 | SAFETY-DETECTOR-TESTS — added `tests/prompts-safety-detectors.test.mjs` (+10 tests) locking the previously **untested** safety-critical detectors in `lib/prompts.js`: `checkForBlockedContent` (prompt-injection / answer-dump), `detectChildDistress`, `detectPersonalInfo`, `detectStuckLoop`. Positive + negative cases + structural assertions (flag/reason fields, history threshold, `[STUCK_LOOP]` recency). Regression-locks the anti-injection + child-safety notification gates so future edits can't silently drop them. Pure functions; no `chat.js` change (no conflict with the open PR #7). `npm test` 97 pass / 1 skip. **Test-only; no product code/schema/auth/payment.** PR opened → `main` (low-risk). | `npm test` 97 pass / 1 skip (+10); ran the new file in isolation too. | Owner merge (or self, low-risk); detectors now regression-locked. | 
| 2026-06-17 | TRY-BEFORE-SIGNUP-DESIGN (T-06) — authored `docs/specs/SPEC-SLICE-try-before-signup.md`, the design (roadmap B1) for a **one-question pre-signup teaser** that stores **no child PII before consent** (COPPA). Proposes an **isolated anonymous `POST /api/try`** endpoint — deliberately separate from the authed `api/chat.js` so its auth invariants stay untouched — running one method-only guided turn (reuses scaffolding + worked-example guards), **IP/daily rate-capped**, **persisting nothing child-identifying** (at most an anonymous aggregate counter), then converting to the parent-account/consent step (A0.5). Grounded in the COPPA/VPC research + A0.5 onboarding spec; indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (unauthenticated AI entry, COPPA/PII boundary, abuse surface) + legal sign-off prerequisite.** PR opened → `main` (docs/low-risk). | New + 2 edited docs; `git diff` docs-only; `npm test` unaffected. | Legal sign-off on no-PII-pre-consent + landing copy; then a gated phase-1 (static landing UI, teaser endpoint disabled). | 
| 2026-06-17 | SAFETY-ALERTS-DESIGN (T-10) — **MERGED PR #9** (`f522e9c`). Authored `docs/specs/SPEC-SLICE-safety-alerts.md`, the design (roadmap B5) to upgrade the existing distress/PII/stuck **in-app** notifications to **instant, dual-channel** alerts. Severity model: distress=High (in-app **+ email/push**, re-alerts across new sessions), PII=Medium, stuck=Low (in-app only). In-app stays the durable record + fallback; second-channel dispatch is **best-effort/non-blocking** so a channel failure never breaks the child's chat turn or loses the alert; **no child content/PII** in any email/push payload (CLAUDE.md). Reuses the same missing-email-channel decision as the weekly-digest slice; proposes a phase-1 non-blocking `dispatchAlert()` seam (in-app only) so the channel slots in later without re-touching detection/credit paths. Grounded in `lib/prompts.js` detection + `api/chat.js` notification inserts; indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (child-safety path, email/push provider+secret, migration for delivery-status + alert-pref columns).** PR opened → `main` (docs/low-risk). | New + 2 edited docs; `git diff` docs-only; `npm test` unaffected. | Owner picks the alert channel; then a phase-1 `dispatchAlert()` seam. | 
| 2026-06-17 | WEEKLY-DIGEST-DESIGN (T-04) — **MERGED PR #8** (`a78197f`). Authored `docs/specs/SPEC-SLICE-weekly-digest.md`, the design (roadmap A4) for a weekly per-parent digest (per-child time-on-task, subjects/topics, **safety-flag counts**) delivered in-app + (phase 2) email on a `pg_cron` job. Key finding while grounding it: **no email-sending infra exists in the repo** (no Resend/SendGrid/etc.) — so the design's first decision is the email channel, and it recommends phasing (in-app digest first, email once a provider is picked). Aggregates only — **no child message content / no PII** (CLAUDE.md). Grounded in the live `notifications` pipeline + `sessions`/`messages` schema + the existing `enforce-subscription-expiry` pg_cron job; indexed in `docs/specs/README.md`. **Docs-only; implementation hard-gated (email provider+secret, pg_cron, migration for `weekly_digest` type + opt-out column).** PR opened → `main` (docs/low-risk). | New + 2 edited docs; `git diff` docs-only; `npm test` unaffected. | Owner picks the email channel; then a gated phase-1 (read-only aggregation + in-app digest). | 
| 2026-06-17 | PRICING-IMPL-DESIGN (T-12) — **MERGED PR #6** (`cb2e9fc`). Authored `docs/specs/SPEC-SLICE-pricing-credits-impl.md`, the implementation design (roadmap B7) that maps the approved pricing spec to gate-aware build slices: product-wide **per-action credit metering** (replaces the `1/5 text · 1/2 image` modulo), plan/package definitions as config, **Lemon Squeezy variant mapping** for subscriptions + extra packs incl. **PPP currency** (SAR/AED/EGP), and an ordered current→per-action **migration path with rollback** (shadow-mode → RPC amount → flag-guarded cutover → variants → retire modulo). Resolves the forward-reference dangling in `SPEC-SLICE-trial-enforcement` (now the per-action-metering source of truth) and updates `docs/specs/README.md`. Grounded strictly in the existing pricing spec + live webhook/metering code — no economics invented. **Docs-only; no code; every implementation step stays a hard gate (credit/payment/webhook/LS/migration).** PR opened → `main` (docs/low-risk). | New + 2 edited docs; `git diff` docs-only; `npm test` unaffected (no code change). | Owner/GPT review; verify live LS variant IDs + MoR fees before any build; next code item T-04 (weekly digest) = pg_cron + email HARD GATE. |
| 2026-06-17 | WORKED-EXAMPLE (T-03) — implemented + **MERGED PR #5** (merge `12fd0a6`; branch deleted; no deploy). Built the worked-example escape hatch (roadmap A3) as one safe slice. New `📝 Worked example` button in `public/app.html` posts `worked_example:true`; `sendMessage(opts)` sends a canned ask when no text is typed. `api/chat.js` appends a one-turn prompt guard — the new testable `getWorkedExampleGuard()` in `lib/prompts.js` — and tags the turn `tutoring_mode:'worked_example'`. The guard forces a NEW, clearly-different **parallel** problem to be solved and **explicitly forbids solving/revealing the student's own submitted problem** (anti-cheat; addresses research K4). Independent + self review: no blocking issues (flag only appends to the prompt, after all security checks; `finalizeTurn` credit metering unchanged; addBubble uses textContent → no XSS; app.html network-first so no SW bump). Reuses the existing auth → credit → streaming → `finalizeTurn()` flow verbatim. **No schema/auth/payment/credit/migration/install/deploy.** New `📝 Worked example` button in `public/app.html` posts `worked_example:true`; `sendMessage(opts)` sends a canned ask when no text is typed. `api/chat.js` appends a one-turn prompt guard — the new testable `getWorkedExampleGuard()` in `lib/prompts.js` — and tags the turn `tutoring_mode:'worked_example'`. The guard forces a NEW, clearly-different **parallel** problem to be solved and **explicitly forbids solving/revealing the student's own submitted problem** (anti-cheat; addresses research K4). Reuses the existing auth → credit → streaming → `finalizeTurn()` flow verbatim. **No schema/auth/payment/credit/migration/install/deploy.** PR opened → `main`; stopped at merge (chat backend = high-risk, owner review). | `npm test` 87 pass / 1 skip (+4 `worked-example` guard tests); `node --check` clean. | Owner review/merge of the worked-example PR; next backlog item T-04 (weekly digest) needs pg_cron + email = HARD GATE (owner approval). |
| 2026-06-17 | STREAMING-SSE — reviewed + **MERGED PR #4** into `main` (merge `31daae0`; branch deleted; no deploy — auto-deploy off). Resolved the PR↔`main` conflict from the dark-theme merge (kept both tracker/brief rows; bumped SW cache `v8→v9`). Independent + self review found no blocking issues. Originally landed the SSE streaming spike (branch `feat/streaming-sse`, commit `b2927b7`, off `main`). `api/chat.js` streams OpenAI deltas as SSE when `body.stream=true`, else a single JSON reply; credit/payment steps 11–13 extracted verbatim into a shared `finalizeTurn()` (single source of truth). New `lib/sse.js` (framing) + `public/js/stream.js` (chunk-tolerant buffer parser). **Security review:** pre-AI checks (ownership, `child_id`-from-session, rate limit, blocked-content) untouched; distress/PII notifications fire before the split on both paths with per-session dedup; streamed + finalized text both go through escape-first `renderMarkdown` (XSS-safe); mid-stream errors emit SSE error + `[DONE]`. Pushed to `origin`+`fork`; **PR #4 open → `main`** (owner review required; no deploy — auto-deploy off). **High-risk backend; no migrations/auth/payment/RLS/installs/deploy.** | `npm test` 83 pass / 1 skip (+10 `sse`/`stream` tests); `node --check` clean; PR #4. | Owner review/merge of PR #4 + a live end-to-end stream smoke (real OpenAI+Supabase) before any deploy. (Dark-theme work is on `feat/dark-theme`, PR #3.) |
| 2026-06-17 | UI-DARK-MERGE — owner approved; **merged PR #3 (dark theme) into `main`** via `gh pr merge --merge` (`07a1362`), synced `main` to `origin` + `fork`. **No deploy** (auto-deploy off). **Incident caught + fixed:** the merge surfaced that the held-out `PROJECT_BRIEF.md` had been accidentally committed by a `git add -A` in slice `8f5062e`; untracked it again (`git rm --cached`, `d9e525d`, file kept on disk) and added `/PROJECT_BRIEF.md` to `.gitignore` (`8c9e4da`) so it can't recur. | PR #3 state MERGED; `git ls-files PROJECT_BRIEF.md` empty; `git check-ignore` matches; main = origin = fork (1 SHA); dark theme present on `main`. | Streaming PR #4 is now behind `main` — rebase before merging. A live logged-in smoke + deploy remain owner-gated. |
| 2026-06-17 | UI-DARK — implemented a site-wide warm-dark theme on branch `feat/dark-theme` (off `main`), 8 small commits. Added an `html[data-theme="dark"]` token block to `public/css/zeluu-tokens.css` (warm dark surfaces/text/border/inverted gray-scale/accent/status/child-variants/deepened shadows + `--color-surface-glass` + `color-scheme:dark`); opted all 13 pages in via `<html ... data-theme="dark">`. Converted hardcoded light surfaces to tokens and darkened hardcoded light `oklch()` pastels (badges, chips, info/score boxes, legal glass navs) hue-preserved, lightening paired dark text; fixed inverted-surface bug (pricing featured card → lifted warm surface + accent ring; dashboard refresh button → accent). SW cache `v7→v8`. **Verified with headless Chrome screenshots** (landing/login/dashboard-gate/pricing/child-login/legal/exam-prep all render correctly). **Frontend/docs only; no backend/auth/payment/Supabase/installs/deploy/React-Vite.** Pushed to `origin` + `fork`; **PR #3 open → `main`.** Follow-ups this session: **authed views now screenshot-verified** (child chat via a temporary reverted auth shim; dashboard components via a throwaway harness of the verbatim render markup), and a **WCAG AA contrast audit** (OKLCH→sRGB→WCAG) — all text/surface pairs pass AA after bumping tertiary `--color-text-light` 56%→63% L (3.53:1 → 4.70:1). | `npm test` 73 pass / 1 skip; screenshots reviewed; AA audit passes; PR #3 (now 11 commits). | Owner review/merge of PR #3 (no deploy — auto-deploy off; note: `feat/streaming-sse` holds the SSE streaming spike, PR #4). A live logged-in pass is still worth doing before deploy. |
| 2026-06-15 | MVP-FOUNDATION-WAVE-1 — executed the owner-approved no-/low-gate wave (5 tasks), task-by-task, small commits, tests after each: (1) COPPA/VPC research doc (decision pending legal review); (2) **KaTeX math rendering** — shared XSS-safe `public/js/render.js` (escape-first), pinned CDN (no install), wired into `app.html`+`exam-prep.html`, sw v6→v7, +9 tests; (3) **Safety & Privacy page** `public/safety.html` (implemented/clearly-planned claims only, "now" vs "coming soon"), linked from index, +5 tests; (4) **age-banded tone** verified + locked, +7 tests; (5) **trial-enforcement design** spec (7d/50/10/15min, design-only, migration NOT applied). Commits `47a46c4`/`2c4d385`/`28b3c8d`/`2c501be`/`25b528b`. **No payment/auth/migration/cron/email/React-Vite/deploy.** | `npm test` **73 pass / 1 skip**; tree clean except `?? PROJECT_BRIEF.md`; pushed to PR #2. | Owner review of PR #2; not-yet-approved items (streaming, worked-example, try-before-signup, weekly digest+email, credit/payment enforcement) each need explicit approval; COPPA VPC awaits legal. |
| 2026-06-15 | MVP-FOUNDATION-1 — authored `docs/plans/PLAN-MVP-foundation.md`: execution-ready, file-exact, test-backed plan for the MVP sprint, **reconciled against the live codebase** (found age-banding in `lib/prompts.js`, subject support + XSS-safe `renderMarkdown` in `app.html`, scaffolding L1–L4 + safety detection in `api/chat.js`, and `credit_limit_*` + `get_child_limits_summary` RPCs already exist → MVP is mostly frontend polish + small backend extensions). 10 tasks, each gate-tagged; all code tasks BLOCKED pending owner approval. Updated tracker + this brief. **Docs-only; no product code written; no installs/live SQL/deploy/React-Vite.** | New file under `docs/plans/`; `npm test` 52 pass / 1 skip; tree clean except `?? PROJECT_BRIEF.md`. | Owner lifts the MVP build hold per task; start wave: COPPA/VPC research (no gate beyond legal) → KaTeX + Safety page + age-band verify → pricing/trial design → streaming/worked-example → try-before-signup + weekly digest (need consent + email-provider decisions). | 
| 2026-06-15 | RESEARCH-STRATEGY-1 — saved verified competitive/product research and converted it into specs + a task backlog; repositioned Zeluu math-only → all-subject child-safe bilingual learning companion (math-first). Created `docs/research/RESEARCH-competitive-product-strategy-2026-06-15.md`, `docs/specs/SPEC-PRODUCT-learning-companion-strategy.md`, `SPEC-PRICING-packages-credits-cost-model.md`, `SPEC-ROADMAP-product-revamp-implementation.md`, `docs/tasks/TASKS-product-strategy-roadmap.md`; updated tracker, this brief, specs README. **Docs-only; no product code; no installs; no live SQL/deploy; no React/Vite.** | New branch `docs/research-product-strategy-specs`; `git status` clean except `?? PROJECT_BRIEF.md`; facts/NCC/refuted warnings preserved. | Owner/GPT review of the strategy/pricing/roadmap specs; then start the recommended next sprint (KaTeX, streaming, weekly digest, trial enforcement design, COPPA/VPC gate, Safety page, age-banded tone, pricing design). |
| 2026-06-11 | DOCS-SYNC-2 — full project-docs consistency pass after the day's production sprint. Root `README.md` written (was a 1-line stub): product, stack, architecture, repo layout, dev/deploy, operating model. Brief §2/§3/§4/§6/§7/§8 rewritten to current truth (gates pruned to the 3 owner-only items + gated future slices; stale A0.OS-era "Do Not Do" replaced with the standing gate list). Tracker: header, S0/A0.5/STAGE1/STAGE2 rows updated to deployed status, Stage-0 gate row superseded, resolved risks struck. Specs README: SPEC-002 marked Decided. March-era root docs (`DEPLOYMENT_CHECKLIST`/`SETUP_GUIDE`/`IMPLEMENTATION_SUMMARY`) got historical-document banners pointing at current docs. Docs-only. | `git diff --stat` docs+README only. | Owner items unchanged (leaked-password toggle, LS runbook tests, re-pause decision). |
| 2026-06-11 | SCHEMA-RECON-1 — captured the full production migration history (all 22 applied migrations) from `supabase_migrations.schema_migrations` into `supabase/migrations/live/` (read-only; CLI naming). Integrity-verified: whitespace-normalized MD5 of every file matches the live DB (22/22). README documents live/ as authoritative, marks root `001` stale/reference-only, maps `002–004` to their live counterparts, and records the out-of-history pg_cron job (`enforce-subscription-expiry` @ 03:00 UTC, verified) + dashboard-managed Auth settings. Secret scan clean. The repo can now rebuild the production schema. | md5 verification script output 22/22; cron.job query. | Schema-reconciliation gap CLOSED. Remaining owner items: leaked-password toggle, LS dashboard checks + runbook tests, prod re-pause decision. |
| 2026-06-11 | PROD-SQL-3 — dropped the leftover `temp_transfer` table after the exact owner phrase (owner reviewed its single row first; no code references). Live migration `drop_temp_transfer_table`, mirrored to repo `004_*.sql`. Verified: table gone, 19 public tables remain, all RLS-enabled. | post-drop to_regclass NULL; RLS sweep true. | Remaining gated/owner items: leaked-password protection (dashboard), schema reconciliation slice, LS dashboard checks + runbook tests, prod re-pause decision. |
| 2026-06-11 | PROD-SQL-2 — pinned `search_path` on the 14 remaining public DB functions (11 SECDEF + 3 invoker) after the exact owner phrase. Pre-apply prosrc check confirmed crypt calls are `extensions.`-qualified; `match_knowledge_chunks` pinned to `public, extensions` for the pgvector operator, all others `public`. Live migration `pin_search_path_on_remaining_functions`, mirrored to repo `003_*.sql`. Verified: 0 unpinned functions; SQL probes of crypt/vector/balance/limits paths pass; live child-login 401. Closes advisor `function_search_path_mutable` + backlog item 3. | pg_proc proconfig query 0; probe results; migration recorded. | Remaining gated: `temp_transfer` drop (owner reviews the 1 row first), leaked-password protection (owner dashboard), schema reconciliation slice. |
| 2026-06-11 | REVIEW-FIX-1 — full-stack review (architecture/Supabase/auth/frontend/backend) then fixed all code-fixable findings in 2 slices: backend `15e299a` (exams child-pinning via centralized `resolveChildId`, timingSafeEqual token compare, distress/PII notification dedup per session, balance.js → `get_valid_credit_balance`) + frontend `27ca598` (escape AI/user content before innerHTML in app.html/exam-prep.html — stored-XSS class). Tests 52 pass / 1 skip (2 added). Deployed + smoked (READY; XSS guards verified in served HTML; APIs 401-healthy). | review findings in tracker row; `npm test`; live smoke matrix. | Gated remainder: SECDEF search_path migration (11 fns), `temp_transfer` drop (1 row — owner reviews contents), leaked-password protection (owner dashboard), schema reconciliation slice. |
| 2026-06-11 | UI-2B — retired the legacy purple `styles.css`: `sw.js` precache swapped to `zeluu-tokens.css`, cache `v5`→`v6`, file deleted after zero-reference sweep. `npm test` 50/1 skip. Deployed + smoked with the slice commit. | `git show` (sw.js + deletion); grep sweep = no references; test output. | Legacy design system fully gone; UI backlog now: dashboard JS-template ARIA/inline pass (gated). |
| 2026-06-11 | PROD-ENV-1 — verified all 8 prod env vars (names only). Found + fixed the missing `ALLOWED_ORIGIN` (live CORS was `*`; now exact `https://zeluu.com`, verified post-redeploy `dpl_3rccRhRKpYHfEAwPeSoXFEsyhQef`). Re-smoke green. No values read or printed; no secrets touched. | `vercel env ls` names; before/after `access-control-allow-origin` headers; smoke matrix. | Remaining (owner-only): LS dashboard checks + runbook tests 1–10; preview-env secret split (hygiene); re-pause prod Supabase decision. |
| 2026-06-11 | PROD-DEPLOY-1 — owner-approved production deploy of the UI slices. Sequence: owner disabled Vercel auto-deploy → cleared platform block → dashboard redeploy never created a deployment record → owner authorized Vercel CLI device login → linked project → `vercel deploy --prod` → `dpl_E2Xbt6CWzdByRuUggYscUHY1ehoC` READY. Smoke: 13 pages + 8 rewrites 200; webhook 405/401; balance 401; child-login 401; logs clean. UI-2/3/7 fingerprints live on zeluu.com. | Deploy output; curl status matrix; `vercel logs` (4 smoke requests only). | Remaining gates: owner-manual LS dashboard checks + runbook tests 1–10 (PROD-LS-1), prod env verification (PROD-ENV-1), re-pause prod Supabase decision. |
| 2026-06-11 | PROD-LS-1 — read-only Lemon Squeezy pre-verification (no LS API/keys, per runbook). Evidence: `GET zeluu.com/api/webhooks/lemonsqueezy` → 405; invalid-signature POST → 401 (secret configured, fail-closed; no event processed); code config documented (store 315398, 11 variants, 8 events, trial logic); `*.vercel.app` domains → 401 (deployment protection). **CRITICAL: discovered Vercel Git auto-deploy on `origin/main`** — PUSH-2 deployed `d0c7b2a` to production zeluu.com (unreviewed SEC-FIX-1/2/3 + UI-1 now live; fingerprint-verified); `34d4562`/`92109b7` deployments BLOCKED in Vercel. No code/SQL/migration/deploy/push/charges; no secrets printed. | curl status codes; Vercel MCP project/deployment records; page fingerprints. | Owner: complete LS dashboard checks + runbook tests 1–10; decide auto-deploy policy (disable vs. accept push-to-deploy); review BLOCKED deployments; then PROD-ENV-1 (Vercel env verification). |
| 2026-06-11 | PROD-RLS-1 — **enabled RLS on production `processed_webhooks`** (project `gstjvjynkdvqncjyybwm`) with exactly one statement, `ALTER TABLE processed_webhooks ENABLE ROW LEVEL SECURITY;`, after the exact owner phrase. Preflight (read-only): table exists, RLS disabled, 0 rows, 0 policies; handler confirmed on service-role client (not edited). Post-apply (read-only): RLS enabled, not forced, 0 policies (deny-by-default), table empty, `credit_ledger` 53 rows intact, no remaining RLS-disabled public tables. No other table/policy touched; no migration file; no deploy; no push. Docs-only commit. | Pre/post `pg_class.relrowsecurity` false→true; `pg_policies` count 0; advisor finding closed. | Next gates: PROD-LS-1 (manual Lemon Squeezy verification), prod env verification (8 vars), deploy + smoke. STAGE1-8 insert-first wiring still future. Decide prod re-pause. |
| 2026-06-11 | PROD-APPLY-1B — **applied migration 002 (parts 1–2) to production** project `gstjvjynkdvqncjyybwm` after the exact owner phrase `APPLY MIGRATION 002 TO PRODUCTION CONFIRMED`. Remote migration `20260611085209_webhook_idempotency_unique_index_and_processed_webhooks` = partial unique index on `credit_ledger.stripe_payment_id` + `processed_webhooks` table. Post-apply verification PASS (index present; table present/empty; credit_ledger 53 rows intact). Security advisors flag the new table as the only RLS-disabled public table (anon-visible via GraphQL) → gated follow-up to enable RLS. No data mutated; no deploy; project left ACTIVE. Updated migration file header, runbook, tracker, this brief. | `apply_migration` success; `list_migrations` shows `20260611085209`; post-apply SELECTs PASS. | Remaining PROD-GATE-1: manual LS verification, prod env verify (8 vars), deploy + smoke; gated RLS-on-`processed_webhooks` slice; handler insert-first wiring (STAGE1-7/8); decide prod re-pause. |
| 2026-06-11 | UI-MASTER-STATIC-1 — static frontend polish UI-2…UI-7 in 6 slice commits: `1758578` legal pages onto warm system (copy verbatim; `styles.css` 0 HTML refs, kept for `sw.js` precache), `b9b5b7e` a11y baseline (main/skip/aria/dialog/keyboard), `3299658` dashboard de-inline (static 65→25, file 167→127), `85256a4` font normalization (1 shared URL ×12 pages), `a3c09f2` responsive tap-targets + table overflow guards, `750ad19` RTL foundation. Docs updated per slice (SPEC-003 rows + §8) + tracker row + this brief. **Frontend/docs only; no backend/auth/payment/webhook/credit/Supabase changes; no installs; no deploy; no React/Vite; PROJECT_BRIEF held out.** | `git log --oneline` shows the 6 slice commits; `npm test` 50 pass / 1 skip after each slice; `grep styles.css public/*.html` = none; `grep zeluu-tokens.css public/*.html` = all 12 pages; tree clean except `?? PROJECT_BRIEF.md`. | Owner visual review of the slices; follow-ups: retire `styles.css` via `sw.js` precache edit (separate slice), JS-template ARIA/inline-style pass. Main gate unchanged: PROD-APPLY-1B. |
| 2026-06-11 | PROD-APPLY-1B-PREP — user invoked PROD-APPLY-1B; read runbook + revised migration 002; resumed prod project `gstjvjynkdvqncjyybwm` (INACTIVE→ACTIVE_HEALTHY); re-ran SELECT-only preflight: PASS, unchanged from 1A (0 dup payment refs, 3 rows, no unique index, processed_webhooks absent). **Migration NOT applied — exact confirmation phrase not yet given.** No DDL/DML; no data mutated. Project left ACTIVE. | MCP `get_project` status transitions; SELECT-only preflight results. | Await `APPLY MIGRATION 002 TO PRODUCTION CONFIRMED` to apply parts 1–2 via `apply_migration`; then post-apply verification + LS verification + env verify + deploy/smoke. Decide re-pause. |
| 2026-06-11 | PUSH-2 — pushed `main` to `origin` (`amrabdelglill-pixel/ai-math-tutor`), `f5e6028..4e9eed3` fast-forward (28 commits). The prior 403 / `push: false` limitation no longer applies (owner granted access / resolved). Origin, fork, and local `main` are now identical. No source changes; no deploy; no live SQL. | `git push origin main` output `f5e6028..4e9eed3`. | Main gate unchanged: PROD-APPLY-1B (apply revised migration 002 after exact confirmation phrase). |
| 2026-06-11 | PUSH-1 — pushed `main` to the `fork` remote (`AmrEbeid/ai-math-tutor`), `f5e6028..f5f2bad` fast-forward (27 commits incl. SEC-FIX-1/2/3 + docs). Push to `origin` failed 403: active account `AmrEbeid` has `push: false` on `amrabdelglill-pixel/ai-math-tutor`. No source changes; no deploy; no live SQL; branch tracking unchanged (still `origin/main`). | `git push fork main` output `f5e6028..f5f2bad`; `gh api` shows origin `push:false`, fork `admin:true`. | Decide origin strategy: get collaborator access on `amrabdelglill-pixel` (or auth as that account) and push, or open a PR from the fork. Main gate unchanged: PROD-APPLY-1B. |
| 2026-06-11 | SEC-FIX-3 — fixed the `api/credits/balance.js` billing-data leak (`57626f9`): the two billing queries (`credit_ledger` + `subscriptions`) now run only for parent tokens; child tokens get only the credit count. Added `tests/credits-balance.test.mjs` (2). Staged only the fix + test file (PROJECT_BRIEF held out). Closes the last 360-review finding. **Medium-risk source; no deploy; no live SQL; no installs; not pushed.** | `git show 57626f9 --stat` = api/credits/balance.js + tests/credits-balance.test.mjs; `npm test` 50 pass / 1 skip; `git status` clean except `?? PROJECT_BRIEF.md`. | Manual review of SEC-FIX-1/2/3 before deploy; optional hardening (explicit column lists vs `select('*')`). Main gate unchanged: PROD-APPLY-1B. |
| 2026-06-11 | SEC-FIX-2 — fixed the child-login password-flag bypass (`37d87d5`). `api/auth/child-login.js` now normalizes the `verify_child_login` result (object or one-row array) and rejects when `child_id` is missing or `success === false`, instead of issuing a token on `child_id` presence alone. Added `tests/child-login.test.mjs` (7). Staged only the fix + test file (PROJECT_BRIEF held out). Prod project `gstjvjynkdvqncjyybwm` was INACTIVE — **did NOT resume it** to read the live function; chose a fix correct under any return shape instead. **Medium/High-risk source; no deploy; no live SQL; no installs; not pushed.** | `git show 37d87d5 --stat` = api/auth/child-login.js + tests/child-login.test.mjs; `npm test` 48 pass / 1 skip; `git status` clean except `?? PROJECT_BRIEF.md`. | Manual review before deploy; DB defense-in-depth (return no row on failed password) + live↔repo `verify_child_login` reconciliation (gated). Remaining finding: `balance.js` billing-metadata leak. Main gate unchanged: PROD-APPLY-1B. |
| 2026-06-11 | SEC-FIX-1 — full 360 read-only security review (1 finder + 5 adversarial verifiers) of the whole codebase, then fixed the two confirmed cross-tenant bugs in their own slice `e6b1696`: `api/sessions/history.js` child tokens pinned to own `child_id`; `api/chat.js` session ownership-checked up front + `child_id` derived from session (not body) + 403 on foreign session + ownership-before-writes. Added 8 handler tests (`sessions-history` 5 pass; `chat-handler` 3 skip until deps installed); `package.json` test script gains `--experimental-test-module-mocks`. Staged only the 5 fix/test files (PROJECT_BRIEF held out). **Medium/High-risk source; no deploy; no live SQL; no installs; not pushed.** Verified chat tests pass via an ephemeral local `openai` stub that was then removed (node_modules untouched/gitignored). | `git show e6b1696 --stat` = api/chat.js, api/sessions/history.js, package.json, tests/{sessions-history,chat-handler}.test.mjs; `npm test` 41 pass / 1 skip; `git status` clean except `?? PROJECT_BRIEF.md`. | Manual review of the fix slice before deploy; then the two UNFIXED findings — `child-login.js` `success`-flag bypass (verify vs live DB fn) + `balance.js` billing-metadata leak. Main gate unchanged: PROD-APPLY-1B. |
| 2026-06-10 | UI-1 — shared static design token/base stylesheet. Read all 7 warm pages' `:root` blocks (values identical across pages; one trivial `--gray-600` hue drift 65-vs-63, shared file uses 65, page overrides win). Created `public/css/zeluu-tokens.css` (tokens + reset + `:focus-visible` + `prefers-reduced-motion`); linked it on the 7 warm pages before their inline `<style>` (19 insertions, link-only). Updated SPEC-003 (UI-1 row + §8 status), tracker (UI-1 row). **No inline-token removal; `styles.css` not retired; legal pages untouched; no backend/`lib`/`supabase`/package/env edits; no installs; no React/Vite; no deploy.** | `git diff --stat` = 7 pages, 19 insertions, 0 deletions + new `zeluu-tokens.css`; `grep zeluu-tokens.css public/*.html` = exactly the 7 warm pages; `npm test` 36/36 pass. | UI-2 — migrate the 5 legal/utility pages off legacy purple `styles.css`. DOCS-SYNC log row for the previous task folded in here as promised. |
| 2026-06-10 | DOCS-SYNC-UIUX-SPECKIT-1 — reviewed + committed the Spec Kit evaluation and UI/UX audit docs (`48e214f`, 5 docs files); corrected stale §4 (the 14 source files are committed in C4a–C5; tree clean except held-out `PROJECT_BRIEF.md`); staged-set guard confirmed docs-only. | `git show 48e214f --name-only` = 5 allowed docs; post-commit `git status` = `?? PROJECT_BRIEF.md` only. | UI-1 (now done — see row above). |
| 2026-06-10 | UIUX-AUDIT-1 — read-only frontend UI/UX audit (read `css/styles.css` + `index`/`app` heads/structure; static scan of all 12 pages for fonts/gradients/tokens/ARIA/focus/reduced-motion/`lang`-`dir`/alt) → wrote `docs/specs/SPEC-003-frontend-uiux-audit-and-design-plan.md` (7 gate-aware static slices UI-1…UI-7). Updated specs `README.md` + `PROJECT_TRACKER.md` (UIUX-AUDIT-1 row + finding). **Read-only; no `public/*`/CSS/JS edits; no installs; no React/Vite; no source/backend/migration/deploy.** | `git status --short` = `M docs/{PROJECT_TRACKER,SESSION_BRIEF}.md`, `M docs/specs/README.md`, `?? docs/specs/SPEC-003-...` (+ pre-existing `?? SPEC-002-...`, `?? PROJECT_BRIEF.md`). No `public/*` changed. | Owner/GPT picks first slice (rec. UI-1 shared token stylesheet); any CSS/HTML edit is a separate Medium-risk PR. |
| 2026-06-10 | EVAL-SPECKIT-1 — docs-only evaluation of GitHub Spec Kit vs. the existing specs workflow. Read CLAUDE.md/brief/tracker/specs README/SPEC-001 + fetched current github/spec-kit docs; wrote `docs/specs/SPEC-002-spec-kit-evaluation.md` (concept mapping, strengths, fit, recommendation = inspiration-only). Updated specs `README.md` index + `PROJECT_TRACKER.md` (EVAL-SPECKIT-1 row + decision-log finding + Last Updated). **No tooling installed; no `specify init`; no scaffolding; no slash-command/operating-doc changes; no source/`api`/`public`/migration/deploy.** | `git status --short` = `M docs/PROJECT_TRACKER.md`, `M docs/specs/README.md`, `?? docs/specs/SPEC-002-...`, `?? PROJECT_BRIEF.md` (pre-existing). No source/migration touched. | Owner/GPT picks an option in SPEC-002 §8; any install/adopt remains a hard gate. Main thread next action unchanged: PROD-APPLY-1B. |
| 2026-06-03 | A0.OS — installed project operating docs (CLAUDE.md, tracker, brief, specs index, SPEC-000/A0.5/A0.6). Preserved 4/8 A0.6 research categories into SPEC-A0.6. | `git status` shows only new docs added; `api/*`+`public/*` pre-existing uncommitted changes untouched. | Await approval to continue A0.6 (pending category). |
| 2026-06-03 | A0.OS correction — re-opened SESSION_BRIEF.md and updated it **last** (after specs were written), fixing the execution-order issue. Confirmed: (a) A0.OS docs created; (b) SPEC-A0.6 created with partial research preserved; (c) SaaS-billing + Supabase/auth-security research remains **pending**; (d) A0.OS touched **no source files** (`api/*`/`public/*` untouched); (e) pre-existing Stage 0/A0.5 uncommitted changes still in working tree; (f) a separate "Amr's GPT → Claude operating workflow" doc is still needed (note added in §8). | `git diff --name-only` lists only the pre-existing `api/*`+`public/*` mods (A0.OS docs are untracked, so not shown there); scoped intent-to-add diff confirms only `docs/SESSION_BRIEF.md` + `docs/PROJECT_TRACKER.md` changed. | Next safe action: user approval to continue A0.6 research (pending category). |
| 2026-06-03 | A0.OS-GPT — created `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` documenting Amr's Human + GPT + Claude operating workflow. Updated `docs/specs/README.md` (index) and `docs/PROJECT_TRACKER.md` (decision log + A0.OS-GPT task). Replaced the prior "workflow doc still needed" open note in §8. **No source files changed.** | Scoped diff shows only `docs/` files (SPEC-001, README, tracker, this brief). | Next safe action remains: user approval to continue A0.6 research (pending category). |
| 2026-06-03 | A0.6 continued — completed the final 2 research categories (SaaS billing/trial/checkout + Supabase auth/RLS/security; 16 sources). Folded findings into `SPEC-A0.6` (candidate tables for Cat 3 & 4, shortlist rows, Q4/Q7 picks, billing + Supabase/security lessons, roadmap rows, what-to-avoid), flipped its status to **Complete (8/8)**. Updated `PROJECT_TRACKER.md` (A0.6 + A0.6-R status, decision/finding). **No source files changed; no code copied; no installs/migrations.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped intent-to-add diff confirms only `docs/SPEC-A0.6 + PROJECT_TRACKER + SESSION_BRIEF` changed. | Next safe action: user approval to draft a Stage 1 test/schema/tooling **planning** spec (docs only). |
| 2026-06-03 | A0.6 README sync correction — updated the A0.6 entry in `docs/specs/README.md` from "In progress (4/8)" to "Complete (8/8)". Docs-only. **No source files changed.** | Scoped diff shows only `docs/specs/README.md` + this brief. | Next safe action unchanged: approval to draft Stage 1 planning spec (docs only). |
| 2026-06-03 | Tracker status sync — updated the A0.OS workstream row in `docs/PROJECT_TRACKER.md` from "In progress (this task)" to "Complete / accepted" (current task: "Operating docs installed"). Docs-only. **No source files changed.** | Scoped diff shows only `docs/PROJECT_TRACKER.md` + this brief. | Next safe action: GPT/user review of Stage 1 planning spec, then STAGE1-A. |
| 2026-06-03 | PROD-APPLY-1A — connected to Supabase (read-only); resumed prod project `gstjvjynkdvqncjyybwm` (INACTIVE→ACTIVE_HEALTHY); ran the SELECT-only preflight via MCP `execute_sql`. Evidence: 0 duplicate non-null `credit_ledger.stripe_payment_id` (3 payment-ref rows); no `credit_ledger_stripe_payment_id_unique` index; `processed_webhooks` absent; `notifications` empty; **live `notifications_type_check` already allows 12 types** (all 4 "missing" + `subscription_expired`/`subscription_expiring`). **Decision: revise migration 002** — removed the regressive CHECK rewrite (would drop 2 live types); kept parts 1–2 (unique index + processed_webhooks), preflight PASS. Edited `supabase/migrations/002_*.sql` + `RUNBOOK-migration-002` + corrected the "notifications silently failing" claim in STAGE1-LOCAL-ACCEPTANCE + security backlog + tracker. **Migration NOT applied; no DDL/DML; no data mutated; no deploy; no source (app) changes; `npm test` still 36/36.** | Read-only SELECTs only + restore_project; `git status` clean except `?? PROJECT_BRIEF.md` before commit. | Next: PROD-APPLY-1B (apply revised 002 parts 1–2 after exact confirmation phrase); decide re-pause of the prod project. |
| 2026-06-03 | PENDING-CLOSURE-1 — docs-only production-gate pack (no live actions). Created `docs/runbooks/` (PROD-GATE-1 master, migration-002 apply, Lemon Squeezy verification, README), `docs/checklists/` (prod env & deploy, README), read-only `supabase/sql/preflight_002_webhook_idempotency.sql` (SELECT-only), and specs: `SPEC-PROJECT-BRIEF-drift-reconciliation` (brief held out → archive recommended), `SPEC-SECURITY-RLS-SECDEF-hardening-backlog`, `SPEC-child-token-storage-httpOnly-migration-plan`, `SPEC-STAGE2-deferred-work-closure-plan`. Updated specs README + tracker (PENDING-CLOSURE-1 row) + this brief. No source changes; `npm test` still 36/36. **No deploy; no live SQL; no Supabase mutation; no real LS/OpenAI; no installs; no React/Vite; PROJECT_BRIEF not committed.** | 3 docs commits; `git status` clean except `?? PROJECT_BRIEF.md`; preflight SQL is SELECT-only. | Next safe action: PROD-GATE-1 (manual external gates). |
| 2026-06-03 | LOCAL-CORRECTION-1 — closed the overstated-acceptance gap: wired all 8 required env vars through `lib/env.js` (`getEnv` in `api/chat.js`/`api/exams.js` for OPENAI_API_KEY, `api/credits/checkout.js` for LEMONSQUEEZY_API_KEY, webhook for LEMONSQUEEZY_WEBHOOK_SECRET, `lib/child-auth.js` for CHILD_JWT_SECRET; `getAllowedOrigin()` documented `'*'` fallback for ALLOWED_ORIGIN). Added 5 `node:test` tests (per-var secret-free failure + `getAllowedOrigin` + child-auth sign-throws/verify-fail-closed) → **36 pass / 0 fail**. Committed code+tests `948baa8`; updated SPEC-STAGE1-LOCAL-ACCEPTANCE (§5a + status), SPEC-STAGE2-LOCAL-ACCEPTANCE (count), README, tracker, this brief. **No deploy; no live SQL; no live Supabase/LS/OpenAI; no installs; no React/Vite; PROJECT_BRIEF held out.** | `npm test` 36/36; `node --check` OK on 8 edited JS; `git status` clean except `?? PROJECT_BRIEF.md`; only allowed files committed. | Next safe action: PROD-GATE-1 (apply migration 002, manual LS replay, prod env verify, deploy). |
| 2026-06-03 | FINISH-STAGE1-STAGE2-LOCAL — local build + clean commits. Committed STAGE1-1R docs (`8b89292`); committed source in slices: C4a CORS `15d62f5`, C4b chat+children (+ child-auth lazy-import test seam) `8a60d2d`, C4c webhook (+ extracted `lib/webhook-verify.js`) `b3f043f`, C5 A0.5 frontend `f0b4c87`; env validation `lib/env.js` + `.env.example` + `!.env.example` gitignore `2a32f76`; `node:test` baseline (`npm test`, 31 tests, 0 installs) `84d2084`; Stage 2 static `public/app.html` UX `4360957`; Stage 1+2 local acceptance docs `e108e09`/this. Created migration `002` (webhook unique index + processed_webhooks + notifications.type CHECK for 4 missing types) — **NOT applied**. **No deploy; no live SQL; no live Supabase/LS/OpenAI; no React/Vite; no package installs; PROJECT_BRIEF held out.** | `npm test` 31/31 pass; `git log` shows the slice commits; `git diff` clean after each commit; `git status` source committed, only docs + this brief pending. | Next safe action: GPT/user review + PROD-GATE-1 (apply migration 002, manual LS replay, prod env verify, deploy). |
| 2026-06-03 | STAGE1-1R — read-only review of all 14 uncommitted source diffs (`git diff` per file + schema/lib cross-checks; no mutation) → created `docs/specs/SPEC-STAGE1-1R-source-diff-review-before-commit.md` (per-file risk, cross-file interactions, C4a/C4b/C4c/C5 split recommendation, manual verification checklist, gates). Findings: 7 CORS one-liners (Low, C4a); `chat.js` credit-count reorder + notif dedup (High, C4b); `children.js` unsigned→HMAC token verify + service-role consolidation (High, security-positive, C4b); `lemonsqueezy.js` best-effort idempotency (no UNIQUE on `credit_ledger.stripe_payment_id` → race) + logging cut + `message`→`body`, and **`payment_failed` violates `notifications.type` CHECK (silently caught)** (High, C4c). Updated `SPEC-STAGE1-1` (§13a), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 row + STAGE1-1A/1R task rows). **No staging; no commits; no source/files reset/reverted/stashed; no source changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite.** | `git status --short`: 14 `M` source + `?? PROJECT_BRIEF.md`; `git diff --cached` empty; HEAD `d5f7d0d`; only allowed docs edited (now uncommitted). | Next safe action: GPT/user review of STAGE1-1R, then approve STAGE1-1C4A (commit low-risk CORS) or STAGE1-1C4R/1C5R review slices. |
| 2026-06-03 | STAGE1-1A — committed the 15 approved docs in **3 waves** with a programmatic staged-set guard: `590e67b` operating docs (CLAUDE.md + tracker/brief/README + SPEC-000/001), `09b8142` A0.6+Stage 1 readiness (SPEC-A0.5/A0.6/STAGE1/A/B/C/FINAL/1), `d5f7d0d` Stage 2 plan (SPEC-STAGE2). Safety-scanned docs (no real secrets; no false impl claims). **No source staged/committed; `PROJECT_BRIEF.md` excluded; no source changed; no installs/tests/build/SQL/migrations/deploy.** | `git log --oneline -3` = the 3 docs commits atop `f5e6028`; `git diff --cached` empty post-commit; 14 source files still `M`/uncommitted; guard confirmed no source/forbidden file in any commit. | Next safe action: STAGE1-1R source diff review. |
| 2026-06-03 | STAGE1-1 — read-only `git` diff audit of all 14 uncommitted source files (`git status/diff/log`, no mutation) + untracked `docs/` inventory → created `docs/specs/SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md` (source inventory, docs inventory, workstream classification, commit-strategy Options A/B/C, file-listed commit plan C1–C5, review gates, safe example git commands, risks, next prompt). Classified: 7×CORS one-liner + `chat.js` credit-count/notif-dedup + `children.js` HMAC token verify/service-role consolidation + `lemonsqueezy.js` idempotency/logging/field-fix = Stage 0; 4×`public/*` trial copy + pendingPlan persistence + activation UX = A0.5. Updated `SPEC-STAGE1-FINAL` (§9a), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-1 row). **No commits; no files staged; no source/docs files reset/reverted/stashed; no source changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite.** | `git status --short`: 14 `M` source + `?? CLAUDE.md PROJECT_BRIEF.md docs/`; `git diff --name-only` = same 14 source (unchanged by this task); only the allowed docs were edited (under untracked `docs/`). | Next safe action: GPT/user review of STAGE1-1, then approve STAGE1-1A (docs-only commit) or STAGE1-1R (source-diff review). |
| 2026-06-03 | STAGE1-FINAL + STAGE2-P — reconciled STAGE1-P/A/B/C and created the Stage 1 readiness package `docs/specs/SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md` (scope completed, baseline, key findings, STAGE1-1…13 backlog with risk/approval/source-file flags, hard gates, implemented-Stage-1 acceptance, first slice = STAGE1-1) + the full Stage 2 plan `docs/specs/SPEC-STAGE2-child-chat-ux-master-plan.md` (tutor UX flow, chat-UI/tutoring/safety/credit requirements, static-vs-React options, A0.6 inspiration map, STAGE2-A…J slices, tests, acceptance, risks). Confirmed STAGE1-C already complete (not recreated). Updated `SPEC-STAGE1` (§4.4), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1+STAGE2 rows, STAGE1-FINAL+STAGE2-P tasks). **Docs-only; no source files changed; no installs/tests/build/SQL/migrations/deploy; no React/Vite; no secret values read; `.env.example` not created.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; new specs + doc edits live under the (already-untracked) `docs/`. | Next safe action: GPT/user review of the Stage 1 final package + Stage 2 plan; then STAGE1-1 working-tree cleanup before any implementation. |
| 2026-06-03 | STAGE1-C — read-only env/secret inventory (grep `process.env` across `api`+`lib`: 8 vars / 18 sites; 0 refs in `public/`) → created `docs/specs/SPEC-STAGE1-C-env-secret-validation-plan.md` (per-var inventory, secret classification, exposure/logging review, fail-fast validation plan, `.env.example` proposal + `.gitignore` `.env.*` caveat, future tests, next slice). Updated `SPEC-STAGE1` (§4.3), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 row + STAGE1-C task + decision-log finding). **Read-only; no source files changed; no `.env*` read/created; no secret values printed; no installs/tests/build/SQL/migrations/deploy.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; new spec + doc edits live under the (already-untracked) `docs/`; `.env.example` confirmed still absent. | Next safe action: GPT/user review of STAGE1-C, then (if approved) docs-only STAGE1-G or STAGE1-D. |
| 2026-06-03 | STAGE1-B — read-only schema/RLS/API inventory of `001_initial_schema.sql` + all `api/*`/`lib/*` + frontend touchpoints → created `docs/specs/SPEC-STAGE1-B-schema-rls-api-inventory.md` (11 tables, 13 RLS policies, 14 SECDEF fns, 2 triggers, endpoint→data map, env inventory, 9-item drift register). Updated `SPEC-STAGE1` (§4.2 note), specs `README.md`, `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-B row). **Read-only; no source files changed; no SQL/Supabase/migrations; no installs/tests/build.** Findings: missing idempotency table, SECDEF search_path gap, exam/knowledge tables not in repo, parent-only RLS. | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 5 allowed `docs/` files changed; root `README.md`/package/vercel untouched. | Next safe action: GPT/user review of STAGE1-B, then (if approved) docs-only STAGE1-C. |
| 2026-06-03 | STAGE1-A — Phase 0 confirmed A0.OS tracker already in sync (no change). Phase 1 read-only audit (git/package/vercel/api/frontend/lib/supabase/tests/CI/env) → created `docs/specs/SPEC-STAGE1-A-read-only-tooling-baseline-audit.md`. Updated `SPEC-STAGE1` (audit note + corrected `credit_ledger`/table list), specs `README.md` (index), `PROJECT_TRACKER.md` (STAGE1 task + STAGE1-A row). **Read-only; no source files changed; no installs/tests/build; no SQL/migrations.** Material finding: schema doc-drift + missing webhook-idempotency table. | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 5 allowed `docs/` files changed; root `README.md` untouched. | Next safe action: GPT/user review of STAGE1-A, then (if approved) docs-only STAGE1-B. |
| 2026-06-03 | STAGE1-P — drafted `docs/specs/SPEC-STAGE1-test-schema-tooling-plan.md` (test baseline, schema docs, env validation, webhook-idempotency design, RLS/security plan, tooling/deps, CI, AI mocking, slices STAGE1-A…J, risk register, dependency-approval list). Updated `docs/specs/README.md` (index) and `docs/PROJECT_TRACKER.md` (STAGE1 status + STAGE1-P task). Read-only repo inspection only. **No source files changed; no packages installed; no migrations; no SQL.** | `git diff --name-only` lists only pre-existing `api/*`+`public/*`; scoped diff confirms only the 4 allowed `docs/` files changed; root `README.md` untouched. | Next safe action: GPT/user review of the Stage 1 planning spec, then (if approved) STAGE1-A read-only audit. |
