# SPEC-SLICE — Free-Trial Enforcement (Time + Credit) DESIGN

> **Type:** Design / slice spec — **documentation only. NO enforcement code in this task.**
> **Status:** Drafted 2026-06-15 (Task 5 of the low-gate MVP foundation wave).
> **Risk:** Low to write; **High to implement** — credit/payment logic + Supabase migration are
> **hard gates** (CLAUDE.md). Implementation requires separate explicit owner approval.
> **Grounds:** [`SPEC-PRICING-packages-credits-cost-model`](SPEC-PRICING-packages-credits-cost-model.md),
> [`PLAN-MVP-foundation`](../plans/PLAN-MVP-foundation.md) Task 7, roadmap B2 / backlog T-07.
> **Discipline:** FACTS (existing code) vs DESIGN (proposed) are separated. Nothing here is applied.

---

## 1. Goal

Make the free trial **both time-limited AND credit-limited**, enforced server-side, so cost is
bounded and a clear upgrade moment exists. Target trial parameters (from the pricing spec):

| Lever | Value |
|---|---|
| Trial duration | **7 days** |
| Total credits (whole trial) | **50** |
| Daily credit cap | **10 / day** |
| Daily time cap | **15 minutes / day / child** |

Parent-facing framing stays **"fair daily learning usage"** — credits remain an internal lever
(pricing spec §0).

## 2. What already exists (FACTS — verified in code)

- `children.credit_limit_daily / credit_limit_weekly / credit_limit_monthly` columns.
- RPC `get_child_limits_summary(p_child_id)` → `{ daily:{exceeded}, weekly:{…}, monthly:{…} }`,
  already checked in `api/chat.js` (step 2) and returns a friendly 429 when exceeded.
- RPC `get_valid_credit_balance(p_parent_id)` (expiry-aware) + `deduct_credit(p_parent_id, p_session_id)`.
- Credit metering today (`api/chat.js` step 12): **1 credit / 5 text messages**, **1 / 2 image messages**.
- `sessions`, `messages` tables (messages carry `created_at`, `role`, `tokens_used`).

**Implication:** the **credit-cap** machinery largely exists. Missing for the trial: a **trial
window** (start + 7-day expiry), a **daily TIME cap**, and (recommended) **per-action metering**.

## 3. DESIGN (proposed — NOT implemented)

### 3.1 Trial window
- Record `trial_started_at` + `trial_ends_at` (7 days) on the parent/subscription record (exact
  column/home TBD against the live schema — ⚠️ schema decision for the gated slice).
- On each chat call, if `now > trial_ends_at` and no paid plan → return a friendly "trial ended"
  state (reuse the existing 402/limit response shape). No new payment logic here.

### 3.2 Daily + total credit caps
- Set the trial child's `credit_limit_daily = 10`; enforce **total 50** via the credit ledger sum
  over the trial window (new check) — the daily cap already flows through `get_child_limits_summary`.

### 3.3 Daily TIME cap (new)
- Define a "learning minute" from message timestamps within a rolling local day (sum of gaps between
  consecutive messages in a session, capped per gap to avoid counting idle time — e.g. ≤2 min/gap).
- Enforce **15 min/day/child**: compute server-side before generating a reply; over cap → friendly
  "time for a break" response (mirrors the existing age-band session-wellbeing copy).
- ⚠️ Exact computation belongs in an RPC or handler helper — design only here.

### 3.4 Per-action metering (recommended migration off the current modulo)
Replace `1 / 5 text, 1 / 2 image` with explicit per-action costs (pricing spec §5):

| Action | Credits |
|---|---|
| Text tutoring exchange | 1 |
| Photo / image solve | 3 |
| Voice interaction | 2 |
| Practice set / quiz generation | 2 |
| Mistake-analysis report | 1 |

### 3.5 Enforcement points in `api/chat.js` (design — where, not code)
1. After auth + session resolve (existing ~step 1b): check **trial window** (expired → trial-ended response).
2. Existing **credit-limit** check (step 2): extend to include the **time cap** + **total-50** check.
3. Existing **balance** check (step 4): unchanged.
4. Deduction (step 12): switch from modulo to **per-action cost**.

## 4. Authored migration DDL (FOR REVIEW — NOT APPLIED)

> Illustrative only. Exact columns/placement must be reconciled against `supabase/migrations/live/`
> before any apply. **Do not run.**

```sql
-- DRAFT — trial window + (optional) per-action audit. NOT APPLIED. Owner + review gate required.
-- alter table public.subscriptions
--   add column if not exists trial_started_at timestamptz,
--   add column if not exists trial_ends_at   timestamptz;
-- (Time-cap + per-action metering may be enforced in handler/RPC rather than schema —
--  decide during the gated implementation slice.)
```

## 5. Acceptance (for the FUTURE gated implementation — not this task)
- Trial blocks new generations after 7 days / 50 total / 10 per-day / 15 min per-day, with friendly copy.
- Paid plans unaffected. Parent-facing copy says "daily learning usage," not "credits."
- Tests: limit/time-cap unit tests + handler tests; `npm test` green.

## 6. Gates
- 🔴 **Hard gate** to implement: credit/payment logic (`api/chat.js` deduction), any Supabase
  migration/RPC change. Explicit owner approval + review required.
- Depends on [`SPEC-SLICE-pricing-credits-impl`](SPEC-SLICE-pricing-credits-impl.md) (product-wide
  per-action metering + LS variants) — **drafted 2026-06-17 (T-12)**; that doc is the source of truth
  for the per-action cost table and the current→per-action migration path.

## 7. Open gaps
- Exact home for `trial_*` columns vs live schema (reconcile before migration).
- Time-cap algorithm (gap-capping) needs validation against real session data.
- AI cost / utilization assumptions → review against live usage logs post-launch (pricing spec §6).
