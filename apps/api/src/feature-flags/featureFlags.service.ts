// Resolves feature-flag values, cheaply and without ever throwing at a call site.
//
// Precedence, highest first:
//   1. `FEATURE_FLAG_OVERRIDES` env pins  (dev/e2e/break-glass — needs a restart)
//   2. a `featureFlags` row in the database  (the live toggle)
//   3. `defaultEnabled` in the shared registry  (what a fresh deploy does)
//
// Values are cached for `cacheTtlMs`, so a flag read is a map lookup rather than
// a query, and a flip propagates to every API task within one TTL.
import {
  defaultFeatureFlagValues,
  isFeatureFlagName,
  type FeatureFlagName,
  type FeatureFlagValues,
} from "@doenet-tools/shared";
import { prisma } from "../model";
import { loadFeatureFlagsConfig } from "./config";

type FlagRow = { name: string; enabled: boolean };

/**
 * Layers database rows and env pins onto the registry defaults. Pure — the
 * whole precedence rule lives here so it can be tested without a database.
 */
export function resolveFlagValues(
  rows: FlagRow[],
  overrides: Partial<Record<FeatureFlagName, boolean>> = {},
): FeatureFlagValues {
  const values = defaultFeatureFlagValues();

  for (const row of rows) {
    // Rows for flags that have been deleted from the registry are ignored, so
    // removing a flag from the code never needs a coordinated database cleanup.
    if (isFeatureFlagName(row.name)) {
      values[row.name] = row.enabled;
    }
  }

  for (const [name, enabled] of Object.entries(overrides)) {
    if (isFeatureFlagName(name) && enabled !== undefined) {
      values[name] = enabled;
    }
  }

  return values;
}

let cache: { values: FeatureFlagValues; expiresAt: number } | undefined;

/**
 * Every flag's current value. A database failure is not fatal: we serve the last
 * good values (or the registry defaults on a cold cache) and log, because an
 * unreachable database must not take down every flagged code path at once.
 */
export async function getFeatureFlags(): Promise<FeatureFlagValues> {
  const { cacheTtlMs, overrides } = loadFeatureFlagsConfig();
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return cache.values;
  }

  let values: FeatureFlagValues;
  try {
    const rows = await prisma.featureFlags.findMany({
      select: { name: true, enabled: true },
    });
    values = resolveFlagValues(rows, overrides);
  } catch (e) {
    console.error("Could not read feature flags; serving last known values", e);
    values = cache?.values ?? resolveFlagValues([], overrides);
  }

  cache = { values, expiresAt: now + cacheTtlMs };
  return values;
}

/** Whether one flag is on. The normal way server code reads a flag. */
export async function isFeatureEnabled(
  name: FeatureFlagName,
): Promise<boolean> {
  return (await getFeatureFlags())[name];
}

/**
 * Turns a flag on or off for this environment. Used by the `feature-flag` CLI —
 * there is deliberately no HTTP endpoint for writes, so flipping a flag requires
 * the same access as running a database script.
 */
export async function setFeatureFlag(
  name: FeatureFlagName,
  enabled: boolean,
  note?: string,
): Promise<void> {
  await prisma.featureFlags.upsert({
    where: { name },
    create: { name, enabled, note },
    update: { enabled, note },
  });
  clearFeatureFlagCache();
}

/** Drops the override row, returning the flag to its registry default. */
export async function clearFeatureFlag(name: FeatureFlagName): Promise<void> {
  await prisma.featureFlags.deleteMany({ where: { name } });
  clearFeatureFlagCache();
}

/** All override rows, including ones for flags no longer in the registry. */
export async function listFeatureFlagRows() {
  return prisma.featureFlags.findMany({ orderBy: { name: "asc" } });
}

/** Deletes rows whose flag is gone from the registry. Safe to run any time. */
export async function pruneFeatureFlagRows(): Promise<string[]> {
  const rows = await listFeatureFlagRows();
  const stale = rows.map((r) => r.name).filter((n) => !isFeatureFlagName(n));
  if (stale.length > 0) {
    await prisma.featureFlags.deleteMany({ where: { name: { in: stale } } });
    clearFeatureFlagCache();
  }
  return stale;
}

/**
 * Forces the next read to hit the database. Called after a write in this
 * process; other API tasks pick the change up when their own TTL lapses.
 */
export function clearFeatureFlagCache(): void {
  cache = undefined;
}
