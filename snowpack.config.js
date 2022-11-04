const proxy = require('http2-proxy');

module.exports = {
  alias: {
    '@Tool': './src/Tools/_framework/Tool',
    '@Toast': './src/Tools/_framework/Toast',
    'solid-svg': '@fortawesome/free-solid-svg-icons',
    'react-spring': '@react-spring/web',
  },
  mount: {
    'cypress_php/api': '/cyapi',
    'src/Viewer': '/viewer',
    'src/Tools/temp': '/temp',
    'src/Tools/test': '/test',
    'src/Tools/singlepage': '/',
    'src/Tools/cypressTest': '/cypressTest',
    'src/Tools/uiDocs': '/uiDocs',
    'src/Tools/umn': '/umn',
    'src/Media': { url: '/media', static: true, resolve: false },
    'src/Media/profile_pictures': '/profile_pictures',
    'src/Media/byPageId': '/media/byPageId',
    'src/Parser': '/parser',
    'src/Api': '/api',
    'src/Tools/_framework': '/_framework',
    'src/_reactComponents': '/_reactComponents',
    'src/_sharedRecoil': '/_sharedRecoil',
    'src/_utils': '/_utils',
    'src/Core': '/core',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      'snowpack-plugin-raw-file-loader',
      {
        // Add file extensions saying what files should be loaded as strings in your snowpack application. Default: '.txt'
        exts: ['.doenet', '.txt'],
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
          hostname: 'localhost',
          port: 8080,
        });
      },
    },
    {
      src: '/cyapi/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8080,
        });
      },
    },
    {
      src: '/media/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8080,
        });
      },
    },
    {
      src: '/media/byPageId/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8080,
        });
      },
    },
    {
      match: 'routes',
      src: '/temp.*',
      dest: '/temp/index.html',
    },
    {
      match: 'routes',
      src: '/test.*',
      dest: '/test/index.html',
    },
    {
      match: 'routes',
      src: '/uiDocs.*',
      dest: '/uiDocs/index.html',
    },
    {
      match: 'routes',
      src: '/umn.*',
      dest: '/umn/index.html',
    },
    {
      match: 'routes',
      src: '/cypressTest.*',
      dest: '/cypressTest/index.html',
    },
    {
      match: 'routes',
      src: '/chat.*',
      dest: '/chat/index.html',
    },
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
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
    output: 'stream',
    hmr: false,
    port: 8081,
    hmrPort: 8081,
    openUrl: '/exampleTool',
  },
  buildOptions: {
    out: 'dist',
    clean: false,
  },
};
