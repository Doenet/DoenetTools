const proxy = require('http2-proxy');
// const proxy = httpProxy.createServer({ target: 'http://0.0.0.0:80' });
// proxy.on('proxyReq', function (proxyReq, req, res, options) {
//   proxyReq.setHeader('Host', 'localhost');
// });

module.exports = {
  alias: {
    '@ToolRoot': './src/Tools/_framework/ToolRoot',
    '@Tool': './src/Tools/_framework/Tool',
    '@Toast': './src/Tools/_framework/Toast',
    'solid-svg': '@fortawesome/free-solid-svg-icons',
    'react-spring': '@react-spring/web',
  },
  mount: {
    'src/Tools/accountSettings': '/accountSettings',
    'src/Tools/content': '/content',
    'src/Tools/course': '/course',
    'src/Tools/docs': '/docs',
    'src/Tools/exampleTool': '/exampleTool',
    'src/Tools/gradebook': '/gradebook',
    'src/Tools/library': '/library',
    'src/Tools/signin': '/signin',
    'src/Tools/signout': '/signout',
    'src/Tools/temp': '/temp',
    'src/Tools/test': '/test',
    'src/Tools/_framework': '/_framework',
    'src/Media': { url: '/media', static: true, resolve: false },
    'src/Media/profile_pictures': '/profile_pictures',
    'src/Api': '/api',
    'src/Home': '/',
    'src/Viewer': '/viewer',
    'src/_reactComponents': '/_reactComponents',
    'src/_utils': '/_utils',
    'src/Core': '/core',
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
    //internal docker network mapping
    {
      src: '/api/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'apache',
          port: 80,
        });
      },
    },
    {
      src: '/media/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'apache',
          port: 80,
        });
      },
    },
  ],

  optimize: {
    // bundle: true,
    // minify: true,
    // target: 'es2020',
    // treeshake: true,
  },
  packageOptions: {
    polyfillNode: true,
    knownEntrypoints: ['crypto-js/sha1'],
  },
  devOptions: {
    port: 80,
    hmrPort: 80,
    openUrl: '/exampleTool',
  },
  buildOptions: {
    out: 'dist',
    clean: false,
    // minify: true
  },
};
