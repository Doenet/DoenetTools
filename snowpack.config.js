const proxy = require('http2-proxy');

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
    'src/Tools/new': '/new',
    'src/Tools/cypressTest': '/cypressTest',
    'src/Tools/uiDocs': '/uiDocs',
    'src/Tools/_framework': '/_framework',
    'src/Media': { url: '/media', static: true, resolve: false },
    'src/Media/profile_pictures': '/profile_pictures',
    'src/Parser': '/parser',
    'src/Api': '/api',
    'src/Home': '/',
    'src/Viewer': '/viewer',
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
    output: 'stream',
    port: 80,
    hmrPort: 80,
    openUrl: '/exampleTool',
  },
  buildOptions: {
    out: 'dist',
    clean: false,
  },
};
