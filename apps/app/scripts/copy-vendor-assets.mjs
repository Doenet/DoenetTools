import { cp, mkdir, readdir, rm } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(scriptDir);
const repoRoot = dirname(dirname(appDir));

// The v0.6 -> v0.7 syntax upgrader is only used from editor settings, but its
// published bundle includes a large worker. Copying the runtime files into
// public/vendor keeps that code out of Vite's main app bundle.
const sourceDir = join(repoRoot, "node_modules", "@doenet", "v06-to-v07");
const targetDir = join(appDir, "public", "vendor", "doenet", "v06-to-v07");

await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });

const files = await readdir(sourceDir);
for (const file of files) {
  // The package entrypoint dynamically imports the hashed worker file, so ship
  // both files together and let the browser load them on demand at runtime.
  if (file === "index.js" || /^lib_doenetml_worker_bg-.*\.js$/.test(file)) {
    await cp(join(sourceDir, file), join(targetDir, file));
  }
}
