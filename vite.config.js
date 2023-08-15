import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 8012,
  },
  optimizeDeps: {
    // Node.js global to browser globalThis
    define: {
      global: "globalThis",
    },
    // Enable esbuild polyfill plugins
    plugins: [
      NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
      }),
      NodeModulesPolyfillPlugin(),
    ],
  },
  build: {
    minify: true,
    lib: {
      entry: "index.js",
      name: "DoenetML",
      fileName: "doenetml",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      plugins: [nodePolyfills()],
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "react",
          "react-dom": "react-dom",
          "styled-components": "styled-components",
        },
      },
    },
  },
  worker: {
    format: "iife",
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
      } catch (error) {
        return "auto";
      }
    },
  },
});
