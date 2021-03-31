

module.exports = {
  mount: {
    'src/Tools/exampleTool': '/exampleTool',
    'src/Tools/library': '/library',
    'src/Tools/temp': '/temp',
    'src/Renderers': '/renderers',
    'src/API': '/api',
    'src/Home': '/',
  },
  plugins: [
    // '@snowpack/plugin-dotenv',
    [
      'snowpack-plugin-raw-file-loader',
      {
        exts: ['.doenet', '.txt'], // Add file extensions saying what files should be loaded as strings in your snowpack application. Default: '.txt'
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
    
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
    treeshake: true,
  },
  packageOptions: {
    polyfillNode : true
  },
  buildOptions: {
    out: 'dist',
    clean: true,
    minify: true
  },
};
