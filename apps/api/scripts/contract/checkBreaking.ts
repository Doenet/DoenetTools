/**
 * CI check: fails if the committed `apps/api/openapi.json` makes a breaking
 * change relative to where HEAD forked from the base branch (default
 * `origin/main`), unless ALLOW_BREAKING=1 (CI sets it when the PR has the
 * `api-breaking` label).
 *
 * A breaking change is safe only once no running client still needs the old
 * shape: nothing in the repo calls it, and no app build that did is still
 * calling (open tabs keep their build until reloaded; see "Removing an API
 * shape" in infra/README.md). The type checker proves the first; the label
 * records that someone checked the second.
 *
 * Usage:
 *   npm run contract:check-breaking --workspace @doenet-tools/api [-- --base <git-ref>]
 *
 * Requires the `oasdiff` binary on PATH (or set OASDIFF to its path).
 */
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import type { OpenApiDocument } from "../../src/contract";
import { breakingChanges, describeChange } from "./gate";

const repoRoot = path.resolve(__dirname, "../../../..");
const SPEC_PATH = "apps/api/openapi.json";

function readSpecAt(ref: string): OpenApiDocument | null {
  // Compare against where HEAD forked from `ref`, as checkMigrations does
  // with `ref...HEAD`: in CI, HEAD is the PR's merge commit, and
  // `origin/<base>` may have moved past its parent by the time the job runs,
  // which would report operations added there as removed. A bad ref is an
  // error (merge-base throws), not "no spec on the base branch".
  const forkPoint = execFileSync("git", ["merge-base", ref, "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
  try {
    const json = execFileSync("git", ["show", `${forkPoint}:${SPEC_PATH}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(json) as OpenApiDocument;
  } catch {
    return null;
  }
}

function main(): number {
  const baseIndex = process.argv.indexOf("--base");
  const baseRef = baseIndex >= 0 ? process.argv[baseIndex + 1] : "origin/main";
  const base = readSpecAt(baseRef);
  if (!base) {
    console.log(`No ${SPEC_PATH} on ${baseRef}; nothing to compare against.`);
    return 0;
  }
  const head = JSON.parse(
    fs.readFileSync(path.join(repoRoot, SPEC_PATH), "utf8"),
  ) as OpenApiDocument;

  const changes = breakingChanges(base, head);
  if (changes.length === 0) {
    console.log("No breaking changes to the API contract.");
    return 0;
  }

  const list = changes.map(describeChange).join("\n");
  if (["1", "true"].includes(process.env.ALLOW_BREAKING ?? "")) {
    console.log(
      `Breaking changes, allowed by the api-breaking label:\n${list}`,
    );
    return 0;
  }
  console.error(
    `Breaking changes to the API contract:\n${list}\n\n` +
      "Clients already running in browsers still use the old shape. Add the " +
      "replacement first and migrate every caller in one PR; once no app " +
      "build using the old shape is still calling it (infra/README.md, " +
      '"Removing an API shape"), remove it in a PR labelled `api-breaking`. ' +
      "See apps/api/AGENTS.md.",
  );
  return 1;
}

process.exitCode = main();
