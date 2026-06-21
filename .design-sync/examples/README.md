# Zeluu design-system — worked screen examples

Full, production-realistic Zeluu screens composed **entirely from the synced
design-system components** (`window.ZeluuDS.*`) + the bundle CSS, in the teal
Spark brand. They show how the 21 components assemble into real product surfaces —
the reference an engineer (or Claude's design agent) starts from when building a
new screen.

> These are **design-sync artifacts**, not the production app. The production app
> (`public/`, `api/`) is independent and unaffected.

## The screens

| File | Surface | Demonstrates |
|---|---|---|
| `parent-dashboard.html` | Parent home | `StatCard`, `Card`, `ProgressBar`, `CreditBadge`, `InfoCell`, `Badge`, `Button`, `NavBar` — children's weekly progress, credits, recent activity, recommended actions, **empty + error-safe states** |
| `child-tutor.html` | Child AI-tutor chat | `SubjectTab`, `ChatBubble`, `Spinner`, `ProgressBar`, `CreditBadge`, `TopicTag` — Socratic dialogue (guides, never gives answers), daily goal, low-credit safe state, parent-visibility footer |
| `auth.html` | Sign in / sign up | `Card`, `FormField`, `Toggle`, `Button` — mode switch, trust signals (encrypted · COPPA-aligned · chat-visible) |
| `pricing.html` | Pricing | `NavBar`, `Container`, `Toggle`, `PlanCard`, `Button` — Annual/Monthly price toggle, featured plan, parent FAQ |
| `exam.html` | Exam-prep question | `Container`, `ProgressBar`, `Card`, `TopicTag`, `Button` — timer, A–D selected-option pattern, Socratic hint nudge |
| `account.html` | Parent control center | `Card`, `Toggle`, `InfoCell`, `CreditBadge`, `FormField`, `Badge`, `Button` — plan & credits, children management, **safety/privacy On-Off controls** (the differentiator) |

The interactive ones (pricing toggle, auth mode, exam selection, account toggles)
use real `useState` — they genuinely work, not static mockups.

## How to render one

The files reference the built bundle's assets by **relative path** (`./styles.css`,
`./_ds_bundle.js`, `./_vendor/*`), so they run from inside a built `ds-bundle/`:

```sh
# 1. Build the design bundle (if ds-bundle/ is absent) — see ../NOTES.md:
( cd ds-src && npx tsc -p tsconfig.json && node styles/build-css.mjs )
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ds-src/node_modules --entry ./ds-src/dist/index.js --out ./ds-bundle

# 2. Drop a screen into the bundle and serve it:
cp .design-sync/examples/parent-dashboard.html ds-bundle/
npx serve ds-bundle   # then open /parent-dashboard.html
```

Or paste the inline `<script>` composition into claude.ai/design, where
`window.ZeluuDS` and the styles are already present.

## Design principles these screens follow
- **Compose components; style glue with tokens.** No hardcoded colors — `var(--color-*)`.
- **On-brand by construction** — every screen renders in the teal Spark brand because it uses the bundle CSS.
- **Zeluu identity, not generic SaaS** — parent-controlled, child-safe, Socratic (the tutor guides, never gives answers); realistic copy; real empty/error/limit states.
