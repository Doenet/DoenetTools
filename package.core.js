const fs = require('fs');

let processEnv = {
  name: 'processEnv',
  setup(build){
    build.onLoad({ filter:/.*/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8')
      //Uncomment next line to list file paths
      // console.log(args.path,contents.length)
      const re1 = /process\.env/g;
      const re2 = /process\.stderr/g;
      contents = contents.replace(re1, 'import.meta.env');
      contents = contents.replace(re2, 'import.meta.stderr');
      return { contents }
    })
  }
}


require('esbuild').build({
  entryPoints: ['src/Core/CoreWorker.js'],
  format: 'esm',
  bundle: true,
  minify: true,
  // watch: true,
  // define: {
  //   global:"window",
  // },
  external: ['math-expressions','@Toast', 'axios'],
  plugins: [processEnv],
  outfile: 'src/Viewer/core.js',
}).catch(() => process.exit(1))