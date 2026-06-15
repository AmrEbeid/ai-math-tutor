# RESEARCH — COPPA Verifiable Parental Consent (VPC) Options

> **Type:** Research / documentation only. **No implementation.**
> **Status:** Drafted 2026-06-15. **Final legal decision: PENDING LEGAL REVIEW (⚖️ gate).**
> **Fulfils:** MVP foundation plan Task 9 ([`PLAN-MVP-foundation`](../plans/PLAN-MVP-foundation.md)),
> roadmap B6 / backlog T-11.
> **Grounds:** [`RESEARCH-competitive-product-strategy-2026-06-15`](RESEARCH-competitive-product-strategy-2026-06-15.md) R1–R3.
> **Discipline:** FACTS (cited) vs RECOMMENDATIONS vs ⚠️ NCC (not clearly confirmed — confirm with counsel).

---

## 1. Why this matters (FACTS)

- **COPPA** requires **verifiable parental consent (VPC)** *before* collecting personal information
  from a child under 13. The April 2025 amendments strengthened obligations; **compliance is in force
  now** (deadline April 22, 2026; today is 2026-06-15). [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- **UK Children's Code** (applies extraterritorially to services likely accessed by UK under-18s):
  high privacy by default, geolocation off by default, no nudge techniques, age-appropriate measures.
  [ICO Age-Appropriate Design Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-code/)
- Zeluu's model already routes account creation + payment through the **parent** (children log in via a
  parent-created account; child app has no payment surface). This is structurally favorable for VPC.

## 2. FTC-recognized VPC methods (FACTS — confirm exact current list with counsel)

The FTC has historically recognized several VPC methods. The "sliding scale" allowed a lighter method
(**email-plus**) when a child's personal information is used for **internal purposes only**; stricter
methods are required when data is **disclosed to third parties**. ⚠️ The April 2025 amendments may have
adjusted the recognized methods and the email-plus availability — **verify the current list with legal**.

| Method | Mechanism | Fit for Zeluu | Note |
|---|---|---|---|
| **Monetary transaction (credit/debit card)** | Parent completes a payment that notifies them of each transaction | **Strong** — Zeluu already requires a card for the trial via Lemon Squeezy | A recognized method when the transaction provides notice to the account holder |
| **Email-plus** | Parent email consent + a second confirming step (delayed email / follow-up) | Possible **only if** child data is internal-use-only | ⚠️ Availability/conditions may have changed in 2025 — confirm |
| **Signed consent form** | Parent signs + returns (scan/photo/upload) | Possible but high friction | Fallback |
| **Gov-ID / knowledge-based / facial-match-to-ID** | Identity verification of the parent | Heavy; usually a vendor | Overkill for current scope |
| **Toll-free / video-conference confirmation** | Trained personnel confirm | Operationally heavy | Not now |

## 3. Recommended VPC approach for the Lemon Squeezy + Supabase stack (RECOMMENDATION — pending legal)

**Primary: card-transaction VPC at parent signup.** Zeluu's card-required trial (Lemon Squeezy as
Merchant of Record) already puts a verified payment method in the parent's hands and notifies them of
the transaction. Pairing the parent account creation + card step with an explicit, logged consent
affirmation is the lowest-friction path that maps onto a recognized method.

**Defense-in-depth additions (map to UK Children's Code):**
- **Privacy by default** — minimal child data; child app collects no PII (already the design intent).
- **Geolocation off by default** — do not collect/track child location.
- **No nudge techniques** — do not encourage children to provide more data.
- **Consent record** — store *consent given*, timestamp, method, and policy version (consent ledger).
  ⚠️ Schema for a consent record is a **future gated change** (Supabase migration) — design only here.

**Sequencing with "try-before-signup" (T-06):** the anonymous first session must collect **no child
PII before consent**; VPC is obtained at the parent account + card step that gates continuation.

## 4. Implementation implications (for later, GATED slices — NOT done here)

- **Consent capture UI** at parent signup (explicit affirmation + link to Safety & Privacy page). 🟡
- **Consent ledger** (table: parent_id, child_id, method, policy_version, consented_at). 🔴 migration.
- **Data-minimization audit** of what the child app stores. 🟡
- **Geolocation/nudge audit** of all surfaces. 🟢/🟡
- **Lemon Squeezy transaction → consent linkage** (no payment logic change yet). 🔴 if it touches webhook/credit.
- **Privacy policy + Safety page** must state the VPC method and data practices (Safety page = Task 3 here).

## 5. Open legal questions (⚖️ for counsel)

1. Does the **April 2025 COPPA amendment** keep card-transaction as a recognized VPC method, and does it
   change email-plus availability for internal-use-only data?
2. Is Zeluu's child data strictly **internal-use-only** (no third-party disclosure beyond processors like
   OpenAI/Supabase/Lemon Squeezy as service providers)? This determines whether email-plus is even an option.
3. Are OpenAI / Supabase / Lemon Squeezy adequately covered as **service providers/processors** under
   COPPA + UK GDPR (DPAs in place)?
4. Does serving any **UK** child pull in the full UK Children's Code conformance set, and is a DPIA required?
5. What **retention/deletion** obligations apply to child chat transcripts and homework images?
6. Is a separate **parental dashboard consent-management** surface (view/withdraw consent) required?

## 6. Final decision

**PENDING LEGAL REVIEW.** Recommended direction (subject to counsel): **card-transaction VPC at parent
signup + privacy-by-default + a consent ledger**, with email-plus considered only if counsel confirms
internal-use-only status and current availability. No VPC implementation proceeds until legal sign-off
and explicit owner approval (⚖️ + 🔴 gates).

## 7. NCC / caveats

- Exact current FTC-recognized VPC method list and the precise April-2025 changes are **NCC** here —
  confirm against the current FTC rule text with counsel before relying on any specific method.
- Whether the existing card-required flow already constitutes compliant VPC **as implemented** is **NCC** —
  it depends on the exact notice/affirmation wording and record-keeping, which counsel must review.
