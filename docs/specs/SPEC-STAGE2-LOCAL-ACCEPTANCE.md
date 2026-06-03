# SPEC-STAGE2-LOCAL-ACCEPTANCE — Stage 2 Static Child Chat UX (Local)

> Records the Stage 2 **static** child-tutor UX work done locally on `public/app.html`
> (no React/Vite, no new providers, no deploy). Conservative, additive improvements to the
> existing working page — not a rewrite. Produced by FINISH-STAGE1-STAGE2-LOCAL Phase 9–10.

**Status:** Stage 2 **partially complete locally** (static improvements landed); deeper
items deferred. No production actions.
**Date:** 2026-06-03
**Risk class:** Medium (frontend edits to the existing static page); no live actions.

## 1. Entry Point

The child tutor/chat lives at `/app` → `public/app.html` (1230 lines, static HTML + inline
JS; no React). It already had: subject tabs (Math/Science/English) + Exam Prep link, a
chat log, typing indicator ("Thinking…"), a no-credits modal, a usage-limit-blocked
message, image/file attach, EN/AR language toggle, and credit badge. Stage 2 improved it
additively rather than restructuring it.

## 2. Implemented Stage 2 UX Changes (commit `4360957`)

* **Accessibility:** `#chat-messages` is now a labelled live region (`role="log"`,
  `aria-live="polite"`, `aria-atomic="false"`, `aria-label`) so screen readers announce
  tutor replies; the input (`aria-label="Type your question"`) and send button
  (`aria-label="Send message"`) are now labelled.
* **Hint-first tutor copy:** the opening greeting now sets a hint-first, step-by-step
  expectation ("I'll give you hints first and we'll work it out together, step by step").
* **Session-expired state:** a 401/expired-token response now shows a friendly
  "Your session has timed out. Please log in again…" message and redirects to
  `/child-login` (previously fell through to a generic error).
* **Clearer error copy:** the generic failure message is now child-friendly
  ("something went wrong on our side. Please try again in a moment").

## 3. Tutor Behavior / Safety / Privacy (verified, unchanged where risky)

* **No model picker, no provider routing** added (existing OpenAI flow only).
* **No payment/checkout surface** in the child app (verified: no `credits/checkout`,
  `lemonsqueezy`, `buy now`, or `pricing.html` in `public/app.html`); low/no-credit state
  defers to the parent ("ask your parent").
* **No child-data logging, no session replay, no analytics** added.
* **No secrets** in the page (verified: no `service_role`, no `sk-…`).
* **RTL/Arabic-ready:** the language toggle already sets `document.documentElement.dir`
  to `rtl` for Arabic (retained).
* `lib/prompts.js` (system prompt / safety detectors) was **not** modified — deeper
  Socratic/answer-release tuning is deferred (AI-behavior change needs eval; out of scope
  for a safe static pass).

## 4. Tests / Checks (commit `4360957`)

`tests/child-chat-ux.test.mjs` (9 static smoke tests, part of `npm test` → 36 total after LOCAL-CORRECTION-1):
aria-live log; labelled input/send; hint-first copy; "ask your parent" (no child payment);
**no payment/checkout surface**; session-expired guidance; RTL dir toggle; typing+error
states; no leaked secret.

## 5. Files Changed (Stage 2)

* `public/app.html` — a11y attributes, hint-first greeting, session-expired branch, error copy.
* `tests/child-chat-ux.test.mjs` — new static smoke test.

## 6. What Remains (future, gated)

* **React/Vite decision** (STAGE2-E) — still blocked; assistant-ui/streaming-safe markdown
  patterns depend on it.
* **Stronger moderation** — per-turn input+output moderation + distress/PII routing into a
  parent/safety path (privacy review required).
* **Token-storage migration** — child JWT localStorage → httpOnly cookie (hard gate).
* **Math rendering** — streaming-safe KaTeX (current `renderMarkdown` is bold/italic/code/
  linebreak only; no LaTeX).
* **Streaming UX** — responses are non-streamed ("Thinking…" then full reply).
* **Parent dashboard** (Stage 3), **analytics privacy review**, **full Arabic QA**, and a
  **full accessibility audit** (this pass added basics, not a complete WCAG audit).

## 7. Stage 2 Local Status

**Partially complete locally** — safe, additive static UX + a11y + safety-invariant tests
landed on the existing page with no architecture change and no regressions to the working
flow (static checks pass). The larger Stage 2 scope (streaming, KaTeX, moderation,
token-storage, React/Vite) remains future/gated. No production actions performed.
