module.exports = {
  mount: {
    'src/Tools/accountSettings': '/accountSettings',
    'src/Tools/content': '/content',
    'src/Tools/course': '/course',
    'src/Tools/dashboard': '/dashboard',
    'src/Tools/docs': '/docs',
    'src/Tools/exampleTool': '/exampleTool',
    'src/Tools/gradebook': '/gradebook',
    'src/Tools/library': '/library',
    'src/Tools/signin': '/signin',
    'src/Tools/signout': '/signout',
    'src/Tools/temp': '/temp',
    'src/Renderers': '/renderers',
    'src/Media': '/media',
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
    minify: true,
  },
};
