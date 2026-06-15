# SPEC-PRICING — Packages, Credits & Cost Model

> **Purpose:** Recommended pricing packages, credit system, and unit-economics model for Zeluu.
> **Status:** Drafted / awaiting GPT + owner review. **Risk:** Low (docs-only); **High relevance**
> (revenue, payment/webhook/credit logic = hard gate to implement — see CLAUDE.md).
> **Grounded in:** [`RESEARCH-...`](../research/RESEARCH-competitive-product-strategy-2026-06-15.md) §5 (pricing benchmarks)
> + the live credit/Lemon Squeezy model (`README.md`). Companion: [product strategy](SPEC-PRODUCT-learning-companion-strategy.md).
> **Discipline:** FACTS (cited) vs RECOMMENDATIONS vs ASSUMPTIONS are labelled. All money figures are planning estimates — **point-in-time, refresh before launch.**

---

## 0. CRITICAL framing rule (parent-facing vs internal)

> **Do NOT expose credits heavily to parents in marketing.**
> - **Parent-facing copy** uses **"fair daily learning usage" / "healthy daily learning time."**
> - **Backend/internal** uses **credits** as the cost-control + metering lever.
> - Credits may appear in fine print / a usage meter, but the headline parent promise is
>   *time- and usage-fair learning*, never "you bought N credits."

---

## 1. Benchmark anchors (FACTS — from research §5)

- **Khanmigo:** $4/mo or $44/yr; **1 sub covers up to 10 kids**; teachers free; no free learner tier.
- **Mathway:** $9.99/mo, $39.99/yr. **Symbolab:** $6.99/mo. **Gauth:** $11.99/mo, $99.99/yr.
- **Photomath / QANDA:** freemium; exact paid price ⚠️ NCC.
- **MENA-native (Noon, Abwaab):** expensive per-bundle IAP (SAR 118–1,200 / EGP 500–1,800).
- **Duolingo:** PPP geo-pricing in MENA (~$0.85 EG, ~$5.33 SA, ~$5.99 AE). **PPP is the regional norm.**

**Implication (RECOMMENDATION):** anchor the family plan against Khanmigo's family value, price a
modest premium for *bilingual + visible safety*, sit far below MENA exam-prep bundles, and **localize
currency (SAR/AED/EGP)** — no flat USD in MENA.

---

## 2. Free plan = time-limited AND credit-limited (RECOMMENDATION)

The free trial must be bounded on **both** axes so cost is capped and urgency exists:

| Lever | Value |
|---|---|
| Duration | **7 days** |
| Total credits | **50 credits** (whole trial) |
| Daily credit cap | **10 credits/day** |
| Daily time cap | **15 minutes/day/child** |
| Children | 1 child during trial (family unlocked on upgrade) |
| Card required | Follow current model (card-required trial is the live business decision — see tracker Decision Log) |

> Rationale: matches the "deliver value fast + progressive disclosure" onboarding finding (U1),
> caps worst-case trial AI cost (50 × ~$0.002 ≈ **$0.10/trial**), and creates a clear upgrade moment.

---

## 3. Package matrix — PARENT-FACING (RECOMMENDATION)

> Prices are USD planning anchors; **localize to SAR/AED/EGP at launch** (PPP). Annual ≈ ~2 months free.

| Plan | Price (mo) | Price (yr) | Children | "Daily learning" (parent-facing) | Uploads | Voice | Parent dashboard | Safety alerts | Weekly report | Subject progress |
|---|---|---|---|---|---|---|---|---|---|---|
| **Free Trial** | $0 (7 days) | — | 1 | ~15 min/day | Limited (3/day) | ✕ | ✓ (preview) | ✓ | End-of-trial summary | Basic |
| **Family** | **$7.99** | **$59.99** | up to **2** | ~30 min/day/child | 10/day | Limited | ✓ | ✓ (instant, email+in-app) | ✓ weekly | ✓ |
| **Family Premium** | **$12.99** | **$99.99** | up to **4** | ~45 min/day/child | Generous (50/day) | ✓ included | ✓ advanced | ✓ | ✓ weekly | ✓ + mastery map + revision plan |
| **Student Plus** *(optional, later)* | **$9.99** | **$79.99** | 1 (older/self-driven) | ~60 min/day | Generous | ✓ | ✓ | ✓ | ✓ | ✓ + mastery + revision |
| **School/Teacher Pilot** *(optional, later — DEFERRED)* | per-seat (indicative $2–3/seat/mo, min seats) | — | per roster | per policy | per policy | per policy | Teacher dashboard | ✓ (teacher routing) | ✓ | ✓ class-level |

> **Student Plus** and **School/Teacher Pilot** are explicitly **later/optional** — School pilot is
> **deferred until classroom mode is scoped** (see roadmap + open gaps).

---

## 4. Package matrix — INTERNAL (credits & caps for cost control)

> Internal metering. Daily caps prevent single-day cost spikes; monthly credits bound worst-case cost.

| Plan | Monthly credits | Daily cap/child | Time/day/child | Upload limit | Voice limit |
|---|---|---|---|---|---|
| **Free Trial** | 50 total (7 days) | 10 | 15 min | 3/day | 0 |
| **Family** | **600** | 20 | 30 min | 10/day | ~30 min/mo |
| **Family Premium** | **1,500** | 30 | 45 min | 50/day | ~60 min/mo |
| **Student Plus** (later) | **1,000** | 40 | 60 min | 50/day | ~60 min/mo |
| **School/Teacher Pilot** (later) | per-seat allocation (TBD when scoped) | TBD | TBD | TBD | TBD |

---

## 5. Credit consumption rules by action (RECOMMENDATION)

> **Live system today** meters **1 credit / 5 text messages** and **1 credit / 2 image messages**
> (`README.md`). This spec **recommends migrating to per-action metering** below for clearer cost
> control and per-feature economics. **Implementation is a hard gate** (credit/payment logic).

| Action | Credits | Notes |
|---|---|---|
| Text tutoring exchange (1 question + guided response) | **1** | The core unit. |
| Photo / image problem solve (vision) | **3** | Higher token + vision cost. Always routes to *guided steps*, never a bare answer. |
| Voice interaction (per ~1 min or per exchange) | **2** | Gated to plans with voice. |
| Practice set generation (5–10 problems) | **2** | Practice generator. |
| AI quiz generation | **2** | Quiz/exam mode. |
| Mistake analysis report | **1** | Per analysed session/topic. |
| Weekly revision plan | **0** | System batch job; internal cost absorbed (or 1 if on-demand). |
| Re-reading a past/cached explanation | **0** | No new generation. |

---

## 6. Cost assumptions (ASSUMPTIONS — verify against live logs)

| Assumption | Planning value | Flag |
|---|---|---|
| AI model | OpenAI `gpt-4o-mini` (chat + vision) + `text-embedding-3-small` (RAG) | FACT (live stack) |
| Blended AI cost per credit | **~$0.002/credit** (text exchange ≈ 1.5K input + 0.5K output incl. RAG context; vision/voice weighted higher) | ⚠️ ASSUMPTION — exact API token prices change; **verify against actual usage logs post-launch** (open gap) |
| Realistic credit utilization | **~55%** of monthly allotment (most families under-consume) | ⚠️ ASSUMPTION — measure post-launch |
| Payment / MoR fee (Lemon Squeezy, Merchant of Record) | **~5% + $0.50 per transaction** | ⚠️ ASSUMPTION — **verify current Lemon Squeezy MoR fees** before launch |

---

## 7. Unit economics — gross profit & margin logic (planning model)

> Method: **net revenue** = price − MoR fee; **gross profit** = net revenue − AI cost; **margin** =
> gross profit ÷ price. Two AI-cost scenarios shown: **worst-case (100% credits used)** and
> **realistic (~55%)**. All figures are planning estimates (see §6 flags).

### Monthly plans (worst-case AI cost)
| Plan | Price | MoR fee (~5%+$0.50) | AI worst (credits×$0.002) | Net rev | Gross profit | Margin |
|---|---|---|---|---|---|---|
| Family | $7.99 | $0.90 | 600×$0.002 = $1.20 | $7.09 | **$5.89** | **~74%** |
| Family Premium | $12.99 | $1.15 | 1,500×$0.002 = $3.00 | $11.84 | **$8.84** | **~68%** |
| Student Plus (later) | $9.99 | $1.00 | 1,000×$0.002 = $2.00 | $8.99 | **$6.99** | **~70%** |

### Realistic (~55% utilization) — Family monthly
- AI cost ≈ 600 × 0.55 × $0.002 = **$0.66** → gross profit ≈ $7.09 − $0.66 = **$6.43** → margin **~80%**.

### Annual plans (amortized per month, worst-case)
| Plan | Annual price | /mo equiv | MoR/yr (~5%+$0.50) → /mo | AI worst /mo | GP /mo | Margin |
|---|---|---|---|---|---|---|
| Family | $59.99 | $5.00 | $3.50/yr → $0.29 | $1.20 | **$3.51** | **~70%** |
| Family Premium | $99.99 | $8.33 | $5.50/yr → $0.46 | $3.00 | **$4.87** | **~58%** |

> Annual trades margin for commitment/LTV and lower churn — acceptable. **All plans clear a healthy
> gross margin even at worst-case 100% credit consumption**, which is the point of credit caps.

---

## 8. Extra credit packs (RECOMMENDATION)

> For heavy-use bursts (exam season, multiple children). Add-on, **not** the habit-forming plan.
> Parent-facing as "extra learning time top-up."

| Pack | Credits | Price | AI worst | MoR | Gross profit | Margin |
|---|---|---|---|---|---|---|
| Top-up S | +100 | $1.99 | $0.20 | $0.60 | $1.19 | ~60% |
| Top-up M | +300 | $4.99 | $0.60 | $0.75 | $3.64 | ~73% |
| Top-up L | +1,000 | $12.99 | $2.00 | $1.15 | $9.84 | ~76% |

> Credit packs reuse the existing Lemon Squeezy credit-pack + append-only ledger plumbing.

---

## 9. Recommended pricing model (RECOMMENDATION — summary)

1. **Free Trial as activation** (7-day, 50-credit, 10/day, 15 min/day) — bounded cost, clear upgrade moment.
2. **Family plan = the core, hero plan** — anchored vs Khanmigo's family value, premium for bilingual + visible safety.
3. **Family Premium** for power households (more children, voice, mastery map, revision plan).
4. **Credit packs** as burst add-ons.
5. **PPP currency localization (SAR/AED/EGP) is mandatory**, not optional.
6. **Student Plus + School/Teacher Pilot deferred** (later/optional; school pilot waits on classroom mode).
7. Parent-facing = "fair daily learning usage"; credits stay an internal lever.

---

## 10. Implementation gates (from CLAUDE.md)

- Any change to **credit grant/deduction, package definitions, webhook, or Lemon Squeezy logic** is a
  **hard gate** — explicit owner approval + manual review required before code.
- Per-action credit metering (§5) and new package/plan definitions are **medium/high-risk** changes;
  design first (this spec), then a gated implementation slice.
- Currency localization touches checkout/variant config — verify against the live LS store/variants.

## 11. Open gaps (pricing-specific; mirrors research §9)

- **Verified competitor pricing needs periodic refresh** — figures are snapshots; Photomath/QANDA exact prices NCC.
- **AI cost + utilization assumptions** must be reviewed against **actual usage logs after launch**.
- **Lemon Squeezy MoR fee** must be confirmed against current LS terms.
- **GCC willingness-to-pay** unproven — validate with small paid pilots + PPP experiments.
- **School/teacher pricing** deferred until classroom mode is scoped.
