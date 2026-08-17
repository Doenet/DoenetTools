// A minimal SCORM 2004 4th Edition API implementation, faithful enough for the
// parts of the data model the bridge touches, plus the knobs that matter for
// the state-size edge cases:
//
//   suspendDataSpm   Some players enforce a Smallest Permitted Maximum on
//                    cmi.suspend_data and silently truncate past it.  SCORM 1.2
//                    players cap at 4096; a player that mistakenly applies the
//                    1.2 cap to a 2004 package is exactly the case that leaves
//                    unparseable JSON behind.
//   failWrites       Write rejection (returns "false" with a 405 error code),
//                    so we can check the bridge reports rather than assumes.
//
// Every call is recorded in `calls`, so tests can assert on what the bridge
// actually said to the LMS instead of only on the final data model state.

export const SUSPEND_DATA_SPM_2004 = 64000;
export const SUSPEND_DATA_SPM_12 = 4096;

export function makeFakeLms({
  initial = {},
  suspendDataSpm = SUSPEND_DATA_SPM_2004,
  failWrites = false,
} = {}) {
  const model = new Map(
    Object.entries({
      "cmi.learner_id": "student-1",
      "cmi.entry": "ab-initio",
      "cmi.completion_status": "not attempted",
      "cmi.suspend_data": "",
      "cmi.interactions._count": "0",
      ...initial,
    }),
  );

  const calls = [];
  let error = "0";
  let initialized = false;
  let terminated = false;
  let truncated = false;

  const record = (fn, key, value, result) => {
    calls.push({ fn, key, value, result, error });
    return result;
  };

  const api = {
    calls,
    model,
    /** Every value ever written to a key, oldest first. */
    writesTo(key) {
      return calls
        .filter((c) => c.fn === "SetValue" && c.key === key)
        .map((c) => c.value);
    },
    get(key) {
      return model.get(key) ?? "";
    },
    get truncatedSuspendData() {
      return truncated;
    },

    Initialize() {
      error = initialized ? "103" : "0";
      const result = initialized ? "false" : "true";
      initialized = true;
      return record("Initialize", null, null, result);
    },
    Terminate() {
      terminated = true;
      error = "0";
      return record("Terminate", null, null, "true");
    },
    GetValue(key) {
      error = "0";
      const value = model.get(key) ?? "";
      // The count element is derived, like a real player's.
      return record("GetValue", key, null, value);
    },
    SetValue(key, value) {
      if (failWrites) {
        error = "405";
        return record("SetValue", key, value, "false");
      }
      let stored = String(value);
      if (key === "cmi.suspend_data" && stored.length > suspendDataSpm) {
        // Silent truncation: the player accepts the call and reports success.
        stored = stored.slice(0, suspendDataSpm);
        truncated = true;
      }
      model.set(key, stored);
      if (/^cmi\.interactions\.(\d+)\./.test(key)) {
        const idx = Number(RegExp.$1);
        const count = Number(model.get("cmi.interactions._count") ?? "0");
        if (idx + 1 > count) {
          model.set("cmi.interactions._count", String(idx + 1));
        }
      }
      error = "0";
      return record("SetValue", key, String(value), "true");
    },
    Commit() {
      error = "0";
      return record("Commit", null, null, "true");
    },
    GetLastError() {
      return error;
    },
    GetErrorString() {
      return "";
    },
    GetDiagnostic() {
      return "";
    },
  };

  Object.defineProperty(api, "terminated", { get: () => terminated });
  return api;
}
