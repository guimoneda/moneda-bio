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

## Deploying

One path: the NAS pulls. Nothing reaches into the network, and no deploy
credential exists outside the house.

**`scripts/nas-pull-deploy.sh`, run on the NAS.** Asks GitHub whether `main` has
moved and acts on the answer. Install on a short schedule:

```bash
line='*/5 * * * * /volume2/docker/moneda-bio/scripts/nas-pull-deploy.sh'
( crontab -l 2>/dev/null | grep -Fv 'nas-pull-deploy.sh'; echo "$line" ) | crontab -
crontab -l    # must echo the job back
```

Install it by piping, not with `crontab -e`. With no `EDITOR` set — the default
on this NAS — `crontab -e` exits in a way it treats as an abort, prints `edits
left in /tmp/crontab.XXXX/crontab` and installs nothing. That message reads like
a saved backup rather than a failure, and a deploy that was never scheduled
looks exactly like a deploy that has nothing to do: no errors, no log lines,
`.deploy.log` simply absent. Verify with `crontab -l`, and verify a daemon
exists to run it (`pgrep -x crond || pgrep -x cron`).

It exits silently when the checkout already matches origin, refuses to run if
`.env` is missing (secrets stay on the NAS and are never written by a deploy),
builds the images one at a time, leaves `cloudflared` alone, and fails if the
frontend does not report healthy afterwards. `flock` prevents overlapping runs.
It sets its own `PATH` and checks for `git`, `docker` and `flock` up front,
because cron starts jobs with a near-empty environment. Output goes to
`.deploy.log` in the repository root, which is gitignored.

A push-based job used to exist alongside it (`.github/workflows/docker-image.yml`),
SSHing in over the Cloudflare tunnel. It is gone. The tunnel intermittently
refused the SSH hostname at the edge even while serving the site normally, and
the job required GitHub to hold an SSH key, the NAS hostname and every
production secret in order to rewrite `.env` on each run. Do not reintroduce it.
`.github/workflows/smoke.yml` is what remains: it verifies the live site after a
push to `main`, and deploys nothing.

Because the deploy is a cron, a merge to `main` is live within about five
minutes rather than immediately. The smoke workflow waits that interval out on a
timer; it does not read back which commit the NAS is serving, because the site
exposes no build stamp.

The deploy never restarts `cloudflared`: recreating it drops the tunnel, which
used to make a successful deploy report failure. Restart it by hand when its own
configuration changes — including after the image pin in `docker-compose.yml`
is bumped.

### Tunnel routes

Ingress lives in the Cloudflare dashboard, not this repository, so the two can
drift. Two things about it are worth knowing before changing anything:

- **`/admin` is published to the internet**, routed to `bio-backend`. It is
  protected by a Django password and nothing else — no rate limiting, no second
  factor. It is also the only page that loads CKEditor, which is unpatched and
  unpatchable for free (see the `ckeditor.W001` system check), and the only page
  served without the CSP that `frontend/nginx.conf` applies to everything else.
  Putting Cloudflare Access in front of this route is the single highest-value
  hardening available here.
- **At least one route targets a container this file does not define.** For that
  name to resolve, `cloudflared` must have been attached to a network outside
  this Compose project. Recreating it from Compose alone would drop that
  attachment and break the route without any error in the deploy log. Run
  `docker inspect cloudflared --format '{{json .NetworkSettings.Networks}}'`
  first and re-attach afterwards.

## Key Conventions

- Experience is an **editorial index of rows**, not a grid of cards. Rows use **Framer Motion shared layout** (`layoutId={card-${id}}`): clicking a row morphs it into the detail panel. The same `layoutId` is on both the row and the panel — do not break this pairing.
- Job `description` (short) is shown in the detail panel first, followed by `more_details` — they are rendered as two separate blocks, not concatenated into one HTML string.
- CKEditor HTML from the API is rendered through `RichText`, which applies the `.rich` typographic contract from `index.css`. Do not drop raw `dangerouslySetInnerHTML` into components.
- Job ordering is handled client-side by `byNewest` in `src/lib/jobs.ts` (sort by `start_date` descending), not via Django `Meta.ordering`.
- **Never hard-code figures that the API already knows.** Hero statistics come from `deriveStats` in `src/lib/jobs.ts`, and the technology marquee is built from the technologies recorded against roles.
- Playwright specs target elements by `data-testid` and accessible role/name, never by Tailwind class. Styling changes must not break the suite.
