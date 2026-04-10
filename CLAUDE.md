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

Playwright tests target the **production site** (`https://guimoneda.com`) — there is no local dev server wired up in `playwright.config.ts`.

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
- **Tailwind CSS** for styling (dark theme, `bg-gray-900` base)
- **motion/react** (Framer Motion v12 alpha) for card animations and expand/collapse transitions
- Two routes: `/` (Home — shows Hero + 3 latest jobs) and `/jobs` (full job history)
- `JobList` component accepts a `limit` prop to cap displayed items; fetches from `/api/jobs/` at runtime
- The CRA dev server proxies `/api/` requests to the Django backend (implicit via browser — no explicit proxy config in `package.json`)

### Tests (`tests/`)
- Playwright specs in `tests/` run against production
- `tests/seed.spec.ts` is referenced as a seed dependency in spec comments
- Test plan lives in `specs/static-webserver-test-plan.md` — spec files reference it via `// spec:` comment

## Key Conventions

- Job cards use **Framer Motion shared layout** (`layoutId={card-${id}}`): clicking a card expands it into a modal overlay. The same `layoutId` is on both the card and the expanded modal — do not break this pairing.
- Job `description` (short) is shown on the card; `more_details` (long) is concatenated in the expanded modal view.
- The `Job` model's ordering is handled client-side in `JobList.tsx` (sort by `start_date` descending), not via Django `Meta.ordering`.
