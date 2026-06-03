# SPEC-001 — Human + GPT + Claude Operating Flow

> Active operating-workflow spec. Documents the full way the product owner works with
> AI tools across planning, execution, review, and approval. This is a process
> document, not a code change.

## 1. Purpose

This spec documents Amr's full AI-assisted software workflow — how a product idea
travels from a human decision, through planning, into safe repo execution, and back
through review before the next step is approved.

* **GPT** is used for thinking, planning, strategy, challenge, review, and Claude
  prompt design.
* **Claude Code** is used for repo execution, research, docs, implementation,
  validation, and reporting.
* **Amr** remains the product owner and final decision maker at every gate.
* **Codex** and **Lovable** can be used as optional reviewer / apply layers.

## 2. Why This Exists

The original project playbook covered Claude / Codex / Lovable *execution* discipline,
but the real workflow includes **GPT before and after Claude** — GPT shapes the task and
writes the prompt, Claude executes, and GPT reviews the result and writes the next
prompt. Documenting the whole loop reduces:

* context loss
* unsafe implementation
* prompt drift
* stale roadmap execution
* overbuilding
* unreviewed risky changes
* Claude continuing from old plans
* unclear approval gates

## 3. Roles and Responsibilities

### Amr / Product Owner
Amr:
* defines product vision and business rules
* raises issues and priorities
* discusses decisions with GPT
* approves gates
* verifies external systems when needed
* decides whether to accept, reject, pause, or continue

### GPT / Planning Partner and Prompt Architect
GPT:
* clarifies ideas
* challenges assumptions
* classifies task risk
* decides whether the task is discussion, research, planning, docs, implementation,
  review, verification, or external apply
* writes safe Claude prompts
* defines allowed files and forbidden files
* defines hard stops
* reviews Claude reports
* detects missing risks or scope drift
* writes correction prompts
* recommends the next gate

GPT does **not** execute repo changes.

### Claude Code / Repo Executor
Claude:
* reads project docs first
* inspects repo state
* follows the approved prompt
* edits only approved files
* runs allowed checks
* reports evidence and diffs
* updates docs / tracker / session when instructed
* stops at gates
* does **not** assume approval to continue

### Codex / Independent Reviewer
Codex may:
* review Claude's diff
* check security / auth / RLS / payment risks
* validate whether the report matches actual changes
* identify missing tests or race conditions

Codex should **not** apply migrations or mutate data unless explicitly approved.

### Lovable / Managed Platform
Lovable may:
* apply migrations or platform actions when explicitly approved
* report evidence
* avoid unrelated applies, data mutation, syncs, or backfills

## 4. End-to-End Workflow

1. Amr raises idea / problem.
2. Amr discusses with GPT.
3. GPT clarifies goal and risk.
4. GPT decides task type.
5. GPT writes a controlled Claude prompt.
6. Amr pastes prompt into Claude.
7. Claude reads docs and repo state.
8. Claude executes only approved scope.
9. Claude reports diff / evidence / risks.
10. Amr pastes Claude report into GPT.
11. GPT reviews output.
12. GPT recommends accept, correction, verification, review, or next prompt.
13. Amr approves next gate.
14. Claude continues only with the next approved prompt.
15. Docs / tracker / session are updated.
16. Session brief is updated **last**.

## 5. GPT Planning Process

GPT should:
* separate the product decision from implementation
* challenge assumptions
* identify constraints
* avoid overbuilding
* determine stage placement
* preserve business rules
* define risk level
* decide if Claude should inspect first or implement
* produce a precise prompt

## 6. GPT → Claude Prompt Structure

GPT-written Claude prompts should usually include:
* task ID and title
* task type
* business context
* objective
* approved scope
* allowed files
* forbidden files
* hard stops
* implementation steps
* validation steps
* final report format
* stop point
* whether docs / tracker / session should be updated
* whether GPT review is required afterward

## 7. Prompt Types

1. **Discussion prompt** — GPT only.
2. **Audit prompt** — Claude inspects, no edits.
3. **Research prompt** — Claude researches, may update docs if approved.
4. **Planning prompt** — Claude creates plan / spec, no implementation.
5. **Docs prompt** — Claude creates / updates docs only.
6. **Implementation prompt** — Claude edits approved files only.
7. **Review prompt** — Claude / Codex reviews, no edits on first pass.
8. **Runtime verification prompt** — checklist / testing plan.
9. **External apply prompt** — Lovable / platform action.
10. **Correction prompt** — narrowly fixes a previous issue.

## 8. Risk Classification

**Low:** docs · copy · research · read-only audits
**Medium:** frontend logic · tests · non-payment app behavior · schema documentation
**High:** auth · RLS · PII · child data · payment / webhook logic · credit logic ·
migrations · token storage
**Critical:** production data mutation · destructive SQL · live sync / backfill ·
payment credit-grant changes · deployment after risky changes

**Rules:**
* GPT must add hard gates for high / critical risks.
* Claude must stop before gates.
* Amr must explicitly approve high / critical actions.
* Manual verification is required for external systems.

## 9. Anti-Drift Rules

* Claude must not continue from stale plans.
* Old React / Vite recommendations are not approval.
* Old Stage 1 definitions are not automatically current.
* Research does not imply implementation.
* Public repo inspiration does not imply copying code.
* Dependency recommendation does not imply installation.
* Prompt correction overrides earlier prompt assumptions.
* If state is unclear, reconcile before acting.

## 10. Evidence and Review Loop

After Claude reports, GPT should check:
* scope followed
* allowed files only
* diff matches report
* checks were run
* risks are honest
* no hidden source changes
* no unapproved installs / migrations / deploys
* next action is safe

## 11. Zeluu-Specific Rules

* Card / payment method required for trial.
* 14-day trial.
* 10 free credits.
* Trial credits granted only after Lemon Squeezy webhook confirmation.
* No React / Vite migration without explicit approval.
* No database migrations without explicit approval.
* No child-sensitive data to new AI providers without privacy review.
* No session replay for children.
* No logging child messages / homework images / payment payloads.
* No copying public repo code into Zeluu without license / security review.

## 12. Example Flow from Current Project

**A0.5 Trial Signup Flow:**
* Amr identified a customer experience issue.
* GPT clarified it was not just login stability but the trial / signup / onboarding flow.
* GPT preserved the business rule: card required, 14-day trial, 10 credits.
* GPT wrote a Claude planning prompt.
* Claude inspected the current flow and found a copy contradiction and a webhook-delay
  UX problem.
* GPT reviewed Claude's plan and recommended the implementation scope.
* GPT wrote an implementation prompt.
* Claude implemented only four frontend files.
* GPT reviewed the report and inserted the A0.OS docs setup before continuing research.

## 13. How This Spec Should Be Used

* Amr can use this spec to explain his workflow to any AI agent.
* Claude should read it when a task involves planning, prompts, review, or process.
* GPT should use the same structure when writing future Claude prompts.
* The project tracker / session brief should reference this spec.

## 14. Status

* **Status:** Active operating workflow.
* **Owner:** Amr.
* **Applies to:** Zeluu and future projects using the same Human + GPT + Claude
  workflow.
