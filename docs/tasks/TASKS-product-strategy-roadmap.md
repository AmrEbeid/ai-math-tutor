# TASKS — Product Strategy Roadmap Backlog

> **Purpose:** Executable, gate-aware task backlog derived from
> [`SPEC-ROADMAP-product-revamp-implementation`](../specs/SPEC-ROADMAP-product-revamp-implementation.md).
> **Status:** Drafted / awaiting GPT + owner review. **Risk:** Low (docs-only).
> **Context:** [research](../research/RESEARCH-competitive-product-strategy-2026-06-15.md) ·
> [product strategy](../specs/SPEC-PRODUCT-learning-companion-strategy.md) ·
> [pricing](../specs/SPEC-PRICING-packages-credits-cost-model.md).
> **Discipline:** every task follows the repo's slice-by-slice, evidence-first, gate-aware model.
> No product code is written from this doc until an approved slice (per CLAUDE.md).

## Legend
- **Priority:** P0 (now/critical) · P1 (MVP) · P2 (strategic) · P3 (differentiating)
- **Phase:** A Quick win · B MVP · C Strategic · D Differentiating (maps to roadmap)
- **Code?** Does the task require product code (vs docs/design/research)?
- **Legal/Sec?** Requires legal or security review before merge/apply.
- **React gate?** Requires explicit React/Vite migration approval (CLAUDE.md hard gate).

## Summary table

| ID | Title | Phase | Pri | Cx | Code? | Legal/Sec? | React gate? | Roadmap |
|---|---|---|---|---|---|---|---|---|
| T-01 | KaTeX / rich formatting | A | P0 | L | Yes | No | No | A1 |
| T-02 | Streaming responses (spike → ship) | A | P1 | M | Yes | No | No | A2 |
| T-03 | Worked-example escape hatch | A | P1 | L | Yes | No | No | A3 |
| T-04 | Weekly parent digest | A | P0 | M | Yes | No (privacy-aware) | No | A4 |
| T-05 | Safety & Privacy page | A | P0 | L | Yes (static) | Light (legal copy) | No | A5 |
| T-06 | Try-before-signup first session | B | P1 | M | Yes | Yes (no PII pre-consent) | No | B1 |
| T-07 | Free-trial time + credit enforcement (design) | B | P0 | M | No (design) | No | No | B2 |
| T-08 | Age-banded tutor tone | B | P1 | M | Yes | Light (safety) | No | B3 |
| T-09 | Step-reveal / guided explanation layout | B | P1 | M | Yes | No | No | B4 |
| T-10 | Instant dual-channel safety alerts | B | P0 | M | Yes | Yes (child-safety) | No | B5 |
| T-11 | COPPA / VPC research + legal gate | B | P0 | M | No (research) | **Yes (legal)** | No | B6 |
| T-12 | Pricing/credits implementation design | B | P1 | M | No (design) | No | No | B7 |
| T-13 | Multi-subject tutor modes | C | P2 | H | Yes | No | Maybe | C1 |
| T-14 | Arabic/English + RTL-native UX | C | P2 | H | Yes | No | Maybe | C2 |
| T-15 | Subject mastery map | C | P2 | H | Yes | No | Likely | C3 |
| T-16 | Practice generator | C | P2 | M–H | Yes | No | Maybe | C4 |
| T-17 | Mistake analysis | C | P2 | M–H | Yes | No | No | C5 |
| T-18 | Curriculum / exam mode | C | P2 | H | Yes | No | Maybe | C6 |
| T-19 | React/Vite island-first migration | C | P2 | H | Yes | No | **Yes** | C7 |
| T-20 | Voice tutor (Arabic + English) | D | P3 | H | Yes | Light (audio data) | Likely | D1 |
| T-21 | Whiteboard / sketch input | D | P3 | H | Yes | No | **Yes** | D2 |
| T-22 | Interactive graphing | D | P3 | H | Yes | No | **Yes** | D3 |
| T-23 | Adaptive revision plan | D | P3 | H | Yes | No | Maybe | D4 |
| T-24 | Teacher / classroom mode (B2B) | D | P3 | H | Yes | Yes (school data) | Likely | D5 |

---

## Task details

> Each: User story · Acceptance criteria · Dependencies · Risks · Docs · Owner placeholder.

### T-01 — KaTeX / rich formatting  *(Phase A · P0 · Cx L · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, I see math and structured explanations rendered properly so they're readable and trustworthy.
- **Acceptance:** Math renders via KaTeX in `app.html` + `exam-prep.html`; no raw LaTeX visible; structured steps/lists render; **output stays XSS-safe** (KaTeX fed only sanitized tokens — preserves REVIEW-FIX-1); `npm test` green; renderer built subject-agnostic.
- **Dependencies:** none. **Risks:** XSS regression if escaping bypassed. **Code:** Yes. **Legal/Sec:** No. **React gate:** No.
- **Docs:** roadmap A1; SPEC-STAGE2-deferred (KaTeX deferred item).

### T-02 — Streaming responses  *(Phase A · P1 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, I see replies stream so the tutor feels alive and I'm not staring at a blank wait.
- **Acceptance:** SSE token streaming with typing indicator; graceful non-stream fallback; **credit deduction unchanged**; works on static stack.
- **Dependencies:** existing OpenAI seam. **Risks:** Vercel function streaming limits/timeouts. **Code:** Yes. **Legal/Sec:** No. **React gate:** No.
- **Docs:** roadmap A2.

### T-03 — Worked-example escape hatch  *(Phase A · P1 · Cx L · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a younger student, when guidance isn't enough I can ask for a fully worked *parallel* example.
- **Acceptance:** Button returns a *different* worked problem (never the exact submitted one); logged; prompt-guarded against solving the input.
- **Dependencies:** none. **Risks:** model solves the actual homework. **Code:** Yes. **Legal/Sec:** No. **React gate:** No.
- **Docs:** roadmap A3 (addresses research K4).

### T-04 — Weekly parent digest  *(Phase A · P0 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a parent, I get a weekly email summarizing my child's learning and any safety flags.
- **Acceptance:** pg_cron weekly job; includes time-on-task, subjects/topics, safety flags; opt-out honored; **no child message content / no PII in logs or email body beyond aggregates** (CLAUDE.md).
- **Dependencies:** existing notification pipeline. **Risks:** leaking child content/PII. **Code:** Yes. **Legal/Sec:** privacy-aware. **React gate:** No.
- **Docs:** roadmap A4 (Khanmigo K2).

### T-05 — Safety & Privacy page  *(Phase A · P0 · Cx L · Code: Yes static)*
- **Owner:** _TBD_
- **Story:** As a parent, I can read a plain-language page explaining how Zeluu keeps my child safe.
- **Acceptance:** Static page explaining two-pass moderation (R4), dual-channel alerts (K2), DB-level data isolation (RLS), COPPA/UK-Children's-Code alignment (R1, R2); linked from homepage + dashboard.
- **Dependencies:** none. **Risks:** over-claiming compliance (legal copy review). **Code:** Yes (static). **Legal/Sec:** light legal review. **React gate:** No.
- **Docs:** roadmap A5.

### T-06 — Try-before-signup first session  *(Phase B · P1 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a child, I can complete one guided question before anyone makes me sign up.
- **Acceptance:** Anonymous, hard-capped session; **no child PII stored before parental consent** (R1, R3); parent account + consent required to continue; rate-limited against abuse.
- **Dependencies:** T-11 (consent). **Risks:** free-tier abuse; pre-consent data capture. **Code:** Yes. **Legal/Sec:** Yes. **React gate:** No.
- **Docs:** roadmap B1 (U1).

### T-07 — Free-trial time + credit enforcement (design)  *(Phase B · P0 · Cx M · Code: No)*
- **Owner:** _TBD_
- **Story:** As the business, I enforce 7-day / 50-credit / 10-per-day / 15-min-per-day trial caps to bound cost and create an upgrade moment.
- **Acceptance:** A design doc/slice spec for server-enforced caps + per-action metering; **no code** (implementation is a hard gate — credit/payment logic).
- **Dependencies:** T-12. **Risks:** under-enforcement → cost overrun; over-enforcement → bad UX. **Code:** No (design). **Legal/Sec:** No. **React gate:** No.
- **Docs:** pricing spec §2, §5; roadmap B2.

### T-08 — Age-banded tutor tone  *(Phase B · P1 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, the tutor talks to me in a way that fits my age.
- **Acceptance:** Three bands (G1–3 / 4–6 / 7–9); **age encoded as a hard constraint** in the system prompt (R4); tone verified per band; periodic re-grounding over long sessions; subject-agnostic.
- **Dependencies:** child age/grade on profile (exists). **Risks:** band leakage over long multi-turn (R4 caveat). **Code:** Yes (prompt = medium risk, validate). **Legal/Sec:** light. **React gate:** No.
- **Docs:** roadmap B3.

### T-09 — Step-reveal / guided explanation layout  *(Phase B · P1 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, I get one step at a time with a check I can follow — not a full solution to copy.
- **Acceptance:** Step-by-step reveal + check-for-understanding; **no full-solution dump even on image upload** (anti-QANDA, M3); applies across subjects (math first).
- **Dependencies:** none (pairs with T-01). **Risks:** drifting into answer-dump. **Code:** Yes. **Legal/Sec:** No. **React gate:** No.
- **Docs:** roadmap B4.

### T-10 — Instant dual-channel safety alerts  *(Phase B · P0 · Cx M · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a parent, I'm alerted immediately (email + in-app) when my child's chat is flagged.
- **Acceptance:** Email + in-app parity with Khanmigo (K1, K2); dedup once-per-session (already built); parent routing now, teacher routing later; surfaces existing distress/PII detection.
- **Dependencies:** notification pipeline. **Risks:** alert flooding; missed flags. **Code:** Yes. **Legal/Sec:** child-safety review. **React gate:** No.
- **Docs:** roadmap B5.

### T-11 — COPPA / VPC research + legal gate  *(Phase B · P0 · Cx M · Code: No)*
- **Owner:** _TBD (owner + legal)_
- **Story:** As a parent, I provide verifiable consent before my child's data is collected.
- **Acceptance:** Research output selecting a VPC method that satisfies the **April 2025 COPPA amendments (binding now, R1)** on the Lemon Squeezy + Supabase stack; privacy-by-default, geolocation off, no nudge (R3); UK Children's-Code mapping (R2). **HARD GATE: owner + legal review before any implementation.**
- **Dependencies:** none (blocks T-06 expansion). **Risks:** legal non-compliance (critical). **Code:** No (research). **Legal/Sec:** **Yes (legal).** **React gate:** No.
- **Docs:** roadmap B6; research §9.

### T-12 — Pricing/credits implementation design  *(Phase B · P1 · Cx M · Code: No)*
- **Owner:** _TBD_
- **Story:** As the business, I have a concrete design for per-action credit metering + new packages.
- **Acceptance:** Design slice covering per-action metering (pricing §5), package/plan definitions (§3–§4), PPP currency, extra packs (§8); maps to LS variants; **no code** (credit/payment logic = hard gate).
- **Dependencies:** pricing spec. **Risks:** mis-modeled economics. **Code:** No (design). **Legal/Sec:** No. **React gate:** No.
- **Docs:** pricing spec; roadmap B7.

### T-13 — Multi-subject tutor modes  *(Phase C · P2 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, I can pick a subject (math, then science, then English) and get subject-aware help.
- **Acceptance:** Subject selector; per-subject system prompts + RAG knowledge sets; subject-agnostic chat core; a subject ships only at the math quality bar.
- **Dependencies:** A1/B3/B4 patterns. **Risks:** breadth before quality. **Code:** Yes. **Legal/Sec:** No. **React gate:** Maybe.
- **Docs:** strategy §5; roadmap C1.

### T-14 — Arabic/English + RTL-native UX  *(Phase C · P2 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As an Arabic-speaking child/parent, the whole experience works natively in Arabic, RTL, with fluent Arabic explanations.
- **Acceptance:** Full Arabic UI; RTL math/layout parity; Arabic Socratic tone reviewed by a native speaker; builds on UI-7 RTL foundation. **Validate competitor Arabic quality + demand first.**
- **Dependencies:** UI-7; C7 (likely). **Risks:** betting on unproven whitespace (refuted). **Code:** Yes. **Legal/Sec:** No. **React gate:** Maybe.
- **Docs:** research §6; strategy §7; roadmap C2.

### T-15 — Subject mastery map  *(Phase C · P2 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student/parent, I see a map of topics colored by mastery.
- **Acceptance:** Curriculum-aligned topic map per subject; mastery derived from real activity; ties into digest + revision plan.
- **Dependencies:** skill taxonomy; likely C7. **Risks:** taxonomy scope creep. **Code:** Yes. **Legal/Sec:** No. **React gate:** Likely.
- **Docs:** roadmap C3.

### T-16 — Practice generator  *(Phase C · P2 · Cx M–H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student, I can get "a similar one" / a practice set to reinforce a topic.
- **Acceptance:** LLM-generated, curriculum-tagged practice; metered per pricing §5; subject-agnostic.
- **Dependencies:** T-13. **Risks:** quality/accuracy of generated items. **Code:** Yes. **Legal/Sec:** No. **React gate:** Maybe.
- **Docs:** roadmap C4.

### T-17 — Mistake analysis  *(Phase C · P2 · Cx M–H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student/parent, I get insight into recurring mistakes.
- **Acceptance:** Per-child error-type logging; pattern detection; feeds revision plan (D4) + parent digest (T-04).
- **Dependencies:** error logging. **Risks:** false patterns. **Code:** Yes. **Legal/Sec:** No. **React gate:** No.
- **Docs:** roadmap C5.

### T-18 — Curriculum / exam mode  *(Phase C · P2 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student/parent, I can practice aligned to my curriculum and prep for exams.
- **Acceptance:** Curriculum mapping (GCC/UK/US) per subject; exam-mode practice; builds on `exam-prep.html`.
- **Dependencies:** T-13, curriculum mapping. **Risks:** mapping effort underestimated. **Code:** Yes. **Legal/Sec:** No. **React gate:** Maybe.
- **Docs:** roadmap C6 (M4).

### T-19 — React/Vite island-first migration  *(Phase C · P2 · Cx H · Code: Yes · React gate: YES)*
- **Owner:** _TBD_
- **Story:** As an engineer, I migrate the tutor app to a React island where static can't deliver streaming/whiteboard/graphing.
- **Acceptance:** Island-first (child tutor surface only); marketing/legal stay static; **explicit owner approval obtained** (CLAUDE.md hard gate).
- **Dependencies:** triggered by C-phase interactive needs. **Risks:** scope blow-up. **Code:** Yes. **Legal/Sec:** No. **React gate:** **Yes.**
- **Docs:** roadmap C7; SPEC-STAGE2-deferred (React/Vite decision).

### T-20 — Voice tutor (Arabic + English)  *(Phase D · P3 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a young/pre-literate child, I can speak my question and hear the guidance.
- **Acceptance:** STT/TTS with Arabic support; metered (pricing §5); latency + cost within gates.
- **Dependencies:** likely C7. **Risks:** Arabic STT/TTS quality; audio-data handling. **Code:** Yes. **Legal/Sec:** light (audio data). **React gate:** Likely.
- **Docs:** roadmap D1.

### T-21 — Whiteboard / sketch input  *(Phase D · P3 · Cx H · Code: Yes · React gate: YES)*
- **Owner:** _TBD_
- **Story:** As a student, I can hand-write my working and get guided feedback.
- **Acceptance:** Sketch input + handwriting recognition; guided feedback (not answer dump).
- **Dependencies:** C7. **Risks:** recognition accuracy. **Code:** Yes. **Legal/Sec:** No. **React gate:** **Yes.**
- **Docs:** roadmap D2.

### T-22 — Interactive graphing  *(Phase D · P3 · Cx H · Code: Yes · React gate: YES)*
- **Owner:** _TBD_
- **Story:** As a student, I can explore graphs to understand functions/geometry.
- **Acceptance:** Manipulable graphs integrated into the tutor surface.
- **Dependencies:** C7. **Risks:** complexity. **Code:** Yes. **Legal/Sec:** No. **React gate:** **Yes.**
- **Docs:** roadmap D3.

### T-23 — Adaptive revision plan  *(Phase D · P3 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a student/parent, I get a weekly plan tailored to mistakes and mastery.
- **Acceptance:** AI weekly plan per subject from mastery (T-15) + mistakes (T-17); surfaced in dashboard + digest.
- **Dependencies:** T-15, T-17. **Risks:** plan quality. **Code:** Yes. **Legal/Sec:** No. **React gate:** Maybe.
- **Docs:** roadmap D4.

### T-24 — Teacher / classroom mode (B2B)  *(Phase D · P3 · Cx H · Code: Yes)*
- **Owner:** _TBD_
- **Story:** As a teacher, I can manage a class roster, assign practice, and see class progress safely.
- **Acceptance:** Teacher dashboard + rosters + assignments + class view; safety alerts route to teacher (K2); builds on existing RLS multi-tenancy; unlocks school pricing (pricing spec, deferred).
- **Dependencies:** mature parent features; school pricing scope. **Risks:** school data governance. **Code:** Yes. **Legal/Sec:** Yes (school data). **React gate:** Likely.
- **Docs:** roadmap D5; pricing spec (school plan, deferred).

---

## Dependencies graph (high level)
- T-11 (VPC) blocks the *expanded* form of T-06 (try-before-signup retaining data).
- T-12 (pricing design) precedes T-07 (trial enforcement design) → both precede any gated credit-logic implementation.
- T-13 (multi-subject) underpins T-16, T-18.
- T-15 (mastery) + T-17 (mistakes) → T-23 (revision plan).
- T-19 (React island) enables T-20/T-21/T-22 and most of Phase C interactivity.

## Open gaps (mirrors research §9)
- Competitor pricing & Arabic quality: periodic/hands-on refresh.
- Bilingual GCC positioning (T-14): hypothesis until validated.
- School/teacher mode (T-24) + school pricing: deferred until classroom mode scoped.
- AI cost assumptions (T-07/T-12): review against real usage logs post-launch.
