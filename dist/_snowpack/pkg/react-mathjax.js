import { c as createCommonjsModule, g as getDefaultExportFromCjs } from './common/_commonjsHelpers-f5d70792.js';
import { r as react } from './common/index-f66788ca.js';

var loadScript = function load (src, opts, cb) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var script = document.createElement('script');

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  cb = cb || function() {};

  script.type = opts.type || 'text/javascript';
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true;
  script.src = src;

  if (opts.attrs) {
    setAttributes(script, opts.attrs);
  }

  if (opts.text) {
    script.text = '' + opts.text;
  }

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd;
  onend(script, cb);

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script);
};

function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}

function stdOnEnd (script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null;
    cb(null, script);
  };
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null;
    cb(new Error('Failed to load ' + this.src), script);
  };
}

function ieOnEnd (script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null;
    cb(null, script); // there is no way to catch loading errors in IE8
  };
}

var context = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});



var React = _interopRequireWildcard(react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var MathJaxContext = React.createContext({
    MathJax: null,
    registerNode: function registerNode() {}
});
exports.default = MathJaxContext;
});

var Provider = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var React = _interopRequireWildcard(react);



var _loadScript2 = _interopRequireDefault(loadScript);



var _context2 = _interopRequireDefault(context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global MathJax */


var MathJaxProvider = function (_React$Component) {
    _inherits(MathJaxProvider, _React$Component);

    function MathJaxProvider(props) {
        _classCallCheck(this, MathJaxProvider);

        var _this = _possibleConstructorReturn(this, (MathJaxProvider.__proto__ || Object.getPrototypeOf(MathJaxProvider)).call(this, props));

        _this.hasNodes = false;
        _this.loaded = false;

        _this.registerNode = function () {
            _this.hasNodes = true;
        };

        _this.load = function () {
            var script = _this.props.script;


            if (_this.loaded || !_this.hasNodes) {
                return;
            }

            _this.loaded = true;

            if (!script) {
                _this.onLoad(null);
                return;
            }

            (0, _loadScript2.default)(script, _this.onLoad);
        };

        _this.onLoad = function (err) {
            var options = _this.props.options;

            MathJax.Hub.Config(options);

            _this.setState({
                MathJax: MathJax
            });
        };

        _this.state = {
            MathJax: null,
            registerNode: _this.registerNode
        };
        return _this;
    }

    _createClass(MathJaxProvider, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.load();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.load();
        }

        // Is there any math nodes to typeset ?


        // Have we already loaded MathJax ?


        /*
         * Signal that there is at least one node to typeset.
         * It will trigger the mathjax loading.
         */


        /*
         * Load the MathJax library
         */

    }, {
        key: 'render',
        value: function render() {
            var children = this.props.children;


            return React.createElement(
                _context2.default.Provider,
                { value: this.state },
                children
            );
        }
    }]);

    return MathJaxProvider;
}(React.Component);

MathJaxProvider.defaultProps = {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML',
    options: {
        tex2jax: {
            inlineMath: []
        },
        showMathMenu: false,
        showMathMenuMSIE: false
    }
};
exports.default = MathJaxProvider;
});

var process_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var pendingScripts = [];
var pendingCallbacks = [];
var needsProcess = false;

/*
 * Process math in a script node using MathJax.
 */
function process(MathJax, script, callback) {
    pendingScripts.push(script);
    pendingCallbacks.push(callback);
    if (!needsProcess) {
        needsProcess = true;
        setTimeout(function () {
            return doProcess(MathJax);
        }, 0);
    }
}

function doProcess(MathJax) {
    MathJax.Hub.Queue(function () {
        var oldElementScripts = MathJax.Hub.elementScripts;
        MathJax.Hub.elementScripts = function (element) {
            return pendingScripts;
        };

        try {
            return MathJax.Hub.Process(null, function () {
                // Trigger all of the pending callbacks before clearing them
                // out.
                pendingCallbacks.forEach(function (callback) {
                    callback();
                });

                pendingScripts = [];
                pendingCallbacks = [];
                needsProcess = false;
            });
        } catch (e) {
            // IE8 requires `catch` in order to use `finally`
            throw e;
        } finally {
            MathJax.Hub.elementScripts = oldElementScripts;
        }
    });
}

exports.default = process;
});

var Node = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var React = _interopRequireWildcard(react);



var _context2 = _interopRequireDefault(context);



var _process2 = _interopRequireDefault(process_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global document */


var NodeWithMathJax = function (_React$Component) {
    _inherits(NodeWithMathJax, _React$Component);

    function NodeWithMathJax() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, NodeWithMathJax);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NodeWithMathJax.__proto__ || Object.getPrototypeOf(NodeWithMathJax)).call.apply(_ref, [this].concat(args))), _this), _this.container = React.createRef(), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(NodeWithMathJax, [{
        key: 'componentDidMount',


        /*
         * Render the math once the node is mounted
         */
        value: function componentDidMount() {
            this.typeset();
        }

        /*
         * Update the jax, force update if the display mode changed.
         */

    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var forceUpdate = prevProps.inline != this.props.inline;
            this.typeset(forceUpdate);
        }

        /*
         * Clear the math when unmounting the node
         */

    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.clear();
        }
    }, {
        key: 'clear',


        /*
         * Clear the jax
         */
        value: function clear() {
            var MathJax = this.props.MathJax;


            if (!this.script || !MathJax) {
                return;
            }

            var jax = MathJax.Hub.getJaxFor(this.script);
            if (jax) {
                jax.Remove();
            }
        }

        /*
         * Update math in the node.
         */

    }, {
        key: 'typeset',
        value: function typeset(forceUpdate) {
            var _this2 = this;

            var _props = this.props,
                MathJax = _props.MathJax,
                formula = _props.formula,
                onRender = _props.onRender;


            if (!MathJax) {
                return;
            }

            if (forceUpdate) {
                this.clear();
            }

            if (!forceUpdate && this.script) {
                MathJax.Hub.Queue(function () {
                    var jax = MathJax.Hub.getJaxFor(_this2.script);

                    if (jax) jax.Text(formula, onRender);else {
                        var script = _this2.setScriptText(formula);
                        (0, _process2.default)(MathJax, script, onRender);
                    }
                });
            } else {
                var script = this.setScriptText(formula);
                (0, _process2.default)(MathJax, script, onRender);
            }
        }

        /*
         * Create a script.
         */

    }, {
        key: 'setScriptText',
        value: function setScriptText(text) {
            var inline = this.props.inline;


            if (!this.script) {
                this.script = document.createElement('script');
                this.script.type = 'math/tex; ' + (inline ? '' : 'mode=display');
                this.container.current.appendChild(this.script);
            }

            if ('text' in this.script) {
                // IE8, etc
                this.script.text = text;
            } else {
                this.script.textContent = text;
            }

            return this.script;
        }
    }, {
        key: 'render',
        value: function render() {
            // eslint-disable-next-line no-unused-vars
            var _props2 = this.props,
                MathJax = _props2.MathJax,
                formula = _props2.formula,
                inline = _props2.inline,
                onRender = _props2.onRender,
                rest = _objectWithoutProperties(_props2, ['MathJax', 'formula', 'inline', 'onRender']);

            if (this.props.inline) {
                return React.createElement('span', _extends({ ref: this.container }, rest));
            }

            return React.createElement('div', _extends({ ref: this.container }, rest));
        }
    }]);

    return NodeWithMathJax;
}(React.Component);

NodeWithMathJax.defaultProps = {
    inline: false,
    onRender: function onRender() {}
};

var MathJaxNode = function (_React$PureComponent) {
    _inherits(MathJaxNode, _React$PureComponent);

    function MathJaxNode() {
        _classCallCheck(this, MathJaxNode);

        return _possibleConstructorReturn(this, (MathJaxNode.__proto__ || Object.getPrototypeOf(MathJaxNode)).apply(this, arguments));
    }

    _createClass(MathJaxNode, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            return React.createElement(
                _context2.default.Consumer,
                null,
                function (_ref2) {
                    var MathJax = _ref2.MathJax,
                        registerNode = _ref2.registerNode;

                    registerNode();

                    if (!MathJax) {
                        return null;
                    }

                    return React.createElement(NodeWithMathJax, _extends({}, _this4.props, { MathJax: MathJax }));
                }
            );
        }
    }]);

    return MathJaxNode;
}(React.PureComponent);

exports.default = MathJaxNode;
});

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});



var _Provider2 = _interopRequireDefault(Provider);



var _Node2 = _interopRequireDefault(Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MathJax = {
    Provider: _Provider2.default,
    Node: _Node2.default
};

exports.default = MathJax;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(lib);

export default __pika_web_default_export_for_treeshaking__;
