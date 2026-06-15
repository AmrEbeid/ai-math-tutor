# RESEARCH — Competitive & Product Strategy (2026-06-15)

> **Type:** Permanent research record (verified findings + citations). Documentation-only.
> **Method:** Two deep-research passes — adversarial 3-vote verification.
> - Pass 1 (landscape/safety/UX/GCC): 24 sources, 116 claims extracted, 25 verified, **18 confirmed / 7 killed**.
> - Pass 2 (pricing/Arabic): 20 sources, 74 claims extracted, 25 verified, **21 confirmed / 4 killed**.
> **Companion docs:** product strategy → [`SPEC-PRODUCT-learning-companion-strategy`](../specs/SPEC-PRODUCT-learning-companion-strategy.md);
> pricing → [`SPEC-PRICING-packages-credits-cost-model`](../specs/SPEC-PRICING-packages-credits-cost-model.md);
> roadmap → [`SPEC-ROADMAP-product-revamp-implementation`](../specs/SPEC-ROADMAP-product-revamp-implementation.md);
> tasks → [`TASKS-product-strategy-roadmap`](../tasks/TASKS-product-strategy-roadmap.md).

## Reading key & evidence discipline

- ✅ **Confirmed** — source-verified (≥2/3 adversarial votes).
- ⚠️ **NCC (not clearly confirmed)** — refuted in verification, or never tested. **Do not treat as fact.**
- **FACTS and RECOMMENDATIONS are kept separate.** This document holds FACTS; recommendations live in the specs.
- Prices and feature claims are point-in-time snapshots (2025–2026); refresh periodically.

---

## ⚠️ Standing warnings (must survive into all downstream docs/marketing)

1. **Do NOT claim QANDA lacks Arabic** without fresh direct verification — the strong "QANDA does not support Arabic" claim was **refuted 0-3** in Pass 1. Pass 2 found only that Arabic is absent from its *listed UI locales* (weak evidence, 2-1), which is **not** a capability gap.
2. **Do NOT claim "no bilingual K-12 competitor exists"** — that whitespace mapping was **refuted 0-3**. Treat the GCC bilingual opportunity as a **hypothesis to validate**, not a proven gap.
3. **Do NOT use the Duolingo "20% day-1 retention from post-lesson signup" stat** — **refuted 0-3**. The *principle* (try-before-signup) is supported; the *number* is not.
4. **Do NOT use unsupported market-size numbers** — "ME market USD 12.3B in 2025" (1-2) and "GCC $3.02B 2024→$4.47B 2030 @6.74%" (0-3) were **refuted**. Only the IMARC "USD 27.3B by 2034 @ 9.25% CAGR 2026–2034" figure survived, and only as a directional vendor estimate.
5. **Do NOT assume Gauth has an ad-free free tier** (refuted 0-3) or the "$9.99 first month" structure (refuted 0-3); **do NOT use Symbolab "$29.99/yr"** (refuted 1-2) or **Question.AI "40 free scans"** (refuted 0-3).

---

## 1. Regulatory & safety baseline (FACTS — highest confidence)

| # | Claim | Status | Source |
|---|-------|--------|--------|
| R1 | **COPPA** requires verifiable parental consent before collecting personal info from under-13s. April 2025 amendments strengthened; **compliance deadline April 22, 2026** — binding *now* (today is 2026-06-15). | ✅ 3-0 | [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) |
| R2 | **UK Children's Code** — 15 standards; applies to any service *likely to be accessed* by under-18s; **explicitly covers non-UK companies** processing UK children's data; can apply to edtech used in/by schools. | ✅ 3-0 | [ICO Age-Appropriate Design Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-code/) |
| R3 | Conformance requires concrete defaults: geolocation off by default, no nudge techniques, high privacy by default, age-appropriate checks. | ✅ 3-0 | ICO (same) |
| R4 | Recommended child-safe AI architecture: **two-pass moderation** (prompt-level filter before generation + post-generation moderation against a children's policy) + **child age encoded as a hard constraint** in the system prompt via developmental bands. | ✅ 3-0 two-pass; 2-1 age-as-constraint | [eSchoolNews safety-architecture guide](https://www.eschoolnews.com/digital-learning/2026/03/26/building-ai-for-kids-a-developers-guide-to-age-appropriate-safety-architecture/) (vendor piece, corroborated by neutral literature) |

## 2. Khanmigo — the competitor to emulate (FACTS)

| # | Claim | Status | Source |
|---|-------|--------|--------|
| K1 | Khanmigo uses **OpenAI moderation** to auto-review conversations, monitoring **both text and images**. | ✅ 3-0 | [Khan Academy Safety](https://support.khanacademy.org/hc/en-us/articles/14394814244365-What-safety-features-does-Khanmigo-have) |
| K2 | On flagged content it **auto-sends email AND in-platform notifications** to the adult (parent for parent accounts; teacher/admin for school accounts). | ✅ 3-0 | [Khanmigo for Parents](https://www.khanmigo.ai/parents) |
| K3 | Guardrails that **never give the answer** — guides the learner ("what have you tried so far?"). Validates hint-first Socratic design. | ✅ 3-0 | Khan support + parents pages |
| K4 | **Confirmed caveat:** Socratic prompting feels awkward/frustrating for under-8s and in non-math subjects. | ✅ | same |
| K5 | **Pricing:** **$4/mo or $44/yr**; **no free learner tier** (Khan content stays free); **1 parent subscription covers up to 10 children <18** (built-in family plan); **teachers free**. | ✅ 3-0 | [pricing](https://www.khanmigo.ai/pricing), [learners](https://www.khanmigo.ai/learners), [support](https://support.khanacademy.org/hc/en-us/articles/13982227159437) |

## 3. Market & regional opportunity (FACTS — medium confidence, vendor-sourced)

| # | Claim | Status | Source |
|---|-------|--------|--------|
| M1 | Middle East edtech market projected to reach **USD 27.3B by 2034 at 9.25% CAGR (2026–2034)**. Directional (one vendor). | ✅ 3-0, vendor | [IMARC](https://www.imarcgroup.com/middle-east-edtech-market) |
| M2 | GCC edtech market **explicitly segments "By Language: English, Arabic"**; AI adaptive/intelligent tutoring named a key growth opportunity. | ✅ 3-0 | [MarkNtel GCC EdTech](https://www.marknteladvisors.com/research-library/gcc-edtech-market.html) |
| M3 | **QANDA's** signature feature is **OCR photo-scan → full step-by-step solutions** (answer-delivery — the opposite of hint-first). Expanded toward a conversational AI tutor in 2024–25, but OCR remains its core identity. | ✅ 3-0 | [QANDA (Wikipedia)](https://en.wikipedia.org/wiki/QANDA) |
| M4 | **Abwaab** (Jordan MENA edtech) raised **$20M Series A (Nov 2021)**, led by BECO Capital; serves **grades 4–12** with Arabic national-curriculum content — not grades 1–9. | ✅ 3-0 | [TechCrunch](https://techcrunch.com/2021/11/15/abwaab-raises-20m-series-a-led-by-beco-capital-to-expand-across-mena-and-pakistan/), [Arab News](https://www.arabnews.com/node/1968386/business-economy) |
| M5 | **Noon Academy** is a Saudi-developed, **Arabic-native** platform (SA/Egypt/Iraq/Pakistan), free download + IAP; the strongest Arabic incumbent in the set — but an **exam-prep/course-bundle + live-class social-learning** product, **not** a hint-first Socratic tutor for grades 1–9. | ✅ 3-0 | [SA App Store (AR)](https://apps.apple.com/sa/app/%D9%86%D9%88%D9%86-%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A/id1214874641?l=ar) |

## 4. UX / onboarding (FACTS)

| # | Claim | Status | Source |
|---|-------|--------|--------|
| U1 | Onboarding should **deliver core value as fast as possible** + use **progressive disclosure**; long unskippable tours are a named anti-pattern. For Zeluu: first hinted question immediately; defer dashboard/feature explanation. | ✅ 3-0 | [UX Design Institute](https://www.uxdesigninstitute.com/blog/ux-onboarding-best-practices-guide/) |
| U2 | [KaTeX](https://katex.org/docs/options.html) is a fast, synchronous (server- or client-side) math-rendering library — usable on a static frontend. | ✅ primary | KaTeX docs |

## 5. Competitor pricing benchmarks (FACTS)

> All point-in-time 2025–2026. ⚠️ = NCC. Several figures appear only on third-party sites (official pages omit them) — flagged.

| Competitor | Free tier | Monthly | Annual | Family / seats | School/teacher | GCC currency | Status / Source |
|---|---|---|---|---|---|---|---|
| **Khanmigo** | ❌ no free *learner* tier | **$4** | **$44** (save $4) | ✅ up to **10 kids** / 1 sub | teachers **free** | none confirmed | ✅ 3-0 — see K5 |
| **Photomath** | ✅ symbolic step-by-step **free forever** | ⚠️ ~$9.99 (3rd-party) | ⚠️ ~$59.99–69.99 (3rd-party) | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ✅ model 3-0; **price NCC (not on official page)** — [Photomath/Google help](https://support.google.com/photomath/answer/14330572?hl=en) |
| **QANDA** | ✅ limited free AI solutions; 7-day trial | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ✅ freemium 3-0; **price/limit NCC** — [QANDA help](https://qandahelp.qanda.ai/hc/en-us/articles/33323504508569-What-is-QANDA-Premium) |
| **Mathway** | ✅ answers-only + ads; steps locked | **$9.99** | **$39.99** | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ✅ 3-0 free / 2-1 price (primary-confirmed) — [Mathway Premium Terms](https://www.mathway.com/Premium-Terms) |
| **Symbolab** | ✅ (limited) | **$6.99** | ⚠️ NCC ($29.99/yr **refuted**) | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ medium (blog-only) — [review](https://www.myengineeringbuddy.com/blog/symbolab-math-solver-reviews-alternatives-pricing/) |
| **Gauth** (ByteDance) | ⚠️ free exists, **not** ad-free (refuted) | **$11.99** | **$99.99** (~$8.33/mo); qtr **$31.99** | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ✅ annual+qtr 3-0 — [App Store](https://apps.apple.com/us/app/gauth-ai-study-companion/id1542571008) |
| **Noon Academy** (AR-native) | ✅ free + live classes | — (IAP) | — | — | — | **SAR 117.99–1,199.99** per bundle | ✅ 3-0 — [SA App Store](https://apps.apple.com/sa/app/noon-academy/id1214874641) |
| **Abwaab** (AR-native) | ✅ free + IAP | — (per-program) | — | — | — | **EGP 499.99–1,799.99** per program (gr 4–12) | ✅ 3-0 — [EG App Store](https://apps.apple.com/eg/app/abwaab/id1623367993) |
| **Duolingo Super** | ✅ free w/ ads | $6.99 US / $8.15 UK | — | family plan exists (price NCC) | — | **PPP geo**: ~$0.85 EG · ~$5.33 SA · ~$5.99 AE | ⚠️ medium (single aggregator) — [geopriced](https://geopriced.com/cost/duolingo-super) |

**⚠️ Not covered (no surviving claims):** standalone pricing for IXL, Brilliant, ALEKS, Prodigy, Synthesis Tutor, Chegg, Duolingo Math standalone. **No GCC-localized currency tier was source-confirmed for any global AI tutor** (Khanmigo/Mathway/Symbolab/Gauth appear flat-USD as far as sources show).

**Two confirmed market clusters:** (1) cheap flat global AI-tutor subs ($4–12/mo, freemium); (2) expensive MENA-native exam-prep bundles (SAR/EGP hundreds–thousands). Duolingo confirms aggressive **PPP/geo-pricing** is the MENA norm.

## 6. Arabic support by surface (FACTS)

> Load-bearing finding (✅ 3-0): **the differentiation is "Arabic math explanations done well," NOT "Arabic exists."** Arabic *UI* is commoditized; Arabic *math-explanation quality / RTL / OCR / chat / voice* is unconfirmed for every non-native competitor.

| Competitor | UI / RTL | AR math explanations + quality | AR OCR/photo | AR AI chat | AR voice | AR help | Source |
|---|---|---|---|---|---|---|---|
| **Photomath** | ✅ Arabic UI (1 of 32; **interface only — explicitly *not* solution language**) | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | [langs](https://support.google.com/photomath/answer/14328126?hl=en) |
| **Question.AI** | ✅ Arabic UI (1 of 15) | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | [App Store](https://apps.apple.com/us/app/question-ai-math-calculator/id6449486871) |
| **QANDA** | ⚠️ Arabic **not** in listed locales (weak evidence — *not* a capability gap; "no Arabic" was refuted) | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | [Wiki](https://en.wikipedia.org/wiki/QANDA) |
| **Gauth** | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | ⚠️ NCC | (no Arabic claim survived) |
| **Noon Academy** | ✅ Arabic-**native** | ✅ native instruction | ⚠️ NCC | n/a (not Socratic) | ⚠️ NCC | ✅ Arabic | [SA store (AR)](https://apps.apple.com/sa/app/%D9%86%D9%88%D9%86-%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A/id1214874641?l=ar) |
| **Abwaab** | ✅ Arabic-native (national curricula) | ✅ native curriculum content | ⚠️ NCC | n/a | ⚠️ NCC | ✅ Arabic | [EG store](https://apps.apple.com/eg/app/abwaab/id1623367993) |

**⚠️ Hard limit:** confirming competitor Arabic **explanation quality** (fluency, correct RTL math rendering, OCR accuracy, voice) requires **hands-on live-app testing/screenshots** — text sources cannot. This is the load-bearing positioning question and remains NCC. See open gaps.

## 7. Strategic interpretation (FACTS → framing; recommendations live in the specs)

- **Crowded zone:** photo-scan "answer + steps" homework help (QANDA archetype, M3) — commoditized, distrusted by parents/schools.
- **Defensible zone:** guided learning that builds understanding (Khanmigo proof, K1–K3) — rewarded with institutional trust.
- **Safety = table stakes; *communicating* it = differentiator.** COPPA (R1) + UK Children's Code (R2) make moderation/consent mandatory; the edge is making safety **legible to parents**.
- **GCC bilingual = real but unproven at detail level.** Market is language-segmented (M1, M2); native incumbents (Noon M5, Abwaab M4) target older grades / exam-prep, not grades 1–9 Socratic. The opportunity is **Arabic quality + age band + pedagogy**, not "Arabic presence."

---

## 8. Refuted claims (do NOT rely on — full list)

| Refuted claim | Vote | Source |
|---|---|---|
| Duolingo "20% day-1 retention from signup-after-first-lesson" | 0-3 | strivecloud blog |
| "QANDA does not support Arabic → exploitable gap" | 0-3 | (Pass 1) |
| ME market "USD 12.3B in 2025" | 1-2 | IMARC |
| GCC "$3.02B 2024→$4.47B 2030 @6.74%" | 0-3 | MarkNtel |
| "No top-funded MENA startup offers bilingual K-12 math tutoring" / "MENA K-12 limited to marketplaces" | 0-3 | edtechreview |
| "Baims is purely passive video" | 1-2 | thestartupscene |
| Question.AI "40 free scans" limit | 0-3 | App Store |
| Gauth "free tier fully ad-free across all subjects" | 0-3 | dupple |
| Gauth "$9.99 first month then $11.99" | 0-3 | dupple |
| Symbolab "$29.99/year" | 1-2 | myengineeringbuddy |

---

## 9. Open research gaps (carry forward — see also each spec's gaps section)

1. **Verified competitor pricing needs periodic refresh** — app-store IAP/subscription prices change frequently; every figure here is a snapshot. Re-verify before any pricing launch or board deck.
2. **Arabic support *quality* of QANDA / Gauth / Photomath (and broader competitors)** needs **direct hands-on testing** — UI presence is confirmed; explanation fluency / RTL math / OCR / voice are NCC.
3. **Bilingual GCC positioning is a hypothesis** until validated with real users — do not assert competitor Arabic weakness without screenshots.
4. **VPC method** — which verifiable-parental-consent mechanism fits Lemon Squeezy + Supabase to satisfy the April 2025 COPPA amendments (binding now). Needs research + legal review.
5. **AI cost assumptions** in the pricing spec are estimates — review against **actual usage logs after launch**.
6. **Uncovered competitors** — Brilliant, IXL, ALEKS, Prodigy, Synthesis, Chegg, Almentor, Baims produced no surviving pricing/Arabic claims; profile them before a full market deck.

---

## Appendix — source quality notes

- **Primary:** ICO, FTC, Khan Academy support/pricing, KaTeX docs, Mathway Premium Terms, Apple App Store listings (Noon/Abwaab/Gauth/Question.AI), Photomath/Google help.
- **Secondary:** IMARC, MarkNtel, eSchoolNews, QANDA/Wikipedia, TechCrunch, Arab News, UX Design Institute, geopriced.
- **Tertiary (NCC pointers only):** competitor round-up/review blogs.
- Caveats: market-size = commercial-vendor estimates (directional); some ICO/QANDA pages returned 403 to automated fetch (confirmed via titles + independent sources); the safety-architecture guide is a vendor/founder piece (corroborated by neutral literature); age-as-hard-constraint is necessary-not-sufficient over long multi-turn sessions.
