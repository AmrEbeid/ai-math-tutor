# Design-sync session handoff

A map of the Zeluu Claude Design work, so a reviewer (or the next session) can act
without re-reading everything. **All of it is design-sync artifacts** — the
production app (`public/`, `api/`, root `package.json`) was never touched.

Claude Design project: `https://claude.ai/design/p/bdb471bb-97d4-4fd4-9513-ab00e2e04e8f`

## What exists on `main` (merged)
- **21-component design library** under `ds-src/` (isolated artifact, not a prod React migration) → synced to Claude Design, **teal Spark brand**.
- Usage guidelines + **8 worked screen examples** index, conventions header, `ds-src` README, contract tests (20), CI workflow, NOTES with re-sync gotchas.
- See `.design-sync/examples/README.md` for the screen catalog.

## Open PRs — suggested review order
Each PR is a single isolated file; none auto-merged (per the review-gate request).

1. **#48 — library theme/RTL fix (highest priority; touches the shipped bundle).**
   Two real bugs found by headless verification, fixed faithfully from the product's
   own overrides: PlanCard featured card in dark mode, ChatBubble in RTL. Already
   live in the Claude Design project.
2. **Screen examples** (`.design-sync/examples/*.html`), each composed only from
   `window.ZeluuDS.*` + the bundle CSS:
   - #40 child tutor (Socratic chat) — incl. mobile-overflow fix
   - #41 sign in / sign up
   - #42 pricing
   - #43 exam-prep
   - #44 account & parent-controls — incl. mobile-overflow fix
   - #46 per-child progress report
   - #47 first-run onboarding (add child)
   - #45 examples index README
   - (#39 parent dashboard already merged)

## Verification done (reliable axes)
| Axis | Result |
|---|---|
| Light | ✓ |
| Dark | ✓ — fixed PlanCard featured inversion (#48) |
| RTL / Arabic | ✓ — fixed ChatBubble margin/corners (#48) |
| Mobile (390px) | ✓ — fixed child-tutor (#40) + account (#44) overflow |
| Contrast (WCAG) | spot-check passes (white-on-teal = 6.4:1); product tokens were AA-audited. Automated full-page contrast tooling was unreliable for this oklch/transparent system — not a confirmed issue, noted honestly. |

**4 real bugs were caught by verification and fixed** (2 library, 2 screens).

## Known minor / deliberately-left
- `.save-badge` has no RTL override — **faithful** (the product ships none).
- The `.plan-btn` (non-featured CTA) inverts to a light button on dark cards —
  **faithful** (the product ships no dark override for it).

## Gated / not done (needs explicit owner approval)
- **React/Vite/Tailwind/shadcn migration** — a `CLAUDE.md` hard gate. Not started.
- Migrating the production pages onto the component library (class names already match).

## How to run a screen
See `.design-sync/examples/README.md` ("How to render one"). To re-sync the library
after a change, see `.design-sync/NOTES.md` ("Re-sync procedure" + "Gotchas").
