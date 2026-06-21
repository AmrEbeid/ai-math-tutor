# Zeluu — component usage guidelines

Practical guidance for composing screens with the Zeluu component library. The
README conventions header covers setup, tokens, and the styling idiom; this doc
covers **which component to reach for and how to compose it**.

## Audience & voice

Zeluu serves **parents** (account, billing, dashboard, marketing pages) and
**children grades 1–9** (the tutoring app). Match the surface:

- **Parent surfaces** — calm, trustworthy, editorial. Fraunces headings, generous
  spacing, teal accents used sparingly for primary actions.
- **Child surfaces** — warmer and more direct, but never childish; the same
  palette, larger tap targets, encouraging copy.

## Choosing components

| Need | Use | Notes |
|---|---|---|
| Primary action | `Button` (`variant="primary"`) | One primary per view; outline (`secondary`) for the rest |
| Action on a teal/dark band | `Button variant="white"` | The filled variant disappears on accent surfaces |
| Link styled as a button | `Button href="…"` | Renders an `<a>`; use for navigation, not form submits |
| Page section wrapper | `Container` | Centers to 1280px with gutters |
| Grouped content / dashboard panel | `Card` | Pass `header` for a title + action row |
| Confirm / detail dialog | `Modal` | Always a focused decision; keep body short, 1–2 actions |
| Marketing value prop | `Feature` | Icon + title + one tight sentence |
| Onboarding / "how it works" | `Step` | Number + title; lay 3–4 in a row |
| Big marketing number | `Stat` | Place on an accent band — it inherits the band's color |
| Dashboard metric | `StatCard` | Bordered, teal value; use in a metrics grid |
| Pricing column | `PlanCard` | One `featured` per pricing table (the recommended plan) |
| Read-only account field | `InfoCell` | Label + value tiles in a 2–3 col grid |
| Form input | `FormField` | Pass `error` to surface validation inline |
| Remaining credits | `CreditBadge` | `level` shifts color: normal → low → empty |
| Binary/segmented choice (billing, etc.) | `Toggle` | Pill segmented control; 2–3 options, one active, optional per-option `badge` |
| Subject switcher (child app) | `SubjectTab` | Group in `.subject-tabs`; exactly one `active` |
| Topic / skill chips | `TopicTag` | Inline cloud; keep labels short |
| Tutor conversation | `ChatBubble` | `role="user"` (right) / `role="assistant"` (left) |
| Inline loading | `Spinner` | Always give it context (text or inside a button) |
| Live/highlight pill | `LiveBadge` | Small status flag; the dot is optional |

## Composition rules that matter

- **`Stat` needs a colored band.** Its number inherits the parent color, so wrap
  groups in `background: var(--color-accent)` (the marketing stats row). On white
  it's invisible — use `StatCard` instead for light surfaces.
- **`SubjectTab`s live in a row.** Wrap them in `<div className="subject-tabs">`
  and mark exactly one `active`; a lone tab reads as a stray button.
- **`ChatBubble` conversations** are a vertical flex column with gap; user bubbles
  align right, assistant left. Don't center them.
- **`PlanCard featured`** is the inverted dark "recommended" column — use it once
  per pricing table, not for every plan.
- **`Modal`** is for a single decision. Keep it to a short body + 1–2 actions
  (primary + cancel). Don't build multi-step flows inside one.

## Don'ts

- Don't hardcode colors — use `var(--color-*)` so light/dark and brand hold.
- Don't invent class names; compose the provided components + token-styled glue.
- Don't put a filled `Button` on an accent surface (use `variant="white"`).
- Don't use `Stat` on a white background (use `StatCard`).
- Don't stack more than one `primary` Button in a single view.

## Theming

Light is default; set `<html data-theme="dark">` for the warm-dark theme. Never
hardcode dark values — only color tokens redefine; spacing/radius/type are shared.
For the child app's Arabic mode, set `dir="rtl"` on the document.
