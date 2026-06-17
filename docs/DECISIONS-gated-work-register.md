# Gated-Work Decision Register

> **Purpose:** One actionable place for the owner to unblock the designed-but-gated slices. The design
> docs each end in "open gaps"; this register **consolidates the recurring decisions** so resolving a
> handful of them unblocks several features at once.
> **How to use:** decide each item (record the choice + date inline), then the linked slices can proceed
> to their gated implementation under the normal review process (`CLAUDE.md`). **Nothing here is code.**
> **Maintained alongside:** `docs/PROJECT_TRACKER.md` (status) and `docs/specs/` (the designs).

---

## Why a register

Five design slices were drafted (2026-06-17). Mapping their gates shows the **same few decisions block
multiple features** — so they're worth deciding together:

| Decision | Blocks | Owner / who decides |
|---|---|---|
| **D1 — Email/push provider** | weekly digest (email), safety alerts (2nd channel) | Owner (vendor + budget) |
| **D2 — Migration approvals** | per-action metering, trial enforcement, digest, alerts, try-before-signup | Owner + DB review |
| **D3 — Legal sign-offs** | try-before-signup (COPPA boundary), safety-alert escalation wording, COPPA VPC | Owner + counsel |
| **D4 — Lemon Squeezy verification** | pricing/credits impl (variants, MoR fee) | Owner (LS dashboard) |
| **D5 — React/Vite gate** | Phase C/D differentiating features | Owner |

---

## D1 — Email / push channel  🔴 *(no sending infra exists today)*

**Question:** which transactional channel does Zeluu use, and is the first step in-app-only?
**Blocks:** [`SPEC-SLICE-weekly-digest`](specs/SPEC-SLICE-weekly-digest.md) (email phase),
[`SPEC-SLICE-safety-alerts`](specs/SPEC-SLICE-safety-alerts.md) (high-severity 2nd channel).
**Options:** Resend / Postmark / SendGrid (HTTP API) · Supabase Auth SMTP · web-push (VAPID) · **in-app only first** (recommended phase 1 — no new vendor).
**Implication once decided:** dependency install + secret + external service = hard-gated impl slice.

- [ ] **Decision:** _______________________  **Date:** ______  **Notes:** ______

## D2 — Migration approvals  🔴

**Question:** which schema changes are approved, and in what order (reconcile against
`supabase/migrations/live/` first — do not regress live-only objects)?
**Blocks:** the impl phase of every slice. Candidate migrations gathered from the designs:

| Migration | For | Slice |
|---|---|---|
| `deduct_credit(..., p_amount)` / `deduct_credits_amount` RPC | per-action metering | pricing-credits-impl |
| `plans` catalog + action-cost storage | package definitions | pricing-credits-impl |
| trial window columns + total/daily enforcement | trial | trial-enforcement |
| `notifications.type` CHECK += `weekly_digest` | digest in-app row | weekly-digest |
| `profiles.weekly_digest_opt_out` | digest opt-out | weekly-digest |
| alert delivery-status + parent alert-preference columns | dual-channel alerts | safety-alerts |
| consent ledger (`parent_id, child_id, method, policy_version, consented_at`) | COPPA | try-before-signup / COPPA research |

- [ ] **Decision (which + order):** _______________________  **Date:** ______

## D3 — Legal sign-offs  🔴

**Question:** legal approval of the child-data boundaries and parent-facing copy.
**Blocks:** [`SPEC-SLICE-try-before-signup`](specs/SPEC-SLICE-try-before-signup.md) (no-PII-pre-consent +
landing disclosure), [`SPEC-SLICE-safety-alerts`](specs/SPEC-SLICE-safety-alerts.md) (distress
escalation wording), and the COPPA VPC method ([research](research/RESEARCH-coppa-vpc-options.md)).

- [ ] **COPPA pre-consent boundary + landing copy:** _______________________  **Date:** ______
- [ ] **Distress escalation wording / resources:** _______________________  **Date:** ______
- [ ] **VPC method (email-plus vs card-as-consent vs other):** _______________________  **Date:** ______

## D4 — Lemon Squeezy verification  🟡

**Question:** confirm live variant IDs + current MoR fee before pricing impl.
**Blocks:** [`SPEC-SLICE-pricing-credits-impl`](specs/SPEC-SLICE-pricing-credits-impl.md) (§4 variant map,
§6 economics).

- [ ] **Live variant IDs captured (subs + packs + PPP currencies):** ______  **Date:** ______
- [ ] **Current MoR fee confirmed vs the ~5%+$0.50 planning assumption:** ______  **Date:** ______

## D5 — React/Vite migration gate  🔴

**Question:** approve (or keep deferred) the React/Vite/Tailwind/shadcn migration.
**Blocks:** Phase C/D differentiating features (mastery map, practice generator, voice, whiteboard, …).

- [ ] **Decision:** _______________________  **Date:** ______

---

## What unblocks fastest

- **Pick D1 = "in-app first"** → digest + alerts can ship a no-vendor phase 1 (still needs the one
  `notifications.type` CHECK migration in D2).
- **Approve the two smallest D2 migrations** (`weekly_digest` type, opt-out column) → in-app digest is buildable.
- **D4** is just verification (no vendor/legal) → unblocks the pricing impl step-1 (shadow-mode config).

> None of the above is started until the relevant decision is recorded here and the impl slice passes
> review — per `CLAUDE.md` hard gates.
