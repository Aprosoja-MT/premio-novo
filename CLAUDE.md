# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Run production server
pnpm typecheck    # TypeScript type checking
```

No test framework is configured.

## Architecture

This is a **React Router v7** full-stack app with SSR enabled, built with Vite and TypeScript.

### Directory split

| Path | Purpose |
|------|---------|
| `app/` | Framework layer: routes, root layout, shared UI primitives, utilities |
| `ui/` | Presentation layer: full-page components and section-level components |
| `public/` | Static assets (images, custom fonts) |

### Path aliases

- `~/*` → `app/*`
- `@/*` → `ui/*`

### Routing

Routes are declared in [app/routes.ts](app/routes.ts) using React Router file-based config. The home page maps to [app/routes/home.tsx](app/routes/home.tsx), which renders the `HomePage` from `@/pages/home`. A catch-all `$.tsx` handles 404s.

### Component pattern

Section components under `ui/pages/home/components/` each follow a **controller + view** split:

- `index.tsx` — pure presentational JSX, receives props
- `useXxxController.ts` (or `Controller.ts`) — encapsulates state/logic, returns props consumed by the view

### Styling

TailwindCSS v4 with a custom design token set (teal, mint, cream palette matching Aprosoja brand) defined in [ui/styles/app.css](ui/styles/app.css). The custom font "Heading Now Trial 45" lives in `public/fonts/`.

shadcn/ui components are added via CLI to `app/components/ui/`. Shared primitives like `Button` and `CurvedSection` live in [app/components/ui/](app/components/ui/).
