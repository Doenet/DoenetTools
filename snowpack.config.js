const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:80' });
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'localhost');
});

module.exports = {
  mount: {
    'src/Tools/exampleTool': '/exampleTool',
    'src/Tools/library': '/library',
    'src/Tools/temp': '/temp',
    // 'src/Renderers': '/renderers',
    'src/API': '/api',
    'src/Home': '/',
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
    // { match: 'routes', src: '.*', dest: '/index.html' },
    //Using this to map port 80 to 8080 for api requests
    {
      src: '/api/.*',
      dest: (req, res) => {
        proxy.web(req, res);
      },
    },
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
    treeshake: true,
  },
  packageOptions: {
    polyfillNode: true,
    // cache:'aaa',
  },
  devOptions: {
    openUrl: '/library',
  },
  buildOptions: {
    watch: true,
    out: 'dist_local',
    clean: false,
    // minify: true
  },
};
