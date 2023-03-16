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
