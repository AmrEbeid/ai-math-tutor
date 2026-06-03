# SPEC-STAGE2 — Child Chat UX Master Plan

> Full planning spec for the child-facing tutor/chat experience, to be executed **after**
> Stage 1 implementation readiness. Planning/docs only — **nothing here authorizes code,
> installs, migrations, React/Vite, provider changes, or any source edit.** Draws on
> SPEC-000 (product), STAGE1-B (schema/RLS/API facts), and A0.6 (inspiration; no code
> copied). Every adoption named below remains gated on its own approval.

**Status:** Drafted / awaiting GPT and user review. **No implementation authorized.**
**Date:** 2026-06-03
**Risk class:** Medium planning, no execution.

## 1. Purpose

Stage 2 plans the **child-facing AI tutor / chat experience** that comes after Stage 1
puts a safety net (tests, env validation, schema docs, idempotency/RLS design) under the
backend. This master plan defines the target UX, tutoring behavior, safety/privacy
boundaries, credit/subscription UX limits, frontend technical options, component
inspiration, workstreams, implementation slices, a testing plan, acceptance criteria, and
risks — so that later work proceeds in small, approved, low-risk slices.

## 2. Stage 2 Goal

Create a **stable, safe, child-friendly AI tutor experience** that is clear, encouraging,
age-appropriate (Grades 1–9), mobile-friendly, accessible, English/Arabic-ready, and
aligned with parent trust and the fixed payment/credit constraints (card-required trial,
14-day, 10 credits, webhook-confirmed grants). The child should feel guided and supported
— hints first, never answer-dumping — and should never be exposed to billing complexity,
model selection, or unsafe content.

## 3. Stage 2 Non-Goals

Stage 2 does **not** include: React/Vite migration (unless separately approved) · parent
dashboard rebuild (Stage 3) · landing/pricing redesign (Stage 4) · payment-logic changes ·
webhook/credit-grant changes · RLS migrations · new AI-provider routing without approval ·
any model picker exposed to children · social/community features · public leaderboards ·
session replay for children · logging child message content.

## 4. Current Child Chat Baseline (from existing docs; unknowns marked)

* **Frontend type:** static HTML + vanilla JS (no React/Vite); child chat lives at `/app`
  (`public/app.html`) with inline page scripts; PWA + service worker.
* **Child login/session model:** child logs in at `/child-login` with a parent-set
  username/password → `api/auth/child-login.js` verifies via the `verify_child_login` RPC
  and issues a **custom HMAC-SHA256 JWT** (`CHILD_JWT_SECRET`, 24-h expiry). Dual-auth
  helper `getChildOrUser` tries parent Supabase auth first, then the child JWT.
* **Chat/session API shape (from STAGE1-B):** `api/chat.js` (dual-auth) reads
  `children/sessions/messages/notifications`, calls `deduct_credit`,
  `get_valid_credit_balance`, `get_child_limits_summary`, `match_knowledge_chunks` (RAG),
  and OpenAI; `api/sessions/create.js` + `api/sessions/history.js` manage sessions;
  `api/credits/balance.js` reports balance. `lib/prompts.js` holds the system prompt,
  curriculum maps, and safety detectors (`checkForBlockedContent`, `detectChildDistress`,
  `detectPersonalInfo`, `detectStuckLoop`).
* **Token storage concern:** child JWT stored in `localStorage` (XSS-exposed); **two key
  names** observed (`child_token`, `zeluu_child_token`) — needs standardization. Token
  storage change is a **hard gate**.
* **Credit/balance touchpoints:** chat gates on `get_valid_credit_balance`; balance shown
  via `api/credits/balance.js`. Credits are **granted only** by the verified LS webhook
  (never by chat or the frontend).
* **UX limitations:** logic coupled to the DOM in inline scripts; no componentization;
  streaming/markdown/math rendering quality **unknown from docs** (needs STAGE2-A audit);
  child-app states (loading/error/expired/low-credit) not catalogued.
* **Testability limitations:** no test harness; inline scripts are hard to unit-test → E2E
  is more practical for the frontend later.

> **Unknowns (need STAGE2-A read-only audit):** exact current chat DOM/states, whether any
> streaming exists today, current math rendering (if any), how `child_token` vs
> `zeluu_child_token` are used per page, and live RAG/citation behavior.

## 5. Product Principles

Child-safe · parent-trust-first · hint-first learning · avoid answer-dumping · clear
progress · calm UI · low distraction · mobile-first · accessible (WCAG-minded) ·
English/Arabic-ready (RTL) · privacy by design / data minimization · no raw child data to
unapproved AI providers · no model picker for children · motion gated on
`prefers-reduced-motion`.

## 6. Child Tutor UX Flow (target)

1. Child logs in safely (parent-set credentials → child JWT; friendly errors, no PII leak).
2. Child lands on a calm **tutor home** (greeting, subject/topic entry, recent activity).
3. Child chooses **subject / grade / topic** (grade pre-set by the parent profile where
   possible).
4. Child asks a question or starts **practice**.
5. Tutor responds in an **age-appropriate tone** (short, encouraging).
6. Tutor gives **hints first** (mapped to the L1–L5 hint chain from A0.6 pedagogy notes).
7. Tutor **asks the child to try** before revealing more.
8. Tutor **reveals steps gradually** (answer released only after attempt/hints).
9. Tutor **detects struggle** (`detectStuckLoop`/distress) and simplifies / re-encourages.
10. Tutor ends with a **summary + encouragement** (what was learned, next step).
11. Parent dashboard later (Stage 3) receives a **safe progress summary** — mastery/topic
    + safety flags, **not** full child message content unless explicitly privacy-approved.

## 7. Chat UI Requirements

Message bubbles (child/tutor) · typing/streaming state · retry/regenerate (simplified for
children) · edit-message behavior (constrained) · explicit **"show hint" / "show next
step"** controls (answer gated behind them) · **math formatting** (KaTeX-style, streaming-
safe) · image/homework upload as a **future gate** (privacy review required) · error
states · empty state · loading state · session-expired state · **low-credit state**
("ask your parent" — friendly, no checkout) · offline/network-issue state · mobile keyboard
behavior (input stays visible, no layout jump) · accessibility (focus order, labels,
contrast, reduced-motion) · **RTL readiness** (mirrored layout for Arabic).

## 8. Tutoring Behavior Requirements

Socratic prompting · step-by-step explanations · **grade-aware** explanations · avoid
direct answer-dumping · show the final answer **only after** attempt/hints · detect unsafe
/ personal content (route to safety path) · refuse non-learning misuse · **no shame
language** · encouragement by default · **short** responses for children · Arabic/English
support (later; taxonomy/judge must be extended beyond math-English per A0.6 gap) · math-
correctness checks (later; verify the answer, not the model's prose).

## 9. Safety and Privacy Requirements

* **No logging of child message content** unless explicitly approved and privacy-reviewed
  (audit logs: event type + opaque UUID + timestamp + outcome only — never message text,
  names, emails, or child JWTs).
* **No session replay** / heatmaps on child sessions.
* **No public leaderboards**; no social/community features.
* **No child model picker**; model selection is server-side only.
* **No raw child data to unapproved AI providers** (OpenAI is the current approved
  provider; any new provider needs privacy approval).
* **Moderation/safety layer planned** — moderate child input **and** AI output every turn,
  routing flags to a parent/safety path (verify cultural/linguistic fit for MENA/Arabic).
* **Distress / personal-info detection planned** (build on existing `lib/prompts.js`
  detectors).
* **Parent controls planned** (consent records exist; deletion/export DSAR scaffolding
  exists per STAGE1-B).
* **Audit logs must redact PII**; **data minimization** throughout.

> Privacy wording is risk-reducing, not a legal guarantee; a DPIA + legal review across
> UK/GCC jurisdictions is expected before child-facing AI processing changes ship.

## 10. Credit and Subscription UX Boundaries

* The child should **not see payment complexity** (no prices, no plans, no checkout).
* **The parent owns billing**; children never reach a checkout from the child flow.
* The child sees a **friendly low-credit / "ask your parent" state**, not an upsell.
* **Chat must never grant credits**; credits are granted **only** through the verified
  backend/payment (LS webhook) flow.
* **No frontend credit manipulation** (balance is read-only from the server).
* **No checkout from the child flow** unless parent-controlled and separately approved.

## 11. Technical Options

### Option A — Improve the existing static frontend
* **Pros:** lower risk; no dependency install; faster; keeps the current flow stable;
  works within today's vanilla stack (Motion/Lottie/Rive are usable now if gated).
* **Cons:** harder to maintain; weaker componentization; limited testability (inline DOM
  logic); chat-UI libraries (assistant-ui, shadcn) are React-bound and unavailable.

### Option B — Controlled React/Vite migration (later)
* **Pros:** real componentization; better state management; far better testability; unlocks
  chat-UI primitives (assistant-ui), a11y/RTL libraries (React Aria/HeroUI), and Tremor
  for the later parent dashboard.
* **Cons:** higher risk; **requires dependency approval + a migration plan + source
  edits**; routing/auth/payment regression risk; larger review surface.

**Recommendation:** **Do not start React/Vite in this planning task.** Stage 2 should plan
**both** paths, deliver early child-UX/safety wins on the **static** frontend (Option A)
where low-risk, and make the migration decision only **after** Stage 1 implementation
readiness is resolved and with explicit user approval (see STAGE2-E memo).

## 12. UI / Component Inspiration (study only — do NOT copy code)

From A0.6 (license-vet before any reuse):

* **assistant-ui** — runtime-vs-primitives chat decomposition (Thread/Message/Composer/
  ActionBar); **study after React approval**.
* **Vercel AI chatbot / AI SDK** — study transport/streaming **architecture**, not its
  adult chat UX directly.
* **OATutor / MathDial / socratic-llm / MathTutorBench** — hint-chain/mastery + Socratic
  pedagogy + answer-release gating + regression-eval inspiration.
* **Streamdown + KaTeX + rehype-harden/DOMPurify** — streaming-safe markdown + math +
  sanitization (non-negotiable pattern for a child math tutor).
* **shadcn/Radix/React Aria/HeroUI** — a11y/RTL component foundations, **only if React is
  approved**.
* **Motion / Lottie / Rive** — subtle, **gated** playful animation only (respect
  `prefers-reduced-motion`; never distracting in the learning flow).

**Avoid (A0.6 §9):** adult model-picker/BYO-key UX, plugin/code-execution ecosystems,
leaderboards/social gamification for children, flashy landing-style animation in the
learning flow, and any restrictive-license code.

## 13. Stage 2 Workstreams

* **STAGE2-A** — Current child chat UX audit (read-only).
* **STAGE2-B** — Tutor conversation design spec (hint chain, tone, answer-release gate).
* **STAGE2-C** — Child safety/privacy UX spec (moderation, distress/PII, parent path).
* **STAGE2-D** — Static frontend improvement plan (Option A wins, low-risk).
* **STAGE2-E** — React/Vite migration decision memo (Option B; decision only).
* **STAGE2-F** — Chat UI wireframe / component spec.
* **STAGE2-G** — Math rendering + step-by-step interaction plan (KaTeX, streaming-safe).
* **STAGE2-H** — Low-credit / session / error-state plan.
* **STAGE2-I** — Accessibility / RTL / mobile plan.
* **STAGE2-J** — Implementation slice plan (sequencing + gates).

## 14. Stage 2 Implementation Slices

> Docs/audit slices are low-risk; implementation slices each require explicit approval.
> Nothing here is authorized by this document.

| Slice | Name | Type | Risk | Description | Requires Approval? |
|---|---|---|---|---|---|
| STAGE2-A | Current child chat UX audit | Docs (read-only) | Low | Catalogue current `/app` chat DOM, states, token-key usage, streaming/math behavior | No (read-only) |
| STAGE2-B | Tutor conversation design spec | Docs/plan | Low | L1–L5 hint chain, tone, four-phase arc, answer-release gate + leakage-judge intent | No |
| STAGE2-C | Child safety/privacy UX spec | Docs/plan | Med | Per-turn input+output moderation, distress/PII routing, parent/safety path, redaction | No (plan); privacy review before impl |
| STAGE2-D | Static frontend improvement plan | Docs/plan | Low | Low-risk Option-A UX wins (states, calm UI, big tap targets) without React | No |
| STAGE2-E | React/Vite migration decision memo | Docs/decision | Low | Costs/benefits/regression risks; recommend go/no-go + sequencing | No (decision gate) |
| STAGE2-F | Chat UI wireframe / component spec | Docs/plan | Low | Bubbles, composer, hint controls, action bar, empty/loading/error states | No |
| STAGE2-G | Math rendering + step interaction plan | Docs/plan | Low | KaTeX-style streaming-safe rendering + "show next step" interaction design | No |
| STAGE2-H | Low-credit/session/error-state plan | Docs/plan | Low | Friendly "ask your parent", expired-session, offline/network states | No |
| STAGE2-I | Accessibility / RTL / mobile plan | Docs/plan | Low | WCAG-minded a11y, Arabic RTL mirroring, mobile keyboard behavior | No |
| STAGE2-1 | Static child-UX safe improvements | Implementation | Med | Apply approved Option-A UX/state improvements to `public/app.html` etc. | **Yes** (frontend edits) |
| STAGE2-2 | Safety/moderation layer integration | Implementation | **High** | Wire per-turn moderation + distress/PII routing into chat path | **Yes** (privacy + chat logic) |
| STAGE2-3 | Math rendering implementation | Implementation | Med | Streaming-safe KaTeX + sanitization in the child chat | **Yes** (frontend; deps if React) |
| STAGE2-4 | Child token-storage migration | Implementation | **High** | httpOnly/Secure/SameSite cookie + key-name standardization | **Yes** (token storage = hard gate) |
| STAGE2-5 | React/Vite migration (if approved) | Implementation | **High** | Only if STAGE2-E + user approve; staged, regression-guarded | **Yes** (separate decision) |

**Docs/audit (low-risk, no source edits):** STAGE2-A…J. **Implementation (approval
required):** STAGE2-1…5.

## 15. Stage 2 Testing Plan (no tests created now)

Plan future tests (all with mocked AI; no real external calls; synthetic data only):
child login flow · child cannot access another child's/family's data (app-layer, since RLS
is parent-scoped) · chat API with **mocked** AI response (deterministic) · low-credit state
· expired-session state · moderation/safety cases (distress, PII-sharing, jailbreak
redirect) · math-formatting rendering · mobile-layout smoke tests · accessibility tests ·
Arabic/RTL smoke tests. These depend on the Stage 1 test harness (Vitest/MSW) being
installed and approved first.

## 16. Stage 2 Acceptance Criteria

* stable child login;
* clear chat flow (home → topic → ask → hint → try → steps → summary);
* hint-first tutor behavior (no premature answer-dumping);
* safe, age-appropriate responses (moderation + detectors active);
* no payment complexity exposed to the child;
* low-credit state handled gracefully ("ask your parent");
* session / error / loading / offline states handled;
* no secret exposure (service-role/AI/LS secrets never client-side);
* no child-data leakage (app-layer isolation verified; no message-content logging);
* no React/Vite unless separately approved;
* tests planned or implemented later (with mocks);
* parent trust preserved (safe summaries, parent controls).

## 17. Stage 2 Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| Token storage / localStorage | Child JWT XSS-exfiltratable; two key names | STAGE2-4 cookie migration (hard gate); standardize key |
| AI answer-dumping | Undermines pedagogy + parent trust | Answer-release gate + leakage judge (STAGE2-B) |
| Unsafe child content | Safety/legal exposure | Per-turn input+output moderation + distress/PII routing (STAGE2-C) |
| Cost blowups | Token spend on long child dialogues | Short responses, rate limits, mocked tests, server-side model pinning |
| Credit bypass | Free usage / revenue leak | Server-side credit gate; chat never grants; no frontend manipulation |
| Overbuilding UI | Scope creep, distraction | Calm/low-distraction principle; Option-A first; gated motion |
| React migration regression | Auth/payment/routing breakage | STAGE2-E decision memo + staged migration + regression tests |
| Arabic/RTL complexity | Layout + pedagogy gaps (math-English bias) | STAGE2-I plan; extend taxonomy/judge to AR; RTL smoke tests |
| Privacy / logging risks | Child PII in logs/analytics | No message logging; redact audit logs; no session replay |
| Untested auth/session paths | Silent isolation/expiry bugs | STAGE2-A audit + Stage 1 test harness before impl |

## 18. Recommended First Stage 2 Slice

**`STAGE2-A — Current Child Chat UX Audit`** (read-only / docs-only).

It establishes the real current child-chat DOM, states, token-key usage, and any existing
streaming/math behavior — the facts every later Stage 2 slice depends on — at zero
execution risk. **Implementation Stage 2 slices should not start before Stage 1
implementation readiness is resolved** (working tree cleaned, env validation + tests +
idempotency/RLS work approved/underway), so the backend safety net exists before the
child-facing surface is changed. STAGE2-A is safe to run in parallel with Stage 1 review
because it changes nothing.

## 19. Stage 2 Status

**Drafted / awaiting GPT and user review. No implementation authorized.**
