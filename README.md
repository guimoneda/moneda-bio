# moneda-bio

My personal portfolio (Django backend + React frontend) showcasing experience, education and certifications with a small REST API and a modern frontend.

---

## Quick Links (code)
- Backend entry: [backend/manage.py](backend/manage.py)  
- Docker compose: [docker-compose.yml](docker-compose.yml)  
- Backend settings: [`config.settings`](backend/config/settings.py) ([file](backend/config/settings.py))  
- Resume models: [`resume.models.Job`](backend/resume/models.py), [`resume.models.Education`](backend/resume/models.py), [`resume.models.Certification`](backend/resume/models.py) ([file](backend/resume/models.py))  
- Serializers: [`resume.serializers.JobSerializer`](backend/resume/serializers.py) ([file](backend/resume/serializers.py))  
- Views: [`resume.views.JobList`](backend/resume/views.py), [`resume.views.EducationList`](backend/resume/views.py), [`resume.views.CertificationList`](backend/resume/views.py) ([file](backend/resume/views.py))  
- URL conf: [backend/resume/urls.py](backend/resume/urls.py)  
- Frontend app: [frontend/package.json](frontend/package.json)  
- Frontend entry: [frontend/src/App.tsx](frontend/src/App.tsx)  
- Key components: [`components.JobList`](frontend/src/components/JobList.tsx), [`components.EducationList`](frontend/src/components/EducationList.tsx), [`components.CertificationList`](frontend/src/components/CertificationList.tsx), [`components.SocialLinks`](frontend/src/components/SocialLinks.tsx) ([files](frontend/src/components))  
- Frontend build config: [frontend/tailwind.config.js](frontend/tailwind.config.js), [frontend/postcss.config.js](frontend/postcss.config.js)

---

## What it is
- Django REST backend exposing resume data (jobs, education, certifications). See API endpoints in [backend/resume/urls.py](backend/resume/urls.py).  
- React + TypeScript frontend (Create React App) consumes the API and renders interactive lists/modals (see [frontend/src/components/JobList.tsx](frontend/src/components/JobList.tsx), [frontend/src/components/CertificationList.tsx](frontend/src/components/CertificationList.tsx), [frontend/src/components/EducationList.tsx](frontend/src/components/EducationList.tsx)).  
- Tailwind CSS for styling and Motion library for UI animations.

---

## Infrastructure & Deployment
This project is hosted on a private NAS server, exposed securely via **Cloudflare Tunnel**.

### CI/CD Pipeline
Automated deployment is handled via **GitHub Actions**:
1.  **Push to Main**: Code changes pushed to GitHub trigger the workflow.
2.  **Secure Tunneling**: The runner installs `cloudflared` and configures SSH to tunnel through Cloudflare to the home NAS.
3.  **Sync & Restart**: The workflow syncs the latest code to the NAS and rebuilds/restarts the Docker containers.

---

## Run (recommended: Docker)
- Start everything:
  docker-compose up --build

This boots the backend (Django) and frontend (React) services per [docker-compose.yml](docker-compose.yml).

---

## Run locally (native)
Backend
- python -m venv .venv && source .venv/bin/activate
- cd backend
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py createsuperuser
- python manage.py runserver

Frontend
- cd frontend
- npm install
- npm start

---

## API (examples)
- GET /api/jobs/  -> handled by [`resume.views.JobList`](backend/resume/views.py) (serializes via [`resume.serializers.JobSerializer`](backend/resume/serializers.py))  
- GET /api/education/ -> [`resume.views.EducationList`](backend/resume/views.py)  
- GET /api/certifications/ -> [`resume.views.CertificationList`](backend/resume/views.py)  
(See [backend/resume/urls.py](backend/resume/urls.py))

---

## Notes & configuration
- Media served in development per [backend/config/urls.py](backend/config/urls.py) and [backend/config/settings.py](backend/config/settings.py) (`MEDIA_ROOT`, `MEDIA_URL`).  
- Frontend dev server expects the API at `/api/` (proxy or CORS configured in backend settings).

---

## Contributing
- File an issue or PR. Keep frontend changes under `frontend/src/` and backend models/serializers/views under `backend/resume/`. Follow existing code patterns.

---

## Useful files
- [backend/requirements.txt](backend/requirements.txt)  
- [frontend/README.md](frontend/README.md)  
- [frontend/src/index.tsx](frontend/src/index.tsx)

---