import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig, Plugin } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin to resolve @doenet-tools/shared from source in dev mode
function devSharedSourcePlugin(): Plugin {
  return {
    name: "dev-shared-source",
    apply: "serve",
    enforce: "pre",
    resolveId(id) {
      if (id === "@doenet-tools/shared") {
        return resolve(__dirname, "../../packages/shared/src/index.ts");
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const useSharedSource = command === "serve";

  return {
    // Node.js global to browser globalThis
    define: {
      global: "globalThis",
    },
    optimizeDeps: {
      // Pre-bundle known heavy/late-loaded deps used by component tests to
      // avoid Vite re-optimization and hot-reload churn during Cypress runs.
      include: [
        "@doenet/v06-to-v07",
        "@doenet/doenetml-iframe",
        "better-react-mathjax",
        "ipfs-only-hash",
        "math-expressions",
        "cssesc",
      ],
      // Exclude shared from optimization so local dev resolves directly to source.
      exclude: useSharedSource ? ["@doenet-tools/shared"] : [],
    },
    plugins: [
      ...(useSharedSource ? [devSharedSourcePlugin()] : []),
      react(),
      // Enable esbuild polyfill plugins
      NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
      }),
      NodeModulesPolyfillPlugin(),
    ],
    server: {
      port: 8000,
      proxy: {
        "/cyapi": "http://apache",
        //"/media": "http://apache",
        "/api": "http://localhost:3000",
        "/media": "http://localhost:3000",
        //"/api": "http://apache",
      },
    },
    worker: {
      format: "iife",
    },
    build: {
      outDir: "./dist",
      rollupOptions: {
        plugins: [nodePolyfills()],
        input: "index.html",
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        // Bugfix required to handle issue with vite, rollup and libs (like react-datetime)
        // https://github.com/vitejs/vite/issues/2139#issuecomment-1399098579
        defaultIsModuleExports(id) {
          try {
            const module = require(id);
            if (module?.default) return false;
            return "auto";
          } catch (_error) {
            return "auto";
          }
        },
      },
    },
  };
});
