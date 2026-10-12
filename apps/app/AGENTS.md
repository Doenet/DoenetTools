# App — Agent Instructions

See root `AGENTS.md` for commands and overall architecture.

## Routing

All routes are defined in `src/index.tsx` via `createBrowserRouter`. Each route file in `src/paths/*.tsx` exports a `loader` and optionally an `action` alongside the page component.

## Mutation Pattern

Most mutations go through **`genericAction`** in `src/index.tsx`: reads `{ path, ...body }` from the request JSON and calls `axios.post('/api/${path}', body)`, optionally redirecting on success. All API calls use **axios** to relative `/api/` paths.

Keep it that way: make API calls with the default `axios` import and a relative `/api/...` url. Only those carry the `X-Client-Build` header (`sendClientBuild` in `src/utils/clientBuild.ts`), which the API logs so that, before an API shape is removed, we can check no build that uses it is still calling (`infra/README.md`, "Removing an API shape"). A `fetch`, an `axios.create()` instance or an absolute url goes without it.

## DoenetML

Content rendering uses `@doenet/doenetml-iframe` — an external package that embeds DoenetML activities in an iframe. Treat it as a black box; do not modify its internals. Import styles from `@doenet/doenetml-iframe/style.css` as already done in `src/index.tsx`.

## Cypress Test Tagging

Tag tests `@group1`–`@group4` for CI parallelization; flaky tests use `@brittle1`–`@brittle3`. Tests without a group tag fail `test:mistagged`. Use `@cypress/grep` syntax in `it()` / `describe()`.
