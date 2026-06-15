# SPEC-PRODUCT — Learning Companion Strategy

> **Purpose:** Reframe Zeluu from a math-only tutor to a **child-safe bilingual AI learning
> companion for school subjects, starting with math as the first polished vertical**.
> **Status:** Drafted / awaiting GPT + owner review. **Risk:** Low (docs-only; positioning).
> **Source of facts:** [`RESEARCH-competitive-product-strategy-2026-06-15`](../research/RESEARCH-competitive-product-strategy-2026-06-15.md).
> Companion specs: [pricing](SPEC-PRICING-packages-credits-cost-model.md) · [roadmap](SPEC-ROADMAP-product-revamp-implementation.md) · tasks: [`TASKS-product-strategy-roadmap`](../tasks/TASKS-product-strategy-roadmap.md).
> **Discipline:** FACTS (cited, from the research doc) are kept separate from RECOMMENDATIONS.

---

## 1. Positioning (RECOMMENDATION)

**Zeluu is a child-safe, bilingual (Arabic/English) AI learning companion for school
subjects — that builds understanding instead of handing out answers — starting with math
as its first polished vertical.**

- **Category:** child-safe AI learning companion (not "homework answer app," not "math solver").
- **Pedagogy:** hint-first / Socratic, with a worked-example escape hatch (avoids the
  under-8 frustration confirmed for Khanmigo — research K4).
- **Subjects:** math first; science and English next; the architecture and brand must not
  trap the product as "math tutor only."
- **Trust:** safety made *visible* to parents (the differentiator — see §9).

> **Why not "math tutor only":** the codebase, knowledge-base/RAG, chat pipeline, credits,
> and safety layer are subject-agnostic. Math is the sharpest first wedge (clear right/wrong,
> KaTeX rendering, exam relevance), but naming the product "math tutor" caps the addressable
> market, the pricing narrative (per-subject value), and the long-term vision. Positioning is
> "learning companion, math-first," at every surface (homepage, store listings, copy).

## 2. Target users (RECOMMENDATION)

| Segment | Who | Primary jobs-to-be-done |
|---|---|---|
| **Primary buyer** | Parents of children grades 1–9 in GCC/MENA (Arabic/English households), plus UK/US bilingual families | "Help my child actually learn — safely — without me hovering or paying for a private tutor." |
| **Primary user** | Children grades 1–9 (three age bands: G1–3, G4–6, G7–9) | "Help me get unstuck and understand, in my language, without feeling judged." |
| **Secondary (later)** | Teachers / schools (B2B classroom mode) | "Give my class a safe guided-practice tool with visibility." Deferred — see roadmap. |

## 3. Parent value proposition (RECOMMENDATION)

1. **It teaches, it doesn't cheat** — hint-first guidance builds understanding (contrast with
   scan-and-answer apps; research M3).
2. **You can see everything** — visible safety log, instant alerts on flagged content
   (email + in-app, matching Khanmigo K2), and a weekly progress digest.
3. **Safe by design** — two-pass moderation (R4), database-level per-child data isolation
   (existing Supabase RLS), COPPA / UK-Children's-Code alignment (R1, R2).
4. **In your child's language** — real Arabic explanations, RTL-native, age-appropriate tone.
5. **Fair, family-friendly pricing** — one family plan covers your children; healthy daily
   learning limits (see pricing spec — parent-facing framing is "fair daily learning usage,"
   not "credits").

## 4. Student value proposition (RECOMMENDATION)

1. **Get unstuck fast** — ask in Arabic or English, by text or photo, and get guided steps.
2. **Understand, not just copy** — one step at a time, with checks you can actually follow.
3. **Never a dead end** — "show me a worked example" when guidance isn't enough.
4. **Feels right for my age** — tone, vocabulary, and warmth tuned to my grade band.
5. **See myself improve** — streaks, mastery map, and "try a similar one" practice.

## 5. Subjects roadmap (RECOMMENDATION)

| Phase | Subjects | Rationale |
|---|---|---|
| **V1 (now)** | **Math** (grades 1–9) | Sharpest wedge: objective correctness, KaTeX rendering, exam relevance, existing `exam-prep` surface. |
| **V2** | **Science** | Reuses the guided-explanation + diagram patterns; high GCC curriculum demand. |
| **V3** | **English** (language/literacy) | Leverages bilingual strength; reading/writing support; pairs with Arabic-first households. |
| **Later** | Additional subjects per demand | Architecture is subject-agnostic; gate each on quality bar + curriculum mapping. |

> **Subject rollout principle:** a subject ships only when its *guided-explanation quality*
> meets the math bar (hint-first works, age-banded tone holds, RTL/Arabic is fluent). Breadth
> never precedes quality.

## 6. Math-first MVP rationale (RECOMMENDATION)

- **Objective correctness** makes hint-first pedagogy and mistake analysis tractable.
- **KaTeX** gives an immediate, visible quality jump (research U2) that signals "serious tool."
- **Exam/curriculum relevance** (GCC/UK/US) is strongest in math — drives parent willingness to pay.
- **Existing assets:** the live product already does math chat + vision + `exam-prep.html`.
- **Defensible contrast:** math is exactly where scan-and-answer apps (M3) are weakest
  pedagogically — Zeluu wins by teaching, not solving.

## 7. Arabic/English bilingual positioning (RECOMMENDATION — grounded in FACTS)

- **FACT (research §6):** Arabic *UI presence* is commoditized (Photomath, Question.AI).
  Arabic *math-explanation quality / RTL / OCR / chat / voice* is unconfirmed for every
  non-native competitor. Native Arabic incumbents (Noon M5, Abwaab M4) are exam-prep/older-grade.
- **POSITION on quality, not presence:** *"Arabic math taught well — RTL-native,
  age-appropriate, explained in real Arabic, not machine-translated."*
- **Do NOT** claim "the only Arabic math app" (false) or "QANDA has no Arabic" (refuted — see
  research standing warnings).
- **The unoccupied combination:** grades 1–9 + hint-first Socratic + high-quality Arabic
  explanations + RTL-native + visible parent safety. ⚠️ Validate competitor Arabic *quality*
  with hands-on testing before staking marketing on competitor weakness.

## 8. GCC/MENA opportunity (FACTS + RECOMMENDATION)

- **FACTS:** Market is sizeable/growing and explicitly language-segmented (M1, M2);
  AI tutoring named a growth area; native incumbents skew secondary/exam-prep (M4, M5);
  PPP/geo-pricing is the regional norm (research §5, Duolingo).
- **RECOMMENDATION:** Beachhead = grades 1–9 bilingual GCC families (Saudi, UAE, Egypt
  first). Localize **currency (SAR/AED/EGP)** and Arabic UX as first-class, not an afterthought.
  Expand to schools (B2B) only after parent-trust + outcomes are demonstrated.
- ⚠️ Treat the regional whitespace as a **hypothesis** (the "no bilingual K-12 competitor"
  mapping was refuted) — validate with discovery interviews + competitor hands-on testing.

## 9. Safety / trust positioning (RECOMMENDATION — grounded in FACTS R1–R4, K1–K2)

- Safety is **table stakes** (legally mandatory) but **communicating it is the differentiator**.
- Make safety a **visible product surface**: a Safety & Privacy page in plain language, a
  parent safety/activity log, and instant dual-channel alerts (match/exceed Khanmigo K2).
- Lean on existing strengths: two-pass moderation pipeline (prompt-injection + distress + PII
  + stuck-loop detection already in code), DB-level child isolation (RLS), escaped output.
- **Compliance is a hard gate** (R1, R2) — see VPC task in the roadmap (legal review required).

## 10. Parent dashboard positioning (RECOMMENDATION)

The parent dashboard is **the trust and retention engine**, not an admin panel:
- Visible safety log + alert history (K2); time-on-task + topics + mastery trend; friendly
  per-child usage controls (framed as "daily learning time," not "credits" — see pricing spec).
- Weekly email digest is the highest-leverage trust artifact (low complexity, high signal).

## 11. Why Zeluu must avoid being "just a homework answer machine" (RECOMMENDATION)

- The answer-dump zone is **crowded and commoditized** (QANDA/Photomath/Gauth; research M3, §5)
  and is precisely what parents and schools **distrust**.
- It **erodes learning outcomes** — the one thing parents pay for.
- Image/photo upload must route to **guided steps, never a bare answer** (anti-QANDA).
- Strategic line: *"We won't do your child's homework — we'll make sure they can."*

## 12. Risks & assumptions

| # | Risk / assumption | Type | Mitigation |
|---|---|---|---|
| 1 | Compliance miss (COPPA R1 / UK Children's Code R2) | Risk (critical) | VPC + legal-gate task before any expanded data collection; privacy-by-default. |
| 2 | Bilingual whitespace is unproven (refuted mapping) | Assumption | Validate via discovery + competitor hands-on testing before betting marketing on it. |
| 3 | Pure-Socratic frustrates young kids (K4) | Risk | Age-banded tone + worked-example escape hatch. |
| 4 | Drifting into the answer-dump commodity zone | Risk | Enforce guided-steps for all inputs incl. photo upload. |
| 5 | Multi-subject breadth before quality | Risk | Ship a subject only when it meets the math quality bar. |
| 6 | AI cost per active child unknown at scale | Assumption | Credit metering + post-launch cost review (pricing spec §AI cost). |
| 7 | GCC willingness-to-pay unproven | Assumption | PPP pricing + small paid pilots; refresh pricing benchmarks. |
| 8 | Premature React/Vite migration | Risk | Island-first, only when streaming/whiteboard/graphing demand it (gated). |

## 13. Validation questions (to answer before/at MVP)

1. Will GCC parents pay a monthly family subscription for a guided (not answer-dump) tutor — and at what price point per currency?
2. Is competitor Arabic **explanation quality** actually weak (hands-on test of Photomath/QANDA/Gauth)?
3. Does hint-first + age-banded tone hold attention for grades 1–3 without frustration?
4. Which VPC method satisfies the April 2025 COPPA amendments on the Lemon Squeezy + Supabase stack?
5. Which second subject (science vs English) has the strongest pull in the beachhead market?
6. What is the real blended AI cost per active child once usage logs exist?

---

## Open gaps (mirrors research §9)

- Competitor pricing & Arabic-quality need periodic/direct refresh (hands-on).
- Bilingual GCC positioning = hypothesis until validated.
- School/teacher positioning deferred until classroom mode is scoped.
- AI cost + willingness-to-pay assumptions reviewed against real data post-launch.
