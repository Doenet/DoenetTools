#!/usr/bin/env node
// CLI adapter around src/index.js: read an activity off disk, write its SCORM
// zip.  All the actual package assembly lives in src/index.js so the doenet.org
// "Download SCORM" button can reuse it in the browser; this file only does the
// filesystem work that a browser cannot.
//
// Usage:
//   node build.mjs <activity.doenet> [options]
//
// Options:
//   --title "Human Title"      Title shown in the LMS (default: filename)
//   --id slug                  Activity id used to key scores/state in the
//                              LMS and localStorage (default: filename slug).
//                              Keep it stable across re-exports of the same
//                              activity, or saved student state is orphaned.
//   --doenet-version X.Y.Z     @doenet/standalone version (default: latest)
//   --out dir                  Output directory (default: ./dist)
//   --debug                    Inline debug/size-probe.html into index.html
//                              (state-blob / suspend_data console logging).
//                              Off by default; a normal package omits it.
//
// Output: <out>/<id>-scorm.zip with imsmanifest.xml at the zip root.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildScormPackage,
  TEMPLATE_FILES,
  STATIC_FILES,
} from "./src/index.js";

const here = dirname(fileURLToPath(import.meta.url));

// ── argument parsing ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const positional = [];
const opts = { "doenet-version": "latest", out: join(here, "dist") };
const booleanFlags = new Set(["debug"]);
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].slice(2);
    opts[key] = booleanFlags.has(key) ? true : args[++i];
  } else {
    positional.push(args[i]);
  }
}
if (positional.length !== 1) {
  console.error(
    "Usage: node build.mjs <activity.doenet> [--title t] [--id slug] [--doenet-version v] [--out dir] [--debug]",
  );
  process.exit(1);
}

const sourceFile = positional[0];
const doenetML = readFileSync(sourceFile, "utf8");

// ── load the constant package files ─────────────────────────────────────────
const assets = {};
for (const name of TEMPLATE_FILES) {
  assets[name] = readFileSync(join(here, "templates", name), "utf8");
}
// PreTeXt's SCORM bridge and SPLICE resize handler are vendored (locally
// modified; see vendor/VENDORED.md), so they come from vendor/.  lz-string is
// an unmodified npm dependency (pinned in package.json), resolved out of
// node_modules under the filename index.html references.
assets["ptx_scorm_events.js"] = readFileSync(
  join(here, "vendor", "ptx_scorm_events.js"),
  "utf8",
);
assets["lti_iframe_resizer.js"] = readFileSync(
  join(here, "vendor", "lti_iframe_resizer.js"),
  "utf8",
);
assets["lz-string.min.js"] = readFileSync(
  fileURLToPath(import.meta.resolve("lz-string/libs/lz-string.min.js")),
  "utf8",
);
if (opts.debug) {
  assets.debugProbe = readFileSync(
    join(here, "debug", "size-probe.html"),
    "utf8",
  );
}

const missingStatic = STATIC_FILES.filter((name) => !assets[name]);
if (missingStatic.length) {
  console.error("Internal error: unloaded assets " + missingStatic.join(", "));
  process.exit(1);
}

// ── build and write ─────────────────────────────────────────────────────────
const fallbackId = basename(sourceFile).replace(/\.[^.]*$/, "");
const { name, zip } = buildScormPackage(assets, {
  doenetML,
  title: opts.title,
  id: opts.id || fallbackId,
  doenetVersion: opts["doenet-version"],
  debug: Boolean(opts.debug),
});

mkdirSync(opts.out, { recursive: true });
const zipPath = join(opts.out, name);
writeFileSync(zipPath, zip);

console.log("SCORM package written to " + zipPath);
console.log(
  'Upload it to your LMS as a SCORM package (title: "' +
    (opts.title || name.replace(/-scorm\.zip$/, "")) +
    '").',
);
