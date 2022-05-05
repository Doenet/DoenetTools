const fs = require('fs');
const esbuild = require('esbuild');
const { externalGlobalPlugin } = require('esbuild-plugin-external-global');

let processEnv = {
  name: 'processEnv',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');
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

esbuild
  .build({
    entryPoints: ['src/Core/Core.js'],
    format: 'cjs',
    // loader: { '.jsx': 'jsx', '.js': 'jsx' },
    bundle: true,
    minify: false,
    target: ['firefox99', 'chrome99', 'safari15'],
    // external: [
    //   'math-expressions',
    //   'axios',
    //   'idb-keyval',
    //   'hi-base32',
    //   '@lezer',
    // ],
    plugins: [processEnv],
    outfile: 'src/Viewer/core.js',
  })
  .catch(() => process.exit(1));
