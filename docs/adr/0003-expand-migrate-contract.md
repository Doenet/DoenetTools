# Expand-migrate-contract: typed contract plus labelled breaking changes

Every merge to `main` deploys, so each PR must work with what is already running: app builds open in browsers, and backend tasks that keep serving while migrations run. We describe the API as a Zod contract, generate an OpenAPI document and typed clients from it, and let CI flag changes that would break running code (oasdiff for the API, a scan of new migrations for the database). A flagged PR needs an `api-breaking` or `db-destructive` label, which records that nothing still running uses the old shape. The type checker already proves no caller in the repo still uses what is removed; the label covers what it can't see, which is whether the migrated code is live.

## Consequences

- **The frontend deploys only after the backend's rollout has stabilized**, so a new app build never talks to an older API, and one PR can both add to the API and use the addition.
- **Open tabs keep running the build they loaded** until the user reloads or opens a new page, which can be days. Each `/api` request the app makes with axios names its build (`X-Client-Build`) and the API logs it, so before removing an API shape we check that no build still using it is calling (`infra/README.md`, "Removing an API shape"). When a page fails in an outdated tab, the error page suggests a reload.
- **Routes outside the contract aren't checked.** Coverage is ratcheted (`contract-uncovered.json`, ESLint bulk suppressions); a route is brought into the contract before anyone changes it.

## Considered Options

- **Proving in CI that the expand is deployed** (pending-change markers, a contract epoch, reading the live commits from `/api/health` and `/version.json`, a merge queue). Rejected as far more machinery than the risk warrants: in practice the contract PR comes days after the expand, and the label plus review covers the rare early one.
- **Hard-rejecting stale clients** (409 + reload). Rejected: it could throw away a student's in-progress work. The request log tells us when no stale client needs the old shape any more.
