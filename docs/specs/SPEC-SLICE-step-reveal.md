# SPEC-SLICE — Step-Reveal / Guided-Explanation Layout DESIGN (T-09)

> **Purpose:** Design for presenting tutor explanations **one step at a time with a comprehension check**
> — including on **image/photo** problems — so students follow the method instead of copying a full
> solution dump (anti-QANDA / research M3).
> **Status:** Drafted (design-only) — awaiting GPT + owner review. **Risk:** Low to write; the impl
> splits into a **medium-risk frontend slice** and a **high-risk chat-backend prompt slice**.
> **Grounds in:** the live `step_by_step` tutoring mode + L1–L4 math scaffolding + Math Answer Release
> Policy (`api/chat.js`, `lib/prompts.js`), the KaTeX/markdown renderer (`public/js/render.js`), the
> worked-example guard (T-03), and the streaming path (T-02).
> **Discipline:** No product code from this doc. Implementation is split, gate-aware slices.

---

## 1. What exists today (FACTS)

- **`step_by_step` mode** (auto-detected from "step by step"/"one step at a time" in `detectTutoringMode`)
  already instructs the model: *"present ONE step, wait for response, do not advance until the child
  responds."* So the **backend can already produce one step per turn** when this mode is active.
- **L1–L4 math scaffolding** + the **Math Answer Release Policy** already restrain answer-dumping for
  math; the **worked-example guard** (T-03) demonstrates on parallel problems without solving the child's.
- **Image/vision** path exists (`image_url`, `detail:'low'`) — but it runs the **same** tutoring prompt,
  so a photo currently risks a fuller solution than the step-by-step intent (the QANDA failure mode).
- **Rendering** is markdown + KaTeX via the shared escape-first `renderMarkdown` (XSS-safe), used by both
  streamed and finalized assistant text.

**Gap:** (a) no **UI affordance** to reveal steps progressively / confirm understanding; (b) the
**image path lacks an explicit no-dump guard**.

---

## 2. Two slices (split by risk)

### Slice A — Frontend progressive reveal *(medium risk, no backend)*
- When an assistant message is **multi-step** (numbered list / "Step N" headings — already how the model
  formats), render it as a **stepper**: show step 1 + a **"Next step"** / **"I've got it"** control;
  reveal subsequent steps on demand, with an optional **check-for-understanding** prompt between steps.
- **Parsing:** detect steps from the rendered markdown structure (ordered-list items or `Step \d` headings)
  **client-side**, after the existing `renderMarkdown` escape — never by interpreting raw model text as HTML.
- **Graceful fallback:** if no step structure is detected, render the message as today (single bubble).
- **A11y:** stepper controls are buttons with labels; revealed steps announced via the existing
  `aria-live` log; keyboard operable.
- **No backend/credit/auth change** → self-contained frontend slice (small PR + validation).

### Slice B — No-dump-on-image guard *(high risk — chat-backend prompt)*
- When `image` is present (and generally for problem-solve turns), append a guard (a sibling of the
  worked-example guard in `lib/prompts.js`) that **forces the step-by-step / scaffold posture and forbids
  a full solution in one turn**, even for photos. Method first; reveal at most one step; invite a response.
- Keep it **prompt-only**, server-derived from the request shape (image present), config-driven, and
  **append-after** the scaffolding block (last-word wins) — same pattern as T-03. **No credit/auth/schema
  change**, but it touches the high-risk chat path → owner review before merge.

> Slice A ships value with no backend risk; Slice B closes the anti-QANDA gap separately. They compose
> but don't depend on each other.

---

## 3. Anti-dump invariant (the point of the feature)

- A single turn never reveals the complete worked solution to the **student's own** problem — text or photo.
- Step-by-step posture holds across subjects (math first; science/English reuse the same stepper UI and a
  subject-agnostic guard).
- Reuses, does not duplicate, the worked-example guard and the Math Answer Release Policy — one consistent
  "show method, not answers" stance.

## 4. Acceptance (for the FUTURE gated implementation — not this task)

- **Slice A:** multi-step replies render as an operable, accessible stepper; non-step replies fall back to
  a normal bubble; rendering stays XSS-safe (through `renderMarkdown`). Frontend tests lock the stepper +
  fallback.
- **Slice B:** an image problem-solve turn does **not** return a full solution; it returns method + one
  step + a check. Guard is unit-tested like the worked-example guard.
- No regression to credit metering, auth, or the streaming/finalize path.

## 5. Gates (CLAUDE.md)

- 🟡 **Medium (small PR + validation):** Slice A — frontend-only progressive reveal.
- 🔴 **High-risk (owner review before merge):** Slice B — chat-backend prompt guard for image/problem turns.
- ❌ No migration / auth / payment / install / deploy / React. (Slice A is plain JS in `app.html`, no
  framework.)
- This doc is **docs-only, low-risk**.

## 6. Open gaps

- **Step-detection heuristics** — which structures count as "steps" (ordered list vs. `Step N` vs. blank-line
  blocks); tune to how the model actually formats across subjects/languages, with a safe single-bubble fallback.
- **Check-for-understanding wording** — light vs. intrusive; age-banded (reuse `CHILD_SAFETY.ageBands`).
- **Streaming interaction** — how the stepper behaves while tokens stream (reveal step 1 live, gate the rest
  after stream end) vs. only after finalize.
- **Image guard tuning** — false "too cautious" rate vs. the anti-QANDA goal; measure before enabling.
