import { promises } from 'fs';
import { build } from 'esbuild';

let processEnv = {
  name: 'processEnv',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      let contents = await promises.readFile(args.path, 'utf8');
      //Uncomment next line to list file paths
      // console.log(args.path,contents.length)
      const re1 = /process\.env/g;
      const re2 = /process\.stderr/g;
      contents = contents.replace(re1, 'import.meta.env');
      contents = contents.replace(re2, 'import.meta.stderr');
      return { contents };
    });
  },
};

build({
  entryPoints: ['src/Core/Core.js'],
  format: 'esm',
  bundle: true,
  minify: false,
  target: ['firefox99', 'chrome99', 'safari15'],
  // define: {
  //   'import.meta.env': 'x',
  // },
  external: [
    'math-expressions',
    '@Toast',
    'axios',
    'idb-keyval',
    'hi-base32',
    '@lezer',
  ],
  plugins: [processEnv],
  outfile: 'src/Viewer/core.js',
}).catch(() => process.exit(1));
