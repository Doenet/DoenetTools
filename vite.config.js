import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  define: {
    // Some libraries use the global object, even though it doesn't exist in the browser.
    // Alternatively, we could add `<script>window.global = window;</script>` to index.html.
    // https://github.com/vitejs/vite/discussions/5912
    global: {},
  },
  resolve: {
    alias: [{ find: '@Toast', replacement: './src/Tools/_framework/Toast' }],
  },
  server: {
    proxy: {
      '/api': 'http://apache',
      '/cyapi': 'http://apache',
      '/media': 'http://apache',
    },
  },
  build: {
    rollupOptions: {

    },
  },
});
