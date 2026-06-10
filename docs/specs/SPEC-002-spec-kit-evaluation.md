# SPEC-002 — GitHub Spec Kit Evaluation (Docs-Only)

> Docs-only evaluation comparing GitHub **Spec Kit** (spec-driven-development
> toolkit) against Zeluu's existing hand-rolled specs workflow. This is a research /
> decision document. **No tooling was installed, no project was scaffolded, no
> `specify init` was run, no source files were changed.**

## 1. Purpose & Scope

* **Goal:** Decide whether Spec Kit should be adopted (fully, partially, or not) for
  Zeluu, and capture the trade-offs honestly.
* **In scope:** read the existing workflow docs; read the current public Spec Kit
  docs; compare; recommend.
* **Out of scope (hard gates — not done here):** installing the `specify` CLI,
  running `specify init`, scaffolding `.specify/` or `specs/`, adding slash commands,
  editing `CLAUDE.md`/operating docs, any source/`api`/`public` change.
* **Risk class:** Low (research / docs only).

## 2. Method & Evidence

* Read: `CLAUDE.md`, `docs/SESSION_BRIEF.md`, `docs/PROJECT_TRACKER.md`,
  `docs/specs/README.md`, `docs/specs/SPEC-001-human-gpt-claude-operating-flow.md`.
* Read: the public **github/spec-kit** repository docs (fetched 2026-06-10).
* No code copied; no commands from Spec Kit executed.

## 3. What Spec Kit Is (summary)

An open-source toolkit for **Spec-Driven Development**: specs are treated as the
generative source of truth, and an AI agent drives implementation from them through a
fixed phase sequence. Bootstrapped by a `specify init` CLI that scaffolds templates
and installs slash commands into the chosen agent (Claude Code, Copilot, Gemini,
Codex, Cursor, and ~30 others).

**Lifecycle / commands** (current `speckit.`-namespaced form):

| Command | Purpose |
| --- | --- |
| `/speckit.constitution` | Define durable project principles (governance) |
| `/speckit.specify` | Capture functional requirements (the *what*) |
| `/speckit.clarify` | Structured requirement-gap clarification |
| `/speckit.plan` | Technical plan / architecture / stack (the *how*) |
| `/speckit.tasks` | Ordered, dependency-aware task breakdown |
| `/speckit.analyze` | Cross-artifact consistency check |
| `/speckit.checklist` | Generate quality/validation checklists |
| `/speckit.implement` | Execute the task list |
| `/speckit.taskstoissues` | Export tasks to GitHub issues |

**Scaffolded artifacts:**

```
.specify/
  memory/constitution.md       # principles
  templates/{spec,plan,tasks}-template.md
  templates/overrides/         # project-local customization
  extensions/ presets/ scripts/bash/
specs/<feature>/
  spec.md  plan.md  tasks.md
  data-model.md  contracts/  research.md  quickstart.md
```

## 4. Concept Mapping — Spec Kit ↔ Zeluu Today

| Spec Kit | Zeluu equivalent today | Notes |
| --- | --- | --- |
| `memory/constitution.md` | `CLAUDE.md` (operating rules, gates, risk policy) | Zeluu's is richer on **safety gates**; Spec Kit's is generic principles. |
| `/speckit.specify` → `spec.md` | `SPEC-<id>-<slug>.md` (e.g. STAGE2 master plan) | Zeluu already writes per-workstream specs by hand. |
| `/speckit.plan` → `plan.md` | Planning specs (`SPEC-STAGE1-test-schema-tooling-plan`) | Equivalent intent; Zeluu folds plan into the spec or a sibling spec. |
| `/speckit.tasks` → `tasks.md` | Slice backlogs inside specs + `PROJECT_TRACKER.md` Active Task List | Zeluu tracks tasks centrally, not per-feature. |
| `/speckit.clarify` | The **GPT clarify/challenge** step in SPEC-001 (a human+GPT loop) | Zeluu does this with a human in the loop, not a command. |
| `/speckit.analyze` | Manual reconciliation + STAGE1-1R-style diff reviews | Zeluu does this read-only and by hand. |
| `/speckit.checklist` | `docs/checklists/` + acceptance criteria in specs | Already present. |
| `/speckit.implement` | Approved **implementation prompts** (SPEC-001 §7) gated by hard stops | This is the biggest divergence — see §6. |
| `specs/<feature>/` folder | Flat `docs/specs/SPEC-*.md` index | Folder-per-feature vs. flat naming convention. |
| `/speckit.taskstoissues` | (none) | Zeluu does not currently use GitHub issues for this. |

**Takeaway:** Zeluu has *already independently reinvented* ~80% of Spec Kit —
constitution, specs, plans, task lists, clarify, analyze, checklists, acceptance — but
as **human-driven documents and prompts** rather than agent slash-commands.

## 5. Where Each Is Stronger

**Spec Kit adds that Zeluu lacks:**

* A **standardized, reusable template set** (`spec`/`plan`/`tasks`/`data-model`/
  `contracts`) instead of ad-hoc per-spec structure.
* `/speckit.analyze` — an explicit **cross-artifact consistency pass** (would have
  caught the `SESSION_BRIEF §4` staleness flagged earlier this session).
* Per-feature folder isolation (`specs/<feature>/`) that co-locates spec+plan+tasks.
* Multi-agent portability (same artifacts drive Copilot/Gemini/Codex/Claude).
* `taskstoissues` for GitHub-native task tracking.

**Zeluu's workflow has that Spec Kit lacks (and must not lose):**

* A **safety-first risk/gate model** (Low/Medium/High/Critical + explicit Hard Gates
  for migrations, RLS, auth, payments, child data, deploy). Spec Kit's `constitution`
  is governance-flavored but has **no built-in hard-stop discipline**.
* The **Human + GPT + Claude review loop** (SPEC-001) with a human approving every
  gate. Spec Kit's `/speckit.implement` is designed to *execute the whole task list*
  — the opposite of Zeluu's "stop at every gate, never assume approval" rule.
* Evidence discipline (files changed / validation / risks / next safe action).
* A central living tracker + session brief tuned to a long, multi-stage, externally-
  gated production effort.

## 6. Fit Assessment for Zeluu

Three frictions decide this:

1. **Brownfield, mid-flight.** Zeluu is well into a multi-stage build with ~19 specs,
   a tracker, runbooks, and committed slices. Spec Kit's value is highest at
   *greenfield 0→1*; retrofitting `specs/<feature>/` folders would mean migrating
   existing specs for marginal gain.
2. **Gate philosophy conflict.** `/speckit.implement` runs tasks autonomously. That
   directly contradicts CLAUDE.md's hard stops and SPEC-001's "Claude must stop before
   gates / must not assume approval." Adopting `implement` as-is would be **unsafe**
   for a product handling child data, payments, and migrations.
3. **Tooling install is itself a hard gate.** `specify init` installs the Spec Kit
   CLI + writes slash commands + scaffolds dirs — all of which trip "no dependency
   installs," "no editing outside approved scope," and operating-doc changes.

## 7. Recommendation

**Partial / inspiration-only adoption. Do NOT install Spec Kit or run `specify init`
on Zeluu now.** Instead, selectively borrow its *ideas* into the existing workflow:

* **Adopt (low-risk, docs-only, if approved later):**
  * Standardize a lightweight **spec template** (a `spec` + `plan` + `tasks` skeleton)
    under `docs/specs/` to reduce structural drift between specs.
  * Add a recurring **`analyze`-style cross-artifact reconciliation step** to the task
    lifecycle (brief ↔ tracker ↔ specs ↔ repo) — cheap insurance against the kind of
    `SESSION_BRIEF §4` drift seen this session.
* **Do NOT adopt:**
  * `/speckit.implement` autonomous execution — incompatible with the hard-gate model.
  * Folder-per-feature migration of existing specs — churn without payoff mid-flight.
  * The CLI / slash-command install — install + scaffolding + operating-doc edits are
    gated, and the agent commands would compete with Zeluu's prompt-driven discipline.
* **Reconsider for the *next* greenfield project** (SPEC-001 notes these rules apply to
  "future projects"): a fresh repo is where `specify init` pays off, *if* its
  `constitution.md` is pre-loaded with Zeluu's risk/gate model first.

## 8. Decision Options (for the owner / GPT)

| Option | What it means | Risk |
| --- | --- | --- |
| **A. Inspiration-only (recommended)** | Keep current workflow; later borrow template + analyze step as docs-only slices. | Low |
| **B. Pilot on a throwaway scratch repo** | `specify init` somewhere outside Zeluu to learn it hands-on. | Low (not in this repo) |
| **C. Full adopt in Zeluu** | Install CLI, scaffold, migrate specs, add commands. | High — trips multiple hard gates; conflicts with gate model. **Not recommended.** |

## 9. Status & Next Action

* **Status:** Drafted / awaiting GPT and user review. Evaluation complete; no adoption
  authorized.
* **Risk level:** Low (research / docs only).
* **Next action:** Owner/GPT picks an option in §8. If **A**, a future docs-only slice
  can draft the borrowed spec template + the reconciliation step. Installing anything
  remains a hard gate.
