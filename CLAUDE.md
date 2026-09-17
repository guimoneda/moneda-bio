# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal bio/portfolio site for Guilherme Moneda (`guimoneda.com`). Consists of a Django REST API backend, a React/TypeScript frontend, and Playwright E2E tests. Deployed via Docker Compose with a Cloudflare tunnel.

## Commands

### Backend (Django)
```bash
cd backend
python manage.py runserver          # Dev server on :8000
python manage.py makemigrations
python manage.py migrate
python manage.py test resume        # Run backend tests
```

Required env vars: `DJANGO_SECRET_KEY`, `DATABASE_URL` (falls back to SQLite if missing).

### Frontend (React)
```bash
cd frontend
npm start                           # Dev server on :3000
npm run build
npm test                            # Jest/Testing Library (watch mode)
npm test -- --watchAll=false        # Run once (CI mode)
```

### E2E Tests (Playwright)
```bash
npx playwright test                 # Run all tests against https://guimoneda.com
npx playwright test tests/smoke.spec.ts   # Run a single spec file
npx playwright test --reporter=list # Output in terminal instead of HTML
```

Playwright tests target the **production site** (`https://guimoneda.com`) by default. Override with `BASE_URL` to run against a local build or preview deployment:

```bash
BASE_URL=http://localhost:3000 npx playwright test
```

Because the default target is production, spec changes only pass once the frontend has been deployed.

### Docker (full stack)
```bash
docker compose up           # Start all services (db, backend, frontend, cloudflared)
docker compose up backend   # Start a single service
```

Requires a `.env` file with: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DJANGO_SECRET_KEY`, `TUNNEL_TOKEN`.

## Architecture

### Backend (`backend/`)
- **Django 4.2** + **Django REST Framework** — read-only API (no authentication required)
- Single app: `resume/` — exposes three list endpoints:
  - `GET /api/jobs/` — work history, sorted by start date
  - `GET /api/education/` — education records
  - `GET /api/certifications/` — certifications, sorted by issue date desc
- `Job.description` and `more_details` are CKEditor `RichTextField` — stored as HTML, rendered client-side via `dangerouslySetInnerHTML`
- `Job.technologies` is a PostgreSQL `ArrayField` — requires Postgres in production (SQLite fallback for local dev only)
- Static files served by WhiteNoise; media files served via `re_path` in `urls.py`
- Cloudflare is the SSL terminator — Django trusts `X-Forwarded-Proto` header

### Frontend (`frontend/`)
- **React 19** + **TypeScript** + **Create React App**
- **Tailwind CSS** driven entirely by design tokens — see "Design system" below
- **motion/react** (Framer Motion v12 alpha) for entry choreography, page transitions and the shared-layout detail panel
- Two routes: `/` (Home — Hero + technology marquee + 3 latest roles) and `/jobs` (full record: experience, education, certifications)
- `JobList` accepts a `limit` prop to cap displayed items
- Data access goes through `useResource` (`src/hooks/useResource.ts`), which models loading/ready/error explicitly and caches each URL at module level so `/api/jobs/` crosses the wire once per page view
- The CRA dev server proxies `/api/` requests to the Django backend (implicit via browser — no explicit proxy config in `package.json`)

### Design system — "Instrument"
Technical-editorial: ink on bone, hairline rules, one accent, no rounded corners.

- **Tokens** live as `R G B` triples on `:root` in `src/index.css` and are mapped to Tailwind utilities in `tailwind.config.js`: `canvas`, `panel`, `panel-hi`, `ink`, `mute`, `rule`, `signal`, `signal-ink`. Never hard-code a colour — add or use a token, so both themes stay in step.
- **Two themes**, `data-theme="ink"` (dark) and `data-theme="paper"` (light), resolved before first paint by an inline script in `public/index.html` and toggled via `src/lib/theme.tsx`. Default follows `prefers-color-scheme`.
- **One accent only** (`signal`). Status, focus, hover and emphasis all use it; resist introducing a second hue.
- **Type**: Bricolage Grotesque (display), Inter Tight (body), JetBrains Mono (all metadata/labels). Display sizes are fluid `clamp()` steps (`text-display-xl` … `text-display-sm`); the `.label` component class is the monospace metadata voice.
- **One easing curve**, `ease-instrument`, for every transition.
- **Reduced motion** is honoured per-component, not just globally: components branch on `useReducedMotion()` to render a deliberate static composition (e.g. `Marquee` wraps instead of scrolling, `SignalGrid` draws one settled frame).

### Tests (`tests/`)
- Playwright specs in `tests/` run against production
- `tests/seed.spec.ts` is referenced as a seed dependency in spec comments
- Test plan lives in `specs/static-webserver-test-plan.md` — spec files reference it via `// spec:` comment

## Key Conventions

- Experience is an **editorial index of rows**, not a grid of cards. Rows use **Framer Motion shared layout** (`layoutId={card-${id}}`): clicking a row morphs it into the detail panel. The same `layoutId` is on both the row and the panel — do not break this pairing.
- Job `description` (short) is shown in the detail panel first, followed by `more_details` — they are rendered as two separate blocks, not concatenated into one HTML string.
- CKEditor HTML from the API is rendered through `RichText`, which applies the `.rich` typographic contract from `index.css`. Do not drop raw `dangerouslySetInnerHTML` into components.
- Job ordering is handled client-side by `byNewest` in `src/lib/jobs.ts` (sort by `start_date` descending), not via Django `Meta.ordering`.
- **Never hard-code figures that the API already knows.** Hero statistics come from `deriveStats` in `src/lib/jobs.ts`, and the technology marquee is built from the technologies recorded against roles.
- Playwright specs target elements by `data-testid` and accessible role/name, never by Tailwind class. Styling changes must not break the suite.
