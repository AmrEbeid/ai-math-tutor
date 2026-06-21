# @zeluu/design-system (`ds-src`)

**Isolated design-sync artifact — not a production app, not a framework migration.**

This package exists so Zeluu's UI can be synced to **Claude Design**
(claude.ai/design) as a real component library. It is a thin, typed React
wrapper layer over the product's **real CSS**: each component emits the exact
class names the static product pages already use, and the styling is CSS
**extracted verbatim** from the page `<style>` blocks. The production app
(`public/`, `api/`, root `package.json`) does **not** depend on this package and
is never modified by it.

> If you're looking for how the *sync itself* works (the converter, upload,
> re-sync), see `../.design-sync/NOTES.md`. This README is just the source package.

## What's here

```
ds-src/
├── src/              18 components (.tsx) + index.ts barrel
├── styles/
│   ├── components.css   component CSS, extracted verbatim from the product pages
│   └── build-css.mjs    assembles the bundle CSS: fonts → tokens → brand rollout → components
├── tests/            component class-name contract tests (react-dom/server)
├── tsconfig.json     emits dist/*.js + *.d.ts
└── package.json
```

The 18 components: `Button`, `NavBar`, `LiveBadge`, `Card`, `Feature`, `Step`,
`Stat`, `StatCard`, `PlanCard`, `FormField`, `Modal`, `Spinner`, `CreditBadge`,
`InfoCell`, `SubjectTab`, `TopicTag`, `ChatBubble`, `Container`.

## Build & test

```bash
npm install
npm run build   # tsc → dist/  +  node styles/build-css.mjs → styles/ds-bundle.css
npm test        # build, then the component contract tests
```

`dist/`, `styles/ds-bundle.css`, and `node_modules/` are generated/installed and
gitignored. The committed source (`src/`, `styles/components.css`,
`styles/build-css.mjs`, `package.json`, `tsconfig.json`) is the source of truth.

## Brand

`build-css.mjs` applies the product's **brand rollout** — it routes
`--color-accent`/`-dark`/`-light` to the teal `--brand-primary` foundation
(light + dark), so the synced library renders the **same teal brand the product
currently ships** (12/13 pages; `index.html` migration pending). The teal values
live in `../public/css/zeluu-tokens.css` and are pulled automatically; only the
mapping is fixed here. If the brand direction changes, edit the `ROLLOUT` block.

## Keeping it faithful

`styles/components.css` is a **manual** extraction. If the product's component CSS
changes, re-extract it. Tokens and the brand rollout are pulled from the live
sources automatically on rebuild. The Claude Design project this syncs to:
`https://claude.ai/design/p/bdb471bb-97d4-4fd4-9513-ab00e2e04e8f`.
