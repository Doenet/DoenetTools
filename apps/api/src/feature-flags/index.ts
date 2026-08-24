// `feature-flags` — runtime toggles that let backend and frontend changes ship
// dark and be switched on afterwards, without a second deploy.
//
//   config                — env validation (TTL, `FEATURE_FLAG_OVERRIDES` pins)
//   featureFlags.service  — resolve registry defaults + database rows + pins, cached
//   router                — GET /api/featureFlags (read-only; writes are CLI-only)
//
// The set of flags themselves lives in `@doenet-tools/shared`
// (`packages/shared/src/types/featureFlags.ts`) so the API and client share one
// typed list. Import from here, not from a source file.

export { loadFeatureFlagsConfig } from "./config";
export { featureFlagsRouter } from "./router";
export {
  getFeatureFlags,
  isFeatureEnabled,
  setFeatureFlag,
  clearFeatureFlag,
  listFeatureFlagRows,
  pruneFeatureFlagRows,
  clearFeatureFlagCache,
} from "./featureFlags.service";
