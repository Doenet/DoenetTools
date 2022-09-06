import { r as react } from '../common/index-56a88a1e.js';
import { r as reactDom } from '../common/index-c4ac9922.js';
import { _ as _register, T as TextCellType, B as BaseEditor, C as Core, r as rootInstanceSymbol, m as metaSchemaFactory, H as Hooks, d as dictionaryKeys, g as getLanguageDictionary, a as getLanguagesDictionaries, b as registerLanguageDictionary, c as getTranslatedPhrase } from '../common/textType-efb3269b.js';
import '../common/_commonjsHelpers-f5d70792.js';
import '../common/es.string.starts-with-24653f71.js';
import '../common/es.function.name-c5ad53e4.js';
import '../common/registry-1eaf3f7e.js';
import '../common/moment-82250e2c.js';

_register(TextCellType);
Handsontable.editors = {
  BaseEditor
};
function Handsontable(rootElement, userSettings) {
  var instance = new Core(rootElement, userSettings || {}, rootInstanceSymbol);
  instance.init();
  return instance;
}
Handsontable.Core = function(rootElement) {
  var userSettings = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return new Core(rootElement, userSettings, rootInstanceSymbol);
};
Handsontable.DefaultSettings = metaSchemaFactory();
Handsontable.hooks = Hooks.getSingleton();
Handsontable.packageName = "handsontable";
Handsontable.buildDate = "08/07/2022 15:24:08";
Handsontable.version = "12.1.2";
Handsontable.languages = {
  dictionaryKeys,
  getLanguageDictionary,
  getLanguagesDictionaries,
  registerLanguageDictionary,
  getTranslatedPhrase
};

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var bulkComponentContainer = null;
/**
 * Warning message for the `autoRowSize`/`autoColumnSize` compatibility check.
 */

var AUTOSIZE_WARNING = 'Your `HotTable` configuration includes `autoRowSize`/`autoColumnSize` options, which are not compatible with ' + ' the component-based renderers`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.';
/**
 * Message for the warning thrown if the Handsontable instance has been destroyed.
 */

var HOT_DESTROYED_WARNING = 'The Handsontable instance bound to this component was destroyed and cannot be' + ' used properly.';
/**
 * String identifier for the global-scoped editor components.
 */

var GLOBAL_EDITOR_SCOPE = 'global';
/**
 * Default classname given to the wrapper container.
 */

var DEFAULT_CLASSNAME = 'hot-wrapper-editor-container';
/**
 * Logs warn to the console if the `console` object is exposed.
 *
 * @param {...*} args Values which will be logged.
 */

function warn() {
  if (typeof console !== 'undefined') {
    var _console;

    (_console = console).warn.apply(_console, arguments);
  }
}
/**
 * Filter out and return elements of the provided `type` from the `HotColumn` component's children.
 *
 * @param {React.ReactNode} children HotTable children array.
 * @param {String} type Either `'hot-renderer'` or `'hot-editor'`.
 * @returns {Object|null} A child (React node) or `null`, if no child of that type was found.
 */

function getChildElementByType(children, type) {
  var childrenArray = react.Children.toArray(children);
  var childrenCount = react.Children.count(children);
  var wantedChild = null;

  if (childrenCount !== 0) {
    if (childrenCount === 1 && childrenArray[0].props[type]) {
      wantedChild = childrenArray[0];
    } else {
      wantedChild = childrenArray.find(function (child) {
        return child.props[type] !== void 0;
      });
    }
  }

  return wantedChild || null;
}
/**
 * Get the reference to the original editor class.
 *
 * @param {React.ReactElement} editorElement React element of the editor class.
 * @returns {Function} Original class of the editor component.
 */

function getOriginalEditorClass(editorElement) {
  if (!editorElement) {
    return null;
  }

  return editorElement.type.WrappedComponent ? editorElement.type.WrappedComponent : editorElement.type;
}
/**
 * Remove editor containers from DOM.
 *
 * @param {Document} [doc] Document to be used.
 * @param {Map} editorCache The editor cache reference.
 */

function removeEditorContainers() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  doc.querySelectorAll("[class^=\"".concat(DEFAULT_CLASSNAME, "\"]")).forEach(function (domNode) {
    if (domNode.parentNode) {
      domNode.parentNode.removeChild(domNode);
    }
  });
}
/**
 * Create an editor portal.
 *
 * @param {Document} [doc] Document to be used.
 * @param {React.ReactElement} editorElement Editor's element.
 * @param {Map} editorCache The editor cache reference.
 * @returns {React.ReactPortal} The portal for the editor.
 */

function createEditorPortal() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var editorElement = arguments.length > 1 ? arguments[1] : undefined;

  if (editorElement === null) {
    return;
  }

  var editorContainer = doc.createElement('DIV');

  var _getContainerAttribut = getContainerAttributesProps(editorElement.props, false),
      id = _getContainerAttribut.id,
      className = _getContainerAttribut.className,
      style = _getContainerAttribut.style;

  if (id) {
    editorContainer.id = id;
  }

  editorContainer.className = [DEFAULT_CLASSNAME, className].join(' ');

  if (style) {
    Object.assign(editorContainer.style, style);
  }

  doc.body.appendChild(editorContainer);
  return reactDom.createPortal(editorElement, editorContainer);
}
/**
 * Get an editor element extended with a instance-emitting method.
 *
 * @param {React.ReactNode} children Component children.
 * @param {Map} editorCache Component's editor cache.
 * @param {string|number} [editorColumnScope] The editor scope (column index or a 'global' string). Defaults to
 * 'global'.
 * @returns {React.ReactElement} An editor element containing the additional methods.
 */

function getExtendedEditorElement(children, editorCache) {
  var editorColumnScope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GLOBAL_EDITOR_SCOPE;
  var editorElement = getChildElementByType(children, 'hot-editor');
  var editorClass = getOriginalEditorClass(editorElement);

  if (!editorElement) {
    return null;
  }

  return react.cloneElement(editorElement, {
    emitEditorInstance: function emitEditorInstance(editorInstance, editorColumnScope) {
      if (!editorCache.get(editorClass)) {
        editorCache.set(editorClass, new Map());
      }

      var cacheEntry = editorCache.get(editorClass);
      cacheEntry.set(editorColumnScope !== null && editorColumnScope !== void 0 ? editorColumnScope : GLOBAL_EDITOR_SCOPE, editorInstance);
    },
    editorColumnScope: editorColumnScope,
    isEditor: true
  });
}
/**
 * Create a react component and render it to an external DOM done.
 *
 * @param {React.ReactElement} rElement React element to be used as a base for the component.
 * @param {Object} props Props to be passed to the cloned element.
 * @param {Function} callback Callback to be called after the component has been mounted.
 * @param {Document} [ownerDocument] The owner document to set the portal up into.
 * @returns {{portal: React.ReactPortal, portalContainer: HTMLElement}} An object containing the portal and its container.
 */

function createPortal(rElement, props, callback) {
  var ownerDocument = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document;

  if (!ownerDocument) {
    ownerDocument = document;
  }

  if (!bulkComponentContainer) {
    bulkComponentContainer = ownerDocument.createDocumentFragment();
  }

  var portalContainer = ownerDocument.createElement('DIV');
  bulkComponentContainer.appendChild(portalContainer);
  var extendedRendererElement = react.cloneElement(rElement, _objectSpread2({
    key: "".concat(props.row, "-").concat(props.col)
  }, props));
  return {
    portal: reactDom.createPortal(extendedRendererElement, portalContainer, "".concat(props.row, "-").concat(props.col, "-").concat(Math.random())),
    portalContainer: portalContainer
  };
}
/**
 * Get an object containing the `id`, `className` and `style` keys, representing the corresponding props passed to the
 * component.
 *
 * @param {Object} props Object containing the react element props.
 * @param {Boolean} randomizeId If set to `true`, the function will randomize the `id` property when no `id` was present in the `prop` object.
 * @returns An object containing the `id`, `className` and `style` keys, representing the corresponding props passed to the
 * component.
 */

function getContainerAttributesProps(props) {
  var randomizeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return {
    id: props.id || (randomizeId ? 'hot-' + Math.random().toString(36).substring(5) : void 0),
    className: props.className || '',
    style: props.style || {}
  };
}
/**
 * Add the `UNSAFE_` prefixes to the deprecated lifecycle methods for React >= 16.3.
 *
 * @param {Object} instance Instance to have the methods renamed.
 */

function addUnsafePrefixes(instance) {
  var reactSemverArray = react.version.split('.').map(function (v) {
    return parseInt(v);
  });
  var shouldPrefix = reactSemverArray[0] >= 16 && reactSemverArray[1] >= 3 || reactSemverArray[0] >= 17;

  if (shouldPrefix) {
    instance.UNSAFE_componentWillUpdate = instance.componentWillUpdate;
    instance.componentWillUpdate = void 0;
    instance.UNSAFE_componentWillMount = instance.componentWillMount;
    instance.componentWillMount = void 0;
  }
}

var SettingsMapper = /*#__PURE__*/function () {
  function SettingsMapper() {
    _classCallCheck(this, SettingsMapper);
  }

  _createClass(SettingsMapper, null, [{
    key: "getSettings",
    value:
    /**
     * Parse component settings into Handosntable-compatible settings.
     *
     * @param {Object} properties Object containing properties from the HotTable object.
     * @returns {Object} Handsontable-compatible settings object.
     */
    function getSettings(properties) {
      var newSettings = {};

      if (properties.settings) {
        var settings = properties.settings;

        for (var key in settings) {
          if (settings.hasOwnProperty(key)) {
            newSettings[key] = settings[key];
          }
        }
      }

      for (var _key in properties) {
        if (_key !== 'settings' && _key !== 'children' && properties.hasOwnProperty(_key)) {
          newSettings[_key] = properties[_key];
        }
      }

      return newSettings;
    }
  }]);

  return SettingsMapper;
}();

var HotColumn = /*#__PURE__*/function (_React$Component) {
  _inherits(HotColumn, _React$Component);

  var _super = _createSuper(HotColumn);

  /**
   * HotColumn class constructor.
   *
   * @param {HotColumnProps} props Component props.
   * @param {*} [context] Component context.
   */
  function HotColumn(props, context) {
    var _this;

    _classCallCheck(this, HotColumn);

    _this = _super.call(this, props, context);
    /**
     * Local editor portal cache.
     *
     * @private
     * @type {ReactPortal}
     */

    _this.localEditorPortal = null;
    addUnsafePrefixes(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Get the local editor portal cache property.
   *
   * @return {ReactPortal} Local editor portal.
   */


  _createClass(HotColumn, [{
    key: "getLocalEditorPortal",
    value: function getLocalEditorPortal() {
      return this.localEditorPortal;
    }
    /**
     * Set the local editor portal cache property.
     *
     * @param {ReactPortal} portal Local editor portal.
     */

  }, {
    key: "setLocalEditorPortal",
    value: function setLocalEditorPortal(portal) {
      this.localEditorPortal = portal;
    }
    /**
     * Filter out all the internal properties and return an object with just the Handsontable-related props.
     *
     * @returns {Object}
     */

  }, {
    key: "getSettingsProps",
    value: function getSettingsProps() {
      var _this2 = this;

      this.internalProps = ['__componentRendererColumns', '_emitColumnSettings', '_columnIndex', '_getChildElementByType', '_getRendererWrapper', '_getEditorClass', '_getEditorCache', '_getOwnerDocument', 'hot-renderer', 'hot-editor', 'children'];
      return Object.keys(this.props).filter(function (key) {
        return !_this2.internalProps.includes(key);
      }).reduce(function (obj, key) {
        obj[key] = _this2.props[key];
        return obj;
      }, {});
    }
    /**
     * Check whether the HotColumn component contains a provided prop.
     *
     * @param {String} propName Property name.
     * @returns {Boolean}
     */

  }, {
    key: "hasProp",
    value: function hasProp(propName) {
      return !!this.props[propName];
    }
    /**
     * Get the editor element for the current column.
     *
     * @returns {React.ReactElement} React editor component element.
     */

  }, {
    key: "getLocalEditorElement",
    value: function getLocalEditorElement() {
      return getExtendedEditorElement(this.props.children, this.props._getEditorCache(), this.props._columnIndex);
    }
    /**
     * Create the column settings based on the data provided to the `HotColumn` component and it's child components.
     */

  }, {
    key: "createColumnSettings",
    value: function createColumnSettings() {
      var rendererElement = this.props._getChildElementByType(this.props.children, 'hot-renderer');

      var editorElement = this.getLocalEditorElement();
      this.columnSettings = SettingsMapper.getSettings(this.getSettingsProps());

      if (rendererElement !== null) {
        this.columnSettings.renderer = this.props._getRendererWrapper(rendererElement);

        this.props._componentRendererColumns.set(this.props._columnIndex, true);
      } else if (this.hasProp('renderer')) {
        this.columnSettings.renderer = this.props.renderer;
      } else {
        this.columnSettings.renderer = void 0;
      }

      if (editorElement !== null) {
        this.columnSettings.editor = this.props._getEditorClass(editorElement, this.props._columnIndex);
      } else if (this.hasProp('editor')) {
        this.columnSettings.editor = this.props.editor;
      } else {
        this.columnSettings.editor = void 0;
      }
    }
    /**
     * Create the local editor portal and its destination HTML element if needed.
     *
     * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
     */

  }, {
    key: "createLocalEditorPortal",
    value: function createLocalEditorPortal() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;

      var editorCache = this.props._getEditorCache();

      var localEditorElement = getExtendedEditorElement(children, editorCache, this.props._columnIndex);

      if (localEditorElement) {
        this.setLocalEditorPortal(createEditorPortal(this.props._getOwnerDocument(), localEditorElement, editorCache));
      }
    }
    /**
     * Emit the column settings to the parent using a prop passed from the parent.
     */

  }, {
    key: "emitColumnSettings",
    value: function emitColumnSettings() {
      this.props._emitColumnSettings(this.columnSettings, this.props._columnIndex);
    }
    /*
    ---------------------------------------
    ------- React lifecycle methods -------
    ---------------------------------------
    */

    /**
     * Logic performed before the mounting of the HotColumn component.
     */

  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.createLocalEditorPortal();
    }
    /**
     * Logic performed after the mounting of the HotColumn component.
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createColumnSettings();
      this.emitColumnSettings();
    }
    /**
     * Logic performed before the updating of the HotColumn component.
     */

  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState, nextContext) {
      this.createLocalEditorPortal(nextProps.children);
    }
    /**
     * Logic performed after the updating of the HotColumn component.
     */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.createColumnSettings();
      this.emitColumnSettings();
    }
    /**
     * Render the portals of the editors, if there are any.
     *
     * @returns {React.ReactElement}
     */

  }, {
    key: "render",
    value: function render() {
      return react.createElement(react.Fragment, null, this.getLocalEditorPortal());
    }
  }]);

  return HotColumn;
}(react.Component);

/**
 * Component class used to manage the renderer component portals.
 */

var PortalManager = /*#__PURE__*/function (_React$Component) {
  _inherits(PortalManager, _React$Component);

  var _super = _createSuper(PortalManager);

  function PortalManager(props) {
    var _this;

    _classCallCheck(this, PortalManager);

    _this = _super.call(this, props);
    _this.state = {
      portals: []
    };
    return _this;
  }

  _createClass(PortalManager, [{
    key: "render",
    value: function render() {
      return react.createElement(react.Fragment, null, this.state.portals);
    }
  }]);

  return PortalManager;
}(react.Component);

var version="12.1.2";

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b = "function" === typeof Symbol && Symbol["for"],
    c = b ? Symbol["for"]("react.element") : 60103,
    d = b ? Symbol["for"]("react.portal") : 60106,
    e = b ? Symbol["for"]("react.fragment") : 60107,
    f = b ? Symbol["for"]("react.strict_mode") : 60108,
    g = b ? Symbol["for"]("react.profiler") : 60114,
    h = b ? Symbol["for"]("react.provider") : 60109,
    k = b ? Symbol["for"]("react.context") : 60110,
    l = b ? Symbol["for"]("react.async_mode") : 60111,
    m = b ? Symbol["for"]("react.concurrent_mode") : 60111,
    n = b ? Symbol["for"]("react.forward_ref") : 60112,
    p = b ? Symbol["for"]("react.suspense") : 60113,
    q = b ? Symbol["for"]("react.suspense_list") : 60120,
    r = b ? Symbol["for"]("react.memo") : 60115,
    t = b ? Symbol["for"]("react.lazy") : 60116,
    v = b ? Symbol["for"]("react.block") : 60121,
    w = b ? Symbol["for"]("react.fundamental") : 60117,
    x = b ? Symbol["for"]("react.responder") : 60118,
    y = b ? Symbol["for"]("react.scope") : 60119;

function z(a) {
  if ("object" === _typeof(a) && null !== a) {
    var u = a.$$typeof;

    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;

          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;

              default:
                return u;
            }

        }

      case d:
        return u;
    }
  }
}

function A(a) {
  return z(a) === m;
}

var AsyncMode = l;
var ConcurrentMode = m;
var ContextConsumer = k;
var ContextProvider = h;
var Element = c;
var ForwardRef = n;
var Fragment = e;
var Lazy = t;
var Memo = r;
var Portal = d;
var Profiler = g;
var StrictMode = f;
var Suspense = p;

var isAsyncMode = function isAsyncMode(a) {
  return A(a) || z(a) === l;
};

var isConcurrentMode = A;

var isContextConsumer = function isContextConsumer(a) {
  return z(a) === k;
};

var isContextProvider = function isContextProvider(a) {
  return z(a) === h;
};

var isElement = function isElement(a) {
  return "object" === _typeof(a) && null !== a && a.$$typeof === c;
};

var isForwardRef = function isForwardRef(a) {
  return z(a) === n;
};

var isFragment = function isFragment(a) {
  return z(a) === e;
};

var isLazy = function isLazy(a) {
  return z(a) === t;
};

var isMemo = function isMemo(a) {
  return z(a) === r;
};

var isPortal = function isPortal(a) {
  return z(a) === d;
};

var isProfiler = function isProfiler(a) {
  return z(a) === g;
};

var isStrictMode = function isStrictMode(a) {
  return z(a) === f;
};

var isSuspense = function isSuspense(a) {
  return z(a) === p;
};

var isValidElementType = function isValidElementType(a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === _typeof(a) && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};

var typeOf = z;
var reactIs_production_min = {
  AsyncMode: AsyncMode,
  ConcurrentMode: ConcurrentMode,
  ContextConsumer: ContextConsumer,
  ContextProvider: ContextProvider,
  Element: Element,
  ForwardRef: ForwardRef,
  Fragment: Fragment,
  Lazy: Lazy,
  Memo: Memo,
  Portal: Portal,
  Profiler: Profiler,
  StrictMode: StrictMode,
  Suspense: Suspense,
  isAsyncMode: isAsyncMode,
  isConcurrentMode: isConcurrentMode,
  isContextConsumer: isContextConsumer,
  isContextProvider: isContextProvider,
  isElement: isElement,
  isForwardRef: isForwardRef,
  isFragment: isFragment,
  isLazy: isLazy,
  isMemo: isMemo,
  isPortal: isPortal,
  isProfiler: isProfiler,
  isStrictMode: isStrictMode,
  isSuspense: isSuspense,
  isValidElementType: isValidElementType,
  typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {
});
reactIs_development.AsyncMode;
reactIs_development.ConcurrentMode;
reactIs_development.ContextConsumer;
reactIs_development.ContextProvider;
reactIs_development.Element;
reactIs_development.ForwardRef;
reactIs_development.Fragment;
reactIs_development.Lazy;
reactIs_development.Memo;
reactIs_development.Portal;
reactIs_development.Profiler;
reactIs_development.StrictMode;
reactIs_development.Suspense;
reactIs_development.isAsyncMode;
reactIs_development.isConcurrentMode;
reactIs_development.isContextConsumer;
reactIs_development.isContextProvider;
reactIs_development.isElement;
reactIs_development.isForwardRef;
reactIs_development.isFragment;
reactIs_development.isLazy;
reactIs_development.isMemo;
reactIs_development.isPortal;
reactIs_development.isProfiler;
reactIs_development.isStrictMode;
reactIs_development.isSuspense;
reactIs_development.isValidElementType;
reactIs_development.typeOf;

var reactIs = createCommonjsModule(function (module) {

  {
    module.exports = reactIs_production_min;
  }
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);

function emptyFunction() {}

function emptyFunctionWithReset() {}

emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function factoryWithThrowingShims() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }

    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
    err.name = 'Invariant Violation';
    throw err;
  }
  shim.isRequired = shim;

  function getShim() {
    return shim;
  }
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.

  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
});
var PropTypes = propTypes;

/**
 * A Handsontable-ReactJS wrapper.
 *
 * To implement, use the `HotTable` tag with properties corresponding to Handsontable options.
 * For example:
 *
 * ```js
 * <HotTable id="hot" data={dataObject} contextMenu={true} colHeaders={true} width={600} height={300} stretchH="all" />
 *
 * // is analogous to
 * let hot = new Handsontable(document.getElementById('hot'), {
 *    data: dataObject,
 *    contextMenu: true,
 *    colHeaders: true,
 *    width: 600
 *    height: 300
 * });
 *
 * ```
 *
 * @class HotTable
 */

var HotTable = /*#__PURE__*/function (_React$Component) {
  _inherits(HotTable, _React$Component);

  var _super = _createSuper(HotTable);

  /**
   * HotTable class constructor.
   *
   * @param {HotTableProps} props Component props.
   * @param {*} [context] Component context.
   */
  function HotTable(props, context) {
    var _this;

    _classCallCheck(this, HotTable);

    _this = _super.call(this, props, context);
    /**
     * The `id` of the main Handsontable DOM element.
     *
     * @type {String}
     */

    _this.id = null;
    /**
     * Reference to the Handsontable instance.
     *
     * @private
     * @type {Object}
     */

    _this.__hotInstance = null;
    /**
     * Reference to the main Handsontable DOM element.
     *
     * @type {HTMLElement}
     */

    _this.hotElementRef = null;
    /**
     * Array of object containing the column settings.
     *
     * @type {Array}
     */

    _this.columnSettings = [];
    /**
     * Component used to manage the renderer portals.
     *
     * @type {React.Component}
     */

    _this.portalManager = null;
    /**
     * Array containing the portals cashed to be rendered in bulk after Handsontable's render cycle.
     */

    _this.portalCacheArray = [];
    /**
     * Global editor portal cache.
     *
     * @private
     * @type {React.ReactPortal}
     */

    _this.globalEditorPortal = null;
    /**
     * The rendered cells cache.
     *
     * @private
     * @type {Map}
     */

    _this.renderedCellCache = new Map();
    /**
     * Editor cache.
     *
     * @private
     * @type {Map}
     */

    _this.editorCache = new Map();
    /**
     * Map with column indexes (or a string = 'global') as keys, and booleans as values. Each key represents a component-based editor
     * declared for the used column index, or a global one, if the key is the `global` string.
     *
     * @private
     * @type {Map}
     */

    _this.componentRendererColumns = new Map();
    addUnsafePrefixes(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Package version getter.
   *
   * @returns The version number of the package.
   */


  _createClass(HotTable, [{
    key: "hotInstance",
    get:
    /**
     * Getter for the property storing the Handsontable instance.
     */
    function get() {
      if (!this.__hotInstance || this.__hotInstance && !this.__hotInstance.isDestroyed) {
        // Will return the Handsontable instance or `null` if it's not yet been created.
        return this.__hotInstance;
      } else {
        console.warn(HOT_DESTROYED_WARNING);
        return null;
      }
    }
    /**
     * Setter for the property storing the Handsontable instance.
     * @param {Handsontable} hotInstance The Handsontable instance.
     */
    ,
    set: function set(hotInstance) {
      this.__hotInstance = hotInstance;
    }
    /**
     * Get the rendered table cell cache.
     *
     * @returns {Map}
     */

  }, {
    key: "getRenderedCellCache",
    value: function getRenderedCellCache() {
      return this.renderedCellCache;
    }
    /**
     * Get the editor cache and return it.
     *
     * @returns {Map}
     */

  }, {
    key: "getEditorCache",
    value: function getEditorCache() {
      return this.editorCache;
    }
    /**
     * Get the global editor portal property.
     *
     * @return {React.ReactPortal} The global editor portal.
     */

  }, {
    key: "getGlobalEditorPortal",
    value: function getGlobalEditorPortal() {
      return this.globalEditorPortal;
    }
    /**
     * Set the private editor portal cache property.
     *
     * @param {React.ReactPortal} portal Global editor portal.
     */

  }, {
    key: "setGlobalEditorPortal",
    value: function setGlobalEditorPortal(portal) {
      this.globalEditorPortal = portal;
    }
    /**
     * Clear both the editor and the renderer cache.
     */

  }, {
    key: "clearCache",
    value: function clearCache() {
      var renderedCellCache = this.getRenderedCellCache();
      this.setGlobalEditorPortal(null);
      removeEditorContainers(this.getOwnerDocument());
      this.getEditorCache().clear();
      renderedCellCache.clear();
      this.componentRendererColumns.clear();
    }
    /**
     * Get the `Document` object corresponding to the main component element.
     *
     * @returns The `Document` object used by the component.
     */

  }, {
    key: "getOwnerDocument",
    value: function getOwnerDocument() {
      return this.hotElementRef ? this.hotElementRef.ownerDocument : document;
    }
    /**
     * Set the reference to the main Handsontable DOM element.
     *
     * @param {HTMLElement} element The main Handsontable DOM element.
     */

  }, {
    key: "setHotElementRef",
    value: function setHotElementRef(element) {
      this.hotElementRef = element;
    }
    /**
     * Return a renderer wrapper function for the provided renderer component.
     *
     * @param {React.ReactElement} rendererElement React renderer component.
     * @returns {Handsontable.renderers.Base} The Handsontable rendering function.
     */

  }, {
    key: "getRendererWrapper",
    value: function getRendererWrapper(rendererElement) {
      var hotTableComponent = this;
      return function (instance, TD, row, col, prop, value, cellProperties) {
        var renderedCellCache = hotTableComponent.getRenderedCellCache();

        if (renderedCellCache.has("".concat(row, "-").concat(col))) {
          TD.innerHTML = renderedCellCache.get("".concat(row, "-").concat(col)).innerHTML;
        }

        if (TD && !TD.getAttribute('ghost-table')) {
          var _createPortal = createPortal(rendererElement, {
            TD: TD,
            row: row,
            col: col,
            prop: prop,
            value: value,
            cellProperties: cellProperties,
            isRenderer: true
          }, function () {}, TD.ownerDocument),
              portal = _createPortal.portal,
              portalContainer = _createPortal.portalContainer;

          while (TD.firstChild) {
            TD.removeChild(TD.firstChild);
          }

          TD.appendChild(portalContainer);
          hotTableComponent.portalCacheArray.push(portal);
        }

        renderedCellCache.set("".concat(row, "-").concat(col), TD);
        return TD;
      };
    }
    /**
     * Create a fresh class to be used as an editor, based on the provided editor React element.
     *
     * @param {React.ReactElement} editorElement React editor component.
     * @param {string|number} [editorColumnScope] The editor scope (column index or a 'global' string). Defaults to
     * 'global'.
     * @returns {Function} A class to be passed to the Handsontable editor settings.
     */

  }, {
    key: "getEditorClass",
    value: function getEditorClass(editorElement) {
      var _editorCache$get;

      var editorColumnScope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : GLOBAL_EDITOR_SCOPE;
      var editorClass = getOriginalEditorClass(editorElement);
      var editorCache = this.getEditorCache();
      var cachedComponent = (_editorCache$get = editorCache.get(editorClass)) === null || _editorCache$get === void 0 ? void 0 : _editorCache$get.get(editorColumnScope);
      return this.makeEditorClass(cachedComponent);
    }
    /**
     * Create a class to be passed to the Handsontable's settings.
     *
     * @param {React.ReactElement} editorComponent React editor component.
     * @returns {Function} A class to be passed to the Handsontable editor settings.
     */

  }, {
    key: "makeEditorClass",
    value: function makeEditorClass(editorComponent) {
      var customEditorClass = /*#__PURE__*/function (_Handsontable$editors) {
        _inherits(CustomEditor, _Handsontable$editors);

        var _super2 = _createSuper(CustomEditor);

        function CustomEditor(hotInstance) {
          var _this2;

          _classCallCheck(this, CustomEditor);

          _this2 = _super2.call(this, hotInstance);
          editorComponent.hotCustomEditorInstance = _assertThisInitialized(_this2);
          _this2.editorComponent = editorComponent;
          return _this2;
        }

        _createClass(CustomEditor, [{
          key: "focus",
          value: function focus() {}
        }, {
          key: "getValue",
          value: function getValue() {}
        }, {
          key: "setValue",
          value: function setValue() {}
        }, {
          key: "open",
          value: function open() {}
        }, {
          key: "close",
          value: function close() {}
        }]);

        return CustomEditor;
      }(Handsontable.editors.BaseEditor); // Fill with the rest of the BaseEditor methods


      Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(function (propName) {
        if (propName === 'constructor') {
          return;
        }

        customEditorClass.prototype[propName] = function () {
          var _editorComponent$prop;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_editorComponent$prop = editorComponent[propName]).call.apply(_editorComponent$prop, [editorComponent].concat(args));
        };
      });
      return customEditorClass;
    }
    /**
     * Get the renderer element for the entire HotTable instance.
     *
     * @returns {React.ReactElement} React renderer component element.
     */

  }, {
    key: "getGlobalRendererElement",
    value: function getGlobalRendererElement() {
      var hotTableSlots = this.props.children;
      return getChildElementByType(hotTableSlots, 'hot-renderer');
    }
    /**
     * Get the editor element for the entire HotTable instance.
     *
     * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
     * @returns {React.ReactElement} React editor component element.
     */

  }, {
    key: "getGlobalEditorElement",
    value: function getGlobalEditorElement() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
      return getExtendedEditorElement(children, this.getEditorCache());
    }
    /**
     * Create the global editor portal and its destination HTML element if needed.
     *
     * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
     */

  }, {
    key: "createGlobalEditorPortal",
    value: function createGlobalEditorPortal() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
      var globalEditorElement = this.getGlobalEditorElement(children);

      if (globalEditorElement) {
        this.setGlobalEditorPortal(createEditorPortal(this.getOwnerDocument(), globalEditorElement, this.getEditorCache()));
      }
    }
    /**
     * Create a new settings object containing the column settings and global editors and renderers.
     *
     * @returns {Handsontable.GridSettings} New global set of settings for Handsontable.
     */

  }, {
    key: "createNewGlobalSettings",
    value: function createNewGlobalSettings() {
      var newSettings = SettingsMapper.getSettings(this.props);
      var globalRendererNode = this.getGlobalRendererElement();
      var globalEditorNode = this.getGlobalEditorElement();
      newSettings.columns = this.columnSettings.length ? this.columnSettings : newSettings.columns;

      if (globalEditorNode) {
        newSettings.editor = this.getEditorClass(globalEditorNode, GLOBAL_EDITOR_SCOPE);
      } else {
        newSettings.editor = this.props.editor || (this.props.settings ? this.props.settings.editor : void 0);
      }

      if (globalRendererNode) {
        newSettings.renderer = this.getRendererWrapper(globalRendererNode);
        this.componentRendererColumns.set('global', true);
      } else {
        newSettings.renderer = this.props.renderer || (this.props.settings ? this.props.settings.renderer : void 0);
      }

      return newSettings;
    }
    /**
     * Detect if `autoRowSize` or `autoColumnSize` is defined, and if so, throw an incompatibility warning.
     *
     * @param {Handsontable.GridSettings} newGlobalSettings New global settings passed as Handsontable config.
     */

  }, {
    key: "displayAutoSizeWarning",
    value: function displayAutoSizeWarning(newGlobalSettings) {
      var _this$hotInstance$get, _this$hotInstance$get2;

      if (this.hotInstance && ((_this$hotInstance$get = this.hotInstance.getPlugin('autoRowSize')) !== null && _this$hotInstance$get !== void 0 && _this$hotInstance$get.enabled || (_this$hotInstance$get2 = this.hotInstance.getPlugin('autoColumnSize')) !== null && _this$hotInstance$get2 !== void 0 && _this$hotInstance$get2.enabled)) {
        if (this.componentRendererColumns.size > 0) {
          warn(AUTOSIZE_WARNING);
        }
      }
    }
    /**
     * Sets the column settings based on information received from HotColumn.
     *
     * @param {HotTableProps} columnSettings Column settings object.
     * @param {Number} columnIndex Column index.
     */

  }, {
    key: "setHotColumnSettings",
    value: function setHotColumnSettings(columnSettings, columnIndex) {
      this.columnSettings[columnIndex] = columnSettings;
    }
    /**
     * Handsontable's `beforeViewRender` hook callback.
     */

  }, {
    key: "handsontableBeforeViewRender",
    value: function handsontableBeforeViewRender() {
      this.getRenderedCellCache().clear();
    }
    /**
     * Handsontable's `afterViewRender` hook callback.
     */

  }, {
    key: "handsontableAfterViewRender",
    value: function handsontableAfterViewRender() {
      var _this3 = this;

      this.portalManager.setState(function () {
        return Object.assign({}, {
          portals: _this3.portalCacheArray
        });
      }, function () {
        _this3.portalCacheArray.length = 0;
      });
    }
    /**
     * Call the `updateSettings` method for the Handsontable instance.
     *
     * @param {Object} newSettings The settings object.
     */

  }, {
    key: "updateHot",
    value: function updateHot(newSettings) {
      if (this.hotInstance) {
        this.hotInstance.updateSettings(newSettings, false);
      }
    }
    /**
     * Set the portal manager ref.
     *
     * @param {React.ReactComponent} pmComponent The PortalManager component.
     */

  }, {
    key: "setPortalManagerRef",
    value: function setPortalManagerRef(pmComponent) {
      this.portalManager = pmComponent;
    }
    /*
    ---------------------------------------
    ------- React lifecycle methods -------
    ---------------------------------------
    */

    /**
     * Logic performed before the mounting of the component.
     */

  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.clearCache();
      this.createGlobalEditorPortal();
    }
    /**
     * Initialize Handsontable after the component has mounted.
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var hotTableComponent = this;
      var newGlobalSettings = this.createNewGlobalSettings();
      this.hotInstance = new Handsontable.Core(this.hotElementRef, newGlobalSettings);
      this.hotInstance.addHook('beforeViewRender', function (isForced) {
        hotTableComponent.handsontableBeforeViewRender();
      });
      this.hotInstance.addHook('afterViewRender', function () {
        hotTableComponent.handsontableAfterViewRender();
      }); // `init` missing in Handsontable's type definitions.

      this.hotInstance.init();
      this.displayAutoSizeWarning(newGlobalSettings);
    }
    /**
     * Logic performed before the component update.
     */

  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState, nextContext) {
      this.clearCache();
      removeEditorContainers(this.getOwnerDocument());
      this.createGlobalEditorPortal(nextProps.children);
    }
    /**
     * Logic performed after the component update.
     */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var newGlobalSettings = this.createNewGlobalSettings();
      this.updateHot(newGlobalSettings);
      this.displayAutoSizeWarning(newGlobalSettings);
    }
    /**
     * Destroy the Handsontable instance when the parent component unmounts.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.hotInstance) {
        this.hotInstance.destroy();
      }

      removeEditorContainers(this.getOwnerDocument());
    }
    /**
     * Render the component.
     */

  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _getContainerAttribut = getContainerAttributesProps(this.props),
          id = _getContainerAttribut.id,
          className = _getContainerAttribut.className,
          style = _getContainerAttribut.style;

      var isHotColumn = function isHotColumn(childNode) {
        return childNode.type === HotColumn;
      };

      var children = react.Children.toArray(this.props.children); // filter out anything that's not a HotColumn

      children = children.filter(function (childNode) {
        return isHotColumn(childNode);
      }); // clone the HotColumn nodes and extend them with the callbacks

      var childClones = children.map(function (childNode, columnIndex) {
        return react.cloneElement(childNode, {
          _componentRendererColumns: _this4.componentRendererColumns,
          _emitColumnSettings: _this4.setHotColumnSettings.bind(_this4),
          _columnIndex: columnIndex,
          _getChildElementByType: getChildElementByType.bind(_this4),
          _getRendererWrapper: _this4.getRendererWrapper.bind(_this4),
          _getEditorClass: _this4.getEditorClass.bind(_this4),
          _getOwnerDocument: _this4.getOwnerDocument.bind(_this4),
          _getEditorCache: _this4.getEditorCache.bind(_this4),
          children: childNode.props.children
        });
      }); // add the global editor to the list of children

      childClones.push(this.getGlobalEditorPortal());
      return react.createElement(react.Fragment, null, react.createElement("div", {
        ref: this.setHotElementRef.bind(this),
        id: id,
        className: className,
        style: style
      }, childClones), react.createElement(PortalManager, {
        ref: this.setPortalManagerRef.bind(this)
      }));
    }
  }], [{
    key: "version",
    get: function get() {
      return version;
    }
  }]);

  return HotTable;
}(react.Component);
/**
 * Prop types to be checked at runtime.
 */


HotTable.propTypes = {
  style: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string
};

var BaseEditorComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(BaseEditorComponent, _React$Component);

  var _super = _createSuper(BaseEditorComponent);

  function BaseEditorComponent(props) {
    var _this;

    _classCallCheck(this, BaseEditorComponent);

    _this = _super.call(this, props);
    _this.name = 'BaseEditorComponent';
    _this.instance = null;
    _this.row = null;
    _this.col = null;
    _this.prop = null;
    _this.TD = null;
    _this.originalValue = null;
    _this.cellProperties = null;
    _this.state = null;
    _this.hotInstance = null;
    _this.hotCustomEditorInstance = null;
    _this.hot = null;

    if (props.emitEditorInstance) {
      props.emitEditorInstance(_assertThisInitialized(_this), props.editorColumnScope);
    }

    return _this;
  } // BaseEditor methods:


  _createClass(BaseEditorComponent, [{
    key: "_fireCallbacks",
    value: function _fireCallbacks() {
      var _Handsontable$editors;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_Handsontable$editors = Handsontable.editors.BaseEditor.prototype._fireCallbacks).call.apply(_Handsontable$editors, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "beginEditing",
    value: function beginEditing() {
      var _Handsontable$editors2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_Handsontable$editors2 = Handsontable.editors.BaseEditor.prototype.beginEditing).call.apply(_Handsontable$editors2, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "cancelChanges",
    value: function cancelChanges() {
      var _Handsontable$editors3;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return (_Handsontable$editors3 = Handsontable.editors.BaseEditor.prototype.cancelChanges).call.apply(_Handsontable$editors3, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "checkEditorSection",
    value: function checkEditorSection() {
      var _Handsontable$editors4;

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return (_Handsontable$editors4 = Handsontable.editors.BaseEditor.prototype.checkEditorSection).call.apply(_Handsontable$editors4, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "close",
    value: function close() {
      var _Handsontable$editors5;

      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return (_Handsontable$editors5 = Handsontable.editors.BaseEditor.prototype.close).call.apply(_Handsontable$editors5, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "discardEditor",
    value: function discardEditor() {
      var _Handsontable$editors6;

      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return (_Handsontable$editors6 = Handsontable.editors.BaseEditor.prototype.discardEditor).call.apply(_Handsontable$editors6, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "enableFullEditMode",
    value: function enableFullEditMode() {
      var _Handsontable$editors7;

      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return (_Handsontable$editors7 = Handsontable.editors.BaseEditor.prototype.enableFullEditMode).call.apply(_Handsontable$editors7, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "extend",
    value: function extend() {
      var _Handsontable$editors8;

      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return (_Handsontable$editors8 = Handsontable.editors.BaseEditor.prototype.extend).call.apply(_Handsontable$editors8, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "finishEditing",
    value: function finishEditing() {
      var _Handsontable$editors9;

      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      return (_Handsontable$editors9 = Handsontable.editors.BaseEditor.prototype.finishEditing).call.apply(_Handsontable$editors9, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "focus",
    value: function focus() {
      var _Handsontable$editors10;

      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      return (_Handsontable$editors10 = Handsontable.editors.BaseEditor.prototype.focus).call.apply(_Handsontable$editors10, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var _Handsontable$editors11;

      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      return (_Handsontable$editors11 = Handsontable.editors.BaseEditor.prototype.getValue).call.apply(_Handsontable$editors11, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "init",
    value: function init() {
      var _Handsontable$editors12;

      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      return (_Handsontable$editors12 = Handsontable.editors.BaseEditor.prototype.init).call.apply(_Handsontable$editors12, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isInFullEditMode",
    value: function isInFullEditMode() {
      var _Handsontable$editors13;

      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      return (_Handsontable$editors13 = Handsontable.editors.BaseEditor.prototype.isInFullEditMode).call.apply(_Handsontable$editors13, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isOpened",
    value: function isOpened() {
      var _Handsontable$editors14;

      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      return (_Handsontable$editors14 = Handsontable.editors.BaseEditor.prototype.isOpened).call.apply(_Handsontable$editors14, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isWaiting",
    value: function isWaiting() {
      var _Handsontable$editors15;

      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      return (_Handsontable$editors15 = Handsontable.editors.BaseEditor.prototype.isWaiting).call.apply(_Handsontable$editors15, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "open",
    value: function open() {
      var _Handsontable$editors16;

      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      return (_Handsontable$editors16 = Handsontable.editors.BaseEditor.prototype.open).call.apply(_Handsontable$editors16, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "prepare",
    value: function prepare(row, col, prop, TD, originalValue, cellProperties) {
      this.hotInstance = cellProperties.instance;
      this.row = row;
      this.col = col;
      this.prop = prop;
      this.TD = TD;
      this.originalValue = originalValue;
      this.cellProperties = cellProperties;
      return Handsontable.editors.BaseEditor.prototype.prepare.call(this.hotCustomEditorInstance, row, col, prop, TD, originalValue, cellProperties);
    }
  }, {
    key: "saveValue",
    value: function saveValue() {
      var _Handsontable$editors17;

      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }

      return (_Handsontable$editors17 = Handsontable.editors.BaseEditor.prototype.saveValue).call.apply(_Handsontable$editors17, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "setValue",
    value: function setValue() {
      var _Handsontable$editors18;

      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }

      return (_Handsontable$editors18 = Handsontable.editors.BaseEditor.prototype.setValue).call.apply(_Handsontable$editors18, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "addHook",
    value: function addHook() {
      var _Handsontable$editors19;

      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }

      return (_Handsontable$editors19 = Handsontable.editors.BaseEditor.prototype.addHook).call.apply(_Handsontable$editors19, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "removeHooksByKey",
    value: function removeHooksByKey() {
      var _Handsontable$editors20;

      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
      }

      return (_Handsontable$editors20 = Handsontable.editors.BaseEditor.prototype.removeHooksByKey).call.apply(_Handsontable$editors20, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "clearHooks",
    value: function clearHooks() {
      var _Handsontable$editors21;

      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
      }

      return (_Handsontable$editors21 = Handsontable.editors.BaseEditor.prototype.clearHooks).call.apply(_Handsontable$editors21, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCell",
    value: function getEditedCell() {
      var _Handsontable$editors22;

      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
      }

      return (_Handsontable$editors22 = Handsontable.editors.BaseEditor.prototype.getEditedCell).call.apply(_Handsontable$editors22, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCellRect",
    value: function getEditedCellRect() {
      var _Handsontable$editors23;

      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }

      return (_Handsontable$editors23 = Handsontable.editors.BaseEditor.prototype.getEditedCellRect).call.apply(_Handsontable$editors23, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCellsZIndex",
    value: function getEditedCellsZIndex() {
      var _Handsontable$editors24;

      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
      }

      return (_Handsontable$editors24 = Handsontable.editors.BaseEditor.prototype.getEditedCellsZIndex).call.apply(_Handsontable$editors24, [this.hotCustomEditorInstance].concat(args));
    }
  }]);

  return BaseEditorComponent;
}(react.Component);

export { HotTable };
