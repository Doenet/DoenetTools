import { describe, expect, test } from "vitest";
import { FEATURE_FLAGS, type FeatureFlagName } from "@doenet-tools/shared";
import { resolveFlagValues } from "./featureFlags.service";
import { parseOverrides } from "./config";

// Any flag from the registry, so these cases keep working as flags come and go.
const FLAG = Object.keys(FEATURE_FLAGS)[0] as FeatureFlagName;
const DEFAULT = FEATURE_FLAGS[FLAG].defaultEnabled;

describe("resolveFlagValues", () => {
  test("with no rows, every flag takes its registry default", () => {
    const values = resolveFlagValues([]);
    for (const [name, def] of Object.entries(FEATURE_FLAGS)) {
      expect(values[name as FeatureFlagName]).toBe(def.defaultEnabled);
    }
  });

  test("a database row overrides the registry default", () => {
    const values = resolveFlagValues([{ name: FLAG, enabled: !DEFAULT }]);
    expect(values[FLAG]).toBe(!DEFAULT);
  });

  test("an env pin beats the database row", () => {
    const values = resolveFlagValues([{ name: FLAG, enabled: false }], {
      [FLAG]: true,
    });
    expect(values[FLAG]).toBe(true);
  });

  test("rows for flags no longer in the registry are ignored", () => {
    const values = resolveFlagValues([
      { name: "flagDeletedLastRelease", enabled: true },
    ]);
    expect(values).not.toHaveProperty("flagDeletedLastRelease");
    expect(values[FLAG]).toBe(DEFAULT);
  });
});

describe("parseOverrides", () => {
  test("unset or empty yields no pins", () => {
    expect(parseOverrides(undefined)).toEqual({});
    expect(parseOverrides("  ")).toEqual({});
  });

  test("parses on/off, true/false and 1/0, ignoring whitespace", () => {
    expect(parseOverrides(` ${FLAG} = on `)).toEqual({ [FLAG]: true });
    expect(parseOverrides(`${FLAG}=FALSE`)).toEqual({ [FLAG]: false });
    expect(parseOverrides(`${FLAG}=1,`)).toEqual({ [FLAG]: true });
  });

  test("a misspelled flag name throws rather than silently doing nothing", () => {
    expect(() => parseOverrides("nosuchFlag=on")).toThrow(
      /unknown feature flag/,
    );
  });

  test("an unparsable value throws", () => {
    expect(() => parseOverrides(`${FLAG}=yes-please`)).toThrow(
      /must be on\/off/,
    );
  });
});
