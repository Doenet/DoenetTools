/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'src/Tools/exampleTool': { url: '/exampleTool'},
    'src/Tools/library': { url: '/library'},
    // 'src/Tools': { url: '/', static: true,  resolve: false},
    // public: { url: '/', static: true },
    // src: { url: '/dist' },
    // "src/Tools": "/",
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    openUrl:'exampleTool/',
  },
  buildOptions: {
    /* ... */
  },
};
