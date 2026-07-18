# API Gateway Boilerplate

Production-oriented API gateway starter built with Express.js, JWT authentication, request tracing, and rate limiting.

This repository is designed as a practical base for teams that want to ship internal or public APIs quickly, while keeping security and operability concerns in place from day one.

## Why This Project

An API gateway is usually the first entry point to your platform. It should:

- authenticate and authorize requests,
- enforce consistent traffic controls,
- provide observability hooks,
- normalize error handling,
- and route cleanly to domain services.

This boilerplate demonstrates those concerns in a concise, test-backed implementation.

## Core Use Cases

- Build a lightweight backend gateway for web and mobile clients.
- Front multiple downstream services behind one secured API surface.
- Bootstrap an internal platform starter for multiple product teams.
- Use as a learning reference for JWT-based auth + Express middleware composition.

## Tech Stack

- Runtime: Node.js
- Framework: Express 4
- Security headers: Helmet
- CORS: cors
- Logging: morgan
- Validation: Zod
- Authentication: JSON Web Token (jsonwebtoken)
- Password hashing: bcryptjs
- Rate limiting: express-rate-limit
- Request correlation: uuid
- Testing: Jest + Supertest

## Project Structure

```text
api-gateway-boilerplate/
|-- .env.example
|-- package.json
|-- README.md
|-- src/
|   |-- app.js
|   |-- index.js
|   |-- middleware/
|   |   |-- auth.js
|   |   |-- errorHandler.js
|   |   |-- rateLimiter.js
|   |   |-- requestId.js
|   |-- routes/
|   |   |-- auth.js
|   |   |-- health.js
|   |   |-- users.js
|   |-- services/
|       |-- tokenService.js
|-- tests/
|   |-- auth.test.js
|   |-- tokenService.test.js
|-- .github/
|   |-- workflows/
|       |-- ci.yml
```

## Request Lifecycle (High Level)

1. Client calls the gateway endpoint.
2. Security and utility middleware are applied (Helmet, CORS, JSON parser, logging, request ID).
3. Route-level middleware executes (auth checks, rate limiting).
4. Route handler performs validation/business logic.
5. Central error handler formats failures consistently.

## API Base URL

- Local default: http://localhost:4000

## Endpoints

### Health

- GET /health/
	- Purpose: liveness check
	- Response: status + uptime seconds

- GET /health/ready
	- Purpose: readiness probe
	- Response: readiness boolean

### Auth

- POST /api/v1/auth/register
	- Purpose: create a user in in-memory store and issue tokens
	- Body:
		- email (required, valid email)
		- password (required, min 8 chars)
		- name (optional)
	- Success: 201 with access_token and refresh_token
	- Errors:
		- 400 validation failure
		- 409 email already exists

- POST /api/v1/auth/login
	- Purpose: authenticate existing user and issue tokens
	- Body:
		- email
		- password
	- Success: 200 with access_token and refresh_token
	- Errors:
		- 401 invalid credentials
		- 429 too many login attempts

- POST /api/v1/auth/refresh
	- Purpose: exchange refresh token for a new access token
	- Body:
		- refresh_token
	- Success: 200 with access_token
	- Errors:
		- 400 missing refresh_token
		- 401 invalid refresh token

### Users

- GET /api/v1/users/me
	- Purpose: return authenticated user claims
	- Headers:
		- Authorization: Bearer <access_token>
	- Success: 200 with user payload from JWT
	- Errors:
		- 401 missing or invalid token
		- 429 API limit exceeded

## Example API Calls

Register:

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"secure1234","name":"Alex"}'
```

Login:

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"secure1234"}'
```

Refresh token:

```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh \
	-H "Content-Type: application/json" \
	-d '{"refresh_token":"<your_refresh_token>"}'
```

Get current user:

```bash
curl http://localhost:4000/api/v1/users/me \
	-H "Authorization: Bearer <your_access_token>"
```

## Security and Reliability Features

- JWT access and refresh token separation.
- Password hashing with bcrypt.
- Per-route rate limiting strategy:
	- login limiter for brute-force protection,
	- API limiter for authenticated traffic control.
- Centralized request ID propagation via X-Request-Id.
- Consistent structured validation errors via Zod + error middleware.
- Baseline HTTP hardening headers using Helmet.

## Environment Configuration

Copy .env.example to .env and adjust values.

```env
PORT=4000
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-r
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_MAX=100
```

## Local Development

Install and run:

```bash
npm install
cp .env.example .env
npm run dev
```

Production start:

```bash
npm start
```

Run tests:

```bash
npm test
```

## Code Snippets

App composition pattern:

```js
// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

function createApp() {
	const app = express();
	app.use(helmet());
	app.use(cors());
	app.use(express.json({ limit: '1mb' }));
	return app;
}
```

Token utility pattern:

```js
// src/services/tokenService.js
const jwt = require('jsonwebtoken');

const signAccessToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
```

## Current Limitations

- User store is in-memory (Map), so data resets on process restart.
- No role-based authorization yet (authentication is present).
- No token revocation/blacklist for refresh tokens.
- No API version deprecation workflow yet.

- Existing CI workflow file targets Python tooling and should be aligned to Node/Jest for this codebase.


## Future Extensions

- Replace in-memory users with PostgreSQL or MongoDB.
- Add RBAC/ABAC policy layer for fine-grained authorization.
- Add refresh-token rotation with revocation store (Redis).
- Add OpenAPI/Swagger spec generation and API docs UI.
- Add structured logging with pino and distributed tracing.
- Add gateway-to-service proxy routes with retry/circuit breaker patterns.
- Add contract tests and smoke tests in CI.
- Add containerization and deployment templates (Docker + Kubernetes ingress).

## Testing Coverage Summary

Current tests validate:

- token signing/verification round trips,
- invalid token rejection,
- registration success and duplicate handling,
- password validation,
- protected route access with and without token.

## Recommended Production Hardening

- Use strong secrets from a managed secret store.
- Enforce HTTPS/TLS termination in front of the gateway.
- Add request/response schema governance and audit logging.
- Add dependency and SAST scanning in CI.

## License

MIT (see LICENSE).
