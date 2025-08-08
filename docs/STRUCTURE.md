# Repository Structure

This repository skeleton provides a minimal yet functional setup for a Node.js Express backend and a static frontend served via nginx, all orchestrated with Docker Compose. It is designed to be a lean starting point that can be extended with CRA/Vite frontends or additional microservices as needed.

## Directory overview

- .github/workflows
  - CI workflows (already configured to lint, test, and build both backend and frontend)
- backend
  - package.json
  - index.js
  - Dockerfile
- frontend
  - index.html
  - Dockerfile
- docker-compose.yml
- README.md
- LICENSE
- .gitignore
- docs
  - STRUCTURE.md (this file)

## How to run locally

1) Ensure Docker and Docker Compose are installed.

2) From the repository root, start the multi-service stack:
   - docker-compose up --build

3) Services and ports
   - Backend: http://localhost:3000
     - Endpoints available:
       - GET / for a simple welcome message
       - GET /health for health and uptime information
   - Frontend: http://localhost (served by nginx on port 80)
     - Basic static frontend is loaded from frontend/index.html

4) Stop the stack:
   - docker-compose down

## Development notes

- This structure keeps the README largely intact and introduces the essential scaffolding:
  - A lightweight backend (Express) with a health endpoint
  - A static frontend served via nginx (CDN-based React placeholder or future CRA/Vite can replace the static frontend)
  - Dockerfiles for each service and a docker-compose.yml to run everything together
- CI workflow (.github/workflows/ci.yml) handles linting, testing, and building both services, using --if-present for optional scripts to accommodate the skeleton setup.

Future enhancements (optional)
- Replace the frontend static setup with a full React app created by CRA or Vite.
- Add environment-specific configurations, API versioning, and a more robust health check (e.g., readiness probes).
- Integrate additional tests (unit, integration) and expand the CI pipeline to run them.