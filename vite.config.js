import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  assetsInclude: ['**/*.doenet'],
  server: {
    proxy: {
      '/api': 'http://apache',
      '/cyapi': 'http://apache',
      '/media': 'http://apache',
    },
  },
  resolve: {
    alias: [
      { find: 'csv-parse', replacement: 'csv-parse/browser/esm' },
      { find: '@Toast', replacement: '/src/Tools/_framework/Toast' },
      { find: '@Tool', replacement: '/src/Tools/_framework/Tool' },
      { find: 'solid-svg', replacement: '@fortawesome/free-solid-svg-icons' },
    ],
  },
  optimizeDeps: {
    // Node.js global to browser globalThis
    define: {
      global: 'globalThis',
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
    outDir: './dist_local',
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
