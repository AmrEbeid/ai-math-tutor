# Login / Signup Flow — Redesign DESIGN (revamp sub-project 3, flow half)

> **Status:** Design — awaiting owner + **legal** review. **Risk:** Low to write; **High to implement**
> (auth / consent / Supabase schema = hard gates). The **visual** rebrand of the auth pages already
> shipped (PR #21); this doc covers the *flow* changes, which are **design-only — no auth-logic built**.
> **Grounds in:** the verified market research (neutral age-gates; mobile-first consent converts ~10×;
> card-as-consent converts poorly in MENA; Khan Academy Kids "Grown-Ups Only" pattern; trust = the
> conversion lever), the live flow (`login.html`, `child-login.html`, `api/auth/*`), and existing specs:
> [`RESEARCH-coppa-vpc-options`](../../research/RESEARCH-coppa-vpc-options.md),
> [`SPEC-A0.5-trial-signup-onboarding-flow`](../../specs/SPEC-A0.5-trial-signup-onboarding-flow.md),
> [`SPEC-SLICE-trial-enforcement`](../../specs/SPEC-SLICE-trial-enforcement.md).
> **Discipline:** No product code from this doc; each change is a separate gated slice with legal sign-off.

---

## 1. Current flow (FACTS — from code)

- **Parent signup** (`login.html`): Supabase email+password → **OTP email verification** → a single
  **consent checkbox** (Privacy/Terms/Refund) → plan select → **Lemon Squeezy checkout** (card-required
  14-day trial, 10 free credits). `record_signup_consent()` RPC logs GDPR consent.
- **Child login** (`child-login.html`): parent-email + **username + password** → `/api/auth/child-login`
  → child JWT in `localStorage`. The parent creates the child's username/password elsewhere (dashboard).
- **No explicit neutral age-gate**; **no verifiable-parental-consent (VPC) step distinct from the card**;
  child PII (name/grade) handling vs. consent timing is not formalized.

## 2. Gaps vs research + COPPA

1. **Age-gate isn't neutral / explicit.** COPPA wants a neutral age screen (ask DOB/grade plainly, no
   "are you 13+?" nudging, no defaulting). Today grade is set when adding a child, not framed as a gate.
2. **Consent is a checkbox, not VPC.** A checkbox is *not* verifiable parental consent for under-13 PII.
   The live card-required trial *is* a recognized VPC method ("payment with notice") — but research shows
   **card-as-consent converts poorly in MENA**, so relying on it alone caps signups there.
3. **No-PII-before-consent isn't enforced in the flow.** Child name/grade should be collected only *after*
   consent is captured.
4. **Mobile-first consent** (the ~10× lever) isn't specifically optimized.
5. **"Grown-Ups Only" boundary** between parent setup and child use isn't explicit.

## 3. Designed flow (proposed — NOT built; legal-gated)

**A. Parent-first, mobile-optimized entry.** Keep parent → Supabase + OTP. Make the whole flow
single-column, large-tap-target, mobile-first (the consent step especially).

**B. Neutral age-gate at child creation.** When the parent adds a child, ask the child's **grade/birth
year plainly** (neutral wording, no nudge, no default). Used to set curriculum band *and* to drive the
consent path (under-13 → VPC required).

**C. Consent as an explicit, logged step — not a buried checkbox.**
- A dedicated **consent screen** (mobile-first) stating, in plain language, what's collected and why,
  with an explicit "I consent as the parent/guardian" action.
- **VPC method (legal-gated decision):** the live **card-required trial = payment-with-notice VPC**
  (recognized) — keep for paid, but to protect MENA conversion, also design an **"email-plus" path**
  (parent email consent + a delayed confirming step) for the **internal-use-only** child data, per the
  COPPA research §3. Final method **pending legal**.
- **Consent ledger** (COPPA research §4): record `parent_id, child_id, method, policy_version,
  consented_at`. 🔴 Supabase migration — gated.

**D. No child PII before consent.** Collect the child's name only *after* the consent step; the neutral
age input before consent is a coarse band (birth year / grade), not identifying.

**E. "Grown-Ups Only" boundary.** Child accounts are created and managed by the parent (dashboard);
the child app entry stays a separate, simple login (already the case). A small "ask a grown-up" gate on
any account/billing action inside the child app.

## 4. Flow diagram (target)

```
Visitor → [Parent sign up: email+password] → [OTP verify]
        → [Neutral age step: child birth-year/grade]   (coarse, no PII)
        → [Consent screen: plain-language + explicit parent consent]  ──┐
        → [VPC: card-with-notice  OR  email-plus (legal-decided)]       │ logged to consent ledger
        → [Now collect child name + create child login]                ─┘
        → [Plan / trial]  → child uses app behind "Grown-Ups Only"
```

## 5. Acceptance (for the FUTURE gated implementation — not this task)

- Age screen is neutral (no nudge/default); drives the consent path.
- No identifying child PII stored before a consent record exists.
- Consent is explicit, mobile-first, and written to a consent ledger with method + policy version.
- Card-with-notice VPC kept for paid; an email-plus alternative exists for MENA where appropriate (legal-approved).
- "Grown-Ups Only" gate on child-app account/billing actions.
- Parent-facing copy stays trust-forward; existing `frontend-copy` disclosures (card-required, 14-day, 10 credits) preserved.

## 6. Gates (CLAUDE.md)

- 🔴 **Hard gates** to implement any of this: changes to `api/auth/*` / Supabase Auth flow, consent
  logic, the consent-ledger migration, child-account creation, or Lemon Squeezy/trial linkage. Explicit
  owner approval **+ legal sign-off** required before code.
- 🟡 The **static consent-screen UI** (copy + layout, no logic) could be a medium-risk frontend slice once
  legal approves the wording.
- This doc is **docs-only, low-risk**.

## 7. Open decisions / gaps

- **VPC method** (card-with-notice vs email-plus vs hybrid) — **legal decision**; gates the build.
- **Exact current child-creation UI** (in `dashboard.html`) to reconcile before designing the age-gate insertion point.
- **Consent-ledger schema** vs `supabase/migrations/live/` (mirror, don't regress).
- **Trial terms** alignment: live is 14-day/10-credit/card-required; the pricing spec proposes
  7-day/50-credit — reconcile before changing any signup copy.
