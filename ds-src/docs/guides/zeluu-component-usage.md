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
| Feature availability | `Badge` | `status="now"` (accent) vs `status="soon"` (muted) status pill |
| Progress / usage meter | `ProgressBar` | `value` 0–100; thin accent fill on a track |
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

## Worked examples (screen-level composition)

Full screens assembled from the library + token glue. Components come from
`window.ZeluuDS`; layout uses `var(--*)` tokens. These show how the parts fit
together — adapt the content, keep the structure.

### Pricing section

```jsx
const { Container, NavBar, Button, Toggle, PlanCard } = window.ZeluuDS;

<>
  <NavBar brand="Zeluu" logo="✦" actions={<Button href="/login" variant="secondary" size="sm">Sign in</Button>} />
  <Container>
    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0 var(--spacing-md)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)' }}>Simple, child-first pricing</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Cancel anytime. 7-day free trial.</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
      <Toggle value="annual" options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual', badge: 'Save 20%' }]} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
      <PlanCard name="Solo" credits="500 credits / mo" price="$9" priceSuffix="/mo" features={['1 child', 'All subjects', 'Homework help']} ctaLabel="Start trial" />
      <PlanCard featured popLabel="Most popular" name="Family" credits="2,000 credits / mo" price="$29" priceSuffix="/mo" features={['Up to 4 children', 'All subjects', 'Progress reports', 'Priority support']} ctaLabel="Start trial" />
      <PlanCard name="School" credits="Unlimited" price="Custom" features={['Classrooms', 'Admin dashboard', 'SSO']} ctaLabel="Contact us" />
    </div>
  </Container>
</>
```

### Parent dashboard panel

```jsx
const { Container, Card, StatCard, InfoCell, ProgressBar, CreditBadge, Button } = window.ZeluuDS;

<Container>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
    <StatCard value="1,240" label="Credits left" />
    <StatCard value="18" label="Lessons this week" />
    <StatCard value="6" label="Day streak" />
  </div>
  <Card header={<><strong>Layla — Grade 5</strong><CreditBadge level="low">45 left today</CreditBadge></>}>
    <div style={{ margin: 'var(--spacing-sm) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
        <span>Monthly credits</span><span>820 / 2,000</span>
      </div>
      <ProgressBar value={41} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xs)' }}>
      <InfoCell label="Plan" value="Family" />
      <InfoCell label="Renews" value="Jul 14" />
      <InfoCell label="Top subject" value="Mathematics" />
    </div>
    <div style={{ marginTop: 'var(--spacing-md)' }}><Button>Open child app</Button></div>
  </Card>
</Container>
```

### Tutor chat view

```jsx
const { SubjectTab, ChatBubble } = window.ZeluuDS;

<div style={{ maxWidth: 560, margin: '0 auto' }}>
  <div className="subject-tabs">
    <SubjectTab label="Math" icon="🧮" active />
    <SubjectTab label="Science" icon="🔬" />
    <SubjectTab label="English" icon="📖" />
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 'var(--spacing-md) 0' }}>
    <ChatBubble role="user">How do I add 1/2 and 1/3?</ChatBubble>
    <ChatBubble role="assistant">Great question! First we need a common denominator. What number do both 2 and 3 divide into?</ChatBubble>
    <ChatBubble role="user">6?</ChatBubble>
    <ChatBubble role="assistant">Exactly 👏 So 1/2 becomes 3/6 and 1/3 becomes 2/6. Now add the tops…</ChatBubble>
  </div>
</div>
```
