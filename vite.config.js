import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  resolve: {
    alias: [{ find: '@Toast', replacement: './src/Tools/_framework/Toast' }],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/cyapi': 'http://localhost:8080',
    },
  },
  build: {
    rollupOptions: {},
  },
});
