module.exports = {
  alias: {
    '@Tool': './src/Tools/_framework/Tool',
    '@Toast': './src/Tools/_framework/Toast',
    'solid-svg': '@fortawesome/free-solid-svg-icons',
    'react-spring': '@react-spring/web',
  },
  mount: {
    // 'src/Tools/accountSettings': '/accountSettings',
    // 'src/Tools/content': '/content',
    // 'src/Tools/course': '/course',
    // 'src/Tools/docs': '/docs',
    // 'src/Tools/gradebook': '/gradebook',
    // 'src/Tools/library': '/library',
    // 'src/Tools/signin': '/signin',
    // 'src/Tools/signout': '/signout',
    // 'src/Tools/new': '/new',
    'src/Core': '/core',
    'src/Viewer': '/viewer',
    'src/Tools/_framework': '/_framework',
    'src/Media': { url: '/media', static: true, resolve: false },
    'src/Media/profile_pictures': '/profile_pictures',
    'src/Parser': '/parser',
    'src/Api': '/api',
    'src/Api/vendor': '/api/vendor',
    'src/Tools/singlepage': '/',
    'src/_reactComponents': '/_reactComponents',
    'src/_sharedRecoil': '/_sharedRecoil',
    'src/_utils': '/_utils',
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
  buildOptions: {
    out: 'dist',
    clean: true,
    // minify: true
  },
};
