import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig({
  // Node.js global to browser globalThis
  define: {
    global: "globalThis",
  },
  plugins: [
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
  resolve: {},
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
});
