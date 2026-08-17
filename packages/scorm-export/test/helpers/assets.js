// Load the constant package files the same way build.mjs does, so the tests
// exercise the real templates and the real vendored bridge rather than copies.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { TEMPLATE_FILES } from "../../src/index.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function loadAssets() {
  const assets = {};
  for (const name of TEMPLATE_FILES) {
    assets[name] = readFileSync(join(pkgRoot, "templates", name), "utf8");
  }
  assets["ptx_scorm_events.js"] = readFileSync(
    join(pkgRoot, "vendor", "ptx_scorm_events.js"),
    "utf8",
  );
  assets["lti_iframe_resizer.js"] = readFileSync(
    join(pkgRoot, "vendor", "lti_iframe_resizer.js"),
    "utf8",
  );
  // createRequire rather than import.meta.resolve: vitest transforms these
  // files through Vite's SSR pipeline, which does not provide resolve().
  assets["lz-string.min.js"] = readFileSync(
    createRequire(import.meta.url).resolve("lz-string/libs/lz-string.min.js"),
    "utf8",
  );
  return assets;
}
