// Validated config for the feature-flags system.
import { getEnvVar } from "../utils/env";
import { isFeatureFlagName, type FeatureFlagName } from "@doenet-tools/shared";

export type FeatureFlagsConfig = {
  /**
   * How long a resolved set of flag values is served before re-reading the
   * database. This is the delay between flipping a flag and every API task
   * agreeing on the new value, so keep it short — a flag read is one cached
   * lookup, not a query.
   */
  cacheTtlMs: number;
  /**
   * Hard pins from `FEATURE_FLAG_OVERRIDES`, which beat the database. For local
   * dev and Cypress runs (turn a flag on without touching the database), and as
   * a break-glass path if the database is unreachable during an incident.
   *
   * Format: `FEATURE_FLAG_OVERRIDES="someFlag=on,otherFlag=off"`.
   */
  overrides: Partial<Record<FeatureFlagName, boolean>>;
};

const DEFAULT_TTL_MS = 15 * 1000;

let cached: FeatureFlagsConfig | undefined;

export function loadFeatureFlagsConfig(): FeatureFlagsConfig {
  if (cached) return cached;

  const ttlRaw = getEnvVar("FEATURE_FLAGS_CACHE_TTL_MS");
  const cacheTtlMs = ttlRaw === undefined ? DEFAULT_TTL_MS : Number(ttlRaw);
  if (!Number.isFinite(cacheTtlMs) || cacheTtlMs < 0) {
    throw new Error(
      `FEATURE_FLAGS_CACHE_TTL_MS must be a non-negative number of milliseconds (got ${JSON.stringify(ttlRaw)})`,
    );
  }

  cached = {
    cacheTtlMs,
    overrides: parseOverrides(getEnvVar("FEATURE_FLAG_OVERRIDES")),
  };
  return cached;
}

/**
 * Parses `"a=on,b=off"`. Unknown flag names and unparsable values throw: an
 * override is an operator's explicit intent, and silently ignoring a typo would
 * leave a flag in the opposite state from the one they asked for.
 */
export function parseOverrides(
  raw: string | undefined,
): Partial<Record<FeatureFlagName, boolean>> {
  const overrides: Partial<Record<FeatureFlagName, boolean>> = {};
  if (!raw) return overrides;

  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    const [name, value] = trimmed.split("=").map((part) => part.trim());
    if (!isFeatureFlagName(name)) {
      throw new Error(
        `FEATURE_FLAG_OVERRIDES names an unknown feature flag: ${JSON.stringify(name)}`,
      );
    }

    const enabled = parseBoolean(value);
    if (enabled === undefined) {
      throw new Error(
        `FEATURE_FLAG_OVERRIDES value for ${name} must be on/off (got ${JSON.stringify(value)})`,
      );
    }
    overrides[name] = enabled;
  }
  return overrides;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  switch (value?.toLowerCase()) {
    case "on":
    case "true":
    case "1":
      return true;
    case "off":
    case "false":
    case "0":
      return false;
    default:
      return undefined;
  }
}

/** Test-only: clear the module-level cache between cases. */
export function resetFeatureFlagsConfigForTest(): void {
  cached = undefined;
}
