import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  input: 'src/Core/Core.js',
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs({ transformMixedEsModules: true }),
    nodePolyfills(),
  ],
  output: {
    file: 'src/Viewer/core.js',
    format: 'iife',
    name: 'Core',
  },
});
