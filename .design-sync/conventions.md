# Zeluu Design System

Zeluu is a parent-controlled AI tutor for Math, Science & English, grades 1–9.
Its identity is **warm-editorial**: a soft OKLCH cream/teal palette, the
**Fraunces** display serif for headings paired with **Plus Jakarta Sans** for
body text. This project ships **21 real, importable components** plus the full
token layer. Build UI by composing these components and styling your own layout
glue with the tokens below.

## Setup — no provider, no wrapper

Components are plain React and style themselves from CSS custom properties. There
is **no provider or root wrapper** to mount: as long as the bundle's `styles.css`
is loaded, every component and every `var(--*)` token resolves on any element.
The two brand fonts load remotely (Google Fonts) via `styles.css`'s import
closure — no font setup needed.

- **Dark theme** is opt-in and centralized: set `<html data-theme="dark">`. Only
  color tokens redefine; spacing/radius/type/motion are theme-independent. Never
  hardcode dark colors — flip the attribute.
- **RTL** (the child app supports Arabic): set `dir="rtl"` on the document.

## Components (`window.ZeluuDS.*`)

Import from the bundle global `ZeluuDS`. Each has a typed `<Name>Props` contract
(see its `.d.ts` / `.prompt.md`). Grouped by use:

| Group | Components |
|---|---|
| Actions & status | `Button` (variant primary/secondary/white, size sm/md/large, `href` → link), `Toggle` (segmented control), `Spinner`, `LiveBadge`, `CreditBadge` (level normal/low/empty), `Badge` (status now/soon) |
| Surfaces & layout | `Container`, `Card` (optional `header`), `Modal` (`title`, `closable`), `NavBar` (`brand`/`logo`/`actions`) |
| Marketing | `Feature` (`icon`/`title`), `Step` (`number`/`title`), `Stat` (`value`/`label`, designed for the accent band), `PlanCard` (`featured`, `features[]`, `price`…) |
| App / dashboard | `StatCard` (`value`/`label`), `InfoCell` (`label`/`value`), `SubjectTab` (`label`/`icon`/`active`), `TopicTag`, `ChatBubble` (`role` user/assistant), `FormField` (`label`/`type`/`error`), `ProgressBar` (`value` 0–100) |

Composition notes that matter:
- `Stat` inherits its container's color — place it on a teal/accent band
  (`background: var(--color-accent)`), as in the marketing stats row.
- `SubjectTab`s belong in a `.subject-tabs` row; one carries `active`.
- `ChatBubble role="user"` is teal and right-aligned; `role="assistant"`
  is cream, bordered, left-aligned — stack them in a column for a conversation.
- `PlanCard featured` is the inverted dark "recommended" column.

## Styling idiom — tokens via `var(--*)`

For your own layout/glue, style through these custom properties (defined in
`tokens` / inlined in the bundle CSS). Do **not** invent class names or hex
colors — use the tokens so light/dark and brand stay consistent.

| Group | Tokens (real names) |
|---|---|
| Surfaces | `--color-cream`, `--color-warm-bg`, `--color-surface`, `--color-surface-glass` |
| Text | `--color-text-dark`, `--color-text-muted`, `--color-text-light` |
| Border | `--color-border` |
| Brand accent (teal) | `--color-accent`, `--color-accent-dark`, `--color-accent-light` |
| Status | `--color-success`, `--color-error`, `--color-warning` |
| Type | `--font-display` (Fraunces, headings), `--font-body` (Plus Jakarta Sans) |
| Spacing | `--spacing-xs` 8 · `--spacing-sm` 16 · `--spacing-md` 24 · `--spacing-lg` 40 · `--spacing-xl` 64 · `--spacing-2xl` 100 |
| Radius | `--radius-sm` 8 · `--radius-md` 12 · `--radius-lg` 16 · `--radius-xl` 24 · `--radius-full` 999 |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

## Where the truth lives

Read the component `.d.ts` / `.prompt.md` for exact props, and the bundle
`styles.css` (and its `_ds_bundle.css` / token closure) for the real values
before styling.

## Idiomatic snippet

```jsx
const { Card, Button, CreditBadge } = window.ZeluuDS;

<Card header={<><strong>Layla's progress</strong><CreditBadge level="low">45 left</CreditBadge></>}>
  <p style={{ color: 'var(--color-text-muted)' }}>Grade 5 · Mathematics</p>
  <div style={{ marginTop: 'var(--spacing-md)' }}>
    <Button href="#">Resume lesson</Button>
  </div>
</Card>
```
