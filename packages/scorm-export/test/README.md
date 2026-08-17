# What these tests prove, and what they don't

A SCORM package is only "correct" relative to an LMS we do not control, so no
suite here can say it works. What the suite can do is remove whole classes of
doubt, cheaply and on every commit, and leave a short list of things that still
need a human and a real LMS.

Run with `npm test --workspace @doenet-tools/scorm-export`. No server, no
database, no network — a few seconds.

## The two boundaries that make this testable

`ptx_scorm_events.js` looks like untestable integration glue, but it only talks
to two interfaces:

1. the SCORM API object (`window.API_1484_11`), and
2. SPLICE `postMessage`s from the activity iframe.

Fake both and the runtime becomes an ordinary logic test. That matters most for
the state-size edge cases: rather than hoping a real activity happens to emit a
73 KB state blob, `helpers/sco.js` sends exactly the size we want.
`helpers/fake-lms.js` implements enough of the SCORM 2004 data model to answer
back, and records every call so a test can assert on what the package _said_ to
the LMS, not just where it ended up.

Each case builds a real package and boots it in a fresh JSDOM, so the templates
and the vendored bridge under test are the ones that ship.

## Layers

| Layer             | File             | Covers                                                                                                       |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Builder           | `build.test.js`  | placeholder substitution, title escaping, `</script>` and U+2028 in the source, zip layout, determinism      |
| Package coherence | `build.test.js`  | manifest declares 2004 4th Ed; every referenced file is in the zip; flat structure                           |
| Runtime behaviour | `bridge.test.js` | session start, score + state writes, cross-launch restore                                                    |
| State-size edges  | `bridge.test.js` | the SPM invariant, growth past the budget, nothing-ever-fit, truncating player, localStorage refusing writes |

## The invariant worth keeping

> No write to `cmi.suspend_data` may exceed the field's SPM, for any state the
> activity produces.

That is asserted across state sizes from 1 KB to 1 MB. It is the one property
that, if it ever breaks, corrupts data on a real LMS — on Blackboard an
oversized write takes the score persist down with it.

## Where the budget actually runs out

Measured, not assumed (`bridge.test.js`, last block): lz-string manages only
**~1.2x** on low-repetition state, and real Doenet state measured 1.15-1.8x.
Repetitive synthetic filler compresses 5-20x and will tell you the ceiling is
far away; it isn't. At 1.2x the 60,000-char budget is gone by **~72 KB of raw
state** — inside the "10-100 KB" range this file's own comments cite for Doenet
state. Treat the limit as reachable in normal use, not a pathological corner.

## What is still unverified

- **Real LMS behaviour.** The fake follows the call contract; Canvas, Moodle and
  Blackboard each have quirks the fake does not reproduce (Canvas resetting
  `suspend_data` between attempts, Blackboard's finalization ordering). The
  vendored bridge carries hard-won workarounds for these — nothing here
  exercises them.
- **Whether real activities reach these sizes.** The generator is a stand-in.
  Worth sampling actual state blobs from real activities.
- **The real viewer.** `@doenet/standalone` is loaded from a CDN at runtime and
  never runs in these tests, so the SPLICE message shape is assumed, not
  observed. A change on Doenet's side would pass this suite and break in an LMS.
- **JSDOM is not a browser.** Storage partitioning, third-party cookie policy,
  and the parent-frame walk in `discoverApi()` behave differently for real.

## Suggested manual pass before a release

1. Build a package and upload to at least Canvas and one other LMS.
2. Answer, close the tab, relaunch: state and score both come back.
3. Repeat in a different browser (proves the LMS copy, not localStorage).
4. Open the console — no `[PTX-SCORM]` warnings during a normal session.
5. For the size path, build with `--debug` and watch `[DOENET-SIZE-PROBE]` for
   what the LMS actually returns.

A fuller option, if this ever ships widely: run a package through the ADL SCORM
2004 4th Edition Conformance Test Suite once per release.
