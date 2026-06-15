# SPEC-ROADMAP — Product Revamp Implementation

> **Purpose:** Prioritized implementation roadmap for the Zeluu revamp, adapted to the
> **all-subject child-safe bilingual learning companion (math-first)** positioning.
> **Status:** Drafted / awaiting GPT + owner review. **Risk:** Low (docs-only); items carry their own risk + gates.
> **Grounded in:** [`RESEARCH-...`](../research/RESEARCH-competitive-product-strategy-2026-06-15.md),
> [product strategy](SPEC-PRODUCT-learning-companion-strategy.md), [pricing](SPEC-PRICING-packages-credits-cost-model.md).
> **Executable backlog:** [`TASKS-product-strategy-roadmap`](../tasks/TASKS-product-strategy-roadmap.md).
> **Reading:** Cx = complexity L/M/H · Pri = Must/Should/Nice · ✅ = inspiration verified in research.
> **Subject-agnostic principle:** build tutor features as **subject-agnostic** with math as the first
> tuned vertical — never hard-wire "math only" into data models, prompts, or UX copy.

---

## Phase A — Quick wins (1–2 weeks) — current static stack

| # | Feature | Description | User problem | Inspiration | Impact | Cx | Pri | Tech notes |
|---|---|---|---|---|---|---|---|---|
| A1 | **KaTeX / rich formatting** | Render math + structured explanations (steps, lists, code) properly in chat + explanations | Plain-text math/structure looks broken | research U2; Photomath/Symbolab (NCC) | High | L | **Must** | [KaTeX](https://katex.org/docs/options.html) synchronous client-side; **preserve XSS escaping** (REVIEW-FIX-1) — render only from sanitized tokens. Build the renderer subject-agnostic (math now, diagrams/markup later). |
| A2 | **Streaming responses** | Token-by-token tutor replies + typing indicator | "Long wait then wall of text" feels dead | generic AI chat UX | High | M | **Should** | SSE from a Vercel function; reuse existing OpenAI seam; non-stream fallback; no change to credit deduction. |
| A3 | **Worked-example escape hatch** | Button → one fully worked *parallel* example (never the submitted problem) | Pure Socratic frustrates younger kids | Khanmigo weakness ✅ (K4) | Med | L | **Should** | Prompt variant; guard against solving the exact input; logged. |
| A4 | **Weekly parent digest** | Auto email: time-on-task, topics/subjects, safety flags | Parents can't see value/safety | Khanmigo ✅ (K2) | High | L–M | **Must** | pg_cron + existing notification pipeline; **no child message content / PII in logs** (CLAUDE.md). |
| A5 | **Safety & Privacy page** | Plain-language COPPA/Children's-Code/moderation explainer | Parents need legible trust | ICO/COPPA ✅ (R1–R3) | Med–High | L | **Must** | Static page; cite two-pass moderation + RLS isolation. |

## Phase B — MVP improvements (2–6 weeks) — mostly static, light React islands

| # | Feature | Description | User problem | Inspiration | Impact | Cx | Pri | Tech notes |
|---|---|---|---|---|---|---|---|---|
| B1 | **Try-before-signup first learning session** | Child completes one guided question before any account wall | Signup friction kills activation | onboarding ✅ (U1) | High | M | **Must** | Anonymous capped session; **no child PII pre-consent** (R1); parent account+consent after the aha. |
| B2 | **Free-trial time + credit limits** | Enforce 7-day / 50-credit / 10-per-day / 15-min/day caps | Bound cost + create upgrade moment | pricing spec §2 | High | M | **Must** | Server-enforced caps; ties to credit metering (gated — payment/credit logic). |
| B3 | **Age-banded tutor tone** | G1–3 / 4–6 / 7–9 prompt bands tune warmth/length/vocab | One tone can't fit a 6- & 14-year-old | safety arch ✅ (R4), Khanmigo gap (K4) | High | M | **Must** | Age encoded as **hard constraint** (R4); store band on child profile; periodic re-grounding over long sessions. Subject-agnostic. |
| B4 | **Step-reveal / guided explanation layout** | One step at a time + check-for-understanding | Full solutions enable copying, not learning | anti-QANDA ✅ (M3) | High | M | **Must** | Layout + prompt structure; applies to all subjects (math first). |
| B5 | **Instant safety alerts (dual-channel)** | Email + in-app parent alert on flagged content | Safety invisible → low trust | Khanmigo ✅ (K1, K2) | High | M | **Must** | Surface existing distress/PII detection; dedup once-per-session (already built); parent (later teacher) routing. |
| B6 | **COPPA / VPC research + legal gate** | Choose & design verifiable parental consent | Legally binding now (R1) | FTC ✅ (R1), ICO (R2) | Critical | M | **Must** | **Hard gate: owner + legal review.** Research VPC method for Lemon Squeezy + Supabase; privacy-by-default, geolocation off, no nudge (R3). |
| B7 | **Pricing/credits implementation design** | Design per-action metering + new packages | Cost control + new plans | pricing spec §3–§8 | High | M | **Should** | Design-only here; implementation is a **hard gate** (credit/payment logic). |

## Phase C — Strategic features (2–4 months) — React/Vite island for the tutor app

| # | Feature | Description | Inspiration | Impact | Cx | Pri | Tech notes |
|---|---|---|---|---|---|---|---|
| C1 | **Multi-subject tutor modes** | Add Science, then English as selectable subjects; subject-aware prompts/knowledge | strategy §5 | High | H | **Should** | Subject-agnostic chat + per-subject system prompts + RAG knowledge sets; ship per subject only at quality bar. |
| C2 | **Arabic/English + RTL-native UX** | Full Arabic UI, RTL math/layout, Arabic Socratic tone | research §6, M2 | High | H | **Should** | Build on UI-7 RTL foundation; **validate demand + competitor Arabic quality first**. Native-speaker tone review. |
| C3 | **Subject mastery map** | Curriculum-aligned topic map colored by mastery | IXL/ALEKS (NCC) | High | H | **Should** | Needs a per-subject skill taxonomy; RAG assists. |
| C4 | **Practice generator** | "Try a similar one" / generated practice sets | ALEKS/IXL (NCC) | High | M–H | **Should** | LLM-generated, curriculum-tagged; metered (pricing §5). |
| C5 | **Mistake analysis** | Detect recurring error patterns per child | ALEKS (NCC) | High | M–H | **Should** | Log error types per session/topic; feeds revision plan + parent digest. |
| C6 | **Curriculum / exam mode** | Aligned practice + exam prep (GCC/UK/US), per subject | Abwaab exam focus ✅ (M4) | High | H | **Should** | Curriculum mapping is the real work; `exam-prep.html` exists as a seed. |
| C7 | **React/Vite island-first migration** | Migrate the child tutor app to a React island only where needed | — | Enabling | H | **Should** | **GATED** (CLAUDE.md). Island-first (chat surface); keep marketing/legal static. Trigger = streaming/whiteboard/graphing demand. |

## Phase D — Differentiating features (4–12 months)

| # | Feature | Description | Inspiration | Impact | Cx | Pri | Tech notes |
|---|---|---|---|---|---|---|---|
| D1 | **Voice tutor (Arabic + English)** | Speak questions / hear guidance | Synthesis (NCC) | High | H | **Could** | STT/TTS with Arabic support; latency + cost gates; metered. |
| D2 | **Whiteboard / sketch input** | Hand-write math/work → guided feedback | Photomath handwriting (NCC) | High | H | **Could** | React island + handwriting recognition. |
| D3 | **Interactive graphing** | Manipulable graphs (functions/geometry) | Desmos-style (NCC) | Med–High | H | **Could** | React island. |
| D4 | **Adaptive revision plan** | AI weekly plan from mistakes + mastery, per subject | ALEKS (NCC) | High | H | **Could** | Depends on C3 (mastery) + C5 (mistakes). |
| D5 | **Teacher / classroom mode (B2B)** | Teacher dashboard, rosters, assignments, class view | Khanmigo schools ✅ (K2 routing) | High | H | **Should (later)** | Builds on existing RLS multi-tenancy; unlocks school pricing (pricing spec). |

---

## Immediate next sprint (RECOMMENDATION)

1. A1 KaTeX / rich formatting
2. A2 Streaming spike
3. A4 Weekly parent digest
4. B2 Free-trial time + credit enforcement **design**
5. B6 COPPA / VPC research + legal gate
6. A5 Safety & Privacy page
7. B3 Age-banded tutor tone
8. B7 Pricing/credits implementation **design**

> Sequencing notes: A1/A2/A4/A5 ship on the static stack with no hard gate. B6 (compliance) is
> **critical and legally binding now** — open it immediately even though it's a gated/legal item.
> B2/B7 are **design-only** this sprint (implementation of credit/payment logic is a hard gate).

---

## Product revamp by surface (RECOMMENDATION)

> Carried over from the precursor research draft and adapted to the all-subject (math-first)
> positioning. Tagged static vs needs-React. Citations use the research-doc labels (R/K/M/U).

- **Homepage** *(static)* — lead with the hint-first virtue + trust, not features. Three above-the-fold
  trust signals (never gives the answer K3; every message safety-checked + instant alert K1/K2; built
  bilingual). Try-before-signup CTA (U1). Parent-proof section (alert + digest screenshot). Bilingual
  toggle with RTL mirror. Frame as a *learning companion* (math-first), not "math tutor only."
- **Student dashboard** *(static → React island)* — "Continue learning" hero + streak/daily-goal ring;
  subject mastery map later; sparse + large tap targets for young kids; subject switcher when V2 lands.
- **AI tutor / chat screen** *(static; streaming + whiteboard need React)* — KaTeX/rich formatting inline;
  streaming + typing indicator; age-banded tone (R4, K4); "show worked example" escape hatch;
  image→guided steps (not answer dump, M3); visible "a grown-up can see this chat" affordance.
- **Math (and subject) answer/explanation layout** *(static)* — step cards revealed one at a time +
  check-for-understanding; KaTeX everywhere; "Try a similar one" hook.
- **Parent dashboard** *(static → richer React)* — **the differentiation surface**: safety/activity log,
  dual-channel alert history (K2), time-on-task, subjects/topics, mastery trend; weekly email digest;
  friendly per-child limits (framed as "daily learning time," not credits).
- **Progress tracking** *(React island, medium-term)* — mastery map + streaks/badges tied to real skill
  progress; curriculum-aligned ("on track for Grade 5 fractions").
- **Pricing page** *(static)* — reframe from raw credits to outcomes + plans (Free Trial / Family /
  Family Premium / credit-pack top-ups); clear 7-day trial; localized currency (SAR/AED/EGP).
  ⚠️ Verify competitor price points first.
- **Onboarding** *(static)* — child completes one learning session before any account (U1); lightweight
  parent account + consent (COPPA VPC, R1) after the aha; progressive disclosure; capture
  age/grade/language/subject.
- **Safety / trust messaging** *(static)* — dedicated Safety & Privacy page explaining two-pass
  moderation (R4), alerts (K2), RLS isolation, COPPA/Children's-Code alignment (R1, R2).
- **Mobile UX** *(static, PWA)* — push installability + offline review; one-hand input; RTL-correct;
  graceful streaming on slow networks.

## Founder-ready summary (RECOMMENDATION)

> Carried over from the precursor draft; feature/UX items map to the tasks in
> [`TASKS-product-strategy-roadmap`](../tasks/TASKS-product-strategy-roadmap.md).

**Top 10 features to build first:** 1) KaTeX/rich formatting (A1/T-01) · 2) Try-before-signup (B1/T-06)
· 3) Verifiable parental consent — legally binding now (B6/T-11) · 4) Weekly parent digest (A4/T-04) ·
5) Instant dual-channel safety alerts (B5/T-10) · 6) Age-banded tutor tone (B3/T-08) · 7) Step-reveal
layout (B4/T-09) · 8) Response streaming (A2/T-02) · 9) Worked-example escape hatch (A3/T-03) ·
10) Safety & Privacy page (A5/T-05).

**Top 10 UX changes:** 1) Child completes a session before any signup wall · 2) Math renders as math
everywhere · 3) Replies stream with a typing indicator · 4) Step cards one at a time + understanding
checks · 5) Dashboard leads with "Continue learning" · 6) Parent dashboard shows a safety log + alert
history · 7) Age-appropriate tone/vocab/length · 8) Streak ring + daily goal on the student home ·
9) Header bilingual toggle with true RTL mirroring · 10) Homepage leads with hint-first promise + trust.

**Top 5 differentiation opportunities** (see also [strategy spec](SPEC-PRODUCT-learning-companion-strategy.md) §7, §9):
1) Hint-first pedagogy as a brand (research §7, K3, M3) · 2) Parent-trust as a product surface (K1, K2)
· 3) Bilingual Arabic/English, RTL-native, grades 1–9 GCC (M2, M4) — *validate first* · 4) DB-level
child data isolation (RLS) as a marketed trust claim · 5) Age-banded warmth winning where Khanmigo
frustrates under-8s (K4).

**Top 5 risks to avoid** (see also strategy spec §12): 1) Compliance miss — COPPA (R1) + UK Children's
Code (R2); legal-gate it · 2) Betting positioning on refuted claims (QANDA Arabic gap; no-bilingual-
competitor) · 3) Premature React/Vite big-bang — island-migrate only the tutor surface (C7, gated) ·
4) Drifting into the commodity answer-dump zone (M3) · 5) Pure-Socratic rigidity frustrating young kids (K4).

**Suggested MVP scope (~6 weeks):** KaTeX (T-01) + streaming (T-02) + worked-example escape hatch (T-03)
+ try-before-signup (T-06) + age-banded tone (T-08) + step-reveal (T-09) + weekly digest (T-04) +
instant safety alerts (T-10) + Safety & Privacy page (T-05) + **COPPA consent design (T-11, legal-gated)**.
All but the React items ship on the static stack.

**Long-term vision (12–24 months):** the trusted bilingual AI **learning companion** for GCC families —
Arabic/English, grades 1–9, multi-subject (math → science → English), that builds understanding (never
just answers), proves its safety to parents, adapts to each child's mastery and mistakes, and expands
from home into the classroom (B2B). React-island tutor with voice + whiteboard + graphing;
curriculum-aligned mastery map; adaptive revision plan; teacher tier on the existing multi-tenant RLS foundation.

## Cross-cutting gates (from CLAUDE.md)

- **Hard gates (owner approval required before code):** credit/payment/webhook/Lemon Squeezy changes
  (B2, B7), auth/child-token/RLS changes, migrations, dependency installs, React/Vite migration (C7), deploys.
- **Legal/security review required:** B6 (VPC/COPPA), any expanded child-data collection.
- **No product code in the docs phase** — every item above is design/spec until an approved slice.

## Open gaps (mirrors research §9)

- Competitor pricing & Arabic quality: periodic/hands-on refresh.
- Bilingual GCC positioning (C2): hypothesis until validated.
- School/teacher mode (D5) + school pricing: deferred until classroom mode scoped.
- AI cost assumptions (B2/B7): review against real usage logs post-launch.
