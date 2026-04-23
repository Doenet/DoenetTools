type SyntaxUpdateResult = {
  xml: string;
  vfile: {
    messages: unknown[];
  };
};

type SyntaxUpdaterModule = {
  updateSyntaxFromV06toV07: (
    source: string,
    options?: unknown,
  ) => Promise<SyntaxUpdateResult>;
};

let syntaxUpdaterModule: Promise<SyntaxUpdaterModule> | null = null;
// Load the syntax upgrader from public/vendor instead of bundling it into the
// app, since it is only needed when someone explicitly runs the upgrade action.
const syntaxUpdaterModulePath = "/vendor/doenet/v06-to-v07/index.js";

async function loadSyntaxUpdater() {
  syntaxUpdaterModule ??= import(
    /* @vite-ignore */
    // Keep this as a runtime URL so Vite doesn't try to pull the large
    // converter bundle and its worker back into the app asset build.
    syntaxUpdaterModulePath
  ) as Promise<SyntaxUpdaterModule>;

  return await syntaxUpdaterModule;
}

export async function updateSyntaxFromV06toV07(source: string) {
  // Cache the module promise so repeated upgrades in one session do not
  // re-fetch the vendored bundle.
  const module = await loadSyntaxUpdater();
  return await module.updateSyntaxFromV06toV07(source);
}
