This is a monorepo with a React frontend and Java Spring Boot backend.

## Tech Stack
- Frontend: React (JavaScript), 2-space indentation, ESLint + Prettier
- Backend: Java 25, Spring Boot 4.x, Maven, 4-space indentation
- Database: SQL Server (Azure SQL in production, Docker locally)
- Tests: JUnit 5 (backend), Jest + RTL (frontend), Playwright (E2E)

## Conventions
- Use functional components and hooks in React, not class components
- Use Spring Boot annotations (@RestController, @Service, @Repository)
- All REST endpoints return ResponseEntity with appropriate HTTP status codes
- Database schema changes use Flyway migration files in backend/src/main/resources/db/migration/
- Migration files use T-SQL syntax: IDENTITY(1,1), NVARCHAR, BIT, GETDATE()
- Never use Hibernate auto-DDL — Flyway owns the schema
- Environment-specific config goes in application-{profile}.yml, not hardcoded

## Testing
- Backend tests go in backend/src/test/ mirroring the main source structure
- Frontend tests go next to components as ComponentName.test.js
- E2E tests go in e2e/tests/ using the Page Object Model pattern in e2e/pages/
- Use accessible locators in Playwright: getByRole, getByLabel, getByText

## Security
- Never hardcode passwords, tokens, or connection strings
- Sensitive values come from environment variables or GitHub secrets
- SQL queries should use parameterized queries, never string concatenation