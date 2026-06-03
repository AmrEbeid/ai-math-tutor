# SPEC-A0.6 — Public Repo Benchmark & Product Inspiration Sprint

> **Research / benchmarking only.** No code has been or may be copied from public
> repos into Zeluu. All adoption is gated on license, security, and privacy review.
> This spec is the destination for A0.6 findings.

**Status:** **Complete — all 8 categories researched.** Findings below are preserved
from real web research (URLs included). No code copied.

**Last Updated:** 2026-06-03

## 1. Purpose

Inspect high-quality public repositories, templates, libraries, and products to learn
which ideas, patterns, and architectures are worth adapting for Zeluu — and which to
avoid — before major architecture/frontend work. The goal is learning and decision
support, not copying.

## 2. Research Questions

1. Which public repos are most valuable for Zeluu to learn from?
2. Best AI chat UX pattern?
3. Best multi-model / provider routing pattern?
4. Best Supabase / SaaS auth + dashboard pattern?
5. Best tutoring / education logic?
6. Best testing / CI pattern?
7. Best onboarding / trial / payment UX pattern?
8. Best UI libraries for child app / parent dashboard / landing-pricing?
9. What to adopt immediately at low risk?
10. What to study but not copy?
11. What to avoid completely?
12. Does this change the React/Vite migration recommendation?
13. Does this change the A0.5 flow recommendation?
14. Does this suggest a better AI model routing architecture?
15–20. Quick wins, later ideas, security lessons, UX lessons, backend lessons, next prompt.

## 3. Categories to Research

| # | Category | Status |
|---|----------|--------|
| 1 | AI chat UX & streaming | ✅ Researched |
| 2 | AI tutoring / education / adaptive learning | ✅ Researched |
| 3 | SaaS billing / trial / checkout / onboarding | ✅ Researched |
| 4 | Supabase auth / RLS / security / privacy | ✅ Researched |
| 5 | UI / UX / design systems | ✅ Researched |
| 6 | AI model routing / multi-provider | ✅ Researched |
| 7 | Testing / QA / CI / monitoring | ✅ Researched |
| 8 | Child safety / privacy / compliance | ✅ Researched |

## 4. Candidate Repo List

> Star counts / dates are approximate, fetched June 2026. Confirm exact SPDX license
> before reusing any code from any repo.

### Category 1 & 6 — AI Chat UX + Model Routing

| Repo | URL | License | Stack | Maintenance | Classification |
|------|-----|---------|-------|-------------|----------------|
| vercel/ai-chatbot | https://github.com/vercel/ai-chatbot | Apache-2.0* | Next.js, AI SDK, Postgres, shadcn | Very active | Study only |
| assistant-ui | https://github.com/assistant-ui/assistant-ui | MIT | React primitives + AI SDK runtimes | Very active | Adopt soon (pattern) / Evaluate later (lib) |
| vercel/streamdown | https://github.com/vercel/streamdown | MIT* | React markdown + KaTeX + Shiki + rehype-harden | Active | Adopt now (pattern) |
| danny-avila/LibreChat | https://github.com/danny-avila/LibreChat | MIT | React + Node monorepo, YAML config | Very active | Study only |
| open-webui/open-webui | https://github.com/open-webui/open-webui | Open WebUI License (restrictive) | Svelte + Python | Very active | Study only |
| lobehub/lobe-chat | https://github.com/lobehub/lobe-chat | LobeHub Community License (restrictive) | Next.js TS | Very active | Study only |
| mckaywrigley/chatbot-ui | https://github.com/mckaywrigley/chatbot-ui | MIT | Next.js + Supabase | Stalled | Study only |
| Mintplex-Labs/anything-llm | https://github.com/Mintplex-Labs/anything-llm | MIT | Vite/React + Express, 50+ providers | Very active | Study only |
| BerriAI/litellm | https://github.com/BerriAI/litellm | MIT | Python SDK + proxy | Very active | Evaluate later |
| vercel/ai (AI SDK) | https://github.com/vercel/ai | Apache-2.0* | TS provider abstraction | Very active | Adopt soon |
| Portkey-AI/gateway | https://github.com/Portkey-AI/gateway | MIT | TS gateway (Node/Workers) | Active | Evaluate later |
| OpenRouter (docs) | https://openrouter.ai/docs | proprietary API | Hosted router | Active | Study only / Avoid for child content |

### Category 2 — AI Tutoring / Education

| Repo | URL | License | Maintenance | Classification |
|------|-----|---------|-------------|----------------|
| OATutor (Stanford CAHLR) | https://github.com/CAHLR/OATutor | CC BY 4.0 (content) | Active | Study now / adopt patterns |
| pyBKT (CAHLR) | https://github.com/CAHLR/pyBKT | MIT | Active | Adopt soon (mastery) |
| MathDial (ETH) | https://github.com/eth-nlped/mathdial | CC BY-SA 4.0 | Stable | Adopt now (taxonomy/prompts) |
| PedagogicalRL (ETH) | https://github.com/eth-lre/PedagogicalRL | CC BY 4.0 | New | Study now (judge concept) |
| MathTutorBench (ETH) | https://github.com/eth-lre/mathtutorbench | open (see repo) | New | Adopt now (eval harness) |
| SocraticMath/SocraticLLM (ECNU) | https://github.com/ECNU-ICALK/SocraticMath | MIT code / CC BY-NC 4.0 data | Low | Study only (NC data) |
| socratic-llm (Gatti) | https://github.com/GiovanniGatti/socratic-llm | MIT | Moderate | Adopt now (judge prompt) |
| Studyield | https://github.com/studyield/studyield | AGPL-3.0 | Active | Evaluate later (AGPL) |
| Open-TutorAI-CE | https://github.com/Open-TutorAi/open-tutor-ai-CE | BSD-3 | Active | Evaluate later |
| tutor-gpt (Plastic Labs) | https://github.com/plastic-labs/tutor-gpt | GPL-3.0 | Active | Study only (GPL) |
| pyKT-toolkit | https://github.com/pykt-team/pykt-toolkit | MIT | Dormant (2023) | Evaluate later (DKT) |

### Category 5 — UI / UX / Design Systems

| Library | URL | License | Usable w/o React today? | Surface(s) | Classification |
|---------|-----|---------|------------------------|-----------|----------------|
| shadcn/ui | https://github.com/shadcn-ui/ui | MIT (copy-paste) | No | Parent, Landing, (Child restyled) | Adopt after migration |
| Radix Primitives | https://github.com/radix-ui/primitives | MIT | No | All (a11y/RTL foundation) | Adopt after migration |
| assistant-ui | https://github.com/Yonom/assistant-ui | MIT | No | Child chat | Evaluate later |
| Tremor | https://github.com/tremorlabs/tremor | MIT (Vercel-owned) | No | Parent dashboard | Adopt after migration |
| HeroUI (ex-NextUI) | https://github.com/heroui-inc/heroui | Apache-2.0 | No | Child/Parent/Landing | Evaluate later (best a11y/RTL via React Aria) |
| MUI | https://github.com/mui/material-ui | MIT core / MUI X paid | No | Parent | Evaluate later (first-class RTL) |
| Mantine | https://github.com/mantinedev/mantine | MIT | No | Parent | Evaluate later (verify RTL) |
| Chakra UI | https://github.com/chakra-ui/chakra-ui | MIT | No | Parent, Landing | Evaluate later |
| Motion (ex-Framer Motion) | https://github.com/motiondivision/motion | MIT | **Yes (vanilla `animate()`)** | All (subtle) | **Adopt now** |
| Lottie (lottie-web) | https://github.com/airbnb/lottie-web | MIT | **Yes (`<script>`)** | Child, Landing | Adopt now (sparingly) |
| Rive | https://github.com/rive-app | runtime MIT | **Yes (WASM)** | Child | Evaluate later |
| Magic UI | https://github.com/magicuidesign/magicui | MIT | No | Landing only | Study only |
| Aceternity UI | https://ui.aceternity.com | Free copy-paste / Pro restrictive | No | Landing only | Study only |
| React Bits | https://github.com/DavidHDev/react-bits | MIT + Commons Clause | No | Landing only | Study only |
| Origin UI | https://github.com/origin-space/originui | Mixed MIT + AGPLv3 | No | Parent, Landing | Evaluate later (license caution) |
| 21st.dev | https://21st.dev | per-author / mixed | No | Landing | Study only (vet each) |

### Category 7 & 8 — Testing/CI + Child Safety/Privacy

| Item | URL | License | Classification |
|------|-----|---------|----------------|
| Vitest | https://vitest.dev | MIT | Adopt now |
| MSW (Mock Service Worker) | https://github.com/mswjs/msw | MIT | Adopt now |
| Supabase CLI `test db` (pgTAP) | https://supabase.com/docs/guides/local-development/testing/overview | Apache-2.0 | Adopt now |
| usebasejump/supabase-test-helpers | https://github.com/usebasejump/supabase-test-helpers | MIT | Adopt now |
| Zod (env validation) | https://github.com/colinhacks/zod | MIT | Adopt now |
| promptfoo | https://github.com/promptfoo/promptfoo | MIT | Adopt soon |
| @axe-core/playwright | https://github.com/dequelabs/axe-core | MPL-2.0 | Adopt soon |
| Playwright | https://github.com/microsoft/playwright | Apache-2.0 | Adopt later (post-React) |
| Lighthouse CI | https://github.com/GoogleChrome/lighthouse-ci | Apache-2.0 | Adopt later |
| t3-env | https://github.com/t3-oss/t3-env | MIT | Evaluate later |
| Microsoft Presidio (PII) | https://github.com/microsoft/presidio | MIT | Evaluate later (Python service) |
| OpenAI Moderation API | https://platform.openai.com/docs/guides/moderation | proprietary (free endpoint) | Adopt soon |
| Meta Llama Guard (PurpleLlama) | https://github.com/meta-llama/PurpleLlama | Llama Community License | Study only |
| ICO Children's Code | https://ico.org.uk/.../age-appropriate-design-a-code-of-practice-for-online-services/ | Official guidance | Adopt now (design baseline) |
| UNICEF AI-for-Children Guidance | https://www.unicef.org/innocenti | Official guidance | Adopt now (design baseline) |
| 5Rights / IEEE 2089 | https://5rightsfoundation.com | Official/advocacy | Study / cite |

### Category 3 — SaaS Billing / Trial / Checkout / Subscription Lifecycle

> Zeluu uses **LemonSqueezy**. Stripe-stack repos are *architecture/pattern* references
> only — event names and statuses differ (see Billing lessons). No code copied.

| Repo / Source | URL | License | Stack | Maintenance | Classification |
|---------------|-----|---------|-------|-------------|----------------|
| lmsqueezy/nextjs-billing | https://github.com/lmsqueezy/nextjs-billing | MIT | Next.js + Drizzle + Neon + LS | 737★, active (Dec 2025) | Adopt now (primary LS reference) |
| lmsqueezy/lemonsqueezy.js | https://github.com/lmsqueezy/lemonsqueezy.js | MIT | Official LS TS SDK | 529★ | Adopt now (SDK semantics) |
| LS SaaS Billing guide | https://docs.lemonsqueezy.com/guides/tutorials/nextjs-saas-billing | docs | LS + Next.js | Official | Adopt now |
| LS Free Trials docs | https://docs.lemonsqueezy.com/guides/tutorials/saas-free-trials | docs | LS | Official | Adopt now (card-required trial) |
| LS Subscription object/status | https://docs.lemonsqueezy.com/api/subscriptions/the-subscription-object | docs | LS | Official | Adopt now (lifecycle) |
| vercel/nextjs-subscription-payments | https://github.com/vercel/nextjs-subscription-payments | MIT | Next.js + Supabase + Stripe | 7.7k★, **ARCHIVED** Jan 2025 | Study only (Stripe, archived) |
| nextjs/saas-starter (leerob) | https://github.com/nextjs/saas-starter | MIT | Next.js + Postgres + Stripe | 15.8k★, active | Evaluate later (best card-trial structure, Stripe) |
| KolbySisk/next-supabase-stripe-starter | https://github.com/KolbySisk/next-supabase-stripe-starter | MIT | Next.js + Supabase + Stripe + shadcn | 785★, active | Evaluate later (service-role discipline) |
| Webhook idempotency guide (Hookdeck) | https://hookdeck.com/webhooks/guides/implement-webhook-idempotency | guide | provider-agnostic | Current | Adopt now (idempotency design) |
| Stripe subscription webhooks docs | https://docs.stripe.com/billing/subscriptions/webhooks | docs | Stripe | Official | Study only (async pending-UX concept) |

### Category 4 — Supabase Auth / RLS / Security / Privacy / Parent-Child

| Repo / Source | URL | License | Stack | Maintenance | Classification |
|---------------|-----|---------|-------|-------------|----------------|
| makerkit RLS best-practices | https://makerkit.dev/blog/tutorials/supabase-rls-best-practices | article (kit paid) | Supabase | Current | Adopt now (RLS + parent/child patterns) |
| Supabase official RLS docs | https://supabase.com/docs/guides/database/postgres/row-level-security | docs | Supabase | Official | Adopt now (RLS correctness + perf) |
| Supabase "Securing your data" | https://supabase.com/docs/guides/database/secure-data | docs | Supabase | Official | Adopt now (service-role safety) |
| supabase user-management example | https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-user-management | Apache-2.0 | Next.js + Supabase | active | Adopt now (auth+RLS baseline) |
| Razikus/supabase-nextjs-template (SupaSaaS) | https://github.com/Razikus/supabase-nextjs-template | Apache-2.0 | Next.js 15 + Supabase + MFA/RLS | 311★, active | Evaluate later (MFA, legal docs, i18n) |
| JWT storage / httpOnly cookie tradeoffs | https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id | guide | generic auth | Reference | Adopt soon (child-token storage) |

> **Closed/paid (study public writeups only, do not depend):** Supastarter
> (https://supastarter.dev, ~$299, closed) and MakerKit core kit (paid) — unauditable
> code is risky as a foundation for a children's product.

## 5. Shortlist

| Repo | Category | Core lesson for Zeluu | Classification | Risk |
|------|----------|-----------------------|----------------|------|
| vercel/streamdown | Chat UX | Streaming-safe markdown + KaTeX + sanitization | Adopt now (pattern) | Low |
| assistant-ui | Chat UX | Runtime-vs-primitives chat decomposition; ActionBar for retry/edit | Adopt soon (pattern) | Low |
| vercel/ai (AI SDK) | Routing | Typed provider registry + middleware, server-side model choice | Adopt soon | Low/Med |
| LibreChat `titleModel` | Routing | Canonical task-based routing (cheap model for utility task) | Study/adopt pattern | Low |
| Portkey gateway | Routing | TS-edge conditional routing + guardrails (later upgrade) | Evaluate later | Med |
| socratic-llm | Tutoring | MIT judge prompt = anti-answer-dumping guardrail | Adopt now (pattern) | Low |
| MathDial | Tutoring | Focus/Probing/Telling/Generic move taxonomy; scaffolding-vs-telling evidence | Adopt now (concept) | Low |
| OATutor | Tutoring | Structural answer-gating via ordered hint chain (mirrors L1–L5) | Study/adopt pattern | Low |
| pyBKT | Tutoring | Interpretable mastery/weak-topic engine for MVP | Adopt soon | Med |
| MathTutorBench | Tutoring | Pedagogy regression test (long-dialogue failure mode) | Adopt now (concept) | Low |
| Motion | UI | Subtle, reduced-motion animation usable in vanilla today | Adopt now | Low |
| Lottie | UI | Friendly mascot/empty/loading states (sparingly) | Adopt now | Low |
| Tremor | UI | Parent-dashboard charts/KPI cards (post-migration) | Adopt after migration | Low |
| HeroUI / Radix | UI | Best a11y + RTL foundation (React Aria / Radix) | Evaluate later | Low |
| Vitest + MSW | Testing | Offline, no-real-API serverless tests (`onUnhandledRequest:'error'`) | Adopt now | Low |
| Supabase pgTAP + test-helpers | Testing | RLS isolation tests at the DB layer (child-data safety) | Adopt now | Low |
| Zod env validation | Testing | Fail-fast on missing signing secret/keys | Adopt now | Low |
| promptfoo | Testing | AI safety/age-appropriateness regression gate | Adopt soon | Low |
| OpenAI Moderation API | Safety | Free per-turn moderation incl. `sexual/minors`, self-harm | Adopt soon | Low/Med |
| ICO Children's Code / UNICEF | Safety | Privacy-by-design defaults baseline (legal review required) | Adopt now (design) | Low |
| lmsqueezy/nextjs-billing | Billing | Canonical LS lifecycle map (checkout→webhook→portal); but NO idempotency guard | Study → adopt pattern | Med |
| LS Free Trials (native card-required) | Billing | Native card-required, no-charge-today, 14-day trial — matches Zeluu rule | Adopt now (config) | Low |
| Webhook idempotency (Hookdeck) | Billing | UNIQUE event-id + INSERT ON CONFLICT + same-txn mutation (prevents double credits) | Adopt now (pattern) | Med |
| makerkit RLS + Supabase RLS docs | Supabase | Parent/child RLS via security-definer + `(select auth.uid())` + indexed policy cols | Adopt now (pattern) | Med |
| Service-role discipline (Supabase/KolbySisk) | Supabase | Service-role key server-only; anon key safe only if RLS on every table | Adopt now (rule) | High |
| httpOnly-cookie child token | Supabase | Move child JWT off localStorage (XSS) toward httpOnly+SameSite cookie | Adopt soon | High |

## 6. Deep Dive Notes

> Condensed from completed research. Full evidence (architecture, learn, avoid) lives
> in the orchestrating research session; key load-bearing points captured here.

### Best AI chat UX pattern
**assistant-ui's runtime-vs-primitives decomposition + Streamdown's streaming-safe
rendering.** Separate transport/state ("runtime") from accessible UI primitives
(Thread/Message/Composer/ActionBar). Pair with KaTeX math + graceful incomplete-markdown
parsing + `rehype-harden`/DOMPurify sanitization. Lets Zeluu keep the vanilla frontend
(adopt the *patterns*) and naturally OMIT adult features (model pickers, plugins,
generative-UI artifacts) rather than strip them out. Math-streaming + sanitization is
non-negotiable for a child math tutor.

### Best multi-model routing pattern
**AI SDK provider-registry + middleware as the primary layer; LibreChat `titleModel`
as the canonical task-based-routing example; Portkey (TS edge) as the later upgrade.**
Define a small typed registry of *approved official* providers; select model
server-side per request (never child-exposed). Route by **task/risk class, not
cost-only load balancing** — pin child/sensitive content to the trusted provider by
construction; keep fallbacks within approved trusted providers. Put guardrails +
redaction in one middleware chokepoint. Prefer TS in-process (AI SDK) or TS-edge
(Portkey) over a Python sidecar (LiteLLM). **Avoid** third-party prompt aggregators
(OpenRouter default load-balancing/Auto-Router) for child content.

### Best tutoring / education logic
Two-part (no single repo covers Zeluu's need):
* **Pedagogy/answer-control →** MathDial (move taxonomy + scaffolding-vs-telling
  evidence) + socratic-llm (MIT judge prompt) + MathTutorBench (pedagogy regression
  eval). All math/grade-appropriate; license-clean for the reused parts.
* **Mastery/architecture →** OATutor (structurally gate the answer behind an ordered
  hint chain → mirrors Zeluu L1–L5) + pyBKT (MIT, interpretable, parent-explainable
  mastery; preferred over deep KT for MVP cold-start).

### Best UI libraries by surface
* **Child app:** HeroUI (React Aria a11y/RTL) or restyled shadcn/ui; assistant-ui for
  chat mechanics (heavily de-ChatGPT-ified); Motion + Lottie/Rive for subtle, gated
  animation.
* **Parent dashboard:** Tremor (charts/KPIs) + shadcn/Radix or Mantine; MUI if
  strongest RTL + DataGrid needed.
* **Landing/pricing:** shadcn/ui + Magic UI / Aceternity (free) / React Bits for
  premium hero polish (license-vet, Landing-only); Motion usable in vanilla today.
* **Usable in the current vanilla stack today:** Motion, Lottie, Rive. Everything else
  is React+Tailwind → "study now, adopt after a possible migration."

### Best Supabase / SaaS auth + dashboard pattern *(Q4)*
**makerkit RLS model + Supabase official RLS performance rules + service-role
discipline.** Gives a correct, performant **parent→child** data model: `accounts`
(parent, keyed to `auth.uid()`) + membership rows (child, with `parent_id` FK);
`security definer set search_path=''` helpers (e.g. `has_access_to_child(child_id)`)
to avoid recursive RLS; `(select auth.uid())` wrapping + an index on every policy
column / parent FK for speed; per-operation policies scoped `TO authenticated`; child
rows reached only via `EXISTS (select 1 from parents where id = child.parent_id and
owner = (select auth.uid()))` so a parent sees only their own children and children
never see other families. Service-role client lives **only** in Vercel functions
(webhook + credit grant), never in the vanilla-JS frontend; the anon key is safe in the
browser **only because** RLS is on every table.

### Best onboarding / trial / payment UX pattern *(Q7)*
**LemonSqueezy native card-required trial + leerob's status→access gating + an async
"activating your trial" pending state.** LS natively captures the card, charges
nothing today, and delays first payment to the end of a 14-day trial — matching every
fixed Zeluu rule without custom card handling. Adapt a clean `status → provisioned?`
gate to **LS** statuses (`on_trial`/`active` = access; grant access in every status
except `expired`). Critically: after the post-checkout redirect, show a "We're
activating your trial…" pending screen and grant the 10 credits **only** once the LS
`subscription_created`/`order_created` webhook is verified + deduped — never on the
redirect itself. (A0.5 already implemented the pending-UX copy; this validates that
direction.)

### Best testing / CI pattern
**Vitest + MSW (`onUnhandledRequest:'error'`) for serverless functions + Supabase
`test db` (pgTAP + supabase-test-helpers) for RLS, gated in GitHub Actions.**
Structurally guarantees zero real OpenAI/LemonSqueezy/production calls and tests RLS
where it actually runs. Add Zod fail-fast env validation; promptfoo for AI
safety/age-appropriateness regression (soon); axe + Lighthouse later with the new
frontend.

## 7. Lessons for Zeluu

### AI chat UX lessons
1. Hide model selection entirely; gate any such control behind admin/RBAC.
2. Sanitize all streamed model output before rendering (no injected HTML/links).
3. Use streaming-safe markdown so equations never render half-broken mid-token.
4. KaTeX (not MathJax) for math.
5. Put retry/regenerate/edit in a per-message ActionBar; simplify for young children.
6. Show RAG source citations to build educational trust.
7. Plan EN/AR + RTL from the start (affects whole chat layout).
8. PWA / responsive / mobile-first.
9. Do NOT import adult/power-user features (artifacts, code execution, plugin marketplaces, per-user API keys).

### AI tutoring / education lessons
* **Adopt now:** move planner (Focus/Probing/Telling/Generic) biasing away from
  "Telling"; structural answer-release gate + a cheap leakage judge over each draft
  (regenerate if it reveals the answer early) mapped to L1–L5; four-phase lesson arc
  (Review→Heuristic→Rectification→Summarization); pedagogy regression eval covering
  long pestering dialogues; misconception-grounded distractors for quizzes.
* **Adopt soon/later:** pyBKT mastery + weak-topic detection (once interactions are
  tagged to knowledge components); parent-visible summaries built on mastery +
  answer-reveal flags; teach-back/Feynman gap detection; exam cloning for GCC/UK
  alignment. Defer deep KT (DKT) until data scale exists.
* **Gap:** strongest pedagogy work is math-only + English — Zeluu must extend taxonomy
  /judge/eval to Science, English, and Arabic/RTL itself.

### UI/UX lessons
* Split every recommendation by surface (child / parent / landing).
* Child surface: calm, low-distraction, big tap targets, no raw markdown walls, no
  competitive/social/leaderboard components; gate all motion on `prefers-reduced-motion`.
* Parent surface: trustworthy, clear credit/subscription display (KPI card + progress),
  tables, notification inbox, safety alerts.
* Landing: transparent card-required-trial messaging on pricing cards; premium but
  performance-budgeted motion.
* Best a11y/RTL foundations: Radix + React Aria; MUI has best-documented RTL.

### Signup, trial, checkout & billing lessons (LemonSqueezy)
1. **Webhook idempotency is the #1 fix.** The official LS template
   (`lmsqueezy/nextjs-billing`) does **not** dedup — add a `processed_webhooks` table
   with a **UNIQUE constraint on the LS event id**, `INSERT ... ON CONFLICT DO NOTHING`,
   and run the dedup insert + credit-grant mutation in **one transaction**. Treat
   delivery as at-least-once. Without this, a re-delivered
   `subscription_created`/`order_created` grants the 10 free credits twice.
2. **Grant credits ONLY in the verified webhook handler** (after signature + dedup) —
   never on the post-checkout redirect. Matches Zeluu's fixed rule.
3. **Signature verification:** HMAC-SHA256 of the **raw body** vs `X-Signature`,
   compared with `timingSafeEqual`, before JSON parsing.
4. **Card-required trial is native to LS** — it captures the card and delays first
   payment to trial end. Messaging should be explicit: "Card required. No charge today.
   Charged only if you keep Zeluu after 14 days. 10 free credits unlock once your trial
   activates." (Preserves the fixed model; a no-card trial is only a future experiment.)
5. **Pending-checkout UX:** show "activating your trial" until the webhook lands; poll
   your **own** DB (subscription row written by the webhook), not LS.
6. **Subscription lifecycle (LS, not Stripe):**
   `on_trial → active → past_due → unpaid → cancelled → expired → paused`. Grant app
   access in every status **except `expired`**. Store both `status` and
   `status_formatted`, plus `trial_ends_at`, `renews_at`, `ends_at`.
7. **LemonSqueezy ≠ Stripe — do not copy blindly.** Stripe
   `checkout.session.completed` / `customer.subscription.*` and statuses
   `trialing`/`canceled`/`unpaid` differ from LS `order_created` /
   `subscription_created` / `subscription_updated` / `subscription_payment_success`
   and `on_trial`/`cancelled`/`expired`. Stripe sets trials via `trial_period_days` on
   the API call; LS sets the trial on the **product/variant price**. Use Stripe repos'
   *architecture*, not their event names.
8. **Trial-farming:** don't assume LS fraud-AI blocks same-card repeat trials — enforce
   one-trial-per-parent-account server-side. Do **not** add invasive device
   fingerprinting of children.
9. **Customer portal:** LS provides hosted `customer_portal` / `update_payment_method`
   URLs on the subscription object — no need to build billing-management UI.

### Supabase / auth / security lessons
1. **Service-role safety (high risk):** the service-role key has `BYPASSRLS` — keep it
   only inside Vercel serverless functions (webhook, credit grant). Never in the
   vanilla-JS frontend, never in `*_PUBLIC`/`VITE_*` env, never logged at boot, never in
   error bodies. The anon/publishable key is safe in the browser **only because** RLS
   is on for every table.
2. **Child token storage (high risk):** child JWT in `localStorage` is XSS-exfiltratable.
   For a children's product, move toward an **httpOnly + Secure + SameSite** cookie
   (+ CSRF token), ideally short-lived access token in memory / refresh token in
   httpOnly cookie. (Adopt soon; requires explicit approval — token-storage is a hard
   gate.)
3. **RLS correctness + performance:** wrap `(select auth.uid())` (per-statement
   initPlan caching); **index every column used in a policy** and every parent FK;
   always scope policies `TO authenticated` (correctness + speed); write separate
   policies per operation (SELECT/INSERT/UPDATE/DELETE); use
   `security definer set search_path=''` helpers to avoid recursive RLS.
4. **Parent/child modeling:** parent = account/owner keyed to `auth.uid()`; child =
   member row with `parent_id` FK; child-row policies use `EXISTS`-on-parent so a
   parent sees only their own children and children never see other families. A
   `security definer has_access_to_child(child_id)` helper keeps policies non-recursive.
5. **Migration discipline:** keep everything in `supabase/migrations`, one logical
   change per migration, and test RLS/RPCs with pgTAP-style assertions.
6. **Audit logs without PII:** log event type + opaque account/child UUID + timestamp +
   outcome only — never child message content, names, emails, or child JWTs.
7. **Common Supabase mistakes to avoid:** RLS left disabled on a table (anon key then
   reads everything), service key in the client bundle, role-unscoped policies (missing
   `TO authenticated` → effectively `public`), unwrapped `auth.uid()` (slow), and
   assuming the anon key is "secret."

### Testing / backend lessons
* Never let tests hit real OpenAI/LemonSqueezy/production DB (`onUnhandledRequest:'error'`).
* Test RLS at the DB layer with negative cases first (A cannot read B's child data).
* Fail-fast env validation prevents silent webhook-verification bypass.
* Webhook tests: valid accepted, tampered rejected, raw-body integrity, **idempotency**
  (replayed event grants trial exactly once — requires a processed-event-ID store).
* Use synthetic PII fixtures; never real child data in seeds or eval corpora.

### Security / privacy lessons (cautious legal wording)
> All "recommended for compliance-risk reduction / aligned with privacy-by-design";
> none asserted as a legal mandate; applicability across UK + each GCC jurisdiction
> **requires legal review**.
1. High-privacy defaults + data minimization (ICO Std 7, 8); geolocation/profiling off
   by default (Std 10, 12).
2. No nudging children to share more data / weaken privacy (Std 13).
3. Best-interests-of-the-child + child-friendly transparency.
4. Moderate child input AND AI output every turn; route flags to a parent/safety path
   (verify cultural/linguistic fit for MENA/Arabic).
5. PII minimization in logs/analytics/audit; redact before logging.
6. Parent controls + consent records; support deletion/export.
7. DPIA expected for child-facing AI processing.

## 8. Recommendations by Roadmap Stage

> Indicative; finalize after the pending category and approvals. "Files likely
> affected later" are forward-looking only — A0.6 changes none of them.

| Recommendation | Source inspiration | Stage | Priority | Complexity | Risk | Classification |
|----------------|--------------------|-------|----------|-----------|------|----------------|
| Card-required-trial messaging consistency audit | LS Free Trials docs | A0.5 follow-up | High | Low | Low | Adopt soon |
| Webhook idempotency: `processed_webhooks` table (UNIQUE event id + ON CONFLICT + same-txn grant) | Hookdeck / lmsqueezy/nextjs-billing gap | Stage 1 (design) → later (apply) | High | Med | High | Adopt soon (migration = hard gate) |
| Subscription-lifecycle access gate (`on_trial`/`active`=access; block only `expired`) | LS subscription object / leerob | Stage 1/3 | High | Med | Med | Study → adopt pattern |
| Parent/child RLS hardening (security-definer + `(select auth.uid())` + indexed policy cols) | makerkit / Supabase RLS docs | Stage 1 (doc) → later (apply) | High | Med | High | Study → adopt (migration/RLS = hard gate) |
| Service-role audit (server-only; not in frontend/`*_PUBLIC`) | Supabase secure-data | Stage 1 | High | Low | High | Adopt soon (audit only) |
| Move child JWT off localStorage → httpOnly cookie | JWT-storage tradeoffs | Stage 2 | Med | Med | High | Evaluate (token-storage = hard gate) |
| Vitest + MSW serverless test baseline | Vitest/MSW | Stage 1 | High | Med | Low | Adopt now (on Stage 1 approval) |
| pgTAP RLS isolation tests | Supabase test-helpers | Stage 1 | High | Med | Low | Adopt now (on Stage 1 approval) |
| Zod fail-fast env validation | Zod | Stage 1 | High | Low | Low | Adopt now (on Stage 1 approval) |
| Webhook signature + idempotency tests | LemonSqueezy docs | Stage 1 | High | Med | Med | Adopt now (on Stage 1 approval) |
| promptfoo AI safety regression gate | promptfoo | Stage 1 | Med | Med | Low | Adopt soon |
| Per-turn moderation (input+output) | OpenAI Moderation | Stage 2 | High | Med | Med | Evaluate (privacy review) |
| Streaming-safe markdown + KaTeX + sanitize | Streamdown | Stage 2 | High | Med | Low | Study → adopt pattern |
| Chat primitives (Thread/Composer/ActionBar) | assistant-ui | Stage 2 | Med | Med | Low | Study → adopt pattern |
| Answer-release gate + leakage judge | socratic-llm/MathDial/OATutor | Stage 2/5 | High | Med/High | Med | Study → adopt pattern |
| Parent-dashboard charts/KPIs | Tremor | Stage 3 | Med | Med | Low | Adopt after migration |
| Notification inbox / safety alerts | Mantine/Radix | Stage 3 | Med | Med | Low | Evaluate later |
| Transparent pricing cards | shadcn/Magic UI | Stage 4 | Med | Low | Low | Study only |
| Mastery / weak-topic (BKT) | pyBKT | Stage 5 | Med | High | Med | Adopt soon (later stage) |
| Typed provider registry + task routing | AI SDK / LibreChat titleModel | Future AI router | High | Med | Med | Adopt soon (when multi-provider) |
| TS-edge gateway (conditional routing + guardrails) | Portkey | Future AI router | Low | High | Med | Evaluate later |

## 9. What to Avoid

* Restrictive licenses masquerading as OSS (Open WebUI License, LobeHub Community
  License); copyleft for closed SaaS (tutor-gpt GPL-3.0, Studyield AGPL-3.0);
  non-commercial data (SocraticMath CC BY-NC); Commons Clause (React Bits);
  mixed AGPL (Origin UI); per-author registries (21st.dev). Vet SPDX before any reuse.
* Adopting any React/Svelte app wholesale → would force the unapproved migration.
* Plugin / tool / code-execution ecosystems (LibreChat, Lobe, AnythingLLM) → abuse
  surface inappropriate for ages 6–15.
* Adult model-picker / BYO-API-key UX → violates "no model picker for children".
* Third-party prompt aggregation for child content (OpenRouter default routing).
* Flashy/animated UI in the child learning flow (Magic UI, Aceternity, React Bits,
  Motion Primitives) → distraction + motion-sensitivity; Landing-only.
* Leaderboards / social / competitive gamification for children.
* Logging child messages verbatim; session replay/heatmaps on child sessions;
  invasive fingerprinting; geolocation/profiling on by default.
* Tests hitting real OpenAI/LemonSqueezy/production DB; real child data in test seeds.
* Treating axe / moderation / Llama Guard as "compliance done" — they reduce risk, not
  a legal guarantee.
* **Shipping the official LS billing webhook as-is** (`lmsqueezy/nextjs-billing` has no
  idempotency guard) → duplicate credit grants on re-delivery.
* **Granting credits on the post-checkout redirect** instead of the verified webhook.
* **Copying Stripe event names/statuses** (`checkout.session.completed`, `trialing`,
  `customer.subscription.*`) into the LS handler — they will never fire.
* Depending on **archived** (`vercel/nextjs-subscription-payments`) or **closed/paid**
  (Supastarter, MakerKit core) billing kits as a foundation for a children's product.
* **Service-role key in the frontend / `*_PUBLIC` env / logs / error bodies**; leaving
  RLS disabled on any table (anon key then reads everything); role-unscoped
  (`public`) RLS policies.
* Assuming LS fraud-AI prevents trial farming; adding invasive device fingerprinting
  of children to compensate.

## 10. Approvals Needed

* **Dependency approvals** — Vitest, MSW, Zod, promptfoo, Playwright, axe, etc.
  (none installed; Stage 1 gate).
* **License approvals** — any repo/library before code reuse (esp. copyleft / NC /
  Commons Clause / restrictive).
* **Architecture approvals** — AI router abstraction; React/Vite migration.
* **Privacy approvals** — per-turn moderation of child content; any new AI provider;
  any analytics.
* **Model provider approvals** — adding non-OpenAI providers for routing.
* **UI migration approvals** — adopting any React-bound library.
* **Testing tool approvals** — Stage 1 toolchain selection.

## 11. Status

**Complete.** All 8 categories researched and preserved above (Cat 3 SaaS billing +
Cat 4 Supabase security completed 2026-06-03). No code copied. No packages installed.
No source files changed. Adoption of any item remains gated on license/security/privacy
review and the relevant hard gates (migrations, RLS/auth, token storage, payment logic,
dependency installs, React/Vite) — none of which are authorized by this research.

## 12. Next Research Step

Research is complete; no further A0.6 research step is required. The natural next
*planning* step (separate, requires approval) is to fold the Stage-1 testing baseline +
billing-idempotency + RLS/parent-child hardening recommendations into a Stage 1
test/schema/tooling plan spec — **planning/docs only, no implementation, no migrations,
no installs.** A focused follow-up could also re-verify the few repo internals that
returned empty on direct fetch (Vercel `supabase-admin.ts`), though the lifecycle facts
were confirmed from each repo's webhook dispatch and official docs.
