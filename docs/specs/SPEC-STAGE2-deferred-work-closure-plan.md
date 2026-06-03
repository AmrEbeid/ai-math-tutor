# SPEC-STAGE2-deferred-work-closure-plan

> Roadmap for the Stage 2 items deferred by STAGE2-LOCAL. **Plan only.** No React/Vite, no
> new AI providers, no KaTeX install in this doc.

**Status:** Drafted / awaiting GPT and user review.
**Date:** 2026-06-03
**Risk class:** Medium planning; no execution.

## Deferred items

| # | Item | Why it matters | Depends on | Risk | Size | Acceptance criteria | Future prompt |
|---|------|----------------|-----------|------|------|---------------------|---------------|
| 1 | **Per-turn moderation / safety layer** | Child-safety + compliance; moderate input AND AI output, route flags to a parent/safety path | privacy review; existing detectors in `lib/prompts.js` | High | M | every turn moderated; distress/PII flagged to parent; mocked tests; no child content logged | `STAGE2-SAFETY-1 — moderation layer (design→impl)` |
| 2 | **KaTeX / math rendering** | Math tutor must render equations; current `renderMarkdown` is bold/italic/code/linebreak only | dependency approval (KaTeX) **or** vanilla-safe approach; streaming-safe sanitize | Med | M | equations render; sanitized; no half-broken markup | `STAGE2-MATH-1 — KaTeX rendering (approval first)` |
| 3 | **httpOnly token storage** | XSS exposure of child JWT | `SPEC-child-token-storage-httpOnly-migration-plan.md`; CORS-credentials + CSRF | High | M/L | cookie auth; CSRF; tests; staged rollout | `STAGE2-TOKEN-1` |
| 4 | **Arabic / RTL QA** | EN/AR product; `dir=rtl` toggles but unverified end-to-end | content + layout review | Med | M | full RTL pass on child + key pages; AR copy reviewed | `STAGE2-RTL-1 — Arabic/RTL QA` |
| 5 | **Accessibility QA** | This pass added basics (aria-live/labels), not a full audit | — | Low/Med | M | WCAG-minded audit (focus, contrast, keyboard, screen reader) on child flow | `STAGE2-A11Y-1 — accessibility audit` |
| 6 | **Parent dashboard integration** (Stage 3) | Safe progress summaries (mastery + safety flags, not raw content) | Stage 3 | Med | L | parent sees safe summaries; no raw child message content unless privacy-approved | `STAGE3-P — parent dashboard plan` |
| 7 | **Analytics / privacy review** | No analytics on children without review | privacy/legal | Med | S/M | documented privacy stance; no child session replay/heatmaps | `STAGE2-PRIV-1 — analytics privacy review` |
| 8 | **React/Vite decision** | Unlocks assistant-ui/streaming primitives but high regression risk | explicit approval; STAGE2-E memo | High | L | go/no-go memo; if go, staged regression-guarded migration | `STAGE2-E — React/Vite decision memo` |
| 9 | **Streaming / better typing UX** | Responses are non-streamed ("Thinking…" then full reply) | likely tied to #8 | Med | M | token streaming with sanitize; graceful fallback | `STAGE2-STREAM-1` (after #8) |
| 10 | **Session history UI** | Resume/review past tutoring | existing `sessions/history` API | Low/Med | S/M | child can see/resume recent sessions safely | `STAGE2-HIST-1` |

## Recommended order
After PROD-GATE-1: **#1 (safety)** and **#3 (token storage)** first (highest risk-reduction),
then **#2 (math)** and **#4/#5 (RTL/a11y QA)**, then the **#8 React/Vite decision** which
gates #9 (streaming) and richer chat UI. #6/#7/#10 follow as product priorities allow.

## Guardrails
No React/Vite start, no KaTeX/other installs, no new AI providers, and no child-data logging
without the relevant approval. Stage 2 stays **partially complete locally** until these land.
