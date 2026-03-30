# Doenet Tools — Agent Instructions

## Project Overview

Doenet Tools is an educational technology platform built as an **npm workspace monorepo** with five packages: `client`, `server`, `shared`, `tests-cypress`, and `blog`. The client and server communicate via a REST API. Node.js 24 is required.

---

## Commands

### Install

```bash
npm ci
```

### Dev servers

```bash
npm run dev --workspace server   # Express API on port 3000
npm run dev --workspace client   # Vite dev server on port 8000 (proxies /api to port 3000)
```

### Build

```bash
npm run bulid
```

or

```bash
npm run build --workspace shared   # build first (client and server depend on it)
npm run build --workspace client   # tsc + vite build
npm run build --workspace server   # tsc
npm run build --workspace blog
```

### Format & Lint

```bash
npm run format             # Prettier write (all workspaces)
npm run format:check       # Prettier check
npm run lint               # ESLint fix (all workspaces)
npm run lint:check         # ESLint check (all workspaces)
```

Each workspace also has its own `lint` / `lint:check` scripts.

After making code changes, always format the changed files via Prettier before finishing.

### Database (server workspace)

```bash
npm run prisma:migrate-dev --workspace server
npm run prisma:seed --workspace server
npm run prisma:generate --workspace server
```

### Tests

**Server unit tests (Vitest):**

```bash
npm test --workspace server                               # run all
npx vitest run server/src/test/activity.test.ts          # run a single file
```

**Client component tests (Cypress):**

```bash
npm run test --workspace client              # open Cypress UI
npm run test:all --workspace client          # headless, all tests
npm run test:group1 --workspace client       # headless, @group1 tag only
```

**E2E tests (Cypress, requires both dev servers running):**

```bash
npm run test --workspace tests-cypress         # open Cypress UI
npm run test:all --workspace tests-cypress     # headless, all tests
npm run test:group1 --workspace tests-cypress  # headless, @group1 tag only
```

To run a single Cypress spec interactively, open the Cypress UI (`npm run test`) and select the file.

---

## Architecture

### Data Flow

```
Browser → Vite dev server (port 8000) → /api/* proxy → Express server (port 3000) → Prisma → MySQL
```

In production, the client is built as static files served by the Express server.

### Client (`client/`)

- **React 19** SPA with **React Router v7** (data router pattern)
- **Chakra UI v2** for components, **Jost** font, **MathJax** via `better-react-mathjax`
- All routes are defined in `client/src/index.tsx` using `createBrowserRouter`
- Each route file (`client/src/paths/*.tsx`) exports a `loader` and optionally an `action` alongside the page component
- Most form/mutation actions go through a **`genericAction`** in `index.tsx`: it reads `{ path, ...body }` from the request JSON and calls `axios.post('/api/${path}', body)`, optionally redirecting on success
- API calls use **axios**; all calls are to relative `/api/` paths

### Server (`server/`)

- **Express** with **Passport.js** for auth (Google OAuth2, magic link via email, local username/password, anonymous)
- Sessions stored in MySQL via `PrismaSessionStore`; session duration is 1 year
- All database access goes through **Prisma** (`server/src/model.ts` exports the single `prisma` instance)
- Route handlers live in `server/src/routes/`, query logic lives in `server/src/query/`

### Shared (`shared/`)

- Utility functions and types used by both client and server
- Must be **built before** client or server: `npm run build --workspace shared`

### Blog (`blog/`)

- Static site built with **Astro**

---

## Key Conventions

### Route Handler Pattern (server)

All route handlers are created using middleware wrappers in `server/src/middleware/queryMiddleware.ts`:

```ts
// For endpoints requiring login:
router.post("/endpoint", queryLoggedIn(queryFunction, zodSchema));

// For endpoints with optional auth:
router.get("/endpoint", queryOptionalLoggedIn(queryFunction, zodSchema));
```

These wrappers automatically: check auth, parse and validate the request with Zod (merging `req.body`, `req.query`, and `req.params`), call the query function, run `convertUUID` on the result (converts binary UUIDs to strings), and handle errors via `handleErrors`.

### Error Handling (server)

Throw typed errors in query functions; `handleErrors` in `server/src/errors/routeErrorHandler.ts` maps them to HTTP responses:

- `InvalidRequestError` → 400/other specified code
- `ZodError` → 400 with `{ error: "Invalid data", details: ... }`
- Prisma `P2001/P2003/P2025` → 404
- Everything else → 500

### UUID Convention

UUIDs are stored as 16-byte binary (`Bytes`) in MySQL. The server uses `Uint8Array` internally and converts to/from **short-uuid** strings at API boundaries:

- `toUUID(shortId)` → `Uint8Array` (for DB queries)
- `fromUUID(uint8array)` → short string (for API responses)
- `convertUUID(obj)` recursively converts all `Uint8Array` values in a result object

The client-side `Uuid` type is a branded `string`.

### Duplicated `types.ts`

`client/src/types.ts` and `server/src/types.ts` are **intentionally identical**. When modifying shared types, update both files. Platform-specific type differences go in `types_module_specific.ts` in each workspace.

### Zod Schemas (server)

Request validation schemas live in `server/src/schemas/`. Each schema file corresponds to a domain (e.g., `assignSchema.ts`, `userSchemas.ts`). Schemas are passed to the query middleware wrapper, not applied inside route handlers.

### Cypress Test Tagging

Cypress tests (both component and e2e) are tagged with `@group1`–`@group4` for CI parallelization. Flaky tests use `@brittle1`–`@brittle3`. Tests not tagged with any group will be caught by `test:mistagged` (client) or excluded by `test:group4` (tests-cypress). Use `@cypress/grep` syntax in `it()` / `describe()` tags.

### Test Environment Variables

The server exposes test-only features when these env vars are set:

- `ALLOW_TEST_LOGIN=true` — enables login bypassing real auth (used in Cypress tests)
- `ADD_TEST_APIS=true` — mounts `/api/test` routes from `server/src/test/testRoutes.ts`
- `CONSOLE_LOG_EMAIL=true` — logs magic-link emails to console instead of sending via SES

### Server Test Utilities

Use `createTestUser()` from `server/src/test/utils.ts` to create isolated test users. Each call generates a unique email, so tests can run in parallel without conflicts.

### Content Types

The core domain model has four content types: `"singleDoc"`, `"select"` (question bank), `"sequence"` (problem set), `"folder"`. These appear in both Prisma enums and TypeScript union types.
