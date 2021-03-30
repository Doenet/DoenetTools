// const httpProxy = require('http-proxy');
// const proxy = httpProxy.createServer({ target: 'http://localhost:80' });
// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//   proxyReq.setHeader('Host', 'localhost');
// });

module.exports = {
  mount: {
    'src/Tools/exampleTool': '/exampleTool',
    'src/Tools/library': '/library',
    'src/Tools/temp': '/temp',
    'src/Core': '/core',
    'src/api': '/api',
    // 'src/Renderers': '/renderers',
    // 'src/Tools': { url: '/', static: true,  resolve: false},
    // public: { url: '/', static: true },
    // src: { url: '/dist' },
    // "src/Tools": "/",
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
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
    // {
    //   src: '/api/.*',
    //   dest: (req, res) => {
    //     proxy.web(req, res);
    //   },
    // },
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
    treeshake: true,
  },
  packageOptions: {
    // cache:'aaa',
  },
  devOptions: {
    openUrl: 'core/',
  },
  buildOptions: {
    watch: true,
    out: 'dist_local',
    clean: false,
    // minify: true
  },
};
