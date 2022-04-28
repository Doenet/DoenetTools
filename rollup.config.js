import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  input: 'src/Core/Core.js',
  //   external: ['math-expressions'],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      browser: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    // babel({
    //   presets: ['@babel/preset-react'],
    // }),
    commonjs({
      transformMixedEsModules: true,
      //   esmExternals: ['math-expressions'],
    }),
  ],
  output: {
    file: 'src/Viewer/core.js',
    format: 'esm',
    // name: 'core',
    // globals: {
    //   'math-expressions': 'math-expressions',
    // },
  },
});
