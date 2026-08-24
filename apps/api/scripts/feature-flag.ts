// Turns feature flags on and off in one environment, without a deploy.
// This is the *only* write path for flags — there is no HTTP endpoint — so
// flipping one takes the same access as any other database script.
// -----
// Local dev (from apps/api, requires tsx):
//   npx tsx scripts/feature-flag.ts list
//   npx tsx scripts/feature-flag.ts on  <flag> ["why, and who asked"]
//   npx tsx scripts/feature-flag.ts off <flag> ["why"]
//   npx tsx scripts/feature-flag.ts clear <flag>     # back to the code default
//   npx tsx scripts/feature-flag.ts prune            # drop rows for deleted flags
//
// Production (inside the running ECS Fargate task, cwd is /DoenetTools/apps/api):
//   node dist/scripts/feature-flag.js on <flag>
//
// To reach the prod container: run `infra/scripts/exec.sh -s prod` from the repo
// root, pick the api service/task, then run the command above. The change takes
// effect on every API task within FEATURE_FLAGS_CACHE_TTL_MS (~15s by default).
// -----
import {
  FEATURE_FLAGS,
  FEATURE_FLAG_NAMES,
  isFeatureFlagName,
  type FeatureFlagName,
} from "@doenet-tools/shared";
import { prisma } from "../src/model";
import {
  clearFeatureFlag,
  getFeatureFlags,
  listFeatureFlagRows,
  pruneFeatureFlagRows,
  setFeatureFlag,
} from "../src/feature-flags";

const USAGE = `Usage:
  feature-flag list
  feature-flag on    <flag> [note]
  feature-flag off   <flag> [note]
  feature-flag clear <flag>
  feature-flag prune

Known flags: ${FEATURE_FLAG_NAMES.join(", ") || "(none)"}`;

function requireFlagName(raw: string | undefined): FeatureFlagName {
  if (!raw || !isFeatureFlagName(raw)) {
    console.error(`Unknown feature flag: ${JSON.stringify(raw)}\n\n${USAGE}`);
    process.exit(2);
  }
  return raw;
}

async function list() {
  const values = await getFeatureFlags();
  const rows = await listFeatureFlagRows();
  const byName = new Map(rows.map((r) => [r.name, r]));

  for (const name of FEATURE_FLAG_NAMES) {
    const row = byName.get(name);
    const source = row
      ? `set ${row.updatedAt.toISOString()}${row.note ? ` — ${row.note}` : ""}`
      : `code default (${FEATURE_FLAGS[name].defaultEnabled ? "on" : "off"})`;
    console.log(
      `${values[name] ? "ON  " : "off "} ${name.padEnd(28)} ${source}`,
    );
    console.log(`     ${FEATURE_FLAGS[name].description}`);
  }

  // Env pins beat the database, so a value can disagree with the row above.
  if (process.env.FEATURE_FLAG_OVERRIDES) {
    console.log(
      `\nEnv pins: FEATURE_FLAG_OVERRIDES=${process.env.FEATURE_FLAG_OVERRIDES}`,
    );
  }

  const stale = rows.filter((r) => !isFeatureFlagName(r.name));
  if (stale.length > 0) {
    console.log(
      `\nRows for flags no longer in the registry (ignored; \`prune\` to remove): ${stale
        .map((r) => r.name)
        .join(", ")}`,
    );
  }
}

async function main() {
  const [command, flagArg, note] = process.argv.slice(2);

  switch (command) {
    case "list":
    case undefined:
      await list();
      return;

    case "on":
    case "off": {
      const name = requireFlagName(flagArg);
      await setFeatureFlag(name, command === "on", note);
      console.log(
        `${name} is now ${command.toUpperCase()} in this environment.`,
      );
      return;
    }

    case "clear": {
      const name = requireFlagName(flagArg);
      await clearFeatureFlag(name);
      console.log(
        `${name} reset to its code default (${FEATURE_FLAGS[name].defaultEnabled ? "on" : "off"}).`,
      );
      return;
    }

    case "prune": {
      const pruned = await pruneFeatureFlagRows();
      console.log(
        pruned.length > 0
          ? `Removed rows for unknown flags: ${pruned.join(", ")}`
          : "Nothing to prune.",
      );
      return;
    }

    default:
      console.error(USAGE);
      process.exit(2);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
