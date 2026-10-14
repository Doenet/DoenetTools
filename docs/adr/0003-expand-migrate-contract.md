# Expand-migrate-contract: typed contract plus labelled breaking changes

Every merge to `main` deploys, so each PR must work with what is already running: app builds open in browsers, and backend tasks that keep serving while migrations run. We describe the API as a Zod contract, generate an OpenAPI document and typed clients from it, and let CI flag changes that would break running code (oasdiff for the API; for the database, any migration change, since scanning SQL for destructive statements can miss one and migrations are rare). A flagged PR needs an `api-breaking` or `db-migration` label, which records that someone checked nothing still running needs the old shape. The type checker already proves no caller in the repo still uses what is removed; the label covers what it can't see, which is whether the migrated code is live.

## Consequences

- **The frontend deploys only after the backend's rollout has stabilized**, so a new app build never talks to an older API, and one PR can both add to the API and use the addition.
- **Open tabs keep running the build they loaded** until the user reloads or opens a new page, which can be days. Each `/api` request the app makes with axios names its build (`X-Client-Build`) and the API logs it, so before removing an API shape we check that no build still using it is calling (`infra/README.md`, "Removing an API shape"). When a page fails in an outdated tab, the error page suggests a reload.
- **Routes outside the contract aren't checked.** Coverage is ratcheted (`contract-uncovered.json`, ESLint bulk suppressions); a route is brought into the contract before anyone changes it.

## Considered Options

- **Proving in CI that the expand is deployed** (pending-change markers, a contract epoch, reading the live commits from `/api/health` and `/version.json`, a merge queue). Rejected as far more machinery than the risk warrants: in practice the contract PR comes days after the expand, and the label plus review covers the rare early one.
- **A contract library** (ts-rest, tRPC, `@asteasolutions/zod-to-openapi`). Rejected: tRPC replaces our URLs with its own RPC endpoints, and existing routes must keep their URLs while they are brought into the contract. The others would replace only the generic part. That part is small: Zod 4's `z.toJSONSchema` does the schema conversion and `openapi-typescript` the client types. What remains is ours either way, and would be glue around a library: `auth` levels that inject `loggedInUserId`, `convertUUID`, accepting a `Uint8Array` or `Date` where the contract has a string, and response checks that fail outside production but only log in it. In return we maintain `apps/api/src/contract` (about 600 lines, not counting its tests).
- **Hard-rejecting stale clients** (409 + reload). Rejected: it could throw away a student's in-progress work. The request log tells us when no stale client needs the old shape any more.
