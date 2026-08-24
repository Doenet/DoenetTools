# feature-flags

Runtime toggles that decouple **deploying** code from **releasing** a feature.

The workflow this exists for: a change spans the API and the client, both halves
merge to `main` behind a flag that is off, they deploy on their own schedules,
and then — once the backend is live everywhere — the flag is flipped and the
frontend starts using it. No coordinated deploy, and turning it back off is one
command, not a revert-and-redeploy.

## How a value is resolved

```
   FEATURE_FLAG_OVERRIDES env pin      (dev / e2e / break-glass · needs restart)
 ▶ featureFlags row in the database    (the live toggle · `feature-flag` CLI)
 ▶ defaultEnabled in the registry      (what a fresh deploy does)
```

Highest match wins. Values are cached in-process for
`FEATURE_FLAGS_CACHE_TTL_MS` (15s default), so reading a flag is a map lookup
and a flip reaches every API task within one TTL.

## Files

| File                      | Responsibility                                               |
| ------------------------- | ------------------------------------------------------------ |
| `config.ts`               | Env validation: cache TTL and `FEATURE_FLAG_OVERRIDES` pins. |
| `featureFlags.service.ts` | Resolve + cache values; read/write helpers used by the CLI.  |
| `router.ts`               | `GET /api/featureFlags` (read-only).                         |

The registry — the list of flags that exist — lives in `@doenet-tools/shared`
(`packages/shared/src/types/featureFlags.ts`) so the API and client share one
typed list and a typo is a build error. The database only ever stores overrides.

## Adding a flag

1. Add an entry to `FEATURE_FLAGS` in `packages/shared/src/types/featureFlags.ts`
   with `defaultEnabled: false`, a description, an owner, and today's date.
2. Read it where it matters:

   ```ts
   // API
   import { isFeatureEnabled } from "../feature-flags";
   if (await isFeatureEnabled("newEditor")) { ... }
   ```

   ```tsx
   // apps/app — any component under the site header
   import { useFeatureFlag } from "../utils/featureFlags";
   const showNewEditor = useFeatureFlag("newEditor");
   ```

3. Merge and deploy. The flag is off, so nothing changes for users.
4. Turn it on where you want it (below).

Write both sides of a flagged change so the **off** path is the current behavior
and the **on** path is additive — that is what makes deploying and releasing
separable, and it keeps expand-migrate-contract intact.

## Flipping a flag

Writes are CLI-only — there is no HTTP write endpoint, so changing a flag takes
the same access as any other database script.

```bash
# local dev, from apps/api
npx tsx scripts/feature-flag.ts list
npx tsx scripts/feature-flag.ts on  newEditor "enabling for the 8/24 release"
npx tsx scripts/feature-flag.ts off newEditor "reports of broken preview"
npx tsx scripts/feature-flag.ts clear newEditor   # back to the code default
```

In production, `infra/scripts/exec.sh -s prod` from the repo root, pick the api
service/task, then:

```bash
node dist/scripts/feature-flag.js on newEditor "release 8/24"
```

Existing browser tabs pick the change up on their next full page load; the API
picks it up within one cache TTL.

## Removing a flag

Flags are meant to be short-lived. Once a feature is permanently on: delete every
read of the flag, delete its registry entry, then run
`feature-flag prune` to drop the leftover database rows. Rows for unknown flags
are ignored in the meantime, so the order is safe either way.

## Configuration

| Env var                      | Required | Default | Notes                                                        |
| ---------------------------- | -------- | ------- | ------------------------------------------------------------ |
| `FEATURE_FLAGS_CACHE_TTL_MS` | no       | 15000   | How long resolved values are cached; the flip-to-live delay. |
| `FEATURE_FLAG_OVERRIDES`     | no       | —       | `"someFlag=on,other=off"` — pins that beat the database.     |

`FEATURE_FLAG_OVERRIDES` is for local dev and Cypress runs (turn a flag on with
no database write) and as break-glass if the database is unavailable. An unknown
flag name or unparsable value throws at startup rather than being ignored.

## Failure behavior

If the database can't be read, the last known values are served — or the registry
defaults on a cold start — and the error is logged. An unreachable database must
not simultaneously change the behavior of every flagged code path.
