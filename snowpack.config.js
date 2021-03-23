const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:80' });
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'localhost');
});

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  // sets what directories should be mounted where
  mount: {
    "src": "/"
    // "desired/path" : "desired/endpoint"
  },
  plugins: [
    ["snowpack-plugin-raw-file-loader", {
      exts: [".doenet",".txt"], // Add file extensions saying what files should be loaded as strings in your snowpack application. Default: '.txt'
    }],
  ],
  //any and all requests to apache must have a section here.
  routes: [
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
