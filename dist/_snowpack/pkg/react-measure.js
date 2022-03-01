import { _ as _objectWithoutPropertiesLoose, a as _extends } from './common/setPrototypeOf-ac807fbe.js';
import { _ as _inheritsLoose } from './common/inheritsLoose-90c3012b.js';
import { r as react } from './common/index-f66788ca.js';
import { p as propTypes } from './common/index-4bda1d4e.js';
import { i as index } from './common/ResizeObserver.es-a52566ff.js';
import './common/_commonjsHelpers-f5d70792.js';
import './common/_polyfill-node:global-acbc543a.js';

var types = ['client', 'offset', 'scroll', 'bounds', 'margin'];
function getTypes(props) {
  var allowedTypes = [];
  types.forEach(function (type) {
    if (props[type]) {
      allowedTypes.push(type);
    }
  });
  return allowedTypes;
}

function getContentRect(node, types) {
  var calculations = {};

  if (types.indexOf('client') > -1) {
    calculations.client = {
      top: node.clientTop,
      left: node.clientLeft,
      width: node.clientWidth,
      height: node.clientHeight
    };
  }

  if (types.indexOf('offset') > -1) {
    calculations.offset = {
      top: node.offsetTop,
      left: node.offsetLeft,
      width: node.offsetWidth,
      height: node.offsetHeight
    };
  }

  if (types.indexOf('scroll') > -1) {
    calculations.scroll = {
      top: node.scrollTop,
      left: node.scrollLeft,
      width: node.scrollWidth,
      height: node.scrollHeight
    };
  }

  if (types.indexOf('bounds') > -1) {
    var rect = node.getBoundingClientRect();
    calculations.bounds = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  }

  if (types.indexOf('margin') > -1) {
    var styles = getComputedStyle(node);
    calculations.margin = {
      top: styles ? parseInt(styles.marginTop) : 0,
      right: styles ? parseInt(styles.marginRight) : 0,
      bottom: styles ? parseInt(styles.marginBottom) : 0,
      left: styles ? parseInt(styles.marginLeft) : 0
    };
  }

  return calculations;
}

/**
 * Returns the global window object associated with provided element.
 */
function getWindowOf(target) {
  // Assume that the element is an instance of Node, which means that it
  // has the "ownerDocument" property from which we can retrieve a
  // corresponding global object.
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local window object if it's not possible extract one from
  // provided element.

  return ownerGlobal || window;
}

function withContentRect(types) {
  return function (WrappedComponent) {
    var _class, _temp;

    return _temp = _class =
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(WithContentRect, _Component);

      function WithContentRect() {
        var _this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _Component.call.apply(_Component, [this].concat(args)) || this;
        _this.state = {
          contentRect: {
            entry: {},
            client: {},
            offset: {},
            scroll: {},
            bounds: {},
            margin: {}
          }
        };
        _this._animationFrameID = null;
        _this._resizeObserver = null;
        _this._node = null;
        _this._window = null;

        _this.measure = function (entries) {
          var contentRect = getContentRect(_this._node, types || getTypes(_this.props));

          if (entries) {
            contentRect.entry = entries[0].contentRect;
          }

          _this._animationFrameID = _this._window.requestAnimationFrame(function () {
            if (_this._resizeObserver !== null) {
              _this.setState({
                contentRect: contentRect
              });

              if (typeof _this.props.onResize === 'function') {
                _this.props.onResize(contentRect);
              }
            }
          });
        };

        _this._handleRef = function (node) {
          if (_this._resizeObserver !== null && _this._node !== null) {
            _this._resizeObserver.unobserve(_this._node);
          }

          _this._node = node;
          _this._window = getWindowOf(_this._node);
          var innerRef = _this.props.innerRef;

          if (innerRef) {
            if (typeof innerRef === 'function') {
              innerRef(_this._node);
            } else {
              innerRef.current = _this._node;
            }
          }

          if (_this._resizeObserver !== null && _this._node !== null) {
            _this._resizeObserver.observe(_this._node);
          }
        };

        return _this;
      }

      var _proto = WithContentRect.prototype;

      _proto.componentDidMount = function componentDidMount() {
        this._resizeObserver = this._window !== null && this._window.ResizeObserver ? new this._window.ResizeObserver(this.measure) : new index(this.measure);

        if (this._node !== null) {
          this._resizeObserver.observe(this._node);

          if (typeof this.props.onResize === 'function') {
            this.props.onResize(getContentRect(this._node, types || getTypes(this.props)));
          }
        }
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        if (this._window !== null) {
          this._window.cancelAnimationFrame(this._animationFrameID);
        }

        if (this._resizeObserver !== null) {
          this._resizeObserver.disconnect();

          this._resizeObserver = null;
        }
      };

      _proto.render = function render() {
        var _this$props = this.props,
            innerRef = _this$props.innerRef,
            onResize = _this$props.onResize,
            props = _objectWithoutPropertiesLoose(_this$props, ["innerRef", "onResize"]);

        return react.createElement(WrappedComponent, _extends({}, props, {
          measureRef: this._handleRef,
          measure: this.measure,
          contentRect: this.state.contentRect
        }));
      };

      return WithContentRect;
    }(react.Component), _class.propTypes = {
      client: propTypes.bool,
      offset: propTypes.bool,
      scroll: propTypes.bool,
      bounds: propTypes.bool,
      margin: propTypes.bool,
      innerRef: propTypes.oneOfType([propTypes.object, propTypes.func]),
      onResize: propTypes.func
    }, _temp;
  };
}

var Measure = withContentRect()(function (_ref) {
  var measure = _ref.measure,
      measureRef = _ref.measureRef,
      contentRect = _ref.contentRect,
      children = _ref.children;
  return children({
    measure: measure,
    measureRef: measureRef,
    contentRect: contentRect
  });
});
Measure.displayName = 'Measure';
Measure.propTypes.children = propTypes.func;

export default Measure;
