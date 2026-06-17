# SPEC-SLICE — Try-Before-Signup First Session DESIGN (T-06)

> **Purpose:** Design for letting a visitor complete **one** guided tutoring question **before** any
> signup — to prove value fast — while collecting **no child PII before verifiable parental consent**.
> **Status:** Drafted (design-only) — awaiting GPT + owner + **legal** review. **Risk:** Low to write;
> **High to implement** — anonymous access to the chat path + a COPPA/PII boundary + abuse surface.
> **Grounds in:** [`RESEARCH-coppa-vpc-options`](../research/RESEARCH-coppa-vpc-options.md) (no PII
> pre-consent; VPC at the parent-account/card step), [`SPEC-A0.5-trial-signup-onboarding-flow`](SPEC-A0.5-trial-signup-onboarding-flow.md)
> (card-based onboarding), and the live authenticated chat path (`api/chat.js`, `lib/rate-limit.js`).
> **Discipline:** No product code from this doc. Implementation is a separate gated slice; **legal sign-off
> on the consent boundary is a hard prerequisite.**

---

## 1. Goal & guardrails

A visitor can ask **one** guided question and see the tutor's step-by-step style, then is invited to create
a parent account (which is where consent + the trial begin). Hard guardrails:

- **No child PII stored before consent** (COPPA): no name, age, email, school, location, or free-text that
  could identify a child is persisted or logged for the anonymous turn.
- **One guided question, hard-capped** — never a full solution dump; reuse the scaffolding/worked-example
  guards so the teaser shows *method*, not answers.
- **Abuse-bounded** — strict rate limiting so the unauthenticated endpoint can't be farmed for free AI.
- **Continuation requires** a parent account + the existing consent/card step (A0.5) — the anonymous turn
  cannot be chained into a full session.

---

## 2. What exists today (FACTS)

- The chat path (`api/chat.js`) **requires auth** (`getChildOrUser` → 401) and derives `child_id`/limits
  from an authorized session row. There is **no anonymous entry**.
- Rate limiting (`lib/rate-limit.js`) is keyed by `parentId || ip`; an anonymous path would key on **IP only**.
- COPPA research already concludes: **collect no PII before consent**; VPC at parent-account + card.
- Credit metering, history, notifications, and RAG all assume an authed parent/child/session.

---

## 3. DESIGN — an isolated, stateless teaser path (not the authed handler)

> **Do not** loosen `api/chat.js` auth. Add a **separate, narrow** endpoint so the security-critical authed
> path keeps its invariants and the anonymous surface is small and auditable.

- **`POST /api/try` (new, anonymous):** accepts only `{ message, grade_band? }` — **no identity fields**.
  - Strong **IP rate limit** + a global daily cap; optional proof-of-work/captcha if abused.
  - Runs the tutor for **one** turn with the existing system prompt + scaffolding + worked-example guards
    (method-only, no answer dump), **streaming or single JSON** (reuse `lib/sse.js`).
  - **Persists nothing about the child**: no `messages`, no `sessions`, no identifiable logs. At most an
    **anonymous, aggregate counter** (count of teasers/day) for abuse + funnel metrics — **no content**.
  - `grade_band` is an optional **coarse** selector (e.g. "lower/middle/upper"), never an exact age/PII.
- **No credits** consumed (no parent yet); cost is bounded purely by the rate/daily caps.
- **Response ends with a conversion CTA** → parent signup (A0.5), where consent + trial begin.

---

## 4. PII / consent boundary (legal-gated)

- The anonymous turn is **ephemeral**: request in, response out, nothing child-identifying retained.
- The model still gets the message (sent to OpenAI) — the **landing copy must tell the visitor not to enter
  personal information** before they try, and the input can run the existing `detectPersonalInfo` check to
  **refuse-and-warn** rather than store.
- Consent is obtained **later**, at parent-account creation + card (A0.5) — unchanged here.
- **Consent ledger** (COPPA research §4) remains a separate future gated migration; this teaser must work
  **without** any consent record because it stores nothing.

---

## 5. Acceptance (for the FUTURE gated implementation — not this task)

- A visitor gets exactly **one** guided, method-only answer with **no account**.
- **Nothing child-identifying** is written to the DB or logs for the anonymous turn (asserted in tests:
  no `messages`/`sessions` insert; only an anonymous counter, if any).
- The unauthenticated endpoint is rate/daily-capped and cannot be chained into a full session.
- The authed `api/chat.js` path and its auth invariants are **untouched**.
- Legal has signed off on the "no PII pre-consent" boundary + landing copy.

## 6. Gates (CLAUDE.md)

- 🔴 **Hard gates** to implement: a new **unauthenticated** entry to the AI (auth-surface + abuse);
  **legal** sign-off on the COPPA/PII boundary; any consent-ledger schema (separate slice). Explicit owner
  + legal approval + review required.
- 🟡 **Medium / phase-1 candidate (still gated on legal):** the **static landing UI** + "no personal info"
  copy + CTA, with the teaser endpoint stubbed/disabled — frontend-only, no AI exposure yet.
- This doc is **docs-only, low-risk**.

## 7. Open gaps

- **Legal sign-off** on no-PII-pre-consent + the exact landing disclosure (blocking).
- **Abuse model** — IP rate limit thresholds, daily global cap, captcha/PoW trigger; tune vs. cost.
- **Anonymous metrics** — confirm an aggregate counter stores nothing identifiable (no IP retention beyond
  rate-limit window).
- **Localization** of the teaser (Arabic/English) and grade-band coarseness.
- **Conversion linkage** to A0.5 without leaking the anonymous turn's content into the new account.
