// Client-side feature flags. The flag list itself lives in
// `@doenet-tools/shared`, so `useFeatureFlag("nope")` is a compile error.
//
// Flags are fetched once by the root loader (`SiteHeader`) and handed down
// through `SiteContext`. A flag flipped on the server reaches an open tab on its
// next full page load; anything more eager isn't worth a poll, since flags gate
// unreleased UI rather than live data.
import { useOutletContext } from "react-router";
import axios from "axios";
import {
  defaultFeatureFlagValues,
  type FeatureFlagName,
  type FeatureFlagValues,
  type FeatureFlagsResponse,
} from "@doenet-tools/shared";

/**
 * Reads flags for the root loader. Never rejects: if the request fails, the
 * registry defaults apply and the site renders its released behavior, rather
 * than the whole page failing over a flag lookup.
 */
export async function fetchFeatureFlags(): Promise<FeatureFlagValues> {
  try {
    const { data } = await axios.get<FeatureFlagsResponse>("/api/featureFlags");
    // Merge onto the defaults so a flag added in this build but missing from an
    // older API's response is `false` rather than `undefined`.
    return { ...defaultFeatureFlagValues(), ...data.flags };
  } catch (e) {
    console.error("Could not load feature flags; using defaults", e);
    return defaultFeatureFlagValues();
  }
}

/**
 * Whether a flag is on, inside any component rendered under the site header:
 *
 *   const showNewEditor = useFeatureFlag("newEditor");
 */
export function useFeatureFlag(name: FeatureFlagName): boolean {
  const { featureFlags } = useOutletContext<{
    featureFlags: FeatureFlagValues;
  }>();
  return featureFlags[name];
}
