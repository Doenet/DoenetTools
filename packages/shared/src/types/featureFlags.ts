// The feature-flag registry: the single source of truth for which flags exist.
//
// Both the API (`apps/api/src/feature-flags`) and the client
// (`apps/app/src/utils/featureFlags.ts`) import from here, so a flag name is a
// TypeScript type — a typo is a build error, not a silently-off feature.
//
// Adding a flag: add an entry below with `defaultEnabled: false`, ship it, then
// turn it on in an environment with `feature-flag on <name>` (see the API
// README). Removing a flag: delete the entry *after* deleting every read of it;
// leftover database rows for unknown flags are ignored.

export type FeatureFlagDefinition = {
  /** What the flag gates, in one line. Shown by the `feature-flag` CLI. */
  description: string;
  /**
   * Value used when the database has no row for this flag. New flags ship
   * `false`: the code deploys dark, then is switched on without a redeploy.
   */
  defaultEnabled: boolean;
  /** Who to ask about this flag. */
  owner: string;
  /** ISO date the flag was added — flags are meant to be short-lived. */
  addedOn: string;
};

export const FEATURE_FLAGS = {
  // ---------------------------------------------------------------------
  // Template. Copy this entry for a real flag, then delete this one once
  // there is at least one other flag in the registry (the registry must not
  // be empty, or `FeatureFlagName` becomes `never`).
  // ---------------------------------------------------------------------
  exampleFlag: {
    description:
      "Example flag — not read anywhere. Useful for verifying the toggle pipeline end to end.",
    defaultEnabled: false,
    owner: "doenet-devs",
    addedOn: "2026-08-24",
  },
} as const satisfies Record<string, FeatureFlagDefinition>;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS & string;

/** Every flag's effective value, resolved for one request. */
export type FeatureFlagValues = Record<FeatureFlagName, boolean>;

/** Wire shape of `GET /api/featureFlags`. */
export type FeatureFlagsResponse = {
  flags: FeatureFlagValues;
};

export const FEATURE_FLAG_NAMES = Object.keys(
  FEATURE_FLAGS,
) as FeatureFlagName[];

export function isFeatureFlagName(name: string): name is FeatureFlagName {
  return Object.prototype.hasOwnProperty.call(FEATURE_FLAGS, name);
}

/**
 * The registry defaults, used before flags load (client) and as the base layer
 * the database overrides (server). Never throws, never fetches — a flag read is
 * always answerable.
 */
export function defaultFeatureFlagValues(): FeatureFlagValues {
  const values = {} as FeatureFlagValues;
  for (const name of FEATURE_FLAG_NAMES) {
    values[name] = FEATURE_FLAGS[name].defaultEnabled;
  }
  return values;
}
