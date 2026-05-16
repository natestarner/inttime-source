# Interactive Timeline

## Project Overview

React frontend + Java Spring Boot microservices backend, deployed to Azure via GitHub Actions.

**Status:** Early-stage scaffold — no domain controllers, entities, or migrations exist yet.

## Tech Stack

- Frontend: React (JavaScript), served by Azure Static Web Apps
- Backend: Java 25, Spring Boot 4.x, Maven
- Database: Azure SQL (SQL Server) — local dev uses SQL Server in Docker
- CI/CD: GitHub Actions, GitHub Container Registry (GHCR)
- Hosting: Azure Container Apps (backend), Azure Static Web Apps (frontend)

## Key Directories

- `frontend/` — React application
- `backend/` — Spring Boot application
- `backend/src/main/resources/db/migration/` — Flyway SQL migrations
- `e2e/` — Playwright end-to-end tests
- `.github/workflows/` — CI/CD pipelines

## Common Commands

```bash
# Local development
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=local
cd frontend && npm run dev
cd e2e && npx playwright test

# Run backend tests
cd backend && mvn verify

# Run frontend tests
cd frontend && npm test

# Start local SQL Server
docker start inttime-sqlserver
```

## Flyway Migration Rules

- NEVER edit or rename a migration file that has already been applied — create a new one
- One logical change per migration file (don't combine table creates)
- Use descriptive names: V3**add_email_verified_to_users.sql not V3**update.sql
- Seed/reference data goes in migration files too (e.g., V4\_\_seed_roles.sql)
- Migration version numbers must be sequential — never skip or reuse a number
- Always use IF NOT EXISTS or IF EXISTS guards where T-SQL supports them

## Code Standards

- Java: 4-space indentation, follow Spring Boot conventions
- JavaScript/React: 2-space indentation, ESLint + Prettier
- SQL migrations use T-SQL syntax, NOT MySQL/Postgres:
  - IDENTITY(1,1) not AUTO_INCREMENT
  - NVARCHAR not VARCHAR
  - BIT not BOOLEAN
  - GETDATE() not NOW()
  - DATETIME2 not TIMESTAMP
  - TOP(n) not LIMIT n
  - ISNULL() not IFNULL() or COALESCE() (though COALESCE works in T-SQL too)
- Database schema changes go in Flyway migration files, never manual DDL
- Never set `spring.jpa.hibernate.ddl-auto` to anything other than `validate`
- REST endpoints use the `/api/...` prefix; the Vite dev server proxies `/api` and `/actuator` to `localhost:8080`

## Git Workflow

- Branch from `main`, PR back to `main`
- Conventional commits: `feat(scope):`, `fix(scope):`, `docs:`, `test:`
- All PRs require CI to pass before merge
- Flyway migration files: once merged, NEVER edit — create a new migration instead
- On push to `main`, CI builds a Docker image (pushed to GHCR) and commits a manifest update to the `lower` branch of `natestarner/inttime-deploy` (a separate GitOps deploy repo) — that repo is the source of truth for the lower environment

## Testing

- Backend: JUnit 5 + Spring Boot Test
- Frontend: Vitest + React Testing Library (jsdom env)
- E2E: Playwright (run against deployed lower environment)
- Minimum: write tests for any new endpoint or user-facing feature

## Important Notes

- Spring profiles: `local` for development, `lower` for lower env, `production` for prod
- The `local` profile uses Docker SQL Server on localhost:1433
- NEVER commit passwords, tokens, or connection strings to code
- Java 25 + Spring Boot 4.x are bleeding-edge (Spring Boot 4 GA'd in 2026) — do not assume Spring Boot 3.x patterns still apply; verify APIs against current Spring docs before suggesting changes
- Database free tier auto-pauses — expect cold start delays
- Frontend resolves the backend API URL at runtime by fetching `/config.json` (see `frontend/src/config.js`) — do not hardcode API URLs or use `import.meta.env.VITE_API_URL`; the deployed Static Web App serves a different `config.json` per environment
