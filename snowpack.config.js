const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:80' });
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'localhost');
});

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: "/"
  },
  plugins: [
    /* ... */
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
    {
      src: '/api/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        // req.url = req.url.replace(/^\/api/, '');
        // console.log("api call!");
        // console.log(req.url);
        
        proxy.web(req, res);
      },
    },
    {
      src: '/open_api/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        // req.url = req.url.replace(/^\/api/, '');
        // console.log("api call!");
        // console.log(req.url);
        
        proxy.web(req, res);
      },
    },

    {
      src: '/media/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        // req.url = req.url.replace(/^\/api/, '');
        // console.log("api call!");
        // console.log(req.url);
        
        proxy.web(req, res);
      },
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    rollup: {
      plugins: [
        require('rollup-plugin-re')({
          patterns: [
            {
              test: /require(\((["'])(?:\\\2|[^\n])*?\2\))/g,
              replace: 'import$1'
            }
          ]
        })
      ]
    },
  },
  devOptions: {
    port: 8080
  },
  buildOptions: {
    /* ... */
  },
};
