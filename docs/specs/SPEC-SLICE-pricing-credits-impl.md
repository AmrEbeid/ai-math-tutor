# SPEC-SLICE — Pricing / Credits Implementation DESIGN (T-12)

> **Purpose:** Implementation design that maps the recommended pricing model to concrete,
> gate-aware build slices: per-action credit metering, package/plan definitions, Lemon Squeezy
> (LS) variant mapping, PPP currency localization, and extra credit packs.
> **Status:** Drafted (design-only) — awaiting GPT + owner review. **Risk:** Low to write;
> **High to implement** (credit/payment/webhook/LS logic + Supabase migration = hard gate, CLAUDE.md).
> **Grounds in:** [`SPEC-PRICING-packages-credits-cost-model`](SPEC-PRICING-packages-credits-cost-model.md)
> (the economics — FACTS/RECOMMENDATIONS/ASSUMPTIONS), the live credit/LS plumbing
> (`api/webhooks/lemonsqueezy.js`, `api/chat.js`), and the live schema (`supabase/migrations/live/`).
> **Companion:** [`SPEC-SLICE-trial-enforcement`](SPEC-SLICE-trial-enforcement.md) — that slice owns the
> trial window + time cap and **defers per-action metering to this doc** (§3.4 there → §2 here).
> **Discipline:** No product code is written from this doc. Every implementation step is a gated slice.

---

## 0. Scope & non-goals

**In scope (design only):**
1. Per-action credit metering (replace the message-count modulo) — §2.
2. Package/plan definitions as data/config (not hard-coded) — §3.
3. LS variant mapping for plans + extra packs, incl. PPP currencies — §4.
4. Migration path from today's metering to per-action, with rollback — §5.

**Out of scope / deferred:** the trial window + daily time cap (owned by `SPEC-SLICE-trial-enforcement`);
voice metering until voice ships (T-20); Student Plus / School pilot variants (pricing spec marks them
later/deferred); actual price/currency numbers at launch (refresh per pricing spec §6/§11 before build).

---

## 1. What exists today (FACTS — verified in code)

- **Metering:** `api/chat.js` `finalizeTurn()` meters **1 credit / 5 text messages** and **1 / 2 image
  messages** via a modulo on the per-session user-message count, then calls RPC
  `deduct_credit(p_parent_id, p_session_id)`. Balance via `get_valid_credit_balance(p_parent_id)` (expiry-aware).
- **Caps:** `children.credit_limit_daily / _weekly / _monthly` columns + RPC `get_child_limits_summary(p_child_id)`
  (checked in `api/chat.js` step 2, before the AI call).
- **Grant/ledger:** append-only `credit_ledger`; `api/webhooks/lemonsqueezy.js` grants credits on
  `order_created` / `subscription_created` from `customData.credits` + `plan_name`, with `type` ∈
  {`trial`,`subscription`,`purchase`} and idempotency on the payment reference.
- **Webhook custom-data fields already read:** `user_id`, `credits`, `plan_name`, `plan_id`,
  `billing_cycle`, `product_type`, `max_children`.

**Implication:** the grant side, ledger, balance, and cap machinery already exist. The two design gaps are
**(a)** per-action metering on the *deduction* side and **(b)** a plan/variant catalog so packages and
PPP currencies are config, not scattered magic values.

---

## 2. Per-action credit metering (DESIGN — replaces the modulo)

Pricing spec §5 recommends explicit per-action costs. Proposed canonical cost table (single source of truth):

| Action (internal key) | Credits | Trigger today / future hook |
|---|---|---|
| `text_exchange` | **1** | a normal chat turn (`api/chat.js`) |
| `image_solve` | **3** | turn with `image` present (vision) |
| `voice_exchange` | **2** | future (T-20); gated to voice plans |
| `practice_set` | **2** | future practice generator (T-16) |
| `quiz_gen` | **2** | future quiz/exam mode (T-18) |
| `mistake_report` | **1** | future mistake analysis (T-17) |
| `weekly_plan` | **0** | system batch (T-04/T-23); internal cost absorbed |
| `reread_cached` | **0** | re-render of an existing message; no new generation |

**Design choices:**
- **Config, not constants:** a single `ACTION_CREDIT_COSTS` map (a `lib/credits.js` module + a mirrored
  DB row/table for RPC-side enforcement) so cost changes are one edit and the client can never set cost.
- **Cost is derived server-side** from the request shape (image present → `image_solve`, else `text_exchange`),
  never trusted from the body — same principle as `child_id`-from-session.
- **Deduction point:** `finalizeTurn()` switches from `count % N === 0` to “deduct `cost(action)` for this turn.”
  This needs `deduct_credit` to accept an **amount** (`deduct_credit(p_parent_id, p_session_id, p_amount)`),
  or a new `deduct_credits_amount` RPC — a **migration/RPC change = hard gate**.
- **Zero-cost actions** (`weekly_plan`, `reread_cached`) must early-return before any deduction.
- **Cap interaction:** per-action cost feeds the existing daily/weekly/monthly caps unchanged; the trial’s
  total-50 + 10/day caps (trial slice) read the same ledger sums.

> The trial-enforcement slice’s §3.4 + authored migration DDL is the trial-scoped view of this; this table
> is the **product-wide** source of truth it should reference.

---

## 3. Package / plan definitions (DESIGN — make them data)

From pricing spec §3 (parent-facing) + §4 (internal caps). Proposed plan catalog (config + DB-backed):

| Plan key | Parent label | Monthly credits | Daily cap/child | Children | Voice | Notes |
|---|---|---|---|---|---|---|
| `free_trial` | Free Trial | 50 (7-day total) | 10 | 1 | ✕ | trial slice owns window/time cap |
| `family` | Family | 600 | 20 | 2 | ✕ | hero plan |
| `family_premium` | Family Premium | 1,500 | 30 | 4 | ✓ | adds mastery/revision (later features) |
| `student_plus` | Student Plus | 1,000 | 40 | 1 | ✓ | **later/optional** — not in first build |
| `school_pilot` | School/Teacher | per-seat (TBD) | TBD | roster | TBD | **deferred** until classroom mode scoped |

**Design choices:**
- A `plans` catalog (seed/config) keyed by `plan_key`, holding `credits_per_month`, `daily_cap`,
  `max_children`, `voice_enabled`. The webhook’s `plan_name`/`max_children`/`credits` map onto a `plan_key`
  rather than free-form strings, so grants and caps stay consistent.
- Parent-facing copy uses **“fair daily learning usage”** (pricing spec §0); credits stay internal.
- Only `free_trial`, `family`, `family_premium` are in the **first implementation slice**; the rest are
  catalog entries marked inactive.

---

## 4. Lemon Squeezy variant mapping (DESIGN — incl. PPP)

LS is the Merchant of Record; each purchasable = an LS **variant** carrying `custom_data`. Proposed mapping
(variant IDs are placeholders — **must be read from the live LS store before any build**, pricing spec §10):

### 4.1 Subscriptions

| Plan | Cycle | `custom_data` to send | LS variant |
|---|---|---|---|
| Family | monthly | `{plan_name:"family", plan_id:"family_m", credits:600, max_children:2, billing_cycle:"monthly", product_type:"subscription"}` | `⟨family_monthly⟩` |
| Family | annual | same, `plan_id:"family_y"`, `billing_cycle:"annual"` | `⟨family_annual⟩` |
| Family Premium | monthly | `{plan_name:"family_premium", credits:1500, max_children:4, …}` | `⟨premium_monthly⟩` |
| Family Premium | annual | same, annual | `⟨premium_annual⟩` |

### 4.2 Extra credit packs (one-time — pricing spec §8)

| Pack | `custom_data` | LS variant |
|---|---|---|
| Top-up S (+100) | `{product_type:"credit_pack", plan_id:"topup_s", credits:100}` | `⟨topup_s⟩` |
| Top-up M (+300) | `{…, plan_id:"topup_m", credits:300}` | `⟨topup_m⟩` |
| Top-up L (+1,000) | `{…, plan_id:"topup_l", credits:1000}` | `⟨topup_l⟩` |

> Packs reuse the existing `order_created` → `credit_ledger` (`type:"purchase"`) path **unchanged** —
> no webhook logic change for packs beyond registering the variants.

### 4.3 PPP currency localization (mandatory — pricing spec §1/§9)

- PPP is the regional norm (Duolingo precedent). **Each plan/pack needs a per-currency LS variant**
  (USD, **SAR, AED, EGP**) — LS variants are single-currency, so this is **N plans × M currencies** variants.
- `custom_data` (credits / plan_name / caps) is **identical across currencies** — only price/variant differs,
  so the webhook and metering are currency-agnostic. Currency selection is a **checkout/storefront** concern,
  not a credit-logic concern.
- Build-time task: a variant-ID registry (config) mapping `(plan_key, cycle, currency) → variant_id`, plus a
  reverse map the webhook can use to resolve an incoming variant back to a `plan_key` defensively.

---

## 5. Migration path (DESIGN — current → per-action)

Ordered, each step a **separate gated slice** (none performed here):

1. **Catalog first (low-risk, no metering change):** introduce `ACTION_CREDIT_COSTS` + `plans` config and a
   read-only `creditCostForTurn(req)` helper, **logged but not yet deducted** (shadow mode). Validate the
   derived cost matches expectations against live request shapes. *(Medium risk; no payment change.)*
   → **DONE (config half):** `lib/credits.js` (+`tests/credits.test.mjs`) ships the `ACTION_CREDIT_COSTS`
   table + `creditCostForAction()` / `creditCostForTurn()`, **pure and unwired** (no importer in `api/`,
   so deduction is unchanged). The **`plans` catalog** is also done: `lib/plans.js`
   (+`tests/plans.test.mjs`) ships the per-plan credits/caps/children/voice numbers (§3) +
   `getPlan`/`listActivePlans`/`resolvePlanKey`, **pure and unwired**. Remaining for this step: the
   shadow-mode *logging* wire-in to `api/chat.js` (that wire-in touches the chat path → its own small
   reviewed slice).
2. **RPC amount support (hard gate):** add `deduct_credit(..., p_amount)` (or `deduct_credits_amount`) via a
   reviewed Supabase migration; keep the old signature working. *(Hard gate — migration + credit logic.)*
3. **Cut over deduction (hard gate):** `finalizeTurn()` deducts `creditCostForTurn()` instead of the modulo;
   feature-flag so it can revert to modulo instantly. *(Hard gate — credit logic.)*
4. **LS variants + PPP (hard gate):** register subscription/pack/currency variants; add the variant→plan_key
   reverse map to the webhook. *(Hard gate — webhook/LS logic.)*
5. **Retire modulo:** remove the message-count path once per-action is verified in production.

**Rollback:** steps 1 and 4’s registry are additive; steps 3’s cutover is flag-guarded (flip back to modulo);
the RPC keeps its old signature so step 2 is non-breaking.

---

## 6. Acceptance (for the FUTURE gated implementation — not this task)

- Action cost is **server-derived**, config-driven, and a child token can never influence it.
- Deduction equals the per-action table; daily/weekly/monthly + trial caps still enforced from the ledger.
- Paid plans’ grants map cleanly via `plan_key`; packs grant via the unchanged purchase path.
- Each currency resolves to the correct credits/caps (currency-agnostic `custom_data`).
- Parent-facing copy stays “fair daily learning usage,” never “you bought N credits.”

## 7. Gates (CLAUDE.md)

- 🔴 **Hard gate** to implement any of: `deduct_credit`/RPC change, `finalizeTurn` deduction change, webhook
  changes, LS variant/currency config, package definitions, credit-grant logic, any Supabase migration.
- 🟡 **Medium** (small PR + validation): the shadow-mode cost helper + plan/cost **config modules** that are
  *not yet wired to deduction* (step 1) — read-only, no payment effect.
- This doc itself is **docs-only, low-risk**.

## 8. Open gaps (carry forward)

- **Live LS variant IDs + current MoR fees** unverified — must be read from the live store before build
  (pricing spec §6/§11).
- **AI cost-per-credit + ~55% utilization** are assumptions — verify against live usage logs post-launch.
- **PPP price points** per currency need a willingness-to-pay/pilot check (pricing spec §11).
- **Exact `plans`/cost storage** (config vs table vs RPC-mirrored) to be reconciled against
  `supabase/migrations/live/` before the step-2 migration.
- **Voice/practice/quiz/mistake costs** activate only when those features ship (T-16/17/18/20).
