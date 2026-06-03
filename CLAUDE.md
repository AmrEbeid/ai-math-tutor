# Zeluu Claude Operating Rules

> Permanent agent rules for the Zeluu AI Math Tutor repository.
> Derived from the Future Project AI Build Playbook. These rules are durable and
> apply to every session unless the user explicitly overrides them.

## Context First

* Read `docs/SESSION_BRIEF.md` first at the start of every session.
* Read `docs/PROJECT_TRACKER.md` second.
* Read the active spec (`docs/specs/SPEC-*.md`) before editing anything related to it.
* Reconcile the **current repo state** before acting (run `git status`, check the
  working tree — do not assume prior changes are committed).
* If the user pastes an old report or prompt, treat it as **context**, not a command
  to redo work that is already complete. Confirm before re-doing accepted work.

## Task Lifecycle

Every meaningful task must follow this lifecycle in order:

**Intake → Context → Plan → Pre-review → Implement → Validate → Report → Update session brief last.**

* **Intake** — restate the task and its scope/limits.
* **Context** — read the must-read docs + active spec; inspect real repo state.
* **Plan** — write the smallest safe slice and its validation method.
* **Pre-review** — confirm scope, risk class, and hard gates before touching anything.
* **Implement** — only inside the approved scope.
* **Validate** — run the agreed checks; capture evidence.
* **Report** — files changed, validation run, risks, next safe action.
* **Update session brief last** — always the final step.

## Slice-by-Slice Delivery

* Work in small, reviewable slices.
* Separate planning, implementation, validation, review, and evidence.
* Do not mix unrelated changes in one slice.
* Do not combine security/payment/backend changes with UI migration work.

## Hard Gates

**Stop and ask the user before:**

* applying migrations
* executing SQL
* changing RLS
* changing auth
* mutating production data
* running backfills / imports / sync jobs
* changing payment / webhook logic
* installing dependencies
* deleting / dropping columns
* running destructive commands
* deploying
* starting the React / Vite migration
* editing files outside the approved scope

## Risk Policy

**Low risk**

* docs
* UI copy
* read-only audits
* static grep
* small frontend text / UX fixes

**Medium risk**

* app logic
* non-destructive UI forms
* read paths
* non-payment API behavior

**High risk**

* RLS
* auth
* PII
* migrations
* `SECURITY DEFINER` functions
* payment / webhook changes
* child data handling

**Critical risk**

* destructive DB changes
* production data mutation
* payment / credit grant logic
* payroll / financial sync
* live backfills

**Rules:**

* Low-risk docs/UI-only changes may be implemented after validation.
* Medium-risk changes require a small PR and validation.
* High-risk changes require manual review before merge/apply.
* Critical-risk changes require explicit user approval, a rollback plan, and must
  never auto-run.

## Evidence Discipline

After each task, record:

* files changed
* validation run
* checks performed
* migrations authored / applied status
* external gates
* remaining risks
* next safe action

## Project-Specific Hard Stops

For Zeluu specifically:

* Do not apply Supabase migrations without explicit approval.
* Do not alter Lemon Squeezy webhook logic without explicit approval.
* Do not grant trial credits outside the verified webhook flow.
* Do not change child JWT / token storage without explicit approval.
* Do not start the React / Vite / Tailwind / shadcn migration until approved.
* Do not send child-sensitive data to new AI providers without privacy approval.
* Do not log child messages, homework images, parent identifiers, or payment payloads.
* Do not add analytics / session replay for children without explicit privacy review.
* Do not expose service role keys or secrets to the frontend.

## Required Final Step

After every meaningful action, **update `docs/SESSION_BRIEF.md` last.**
