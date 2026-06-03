# SPEC-STAGE1-1 — Working-Tree Cleanup and Commit Plan

> Read-only source-diff audit + a docs-only commit/cleanup **plan** to make the repo safe
> for Stage 1 implementation. **Nothing was committed, staged, reset, reverted, or
> stashed; no source files were edited; no tests/build/SQL/migrations/deploy.** Every
> command in §11 is an example for the user to run later **after approval** — none were
> executed except read-only inspection.

**Status:** Drafted / awaiting GPT and user review. **No cleanup or commit authorized yet.**
**Date:** 2026-06-03
**Risk class:** Medium planning relevance, low execution (read-only + docs-only).

## 1. Purpose

The repo carries pre-existing uncommitted source changes (Stage 0 backend/security/payment
+ A0.5 trial-onboarding frontend) **and** a fully untracked `docs/` operating-system tree.
This spec inventories every uncommitted change with evidence from the actual diffs,
classifies it by workstream and risk, and proposes a safe, explicit, reviewable
commit/cleanup order — so Stage 1 implementation later starts from a clean, intentional
baseline rather than entangling unrelated diffs. It **plans** the cleanup; it does not
perform it.

## 2. Scope

Read-only `git diff` audit of the 14 modified tracked source files + an inventory of the
untracked `docs/` tree and `CLAUDE.md`/`PROJECT_BRIEF.md`, plus a docs-only plan output.
Inspection commands only (`git status/diff/log/find`); no mutating git operations.

## 3. Non-Goals

This task did **not**: commit · stage source files · reset/revert/stash · discard changes ·
edit source files (`api/*`/`public/*`/`lib/*`/`scripts/*`/`supabase/migrations/*`) · edit
root `README.md`/`package*.json`/`vercel.json`/env files · create `.env.example` · run
tests/build · install packages · run SQL · connect to Supabase · apply migrations · deploy
· start React/Vite · start Stage 1 or Stage 2 implementation · copy public-repo code.

## 4. Git / Working-Tree Baseline (evidence)

* **Branch:** `main`.
* **Staged:** none (`git diff --cached` empty).
* **Modified tracked (14, unstaged), `M` only — no deletes/renames:** 10 × `api/*`
  (`auth/child-login.js`, `auth/profile.js`, `chat.js`, `children.js`, `credits/balance.js`,
  `credits/checkout.js`, `exams.js`, `sessions/create.js`, `sessions/history.js`,
  `webhooks/lemonsqueezy.js`) + 4 × `public/*` (`dashboard.html`, `index.html`,
  `login.html`, `pricing.html`). **Matches all prior reports exactly.**
* **Untracked:** `CLAUDE.md`, `PROJECT_BRIEF.md`, and the whole `docs/` tree (13 files).
  `git status` collapses the tree to `?? docs/` because it is entirely untracked.
* **`git diff --stat`:** 14 files, +157 / −85. Largest: `webhooks/lemonsqueezy.js` (79),
  `chat.js` (43), `dashboard.html` (36), `children.js` (27), `login.html` (27),
  `pricing.html` (14); the remaining 8 are ~2 lines each.
* **Recent commits (`git log --oneline -5`):** `f5e6028` mobile-layout fix · `25f9122`
  service-worker cache + session race · `0fbb744` SW stale cache · `31e5291` child-app
  send/history/mobile · `9b8adfd` subscription-lifecycle enforcement. → confirms the
  uncommitted work is a continuation of Stage 0/A0.5, not unrelated.
* **Unexpected files:** none beyond the documented set. **Working tree is safe to
  inspect** (no in-progress merge/rebase; no staged content).

## 5. Source Change Inventory (read-only; one row per file)

> Every diff was read; all look **intentional** and **match the Stage 0 / A0.5 history**.
> Risk is the review risk of committing it (it is already running in the tree).

| File | Change summary | Workstream | Risk | Area | Matches reports / intentional | Manual verify? | Action | Commit group |
|------|----------------|-----------|------|------|------|------|--------|--------------|
| `api/auth/child-login.js` | CORS `'*'`→`process.env.ALLOWED_ORIGIN \|\| '*'` | Stage 0 | Low/Med | CORS/env | yes / yes | no (config) | Commit after review | **C4 Stage 0** |
| `api/auth/profile.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env | yes / yes | no | Commit after review | C4 |
| `api/credits/balance.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env | yes / yes | no | Commit after review | C4 |
| `api/credits/checkout.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env (payment-adjacent) | yes / yes | no | Commit after review | C4 |
| `api/exams.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env | yes / yes | no | Commit after review | C4 |
| `api/sessions/create.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env | yes / yes | no | Commit after review | C4 |
| `api/sessions/history.js` | same CORS one-liner | Stage 0 | Low/Med | CORS/env | yes / yes | no | Commit after review | C4 |
| `api/chat.js` | CORS one-liner **+** save messages *before* credit-count modulo (credit-deduction correctness) **+** low-credit notification 24h dedup | Stage 0 | **High** | credits + chat + CORS | yes / yes | **yes** (credit deduction once; no over/under-charge) | Review then commit | C4 |
| `api/children.js` | CORS one-liner **+** replace inline base64 token check (**no signature verify**) with HMAC `verifyChildToken` from `lib/child-auth.js` **+** `createClient(NEXT_PUBLIC_SUPABASE_URL…, SERVICE_ROLE)`→`createServerClient()` | Stage 0 | **High** | child auth/token + service-role/env | yes / yes | **yes** (child-limits auth path) | Review then commit | C4 |
| `api/webhooks/lemonsqueezy.js` | per-event **idempotency checks** (order/sub/renewal keyed on `credit_ledger.stripe_payment_id`) **+** reduced payload logging (drops `customData`/`userId` logs) **+** `message`→`body` notification field fix **+** 24h windows / `['active','trialing']` | Stage 0 | **High** | payments/webhook/credit | yes / yes | **yes** (LS replay → grant exactly once; field names) | Review + manual LS verify then commit | C4 |
| `public/index.html` | hero copy: "7-day, no card"→"14-day, 10 credits, card required, no charge today" | A0.5 | Low | frontend onboarding copy | yes / yes | light (copy) | Commit after review | **C5 A0.5** |
| `public/pricing.html` | meta + trial-tag + 4 plan notes + FAQ → card-required/no-charge-today messaging | A0.5 | Low | frontend onboarding copy | yes / yes | light (copy) | Commit after review | C5 |
| `public/login.html` | `pendingPlan` localStorage fallback (persist + read + clear) **+** checkout-failure error UX **+** subtitle copy ("enter card… not charged for 14 days") | A0.5 | Low/Med | frontend onboarding flow | yes / yes | **yes** (plan survives OTP; checkout redirect/error) | Review then commit | C5 |
| `public/dashboard.html` | "Activating your trial…" overlay + post-checkout pending state (don't bounce paid users) **+** webhook-wait retries 5→8 | A0.5 | Low/Med | dashboard onboarding UX | yes / yes | **yes** (payment=success activation flow) | Review then commit | C5 |

**Reconciliation note (idempotency):** `webhooks/lemonsqueezy.js` already performs
**code-level** best-effort idempotency (lookup of `ls_order_<id>` / `ls_sub_<id>` /
`ls_payment_<id>` in `credit_ledger.stripe_payment_id` before granting). This **partially
mitigates** but does **not close** the double-grant risk recorded in STAGE1-B/FINAL: there
is still **no DB UNIQUE constraint / `processed_webhooks` table**, so concurrent re-delivery
can race between the SELECT and the INSERT. The STAGE1 "no idempotency table" finding
remains accurate; the future STAGE1-7/8 design/migration is still required. No code change
here.

**Unexpected source files:** none. All 14 are accounted for above.

## 6. Docs / Operating-System Inventory

All untracked (under `docs/` + root `CLAUDE.md`). `PROJECT_BRIEF.md` is also untracked but
is **legacy**, not part of the operating-docs work (see classification).

| File | Classification | Commit group |
|------|----------------|--------------|
| `CLAUDE.md` | Operating rule (agent rules) | **C1 operating docs** |
| `docs/PROJECT_TRACKER.md` | Tracker/session | C1 |
| `docs/SESSION_BRIEF.md` | Tracker/session | C1 |
| `docs/specs/README.md` | Specs index | C1 |
| `docs/specs/SPEC-000-project-overview.md` | Project overview | C1 |
| `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` | Operating rule (workflow) | C1 |
| `docs/specs/SPEC-A0.5-trial-signup-onboarding-flow.md` | Completed-work spec | C2 research/readiness |
| `docs/specs/SPEC-A0.6-public-repo-benchmark.md` | Research spec | C2 |
| `docs/specs/SPEC-STAGE1-test-schema-tooling-plan.md` | Stage 1 planning spec | C2 |
| `docs/specs/SPEC-STAGE1-A-read-only-tooling-baseline-audit.md` | Stage 1 audit spec | C2 |
| `docs/specs/SPEC-STAGE1-B-schema-rls-api-inventory.md` | Stage 1 audit spec | C2 |
| `docs/specs/SPEC-STAGE1-C-env-secret-validation-plan.md` | Stage 1 readiness spec | C2 |
| `docs/specs/SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md` | Stage 1 readiness spec | C2 |
| `docs/specs/SPEC-STAGE2-child-chat-ux-master-plan.md` | Stage 2 plan | **C3 Stage 2 plan** |
| `docs/specs/SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md` | Cleanup plan (this file) | C2 |
| `PROJECT_BRIEF.md` (root, untracked) | **Legacy / needs review** (known schema drift: `credit_transactions`/`knowledge_*` vs real schema — STAGE1-A/B) | **Hold** — do not commit until reconciled |

**Tracked status:** docs are invisible to a plain `git diff` (untracked) — use `git add -N`
to render their diff, then `git reset` (see §11). Recommendation: commit docs as a small
number of **logical waves** (C1–C3), not one giant blob and not file-by-file.

## 7. Workstream Classification

| Workstream | Files | Status | Risk | Evidence | Recommended Action |
|-----------|-------|--------|------|----------|--------------------|
| **A0.OS / A0.OS-GPT docs** | `CLAUDE.md`, `docs/PROJECT_TRACKER.md`, `docs/SESSION_BRIEF.md`, `docs/specs/README.md`, `SPEC-000`, `SPEC-001` | Untracked | Low | Operating rules + tracker/overview/workflow | Commit first (C1) |
| **A0.6 research + Stage 1 planning/audit/readiness docs** | `SPEC-A0.5`, `SPEC-A0.6`, `SPEC-STAGE1`, `STAGE1-A`, `STAGE1-B`, `STAGE1-C`, `STAGE1-FINAL`, `STAGE1-1` | Untracked | Low | Research + audit + readiness specs (docs-only) | Commit second (C2) |
| **Stage 2 planning docs** | `SPEC-STAGE2-child-chat-ux-master-plan.md` | Untracked | Low | Stage 2 master plan (no impl) | Commit third (C3) |
| **Stage 0 backend/security/payment source** | 10 × `api/*` | Modified, uncommitted | **High** (incl. payment/webhook/credit/auth) | §5 diffs: CORS hardening, credit-count fix, child-token HMAC verify, webhook idempotency | Review + (webhook) manual LS verify → commit (C4) |
| **A0.5 frontend trial/onboarding source** | 4 × `public/*` | Modified, uncommitted | Low/Med | §5 diffs: trial copy + pendingPlan persistence + activation UX | Review/manual flow verify → commit (C5) |
| **Unknown / needs review** | `PROJECT_BRIEF.md` (legacy, drift) | Untracked | Low (docs) but drift-bearing | STAGE1-A/B drift findings | **Hold**; reconcile separately before committing |

## 8. Commit Strategy Options

### Option A — Conservative / **Recommended**
Separate docs from source cleanly; commit docs first, then Stage 0 source (after review),
then A0.5 source (after review + manual verification), then begin Stage 1.
* **Pros:** clean docs/source separation; docs land immediately and safely; high-risk
  source is reviewed before commit; reviewable history.
* **Cons:** a few commits (3 docs + 2 source) rather than one.
* **Risk:** Low. **Use case:** the default for this repo. **Reviewability:** high.
  **Avoids mixing source+docs:** yes.

### Option B — More Granular
Split docs into waves (A0.OS → A0.6/Stage1 → Stage2), then Stage 0 source, then A0.5 source.
* **Pros:** most precise history; each wave independently revertible.
* **Cons:** more commits; slightly more ceremony.
* **Risk:** Low. **Use case:** if the team wants fine-grained doc history. **Reviewability:**
  highest. **Avoids mixing:** yes. *(This plan's C1–C5 already realizes Option B's doc waves
  as C1/C2/C3 — so Option A and B converge here; B = treat C1/C2 as separable.)*

### Option C — Minimal / Not Preferred
One commit for all docs, then later source commits.
* **Pros:** fastest for docs.
* **Cons:** a single docs commit mixes operating rules + research + Stage 1 + Stage 2 in
  one blob → harder to review/revert a single concern; still must keep source separate.
* **Risk:** Low-Med (reviewability). **Acceptable only if** the user explicitly wants speed
  over granularity; **not preferred** because it weakens reviewability for little gain.

**Recommendation: Option A** (with C1–C3 doc waves, i.e. it already incorporates Option B's
doc granularity). It keeps source and docs strictly separate, lands low-risk docs now, and
gates the High-risk Stage 0 source behind review + manual Lemon Squeezy verification.

## 9. Recommended Commit Plan (do NOT execute)

| # | Proposed message | Files included | Files excluded | Risk | Required review/verification before commit |
|---|------------------|----------------|----------------|------|--------------------------------------------|
| C1 | `docs: add AI project operating system and workflow specs` | `CLAUDE.md`, `docs/PROJECT_TRACKER.md`, `docs/SESSION_BRIEF.md`, `docs/specs/README.md`, `docs/specs/SPEC-000-project-overview.md`, `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md` | all source; all other docs; `PROJECT_BRIEF.md` | Low | docs contain no secrets; reflect accepted state; don't overclaim implementation |
| C2 | `docs: add A0.6 benchmark and Stage 1 readiness planning` | `docs/specs/SPEC-A0.5-…`, `SPEC-A0.6-…`, `SPEC-STAGE1-test-schema-tooling-plan.md`, `SPEC-STAGE1-A-…`, `SPEC-STAGE1-B-…`, `SPEC-STAGE1-C-…`, `SPEC-STAGE1-FINAL-…`, `SPEC-STAGE1-1-…` | all source; C1 docs; Stage 2; `PROJECT_BRIEF.md` | Low | no secrets; "no implementation started" still true; specs match accepted state |
| C3 | `docs: add Stage 2 child chat UX master plan` | `docs/specs/SPEC-STAGE2-child-chat-ux-master-plan.md` | all source; all other docs | Low | no secrets; plan only; no impl claimed |
| C4 | `fix: apply Stage 0 backend security and payment hardening` | the 10 `api/*` files (§5) | all `public/*`; all docs | **High** | §10 Stage 0 gates **all** satisfied incl. manual LS webhook verify |
| C5 | `fix: improve trial signup and onboarding UX` | the 4 `public/*` files (§5) | all `api/*`; all docs | Low/Med | §10 A0.5 gates satisfied incl. manual signup/checkout flow verify |

**Rules:** no source in docs commits; no docs in source commits; **do not combine C4 and C5
(Stage 0 + A0.5) into one commit** unless the user explicitly approves; nothing committed in
this task. `PROJECT_BRIEF.md` is **excluded from every commit** pending reconciliation.

## 10. Review Gates Before Source Commits

**Stage 0 (`api/*`, before C4):**
* Review CORS/env change (`ALLOWED_ORIGIN || '*'`) — confirm `ALLOWED_ORIGIN` is set in
  Vercel so the fallback `'*'` isn't relied on in prod.
* Review `children.js` child-token change — confirm the new HMAC `verifyChildToken` path is
  equivalent-or-stricter than the removed inline check (it adds signature verification).
* Review `children.js` service-role consolidation — confirm `createServerClient()` is
  server-only (no `NEXT_PUBLIC_*` leakage).
* Review `chat.js` credit logic — confirm message-save-before-count yields exactly-once
  deduction (no off-by-one over/under-charge) and the 24h low-credit dedup is correct.
* Review `webhooks/lemonsqueezy.js` payment/webhook/credit changes — idempotency lookups,
  `message`→`body` field fix, 24h windows; **verify HMAC raw-body signature path unchanged**.
* Verify **no secret exposure** (reduced logging is good; confirm no new secret/PII logs).
* Verify **no child-data leakage** (no child message content logged).
* **Manual runtime verification** of the Lemon Squeezy webhook (valid/replayed event →
  grant exactly once) — external gate, still pending.

**A0.5 (`public/*`, before C5):**
* Verify signup/login flow end-to-end.
* Verify `pendingPlan` persists through OTP/email verification (now sessionStorage **+**
  localStorage) and is cleared before checkout redirect.
* Verify card-required trial messaging is consistent; **no "no card required" contradiction
  remains** anywhere.
* Verify dashboard "Activating your trial…" waiting state + pending fallback (paid users not
  bounced to pricing).
* Verify Lemon Squeezy success URL (`/dashboard.html?payment=success`) and checkout/return
  behavior manually.

**Docs (before C1–C3):**
* No secrets in any doc.
* Docs do not overclaim implementation (Stage 1/Stage 2 **not started**).
* Docs reflect the accepted state; `PROJECT_BRIEF.md` held out (drift).

## 11. Exact Git Command Plan (examples only — run later, after approval)

> Read-only inspection commands below were run this task. **All staging/commit commands are
> examples for the user — not executed here.** No `git add .`; no wildcard staging; explicit
> file lists only.

**Inspect (read-only):**
```bash
git status --short
git diff --stat
git diff --name-status
```

**Review docs (untracked → use intent-to-add, then undo):**
```bash
git add -N CLAUDE.md docs/
git diff -- CLAUDE.md docs/
git reset            # clears intent-to-add; stages nothing
```

**C1 — operating docs only (example; do not run yet):**
```bash
git add CLAUDE.md docs/PROJECT_TRACKER.md docs/SESSION_BRIEF.md \
  docs/specs/README.md docs/specs/SPEC-000-project-overview.md \
  docs/specs/SPEC-001-human-gpt-claude-operating-flow.md
git diff --cached --name-only       # safety check BEFORE commit
git commit -m "docs: add AI project operating system and workflow specs"
```

**C2 — research + Stage 1 readiness docs (example):**
```bash
git add docs/specs/SPEC-A0.5-trial-signup-onboarding-flow.md \
  docs/specs/SPEC-A0.6-public-repo-benchmark.md \
  docs/specs/SPEC-STAGE1-test-schema-tooling-plan.md \
  docs/specs/SPEC-STAGE1-A-read-only-tooling-baseline-audit.md \
  docs/specs/SPEC-STAGE1-B-schema-rls-api-inventory.md \
  docs/specs/SPEC-STAGE1-C-env-secret-validation-plan.md \
  docs/specs/SPEC-STAGE1-FINAL-readiness-and-implementation-gates.md \
  docs/specs/SPEC-STAGE1-1-working-tree-cleanup-commit-plan.md
git diff --cached --name-only
git commit -m "docs: add A0.6 benchmark and Stage 1 readiness planning"
```

**C3 — Stage 2 plan (example):**
```bash
git add docs/specs/SPEC-STAGE2-child-chat-ux-master-plan.md
git diff --cached --name-only
git commit -m "docs: add Stage 2 child chat UX master plan"
```

**C4 — Stage 0 source only (example; ONLY after §10 Stage 0 gates):**
```bash
git add api/auth/child-login.js api/auth/profile.js api/chat.js api/children.js \
  api/credits/balance.js api/credits/checkout.js api/exams.js \
  api/sessions/create.js api/sessions/history.js api/webhooks/lemonsqueezy.js
git diff --cached --stat
git commit -m "fix: apply Stage 0 backend security and payment hardening"
```

**C5 — A0.5 frontend only (example; ONLY after §10 A0.5 gates):**
```bash
git add public/dashboard.html public/index.html public/login.html public/pricing.html
git diff --cached --stat
git commit -m "fix: improve trial signup and onboarding UX"
```

**Safety checks before each commit:**
```bash
git diff --cached --name-only
git diff --cached --stat
```

**Abort staging if wrong (does not touch working-tree content):**
```bash
git reset
```

## 12. Risks

* **Mixing docs and source** in one commit → unreviewable history. Mitigation: explicit file
  lists; C1–C3 docs separate from C4/C5 source.
* **Committing unreviewed payment/auth changes** (C4 is High-risk) → mitigation: §10 gates +
  manual LS verification before C4.
* **Losing uncommitted work** via `reset --hard`/`revert`/`stash`/`checkout` → **forbidden**
  here; only `git reset` (unstage, keeps content) appears in the plan.
* **Untracked docs invisible to plain `git diff`** → use `git add -N` then `git reset` to
  review.
* **Source predates docs and may be stale** → diffs were re-read this task and confirmed
  intentional/consistent with Stage 0/A0.5; still review before C4/C5.
* **No tests exist** → cannot auto-verify Stage 0/A0.5 before commit; rely on manual
  verification until the Stage 1 test harness exists (STAGE1-5/6).
* **Manual Lemon Squeezy verification still pending** (external gate) → blocks confident C4.
* **`PROJECT_BRIEF.md` drift** → committing it as-is would enshrine schema drift; hold.

## 13. Recommended Next Prompt

**Preferred:** `STAGE1-1A — Review and Commit Docs Only` — controlled; stages/commits **only
docs** (C1–C3) with explicit file lists, only if the user explicitly approves; leaves all
source untouched. Lowest risk, unblocks a clean tracked docs baseline.

**Alternative:** `STAGE1-1R — Source Diff Review Before Commit` — deeper review of the Stage 0
(`api/*`) and A0.5 (`public/*`) diffs (esp. webhook idempotency, child-token verify, credit
count) **without committing**, feeding the §10 gates and the pending manual LS verification.

## 13a. STAGE1-1R Source Diff Review Completed (2026-06-03)

The deeper source review (alternative next prompt in §13) is done — see
`SPEC-STAGE1-1R-source-diff-review-before-commit.md`. All 14 diffs were reviewed read-only.
**Commit-split recommendation:** split the original **C4** into **C4a** (7 backward-compatible
CORS one-liners — Low) / **C4b** (`chat.js` credit-count reorder + `children.js` signed-token
verify & service-role consolidation — High, verify) / **C4c** (`webhooks/lemonsqueezy.js`
idempotency/logging/`message`→`body` — High, manual LS replay verify); keep **C5** (A0.5
frontend) separate. New findings: webhook idempotency is **best-effort only** (no UNIQUE on
`credit_ledger.stripe_payment_id` → race remains; STAGE1-7/8 still needed), and the
`payment_failed` notification violates the `notifications.type` CHECK (silently caught — fix
in a future slice). **No source committed.** Recommended next prompt:
`STAGE1-1C4A — Commit Low-Risk API CORS Changes`.

## 14. Acceptance Criteria

Accepted when: all current changes are classified (source + docs); docs-vs-source separation
is explicit; the commit plan uses explicit file lists (no `git add .`); no source files were
changed; no files were staged or committed; tracker + specs index updated; session brief
updated last; the next prompt is clear.

## 15. Status

**Drafted / awaiting GPT and user review. No cleanup or commit authorized yet.**
