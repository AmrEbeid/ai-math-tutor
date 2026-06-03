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
