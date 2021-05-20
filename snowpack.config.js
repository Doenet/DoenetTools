const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:80' });
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'localhost');
});

module.exports = {
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
    {
      src: '/media/.*',
      dest: (req, res) => {
        proxy.web(req, res);
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
    openUrl: '/library',
  },
  buildOptions: {
    watch: true,
    out: 'dist_local',
    clean: false,
    // minify: true
  },
};
