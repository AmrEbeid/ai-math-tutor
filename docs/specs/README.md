# Zeluu Specs Index

> Index of all specification documents. Each spec is the source of truth for its
> workstream. Read the relevant spec before editing anything in its scope.

## Naming Convention

`SPEC-<id>-<short-slug>.md` — `<id>` is `000` for the overview, then the workstream
ID (e.g. `A0.5`, `A0.6`, `STAGE1`).

## Specs

### `SPEC-000-project-overview.md`
* **Purpose:** Factual overview of the product, stack, users, business model,
  architecture, workstreams, risks, roadmap, and hard gates.
* **Status:** Active (living reference).
* **Risk level:** Low (documentation).
* **Next action:** Keep in sync as architecture/roadmap decisions change.

### `SPEC-001-human-gpt-claude-operating-flow.md`
* **Purpose:** Documents Amr's full Human + GPT + Claude operating workflow — roles,
  the end-to-end loop, prompt types, risk classification, anti-drift rules, and the
  evidence/review loop.
* **Status:** Active (operating reference).
* **Risk level:** Low (documentation).
* **Next action:** Use as the operating reference for planning, prompts, review, and
  process.

### `SPEC-002-spec-kit-evaluation.md`
* **Purpose:** Docs-only evaluation of GitHub **Spec Kit** vs. the existing hand-rolled
  specs workflow — concept mapping, where each is stronger, fit assessment, and a
  recommendation. No tooling installed; no `specify init`; no scaffolding; no source.
* **Status:** **Decided (2026-06-10): inspiration-only** — not installed/adopted in Zeluu
  (recorded in the tracker decision log).
* **Risk level:** Low (research / docs only).
* **Next action:** None for Zeluu; reconsider `specify init` only for a future greenfield project.

### `SPEC-003-frontend-uiux-audit-and-design-plan.md`
* **Purpose:** Read-only UI/UX audit of `public/*` + a prioritized, gate-aware design
  improvement plan (frontend-design lens). Surfaces two coexisting design systems (warm
  OKLCH/Fraunces vs. a legacy purple-gradient `styles.css` on 5 legal pages), inline-token
  duplication, dashboard inline-style debt, and accessibility/RTL gaps.
* **Status:** Drafted / awaiting GPT and user review. Audit complete; no implementation authorized.
* **Risk level:** Low (read-only / docs only); Medium when implemented (frontend edits).
* **Next action:** Owner/GPT picks the first slice (recommended UI-1: shared token stylesheet).
  No `public/*`/CSS edit, install, or React/Vite authorized.

### `SPEC-A0.5-trial-signup-onboarding-flow.md`
* **Purpose:** Documents the completed A0.5 Trial Signup, Card-Based Onboarding &
  Activation UX fix (frontend-only flow/copy).
* **Status:** Implemented / pending manual Lemon Squeezy verification.
* **Risk level:** Low/Medium.
* **Next action:** Complete the manual Lemon Squeezy verification checklist; then
  decide on follow-up candidates.

### `SPEC-A0.6-public-repo-benchmark.md`
* **Purpose:** Research/benchmark spec capturing public-repo and product-inspiration
  findings to guide later Zeluu decisions. Research-only; no code copied.
* **Status:** Complete — all 8 categories researched (incl. SaaS-billing +
  Supabase/auth-security). No code copied.
* **Risk level:** Low (research/spec only).
* **Next action:** Use as reference; all adoptions remain gated on review/approval.
  Research is closed — no further A0.6 research step required.

### `SPEC-STAGE1-test-schema-tooling-plan.md`
* **Purpose:** Planning spec for Stage 1 — test baseline, schema documentation, env
  validation, webhook-idempotency design, RLS/security planning, CI/tooling, and AI
  mocking. Defines slices, risks, and dependency-approval needs. Planning only.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Medium planning, no execution (docs-only).
* **Next action:** GPT/user review before any implementation; then STAGE1-A
  (read-only audit).

### `SPEC-STAGE1-A-read-only-tooling-baseline-audit.md`
* **Purpose:** Evidence-based read-only audit of the current repo baseline (git,
  package/scripts, API, frontend, lib, schema/migrations, tests/CI, env vars) before
  Stage 1 implementation. Surfaced material schema doc-drift and the missing
  webhook-idempotency table.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Low (read-only audit / docs-only).
* **Next action:** GPT/user review; then approve the next Stage 1 slice
  (recommended: STAGE1-B schema/RLS/API documentation).

### `SPEC-STAGE1-B-schema-rls-api-inventory.md`
* **Purpose:** Evidence-based schema/RLS/function/trigger inventory + API
  endpoint→tables/RPCs/env/external map + frontend touchpoints + env-var inventory +
  documentation-drift register, built read-only from repo files.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Low (read-only / docs-only); medium planning relevance.
* **Next action:** GPT/user review; approve next docs-only slice (recommended:
  STAGE1-C env/secret validation plan).

### `SPEC-STAGE1-C-env-secret-validation-plan.md`
* **Purpose:** Docs-only env-var / secret-validation plan — inventory of the 8 server
  env vars (names + reference sites, no values), secret classification, exposure/logging
  review, a fail-fast validation plan (single `lib/env.js` seam, no-dependency validator
  preferred, import- vs request-time split), an `.env.example` proposal (drafted, not
  created), the `.gitignore` `.env.*` caveat, and the next slice. Built read-only.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Low execution (docs-only); medium security relevance (secrets/keys).
* **Next action:** GPT/user review; then (if approved) a docs-only slice — STAGE1-G
  (webhook-idempotency design) or STAGE1-D (test-tooling proposal). Implementation of env
  validation, `.env.example`, and any install remain gated.

### `SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md`
* **Purpose:** Closes Stage 1 planning/audit. Reconciles STAGE1-P/A/B/C into one readiness
  package — scope completed, repo baseline, key findings, a STAGE1-1…13 implementation
  backlog (risk/approval/source-file flags), hard gates, implemented-Stage-1 acceptance
  criteria, and the recommended first implementation slice (STAGE1-1 working-tree cleanup).
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Medium planning, no execution (docs-only).
* **Next action:** Review before any Stage 1 implementation; then approve STAGE1-1.

### `SPEC-STAGE2-child-chat-ux-master-plan.md`
* **Purpose:** Full Stage 2 plan for the child-facing tutor/chat experience — goal,
  principles, tutor UX flow, chat-UI/tutoring/safety/credit-boundary requirements,
  static-vs-React options, A0.6 inspiration mapping (no code copied), STAGE2-A…J
  workstreams + implementation slices, testing plan, acceptance criteria, and risks.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Medium planning, no execution (docs-only).
* **Next action:** Review after Stage 1 readiness; no implementation authorized
  (recommended first slice: STAGE2-A read-only child chat UX audit).

### `SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md`
* **Purpose:** Read-only audit of the 14 uncommitted source files (classified Stage 0
  `api/*` security/payment/auth vs A0.5 `public/*` onboarding) + the untracked `docs/`
  tree, with an explicit, file-listed commit/cleanup plan (docs waves C1–C3 → Stage 0 C4 →
  A0.5 C5), review gates, and safe example git commands. Nothing committed/staged/changed.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** Medium planning relevance, low execution (read-only + docs-only).
* **Next action:** GPT/user review; then approve docs-only commit (STAGE1-1A) or
  source-diff review (STAGE1-1R). No cleanup or commit authorized yet.

### `SPEC-STAGE1-1R-source-diff-review-before-commit.md`
* **Purpose:** Detailed read-only review of the 14 uncommitted source diffs (Stage 0 `api/*`
  + A0.5 `public/*`): per-file change/risk analysis, cross-file interactions, a risk matrix
  with a C4a/C4b/C4c/C5 commit-split recommendation, and a manual verification checklist.
  Surfaces the webhook best-effort-vs-DB idempotency gap (no UNIQUE on
  `credit_ledger.stripe_payment_id`) and the `payment_failed` `notifications.type` CHECK bug.
* **Status:** Drafted / awaiting GPT and user review.
* **Risk level:** High planning relevance, low execution (read-only + docs-only).
* **Next action:** GPT/user review, then approve the selected source commit/review slice
  (preferred: STAGE1-1C4A — commit low-risk API CORS changes). No source commit authorized yet.

### `SPEC-STAGE1-LOCAL-ACCEPTANCE.md`
* **Purpose:** Records Stage 1 **local** completion — source committed in clean slices
  (C4a/C4b/C4c/C5), **env validation fully wired for all 8 vars** (LOCAL-CORRECTION-1) +
  `.env.example`, migration 002 (not applied), and a 36-test `npm test` baseline — plus
  the remaining external gates.
* **Status:** Stage 1 complete locally (env validation wired + tested); blocked externally on live gates.
* **Risk level:** High execution (local only); no production actions.
* **Next action:** External gate review (apply migration, manual LS verify, deploy).

### `SPEC-STAGE2-LOCAL-ACCEPTANCE.md`
* **Purpose:** Records the Stage 2 **static** child-tutor UX work on `public/app.html` —
  a11y live region + labels, hint-first copy, session-expired state, no-payment-in-child
  invariant, 9 smoke tests — plus deferred items (streaming, KaTeX, moderation, token
  storage, React/Vite).
* **Status:** Stage 2 partially complete locally; deeper items deferred/gated.
* **Risk level:** Medium (frontend edits); no production actions.
* **Next action:** External gate review; later Stage 2 slices (moderation, math, migration).

### `SPEC-PROJECT-BRIEF-drift-reconciliation.md`
* **Purpose:** Read-only reconciliation of the untracked `PROJECT_BRIEF.md` vs current specs;
  records drift (`credit_transactions`/`knowledge_*`/Stripe naming) and recommends archiving it.
* **Status:** Drafted / awaiting review. **Risk:** Low. **Next:** owner picks disposition (`DOCS-BRIEF-1`).

### `SPEC-SECURITY-RLS-SECDEF-hardening-backlog.md`
* **Purpose:** Actionable security backlog (RLS wrap/`TO authenticated`, SECDEF `search_path`,
  child isolation tests, idempotency, token storage, service-role/CI) with approval + future prompts.
* **Status:** Drafted / awaiting review. **Risk:** High relevance, plan-only. **Next:** STAGE1-9/10, STAGE1-H.

### `SPEC-child-token-storage-httpOnly-migration-plan.md`
* **Purpose:** Plan to move the child JWT from localStorage → httpOnly cookie (CSRF, dual-read rollout, tests).
* **Status:** Drafted / awaiting review. **Risk:** High (hard gate), plan-only. **Next:** `STAGE2-TOKEN-1`.

### `SPEC-STAGE2-deferred-work-closure-plan.md`
* **Purpose:** Roadmap for deferred Stage 2 work (moderation, KaTeX, RTL/a11y QA, React/Vite decision, streaming…).
* **Status:** Drafted / awaiting review. **Risk:** Medium planning. **Next:** post-PROD-GATE-1 Stage 2 slices.

### `SPEC-PRODUCT-learning-companion-strategy.md`
* **Purpose:** Repositions Zeluu from a math-only tutor to a **child-safe bilingual AI learning
  companion for school subjects, math-first** — positioning, target users, parent/student value,
  subjects roadmap, bilingual/GCC opportunity, safety/trust positioning, risks, validation questions.
* **Status:** Drafted / awaiting GPT + owner review (2026-06-15, RESEARCH-STRATEGY-1).
* **Risk level:** Low (docs-only; positioning).
* **Next action:** Owner/GPT review; positioning then governs homepage/store/copy + subject rollout.

### `SPEC-PRICING-packages-credits-cost-model.md`
* **Purpose:** Recommended pricing packages (Free Trial / Family / Family Premium / optional Student
  Plus + School Pilot), credit system, per-action metering, and unit-economics (AI cost / MoR fee /
  gross-margin) model. Parent-facing copy = "fair daily learning usage"; credits stay an internal lever.
* **Status:** Drafted / awaiting GPT + owner review (2026-06-15).
* **Risk level:** Low (docs-only); **High relevance** — implementing credit/payment/LS logic is a hard gate.
* **Next action:** Owner/GPT review; verify LS MoR fees + competitor prices; gated implementation slice.

### `SPEC-ROADMAP-product-revamp-implementation.md`
* **Purpose:** Prioritized revamp roadmap (Quick wins → MVP → Strategic → Differentiating), adapted to
  the all-subject companion positioning; KaTeX, streaming, try-before-signup, age-banded tone, step-reveal,
  parent digest/alerts, Safety page, COPPA/VPC, Arabic/RTL, multi-subject, mastery/practice/mistakes,
  curriculum/exam mode, React island-first, voice/whiteboard/graphing, teacher mode.
* **Status:** Drafted / awaiting GPT + owner review (2026-06-15).
* **Risk level:** Low (docs-only); items carry their own risk + gates.
* **Next action:** Owner/GPT review; execute the recommended next sprint via the task backlog.

### `SPEC-SLICE-trial-enforcement.md`
* **Purpose:** Design/slice spec for enforcing the free trial as both time- and credit-limited
  (7 days / 50 total / 10 per-day / 15 min per-day) on top of the existing `credit_limit_*` columns +
  `get_child_limits_summary`, plus per-action credit metering. Migration DDL authored, **not applied**.
* **Status:** Drafted 2026-06-15 (design-only).
* **Risk level:** Low to write; **High to implement** (credit/payment logic + migration = hard gate).
* **Next action:** Owner review; implementation only via a separate approved + reviewed slice.

### `SPEC-SLICE-pricing-credits-impl.md`
* **Purpose:** Implementation design (T-12) mapping the pricing model to gate-aware build slices:
  product-wide per-action credit metering (replacing the message-count modulo), plan/package definitions
  as config, Lemon Squeezy variant mapping for subscriptions + extra packs incl. **PPP currency**
  (SAR/AED/EGP), and an ordered current→per-action migration path with rollback. Companion to (and the
  per-action-metering home for) `SPEC-SLICE-trial-enforcement`.
* **Status:** Drafted 2026-06-17 (design-only). **No code.**
* **Risk level:** Low to write; **High to implement** (credit/payment/webhook/LS logic + migration = hard gate).
* **Next action:** Owner/GPT review; verify live LS variant IDs + MoR fees; then gated step-1 (shadow-mode config).

### `SPEC-SLICE-weekly-digest.md`
* **Purpose:** Design (T-04) for a weekly per-parent digest of each child's learning + safety-flag
  counts, delivered in-app and (phase 2) by email on a `pg_cron` job. Surfaces the blocking decision —
  **no email-sending infra exists yet** — and recommends phasing (in-app first, email once a provider is
  chosen). Aggregates only: time-on-task, subjects/topics, flag counts; **no child message content / no
  PII** (CLAUDE.md). Grounded in the live `notifications` pipeline + `sessions`/`messages` schema + the
  existing pg_cron job.
* **Status:** Drafted 2026-06-17 (design-only). **No code.**
* **Risk level:** Low to write; **High to implement** (email provider + secret + pg_cron + migration = hard gates).
* **Next action:** Owner picks the email channel; then a gated phase-1 (read-only aggregation + in-app digest).

### `SPEC-SLICE-safety-alerts.md`
* **Purpose:** Design (T-10) for **instant, dual-channel** parent safety alerts (distress / personal-info /
  stuck), building on the live detection + in-app `notifications` and adding a reliable second channel
  (email/push) for high-severity distress. Severity model (distress=High dual-channel, PII=Medium,
  stuck=Low in-app), in-app stays the durable record, second-channel dispatch is best-effort/non-blocking
  to the chat turn, and **no child content/PII** in any payload. Shares the email-channel decision with
  the weekly-digest slice.
* **Status:** Drafted 2026-06-17 (design-only). **No code.**
* **Risk level:** Low to write; **High to implement** (child-safety path + email/push provider + secret +
  migration = hard gates).
* **Next action:** Owner picks the channel; then a phase-1 non-blocking `dispatchAlert()` seam (in-app only).

### `SPEC-SLICE-try-before-signup.md`
* **Purpose:** Design (T-06) for a **one-question, pre-signup** tutoring teaser that stores **no child PII
  before consent** (COPPA). Proposes an isolated anonymous `POST /api/try` endpoint — separate from the
  authed `api/chat.js` so its auth invariants stay untouched — that runs one method-only guided turn,
  IP/daily rate-capped, persisting nothing child-identifying, then converts to the parent-account/consent
  step (A0.5). Grounded in the COPPA/VPC research + A0.5 onboarding.
* **Status:** Drafted 2026-06-17 (design-only). **No code.** Needs **legal** sign-off on the PII boundary.
* **Risk level:** Low to write; **High to implement** (unauthenticated AI entry + COPPA/PII boundary + abuse
  surface = hard gates; legal prerequisite).
* **Next action:** Legal sign-off on no-PII-pre-consent + landing copy; then a gated phase-1 (static landing
  UI with the teaser endpoint disabled).

> **Research & tasks:** competitive/product research is saved under `docs/research/`
> (`RESEARCH-competitive-product-strategy-2026-06-15.md`, `RESEARCH-coppa-vpc-options.md`);
> the MVP build plan is `docs/plans/PLAN-MVP-foundation.md`; the executable, gate-aware backlog
> (T-01…T-24) is under `docs/tasks/` (`TASKS-product-strategy-roadmap.md`).

> **Runbooks & checklists:** see `docs/runbooks/` (production gate, migration 002, Lemon Squeezy)
> and `docs/checklists/` (production env & deploy). Read-only preflight SQL:
> `supabase/sql/preflight_002_webhook_idempotency.sql`.
