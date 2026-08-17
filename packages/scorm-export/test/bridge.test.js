// Behavioural tests for the SCORM runtime: what the package actually says to
// the LMS, driven through the real vendored bridge with a fake LMS API and fake
// SPLICE messages from the activity iframe.
//
// These cover the cases that are awkward to reach with a real activity: state
// blobs at and beyond the suspend_data budget, a player that truncates, and a
// browser that refuses localStorage.

import { describe, it, expect } from "vitest";
import LZString from "lz-string";

import { launchSco, stateOfSize, tick, ACTIVITY_ID } from "./helpers/sco.js";
import {
  makeFakeLms,
  SUSPEND_DATA_SPM_2004,
  SUSPEND_DATA_SPM_12,
} from "./helpers/fake-lms.js";

describe("a normal session", () => {
  it("opens a SCORM session and marks the SCO incomplete", async () => {
    const sco = launchSco();
    await tick();

    expect(sco.api.calls.some((c) => c.fn === "Initialize")).toBe(true);
    expect(sco.api.get("cmi.completion_status")).toBe("incomplete");
    sco.close();
  });

  it("writes the score and the compressed state when the activity reports", async () => {
    const sco = launchSco();
    await tick();

    const state = stateOfSize(2000);
    sco.report({ score: 0.5, state });
    await tick();

    expect(Number(sco.api.get("cmi.score.scaled"))).toBe(0.5);
    expect(sco.restoredStates()[ACTIVITY_ID]).toEqual(state);
    sco.close();
  });

  it("returns the saved state to the activity on a fresh launch", async () => {
    const first = launchSco();
    await tick();
    const state = stateOfSize(3000);
    first.report({ score: 1, state });
    await tick();
    const carried = first.api.get("cmi.suspend_data");
    first.close();

    // A new launch sees only what the LMS persisted — localStorage in a real
    // LMS belongs to a different browser or was cleared between attempts.
    const second = launchSco({
      lms: makeFakeLms({ initial: { "cmi.suspend_data": carried } }),
    });
    await tick();

    const response = await second.requestState();
    expect(response.state).toEqual(state);
    second.close();
  });
});

describe("state that does not fit the suspend_data budget", () => {
  // The invariant that matters most: whatever the activity throws at it, the
  // bridge must never hand the LMS more than the field can hold.
  it.each([1_000, 50_000, 150_000, 400_000, 1_000_000])(
    "never writes more than the SPM for a %i-char state",
    async (size) => {
      const sco = launchSco();
      await tick();
      sco.report({ score: 1, state: stateOfSize(size) });
      await tick();

      const writes = sco.api.writesTo("cmi.suspend_data");
      expect(writes.length).toBeGreaterThan(0);
      for (const w of writes) {
        expect(w.length).toBeLessThanOrEqual(SUSPEND_DATA_SPM_2004);
      }
      sco.close();
    },
  );

  it("keeps the last snapshot that fit instead of erasing it", async () => {
    const sco = launchSco();
    await tick();

    const small = stateOfSize(20_000, 1);
    sco.report({ score: 0.5, state: small });
    await tick();
    expect(sco.restoredStates()[ACTIVITY_ID]).toEqual(small);

    // The student keeps working and the state outgrows the budget.  The blob
    // has to be dropped, but the copy already saved must survive: overwriting
    // it would destroy work that was safely stored, and since Doenet state
    // only grows, every later save would fail the same way.
    sco.report({ score: 1, state: stateOfSize(400_000, 2) });
    await tick();

    expect(sco.restoredStates()[ACTIVITY_ID]).toEqual(small);
    // ...while the grading fields track the newest answer.
    expect(sco.suspendData().correct).toBe(1);
    expect(Number(sco.api.get("cmi.score.scaled"))).toBe(1);
    sco.close();
  });

  it("still writes parseable data when nothing ever fit", async () => {
    const sco = launchSco();
    await tick();
    sco.report({ score: 1, state: stateOfSize(400_000) });
    await tick();

    const parsed = sco.suspendData(); // throws if not valid JSON
    expect(parsed.dz).toBeUndefined();
    expect(parsed.correct).toBe(1);
    expect(Number(sco.api.get("cmi.score.scaled"))).toBe(1);
    sco.close();
  });

  it("warns rather than failing silently", async () => {
    const sco = launchSco();
    await tick();
    sco.report({ score: 1, state: stateOfSize(400_000) });
    await tick();

    expect(sco.warnings.join("\n")).toMatch(/exceeds suspend_data budget/);
    sco.close();
  });
});

describe("a player that truncates suspend_data", () => {
  // A player applying the SCORM 1.2 cap to a 2004 package leaves a fragment of
  // JSON behind.  The next launch must survive it — and must not report a zero
  // score over the grade the student already earned.
  it("starts cleanly and does not overwrite the earned score", async () => {
    const first = launchSco({
      lms: makeFakeLms({ suspendDataSpm: SUSPEND_DATA_SPM_12 }),
    });
    await tick();
    first.report({ score: 1, state: stateOfSize(20_000) });
    await tick();

    const mangled = first.api.get("cmi.suspend_data");
    expect(mangled.length).toBe(SUSPEND_DATA_SPM_12);
    expect(() => JSON.parse(mangled)).toThrow(); // precondition: it is broken
    first.close();

    const second = launchSco({
      lms: makeFakeLms({
        suspendDataSpm: SUSPEND_DATA_SPM_12,
        initial: { "cmi.suspend_data": mangled, "cmi.score.scaled": "1" },
      }),
    });
    await tick();

    expect(second.warnings.join("\n")).toMatch(/Could not parse suspend_data/);
    // The gradebook value lives in cmi.score.*, not in suspend_data, and the
    // restore path is guarded on having a saved score — so a failed parse must
    // not push a 0 over the 1 the LMS already holds.
    expect(second.api.writesTo("cmi.score.scaled")).not.toContain("0");
    expect(Number(second.api.get("cmi.score.scaled"))).toBe(1);
    second.close();
  });
});

describe("a browser that refuses localStorage", () => {
  // localStorage is the documented fallback once the state blob is dropped, and
  // an LMS runs the SCO as a cross-site iframe where storage may be partitioned
  // away or over quota.  Both stores failing is total loss of the student's
  // work, so it must not be silent.
  it("warns once and keeps reporting to the LMS", async () => {
    const sco = launchSco({ breakLocalStorage: true });
    await tick();

    sco.report({ score: 0.5, state: stateOfSize(1000, 1) });
    await tick();
    sco.report({ score: 1, state: stateOfSize(1000, 2) });
    await tick();

    const hits = sco.warnings.filter((w) =>
      /Could not save Doenet state to localStorage/.test(w),
    );
    expect(hits).toHaveLength(1);
    expect(Number(sco.api.get("cmi.score.scaled"))).toBe(1);
    sco.close();
  });
});

describe("the compression assumption behind the budget", () => {
  // The whole design rests on lz-string keeping real state under 60,000 chars,
  // so pin down where the boundary is rather than assuming it is far away.
  // Measured on real Doenet state, lz-string manages only 1.15-1.8x — nothing
  // like the 5-20x that repetitive synthetic filler suggests.  At 1.2x the
  // budget is gone by ~72 KB of raw state, which is inside the "10-100 KB"
  // range the bridge's own comments cite for Doenet state.  The ceiling is
  // reachable in practice, not a theoretical corner.
  it("compresses low-repetition state only ~1.2x", () => {
    const ratio = (n) =>
      n / LZString.compressToBase64(JSON.stringify(stateOfSize(n))).length;

    expect(ratio(100_000)).toBeGreaterThan(1.1);
    expect(ratio(100_000)).toBeLessThan(1.5);
  });

  it("crosses the budget between 70 KB and 80 KB of raw state at that ratio", () => {
    const compressed = (n) =>
      LZString.compressToBase64(JSON.stringify(stateOfSize(n))).length;

    expect(compressed(70_000)).toBeLessThan(60_000);
    expect(compressed(80_000)).toBeGreaterThan(60_000);
  });
});
