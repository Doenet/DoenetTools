import { f as functionUncurryThis, a as arrayMethodIsStrict, _ as _export, b as arrayIncludes, g as global_1, e as engineUserAgent, i as isCallable, c as arraySlice, d as functionApply, h as engineIsNode, j as functionBindContext, k as fails, l as documentCreateElement, m as html$2, n as hasOwnProperty_1, o as internalMetadata, p as isObject$1, q as freezing, r as fixRegexpWellKnownSymbolLogic, s as requireObjectCoercible, t as getMethod, u as functionCall, v as toString_1, w as anObject, x as regexpExecAbstract, y as advanceStringIndex, z as toLength, A as toIndexedObject, B as lengthOfArrayLike, C as toIntegerOrInfinity, D as objectSetPrototypeOf, E as ownKeys$8, F as createProperty, G as descriptors, H as objectGetOwnPropertyDescriptor } from './es.string.starts-with-a75d39b5.js';
import { h as hooks } from './moment-640234e6.js';

/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */


var $IndexOf = arrayIncludes.indexOf;


var un$IndexOf = functionUncurryThis([].indexOf);

var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0
      : $IndexOf(this, searchElement, fromIndex);
  }
});

var TypeError$1 = global_1.TypeError;

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError$1('Not enough arguments');
  return passed;
};

var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check
var Function$1 = global_1.Function;

var wrap = function (scheduler) {
  return MSIE ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > 2;
    var fn = isCallable(handler) ? handler : Function$1(handler);
    var args = boundArgs ? arraySlice(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      functionApply(fn, this, args);
    } : fn, timeout);
  } : scheduler;
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
var schedulersFix = {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global_1.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global_1.setInterval)
};

var setInterval = schedulersFix.setInterval;

// ie9- setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
_export({ global: true, bind: true, forced: global_1.setInterval !== setInterval }, {
  setInterval: setInterval
});

var setTimeout$1 = schedulersFix.setTimeout;

// ie9- setTimeout additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
_export({ global: true, bind: true, forced: global_1.setTimeout !== setTimeout$1 }, {
  setTimeout: setTimeout$1
});

var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

var set = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process = global_1.process;
var Dispatch = global_1.Dispatch;
var Function$2 = global_1.Function;
var MessageChannel = global_1.MessageChannel;
var String$1 = global_1.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location$1, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location$1 = global_1.location;
} catch (error) { /* empty */ }

var run = function (id) {
  if (hasOwnProperty_1(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(String$1(id), location$1.protocol + '//' + location$1.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function$2(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      functionApply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    isCallable(global_1.postMessage) &&
    !global_1.importScripts &&
    location$1 && location$1.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html$2.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html$2.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set,
  clear: clear
};

var clearImmediate$1 = task.clear;

// `clearImmediate` method
// http://w3c.github.io/setImmediate/#si-clearImmediate
_export({ global: true, bind: true, enumerable: true, forced: global_1.clearImmediate !== clearImmediate$1 }, {
  clearImmediate: clearImmediate$1
});

var setImmediate$1 = task.set;

// `setImmediate` method
// http://w3c.github.io/setImmediate/#si-setImmediate
_export({ global: true, bind: true, enumerable: true, forced: global_1.setImmediate !== setImmediate$1 }, {
  setImmediate: setImmediate$1
});

function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
var lastTime = 0;
var vendors = ["ms", "moz", "webkit", "o"];
var _requestAnimationFrame = window.requestAnimationFrame;
var _cancelAnimationFrame = window.cancelAnimationFrame;
for (var x = 0; x < vendors.length && !_requestAnimationFrame; ++x) {
  _requestAnimationFrame = window["".concat(vendors[x], "RequestAnimationFrame")];
  _cancelAnimationFrame = window["".concat(vendors[x], "CancelAnimationFrame")] || window["".concat(vendors[x], "CancelRequestAnimationFrame")];
}
if (!_requestAnimationFrame) {
  _requestAnimationFrame = function _requestAnimationFrame2(callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
if (!_cancelAnimationFrame) {
  _cancelAnimationFrame = function _cancelAnimationFrame2(id) {
    clearTimeout(id);
  };
}
function requestAnimationFrame(callback) {
  return _requestAnimationFrame.call(window, callback);
}
function isClassListSupported() {
  return !!document.documentElement.classList;
}
function isTextContentSupported() {
  return !!document.createTextNode("test").textContent;
}
function isGetComputedStyleSupported() {
  return !!window.getComputedStyle;
}
function cancelAnimationFrame(id) {
  _cancelAnimationFrame.call(window, id);
}
function isTouchSupported() {
  return "ontouchstart" in window;
}
var _hasCaptionProblem;
function detectCaptionProblem() {
  var TABLE = document.createElement("TABLE");
  TABLE.style.borderSpacing = "0";
  TABLE.style.borderWidth = "0";
  TABLE.style.padding = "0";
  var TBODY = document.createElement("TBODY");
  TABLE.appendChild(TBODY);
  TBODY.appendChild(document.createElement("TR"));
  TBODY.firstChild.appendChild(document.createElement("TD"));
  TBODY.firstChild.firstChild.innerHTML = "<tr><td>t<br>t</td></tr>";
  var CAPTION = document.createElement("CAPTION");
  CAPTION.innerHTML = "c<br>c<br>c<br>c";
  CAPTION.style.padding = "0";
  CAPTION.style.margin = "0";
  TABLE.insertBefore(CAPTION, TBODY);
  document.body.appendChild(TABLE);
  _hasCaptionProblem = TABLE.offsetHeight < 2 * TABLE.lastChild.offsetHeight;
  document.body.removeChild(TABLE);
}
function hasCaptionProblem() {
  if (_hasCaptionProblem === void 0) {
    detectCaptionProblem();
  }
  return _hasCaptionProblem;
}
var comparisonFunction;
function getComparisonFunction(language) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (comparisonFunction) {
    return comparisonFunction;
  }
  if ((typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === "object") {
    comparisonFunction = new Intl.Collator(language, options).compare;
  } else if (typeof String.prototype.localeCompare === "function") {
    comparisonFunction = function comparisonFunction2(a, b) {
      return "".concat(a).localeCompare(b);
    };
  } else {
    comparisonFunction = function comparisonFunction2(a, b) {
      if (a === b) {
        return 0;
      }
      return a > b ? -1 : 1;
    };
  }
  return comparisonFunction;
}
var passiveSupported;
function isPassiveEventSupported() {
  if (passiveSupported !== void 0) {
    return passiveSupported;
  }
  try {
    var options = {
      get passive() {
        passiveSupported = true;
      }
    };
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
}

function to2dArray(arr) {
  var ilen = arr.length;
  var i = 0;
  while (i < ilen) {
    arr[i] = [arr[i]];
    i += 1;
  }
}
function extendArray(arr, extension) {
  var ilen = extension.length;
  var i = 0;
  while (i < ilen) {
    arr.push(extension[i]);
    i += 1;
  }
}
function pivot(arr) {
  var pivotedArr = [];
  if (!arr || arr.length === 0 || !arr[0] || arr[0].length === 0) {
    return pivotedArr;
  }
  var rowCount = arr.length;
  var colCount = arr[0].length;
  for (var i = 0; i < rowCount; i++) {
    for (var j = 0; j < colCount; j++) {
      if (!pivotedArr[j]) {
        pivotedArr[j] = [];
      }
      pivotedArr[j][i] = arr[i][j];
    }
  }
  return pivotedArr;
}
function arrayReduce(array, iteratee, accumulator, initFromArray) {
  var index = -1;
  var iterable = array;
  var result = accumulator;
  if (!Array.isArray(array)) {
    iterable = Array.from(array);
  }
  var length = iterable.length;
  if (initFromArray && length) {
    index += 1;
    result = iterable[index];
  }
  index += 1;
  while (index < length) {
    result = iteratee(result, iterable[index], index, iterable);
    index += 1;
  }
  return result;
}
function arrayFilter(array, predicate) {
  var index = 0;
  var iterable = array;
  if (!Array.isArray(array)) {
    iterable = Array.from(array);
  }
  var length = iterable.length;
  var result = [];
  var resIndex = -1;
  while (index < length) {
    var value = iterable[index];
    if (predicate(value, index, iterable)) {
      resIndex += 1;
      result[resIndex] = value;
    }
    index += 1;
  }
  return result;
}
function arrayMap(array, iteratee) {
  var index = 0;
  var iterable = array;
  if (!Array.isArray(array)) {
    iterable = Array.from(array);
  }
  var length = iterable.length;
  var result = [];
  var resIndex = -1;
  while (index < length) {
    var value = iterable[index];
    resIndex += 1;
    result[resIndex] = iteratee(value, index, iterable);
    index += 1;
  }
  return result;
}
function arrayEach(array, iteratee) {
  var index = 0;
  var iterable = array;
  if (!Array.isArray(array)) {
    iterable = Array.from(array);
  }
  var length = iterable.length;
  while (index < length) {
    if (iteratee(iterable[index], index, iterable) === false) {
      break;
    }
    index += 1;
  }
  return array;
}
function arrayUnique(array) {
  var unique = [];
  arrayEach(array, function(value) {
    if (unique.indexOf(value) === -1) {
      unique.push(value);
    }
  });
  return unique;
}
function getDifferenceOfArrays() {
  for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }
  var _ref = [].concat(arrays), first = _ref[0], rest = _ref.slice(1);
  var filteredFirstArray = first;
  arrayEach(rest, function(array) {
    filteredFirstArray = filteredFirstArray.filter(function(value) {
      return !array.includes(value);
    });
  });
  return filteredFirstArray;
}
function stringToArray(value) {
  var delimiter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " ";
  return value.split(delimiter);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  return _typeof$1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$1(obj);
}
function duckSchema(object) {
  var schema;
  if (Array.isArray(object)) {
    schema = [];
  } else {
    schema = {};
    objectEach(object, function(value, key) {
      if (key === "__children") {
        return;
      }
      if (value && _typeof$1(value) === "object" && !Array.isArray(value)) {
        schema[key] = duckSchema(value);
      } else if (Array.isArray(value)) {
        if (value.length && _typeof$1(value[0]) === "object" && !Array.isArray(value[0])) {
          schema[key] = [duckSchema(value[0])];
        } else {
          schema[key] = [];
        }
      } else {
        schema[key] = null;
      }
    });
  }
  return schema;
}
function inherit(Child, Parent) {
  Parent.prototype.constructor = Parent;
  Child.prototype = new Parent();
  Child.prototype.constructor = Child;
  return Child;
}
function extend(target, extension, writableKeys) {
  var hasWritableKeys = Array.isArray(writableKeys);
  objectEach(extension, function(value, key) {
    if (hasWritableKeys === false || writableKeys.includes(key)) {
      target[key] = value;
    }
  });
  return target;
}
function deepExtend(target, extension) {
  objectEach(extension, function(value, key) {
    if (extension[key] && _typeof$1(extension[key]) === "object") {
      if (!target[key]) {
        if (Array.isArray(extension[key])) {
          target[key] = [];
        } else if (Object.prototype.toString.call(extension[key]) === "[object Date]") {
          target[key] = extension[key];
        } else {
          target[key] = {};
        }
      }
      deepExtend(target[key], extension[key]);
    } else {
      target[key] = extension[key];
    }
  });
}
function deepClone(obj) {
  if (_typeof$1(obj) === "object") {
    return JSON.parse(JSON.stringify(obj));
  }
  return obj;
}
function clone(object) {
  var result = {};
  objectEach(object, function(value, key) {
    result[key] = value;
  });
  return result;
}
function mixin(Base) {
  if (!Base.MIXINS) {
    Base.MIXINS = [];
  }
  for (var _len = arguments.length, mixins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    mixins[_key - 1] = arguments[_key];
  }
  arrayEach(mixins, function(mixinItem) {
    Base.MIXINS.push(mixinItem.MIXIN_NAME);
    objectEach(mixinItem, function(value, key) {
      if (Base.prototype[key] !== void 0) {
        throw new Error("Mixin conflict. Property '".concat(key, "' already exist and cannot be overwritten."));
      }
      if (typeof value === "function") {
        Base.prototype[key] = value;
      } else {
        var getter = function _getter(property, initialValue) {
          var propertyName = "_".concat(property);
          var initValue = function initValue2(newValue) {
            var result = newValue;
            if (Array.isArray(result) || isObject(result)) {
              result = deepClone(result);
            }
            return result;
          };
          return function() {
            if (this[propertyName] === void 0) {
              this[propertyName] = initValue(initialValue);
            }
            return this[propertyName];
          };
        };
        var setter = function _setter(property) {
          var propertyName = "_".concat(property);
          return function(newValue) {
            this[propertyName] = newValue;
          };
        };
        Object.defineProperty(Base.prototype, key, {
          get: getter(key, value),
          set: setter(key),
          configurable: true
        });
      }
    });
  });
  return Base;
}
function isObjectEqual(object1, object2) {
  return JSON.stringify(object1) === JSON.stringify(object2);
}
function isObject(object) {
  return Object.prototype.toString.call(object) === "[object Object]";
}
function defineGetter(object, property, value, options) {
  options.value = value;
  options.writable = options.writable !== false;
  options.enumerable = options.enumerable !== false;
  options.configurable = options.configurable !== false;
  Object.defineProperty(object, property, options);
}
function objectEach(object, iteratee) {
  for (var key in object) {
    if (!object.hasOwnProperty || object.hasOwnProperty && Object.prototype.hasOwnProperty.call(object, key)) {
      if (iteratee(object[key], key, object) === false) {
        break;
      }
    }
  }
  return object;
}
function getProperty(object, name) {
  var names = name.split(".");
  var result = object;
  objectEach(names, function(nameItem) {
    result = result[nameItem];
    if (result === void 0) {
      result = void 0;
      return false;
    }
  });
  return result;
}
function setProperty(object, name, value) {
  var names = name.split(".");
  var workingObject = object;
  names.forEach(function(propName, index) {
    if (index !== names.length - 1) {
      if (!hasOwnProperty(workingObject, propName)) {
        workingObject[propName] = {};
      }
      workingObject = workingObject[propName];
    } else {
      workingObject[propName] = value;
    }
  });
}
function deepObjectSize(object) {
  if (!isObject(object)) {
    return 0;
  }
  var recursObjLen = function recursObjLen2(obj) {
    var result = 0;
    if (isObject(obj)) {
      objectEach(obj, function(value, key) {
        if (key === "__children") {
          return;
        }
        result += recursObjLen2(value);
      });
    } else {
      result += 1;
    }
    return result;
  };
  return recursObjLen(object);
}
function createObjectPropListener(defaultValue) {
  var _holder;
  var propertyToListen = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "value";
  var privateProperty = "_".concat(propertyToListen);
  var holder = (_holder = {
    _touched: false
  }, _defineProperty(_holder, privateProperty, defaultValue), _defineProperty(_holder, "isTouched", function isTouched() {
    return this._touched;
  }), _holder);
  Object.defineProperty(holder, propertyToListen, {
    get: function get() {
      return this[privateProperty];
    },
    set: function set(value) {
      this._touched = true;
      this[privateProperty] = value;
    },
    enumerable: true,
    configurable: true
  });
  return holder;
}
function hasOwnProperty(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

var tester = function tester2(testerFunc) {
  var result = {
    value: false
  };
  result.test = function(ua, vendor) {
    result.value = testerFunc(ua, vendor);
  };
  return result;
};
var browsers = {
  chrome: tester(function(ua, vendor) {
    return /Chrome/.test(ua) && /Google/.test(vendor);
  }),
  chromeWebKit: tester(function(ua) {
    return /CriOS/.test(ua);
  }),
  edge: tester(function(ua) {
    return /Edge/.test(ua);
  }),
  edgeWebKit: tester(function(ua) {
    return /EdgiOS/.test(ua);
  }),
  firefox: tester(function(ua) {
    return /Firefox/.test(ua);
  }),
  firefoxWebKit: tester(function(ua) {
    return /FxiOS/.test(ua);
  }),
  ie: tester(function(ua) {
    return /Trident/.test(ua);
  }),
  ie9: tester(function() {
    return !!document.documentMode;
  }),
  mobile: tester(function(ua) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  }),
  safari: tester(function(ua, vendor) {
    return /Safari/.test(ua) && /Apple Computer/.test(vendor);
  })
};
var platforms = {
  mac: tester(function(platform) {
    return /^Mac/.test(platform);
  }),
  win: tester(function(platform) {
    return /^Win/.test(platform);
  }),
  linux: tester(function(platform) {
    return /^Linux/.test(platform);
  }),
  ios: tester(function(ua) {
    return /iPhone|iPad|iPod/i.test(ua);
  })
};
function setBrowserMeta() {
  var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$userAgent = _ref.userAgent, userAgent = _ref$userAgent === void 0 ? navigator.userAgent : _ref$userAgent, _ref$vendor = _ref.vendor, vendor = _ref$vendor === void 0 ? navigator.vendor : _ref$vendor;
  objectEach(browsers, function(_ref2) {
    var test = _ref2.test;
    return void test(userAgent, vendor);
  });
}
function setPlatformMeta() {
  var _ref3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref3$platform = _ref3.platform, platform = _ref3$platform === void 0 ? navigator.platform : _ref3$platform;
  objectEach(platforms, function(_ref4) {
    var test = _ref4.test;
    return void test(platform);
  });
}
setBrowserMeta();
setPlatformMeta();
function isChrome() {
  return browsers.chrome.value;
}
function isChromeWebKit() {
  return browsers.chromeWebKit.value;
}
function isFirefox() {
  return browsers.firefox.value;
}
function isFirefoxWebKit() {
  return browsers.firefoxWebKit.value;
}
function isSafari() {
  return browsers.safari.value;
}
function isEdge() {
  return browsers.edge.value;
}
function isIE() {
  return browsers.ie.value;
}
function isIE9() {
  return browsers.ie9.value;
}
function isMobileBrowser() {
  return browsers.mobile.value;
}
function isIOS() {
  return platforms.ios.value;
}
function isIpadOS() {
  var _ref5 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : navigator, maxTouchPoints = _ref5.maxTouchPoints;
  return maxTouchPoints > 2 && platforms.mac.value;
}
function isWindowsOS() {
  return platforms.win.value;
}
function isMacOS() {
  return platforms.mac.value;
}

/*! @license DOMPurify 2.3.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.8/LICENSE */

function _typeof$2(obj) {
  "@babel/helpers - typeof";

  return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof$2(obj);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
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

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var hasOwnProperty$1 = Object.hasOwnProperty,
    setPrototypeOf = Object.setPrototypeOf,
    isFrozen = Object.isFrozen,
    getPrototypeOf = Object.getPrototypeOf,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze,
    seal = Object.seal,
    create = Object.create; // eslint-disable-line import/no-mutable-exports

var _ref = typeof Reflect !== 'undefined' && Reflect,
    apply = _ref.apply,
    construct = _ref.construct;

if (!apply) {
  apply = function apply(fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}

if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}

if (!seal) {
  seal = function seal(x) {
    return x;
  };
}

if (!construct) {
  construct = function construct(Func, args) {
    return _construct(Func, _toConsumableArray(args));
  };
}

var arrayForEach = unapply(Array.prototype.forEach);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function (thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return apply(func, thisArg, args);
  };
}
function unconstruct(func) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return construct(func, args);
  };
}
/* Add properties to a lookup table */

function addToSet(set, array) {
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }

  var l = array.length;

  while (l--) {
    var element = array[l];

    if (typeof element === 'string') {
      var lcElement = stringToLowerCase(element);

      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }

        element = lcElement;
      }
    }

    set[element] = true;
  }

  return set;
}
/* Shallow clone an object */

function clone$1(object) {
  var newObject = create(null);
  var property;

  for (property in object) {
    if (apply(hasOwnProperty$1, object, [property])) {
      newObject[property] = object[property];
    }
  }

  return newObject;
}
/* IE10 doesn't support __lookupGetter__ so lets'
 * simulate it. It also automatically checks
 * if the prop is function or getter and behaves
 * accordingly. */

function lookupGetter(object, prop) {
  while (object !== null) {
    var desc = getOwnPropertyDescriptor(object, prop);

    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }

      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }

    object = getPrototypeOf(object);
  }

  function fallbackValue(element) {
    console.warn('fallback value for', element);
    return null;
  }

  return fallbackValue;
}

var html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']); // SVG

var svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']); // List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.

var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
var mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']); // Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.

var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
var text = freeze(['#text']);

var html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
var svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
var mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode

var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape

var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape

var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);

var getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
 * @param {Document} document The document object (to determine policy name suffix)
 * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
 * are not supported).
 */


var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
  if (_typeof$2(trustedTypes) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  } // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.


  var suffix = null;
  var ATTR_NAME = 'data-tt-policy-suffix';

  if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
    suffix = document.currentScript.getAttribute(ATTR_NAME);
  }

  var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML: function createHTML(html) {
        return html;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};

function createDOMPurify() {
  var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

  var DOMPurify = function DOMPurify(root) {
    return createDOMPurify(root);
  };
  /**
   * Version label, exposed for easier checks
   * if DOMPurify is up to date or not
   */


  DOMPurify.version = '2.3.8';
  /**
   * Array of elements that DOMPurify removed during sanitation.
   * Empty if nothing was removed.
   */

  DOMPurify.removed = [];

  if (!window || !window.document || window.document.nodeType !== 9) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }

  var originalDocument = window.document;
  var document = window.document;
  var DocumentFragment = window.DocumentFragment,
      HTMLTemplateElement = window.HTMLTemplateElement,
      Node = window.Node,
      Element = window.Element,
      NodeFilter = window.NodeFilter,
      _window$NamedNodeMap = window.NamedNodeMap,
      NamedNodeMap = _window$NamedNodeMap === void 0 ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
      HTMLFormElement = window.HTMLFormElement,
      DOMParser = window.DOMParser,
      trustedTypes = window.trustedTypes;
  var ElementPrototype = Element.prototype;
  var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  var getParentNode = lookupGetter(ElementPrototype, 'parentNode'); // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.

  if (typeof HTMLTemplateElement === 'function') {
    var template = document.createElement('template');

    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }

  var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);

  var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';
  var _document = document,
      implementation = _document.implementation,
      createNodeIterator = _document.createNodeIterator,
      createDocumentFragment = _document.createDocumentFragment,
      getElementsByTagName = _document.getElementsByTagName;
  var importNode = originalDocument.importNode;
  var documentMode = {};

  try {
    documentMode = clone$1(document).documentMode ? document.documentMode : {};
  } catch (_) {}

  var hooks = {};
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */

  DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;
  var MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
      ERB_EXPR$1 = ERB_EXPR,
      DATA_ATTR$1 = DATA_ATTR,
      ARIA_ATTR$1 = ARIA_ATTR,
      IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
      ATTR_WHITESPACE$1 = ATTR_WHITESPACE;
  var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */

  /* allowed element names */

  var ALLOWED_TAGS = null;
  var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));
  /* Allowed attribute names */

  var ALLOWED_ATTR = null;
  var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));
  /*
   * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */

  var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */

  var FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */

  var FORBID_ATTR = null;
  /* Decide if ARIA attributes are okay */

  var ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */

  var ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */

  var ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */

  var SAFE_FOR_TEMPLATES = false;
  /* Decide if document with <html>... should be returned */

  var WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */

  var SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */

  var FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */

  var RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */

  var RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */

  var RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks? */

  var SANITIZE_DOM = true;
  /* Keep element content when removing element? */

  var KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */

  var IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */

  var USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */

  var FORBID_CONTENTS = null;
  var DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */

  var DATA_URI_TAGS = null;
  var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */

  var URI_SAFE_ATTRIBUTES = null;
  var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */

  var NAMESPACE = HTML_NAMESPACE;
  var IS_EMPTY_INPUT = false;
  /* Parsing of strict XHTML documents */

  var PARSER_MEDIA_TYPE;
  var SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  var DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  var transformCaseFunc;
  /* Keep a reference to config to pass to hooks */

  var CONFIG = null;
  /* Ideally, do not touch anything below this line */

  /* ______________________________________________ */

  var formElement = document.createElement('form');

  var isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param  {Object} cfg optional config literal
   */
  // eslint-disable-next-line complexity


  var _parseConfig = function _parseConfig(cfg) {
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */


    if (!cfg || _typeof$2(cfg) !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */


    cfg = clone$1(cfg);
    /* Set configuration parameters */

    ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
    URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone$1(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone$1(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
    FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
    USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true

    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true

    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false

    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false

    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false

    RETURN_DOM = cfg.RETURN_DOM || false; // Default false

    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false

    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false

    FORCE_BODY = cfg.FORCE_BODY || false; // Default false

    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true

    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

    IN_PLACE = cfg.IN_PLACE || false; // Default false

    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;

    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }

    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }

    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }

    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE; // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.

    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? function (x) {
      return x;
    } : stringToLowerCase;

    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }

    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */


    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
      ALLOWED_ATTR = [];

      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }

      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }

      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }

      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */


    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS = clone$1(ALLOWED_TAGS);
      }

      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
    }

    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone$1(ALLOWED_ATTR);
      }

      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
    }

    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
    }

    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone$1(FORBID_CONTENTS);
      }

      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS);
    }
    /* Add #text in case KEEP_CONTENT is set to true */


    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */


    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */


    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    } // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.


    if (freeze) {
      freeze(cfg);
    }

    CONFIG = cfg;
  };

  var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']); // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.

  var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */

  var ALL_SVG_TAGS = addToSet({}, svg$1);
  addToSet(ALL_SVG_TAGS, svgFilters);
  addToSet(ALL_SVG_TAGS, svgDisallowed);
  var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
  addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
  /**
   *
   *
   * @param  {Element} element a DOM element whose namespace is being checked
   * @returns {boolean} Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */

  var _checkValidNamespace = function _checkValidNamespace(element) {
    var parent = getParentNode(element); // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.

    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: HTML_NAMESPACE,
        tagName: 'template'
      };
    }

    var tagName = stringToLowerCase(element.tagName);
    var parentTagName = stringToLowerCase(parent.tagName);

    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      } // The only way to switch from MathML to SVG is via
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.


      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      } // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.


      return Boolean(ALL_SVG_TAGS[tagName]);
    }

    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      } // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points


      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      } // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.


      return Boolean(ALL_MATHML_TAGS[tagName]);
    }

    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }

      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      } // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace


      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    } // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG or MathML). Return false just in case.


    return false;
  };
  /**
   * _forceRemove
   *
   * @param  {Node} node a DOM node
   */


  var _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });

    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      node.parentNode.removeChild(node);
    } catch (_) {
      try {
        node.outerHTML = emptyHTML;
      } catch (_) {
        node.remove();
      }
    }
  };
  /**
   * _removeAttribute
   *
   * @param  {String} name an Attribute name
   * @param  {Node} node a DOM node
   */


  var _removeAttribute = function _removeAttribute(name, node) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: node.getAttributeNode(name),
        from: node
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: node
      });
    }

    node.removeAttribute(name); // We void attribute values for unremovable "is"" attributes

    if (name === 'is' && !ALLOWED_ATTR[name]) {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(node);
        } catch (_) {}
      } else {
        try {
          node.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param  {String} dirty a string of dirty markup
   * @return {Document} a DOM, filled with the dirty markup
   */


  var _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    var doc;
    var leadingWhitespace;

    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      var matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }

    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml') {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }

    var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */

    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */


    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);

      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? '' : dirtyPayload;
      } catch (_) {// Syntax error if dirtyPayload is invalid xml
      }
    }

    var body = doc.body || doc.documentElement;

    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */


    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }

    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * _createIterator
   *
   * @param  {Document} root document/fragment to create iterator for
   * @return {Iterator} iterator instance
   */


  var _createIterator = function _createIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
  };
  /**
   * _isClobbered
   *
   * @param  {Node} elm element to check for clobbering attacks
   * @return {Boolean} true if clobbered, false if safe
   */


  var _isClobbered = function _isClobbered(elm) {
    return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function');
  };
  /**
   * _isNode
   *
   * @param  {Node} obj object to check whether it's a DOM node
   * @return {Boolean} true is object is a DOM node
   */


  var _isNode = function _isNode(object) {
    return _typeof$2(Node) === 'object' ? object instanceof Node : object && _typeof$2(object) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
  };
  /**
   * _executeHook
   * Execute user configurable hooks
   *
   * @param  {String} entryPoint  Name of the hook's entry point
   * @param  {Node} currentNode node to work on with the hook
   * @param  {Object} data additional hook parameters
   */


  var _executeHook = function _executeHook(entryPoint, currentNode, data) {
    if (!hooks[entryPoint]) {
      return;
    }

    arrayForEach(hooks[entryPoint], function (hook) {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  };
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   *
   * @param   {Node} currentNode to check for permission to exist
   * @return  {Boolean} true if node was killed, false if left alive
   */


  var _sanitizeElements = function _sanitizeElements(currentNode) {
    var content;
    /* Execute a hook if present */

    _executeHook('beforeSanitizeElements', currentNode, null);
    /* Check if element is clobbered or can clobber */


    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Check if tagname contains Unicode */


    if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Now let's check the element's type and name */


    var tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */

    _executeHook('uponSanitizeElement', currentNode, {
      tagName: tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */


    if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Mitigate a problem with templates inside select */


    if (tagName === 'select' && regExpTest(/<template/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Remove element if anything forbids its presence */


    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
      }
      /* Keep content except for bad-listed elements */


      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        var parentNode = getParentNode(currentNode) || currentNode.parentNode;
        var childNodes = getChildNodes(currentNode) || currentNode.childNodes;

        if (childNodes && parentNode) {
          var childCount = childNodes.length;

          for (var i = childCount - 1; i >= 0; --i) {
            parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
          }
        }
      }

      _forceRemove(currentNode);

      return true;
    }
    /* Check whether element has a valid namespace */


    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);

      return true;
    }

    if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Sanitize element content to be template-safe */


    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
      /* Get the element's text content */
      content = currentNode.textContent;
      content = stringReplace(content, MUSTACHE_EXPR$1, ' ');
      content = stringReplace(content, ERB_EXPR$1, ' ');

      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeElements', currentNode, null);

    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param  {string} lcTag Lowercase tag name of containing element.
   * @param  {string} lcName Lowercase attribute name.
   * @param  {string} value Attribute value.
   * @return {Boolean} Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity


  var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */


    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if ( // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */

    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if (!value) ; else {
      return false;
    }

    return true;
  };
  /**
   * _basicCustomElementCheck
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   * @param {string} tagName name of the tag of the node to sanitize
   */


  var _basicCustomElementTest = function _basicCustomElementTest(tagName) {
    return tagName.indexOf('-') > 0;
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param  {Node} currentNode to sanitize
   */


  var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    var attr;
    var value;
    var lcName;
    var l;
    /* Execute a hook if present */

    _executeHook('beforeSanitizeAttributes', currentNode, null);

    var attributes = currentNode.attributes;
    /* Check if we have attributes; if not we might have a text node */

    if (!attributes) {
      return;
    }

    var hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR
    };
    l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */

    while (l--) {
      attr = attributes[l];
      var _attr = attr,
          name = _attr.name,
          namespaceURI = _attr.namespaceURI;
      value = name === 'value' ? attr.value : stringTrim(attr.value);
      lcName = transformCaseFunc(name);
      /* Execute a hook if present */

      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set

      _executeHook('uponSanitizeAttribute', currentNode, hookEvent);

      value = hookEvent.attrValue;
      /* Did the hooks approve of the attribute? */

      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Remove attribute */


      _removeAttribute(name, currentNode);
      /* Did the hooks approve of the attribute? */


      if (!hookEvent.keepAttr) {
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */


      if (regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);

        continue;
      }
      /* Sanitize attribute content to be template-safe */


      if (SAFE_FOR_TEMPLATES) {
        value = stringReplace(value, MUSTACHE_EXPR$1, ' ');
        value = stringReplace(value, ERB_EXPR$1, ' ');
      }
      /* Is `value` valid for this attribute? */


      var lcTag = transformCaseFunc(currentNode.nodeName);

      if (!_isValidAttribute(lcTag, lcName, value)) {
        continue;
      }
      /* Handle invalid data-* attribute set by try-catching it */


      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
          currentNode.setAttribute(name, value);
        }

        arrayPop(DOMPurify.removed);
      } catch (_) {}
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeAttributes', currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param  {DocumentFragment} fragment to iterate over recursively
   */


  var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    var shadowNode;

    var shadowIterator = _createIterator(fragment);
    /* Execute a hook if present */


    _executeHook('beforeSanitizeShadowDOM', fragment, null);

    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHook('uponSanitizeShadowNode', shadowNode, null);
      /* Sanitize tags and elements */


      if (_sanitizeElements(shadowNode)) {
        continue;
      }
      /* Deep shadow DOM detected */


      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
      /* Check attributes, sanitize if necessary */


      _sanitizeAttributes(shadowNode);
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeShadowDOM', fragment, null);
  };
  /**
   * Sanitize
   * Public method providing core sanitation functionality
   *
   * @param {String|Node} dirty string or DOM node
   * @param {Object} configuration object
   */
  // eslint-disable-next-line complexity


  DOMPurify.sanitize = function (dirty, cfg) {
    var body;
    var importedNode;
    var currentNode;
    var oldNode;
    var returnNode;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */

    IS_EMPTY_INPUT = !dirty;

    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */


    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      // eslint-disable-next-line no-negated-condition
      if (typeof dirty.toString !== 'function') {
        throw typeErrorCreate('toString is not a function');
      } else {
        dirty = dirty.toString();

        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      }
    }
    /* Check we can run. Otherwise fall back or ignore */


    if (!DOMPurify.isSupported) {
      if (_typeof$2(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
        if (typeof dirty === 'string') {
          return window.toStaticHTML(dirty);
        }

        if (_isNode(dirty)) {
          return window.toStaticHTML(dirty.outerHTML);
        }
      }

      return dirty;
    }
    /* Assign config vars */


    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */


    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */

    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }

    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        var tagName = transformCaseFunc(dirty.nodeName);

        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);

      if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */


      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */

      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */


    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */


    var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */


    while (currentNode = nodeIterator.nextNode()) {
      /* Fix IE's strange behavior with manipulated textNodes #89 */
      if (currentNode.nodeType === 3 && currentNode === oldNode) {
        continue;
      }
      /* Sanitize tags and elements */


      if (_sanitizeElements(currentNode)) {
        continue;
      }
      /* Shadow DOM detected, sanitize it */


      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
      /* Check attributes, sanitize if necessary */


      _sanitizeAttributes(currentNode);

      oldNode = currentNode;
    }

    oldNode = null;
    /* If we sanitized `dirty` in-place, return it. */

    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */


    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);

        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }

      if (ALLOWED_ATTR.shadowroot) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }

      return returnNode;
    }

    var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */

    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */


    if (SAFE_FOR_TEMPLATES) {
      serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, ' ');
      serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, ' ');
    }

    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  /**
   * Public method to set the configuration once
   * setConfig
   *
   * @param {Object} cfg configuration object
   */


  DOMPurify.setConfig = function (cfg) {
    _parseConfig(cfg);

    SET_CONFIG = true;
  };
  /**
   * Public method to remove the configuration
   * clearConfig
   *
   */


  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  /**
   * Public method to check if an attribute value is valid.
   * Uses last set config, if any. Otherwise, uses config defaults.
   * isValidAttribute
   *
   * @param  {string} tag Tag name of containing element.
   * @param  {string} attr Attribute name.
   * @param  {string} value Attribute value.
   * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
   */


  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }

    var lcTag = transformCaseFunc(tag);
    var lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  /**
   * AddHook
   * Public method to add DOMPurify hooks
   *
   * @param {String} entryPoint entry point for the hook to add
   * @param {Function} hookFunction function to execute
   */


  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }

    hooks[entryPoint] = hooks[entryPoint] || [];
    arrayPush(hooks[entryPoint], hookFunction);
  };
  /**
   * RemoveHook
   * Public method to remove a DOMPurify hook at a given entryPoint
   * (pops it from the stack of hooks if more are present)
   *
   * @param {String} entryPoint entry point for the hook to remove
   * @return {Function} removed(popped) hook
   */


  DOMPurify.removeHook = function (entryPoint) {
    if (hooks[entryPoint]) {
      return arrayPop(hooks[entryPoint]);
    }
  };
  /**
   * RemoveHooks
   * Public method to remove all DOMPurify hooks at a given entryPoint
   *
   * @param  {String} entryPoint entry point for the hooks to remove
   */


  DOMPurify.removeHooks = function (entryPoint) {
    if (hooks[entryPoint]) {
      hooks[entryPoint] = [];
    }
  };
  /**
   * RemoveAllHooks
   * Public method to remove all DOMPurify hooks
   *
   */


  DOMPurify.removeAllHooks = function () {
    hooks = {};
  };

  return DOMPurify;
}

var purify = createDOMPurify();

var onFreeze = internalMetadata.onFreeze;

// eslint-disable-next-line es-x/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
  freeze: function freeze(it) {
    return $freeze && isObject$1(it) ? $freeze(onFreeze(it)) : it;
  }
});

function toSingleLine(strings) {
  for (var _len = arguments.length, expressions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    expressions[_key - 1] = arguments[_key];
  }
  var result = arrayReduce(strings, function(previousValue, currentValue, index) {
    var valueWithoutWhiteSpaces = currentValue.replace(/\r?\n\s*/g, "");
    var expressionForIndex = expressions[index] ? expressions[index] : "";
    return previousValue + valueWithoutWhiteSpaces + expressionForIndex;
  }, "");
  return result.trim();
}

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
function _typeof$3(obj) {
  "@babel/helpers - typeof";
  return _typeof$3 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$3(obj);
}
function stringify(value) {
  var result;
  switch (_typeof$3(value)) {
    case "string":
    case "number":
      result = "".concat(value);
      break;
    case "object":
      result = value === null ? "" : value.toString();
      break;
    case "undefined":
      result = "";
      break;
    default:
      result = value.toString();
      break;
  }
  return result;
}
function isDefined(variable) {
  return typeof variable !== "undefined";
}
function isUndefined(variable) {
  return typeof variable === "undefined";
}
function isEmpty(variable) {
  return variable === null || variable === "" || isUndefined(variable);
}
function isRegExp(variable) {
  return Object.prototype.toString.call(variable) === "[object RegExp]";
}
var _m = "length";
var _hd = function _hd2(v) {
  return parseInt(v, 16);
};
var _pi = function _pi2(v) {
  return parseInt(v, 10);
};
var _ss = function _ss2(v, s, l) {
  return v["substr"](s, l);
};
var _cp = function _cp2(v) {
  return v["codePointAt"](0) - 65;
};
var _norm = function _norm2(v) {
  return "".concat(v).replace(/\-/g, "");
};
var _extractTime = function _extractTime2(v) {
  return _hd(_ss(_norm(v), _hd("12"), _cp("F"))) / (_hd(_ss(_norm(v), _cp("B"), ~~![][_m])) || 9);
};
var _ignored = function _ignored2() {
  return typeof location !== "undefined" && /^([a-z0-9\-]+\.)?\x68\x61\x6E\x64\x73\x6F\x6E\x74\x61\x62\x6C\x65\x2E\x63\x6F\x6D$/i.test(location.host);
};
var _notified = false;
var consoleMessages = {
  invalid: function invalid() {
    return toSingleLine(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    The license key for Handsontable is invalid. \n    If you need any help, contact us at support@handsontable.com."], ["\n    The license key for Handsontable is invalid.\\x20\n    If you need any help, contact us at support@handsontable.com."])));
  },
  expired: function expired(_ref) {
    var keyValidityDate = _ref.keyValidityDate, hotVersion = _ref.hotVersion;
    return toSingleLine(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    The license key for Handsontable expired on ", ", and is not valid for the installed \n    version ", ". Renew your license key at handsontable.com or downgrade to a version released prior \n    to ", ". If you need any help, contact us at sales@handsontable.com."], ["\n    The license key for Handsontable expired on ", ", and is not valid for the installed\\x20\n    version ", ". Renew your license key at handsontable.com or downgrade to a version released prior\\x20\n    to ", ". If you need any help, contact us at sales@handsontable.com."])), keyValidityDate, hotVersion, keyValidityDate);
  },
  missing: function missing() {
    return toSingleLine(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    The license key for Handsontable is missing. Use your purchased key to activate the product. \n    Alternatively, you can activate Handsontable to use for non-commercial purposes by \n    passing the key: 'non-commercial-and-evaluation'. If you need any help, contact \n    us at support@handsontable.com."], ["\n    The license key for Handsontable is missing. Use your purchased key to activate the product.\\x20\n    Alternatively, you can activate Handsontable to use for non-commercial purposes by\\x20\n    passing the key: 'non-commercial-and-evaluation'. If you need any help, contact\\x20\n    us at support@handsontable.com."])));
  },
  non_commercial: function non_commercial() {
    return "";
  }
};
var domMessages = {
  invalid: function invalid2() {
    return toSingleLine(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(['\n    The license key for Handsontable is invalid. \n    <a href="https://handsontable.com/docs/tutorial-license-key.html" target="_blank">Read more</a> on how to \n    install it properly or contact us at <a href="mailto:support@handsontable.com">support@handsontable.com</a>.'], ['\n    The license key for Handsontable is invalid.\\x20\n    <a href="https://handsontable.com/docs/tutorial-license-key.html" target="_blank">Read more</a> on how to\\x20\n    install it properly or contact us at <a href="mailto:support@handsontable.com">support@handsontable.com</a>.'])));
  },
  expired: function expired2(_ref2) {
    var keyValidityDate = _ref2.keyValidityDate, hotVersion = _ref2.hotVersion;
    return toSingleLine(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    The license key for Handsontable expired on ", ", and is not valid for the installed \n    version ", '. <a href="https://handsontable.com/pricing" target="_blank">Renew</a> your \n    license key or downgrade to a version released prior to ', '. If you need any \n    help, contact us at <a href="mailto:sales@handsontable.com">sales@handsontable.com</a>.'], ["\n    The license key for Handsontable expired on ", ", and is not valid for the installed\\x20\n    version ", '. <a href="https://handsontable.com/pricing" target="_blank">Renew</a> your\\x20\n    license key or downgrade to a version released prior to ', '. If you need any\\x20\n    help, contact us at <a href="mailto:sales@handsontable.com">sales@handsontable.com</a>.'])), keyValidityDate, hotVersion, keyValidityDate);
  },
  missing: function missing2() {
    return toSingleLine(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral([`
    The license key for Handsontable is missing. Use your purchased key to activate the product. 
    Alternatively, you can activate Handsontable to use for non-commercial purposes by 
    passing the key: 'non-commercial-and-evaluation'. 
    <a href="https://handsontable.com/docs/tutorial-license-key.html" target="_blank">Read more</a> about it in 
    the documentation or contact us at <a href="mailto:support@handsontable.com">support@handsontable.com</a>.`], [`
    The license key for Handsontable is missing. Use your purchased key to activate the product.\\x20
    Alternatively, you can activate Handsontable to use for non-commercial purposes by\\x20
    passing the key: 'non-commercial-and-evaluation'.\\x20
    <a href="https://handsontable.com/docs/tutorial-license-key.html" target="_blank">Read more</a> about it in\\x20
    the documentation or contact us at <a href="mailto:support@handsontable.com">support@handsontable.com</a>.`])));
  },
  non_commercial: function non_commercial2() {
    return "";
  }
};
function _injectProductInfo(key, element) {
  var hasValidType = !isEmpty(key);
  var isNonCommercial = typeof key === "string" && key.toLowerCase() === "non-commercial-and-evaluation";
  var hotVersion = "12.0.1";
  var keyValidityDate;
  var consoleMessageState = "invalid";
  var domMessageState = "invalid";
  key = _norm(key || "");
  var schemaValidity = _checkKeySchema(key);
  if (hasValidType || isNonCommercial || schemaValidity) {
    if (schemaValidity) {
      var releaseDate = hooks("16/05/2022", "DD/MM/YYYY");
      var releaseDays = Math.floor(releaseDate.toDate().getTime() / 864e5);
      var keyValidityDays = _extractTime(key);
      keyValidityDate = hooks((keyValidityDays + 1) * 864e5, "x").format("MMMM DD, YYYY");
      if (releaseDays > keyValidityDays) {
        var daysAfterRelease = hooks().diff(releaseDate, "days");
        consoleMessageState = daysAfterRelease <= 1 ? "valid" : "expired";
        domMessageState = daysAfterRelease <= 15 ? "valid" : "expired";
      } else {
        consoleMessageState = "valid";
        domMessageState = "valid";
      }
    } else if (isNonCommercial) {
      consoleMessageState = "non_commercial";
      domMessageState = "valid";
    } else {
      consoleMessageState = "invalid";
      domMessageState = "invalid";
    }
  } else {
    consoleMessageState = "missing";
    domMessageState = "missing";
  }
  if (_ignored()) {
    consoleMessageState = "valid";
    domMessageState = "valid";
  }
  if (!_notified && consoleMessageState !== "valid") {
    var message = consoleMessages[consoleMessageState]({
      keyValidityDate,
      hotVersion
    });
    if (message) {
      console[consoleMessageState === "non_commercial" ? "info" : "warn"](consoleMessages[consoleMessageState]({
        keyValidityDate,
        hotVersion
      }));
    }
    _notified = true;
  }
  if (domMessageState !== "valid" && element.parentNode) {
    var _message = domMessages[domMessageState]({
      keyValidityDate,
      hotVersion
    });
    if (_message) {
      var messageNode = document.createElement("div");
      messageNode.id = "hot-display-license-info";
      messageNode.innerHTML = domMessages[domMessageState]({
        keyValidityDate,
        hotVersion
      });
      element.parentNode.insertBefore(messageNode, element.nextSibling);
    }
  }
}
function _checkKeySchema(v) {
  var z = [][_m];
  var p = z;
  if (v[_m] !== _cp("Z")) {
    return false;
  }
  for (var c = "", i = "B<H4P+".split(""), j = _cp(i.shift()); j; j = _cp(i.shift() || "A")) {
    --j < ""[_m] ? p = p | (_pi("".concat(_pi(_hd(c) + (_hd(_ss(v, Math.abs(j), 2)) + []).padStart(2, "0")))) % 97 || 2) >> 1 : c = _ss(v, j, !j ? 6 : i[_m] === 1 ? 9 : 8);
  }
  return p === z;
}

function toUpperCaseFirst(string) {
  return string[0].toUpperCase() + string.substr(1);
}
function randomString() {
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  }
  return s4() + s4() + s4() + s4();
}
function isPercentValue(value) {
  return /^([0-9][0-9]?%$)|(^100%$)/.test(value);
}
function substitute(template) {
  var variables = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return "".concat(template).replace(/(?:\\)?\[([^[\]]+)]/g, function(match, name) {
    if (match.charAt(0) === "\\") {
      return match.substr(1, match.length - 1);
    }
    return variables[name] === void 0 ? "" : variables[name];
  });
}
function stripTags(string) {
  return sanitize("".concat(string), {
    ALLOWED_TAGS: []
  });
}
function sanitize(string, options) {
  return purify.sanitize(string, options);
}

function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}
function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$1(arr);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function getParent(element) {
  var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var iteration = -1;
  var parent = null;
  var elementToCheck = element;
  while (elementToCheck !== null) {
    if (iteration === level) {
      parent = elementToCheck;
      break;
    }
    if (elementToCheck.host && elementToCheck.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      elementToCheck = elementToCheck.host;
    } else {
      iteration += 1;
      elementToCheck = elementToCheck.parentNode;
    }
  }
  return parent;
}
function getFrameElement(frame) {
  return Object.getPrototypeOf(frame.parent) && frame.frameElement;
}
function getParentWindow(frame) {
  return getFrameElement(frame) && frame.parent;
}
function closest(element) {
  var nodes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  var until = arguments.length > 2 ? arguments[2] : void 0;
  var _Node = Node, ELEMENT_NODE = _Node.ELEMENT_NODE, DOCUMENT_FRAGMENT_NODE = _Node.DOCUMENT_FRAGMENT_NODE;
  var elementToCheck = element;
  while (elementToCheck !== null && elementToCheck !== void 0 && elementToCheck !== until) {
    var _elementToCheck = elementToCheck, nodeType = _elementToCheck.nodeType, nodeName = _elementToCheck.nodeName;
    if (nodeType === ELEMENT_NODE && (nodes.includes(nodeName) || nodes.includes(elementToCheck))) {
      return elementToCheck;
    }
    var _elementToCheck2 = elementToCheck, host = _elementToCheck2.host;
    if (host && nodeType === DOCUMENT_FRAGMENT_NODE) {
      elementToCheck = host;
    } else {
      elementToCheck = elementToCheck.parentNode;
    }
  }
  return null;
}
function closestDown(element, nodes, until) {
  var matched = [];
  var elementToCheck = element;
  while (elementToCheck) {
    elementToCheck = closest(elementToCheck, nodes, until);
    if (!elementToCheck || until && !until.contains(elementToCheck)) {
      break;
    }
    matched.push(elementToCheck);
    if (elementToCheck.host && elementToCheck.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      elementToCheck = elementToCheck.host;
    } else {
      elementToCheck = elementToCheck.parentNode;
    }
  }
  var length = matched.length;
  return length ? matched[length - 1] : null;
}
function isChildOf(child, parent) {
  var node = child.parentNode;
  var queriedParents = [];
  if (typeof parent === "string") {
    if (child.defaultView) {
      queriedParents = Array.prototype.slice.call(child.querySelectorAll(parent), 0);
    } else {
      queriedParents = Array.prototype.slice.call(child.ownerDocument.querySelectorAll(parent), 0);
    }
  } else {
    queriedParents.push(parent);
  }
  while (node !== null) {
    if (queriedParents.indexOf(node) > -1) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
function index(element) {
  var i = 0;
  var elementToCheck = element;
  if (elementToCheck.previousSibling) {
    while (elementToCheck = elementToCheck.previousSibling) {
      i += 1;
    }
  }
  return i;
}
function overlayContainsElement(overlayType, element, root) {
  var overlayElement = root.parentElement.querySelector(".ht_clone_".concat(overlayType));
  return overlayElement ? overlayElement.contains(element) : null;
}
var _hasClass;
var _addClass;
var _removeClass;
function filterEmptyClassNames(classNames) {
  if (!classNames || !classNames.length) {
    return [];
  }
  return classNames.filter(function(x) {
    return !!x;
  });
}
if (isClassListSupported()) {
  var isSupportMultipleClassesArg = function isSupportMultipleClassesArg2(rootDocument) {
    var element = rootDocument.createElement("div");
    element.classList.add("test", "test2");
    return element.classList.contains("test2");
  };
  _hasClass = function _hasClass2(element, className) {
    if (element.classList === void 0 || typeof className !== "string" || className === "") {
      return false;
    }
    return element.classList.contains(className);
  };
  _addClass = function _addClass2(element, classes) {
    var rootDocument = element.ownerDocument;
    var className = classes;
    if (typeof className === "string") {
      className = className.split(" ");
    }
    className = filterEmptyClassNames(className);
    if (className.length > 0) {
      if (isSupportMultipleClassesArg(rootDocument)) {
        var _element$classList;
        (_element$classList = element.classList).add.apply(_element$classList, _toConsumableArray$1(className));
      } else {
        var len = 0;
        while (className[len]) {
          element.classList.add(className[len]);
          len += 1;
        }
      }
    }
  };
  _removeClass = function _removeClass2(element, classes) {
    var rootDocument = element.ownerDocument;
    var className = classes;
    if (typeof className === "string") {
      className = className.split(" ");
    }
    className = filterEmptyClassNames(className);
    if (className.length > 0) {
      if (isSupportMultipleClassesArg(rootDocument)) {
        var _element$classList2;
        (_element$classList2 = element.classList).remove.apply(_element$classList2, _toConsumableArray$1(className));
      } else {
        var len = 0;
        while (className[len]) {
          element.classList.remove(className[len]);
          len += 1;
        }
      }
    }
  };
} else {
  var createClassNameRegExp = function createClassNameRegExp2(className) {
    return new RegExp("(\\s|^)".concat(className, "(\\s|$)"));
  };
  _hasClass = function _hasClass2(element, className) {
    return element.className !== void 0 && createClassNameRegExp(className).test(element.className);
  };
  _addClass = function _addClass2(element, classes) {
    var _className = element.className;
    var className = classes;
    if (typeof className === "string") {
      className = className.split(" ");
    }
    className = filterEmptyClassNames(className);
    if (_className === "") {
      _className = className.join(" ");
    } else {
      for (var len = 0; len < className.length; len++) {
        if (className[len] && !createClassNameRegExp(className[len]).test(_className)) {
          _className += " ".concat(className[len]);
        }
      }
    }
    element.className = _className;
  };
  _removeClass = function _removeClass2(element, classes) {
    var len = 0;
    var _className = element.className;
    var className = classes;
    if (typeof className === "string") {
      className = className.split(" ");
    }
    className = filterEmptyClassNames(className);
    while (className[len]) {
      _className = _className.replace(createClassNameRegExp(className[len]), " ").trim();
      len += 1;
    }
    if (element.className !== _className) {
      element.className = _className;
    }
  };
}
function hasClass(element, className) {
  return _hasClass(element, className);
}
function addClass(element, className) {
  _addClass(element, className);
}
function removeClass(element, className) {
  _removeClass(element, className);
}
function removeTextNodes(element) {
  if (element.nodeType === 3) {
    element.parentNode.removeChild(element);
  } else if (["TABLE", "THEAD", "TBODY", "TFOOT", "TR"].indexOf(element.nodeName) > -1) {
    var childs = element.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
      removeTextNodes(childs[i]);
    }
  }
}
function empty(element) {
  var child;
  while (child = element.lastChild) {
    element.removeChild(child);
  }
}
var HTML_CHARACTERS = /(<(.*)>|&(.*);)/;
function fastInnerHTML(element, content) {
  var sanitizeContent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
  if (HTML_CHARACTERS.test(content)) {
    element.innerHTML = sanitizeContent ? sanitize(content) : content;
  } else {
    fastInnerText(element, content);
  }
}
function fastInnerText(element, content) {
  var child = element.firstChild;
  if (child && child.nodeType === 3 && child.nextSibling === null) {
    if (isTextContentSupported) {
      child.textContent = content;
    } else {
      child.data = content;
    }
  } else {
    empty(element);
    element.appendChild(element.ownerDocument.createTextNode(content));
  }
}
function isVisible(element) {
  var documentElement = element.ownerDocument.documentElement;
  var next = element;
  while (next !== documentElement) {
    if (next === null) {
      return false;
    } else if (next.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      if (next.host) {
        if (next.host.impl) {
          return isVisible(next.host.impl);
        } else if (next.host) {
          return isVisible(next.host);
        }
        throw new Error("Lost in Web Components world");
      } else {
        return false;
      }
    } else if (next.style && next.style.display === "none") {
      return false;
    }
    next = next.parentNode;
  }
  return true;
}
function offset(element) {
  var rootDocument = element.ownerDocument;
  var rootWindow = rootDocument.defaultView;
  var documentElement = rootDocument.documentElement;
  var elementToCheck = element;
  var offsetLeft;
  var offsetTop;
  var lastElem;
  var box;
  if (hasCaptionProblem() && elementToCheck.firstChild && elementToCheck.firstChild.nodeName === "CAPTION") {
    box = elementToCheck.getBoundingClientRect();
    return {
      top: box.top + (rootWindow.pageYOffset || documentElement.scrollTop) - (documentElement.clientTop || 0),
      left: box.left + (rootWindow.pageXOffset || documentElement.scrollLeft) - (documentElement.clientLeft || 0)
    };
  }
  offsetLeft = elementToCheck.offsetLeft;
  offsetTop = elementToCheck.offsetTop;
  lastElem = elementToCheck;
  while (elementToCheck = elementToCheck.offsetParent) {
    if (elementToCheck === rootDocument.body) {
      break;
    }
    offsetLeft += elementToCheck.offsetLeft;
    offsetTop += elementToCheck.offsetTop;
    lastElem = elementToCheck;
  }
  if (lastElem && lastElem.style.position === "fixed") {
    offsetLeft += rootWindow.pageXOffset || documentElement.scrollLeft;
    offsetTop += rootWindow.pageYOffset || documentElement.scrollTop;
  }
  return {
    left: offsetLeft,
    top: offsetTop
  };
}
function getWindowScrollTop() {
  var rootWindow = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window;
  var res = rootWindow.scrollY;
  if (res === void 0) {
    res = rootWindow.document.documentElement.scrollTop;
  }
  return res;
}
function getWindowScrollLeft() {
  var rootWindow = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window;
  var res = rootWindow.scrollX;
  if (res === void 0) {
    res = rootWindow.document.documentElement.scrollLeft;
  }
  return res;
}
function getScrollTop(element) {
  var rootWindow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : window;
  if (element === rootWindow) {
    return getWindowScrollTop(rootWindow);
  }
  return element.scrollTop;
}
function getScrollLeft(element) {
  var rootWindow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : window;
  if (element === rootWindow) {
    return getWindowScrollLeft(rootWindow);
  }
  return element.scrollLeft;
}
function getScrollableElement(element) {
  var rootDocument = element.ownerDocument;
  var rootWindow = rootDocument ? rootDocument.defaultView : void 0;
  if (!rootDocument) {
    rootDocument = element.document ? element.document : element;
    rootWindow = rootDocument.defaultView;
  }
  var props = ["auto", "scroll"];
  var supportedGetComputedStyle = isGetComputedStyleSupported();
  var el = element.parentNode;
  while (el && el.style && rootDocument.body !== el) {
    var _el$style = el.style, overflow = _el$style.overflow, overflowX = _el$style.overflowX, overflowY = _el$style.overflowY;
    if ([overflow, overflowX, overflowY].includes("scroll")) {
      return el;
    } else if (supportedGetComputedStyle) {
      var _rootWindow$getComput = rootWindow.getComputedStyle(el);
      overflow = _rootWindow$getComput.overflow;
      overflowX = _rootWindow$getComput.overflowX;
      overflowY = _rootWindow$getComput.overflowY;
      if (props.includes(overflow) || props.includes(overflowX) || props.includes(overflowY)) {
        return el;
      }
    }
    if (el.clientHeight <= el.scrollHeight + 1 && (props.includes(overflowY) || props.includes(overflow))) {
      return el;
    }
    if (el.clientWidth <= el.scrollWidth + 1 && (props.includes(overflowX) || props.includes(overflow))) {
      return el;
    }
    el = el.parentNode;
  }
  return rootWindow;
}
function getTrimmingContainer(base) {
  var rootDocument = base.ownerDocument;
  var rootWindow = rootDocument.defaultView;
  var el = base.parentNode;
  while (el && el.style && rootDocument.body !== el) {
    if (el.style.overflow !== "visible" && el.style.overflow !== "") {
      return el;
    }
    var computedStyle = getComputedStyle(el, rootWindow);
    var allowedProperties = ["scroll", "hidden", "auto"];
    var property = computedStyle.getPropertyValue("overflow");
    var propertyY = computedStyle.getPropertyValue("overflow-y");
    var propertyX = computedStyle.getPropertyValue("overflow-x");
    if (allowedProperties.includes(property) || allowedProperties.includes(propertyY) || allowedProperties.includes(propertyX)) {
      return el;
    }
    el = el.parentNode;
  }
  return rootWindow;
}
function getStyle(element, prop) {
  var rootWindow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : window;
  if (!element) {
    return;
  } else if (element === rootWindow) {
    if (prop === "width") {
      return "".concat(rootWindow.innerWidth, "px");
    } else if (prop === "height") {
      return "".concat(rootWindow.innerHeight, "px");
    }
    return;
  }
  var styleProp = element.style[prop];
  if (styleProp !== "" && styleProp !== void 0) {
    return styleProp;
  }
  var computedStyle = getComputedStyle(element, rootWindow);
  if (computedStyle[prop] !== "" && computedStyle[prop] !== void 0) {
    return computedStyle[prop];
  }
}
function getComputedStyle(element) {
  var rootWindow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : window;
  return element.currentStyle || rootWindow.getComputedStyle(element);
}
function outerWidth(element) {
  return element.offsetWidth;
}
function outerHeight(element) {
  if (hasCaptionProblem() && element.firstChild && element.firstChild.nodeName === "CAPTION") {
    return element.offsetHeight + element.firstChild.offsetHeight;
  }
  return element.offsetHeight;
}
function innerHeight(element) {
  return element.clientHeight || element.innerHeight;
}
function innerWidth(element) {
  return element.clientWidth || element.innerWidth;
}
function getCaretPosition(el) {
  var rootDocument = el.ownerDocument;
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (rootDocument.selection) {
    el.focus();
    var r = rootDocument.selection.createRange();
    if (r === null) {
      return 0;
    }
    var re = el.createTextRange();
    var rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint("EndToStart", re);
    return rc.text.length;
  }
  return 0;
}
function getSelectionEndPosition(el) {
  var rootDocument = el.ownerDocument;
  if (el.selectionEnd) {
    return el.selectionEnd;
  } else if (rootDocument.selection) {
    var r = rootDocument.selection.createRange();
    if (r === null) {
      return 0;
    }
    var re = el.createTextRange();
    return re.text.indexOf(r.text) + r.text.length;
  }
  return 0;
}
function getSelectionText() {
  var rootWindow = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window;
  var rootDocument = rootWindow.document;
  var text = "";
  if (rootWindow.getSelection) {
    text = rootWindow.getSelection().toString();
  } else if (rootDocument.selection && rootDocument.selection.type !== "Control") {
    text = rootDocument.selection.createRange().text;
  }
  return text;
}
function clearTextSelection() {
  var rootWindow = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window;
  var rootDocument = rootWindow.document;
  if (rootWindow.getSelection) {
    if (rootWindow.getSelection().empty) {
      rootWindow.getSelection().empty();
    } else if (rootWindow.getSelection().removeAllRanges) {
      rootWindow.getSelection().removeAllRanges();
    }
  } else if (rootDocument.selection) {
    rootDocument.selection.empty();
  }
}
function setCaretPosition(element, pos, endPos) {
  if (endPos === void 0) {
    endPos = pos;
  }
  if (element.setSelectionRange) {
    element.focus();
    try {
      element.setSelectionRange(pos, endPos);
    } catch (err) {
      var elementParent = element.parentNode;
      var parentDisplayValue = elementParent.style.display;
      elementParent.style.display = "block";
      element.setSelectionRange(pos, endPos);
      elementParent.style.display = parentDisplayValue;
    }
  }
}
var cachedScrollbarWidth;
function walkontableCalculateScrollbarWidth() {
  var rootDocument = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  var inner = rootDocument.createElement("div");
  inner.style.height = "200px";
  inner.style.width = "100%";
  var outer = rootDocument.createElement("div");
  outer.style.boxSizing = "content-box";
  outer.style.height = "150px";
  outer.style.left = "0px";
  outer.style.overflow = "hidden";
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.width = "200px";
  outer.style.visibility = "hidden";
  outer.appendChild(inner);
  (rootDocument.body || rootDocument.documentElement).appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  var w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }
  (rootDocument.body || rootDocument.documentElement).removeChild(outer);
  return w1 - w2;
}
function getScrollbarWidth() {
  var rootDocument = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (cachedScrollbarWidth === void 0) {
    cachedScrollbarWidth = walkontableCalculateScrollbarWidth(rootDocument);
  }
  return cachedScrollbarWidth;
}
function hasVerticalScrollbar(element) {
  return element.offsetWidth !== element.clientWidth;
}
function hasHorizontalScrollbar(element) {
  return element.offsetHeight !== element.clientHeight;
}
function setOverlayPosition(overlayElem, left, top) {
  if (isIE9()) {
    overlayElem.style.top = top;
    overlayElem.style.left = left;
  } else if (isSafari()) {
    overlayElem.style["-webkit-transform"] = "translate3d(".concat(left, ",").concat(top, ",0)");
  } else {
    overlayElem.style.transform = "translate3d(".concat(left, ",").concat(top, ",0)");
  }
}
function resetCssTransform(element) {
  if (element.style.transform && element.style.transform !== "") {
    element.style.transform = "";
  } else if (element.style["-webkit-transform"] && element.style["-webkit-transform"] !== "") {
    element.style["-webkit-transform"] = "";
  }
}
function isInput(element) {
  var inputs = ["INPUT", "SELECT", "TEXTAREA"];
  return element && (inputs.indexOf(element.nodeName) > -1 || element.contentEditable === "true");
}
function isOutsideInput(element) {
  return isInput(element) && element.hasAttribute("data-hot-input") === false;
}
function selectElementIfAllowed(element) {
  var activeElement = element.ownerDocument.activeElement;
  if (!isOutsideInput(activeElement)) {
    element.select();
  }
}
function isDetached(element) {
  return !element.parentNode;
}

function isFunction(func) {
  return typeof func === "function";
}
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200;
  var lastTimer = null;
  var result;
  function _debounce() {
    var _this2 = this;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    if (lastTimer) {
      clearTimeout(lastTimer);
    }
    lastTimer = setTimeout(function() {
      result = func.apply(_this2, args);
    }, wait);
    return result;
  }
  return _debounce;
}
function partial(func) {
  for (var _len6 = arguments.length, params = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    params[_key6 - 1] = arguments[_key6];
  }
  return function _partial() {
    for (var _len7 = arguments.length, restParams = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      restParams[_key7] = arguments[_key7];
    }
    return func.apply(this, params.concat(restParams));
  };
}
function curry(func) {
  var argsLength = func.length;
  function given(argsSoFar) {
    return function _curry() {
      for (var _len8 = arguments.length, params = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        params[_key8] = arguments[_key8];
      }
      var passedArgsSoFar = argsSoFar.concat(params);
      var result;
      if (passedArgsSoFar.length >= argsLength) {
        result = func.apply(this, passedArgsSoFar);
      } else {
        result = given(passedArgsSoFar);
      }
      return result;
    };
  }
  return given([]);
}
function fastCall(func, context, arg1, arg2, arg3, arg4, arg5, arg6) {
  if (isDefined(arg6)) {
    return func.call(context, arg1, arg2, arg3, arg4, arg5, arg6);
  } else if (isDefined(arg5)) {
    return func.call(context, arg1, arg2, arg3, arg4, arg5);
  } else if (isDefined(arg4)) {
    return func.call(context, arg1, arg2, arg3, arg4);
  } else if (isDefined(arg3)) {
    return func.call(context, arg1, arg2, arg3);
  } else if (isDefined(arg2)) {
    return func.call(context, arg1, arg2);
  } else if (isDefined(arg1)) {
    return func.call(context, arg1);
  }
  return func.call(context);
}

var KEY_CODES = {
  ALT: 18,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  AUDIO_DOWN: isFirefox() ? 182 : 174,
  AUDIO_MUTE: isFirefox() ? 181 : 173,
  AUDIO_UP: isFirefox() ? 183 : 175,
  BACKSPACE: 8,
  CAPS_LOCK: 20,
  COMMA: 188,
  COMMAND_LEFT: 91,
  COMMAND_RIGHT: 93,
  COMMAND_FIREFOX: 224,
  CONTROL: 17,
  DELETE: 46,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  F16: 127,
  F17: 128,
  F18: 129,
  F19: 130,
  HOME: 36,
  INSERT: 45,
  MEDIA_NEXT: 176,
  MEDIA_PLAY_PAUSE: 179,
  MEDIA_PREV: 177,
  MEDIA_STOP: 178,
  NULL: 0,
  NUM_LOCK: 144,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PAUSE: 19,
  PERIOD: 190,
  SCROLL_LOCK: 145,
  SHIFT: 16,
  SPACE: 32,
  TAB: 9,
  A: 65,
  C: 67,
  D: 68,
  F: 70,
  L: 76,
  O: 79,
  P: 80,
  S: 83,
  V: 86,
  X: 88,
  Y: 89,
  Z: 90
};
var FUNCTION_KEYS = [KEY_CODES.ALT, KEY_CODES.ARROW_DOWN, KEY_CODES.ARROW_LEFT, KEY_CODES.ARROW_RIGHT, KEY_CODES.ARROW_UP, KEY_CODES.AUDIO_DOWN, KEY_CODES.AUDIO_MUTE, KEY_CODES.AUDIO_UP, KEY_CODES.BACKSPACE, KEY_CODES.CAPS_LOCK, KEY_CODES.DELETE, KEY_CODES.END, KEY_CODES.ENTER, KEY_CODES.ESCAPE, KEY_CODES.F1, KEY_CODES.F2, KEY_CODES.F3, KEY_CODES.F4, KEY_CODES.F5, KEY_CODES.F6, KEY_CODES.F7, KEY_CODES.F8, KEY_CODES.F9, KEY_CODES.F10, KEY_CODES.F11, KEY_CODES.F12, KEY_CODES.F13, KEY_CODES.F14, KEY_CODES.F15, KEY_CODES.F16, KEY_CODES.F17, KEY_CODES.F18, KEY_CODES.F19, KEY_CODES.HOME, KEY_CODES.INSERT, KEY_CODES.MEDIA_NEXT, KEY_CODES.MEDIA_PLAY_PAUSE, KEY_CODES.MEDIA_PREV, KEY_CODES.MEDIA_STOP, KEY_CODES.NULL, KEY_CODES.NUM_LOCK, KEY_CODES.PAGE_DOWN, KEY_CODES.PAGE_UP, KEY_CODES.PAUSE, KEY_CODES.SCROLL_LOCK, KEY_CODES.SHIFT, KEY_CODES.TAB];
function isPrintableChar(keyCode) {
  return keyCode === 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111 || keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222 || keyCode >= 226 || keyCode >= 65 && keyCode <= 90;
}
function isFunctionKey(keyCode) {
  return FUNCTION_KEYS.includes(keyCode);
}
function isCtrlMetaKey(keyCode) {
  return [KEY_CODES.CONTROL, KEY_CODES.COMMAND_LEFT, KEY_CODES.COMMAND_RIGHT, KEY_CODES.COMMAND_FIREFOX].includes(keyCode);
}
function isKey(keyCode, baseCode) {
  var keys = baseCode.split("|");
  var result = false;
  arrayEach(keys, function(key) {
    if (keyCode === KEY_CODES[key]) {
      result = true;
      return false;
    }
  });
  return result;
}

function stopImmediatePropagation(event) {
  event.isImmediatePropagationEnabled = false;
  event.cancelBubble = true;
}
function isImmediatePropagationStopped(event) {
  return event.isImmediatePropagationEnabled === false;
}
function isRightClick(event) {
  return event.button === 2;
}
function isLeftClick(event) {
  return event.button === 0;
}

function warn() {
  if (isDefined(console)) {
    var _console2;
    (_console2 = console).warn.apply(_console2, arguments);
  }
}
function error() {
  if (isDefined(console)) {
    var _console4;
    (_console4 = console).error.apply(_console4, arguments);
  }
}

var _templateObject$1;
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
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _taggedTemplateLiteral$1(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
var REGISTERED_HOOKS = [
  "afterCellMetaReset",
  "afterChange",
  "afterContextMenuDefaultOptions",
  "beforeContextMenuSetItems",
  "afterDropdownMenuDefaultOptions",
  "beforeDropdownMenuSetItems",
  "afterContextMenuHide",
  "beforeContextMenuShow",
  "afterContextMenuShow",
  "afterCopyLimit",
  "beforeCreateCol",
  "afterCreateCol",
  "beforeCreateRow",
  "afterCreateRow",
  "afterDeselect",
  "afterDestroy",
  "afterDocumentKeyDown",
  "afterDrawSelection",
  "beforeRemoveCellClassNames",
  "afterGetCellMeta",
  "afterGetColHeader",
  "afterGetRowHeader",
  "afterInit",
  "afterLoadData",
  "afterUpdateData",
  "afterMomentumScroll",
  "afterOnCellCornerMouseDown",
  "afterOnCellCornerDblClick",
  "afterOnCellMouseDown",
  "afterOnCellMouseUp",
  "afterOnCellContextMenu",
  "afterOnCellMouseOver",
  "afterOnCellMouseOut",
  "afterRemoveCol",
  "afterRemoveRow",
  "beforeRenderer",
  "afterRenderer",
  "afterScrollHorizontally",
  "afterScrollVertically",
  "afterSelection",
  "afterSelectionByProp",
  "afterSelectionEnd",
  "afterSelectionEndByProp",
  "afterSetCellMeta",
  "afterRemoveCellMeta",
  "afterSetDataAtCell",
  "afterSetDataAtRowProp",
  "afterSetSourceDataAtCell",
  "afterUpdateSettings",
  "afterValidate",
  "beforeLanguageChange",
  "afterLanguageChange",
  "beforeAutofill",
  "afterAutofill",
  "beforeCellAlignment",
  "beforeChange",
  "beforeChangeRender",
  "beforeDrawBorders",
  "beforeGetCellMeta",
  "beforeRemoveCellMeta",
  "beforeInit",
  "beforeInitWalkontable",
  "beforeLoadData",
  "beforeUpdateData",
  "beforeKeyDown",
  "beforeOnCellMouseDown",
  "beforeOnCellMouseUp",
  "beforeOnCellContextMenu",
  "beforeOnCellMouseOver",
  "beforeOnCellMouseOut",
  "beforeRemoveCol",
  "beforeRemoveRow",
  "beforeViewRender",
  "afterViewRender",
  "beforeRender",
  "afterRender",
  "beforeSetCellMeta",
  "beforeSetRangeStartOnly",
  "beforeSetRangeStart",
  "beforeSetRangeEnd",
  "beforeTouchScroll",
  "beforeValidate",
  "beforeValueRender",
  "construct",
  "init",
  "modifyColHeader",
  "modifyColWidth",
  "modifyRowHeader",
  "modifyRowHeight",
  "modifyData",
  "modifySourceData",
  "modifyRowData",
  "modifyGetCellCoords",
  "beforeHighlightingRowHeader",
  "beforeHighlightingColumnHeader",
  "persistentStateLoad",
  "persistentStateReset",
  "persistentStateSave",
  "beforeColumnSort",
  "afterColumnSort",
  "modifyAutofillRange",
  "modifyCopyableRange",
  "beforeCut",
  "afterCut",
  "beforeCopy",
  "afterCopy",
  "beforePaste",
  "afterPaste",
  "beforeColumnMove",
  "afterColumnMove",
  "beforeRowMove",
  "afterRowMove",
  "beforeColumnResize",
  "afterColumnResize",
  "beforeRowResize",
  "afterRowResize",
  "afterGetColumnHeaderRenderers",
  "afterGetRowHeaderRenderers",
  "beforeStretchingColumnWidth",
  "beforeFilter",
  "afterFilter",
  "afterFormulasValuesUpdate",
  "afterNamedExpressionAdded",
  "afterNamedExpressionRemoved",
  "afterSheetAdded",
  "afterSheetRenamed",
  "afterSheetRemoved",
  "modifyColumnHeaderHeight",
  "beforeUndo",
  "beforeUndoStackChange",
  "afterUndo",
  "afterUndoStackChange",
  "beforeRedo",
  "beforeRedoStackChange",
  "afterRedo",
  "afterRedoStackChange",
  "modifyRowHeaderWidth",
  "beforeAutofillInsidePopulate",
  "modifyTransformStart",
  "modifyTransformEnd",
  "afterModifyTransformStart",
  "afterModifyTransformEnd",
  "afterViewportRowCalculatorOverride",
  "afterViewportColumnCalculatorOverride",
  "afterPluginsInitialized",
  "beforeHideRows",
  "afterHideRows",
  "beforeUnhideRows",
  "afterUnhideRows",
  "beforeHideColumns",
  "afterHideColumns",
  "beforeUnhideColumns",
  "afterUnhideColumns",
  "beforeTrimRow",
  "afterTrimRow",
  "beforeUntrimRow",
  "afterUntrimRow",
  "beforeDropdownMenuShow",
  "afterDropdownMenuShow",
  "afterDropdownMenuHide",
  "beforeAddChild",
  "afterAddChild",
  "beforeDetachChild",
  "afterDetachChild",
  "afterBeginEditing",
  "beforeMergeCells",
  "afterMergeCells",
  "beforeUnmergeCells",
  "afterUnmergeCells",
  "afterListen",
  "afterUnlisten",
  "afterRefreshDimensions",
  "beforeRefreshDimensions",
  "beforeColumnCollapse",
  "afterColumnCollapse",
  "beforeColumnExpand",
  "afterColumnExpand",
  "modifyAutoColumnSizeSeed"
];
var REMOVED_MESSAGE = toSingleLine(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral$1(['The plugin hook "[hookName]" was removed in Handsontable [removedInVersion]. \n  Please consult release notes https://github.com/handsontable/handsontable/releases/tag/[removedInVersion] to \n  learn about the migration path.'], ['The plugin hook "[hookName]" was removed in Handsontable [removedInVersion].\\x20\n  Please consult release notes https://github.com/handsontable/handsontable/releases/tag/[removedInVersion] to\\x20\n  learn about the migration path.'])));
var REMOVED_HOOKS = new Map([["modifyRow", "8.0.0"], ["modifyCol", "8.0.0"], ["unmodifyRow", "8.0.0"], ["unmodifyCol", "8.0.0"], ["skipLengthCache", "8.0.0"], ["hiddenColumn", "8.0.0"], ["hiddenRow", "8.0.0"]]);
var DEPRECATED_HOOKS = new Map([["beforeAutofillInsidePopulate", 'The plugin hook "beforeAutofillInsidePopulate" is deprecated and will be removed in the next major release.']]);
var Hooks = /* @__PURE__ */ function() {
  function Hooks2() {
    _classCallCheck(this, Hooks2);
    this.globalBucket = this.createEmptyBucket();
  }
  _createClass(Hooks2, [{
    key: "createEmptyBucket",
    value: function createEmptyBucket() {
      var bucket = Object.create(null);
      arrayEach(REGISTERED_HOOKS, function(hook) {
        return bucket[hook] = [];
      });
      return bucket;
    }
  }, {
    key: "getBucket",
    value: function getBucket() {
      var context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      if (context) {
        if (!context.pluginHookBucket) {
          context.pluginHookBucket = this.createEmptyBucket();
        }
        return context.pluginHookBucket;
      }
      return this.globalBucket;
    }
  }, {
    key: "add",
    value: function add(key, callback) {
      var _this = this;
      var context = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (Array.isArray(callback)) {
        arrayEach(callback, function(c) {
          return _this.add(key, c, context);
        });
      } else {
        if (REMOVED_HOOKS.has(key)) {
          warn(substitute(REMOVED_MESSAGE, {
            hookName: key,
            removedInVersion: REMOVED_HOOKS.get(key)
          }));
        }
        if (DEPRECATED_HOOKS.has(key)) {
          warn(DEPRECATED_HOOKS.get(key));
        }
        var bucket = this.getBucket(context);
        if (typeof bucket[key] === "undefined") {
          this.register(key);
          bucket[key] = [];
        }
        callback.skip = false;
        if (bucket[key].indexOf(callback) === -1) {
          var foundInitialHook = false;
          if (callback.initialHook) {
            arrayEach(bucket[key], function(cb, i) {
              if (cb.initialHook) {
                bucket[key][i] = callback;
                foundInitialHook = true;
                return false;
              }
            });
          }
          if (!foundInitialHook) {
            bucket[key].push(callback);
          }
        }
      }
      return this;
    }
  }, {
    key: "once",
    value: function once(key, callback) {
      var _this2 = this;
      var context = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (Array.isArray(callback)) {
        arrayEach(callback, function(c) {
          return _this2.once(key, c, context);
        });
      } else {
        callback.runOnce = true;
        this.add(key, callback, context);
      }
    }
  }, {
    key: "remove",
    value: function remove(key, callback) {
      var context = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      var bucket = this.getBucket(context);
      if (typeof bucket[key] !== "undefined") {
        if (bucket[key].indexOf(callback) >= 0) {
          callback.skip = true;
          return true;
        }
      }
      return false;
    }
  }, {
    key: "has",
    value: function has(key) {
      var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
      var bucket = this.getBucket(context);
      return !!(bucket[key] !== void 0 && bucket[key].length);
    }
  }, {
    key: "run",
    value: function run(context, key, p1, p2, p3, p4, p5, p6) {
      {
        var globalHandlers = this.globalBucket[key];
        var length = globalHandlers ? globalHandlers.length : 0;
        var index = 0;
        if (length) {
          while (index < length) {
            if (!globalHandlers[index] || globalHandlers[index].skip) {
              index += 1;
              continue;
            }
            var res = fastCall(globalHandlers[index], context, p1, p2, p3, p4, p5, p6);
            if (res !== void 0) {
              p1 = res;
            }
            if (globalHandlers[index] && globalHandlers[index].runOnce) {
              this.remove(key, globalHandlers[index]);
            }
            index += 1;
          }
        }
      }
      {
        var localHandlers = this.getBucket(context)[key];
        var _length = localHandlers ? localHandlers.length : 0;
        var _index = 0;
        if (_length) {
          while (_index < _length) {
            if (!localHandlers[_index] || localHandlers[_index].skip) {
              _index += 1;
              continue;
            }
            var _res = fastCall(localHandlers[_index], context, p1, p2, p3, p4, p5, p6);
            if (_res !== void 0) {
              p1 = _res;
            }
            if (localHandlers[_index] && localHandlers[_index].runOnce) {
              this.remove(key, localHandlers[_index], context);
            }
            _index += 1;
          }
        }
      }
      return p1;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      objectEach(this.getBucket(context), function(value, key, bucket) {
        return bucket[key].length = 0;
      });
    }
  }, {
    key: "register",
    value: function register(key) {
      if (!this.isRegistered(key)) {
        REGISTERED_HOOKS.push(key);
      }
    }
  }, {
    key: "deregister",
    value: function deregister(key) {
      if (this.isRegistered(key)) {
        REGISTERED_HOOKS.splice(REGISTERED_HOOKS.indexOf(key), 1);
      }
    }
  }, {
    key: "isDeprecated",
    value: function isDeprecated(hookName) {
      return DEPRECATED_HOOKS.has(hookName) || REMOVED_HOOKS.has(hookName);
    }
  }, {
    key: "isRegistered",
    value: function isRegistered(hookName) {
      return REGISTERED_HOOKS.indexOf(hookName) >= 0;
    }
  }, {
    key: "getRegistered",
    value: function getRegistered() {
      return REGISTERED_HOOKS;
    }
  }], [{
    key: "getSingleton",
    value: function getSingleton() {
      return getGlobalSingleton();
    }
  }]);
  return Hooks2;
}();
var globalSingleton = new Hooks();
function getGlobalSingleton() {
  return globalSingleton;
}

function _toConsumableArray$2(arr) {
  return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$2();
}
function _nonIterableSpread$2() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2(o, minLen);
}
function _iterableToArray$2(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$2(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$2(arr);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var collection = new Map();
function staticRegister() {
  var namespace = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "common";
  if (!collection.has(namespace)) {
    collection.set(namespace, new Map());
  }
  var subCollection = collection.get(namespace);
  function register(name, item) {
    subCollection.set(name, item);
  }
  function getItem(name) {
    return subCollection.get(name);
  }
  function hasItem(name) {
    return subCollection.has(name);
  }
  function getNames() {
    return _toConsumableArray$2(subCollection.keys());
  }
  function getValues() {
    return _toConsumableArray$2(subCollection.values());
  }
  return {
    register,
    getItem,
    hasItem,
    getNames,
    getValues
  };
}

var registeredEditorClasses = new WeakMap();
var _staticRegister = staticRegister("editors"), register = _staticRegister.register, getItem = _staticRegister.getItem, hasItem = _staticRegister.hasItem;
function RegisteredEditor(editorClass) {
  var instances = {};
  var Clazz = editorClass;
  this.getConstructor = function() {
    return editorClass;
  };
  this.getInstance = function(hotInstance) {
    if (!(hotInstance.guid in instances)) {
      instances[hotInstance.guid] = new Clazz(hotInstance);
    }
    return instances[hotInstance.guid];
  };
  Hooks.getSingleton().add("afterDestroy", function() {
    instances[this.guid] = null;
  });
}
function _getEditorInstance(name, hotInstance) {
  var editor;
  if (typeof name === "function") {
    if (!registeredEditorClasses.get(name)) {
      _register(null, name);
    }
    editor = registeredEditorClasses.get(name);
  } else if (typeof name === "string") {
    editor = getItem(name);
  } else {
    throw Error('Only strings and functions can be passed as "editor" parameter');
  }
  if (!editor) {
    throw Error('No editor registered under name "'.concat(name, '"'));
  }
  return editor.getInstance(hotInstance);
}
function _register(name, editorClass) {
  if (name && typeof name !== "string") {
    editorClass = name;
    name = editorClass.EDITOR_TYPE;
  }
  var editorWrapper = new RegisteredEditor(editorClass);
  if (typeof name === "string") {
    register(name, editorWrapper);
  }
  registeredEditorClasses.set(editorClass, editorWrapper);
}

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var EventManager = /* @__PURE__ */ function() {
  function EventManager2() {
    var context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    _classCallCheck$1(this, EventManager2);
    this.context = context || this;
    if (!this.context.eventListeners) {
      this.context.eventListeners = [];
    }
  }
  _createClass$1(EventManager2, [{
    key: "addEventListener",
    value: function addEventListener(element, eventName, callback) {
      var _this = this;
      var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
      function callbackProxy(event) {
        callback.call(this, extendEvent(event));
      }
      if (typeof options !== "boolean" && !isPassiveEventSupported()) {
        options = false;
      }
      this.context.eventListeners.push({
        element,
        event: eventName,
        callback,
        callbackProxy,
        options,
        eventManager: this
      });
      element.addEventListener(eventName, callbackProxy, options);
      return function() {
        _this.removeEventListener(element, eventName, callback);
      };
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(element, eventName, callback) {
      var onlyOwnEvents = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
      var len = this.context.eventListeners.length;
      var tmpEvent;
      while (len) {
        len -= 1;
        tmpEvent = this.context.eventListeners[len];
        if (tmpEvent.event === eventName && tmpEvent.element === element) {
          if (callback && callback !== tmpEvent.callback) {
            continue;
          }
          if (onlyOwnEvents && tmpEvent.eventManager !== this) {
            continue;
          }
          this.context.eventListeners.splice(len, 1);
          tmpEvent.element.removeEventListener(tmpEvent.event, tmpEvent.callbackProxy, tmpEvent.options);
        }
      }
    }
  }, {
    key: "clearEvents",
    value: function clearEvents() {
      var onlyOwnEvents = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (!this.context) {
        return;
      }
      var len = this.context.eventListeners.length;
      while (len) {
        len -= 1;
        var event = this.context.eventListeners[len];
        if (onlyOwnEvents && event.eventManager !== this) {
          continue;
        }
        this.context.eventListeners.splice(len, 1);
        event.element.removeEventListener(event.event, event.callbackProxy, event.options);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.clearEvents();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.clearEvents();
      this.context = null;
    }
  }, {
    key: "destroyWithOwnEventsOnly",
    value: function destroyWithOwnEventsOnly() {
      this.clearEvents(true);
      this.context = null;
    }
  }, {
    key: "fireEvent",
    value: function fireEvent(element, eventName) {
      var rootDocument = element.document;
      var rootWindow = element;
      if (!rootDocument) {
        rootDocument = element.ownerDocument ? element.ownerDocument : element;
        rootWindow = rootDocument.defaultView;
      }
      var options = {
        bubbles: true,
        cancelable: eventName !== "mousemove",
        view: rootWindow,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: 1,
        clientY: 1,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: void 0
      };
      var event;
      if (rootDocument.createEvent) {
        event = rootDocument.createEvent("MouseEvents");
        event.initMouseEvent(eventName, options.bubbles, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button,  rootDocument.body.parentNode);
      } else {
        event = rootDocument.createEventObject();
      }
      if (element.dispatchEvent) {
        element.dispatchEvent(event);
      } else {
        element.fireEvent("on".concat(eventName), event);
      }
    }
  }]);
  return EventManager2;
}();
function extendEvent(event) {
  var nativeStopImmediatePropagation = event.stopImmediatePropagation;
  event.stopImmediatePropagation = function() {
    nativeStopImmediatePropagation.apply(this);
    stopImmediatePropagation(this);
  };
  return event;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$3(o, minLen);
}
function _arrayLikeToArray$3(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$2(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$2(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$2(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var SHORTCUTS_GROUP_NAVIGATION = "editorManager.navigation";
var SHORTCUTS_GROUP_EDITOR = "editorManager.handlingEditor";
var EditorManager = /* @__PURE__ */ function() {
  function EditorManager2(instance, tableMeta, selection) {
    var _this = this;
    _classCallCheck$2(this, EditorManager2);
    this.instance = instance;
    this.tableMeta = tableMeta;
    this.selection = selection;
    this.eventManager = new EventManager(instance);
    this.destroyed = false;
    this.lock = false;
    this.activeEditor = void 0;
    this.cellProperties = void 0;
    var shortcutManager = this.instance.getShortcutManager();
    shortcutManager.addContext("editor");
    this.registerShortcuts();
    this.instance.addHook("afterDocumentKeyDown", function(event2) {
      return _this.onAfterDocumentKeyDown(event2);
    });
    this.eventManager.addEventListener(this.instance.rootDocument.documentElement, "compositionstart", function(event2) {
      if (!_this.destroyed && _this.activeEditor && !_this.activeEditor.isOpened() && _this.instance.isListening()) {
        _this.openEditor("", event2);
      }
    });
    this.instance.view._wt.update("onCellDblClick", function(event2, coords, elem) {
      return _this.onCellDblClick(event2, coords, elem);
    });
  }
  _createClass$2(EditorManager2, [{
    key: "registerShortcuts",
    value: function registerShortcuts() {
      var _this2 = this;
      var shortcutManager = this.instance.getShortcutManager();
      var gridContext = shortcutManager.getContext("grid");
      var editorContext = shortcutManager.getContext("editor");
      var config = {
        group: SHORTCUTS_GROUP_EDITOR
      };
      editorContext.addShortcuts([{
        keys: [["Enter"], ["Enter", "Shift"], ["Enter", "Control/Meta"], ["Enter", "Control/Meta", "Shift"]],
        callback: function callback(event2, keys) {
          _this2.closeEditorAndSaveChanges(shortcutManager.isCtrlPressed());
          _this2.moveSelectionAfterEnter(keys.includes("shift"));
        }
      }, {
        keys: [["Escape"], ["Escape", "Control/Meta"]],
        callback: function callback() {
          _this2.closeEditorAndRestoreOriginalValue(shortcutManager.isCtrlPressed());
          _this2.activeEditor.focus();
        }
      }], config);
      gridContext.addShortcuts([{
        keys: [["F2"]],
        callback: function callback(event2) {
          if (_this2.activeEditor) {
            _this2.activeEditor.enableFullEditMode();
          }
          _this2.openEditor(null, event2);
        }
      }, {
        keys: [["Backspace"], ["Delete"]],
        callback: function callback() {
          _this2.instance.emptySelectedCells();
          _this2.prepareEditor();
        }
      }, {
        keys: [["Enter"], ["Enter", "Shift"]],
        callback: function callback(event2, keys) {
          if (_this2.instance.getSettings().enterBeginsEditing) {
            if (_this2.cellProperties.readOnly) {
              _this2.moveSelectionAfterEnter();
            } else if (_this2.activeEditor) {
              _this2.activeEditor.enableFullEditMode();
              _this2.openEditor(null, event2);
            }
          } else {
            _this2.moveSelectionAfterEnter(keys.includes("shift"));
          }
          stopImmediatePropagation(event2);
        }
      }], config);
    }
  }, {
    key: "lockEditor",
    value: function lockEditor() {
      this.lock = true;
    }
  }, {
    key: "unlockEditor",
    value: function unlockEditor() {
      this.lock = false;
    }
  }, {
    key: "destroyEditor",
    value: function destroyEditor(revertOriginal) {
      if (!this.lock) {
        this.closeEditor(revertOriginal);
      }
    }
  }, {
    key: "getActiveEditor",
    value: function getActiveEditor() {
      return this.activeEditor;
    }
  }, {
    key: "prepareEditor",
    value: function prepareEditor() {
      var _this3 = this;
      if (this.lock) {
        return;
      }
      if (this.activeEditor && this.activeEditor.isWaiting()) {
        this.closeEditor(false, false, function(dataSaved) {
          if (dataSaved) {
            _this3.prepareEditor();
          }
        });
        return;
      }
      var _this$instance$select = this.instance.selection.selectedRange.current().highlight, row = _this$instance$select.row, col = _this$instance$select.col;
      var modifiedCellCoords = this.instance.runHooks("modifyGetCellCoords", row, col);
      var visualRowToCheck = row;
      var visualColumnToCheck = col;
      if (Array.isArray(modifiedCellCoords)) {
        var _modifiedCellCoords = _slicedToArray(modifiedCellCoords, 2);
        visualRowToCheck = _modifiedCellCoords[0];
        visualColumnToCheck = _modifiedCellCoords[1];
      }
      this.cellProperties = this.instance.getCellMeta(visualRowToCheck, visualColumnToCheck);
      var activeElement = this.instance.rootDocument.activeElement;
      if (activeElement) {
        activeElement.blur();
      }
      if (this.cellProperties.readOnly) {
        this.clearActiveEditor();
        return;
      }
      var editorClass = this.instance.getCellEditor(this.cellProperties);
      var td = this.instance.getCell(row, col, true);
      if (editorClass && td) {
        var prop = this.instance.colToProp(visualColumnToCheck);
        var originalValue = this.instance.getSourceDataAtCell(this.instance.toPhysicalRow(visualRowToCheck), visualColumnToCheck);
        this.activeEditor = _getEditorInstance(editorClass, this.instance);
        this.activeEditor.prepare(row, col, prop, td, originalValue, this.cellProperties);
      } else {
        this.clearActiveEditor();
      }
    }
  }, {
    key: "isEditorOpened",
    value: function isEditorOpened() {
      return this.activeEditor && this.activeEditor.isOpened();
    }
  }, {
    key: "openEditor",
    value: function openEditor(newInitialValue, event2) {
      if (!this.activeEditor) {
        return;
      }
      this.activeEditor.beginEditing(newInitialValue, event2);
    }
  }, {
    key: "closeEditor",
    value: function closeEditor(restoreOriginalValue, isCtrlPressed, callback) {
      if (this.activeEditor) {
        this.activeEditor.finishEditing(restoreOriginalValue, isCtrlPressed, callback);
      } else if (callback) {
        callback(false);
      }
    }
  }, {
    key: "closeEditorAndSaveChanges",
    value: function closeEditorAndSaveChanges(isCtrlPressed) {
      this.closeEditor(false, isCtrlPressed);
    }
  }, {
    key: "closeEditorAndRestoreOriginalValue",
    value: function closeEditorAndRestoreOriginalValue(isCtrlPressed) {
      this.closeEditor(true, isCtrlPressed);
    }
  }, {
    key: "clearActiveEditor",
    value: function clearActiveEditor() {
      this.activeEditor = void 0;
    }
  }, {
    key: "moveSelectionAfterEnter",
    value: function moveSelectionAfterEnter(isShiftPressed) {
      var enterMoves = typeof this.tableMeta.enterMoves === "function" ? this.tableMeta.enterMoves(event) : this.tableMeta.enterMoves;
      if (isShiftPressed) {
        this.selection.transformStart(-enterMoves.row, -enterMoves.col);
      } else {
        this.selection.transformStart(enterMoves.row, enterMoves.col, true);
      }
    }
  }, {
    key: "onAfterDocumentKeyDown",
    value: function onAfterDocumentKeyDown(event2) {
      var _this4 = this;
      if (!this.instance.isListening()) {
        return;
      }
      var keyCode = event2.keyCode;
      if (keyCode === 229) {
        return;
      }
      if (!this.selection.isSelected()) {
        return;
      }
      var isCtrlPressed = (event2.ctrlKey || event2.metaKey) && !event2.altKey;
      if (this.activeEditor && !this.activeEditor.isWaiting()) {
        if (!isFunctionKey(keyCode) && !isCtrlMetaKey(keyCode) && !isCtrlPressed && !this.isEditorOpened()) {
          var shortcutManager = this.instance.getShortcutManager();
          var editorContext = shortcutManager.getContext("editor");
          var runOnlySelectedConfig = {
            runOnlyIf: function runOnlyIf() {
              return isDefined(_this4.instance.getSelected());
            },
            group: SHORTCUTS_GROUP_NAVIGATION
          };
          editorContext.addShortcuts([{
            keys: [["ArrowUp"]],
            callback: function callback() {
              _this4.instance.selection.transformStart(-1, 0);
            }
          }, {
            keys: [["ArrowDown"]],
            callback: function callback() {
              _this4.instance.selection.transformStart(1, 0);
            }
          }, {
            keys: [["ArrowLeft"]],
            callback: function callback() {
              _this4.instance.selection.transformStart(0, -1 * _this4.instance.getDirectionFactor());
            }
          }, {
            keys: [["ArrowRight"]],
            callback: function callback() {
              _this4.instance.selection.transformStart(0, _this4.instance.getDirectionFactor());
            }
          }], runOnlySelectedConfig);
          this.openEditor("", event2);
        }
      }
    }
  }, {
    key: "onCellDblClick",
    value: function onCellDblClick(event2, coords, elem) {
      if (elem.nodeName === "TD") {
        if (this.activeEditor) {
          this.activeEditor.enableFullEditMode();
        }
        this.openEditor(null, event2);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroyed = true;
      this.eventManager.destroy();
    }
  }]);
  return EditorManager2;
}();
var instances = new WeakMap();
EditorManager.getInstance = function(hotInstance, tableMeta, selection) {
  var editorManager = instances.get(hotInstance);
  if (!editorManager) {
    editorManager = new EditorManager(hotInstance, tableMeta, selection);
    instances.set(hotInstance, editorManager);
  }
  return editorManager;
};

// @@match logic
fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
      return matcher ? functionCall(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = toString_1(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

/* eslint-disable es-x/no-array-prototype-lastindexof -- safe */






var min = Math.min;
var $lastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO$1 = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD$1 = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO$1 || !STRICT_METHOD$1;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
var arrayLastIndexOf = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO$1) return functionApply($lastIndexOf, this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = lengthOfArrayLike(O);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toIntegerOrInfinity(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf;

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es-x/no-array-prototype-lastindexof -- required for testing
_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: arrayLastIndexOf
});

function _toConsumableArray$3(arr) {
  return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$4(arr) || _nonIterableSpread$3();
}
function _nonIterableSpread$3() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$4(o, minLen);
}
function _iterableToArray$3(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$3(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$4(arr);
}
function _arrayLikeToArray$4(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var ESCAPED_HTML_CHARS = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">"
};
var regEscapedChars = new RegExp(Object.keys(ESCAPED_HTML_CHARS).map(function(key) {
  return "(".concat(key, ")");
}).join("|"), "gi");
function isHTMLTable(element) {
  return (element && element.nodeName || "") === "TABLE";
}
function instanceToHTML(instance) {
  var hasColumnHeaders = instance.hasColHeaders();
  var hasRowHeaders = instance.hasRowHeaders();
  var coords = [hasColumnHeaders ? -1 : 0, hasRowHeaders ? -1 : 0, instance.countRows() - 1, instance.countCols() - 1];
  var data = instance.getData.apply(instance, coords);
  var countRows = data.length;
  var countCols = countRows > 0 ? data[0].length : 0;
  var TABLE = ["<table>", "</table>"];
  var THEAD = hasColumnHeaders ? ["<thead>", "</thead>"] : [];
  var TBODY = ["<tbody>", "</tbody>"];
  var rowModifier = hasRowHeaders ? 1 : 0;
  var columnModifier = hasColumnHeaders ? 1 : 0;
  for (var row = 0; row < countRows; row += 1) {
    var isColumnHeadersRow = hasColumnHeaders && row === 0;
    var CELLS = [];
    for (var column = 0; column < countCols; column += 1) {
      var isRowHeadersColumn = !isColumnHeadersRow && hasRowHeaders && column === 0;
      var cell = "";
      if (isColumnHeadersRow) {
        cell = "<th>".concat(instance.getColHeader(column - rowModifier), "</th>");
      } else if (isRowHeadersColumn) {
        cell = "<th>".concat(instance.getRowHeader(row - columnModifier), "</th>");
      } else {
        var cellData = data[row][column];
        var _instance$getCellMeta = instance.getCellMeta(row - columnModifier, column - rowModifier), hidden = _instance$getCellMeta.hidden, rowspan = _instance$getCellMeta.rowspan, colspan = _instance$getCellMeta.colspan;
        if (!hidden) {
          var attrs = [];
          if (rowspan) {
            attrs.push('rowspan="'.concat(rowspan, '"'));
          }
          if (colspan) {
            attrs.push('colspan="'.concat(colspan, '"'));
          }
          if (isEmpty(cellData)) {
            cell = "<td ".concat(attrs.join(" "), "></td>");
          } else {
            var value = cellData.toString().replace("<", "&lt;").replace(">", "&gt;").replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, "<br>\r\n").replace(/\x20/gi, "&nbsp;").replace(/\t/gi, "&#9;");
            cell = "<td ".concat(attrs.join(" "), ">").concat(value, "</td>");
          }
        }
      }
      CELLS.push(cell);
    }
    var TR = ["<tr>"].concat(CELLS, ["</tr>"]).join("");
    if (isColumnHeadersRow) {
      THEAD.splice(1, 0, TR);
    } else {
      TBODY.splice(-1, 0, TR);
    }
  }
  TABLE.splice(1, 0, THEAD.join(""), TBODY.join(""));
  return TABLE.join("");
}
function _dataToHTML(input) {
  var inputLen = input.length;
  var result = ["<table>"];
  for (var row = 0; row < inputLen; row += 1) {
    var rowData = input[row];
    var columnsLen = rowData.length;
    var columnsResult = [];
    if (row === 0) {
      result.push("<tbody>");
    }
    for (var column = 0; column < columnsLen; column += 1) {
      var cellData = rowData[column];
      var parsedCellData = isEmpty(cellData) ? "" : cellData.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, "<br>\r\n").replace(/\x20/gi, "&nbsp;").replace(/\t/gi, "&#9;");
      columnsResult.push("<td>".concat(parsedCellData, "</td>"));
    }
    result.push.apply(result, ["<tr>"].concat(columnsResult, ["</tr>"]));
    if (row + 1 === inputLen) {
      result.push("</tbody>");
    }
  }
  result.push("</table>");
  return result.join("");
}
function htmlToGridSettings(element) {
  var rootDocument = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document;
  var settingsObj = {};
  var fragment = rootDocument.createDocumentFragment();
  var tempElem = rootDocument.createElement("div");
  fragment.appendChild(tempElem);
  var checkElement = element;
  if (typeof checkElement === "string") {
    var escapedAdjacentHTML = checkElement.replace(/<td\b[^>]*?>([\s\S]*?)<\/\s*td>/g, function(cellFragment) {
      var openingTag = cellFragment.match(/<td\b[^>]*?>/g)[0];
      var cellValue2 = cellFragment.substring(openingTag.length, cellFragment.lastIndexOf("<")).replace(/(<(?!br)([^>]+)>)/gi, "");
      var closingTag = "</td>";
      return "".concat(openingTag).concat(cellValue2).concat(closingTag);
    });
    tempElem.insertAdjacentHTML("afterbegin", "".concat(escapedAdjacentHTML));
    checkElement = tempElem.querySelector("table");
  }
  if (!checkElement || !isHTMLTable(checkElement)) {
    return;
  }
  var generator = tempElem.querySelector('meta[name$="enerator"]');
  var hasRowHeaders = checkElement.querySelector("tbody th") !== null;
  var trElement = checkElement.querySelector("tr");
  var countCols = !trElement ? 0 : Array.from(trElement.cells).reduce(function(cols, cell2) {
    return cols + cell2.colSpan;
  }, 0) - (hasRowHeaders ? 1 : 0);
  var fixedRowsBottom = checkElement.tFoot && Array.from(checkElement.tFoot.rows) || [];
  var fixedRowsTop = [];
  var hasColHeaders = false;
  var thRowsLen = 0;
  var countRows = 0;
  if (checkElement.tHead) {
    var thRows = Array.from(checkElement.tHead.rows).filter(function(tr2) {
      var isDataRow = tr2.querySelector("td") !== null;
      if (isDataRow) {
        fixedRowsTop.push(tr2);
      }
      return !isDataRow;
    });
    thRowsLen = thRows.length;
    hasColHeaders = thRowsLen > 0;
    if (thRowsLen > 1) {
      settingsObj.nestedHeaders = Array.from(thRows).reduce(function(rows, row2) {
        var headersRow = Array.from(row2.cells).reduce(function(headers, header, currentIndex) {
          if (hasRowHeaders && currentIndex === 0) {
            return headers;
          }
          var colspan2 = header.colSpan, innerHTML2 = header.innerHTML;
          var nextHeader = colspan2 > 1 ? {
            label: innerHTML2,
            colspan: colspan2
          } : innerHTML2;
          headers.push(nextHeader);
          return headers;
        }, []);
        rows.push(headersRow);
        return rows;
      }, []);
    } else if (hasColHeaders) {
      settingsObj.colHeaders = Array.from(thRows[0].children).reduce(function(headers, header, index) {
        if (hasRowHeaders && index === 0) {
          return headers;
        }
        headers.push(header.innerHTML);
        return headers;
      }, []);
    }
  }
  if (fixedRowsTop.length) {
    settingsObj.fixedRowsTop = fixedRowsTop.length;
  }
  if (fixedRowsBottom.length) {
    settingsObj.fixedRowsBottom = fixedRowsBottom.length;
  }
  var dataRows = [].concat(fixedRowsTop, _toConsumableArray$3(Array.from(checkElement.tBodies).reduce(function(sections, section) {
    sections.push.apply(sections, _toConsumableArray$3(Array.from(section.rows)));
    return sections;
  }, [])), _toConsumableArray$3(fixedRowsBottom));
  countRows = dataRows.length;
  var dataArr = new Array(countRows);
  for (var r = 0; r < countRows; r++) {
    dataArr[r] = new Array(countCols);
  }
  var mergeCells = [];
  var rowHeaders = [];
  for (var row = 0; row < countRows; row++) {
    var tr = dataRows[row];
    var cells = Array.from(tr.cells);
    var cellsLen = cells.length;
    for (var cellId = 0; cellId < cellsLen; cellId++) {
      var cell = cells[cellId];
      var nodeName = cell.nodeName, innerHTML = cell.innerHTML, rowspan = cell.rowSpan, colspan = cell.colSpan;
      var col = dataArr[row].findIndex(function(value) {
        return value === void 0;
      });
      if (nodeName === "TD") {
        if (rowspan > 1 || colspan > 1) {
          for (var rstart = row; rstart < row + rowspan; rstart++) {
            if (rstart < countRows) {
              for (var cstart = col; cstart < col + colspan; cstart++) {
                dataArr[rstart][cstart] = null;
              }
            }
          }
          var styleAttr = cell.getAttribute("style");
          var ignoreMerge = styleAttr && styleAttr.includes("mso-ignore:colspan");
          if (!ignoreMerge) {
            mergeCells.push({
              col,
              row,
              rowspan,
              colspan
            });
          }
        }
        var cellValue = "";
        if (generator && /excel/gi.test(generator.content)) {
          cellValue = innerHTML.replace(/[\r\n][\x20]{0,2}/g, " ").replace(/<br(\s*|\/)>[\r\n]?[\x20]{0,3}/gim, "\r\n");
        } else {
          cellValue = innerHTML.replace(/<br(\s*|\/)>[\r\n]?/gim, "\r\n");
        }
        dataArr[row][col] = cellValue.replace(regEscapedChars, function(match) {
          return ESCAPED_HTML_CHARS[match];
        });
      } else {
        rowHeaders.push(innerHTML);
      }
    }
  }
  if (mergeCells.length) {
    settingsObj.mergeCells = mergeCells;
  }
  if (rowHeaders.length) {
    settingsObj.rowHeaders = rowHeaders;
  }
  if (dataArr.length) {
    settingsObj.data = dataArr;
  }
  return settingsObj;
}

function _toConsumableArray$4(arr) {
  return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _unsupportedIterableToArray$5(arr) || _nonIterableSpread$4();
}
function _nonIterableSpread$4() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$5(o, minLen);
}
function _iterableToArray$4(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$4(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$5(arr);
}
function _arrayLikeToArray$5(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _typeof$4(obj) {
  "@babel/helpers - typeof";
  return _typeof$4 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$4(obj);
}
function isNumeric(value) {
  var additionalDelimiters = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  var type = _typeof$4(value);
  if (type === "number") {
    return !isNaN(value) && isFinite(value);
  } else if (type === "string") {
    if (value.length === 0) {
      return false;
    } else if (value.length === 1) {
      return /\d/.test(value);
    }
    var delimiter = Array.from(new Set(["."].concat(_toConsumableArray$4(additionalDelimiters)))).map(function(d) {
      return "\\".concat(d);
    }).join("|");
    return new RegExp("^[+-]?\\s*(((".concat(delimiter, ")?\\d+((").concat(delimiter, ")\\d+)?(e[+-]?\\d+)?)|(0x[a-f\\d]+))$"), "i").test(value.trim());
  } else if (type === "object") {
    return !!value && typeof value.valueOf() === "number" && !(value instanceof Date);
  }
  return false;
}
function isNumericLike(value) {
  return isNumeric(value, [","]);
}
function rangeEach(rangeFrom, rangeTo, iteratee) {
  var index = -1;
  if (typeof rangeTo === "function") {
    iteratee = rangeTo;
    rangeTo = rangeFrom;
  } else {
    index = rangeFrom - 1;
  }
  while (++index <= rangeTo) {
    if (iteratee(index) === false) {
      break;
    }
  }
}
function rangeEachReverse(rangeFrom, rangeTo, iteratee) {
  var index = rangeFrom + 1;
  if (typeof rangeTo === "function") {
    iteratee = rangeTo;
    rangeTo = 0;
  }
  while (--index >= rangeTo) {
    if (iteratee(index) === false) {
      break;
    }
  }
}
function valueAccordingPercent(value, percent) {
  percent = parseInt(percent.toString().replace("%", ""), 10);
  percent = isNaN(percent) ? 0 : percent;
  return parseInt(value * percent / 100, 10);
}

function _toConsumableArray$5(arr) {
  return _arrayWithoutHoles$5(arr) || _iterableToArray$5(arr) || _unsupportedIterableToArray$6(arr) || _nonIterableSpread$5();
}
function _nonIterableSpread$5() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$5(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$5(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$6(arr);
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$6(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$6(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$6(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$6(o, minLen);
}
function _arrayLikeToArray$6(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$1(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr))
    return arr;
}
var ASC = "asc";
var DESC = "desc";
var ORDER_MAP = new Map([[ASC, [-1, 1]], [DESC, [1, -1]]]);
var DEFAULT_ERROR_PRIORITY_EXISTS = function DEFAULT_ERROR_PRIORITY_EXISTS2(priority) {
  return "The priority '".concat(priority, "' is already declared in a map.");
};
var DEFAULT_ERROR_PRIORITY_NAN = function DEFAULT_ERROR_PRIORITY_NAN2(priority) {
  return "The priority '".concat(priority, "' is not a number.");
};
function createPriorityMap() {
  var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, errorPriorityExists = _ref.errorPriorityExists, errorPriorityNaN = _ref.errorPriorityNaN;
  var priorityMap = new Map();
  errorPriorityExists = isFunction(errorPriorityExists) ? errorPriorityExists : DEFAULT_ERROR_PRIORITY_EXISTS;
  errorPriorityNaN = isFunction(errorPriorityNaN) ? errorPriorityNaN : DEFAULT_ERROR_PRIORITY_NAN;
  function addItem(priority, item) {
    if (!isNumeric(priority)) {
      throw new Error(errorPriorityNaN(priority));
    }
    if (priorityMap.has(priority)) {
      throw new Error(errorPriorityExists(priority));
    }
    priorityMap.set(priority, item);
  }
  function getItems() {
    var order = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ASC;
    var _ref2 = ORDER_MAP.get(order) || ORDER_MAP.get(ASC), _ref3 = _slicedToArray$1(_ref2, 2), left = _ref3[0], right = _ref3[1];
    return _toConsumableArray$5(priorityMap).sort(function(a, b) {
      return a[0] < b[0] ? left : right;
    }).map(function(item) {
      return item[1];
    });
  }
  return {
    addItem,
    getItems
  };
}

function _toConsumableArray$6(arr) {
  return _arrayWithoutHoles$6(arr) || _iterableToArray$6(arr) || _unsupportedIterableToArray$7(arr) || _nonIterableSpread$6();
}
function _nonIterableSpread$6() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$6(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$6(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$7(arr);
}
function _slicedToArray$2(arr, i) {
  return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$2();
}
function _nonIterableRest$2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$7(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$7(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$7(o, minLen);
}
function _arrayLikeToArray$7(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$2(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$2(arr) {
  if (Array.isArray(arr))
    return arr;
}
var DEFAULT_ERROR_ID_EXISTS = function DEFAULT_ERROR_ID_EXISTS2(id) {
  return "The id '".concat(id, "' is already declared in a map.");
};
function createUniqueMap() {
  var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, errorIdExists = _ref.errorIdExists;
  var uniqueMap = new Map();
  errorIdExists = isFunction(errorIdExists) ? errorIdExists : DEFAULT_ERROR_ID_EXISTS;
  function addItem(id, item) {
    if (hasItem(id)) {
      throw new Error(errorIdExists(id));
    }
    uniqueMap.set(id, item);
  }
  function removeItem(id) {
    return uniqueMap.delete(id);
  }
  function clear() {
    uniqueMap.clear();
  }
  function getId(item) {
    var _ref2 = getItems().find(function(_ref4) {
      var _ref5 = _slicedToArray$2(_ref4, 2), id = _ref5[0], element = _ref5[1];
      if (item === element) {
        return id;
      }
      return false;
    }) || [null], _ref3 = _slicedToArray$2(_ref2, 1), itemId = _ref3[0];
    return itemId;
  }
  function getItem(id) {
    return uniqueMap.get(id);
  }
  function getItems() {
    return _toConsumableArray$6(uniqueMap);
  }
  function hasItem(id) {
    return uniqueMap.has(id);
  }
  return {
    addItem,
    clear,
    getId,
    getItem,
    getItems,
    hasItem,
    removeItem
  };
}

function _toConsumableArray$7(arr) {
  return _arrayWithoutHoles$7(arr) || _iterableToArray$7(arr) || _unsupportedIterableToArray$8(arr) || _nonIterableSpread$7();
}
function _nonIterableSpread$7() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$8(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$8(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$8(o, minLen);
}
function _iterableToArray$7(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$7(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$8(arr);
}
function _arrayLikeToArray$8(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var DEFAULT_ERROR_ITEM_EXISTS = function DEFAULT_ERROR_ITEM_EXISTS2(item) {
  return "'".concat(item, "' value is already declared in a unique set.");
};
function createUniqueSet() {
  var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, errorItemExists = _ref.errorItemExists;
  var uniqueSet = new Set();
  errorItemExists = isFunction(errorItemExists) ? errorItemExists : DEFAULT_ERROR_ITEM_EXISTS;
  function addItem(item) {
    if (uniqueSet.has(item)) {
      throw new Error(errorItemExists(item));
    }
    uniqueSet.add(item);
  }
  function getItems() {
    return _toConsumableArray$7(uniqueSet);
  }
  function clear() {
    uniqueSet.clear();
  }
  return {
    addItem,
    clear,
    getItems
  };
}

function _slicedToArray$3(arr, i) {
  return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$9(arr, i) || _nonIterableRest$3();
}
function _nonIterableRest$3() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit$3(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$3(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _toConsumableArray$8(arr) {
  return _arrayWithoutHoles$8(arr) || _iterableToArray$8(arr) || _unsupportedIterableToArray$9(arr) || _nonIterableSpread$8();
}
function _nonIterableSpread$8() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$9(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$9(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$9(o, minLen);
}
function _iterableToArray$8(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$8(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$9(arr);
}
function _arrayLikeToArray$9(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var ERROR_PLUGIN_REGISTERED = function ERROR_PLUGIN_REGISTERED2(pluginName) {
  return 'There is already registered "'.concat(pluginName, '" plugin.');
};
var ERROR_PRIORITY_REGISTERED = function ERROR_PRIORITY_REGISTERED2(priority) {
  return 'There is already registered plugin on priority "'.concat(priority, '".');
};
var ERROR_PRIORITY_NAN = function ERROR_PRIORITY_NAN2(priority) {
  return 'The priority "'.concat(priority, '" is not a number.');
};
var priorityPluginsQueue = createPriorityMap({
  errorPriorityExists: ERROR_PRIORITY_REGISTERED,
  errorPriorityNaN: ERROR_PRIORITY_NAN
});
var uniquePluginsQueue = createUniqueSet({
  errorItemExists: ERROR_PLUGIN_REGISTERED
});
var uniquePluginsList = createUniqueMap({
  errorIdExists: ERROR_PLUGIN_REGISTERED
});
function getPluginsNames() {
  return [].concat(_toConsumableArray$8(priorityPluginsQueue.getItems()), _toConsumableArray$8(uniquePluginsQueue.getItems()));
}
function getPlugin(pluginName) {
  var unifiedPluginName = toUpperCaseFirst(pluginName);
  return uniquePluginsList.getItem(unifiedPluginName);
}
function hasPlugin(pluginName) {
  return getPlugin(pluginName) ? true : false;
}
function registerPlugin(pluginName, pluginClass, priority) {
  var _unifyPluginArguments = unifyPluginArguments(pluginName, pluginClass, priority);
  var _unifyPluginArguments2 = _slicedToArray$3(_unifyPluginArguments, 3);
  pluginName = _unifyPluginArguments2[0];
  pluginClass = _unifyPluginArguments2[1];
  priority = _unifyPluginArguments2[2];
  if (getPlugin(pluginName) === void 0) {
    _registerPlugin(pluginName, pluginClass, priority);
  }
}
function _registerPlugin(pluginName, pluginClass, priority) {
  var unifiedPluginName = toUpperCaseFirst(pluginName);
  if (uniquePluginsList.hasItem(unifiedPluginName)) {
    throw new Error(ERROR_PLUGIN_REGISTERED(unifiedPluginName));
  }
  if (priority === void 0) {
    uniquePluginsQueue.addItem(unifiedPluginName);
  } else {
    priorityPluginsQueue.addItem(priority, unifiedPluginName);
  }
  uniquePluginsList.addItem(unifiedPluginName, pluginClass);
}
function unifyPluginArguments(pluginName, pluginClass, priority) {
  if (typeof pluginName === "function") {
    pluginClass = pluginName;
    pluginName = pluginClass.PLUGIN_KEY;
    priority = pluginClass.PLUGIN_PRIORITY;
  }
  return [pluginName, pluginClass, priority];
}

var _staticRegister$1 = staticRegister("renderers"), register$1 = _staticRegister$1.register, getItem$1 = _staticRegister$1.getItem, hasItem$1 = _staticRegister$1.hasItem;
function _getItem(name) {
  if (typeof name === "function") {
    return name;
  }
  if (!hasItem$1(name)) {
    throw Error('No registered renderer found under "'.concat(name, '" name'));
  }
  return getItem$1(name);
}
function _register$1(name, renderer) {
  if (typeof name !== "string") {
    renderer = name;
    name = renderer.RENDERER_TYPE;
  }
  register$1(name, renderer);
}

var _staticRegister$2 = staticRegister("validators"), register$2 = _staticRegister$2.register, getItem$2 = _staticRegister$2.getItem, hasItem$2 = _staticRegister$2.hasItem;
function _getItem$1(name) {
  if (typeof name === "function") {
    return name;
  }
  if (!hasItem$2(name)) {
    throw Error('No registered validator found under "'.concat(name, '" name'));
  }
  return getItem$2(name);
}
function _register$2(name, validator) {
  if (typeof name !== "string") {
    validator = name;
    name = validator.VALIDATOR_TYPE;
  }
  register$2(name, validator);
}

var RENDER_TYPE = 1;
var FULLY_VISIBLE_TYPE = 2;

function _classCallCheck$3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$3(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$3(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$3(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$3(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var privatePool = new WeakMap();
var ViewportColumnsCalculator = /* @__PURE__ */ function() {
  function ViewportColumnsCalculator2() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, viewportSize = _ref.viewportSize, scrollOffset = _ref.scrollOffset, totalItems = _ref.totalItems, itemSizeFn = _ref.itemSizeFn, overrideFn = _ref.overrideFn, calculationType = _ref.calculationType, stretchMode = _ref.stretchMode, _ref$stretchingItemWi = _ref.stretchingItemWidthFn, stretchingItemWidthFn = _ref$stretchingItemWi === void 0 ? function(width) {
      return width;
    } : _ref$stretchingItemWi;
    _classCallCheck$3(this, ViewportColumnsCalculator2);
    privatePool.set(this, {
      viewportWidth: viewportSize,
      scrollOffset,
      totalColumns: totalItems,
      columnWidthFn: itemSizeFn,
      overrideFn,
      calculationType,
      stretchingColumnWidthFn: stretchingItemWidthFn
    });
    this.count = 0;
    this.startColumn = null;
    this.endColumn = null;
    this.startPosition = null;
    this.stretchAllRatio = 0;
    this.stretchLastWidth = 0;
    this.stretch = stretchMode;
    this.totalTargetWidth = 0;
    this.needVerifyLastColumnWidth = true;
    this.stretchAllColumnsWidth = [];
    this.calculate();
  }
  _createClass$3(ViewportColumnsCalculator2, [{
    key: "calculate",
    value: function calculate() {
      var sum = 0;
      var needReverse = true;
      var startPositions = [];
      var columnWidth;
      var priv = privatePool.get(this);
      var calculationType = priv.calculationType;
      var overrideFn = priv.overrideFn;
      var scrollOffset = priv.scrollOffset;
      var totalColumns = priv.totalColumns;
      var viewportWidth = priv.viewportWidth;
      for (var i = 0; i < totalColumns; i++) {
        columnWidth = this._getColumnWidth(i);
        if (sum <= scrollOffset && calculationType !== FULLY_VISIBLE_TYPE) {
          this.startColumn = i;
        }
        var compensatedViewportWidth = scrollOffset > 0 ? viewportWidth + 1 : viewportWidth;
        if (sum >= scrollOffset && sum + (calculationType === FULLY_VISIBLE_TYPE ? columnWidth : 0) <= scrollOffset + compensatedViewportWidth) {
          if (this.startColumn === null || this.startColumn === void 0) {
            this.startColumn = i;
          }
          this.endColumn = i;
        }
        startPositions.push(sum);
        sum += columnWidth;
        if (calculationType !== FULLY_VISIBLE_TYPE) {
          this.endColumn = i;
        }
        if (sum >= scrollOffset + viewportWidth) {
          needReverse = false;
          break;
        }
      }
      if (this.endColumn === totalColumns - 1 && needReverse) {
        this.startColumn = this.endColumn;
        while (this.startColumn > 0) {
          var viewportSum = startPositions[this.endColumn] + columnWidth - startPositions[this.startColumn - 1];
          if (viewportSum <= viewportWidth || calculationType !== FULLY_VISIBLE_TYPE) {
            this.startColumn -= 1;
          }
          if (viewportSum > viewportWidth) {
            break;
          }
        }
      }
      if (calculationType === RENDER_TYPE && this.startColumn !== null && overrideFn) {
        overrideFn(this);
      }
      this.startPosition = startPositions[this.startColumn];
      if (this.startPosition === void 0) {
        this.startPosition = null;
      }
      if (totalColumns < this.endColumn) {
        this.endColumn = totalColumns - 1;
      }
      if (this.startColumn !== null) {
        this.count = this.endColumn - this.startColumn + 1;
      }
    }
  }, {
    key: "refreshStretching",
    value: function refreshStretching(totalWidth) {
      if (this.stretch === "none") {
        return;
      }
      var totalColumnsWidth = totalWidth;
      this.totalTargetWidth = totalColumnsWidth;
      var priv = privatePool.get(this);
      var totalColumns = priv.totalColumns;
      var sumAll = 0;
      for (var i = 0; i < totalColumns; i++) {
        var columnWidth = this._getColumnWidth(i);
        var permanentColumnWidth = priv.stretchingColumnWidthFn(void 0, i);
        if (typeof permanentColumnWidth === "number") {
          totalColumnsWidth -= permanentColumnWidth;
        } else {
          sumAll += columnWidth;
        }
      }
      var remainingSize = totalColumnsWidth - sumAll;
      if (this.stretch === "all" && remainingSize > 0) {
        this.stretchAllRatio = totalColumnsWidth / sumAll;
        this.stretchAllColumnsWidth = [];
        this.needVerifyLastColumnWidth = true;
      } else if (this.stretch === "last" && totalColumnsWidth !== Infinity) {
        var _columnWidth = this._getColumnWidth(totalColumns - 1);
        var lastColumnWidth = remainingSize + _columnWidth;
        this.stretchLastWidth = lastColumnWidth >= 0 ? lastColumnWidth : _columnWidth;
      }
    }
  }, {
    key: "getStretchedColumnWidth",
    value: function getStretchedColumnWidth(column, baseWidth) {
      var result = null;
      if (this.stretch === "all" && this.stretchAllRatio !== 0) {
        result = this._getStretchedAllColumnWidth(column, baseWidth);
      } else if (this.stretch === "last" && this.stretchLastWidth !== 0) {
        result = this._getStretchedLastColumnWidth(column);
      }
      return result;
    }
  }, {
    key: "_getStretchedAllColumnWidth",
    value: function _getStretchedAllColumnWidth(column, baseWidth) {
      var sumRatioWidth = 0;
      var priv = privatePool.get(this);
      var totalColumns = priv.totalColumns;
      if (!this.stretchAllColumnsWidth[column]) {
        var stretchedWidth = Math.round(baseWidth * this.stretchAllRatio);
        var newStretchedWidth = priv.stretchingColumnWidthFn(stretchedWidth, column);
        if (newStretchedWidth === void 0) {
          this.stretchAllColumnsWidth[column] = stretchedWidth;
        } else {
          this.stretchAllColumnsWidth[column] = isNaN(newStretchedWidth) ? this._getColumnWidth(column) : newStretchedWidth;
        }
      }
      if (this.stretchAllColumnsWidth.length === totalColumns && this.needVerifyLastColumnWidth) {
        this.needVerifyLastColumnWidth = false;
        for (var i = 0; i < this.stretchAllColumnsWidth.length; i++) {
          sumRatioWidth += this.stretchAllColumnsWidth[i];
        }
        if (sumRatioWidth !== this.totalTargetWidth) {
          this.stretchAllColumnsWidth[this.stretchAllColumnsWidth.length - 1] += this.totalTargetWidth - sumRatioWidth;
        }
      }
      return this.stretchAllColumnsWidth[column];
    }
  }, {
    key: "_getStretchedLastColumnWidth",
    value: function _getStretchedLastColumnWidth(column) {
      var priv = privatePool.get(this);
      var totalColumns = priv.totalColumns;
      if (column === totalColumns - 1) {
        return this.stretchLastWidth;
      }
      return null;
    }
  }, {
    key: "_getColumnWidth",
    value: function _getColumnWidth(column) {
      var width = privatePool.get(this).columnWidthFn(column);
      if (isNaN(width)) {
        width = ViewportColumnsCalculator2.DEFAULT_WIDTH;
      }
      return width;
    }
  }], [{
    key: "DEFAULT_WIDTH",
    get: function get() {
      return 50;
    }
  }]);
  return ViewportColumnsCalculator2;
}();

function _classCallCheck$4(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$4(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$4(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$4(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$4(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var privatePool$1 = new WeakMap();
var ViewportRowsCalculator = /* @__PURE__ */ function() {
  function ViewportRowsCalculator2() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, viewportSize = _ref.viewportSize, scrollOffset = _ref.scrollOffset, totalItems = _ref.totalItems, itemSizeFn = _ref.itemSizeFn, overrideFn = _ref.overrideFn, calculationType = _ref.calculationType, scrollbarHeight = _ref.scrollbarHeight;
    _classCallCheck$4(this, ViewportRowsCalculator2);
    privatePool$1.set(this, {
      viewportHeight: viewportSize,
      scrollOffset,
      totalRows: totalItems,
      rowHeightFn: itemSizeFn,
      overrideFn,
      calculationType,
      horizontalScrollbarHeight: scrollbarHeight
    });
    this.count = 0;
    this.startRow = null;
    this.endRow = null;
    this.startPosition = null;
    this.calculate();
  }
  _createClass$4(ViewportRowsCalculator2, [{
    key: "calculate",
    value: function calculate() {
      var sum = 0;
      var needReverse = true;
      var startPositions = [];
      var priv = privatePool$1.get(this);
      var calculationType = priv.calculationType;
      var overrideFn = priv.overrideFn;
      var rowHeightFn = priv.rowHeightFn;
      var scrollOffset = priv.scrollOffset;
      var totalRows = priv.totalRows;
      var viewportHeight = priv.viewportHeight;
      var horizontalScrollbarHeight = priv.horizontalScrollbarHeight || 0;
      var rowHeight;
      for (var i = 0; i < totalRows; i++) {
        rowHeight = rowHeightFn(i);
        if (isNaN(rowHeight)) {
          rowHeight = ViewportRowsCalculator2.DEFAULT_HEIGHT;
        }
        if (sum <= scrollOffset && calculationType !== FULLY_VISIBLE_TYPE) {
          this.startRow = i;
        }
        if (sum >= scrollOffset && sum + (calculationType === FULLY_VISIBLE_TYPE ? rowHeight : 0) <= scrollOffset + viewportHeight - horizontalScrollbarHeight) {
          if (this.startRow === null) {
            this.startRow = i;
          }
          this.endRow = i;
        }
        startPositions.push(sum);
        sum += rowHeight;
        if (calculationType !== FULLY_VISIBLE_TYPE) {
          this.endRow = i;
        }
        if (sum >= scrollOffset + viewportHeight - horizontalScrollbarHeight) {
          needReverse = false;
          break;
        }
      }
      if (this.endRow === totalRows - 1 && needReverse) {
        this.startRow = this.endRow;
        while (this.startRow > 0) {
          var viewportSum = startPositions[this.endRow] + rowHeight - startPositions[this.startRow - 1];
          if (viewportSum <= viewportHeight - horizontalScrollbarHeight || calculationType !== FULLY_VISIBLE_TYPE) {
            this.startRow -= 1;
          }
          if (viewportSum >= viewportHeight - horizontalScrollbarHeight) {
            break;
          }
        }
      }
      if (calculationType === RENDER_TYPE && this.startRow !== null && overrideFn) {
        overrideFn(this);
      }
      this.startPosition = startPositions[this.startRow];
      if (this.startPosition === void 0) {
        this.startPosition = null;
      }
      if (totalRows < this.endRow) {
        this.endRow = totalRows - 1;
      }
      if (this.startRow !== null) {
        this.count = this.endRow - this.startRow + 1;
      }
    }
  }], [{
    key: "DEFAULT_HEIGHT",
    get: function get() {
      return 23;
    }
  }]);
  return ViewportRowsCalculator2;
}();

function _classCallCheck$5(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$5(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$5(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$5(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$5(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
var _isRtl = /* @__PURE__ */ new WeakMap();
var CellCoords = /* @__PURE__ */ function() {
  function CellCoords2(row, column) {
    var isRtl = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    _classCallCheck$5(this, CellCoords2);
    _defineProperty$1(this, "row", null);
    _defineProperty$1(this, "col", null);
    _classPrivateFieldInitSpec(this, _isRtl, {
      writable: true,
      value: false
    });
    _classPrivateFieldSet(this, _isRtl, isRtl);
    if (typeof row !== "undefined" && typeof column !== "undefined") {
      this.row = row;
      this.col = column;
    }
  }
  _createClass$5(CellCoords2, [{
    key: "isValid",
    value: function isValid(wot) {
      if (this.row < 0 || this.col < 0) {
        return false;
      }
      if (this.row >= wot.getSetting("totalRows") || this.col >= wot.getSetting("totalColumns")) {
        return false;
      }
      return true;
    }
  }, {
    key: "isEqual",
    value: function isEqual(cellCoords) {
      if (cellCoords === this) {
        return true;
      }
      return this.row === cellCoords.row && this.col === cellCoords.col;
    }
  }, {
    key: "isSouthEastOf",
    value: function isSouthEastOf(testedCoords) {
      return this.row >= testedCoords.row && (_classPrivateFieldGet(this, _isRtl) ? this.col <= testedCoords.col : this.col >= testedCoords.col);
    }
  }, {
    key: "isNorthWestOf",
    value: function isNorthWestOf(testedCoords) {
      return this.row <= testedCoords.row && (_classPrivateFieldGet(this, _isRtl) ? this.col >= testedCoords.col : this.col <= testedCoords.col);
    }
  }, {
    key: "isSouthWestOf",
    value: function isSouthWestOf(testedCoords) {
      return this.row >= testedCoords.row && (_classPrivateFieldGet(this, _isRtl) ? this.col >= testedCoords.col : this.col <= testedCoords.col);
    }
  }, {
    key: "isNorthEastOf",
    value: function isNorthEastOf(testedCoords) {
      return this.row <= testedCoords.row && (_classPrivateFieldGet(this, _isRtl) ? this.col <= testedCoords.col : this.col >= testedCoords.col);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      this.row = this.row === null ? this.row : Math.max(this.row, 0);
      this.col = this.col === null ? this.col : Math.max(this.col, 0);
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new CellCoords2(this.row, this.col, _classPrivateFieldGet(this, _isRtl));
    }
  }, {
    key: "toObject",
    value: function toObject() {
      return {
        row: this.row,
        col: this.col
      };
    }
  }]);
  return CellCoords2;
}();

function _classCallCheck$6(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$6(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$6(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$6(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$6(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classPrivateFieldInitSpec$1(obj, privateMap, value) {
  _checkPrivateRedeclaration$1(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration$1(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classPrivateFieldGet$1(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "get");
  return _classApplyDescriptorGet$1(receiver, descriptor);
}
function _classApplyDescriptorGet$1(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classPrivateFieldSet$1(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "set");
  _classApplyDescriptorSet$1(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor$1(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorSet$1(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
var _isRtl$1 = /* @__PURE__ */ new WeakMap();
var CellRange = /* @__PURE__ */ function() {
  function CellRange2(highlight) {
    var from = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : highlight;
    var to = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : highlight;
    var isRtl = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    _classCallCheck$6(this, CellRange2);
    _defineProperty$2(this, "highlight", null);
    _defineProperty$2(this, "from", null);
    _defineProperty$2(this, "to", null);
    _classPrivateFieldInitSpec$1(this, _isRtl$1, {
      writable: true,
      value: false
    });
    this.highlight = highlight.clone().normalize();
    this.from = from.clone();
    this.to = to.clone();
    _classPrivateFieldSet$1(this, _isRtl$1, isRtl);
  }
  _createClass$6(CellRange2, [{
    key: "setHighlight",
    value: function setHighlight(coords) {
      this.highlight = coords.clone().normalize();
      return this;
    }
  }, {
    key: "setFrom",
    value: function setFrom(coords) {
      this.from = coords.clone();
      return this;
    }
  }, {
    key: "setTo",
    value: function setTo(coords) {
      this.to = coords.clone();
      return this;
    }
  }, {
    key: "isValid",
    value: function isValid(wot) {
      return this.from.isValid(wot) && this.to.isValid(wot);
    }
  }, {
    key: "isSingle",
    value: function isSingle() {
      return this.from.row >= 0 && this.from.row === this.to.row && this.from.col >= 0 && this.from.col === this.to.col;
    }
  }, {
    key: "getOuterHeight",
    value: function getOuterHeight() {
      return Math.max(this.from.row, this.to.row) - Math.min(this.from.row, this.to.row) + 1;
    }
  }, {
    key: "getOuterWidth",
    value: function getOuterWidth() {
      return Math.max(this.from.col, this.to.col) - Math.min(this.from.col, this.to.col) + 1;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      var fromRow = Math.max(this.from.row, 0);
      var toRow = Math.max(this.to.row, 0);
      return Math.max(fromRow, toRow) - Math.min(fromRow, toRow) + 1;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      var fromCol = Math.max(this.from.col, 0);
      var toCol = Math.max(this.to.col, 0);
      return Math.max(fromCol, toCol) - Math.min(fromCol, toCol) + 1;
    }
  }, {
    key: "getCellsCount",
    value: function getCellsCount() {
      return this.getWidth() * this.getHeight();
    }
  }, {
    key: "includes",
    value: function includes(cellCoords) {
      var row = cellCoords.row, col = cellCoords.col;
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      return topStart.row <= row && bottomEnd.row >= row && topStart.col <= col && bottomEnd.col >= col;
    }
  }, {
    key: "includesRange",
    value: function includesRange(cellRange) {
      return this.includes(cellRange.getOuterTopStartCorner()) && this.includes(cellRange.getOuterBottomEndCorner());
    }
  }, {
    key: "isEqual",
    value: function isEqual(cellRange) {
      return Math.min(this.from.row, this.to.row) === Math.min(cellRange.from.row, cellRange.to.row) && Math.max(this.from.row, this.to.row) === Math.max(cellRange.from.row, cellRange.to.row) && Math.min(this.from.col, this.to.col) === Math.min(cellRange.from.col, cellRange.to.col) && Math.max(this.from.col, this.to.col) === Math.max(cellRange.from.col, cellRange.to.col);
    }
  }, {
    key: "overlaps",
    value: function overlaps(cellRange) {
      return cellRange.isSouthEastOf(this.getOuterTopLeftCorner()) && cellRange.isNorthWestOf(this.getOuterBottomRightCorner());
    }
  }, {
    key: "isSouthEastOf",
    value: function isSouthEastOf(cellRange) {
      return this.getOuterTopLeftCorner().isSouthEastOf(cellRange) || this.getOuterBottomRightCorner().isSouthEastOf(cellRange);
    }
  }, {
    key: "isNorthWestOf",
    value: function isNorthWestOf(cellRange) {
      return this.getOuterTopLeftCorner().isNorthWestOf(cellRange) || this.getOuterBottomRightCorner().isNorthWestOf(cellRange);
    }
  }, {
    key: "isOverlappingHorizontally",
    value: function isOverlappingHorizontally(cellRange) {
      return this.getOuterTopRightCorner().col >= cellRange.getOuterTopLeftCorner().col && this.getOuterTopRightCorner().col <= cellRange.getOuterTopRightCorner().col || this.getOuterTopLeftCorner().col <= cellRange.getOuterTopRightCorner().col && this.getOuterTopLeftCorner().col >= cellRange.getOuterTopLeftCorner().col;
    }
  }, {
    key: "isOverlappingVertically",
    value: function isOverlappingVertically(cellRange) {
      return this.getOuterBottomRightCorner().row >= cellRange.getOuterTopRightCorner().row && this.getOuterBottomRightCorner().row <= cellRange.getOuterBottomRightCorner().row || this.getOuterTopRightCorner().row <= cellRange.getOuterBottomRightCorner().row && this.getOuterTopRightCorner().row >= cellRange.getOuterTopRightCorner().row;
    }
  }, {
    key: "expand",
    value: function expand(cellCoords) {
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      if (cellCoords.row < topStart.row || cellCoords.col < topStart.col || cellCoords.row > bottomEnd.row || cellCoords.col > bottomEnd.col) {
        this.from = this._createCellCoords(Math.min(topStart.row, cellCoords.row), Math.min(topStart.col, cellCoords.col));
        this.to = this._createCellCoords(Math.max(bottomEnd.row, cellCoords.row), Math.max(bottomEnd.col, cellCoords.col));
        return true;
      }
      return false;
    }
  }, {
    key: "expandByRange",
    value: function expandByRange(expandingRange) {
      if (this.includesRange(expandingRange) || !this.overlaps(expandingRange)) {
        return false;
      }
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      var initialDirection = this.getDirection();
      var expandingTopStart = expandingRange.getOuterTopStartCorner();
      var expandingBottomEnd = expandingRange.getOuterBottomEndCorner();
      var resultTopRow = Math.min(topStart.row, expandingTopStart.row);
      var resultTopCol = Math.min(topStart.col, expandingTopStart.col);
      var resultBottomRow = Math.max(bottomEnd.row, expandingBottomEnd.row);
      var resultBottomCol = Math.max(bottomEnd.col, expandingBottomEnd.col);
      var finalFrom = this._createCellCoords(resultTopRow, resultTopCol);
      var finalTo = this._createCellCoords(resultBottomRow, resultBottomCol);
      this.from = finalFrom;
      this.to = finalTo;
      this.setDirection(initialDirection);
      if (this.highlight.row === this.getOuterBottomRightCorner().row && this.getVerticalDirection() === "N-S") {
        this.flipDirectionVertically();
      }
      if (this.highlight.col === this.getOuterTopRightCorner().col && this.getHorizontalDirection() === "W-E") {
        this.flipDirectionHorizontally();
      }
      return true;
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      if (this.from.isNorthWestOf(this.to)) {
        return "NW-SE";
      } else if (this.from.isNorthEastOf(this.to)) {
        return "NE-SW";
      } else if (this.from.isSouthEastOf(this.to)) {
        return "SE-NW";
      } else if (this.from.isSouthWestOf(this.to)) {
        return "SW-NE";
      }
    }
  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      switch (direction) {
        case "NW-SE":
          var _ref = [this.getOuterTopLeftCorner(), this.getOuterBottomRightCorner()];
          this.from = _ref[0];
          this.to = _ref[1];
          break;
        case "NE-SW":
          var _ref2 = [this.getOuterTopRightCorner(), this.getOuterBottomLeftCorner()];
          this.from = _ref2[0];
          this.to = _ref2[1];
          break;
        case "SE-NW":
          var _ref3 = [this.getOuterBottomRightCorner(), this.getOuterTopLeftCorner()];
          this.from = _ref3[0];
          this.to = _ref3[1];
          break;
        case "SW-NE":
          var _ref4 = [this.getOuterBottomLeftCorner(), this.getOuterTopRightCorner()];
          this.from = _ref4[0];
          this.to = _ref4[1];
          break;
      }
    }
  }, {
    key: "getVerticalDirection",
    value: function getVerticalDirection() {
      return ["NE-SW", "NW-SE"].indexOf(this.getDirection()) > -1 ? "N-S" : "S-N";
    }
  }, {
    key: "getHorizontalDirection",
    value: function getHorizontalDirection() {
      return ["NW-SE", "SW-NE"].indexOf(this.getDirection()) > -1 ? "W-E" : "E-W";
    }
  }, {
    key: "flipDirectionVertically",
    value: function flipDirectionVertically() {
      var direction = this.getDirection();
      switch (direction) {
        case "NW-SE":
          this.setDirection("SW-NE");
          break;
        case "NE-SW":
          this.setDirection("SE-NW");
          break;
        case "SE-NW":
          this.setDirection("NE-SW");
          break;
        case "SW-NE":
          this.setDirection("NW-SE");
          break;
      }
    }
  }, {
    key: "flipDirectionHorizontally",
    value: function flipDirectionHorizontally() {
      var direction = this.getDirection();
      switch (direction) {
        case "NW-SE":
          this.setDirection("NE-SW");
          break;
        case "NE-SW":
          this.setDirection("NW-SE");
          break;
        case "SE-NW":
          this.setDirection("SW-NE");
          break;
        case "SW-NE":
          this.setDirection("SE-NW");
          break;
      }
    }
  }, {
    key: "getTopStartCorner",
    value: function getTopStartCorner() {
      return this._createCellCoords(Math.min(this.from.row, this.to.row), Math.min(this.from.col, this.to.col)).normalize();
    }
  }, {
    key: "getTopLeftCorner",
    value: function getTopLeftCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getTopEndCorner() : this.getTopStartCorner();
    }
  }, {
    key: "getBottomEndCorner",
    value: function getBottomEndCorner() {
      return this._createCellCoords(Math.max(this.from.row, this.to.row), Math.max(this.from.col, this.to.col)).normalize();
    }
  }, {
    key: "getBottomRightCorner",
    value: function getBottomRightCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getBottomStartCorner() : this.getBottomEndCorner();
    }
  }, {
    key: "getTopEndCorner",
    value: function getTopEndCorner() {
      return this._createCellCoords(Math.min(this.from.row, this.to.row), Math.max(this.from.col, this.to.col)).normalize();
    }
  }, {
    key: "getTopRightCorner",
    value: function getTopRightCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getTopStartCorner() : this.getTopEndCorner();
    }
  }, {
    key: "getBottomStartCorner",
    value: function getBottomStartCorner() {
      return this._createCellCoords(Math.max(this.from.row, this.to.row), Math.min(this.from.col, this.to.col)).normalize();
    }
  }, {
    key: "getBottomLeftCorner",
    value: function getBottomLeftCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getBottomEndCorner() : this.getBottomStartCorner();
    }
  }, {
    key: "getOuterTopStartCorner",
    value: function getOuterTopStartCorner() {
      return this._createCellCoords(Math.min(this.from.row, this.to.row), Math.min(this.from.col, this.to.col));
    }
  }, {
    key: "getOuterTopLeftCorner",
    value: function getOuterTopLeftCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getOuterTopEndCorner() : this.getOuterTopStartCorner();
    }
  }, {
    key: "getOuterBottomEndCorner",
    value: function getOuterBottomEndCorner() {
      return this._createCellCoords(Math.max(this.from.row, this.to.row), Math.max(this.from.col, this.to.col));
    }
  }, {
    key: "getOuterBottomRightCorner",
    value: function getOuterBottomRightCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getOuterBottomStartCorner() : this.getOuterBottomEndCorner();
    }
  }, {
    key: "getOuterTopEndCorner",
    value: function getOuterTopEndCorner() {
      return this._createCellCoords(Math.min(this.from.row, this.to.row), Math.max(this.from.col, this.to.col));
    }
  }, {
    key: "getOuterTopRightCorner",
    value: function getOuterTopRightCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getOuterTopStartCorner() : this.getOuterTopEndCorner();
    }
  }, {
    key: "getOuterBottomStartCorner",
    value: function getOuterBottomStartCorner() {
      return this._createCellCoords(Math.max(this.from.row, this.to.row), Math.min(this.from.col, this.to.col));
    }
  }, {
    key: "getOuterBottomLeftCorner",
    value: function getOuterBottomLeftCorner() {
      return _classPrivateFieldGet$1(this, _isRtl$1) ? this.getOuterBottomEndCorner() : this.getOuterBottomStartCorner();
    }
  }, {
    key: "isCorner",
    value: function isCorner(coords, expandedRange) {
      if (expandedRange && expandedRange.includes(coords) && (this.getOuterTopLeftCorner().isEqual(this._createCellCoords(expandedRange.from.row, expandedRange.from.col)) || this.getOuterTopRightCorner().isEqual(this._createCellCoords(expandedRange.from.row, expandedRange.to.col)) || this.getOuterBottomLeftCorner().isEqual(this._createCellCoords(expandedRange.to.row, expandedRange.from.col)) || this.getOuterBottomRightCorner().isEqual(this._createCellCoords(expandedRange.to.row, expandedRange.to.col)))) {
        return true;
      }
      return coords.isEqual(this.getOuterTopLeftCorner()) || coords.isEqual(this.getOuterTopRightCorner()) || coords.isEqual(this.getOuterBottomLeftCorner()) || coords.isEqual(this.getOuterBottomRightCorner());
    }
  }, {
    key: "getOppositeCorner",
    value: function getOppositeCorner(coords, expandedRange) {
      if (!(coords instanceof CellCoords)) {
        return false;
      }
      if (expandedRange) {
        var from = expandedRange.from, to = expandedRange.to;
        if (expandedRange.includes(coords)) {
          if (this.getOuterTopStartCorner().isEqual(this._createCellCoords(from.row, from.col))) {
            return this.getOuterBottomEndCorner();
          }
          if (this.getOuterTopEndCorner().isEqual(this._createCellCoords(from.row, to.col))) {
            return this.getOuterBottomStartCorner();
          }
          if (this.getOuterBottomStartCorner().isEqual(this._createCellCoords(to.row, from.col))) {
            return this.getOuterTopEndCorner();
          }
          if (this.getOuterBottomEndCorner().isEqual(this._createCellCoords(to.row, to.col))) {
            return this.getOuterTopStartCorner();
          }
        }
      }
      if (coords.isEqual(this.getOuterBottomEndCorner())) {
        return this.getOuterTopStartCorner();
      } else if (coords.isEqual(this.getOuterTopStartCorner())) {
        return this.getOuterBottomEndCorner();
      } else if (coords.isEqual(this.getOuterTopEndCorner())) {
        return this.getOuterBottomStartCorner();
      } else if (coords.isEqual(this.getOuterBottomStartCorner())) {
        return this.getOuterTopEndCorner();
      }
    }
  }, {
    key: "getBordersSharedWith",
    value: function getBordersSharedWith(range) {
      if (!this.includesRange(range)) {
        return [];
      }
      var thisBorders = {
        top: Math.min(this.from.row, this.to.row),
        bottom: Math.max(this.from.row, this.to.row),
        left: Math.min(this.from.col, this.to.col),
        right: Math.max(this.from.col, this.to.col)
      };
      var rangeBorders = {
        top: Math.min(range.from.row, range.to.row),
        bottom: Math.max(range.from.row, range.to.row),
        left: Math.min(range.from.col, range.to.col),
        right: Math.max(range.from.col, range.to.col)
      };
      var result = [];
      if (thisBorders.top === rangeBorders.top) {
        result.push("top");
      }
      if (thisBorders.right === rangeBorders.right) {
        result.push("right");
      }
      if (thisBorders.bottom === rangeBorders.bottom) {
        result.push("bottom");
      }
      if (thisBorders.left === rangeBorders.left) {
        result.push("left");
      }
      return result;
    }
  }, {
    key: "getInner",
    value: function getInner() {
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      var out = [];
      for (var r = topStart.row; r <= bottomEnd.row; r++) {
        for (var c = topStart.col; c <= bottomEnd.col; c++) {
          if (!(this.from.row === r && this.from.col === c) && !(this.to.row === r && this.to.col === c)) {
            out.push(this._createCellCoords(r, c));
          }
        }
      }
      return out;
    }
  }, {
    key: "getAll",
    value: function getAll() {
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      var out = [];
      for (var r = topStart.row; r <= bottomEnd.row; r++) {
        for (var c = topStart.col; c <= bottomEnd.col; c++) {
          if (topStart.row === r && topStart.col === c) {
            out.push(topStart);
          } else if (bottomEnd.row === r && bottomEnd.col === c) {
            out.push(bottomEnd);
          } else {
            out.push(this._createCellCoords(r, c));
          }
        }
      }
      return out;
    }
  }, {
    key: "forAll",
    value: function forAll(callback) {
      var topStart = this.getOuterTopStartCorner();
      var bottomEnd = this.getOuterBottomEndCorner();
      for (var r = topStart.row; r <= bottomEnd.row; r++) {
        for (var c = topStart.col; c <= bottomEnd.col; c++) {
          var breakIteration = callback(r, c);
          if (breakIteration === false) {
            return;
          }
        }
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new CellRange2(this.highlight, this.from, this.to, _classPrivateFieldGet$1(this, _isRtl$1));
    }
  }, {
    key: "toObject",
    value: function toObject() {
      return {
        from: this.from.toObject(),
        to: this.to.toObject()
      };
    }
  }, {
    key: "_createCellCoords",
    value: function _createCellCoords(row, column) {
      return new CellCoords(row, column, _classPrivateFieldGet$1(this, _isRtl$1));
    }
  }]);
  return CellRange2;
}();

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

function _classCallCheck$7(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$7(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$7(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$7(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$7(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var privatePool$2 = new WeakMap();
var Event = /* @__PURE__ */ function() {
  function Event2(facadeGetter, domBindings, wtSettings, eventManager, wtTable, selections) {
    var parent = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : null;
    _classCallCheck$7(this, Event2);
    this.wtSettings = wtSettings;
    this.domBindings = domBindings;
    this.wtTable = wtTable;
    this.selections = selections;
    this.parent = parent;
    this.eventManager = eventManager;
    this.facadeGetter = facadeGetter;
    privatePool$2.set(this, {
      selectedCellBeforeTouchEnd: void 0,
      dblClickTimeout: [null, null],
      dblClickOrigin: [null, null]
    });
    this.registerEvents();
  }
  _createClass$7(Event2, [{
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;
      this.eventManager.addEventListener(this.wtTable.holder, "contextmenu", function(event) {
        return _this.onContextMenu(event);
      });
      this.eventManager.addEventListener(this.wtTable.TABLE, "mouseover", function(event) {
        return _this.onMouseOver(event);
      });
      this.eventManager.addEventListener(this.wtTable.TABLE, "mouseout", function(event) {
        return _this.onMouseOut(event);
      });
      var initTouchEvents = function initTouchEvents2() {
        _this.eventManager.addEventListener(_this.wtTable.holder, "touchstart", function(event) {
          return _this.onTouchStart(event);
        });
        _this.eventManager.addEventListener(_this.wtTable.holder, "touchend", function(event) {
          return _this.onTouchEnd(event);
        });
        if (!_this.momentumScrolling) {
          _this.momentumScrolling = {};
        }
        _this.eventManager.addEventListener(_this.wtTable.holder, "scroll", function() {
          clearTimeout(_this.momentumScrolling._timeout);
          if (!_this.momentumScrolling.ongoing) {
            _this.wtSettings.getSetting("onBeforeTouchScroll");
          }
          _this.momentumScrolling.ongoing = true;
          _this.momentumScrolling._timeout = setTimeout(function() {
            if (!_this.touchApplied) {
              _this.momentumScrolling.ongoing = false;
              _this.wtSettings.getSetting("onAfterMomentumScroll");
            }
          }, 200);
        });
      };
      var initMouseEvents = function initMouseEvents2() {
        _this.eventManager.addEventListener(_this.wtTable.holder, "mouseup", function(event) {
          return _this.onMouseUp(event);
        });
        _this.eventManager.addEventListener(_this.wtTable.holder, "mousedown", function(event) {
          return _this.onMouseDown(event);
        });
      };
      if (isMobileBrowser()) {
        initTouchEvents();
      } else {
        if (isTouchSupported()) {
          initTouchEvents();
        }
        initMouseEvents();
      }
    }
  }, {
    key: "selectedCellWasTouched",
    value: function selectedCellWasTouched(touchTarget) {
      var priv = privatePool$2.get(this);
      var cellUnderFinger = this.parentCell(touchTarget);
      var coordsOfCellUnderFinger = cellUnderFinger.coords;
      if (priv.selectedCellBeforeTouchEnd && coordsOfCellUnderFinger) {
        var _ref = [coordsOfCellUnderFinger.row, priv.selectedCellBeforeTouchEnd.from.row], rowTouched = _ref[0], rowSelected = _ref[1];
        var _ref2 = [coordsOfCellUnderFinger.col, priv.selectedCellBeforeTouchEnd.from.col], colTouched = _ref2[0], colSelected = _ref2[1];
        return rowTouched === rowSelected && colTouched === colSelected;
      }
      return false;
    }
  }, {
    key: "parentCell",
    value: function parentCell(elem) {
      var cell = {};
      var TABLE = this.wtTable.TABLE;
      var TD = closestDown(elem, ["TD", "TH"], TABLE);
      if (TD) {
        cell.coords = this.wtTable.getCoords(TD);
        cell.TD = TD;
      } else if (hasClass(elem, "wtBorder") && hasClass(elem, "current")) {
        cell.coords = this.selections.getCell().cellRange.highlight;
        cell.TD = this.wtTable.getCell(cell.coords);
      } else if (hasClass(elem, "wtBorder") && hasClass(elem, "area")) {
        if (this.selections.createOrGetArea().cellRange) {
          cell.coords = this.selections.createOrGetArea().cellRange.to;
          cell.TD = this.wtTable.getCell(cell.coords);
        }
      }
      return cell;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      var priv = privatePool$2.get(this);
      var activeElement = this.domBindings.rootDocument.activeElement;
      var getParentNode = partial(getParent, event.target);
      var realTarget = event.target;
      if (realTarget === activeElement || getParentNode(0) === activeElement || getParentNode(1) === activeElement) {
        return;
      }
      var cell = this.parentCell(realTarget);
      if (hasClass(realTarget, "corner")) {
        this.wtSettings.getSetting("onCellCornerMouseDown", event, realTarget);
      } else if (cell.TD && this.wtSettings.has("onCellMouseDown")) {
        this.callListener("onCellMouseDown", event, cell.coords, cell.TD);
      }
      if ((event.button === 0 || this.touchApplied) && cell.TD) {
        priv.dblClickOrigin[0] = cell.TD;
        clearTimeout(priv.dblClickTimeout[0]);
        priv.dblClickTimeout[0] = setTimeout(function() {
          priv.dblClickOrigin[0] = null;
        }, 1e3);
      }
    }
  }, {
    key: "onContextMenu",
    value: function onContextMenu(event) {
      if (this.wtSettings.has("onCellContextMenu")) {
        var cell = this.parentCell(event.target);
        if (cell.TD) {
          this.callListener("onCellContextMenu", event, cell.coords, cell.TD);
        }
      }
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(event) {
      if (!this.wtSettings.has("onCellMouseOver")) {
        return;
      }
      var table = this.wtTable.TABLE;
      var td = closestDown(event.target, ["TD", "TH"], table);
      var parent = this.parent || this;
      if (td && td !== parent.lastMouseOver && isChildOf(td, table)) {
        parent.lastMouseOver = td;
        this.callListener("onCellMouseOver", event, this.wtTable.getCoords(td), td);
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut(event) {
      if (!this.wtSettings.has("onCellMouseOut")) {
        return;
      }
      var table = this.wtTable.TABLE;
      var lastTD = closestDown(event.target, ["TD", "TH"], table);
      var nextTD = closestDown(event.relatedTarget, ["TD", "TH"], table);
      if (lastTD && lastTD !== nextTD && isChildOf(lastTD, table)) {
        this.callListener("onCellMouseOut", event, this.wtTable.getCoords(lastTD), lastTD);
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(event) {
      var priv = privatePool$2.get(this);
      var cell = this.parentCell(event.target);
      if (cell.TD && this.wtSettings.has("onCellMouseUp")) {
        this.callListener("onCellMouseUp", event, cell.coords, cell.TD);
      }
      if (event.button !== 0 && !this.touchApplied) {
        return;
      }
      if (cell.TD === priv.dblClickOrigin[0] && cell.TD === priv.dblClickOrigin[1]) {
        if (hasClass(event.target, "corner")) {
          this.callListener("onCellCornerDblClick", event, cell.coords, cell.TD);
        } else {
          this.callListener("onCellDblClick", event, cell.coords, cell.TD);
        }
        priv.dblClickOrigin[0] = null;
        priv.dblClickOrigin[1] = null;
      } else if (cell.TD === priv.dblClickOrigin[0]) {
        priv.dblClickOrigin[1] = cell.TD;
        clearTimeout(priv.dblClickTimeout[1]);
        priv.dblClickTimeout[1] = setTimeout(function() {
          priv.dblClickOrigin[1] = null;
        }, 500);
      }
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(event) {
      var priv = privatePool$2.get(this);
      priv.selectedCellBeforeTouchEnd = this.selections.getCell().cellRange;
      this.touchApplied = true;
      this.onMouseDown(event);
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd(event) {
      var _this$parentCell;
      var target = event.target;
      var parentCellCoords = (_this$parentCell = this.parentCell(target)) === null || _this$parentCell === void 0 ? void 0 : _this$parentCell.coords;
      var isCellsRange = isDefined(parentCellCoords) && parentCellCoords.row >= 0 && parentCellCoords.col >= 0;
      var isEventCancelable = event.cancelable && isCellsRange && this.wtSettings.getSetting("isDataViewInstance");
      if (isEventCancelable) {
        var interactiveElements = ["A", "BUTTON", "INPUT"];
        if (isIOS() && (isChromeWebKit() || isFirefoxWebKit()) && this.selectedCellWasTouched(target) && !interactiveElements.includes(target.tagName)) {
          event.preventDefault();
        } else if (!this.selectedCellWasTouched(target)) {
          event.preventDefault();
        }
      }
      this.onMouseUp(event);
      this.touchApplied = false;
    }
  }, {
    key: "callListener",
    value: function callListener(name, event, coords, target) {
      var listener = this.wtSettings.getSettingPure(name);
      if (listener) {
        listener(event, coords, target, this.facadeGetter());
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var priv = privatePool$2.get(this);
      clearTimeout(priv.dblClickTimeout[0]);
      clearTimeout(priv.dblClickTimeout[1]);
      this.eventManager.destroy();
    }
  }]);
  return Event2;
}();

function _classCallCheck$8(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$8(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$8(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$8(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$8(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var ColumnFilter = /* @__PURE__ */ function() {
  function ColumnFilter2(offset, total, countTH) {
    _classCallCheck$8(this, ColumnFilter2);
    this.offset = offset;
    this.total = total;
    this.countTH = countTH;
  }
  _createClass$8(ColumnFilter2, [{
    key: "offsetted",
    value: function offsetted(index) {
      return index + this.offset;
    }
  }, {
    key: "unOffsetted",
    value: function unOffsetted(index) {
      return index - this.offset;
    }
  }, {
    key: "renderedToSource",
    value: function renderedToSource(index) {
      return this.offsetted(index);
    }
  }, {
    key: "sourceToRendered",
    value: function sourceToRendered(index) {
      return this.unOffsetted(index);
    }
  }, {
    key: "offsettedTH",
    value: function offsettedTH(index) {
      return index - this.countTH;
    }
  }, {
    key: "unOffsettedTH",
    value: function unOffsettedTH(index) {
      return index + this.countTH;
    }
  }, {
    key: "visibleRowHeadedColumnToSourceColumn",
    value: function visibleRowHeadedColumnToSourceColumn(index) {
      return this.renderedToSource(this.offsettedTH(index));
    }
  }, {
    key: "sourceColumnToVisibleRowHeadedColumn",
    value: function sourceColumnToVisibleRowHeadedColumn(index) {
      return this.unOffsettedTH(this.sourceToRendered(index));
    }
  }]);
  return ColumnFilter2;
}();

function _classCallCheck$9(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$9(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$9(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$9(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$9(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var RowFilter = /* @__PURE__ */ function() {
  function RowFilter2(offset, total, countTH) {
    _classCallCheck$9(this, RowFilter2);
    this.offset = offset;
    this.total = total;
    this.countTH = countTH;
  }
  _createClass$9(RowFilter2, [{
    key: "offsetted",
    value: function offsetted(index) {
      return index + this.offset;
    }
  }, {
    key: "unOffsetted",
    value: function unOffsetted(index) {
      return index - this.offset;
    }
  }, {
    key: "renderedToSource",
    value: function renderedToSource(index) {
      return this.offsetted(index);
    }
  }, {
    key: "sourceToRendered",
    value: function sourceToRendered(index) {
      return this.unOffsetted(index);
    }
  }, {
    key: "offsettedTH",
    value: function offsettedTH(index) {
      return index - this.countTH;
    }
  }, {
    key: "unOffsettedTH",
    value: function unOffsettedTH(index) {
      return index + this.countTH;
    }
  }, {
    key: "visibleColHeadedRowToSourceRow",
    value: function visibleColHeadedRowToSourceRow(index) {
      return this.renderedToSource(this.offsettedTH(index));
    }
  }, {
    key: "sourceRowToVisibleColHeadedRow",
    value: function sourceRowToVisibleColHeadedRow(index) {
      return this.unOffsettedTH(this.sourceToRendered(index));
    }
  }]);
  return RowFilter2;
}();

var WORKING_SPACE_ALL = 0;
var WORKING_SPACE_TOP = 1;
var WORKING_SPACE_BOTTOM = 2;

function _classCallCheck$a(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$a(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$a(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$a(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$a(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var ViewSize = /* @__PURE__ */ function() {
  function ViewSize2() {
    _classCallCheck$a(this, ViewSize2);
    this.currentSize = 0;
    this.nextSize = 0;
    this.currentOffset = 0;
    this.nextOffset = 0;
  }
  _createClass$a(ViewSize2, [{
    key: "setSize",
    value: function setSize(size) {
      this.currentSize = this.nextSize;
      this.nextSize = size;
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this.currentOffset = this.nextOffset;
      this.nextOffset = offset;
    }
  }]);
  return ViewSize2;
}();

function _classCallCheck$b(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$b(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$b(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$b(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$b(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var ViewSizeSet = /* @__PURE__ */ function() {
  function ViewSizeSet2() {
    _classCallCheck$b(this, ViewSizeSet2);
    this.size = new ViewSize();
    this.workingSpace = WORKING_SPACE_ALL;
    this.sharedSize = null;
  }
  _createClass$b(ViewSizeSet2, [{
    key: "setSize",
    value: function setSize(size) {
      this.size.setSize(size);
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this.size.setOffset(offset);
    }
  }, {
    key: "getViewSize",
    value: function getViewSize() {
      return this.size;
    }
  }, {
    key: "isShared",
    value: function isShared() {
      return this.sharedSize instanceof ViewSize;
    }
  }, {
    key: "isPlaceOn",
    value: function isPlaceOn(workingSpace) {
      return this.workingSpace === workingSpace;
    }
  }, {
    key: "append",
    value: function append(viewSize) {
      this.workingSpace = WORKING_SPACE_TOP;
      viewSize.workingSpace = WORKING_SPACE_BOTTOM;
      this.sharedSize = viewSize.getViewSize();
    }
  }, {
    key: "prepend",
    value: function prepend(viewSize) {
      this.workingSpace = WORKING_SPACE_BOTTOM;
      viewSize.workingSpace = WORKING_SPACE_TOP;
      this.sharedSize = viewSize.getViewSize();
    }
  }]);
  return ViewSizeSet2;
}();

function _classCallCheck$c(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$c(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$c(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$c(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$c(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var OrderView = /* @__PURE__ */ function() {
  function OrderView2(rootNode, nodesPool, childNodeType) {
    _classCallCheck$c(this, OrderView2);
    this.rootNode = rootNode;
    this.nodesPool = nodesPool;
    this.sizeSet = new ViewSizeSet();
    this.childNodeType = childNodeType.toUpperCase();
    this.visualIndex = 0;
    this.collectedNodes = [];
  }
  _createClass$c(OrderView2, [{
    key: "setSize",
    value: function setSize(size) {
      this.sizeSet.setSize(size);
      return this;
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this.sizeSet.setOffset(offset);
      return this;
    }
  }, {
    key: "isSharedViewSet",
    value: function isSharedViewSet() {
      return this.sizeSet.isShared();
    }
  }, {
    key: "getNode",
    value: function getNode(visualIndex) {
      return visualIndex < this.collectedNodes.length ? this.collectedNodes[visualIndex] : null;
    }
  }, {
    key: "getCurrentNode",
    value: function getCurrentNode() {
      var length = this.collectedNodes.length;
      return length > 0 ? this.collectedNodes[length - 1] : null;
    }
  }, {
    key: "getRenderedChildCount",
    value: function getRenderedChildCount() {
      var rootNode = this.rootNode, sizeSet = this.sizeSet;
      var childElementCount = 0;
      if (this.isSharedViewSet()) {
        var element = rootNode.firstElementChild;
        while (element) {
          if (element.tagName === this.childNodeType) {
            childElementCount += 1;
          } else if (sizeSet.isPlaceOn(WORKING_SPACE_TOP)) {
            break;
          }
          element = element.nextElementSibling;
        }
      } else {
        childElementCount = rootNode.childElementCount;
      }
      return childElementCount;
    }
  }, {
    key: "start",
    value: function start() {
      this.collectedNodes.length = 0;
      this.visualIndex = 0;
      var rootNode = this.rootNode, sizeSet = this.sizeSet;
      var isShared = this.isSharedViewSet();
      var _sizeSet$getViewSize = sizeSet.getViewSize(), nextSize = _sizeSet$getViewSize.nextSize;
      var childElementCount = this.getRenderedChildCount();
      while (childElementCount < nextSize) {
        var newNode = this.nodesPool();
        if (!isShared || isShared && sizeSet.isPlaceOn(WORKING_SPACE_BOTTOM)) {
          rootNode.appendChild(newNode);
        } else {
          rootNode.insertBefore(newNode, rootNode.firstChild);
        }
        childElementCount += 1;
      }
      var isSharedPlacedOnTop = isShared && sizeSet.isPlaceOn(WORKING_SPACE_TOP);
      while (childElementCount > nextSize) {
        rootNode.removeChild(isSharedPlacedOnTop ? rootNode.firstChild : rootNode.lastChild);
        childElementCount -= 1;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var rootNode = this.rootNode, sizeSet = this.sizeSet;
      var visualIndex = this.visualIndex;
      if (this.isSharedViewSet() && sizeSet.isPlaceOn(WORKING_SPACE_BOTTOM)) {
        visualIndex += sizeSet.sharedSize.nextSize;
      }
      var node = rootNode.childNodes[visualIndex];
      if (node.tagName !== this.childNodeType) {
        var newNode = this.nodesPool();
        rootNode.replaceChild(newNode, node);
        node = newNode;
      }
      this.collectedNodes.push(node);
      this.visualIndex += 1;
    }
  }, {
    key: "end",
    value: function end() {
    }
  }]);
  return OrderView2;
}();

function _typeof$5(obj) {
  "@babel/helpers - typeof";
  return _typeof$5 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$5(obj);
}
function _classCallCheck$d(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$d(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$d(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$d(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$d(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$1(subClass, superClass);
}
function _setPrototypeOf$1(o, p) {
  _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$1(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$1();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof$5(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$1() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
var SharedOrderView = /* @__PURE__ */ function(_OrderView) {
  _inherits(SharedOrderView2, _OrderView);
  var _super = _createSuper(SharedOrderView2);
  function SharedOrderView2() {
    _classCallCheck$d(this, SharedOrderView2);
    return _super.apply(this, arguments);
  }
  _createClass$d(SharedOrderView2, [{
    key: "prependView",
    value: function prependView(orderView) {
      this.sizeSet.prepend(orderView.sizeSet);
      orderView.sizeSet.append(this.sizeSet);
      return this;
    }
  }, {
    key: "appendView",
    value: function appendView(orderView) {
      this.sizeSet.append(orderView.sizeSet);
      orderView.sizeSet.prepend(this.sizeSet);
      return this;
    }
  }]);
  return SharedOrderView2;
}(OrderView);

function _classCallCheck$e(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$e(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$e(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$e(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$e(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var NodesPool = /* @__PURE__ */ function() {
  function NodesPool2(nodeType) {
    _classCallCheck$e(this, NodesPool2);
    this.nodeType = nodeType.toUpperCase();
  }
  _createClass$e(NodesPool2, [{
    key: "setRootDocument",
    value: function setRootDocument(rootDocument) {
      this.rootDocument = rootDocument;
    }
  }, {
    key: "obtain",
    value: function obtain() {
      return this.rootDocument.createElement(this.nodeType);
    }
  }]);
  return NodesPool2;
}();

function _classCallCheck$f(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$f(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$f(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$f(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$f(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var BaseRenderer = /* @__PURE__ */ function() {
  function BaseRenderer2(nodeType, rootNode) {
    _classCallCheck$f(this, BaseRenderer2);
    this.nodesPool = typeof nodeType === "string" ? new NodesPool(nodeType) : null;
    this.nodeType = nodeType;
    this.rootNode = rootNode;
    this.table = null;
    this.renderedNodes = 0;
  }
  _createClass$f(BaseRenderer2, [{
    key: "setTable",
    value: function setTable(table) {
      if (this.nodesPool) {
        this.nodesPool.setRootDocument(table.rootDocument);
      }
      this.table = table;
    }
  }, {
    key: "adjust",
    value: function adjust() {
    }
  }, {
    key: "render",
    value: function render() {
    }
  }]);
  return BaseRenderer2;
}();

function _typeof$6(obj) {
  "@babel/helpers - typeof";
  return _typeof$6 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$6(obj);
}
function _classCallCheck$g(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$g(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$g(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$g(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$g(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$2(subClass, superClass);
}
function _setPrototypeOf$2(o, p) {
  _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$2(o, p);
}
function _createSuper$1(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$2();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$1(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$1(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$1(this, result);
  };
}
function _possibleConstructorReturn$1(self, call) {
  if (call && (_typeof$6(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$1(self);
}
function _assertThisInitialized$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$2() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$1(o) {
  _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$1(o);
}
var RowHeadersRenderer = /* @__PURE__ */ function(_BaseRenderer) {
  _inherits$1(RowHeadersRenderer2, _BaseRenderer);
  var _super = _createSuper$1(RowHeadersRenderer2);
  function RowHeadersRenderer2() {
    var _this;
    _classCallCheck$g(this, RowHeadersRenderer2);
    _this = _super.call(this, "TH");
    _this.orderViews = new WeakMap();
    _this.sourceRowIndex = 0;
    return _this;
  }
  _createClass$g(RowHeadersRenderer2, [{
    key: "obtainOrderView",
    value: function obtainOrderView(rootNode) {
      var _this2 = this;
      var orderView;
      if (this.orderViews.has(rootNode)) {
        orderView = this.orderViews.get(rootNode);
      } else {
        orderView = new SharedOrderView(rootNode, function(sourceColumnIndex) {
          return _this2.nodesPool.obtain(_this2.sourceRowIndex, sourceColumnIndex);
        }, this.nodeType);
        this.orderViews.set(rootNode, orderView);
      }
      return orderView;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$table = this.table, rowsToRender = _this$table.rowsToRender, rowHeaderFunctions = _this$table.rowHeaderFunctions, rowHeadersCount = _this$table.rowHeadersCount, rows = _this$table.rows, cells = _this$table.cells;
      for (var visibleRowIndex = 0; visibleRowIndex < rowsToRender; visibleRowIndex++) {
        var sourceRowIndex = this.table.renderedRowToSource(visibleRowIndex);
        var TR = rows.getRenderedNode(visibleRowIndex);
        this.sourceRowIndex = sourceRowIndex;
        var orderView = this.obtainOrderView(TR);
        var cellsView = cells.obtainOrderView(TR);
        orderView.appendView(cellsView).setSize(rowHeadersCount).setOffset(this.table.renderedColumnToSource(0)).start();
        for (var visibleColumnIndex = 0; visibleColumnIndex < rowHeadersCount; visibleColumnIndex++) {
          orderView.render();
          var TH = orderView.getCurrentNode();
          TH.className = "";
          TH.removeAttribute("style");
          rowHeaderFunctions[visibleColumnIndex](sourceRowIndex, TH, visibleColumnIndex);
        }
        orderView.end();
      }
    }
  }]);
  return RowHeadersRenderer2;
}(BaseRenderer);

function _typeof$7(obj) {
  "@babel/helpers - typeof";
  return _typeof$7 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$7(obj);
}
function _classCallCheck$h(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$h(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$h(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$h(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$h(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$2(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$3(subClass, superClass);
}
function _setPrototypeOf$3(o, p) {
  _setPrototypeOf$3 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$3(o, p);
}
function _createSuper$2(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$3();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$2(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$2(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$2(this, result);
  };
}
function _possibleConstructorReturn$2(self, call) {
  if (call && (_typeof$7(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$2(self);
}
function _assertThisInitialized$2(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$3() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$2(o) {
  _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$2(o);
}
var ColumnHeadersRenderer = /* @__PURE__ */ function(_BaseRenderer) {
  _inherits$2(ColumnHeadersRenderer2, _BaseRenderer);
  var _super = _createSuper$2(ColumnHeadersRenderer2);
  function ColumnHeadersRenderer2(rootNode) {
    _classCallCheck$h(this, ColumnHeadersRenderer2);
    return _super.call(this, null, rootNode);
  }
  _createClass$h(ColumnHeadersRenderer2, [{
    key: "adjust",
    value: function adjust() {
      var _this$table = this.table, columnHeadersCount = _this$table.columnHeadersCount, rowHeadersCount = _this$table.rowHeadersCount;
      var TR = this.rootNode.firstChild;
      if (columnHeadersCount) {
        var columnsToRender = this.table.columnsToRender;
        var allColumnsToRender = columnsToRender + rowHeadersCount;
        for (var i = 0, len = columnHeadersCount; i < len; i++) {
          TR = this.rootNode.childNodes[i];
          if (!TR) {
            TR = this.table.rootDocument.createElement("tr");
            this.rootNode.appendChild(TR);
          }
          this.renderedNodes = TR.childNodes.length;
          while (this.renderedNodes < allColumnsToRender) {
            TR.appendChild(this.table.rootDocument.createElement("th"));
            this.renderedNodes += 1;
          }
          while (this.renderedNodes > allColumnsToRender) {
            TR.removeChild(TR.lastChild);
            this.renderedNodes -= 1;
          }
        }
        var theadChildrenLength = this.rootNode.childNodes.length;
        if (theadChildrenLength > columnHeadersCount) {
          for (var _i = columnHeadersCount; _i < theadChildrenLength; _i++) {
            this.rootNode.removeChild(this.rootNode.lastChild);
          }
        }
      } else if (TR) {
        empty(TR);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var columnHeadersCount = this.table.columnHeadersCount;
      for (var rowHeaderIndex = 0; rowHeaderIndex < columnHeadersCount; rowHeaderIndex += 1) {
        var _this$table2 = this.table, columnHeaderFunctions = _this$table2.columnHeaderFunctions, columnsToRender = _this$table2.columnsToRender, rowHeadersCount = _this$table2.rowHeadersCount;
        var TR = this.rootNode.childNodes[rowHeaderIndex];
        for (var renderedColumnIndex = -1 * rowHeadersCount; renderedColumnIndex < columnsToRender; renderedColumnIndex += 1) {
          var sourceColumnIndex = this.table.renderedColumnToSource(renderedColumnIndex);
          var TH = TR.childNodes[renderedColumnIndex + rowHeadersCount];
          TH.className = "";
          TH.removeAttribute("style");
          columnHeaderFunctions[rowHeaderIndex](sourceColumnIndex, TH, rowHeaderIndex);
        }
      }
    }
  }]);
  return ColumnHeadersRenderer2;
}(BaseRenderer);

function _typeof$8(obj) {
  "@babel/helpers - typeof";
  return _typeof$8 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$8(obj);
}
function _classCallCheck$i(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$i(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$i(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$i(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$i(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$3(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$4(subClass, superClass);
}
function _setPrototypeOf$4(o, p) {
  _setPrototypeOf$4 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$4(o, p);
}
function _createSuper$3(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$4();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$3(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$3(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$3(this, result);
  };
}
function _possibleConstructorReturn$3(self, call) {
  if (call && (_typeof$8(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$3(self);
}
function _assertThisInitialized$3(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$4() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$3(o) {
  _getPrototypeOf$3 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$3(o);
}
var ColGroupRenderer = /* @__PURE__ */ function(_BaseRenderer) {
  _inherits$3(ColGroupRenderer2, _BaseRenderer);
  var _super = _createSuper$3(ColGroupRenderer2);
  function ColGroupRenderer2(rootNode) {
    _classCallCheck$i(this, ColGroupRenderer2);
    return _super.call(this, null, rootNode);
  }
  _createClass$i(ColGroupRenderer2, [{
    key: "adjust",
    value: function adjust() {
      var _this$table = this.table, columnsToRender = _this$table.columnsToRender, rowHeadersCount = _this$table.rowHeadersCount;
      var allColumnsToRender = columnsToRender + rowHeadersCount;
      while (this.renderedNodes < allColumnsToRender) {
        this.rootNode.appendChild(this.table.rootDocument.createElement("col"));
        this.renderedNodes += 1;
      }
      while (this.renderedNodes > allColumnsToRender) {
        this.rootNode.removeChild(this.rootNode.lastChild);
        this.renderedNodes -= 1;
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.adjust();
      var _this$table2 = this.table, columnsToRender = _this$table2.columnsToRender, rowHeadersCount = _this$table2.rowHeadersCount;
      for (var visibleColumnIndex = 0; visibleColumnIndex < rowHeadersCount; visibleColumnIndex++) {
        var sourceColumnIndex = this.table.renderedColumnToSource(visibleColumnIndex);
        var width = this.table.columnUtils.getHeaderWidth(sourceColumnIndex);
        this.rootNode.childNodes[visibleColumnIndex].style.width = "".concat(width, "px");
      }
      for (var _visibleColumnIndex = 0; _visibleColumnIndex < columnsToRender; _visibleColumnIndex++) {
        var _sourceColumnIndex = this.table.renderedColumnToSource(_visibleColumnIndex);
        var _width = this.table.columnUtils.getStretchedColumnWidth(_sourceColumnIndex);
        this.rootNode.childNodes[_visibleColumnIndex + rowHeadersCount].style.width = "".concat(_width, "px");
      }
      var firstChild = this.rootNode.firstChild;
      if (firstChild) {
        addClass(firstChild, "rowHeader");
      }
    }
  }]);
  return ColGroupRenderer2;
}(BaseRenderer);

function _typeof$9(obj) {
  "@babel/helpers - typeof";
  return _typeof$9 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$9(obj);
}
var _templateObject$2;
function _taggedTemplateLiteral$2(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
function _classCallCheck$j(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$j(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$j(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$j(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$j(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$4(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$5(subClass, superClass);
}
function _setPrototypeOf$5(o, p) {
  _setPrototypeOf$5 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$5(o, p);
}
function _createSuper$4(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$5();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$4(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$4(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$4(this, result);
  };
}
function _possibleConstructorReturn$4(self, call) {
  if (call && (_typeof$9(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$4(self);
}
function _assertThisInitialized$4(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$5() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$4(o) {
  _getPrototypeOf$4 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$4(o);
}
var performanceWarningAppeared = false;
var RowsRenderer = /* @__PURE__ */ function(_BaseRenderer) {
  _inherits$4(RowsRenderer2, _BaseRenderer);
  var _super = _createSuper$4(RowsRenderer2);
  function RowsRenderer2(rootNode) {
    var _this;
    _classCallCheck$j(this, RowsRenderer2);
    _this = _super.call(this, "TR", rootNode);
    _this.orderView = new OrderView(rootNode, function(sourceRowIndex) {
      return _this.nodesPool.obtain(sourceRowIndex);
    }, _this.nodeType);
    return _this;
  }
  _createClass$j(RowsRenderer2, [{
    key: "getRenderedNode",
    value: function getRenderedNode(visualIndex) {
      return this.orderView.getNode(visualIndex);
    }
  }, {
    key: "render",
    value: function render() {
      var rowsToRender = this.table.rowsToRender;
      if (!performanceWarningAppeared && rowsToRender > 1e3) {
        performanceWarningAppeared = true;
        warn(toSingleLine(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral$2(['Performance tip: Handsontable rendered more than 1000 visible rows. Consider limiting \n        the number of rendered rows by specifying the table height and/or turning off the "renderAllRows" option.'], ['Performance tip: Handsontable rendered more than 1000 visible rows. Consider limiting\\x20\n        the number of rendered rows by specifying the table height and/or turning off the "renderAllRows" option.']))));
      }
      this.orderView.setSize(rowsToRender).setOffset(this.table.renderedRowToSource(0)).start();
      for (var visibleRowIndex = 0; visibleRowIndex < rowsToRender; visibleRowIndex++) {
        this.orderView.render();
      }
      this.orderView.end();
    }
  }]);
  return RowsRenderer2;
}(BaseRenderer);

function _typeof$a(obj) {
  "@babel/helpers - typeof";
  return _typeof$a = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$a(obj);
}
function _classCallCheck$k(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$k(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$k(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$k(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$k(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$5(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$6(subClass, superClass);
}
function _setPrototypeOf$6(o, p) {
  _setPrototypeOf$6 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$6(o, p);
}
function _createSuper$5(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$6();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$5(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$5(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$5(this, result);
  };
}
function _possibleConstructorReturn$5(self, call) {
  if (call && (_typeof$a(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$5(self);
}
function _assertThisInitialized$5(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$6() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$5(o) {
  _getPrototypeOf$5 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$5(o);
}
var CellsRenderer = /* @__PURE__ */ function(_BaseRenderer) {
  _inherits$5(CellsRenderer2, _BaseRenderer);
  var _super = _createSuper$5(CellsRenderer2);
  function CellsRenderer2() {
    var _this;
    _classCallCheck$k(this, CellsRenderer2);
    _this = _super.call(this, "TD");
    _this.orderViews = new WeakMap();
    _this.sourceRowIndex = 0;
    return _this;
  }
  _createClass$k(CellsRenderer2, [{
    key: "obtainOrderView",
    value: function obtainOrderView(rootNode) {
      var _this2 = this;
      var orderView;
      if (this.orderViews.has(rootNode)) {
        orderView = this.orderViews.get(rootNode);
      } else {
        orderView = new SharedOrderView(rootNode, function(sourceColumnIndex) {
          return _this2.nodesPool.obtain(_this2.sourceRowIndex, sourceColumnIndex);
        }, this.nodeType);
        this.orderViews.set(rootNode, orderView);
      }
      return orderView;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$table = this.table, rowsToRender = _this$table.rowsToRender, columnsToRender = _this$table.columnsToRender, rows = _this$table.rows, rowHeaders = _this$table.rowHeaders;
      for (var visibleRowIndex = 0; visibleRowIndex < rowsToRender; visibleRowIndex++) {
        var sourceRowIndex = this.table.renderedRowToSource(visibleRowIndex);
        var TR = rows.getRenderedNode(visibleRowIndex);
        this.sourceRowIndex = sourceRowIndex;
        var orderView = this.obtainOrderView(TR);
        var rowHeadersView = rowHeaders.obtainOrderView(TR);
        orderView.prependView(rowHeadersView).setSize(columnsToRender).setOffset(this.table.renderedColumnToSource(0)).start();
        for (var visibleColumnIndex = 0; visibleColumnIndex < columnsToRender; visibleColumnIndex++) {
          orderView.render();
          var TD = orderView.getCurrentNode();
          var sourceColumnIndex = this.table.renderedColumnToSource(visibleColumnIndex);
          if (!hasClass(TD, "hide")) {
            TD.className = "";
          }
          TD.removeAttribute("style");
          TD.removeAttribute("dir");
          this.table.cellRenderer(sourceRowIndex, sourceColumnIndex, TD);
        }
        orderView.end();
      }
    }
  }]);
  return CellsRenderer2;
}(BaseRenderer);

function _classCallCheck$l(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$l(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$l(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$l(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$l(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var TableRenderer = /* @__PURE__ */ function() {
  function TableRenderer2(rootNode) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, cellRenderer = _ref.cellRenderer;
    _classCallCheck$l(this, TableRenderer2);
    this.rootNode = rootNode;
    this.rootDocument = this.rootNode.ownerDocument;
    this.rowHeaders = null;
    this.columnHeaders = null;
    this.colGroup = null;
    this.rows = null;
    this.cells = null;
    this.rowFilter = null;
    this.columnFilter = null;
    this.rowUtils = null;
    this.columnUtils = null;
    this.rowsToRender = 0;
    this.columnsToRender = 0;
    this.rowHeaderFunctions = [];
    this.rowHeadersCount = 0;
    this.columnHeaderFunctions = [];
    this.columnHeadersCount = 0;
    this.cellRenderer = cellRenderer;
  }
  _createClass$l(TableRenderer2, [{
    key: "setAxisUtils",
    value: function setAxisUtils(rowUtils, columnUtils) {
      this.rowUtils = rowUtils;
      this.columnUtils = columnUtils;
    }
  }, {
    key: "setViewportSize",
    value: function setViewportSize(rowsCount, columnsCount) {
      this.rowsToRender = rowsCount;
      this.columnsToRender = columnsCount;
    }
  }, {
    key: "setFilters",
    value: function setFilters(rowFilter, columnFilter) {
      this.rowFilter = rowFilter;
      this.columnFilter = columnFilter;
    }
  }, {
    key: "setHeaderContentRenderers",
    value: function setHeaderContentRenderers(rowHeaders, columnHeaders) {
      this.rowHeaderFunctions = rowHeaders;
      this.rowHeadersCount = rowHeaders.length;
      this.columnHeaderFunctions = columnHeaders;
      this.columnHeadersCount = columnHeaders.length;
    }
  }, {
    key: "setRenderers",
    value: function setRenderers() {
      var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, rowHeaders = _ref2.rowHeaders, columnHeaders = _ref2.columnHeaders, colGroup = _ref2.colGroup, rows = _ref2.rows, cells = _ref2.cells;
      rowHeaders.setTable(this);
      columnHeaders.setTable(this);
      colGroup.setTable(this);
      rows.setTable(this);
      cells.setTable(this);
      this.rowHeaders = rowHeaders;
      this.columnHeaders = columnHeaders;
      this.colGroup = colGroup;
      this.rows = rows;
      this.cells = cells;
    }
  }, {
    key: "renderedRowToSource",
    value: function renderedRowToSource(rowIndex) {
      return this.rowFilter.renderedToSource(rowIndex);
    }
  }, {
    key: "renderedColumnToSource",
    value: function renderedColumnToSource(columnIndex) {
      return this.columnFilter.renderedToSource(columnIndex);
    }
  }, {
    key: "render",
    value: function render() {
      this.colGroup.adjust();
      this.columnHeaders.adjust();
      this.rows.adjust();
      this.rowHeaders.adjust();
      this.columnHeaders.render();
      this.rows.render();
      this.rowHeaders.render();
      this.cells.render();
      this.columnUtils.calculateWidths();
      this.colGroup.render();
      var rowsToRender = this.rowsToRender, rows = this.rows;
      for (var visibleRowIndex = 0; visibleRowIndex < rowsToRender; visibleRowIndex++) {
        var TR = rows.getRenderedNode(visibleRowIndex);
        if (TR.firstChild) {
          var sourceRowIndex = this.renderedRowToSource(visibleRowIndex);
          var rowHeight = this.rowUtils.getHeight(sourceRowIndex);
          if (rowHeight) {
            TR.firstChild.style.height = "".concat(rowHeight - 1, "px");
          } else {
            TR.firstChild.style.height = "";
          }
        }
      }
    }
  }]);
  return TableRenderer2;
}();

function _classCallCheck$m(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$m(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$m(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$m(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$m(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Renderer = /* @__PURE__ */ function() {
  function Renderer2() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, TABLE = _ref.TABLE, THEAD = _ref.THEAD, COLGROUP = _ref.COLGROUP, TBODY = _ref.TBODY, rowUtils = _ref.rowUtils, columnUtils = _ref.columnUtils, cellRenderer = _ref.cellRenderer;
    _classCallCheck$m(this, Renderer2);
    this.renderer = new TableRenderer(TABLE, {
      cellRenderer
    });
    this.renderer.setRenderers({
      rowHeaders: new RowHeadersRenderer(),
      columnHeaders: new ColumnHeadersRenderer(THEAD),
      colGroup: new ColGroupRenderer(COLGROUP),
      rows: new RowsRenderer(TBODY),
      cells: new CellsRenderer()
    });
    this.renderer.setAxisUtils(rowUtils, columnUtils);
  }
  _createClass$m(Renderer2, [{
    key: "setFilters",
    value: function setFilters(rowFilter, columnFilter) {
      this.renderer.setFilters(rowFilter, columnFilter);
      return this;
    }
  }, {
    key: "setViewportSize",
    value: function setViewportSize(rowsCount, columnsCount) {
      this.renderer.setViewportSize(rowsCount, columnsCount);
      return this;
    }
  }, {
    key: "setHeaderContentRenderers",
    value: function setHeaderContentRenderers(rowHeaders, columnHeaders) {
      this.renderer.setHeaderContentRenderers(rowHeaders, columnHeaders);
      return this;
    }
  }, {
    key: "adjust",
    value: function adjust() {
      this.renderer.adjust();
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.render();
    }
  }]);
  return Renderer2;
}();

function _classCallCheck$n(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$n(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$n(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$n(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$n(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var ColumnUtils = /* @__PURE__ */ function() {
  function ColumnUtils2(dataAccessObject, wtSettings) {
    _classCallCheck$n(this, ColumnUtils2);
    this.dataAccessObject = dataAccessObject;
    this.wtSettings = wtSettings;
    this.headerWidths = new Map();
  }
  _createClass$n(ColumnUtils2, [{
    key: "getWidth",
    value: function getWidth(sourceIndex) {
      return this.wtSettings.getSetting("columnWidth", sourceIndex) || this.wtSettings.getSetting("defaultColumnWidth");
    }
  }, {
    key: "getStretchedColumnWidth",
    value: function getStretchedColumnWidth(sourceIndex) {
      var calculator = this.dataAccessObject.wtViewport.columnsRenderCalculator;
      var width = this.getWidth(sourceIndex);
      if (calculator) {
        var stretchedWidth = calculator.getStretchedColumnWidth(sourceIndex, width);
        if (stretchedWidth) {
          width = stretchedWidth;
        }
      }
      return width;
    }
  }, {
    key: "getHeaderHeight",
    value: function getHeaderHeight(level) {
      var height = this.wtSettings.getSetting("defaultRowHeight");
      var oversizedHeight = this.dataAccessObject.wtViewport.oversizedColumnHeaders[level];
      if (oversizedHeight !== void 0) {
        height = height ? Math.max(height, oversizedHeight) : oversizedHeight;
      }
      return height;
    }
  }, {
    key: "getHeaderWidth",
    value: function getHeaderWidth(sourceIndex) {
      return this.headerWidths.get(this.dataAccessObject.wtTable.columnFilter.sourceToRendered(sourceIndex));
    }
  }, {
    key: "calculateWidths",
    value: function calculateWidths() {
      var wtSettings = this.wtSettings;
      var _this$dataAccessObjec = this.dataAccessObject, wtTable = _this$dataAccessObjec.wtTable, wtViewport = _this$dataAccessObjec.wtViewport, cloneSource = _this$dataAccessObjec.cloneSource;
      var mainHolder = cloneSource ? cloneSource.wtTable.holder : wtTable.holder;
      var scrollbarCompensation = mainHolder.offsetHeight < mainHolder.scrollHeight ? getScrollbarWidth() : 0;
      var rowHeaderWidthSetting = wtSettings.getSetting("rowHeaderWidth");
      wtViewport.columnsRenderCalculator.refreshStretching(wtViewport.getViewportWidth() - scrollbarCompensation);
      rowHeaderWidthSetting = wtSettings.getSetting("onModifyRowHeaderWidth", rowHeaderWidthSetting);
      if (rowHeaderWidthSetting !== null && rowHeaderWidthSetting !== void 0) {
        var rowHeadersCount = wtSettings.getSetting("rowHeaders").length;
        var defaultColumnWidth = wtSettings.getSetting("defaultColumnWidth");
        for (var visibleColumnIndex = 0; visibleColumnIndex < rowHeadersCount; visibleColumnIndex++) {
          var width = Array.isArray(rowHeaderWidthSetting) ? rowHeaderWidthSetting[visibleColumnIndex] : rowHeaderWidthSetting;
          width = width === null || width === void 0 ? defaultColumnWidth : width;
          this.headerWidths.set(visibleColumnIndex, width);
        }
      }
    }
  }]);
  return ColumnUtils2;
}();

function _classCallCheck$o(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$o(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$o(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$o(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$o(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var RowUtils = /* @__PURE__ */ function() {
  function RowUtils2(dataAccessObject, wtSettings) {
    _classCallCheck$o(this, RowUtils2);
    this.dataAccessObject = dataAccessObject;
    this.wtSettings = wtSettings;
  }
  _createClass$o(RowUtils2, [{
    key: "getHeight",
    value: function getHeight(sourceIndex) {
      var height = this.wtSettings.getSetting("rowHeight", sourceIndex);
      var oversizedHeight = this.dataAccessObject.wtViewport.oversizedRows[sourceIndex];
      if (oversizedHeight !== void 0) {
        height = height === void 0 ? oversizedHeight : Math.max(height, oversizedHeight);
      }
      return height;
    }
  }]);
  return RowUtils2;
}();

function _toConsumableArray$9(arr) {
  return _arrayWithoutHoles$9(arr) || _iterableToArray$9(arr) || _unsupportedIterableToArray$a(arr) || _nonIterableSpread$9();
}
function _nonIterableSpread$9() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$9(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$9(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$a(arr);
}
function _slicedToArray$4(arr, i) {
  return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$a(arr, i) || _nonIterableRest$4();
}
function _nonIterableRest$4() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$a(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$a(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$a(o, minLen);
}
function _arrayLikeToArray$a(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$4(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$4(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _classCallCheck$p(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$p(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$p(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$p(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$p(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Table = /* @__PURE__ */ function() {
  function Table2(dataAccessObject, facadeGetter, domBindings, wtSettings, name) {
    var _this = this;
    _classCallCheck$p(this, Table2);
    _defineProperty$3(this, "wtSettings", null);
    _defineProperty$3(this, "domBindings", void 0);
    _defineProperty$3(this, "TBODY", null);
    _defineProperty$3(this, "THEAD", null);
    _defineProperty$3(this, "COLGROUP", null);
    _defineProperty$3(this, "hasTableHeight", true);
    _defineProperty$3(this, "hasTableWidth", true);
    _defineProperty$3(this, "isTableVisible", false);
    _defineProperty$3(this, "tableOffset", 0);
    _defineProperty$3(this, "holderOffset", 0);
    this.domBindings = domBindings;
    this.isMaster = name === "master";
    this.name = name;
    this.dataAccessObject = dataAccessObject;
    this.facadeGetter = facadeGetter;
    this.wtSettings = wtSettings;
    this.instance = this.dataAccessObject.wot;
    this.wot = this.dataAccessObject.wot;
    this.TABLE = domBindings.rootTable;
    removeTextNodes(this.TABLE);
    this.spreader = this.createSpreader(this.TABLE);
    this.hider = this.createHider(this.spreader);
    this.holder = this.createHolder(this.hider);
    this.wtRootElement = this.holder.parentNode;
    if (this.isMaster) {
      this.alignOverlaysWithTrimmingContainer();
    }
    this.fixTableDomTree();
    this.rowFilter = null;
    this.columnFilter = null;
    this.correctHeaderWidth = false;
    var origRowHeaderWidth = this.wtSettings.getSettingPure("rowHeaderWidth");
    this.wtSettings.update("rowHeaderWidth", function() {
      return _this._modifyRowHeaderWidth(origRowHeaderWidth);
    });
    this.rowUtils = new RowUtils(this.dataAccessObject, this.wtSettings);
    this.columnUtils = new ColumnUtils(this.dataAccessObject, this.wtSettings);
    this.tableRenderer = new Renderer({
      TABLE: this.TABLE,
      THEAD: this.THEAD,
      COLGROUP: this.COLGROUP,
      TBODY: this.TBODY,
      rowUtils: this.rowUtils,
      columnUtils: this.columnUtils,
      cellRenderer: this.wtSettings.getSettingPure("cellRenderer")
    });
  }
  _createClass$p(Table2, [{
    key: "is",
    value: function is(overlayTypeName) {
      return this.name === overlayTypeName;
    }
  }, {
    key: "fixTableDomTree",
    value: function fixTableDomTree() {
      var rootDocument = this.domBindings.rootDocument;
      this.TBODY = this.TABLE.querySelector("tbody");
      if (!this.TBODY) {
        this.TBODY = rootDocument.createElement("tbody");
        this.TABLE.appendChild(this.TBODY);
      }
      this.THEAD = this.TABLE.querySelector("thead");
      if (!this.THEAD) {
        this.THEAD = rootDocument.createElement("thead");
        this.TABLE.insertBefore(this.THEAD, this.TBODY);
      }
      this.COLGROUP = this.TABLE.querySelector("colgroup");
      if (!this.COLGROUP) {
        this.COLGROUP = rootDocument.createElement("colgroup");
        this.TABLE.insertBefore(this.COLGROUP, this.THEAD);
      }
    }
  }, {
    key: "createSpreader",
    value: function createSpreader(table) {
      var parent = table.parentNode;
      var spreader;
      if (!parent || parent.nodeType !== Node.ELEMENT_NODE || !hasClass(parent, "wtHolder")) {
        spreader = this.domBindings.rootDocument.createElement("div");
        spreader.className = "wtSpreader";
        if (parent) {
          parent.insertBefore(spreader, table);
        }
        spreader.appendChild(table);
      }
      spreader.style.position = "relative";
      return spreader;
    }
  }, {
    key: "createHider",
    value: function createHider(spreader) {
      var parent = spreader.parentNode;
      var hider;
      if (!parent || parent.nodeType !== Node.ELEMENT_NODE || !hasClass(parent, "wtHolder")) {
        hider = this.domBindings.rootDocument.createElement("div");
        hider.className = "wtHider";
        if (parent) {
          parent.insertBefore(hider, spreader);
        }
        hider.appendChild(spreader);
      }
      return hider;
    }
  }, {
    key: "createHolder",
    value: function createHolder(hider) {
      var parent = hider.parentNode;
      var holder;
      if (!parent || parent.nodeType !== Node.ELEMENT_NODE || !hasClass(parent, "wtHolder")) {
        holder = this.domBindings.rootDocument.createElement("div");
        holder.style.position = "relative";
        holder.className = "wtHolder";
        if (parent) {
          parent.insertBefore(holder, hider);
        }
        if (this.isMaster) {
          holder.parentNode.className += "ht_master handsontable";
          holder.parentNode.setAttribute("dir", this.wtSettings.getSettingPure("rtlMode") ? "rtl" : "ltr");
        }
        holder.appendChild(hider);
      }
      return holder;
    }
  }, {
    key: "draw",
    value: function draw() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var wtSettings = this.wtSettings;
      var _this$dataAccessObjec = this.dataAccessObject, wtOverlays = _this$dataAccessObjec.wtOverlays, wtViewport = _this$dataAccessObjec.wtViewport;
      var totalRows = wtSettings.getSetting("totalRows");
      var totalColumns = wtSettings.getSetting("totalColumns");
      var rowHeaders = wtSettings.getSetting("rowHeaders");
      var rowHeadersCount = rowHeaders.length;
      var columnHeaders = wtSettings.getSetting("columnHeaders");
      var columnHeadersCount = columnHeaders.length;
      var syncScroll = false;
      var runFastDraw = fastDraw;
      if (this.isMaster) {
        this.holderOffset = offset(this.holder);
        runFastDraw = wtViewport.createRenderCalculators(runFastDraw);
        if (rowHeadersCount && !wtSettings.getSetting("fixedColumnsStart")) {
          var leftScrollPos = wtOverlays.inlineStartOverlay.getScrollPosition();
          var previousState = this.correctHeaderWidth;
          this.correctHeaderWidth = leftScrollPos !== 0;
          if (previousState !== this.correctHeaderWidth) {
            runFastDraw = false;
          }
        }
      }
      if (this.isMaster) {
        syncScroll = wtOverlays.updateStateOfRendering();
      }
      if (runFastDraw) {
        if (this.isMaster) {
          wtViewport.createVisibleCalculators();
        }
        if (wtOverlays) {
          wtOverlays.refresh(true);
        }
      } else {
        if (this.isMaster) {
          this.tableOffset = offset(this.TABLE);
        } else {
          this.tableOffset = this.dataAccessObject.parentTableOffset;
        }
        var startRow = totalRows > 0 ? this.getFirstRenderedRow() : 0;
        var startColumn = totalColumns > 0 ? this.getFirstRenderedColumn() : 0;
        this.rowFilter = new RowFilter(startRow, totalRows, columnHeadersCount);
        this.columnFilter = new ColumnFilter(startColumn, totalColumns, rowHeadersCount);
        var performRedraw = true;
        if (this.isMaster) {
          this.alignOverlaysWithTrimmingContainer();
          var skipRender = {};
          this.wtSettings.getSetting("beforeDraw", true, skipRender);
          performRedraw = skipRender.skipRender !== true;
        }
        if (performRedraw) {
          this.tableRenderer.setHeaderContentRenderers(rowHeaders, columnHeaders);
          if (this.is(CLONE_BOTTOM) || this.is(CLONE_BOTTOM_INLINE_START_CORNER)) {
            this.tableRenderer.setHeaderContentRenderers(rowHeaders, []);
          }
          this.resetOversizedRows();
          this.tableRenderer.setViewportSize(this.getRenderedRowsCount(), this.getRenderedColumnsCount()).setFilters(this.rowFilter, this.columnFilter).render();
          var workspaceWidth;
          if (this.isMaster) {
            workspaceWidth = this.dataAccessObject.workspaceWidth;
            this.dataAccessObject.wtViewport.containerWidth = null;
            this.markOversizedColumnHeaders();
          }
          this.adjustColumnHeaderHeights();
          if (this.isMaster || this.is(CLONE_BOTTOM)) {
            this.markOversizedRows();
          }
          if (this.isMaster) {
            this.dataAccessObject.wtViewport.createVisibleCalculators();
            this.dataAccessObject.wtOverlays.refresh(false);
            this.dataAccessObject.wtOverlays.applyToDOM();
            var hiderWidth = outerWidth(this.hider);
            var tableWidth = outerWidth(this.TABLE);
            if (hiderWidth !== 0 && tableWidth !== hiderWidth) {
              this.columnUtils.calculateWidths();
              this.tableRenderer.renderer.colGroup.render();
            }
            if (workspaceWidth !== this.dataAccessObject.wtViewport.getWorkspaceWidth()) {
              this.dataAccessObject.wtViewport.containerWidth = null;
              this.columnUtils.calculateWidths();
              this.tableRenderer.renderer.colGroup.render();
            }
            this.wtSettings.getSetting("onDraw", true);
          } else if (this.is(CLONE_BOTTOM)) {
            this.dataAccessObject.cloneSource.wtOverlays.adjustElementsSize();
          }
        }
      }
      if (this.isMaster) {
        var positionChanged = wtOverlays.topOverlay.resetFixedPosition();
        if (wtOverlays.bottomOverlay.clone) {
          positionChanged = wtOverlays.bottomOverlay.resetFixedPosition() || positionChanged;
        }
        positionChanged = wtOverlays.inlineStartOverlay.resetFixedPosition() || positionChanged;
        if (wtOverlays.topInlineStartCornerOverlay) {
          wtOverlays.topInlineStartCornerOverlay.resetFixedPosition();
        }
        if (wtOverlays.bottomInlineStartCornerOverlay && wtOverlays.bottomInlineStartCornerOverlay.clone) {
          wtOverlays.bottomInlineStartCornerOverlay.resetFixedPosition();
        }
        if (positionChanged) {
          wtOverlays.refreshAll();
          wtOverlays.adjustElementsSize();
        }
      }
      this.refreshSelections(runFastDraw);
      if (syncScroll) {
        wtOverlays.syncScrollWithMaster();
      }
      this.dataAccessObject.drawn = true;
      return this;
    }
  }, {
    key: "markIfOversizedColumnHeader",
    value: function markIfOversizedColumnHeader(col) {
      var sourceColIndex = this.columnFilter.renderedToSource(col);
      var level = this.wtSettings.getSetting("columnHeaders").length;
      var defaultRowHeight = this.wtSettings.getSetting("defaultRowHeight");
      var previousColHeaderHeight;
      var currentHeader;
      var currentHeaderHeight;
      var columnHeaderHeightSetting = this.wtSettings.getSetting("columnHeaderHeight") || [];
      while (level) {
        level -= 1;
        previousColHeaderHeight = this.getColumnHeaderHeight(level);
        currentHeader = this.getColumnHeader(sourceColIndex, level);
        if (!currentHeader) {
          continue;
        }
        currentHeaderHeight = innerHeight(currentHeader);
        if (!previousColHeaderHeight && defaultRowHeight < currentHeaderHeight || previousColHeaderHeight < currentHeaderHeight) {
          this.dataAccessObject.wtViewport.oversizedColumnHeaders[level] = currentHeaderHeight;
        }
        if (Array.isArray(columnHeaderHeightSetting)) {
          if (columnHeaderHeightSetting[level] !== null && columnHeaderHeightSetting[level] !== void 0) {
            this.dataAccessObject.wtViewport.oversizedColumnHeaders[level] = columnHeaderHeightSetting[level];
          }
        } else if (!isNaN(columnHeaderHeightSetting)) {
          this.dataAccessObject.wtViewport.oversizedColumnHeaders[level] = columnHeaderHeightSetting;
        }
        if (this.dataAccessObject.wtViewport.oversizedColumnHeaders[level] < (columnHeaderHeightSetting[level] || columnHeaderHeightSetting)) {
          this.dataAccessObject.wtViewport.oversizedColumnHeaders[level] = columnHeaderHeightSetting[level] || columnHeaderHeightSetting;
        }
      }
    }
  }, {
    key: "adjustColumnHeaderHeights",
    value: function adjustColumnHeaderHeights() {
      var wtSettings = this.wtSettings;
      var children = this.THEAD.childNodes;
      var oversizedColumnHeaders = this.dataAccessObject.wtViewport.oversizedColumnHeaders;
      var columnHeaders = wtSettings.getSetting("columnHeaders");
      for (var i = 0, len = columnHeaders.length; i < len; i++) {
        if (oversizedColumnHeaders[i]) {
          if (!children[i] || children[i].childNodes.length === 0) {
            return;
          }
          children[i].childNodes[0].style.height = "".concat(oversizedColumnHeaders[i], "px");
        }
      }
    }
  }, {
    key: "resetOversizedRows",
    value: function resetOversizedRows() {
      var wtSettings = this.wtSettings;
      var wtViewport = this.dataAccessObject.wtViewport;
      if (!this.isMaster && !this.is(CLONE_BOTTOM)) {
        return;
      }
      if (!wtSettings.getSetting("externalRowCalculator")) {
        var rowsToRender = this.getRenderedRowsCount();
        for (var visibleRowIndex = 0; visibleRowIndex < rowsToRender; visibleRowIndex++) {
          var sourceRow = this.rowFilter.renderedToSource(visibleRowIndex);
          if (wtViewport.oversizedRows && wtViewport.oversizedRows[sourceRow]) {
            wtViewport.oversizedRows[sourceRow] = void 0;
          }
        }
      }
    }
  }, {
    key: "removeClassFromCells",
    value: function removeClassFromCells(className) {
      var nodes = this.TABLE.querySelectorAll(".".concat(className));
      for (var i = 0, len = nodes.length; i < len; i++) {
        removeClass(nodes[i], className);
      }
    }
  }, {
    key: "refreshSelections",
    value: function refreshSelections(fastDraw) {
      var wtSettings = this.wtSettings;
      var selections = this.dataAccessObject.selections;
      if (!selections) {
        return;
      }
      var highlights = Array.from(selections);
      var len = highlights.length;
      if (fastDraw) {
        var classesToRemove = [];
        for (var i = 0; i < len; i++) {
          var _highlights$i$setting = highlights[i].settings, highlightHeaderClassName = _highlights$i$setting.highlightHeaderClassName, highlightRowClassName = _highlights$i$setting.highlightRowClassName, highlightColumnClassName = _highlights$i$setting.highlightColumnClassName;
          var classNames = highlights[i].classNames;
          var classNamesLength = classNames.length;
          for (var j = 0; j < classNamesLength; j++) {
            if (!classesToRemove.includes(classNames[j])) {
              classesToRemove.push(classNames[j]);
            }
          }
          if (highlightHeaderClassName && !classesToRemove.includes(highlightHeaderClassName)) {
            classesToRemove.push(highlightHeaderClassName);
          }
          if (highlightRowClassName && !classesToRemove.includes(highlightRowClassName)) {
            classesToRemove.push(highlightRowClassName);
          }
          if (highlightColumnClassName && !classesToRemove.includes(highlightColumnClassName)) {
            classesToRemove.push(highlightColumnClassName);
          }
        }
        var additionalClassesToRemove = wtSettings.getSetting("onBeforeRemoveCellClassNames");
        if (Array.isArray(additionalClassesToRemove)) {
          for (var _i = 0; _i < additionalClassesToRemove.length; _i++) {
            classesToRemove.push(additionalClassesToRemove[_i]);
          }
        }
        var classesToRemoveLength = classesToRemove.length;
        for (var _i2 = 0; _i2 < classesToRemoveLength; _i2++) {
          this.removeClassFromCells(classesToRemove[_i2]);
        }
      }
      for (var _i3 = 0; _i3 < len; _i3++) {
        highlights[_i3].draw(this.facadeGetter(), fastDraw);
      }
    }
  }, {
    key: "getCell",
    value: function getCell(coords) {
      var row = coords.row;
      var column = coords.col;
      var hookResult = this.wtSettings.getSetting("onModifyGetCellCoords", row, column);
      if (hookResult && Array.isArray(hookResult)) {
        var _hookResult = _slicedToArray$4(hookResult, 2);
        row = _hookResult[0];
        column = _hookResult[1];
      }
      if (this.isRowBeforeRenderedRows(row)) {
        return -1;
      } else if (this.isRowAfterRenderedRows(row)) {
        return -2;
      } else if (this.isColumnBeforeRenderedColumns(column)) {
        return -3;
      } else if (this.isColumnAfterRenderedColumns(column)) {
        return -4;
      }
      var TR;
      if (row < 0) {
        TR = this.THEAD.childNodes[this.rowFilter.sourceRowToVisibleColHeadedRow(row)];
      } else {
        TR = this.TBODY.childNodes[this.rowFilter.sourceToRendered(row)];
      }
      if (!TR && row >= 0) {
        throw new Error("TR was expected to be rendered but is not");
      }
      var TD = TR.childNodes[this.columnFilter.sourceColumnToVisibleRowHeadedColumn(column)];
      if (!TD && column >= 0) {
        throw new Error("TD or TH was expected to be rendered but is not");
      }
      return TD;
    }
  }, {
    key: "getColumnHeader",
    value: function getColumnHeader(col) {
      var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      var TR = this.THEAD.childNodes[level];
      return TR === null || TR === void 0 ? void 0 : TR.childNodes[this.columnFilter.sourceColumnToVisibleRowHeadedColumn(col)];
    }
  }, {
    key: "getColumnHeaders",
    value: function getColumnHeaders(column) {
      var THs = [];
      var visibleColumn = this.columnFilter.sourceColumnToVisibleRowHeadedColumn(column);
      this.THEAD.childNodes.forEach(function(TR) {
        var TH = TR.childNodes[visibleColumn];
        if (TH) {
          THs.push(TH);
        }
      });
      return THs;
    }
  }, {
    key: "getRowHeader",
    value: function getRowHeader(row) {
      var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      if (this.columnFilter.sourceColumnToVisibleRowHeadedColumn(0) === 0) {
        return;
      }
      var rowHeadersCount = this.wtSettings.getSetting("rowHeaders").length;
      if (level >= rowHeadersCount) {
        return;
      }
      var TR = this.TBODY.childNodes[this.rowFilter.sourceToRendered(row)];
      return TR === null || TR === void 0 ? void 0 : TR.childNodes[level];
    }
  }, {
    key: "getRowHeaders",
    value: function getRowHeaders(row) {
      if (this.columnFilter.sourceColumnToVisibleRowHeadedColumn(0) === 0) {
        return [];
      }
      var THs = [];
      var rowHeadersCount = this.wtSettings.getSetting("rowHeaders").length;
      for (var renderedRowIndex = 0; renderedRowIndex < rowHeadersCount; renderedRowIndex++) {
        var TR = this.TBODY.childNodes[this.rowFilter.sourceToRendered(row)];
        var TH = TR === null || TR === void 0 ? void 0 : TR.childNodes[renderedRowIndex];
        if (TH) {
          THs.push(TH);
        }
      }
      return THs;
    }
  }, {
    key: "getCoords",
    value: function getCoords(TD) {
      var cellElement = TD;
      if (cellElement.nodeName !== "TD" && cellElement.nodeName !== "TH") {
        cellElement = closest(cellElement, ["TD", "TH"]);
      }
      if (cellElement === null) {
        return null;
      }
      var TR = cellElement.parentNode;
      var CONTAINER = TR.parentNode;
      var row = index(TR);
      var col = cellElement.cellIndex;
      if (overlayContainsElement(CLONE_TOP_INLINE_START_CORNER, cellElement, this.wtRootElement) || overlayContainsElement(CLONE_TOP, cellElement, this.wtRootElement)) {
        if (CONTAINER.nodeName === "THEAD") {
          row -= CONTAINER.childNodes.length;
        }
      } else if (overlayContainsElement(CLONE_BOTTOM_INLINE_START_CORNER, cellElement, this.wtRootElement) || overlayContainsElement(CLONE_BOTTOM, cellElement, this.wtRootElement)) {
        var totalRows = this.wtSettings.getSetting("totalRows");
        row = totalRows - CONTAINER.childNodes.length + row;
      } else if (CONTAINER === this.THEAD) {
        row = this.rowFilter.visibleColHeadedRowToSourceRow(row);
      } else {
        row = this.rowFilter.renderedToSource(row);
      }
      if (overlayContainsElement(CLONE_TOP_INLINE_START_CORNER, cellElement, this.wtRootElement) || overlayContainsElement(CLONE_INLINE_START, cellElement, this.wtRootElement) || overlayContainsElement(CLONE_BOTTOM_INLINE_START_CORNER, cellElement, this.wtRootElement)) {
        col = this.columnFilter.offsettedTH(col);
      } else {
        col = this.columnFilter.visibleRowHeadedColumnToSourceColumn(col);
      }
      return this.wot.createCellCoords(row, col);
    }
  }, {
    key: "markOversizedRows",
    value: function markOversizedRows() {
      if (this.wtSettings.getSetting("externalRowCalculator")) {
        return;
      }
      var rowCount = this.TBODY.childNodes.length;
      var expectedTableHeight = rowCount * this.wtSettings.getSetting("defaultRowHeight");
      var actualTableHeight = innerHeight(this.TBODY) - 1;
      var previousRowHeight;
      var rowInnerHeight;
      var sourceRowIndex;
      var currentTr;
      var rowHeader;
      if (expectedTableHeight === actualTableHeight && !this.wtSettings.getSetting("fixedRowsBottom")) {
        return;
      }
      while (rowCount) {
        rowCount -= 1;
        sourceRowIndex = this.rowFilter.renderedToSource(rowCount);
        previousRowHeight = this.getRowHeight(sourceRowIndex);
        currentTr = this.getTrForRow(sourceRowIndex);
        rowHeader = currentTr.querySelector("th");
        if (rowHeader) {
          rowInnerHeight = innerHeight(rowHeader);
        } else {
          rowInnerHeight = innerHeight(currentTr) - 1;
        }
        if (!previousRowHeight && this.wtSettings.getSetting("defaultRowHeight") < rowInnerHeight || previousRowHeight < rowInnerHeight) {
          rowInnerHeight += 1;
          this.dataAccessObject.wtViewport.oversizedRows[sourceRowIndex] = rowInnerHeight;
        }
      }
    }
  }, {
    key: "getTrForRow",
    value: function getTrForRow(row) {
      return this.TBODY.childNodes[this.rowFilter.sourceToRendered(row)];
    }
  }, {
    key: "isColumnHeaderRendered",
    value: function isColumnHeaderRendered(column) {
      if (column >= 0) {
        return false;
      }
      var rowHeaders = this.wtSettings.getSetting("rowHeaders");
      var rowHeadersCount = rowHeaders.length;
      return Math.abs(column) <= rowHeadersCount;
    }
  }, {
    key: "isRowHeaderRendered",
    value: function isRowHeaderRendered(row) {
      if (row >= 0) {
        return false;
      }
      var columnHeaders = this.wtSettings.getSetting("columnHeaders");
      var columnHeadersCount = columnHeaders.length;
      return Math.abs(row) <= columnHeadersCount;
    }
  }, {
    key: "isRowBeforeRenderedRows",
    value: function isRowBeforeRenderedRows(row) {
      var first = this.getFirstRenderedRow();
      if (row < 0 && first <= 0) {
        return !this.isRowHeaderRendered(row);
      }
      return row < first;
    }
  }, {
    key: "isRowAfterRenderedRows",
    value: function isRowAfterRenderedRows(row) {
      return row > this.getLastRenderedRow();
    }
  }, {
    key: "isColumnBeforeRenderedColumns",
    value: function isColumnBeforeRenderedColumns(column) {
      var first = this.getFirstRenderedColumn();
      if (column < 0 && first <= 0) {
        return !this.isColumnHeaderRendered(column);
      }
      return column < first;
    }
  }, {
    key: "isColumnAfterRenderedColumns",
    value: function isColumnAfterRenderedColumns(column) {
      return this.columnFilter && column > this.getLastRenderedColumn();
    }
  }, {
    key: "isColumnAfterViewport",
    value: function isColumnAfterViewport(column) {
      return this.columnFilter && column > this.getLastVisibleColumn();
    }
  }, {
    key: "isRowAfterViewport",
    value: function isRowAfterViewport(row) {
      return this.rowFilter && row > this.getLastVisibleRow();
    }
  }, {
    key: "isColumnBeforeViewport",
    value: function isColumnBeforeViewport(column) {
      return this.columnFilter && this.columnFilter.sourceToRendered(column) < 0 && column >= 0;
    }
  }, {
    key: "isLastRowFullyVisible",
    value: function isLastRowFullyVisible() {
      return this.getLastVisibleRow() === this.getLastRenderedRow();
    }
  }, {
    key: "isLastColumnFullyVisible",
    value: function isLastColumnFullyVisible() {
      return this.getLastVisibleColumn() === this.getLastRenderedColumn();
    }
  }, {
    key: "allRowsInViewport",
    value: function allRowsInViewport() {
      return this.wtSettings.getSetting("totalRows") === this.getVisibleRowsCount();
    }
  }, {
    key: "allColumnsInViewport",
    value: function allColumnsInViewport() {
      return this.wtSettings.getSetting("totalColumns") === this.getVisibleColumnsCount();
    }
  }, {
    key: "getRowHeight",
    value: function getRowHeight(sourceRow) {
      return this.rowUtils.getHeight(sourceRow);
    }
  }, {
    key: "getColumnHeaderHeight",
    value: function getColumnHeaderHeight(level) {
      return this.columnUtils.getHeaderHeight(level);
    }
  }, {
    key: "getColumnWidth",
    value: function getColumnWidth(sourceColumn) {
      return this.columnUtils.getWidth(sourceColumn);
    }
  }, {
    key: "getStretchedColumnWidth",
    value: function getStretchedColumnWidth(sourceColumn) {
      return this.columnUtils.getStretchedColumnWidth(sourceColumn);
    }
  }, {
    key: "hasDefinedSize",
    value: function hasDefinedSize() {
      return this.hasTableHeight && this.hasTableWidth;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return outerWidth(this.TABLE);
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return outerHeight(this.TABLE);
    }
  }, {
    key: "getTotalWidth",
    value: function getTotalWidth() {
      var width = outerWidth(this.hider);
      return width !== 0 ? width : this.getWidth();
    }
  }, {
    key: "getTotalHeight",
    value: function getTotalHeight() {
      var height = outerHeight(this.hider);
      return height !== 0 ? height : this.getHeight();
    }
  }, {
    key: "isVisible",
    value: function isVisible$1() {
      return isVisible(this.TABLE);
    }
  }, {
    key: "_modifyRowHeaderWidth",
    value: function _modifyRowHeaderWidth(rowHeaderWidthFactory) {
      var widths = isFunction(rowHeaderWidthFactory) ? rowHeaderWidthFactory() : null;
      if (Array.isArray(widths)) {
        widths = _toConsumableArray$9(widths);
        widths[widths.length - 1] = this._correctRowHeaderWidth(widths[widths.length - 1]);
      } else {
        widths = this._correctRowHeaderWidth(widths);
      }
      return widths;
    }
  }, {
    key: "_correctRowHeaderWidth",
    value: function _correctRowHeaderWidth(width) {
      var rowHeaderWidth = width;
      if (typeof width !== "number") {
        rowHeaderWidth = this.wtSettings.getSetting("defaultColumnWidth");
      }
      if (this.correctHeaderWidth) {
        rowHeaderWidth += 1;
      }
      return rowHeaderWidth;
    }
  }]);
  return Table2;
}();

var MIXIN_NAME = "stickyRowsBottom";
var stickyRowsBottom = {
  getFirstRenderedRow: function getFirstRenderedRow() {
    var totalRows = this.wtSettings.getSetting("totalRows");
    var fixedRowsBottom = this.wtSettings.getSetting("fixedRowsBottom");
    var index = totalRows - fixedRowsBottom;
    if (totalRows === 0 || fixedRowsBottom === 0) {
      return -1;
    }
    if (index < 0) {
      return 0;
    }
    return index;
  },
  getFirstVisibleRow: function getFirstVisibleRow() {
    return this.getFirstRenderedRow();
  },
  getLastRenderedRow: function getLastRenderedRow() {
    return this.wtSettings.getSetting("totalRows") - 1;
  },
  getLastVisibleRow: function getLastVisibleRow() {
    return this.getLastRenderedRow();
  },
  getRenderedRowsCount: function getRenderedRowsCount() {
    var totalRows = this.wtSettings.getSetting("totalRows");
    return Math.min(this.wtSettings.getSetting("fixedRowsBottom"), totalRows);
  },
  getVisibleRowsCount: function getVisibleRowsCount() {
    return this.getRenderedRowsCount();
  }
};
defineGetter(stickyRowsBottom, "MIXIN_NAME", MIXIN_NAME, {
  writable: false,
  enumerable: false
});

var MIXIN_NAME$1 = "stickyColumnsStart";
var stickyColumnsStart = {
  getFirstRenderedColumn: function getFirstRenderedColumn() {
    var totalColumns = this.wtSettings.getSetting("totalColumns");
    if (totalColumns === 0) {
      return -1;
    }
    return 0;
  },
  getFirstVisibleColumn: function getFirstVisibleColumn() {
    return this.getFirstRenderedColumn();
  },
  getLastRenderedColumn: function getLastRenderedColumn() {
    return this.getRenderedColumnsCount() - 1;
  },
  getLastVisibleColumn: function getLastVisibleColumn() {
    return this.getLastRenderedColumn();
  },
  getRenderedColumnsCount: function getRenderedColumnsCount() {
    var totalColumns = this.wtSettings.getSetting("totalColumns");
    return Math.min(this.wtSettings.getSetting("fixedColumnsStart"), totalColumns);
  },
  getVisibleColumnsCount: function getVisibleColumnsCount() {
    return this.getRenderedColumnsCount();
  }
};
defineGetter(stickyColumnsStart, "MIXIN_NAME", MIXIN_NAME$1, {
  writable: false,
  enumerable: false
});

function _typeof$b(obj) {
  "@babel/helpers - typeof";
  return _typeof$b = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$b(obj);
}
function _defineProperties$q(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$q(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$q(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$q(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$q(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$6(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$7(subClass, superClass);
}
function _setPrototypeOf$7(o, p) {
  _setPrototypeOf$7 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$7(o, p);
}
function _createSuper$6(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$7();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$6(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$6(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$6(this, result);
  };
}
function _possibleConstructorReturn$6(self, call) {
  if (call && (_typeof$b(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$6(self);
}
function _assertThisInitialized$6(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$7() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$6(o) {
  _getPrototypeOf$6 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$6(o);
}
var BottomInlineStartCornerOverlayTable = /* @__PURE__ */ function(_Table) {
  _inherits$6(BottomInlineStartCornerOverlayTable2, _Table);
  var _super = _createSuper$6(BottomInlineStartCornerOverlayTable2);
  function BottomInlineStartCornerOverlayTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$q(this, BottomInlineStartCornerOverlayTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, CLONE_BOTTOM_INLINE_START_CORNER);
  }
  return _createClass$q(BottomInlineStartCornerOverlayTable2);
}(Table);
mixin(BottomInlineStartCornerOverlayTable, stickyRowsBottom);
mixin(BottomInlineStartCornerOverlayTable, stickyColumnsStart);

var CLONE_TOP = "top";
var CLONE_BOTTOM = "bottom";
var CLONE_INLINE_START = "inline_start";
var CLONE_TOP_INLINE_START_CORNER = "top_inline_start_corner";
var CLONE_BOTTOM_INLINE_START_CORNER = "bottom_inline_start_corner";
var CLONE_TYPES = [CLONE_TOP, CLONE_BOTTOM, CLONE_INLINE_START, CLONE_TOP_INLINE_START_CORNER, CLONE_BOTTOM_INLINE_START_CORNER];
var CLONE_CLASS_NAMES = new Map([[CLONE_TOP, "ht_clone_".concat(CLONE_TOP)], [CLONE_BOTTOM, "ht_clone_".concat(CLONE_BOTTOM)], [CLONE_INLINE_START, "ht_clone_".concat(CLONE_INLINE_START, " ht_clone_left")], [CLONE_TOP_INLINE_START_CORNER, "ht_clone_".concat(CLONE_TOP_INLINE_START_CORNER, " ht_clone_top_left_corner")], [CLONE_BOTTOM_INLINE_START_CORNER, "ht_clone_".concat(CLONE_BOTTOM_INLINE_START_CORNER, " ht_clone_bottom_left_corner")]]);

function _classCallCheck$r(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$r(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$r(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$r(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$r(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Scroll = /* @__PURE__ */ function() {
  function Scroll2(dataAccessObject) {
    _classCallCheck$r(this, Scroll2);
    _defineProperty$4(this, "dataAccessObject", void 0);
    this.dataAccessObject = dataAccessObject;
  }
  _createClass$r(Scroll2, [{
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      if (coords.col < 0 || coords.row < 0) {
        return false;
      }
      var scrolledHorizontally = this.scrollViewportHorizontally(coords.col, snapToRight, snapToLeft);
      var scrolledVertically = this.scrollViewportVertically(coords.row, snapToTop, snapToBottom);
      return scrolledHorizontally || scrolledVertically;
    }
  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      if (!this.dataAccessObject.drawn) {
        return false;
      }
      var _this$dataAccessObjec = this.dataAccessObject, fixedColumnsStart = _this$dataAccessObjec.fixedColumnsStart, inlineStartOverlay = _this$dataAccessObjec.inlineStartOverlay, totalColumns = _this$dataAccessObjec.totalColumns;
      var result = false;
      if (column >= 0 && column <= Math.max(totalColumns - 1, 0)) {
        var firstVisibleColumn = this.getFirstVisibleColumn();
        var lastVisibleColumn = this.getLastVisibleColumn();
        if (column >= fixedColumnsStart && firstVisibleColumn > -1 && (column < firstVisibleColumn || snapToLeft)) {
          result = inlineStartOverlay.scrollTo(column);
        } else if (lastVisibleColumn === -1 || lastVisibleColumn > -1 && (column > lastVisibleColumn || snapToRight)) {
          result = inlineStartOverlay.scrollTo(column, true);
        }
      }
      return result;
    }
  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      if (!this.dataAccessObject.drawn) {
        return false;
      }
      var _this$dataAccessObjec2 = this.dataAccessObject, fixedRowsBottom = _this$dataAccessObjec2.fixedRowsBottom, fixedRowsTop = _this$dataAccessObjec2.fixedRowsTop, topOverlay = _this$dataAccessObjec2.topOverlay, totalRows = _this$dataAccessObjec2.totalRows;
      var result = false;
      if (row >= 0 && row <= Math.max(totalRows - 1, 0)) {
        var firstVisibleRow = this.getFirstVisibleRow();
        var lastVisibleRow = this.getLastVisibleRow();
        if (row >= fixedRowsTop && firstVisibleRow > -1 && (row < firstVisibleRow || snapToTop)) {
          result = topOverlay.scrollTo(row);
        } else if (lastVisibleRow === -1 || lastVisibleRow > -1 && (row > lastVisibleRow && row < totalRows - fixedRowsBottom || snapToBottom)) {
          result = topOverlay.scrollTo(row, true);
        }
      }
      return result;
    }
  }, {
    key: "getFirstVisibleRow",
    value: function getFirstVisibleRow() {
      var _this$dataAccessObjec3 = this.dataAccessObject, topOverlay = _this$dataAccessObjec3.topOverlay, wtTable = _this$dataAccessObjec3.wtTable, wtViewport = _this$dataAccessObjec3.wtViewport, totalRows = _this$dataAccessObjec3.totalRows, fixedRowsTop = _this$dataAccessObjec3.fixedRowsTop, rootWindow = _this$dataAccessObjec3.rootWindow;
      var firstVisibleRow = wtTable.getFirstVisibleRow();
      if (topOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var totalTableHeight = innerHeight(wtTable.hider);
        var windowHeight = innerHeight(rootWindow);
        var windowScrollTop = getScrollTop(rootWindow, rootWindow);
        if (rootElementOffset.top + totalTableHeight - windowHeight <= windowScrollTop) {
          var rowsHeight = wtViewport.getColumnHeaderHeight();
          rowsHeight += topOverlay.sumCellSizes(0, fixedRowsTop);
          for (var row = totalRows; row > 0; row--) {
            rowsHeight += topOverlay.sumCellSizes(row - 1, row);
            if (rootElementOffset.top + totalTableHeight - rowsHeight <= windowScrollTop) {
              firstVisibleRow = row;
              break;
            }
          }
        }
      }
      return firstVisibleRow;
    }
  }, {
    key: "getLastVisibleRow",
    value: function getLastVisibleRow() {
      var _this$dataAccessObjec4 = this.dataAccessObject, topOverlay = _this$dataAccessObjec4.topOverlay, wtTable = _this$dataAccessObjec4.wtTable, wtViewport = _this$dataAccessObjec4.wtViewport, totalRows = _this$dataAccessObjec4.totalRows, rootWindow = _this$dataAccessObjec4.rootWindow;
      var lastVisibleRow = wtTable.getLastVisibleRow();
      if (topOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var windowScrollTop = getScrollTop(rootWindow, rootWindow);
        if (rootElementOffset.top > windowScrollTop) {
          var windowHeight = innerHeight(rootWindow);
          var rowsHeight = wtViewport.getColumnHeaderHeight();
          for (var row = 1; row <= totalRows; row++) {
            rowsHeight += topOverlay.sumCellSizes(row - 1, row);
            if (rootElementOffset.top + rowsHeight - windowScrollTop >= windowHeight) {
              lastVisibleRow = row - 2;
              break;
            }
          }
        }
      }
      return lastVisibleRow;
    }
  }, {
    key: "getFirstVisibleColumn",
    value: function getFirstVisibleColumn() {
      var _this$dataAccessObjec5 = this.dataAccessObject, inlineStartOverlay = _this$dataAccessObjec5.inlineStartOverlay, wtTable = _this$dataAccessObjec5.wtTable, wtViewport = _this$dataAccessObjec5.wtViewport, totalColumns = _this$dataAccessObjec5.totalColumns, rootWindow = _this$dataAccessObjec5.rootWindow;
      var firstVisibleColumn = wtTable.getFirstVisibleColumn();
      if (inlineStartOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var totalTableWidth = innerWidth(wtTable.hider);
        var windowWidth = innerWidth(rootWindow);
        var windowScrollLeft = Math.abs(getScrollLeft(rootWindow, rootWindow));
        if (rootElementOffset.left + totalTableWidth - windowWidth <= windowScrollLeft) {
          var columnsWidth = wtViewport.getRowHeaderWidth();
          for (var column = totalColumns; column > 0; column--) {
            columnsWidth += inlineStartOverlay.sumCellSizes(column - 1, column);
            if (rootElementOffset.left + totalTableWidth - columnsWidth <= windowScrollLeft) {
              firstVisibleColumn = column;
              break;
            }
          }
        }
      }
      return firstVisibleColumn;
    }
  }, {
    key: "getLastVisibleColumn",
    value: function getLastVisibleColumn() {
      var _this$dataAccessObjec6 = this.dataAccessObject, inlineStartOverlay = _this$dataAccessObjec6.inlineStartOverlay, wtTable = _this$dataAccessObjec6.wtTable, wtViewport = _this$dataAccessObjec6.wtViewport, totalColumns = _this$dataAccessObjec6.totalColumns, rootWindow = _this$dataAccessObjec6.rootWindow;
      var lastVisibleColumn = wtTable.getLastVisibleColumn();
      if (inlineStartOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var windowScrollLeft = Math.abs(getScrollLeft(rootWindow, rootWindow));
        if (rootElementOffset.left > windowScrollLeft) {
          var windowWidth = innerWidth(rootWindow);
          var columnsWidth = wtViewport.getRowHeaderWidth();
          for (var column = 1; column <= totalColumns; column++) {
            columnsWidth += inlineStartOverlay.sumCellSizes(column - 1, column);
            if (rootElementOffset.left + columnsWidth - windowScrollLeft >= windowWidth) {
              lastVisibleColumn = column - 2;
              break;
            }
          }
        }
      }
      return lastVisibleColumn;
    }
  }]);
  return Scroll2;
}();

function _classCallCheck$s(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$s(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$s(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$s(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$s(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var CoreAbstract = /* @__PURE__ */ function() {
  function CoreAbstract2(table, settings) {
    _classCallCheck$s(this, CoreAbstract2);
    _defineProperty$5(this, "wtTable", void 0);
    _defineProperty$5(this, "wtScroll", void 0);
    _defineProperty$5(this, "wtViewport", void 0);
    _defineProperty$5(this, "wtOverlays", void 0);
    _defineProperty$5(this, "selections", void 0);
    _defineProperty$5(this, "wtEvent", void 0);
    _defineProperty$5(this, "guid", "wt_".concat(randomString()));
    _defineProperty$5(this, "drawInterrupted", false);
    _defineProperty$5(this, "drawn", false);
    _defineProperty$5(this, "domBindings", void 0);
    _defineProperty$5(this, "wtSettings", void 0);
    this.domBindings = {
      rootTable: table,
      rootDocument: table.ownerDocument,
      rootWindow: table.ownerDocument.defaultView
    };
    this.wtSettings = settings;
    this.wtScroll = new Scroll(this.createScrollDao());
  }
  _createClass$s(CoreAbstract2, [{
    key: "eventManager",
    get: function get() {
      return new EventManager(this);
    }
  }, {
    key: "findOriginalHeaders",
    value: function findOriginalHeaders() {
      var originalHeaders = [];
      if (this.wtTable.THEAD.childNodes.length && this.wtTable.THEAD.childNodes[0].childNodes.length) {
        for (var c = 0, clen = this.wtTable.THEAD.childNodes[0].childNodes.length; c < clen; c++) {
          originalHeaders.push(this.wtTable.THEAD.childNodes[0].childNodes[c].innerHTML);
        }
        if (!this.wtSettings.getSetting("columnHeaders").length) {
          this.wtSettings.update("columnHeaders", [function(column, TH) {
            fastInnerText(TH, originalHeaders[column]);
          }]);
        }
      }
    }
  }, {
    key: "createCellCoords",
    value: function createCellCoords(row, column) {
      return new CellCoords(row, column, this.wtSettings.getSetting("rtlMode"));
    }
  }, {
    key: "createCellRange",
    value: function createCellRange(highlight, from, to) {
      return new CellRange(highlight, from, to, this.wtSettings.getSetting("rtlMode"));
    }
  }, {
    key: "draw",
    value: function draw() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this.drawInterrupted = false;
      if (!fastDraw && !this.wtTable.isVisible()) {
        this.drawInterrupted = true;
      } else {
        this.wtTable.draw(fastDraw);
      }
      return this;
    }
  }, {
    key: "getCell",
    value: function getCell(coords) {
      var topmost = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!topmost) {
        return this.wtTable.getCell(coords);
      }
      var totalRows = this.wtSettings.getSetting("totalRows");
      var fixedRowsTop = this.wtSettings.getSetting("fixedRowsTop");
      var fixedRowsBottom = this.wtSettings.getSetting("fixedRowsBottom");
      var fixedColumnsStart = this.wtSettings.getSetting("fixedColumnsStart");
      if (coords.row < fixedRowsTop && coords.col < fixedColumnsStart) {
        return this.wtOverlays.topInlineStartCornerOverlay.clone.wtTable.getCell(coords);
      } else if (coords.row < fixedRowsTop) {
        return this.wtOverlays.topOverlay.clone.wtTable.getCell(coords);
      } else if (coords.col < fixedColumnsStart && coords.row >= totalRows - fixedRowsBottom) {
        if (this.wtOverlays.bottomInlineStartCornerOverlay && this.wtOverlays.bottomInlineStartCornerOverlay.clone) {
          return this.wtOverlays.bottomInlineStartCornerOverlay.clone.wtTable.getCell(coords);
        }
      } else if (coords.col < fixedColumnsStart) {
        return this.wtOverlays.inlineStartOverlay.clone.wtTable.getCell(coords);
      } else if (coords.row < totalRows && coords.row >= totalRows - fixedRowsBottom) {
        if (this.wtOverlays.bottomOverlay && this.wtOverlays.bottomOverlay.clone) {
          return this.wtOverlays.bottomOverlay.clone.wtTable.getCell(coords);
        }
      }
      return this.wtTable.getCell(coords);
    }
  }, {
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      if (coords.col < 0 || coords.row < 0) {
        return false;
      }
      return this.wtScroll.scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft);
    }
  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      if (column < 0) {
        return false;
      }
      return this.wtScroll.scrollViewportHorizontally(column, snapToRight, snapToLeft);
    }
  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      if (row < 0) {
        return false;
      }
      return this.wtScroll.scrollViewportVertically(row, snapToTop, snapToBottom);
    }
  }, {
    key: "getViewport",
    value: function getViewport() {
      return [this.wtTable.getFirstVisibleRow(), this.wtTable.getFirstVisibleColumn(), this.wtTable.getLastVisibleRow(), this.wtTable.getLastVisibleColumn()];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.wtOverlays.destroy();
      this.wtEvent.destroy();
    }
  }, {
    key: "createScrollDao",
    value: function createScrollDao() {
      var wot = this;
      return {
        get drawn() {
          return wot.drawn;
        },
        get topOverlay() {
          return wot.wtOverlays.topOverlay;
        },
        get inlineStartOverlay() {
          return wot.wtOverlays.inlineStartOverlay;
        },
        get wtTable() {
          return wot.wtTable;
        },
        get wtViewport() {
          return wot.wtViewport;
        },
        get rootWindow() {
          return wot.domBindings.rootWindow;
        },
        get totalRows() {
          return wot.wtSettings.getSetting("totalRows");
        },
        get totalColumns() {
          return wot.wtSettings.getSetting("totalColumns");
        },
        get fixedRowsTop() {
          return wot.wtSettings.getSetting("fixedRowsTop");
        },
        get fixedRowsBottom() {
          return wot.wtSettings.getSetting("fixedRowsBottom");
        },
        get fixedColumnsStart() {
          return wot.wtSettings.getSetting("fixedColumnsStart");
        }
      };
    }
  }, {
    key: "getTableDao",
    value: function getTableDao() {
      var wot = this;
      return {
        get wot() {
          return wot;
        },
        get parentTableOffset() {
          return wot.cloneSource.wtTable.tableOffset;
        },
        get cloneSource() {
          return wot.cloneSource;
        },
        get workspaceWidth() {
          return wot.wtViewport.getWorkspaceWidth();
        },
        get wtViewport() {
          return wot.wtViewport;
        },
        get wtOverlays() {
          return wot.wtOverlays;
        },
        get selections() {
          return wot.selections;
        },
        get drawn() {
          return wot.drawn;
        },
        set drawn(v) {
          wot.drawn = v;
        },
        get wtTable() {
          return wot.wtTable;
        },
        get startColumnRendered() {
          return wot.wtViewport.columnsRenderCalculator.startColumn;
        },
        get startColumnVisible() {
          return wot.wtViewport.columnsVisibleCalculator.startColumn;
        },
        get endColumnRendered() {
          return wot.wtViewport.columnsRenderCalculator.endColumn;
        },
        get endColumnVisible() {
          return wot.wtViewport.columnsVisibleCalculator.endColumn;
        },
        get countColumnsRendered() {
          return wot.wtViewport.columnsRenderCalculator.count;
        },
        get countColumnsVisible() {
          return wot.wtViewport.columnsVisibleCalculator.count;
        },
        get startRowRendered() {
          return wot.wtViewport.rowsRenderCalculator.startRow;
        },
        get startRowVisible() {
          return wot.wtViewport.rowsVisibleCalculator.startRow;
        },
        get endRowRendered() {
          return wot.wtViewport.rowsRenderCalculator.endRow;
        },
        get endRowVisible() {
          return wot.wtViewport.rowsVisibleCalculator.endRow;
        },
        get countRowsRendered() {
          return wot.wtViewport.rowsRenderCalculator.count;
        },
        get countRowsVisible() {
          return wot.wtViewport.rowsVisibleCalculator.count;
        }
      };
    }
  }]);
  return CoreAbstract2;
}();

function _typeof$c(obj) {
  "@babel/helpers - typeof";
  return _typeof$c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$c(obj);
}
function _defineProperties$t(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$t(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$t(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$t(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$t(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$7(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$8(subClass, superClass);
}
function _setPrototypeOf$8(o, p) {
  _setPrototypeOf$8 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$8(o, p);
}
function _createSuper$7(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$8();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$7(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$7(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$7(this, result);
  };
}
function _possibleConstructorReturn$7(self, call) {
  if (call && (_typeof$c(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$7(self);
}
function _assertThisInitialized$7(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$8() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$7(o) {
  _getPrototypeOf$7 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$7(o);
}
function _defineProperty$6(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Clone = /* @__PURE__ */ function(_CoreAbstract) {
  _inherits$7(Clone2, _CoreAbstract);
  var _super = _createSuper$7(Clone2);
  function Clone2(table, settings, clone) {
    var _this;
    _classCallCheck$t(this, Clone2);
    _this = _super.call(this, table, settings);
    _defineProperty$6(_assertThisInitialized$7(_this), "cloneSource", void 0);
    _defineProperty$6(_assertThisInitialized$7(_this), "cloneOverlay", void 0);
    var facadeGetter = _this.wtSettings.getSetting("facade", _assertThisInitialized$7(_this));
    _this.cloneSource = clone.source;
    _this.cloneOverlay = clone.overlay;
    _this.wtTable = _this.cloneOverlay.createTable(_this.getTableDao(), facadeGetter, _this.domBindings, _this.wtSettings);
    _this.wtViewport = clone.viewport;
    _this.selections = clone.selections;
    _this.wtEvent = new Event(facadeGetter, _this.domBindings, _this.wtSettings, _this.eventManager, _this.wtTable, _this.selections, clone.event);
    _this.findOriginalHeaders();
    return _this;
  }
  return _createClass$t(Clone2);
}(CoreAbstract);

function _classCallCheck$u(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$u(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$u(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$u(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$u(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$7(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Overlay = /* @__PURE__ */ function() {
  function Overlay2(wotInstance, facadeGetter, type, wtSettings, domBindings) {
    _classCallCheck$u(this, Overlay2);
    _defineProperty$7(this, "wtSettings", null);
    defineGetter(this, "wot", wotInstance, {
      writable: false
    });
    this.domBindings = domBindings;
    this.facadeGetter = facadeGetter;
    this.wtSettings = wtSettings;
    var _this$wot$wtTable = this.wot.wtTable, TABLE = _this$wot$wtTable.TABLE, hider = _this$wot$wtTable.hider, spreader = _this$wot$wtTable.spreader, holder = _this$wot$wtTable.holder, wtRootElement = _this$wot$wtTable.wtRootElement;
    this.instance = this.wot;
    this.type = type;
    this.mainTableScrollableElement = null;
    this.TABLE = TABLE;
    this.hider = hider;
    this.spreader = spreader;
    this.holder = holder;
    this.wtRootElement = wtRootElement;
    this.trimmingContainer = getTrimmingContainer(this.hider.parentNode.parentNode);
    this.updateStateOfRendering();
    this.clone = this.makeClone();
  }
  _createClass$u(Overlay2, [{
    key: "updateStateOfRendering",
    value: function updateStateOfRendering() {
      var previousState = this.needFullRender;
      this.needFullRender = this.shouldBeRendered();
      var changed = previousState !== this.needFullRender;
      if (changed && !this.needFullRender) {
        this.reset();
      }
      return changed;
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return true;
    }
  }, {
    key: "updateTrimmingContainer",
    value: function updateTrimmingContainer() {
      this.trimmingContainer = getTrimmingContainer(this.hider.parentNode.parentNode);
    }
  }, {
    key: "updateMainScrollableElement",
    value: function updateMainScrollableElement() {
      var wtTable = this.wot.wtTable;
      var rootWindow = this.domBindings.rootWindow;
      if (rootWindow.getComputedStyle(wtTable.wtRootElement.parentNode).getPropertyValue("overflow") === "hidden") {
        this.mainTableScrollableElement = this.wot.wtTable.holder;
      } else {
        this.mainTableScrollableElement = getScrollableElement(wtTable.TABLE);
      }
    }
  }, {
    key: "getRelativeCellPosition",
    value: function getRelativeCellPosition(element, rowIndex, columnIndex) {
      if (this.clone.wtTable.holder.contains(element) === false) {
        warn("The provided element is not a child of the ".concat(this.type, " overlay"));
        return;
      }
      var windowScroll = this.mainTableScrollableElement === this.domBindings.rootWindow;
      var fixedColumnStart = columnIndex < this.wtSettings.getSetting("fixedColumnsStart");
      var fixedRowTop = rowIndex < this.wtSettings.getSetting("fixedRowsTop");
      var fixedRowBottom = rowIndex >= this.wtSettings.getSetting("totalRows") - this.wtSettings.getSetting("fixedRowsBottom");
      var spreader = this.clone.wtTable.spreader;
      var spreaderOffset = {
        start: this.getRelativeStartPosition(spreader),
        top: spreader.offsetTop
      };
      var elementOffset = {
        start: this.getRelativeStartPosition(element),
        top: element.offsetTop
      };
      var offsetObject = null;
      if (windowScroll) {
        offsetObject = this.getRelativeCellPositionWithinWindow(fixedRowTop, fixedColumnStart, elementOffset, spreaderOffset);
      } else {
        offsetObject = this.getRelativeCellPositionWithinHolder(fixedRowTop, fixedRowBottom, fixedColumnStart, elementOffset, spreaderOffset);
      }
      return offsetObject;
    }
  }, {
    key: "getRelativeStartPosition",
    value: function getRelativeStartPosition(el) {
      return this.isRtl() ? el.offsetParent.offsetWidth - el.offsetLeft - el.offsetWidth : el.offsetLeft;
    }
  }, {
    key: "getRelativeCellPositionWithinWindow",
    value: function getRelativeCellPositionWithinWindow(onFixedRowTop, onFixedColumn, elementOffset, spreaderOffset) {
      var absoluteRootElementPosition = this.wot.wtTable.wtRootElement.getBoundingClientRect();
      var horizontalOffset = 0;
      var verticalOffset = 0;
      if (!onFixedColumn) {
        horizontalOffset = spreaderOffset.start;
      } else {
        var absoluteRootElementStartPosition = absoluteRootElementPosition.left;
        if (this.isRtl()) {
          absoluteRootElementStartPosition = this.domBindings.rootWindow.innerWidth - (absoluteRootElementPosition.left + absoluteRootElementPosition.width + getScrollbarWidth());
        }
        horizontalOffset = absoluteRootElementStartPosition <= 0 ? -1 * absoluteRootElementStartPosition : 0;
      }
      if (onFixedRowTop) {
        var absoluteOverlayPosition = this.clone.wtTable.TABLE.getBoundingClientRect();
        verticalOffset = absoluteOverlayPosition.top - absoluteRootElementPosition.top;
      } else {
        verticalOffset = spreaderOffset.top;
      }
      return {
        start: elementOffset.start + horizontalOffset,
        top: elementOffset.top + verticalOffset
      };
    }
  }, {
    key: "getRelativeCellPositionWithinHolder",
    value: function getRelativeCellPositionWithinHolder(onFixedRowTop, onFixedRowBottom, onFixedColumn, elementOffset, spreaderOffset) {
      var tableScrollPosition = {
        horizontal: this.wot.wtOverlays.inlineStartOverlay.getScrollPosition(),
        vertical: this.wot.wtOverlays.topOverlay.getScrollPosition()
      };
      var horizontalOffset = 0;
      var verticalOffset = 0;
      if (!onFixedColumn) {
        horizontalOffset = tableScrollPosition.horizontal - spreaderOffset.start;
      }
      if (onFixedRowBottom) {
        var absoluteRootElementPosition = this.wot.wtTable.wtRootElement.getBoundingClientRect();
        var absoluteOverlayPosition = this.clone.wtTable.TABLE.getBoundingClientRect();
        verticalOffset = absoluteOverlayPosition.top * -1 + absoluteRootElementPosition.top;
      } else if (!onFixedRowTop) {
        verticalOffset = tableScrollPosition.vertical - spreaderOffset.top;
      }
      return {
        start: elementOffset.start - horizontalOffset,
        top: elementOffset.top - verticalOffset
      };
    }
  }, {
    key: "makeClone",
    value: function makeClone() {
      if (CLONE_TYPES.indexOf(this.type) === -1) {
        throw new Error('Clone type "'.concat(this.type, '" is not supported.'));
      }
      var wtTable = this.wot.wtTable;
      var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
      var clone = rootDocument.createElement("DIV");
      var clonedTable = rootDocument.createElement("TABLE");
      var tableParent = wtTable.wtRootElement.parentNode;
      clone.className = "".concat(CLONE_CLASS_NAMES.get(this.type), " handsontable");
      clone.setAttribute("dir", this.isRtl() ? "rtl" : "ltr");
      clone.style.position = "absolute";
      clone.style.top = 0;
      clone.style.overflow = "visible";
      if (this.isRtl()) {
        clone.style.right = 0;
      } else {
        clone.style.left = 0;
      }
      clonedTable.className = wtTable.TABLE.className;
      clone.appendChild(clonedTable);
      tableParent.appendChild(clone);
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      if (preventOverflow === true || preventOverflow === "horizontal" && this.type === CLONE_TOP || preventOverflow === "vertical" && this.type === CLONE_INLINE_START) {
        this.mainTableScrollableElement = rootWindow;
      } else if (rootWindow.getComputedStyle(tableParent).getPropertyValue("overflow") === "hidden") {
        this.mainTableScrollableElement = wtTable.holder;
      } else {
        this.mainTableScrollableElement = getScrollableElement(wtTable.TABLE);
      }
      return new Clone(clonedTable, this.wtSettings, {
        source: this.wot,
        overlay: this,
        viewport: this.wot.wtViewport,
        event: this.wot.wtEvent,
        selections: this.wot.selections
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var nextCycleRenderFlag = this.shouldBeRendered();
      if (this.clone && (this.needFullRender || nextCycleRenderFlag)) {
        this.clone.draw(fastDraw);
      }
      this.needFullRender = nextCycleRenderFlag;
    }
  }, {
    key: "reset",
    value: function reset() {
      if (!this.clone) {
        return;
      }
      var holder = this.clone.wtTable.holder;
      var hider = this.clone.wtTable.hider;
      var holderStyle = holder.style;
      var hiderStyle = hider.style;
      var rootStyle = holder.parentNode.style;
      arrayEach([holderStyle, hiderStyle, rootStyle], function(style) {
        style.width = "";
        style.height = "";
      });
    }
  }, {
    key: "isRtl",
    value: function isRtl() {
      return this.wtSettings.getSetting("rtlMode");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.clone.eventManager.destroy();
    }
  }]);
  return Overlay2;
}();

function _typeof$d(obj) {
  "@babel/helpers - typeof";
  return _typeof$d = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$d(obj);
}
function _construct$1(Parent, args, Class) {
  if (_isNativeReflectConstruct$9()) {
    _construct$1 = Reflect.construct;
  } else {
    _construct$1 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$9(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$1.apply(null, arguments);
}
function _classCallCheck$v(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$v(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$v(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$v(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$v(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$8(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$9(subClass, superClass);
}
function _setPrototypeOf$9(o, p) {
  _setPrototypeOf$9 = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$9(o, p);
}
function _createSuper$8(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$9();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$8(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$8(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$8(this, result);
  };
}
function _possibleConstructorReturn$8(self, call) {
  if (call && (_typeof$d(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$8(self);
}
function _assertThisInitialized$8(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$9() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$8(o) {
  _getPrototypeOf$8 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$8(o);
}
var BottomInlineStartCornerOverlay = /* @__PURE__ */ function(_Overlay) {
  _inherits$8(BottomInlineStartCornerOverlay2, _Overlay);
  var _super = _createSuper$8(BottomInlineStartCornerOverlay2);
  function BottomInlineStartCornerOverlay2(wotInstance, facadeGetter, wtSettings, domBindings, bottomOverlay, inlineStartOverlay) {
    var _this;
    _classCallCheck$v(this, BottomInlineStartCornerOverlay2);
    _this = _super.call(this, wotInstance, facadeGetter, CLONE_BOTTOM_INLINE_START_CORNER, wtSettings, domBindings);
    _this.bottomOverlay = bottomOverlay;
    _this.inlineStartOverlay = inlineStartOverlay;
    return _this;
  }
  _createClass$v(BottomInlineStartCornerOverlay2, [{
    key: "createTable",
    value: function createTable() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct$1(BottomInlineStartCornerOverlayTable, args);
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return this.wtSettings.getSetting("shouldRenderBottomOverlay") && this.wtSettings.getSetting("shouldRenderInlineStartOverlay");
    }
  }, {
    key: "resetFixedPosition",
    value: function resetFixedPosition() {
      var wot = this.wot;
      this.updateTrimmingContainer();
      if (!wot.wtTable.holder.parentNode) {
        return false;
      }
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      overlayRoot.style.top = "";
      if (this.trimmingContainer === this.domBindings.rootWindow) {
        var inlineStartOffset = this.inlineStartOverlay.getOverlayOffset();
        var bottom = this.bottomOverlay.getOverlayOffset();
        overlayRoot.style[this.isRtl() ? "right" : "left"] = "".concat(inlineStartOffset, "px");
        overlayRoot.style.bottom = "".concat(bottom, "px");
      } else {
        resetCssTransform(overlayRoot);
        this.repositionOverlay();
      }
      var tableHeight = outerHeight(this.clone.wtTable.TABLE);
      var tableWidth = outerWidth(this.clone.wtTable.TABLE);
      if (!this.wot.wtTable.hasDefinedSize()) {
        tableHeight = 0;
      }
      overlayRoot.style.height = "".concat(tableHeight, "px");
      overlayRoot.style.width = "".concat(tableWidth, "px");
      return false;
    }
  }, {
    key: "repositionOverlay",
    value: function repositionOverlay() {
      var wtTable = this.wot.wtTable;
      var rootDocument = this.domBindings.rootDocument;
      var cloneRoot = this.clone.wtTable.holder.parentNode;
      var scrollbarWidth = getScrollbarWidth(rootDocument);
      if (wtTable.holder.clientHeight === wtTable.holder.offsetHeight) {
        scrollbarWidth = 0;
      }
      cloneRoot.style.bottom = "".concat(scrollbarWidth, "px");
    }
  }]);
  return BottomInlineStartCornerOverlay2;
}(Overlay);

var MIXIN_NAME$2 = "calculatedColumns";
var calculatedColumns = {
  getFirstRenderedColumn: function getFirstRenderedColumn() {
    var startColumn = this.dataAccessObject.startColumnRendered;
    if (startColumn === null) {
      return -1;
    }
    return startColumn;
  },
  getFirstVisibleColumn: function getFirstVisibleColumn() {
    var startColumn = this.dataAccessObject.startColumnVisible;
    if (startColumn === null) {
      return -1;
    }
    return startColumn;
  },
  getLastRenderedColumn: function getLastRenderedColumn() {
    var endColumn = this.dataAccessObject.endColumnRendered;
    if (endColumn === null) {
      return -1;
    }
    return endColumn;
  },
  getLastVisibleColumn: function getLastVisibleColumn() {
    var endColumn = this.dataAccessObject.endColumnVisible;
    if (endColumn === null) {
      return -1;
    }
    return endColumn;
  },
  getRenderedColumnsCount: function getRenderedColumnsCount() {
    return this.dataAccessObject.countColumnsRendered;
  },
  getVisibleColumnsCount: function getVisibleColumnsCount() {
    return this.dataAccessObject.countColumnsVisible;
  }
};
defineGetter(calculatedColumns, "MIXIN_NAME", MIXIN_NAME$2, {
  writable: false,
  enumerable: false
});

function _typeof$e(obj) {
  "@babel/helpers - typeof";
  return _typeof$e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$e(obj);
}
function _defineProperties$w(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$w(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$w(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$w(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$w(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$9(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$a(subClass, superClass);
}
function _setPrototypeOf$a(o, p) {
  _setPrototypeOf$a = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$a(o, p);
}
function _createSuper$9(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$a();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$9(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$9(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$9(this, result);
  };
}
function _possibleConstructorReturn$9(self, call) {
  if (call && (_typeof$e(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$9(self);
}
function _assertThisInitialized$9(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$a() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$9(o) {
  _getPrototypeOf$9 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$9(o);
}
var BottomOverlayTable = /* @__PURE__ */ function(_Table) {
  _inherits$9(BottomOverlayTable2, _Table);
  var _super = _createSuper$9(BottomOverlayTable2);
  function BottomOverlayTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$w(this, BottomOverlayTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, CLONE_BOTTOM);
  }
  return _createClass$w(BottomOverlayTable2);
}(Table);
mixin(BottomOverlayTable, stickyRowsBottom);
mixin(BottomOverlayTable, calculatedColumns);

function _typeof$f(obj) {
  "@babel/helpers - typeof";
  return _typeof$f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$f(obj);
}
function _construct$2(Parent, args, Class) {
  if (_isNativeReflectConstruct$b()) {
    _construct$2 = Reflect.construct;
  } else {
    _construct$2 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$b(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$2.apply(null, arguments);
}
function _classCallCheck$x(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$x(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$x(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$x(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$x(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$a(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$b(subClass, superClass);
}
function _setPrototypeOf$b(o, p) {
  _setPrototypeOf$b = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$b(o, p);
}
function _createSuper$a(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$b();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$a(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$a(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$a(this, result);
  };
}
function _possibleConstructorReturn$a(self, call) {
  if (call && (_typeof$f(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$a(self);
}
function _assertThisInitialized$a(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$b() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$a(o) {
  _getPrototypeOf$a = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$a(o);
}
function _defineProperty$8(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var BottomOverlay = /* @__PURE__ */ function(_Overlay) {
  _inherits$a(BottomOverlay2, _Overlay);
  var _super = _createSuper$a(BottomOverlay2);
  function BottomOverlay2(wotInstance, facadeGetter, wtSettings, domBindings) {
    var _this;
    _classCallCheck$x(this, BottomOverlay2);
    _this = _super.call(this, wotInstance, facadeGetter, CLONE_BOTTOM, wtSettings, domBindings);
    _defineProperty$8(_assertThisInitialized$a(_this), "cachedFixedRowsBottom", -1);
    _this.cachedFixedRowsBottom = _this.wtSettings.getSetting("fixedRowsBottom");
    return _this;
  }
  _createClass$x(BottomOverlay2, [{
    key: "createTable",
    value: function createTable() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct$2(BottomOverlayTable, args);
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return this.wtSettings.getSetting("shouldRenderBottomOverlay");
    }
  }, {
    key: "resetFixedPosition",
    value: function resetFixedPosition() {
      if (!this.needFullRender || !this.wot.wtTable.holder.parentNode) {
        return false;
      }
      var rootWindow = this.domBindings.rootWindow;
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      overlayRoot.style.top = "";
      var overlayPosition = 0;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "vertical")) {
        overlayPosition = this.getOverlayOffset();
        overlayRoot.style.bottom = "".concat(overlayPosition, "px");
      } else {
        overlayPosition = this.getScrollPosition();
        this.repositionOverlay();
      }
      var positionChanged = this.adjustHeaderBordersPosition(overlayPosition);
      this.adjustElementsSize();
      return positionChanged;
    }
  }, {
    key: "repositionOverlay",
    value: function repositionOverlay() {
      var wtTable = this.wot.wtTable;
      var rootDocument = this.domBindings.rootDocument;
      var cloneRoot = this.clone.wtTable.holder.parentNode;
      var scrollbarWidth = getScrollbarWidth(rootDocument);
      if (wtTable.holder.clientHeight === wtTable.holder.offsetHeight) {
        scrollbarWidth = 0;
      }
      cloneRoot.style.bottom = "".concat(scrollbarWidth, "px");
    }
  }, {
    key: "setScrollPosition",
    value: function setScrollPosition(pos) {
      var rootWindow = this.domBindings.rootWindow;
      var result = false;
      if (this.mainTableScrollableElement === rootWindow) {
        rootWindow.scrollTo(getWindowScrollLeft(rootWindow), pos);
        result = true;
      } else if (this.mainTableScrollableElement.scrollTop !== pos) {
        this.mainTableScrollableElement.scrollTop = pos;
        result = true;
      }
      return result;
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.wtSettings.getSetting("onScrollHorizontally");
    }
  }, {
    key: "sumCellSizes",
    value: function sumCellSizes(from, to) {
      var _this$wot = this.wot, wtTable = _this$wot.wtTable, wtSettings = _this$wot.wtSettings;
      var defaultRowHeight = wtSettings.getSetting("defaultRowHeight");
      var row = from;
      var sum = 0;
      while (row < to) {
        var height = wtTable.getRowHeight(row);
        sum += height === void 0 ? defaultRowHeight : height;
        row += 1;
      }
      return sum;
    }
  }, {
    key: "adjustElementsSize",
    value: function adjustElementsSize() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this.updateTrimmingContainer();
      if (this.needFullRender || force) {
        this.adjustRootElementSize();
        this.adjustRootChildrenSize();
      }
    }
  }, {
    key: "adjustRootElementSize",
    value: function adjustRootElementSize() {
      var _this$wot2 = this.wot, wtTable = _this$wot2.wtTable, wtViewport = _this$wot2.wtViewport;
      var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
      var scrollbarWidth = getScrollbarWidth(rootDocument);
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      var overlayRootStyle = overlayRoot.style;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      if (this.trimmingContainer !== rootWindow || preventOverflow === "horizontal") {
        var width = wtViewport.getWorkspaceWidth();
        if (this.wot.wtOverlays.hasScrollbarRight) {
          width -= scrollbarWidth;
        }
        width = Math.min(width, wtTable.wtRootElement.scrollWidth);
        overlayRootStyle.width = "".concat(width, "px");
      } else {
        overlayRootStyle.width = "";
      }
      this.clone.wtTable.holder.style.width = overlayRootStyle.width;
      var tableHeight = outerHeight(this.clone.wtTable.TABLE);
      if (!this.wot.wtTable.hasDefinedSize()) {
        tableHeight = 0;
      }
      overlayRootStyle.height = "".concat(tableHeight, "px");
    }
  }, {
    key: "adjustRootChildrenSize",
    value: function adjustRootChildrenSize() {
      var holder = this.clone.wtTable.holder;
      this.clone.wtTable.hider.style.width = this.hider.style.width;
      holder.style.width = holder.parentNode.style.width;
      holder.style.height = holder.parentNode.style.height;
    }
  }, {
    key: "applyToDOM",
    value: function applyToDOM() {
      var total = this.wtSettings.getSetting("totalRows");
      if (typeof this.wot.wtViewport.rowsRenderCalculator.startPosition === "number") {
        this.spreader.style.top = "".concat(this.wot.wtViewport.rowsRenderCalculator.startPosition, "px");
      } else if (total === 0) {
        this.spreader.style.top = "0";
      } else {
        throw new Error("Incorrect value of the rowsRenderCalculator");
      }
      this.spreader.style.bottom = "";
      if (this.needFullRender) {
        this.syncOverlayOffset();
      }
    }
  }, {
    key: "syncOverlayOffset",
    value: function syncOverlayOffset() {
      var styleProperty = this.isRtl() ? "right" : "left";
      var spreader = this.clone.wtTable.spreader;
      if (typeof this.wot.wtViewport.columnsRenderCalculator.startPosition === "number") {
        spreader.style[styleProperty] = "".concat(this.wot.wtViewport.columnsRenderCalculator.startPosition, "px");
      } else {
        spreader.style[styleProperty] = "";
      }
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(sourceRow, bottomEdge) {
      var newY = this.getTableParentOffset();
      var sourceInstance = this.wot.cloneSource ? this.wot.cloneSource : this.wot;
      var mainHolder = sourceInstance.wtTable.holder;
      var scrollbarCompensation = 0;
      if (bottomEdge && mainHolder.offsetHeight !== mainHolder.clientHeight) {
        scrollbarCompensation = getScrollbarWidth(this.domBindings.rootDocument);
      }
      if (bottomEdge) {
        newY += this.sumCellSizes(0, sourceRow + 1);
        newY -= this.wot.wtViewport.getViewportHeight();
        newY += 1;
      } else {
        newY += this.sumCellSizes(this.wtSettings.getSetting("fixedRowsBottom"), sourceRow);
      }
      newY += scrollbarCompensation;
      this.setScrollPosition(newY);
    }
  }, {
    key: "getTableParentOffset",
    value: function getTableParentOffset() {
      if (this.mainTableScrollableElement === this.domBindings.rootWindow) {
        return this.wot.wtTable.holderOffset.top;
      }
      return 0;
    }
  }, {
    key: "getScrollPosition",
    value: function getScrollPosition() {
      return getScrollTop(this.mainTableScrollableElement, this.domBindings.rootWindow);
    }
  }, {
    key: "getOverlayOffset",
    value: function getOverlayOffset() {
      var rootWindow = this.domBindings.rootWindow;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var overlayOffset = 0;
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "vertical")) {
        var rootHeight = this.wot.wtTable.getTotalHeight();
        var overlayRootHeight = this.clone.wtTable.getTotalHeight();
        var maxOffset = rootHeight - overlayRootHeight;
        var docClientHeight = this.domBindings.rootDocument.documentElement.clientHeight;
        overlayOffset = Math.max(this.getTableParentOffset() - this.getScrollPosition() - docClientHeight + rootHeight, 0);
        if (overlayOffset > maxOffset) {
          overlayOffset = 0;
        }
      }
      return overlayOffset;
    }
  }, {
    key: "adjustHeaderBordersPosition",
    value: function adjustHeaderBordersPosition(position) {
      var fixedRowsBottom = this.wtSettings.getSetting("fixedRowsBottom");
      var areFixedRowsBottomChanged = this.cachedFixedRowsBottom !== fixedRowsBottom;
      var columnHeaders = this.wtSettings.getSetting("columnHeaders");
      var positionChanged = false;
      if ((areFixedRowsBottomChanged || fixedRowsBottom === 0) && columnHeaders.length > 0) {
        var masterParent = this.wot.wtTable.holder.parentNode;
        var previousState = hasClass(masterParent, "innerBorderBottom");
        this.cachedFixedRowsBottom = this.wtSettings.getSetting("fixedRowsBottom");
        if (position || this.wtSettings.getSetting("totalRows") === 0) {
          addClass(masterParent, "innerBorderBottom");
          positionChanged = !previousState;
        } else {
          removeClass(masterParent, "innerBorderBottom");
          positionChanged = previousState;
        }
      }
      return positionChanged;
    }
  }]);
  return BottomOverlay2;
}(Overlay);

var MIXIN_NAME$3 = "calculatedRows";
var calculatedRows = {
  getFirstRenderedRow: function getFirstRenderedRow() {
    var startRow = this.dataAccessObject.startRowRendered;
    if (startRow === null) {
      return -1;
    }
    return startRow;
  },
  getFirstVisibleRow: function getFirstVisibleRow() {
    var startRow = this.dataAccessObject.startRowVisible;
    if (startRow === null) {
      return -1;
    }
    return startRow;
  },
  getLastRenderedRow: function getLastRenderedRow() {
    var endRow = this.dataAccessObject.endRowRendered;
    if (endRow === null) {
      return -1;
    }
    return endRow;
  },
  getLastVisibleRow: function getLastVisibleRow() {
    var endRow = this.dataAccessObject.endRowVisible;
    if (endRow === null) {
      return -1;
    }
    return endRow;
  },
  getRenderedRowsCount: function getRenderedRowsCount() {
    return this.dataAccessObject.countRowsRendered;
  },
  getVisibleRowsCount: function getVisibleRowsCount() {
    return this.dataAccessObject.countRowsVisible;
  }
};
defineGetter(calculatedRows, "MIXIN_NAME", MIXIN_NAME$3, {
  writable: false,
  enumerable: false
});

function _typeof$g(obj) {
  "@babel/helpers - typeof";
  return _typeof$g = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$g(obj);
}
function _defineProperties$y(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$y(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$y(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$y(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$y(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$b(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$c(subClass, superClass);
}
function _setPrototypeOf$c(o, p) {
  _setPrototypeOf$c = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$c(o, p);
}
function _createSuper$b(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$c();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$b(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$b(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$b(this, result);
  };
}
function _possibleConstructorReturn$b(self, call) {
  if (call && (_typeof$g(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$b(self);
}
function _assertThisInitialized$b(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$c() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$b(o) {
  _getPrototypeOf$b = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$b(o);
}
var InlineStartOverlayTable = /* @__PURE__ */ function(_Table) {
  _inherits$b(InlineStartOverlayTable2, _Table);
  var _super = _createSuper$b(InlineStartOverlayTable2);
  function InlineStartOverlayTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$y(this, InlineStartOverlayTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, CLONE_INLINE_START);
  }
  return _createClass$y(InlineStartOverlayTable2);
}(Table);
mixin(InlineStartOverlayTable, calculatedRows);
mixin(InlineStartOverlayTable, stickyColumnsStart);

function _typeof$h(obj) {
  "@babel/helpers - typeof";
  return _typeof$h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$h(obj);
}
function _construct$3(Parent, args, Class) {
  if (_isNativeReflectConstruct$d()) {
    _construct$3 = Reflect.construct;
  } else {
    _construct$3 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$d(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$3.apply(null, arguments);
}
function _classCallCheck$z(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$z(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$z(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$z(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$z(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$c(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$d(subClass, superClass);
}
function _setPrototypeOf$d(o, p) {
  _setPrototypeOf$d = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$d(o, p);
}
function _createSuper$c(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$d();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$c(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$c(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$c(this, result);
  };
}
function _possibleConstructorReturn$c(self, call) {
  if (call && (_typeof$h(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$c(self);
}
function _assertThisInitialized$c(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$d() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$c(o) {
  _getPrototypeOf$c = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$c(o);
}
var InlineStartOverlay = /* @__PURE__ */ function(_Overlay) {
  _inherits$c(InlineStartOverlay2, _Overlay);
  var _super = _createSuper$c(InlineStartOverlay2);
  function InlineStartOverlay2(wotInstance, facadeGetter, wtSettings, domBindings) {
    _classCallCheck$z(this, InlineStartOverlay2);
    return _super.call(this, wotInstance, facadeGetter, CLONE_INLINE_START, wtSettings, domBindings);
  }
  _createClass$z(InlineStartOverlay2, [{
    key: "createTable",
    value: function createTable() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct$3(InlineStartOverlayTable, args);
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return this.wtSettings.getSetting("shouldRenderInlineStartOverlay");
    }
  }, {
    key: "resetFixedPosition",
    value: function resetFixedPosition() {
      var wtTable = this.wot.wtTable;
      if (!this.needFullRender || !wtTable.holder.parentNode) {
        return false;
      }
      var rootWindow = this.domBindings.rootWindow;
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var overlayPosition = 0;
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "horizontal")) {
        overlayPosition = this.getOverlayOffset() * (this.isRtl() ? -1 : 1);
        setOverlayPosition(overlayRoot, "".concat(overlayPosition, "px"), "0px");
      } else {
        overlayPosition = this.getScrollPosition();
        resetCssTransform(overlayRoot);
      }
      var positionChanged = this.adjustHeaderBordersPosition(overlayPosition);
      this.adjustElementsSize();
      return positionChanged;
    }
  }, {
    key: "setScrollPosition",
    value: function setScrollPosition(pos) {
      var rootWindow = this.domBindings.rootWindow;
      var result = false;
      if (this.isRtl()) {
        pos = -pos;
      }
      if (this.mainTableScrollableElement === rootWindow && rootWindow.scrollX !== pos) {
        rootWindow.scrollTo(pos, getWindowScrollTop(rootWindow));
        result = true;
      } else if (this.mainTableScrollableElement.scrollLeft !== pos) {
        this.mainTableScrollableElement.scrollLeft = pos;
        result = true;
      }
      return result;
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.wtSettings.getSetting("onScrollVertically");
    }
  }, {
    key: "sumCellSizes",
    value: function sumCellSizes(from, to) {
      var defaultColumnWidth = this.wtSettings.getSetting("defaultColumnWidth");
      var column = from;
      var sum = 0;
      while (column < to) {
        sum += this.wot.wtTable.getStretchedColumnWidth(column) || defaultColumnWidth;
        column += 1;
      }
      return sum;
    }
  }, {
    key: "adjustElementsSize",
    value: function adjustElementsSize() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this.updateTrimmingContainer();
      if (this.needFullRender || force) {
        this.adjustRootElementSize();
        this.adjustRootChildrenSize();
      }
    }
  }, {
    key: "adjustRootElementSize",
    value: function adjustRootElementSize() {
      var wtTable = this.wot.wtTable;
      var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
      var scrollbarHeight = getScrollbarWidth(rootDocument);
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      var overlayRootStyle = overlayRoot.style;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      if (this.trimmingContainer !== rootWindow || preventOverflow === "vertical") {
        var height = this.wot.wtViewport.getWorkspaceHeight();
        if (this.wot.wtOverlays.hasScrollbarBottom) {
          height -= scrollbarHeight;
        }
        height = Math.min(height, wtTable.wtRootElement.scrollHeight);
        overlayRootStyle.height = "".concat(height, "px");
      } else {
        overlayRootStyle.height = "";
      }
      this.clone.wtTable.holder.style.height = overlayRootStyle.height;
      var tableWidth = outerWidth(this.clone.wtTable.TABLE);
      overlayRootStyle.width = "".concat(tableWidth, "px");
    }
  }, {
    key: "adjustRootChildrenSize",
    value: function adjustRootChildrenSize() {
      var _selections$getCell$g;
      var holder = this.clone.wtTable.holder;
      var selections = this.wot.selections;
      var facade = this.facadeGetter();
      var selectionCornerOffset = Math.abs((_selections$getCell$g = selections === null || selections === void 0 ? void 0 : selections.getCell().getBorder(facade).cornerCenterPointOffset) !== null && _selections$getCell$g !== void 0 ? _selections$getCell$g : 0);
      this.clone.wtTable.hider.style.height = this.hider.style.height;
      holder.style.height = holder.parentNode.style.height;
      holder.style.width = "".concat(parseInt(holder.parentNode.style.width, 10) + selectionCornerOffset, "px");
    }
  }, {
    key: "applyToDOM",
    value: function applyToDOM() {
      var total = this.wtSettings.getSetting("totalColumns");
      var styleProperty = this.isRtl() ? "right" : "left";
      if (typeof this.wot.wtViewport.columnsRenderCalculator.startPosition === "number") {
        this.spreader.style[styleProperty] = "".concat(this.wot.wtViewport.columnsRenderCalculator.startPosition, "px");
      } else if (total === 0) {
        this.spreader.style[styleProperty] = "0";
      } else {
        throw new Error("Incorrect value of the columnsRenderCalculator");
      }
      if (this.isRtl()) {
        this.spreader.style.left = "";
      } else {
        this.spreader.style.right = "";
      }
      if (this.needFullRender) {
        this.syncOverlayOffset();
      }
    }
  }, {
    key: "syncOverlayOffset",
    value: function syncOverlayOffset() {
      if (typeof this.wot.wtViewport.rowsRenderCalculator.startPosition === "number") {
        this.clone.wtTable.spreader.style.top = "".concat(this.wot.wtViewport.rowsRenderCalculator.startPosition, "px");
      } else {
        this.clone.wtTable.spreader.style.top = "";
      }
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(sourceCol, beyondRendered) {
      var newX = this.getTableParentOffset();
      var sourceInstance = this.wot.cloneSource ? this.wot.cloneSource : this.wot;
      var mainHolder = sourceInstance.wtTable.holder;
      var scrollbarCompensation = 0;
      if (beyondRendered && mainHolder.offsetWidth !== mainHolder.clientWidth) {
        scrollbarCompensation = getScrollbarWidth(this.domBindings.rootDocument);
      }
      if (beyondRendered) {
        newX += this.sumCellSizes(0, sourceCol + 1);
        newX -= this.wot.wtViewport.getViewportWidth();
      } else {
        newX += this.sumCellSizes(this.wtSettings.getSetting("fixedColumnsStart"), sourceCol);
      }
      newX += scrollbarCompensation;
      return this.setScrollPosition(newX);
    }
  }, {
    key: "getTableParentOffset",
    value: function getTableParentOffset() {
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var offset = 0;
      if (!preventOverflow && this.trimmingContainer === this.domBindings.rootWindow) {
        offset = this.wot.wtTable.holderOffset.left;
      }
      return offset;
    }
  }, {
    key: "getScrollPosition",
    value: function getScrollPosition() {
      return Math.abs(getScrollLeft(this.mainTableScrollableElement, this.domBindings.rootWindow));
    }
  }, {
    key: "getOverlayOffset",
    value: function getOverlayOffset() {
      var rootWindow = this.domBindings.rootWindow;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var overlayOffset = 0;
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "horizontal")) {
        if (this.isRtl()) {
          overlayOffset = Math.abs(Math.min(this.getTableParentOffset() - this.getScrollPosition(), 0));
        } else {
          overlayOffset = Math.max(this.getScrollPosition() - this.getTableParentOffset(), 0);
        }
        var rootWidth = this.wot.wtTable.getTotalWidth();
        var overlayRootWidth = this.clone.wtTable.getTotalWidth();
        var maxOffset = rootWidth - overlayRootWidth;
        if (overlayOffset > maxOffset) {
          overlayOffset = 0;
        }
      }
      return overlayOffset;
    }
  }, {
    key: "adjustHeaderBordersPosition",
    value: function adjustHeaderBordersPosition(position) {
      var masterParent = this.wot.wtTable.holder.parentNode;
      var rowHeaders = this.wtSettings.getSetting("rowHeaders");
      var fixedColumnsStart = this.wtSettings.getSetting("fixedColumnsStart");
      var totalRows = this.wtSettings.getSetting("totalRows");
      if (totalRows) {
        removeClass(masterParent, "emptyRows");
      } else {
        addClass(masterParent, "emptyRows");
      }
      var positionChanged = false;
      if (fixedColumnsStart && !rowHeaders.length) {
        addClass(masterParent, "innerBorderLeft innerBorderInlineStart");
      } else if (!fixedColumnsStart && rowHeaders.length) {
        var previousState = hasClass(masterParent, "innerBorderInlineStart");
        if (position) {
          addClass(masterParent, "innerBorderLeft innerBorderInlineStart");
          positionChanged = !previousState;
        } else {
          removeClass(masterParent, "innerBorderLeft innerBorderInlineStart");
          positionChanged = previousState;
        }
      }
      return positionChanged;
    }
  }]);
  return InlineStartOverlay2;
}(Overlay);

var MIXIN_NAME$4 = "stickyRowsTop";
var stickyRowsTop = {
  getFirstRenderedRow: function getFirstRenderedRow() {
    var totalRows = this.wtSettings.getSetting("totalRows");
    if (totalRows === 0) {
      return -1;
    }
    return 0;
  },
  getFirstVisibleRow: function getFirstVisibleRow() {
    return this.getFirstRenderedRow();
  },
  getLastRenderedRow: function getLastRenderedRow() {
    return this.getRenderedRowsCount() - 1;
  },
  getLastVisibleRow: function getLastVisibleRow() {
    return this.getLastRenderedRow();
  },
  getRenderedRowsCount: function getRenderedRowsCount() {
    var totalRows = this.wtSettings.getSetting("totalRows");
    return Math.min(this.wtSettings.getSetting("fixedRowsTop"), totalRows);
  },
  getVisibleRowsCount: function getVisibleRowsCount() {
    return this.getRenderedRowsCount();
  }
};
defineGetter(stickyRowsTop, "MIXIN_NAME", MIXIN_NAME$4, {
  writable: false,
  enumerable: false
});

function _typeof$i(obj) {
  "@babel/helpers - typeof";
  return _typeof$i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$i(obj);
}
function _defineProperties$A(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$A(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$A(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$A(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$A(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$d(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$e(subClass, superClass);
}
function _setPrototypeOf$e(o, p) {
  _setPrototypeOf$e = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$e(o, p);
}
function _createSuper$d(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$e();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$d(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$d(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$d(this, result);
  };
}
function _possibleConstructorReturn$d(self, call) {
  if (call && (_typeof$i(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$d(self);
}
function _assertThisInitialized$d(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$e() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$d(o) {
  _getPrototypeOf$d = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$d(o);
}
var TopInlineStartCornerOverlayTable = /* @__PURE__ */ function(_Table) {
  _inherits$d(TopInlineStartCornerOverlayTable2, _Table);
  var _super = _createSuper$d(TopInlineStartCornerOverlayTable2);
  function TopInlineStartCornerOverlayTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$A(this, TopInlineStartCornerOverlayTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, CLONE_TOP_INLINE_START_CORNER);
  }
  return _createClass$A(TopInlineStartCornerOverlayTable2);
}(Table);
mixin(TopInlineStartCornerOverlayTable, stickyRowsTop);
mixin(TopInlineStartCornerOverlayTable, stickyColumnsStart);

function _typeof$j(obj) {
  "@babel/helpers - typeof";
  return _typeof$j = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$j(obj);
}
function _construct$4(Parent, args, Class) {
  if (_isNativeReflectConstruct$f()) {
    _construct$4 = Reflect.construct;
  } else {
    _construct$4 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$f(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$4.apply(null, arguments);
}
function _classCallCheck$B(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$B(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$B(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$B(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$B(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$e(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$f(subClass, superClass);
}
function _setPrototypeOf$f(o, p) {
  _setPrototypeOf$f = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$f(o, p);
}
function _createSuper$e(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$f();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$e(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$e(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$e(this, result);
  };
}
function _possibleConstructorReturn$e(self, call) {
  if (call && (_typeof$j(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$e(self);
}
function _assertThisInitialized$e(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$f() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$e(o) {
  _getPrototypeOf$e = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$e(o);
}
function _defineProperty$9(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var TopInlineStartCornerOverlay = /* @__PURE__ */ function(_Overlay) {
  _inherits$e(TopInlineStartCornerOverlay2, _Overlay);
  var _super = _createSuper$e(TopInlineStartCornerOverlay2);
  function TopInlineStartCornerOverlay2(wotInstance, facadeGetter, wtSettings, domBindings, topOverlay, inlineStartOverlay) {
    var _this;
    _classCallCheck$B(this, TopInlineStartCornerOverlay2);
    _this = _super.call(this, wotInstance, facadeGetter, CLONE_TOP_INLINE_START_CORNER, wtSettings, domBindings);
    _defineProperty$9(_assertThisInitialized$e(_this), "topOverlay", void 0);
    _defineProperty$9(_assertThisInitialized$e(_this), "inlineStartOverlay", void 0);
    _this.topOverlay = topOverlay;
    _this.inlineStartOverlay = inlineStartOverlay;
    return _this;
  }
  _createClass$B(TopInlineStartCornerOverlay2, [{
    key: "createTable",
    value: function createTable() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct$4(TopInlineStartCornerOverlayTable, args);
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return this.wtSettings.getSetting("shouldRenderTopOverlay") && this.wtSettings.getSetting("shouldRenderInlineStartOverlay");
    }
  }, {
    key: "resetFixedPosition",
    value: function resetFixedPosition() {
      this.updateTrimmingContainer();
      if (!this.wot.wtTable.holder.parentNode) {
        return false;
      }
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      if (this.trimmingContainer === this.domBindings.rootWindow) {
        var left = this.inlineStartOverlay.getOverlayOffset() * (this.isRtl() ? -1 : 1);
        var top = this.topOverlay.getOverlayOffset();
        setOverlayPosition(overlayRoot, "".concat(left, "px"), "".concat(top, "px"));
      } else {
        resetCssTransform(overlayRoot);
      }
      var tableHeight = outerHeight(this.clone.wtTable.TABLE);
      var tableWidth = outerWidth(this.clone.wtTable.TABLE);
      if (!this.wot.wtTable.hasDefinedSize()) {
        tableHeight = 0;
      }
      overlayRoot.style.height = "".concat(tableHeight, "px");
      overlayRoot.style.width = "".concat(tableWidth, "px");
      return false;
    }
  }]);
  return TopInlineStartCornerOverlay2;
}(Overlay);

function _typeof$k(obj) {
  "@babel/helpers - typeof";
  return _typeof$k = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$k(obj);
}
function _defineProperties$C(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$C(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$C(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$C(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$C(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits$f(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$g(subClass, superClass);
}
function _setPrototypeOf$g(o, p) {
  _setPrototypeOf$g = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$g(o, p);
}
function _createSuper$f(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$g();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$f(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$f(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$f(this, result);
  };
}
function _possibleConstructorReturn$f(self, call) {
  if (call && (_typeof$k(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$f(self);
}
function _assertThisInitialized$f(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$g() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$f(o) {
  _getPrototypeOf$f = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$f(o);
}
var TopOverlayTable = /* @__PURE__ */ function(_Table) {
  _inherits$f(TopOverlayTable2, _Table);
  var _super = _createSuper$f(TopOverlayTable2);
  function TopOverlayTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$C(this, TopOverlayTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, CLONE_TOP);
  }
  return _createClass$C(TopOverlayTable2);
}(Table);
mixin(TopOverlayTable, stickyRowsTop);
mixin(TopOverlayTable, calculatedColumns);

function _typeof$l(obj) {
  "@babel/helpers - typeof";
  return _typeof$l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$l(obj);
}
function _construct$5(Parent, args, Class) {
  if (_isNativeReflectConstruct$h()) {
    _construct$5 = Reflect.construct;
  } else {
    _construct$5 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$h(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$5.apply(null, arguments);
}
function _classCallCheck$D(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$D(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$D(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$D(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$D(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$g(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$h(subClass, superClass);
}
function _setPrototypeOf$h(o, p) {
  _setPrototypeOf$h = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$h(o, p);
}
function _createSuper$g(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$h();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$g(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$g(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$g(this, result);
  };
}
function _possibleConstructorReturn$g(self, call) {
  if (call && (_typeof$l(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$g(self);
}
function _assertThisInitialized$g(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$h() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$g(o) {
  _getPrototypeOf$g = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$g(o);
}
function _defineProperty$a(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var TopOverlay = /* @__PURE__ */ function(_Overlay) {
  _inherits$g(TopOverlay2, _Overlay);
  var _super = _createSuper$g(TopOverlay2);
  function TopOverlay2(wotInstance, facadeGetter, wtSettings, domBindings) {
    var _this;
    _classCallCheck$D(this, TopOverlay2);
    _this = _super.call(this, wotInstance, facadeGetter, CLONE_TOP, wtSettings, domBindings);
    _defineProperty$a(_assertThisInitialized$g(_this), "cachedFixedRowsTop", -1);
    _this.cachedFixedRowsTop = _this.wtSettings.getSetting("fixedRowsTop");
    return _this;
  }
  _createClass$D(TopOverlay2, [{
    key: "createTable",
    value: function createTable() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct$5(TopOverlayTable, args);
    }
  }, {
    key: "shouldBeRendered",
    value: function shouldBeRendered() {
      return this.wtSettings.getSetting("shouldRenderTopOverlay");
    }
  }, {
    key: "resetFixedPosition",
    value: function resetFixedPosition() {
      if (!this.needFullRender || !this.wot.wtTable.holder.parentNode) {
        return false;
      }
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      var rootWindow = this.domBindings.rootWindow;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var overlayPosition = 0;
      var skipInnerBorderAdjusting = false;
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "vertical")) {
        var wtTable = this.wot.wtTable;
        var hiderRect = wtTable.hider.getBoundingClientRect();
        var bottom = Math.ceil(hiderRect.bottom);
        var rootHeight = overlayRoot.offsetHeight;
        skipInnerBorderAdjusting = bottom === rootHeight;
        overlayPosition = this.getOverlayOffset();
        setOverlayPosition(overlayRoot, "0px", "".concat(overlayPosition, "px"));
      } else {
        overlayPosition = this.getScrollPosition();
        resetCssTransform(overlayRoot);
      }
      var positionChanged = this.adjustHeaderBordersPosition(overlayPosition, skipInnerBorderAdjusting);
      this.adjustElementsSize();
      return positionChanged;
    }
  }, {
    key: "setScrollPosition",
    value: function setScrollPosition(pos) {
      var rootWindow = this.domBindings.rootWindow;
      var result = false;
      if (this.mainTableScrollableElement === rootWindow && rootWindow.scrollY !== pos) {
        rootWindow.scrollTo(getWindowScrollLeft(rootWindow), pos);
        result = true;
      } else if (this.mainTableScrollableElement.scrollTop !== pos) {
        this.mainTableScrollableElement.scrollTop = pos;
        result = true;
      }
      return result;
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.wtSettings.getSetting("onScrollHorizontally");
    }
  }, {
    key: "sumCellSizes",
    value: function sumCellSizes(from, to) {
      var defaultRowHeight = this.wtSettings.getSetting("defaultRowHeight");
      var row = from;
      var sum = 0;
      while (row < to) {
        var height = this.wot.wtTable.getRowHeight(row);
        sum += height === void 0 ? defaultRowHeight : height;
        row += 1;
      }
      return sum;
    }
  }, {
    key: "adjustElementsSize",
    value: function adjustElementsSize() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this.updateTrimmingContainer();
      if (this.needFullRender || force) {
        this.adjustRootElementSize();
        this.adjustRootChildrenSize();
      }
    }
  }, {
    key: "adjustRootElementSize",
    value: function adjustRootElementSize() {
      var wtTable = this.wot.wtTable;
      var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
      var scrollbarWidth = getScrollbarWidth(rootDocument);
      var overlayRoot = this.clone.wtTable.holder.parentNode;
      var overlayRootStyle = overlayRoot.style;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      if (this.trimmingContainer !== rootWindow || preventOverflow === "horizontal") {
        var width = this.wot.wtViewport.getWorkspaceWidth();
        if (this.wot.wtOverlays.hasScrollbarRight) {
          width -= scrollbarWidth;
        }
        width = Math.min(width, wtTable.wtRootElement.scrollWidth);
        overlayRootStyle.width = "".concat(width, "px");
      } else {
        overlayRootStyle.width = "";
      }
      this.clone.wtTable.holder.style.width = overlayRootStyle.width;
      var tableHeight = outerHeight(this.clone.wtTable.TABLE);
      if (!this.wot.wtTable.hasDefinedSize()) {
        tableHeight = 0;
      }
      overlayRootStyle.height = "".concat(tableHeight, "px");
    }
  }, {
    key: "adjustRootChildrenSize",
    value: function adjustRootChildrenSize() {
      var _selections$getCell$g;
      var holder = this.clone.wtTable.holder;
      var selections = this.wot.selections;
      var facade = this.facadeGetter();
      var selectionCornerOffset = Math.abs((_selections$getCell$g = selections === null || selections === void 0 ? void 0 : selections.getCell().getBorder(facade).cornerCenterPointOffset) !== null && _selections$getCell$g !== void 0 ? _selections$getCell$g : 0);
      this.clone.wtTable.hider.style.width = this.hider.style.width;
      holder.style.width = holder.parentNode.style.width;
      holder.style.height = "".concat(parseInt(holder.parentNode.style.height, 10) + selectionCornerOffset, "px");
    }
  }, {
    key: "applyToDOM",
    value: function applyToDOM() {
      var total = this.wtSettings.getSetting("totalRows");
      if (typeof this.wot.wtViewport.rowsRenderCalculator.startPosition === "number") {
        this.spreader.style.top = "".concat(this.wot.wtViewport.rowsRenderCalculator.startPosition, "px");
      } else if (total === 0) {
        this.spreader.style.top = "0";
      } else {
        throw new Error("Incorrect value of the rowsRenderCalculator");
      }
      this.spreader.style.bottom = "";
      if (this.needFullRender) {
        this.syncOverlayOffset();
      }
    }
  }, {
    key: "syncOverlayOffset",
    value: function syncOverlayOffset() {
      var styleProperty = this.isRtl() ? "right" : "left";
      var spreader = this.clone.wtTable.spreader;
      if (typeof this.wot.wtViewport.columnsRenderCalculator.startPosition === "number") {
        spreader.style[styleProperty] = "".concat(this.wot.wtViewport.columnsRenderCalculator.startPosition, "px");
      } else {
        spreader.style[styleProperty] = "";
      }
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(sourceRow, bottomEdge) {
      var wot = this.wot, wtSettings = this.wtSettings;
      var sourceInstance = wot.cloneSource ? wot.cloneSource : wot;
      var mainHolder = sourceInstance.wtTable.holder;
      var newY = this.getTableParentOffset();
      var scrollbarCompensation = 0;
      if (bottomEdge && mainHolder.offsetHeight !== mainHolder.clientHeight) {
        scrollbarCompensation = getScrollbarWidth(this.domBindings.rootDocument);
      }
      if (bottomEdge) {
        var fixedRowsBottom = wtSettings.getSetting("fixedRowsBottom");
        var totalRows = wtSettings.getSetting("totalRows");
        newY += this.sumCellSizes(0, sourceRow + 1);
        newY -= wot.wtViewport.getViewportHeight() - this.sumCellSizes(totalRows - fixedRowsBottom, totalRows);
        newY += 1;
      } else {
        newY += this.sumCellSizes(wtSettings.getSetting("fixedRowsTop"), sourceRow);
      }
      newY += scrollbarCompensation;
      return this.setScrollPosition(newY);
    }
  }, {
    key: "getTableParentOffset",
    value: function getTableParentOffset() {
      if (this.mainTableScrollableElement === this.domBindings.rootWindow) {
        return this.wot.wtTable.holderOffset.top;
      }
      return 0;
    }
  }, {
    key: "getScrollPosition",
    value: function getScrollPosition() {
      return getScrollTop(this.mainTableScrollableElement, this.domBindings.rootWindow);
    }
  }, {
    key: "getOverlayOffset",
    value: function getOverlayOffset() {
      var rootWindow = this.domBindings.rootWindow;
      var preventOverflow = this.wtSettings.getSetting("preventOverflow");
      var overlayOffset = 0;
      if (this.trimmingContainer === rootWindow && (!preventOverflow || preventOverflow !== "vertical")) {
        var rootHeight = this.wot.wtTable.getTotalHeight();
        var overlayRootHeight = this.clone.wtTable.getTotalHeight();
        var maxOffset = rootHeight - overlayRootHeight;
        overlayOffset = Math.max(this.getScrollPosition() - this.getTableParentOffset(), 0);
        if (overlayOffset > maxOffset) {
          overlayOffset = 0;
        }
      }
      return overlayOffset;
    }
  }, {
    key: "adjustHeaderBordersPosition",
    value: function adjustHeaderBordersPosition(position) {
      var skipInnerBorderAdjusting = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      var masterParent = this.wot.wtTable.holder.parentNode;
      var totalColumns = this.wtSettings.getSetting("totalColumns");
      if (totalColumns) {
        removeClass(masterParent, "emptyColumns");
      } else {
        addClass(masterParent, "emptyColumns");
      }
      var positionChanged = false;
      if (!skipInnerBorderAdjusting) {
        var fixedRowsTop = this.wtSettings.getSetting("fixedRowsTop");
        var areFixedRowsTopChanged = this.cachedFixedRowsTop !== fixedRowsTop;
        var columnHeaders = this.wtSettings.getSetting("columnHeaders");
        if ((areFixedRowsTopChanged || fixedRowsTop === 0) && columnHeaders.length > 0) {
          var previousState = hasClass(masterParent, "innerBorderTop");
          this.cachedFixedRowsTop = this.wtSettings.getSetting("fixedRowsTop");
          if (position || this.wtSettings.getSetting("totalRows") === 0) {
            addClass(masterParent, "innerBorderTop");
            positionChanged = !previousState;
          } else {
            removeClass(masterParent, "innerBorderTop");
            positionChanged = previousState;
          }
        }
      }
      return positionChanged;
    }
  }]);
  return TopOverlay2;
}(Overlay);

function _construct$6(Parent, args, Class) {
  if (_isNativeReflectConstruct$i()) {
    _construct$6 = Reflect.construct;
  } else {
    _construct$6 = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf$i(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct$6.apply(null, arguments);
}
function _isNativeReflectConstruct$i() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _setPrototypeOf$i(o, p) {
  _setPrototypeOf$i = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$i(o, p);
}
function _classCallCheck$E(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$E(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$E(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$E(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$E(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$b(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Overlays = /* @__PURE__ */ function() {
  function Overlays2(wotInstance, facadeGetter, domBindings, wtSettings, eventManager, wtTable) {
    _classCallCheck$E(this, Overlays2);
    _defineProperty$b(this, "wot", null);
    _defineProperty$b(this, "topOverlay", null);
    _defineProperty$b(this, "bottomOverlay", null);
    _defineProperty$b(this, "inlineStartOverlay", null);
    _defineProperty$b(this, "topInlineStartCornerOverlay", null);
    _defineProperty$b(this, "bottomInlineStartCornerOverlay", null);
    _defineProperty$b(this, "browserLineHeight", void 0);
    _defineProperty$b(this, "wtSettings", null);
    this.wot = wotInstance;
    this.wtSettings = wtSettings;
    this.domBindings = domBindings;
    this.facadeGetter = facadeGetter;
    this.wtTable = wtTable;
    var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
    this.instance = this.wot;
    this.eventManager = eventManager;
    this.scrollbarSize = getScrollbarWidth(rootDocument);
    var isOverflowHidden = rootWindow.getComputedStyle(wtTable.wtRootElement.parentNode).getPropertyValue("overflow") === "hidden";
    this.scrollableElement = isOverflowHidden ? wtTable.holder : getScrollableElement(wtTable.TABLE);
    this.initOverlays();
    this.hasScrollbarBottom = false;
    this.hasScrollbarRight = false;
    this.destroyed = false;
    this.keyPressed = false;
    this.spreaderLastSize = {
      width: null,
      height: null
    };
    this.verticalScrolling = false;
    this.horizontalScrolling = false;
    this.initBrowserLineHeight();
    this.registerListeners();
    this.lastScrollX = rootWindow.scrollX;
    this.lastScrollY = rootWindow.scrollY;
  }
  _createClass$E(Overlays2, [{
    key: "initBrowserLineHeight",
    value: function initBrowserLineHeight() {
      var _this$domBindings2 = this.domBindings, rootWindow = _this$domBindings2.rootWindow, rootDocument = _this$domBindings2.rootDocument;
      var computedStyle = rootWindow.getComputedStyle(rootDocument.body);
      var lineHeight = parseInt(computedStyle.lineHeight, 10);
      var lineHeightFalback = parseInt(computedStyle.fontSize, 10) * 1.2;
      this.browserLineHeight = lineHeight || lineHeightFalback;
    }
  }, {
    key: "initOverlays",
    value: function initOverlays() {
      var args = [this.wot, this.facadeGetter, this.wtSettings, this.domBindings];
      this.topOverlay = _construct$6(TopOverlay, args);
      this.bottomOverlay = _construct$6(BottomOverlay, args);
      this.inlineStartOverlay = _construct$6(InlineStartOverlay, args);
      this.topInlineStartCornerOverlay = _construct$6(TopInlineStartCornerOverlay, args.concat([this.topOverlay, this.inlineStartOverlay]));
      this.bottomInlineStartCornerOverlay = _construct$6(BottomInlineStartCornerOverlay, args.concat([this.bottomOverlay, this.inlineStartOverlay]));
    }
  }, {
    key: "updateStateOfRendering",
    value: function updateStateOfRendering() {
      var syncScroll = this.topOverlay.updateStateOfRendering();
      syncScroll = this.bottomOverlay.updateStateOfRendering() || syncScroll;
      syncScroll = this.inlineStartOverlay.updateStateOfRendering() || syncScroll;
      if (this.inlineStartOverlay.needFullRender) {
        if (this.topOverlay.needFullRender) {
          syncScroll = this.topInlineStartCornerOverlay.updateStateOfRendering() || syncScroll;
        }
        if (this.bottomOverlay.needFullRender) {
          syncScroll = this.bottomInlineStartCornerOverlay.updateStateOfRendering() || syncScroll;
        }
      }
      return syncScroll;
    }
  }, {
    key: "refreshAll",
    value: function refreshAll() {
      if (!this.wot.drawn) {
        return;
      }
      if (!this.wtTable.holder.parentNode) {
        this.destroy();
        return;
      }
      this.wot.draw(true);
      if (this.verticalScrolling) {
        this.inlineStartOverlay.onScroll();
      }
      if (this.horizontalScrolling) {
        this.topOverlay.onScroll();
      }
      this.verticalScrolling = false;
      this.horizontalScrolling = false;
    }
  }, {
    key: "registerListeners",
    value: function registerListeners() {
      var _this = this;
      var _this$domBindings3 = this.domBindings, rootDocument = _this$domBindings3.rootDocument, rootWindow = _this$domBindings3.rootWindow;
      var topOverlayScrollableElement = this.topOverlay.mainTableScrollableElement;
      var inlineStartOverlayScrollableElement = this.inlineStartOverlay.mainTableScrollableElement;
      this.eventManager.addEventListener(rootDocument.documentElement, "keydown", function(event) {
        return _this.onKeyDown(event);
      });
      this.eventManager.addEventListener(rootDocument.documentElement, "keyup", function() {
        return _this.onKeyUp();
      });
      this.eventManager.addEventListener(rootDocument, "visibilitychange", function() {
        return _this.onKeyUp();
      });
      this.eventManager.addEventListener(topOverlayScrollableElement, "scroll", function(event) {
        return _this.onTableScroll(event);
      }, {
        passive: true
      });
      if (topOverlayScrollableElement !== inlineStartOverlayScrollableElement) {
        this.eventManager.addEventListener(inlineStartOverlayScrollableElement, "scroll", function(event) {
          return _this.onTableScroll(event);
        }, {
          passive: true
        });
      }
      var isHighPixelRatio = rootWindow.devicePixelRatio && rootWindow.devicePixelRatio > 1;
      var isScrollOnWindow = this.scrollableElement === rootWindow;
      var preventWheel = this.wtSettings.getSetting("preventWheel");
      var wheelEventOptions = {
        passive: isScrollOnWindow
      };
      if (preventWheel || isHighPixelRatio || !isChrome()) {
        this.eventManager.addEventListener(this.wtTable.wtRootElement, "wheel", function(event) {
          return _this.onCloneWheel(event, preventWheel);
        }, wheelEventOptions);
      }
      var overlays = [this.topOverlay, this.bottomOverlay, this.inlineStartOverlay, this.topInlineStartCornerOverlay, this.bottomInlineStartCornerOverlay];
      overlays.forEach(function(overlay) {
        if (overlay && overlay.needFullRender) {
          var holder = overlay.clone.wtTable.holder;
          _this.eventManager.addEventListener(holder, "wheel", function(event) {
            return _this.onCloneWheel(event, preventWheel);
          }, wheelEventOptions);
        }
      });
      var resizeTimeout;
      this.eventManager.addEventListener(rootWindow, "resize", function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          _this.wtSettings.getSetting("onWindowResize");
        }, 200);
      });
    }
  }, {
    key: "deregisterListeners",
    value: function deregisterListeners() {
      this.eventManager.clearEvents(true);
    }
  }, {
    key: "onTableScroll",
    value: function onTableScroll(event) {
      var rootWindow = this.domBindings.rootWindow;
      var masterHorizontal = this.inlineStartOverlay.mainTableScrollableElement;
      var masterVertical = this.topOverlay.mainTableScrollableElement;
      var target = event.target;
      if (this.keyPressed) {
        if (masterVertical !== rootWindow && target !== rootWindow && !event.target.contains(masterVertical) || masterHorizontal !== rootWindow && target !== rootWindow && !event.target.contains(masterHorizontal)) {
          return;
        }
      }
      this.syncScrollPositions(event);
    }
  }, {
    key: "onCloneWheel",
    value: function onCloneWheel(event, preventDefault) {
      var rootWindow = this.domBindings.rootWindow;
      var masterHorizontal = this.inlineStartOverlay.mainTableScrollableElement;
      var masterVertical = this.topOverlay.mainTableScrollableElement;
      var target = event.target;
      var shouldNotWheelVertically = masterVertical !== rootWindow && target !== rootWindow && !target.contains(masterVertical);
      var shouldNotWheelHorizontally = masterHorizontal !== rootWindow && target !== rootWindow && !target.contains(masterHorizontal);
      if (this.keyPressed && (shouldNotWheelVertically || shouldNotWheelHorizontally)) {
        return;
      }
      var isScrollPossible = this.translateMouseWheelToScroll(event);
      if (preventDefault || this.scrollableElement !== rootWindow && isScrollPossible) {
        event.preventDefault();
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      this.keyPressed = isKey(event.keyCode, "ARROW_UP|ARROW_RIGHT|ARROW_DOWN|ARROW_LEFT");
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp() {
      this.keyPressed = false;
    }
  }, {
    key: "translateMouseWheelToScroll",
    value: function translateMouseWheelToScroll(event) {
      var deltaY = isNaN(event.deltaY) ? -1 * event.wheelDeltaY : event.deltaY;
      var deltaX = isNaN(event.deltaX) ? -1 * event.wheelDeltaX : event.deltaX;
      if (event.deltaMode === 1) {
        deltaX += deltaX * this.browserLineHeight;
        deltaY += deltaY * this.browserLineHeight;
      }
      var isScrollVerticallyPossible = this.scrollVertically(deltaY);
      var isScrollHorizontallyPossible = this.scrollHorizontally(deltaX);
      return isScrollVerticallyPossible || isScrollHorizontallyPossible;
    }
  }, {
    key: "scrollVertically",
    value: function scrollVertically(delta) {
      var previousScroll = this.scrollableElement.scrollTop;
      this.scrollableElement.scrollTop += delta;
      return previousScroll !== this.scrollableElement.scrollTop;
    }
  }, {
    key: "scrollHorizontally",
    value: function scrollHorizontally(delta) {
      var previousScroll = this.scrollableElement.scrollLeft;
      this.scrollableElement.scrollLeft += delta;
      return previousScroll !== this.scrollableElement.scrollLeft;
    }
  }, {
    key: "syncScrollPositions",
    value: function syncScrollPositions() {
      if (this.destroyed) {
        return;
      }
      var rootWindow = this.domBindings.rootWindow;
      var topHolder = this.topOverlay.clone.wtTable.holder;
      var leftHolder = this.inlineStartOverlay.clone.wtTable.holder;
      var _ref = [this.scrollableElement.scrollLeft, this.scrollableElement.scrollTop], scrollLeft = _ref[0], scrollTop = _ref[1];
      this.horizontalScrolling = topHolder.scrollLeft !== scrollLeft || this.lastScrollX !== rootWindow.scrollX;
      this.verticalScrolling = leftHolder.scrollTop !== scrollTop || this.lastScrollY !== rootWindow.scrollY;
      this.lastScrollX = rootWindow.scrollX;
      this.lastScrollY = rootWindow.scrollY;
      if (this.horizontalScrolling) {
        topHolder.scrollLeft = scrollLeft;
        var bottomHolder = this.bottomOverlay.needFullRender ? this.bottomOverlay.clone.wtTable.holder : null;
        if (bottomHolder) {
          bottomHolder.scrollLeft = scrollLeft;
        }
      }
      if (this.verticalScrolling) {
        leftHolder.scrollTop = scrollTop;
      }
      this.refreshAll();
    }
  }, {
    key: "syncScrollWithMaster",
    value: function syncScrollWithMaster() {
      var master = this.topOverlay.mainTableScrollableElement;
      var scrollLeft = master.scrollLeft, scrollTop = master.scrollTop;
      if (this.topOverlay.needFullRender) {
        this.topOverlay.clone.wtTable.holder.scrollLeft = scrollLeft;
      }
      if (this.bottomOverlay.needFullRender) {
        this.bottomOverlay.clone.wtTable.holder.scrollLeft = scrollLeft;
      }
      if (this.inlineStartOverlay.needFullRender) {
        this.inlineStartOverlay.clone.wtTable.holder.scrollTop = scrollTop;
      }
    }
  }, {
    key: "updateMainScrollableElements",
    value: function updateMainScrollableElements() {
      this.deregisterListeners();
      this.inlineStartOverlay.updateMainScrollableElement();
      this.topOverlay.updateMainScrollableElement();
      if (this.bottomOverlay.needFullRender) {
        this.bottomOverlay.updateMainScrollableElement();
      }
      var wtTable = this.wtTable;
      var rootWindow = this.domBindings.rootWindow;
      if (rootWindow.getComputedStyle(wtTable.wtRootElement.parentNode).getPropertyValue("overflow") === "hidden") {
        this.scrollableElement = wtTable.holder;
      } else {
        this.scrollableElement = getScrollableElement(wtTable.TABLE);
      }
      this.registerListeners();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventManager.destroy();
      this.topOverlay.destroy();
      if (this.bottomOverlay.clone) {
        this.bottomOverlay.destroy();
      }
      this.inlineStartOverlay.destroy();
      if (this.topInlineStartCornerOverlay) {
        this.topInlineStartCornerOverlay.destroy();
      }
      if (this.bottomInlineStartCornerOverlay && this.bottomInlineStartCornerOverlay.clone) {
        this.bottomInlineStartCornerOverlay.destroy();
      }
      this.destroyed = true;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var spreader = this.wtTable.spreader;
      var width = spreader.clientWidth;
      var height = spreader.clientHeight;
      if (width !== this.spreaderLastSize.width || height !== this.spreaderLastSize.height) {
        this.spreaderLastSize.width = width;
        this.spreaderLastSize.height = height;
        this.adjustElementsSize();
      }
      if (this.bottomOverlay.clone) {
        this.bottomOverlay.refresh(fastDraw);
      }
      this.inlineStartOverlay.refresh(fastDraw);
      this.topOverlay.refresh(fastDraw);
      if (this.topInlineStartCornerOverlay) {
        this.topInlineStartCornerOverlay.refresh(fastDraw);
      }
      if (this.bottomInlineStartCornerOverlay && this.bottomInlineStartCornerOverlay.clone) {
        this.bottomInlineStartCornerOverlay.refresh(fastDraw);
      }
    }
  }, {
    key: "adjustElementsSize",
    value: function adjustElementsSize() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var wtViewport = this.wot.wtViewport;
      var wtTable = this.wtTable;
      var totalColumns = this.wtSettings.getSetting("totalColumns");
      var totalRows = this.wtSettings.getSetting("totalRows");
      var headerRowSize = wtViewport.getRowHeaderWidth();
      var headerColumnSize = wtViewport.getColumnHeaderHeight();
      var hiderStyle = wtTable.hider.style;
      hiderStyle.width = "".concat(headerRowSize + this.inlineStartOverlay.sumCellSizes(0, totalColumns), "px");
      hiderStyle.height = "".concat(headerColumnSize + this.topOverlay.sumCellSizes(0, totalRows) + 1, "px");
      if (this.scrollbarSize > 0) {
        var _wtTable$wtRootElemen = wtTable.wtRootElement, rootElemScrollHeight = _wtTable$wtRootElemen.scrollHeight, rootElemScrollWidth = _wtTable$wtRootElemen.scrollWidth;
        var _wtTable$holder = wtTable.holder, holderScrollHeight = _wtTable$holder.scrollHeight, holderScrollWidth = _wtTable$holder.scrollWidth;
        this.hasScrollbarRight = rootElemScrollHeight < holderScrollHeight;
        this.hasScrollbarBottom = rootElemScrollWidth < holderScrollWidth;
        if (this.hasScrollbarRight && wtTable.hider.scrollWidth + this.scrollbarSize > rootElemScrollWidth) {
          this.hasScrollbarBottom = true;
        } else if (this.hasScrollbarBottom && wtTable.hider.scrollHeight + this.scrollbarSize > rootElemScrollHeight) {
          this.hasScrollbarRight = true;
        }
      }
      this.topOverlay.adjustElementsSize(force);
      this.inlineStartOverlay.adjustElementsSize(force);
      this.bottomOverlay.adjustElementsSize(force);
    }
  }, {
    key: "applyToDOM",
    value: function applyToDOM() {
      if (!this.wtTable.isVisible()) {
        return;
      }
      this.topOverlay.applyToDOM();
      if (this.bottomOverlay.clone) {
        this.bottomOverlay.applyToDOM();
      }
      this.inlineStartOverlay.applyToDOM();
    }
  }, {
    key: "getParentOverlay",
    value: function getParentOverlay(element) {
      if (!element) {
        return null;
      }
      var overlays = [this.topOverlay, this.inlineStartOverlay, this.bottomOverlay, this.topInlineStartCornerOverlay, this.bottomInlineStartCornerOverlay];
      var result = null;
      arrayEach(overlays, function(overlay) {
        if (!overlay) {
          return;
        }
        if (overlay.clone && overlay.clone.wtTable.TABLE.contains(element)) {
          result = overlay.clone;
        }
      });
      return result;
    }
  }, {
    key: "syncOverlayTableClassNames",
    value: function syncOverlayTableClassNames() {
      var masterTable = this.wtTable.TABLE;
      var overlays = [this.topOverlay, this.inlineStartOverlay, this.bottomOverlay, this.topInlineStartCornerOverlay, this.bottomInlineStartCornerOverlay];
      arrayEach(overlays, function(elem) {
        if (!elem) {
          return;
        }
        elem.clone.wtTable.TABLE.className = masterTable.className;
      });
    }
  }]);
  return Overlays2;
}();

function _classCallCheck$F(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$F(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$F(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$F(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$F(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _defineProperty$c(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var Settings = /* @__PURE__ */ function() {
  function Settings2(settings) {
    var _this = this;
    _classCallCheck$F(this, Settings2);
    _defineProperty$c(this, "settings", {});
    _defineProperty$c(this, "defaults", Object.freeze(this.getDefaults()));
    objectEach(this.defaults, function(value, key) {
      if (settings[key] !== void 0) {
        _this.settings[key] = settings[key];
      } else if (value === void 0) {
        throw new Error('A required setting "'.concat(key, '" was not provided'));
      } else {
        _this.settings[key] = value;
      }
    });
  }
  _createClass$F(Settings2, [{
    key: "getDefaults",
    value: function getDefaults() {
      var _this2 = this;
      return {
        facade: void 0,
        table: void 0,
        isDataViewInstance: true,
        externalRowCalculator: false,
        stretchH: "none",
        currentRowClassName: null,
        currentColumnClassName: null,
        preventOverflow: function preventOverflow() {
          return false;
        },
        preventWheel: false,
        data: void 0,
        freezeOverlays: false,
        fixedColumnsStart: 0,
        fixedRowsTop: 0,
        fixedRowsBottom: 0,
        shouldRenderInlineStartOverlay: function shouldRenderInlineStartOverlay() {
          return _this2.getSetting("fixedColumnsStart") > 0 || _this2.getSetting("rowHeaders").length > 0;
        },
        shouldRenderTopOverlay: function shouldRenderTopOverlay() {
          return _this2.getSetting("fixedRowsTop") > 0 || _this2.getSetting("columnHeaders").length > 0;
        },
        shouldRenderBottomOverlay: function shouldRenderBottomOverlay() {
          return _this2.getSetting("fixedRowsBottom") > 0;
        },
        minSpareRows: 0,
        rowHeaders: function rowHeaders() {
          return [];
        },
        columnHeaders: function columnHeaders() {
          return [];
        },
        totalRows: void 0,
        totalColumns: void 0,
        cellRenderer: function cellRenderer(row, column, TD) {
          var cellData = _this2.getSetting("data", row, column);
          fastInnerText(TD, cellData === void 0 || cellData === null ? "" : cellData);
        },
        columnWidth: function columnWidth() {
        },
        rowHeight: function rowHeight() {
        },
        defaultRowHeight: 23,
        defaultColumnWidth: 50,
        selections: null,
        hideBorderOnMouseDownOver: false,
        viewportRowCalculatorOverride: null,
        viewportColumnCalculatorOverride: null,
        onCellMouseDown: null,
        onCellContextMenu: null,
        onCellMouseOver: null,
        onCellMouseOut: null,
        onCellMouseUp: null,
        onCellDblClick: null,
        onCellCornerMouseDown: null,
        onCellCornerDblClick: null,
        beforeDraw: null,
        onDraw: null,
        onBeforeRemoveCellClassNames: null,
        onAfterDrawSelection: null,
        onBeforeDrawBorders: null,
        onScrollVertically: null,
        onScrollHorizontally: null,
        onBeforeTouchScroll: null,
        onAfterMomentumScroll: null,
        onBeforeStretchingColumnWidth: function onBeforeStretchingColumnWidth(width) {
          return width;
        },
        onModifyRowHeaderWidth: null,
        onModifyGetCellCoords: null,
        onBeforeHighlightingRowHeader: function onBeforeHighlightingRowHeader(sourceRow) {
          return sourceRow;
        },
        onBeforeHighlightingColumnHeader: function onBeforeHighlightingColumnHeader(sourceCol) {
          return sourceCol;
        },
        onWindowResize: null,
        renderAllRows: false,
        groups: false,
        rowHeaderWidth: null,
        columnHeaderHeight: null,
        headerClassName: null,
        rtlMode: false
      };
    }
  }, {
    key: "update",
    value: function update(settings, value) {
      var _this3 = this;
      if (value === void 0) {
        objectEach(settings, function(settingValue, key) {
          _this3.settings[key] = settingValue;
        });
      } else {
        this.settings[settings] = value;
      }
      return this;
    }
  }, {
    key: "getSetting",
    value: function getSetting(key, param1, param2, param3, param4) {
      if (typeof this.settings[key] === "function") {
        return this.settings[key](param1, param2, param3, param4);
      } else if (param1 !== void 0 && Array.isArray(this.settings[key])) {
        return this.settings[key][param1];
      }
      return this.settings[key];
    }
  }, {
    key: "getSettingPure",
    value: function getSettingPure(key) {
      return this.settings[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return !!this.settings[key];
    }
  }]);
  return Settings2;
}();

function _typeof$m(obj) {
  "@babel/helpers - typeof";
  return _typeof$m = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$m(obj);
}
function _classCallCheck$G(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$G(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$G(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$G(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$G(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$h(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$j(subClass, superClass);
}
function _setPrototypeOf$j(o, p) {
  _setPrototypeOf$j = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$j(o, p);
}
function _createSuper$h(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$j();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$h(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$h(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$h(this, result);
  };
}
function _possibleConstructorReturn$h(self, call) {
  if (call && (_typeof$m(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$h(self);
}
function _assertThisInitialized$h(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$j() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$h(o) {
  _getPrototypeOf$h = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$h(o);
}
var MasterTable = /* @__PURE__ */ function(_Table) {
  _inherits$h(MasterTable2, _Table);
  var _super = _createSuper$h(MasterTable2);
  function MasterTable2(dataAccessObject, facadeGetter, domBindings, wtSettings) {
    _classCallCheck$G(this, MasterTable2);
    return _super.call(this, dataAccessObject, facadeGetter, domBindings, wtSettings, "master");
  }
  _createClass$G(MasterTable2, [{
    key: "alignOverlaysWithTrimmingContainer",
    value: function alignOverlaysWithTrimmingContainer() {
      var trimmingElement = getTrimmingContainer(this.wtRootElement);
      var rootWindow = this.domBindings.rootWindow;
      if (trimmingElement === rootWindow) {
        var preventOverflow = this.wtSettings.getSetting("preventOverflow");
        if (!preventOverflow) {
          this.holder.style.overflow = "visible";
          this.wtRootElement.style.overflow = "visible";
        }
      } else {
        var trimmingElementParent = trimmingElement.parentElement;
        var trimmingHeight = getStyle(trimmingElement, "height", rootWindow);
        var trimmingOverflow = getStyle(trimmingElement, "overflow", rootWindow);
        var holderStyle = this.holder.style;
        var scrollWidth = trimmingElement.scrollWidth, scrollHeight = trimmingElement.scrollHeight;
        var _trimmingElement$getB = trimmingElement.getBoundingClientRect(), width = _trimmingElement$getB.width, height = _trimmingElement$getB.height;
        var overflow = ["auto", "hidden", "scroll"];
        if (trimmingElementParent && overflow.includes(trimmingOverflow)) {
          var cloneNode = trimmingElement.cloneNode(false);
          cloneNode.style.overflow = "auto";
          if (trimmingElement.nextElementSibling) {
            trimmingElementParent.insertBefore(cloneNode, trimmingElement.nextElementSibling);
          } else {
            trimmingElementParent.appendChild(cloneNode);
          }
          var cloneHeight = parseInt(getComputedStyle(cloneNode, rootWindow).height, 10);
          trimmingElementParent.removeChild(cloneNode);
          if (cloneHeight === 0) {
            height = 0;
          }
        }
        height = Math.min(height, scrollHeight);
        holderStyle.height = trimmingHeight === "auto" ? "auto" : "".concat(height, "px");
        width = Math.min(width, scrollWidth);
        holderStyle.width = "".concat(width, "px");
        holderStyle.overflow = "";
        this.hasTableHeight = holderStyle.height === "auto" ? true : height > 0;
        this.hasTableWidth = width > 0;
      }
      this.isTableVisible = isVisible(this.TABLE);
    }
  }, {
    key: "markOversizedColumnHeaders",
    value: function markOversizedColumnHeaders() {
      var wtSettings = this.wtSettings;
      var wtViewport = this.dataAccessObject.wtViewport;
      var overlayName = "master";
      var columnHeaders = wtSettings.getSetting("columnHeaders");
      var columnHeadersCount = columnHeaders.length;
      if (columnHeadersCount && !wtViewport.hasOversizedColumnHeadersMarked[overlayName]) {
        var rowHeaders = wtSettings.getSetting("rowHeaders");
        var rowHeaderCount = rowHeaders.length;
        var columnCount = this.getRenderedColumnsCount();
        for (var i = 0; i < columnHeadersCount; i++) {
          for (var renderedColumnIndex = -1 * rowHeaderCount; renderedColumnIndex < columnCount; renderedColumnIndex++) {
            this.markIfOversizedColumnHeader(renderedColumnIndex);
          }
        }
        wtViewport.hasOversizedColumnHeadersMarked[overlayName] = true;
      }
    }
  }]);
  return MasterTable2;
}(Table);
mixin(MasterTable, calculatedRows);
mixin(MasterTable, calculatedColumns);

function _classCallCheck$H(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$H(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$H(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$H(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$H(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Viewport = /* @__PURE__ */ function() {
  function Viewport2(dataAccessObject, domBindings, wtSettings, eventManager, wtTable) {
    var _this = this;
    _classCallCheck$H(this, Viewport2);
    this.dataAccessObject = dataAccessObject;
    this.wot = dataAccessObject.wot;
    this.instance = this.wot;
    this.domBindings = domBindings;
    this.wtSettings = wtSettings;
    this.wtTable = wtTable;
    this.oversizedRows = [];
    this.oversizedColumnHeaders = [];
    this.hasOversizedColumnHeadersMarked = {};
    this.clientHeight = 0;
    this.containerWidth = NaN;
    this.rowHeaderWidth = NaN;
    this.rowsVisibleCalculator = null;
    this.columnsVisibleCalculator = null;
    this.eventManager = eventManager;
    this.eventManager.addEventListener(this.domBindings.rootWindow, "resize", function() {
      _this.clientHeight = _this.getWorkspaceHeight();
    });
  }
  _createClass$H(Viewport2, [{
    key: "getWorkspaceHeight",
    value: function getWorkspaceHeight() {
      var currentDocument = this.domBindings.rootDocument;
      var trimmingContainer = this.dataAccessObject.topOverlayTrimmingContainer;
      var height = 0;
      if (trimmingContainer === this.domBindings.rootWindow) {
        height = currentDocument.documentElement.clientHeight;
      } else {
        var elemHeight = outerHeight(trimmingContainer);
        height = elemHeight > 0 && trimmingContainer.clientHeight > 0 ? trimmingContainer.clientHeight : Infinity;
      }
      return height;
    }
  }, {
    key: "getWorkspaceWidth",
    value: function getWorkspaceWidth() {
      var wtSettings = this.wtSettings;
      var _this$domBindings = this.domBindings, rootDocument = _this$domBindings.rootDocument, rootWindow = _this$domBindings.rootWindow;
      var trimmingContainer = this.dataAccessObject.inlineStartOverlayTrimmingContainer;
      var docOffsetWidth = rootDocument.documentElement.offsetWidth;
      var totalColumns = wtSettings.getSetting("totalColumns");
      var preventOverflow = wtSettings.getSetting("preventOverflow");
      var isRtl = wtSettings.getSetting("rtlMode");
      var tableRect = this.wtTable.TABLE.getBoundingClientRect();
      var inlineStart = isRtl ? tableRect.right - docOffsetWidth : tableRect.left;
      var tableOffset = docOffsetWidth - inlineStart;
      var width;
      var overflow;
      if (preventOverflow) {
        return outerWidth(this.wtTable.wtRootElement);
      }
      if (wtSettings.getSetting("freezeOverlays")) {
        width = Math.min(tableOffset, docOffsetWidth);
      } else {
        width = Math.min(this.getContainerFillWidth(), tableOffset, docOffsetWidth);
      }
      if (trimmingContainer === rootWindow && totalColumns > 0 && this.sumColumnWidths(0, totalColumns - 1) > width) {
        return rootDocument.documentElement.clientWidth;
      }
      if (trimmingContainer !== rootWindow) {
        overflow = getStyle(this.dataAccessObject.inlineStartOverlayTrimmingContainer, "overflow", rootWindow);
        if (overflow === "scroll" || overflow === "hidden" || overflow === "auto") {
          return Math.max(width, trimmingContainer.clientWidth);
        }
      }
      var stretchSetting = wtSettings.getSetting("stretchH");
      if (stretchSetting === "none" || !stretchSetting) {
        return Math.max(width, outerWidth(this.wtTable.TABLE));
      }
      return width;
    }
  }, {
    key: "hasVerticalScroll",
    value: function hasVerticalScroll() {
      return this.getWorkspaceActualHeight() > this.getWorkspaceHeight();
    }
  }, {
    key: "hasHorizontalScroll",
    value: function hasHorizontalScroll() {
      return this.getWorkspaceActualWidth() > this.getWorkspaceWidth();
    }
  }, {
    key: "sumColumnWidths",
    value: function sumColumnWidths(from, length) {
      var sum = 0;
      var column = from;
      while (column < length) {
        sum += this.wtTable.getColumnWidth(column);
        column += 1;
      }
      return sum;
    }
  }, {
    key: "getContainerFillWidth",
    value: function getContainerFillWidth() {
      if (this.containerWidth) {
        return this.containerWidth;
      }
      var mainContainer = this.wtTable.holder;
      var dummyElement = this.domBindings.rootDocument.createElement("div");
      dummyElement.style.width = "100%";
      dummyElement.style.height = "1px";
      mainContainer.appendChild(dummyElement);
      var fillWidth = dummyElement.offsetWidth;
      this.containerWidth = fillWidth;
      mainContainer.removeChild(dummyElement);
      return fillWidth;
    }
  }, {
    key: "getWorkspaceOffset",
    value: function getWorkspaceOffset() {
      return offset(this.wtTable.TABLE);
    }
  }, {
    key: "getWorkspaceActualHeight",
    value: function getWorkspaceActualHeight() {
      return outerHeight(this.wtTable.TABLE);
    }
  }, {
    key: "getWorkspaceActualWidth",
    value: function getWorkspaceActualWidth() {
      return outerWidth(this.wtTable.TABLE) || outerWidth(this.wtTable.TBODY) || outerWidth(this.wtTable.THEAD);
    }
  }, {
    key: "getColumnHeaderHeight",
    value: function getColumnHeaderHeight() {
      var columnHeaders = this.wtSettings.getSetting("columnHeaders");
      if (!columnHeaders.length) {
        this.columnHeaderHeight = 0;
      } else if (isNaN(this.columnHeaderHeight)) {
        this.columnHeaderHeight = outerHeight(this.wtTable.THEAD);
      }
      return this.columnHeaderHeight;
    }
  }, {
    key: "getViewportHeight",
    value: function getViewportHeight() {
      var containerHeight = this.getWorkspaceHeight();
      if (containerHeight === Infinity) {
        return containerHeight;
      }
      var columnHeaderHeight = this.getColumnHeaderHeight();
      if (columnHeaderHeight > 0) {
        containerHeight -= columnHeaderHeight;
      }
      return containerHeight;
    }
  }, {
    key: "getRowHeaderWidth",
    value: function getRowHeaderWidth() {
      var rowHeadersWidthSetting = this.wtSettings.getSetting("rowHeaderWidth");
      var rowHeaders = this.wtSettings.getSetting("rowHeaders");
      if (rowHeadersWidthSetting) {
        this.rowHeaderWidth = 0;
        for (var i = 0, len = rowHeaders.length; i < len; i++) {
          this.rowHeaderWidth += rowHeadersWidthSetting[i] || rowHeadersWidthSetting;
        }
      }
      if (isNaN(this.rowHeaderWidth)) {
        if (rowHeaders.length) {
          var TH = this.wtTable.TABLE.querySelector("TH");
          this.rowHeaderWidth = 0;
          for (var _i = 0, _len = rowHeaders.length; _i < _len; _i++) {
            if (TH) {
              this.rowHeaderWidth += outerWidth(TH);
              TH = TH.nextSibling;
            } else {
              this.rowHeaderWidth += 50;
            }
          }
        } else {
          this.rowHeaderWidth = 0;
        }
      }
      this.rowHeaderWidth = this.wtSettings.getSetting("onModifyRowHeaderWidth", this.rowHeaderWidth) || this.rowHeaderWidth;
      return this.rowHeaderWidth;
    }
  }, {
    key: "getViewportWidth",
    value: function getViewportWidth() {
      var containerWidth = this.getWorkspaceWidth();
      if (containerWidth === Infinity) {
        return containerWidth;
      }
      var rowHeaderWidth = this.getRowHeaderWidth();
      if (rowHeaderWidth > 0) {
        return containerWidth - rowHeaderWidth;
      }
      return containerWidth;
    }
  }, {
    key: "createRowsCalculator",
    value: function createRowsCalculator() {
      var calculationType = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : RENDER_TYPE;
      var wtSettings = this.wtSettings, wtTable = this.wtTable;
      var height;
      var scrollbarHeight;
      var fixedRowsHeight;
      this.rowHeaderWidth = NaN;
      if (wtSettings.getSetting("renderAllRows") && calculationType === RENDER_TYPE) {
        height = Infinity;
      } else {
        height = this.getViewportHeight();
      }
      var pos = this.dataAccessObject.topScrollPosition - this.dataAccessObject.topParentOffset;
      if (pos < 0) {
        pos = 0;
      }
      var fixedRowsTop = wtSettings.getSetting("fixedRowsTop");
      var fixedRowsBottom = wtSettings.getSetting("fixedRowsBottom");
      var totalRows = wtSettings.getSetting("totalRows");
      if (fixedRowsTop) {
        fixedRowsHeight = this.dataAccessObject.topOverlay.sumCellSizes(0, fixedRowsTop);
        pos += fixedRowsHeight;
        height -= fixedRowsHeight;
      }
      if (fixedRowsBottom && this.dataAccessObject.bottomOverlay.clone) {
        fixedRowsHeight = this.dataAccessObject.bottomOverlay.sumCellSizes(totalRows - fixedRowsBottom, totalRows);
        height -= fixedRowsHeight;
      }
      if (wtTable.holder.clientHeight === wtTable.holder.offsetHeight) {
        scrollbarHeight = 0;
      } else {
        scrollbarHeight = getScrollbarWidth(this.domBindings.rootDocument);
      }
      return new ViewportRowsCalculator({
        viewportSize: height,
        scrollOffset: pos,
        totalItems: wtSettings.getSetting("totalRows"),
        itemSizeFn: function itemSizeFn(sourceRow) {
          return wtTable.getRowHeight(sourceRow);
        },
        overrideFn: wtSettings.getSettingPure("viewportRowCalculatorOverride"),
        calculationType,
        scrollbarHeight
      });
    }
  }, {
    key: "createColumnsCalculator",
    value: function createColumnsCalculator() {
      var calculationType = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : RENDER_TYPE;
      var wtSettings = this.wtSettings, wtTable = this.wtTable;
      var width = this.getViewportWidth();
      var pos = Math.abs(this.dataAccessObject.inlineStartScrollPosition) - this.dataAccessObject.inlineStartParentOffset;
      this.columnHeaderHeight = NaN;
      if (pos < 0) {
        pos = 0;
      }
      var fixedColumnsStart = wtSettings.getSetting("fixedColumnsStart");
      if (fixedColumnsStart) {
        var fixedColumnsWidth = this.dataAccessObject.inlineStartOverlay.sumCellSizes(0, fixedColumnsStart);
        pos += fixedColumnsWidth;
        width -= fixedColumnsWidth;
      }
      if (wtTable.holder.clientWidth !== wtTable.holder.offsetWidth) {
        width -= getScrollbarWidth(this.domBindings.rootDocument);
      }
      return new ViewportColumnsCalculator({
        viewportSize: width,
        scrollOffset: Math.abs(pos),
        totalItems: wtSettings.getSetting("totalColumns"),
        itemSizeFn: function itemSizeFn(sourceCol) {
          return wtTable.getColumnWidth(sourceCol);
        },
        overrideFn: wtSettings.getSettingPure("viewportColumnCalculatorOverride"),
        calculationType,
        stretchMode: wtSettings.getSetting("stretchH"),
        stretchingItemWidthFn: function stretchingItemWidthFn(stretchedWidth, column) {
          return wtSettings.getSetting("onBeforeStretchingColumnWidth", stretchedWidth, column);
        }
      });
    }
  }, {
    key: "createRenderCalculators",
    value: function createRenderCalculators() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var runFastDraw = fastDraw;
      if (runFastDraw) {
        var proposedRowsVisibleCalculator = this.createRowsCalculator(FULLY_VISIBLE_TYPE);
        var proposedColumnsVisibleCalculator = this.createColumnsCalculator(FULLY_VISIBLE_TYPE);
        if (!(this.areAllProposedVisibleRowsAlreadyRendered(proposedRowsVisibleCalculator) && this.areAllProposedVisibleColumnsAlreadyRendered(proposedColumnsVisibleCalculator))) {
          runFastDraw = false;
        }
      }
      if (!runFastDraw) {
        this.rowsRenderCalculator = this.createRowsCalculator(RENDER_TYPE);
        this.columnsRenderCalculator = this.createColumnsCalculator(RENDER_TYPE);
      }
      this.rowsVisibleCalculator = null;
      this.columnsVisibleCalculator = null;
      return runFastDraw;
    }
  }, {
    key: "createVisibleCalculators",
    value: function createVisibleCalculators() {
      this.rowsVisibleCalculator = this.createRowsCalculator(FULLY_VISIBLE_TYPE);
      this.columnsVisibleCalculator = this.createColumnsCalculator(FULLY_VISIBLE_TYPE);
    }
  }, {
    key: "areAllProposedVisibleRowsAlreadyRendered",
    value: function areAllProposedVisibleRowsAlreadyRendered(proposedRowsVisibleCalculator) {
      if (!this.rowsVisibleCalculator) {
        return false;
      }
      var startRow = proposedRowsVisibleCalculator.startRow, endRow = proposedRowsVisibleCalculator.endRow;
      var _this$rowsRenderCalcu = this.rowsRenderCalculator, renderedStartRow = _this$rowsRenderCalcu.startRow, renderedEndRow = _this$rowsRenderCalcu.endRow;
      if (startRow < renderedStartRow || startRow === renderedStartRow && startRow > 0) {
        return false;
      } else if (endRow > renderedEndRow || endRow === renderedEndRow && endRow < this.wtSettings.getSetting("totalRows") - 1) {
        return false;
      }
      return true;
    }
  }, {
    key: "areAllProposedVisibleColumnsAlreadyRendered",
    value: function areAllProposedVisibleColumnsAlreadyRendered(proposedColumnsVisibleCalculator) {
      if (!this.columnsVisibleCalculator) {
        return false;
      }
      var startColumn = proposedColumnsVisibleCalculator.startColumn, endColumn = proposedColumnsVisibleCalculator.endColumn;
      var _this$columnsRenderCa = this.columnsRenderCalculator, renderedStartColumn = _this$columnsRenderCa.startColumn, renderedEndColumn = _this$columnsRenderCa.endColumn;
      if (startColumn < renderedStartColumn || startColumn === renderedStartColumn && startColumn > 0) {
        return false;
      } else if (endColumn > renderedEndColumn || endColumn === renderedEndColumn && endColumn < this.wtSettings.getSetting("totalColumns") - 1) {
        return false;
      }
      return true;
    }
  }, {
    key: "resetHasOversizedColumnHeadersMarked",
    value: function resetHasOversizedColumnHeadersMarked() {
      objectEach(this.hasOversizedColumnHeadersMarked, function(value, key, object) {
        object[key] = void 0;
      });
    }
  }]);
  return Viewport2;
}();

function _typeof$n(obj) {
  "@babel/helpers - typeof";
  return _typeof$n = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$n(obj);
}
function _classCallCheck$I(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$I(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$I(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$I(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$I(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$i(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$k(subClass, superClass);
}
function _setPrototypeOf$k(o, p) {
  _setPrototypeOf$k = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$k(o, p);
}
function _createSuper$i(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$k();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$i(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$i(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$i(this, result);
  };
}
function _possibleConstructorReturn$i(self, call) {
  if (call && (_typeof$n(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$i(self);
}
function _assertThisInitialized$i(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$k() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$i(o) {
  _getPrototypeOf$i = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$i(o);
}
var Walkontable = /* @__PURE__ */ function(_CoreAbstract) {
  _inherits$i(Walkontable2, _CoreAbstract);
  var _super = _createSuper$i(Walkontable2);
  function Walkontable2(table, settings) {
    var _this;
    _classCallCheck$I(this, Walkontable2);
    _this = _super.call(this, table, new Settings(settings));
    var facadeGetter = _this.wtSettings.getSetting("facade", _assertThisInitialized$i(_this));
    _this.wtTable = new MasterTable(_this.getTableDao(), facadeGetter, _this.domBindings, _this.wtSettings);
    _this.wtViewport = new Viewport(_this.getViewportDao(), _this.domBindings, _this.wtSettings, _this.eventManager, _this.wtTable);
    _this.selections = _this.wtSettings.getSetting("selections");
    _this.wtEvent = new Event(facadeGetter, _this.domBindings, _this.wtSettings, _this.eventManager, _this.wtTable, _this.selections);
    _this.wtOverlays = new Overlays(_assertThisInitialized$i(_this), facadeGetter, _this.domBindings, _this.wtSettings, _this.eventManager, _this.wtTable);
    _this.exportSettingsAsClassNames();
    _this.findOriginalHeaders();
    return _this;
  }
  _createClass$I(Walkontable2, [{
    key: "exportSettingsAsClassNames",
    value: function exportSettingsAsClassNames() {
      var _this2 = this;
      var toExport = {
        rowHeaders: "htRowHeaders",
        columnHeaders: "htColumnHeaders"
      };
      var allClassNames = [];
      var newClassNames = [];
      objectEach(toExport, function(className, key) {
        if (_this2.wtSettings.getSetting(key).length) {
          newClassNames.push(className);
        }
        allClassNames.push(className);
      });
      removeClass(this.wtTable.wtRootElement.parentNode, allClassNames);
      addClass(this.wtTable.wtRootElement.parentNode, newClassNames);
    }
  }, {
    key: "getViewportDao",
    value: function getViewportDao() {
      var wot = this;
      return {
        get wot() {
          return wot;
        },
        get topOverlayTrimmingContainer() {
          return wot.wtOverlays.topOverlay.trimmingContainer;
        },
        get inlineStartOverlayTrimmingContainer() {
          return wot.wtOverlays.inlineStartOverlay.trimmingContainer;
        },
        get topScrollPosition() {
          return wot.wtOverlays.topOverlay.getScrollPosition();
        },
        get topParentOffset() {
          return wot.wtOverlays.topOverlay.getTableParentOffset();
        },
        get inlineStartScrollPosition() {
          return wot.wtOverlays.inlineStartOverlay.getScrollPosition();
        },
        get inlineStartParentOffset() {
          return wot.wtOverlays.inlineStartOverlay.getTableParentOffset();
        },
        get topOverlay() {
          return wot.wtOverlays.topOverlay;
        },
        get inlineStartOverlay() {
          return wot.wtOverlays.inlineStartOverlay;
        },
        get bottomOverlay() {
          return wot.wtOverlays.bottomOverlay;
        }
      };
    }
  }]);
  return Walkontable2;
}(CoreAbstract);

function _classCallCheck$J(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$J(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$J(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$J(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$J(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var WalkontableFacade = /* @__PURE__ */ function() {
  function WalkontableFacade2(settingsOrInstance) {
    _classCallCheck$J(this, WalkontableFacade2);
    if (settingsOrInstance instanceof CoreAbstract) {
      this._wot = settingsOrInstance;
    } else {
      this._initFromSettings(settingsOrInstance);
    }
  }
  _createClass$J(WalkontableFacade2, [{
    key: "_initFromSettings",
    value: function _initFromSettings(settings) {
      settings.facade = function(instance) {
        var facade = new WalkontableFacade2(instance);
        return function() {
          return facade;
        };
      };
      this._wot = new Walkontable(settings.table, settings);
    }
  }, {
    key: "guid",
    get: function get() {
      return this._wot.guid;
    }
  }, {
    key: "rootDocument",
    get: function get() {
      return this._wot.domBindings.rootDocument;
    }
  }, {
    key: "rootWindow",
    get: function get() {
      return this._wot.domBindings.rootWindow;
    }
  }, {
    key: "wtSettings",
    get: function get() {
      return this._wot.wtSettings;
    }
  }, {
    key: "cloneSource",
    get: function get() {
      return this._wot.cloneSource;
    }
  }, {
    key: "cloneOverlay",
    get: function get() {
      return this._wot.cloneOverlay;
    }
  }, {
    key: "selections",
    get: function get() {
      return this._wot.selections;
    }
  }, {
    key: "wtViewport",
    get: function get() {
      return this._wot.wtViewport;
    }
  }, {
    key: "wtOverlays",
    get: function get() {
      return this._wot.wtOverlays;
    }
  }, {
    key: "wtTable",
    get: function get() {
      return this._wot.wtTable;
    }
  }, {
    key: "wtEvent",
    get: function get() {
      return this._wot.wtEvent;
    }
  }, {
    key: "wtScroll",
    get: function get() {
      return this._wot.wtScroll;
    }
  }, {
    key: "drawn",
    get: function get() {
      return this._wot.drawn;
    },
    set: function set(value) {
      this._wot.drawn = value;
    }
  }, {
    key: "drawInterrupted",
    get: function get() {
      return this._wot.drawInterrupted;
    },
    set: function set(value) {
      this._wot.drawInterrupted = value;
    }
  }, {
    key: "lastMouseOver",
    get: function get() {
      return this._wot.lastMouseOver;
    },
    set: function set(value) {
      this._wot.lastMouseOver = value;
    }
  }, {
    key: "momentumScrolling",
    get: function get() {
      return this._wot.momentumScrolling;
    },
    set: function set(value) {
      this._wot.momentumScrolling = value;
    }
  }, {
    key: "touchApplied",
    get: function get() {
      return this._wot.touchApplied;
    },
    set: function set(value) {
      this._wot.touchApplied = value;
    }
  }, {
    key: "domBindings",
    get: function get() {
      return this._wot.domBindings;
    }
  }, {
    key: "eventListeners",
    get: function get() {
      return this._wot.eventListeners;
    },
    set: function set(value) {
      this._wot.eventListeners = value;
    }
  }, {
    key: "eventManager",
    get: function get() {
      return this._wot.eventManager;
    }
  }, {
    key: "createCellCoords",
    value: function createCellCoords(row, column) {
      return this._wot.createCellCoords(row, column);
    }
  }, {
    key: "createCellRange",
    value: function createCellRange(highlight, from, to) {
      return this._wot.createCellRange(highlight, from, to);
    }
  }, {
    key: "draw",
    value: function draw() {
      var fastDraw = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      this._wot.draw(fastDraw);
      return this;
    }
  }, {
    key: "getCell",
    value: function getCell(coords) {
      var topmost = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      return this._wot.getCell(coords, topmost);
    }
  }, {
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      return this._wot.scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft);
    }
  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      return this._wot.scrollViewportHorizontally(column, snapToRight, snapToLeft);
    }
  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      return this._wot.scrollViewportVertically(row, snapToTop, snapToBottom);
    }
  }, {
    key: "getViewport",
    value: function getViewport() {
      return this._wot.getViewport();
    }
  }, {
    key: "getOverlayName",
    value: function getOverlayName() {
      return this._wot.cloneOverlay ? this._wot.cloneOverlay.type : "master";
    }
  }, {
    key: "exportSettingsAsClassNames",
    value: function exportSettingsAsClassNames() {
      return this._wot.exportSettingsAsClassNames();
    }
  }, {
    key: "update",
    value: function update(settings, value) {
      this._wot.wtSettings.update(settings, value);
      return this;
    }
  }, {
    key: "getSetting",
    value: function getSetting(key, param1, param2, param3, param4) {
      return this._wot.wtSettings.getSetting(key, param1, param2, param3, param4);
    }
  }, {
    key: "hasSetting",
    value: function hasSetting(key) {
      return this._wot.wtSettings.hasSetting(key);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._wot.destroy();
    }
  }]);
  return WalkontableFacade2;
}();

function _slicedToArray$5(arr, i) {
  return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$b(arr, i) || _nonIterableRest$5();
}
function _nonIterableRest$5() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$b(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$b(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$b(o, minLen);
}
function _arrayLikeToArray$b(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$5(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$5(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _classCallCheck$K(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$K(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$K(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$K(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$K(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Border = /* @__PURE__ */ function() {
  function Border2(wotInstance, settings) {
    _classCallCheck$K(this, Border2);
    if (!settings) {
      return;
    }
    this.eventManager = wotInstance.eventManager;
    this.instance = wotInstance;
    this.wot = wotInstance;
    this.settings = settings;
    this.mouseDown = false;
    this.main = null;
    this.top = null;
    this.bottom = null;
    this.start = null;
    this.end = null;
    this.topStyle = null;
    this.bottomStyle = null;
    this.startStyle = null;
    this.endStyle = null;
    this.cornerDefaultStyle = {
      width: "6px",
      height: "6px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#FFF"
    };
    this.cornerCenterPointOffset = -(parseInt(this.cornerDefaultStyle.width, 10) / 2);
    this.corner = null;
    this.cornerStyle = null;
    this.createBorders(settings);
    this.registerListeners();
  }
  _createClass$K(Border2, [{
    key: "registerListeners",
    value: function registerListeners() {
      var _this2 = this;
      var documentBody = this.wot.rootDocument.body;
      this.eventManager.addEventListener(documentBody, "mousedown", function() {
        return _this2.onMouseDown();
      });
      this.eventManager.addEventListener(documentBody, "mouseup", function() {
        return _this2.onMouseUp();
      });
      var _loop = function _loop2(c2, len2) {
        var element = _this2.main.childNodes[c2];
        _this2.eventManager.addEventListener(element, "mouseenter", function(event) {
          return _this2.onMouseEnter(event, _this2.main.childNodes[c2]);
        });
      };
      for (var c = 0, len = this.main.childNodes.length; c < len; c++) {
        _loop(c);
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown() {
      this.mouseDown = true;
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mouseDown = false;
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(event, parentElement) {
      if (!this.mouseDown || !this.wot.getSetting("hideBorderOnMouseDownOver")) {
        return;
      }
      event.preventDefault();
      stopImmediatePropagation(event);
      var _this = this;
      var documentBody = this.wot.rootDocument.body;
      var bounds = parentElement.getBoundingClientRect();
      parentElement.style.display = "none";
      function isOutside(mouseEvent) {
        if (mouseEvent.clientY < Math.floor(bounds.top)) {
          return true;
        }
        if (mouseEvent.clientY > Math.ceil(bounds.top + bounds.height)) {
          return true;
        }
        if (mouseEvent.clientX < Math.floor(bounds.left)) {
          return true;
        }
        if (mouseEvent.clientX > Math.ceil(bounds.left + bounds.width)) {
          return true;
        }
      }
      function handler(handlerEvent) {
        if (isOutside(handlerEvent)) {
          _this.eventManager.removeEventListener(documentBody, "mousemove", handler);
          parentElement.style.display = "block";
        }
      }
      this.eventManager.addEventListener(documentBody, "mousemove", handler);
    }
  }, {
    key: "createBorders",
    value: function createBorders(settings) {
      var rootDocument = this.wot.rootDocument;
      this.main = rootDocument.createElement("div");
      var borderDivs = ["top", "start", "bottom", "end", "corner"];
      var style = this.main.style;
      style.position = "absolute";
      style.top = 0;
      style.left = 0;
      for (var i = 0; i < 5; i++) {
        var position = borderDivs[i];
        var div = rootDocument.createElement("div");
        div.className = "wtBorder ".concat(this.settings.className || "");
        if (this.settings[position] && this.settings[position].hide) {
          div.className += " hidden";
        }
        style = div.style;
        style.backgroundColor = this.settings[position] && this.settings[position].color ? this.settings[position].color : settings.border.color;
        style.height = this.settings[position] && this.settings[position].width ? "".concat(this.settings[position].width, "px") : "".concat(settings.border.width, "px");
        style.width = this.settings[position] && this.settings[position].width ? "".concat(this.settings[position].width, "px") : "".concat(settings.border.width, "px");
        this.main.appendChild(div);
      }
      this.top = this.main.childNodes[0];
      this.start = this.main.childNodes[1];
      this.bottom = this.main.childNodes[2];
      this.end = this.main.childNodes[3];
      this.topStyle = this.top.style;
      this.startStyle = this.start.style;
      this.bottomStyle = this.bottom.style;
      this.endStyle = this.end.style;
      this.corner = this.main.childNodes[4];
      this.corner.className += " corner";
      this.cornerStyle = this.corner.style;
      this.cornerStyle.width = this.cornerDefaultStyle.width;
      this.cornerStyle.height = this.cornerDefaultStyle.height;
      this.cornerStyle.border = [this.cornerDefaultStyle.borderWidth, this.cornerDefaultStyle.borderStyle, this.cornerDefaultStyle.borderColor].join(" ");
      if (isMobileBrowser()) {
        this.createMultipleSelectorHandles();
      }
      this.disappear();
      var wtTable = this.wot.wtTable;
      var bordersHolder = wtTable.bordersHolder;
      if (!bordersHolder) {
        bordersHolder = rootDocument.createElement("div");
        bordersHolder.className = "htBorders";
        wtTable.bordersHolder = bordersHolder;
        wtTable.spreader.appendChild(bordersHolder);
      }
      bordersHolder.appendChild(this.main);
    }
  }, {
    key: "createMultipleSelectorHandles",
    value: function createMultipleSelectorHandles() {
      var _this3 = this;
      var rootDocument = this.wot.rootDocument;
      this.selectionHandles = {
        top: rootDocument.createElement("DIV"),
        topHitArea: rootDocument.createElement("DIV"),
        bottom: rootDocument.createElement("DIV"),
        bottomHitArea: rootDocument.createElement("DIV")
      };
      var width = 10;
      var hitAreaWidth = 40;
      this.selectionHandles.top.className = "topSelectionHandle topLeftSelectionHandle";
      this.selectionHandles.topHitArea.className = "topSelectionHandle-HitArea topLeftSelectionHandle-HitArea";
      this.selectionHandles.bottom.className = "bottomSelectionHandle bottomRightSelectionHandle";
      this.selectionHandles.bottomHitArea.className = "bottomSelectionHandle-HitArea bottomRightSelectionHandle-HitArea";
      this.selectionHandles.styles = {
        top: this.selectionHandles.top.style,
        topHitArea: this.selectionHandles.topHitArea.style,
        bottom: this.selectionHandles.bottom.style,
        bottomHitArea: this.selectionHandles.bottomHitArea.style
      };
      var hitAreaStyle = {
        position: "absolute",
        height: "".concat(hitAreaWidth, "px"),
        width: "".concat(hitAreaWidth, "px"),
        "border-radius": "".concat(parseInt(hitAreaWidth / 1.5, 10), "px")
      };
      objectEach(hitAreaStyle, function(value, key) {
        _this3.selectionHandles.styles.bottomHitArea[key] = value;
        _this3.selectionHandles.styles.topHitArea[key] = value;
      });
      var handleStyle = {
        position: "absolute",
        height: "".concat(width, "px"),
        width: "".concat(width, "px"),
        "border-radius": "".concat(parseInt(width / 1.5, 10), "px"),
        background: "#F5F5FF",
        border: "1px solid #4285c8"
      };
      objectEach(handleStyle, function(value, key) {
        _this3.selectionHandles.styles.bottom[key] = value;
        _this3.selectionHandles.styles.top[key] = value;
      });
      this.main.appendChild(this.selectionHandles.top);
      this.main.appendChild(this.selectionHandles.bottom);
      this.main.appendChild(this.selectionHandles.topHitArea);
      this.main.appendChild(this.selectionHandles.bottomHitArea);
    }
  }, {
    key: "isPartRange",
    value: function isPartRange(row, col) {
      var areaSelection = this.wot.selections.createOrGetArea();
      if (areaSelection.cellRange) {
        if (row !== areaSelection.cellRange.to.row || col !== areaSelection.cellRange.to.col) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "updateMultipleSelectionHandlesPosition",
    value: function updateMultipleSelectionHandlesPosition(row, col, top, left, width, height) {
      var isRtl = this.wot.wtSettings.getSetting("rtlMode");
      var inlinePosProperty = isRtl ? "right" : "left";
      var handleWidth = parseInt(this.selectionHandles.styles.top.width, 10);
      var hitAreaWidth = parseInt(this.selectionHandles.styles.topHitArea.width, 10);
      this.selectionHandles.styles.top.top = "".concat(parseInt(top - handleWidth - 1, 10), "px");
      this.selectionHandles.styles.top[inlinePosProperty] = "".concat(parseInt(left - handleWidth - 1, 10), "px");
      this.selectionHandles.styles.topHitArea.top = "".concat(parseInt(top - hitAreaWidth / 4 * 3, 10), "px");
      this.selectionHandles.styles.topHitArea[inlinePosProperty] = "".concat(parseInt(left - hitAreaWidth / 4 * 3, 10), "px");
      this.selectionHandles.styles.bottom.top = "".concat(parseInt(top + height, 10), "px");
      this.selectionHandles.styles.bottom[inlinePosProperty] = "".concat(parseInt(left + width, 10), "px");
      this.selectionHandles.styles.bottomHitArea.top = "".concat(parseInt(top + height - hitAreaWidth / 4, 10), "px");
      this.selectionHandles.styles.bottomHitArea[inlinePosProperty] = "".concat(parseInt(left + width - hitAreaWidth / 4, 10), "px");
      if (this.settings.border.cornerVisible && this.settings.border.cornerVisible()) {
        this.selectionHandles.styles.top.display = "block";
        this.selectionHandles.styles.topHitArea.display = "block";
        if (this.isPartRange(row, col)) {
          this.selectionHandles.styles.bottom.display = "none";
          this.selectionHandles.styles.bottomHitArea.display = "none";
        } else {
          this.selectionHandles.styles.bottom.display = "block";
          this.selectionHandles.styles.bottomHitArea.display = "block";
        }
      } else {
        this.selectionHandles.styles.top.display = "none";
        this.selectionHandles.styles.bottom.display = "none";
        this.selectionHandles.styles.topHitArea.display = "none";
        this.selectionHandles.styles.bottomHitArea.display = "none";
      }
      if (row === this.wot.wtSettings.getSetting("fixedRowsTop") || col === this.wot.wtSettings.getSetting("fixedColumnsStart")) {
        this.selectionHandles.styles.top.zIndex = "9999";
        this.selectionHandles.styles.topHitArea.zIndex = "9999";
      } else {
        this.selectionHandles.styles.top.zIndex = "";
        this.selectionHandles.styles.topHitArea.zIndex = "";
      }
    }
  }, {
    key: "appear",
    value: function appear(corners) {
      if (this.disabled) {
        return;
      }
      var _this$wot = this.wot, wtTable = _this$wot.wtTable, rootDocument = _this$wot.rootDocument, rootWindow = _this$wot.rootWindow;
      var fromRow;
      var toRow;
      var fromColumn;
      var toColumn;
      var rowHeader;
      var columnHeader;
      var rowsCount = wtTable.getRenderedRowsCount();
      for (var i = 0; i < rowsCount; i += 1) {
        var s = wtTable.rowFilter.renderedToSource(i);
        if (s >= corners[0] && s <= corners[2]) {
          fromRow = s;
          rowHeader = corners[0];
          break;
        }
      }
      for (var _i = rowsCount - 1; _i >= 0; _i -= 1) {
        var _s = wtTable.rowFilter.renderedToSource(_i);
        if (_s >= corners[0] && _s <= corners[2]) {
          toRow = _s;
          break;
        }
      }
      var columnsCount = wtTable.getRenderedColumnsCount();
      for (var _i2 = 0; _i2 < columnsCount; _i2 += 1) {
        var _s2 = wtTable.columnFilter.renderedToSource(_i2);
        if (_s2 >= corners[1] && _s2 <= corners[3]) {
          fromColumn = _s2;
          columnHeader = corners[1];
          break;
        }
      }
      for (var _i3 = columnsCount - 1; _i3 >= 0; _i3 -= 1) {
        var _s3 = wtTable.columnFilter.renderedToSource(_i3);
        if (_s3 >= corners[1] && _s3 <= corners[3]) {
          toColumn = _s3;
          break;
        }
      }
      if (fromRow === void 0 || fromColumn === void 0) {
        this.disappear();
        return;
      }
      var fromTD = wtTable.getCell(this.wot.createCellCoords(fromRow, fromColumn));
      var isMultiple = fromRow !== toRow || fromColumn !== toColumn;
      var toTD = isMultiple ? wtTable.getCell(this.wot.createCellCoords(toRow, toColumn)) : fromTD;
      var fromOffset = offset(fromTD);
      var toOffset = isMultiple ? offset(toTD) : fromOffset;
      var containerOffset = offset(wtTable.TABLE);
      var containerWidth = outerWidth(wtTable.TABLE);
      var minTop = fromOffset.top;
      var minLeft = fromOffset.left;
      var isRtl = this.wot.wtSettings.getSetting("rtlMode");
      var inlineStartPos = 0;
      var width = 0;
      if (isRtl) {
        var fromWidth = outerWidth(fromTD);
        var gridRightPos = rootWindow.innerWidth - containerOffset.left - containerWidth;
        width = minLeft + fromWidth - toOffset.left;
        inlineStartPos = rootWindow.innerWidth - minLeft - fromWidth - gridRightPos - 1;
      } else {
        width = toOffset.left + outerWidth(toTD) - minLeft;
        inlineStartPos = minLeft - containerOffset.left - 1;
      }
      if (this.isEntireColumnSelected(fromRow, toRow)) {
        var modifiedValues = this.getDimensionsFromHeader("columns", fromColumn, toColumn, rowHeader, containerOffset);
        var fromTH = null;
        if (modifiedValues) {
          var _modifiedValues = _slicedToArray$5(modifiedValues, 3);
          fromTH = _modifiedValues[0];
          inlineStartPos = _modifiedValues[1];
          width = _modifiedValues[2];
        }
        if (fromTH) {
          fromTD = fromTH;
        }
      }
      var top = minTop - containerOffset.top - 1;
      var height = toOffset.top + outerHeight(toTD) - minTop;
      if (this.isEntireRowSelected(fromColumn, toColumn)) {
        var _modifiedValues2 = this.getDimensionsFromHeader("rows", fromRow, toRow, columnHeader, containerOffset);
        var _fromTH = null;
        if (_modifiedValues2) {
          var _modifiedValues3 = _slicedToArray$5(_modifiedValues2, 3);
          _fromTH = _modifiedValues3[0];
          top = _modifiedValues3[1];
          height = _modifiedValues3[2];
        }
        if (_fromTH) {
          fromTD = _fromTH;
        }
      }
      var style = getComputedStyle(fromTD, rootWindow);
      if (parseInt(style.borderTopWidth, 10) > 0) {
        top += 1;
        height = height > 0 ? height - 1 : 0;
      }
      if (parseInt(style[isRtl ? "borderRightWidth" : "borderLeftWidth"], 10) > 0) {
        inlineStartPos += 1;
        width = width > 0 ? width - 1 : 0;
      }
      var inlinePosProperty = isRtl ? "right" : "left";
      this.topStyle.top = "".concat(top, "px");
      this.topStyle[inlinePosProperty] = "".concat(inlineStartPos, "px");
      this.topStyle.width = "".concat(width, "px");
      this.topStyle.display = "block";
      this.startStyle.top = "".concat(top, "px");
      this.startStyle[inlinePosProperty] = "".concat(inlineStartPos, "px");
      this.startStyle.height = "".concat(height, "px");
      this.startStyle.display = "block";
      var delta = Math.floor(this.settings.border.width / 2);
      this.bottomStyle.top = "".concat(top + height - delta, "px");
      this.bottomStyle[inlinePosProperty] = "".concat(inlineStartPos, "px");
      this.bottomStyle.width = "".concat(width, "px");
      this.bottomStyle.display = "block";
      this.endStyle.top = "".concat(top, "px");
      this.endStyle[inlinePosProperty] = "".concat(inlineStartPos + width - delta, "px");
      this.endStyle.height = "".concat(height + 1, "px");
      this.endStyle.display = "block";
      var cornerVisibleSetting = this.settings.border.cornerVisible;
      cornerVisibleSetting = typeof cornerVisibleSetting === "function" ? cornerVisibleSetting(this.settings.layerLevel) : cornerVisibleSetting;
      var hookResult = this.wot.getSetting("onModifyGetCellCoords", toRow, toColumn);
      var checkRow = toRow, checkCol = toColumn;
      if (hookResult && Array.isArray(hookResult)) {
        var _hookResult = _slicedToArray$5(hookResult, 4);
        checkRow = _hookResult[2];
        checkCol = _hookResult[3];
      }
      if (isMobileBrowser() || !cornerVisibleSetting || this.isPartRange(checkRow, checkCol)) {
        this.cornerStyle.display = "none";
      } else {
        this.cornerStyle.top = "".concat(top + height + this.cornerCenterPointOffset - 1, "px");
        this.cornerStyle[inlinePosProperty] = "".concat(inlineStartPos + width + this.cornerCenterPointOffset - 1, "px");
        this.cornerStyle.borderRightWidth = this.cornerDefaultStyle.borderWidth;
        this.cornerStyle.width = this.cornerDefaultStyle.width;
        this.cornerStyle.display = "none";
        var trimmingContainer = getTrimmingContainer(wtTable.TABLE);
        var trimToWindow = trimmingContainer === rootWindow;
        if (trimToWindow) {
          trimmingContainer = rootDocument.documentElement;
        }
        if (toColumn === this.wot.getSetting("totalColumns") - 1) {
          var toTdOffsetLeft = trimToWindow ? toTD.getBoundingClientRect().left : toTD.offsetLeft;
          var cornerOverlappingContainer = false;
          var cornerEdge = 0;
          if (isRtl) {
            cornerEdge = toTdOffsetLeft - parseInt(this.cornerDefaultStyle.width, 10) / 2;
            cornerOverlappingContainer = cornerEdge < 0;
          } else {
            cornerEdge = toTdOffsetLeft + outerWidth(toTD) + parseInt(this.cornerDefaultStyle.width, 10) / 2;
            cornerOverlappingContainer = cornerEdge >= innerWidth(trimmingContainer);
          }
          if (cornerOverlappingContainer) {
            this.cornerStyle[inlinePosProperty] = "".concat(Math.floor(inlineStartPos + width + this.cornerCenterPointOffset - parseInt(this.cornerDefaultStyle.width, 10) / 2), "px");
            this.cornerStyle[isRtl ? "borderLeftWidth" : "borderRightWidth"] = 0;
          }
        }
        if (toRow === this.wot.getSetting("totalRows") - 1) {
          var toTdOffsetTop = trimToWindow ? toTD.getBoundingClientRect().top : toTD.offsetTop;
          var cornerBottomEdge = toTdOffsetTop + outerHeight(toTD) + parseInt(this.cornerDefaultStyle.height, 10) / 2;
          var _cornerOverlappingContainer = cornerBottomEdge >= innerHeight(trimmingContainer);
          if (_cornerOverlappingContainer) {
            this.cornerStyle.top = "".concat(Math.floor(top + height + this.cornerCenterPointOffset - parseInt(this.cornerDefaultStyle.height, 10) / 2), "px");
            this.cornerStyle.borderBottomWidth = 0;
          }
        }
        this.cornerStyle.display = "block";
      }
      if (isMobileBrowser()) {
        this.updateMultipleSelectionHandlesPosition(toRow, toColumn, top, inlineStartPos, width, height);
      }
    }
  }, {
    key: "isEntireColumnSelected",
    value: function isEntireColumnSelected(startRowIndex, endRowIndex) {
      return startRowIndex === this.wot.wtTable.getFirstRenderedRow() && endRowIndex === this.wot.wtTable.getLastRenderedRow();
    }
  }, {
    key: "isEntireRowSelected",
    value: function isEntireRowSelected(startColumnIndex, endColumnIndex) {
      return startColumnIndex === this.wot.wtTable.getFirstRenderedColumn() && endColumnIndex === this.wot.wtTable.getLastRenderedColumn();
    }
  }, {
    key: "getDimensionsFromHeader",
    value: function getDimensionsFromHeader(direction, fromIndex, toIndex, headerIndex, containerOffset) {
      var wtTable = this.wot.wtTable;
      var rootHotElement = wtTable.wtRootElement.parentNode;
      var getHeaderFn = null;
      var dimensionFn = null;
      var entireSelectionClassname = null;
      var index = null;
      var dimension = null;
      var dimensionProperty = null;
      var startHeader = null;
      var endHeader = null;
      switch (direction) {
        case "rows":
          getHeaderFn = function getHeaderFn2() {
            return wtTable.getRowHeader.apply(wtTable, arguments);
          };
          dimensionFn = function dimensionFn2() {
            return outerHeight.apply(void 0, arguments);
          };
          entireSelectionClassname = "ht__selection--rows";
          dimensionProperty = "top";
          break;
        case "columns":
          getHeaderFn = function getHeaderFn2() {
            return wtTable.getColumnHeader.apply(wtTable, arguments);
          };
          dimensionFn = function dimensionFn2() {
            return outerWidth.apply(void 0, arguments);
          };
          entireSelectionClassname = "ht__selection--columns";
          dimensionProperty = "left";
          break;
      }
      if (rootHotElement.classList.contains(entireSelectionClassname)) {
        var columnHeaderLevelCount = this.wot.getSetting("columnHeaders").length;
        startHeader = getHeaderFn(fromIndex, columnHeaderLevelCount - headerIndex);
        endHeader = getHeaderFn(toIndex, columnHeaderLevelCount - headerIndex);
        if (!startHeader || !endHeader) {
          return false;
        }
        var startHeaderOffset = offset(startHeader);
        var endOffset = offset(endHeader);
        if (startHeader && endHeader) {
          index = startHeaderOffset[dimensionProperty] - containerOffset[dimensionProperty] - 1;
          dimension = endOffset[dimensionProperty] + dimensionFn(endHeader) - startHeaderOffset[dimensionProperty];
        }
        return [startHeader, index, dimension];
      }
      return false;
    }
  }, {
    key: "changeBorderStyle",
    value: function changeBorderStyle(borderElement, border) {
      var style = this[borderElement].style;
      var borderStyle = border[borderElement];
      if (!borderStyle || borderStyle.hide) {
        addClass(this[borderElement], "hidden");
      } else {
        if (hasClass(this[borderElement], "hidden")) {
          removeClass(this[borderElement], "hidden");
        }
        style.backgroundColor = borderStyle.color;
        if (borderElement === "top" || borderElement === "bottom") {
          style.height = "".concat(borderStyle.width, "px");
        }
        if (borderElement === "start" || borderElement === "end") {
          style.width = "".concat(borderStyle.width, "px");
        }
      }
    }
  }, {
    key: "changeBorderToDefaultStyle",
    value: function changeBorderToDefaultStyle(position) {
      var defaultBorder = {
        width: 1,
        color: "#000"
      };
      var style = this[position].style;
      style.backgroundColor = defaultBorder.color;
      style.width = "".concat(defaultBorder.width, "px");
      style.height = "".concat(defaultBorder.width, "px");
    }
  }, {
    key: "toggleHiddenClass",
    value: function toggleHiddenClass(borderElement, remove) {
      this.changeBorderToDefaultStyle(borderElement);
      if (remove) {
        addClass(this[borderElement], "hidden");
      } else {
        removeClass(this[borderElement], "hidden");
      }
    }
  }, {
    key: "disappear",
    value: function disappear() {
      this.topStyle.display = "none";
      this.bottomStyle.display = "none";
      this.startStyle.display = "none";
      this.endStyle.display = "none";
      this.cornerStyle.display = "none";
      if (isMobileBrowser()) {
        this.selectionHandles.styles.top.display = "none";
        this.selectionHandles.styles.bottom.display = "none";
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventManager.destroyWithOwnEventsOnly();
      this.main.parentNode.removeChild(this.main);
    }
  }]);
  return Border2;
}();

function _slicedToArray$6(arr, i) {
  return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$c(arr, i) || _nonIterableRest$6();
}
function _nonIterableRest$6() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$c(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$c(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$c(o, minLen);
}
function _arrayLikeToArray$c(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$6(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$6(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _typeof$o(obj) {
  "@babel/helpers - typeof";
  return _typeof$o = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$o(obj);
}
function _classCallCheck$L(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$L(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$L(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$L(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$L(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Selection = /* @__PURE__ */ function() {
  function Selection2(settings, cellRange) {
    _classCallCheck$L(this, Selection2);
    this.settings = settings;
    this.cellRange = cellRange || null;
    this.instanceBorders = {};
    this.classNames = [this.settings.className];
    this.classNameGenerator = this.linearClassNameGenerator(this.settings.className, this.settings.layerLevel);
  }
  _createClass$L(Selection2, [{
    key: "getBorder",
    value: function getBorder(wotInstance) {
      if (!this.instanceBorders[wotInstance.guid]) {
        this.instanceBorders[wotInstance.guid] = new Border(wotInstance, this.settings);
      }
      return this.instanceBorders[wotInstance.guid];
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.cellRange === null;
    }
  }, {
    key: "add",
    value: function add(coords) {
      if (this.isEmpty()) {
        this.cellRange = this.settings.createCellRange(coords);
      } else {
        this.cellRange.expand(coords);
      }
      return this;
    }
  }, {
    key: "replace",
    value: function replace(oldCoords, newCoords) {
      if (!this.isEmpty()) {
        if (this.cellRange.from.isEqual(oldCoords)) {
          this.cellRange.from = newCoords;
          return true;
        }
        if (this.cellRange.to.isEqual(oldCoords)) {
          this.cellRange.to = newCoords;
          return true;
        }
      }
      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.cellRange = null;
      return this;
    }
  }, {
    key: "getCorners",
    value: function getCorners() {
      var topStart = this.cellRange.getOuterTopStartCorner();
      var bottomEnd = this.cellRange.getOuterBottomEndCorner();
      return [topStart.row, topStart.col, bottomEnd.row, bottomEnd.col];
    }
  }, {
    key: "addClassAtCoords",
    value: function addClassAtCoords(wotInstance, sourceRow, sourceColumn, className) {
      var markIntersections = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
      var TD = wotInstance.wtTable.getCell(this.settings.createCellCoords(sourceRow, sourceColumn));
      if (_typeof$o(TD) === "object") {
        var cellClassName = className;
        if (markIntersections) {
          cellClassName = this.classNameGenerator(TD);
          if (!this.classNames.includes(cellClassName)) {
            this.classNames.push(cellClassName);
          }
        }
        addClass(TD, cellClassName);
      }
      return this;
    }
  }, {
    key: "linearClassNameGenerator",
    value: function linearClassNameGenerator(baseClassName, layerLevelOwner) {
      return function calcClassName(element) {
        var previousIndex = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1;
        if (layerLevelOwner === 0 || previousIndex === 0) {
          return baseClassName;
        }
        var index = previousIndex >= 0 ? previousIndex : layerLevelOwner;
        var className = baseClassName;
        index -= 1;
        var previousClassName = index === 0 ? baseClassName : "".concat(baseClassName, "-").concat(index);
        if (hasClass(element, previousClassName)) {
          var currentLayer = index + 1;
          className = "".concat(baseClassName, "-").concat(currentLayer);
        } else {
          className = calcClassName(element, index);
        }
        return className;
      };
    }
  }, {
    key: "draw",
    value: function draw(wotInstance) {
      if (this.isEmpty()) {
        if (this.settings.border) {
          this.getBorder(wotInstance).disappear();
        }
        return;
      }
      var renderedRows = wotInstance.wtTable.getRenderedRowsCount();
      var renderedColumns = wotInstance.wtTable.getRenderedColumnsCount();
      var corners = this.getCorners();
      var _corners = _slicedToArray$6(corners, 4), topRow = _corners[0], topColumn = _corners[1], bottomRow = _corners[2], bottomColumn = _corners[3];
      var _this$settings = this.settings, highlightHeaderClassName = _this$settings.highlightHeaderClassName, highlightColumnClassName = _this$settings.highlightColumnClassName, highlightRowClassName = _this$settings.highlightRowClassName, highlightOnlyClosestHeader = _this$settings.highlightOnlyClosestHeader, selectionType = _this$settings.selectionType;
      var isHeaderSelectionType = selectionType === void 0 || ["active-header", "header"].includes(selectionType);
      if (isHeaderSelectionType && topColumn !== null && bottomColumn !== null) {
        var selectionColumnCursor = 0;
        for (var column = 0; column < renderedColumns; column += 1) {
          var sourceCol = wotInstance.wtTable.columnFilter.renderedToSource(column);
          if (sourceCol >= topColumn && sourceCol <= bottomColumn) {
            var THs = wotInstance.wtTable.getColumnHeaders(sourceCol);
            var closestHeaderLevel = THs.length - 1;
            if (highlightOnlyClosestHeader && THs.length > 1) {
              THs = [THs[closestHeaderLevel]];
            }
            for (var headerLevel = 0; headerLevel < THs.length; headerLevel += 1) {
              var newClasses = [];
              var TH = THs[headerLevel];
              if (highlightHeaderClassName) {
                newClasses.push(highlightHeaderClassName);
              }
              if (highlightColumnClassName) {
                newClasses.push(highlightColumnClassName);
              }
              headerLevel = highlightOnlyClosestHeader ? closestHeaderLevel : headerLevel;
              var newSourceCol = wotInstance.getSetting("onBeforeHighlightingColumnHeader", sourceCol, headerLevel, {
                selectionType,
                columnCursor: selectionColumnCursor,
                selectionWidth: bottomColumn - topColumn + 1,
                classNames: newClasses
              });
              if (newSourceCol !== sourceCol) {
                TH = wotInstance.wtTable.getColumnHeader(newSourceCol, headerLevel);
              }
              addClass(TH, newClasses);
            }
            selectionColumnCursor += 1;
          }
        }
      }
      if (topRow !== null && bottomRow !== null) {
        var selectionRowCursor = 0;
        for (var row = 0; row < renderedRows; row += 1) {
          var sourceRow = wotInstance.wtTable.rowFilter.renderedToSource(row);
          if (isHeaderSelectionType && sourceRow >= topRow && sourceRow <= bottomRow) {
            var _THs = wotInstance.wtTable.getRowHeaders(sourceRow);
            var _closestHeaderLevel = _THs.length - 1;
            if (highlightOnlyClosestHeader && _THs.length > 1) {
              _THs = [_THs[_closestHeaderLevel]];
            }
            for (var _headerLevel = 0; _headerLevel < _THs.length; _headerLevel += 1) {
              var _newClasses = [];
              var _TH = _THs[_headerLevel];
              if (highlightHeaderClassName) {
                _newClasses.push(highlightHeaderClassName);
              }
              if (highlightRowClassName) {
                _newClasses.push(highlightRowClassName);
              }
              _headerLevel = highlightOnlyClosestHeader ? _closestHeaderLevel : _headerLevel;
              var newSourceRow = wotInstance.getSetting("onBeforeHighlightingRowHeader", sourceRow, _headerLevel, {
                selectionType,
                rowCursor: selectionRowCursor,
                selectionHeight: bottomRow - topRow + 1,
                classNames: _newClasses
              });
              if (newSourceRow !== sourceRow) {
                _TH = wotInstance.wtTable.getRowHeader(newSourceRow, _headerLevel);
              }
              addClass(_TH, _newClasses);
            }
            selectionRowCursor += 1;
          }
          if (topColumn !== null && bottomColumn !== null) {
            for (var _column = 0; _column < renderedColumns; _column += 1) {
              var _sourceCol = wotInstance.wtTable.columnFilter.renderedToSource(_column);
              if (sourceRow >= topRow && sourceRow <= bottomRow && _sourceCol >= topColumn && _sourceCol <= bottomColumn) {
                if (this.settings.className) {
                  this.addClassAtCoords(wotInstance, sourceRow, _sourceCol, this.settings.className, this.settings.markIntersections);
                }
              } else if (sourceRow >= topRow && sourceRow <= bottomRow) {
                if (highlightRowClassName) {
                  this.addClassAtCoords(wotInstance, sourceRow, _sourceCol, highlightRowClassName);
                }
              } else if (_sourceCol >= topColumn && _sourceCol <= bottomColumn) {
                if (highlightColumnClassName) {
                  this.addClassAtCoords(wotInstance, sourceRow, _sourceCol, highlightColumnClassName);
                }
              }
              var additionalSelectionClass = wotInstance.getSetting("onAfterDrawSelection", sourceRow, _sourceCol, this.settings.layerLevel);
              if (typeof additionalSelectionClass === "string") {
                this.addClassAtCoords(wotInstance, sourceRow, _sourceCol, additionalSelectionClass);
              }
            }
          }
        }
      }
      wotInstance.getSetting("onBeforeDrawBorders", corners, this.settings.className);
      if (this.settings.border) {
        this.getBorder(wotInstance).appear(corners);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      Object.values(this.instanceBorders).forEach(function(border) {
        return border.destroy();
      });
    }
  }]);
  return Selection2;
}();

function mouseDown(_ref) {
  var isShiftKey = _ref.isShiftKey, isLeftClick = _ref.isLeftClick, isRightClick = _ref.isRightClick, coords = _ref.coords, selection = _ref.selection, controller = _ref.controller, cellCoordsFactory = _ref.cellCoordsFactory;
  var currentSelection = selection.isSelected() ? selection.getSelectedRange().current() : null;
  var selectedCorner = selection.isSelectedByCorner();
  var selectedRow = selection.isSelectedByRowHeader();
  if (isShiftKey && currentSelection) {
    if (coords.row >= 0 && coords.col >= 0 && !controller.cell) {
      selection.setRangeEnd(coords);
    } else if ((selectedCorner || selectedRow) && coords.row >= 0 && coords.col >= 0 && !controller.cell) {
      selection.setRangeEnd(cellCoordsFactory(coords.row, coords.col));
    } else if (selectedCorner && coords.row < 0 && !controller.column) {
      selection.setRangeEnd(cellCoordsFactory(currentSelection.to.row, coords.col));
    } else if (selectedRow && coords.col < 0 && !controller.row) {
      selection.setRangeEnd(cellCoordsFactory(coords.row, currentSelection.to.col));
    } else if ((!selectedCorner && !selectedRow && coords.col < 0 || selectedCorner && coords.col < 0) && !controller.row) {
      selection.selectRows(Math.max(currentSelection.from.row, 0), coords.row, coords.col);
    } else if ((!selectedCorner && !selectedRow && coords.row < 0 || selectedRow && coords.row < 0) && !controller.column) {
      selection.selectColumns(Math.max(currentSelection.from.col, 0), coords.col, coords.row);
    }
  } else {
    var allowRightClickSelection = !selection.inInSelection(coords);
    var performSelection = isLeftClick || isRightClick && allowRightClickSelection;
    if (coords.row < 0 && coords.col >= 0 && !controller.column) {
      if (performSelection) {
        selection.selectColumns(coords.col, coords.col, coords.row);
      }
    } else if (coords.col < 0 && coords.row >= 0 && !controller.row) {
      if (performSelection) {
        selection.selectRows(coords.row, coords.row, coords.col);
      }
    } else if (coords.col >= 0 && coords.row >= 0 && !controller.cell) {
      if (performSelection) {
        selection.setRangeStart(coords);
      }
    } else if (coords.col < 0 && coords.row < 0) {
      selection.selectAll(true, true);
    }
  }
}
function mouseOver(_ref2) {
  var isLeftClick = _ref2.isLeftClick, coords = _ref2.coords, selection = _ref2.selection, controller = _ref2.controller, cellCoordsFactory = _ref2.cellCoordsFactory;
  if (!isLeftClick) {
    return;
  }
  var selectedRow = selection.isSelectedByRowHeader();
  var selectedColumn = selection.isSelectedByColumnHeader();
  var countCols = selection.tableProps.countCols();
  var countRows = selection.tableProps.countRows();
  if (selectedColumn && !controller.column) {
    selection.setRangeEnd(cellCoordsFactory(countRows - 1, coords.col));
  } else if (selectedRow && !controller.row) {
    selection.setRangeEnd(cellCoordsFactory(coords.row, countCols - 1));
  } else if (!controller.cell) {
    selection.setRangeEnd(coords);
  }
}
var handlers = new Map([["mousedown", mouseDown], ["mouseover", mouseOver], ["touchstart", mouseDown]]);
function handleMouseEvent(event, _ref3) {
  var coords = _ref3.coords, selection = _ref3.selection, controller = _ref3.controller, cellCoordsFactory = _ref3.cellCoordsFactory;
  handlers.get(event.type)({
    coords,
    selection,
    controller,
    cellCoordsFactory,
    isShiftKey: event.shiftKey,
    isLeftClick: isLeftClick(event) || event.type === "touchstart",
    isRightClick: isRightClick(event)
  });
}

var holder = new WeakMap();
var rootInstanceSymbol = Symbol("rootInstance");
function registerAsRootInstance(object) {
  holder.set(object, true);
}
function hasValidParameter(rootSymbol) {
  return rootSymbol === rootInstanceSymbol;
}
function isRootInstance(object) {
  return holder.has(object);
}

function _slicedToArray$7(arr, i) {
  return _arrayWithHoles$7(arr) || _iterableToArrayLimit$7(arr, i) || _unsupportedIterableToArray$d(arr, i) || _nonIterableRest$7();
}
function _nonIterableRest$7() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit$7(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$7(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _toConsumableArray$a(arr) {
  return _arrayWithoutHoles$a(arr) || _iterableToArray$a(arr) || _unsupportedIterableToArray$d(arr) || _nonIterableSpread$a();
}
function _nonIterableSpread$a() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$d(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$d(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$d(o, minLen);
}
function _iterableToArray$a(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$a(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$d(arr);
}
function _arrayLikeToArray$d(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _classCallCheck$M(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$M(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$M(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$M(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$M(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var privatePool$3 = new WeakMap();
var TableView = /* @__PURE__ */ function() {
  function TableView2(instance) {
    _classCallCheck$M(this, TableView2);
    this.instance = instance;
    this.eventManager = new EventManager(instance);
    this.settings = instance.getSettings();
    this.THEAD = void 0;
    this.TBODY = void 0;
    this._wt = void 0;
    this.activeWt = void 0;
    this.postponedAdjustElementsSize = false;
    privatePool$3.set(this, {
      selectionMouseDown: false,
      mouseDown: void 0,
      table: void 0,
      lastWidth: 0,
      lastHeight: 0
    });
    this.createElements();
    this.registerEvents();
    this.initializeWalkontable();
  }
  _createClass$M(TableView2, [{
    key: "render",
    value: function render() {
      if (!this.instance.isRenderSuspended()) {
        this.instance.runHooks("beforeRender", this.instance.forceFullRender);
        if (this.postponedAdjustElementsSize) {
          this.postponedAdjustElementsSize = false;
          this.adjustElementsSize(true);
        }
        this._wt.draw(!this.instance.forceFullRender);
        this.instance.runHooks("afterRender", this.instance.forceFullRender);
        this.instance.forceFullRender = false;
        this.instance.renderCall = false;
      }
    }
  }, {
    key: "adjustElementsSize",
    value: function adjustElementsSize() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (this.instance.isRenderSuspended()) {
        this.postponedAdjustElementsSize = true;
      } else {
        this._wt.wtOverlays.adjustElementsSize(force);
      }
    }
  }, {
    key: "getCellAtCoords",
    value: function getCellAtCoords(coords, topmost) {
      var td = this._wt.getCell(coords, topmost);
      if (td < 0) {
        return null;
      }
      return td;
    }
  }, {
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      return this._wt.scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft);
    }
  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      return this._wt.scrollViewportHorizontally(column, snapToRight, snapToLeft);
    }
  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      return this._wt.scrollViewportVertically(row, snapToTop, snapToBottom);
    }
  }, {
    key: "createElements",
    value: function createElements() {
      var priv = privatePool$3.get(this);
      var _this$instance = this.instance, rootElement = _this$instance.rootElement, rootDocument = _this$instance.rootDocument;
      var originalStyle = rootElement.getAttribute("style");
      if (originalStyle) {
        rootElement.setAttribute("data-originalstyle", originalStyle);
      }
      addClass(rootElement, "handsontable");
      priv.table = rootDocument.createElement("TABLE");
      addClass(priv.table, "htCore");
      if (this.instance.getSettings().tableClassName) {
        addClass(priv.table, this.instance.getSettings().tableClassName);
      }
      this.THEAD = rootDocument.createElement("THEAD");
      priv.table.appendChild(this.THEAD);
      this.TBODY = rootDocument.createElement("TBODY");
      priv.table.appendChild(this.TBODY);
      this.instance.table = priv.table;
      this.instance.container.insertBefore(priv.table, this.instance.container.firstChild);
    }
  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;
      var priv = privatePool$3.get(this);
      var _this$instance2 = this.instance, rootElement = _this$instance2.rootElement, rootDocument = _this$instance2.rootDocument, selection = _this$instance2.selection;
      var documentElement = rootDocument.documentElement;
      this.eventManager.addEventListener(rootElement, "mousedown", function(event) {
        priv.selectionMouseDown = true;
        if (!_this.isTextSelectionAllowed(event.target)) {
          var rootWindow = _this.instance.rootWindow;
          clearTextSelection(rootWindow);
          event.preventDefault();
          rootWindow.focus();
        }
      });
      this.eventManager.addEventListener(rootElement, "mouseup", function() {
        priv.selectionMouseDown = false;
      });
      this.eventManager.addEventListener(rootElement, "mousemove", function(event) {
        if (priv.selectionMouseDown && !_this.isTextSelectionAllowed(event.target)) {
          if (_this.settings.fragmentSelection) {
            clearTextSelection(_this.instance.rootWindow);
          }
          event.preventDefault();
        }
      });
      this.eventManager.addEventListener(documentElement, "keyup", function(event) {
        if (selection.isInProgress() && !event.shiftKey) {
          selection.finish();
        }
      });
      this.eventManager.addEventListener(documentElement, "mouseup", function(event) {
        if (selection.isInProgress() && isLeftClick(event)) {
          selection.finish();
        }
        priv.mouseDown = false;
        if (isOutsideInput(rootDocument.activeElement) || !selection.isSelected() && !selection.isSelectedByAnyHeader() && !rootElement.contains(event.target) && !isRightClick(event)) {
          _this.instance.unlisten();
        }
      });
      this.eventManager.addEventListener(documentElement, "contextmenu", function(event) {
        if (selection.isInProgress() && isRightClick(event)) {
          selection.finish();
          priv.mouseDown = false;
        }
      });
      this.eventManager.addEventListener(documentElement, "touchend", function() {
        if (selection.isInProgress()) {
          selection.finish();
        }
        priv.mouseDown = false;
      });
      this.eventManager.addEventListener(documentElement, "mousedown", function(event) {
        var originalTarget = event.target;
        var eventX = event.x || event.clientX;
        var eventY = event.y || event.clientY;
        var next = event.target;
        if (priv.mouseDown || !rootElement || !_this.instance.view) {
          return;
        }
        var holder = _this.instance.view._wt.wtTable.holder;
        if (next === holder) {
          var scrollbarWidth = getScrollbarWidth(rootDocument);
          if (rootDocument.elementFromPoint(eventX + scrollbarWidth, eventY) !== holder || rootDocument.elementFromPoint(eventX, eventY + scrollbarWidth) !== holder) {
            return;
          }
        } else {
          while (next !== documentElement) {
            if (next === null) {
              if (event.isTargetWebComponent) {
                break;
              }
              return;
            }
            if (next === rootElement) {
              return;
            }
            next = next.parentNode;
          }
        }
        var outsideClickDeselects = typeof _this.settings.outsideClickDeselects === "function" ? _this.settings.outsideClickDeselects(originalTarget) : _this.settings.outsideClickDeselects;
        if (outsideClickDeselects) {
          _this.instance.deselectCell();
        } else {
          _this.instance.destroyEditor(false, false);
        }
      });
      this.eventManager.addEventListener(priv.table, "selectstart", function(event) {
        if (_this.settings.fragmentSelection || isInput(event.target)) {
          return;
        }
        event.preventDefault();
      });
    }
  }, {
    key: "translateFromRenderableToVisualCoords",
    value: function translateFromRenderableToVisualCoords(_ref) {
      var _this$instance3;
      var row = _ref.row, col = _ref.col;
      return (_this$instance3 = this.instance)._createCellCoords.apply(_this$instance3, _toConsumableArray$a(this.translateFromRenderableToVisualIndex(row, col)));
    }
  }, {
    key: "translateFromRenderableToVisualIndex",
    value: function translateFromRenderableToVisualIndex(renderableRow, renderableColumn) {
      var visualRow = renderableRow >= 0 ? this.instance.rowIndexMapper.getVisualFromRenderableIndex(renderableRow) : renderableRow;
      var visualColumn = renderableColumn >= 0 ? this.instance.columnIndexMapper.getVisualFromRenderableIndex(renderableColumn) : renderableColumn;
      if (visualRow === null) {
        visualRow = renderableRow;
      }
      if (visualColumn === null) {
        visualColumn = renderableColumn;
      }
      return [visualRow, visualColumn];
    }
  }, {
    key: "countRenderableIndexes",
    value: function countRenderableIndexes(indexMapper, maxElements) {
      var consideredElements = Math.min(indexMapper.getNotTrimmedIndexesLength(), maxElements);
      var firstNotHiddenIndex = indexMapper.getFirstNotHiddenIndex(consideredElements - 1, -1);
      if (firstNotHiddenIndex === null) {
        return 0;
      }
      return indexMapper.getRenderableFromVisualIndex(firstNotHiddenIndex) + 1;
    }
  }, {
    key: "countRenderableColumns",
    value: function countRenderableColumns() {
      return this.countRenderableIndexes(this.instance.columnIndexMapper, this.settings.maxCols);
    }
  }, {
    key: "countRenderableRows",
    value: function countRenderableRows() {
      return this.countRenderableIndexes(this.instance.rowIndexMapper, this.settings.maxRows);
    }
  }, {
    key: "countNotHiddenRowIndexes",
    value: function countNotHiddenRowIndexes(visualIndex, incrementBy) {
      return this.countNotHiddenIndexes(visualIndex, incrementBy, this.instance.rowIndexMapper, this.countRenderableRows());
    }
  }, {
    key: "countNotHiddenColumnIndexes",
    value: function countNotHiddenColumnIndexes(visualIndex, incrementBy) {
      return this.countNotHiddenIndexes(visualIndex, incrementBy, this.instance.columnIndexMapper, this.countRenderableColumns());
    }
  }, {
    key: "countNotHiddenIndexes",
    value: function countNotHiddenIndexes(visualIndex, incrementBy, indexMapper, renderableIndexesCount) {
      if (isNaN(visualIndex) || visualIndex < 0) {
        return 0;
      }
      var firstVisibleIndex = indexMapper.getFirstNotHiddenIndex(visualIndex, incrementBy);
      var renderableIndex = indexMapper.getRenderableFromVisualIndex(firstVisibleIndex);
      if (!Number.isInteger(renderableIndex)) {
        return 0;
      }
      var notHiddenIndexes = 0;
      if (incrementBy < 0) {
        notHiddenIndexes = renderableIndex + 1;
      } else if (incrementBy > 0) {
        notHiddenIndexes = renderableIndexesCount - renderableIndex;
      }
      return notHiddenIndexes;
    }
  }, {
    key: "countNotHiddenFixedColumnsStart",
    value: function countNotHiddenFixedColumnsStart() {
      var countCols = this.instance.countCols();
      var visualFixedColumnsStart = Math.min(parseInt(this.settings.fixedColumnsStart, 10), countCols) - 1;
      return this.countNotHiddenColumnIndexes(visualFixedColumnsStart, -1);
    }
  }, {
    key: "countNotHiddenFixedRowsTop",
    value: function countNotHiddenFixedRowsTop() {
      var countRows = this.instance.countRows();
      var visualFixedRowsTop = Math.min(parseInt(this.settings.fixedRowsTop, 10), countRows) - 1;
      return this.countNotHiddenRowIndexes(visualFixedRowsTop, -1);
    }
  }, {
    key: "countNotHiddenFixedRowsBottom",
    value: function countNotHiddenFixedRowsBottom() {
      var countRows = this.instance.countRows();
      var visualFixedRowsBottom = Math.max(countRows - parseInt(this.settings.fixedRowsBottom, 10), 0);
      return this.countNotHiddenRowIndexes(visualFixedRowsBottom, 1);
    }
  }, {
    key: "isMainTableNotFullyCoveredByOverlays",
    value: function isMainTableNotFullyCoveredByOverlays() {
      var fixedAllRows = this.countNotHiddenFixedRowsTop() + this.countNotHiddenFixedRowsBottom();
      var fixedAllColumns = this.countNotHiddenFixedColumnsStart();
      return this.instance.countRenderedRows() > fixedAllRows && this.instance.countRenderedCols() > fixedAllColumns;
    }
  }, {
    key: "initializeWalkontable",
    value: function initializeWalkontable() {
      var _this2 = this;
      var priv = privatePool$3.get(this);
      var walkontableConfig = {
        rtlMode: this.instance.isRtl(),
        externalRowCalculator: this.instance.getPlugin("autoRowSize") && this.instance.getPlugin("autoRowSize").isEnabled(),
        table: priv.table,
        isDataViewInstance: function isDataViewInstance() {
          return isRootInstance(_this2.instance);
        },
        preventOverflow: function preventOverflow() {
          return _this2.settings.preventOverflow;
        },
        preventWheel: function preventWheel() {
          return _this2.settings.preventWheel;
        },
        stretchH: function stretchH() {
          return _this2.settings.stretchH;
        },
        data: function data(renderableRow, renderableColumn) {
          var _this2$instance;
          return (_this2$instance = _this2.instance).getDataAtCell.apply(_this2$instance, _toConsumableArray$a(_this2.translateFromRenderableToVisualIndex(renderableRow, renderableColumn)));
        },
        totalRows: function totalRows() {
          return _this2.countRenderableRows();
        },
        totalColumns: function totalColumns() {
          return _this2.countRenderableColumns();
        },
        fixedColumnsStart: function fixedColumnsStart() {
          return _this2.countNotHiddenFixedColumnsStart();
        },
        fixedRowsTop: function fixedRowsTop() {
          return _this2.countNotHiddenFixedRowsTop();
        },
        fixedRowsBottom: function fixedRowsBottom() {
          return _this2.countNotHiddenFixedRowsBottom();
        },
        shouldRenderInlineStartOverlay: function shouldRenderInlineStartOverlay() {
          return _this2.settings.fixedColumnsStart > 0 || walkontableConfig.rowHeaders().length > 0;
        },
        shouldRenderTopOverlay: function shouldRenderTopOverlay() {
          return _this2.settings.fixedRowsTop > 0 || walkontableConfig.columnHeaders().length > 0;
        },
        shouldRenderBottomOverlay: function shouldRenderBottomOverlay() {
          return _this2.settings.fixedRowsBottom > 0;
        },
        minSpareRows: function minSpareRows() {
          return _this2.settings.minSpareRows;
        },
        renderAllRows: this.settings.renderAllRows,
        rowHeaders: function rowHeaders() {
          var headerRenderers = [];
          if (_this2.instance.hasRowHeaders()) {
            headerRenderers.push(function(renderableRowIndex, TH) {
              var visualRowIndex = renderableRowIndex >= 0 ? _this2.instance.rowIndexMapper.getVisualFromRenderableIndex(renderableRowIndex) : renderableRowIndex;
              _this2.appendRowHeader(visualRowIndex, TH);
            });
          }
          _this2.instance.runHooks("afterGetRowHeaderRenderers", headerRenderers);
          return headerRenderers;
        },
        columnHeaders: function columnHeaders() {
          var headerRenderers = [];
          if (_this2.instance.hasColHeaders()) {
            headerRenderers.push(function(renderedColumnIndex, TH) {
              var visualColumnsIndex = renderedColumnIndex >= 0 ? _this2.instance.columnIndexMapper.getVisualFromRenderableIndex(renderedColumnIndex) : renderedColumnIndex;
              _this2.appendColHeader(visualColumnsIndex, TH);
            });
          }
          _this2.instance.runHooks("afterGetColumnHeaderRenderers", headerRenderers);
          return headerRenderers;
        },
        columnWidth: function columnWidth(renderedColumnIndex) {
          var visualIndex = _this2.instance.columnIndexMapper.getVisualFromRenderableIndex(renderedColumnIndex);
          return _this2.instance.getColWidth(visualIndex === null ? renderedColumnIndex : visualIndex);
        },
        rowHeight: function rowHeight(renderedRowIndex) {
          var visualIndex = _this2.instance.rowIndexMapper.getVisualFromRenderableIndex(renderedRowIndex);
          return _this2.instance.getRowHeight(visualIndex === null ? renderedRowIndex : visualIndex);
        },
        cellRenderer: function cellRenderer(renderedRowIndex, renderedColumnIndex, TD) {
          var _this2$translateFromR = _this2.translateFromRenderableToVisualIndex(renderedRowIndex, renderedColumnIndex), _this2$translateFromR2 = _slicedToArray$7(_this2$translateFromR, 2), visualRowIndex = _this2$translateFromR2[0], visualColumnIndex = _this2$translateFromR2[1];
          var modifiedCellCoords = _this2.instance.runHooks("modifyGetCellCoords", visualRowIndex, visualColumnIndex);
          var visualRowToCheck = visualRowIndex;
          var visualColumnToCheck = visualColumnIndex;
          if (Array.isArray(modifiedCellCoords)) {
            var _modifiedCellCoords = _slicedToArray$7(modifiedCellCoords, 2);
            visualRowToCheck = _modifiedCellCoords[0];
            visualColumnToCheck = _modifiedCellCoords[1];
          }
          var cellProperties = _this2.instance.getCellMeta(visualRowToCheck, visualColumnToCheck);
          var prop = _this2.instance.colToProp(visualColumnToCheck);
          var value = _this2.instance.getDataAtRowProp(visualRowToCheck, prop);
          if (_this2.instance.hasHook("beforeValueRender")) {
            value = _this2.instance.runHooks("beforeValueRender", value, cellProperties);
          }
          _this2.instance.runHooks("beforeRenderer", TD, visualRowIndex, visualColumnIndex, prop, value, cellProperties);
          _this2.instance.getCellRenderer(cellProperties)(_this2.instance, TD, visualRowIndex, visualColumnIndex, prop, value, cellProperties);
          _this2.instance.runHooks("afterRenderer", TD, visualRowIndex, visualColumnIndex, prop, value, cellProperties);
        },
        selections: this.instance.selection.highlight,
        hideBorderOnMouseDownOver: function hideBorderOnMouseDownOver() {
          return _this2.settings.fragmentSelection;
        },
        onWindowResize: function onWindowResize() {
          if (!_this2.instance || _this2.instance.isDestroyed) {
            return;
          }
          _this2.instance.refreshDimensions();
        },
        onCellMouseDown: function onCellMouseDown(event, coords, TD, wt) {
          var visualCoords = _this2.translateFromRenderableToVisualCoords(coords);
          var controller = {
            row: false,
            column: false,
            cell: false
          };
          _this2.instance.listen();
          _this2.activeWt = wt;
          priv.mouseDown = true;
          _this2.instance.runHooks("beforeOnCellMouseDown", event, visualCoords, TD, controller);
          if (isImmediatePropagationStopped(event)) {
            return;
          }
          handleMouseEvent(event, {
            coords: visualCoords,
            selection: _this2.instance.selection,
            controller,
            cellCoordsFactory: function cellCoordsFactory(row, column) {
              return _this2.instance._createCellCoords(row, column);
            }
          });
          _this2.instance.runHooks("afterOnCellMouseDown", event, visualCoords, TD);
          _this2.activeWt = _this2._wt;
        },
        onCellContextMenu: function onCellContextMenu(event, coords, TD, wt) {
          var visualCoords = _this2.translateFromRenderableToVisualCoords(coords);
          _this2.activeWt = wt;
          priv.mouseDown = false;
          if (_this2.instance.selection.isInProgress()) {
            _this2.instance.selection.finish();
          }
          _this2.instance.runHooks("beforeOnCellContextMenu", event, visualCoords, TD);
          if (isImmediatePropagationStopped(event)) {
            return;
          }
          _this2.instance.runHooks("afterOnCellContextMenu", event, visualCoords, TD);
          _this2.activeWt = _this2._wt;
        },
        onCellMouseOut: function onCellMouseOut(event, coords, TD, wt) {
          var visualCoords = _this2.translateFromRenderableToVisualCoords(coords);
          _this2.activeWt = wt;
          _this2.instance.runHooks("beforeOnCellMouseOut", event, visualCoords, TD);
          if (isImmediatePropagationStopped(event)) {
            return;
          }
          _this2.instance.runHooks("afterOnCellMouseOut", event, visualCoords, TD);
          _this2.activeWt = _this2._wt;
        },
        onCellMouseOver: function onCellMouseOver(event, coords, TD, wt) {
          var visualCoords = _this2.translateFromRenderableToVisualCoords(coords);
          var controller = {
            row: false,
            column: false,
            cell: false
          };
          _this2.activeWt = wt;
          _this2.instance.runHooks("beforeOnCellMouseOver", event, visualCoords, TD, controller);
          if (isImmediatePropagationStopped(event)) {
            return;
          }
          if (priv.mouseDown) {
            handleMouseEvent(event, {
              coords: visualCoords,
              selection: _this2.instance.selection,
              controller,
              cellCoordsFactory: function cellCoordsFactory(row, column) {
                return _this2.instance._createCellCoords(row, column);
              }
            });
          }
          _this2.instance.runHooks("afterOnCellMouseOver", event, visualCoords, TD);
          _this2.activeWt = _this2._wt;
        },
        onCellMouseUp: function onCellMouseUp(event, coords, TD, wt) {
          var visualCoords = _this2.translateFromRenderableToVisualCoords(coords);
          _this2.activeWt = wt;
          _this2.instance.runHooks("beforeOnCellMouseUp", event, visualCoords, TD);
          if (isImmediatePropagationStopped(event) || _this2.instance.isDestroyed) {
            return;
          }
          _this2.instance.runHooks("afterOnCellMouseUp", event, visualCoords, TD);
          _this2.activeWt = _this2._wt;
        },
        onCellCornerMouseDown: function onCellCornerMouseDown(event) {
          event.preventDefault();
          _this2.instance.runHooks("afterOnCellCornerMouseDown", event);
        },
        onCellCornerDblClick: function onCellCornerDblClick(event) {
          event.preventDefault();
          _this2.instance.runHooks("afterOnCellCornerDblClick", event);
        },
        beforeDraw: function beforeDraw(force, skipRender) {
          return _this2.beforeRender(force, skipRender);
        },
        onDraw: function onDraw(force) {
          return _this2.afterRender(force);
        },
        onScrollVertically: function onScrollVertically() {
          return _this2.instance.runHooks("afterScrollVertically");
        },
        onScrollHorizontally: function onScrollHorizontally() {
          return _this2.instance.runHooks("afterScrollHorizontally");
        },
        onBeforeRemoveCellClassNames: function onBeforeRemoveCellClassNames() {
          return _this2.instance.runHooks("beforeRemoveCellClassNames");
        },
        onBeforeHighlightingRowHeader: function onBeforeHighlightingRowHeader(renderableRow, headerLevel, highlightMeta) {
          var rowMapper = _this2.instance.rowIndexMapper;
          var visualRow = rowMapper.getVisualFromRenderableIndex(renderableRow);
          var newVisualRow = _this2.instance.runHooks("beforeHighlightingRowHeader", visualRow, headerLevel, highlightMeta);
          return rowMapper.getRenderableFromVisualIndex(rowMapper.getFirstNotHiddenIndex(newVisualRow, 1));
        },
        onBeforeHighlightingColumnHeader: function onBeforeHighlightingColumnHeader(renderableColumn, headerLevel, highlightMeta) {
          var columnMapper = _this2.instance.columnIndexMapper;
          var visualColumn = columnMapper.getVisualFromRenderableIndex(renderableColumn);
          var newVisualColumn = _this2.instance.runHooks("beforeHighlightingColumnHeader", visualColumn, headerLevel, highlightMeta);
          return columnMapper.getRenderableFromVisualIndex(columnMapper.getFirstNotHiddenIndex(newVisualColumn, 1));
        },
        onAfterDrawSelection: function onAfterDrawSelection(currentRow, currentColumn, layerLevel) {
          var cornersOfSelection;
          var _this2$translateFromR3 = _this2.translateFromRenderableToVisualIndex(currentRow, currentColumn), _this2$translateFromR4 = _slicedToArray$7(_this2$translateFromR3, 2), visualRowIndex = _this2$translateFromR4[0], visualColumnIndex = _this2$translateFromR4[1];
          var selectedRange = _this2.instance.selection.getSelectedRange();
          var selectionRangeSize = selectedRange.size();
          if (selectionRangeSize > 0) {
            var selectionOffset = (layerLevel !== null && layerLevel !== void 0 ? layerLevel : 0) + 1 - selectionRangeSize;
            var selectionForLayer = selectedRange.peekByIndex(selectionOffset);
            cornersOfSelection = [selectionForLayer.from.row, selectionForLayer.from.col, selectionForLayer.to.row, selectionForLayer.to.col];
          }
          return _this2.instance.runHooks("afterDrawSelection", visualRowIndex, visualColumnIndex, cornersOfSelection, layerLevel);
        },
        onBeforeDrawBorders: function onBeforeDrawBorders(corners, borderClassName) {
          var _corners = _slicedToArray$7(corners, 4), startRenderableRow = _corners[0], startRenderableColumn = _corners[1], endRenderableRow = _corners[2], endRenderableColumn = _corners[3];
          var visualCorners = [_this2.instance.rowIndexMapper.getVisualFromRenderableIndex(startRenderableRow), _this2.instance.columnIndexMapper.getVisualFromRenderableIndex(startRenderableColumn), _this2.instance.rowIndexMapper.getVisualFromRenderableIndex(endRenderableRow), _this2.instance.columnIndexMapper.getVisualFromRenderableIndex(endRenderableColumn)];
          return _this2.instance.runHooks("beforeDrawBorders", visualCorners, borderClassName);
        },
        onBeforeTouchScroll: function onBeforeTouchScroll() {
          return _this2.instance.runHooks("beforeTouchScroll");
        },
        onAfterMomentumScroll: function onAfterMomentumScroll() {
          return _this2.instance.runHooks("afterMomentumScroll");
        },
        onBeforeStretchingColumnWidth: function onBeforeStretchingColumnWidth(stretchedWidth, renderedColumnIndex) {
          var visualColumnIndex = _this2.instance.columnIndexMapper.getVisualFromRenderableIndex(renderedColumnIndex);
          return _this2.instance.runHooks("beforeStretchingColumnWidth", stretchedWidth, visualColumnIndex);
        },
        onModifyRowHeaderWidth: function onModifyRowHeaderWidth(rowHeaderWidth) {
          return _this2.instance.runHooks("modifyRowHeaderWidth", rowHeaderWidth);
        },
        onModifyGetCellCoords: function onModifyGetCellCoords(renderableRowIndex, renderableColumnIndex, topmost) {
          var rowMapper = _this2.instance.rowIndexMapper;
          var columnMapper = _this2.instance.columnIndexMapper;
          var visualColumnIndex = renderableColumnIndex >= 0 ? columnMapper.getVisualFromRenderableIndex(renderableColumnIndex) : renderableColumnIndex;
          var visualRowIndex = renderableRowIndex >= 0 ? rowMapper.getVisualFromRenderableIndex(renderableRowIndex) : renderableRowIndex;
          var visualIndexes = _this2.instance.runHooks("modifyGetCellCoords", visualRowIndex, visualColumnIndex, topmost);
          if (Array.isArray(visualIndexes)) {
            var _visualIndexes = _slicedToArray$7(visualIndexes, 4), visualRowFrom = _visualIndexes[0], visualColumnFrom = _visualIndexes[1], visualRowTo = _visualIndexes[2], visualColumnTo = _visualIndexes[3];
            return [visualRowFrom >= 0 ? rowMapper.getRenderableFromVisualIndex(rowMapper.getFirstNotHiddenIndex(visualRowFrom, 1)) : visualRowFrom, visualColumnFrom >= 0 ? columnMapper.getRenderableFromVisualIndex(columnMapper.getFirstNotHiddenIndex(visualColumnFrom, 1)) : visualColumnFrom, visualRowTo >= 0 ? rowMapper.getRenderableFromVisualIndex(rowMapper.getFirstNotHiddenIndex(visualRowTo, -1)) : visualRowTo, visualColumnTo >= 0 ? columnMapper.getRenderableFromVisualIndex(columnMapper.getFirstNotHiddenIndex(visualColumnTo, -1)) : visualColumnTo];
          }
        },
        viewportRowCalculatorOverride: function viewportRowCalculatorOverride(calc) {
          var viewportOffset = _this2.settings.viewportRowRenderingOffset;
          if (viewportOffset === "auto" && _this2.settings.fixedRowsTop) {
            viewportOffset = 10;
          }
          if (viewportOffset > 0 || viewportOffset === "auto") {
            var renderableRows = _this2.countRenderableRows();
            var firstRenderedRow = calc.startRow;
            var lastRenderedRow = calc.endRow;
            if (typeof viewportOffset === "number") {
              calc.startRow = Math.max(firstRenderedRow - viewportOffset, 0);
              calc.endRow = Math.min(lastRenderedRow + viewportOffset, renderableRows - 1);
            } else if (viewportOffset === "auto") {
              var offset = Math.ceil(lastRenderedRow / renderableRows * 12);
              calc.startRow = Math.max(firstRenderedRow - offset, 0);
              calc.endRow = Math.min(lastRenderedRow + offset, renderableRows - 1);
            }
          }
          _this2.instance.runHooks("afterViewportRowCalculatorOverride", calc);
        },
        viewportColumnCalculatorOverride: function viewportColumnCalculatorOverride(calc) {
          var viewportOffset = _this2.settings.viewportColumnRenderingOffset;
          if (viewportOffset === "auto" && _this2.settings.fixedColumnsStart) {
            viewportOffset = 10;
          }
          if (viewportOffset > 0 || viewportOffset === "auto") {
            var renderableColumns = _this2.countRenderableColumns();
            var firstRenderedColumn = calc.startColumn;
            var lastRenderedColumn = calc.endColumn;
            if (typeof viewportOffset === "number") {
              calc.startColumn = Math.max(firstRenderedColumn - viewportOffset, 0);
              calc.endColumn = Math.min(lastRenderedColumn + viewportOffset, renderableColumns - 1);
            }
            if (viewportOffset === "auto") {
              var offset = Math.ceil(lastRenderedColumn / renderableColumns * 6);
              calc.startColumn = Math.max(firstRenderedColumn - offset, 0);
              calc.endColumn = Math.min(lastRenderedColumn + offset, renderableColumns - 1);
            }
          }
          _this2.instance.runHooks("afterViewportColumnCalculatorOverride", calc);
        },
        rowHeaderWidth: function rowHeaderWidth() {
          return _this2.settings.rowHeaderWidth;
        },
        columnHeaderHeight: function columnHeaderHeight() {
          var columnHeaderHeight2 = _this2.instance.runHooks("modifyColumnHeaderHeight");
          return _this2.settings.columnHeaderHeight || columnHeaderHeight2;
        }
      };
      this.instance.runHooks("beforeInitWalkontable", walkontableConfig);
      this._wt = new WalkontableFacade(walkontableConfig);
      this.activeWt = this._wt;
      var spreader = this._wt.wtTable.spreader;
      var _this$instance$rootEl = this.instance.rootElement.getBoundingClientRect(), width = _this$instance$rootEl.width, height = _this$instance$rootEl.height;
      this.setLastSize(width, height);
      this.eventManager.addEventListener(spreader, "mousedown", function(event) {
        if (event.target === spreader && event.which === 3) {
          event.stopPropagation();
        }
      });
      this.eventManager.addEventListener(spreader, "contextmenu", function(event) {
        if (event.target === spreader && event.which === 3) {
          event.stopPropagation();
        }
      });
      this.eventManager.addEventListener(this.instance.rootDocument.documentElement, "click", function() {
        if (_this2.settings.observeDOMVisibility) {
          if (_this2._wt.drawInterrupted) {
            _this2.instance.forceFullRender = true;
            _this2.render();
          }
        }
      });
    }
  }, {
    key: "isTextSelectionAllowed",
    value: function isTextSelectionAllowed(el) {
      if (isInput(el)) {
        return true;
      }
      var isChildOfTableBody = isChildOf(el, this.instance.view._wt.wtTable.spreader);
      if (this.settings.fragmentSelection === true && isChildOfTableBody) {
        return true;
      }
      if (this.settings.fragmentSelection === "cell" && this.isSelectedOnlyCell() && isChildOfTableBody) {
        return true;
      }
      if (!this.settings.fragmentSelection && this.isCellEdited() && this.isSelectedOnlyCell()) {
        return true;
      }
      return false;
    }
  }, {
    key: "isMouseDown",
    value: function isMouseDown() {
      return privatePool$3.get(this).mouseDown;
    }
  }, {
    key: "isSelectedOnlyCell",
    value: function isSelectedOnlyCell() {
      var _this$instance$getSel, _this$instance$getSel2;
      return (_this$instance$getSel = (_this$instance$getSel2 = this.instance.getSelectedRangeLast()) === null || _this$instance$getSel2 === void 0 ? void 0 : _this$instance$getSel2.isSingle()) !== null && _this$instance$getSel !== void 0 ? _this$instance$getSel : false;
    }
  }, {
    key: "isCellEdited",
    value: function isCellEdited() {
      var activeEditor = this.instance.getActiveEditor();
      return activeEditor && activeEditor.isOpened();
    }
  }, {
    key: "beforeRender",
    value: function beforeRender(force, skipRender) {
      if (force) {
        this.instance.runHooks("beforeViewRender", this.instance.forceFullRender, skipRender);
      }
    }
  }, {
    key: "afterRender",
    value: function afterRender(force) {
      if (force) {
        this.instance.runHooks("afterViewRender", this.instance.forceFullRender);
      }
    }
  }, {
    key: "appendRowHeader",
    value: function appendRowHeader(visualRowIndex, TH) {
      if (TH.firstChild) {
        var container = TH.firstChild;
        if (!hasClass(container, "relative")) {
          empty(TH);
          this.appendRowHeader(visualRowIndex, TH);
          return;
        }
        this.updateCellHeader(container.querySelector(".rowHeader"), visualRowIndex, this.instance.getRowHeader);
      } else {
        var _this$instance4 = this.instance, rootDocument = _this$instance4.rootDocument, getRowHeader = _this$instance4.getRowHeader;
        var div = rootDocument.createElement("div");
        var span = rootDocument.createElement("span");
        div.className = "relative";
        span.className = "rowHeader";
        this.updateCellHeader(span, visualRowIndex, getRowHeader);
        div.appendChild(span);
        TH.appendChild(div);
      }
      this.instance.runHooks("afterGetRowHeader", visualRowIndex, TH);
    }
  }, {
    key: "appendColHeader",
    value: function appendColHeader(visualColumnIndex, TH) {
      if (TH.firstChild) {
        var container = TH.firstChild;
        if (hasClass(container, "relative")) {
          this.updateCellHeader(container.querySelector(".colHeader"), visualColumnIndex, this.instance.getColHeader);
        } else {
          empty(TH);
          this.appendColHeader(visualColumnIndex, TH);
        }
      } else {
        var rootDocument = this.instance.rootDocument;
        var div = rootDocument.createElement("div");
        var span = rootDocument.createElement("span");
        div.className = "relative";
        span.className = "colHeader";
        this.updateCellHeader(span, visualColumnIndex, this.instance.getColHeader);
        div.appendChild(span);
        TH.appendChild(div);
      }
      this.instance.runHooks("afterGetColHeader", visualColumnIndex, TH);
    }
  }, {
    key: "updateCellHeader",
    value: function updateCellHeader(element, index, content) {
      var renderedIndex = index;
      var parentOverlay = this._wt.wtOverlays.getParentOverlay(element) || this._wt;
      if (element.parentNode) {
        if (hasClass(element, "colHeader")) {
          renderedIndex = parentOverlay.wtTable.columnFilter.sourceToRendered(index);
        } else if (hasClass(element, "rowHeader")) {
          renderedIndex = parentOverlay.wtTable.rowFilter.sourceToRendered(index);
        }
      }
      if (renderedIndex > -1) {
        fastInnerHTML(element, content(index));
      } else {
        fastInnerText(element, String.fromCharCode(160));
        addClass(element, "cornerHeader");
      }
    }
  }, {
    key: "maximumVisibleElementWidth",
    value: function maximumVisibleElementWidth(inlineOffset) {
      var workspaceWidth = this._wt.wtViewport.getWorkspaceWidth();
      var maxWidth = workspaceWidth - inlineOffset;
      return maxWidth > 0 ? maxWidth : 0;
    }
  }, {
    key: "maximumVisibleElementHeight",
    value: function maximumVisibleElementHeight(topOffset) {
      var workspaceHeight = this._wt.wtViewport.getWorkspaceHeight();
      var maxHeight = workspaceHeight - topOffset;
      return maxHeight > 0 ? maxHeight : 0;
    }
  }, {
    key: "setLastSize",
    value: function setLastSize(width, height) {
      var priv = privatePool$3.get(this);
      var _ref2 = [width, height];
      priv.lastWidth = _ref2[0];
      priv.lastHeight = _ref2[1];
    }
  }, {
    key: "getLastSize",
    value: function getLastSize() {
      var priv = privatePool$3.get(this);
      return {
        width: priv.lastWidth,
        height: priv.lastHeight
      };
    }
  }, {
    key: "getFirstFullyVisibleRow",
    value: function getFirstFullyVisibleRow() {
      return this.instance.rowIndexMapper.getVisualFromRenderableIndex(this.instance.view._wt.wtScroll.getFirstVisibleRow());
    }
  }, {
    key: "getLastFullyVisibleRow",
    value: function getLastFullyVisibleRow() {
      return this.instance.rowIndexMapper.getVisualFromRenderableIndex(this.instance.view._wt.wtScroll.getLastVisibleRow());
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._wt.destroy();
      this.eventManager.destroy();
    }
  }]);
  return TableView2;
}();

var _staticRegister$3 = staticRegister("cellTypes"), register$3 = _staticRegister$3.register, getItem$3 = _staticRegister$3.getItem, hasItem$3 = _staticRegister$3.hasItem;
function _getItem$2(name) {
  if (!hasItem$3(name)) {
    throw Error('You declared cell type "'.concat(name, '" as a string that is not mapped to a known object.\n                 Cell type must be an object or a string mapped to an object registered by\n                 "Handsontable.cellTypes.registerCellType" method'));
  }
  return getItem$3(name);
}
function _register$3(name, type) {
  if (typeof name !== "string") {
    type = name;
    name = type.CELL_TYPE;
  }
  var _type = type, editor = _type.editor, renderer = _type.renderer, validator = _type.validator;
  if (editor) {
    _register(name, editor);
  }
  if (renderer) {
    _register$1(name, renderer);
  }
  if (validator) {
    _register$2(name, validator);
  }
  register$3(name, type);
}

function _typeof$p(obj) {
  "@babel/helpers - typeof";
  return _typeof$p = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$p(obj);
}
var COLUMN_LABEL_BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var COLUMN_LABEL_BASE_LENGTH = COLUMN_LABEL_BASE.length;
function spreadsheetColumnLabel(index) {
  var dividend = index + 1;
  var columnLabel = "";
  var modulo;
  while (dividend > 0) {
    modulo = (dividend - 1) % COLUMN_LABEL_BASE_LENGTH;
    columnLabel = String.fromCharCode(65 + modulo) + columnLabel;
    dividend = parseInt((dividend - modulo) / COLUMN_LABEL_BASE_LENGTH, 10);
  }
  return columnLabel;
}
function cellMethodLookupFactory(methodName, allowUndefined) {
  var isUndefinedAllowed = typeof allowUndefined === "undefined" ? true : allowUndefined;
  return function cellMethodLookup(row, col) {
    return function getMethodFromProperties(properties) {
      if (!properties) {
        return;
      }
      if (hasOwnProperty(properties, methodName) && properties[methodName] !== void 0) {
        return properties[methodName];
      } else if (hasOwnProperty(properties, "type") && properties.type) {
        if (typeof properties.type !== "string") {
          throw new Error('Cell "type" must be a string');
        }
        var type = _getItem$2(properties.type);
        if (hasOwnProperty(type, methodName)) {
          return type[methodName];
        } else if (isUndefinedAllowed) {
          return;
        }
      }
      return getMethodFromProperties(Object.getPrototypeOf(properties));
    }(typeof row === "number" ? this.getCellMeta(row, col) : row);
  };
}
function dataRowToChangesArray(dataRow) {
  var rowOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var dataRows = dataRow;
  var changesArray = [];
  if (!Array.isArray(dataRow) || !Array.isArray(dataRow[0])) {
    dataRows = [dataRow];
  }
  dataRows.forEach(function(row, rowIndex) {
    if (Array.isArray(row)) {
      row.forEach(function(value, column) {
        changesArray.push([rowIndex + rowOffset, column, value]);
      });
    } else {
      Object.keys(row).forEach(function(propName) {
        changesArray.push([rowIndex + rowOffset, propName, row[propName]]);
      });
    }
  });
  return changesArray;
}
function countFirstRowKeys(data) {
  var result = 0;
  if (Array.isArray(data)) {
    if (data[0] && Array.isArray(data[0])) {
      result = data[0].length;
    } else if (data[0] && isObject(data[0])) {
      result = deepObjectSize(data[0]);
    }
  }
  return result;
}
function isArrayOfArrays(data) {
  return !!(Array.isArray(data) && data.length && data.every(function(el) {
    return Array.isArray(el);
  }));
}
function isArrayOfObjects(data) {
  return !!(Array.isArray(data) && data.length && data.every(function(el) {
    return _typeof$p(el) === "object" && !Array.isArray(el) && el !== null;
  }));
}

function _classCallCheck$N(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$N(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$N(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$N(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$N(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var DataSource = /* @__PURE__ */ function() {
  function DataSource2(hotInstance) {
    var dataSource = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    _classCallCheck$N(this, DataSource2);
    this.hot = hotInstance;
    this.data = dataSource;
    this.dataType = "array";
    this.colToProp = function() {
    };
    this.propToCol = function() {
    };
  }
  _createClass$N(DataSource2, [{
    key: "modifyRowData",
    value: function modifyRowData(rowIndex) {
      var modifyRowData2;
      if (this.hot.hasHook("modifyRowData")) {
        modifyRowData2 = this.hot.runHooks("modifyRowData", rowIndex);
      }
      return modifyRowData2 !== void 0 && !Number.isInteger(modifyRowData2) ? modifyRowData2 : this.data[rowIndex];
    }
  }, {
    key: "getData",
    value: function getData() {
      var toArray = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (!this.data || this.data.length === 0) {
        return this.data;
      }
      return this.getByRange(null, null, toArray);
    }
  }, {
    key: "setData",
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: "getAtColumn",
    value: function getAtColumn(column) {
      var _this = this;
      var result = [];
      arrayEach(this.data, function(row, rowIndex) {
        var value = _this.getAtCell(rowIndex, column);
        result.push(value);
      });
      return result;
    }
  }, {
    key: "getAtRow",
    value: function getAtRow(row, startColumn, endColumn) {
      var _this2 = this;
      var toArray = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
      var getAllProps = startColumn === void 0 && endColumn === void 0;
      var dataRow = null;
      var newDataRow = null;
      dataRow = this.modifyRowData(row);
      if (Array.isArray(dataRow)) {
        newDataRow = [];
        if (getAllProps) {
          dataRow.forEach(function(cell, column) {
            newDataRow[column] = _this2.getAtPhysicalCell(row, column, dataRow);
          });
        } else {
          rangeEach(startColumn, endColumn, function(column) {
            newDataRow[column - startColumn] = _this2.getAtPhysicalCell(row, column, dataRow);
          });
        }
      } else if (isObject(dataRow) || isFunction(dataRow)) {
        if (toArray) {
          newDataRow = [];
        } else {
          newDataRow = {};
        }
        if (!getAllProps || toArray) {
          var rangeStart = 0;
          var rangeEnd = this.countFirstRowKeys() - 1;
          rangeEach(rangeStart, rangeEnd, function(column) {
            var prop = _this2.colToProp(column);
            if (column >= (startColumn || rangeStart) && column <= (endColumn || rangeEnd) && !Number.isInteger(prop)) {
              var cellValue = _this2.getAtPhysicalCell(row, prop, dataRow);
              if (toArray) {
                newDataRow.push(cellValue);
              } else {
                setProperty(newDataRow, prop, cellValue);
              }
            }
          });
        } else {
          objectEach(dataRow, function(value, prop) {
            setProperty(newDataRow, prop, _this2.getAtPhysicalCell(row, prop, dataRow));
          });
        }
      }
      return newDataRow;
    }
  }, {
    key: "setAtCell",
    value: function setAtCell(row, column, value) {
      if (row >= this.countRows() || column >= this.countFirstRowKeys()) {
        return;
      }
      if (this.hot.hasHook("modifySourceData")) {
        var valueHolder = createObjectPropListener(value);
        this.hot.runHooks("modifySourceData", row, this.propToCol(column), valueHolder, "set");
        if (valueHolder.isTouched()) {
          value = valueHolder.value;
        }
      }
      if (!Number.isInteger(column)) {
        setProperty(this.data[row], column, value);
      } else {
        this.data[row][column] = value;
      }
    }
  }, {
    key: "getAtPhysicalCell",
    value: function getAtPhysicalCell(row, column, dataRow) {
      var result = null;
      if (dataRow) {
        if (typeof column === "string") {
          result = getProperty(dataRow, column);
        } else if (typeof column === "function") {
          result = column(dataRow);
        } else {
          result = dataRow[column];
        }
      }
      if (this.hot.hasHook("modifySourceData")) {
        var valueHolder = createObjectPropListener(result);
        this.hot.runHooks("modifySourceData", row, this.colToProp(column), valueHolder, "get");
        if (valueHolder.isTouched()) {
          result = valueHolder.value;
        }
      }
      return result;
    }
  }, {
    key: "getAtCell",
    value: function getAtCell(row, column) {
      var dataRow = this.modifyRowData(row);
      return this.getAtPhysicalCell(row, this.colToProp(column), dataRow);
    }
  }, {
    key: "getByRange",
    value: function getByRange() {
      var _this3 = this;
      var start = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      var end = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
      var toArray = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      var getAllProps = false;
      var startRow = null;
      var startCol = null;
      var endRow = null;
      var endCol = null;
      if (start === null || end === null) {
        getAllProps = true;
        startRow = 0;
        endRow = this.countRows() - 1;
      } else {
        startRow = Math.min(start.row, end.row);
        startCol = Math.min(start.col, end.col);
        endRow = Math.max(start.row, end.row);
        endCol = Math.max(start.col, end.col);
      }
      var result = [];
      rangeEach(startRow, endRow, function(currentRow) {
        result.push(getAllProps ? _this3.getAtRow(currentRow, void 0, void 0, toArray) : _this3.getAtRow(currentRow, startCol, endCol, toArray));
      });
      return result;
    }
  }, {
    key: "countRows",
    value: function countRows() {
      if (this.hot.hasHook("modifySourceLength")) {
        var modifiedSourceLength = this.hot.runHooks("modifySourceLength");
        if (Number.isInteger(modifiedSourceLength)) {
          return modifiedSourceLength;
        }
      }
      return this.data.length;
    }
  }, {
    key: "countFirstRowKeys",
    value: function countFirstRowKeys$1() {
      return countFirstRowKeys(this.data);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.data = null;
      this.hot = null;
    }
  }]);
  return DataSource2;
}();

var MIXIN_NAME$5 = "localHooks";
var localHooks = {
  _localHooks: Object.create(null),
  addLocalHook: function addLocalHook(key, callback) {
    if (!this._localHooks[key]) {
      this._localHooks[key] = [];
    }
    this._localHooks[key].push(callback);
    return this;
  },
  runLocalHooks: function runLocalHooks(key, arg1, arg2, arg3, arg4, arg5, arg6) {
    if (this._localHooks[key]) {
      var length = this._localHooks[key].length;
      for (var i = 0; i < length; i++) {
        fastCall(this._localHooks[key][i], this, arg1, arg2, arg3, arg4, arg5, arg6);
      }
    }
  },
  clearLocalHooks: function clearLocalHooks() {
    this._localHooks = {};
    return this;
  }
};
defineGetter(localHooks, "MIXIN_NAME", MIXIN_NAME$5, {
  writable: false,
  enumerable: false
});

function _classCallCheck$O(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$O(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$O(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$O(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$O(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var IndexMap = /* @__PURE__ */ function() {
  function IndexMap2() {
    var initValueOrFn = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    _classCallCheck$O(this, IndexMap2);
    this.indexedValues = [];
    this.initValueOrFn = initValueOrFn;
  }
  _createClass$O(IndexMap2, [{
    key: "getValues",
    value: function getValues() {
      return this.indexedValues;
    }
  }, {
    key: "getValueAtIndex",
    value: function getValueAtIndex(index) {
      var values = this.indexedValues;
      if (index < values.length) {
        return values[index];
      }
    }
  }, {
    key: "setValues",
    value: function setValues(values) {
      this.indexedValues = values.slice();
      this.runLocalHooks("change");
    }
  }, {
    key: "setValueAtIndex",
    value: function setValueAtIndex(index, value) {
      if (index < this.indexedValues.length) {
        this.indexedValues[index] = value;
        this.runLocalHooks("change");
        return true;
      }
      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.setDefaultValues();
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.getValues().length;
    }
  }, {
    key: "setDefaultValues",
    value: function setDefaultValues() {
      var _this = this;
      var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.indexedValues.length;
      this.indexedValues.length = 0;
      if (isFunction(this.initValueOrFn)) {
        rangeEach(length - 1, function(index) {
          return _this.indexedValues.push(_this.initValueOrFn(index));
        });
      } else {
        rangeEach(length - 1, function() {
          return _this.indexedValues.push(_this.initValueOrFn);
        });
      }
      this.runLocalHooks("change");
    }
  }, {
    key: "init",
    value: function init(length) {
      this.setDefaultValues(length);
      this.runLocalHooks("init");
      return this;
    }
  }, {
    key: "insert",
    value: function insert() {
      this.runLocalHooks("change");
    }
  }, {
    key: "remove",
    value: function remove() {
      this.runLocalHooks("change");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.clearLocalHooks();
      this.indexedValues = null;
      this.initValueOrFn = null;
    }
  }]);
  return IndexMap2;
}();
mixin(IndexMap, localHooks);

function _toConsumableArray$b(arr) {
  return _arrayWithoutHoles$b(arr) || _iterableToArray$b(arr) || _unsupportedIterableToArray$e(arr) || _nonIterableSpread$b();
}
function _nonIterableSpread$b() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$e(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$e(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$e(o, minLen);
}
function _iterableToArray$b(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$b(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$e(arr);
}
function _arrayLikeToArray$e(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function getListWithInsertedItems(indexedValues, insertionIndex, insertedIndexes, insertedValuesMapping) {
  var firstInsertedIndex = insertedIndexes.length ? insertedIndexes[0] : void 0;
  return [].concat(_toConsumableArray$b(indexedValues.slice(0, firstInsertedIndex)), _toConsumableArray$b(insertedIndexes.map(function(insertedIndex, ordinalNumber) {
    if (isFunction(insertedValuesMapping)) {
      return insertedValuesMapping(insertedIndex, ordinalNumber);
    }
    return insertedValuesMapping;
  })), _toConsumableArray$b(firstInsertedIndex === void 0 ? [] : indexedValues.slice(firstInsertedIndex)));
}
function getListWithRemovedItems(indexedValues, removedIndexes) {
  return arrayFilter(indexedValues, function(_, index) {
    return removedIndexes.includes(index) === false;
  });
}

function _typeof$q(obj) {
  "@babel/helpers - typeof";
  return _typeof$q = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$q(obj);
}
function _classCallCheck$P(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$P(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$P(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$P(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$P(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get2(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base)
        return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf$j(object);
    if (object === null)
      break;
  }
  return object;
}
function _inherits$j(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$l(subClass, superClass);
}
function _setPrototypeOf$l(o, p) {
  _setPrototypeOf$l = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$l(o, p);
}
function _createSuper$j(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$l();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$j(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$j(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$j(this, result);
  };
}
function _possibleConstructorReturn$j(self, call) {
  if (call && (_typeof$q(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$j(self);
}
function _assertThisInitialized$j(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$l() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$j(o) {
  _getPrototypeOf$j = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$j(o);
}
var PhysicalIndexToValueMap = /* @__PURE__ */ function(_IndexMap) {
  _inherits$j(PhysicalIndexToValueMap2, _IndexMap);
  var _super = _createSuper$j(PhysicalIndexToValueMap2);
  function PhysicalIndexToValueMap2() {
    _classCallCheck$P(this, PhysicalIndexToValueMap2);
    return _super.apply(this, arguments);
  }
  _createClass$P(PhysicalIndexToValueMap2, [{
    key: "insert",
    value: function insert(insertionIndex, insertedIndexes) {
      this.indexedValues = getListWithInsertedItems(this.indexedValues, insertionIndex, insertedIndexes, this.initValueOrFn);
      _get(_getPrototypeOf$j(PhysicalIndexToValueMap2.prototype), "insert", this).call(this, insertionIndex, insertedIndexes);
    }
  }, {
    key: "remove",
    value: function remove(removedIndexes) {
      this.indexedValues = getListWithRemovedItems(this.indexedValues, removedIndexes);
      _get(_getPrototypeOf$j(PhysicalIndexToValueMap2.prototype), "remove", this).call(this, removedIndexes);
    }
  }]);
  return PhysicalIndexToValueMap2;
}(IndexMap);

function _typeof$r(obj) {
  "@babel/helpers - typeof";
  return _typeof$r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$r(obj);
}
function _classCallCheck$Q(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$Q(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$Q(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$Q(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$Q(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$k(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$m(subClass, superClass);
}
function _setPrototypeOf$m(o, p) {
  _setPrototypeOf$m = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$m(o, p);
}
function _createSuper$k(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$m();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$k(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$k(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$k(this, result);
  };
}
function _possibleConstructorReturn$k(self, call) {
  if (call && (_typeof$r(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$k(self);
}
function _assertThisInitialized$k(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$m() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$k(o) {
  _getPrototypeOf$k = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$k(o);
}
var HidingMap = /* @__PURE__ */ function(_PhysicalIndexToValue) {
  _inherits$k(HidingMap2, _PhysicalIndexToValue);
  var _super = _createSuper$k(HidingMap2);
  function HidingMap2() {
    var initValueOrFn = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    _classCallCheck$Q(this, HidingMap2);
    return _super.call(this, initValueOrFn);
  }
  _createClass$Q(HidingMap2, [{
    key: "getHiddenIndexes",
    value: function getHiddenIndexes() {
      return arrayReduce(this.getValues(), function(indexesList, isHidden, physicalIndex) {
        if (isHidden) {
          indexesList.push(physicalIndex);
        }
        return indexesList;
      }, []);
    }
  }]);
  return HidingMap2;
}(PhysicalIndexToValueMap);

function _toConsumableArray$c(arr) {
  return _arrayWithoutHoles$c(arr) || _iterableToArray$c(arr) || _unsupportedIterableToArray$f(arr) || _nonIterableSpread$c();
}
function _nonIterableSpread$c() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$f(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$f(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$f(o, minLen);
}
function _iterableToArray$c(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$c(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$f(arr);
}
function _arrayLikeToArray$f(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function getListWithInsertedItems$1(indexedValues, insertionIndex, insertedIndexes) {
  return [].concat(_toConsumableArray$c(indexedValues.slice(0, insertionIndex)), _toConsumableArray$c(insertedIndexes), _toConsumableArray$c(indexedValues.slice(insertionIndex)));
}
function getListWithRemovedItems$1(indexedValues, removedIndexes) {
  return arrayFilter(indexedValues, function(index) {
    return removedIndexes.includes(index) === false;
  });
}

function getDecreasedIndexes(indexedValues, removedIndexes) {
  return arrayMap(indexedValues, function(index) {
    return index - removedIndexes.filter(function(removedIndex) {
      return removedIndex < index;
    }).length;
  });
}
function getIncreasedIndexes(indexedValues, insertedIndexes) {
  var firstInsertedIndex = insertedIndexes[0];
  var amountOfIndexes = insertedIndexes.length;
  return arrayMap(indexedValues, function(index) {
    if (index >= firstInsertedIndex) {
      return index + amountOfIndexes;
    }
    return index;
  });
}

function _typeof$s(obj) {
  "@babel/helpers - typeof";
  return _typeof$s = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$s(obj);
}
function _toConsumableArray$d(arr) {
  return _arrayWithoutHoles$d(arr) || _iterableToArray$d(arr) || _unsupportedIterableToArray$g(arr) || _nonIterableSpread$d();
}
function _nonIterableSpread$d() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$g(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$g(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$g(o, minLen);
}
function _iterableToArray$d(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$d(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$g(arr);
}
function _arrayLikeToArray$g(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _classCallCheck$R(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$R(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$R(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$R(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$R(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _get$1() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get$1 = Reflect.get;
  } else {
    _get$1 = function _get2(target, property, receiver) {
      var base = _superPropBase$1(target, property);
      if (!base)
        return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get$1.apply(this, arguments);
}
function _superPropBase$1(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf$l(object);
    if (object === null)
      break;
  }
  return object;
}
function _inherits$l(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$n(subClass, superClass);
}
function _setPrototypeOf$n(o, p) {
  _setPrototypeOf$n = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$n(o, p);
}
function _createSuper$l(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$n();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$l(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$l(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$l(this, result);
  };
}
function _possibleConstructorReturn$l(self, call) {
  if (call && (_typeof$s(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$l(self);
}
function _assertThisInitialized$l(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$n() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$l(o) {
  _getPrototypeOf$l = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$l(o);
}
function _defineProperty$d(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var LinkedPhysicalIndexToValueMap = /* @__PURE__ */ function(_IndexMap) {
  _inherits$l(LinkedPhysicalIndexToValueMap2, _IndexMap);
  var _super = _createSuper$l(LinkedPhysicalIndexToValueMap2);
  function LinkedPhysicalIndexToValueMap2() {
    var _this;
    _classCallCheck$R(this, LinkedPhysicalIndexToValueMap2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty$d(_assertThisInitialized$l(_this), "orderOfIndexes", []);
    return _this;
  }
  _createClass$R(LinkedPhysicalIndexToValueMap2, [{
    key: "getValues",
    value: function getValues() {
      var _this2 = this;
      return this.orderOfIndexes.map(function(physicalIndex) {
        return _this2.indexedValues[physicalIndex];
      });
    }
  }, {
    key: "setValues",
    value: function setValues(values) {
      this.orderOfIndexes = _toConsumableArray$d(Array(values.length).keys());
      _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "setValues", this).call(this, values);
    }
  }, {
    key: "setValueAtIndex",
    value: function setValueAtIndex(index, value) {
      var position = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.orderOfIndexes.length;
      if (index < this.indexedValues.length) {
        this.indexedValues[index] = value;
        if (this.orderOfIndexes.includes(index) === false) {
          this.orderOfIndexes.splice(position, 0, index);
        }
        this.runLocalHooks("change");
        return true;
      }
      return false;
    }
  }, {
    key: "clearValue",
    value: function clearValue(physicalIndex) {
      this.orderOfIndexes = getListWithRemovedItems$1(this.orderOfIndexes, [physicalIndex]);
      if (isFunction(this.initValueOrFn)) {
        _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "setValueAtIndex", this).call(this, physicalIndex, this.initValueOrFn(physicalIndex));
      } else {
        _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "setValueAtIndex", this).call(this, physicalIndex, this.initValueOrFn);
      }
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.orderOfIndexes.length;
    }
  }, {
    key: "setDefaultValues",
    value: function setDefaultValues() {
      var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.indexedValues.length;
      this.orderOfIndexes.length = 0;
      _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "setDefaultValues", this).call(this, length);
    }
  }, {
    key: "insert",
    value: function insert(insertionIndex, insertedIndexes) {
      this.indexedValues = getListWithInsertedItems(this.indexedValues, insertionIndex, insertedIndexes, this.initValueOrFn);
      this.orderOfIndexes = getIncreasedIndexes(this.orderOfIndexes, insertedIndexes);
      _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "insert", this).call(this, insertionIndex, insertedIndexes);
    }
  }, {
    key: "remove",
    value: function remove(removedIndexes) {
      this.indexedValues = getListWithRemovedItems(this.indexedValues, removedIndexes);
      this.orderOfIndexes = getListWithRemovedItems$1(this.orderOfIndexes, removedIndexes);
      this.orderOfIndexes = getDecreasedIndexes(this.orderOfIndexes, removedIndexes);
      _get$1(_getPrototypeOf$l(LinkedPhysicalIndexToValueMap2.prototype), "remove", this).call(this, removedIndexes);
    }
  }, {
    key: "getEntries",
    value: function getEntries() {
      var _this3 = this;
      return this.orderOfIndexes.map(function(physicalIndex) {
        return [physicalIndex, _this3.getValueAtIndex(physicalIndex)];
      });
    }
  }]);
  return LinkedPhysicalIndexToValueMap2;
}(IndexMap);

function _typeof$t(obj) {
  "@babel/helpers - typeof";
  return _typeof$t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$t(obj);
}
function _classCallCheck$S(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$S(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$S(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$S(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$S(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$m(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$o(subClass, superClass);
}
function _setPrototypeOf$o(o, p) {
  _setPrototypeOf$o = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$o(o, p);
}
function _createSuper$m(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$o();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$m(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$m(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$m(this, result);
  };
}
function _possibleConstructorReturn$m(self, call) {
  if (call && (_typeof$t(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$m(self);
}
function _assertThisInitialized$m(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$o() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$m(o) {
  _getPrototypeOf$m = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$m(o);
}
var TrimmingMap = /* @__PURE__ */ function(_PhysicalIndexToValue) {
  _inherits$m(TrimmingMap2, _PhysicalIndexToValue);
  var _super = _createSuper$m(TrimmingMap2);
  function TrimmingMap2() {
    var initValueOrFn = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    _classCallCheck$S(this, TrimmingMap2);
    return _super.call(this, initValueOrFn);
  }
  _createClass$S(TrimmingMap2, [{
    key: "getTrimmedIndexes",
    value: function getTrimmedIndexes() {
      return arrayReduce(this.getValues(), function(indexesList, isTrimmed, physicalIndex) {
        if (isTrimmed) {
          indexesList.push(physicalIndex);
        }
        return indexesList;
      }, []);
    }
  }]);
  return TrimmingMap2;
}(PhysicalIndexToValueMap);

function _typeof$u(obj) {
  "@babel/helpers - typeof";
  return _typeof$u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$u(obj);
}
function _classCallCheck$T(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$T(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$T(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$T(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$T(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _get$2() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get$2 = Reflect.get;
  } else {
    _get$2 = function _get2(target, property, receiver) {
      var base = _superPropBase$2(target, property);
      if (!base)
        return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get$2.apply(this, arguments);
}
function _superPropBase$2(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf$n(object);
    if (object === null)
      break;
  }
  return object;
}
function _inherits$n(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$p(subClass, superClass);
}
function _setPrototypeOf$p(o, p) {
  _setPrototypeOf$p = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$p(o, p);
}
function _createSuper$n(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$p();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$n(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$n(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$n(this, result);
  };
}
function _possibleConstructorReturn$n(self, call) {
  if (call && (_typeof$u(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$n(self);
}
function _assertThisInitialized$n(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$p() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$n(o) {
  _getPrototypeOf$n = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$n(o);
}
var IndexesSequence = /* @__PURE__ */ function(_IndexMap) {
  _inherits$n(IndexesSequence2, _IndexMap);
  var _super = _createSuper$n(IndexesSequence2);
  function IndexesSequence2() {
    _classCallCheck$T(this, IndexesSequence2);
    return _super.call(this, function(index) {
      return index;
    });
  }
  _createClass$T(IndexesSequence2, [{
    key: "insert",
    value: function insert(insertionIndex, insertedIndexes) {
      var listAfterUpdate = getIncreasedIndexes(this.indexedValues, insertedIndexes);
      this.indexedValues = getListWithInsertedItems$1(listAfterUpdate, insertionIndex, insertedIndexes);
      _get$2(_getPrototypeOf$n(IndexesSequence2.prototype), "insert", this).call(this, insertionIndex, insertedIndexes);
    }
  }, {
    key: "remove",
    value: function remove(removedIndexes) {
      var listAfterUpdate = getListWithRemovedItems$1(this.indexedValues, removedIndexes);
      this.indexedValues = getDecreasedIndexes(listAfterUpdate, removedIndexes);
      _get$2(_getPrototypeOf$n(IndexesSequence2.prototype), "remove", this).call(this, removedIndexes);
    }
  }]);
  return IndexesSequence2;
}(IndexMap);

var availableIndexMapTypes = new Map([["hiding", HidingMap], ["index", IndexMap], ["linkedPhysicalIndexToValue", LinkedPhysicalIndexToValueMap], ["physicalIndexToValue", PhysicalIndexToValueMap], ["trimming", TrimmingMap]]);
function createIndexMap(mapType) {
  var initValueOrFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if (!availableIndexMapTypes.has(mapType)) {
    throw new Error('The provided map type ("'.concat(mapType, '") does not exist.'));
  }
  return new (availableIndexMapTypes.get(mapType))(initValueOrFn);
}

function _classCallCheck$U(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$U(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$U(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$U(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$U(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var MapCollection = /* @__PURE__ */ function() {
  function MapCollection2() {
    _classCallCheck$U(this, MapCollection2);
    this.collection = new Map();
  }
  _createClass$U(MapCollection2, [{
    key: "register",
    value: function register(uniqueName, indexMap) {
      var _this = this;
      if (this.collection.has(uniqueName) === false) {
        this.collection.set(uniqueName, indexMap);
        indexMap.addLocalHook("change", function() {
          return _this.runLocalHooks("change", indexMap);
        });
      }
    }
  }, {
    key: "unregister",
    value: function unregister(name) {
      var indexMap = this.collection.get(name);
      if (isDefined(indexMap)) {
        indexMap.destroy();
        this.collection.delete(name);
        this.runLocalHooks("change", indexMap);
      }
    }
  }, {
    key: "unregisterAll",
    value: function unregisterAll() {
      var _this2 = this;
      this.collection.forEach(function(indexMap, name) {
        return _this2.unregister(name);
      });
      this.collection.clear();
    }
  }, {
    key: "get",
    value: function get(name) {
      if (isUndefined(name)) {
        return Array.from(this.collection.values());
      }
      return this.collection.get(name);
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.collection.size;
    }
  }, {
    key: "removeFromEvery",
    value: function removeFromEvery(removedIndexes) {
      this.collection.forEach(function(indexMap) {
        indexMap.remove(removedIndexes);
      });
    }
  }, {
    key: "insertToEvery",
    value: function insertToEvery(insertionIndex, insertedIndexes) {
      this.collection.forEach(function(indexMap) {
        indexMap.insert(insertionIndex, insertedIndexes);
      });
    }
  }, {
    key: "initEvery",
    value: function initEvery(length) {
      this.collection.forEach(function(indexMap) {
        indexMap.init(length);
      });
    }
  }]);
  return MapCollection2;
}();
mixin(MapCollection, localHooks);

function _typeof$v(obj) {
  "@babel/helpers - typeof";
  return _typeof$v = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$v(obj);
}
function _classCallCheck$V(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$V(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$V(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$V(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$V(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _inherits$o(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$q(subClass, superClass);
}
function _setPrototypeOf$q(o, p) {
  _setPrototypeOf$q = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$q(o, p);
}
function _createSuper$o(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$q();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$o(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$o(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$o(this, result);
  };
}
function _possibleConstructorReturn$o(self, call) {
  if (call && (_typeof$v(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$o(self);
}
function _assertThisInitialized$o(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$q() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$o(o) {
  _getPrototypeOf$o = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$o(o);
}
var AggregatedCollection = /* @__PURE__ */ function(_MapCollection) {
  _inherits$o(AggregatedCollection2, _MapCollection);
  var _super = _createSuper$o(AggregatedCollection2);
  function AggregatedCollection2(aggregationFunction, fallbackValue) {
    var _this;
    _classCallCheck$V(this, AggregatedCollection2);
    _this = _super.call(this);
    _this.mergedValuesCache = [];
    _this.aggregationFunction = aggregationFunction;
    _this.fallbackValue = fallbackValue;
    return _this;
  }
  _createClass$V(AggregatedCollection2, [{
    key: "getMergedValues",
    value: function getMergedValues() {
      var readFromCache = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (readFromCache === true) {
        return this.mergedValuesCache;
      }
      if (this.getLength() === 0) {
        return [];
      }
      var mapsValuesMatrix = arrayMap(this.get(), function(map) {
        return map.getValues();
      });
      var indexesValuesMatrix = [];
      var mapsLength = isDefined(mapsValuesMatrix[0]) && mapsValuesMatrix[0].length || 0;
      for (var index = 0; index < mapsLength; index += 1) {
        var valuesForIndex = [];
        for (var mapIndex = 0; mapIndex < this.getLength(); mapIndex += 1) {
          valuesForIndex.push(mapsValuesMatrix[mapIndex][index]);
        }
        indexesValuesMatrix.push(valuesForIndex);
      }
      return arrayMap(indexesValuesMatrix, this.aggregationFunction);
    }
  }, {
    key: "getMergedValueAtIndex",
    value: function getMergedValueAtIndex(index, readFromCache) {
      var valueAtIndex = this.getMergedValues(readFromCache)[index];
      return isDefined(valueAtIndex) ? valueAtIndex : this.fallbackValue;
    }
  }, {
    key: "updateCache",
    value: function updateCache() {
      this.mergedValuesCache = this.getMergedValues(false);
    }
  }]);
  return AggregatedCollection2;
}(MapCollection);

function _classCallCheck$W(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$W(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$W(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$W(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$W(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classPrivateFieldInitSpec$2(obj, privateMap, value) {
  _checkPrivateRedeclaration$2(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration$2(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldSet$2(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor$2(receiver, privateMap, "set");
  _classApplyDescriptorSet$2(receiver, descriptor, value);
  return value;
}
function _classApplyDescriptorSet$2(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateFieldGet$2(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor$2(receiver, privateMap, "get");
  return _classApplyDescriptorGet$2(receiver, descriptor);
}
function _classExtractFieldDescriptor$2(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet$2(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
var _currentInitialChanges = /* @__PURE__ */ new WeakMap();
var ChangesObserver = /* @__PURE__ */ function() {
  function ChangesObserver2() {
    _classCallCheck$W(this, ChangesObserver2);
    _classPrivateFieldInitSpec$2(this, _currentInitialChanges, {
      writable: true,
      value: []
    });
  }
  _createClass$W(ChangesObserver2, [{
    key: "subscribe",
    value: function subscribe(callback) {
      this.addLocalHook("change", callback);
      this._write(_classPrivateFieldGet$2(this, _currentInitialChanges));
      return this;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      this.runLocalHooks("unsubscribe");
      this.clearLocalHooks();
      return this;
    }
  }, {
    key: "_write",
    value: function _write(changes) {
      if (changes.length > 0) {
        this.runLocalHooks("change", changes);
      }
      return this;
    }
  }, {
    key: "_writeInitialChanges",
    value: function _writeInitialChanges(initialChanges) {
      _classPrivateFieldSet$2(this, _currentInitialChanges, initialChanges);
    }
  }]);
  return ChangesObserver2;
}();
mixin(ChangesObserver, localHooks);

function arrayDiff(baseArray, newArray) {
  var changes = [];
  var i = 0;
  var j = 0;
  for (; i < baseArray.length && j < newArray.length; i++, j++) {
    if (baseArray[i] !== newArray[j]) {
      changes.push({
        op: "replace",
        index: j,
        oldValue: baseArray[i],
        newValue: newArray[j]
      });
    }
  }
  for (; i < newArray.length; i++) {
    changes.push({
      op: "insert",
      index: i,
      oldValue: void 0,
      newValue: newArray[i]
    });
  }
  for (; j < baseArray.length; j++) {
    changes.push({
      op: "remove",
      index: j,
      oldValue: baseArray[j],
      newValue: void 0
    });
  }
  return changes;
}

function _classCallCheck$X(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$X(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$X(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$X(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$X(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classPrivateFieldInitSpec$3(obj, privateMap, value) {
  _checkPrivateRedeclaration$3(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration$3(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldGet$3(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor$3(receiver, privateMap, "get");
  return _classApplyDescriptorGet$3(receiver, descriptor);
}
function _classApplyDescriptorGet$3(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classPrivateFieldSet$3(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor$3(receiver, privateMap, "set");
  _classApplyDescriptorSet$3(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor$3(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorSet$3(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
var _observers = /* @__PURE__ */ new WeakMap();
var _indexMatrix = /* @__PURE__ */ new WeakMap();
var _currentIndexState = /* @__PURE__ */ new WeakMap();
var _isMatrixIndexesInitialized = /* @__PURE__ */ new WeakMap();
var _initialIndexValue = /* @__PURE__ */ new WeakMap();
var ChangesObservable = /* @__PURE__ */ function() {
  function ChangesObservable2() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, initialIndexValue = _ref.initialIndexValue;
    _classCallCheck$X(this, ChangesObservable2);
    _classPrivateFieldInitSpec$3(this, _observers, {
      writable: true,
      value: new Set()
    });
    _classPrivateFieldInitSpec$3(this, _indexMatrix, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec$3(this, _currentIndexState, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec$3(this, _isMatrixIndexesInitialized, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec$3(this, _initialIndexValue, {
      writable: true,
      value: false
    });
    _classPrivateFieldSet$3(this, _initialIndexValue, initialIndexValue !== null && initialIndexValue !== void 0 ? initialIndexValue : false);
  }
  _createClass$X(ChangesObservable2, [{
    key: "createObserver",
    value: function createObserver() {
      var _this = this;
      var observer = new ChangesObserver();
      _classPrivateFieldGet$3(this, _observers).add(observer);
      observer.addLocalHook("unsubscribe", function() {
        _classPrivateFieldGet$3(_this, _observers).delete(observer);
      });
      observer._writeInitialChanges(arrayDiff(_classPrivateFieldGet$3(this, _indexMatrix), _classPrivateFieldGet$3(this, _currentIndexState)));
      return observer;
    }
  }, {
    key: "emit",
    value: function emit(indexesState) {
      var currentIndexState = _classPrivateFieldGet$3(this, _currentIndexState);
      if (!_classPrivateFieldGet$3(this, _isMatrixIndexesInitialized) || _classPrivateFieldGet$3(this, _indexMatrix).length !== indexesState.length) {
        if (indexesState.length === 0) {
          indexesState = new Array(currentIndexState.length).fill(_classPrivateFieldGet$3(this, _initialIndexValue));
        } else {
          _classPrivateFieldSet$3(this, _indexMatrix, new Array(indexesState.length).fill(_classPrivateFieldGet$3(this, _initialIndexValue)));
        }
        if (!_classPrivateFieldGet$3(this, _isMatrixIndexesInitialized)) {
          _classPrivateFieldSet$3(this, _isMatrixIndexesInitialized, true);
          currentIndexState = _classPrivateFieldGet$3(this, _indexMatrix);
        }
      }
      var changes = arrayDiff(currentIndexState, indexesState);
      _classPrivateFieldGet$3(this, _observers).forEach(function(observer) {
        return observer._write(changes);
      });
      _classPrivateFieldSet$3(this, _currentIndexState, indexesState);
    }
  }]);
  return ChangesObservable2;
}();

function _toConsumableArray$e(arr) {
  return _arrayWithoutHoles$e(arr) || _iterableToArray$e(arr) || _unsupportedIterableToArray$h(arr) || _nonIterableSpread$e();
}
function _nonIterableSpread$e() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$h(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$h(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$h(o, minLen);
}
function _iterableToArray$e(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$e(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$h(arr);
}
function _arrayLikeToArray$h(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _classCallCheck$Y(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$Y(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$Y(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$Y(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$Y(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var IndexMapper = /* @__PURE__ */ function() {
  function IndexMapper2() {
    var _this = this;
    _classCallCheck$Y(this, IndexMapper2);
    this.indexesSequence = new IndexesSequence();
    this.trimmingMapsCollection = new AggregatedCollection(function(valuesForIndex) {
      return valuesForIndex.some(function(value) {
        return value === true;
      });
    }, false);
    this.hidingMapsCollection = new AggregatedCollection(function(valuesForIndex) {
      return valuesForIndex.some(function(value) {
        return value === true;
      });
    }, false);
    this.variousMapsCollection = new MapCollection();
    this.hidingChangesObservable = new ChangesObservable({
      initialIndexValue: false
    });
    this.notTrimmedIndexesCache = [];
    this.notHiddenIndexesCache = [];
    this.isBatched = false;
    this.indexesSequenceChanged = false;
    this.trimmedIndexesChanged = false;
    this.hiddenIndexesChanged = false;
    this.renderablePhysicalIndexesCache = [];
    this.fromPhysicalToVisualIndexesCache = new Map();
    this.fromVisualToRenderableIndexesCache = new Map();
    this.indexesSequence.addLocalHook("change", function() {
      _this.indexesSequenceChanged = true;
      _this.updateCache();
      _this.runLocalHooks("change", _this.indexesSequence, null);
    });
    this.trimmingMapsCollection.addLocalHook("change", function(changedMap) {
      _this.trimmedIndexesChanged = true;
      _this.updateCache();
      _this.runLocalHooks("change", changedMap, _this.trimmingMapsCollection);
    });
    this.hidingMapsCollection.addLocalHook("change", function(changedMap) {
      _this.hiddenIndexesChanged = true;
      _this.updateCache();
      _this.runLocalHooks("change", changedMap, _this.hidingMapsCollection);
    });
    this.variousMapsCollection.addLocalHook("change", function(changedMap) {
      _this.runLocalHooks("change", changedMap, _this.variousMapsCollection);
    });
  }
  _createClass$Y(IndexMapper2, [{
    key: "suspendOperations",
    value: function suspendOperations() {
      this.isBatched = true;
    }
  }, {
    key: "resumeOperations",
    value: function resumeOperations() {
      this.isBatched = false;
      this.updateCache();
    }
  }, {
    key: "createChangesObserver",
    value: function createChangesObserver(indexMapType) {
      if (indexMapType !== "hiding") {
        throw new Error('Unsupported index map type "'.concat(indexMapType, '".'));
      }
      return this.hidingChangesObservable.createObserver();
    }
  }, {
    key: "createAndRegisterIndexMap",
    value: function createAndRegisterIndexMap(indexName, mapType, initValueOrFn) {
      return this.registerMap(indexName, createIndexMap(mapType, initValueOrFn));
    }
  }, {
    key: "registerMap",
    value: function registerMap(uniqueName, indexMap) {
      if (this.trimmingMapsCollection.get(uniqueName) || this.hidingMapsCollection.get(uniqueName) || this.variousMapsCollection.get(uniqueName)) {
        throw Error('Map with name "'.concat(uniqueName, '" has been already registered.'));
      }
      if (indexMap instanceof TrimmingMap) {
        this.trimmingMapsCollection.register(uniqueName, indexMap);
      } else if (indexMap instanceof HidingMap) {
        this.hidingMapsCollection.register(uniqueName, indexMap);
      } else {
        this.variousMapsCollection.register(uniqueName, indexMap);
      }
      var numberOfIndexes = this.getNumberOfIndexes();
      if (numberOfIndexes > 0) {
        indexMap.init(numberOfIndexes);
      }
      return indexMap;
    }
  }, {
    key: "unregisterMap",
    value: function unregisterMap(name) {
      this.trimmingMapsCollection.unregister(name);
      this.hidingMapsCollection.unregister(name);
      this.variousMapsCollection.unregister(name);
    }
  }, {
    key: "unregisterAll",
    value: function unregisterAll() {
      this.trimmingMapsCollection.unregisterAll();
      this.hidingMapsCollection.unregisterAll();
      this.variousMapsCollection.unregisterAll();
    }
  }, {
    key: "getPhysicalFromVisualIndex",
    value: function getPhysicalFromVisualIndex(visualIndex) {
      var physicalIndex = this.notTrimmedIndexesCache[visualIndex];
      if (isDefined(physicalIndex)) {
        return physicalIndex;
      }
      return null;
    }
  }, {
    key: "getPhysicalFromRenderableIndex",
    value: function getPhysicalFromRenderableIndex(renderableIndex) {
      var physicalIndex = this.renderablePhysicalIndexesCache[renderableIndex];
      if (isDefined(physicalIndex)) {
        return physicalIndex;
      }
      return null;
    }
  }, {
    key: "getVisualFromPhysicalIndex",
    value: function getVisualFromPhysicalIndex(physicalIndex) {
      var visualIndex = this.fromPhysicalToVisualIndexesCache.get(physicalIndex);
      if (isDefined(visualIndex)) {
        return visualIndex;
      }
      return null;
    }
  }, {
    key: "getVisualFromRenderableIndex",
    value: function getVisualFromRenderableIndex(renderableIndex) {
      return this.getVisualFromPhysicalIndex(this.getPhysicalFromRenderableIndex(renderableIndex));
    }
  }, {
    key: "getRenderableFromVisualIndex",
    value: function getRenderableFromVisualIndex(visualIndex) {
      var renderableIndex = this.fromVisualToRenderableIndexesCache.get(visualIndex);
      if (isDefined(renderableIndex)) {
        return renderableIndex;
      }
      return null;
    }
  }, {
    key: "getFirstNotHiddenIndex",
    value: function getFirstNotHiddenIndex(fromVisualIndex, incrementBy) {
      var searchAlsoOtherWayAround = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      var indexForNextSearch = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : fromVisualIndex - incrementBy;
      var physicalIndex = this.getPhysicalFromVisualIndex(fromVisualIndex);
      if (physicalIndex === null) {
        if (searchAlsoOtherWayAround === true && indexForNextSearch !== fromVisualIndex - incrementBy) {
          return this.getFirstNotHiddenIndex(indexForNextSearch, -incrementBy, false, indexForNextSearch);
        }
        return null;
      }
      if (this.isHidden(physicalIndex) === false) {
        return fromVisualIndex;
      }
      return this.getFirstNotHiddenIndex(fromVisualIndex + incrementBy, incrementBy, searchAlsoOtherWayAround, indexForNextSearch);
    }
  }, {
    key: "initToLength",
    value: function initToLength() {
      var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getNumberOfIndexes();
      this.notTrimmedIndexesCache = _toConsumableArray$e(new Array(length).keys());
      this.notHiddenIndexesCache = _toConsumableArray$e(new Array(length).keys());
      this.suspendOperations();
      this.indexesSequence.init(length);
      this.trimmingMapsCollection.initEvery(length);
      this.resumeOperations();
      this.suspendOperations();
      this.hidingMapsCollection.initEvery(length);
      this.variousMapsCollection.initEvery(length);
      this.resumeOperations();
      this.runLocalHooks("init");
    }
  }, {
    key: "fitToLength",
    value: function fitToLength(length) {
      var currentIndexCount = this.getNumberOfIndexes();
      if (length < currentIndexCount) {
        var indexesToBeRemoved = _toConsumableArray$e(Array(this.getNumberOfIndexes() - length).keys()).map(function(i) {
          return i + length;
        });
        this.removeIndexes(indexesToBeRemoved);
      } else {
        this.insertIndexes(currentIndexCount, length - currentIndexCount);
      }
    }
  }, {
    key: "getIndexesSequence",
    value: function getIndexesSequence() {
      return this.indexesSequence.getValues();
    }
  }, {
    key: "setIndexesSequence",
    value: function setIndexesSequence(indexes) {
      this.indexesSequence.setValues(indexes);
    }
  }, {
    key: "getNotTrimmedIndexes",
    value: function getNotTrimmedIndexes() {
      var _this2 = this;
      var readFromCache = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (readFromCache === true) {
        return this.notTrimmedIndexesCache;
      }
      var indexesSequence = this.getIndexesSequence();
      return indexesSequence.filter(function(physicalIndex) {
        return _this2.isTrimmed(physicalIndex) === false;
      });
    }
  }, {
    key: "getNotTrimmedIndexesLength",
    value: function getNotTrimmedIndexesLength() {
      return this.getNotTrimmedIndexes().length;
    }
  }, {
    key: "getNotHiddenIndexes",
    value: function getNotHiddenIndexes() {
      var _this3 = this;
      var readFromCache = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (readFromCache === true) {
        return this.notHiddenIndexesCache;
      }
      var indexesSequence = this.getIndexesSequence();
      return indexesSequence.filter(function(physicalIndex) {
        return _this3.isHidden(physicalIndex) === false;
      });
    }
  }, {
    key: "getNotHiddenIndexesLength",
    value: function getNotHiddenIndexesLength() {
      return this.getNotHiddenIndexes().length;
    }
  }, {
    key: "getRenderableIndexes",
    value: function getRenderableIndexes() {
      var _this4 = this;
      var readFromCache = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (readFromCache === true) {
        return this.renderablePhysicalIndexesCache;
      }
      var notTrimmedIndexes = this.getNotTrimmedIndexes();
      return notTrimmedIndexes.filter(function(physicalIndex) {
        return _this4.isHidden(physicalIndex) === false;
      });
    }
  }, {
    key: "getRenderableIndexesLength",
    value: function getRenderableIndexesLength() {
      return this.getRenderableIndexes().length;
    }
  }, {
    key: "getNumberOfIndexes",
    value: function getNumberOfIndexes() {
      return this.getIndexesSequence().length;
    }
  }, {
    key: "moveIndexes",
    value: function moveIndexes(movedIndexes, finalIndex) {
      var _this5 = this;
      if (typeof movedIndexes === "number") {
        movedIndexes = [movedIndexes];
      }
      var physicalMovedIndexes = arrayMap(movedIndexes, function(visualIndex) {
        return _this5.getPhysicalFromVisualIndex(visualIndex);
      });
      var notTrimmedIndexesLength = this.getNotTrimmedIndexesLength();
      var movedIndexesLength = movedIndexes.length;
      var listWithRemovedItems = getListWithRemovedItems$1(this.getIndexesSequence(), physicalMovedIndexes);
      var destinationPosition = notTrimmedIndexesLength - movedIndexesLength;
      if (finalIndex + movedIndexesLength < notTrimmedIndexesLength) {
        var physicalIndex = listWithRemovedItems.filter(function(index) {
          return _this5.isTrimmed(index) === false;
        })[finalIndex];
        destinationPosition = listWithRemovedItems.indexOf(physicalIndex);
      }
      this.setIndexesSequence(getListWithInsertedItems$1(listWithRemovedItems, destinationPosition, physicalMovedIndexes));
    }
  }, {
    key: "isTrimmed",
    value: function isTrimmed(physicalIndex) {
      return this.trimmingMapsCollection.getMergedValueAtIndex(physicalIndex);
    }
  }, {
    key: "isHidden",
    value: function isHidden(physicalIndex) {
      return this.hidingMapsCollection.getMergedValueAtIndex(physicalIndex);
    }
  }, {
    key: "insertIndexes",
    value: function insertIndexes(firstInsertedVisualIndex, amountOfIndexes) {
      var nthVisibleIndex = this.getNotTrimmedIndexes()[firstInsertedVisualIndex];
      var firstInsertedPhysicalIndex = isDefined(nthVisibleIndex) ? nthVisibleIndex : this.getNumberOfIndexes();
      var insertionIndex = this.getIndexesSequence().includes(nthVisibleIndex) ? this.getIndexesSequence().indexOf(nthVisibleIndex) : this.getNumberOfIndexes();
      var insertedIndexes = arrayMap(new Array(amountOfIndexes).fill(firstInsertedPhysicalIndex), function(nextIndex, stepsFromStart) {
        return nextIndex + stepsFromStart;
      });
      this.suspendOperations();
      this.indexesSequence.insert(insertionIndex, insertedIndexes);
      this.trimmingMapsCollection.insertToEvery(insertionIndex, insertedIndexes);
      this.hidingMapsCollection.insertToEvery(insertionIndex, insertedIndexes);
      this.variousMapsCollection.insertToEvery(insertionIndex, insertedIndexes);
      this.resumeOperations();
    }
  }, {
    key: "removeIndexes",
    value: function removeIndexes(removedIndexes) {
      this.suspendOperations();
      this.indexesSequence.remove(removedIndexes);
      this.trimmingMapsCollection.removeFromEvery(removedIndexes);
      this.hidingMapsCollection.removeFromEvery(removedIndexes);
      this.variousMapsCollection.removeFromEvery(removedIndexes);
      this.resumeOperations();
    }
  }, {
    key: "updateCache",
    value: function updateCache() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var anyCachedIndexChanged = this.indexesSequenceChanged || this.trimmedIndexesChanged || this.hiddenIndexesChanged;
      if (force === true || this.isBatched === false && anyCachedIndexChanged === true) {
        this.trimmingMapsCollection.updateCache();
        this.hidingMapsCollection.updateCache();
        this.notTrimmedIndexesCache = this.getNotTrimmedIndexes(false);
        this.notHiddenIndexesCache = this.getNotHiddenIndexes(false);
        this.renderablePhysicalIndexesCache = this.getRenderableIndexes(false);
        this.cacheFromPhysicalToVisualIndexes();
        this.cacheFromVisualToRenderabIendexes();
        if (this.hiddenIndexesChanged) {
          this.hidingChangesObservable.emit(this.hidingMapsCollection.getMergedValues());
        }
        this.runLocalHooks("cacheUpdated", {
          indexesSequenceChanged: this.indexesSequenceChanged,
          trimmedIndexesChanged: this.trimmedIndexesChanged,
          hiddenIndexesChanged: this.hiddenIndexesChanged
        });
        this.indexesSequenceChanged = false;
        this.trimmedIndexesChanged = false;
        this.hiddenIndexesChanged = false;
      }
    }
  }, {
    key: "cacheFromPhysicalToVisualIndexes",
    value: function cacheFromPhysicalToVisualIndexes() {
      var nrOfNotTrimmedIndexes = this.getNotTrimmedIndexesLength();
      this.fromPhysicalToVisualIndexesCache.clear();
      for (var visualIndex = 0; visualIndex < nrOfNotTrimmedIndexes; visualIndex += 1) {
        var physicalIndex = this.getPhysicalFromVisualIndex(visualIndex);
        this.fromPhysicalToVisualIndexesCache.set(physicalIndex, visualIndex);
      }
    }
  }, {
    key: "cacheFromVisualToRenderabIendexes",
    value: function cacheFromVisualToRenderabIendexes() {
      var nrOfRenderableIndexes = this.getRenderableIndexesLength();
      this.fromVisualToRenderableIndexesCache.clear();
      for (var renderableIndex = 0; renderableIndex < nrOfRenderableIndexes; renderableIndex += 1) {
        var physicalIndex = this.getPhysicalFromRenderableIndex(renderableIndex);
        var visualIndex = this.getVisualFromPhysicalIndex(physicalIndex);
        this.fromVisualToRenderableIndexesCache.set(visualIndex, renderableIndex);
      }
    }
  }]);
  return IndexMapper2;
}();
mixin(IndexMapper, localHooks);

var _templateObject$3;
function _taggedTemplateLiteral$3(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
function extendNotExistingKeys(target, extension) {
  objectEach(extension, function(value, key) {
    if (isUndefined(target[key])) {
      target[key] = value;
    }
  });
  return target;
}
function normalizeLanguageCode(languageCode) {
  var languageCodePattern = /^([a-zA-Z]{2})-([a-zA-Z]{2})$/;
  var partsOfLanguageCode = languageCodePattern.exec(languageCode);
  if (partsOfLanguageCode) {
    return "".concat(partsOfLanguageCode[1].toLowerCase(), "-").concat(partsOfLanguageCode[2].toUpperCase());
  }
  return languageCode;
}
function warnUserAboutLanguageRegistration(languageCode) {
  if (isDefined(languageCode)) {
    error(toSingleLine(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral$3(['Language with code "', '" was not found. You should register particular language \n    before using it. Read more about this issue at: https://docs.handsontable.com/i18n/missing-language-code.'], ['Language with code "', '" was not found. You should register particular language\\x20\n    before using it. Read more about this issue at: https://docs.handsontable.com/i18n/missing-language-code.'])), languageCode));
  }
}

function pluralize(phrasePropositions, pluralForm) {
  var isPluralizable = Array.isArray(phrasePropositions) && Number.isInteger(pluralForm);
  if (isPluralizable) {
    return phrasePropositions[pluralForm];
  }
  return phrasePropositions;
}

var _staticRegister$4 = staticRegister("phraseFormatters"), registerGloballyPhraseFormatter = _staticRegister$4.register, getGlobalPhraseFormatters = _staticRegister$4.getValues;
function register$4(name, formatterFn) {
  registerGloballyPhraseFormatter(name, formatterFn);
}
function getAll() {
  return getGlobalPhraseFormatters();
}
register$4("pluralize", pluralize);

var CONTEXT_MENU_ITEMS_NAMESPACE = "ContextMenu:items";
var CONTEXTMENU_ITEMS_NO_ITEMS = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".noItems");
var CONTEXTMENU_ITEMS_ROW_ABOVE = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".insertRowAbove");
var CONTEXTMENU_ITEMS_ROW_BELOW = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".insertRowBelow");
var CONTEXTMENU_ITEMS_INSERT_LEFT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".insertColumnOnTheLeft");
var CONTEXTMENU_ITEMS_INSERT_RIGHT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".insertColumnOnTheRight");
var CONTEXTMENU_ITEMS_REMOVE_ROW = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".removeRow");
var CONTEXTMENU_ITEMS_REMOVE_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".removeColumn");
var CONTEXTMENU_ITEMS_UNDO = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".undo");
var CONTEXTMENU_ITEMS_REDO = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".redo");
var CONTEXTMENU_ITEMS_READ_ONLY = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".readOnly");
var CONTEXTMENU_ITEMS_CLEAR_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".clearColumn");
var CONTEXTMENU_ITEMS_COPY = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".copy");
var CONTEXTMENU_ITEMS_CUT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".cut");
var CONTEXTMENU_ITEMS_FREEZE_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".freezeColumn");
var CONTEXTMENU_ITEMS_UNFREEZE_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".unfreezeColumn");
var CONTEXTMENU_ITEMS_MERGE_CELLS = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".mergeCells");
var CONTEXTMENU_ITEMS_UNMERGE_CELLS = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".unmergeCells");
var CONTEXTMENU_ITEMS_ADD_COMMENT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".addComment");
var CONTEXTMENU_ITEMS_EDIT_COMMENT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".editComment");
var CONTEXTMENU_ITEMS_REMOVE_COMMENT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".removeComment");
var CONTEXTMENU_ITEMS_READ_ONLY_COMMENT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".readOnlyComment");
var CONTEXTMENU_ITEMS_ALIGNMENT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align");
var CONTEXTMENU_ITEMS_ALIGNMENT_LEFT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.left");
var CONTEXTMENU_ITEMS_ALIGNMENT_CENTER = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.center");
var CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.right");
var CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.justify");
var CONTEXTMENU_ITEMS_ALIGNMENT_TOP = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.top");
var CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.middle");
var CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".align.bottom");
var CONTEXTMENU_ITEMS_BORDERS = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders");
var CONTEXTMENU_ITEMS_BORDERS_TOP = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders.top");
var CONTEXTMENU_ITEMS_BORDERS_RIGHT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders.right");
var CONTEXTMENU_ITEMS_BORDERS_BOTTOM = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders.bottom");
var CONTEXTMENU_ITEMS_BORDERS_LEFT = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders.left");
var CONTEXTMENU_ITEMS_REMOVE_BORDERS = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".borders.remove");
var CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".nestedHeaders.insertChildRow");
var CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".nestedHeaders.detachFromParent");
var CONTEXTMENU_ITEMS_HIDE_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".hideColumn");
var CONTEXTMENU_ITEMS_SHOW_COLUMN = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".showColumn");
var CONTEXTMENU_ITEMS_HIDE_ROW = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".hideRow");
var CONTEXTMENU_ITEMS_SHOW_ROW = "".concat(CONTEXT_MENU_ITEMS_NAMESPACE, ".showRow");
var FILTERS_NAMESPACE = "Filters:";
var FILTERS_CONDITIONS_NAMESPACE = "".concat(FILTERS_NAMESPACE, "conditions");
var FILTERS_CONDITIONS_NONE = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".none");
var FILTERS_CONDITIONS_EMPTY = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isEmpty");
var FILTERS_CONDITIONS_NOT_EMPTY = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isNotEmpty");
var FILTERS_CONDITIONS_EQUAL = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isEqualTo");
var FILTERS_CONDITIONS_NOT_EQUAL = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isNotEqualTo");
var FILTERS_CONDITIONS_BEGINS_WITH = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".beginsWith");
var FILTERS_CONDITIONS_ENDS_WITH = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".endsWith");
var FILTERS_CONDITIONS_CONTAINS = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".contains");
var FILTERS_CONDITIONS_NOT_CONTAIN = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".doesNotContain");
var FILTERS_CONDITIONS_BY_VALUE = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".byValue");
var FILTERS_CONDITIONS_GREATER_THAN = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".greaterThan");
var FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".greaterThanOrEqualTo");
var FILTERS_CONDITIONS_LESS_THAN = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".lessThan");
var FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".lessThanOrEqualTo");
var FILTERS_CONDITIONS_BETWEEN = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isBetween");
var FILTERS_CONDITIONS_NOT_BETWEEN = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".isNotBetween");
var FILTERS_CONDITIONS_AFTER = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".after");
var FILTERS_CONDITIONS_BEFORE = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".before");
var FILTERS_CONDITIONS_TODAY = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".today");
var FILTERS_CONDITIONS_TOMORROW = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".tomorrow");
var FILTERS_CONDITIONS_YESTERDAY = "".concat(FILTERS_CONDITIONS_NAMESPACE, ".yesterday");
var FILTERS_DIVS_FILTER_BY_CONDITION = "".concat(FILTERS_NAMESPACE, "labels.filterByCondition");
var FILTERS_DIVS_FILTER_BY_VALUE = "".concat(FILTERS_NAMESPACE, "labels.filterByValue");
var FILTERS_LABELS_CONJUNCTION = "".concat(FILTERS_NAMESPACE, "labels.conjunction");
var FILTERS_LABELS_DISJUNCTION = "".concat(FILTERS_NAMESPACE, "labels.disjunction");
var FILTERS_VALUES_BLANK_CELLS = "".concat(FILTERS_NAMESPACE, "values.blankCells");
var FILTERS_BUTTONS_SELECT_ALL = "".concat(FILTERS_NAMESPACE, "buttons.selectAll");
var FILTERS_BUTTONS_CLEAR = "".concat(FILTERS_NAMESPACE, "buttons.clear");
var FILTERS_BUTTONS_OK = "".concat(FILTERS_NAMESPACE, "buttons.ok");
var FILTERS_BUTTONS_CANCEL = "".concat(FILTERS_NAMESPACE, "buttons.cancel");
var FILTERS_BUTTONS_PLACEHOLDER_SEARCH = "".concat(FILTERS_NAMESPACE, "buttons.placeholder.search");
var FILTERS_BUTTONS_PLACEHOLDER_VALUE = "".concat(FILTERS_NAMESPACE, "buttons.placeholder.value");
var FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE = "".concat(FILTERS_NAMESPACE, "buttons.placeholder.secondValue");

var dictionaryKeys = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CONTEXT_MENU_ITEMS_NAMESPACE: CONTEXT_MENU_ITEMS_NAMESPACE,
  CONTEXTMENU_ITEMS_NO_ITEMS: CONTEXTMENU_ITEMS_NO_ITEMS,
  CONTEXTMENU_ITEMS_ROW_ABOVE: CONTEXTMENU_ITEMS_ROW_ABOVE,
  CONTEXTMENU_ITEMS_ROW_BELOW: CONTEXTMENU_ITEMS_ROW_BELOW,
  CONTEXTMENU_ITEMS_INSERT_LEFT: CONTEXTMENU_ITEMS_INSERT_LEFT,
  CONTEXTMENU_ITEMS_INSERT_RIGHT: CONTEXTMENU_ITEMS_INSERT_RIGHT,
  CONTEXTMENU_ITEMS_REMOVE_ROW: CONTEXTMENU_ITEMS_REMOVE_ROW,
  CONTEXTMENU_ITEMS_REMOVE_COLUMN: CONTEXTMENU_ITEMS_REMOVE_COLUMN,
  CONTEXTMENU_ITEMS_UNDO: CONTEXTMENU_ITEMS_UNDO,
  CONTEXTMENU_ITEMS_REDO: CONTEXTMENU_ITEMS_REDO,
  CONTEXTMENU_ITEMS_READ_ONLY: CONTEXTMENU_ITEMS_READ_ONLY,
  CONTEXTMENU_ITEMS_CLEAR_COLUMN: CONTEXTMENU_ITEMS_CLEAR_COLUMN,
  CONTEXTMENU_ITEMS_COPY: CONTEXTMENU_ITEMS_COPY,
  CONTEXTMENU_ITEMS_CUT: CONTEXTMENU_ITEMS_CUT,
  CONTEXTMENU_ITEMS_FREEZE_COLUMN: CONTEXTMENU_ITEMS_FREEZE_COLUMN,
  CONTEXTMENU_ITEMS_UNFREEZE_COLUMN: CONTEXTMENU_ITEMS_UNFREEZE_COLUMN,
  CONTEXTMENU_ITEMS_MERGE_CELLS: CONTEXTMENU_ITEMS_MERGE_CELLS,
  CONTEXTMENU_ITEMS_UNMERGE_CELLS: CONTEXTMENU_ITEMS_UNMERGE_CELLS,
  CONTEXTMENU_ITEMS_ADD_COMMENT: CONTEXTMENU_ITEMS_ADD_COMMENT,
  CONTEXTMENU_ITEMS_EDIT_COMMENT: CONTEXTMENU_ITEMS_EDIT_COMMENT,
  CONTEXTMENU_ITEMS_REMOVE_COMMENT: CONTEXTMENU_ITEMS_REMOVE_COMMENT,
  CONTEXTMENU_ITEMS_READ_ONLY_COMMENT: CONTEXTMENU_ITEMS_READ_ONLY_COMMENT,
  CONTEXTMENU_ITEMS_ALIGNMENT: CONTEXTMENU_ITEMS_ALIGNMENT,
  CONTEXTMENU_ITEMS_ALIGNMENT_LEFT: CONTEXTMENU_ITEMS_ALIGNMENT_LEFT,
  CONTEXTMENU_ITEMS_ALIGNMENT_CENTER: CONTEXTMENU_ITEMS_ALIGNMENT_CENTER,
  CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT: CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT,
  CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY: CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY,
  CONTEXTMENU_ITEMS_ALIGNMENT_TOP: CONTEXTMENU_ITEMS_ALIGNMENT_TOP,
  CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE: CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE,
  CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM: CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM,
  CONTEXTMENU_ITEMS_BORDERS: CONTEXTMENU_ITEMS_BORDERS,
  CONTEXTMENU_ITEMS_BORDERS_TOP: CONTEXTMENU_ITEMS_BORDERS_TOP,
  CONTEXTMENU_ITEMS_BORDERS_RIGHT: CONTEXTMENU_ITEMS_BORDERS_RIGHT,
  CONTEXTMENU_ITEMS_BORDERS_BOTTOM: CONTEXTMENU_ITEMS_BORDERS_BOTTOM,
  CONTEXTMENU_ITEMS_BORDERS_LEFT: CONTEXTMENU_ITEMS_BORDERS_LEFT,
  CONTEXTMENU_ITEMS_REMOVE_BORDERS: CONTEXTMENU_ITEMS_REMOVE_BORDERS,
  CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD: CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD,
  CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD: CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD,
  CONTEXTMENU_ITEMS_HIDE_COLUMN: CONTEXTMENU_ITEMS_HIDE_COLUMN,
  CONTEXTMENU_ITEMS_SHOW_COLUMN: CONTEXTMENU_ITEMS_SHOW_COLUMN,
  CONTEXTMENU_ITEMS_HIDE_ROW: CONTEXTMENU_ITEMS_HIDE_ROW,
  CONTEXTMENU_ITEMS_SHOW_ROW: CONTEXTMENU_ITEMS_SHOW_ROW,
  FILTERS_NAMESPACE: FILTERS_NAMESPACE,
  FILTERS_CONDITIONS_NAMESPACE: FILTERS_CONDITIONS_NAMESPACE,
  FILTERS_CONDITIONS_NONE: FILTERS_CONDITIONS_NONE,
  FILTERS_CONDITIONS_EMPTY: FILTERS_CONDITIONS_EMPTY,
  FILTERS_CONDITIONS_NOT_EMPTY: FILTERS_CONDITIONS_NOT_EMPTY,
  FILTERS_CONDITIONS_EQUAL: FILTERS_CONDITIONS_EQUAL,
  FILTERS_CONDITIONS_NOT_EQUAL: FILTERS_CONDITIONS_NOT_EQUAL,
  FILTERS_CONDITIONS_BEGINS_WITH: FILTERS_CONDITIONS_BEGINS_WITH,
  FILTERS_CONDITIONS_ENDS_WITH: FILTERS_CONDITIONS_ENDS_WITH,
  FILTERS_CONDITIONS_CONTAINS: FILTERS_CONDITIONS_CONTAINS,
  FILTERS_CONDITIONS_NOT_CONTAIN: FILTERS_CONDITIONS_NOT_CONTAIN,
  FILTERS_CONDITIONS_BY_VALUE: FILTERS_CONDITIONS_BY_VALUE,
  FILTERS_CONDITIONS_GREATER_THAN: FILTERS_CONDITIONS_GREATER_THAN,
  FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL: FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL,
  FILTERS_CONDITIONS_LESS_THAN: FILTERS_CONDITIONS_LESS_THAN,
  FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL: FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL,
  FILTERS_CONDITIONS_BETWEEN: FILTERS_CONDITIONS_BETWEEN,
  FILTERS_CONDITIONS_NOT_BETWEEN: FILTERS_CONDITIONS_NOT_BETWEEN,
  FILTERS_CONDITIONS_AFTER: FILTERS_CONDITIONS_AFTER,
  FILTERS_CONDITIONS_BEFORE: FILTERS_CONDITIONS_BEFORE,
  FILTERS_CONDITIONS_TODAY: FILTERS_CONDITIONS_TODAY,
  FILTERS_CONDITIONS_TOMORROW: FILTERS_CONDITIONS_TOMORROW,
  FILTERS_CONDITIONS_YESTERDAY: FILTERS_CONDITIONS_YESTERDAY,
  FILTERS_DIVS_FILTER_BY_CONDITION: FILTERS_DIVS_FILTER_BY_CONDITION,
  FILTERS_DIVS_FILTER_BY_VALUE: FILTERS_DIVS_FILTER_BY_VALUE,
  FILTERS_LABELS_CONJUNCTION: FILTERS_LABELS_CONJUNCTION,
  FILTERS_LABELS_DISJUNCTION: FILTERS_LABELS_DISJUNCTION,
  FILTERS_VALUES_BLANK_CELLS: FILTERS_VALUES_BLANK_CELLS,
  FILTERS_BUTTONS_SELECT_ALL: FILTERS_BUTTONS_SELECT_ALL,
  FILTERS_BUTTONS_CLEAR: FILTERS_BUTTONS_CLEAR,
  FILTERS_BUTTONS_OK: FILTERS_BUTTONS_OK,
  FILTERS_BUTTONS_CANCEL: FILTERS_BUTTONS_CANCEL,
  FILTERS_BUTTONS_PLACEHOLDER_SEARCH: FILTERS_BUTTONS_PLACEHOLDER_SEARCH,
  FILTERS_BUTTONS_PLACEHOLDER_VALUE: FILTERS_BUTTONS_PLACEHOLDER_VALUE,
  FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE: FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE
});

var _dictionary;
function _defineProperty$e(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var dictionary = (_dictionary = {
  languageCode: "en-US"
}, _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_NO_ITEMS, "No available options"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ROW_ABOVE, "Insert row above"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ROW_BELOW, "Insert row below"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_INSERT_LEFT, "Insert column left"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_INSERT_RIGHT, "Insert column right"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_REMOVE_ROW, ["Remove row", "Remove rows"]), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_REMOVE_COLUMN, ["Remove column", "Remove columns"]), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_UNDO, "Undo"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_REDO, "Redo"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_READ_ONLY, "Read only"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_CLEAR_COLUMN, "Clear column"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT, "Alignment"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_LEFT, "Left"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_CENTER, "Center"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT, "Right"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY, "Justify"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_TOP, "Top"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE, "Middle"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM, "Bottom"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_FREEZE_COLUMN, "Freeze column"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_UNFREEZE_COLUMN, "Unfreeze column"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_BORDERS, "Borders"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_BORDERS_TOP, "Top"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_BORDERS_RIGHT, "Right"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_BORDERS_BOTTOM, "Bottom"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_BORDERS_LEFT, "Left"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_REMOVE_BORDERS, "Remove border(s)"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_ADD_COMMENT, "Add comment"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_EDIT_COMMENT, "Edit comment"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_REMOVE_COMMENT, "Delete comment"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_READ_ONLY_COMMENT, "Read-only comment"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_MERGE_CELLS, "Merge cells"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_UNMERGE_CELLS, "Unmerge cells"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_COPY, "Copy"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_CUT, "Cut"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD, "Insert child row"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD, "Detach from parent"), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_HIDE_COLUMN, ["Hide column", "Hide columns"]), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_SHOW_COLUMN, ["Show column", "Show columns"]), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_HIDE_ROW, ["Hide row", "Hide rows"]), _defineProperty$e(_dictionary, CONTEXTMENU_ITEMS_SHOW_ROW, ["Show row", "Show rows"]), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_NONE, "None"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_EMPTY, "Is empty"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_NOT_EMPTY, "Is not empty"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_EQUAL, "Is equal to"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_NOT_EQUAL, "Is not equal to"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_BEGINS_WITH, "Begins with"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_ENDS_WITH, "Ends with"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_CONTAINS, "Contains"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_NOT_CONTAIN, "Does not contain"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_GREATER_THAN, "Greater than"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL, "Greater than or equal to"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_LESS_THAN, "Less than"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL, "Less than or equal to"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_BETWEEN, "Is between"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_NOT_BETWEEN, "Is not between"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_AFTER, "After"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_BEFORE, "Before"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_TODAY, "Today"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_TOMORROW, "Tomorrow"), _defineProperty$e(_dictionary, FILTERS_CONDITIONS_YESTERDAY, "Yesterday"), _defineProperty$e(_dictionary, FILTERS_VALUES_BLANK_CELLS, "Blank cells"), _defineProperty$e(_dictionary, FILTERS_DIVS_FILTER_BY_CONDITION, "Filter by condition"), _defineProperty$e(_dictionary, FILTERS_DIVS_FILTER_BY_VALUE, "Filter by value"), _defineProperty$e(_dictionary, FILTERS_LABELS_CONJUNCTION, "And"), _defineProperty$e(_dictionary, FILTERS_LABELS_DISJUNCTION, "Or"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_SELECT_ALL, "Select all"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_CLEAR, "Clear"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_OK, "OK"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_CANCEL, "Cancel"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_PLACEHOLDER_SEARCH, "Search"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_PLACEHOLDER_VALUE, "Value"), _defineProperty$e(_dictionary, FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE, "Second value"), _dictionary);

var DEFAULT_LANGUAGE_CODE = dictionary.languageCode;
var _staticRegister$5 = staticRegister("languagesDictionaries"), registerGloballyLanguageDictionary = _staticRegister$5.register, getGlobalLanguageDictionary = _staticRegister$5.getItem, hasGlobalLanguageDictionary = _staticRegister$5.hasItem, getGlobalLanguagesDictionaries = _staticRegister$5.getValues;
registerLanguageDictionary(dictionary);
function registerLanguageDictionary(languageCodeOrDictionary, dictionary) {
  var languageCode = languageCodeOrDictionary;
  var dictionaryObject = dictionary;
  if (isObject(languageCodeOrDictionary)) {
    dictionaryObject = languageCodeOrDictionary;
    languageCode = dictionaryObject.languageCode;
  }
  extendLanguageDictionary(languageCode, dictionaryObject);
  registerGloballyLanguageDictionary(languageCode, deepClone(dictionaryObject));
  return deepClone(dictionaryObject);
}
function extendLanguageDictionary(languageCode, dictionary) {
  if (languageCode !== DEFAULT_LANGUAGE_CODE) {
    extendNotExistingKeys(dictionary, getGlobalLanguageDictionary(DEFAULT_LANGUAGE_CODE));
  }
}
function getLanguageDictionary(languageCode) {
  if (!hasLanguageDictionary(languageCode)) {
    return null;
  }
  return deepClone(getGlobalLanguageDictionary(languageCode));
}
function hasLanguageDictionary(languageCode) {
  return hasGlobalLanguageDictionary(languageCode);
}
function getLanguagesDictionaries() {
  return getGlobalLanguagesDictionaries();
}
function getTranslatedPhrase(languageCode, dictionaryKey, argumentsForFormatters) {
  var languageDictionary = getLanguageDictionary(languageCode);
  if (languageDictionary === null) {
    return null;
  }
  var phrasePropositions = languageDictionary[dictionaryKey];
  if (isUndefined(phrasePropositions)) {
    return null;
  }
  var formattedPhrase = getFormattedPhrase(phrasePropositions, argumentsForFormatters);
  if (Array.isArray(formattedPhrase)) {
    return formattedPhrase[0];
  }
  return formattedPhrase;
}
function getFormattedPhrase(phrasePropositions, argumentsForFormatters) {
  var formattedPhrasePropositions = phrasePropositions;
  arrayEach(getAll(), function(formatter) {
    formattedPhrasePropositions = formatter(phrasePropositions, argumentsForFormatters);
  });
  return formattedPhrasePropositions;
}
function getValidLanguageCode(languageCode) {
  var normalizedLanguageCode = normalizeLanguageCode(languageCode);
  if (!hasLanguageDictionary(normalizedLanguageCode)) {
    normalizedLanguageCode = DEFAULT_LANGUAGE_CODE;
    warnUserAboutLanguageRegistration(languageCode);
  }
  return normalizedLanguageCode;
}

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var keys = ownKeys$8(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

var ACTIVE_HEADER_TYPE = "active-header";
var AREA_TYPE = "area";
var CELL_TYPE = "cell";
var FILL_TYPE = "fill";
var HEADER_TYPE = "header";
var CUSTOM_SELECTION_TYPE = "custom-selection";

function _typeof$w(obj) {
  "@babel/helpers - typeof";
  return _typeof$w = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$w(obj);
}
function _slicedToArray$8(arr, i) {
  return _arrayWithHoles$8(arr) || _iterableToArrayLimit$8(arr, i) || _unsupportedIterableToArray$i(arr, i) || _nonIterableRest$8();
}
function _nonIterableRest$8() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$i(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$i(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$i(o, minLen);
}
function _arrayLikeToArray$i(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$8(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$8(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _classCallCheck$Z(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$Z(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$Z(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$Z(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$Z(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _get$3() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get$3 = Reflect.get;
  } else {
    _get$3 = function _get2(target, property, receiver) {
      var base = _superPropBase$3(target, property);
      if (!base)
        return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get$3.apply(this, arguments);
}
function _superPropBase$3(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf$p(object);
    if (object === null)
      break;
  }
  return object;
}
function _inherits$p(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$r(subClass, superClass);
}
function _setPrototypeOf$r(o, p) {
  _setPrototypeOf$r = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$r(o, p);
}
function _createSuper$p(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$r();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$p(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$p(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$p(this, result);
  };
}
function _possibleConstructorReturn$p(self, call) {
  if (call && (_typeof$w(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$p(self);
}
function _assertThisInitialized$p(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$r() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$p(o) {
  _getPrototypeOf$p = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$p(o);
}
var VisualSelection = /* @__PURE__ */ function(_Selection) {
  _inherits$p(VisualSelection2, _Selection);
  var _super = _createSuper$p(VisualSelection2);
  function VisualSelection2(settings, visualCellRange) {
    var _this;
    _classCallCheck$Z(this, VisualSelection2);
    _this = _super.call(this, settings, null);
    _this.visualCellRange = visualCellRange || null;
    _this.commit();
    return _this;
  }
  _createClass$Z(VisualSelection2, [{
    key: "add",
    value: function add(coords) {
      if (this.visualCellRange === null) {
        this.visualCellRange = this.settings.createCellRange(coords);
      } else {
        this.visualCellRange.expand(coords);
      }
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.visualCellRange = null;
      return _get$3(_getPrototypeOf$p(VisualSelection2.prototype), "clear", this).call(this);
    }
  }, {
    key: "findVisibleCoordsInRange",
    value: function findVisibleCoordsInRange(startCoords, endCoords, incrementByRow) {
      var incrementByColumn = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : incrementByRow;
      var nextVisibleRow = this.findVisibleCoordsInRowsRange(startCoords.row, endCoords.row, incrementByRow);
      if (nextVisibleRow === null) {
        return null;
      }
      var nextVisibleColumn = this.findVisibleCoordsInColumnsRange(startCoords.col, endCoords.col, incrementByColumn);
      if (nextVisibleColumn === null) {
        return null;
      }
      return this.settings.createCellCoords(nextVisibleRow, nextVisibleColumn);
    }
  }, {
    key: "findVisibleCoordsInRowsRange",
    value: function findVisibleCoordsInRowsRange(startVisibleRow, endVisibleRow, incrementBy) {
      var _this$settings$visual = this.settings.visualToRenderableCoords({
        row: startVisibleRow,
        col: -1
      }), startRowRenderable = _this$settings$visual.row;
      if (endVisibleRow === startVisibleRow && startRowRenderable === null) {
        return null;
      }
      if (startRowRenderable === null) {
        return this.findVisibleCoordsInRowsRange(startVisibleRow + incrementBy, endVisibleRow, incrementBy);
      }
      return startVisibleRow;
    }
  }, {
    key: "findVisibleCoordsInColumnsRange",
    value: function findVisibleCoordsInColumnsRange(startVisibleColumn, endVisibleColumn, incrementBy) {
      var _this$settings$visual2 = this.settings.visualToRenderableCoords({
        row: -1,
        col: startVisibleColumn
      }), startColumnRenderable = _this$settings$visual2.col;
      if (endVisibleColumn === startVisibleColumn && startColumnRenderable === null) {
        return null;
      }
      if (startColumnRenderable === null) {
        return this.findVisibleCoordsInColumnsRange(startVisibleColumn + incrementBy, endVisibleColumn, incrementBy);
      }
      return startVisibleColumn;
    }
  }, {
    key: "findVisibleHeaderRange",
    value: function findVisibleHeaderRange(visualFromCoords, visualToCoords, incrementByRow, incrementByColumn) {
      var fromRangeVisualRow = this.findVisibleCoordsInRowsRange(visualFromCoords.row, visualToCoords.row, incrementByRow);
      var toRangeVisualRow = this.findVisibleCoordsInRowsRange(visualToCoords.row, visualFromCoords.row, -incrementByRow);
      var fromRangeVisualColumn = this.findVisibleCoordsInColumnsRange(visualFromCoords.col, visualToCoords.col, incrementByColumn);
      var toRangeVisualColumn = this.findVisibleCoordsInColumnsRange(visualToCoords.col, visualFromCoords.col, -incrementByColumn);
      if (fromRangeVisualRow === null && toRangeVisualRow === null && fromRangeVisualColumn === null && toRangeVisualColumn === null) {
        return null;
      }
      return [this.settings.createCellCoords(fromRangeVisualRow, fromRangeVisualColumn), this.settings.createCellCoords(toRangeVisualRow, toRangeVisualColumn)];
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.visualCellRange === null) {
        return this;
      }
      var _this$visualCellRange = this.visualCellRange, visualFromCoords = _this$visualCellRange.from, visualToCoords = _this$visualCellRange.to;
      var incrementByRow = this.getRowSearchDirection(this.visualCellRange);
      var incrementByColumn = this.getColumnSearchDirection(this.visualCellRange);
      var fromRangeVisual = this.findVisibleCoordsInRange(visualFromCoords, visualToCoords, incrementByRow, incrementByColumn);
      var toRangeVisual = this.findVisibleCoordsInRange(visualToCoords, visualFromCoords, -incrementByRow, -incrementByColumn);
      if (fromRangeVisual === null || toRangeVisual === null) {
        var isHeaderSelectionType = this.settings.type === "header";
        var cellRange = null;
        if (isHeaderSelectionType) {
          var _this$findVisibleHead = this.findVisibleHeaderRange(visualFromCoords, visualToCoords, incrementByRow, incrementByColumn), _this$findVisibleHead2 = _slicedToArray$8(_this$findVisibleHead, 2), fromRangeVisualHeader = _this$findVisibleHead2[0], toRangeVisualHeader = _this$findVisibleHead2[1];
          cellRange = this.createRenderableCellRange(fromRangeVisualHeader, toRangeVisualHeader);
        }
        this.cellRange = cellRange;
      } else {
        this.cellRange = this.createRenderableCellRange(fromRangeVisual, toRangeVisual);
      }
      return this;
    }
  }, {
    key: "adjustCoordinates",
    value: function adjustCoordinates(broaderCellRange) {
      var incrementByRow = this.getRowSearchDirection(broaderCellRange);
      var incrementByColumn = this.getColumnSearchDirection(broaderCellRange);
      var normFromCoords = broaderCellRange.from.clone().normalize();
      var normToCoords = broaderCellRange.to.clone().normalize();
      var singleCellRangeVisual = this.findVisibleCoordsInRange(normFromCoords, normToCoords, incrementByRow, incrementByColumn);
      if (singleCellRangeVisual !== null) {
        if (this.cellRange === null) {
          var singleCellRangeRenderable = this.settings.visualToRenderableCoords(singleCellRangeVisual);
          this.cellRange = this.settings.createCellRange(singleCellRangeRenderable);
        }
        broaderCellRange.setHighlight(singleCellRangeVisual);
        return this;
      }
      broaderCellRange.setHighlight(broaderCellRange.from);
      return this;
    }
  }, {
    key: "getCorners",
    value: function getCorners() {
      var _this$cellRange = this.cellRange, from = _this$cellRange.from, to = _this$cellRange.to;
      var isRowUndefined = from.row === null || to.row === null;
      var isColumnUndefined = from.col === null || to.col === null;
      var topLeftCorner = this.settings.createCellCoords(isRowUndefined ? null : Math.min(from.row, to.row), isColumnUndefined ? null : Math.min(from.col, to.col));
      var bottomRightCorner = this.settings.createCellCoords(isRowUndefined ? null : Math.max(from.row, to.row), isColumnUndefined ? null : Math.max(from.col, to.col));
      return [topLeftCorner.row, topLeftCorner.col, bottomRightCorner.row, bottomRightCorner.col];
    }
  }, {
    key: "getVisualCorners",
    value: function getVisualCorners() {
      var topStart = this.settings.renderableToVisualCoords(this.cellRange.getTopStartCorner());
      var bottomEnd = this.settings.renderableToVisualCoords(this.cellRange.getBottomEndCorner());
      return [topStart.row, topStart.col, bottomEnd.row, bottomEnd.col];
    }
  }, {
    key: "createRenderableCellRange",
    value: function createRenderableCellRange(visualFromCoords, visualToCoords) {
      var renderableFromCoords = this.settings.visualToRenderableCoords(visualFromCoords);
      var renderableToCoords = this.settings.visualToRenderableCoords(visualToCoords);
      return this.settings.createCellRange(renderableFromCoords, renderableFromCoords, renderableToCoords);
    }
  }, {
    key: "getRowSearchDirection",
    value: function getRowSearchDirection(cellRange) {
      if (cellRange.from.row < cellRange.to.row) {
        return 1;
      }
      return -1;
    }
  }, {
    key: "getColumnSearchDirection",
    value: function getColumnSearchDirection(cellRange) {
      if (cellRange.from.col < cellRange.to.col) {
        return 1;
      }
      return -1;
    }
  }]);
  return VisualSelection2;
}(Selection);

var _excluded = ["activeHeaderClassName"];
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty$f(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$f(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function createHighlight(_ref) {
  var activeHeaderClassName = _ref.activeHeaderClassName, restOptions = _objectWithoutProperties(_ref, _excluded);
  var s = new VisualSelection(_objectSpread(_objectSpread({
    highlightHeaderClassName: activeHeaderClassName
  }, restOptions), {}, {
    selectionType: ACTIVE_HEADER_TYPE
  }));
  return s;
}

var _excluded$1 = ["layerLevel", "areaCornerVisible"];
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
      _defineProperty$g(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$g(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties$1(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose$1(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function createHighlight$1(_ref) {
  var layerLevel = _ref.layerLevel, areaCornerVisible = _ref.areaCornerVisible, restOptions = _objectWithoutProperties$1(_ref, _excluded$1);
  var s = new VisualSelection(_objectSpread$1(_objectSpread$1({
    className: "area",
    markIntersections: true,
    layerLevel: Math.min(layerLevel, 7),
    border: {
      width: 1,
      color: "#4b89ff",
      cornerVisible: areaCornerVisible
    }
  }, restOptions), {}, {
    selectionType: AREA_TYPE
  }));
  return s;
}

var _excluded$2 = ["cellCornerVisible"];
function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$2(Object(source), true).forEach(function(key) {
      _defineProperty$h(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$h(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties$2(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose$2(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$2(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function createHighlight$2(_ref) {
  var cellCornerVisible = _ref.cellCornerVisible, restOptions = _objectWithoutProperties$2(_ref, _excluded$2);
  var s = new VisualSelection(_objectSpread$2(_objectSpread$2({
    className: "current",
    border: {
      width: 2,
      color: "#4b89ff",
      cornerVisible: cellCornerVisible
    }
  }, restOptions), {}, {
    selectionType: CELL_TYPE
  }));
  return s;
}

var _excluded$3 = ["border", "visualCellRange"];
function ownKeys$3(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$3(Object(source), true).forEach(function(key) {
      _defineProperty$i(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$i(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties$3(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose$3(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$3(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function createHighlight$3(_ref) {
  var border = _ref.border, visualCellRange = _ref.visualCellRange, restOptions = _objectWithoutProperties$3(_ref, _excluded$3);
  var s = new VisualSelection(_objectSpread$3(_objectSpread$3(_objectSpread$3({}, border), restOptions), {}, {
    selectionType: CUSTOM_SELECTION_TYPE
  }), visualCellRange);
  return s;
}

function ownKeys$4(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$4(Object(source), true).forEach(function(key) {
      _defineProperty$j(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$j(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function createHighlight$4(_ref) {
  var restOptions = Object.assign({}, _ref);
  var s = new VisualSelection(_objectSpread$4(_objectSpread$4({
    className: "fill",
    border: {
      width: 1,
      color: "#ff0000"
    }
  }, restOptions), {}, {
    selectionType: FILL_TYPE
  }));
  return s;
}

var _excluded$4 = ["headerClassName", "rowClassName", "columnClassName"];
function ownKeys$5(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$5(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$5(Object(source), true).forEach(function(key) {
      _defineProperty$k(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$k(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties$4(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose$4(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$4(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function createHighlight$5(_ref) {
  var headerClassName = _ref.headerClassName, rowClassName = _ref.rowClassName, columnClassName = _ref.columnClassName, restOptions = _objectWithoutProperties$4(_ref, _excluded$4);
  var s = new VisualSelection(_objectSpread$5(_objectSpread$5({
    className: "highlight",
    highlightHeaderClassName: headerClassName,
    highlightRowClassName: rowClassName,
    highlightColumnClassName: columnClassName
  }, restOptions), {}, {
    highlightOnlyClosestHeader: true,
    selectionType: HEADER_TYPE
  }));
  return s;
}

function ownKeys$6(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$6(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$6(Object(source), true).forEach(function(key) {
      _defineProperty$l(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$l(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
var _staticRegister$6 = staticRegister("highlight/types"), register$5 = _staticRegister$6.register, getItem$4 = _staticRegister$6.getItem;
register$5(ACTIVE_HEADER_TYPE, createHighlight);
register$5(AREA_TYPE, createHighlight$1);
register$5(CELL_TYPE, createHighlight$2);
register$5(CUSTOM_SELECTION_TYPE, createHighlight$3);
register$5(FILL_TYPE, createHighlight$4);
register$5(HEADER_TYPE, createHighlight$5);
function createHighlight$6(highlightType, options) {
  return getItem$4(highlightType)(_objectSpread$6({
    type: highlightType
  }, options));
}

function _toConsumableArray$f(arr) {
  return _arrayWithoutHoles$f(arr) || _iterableToArray$f(arr) || _unsupportedIterableToArray$j(arr) || _nonIterableSpread$f();
}
function _nonIterableSpread$f() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$j(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$j(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$j(o, minLen);
}
function _iterableToArray$f(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$f(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$j(arr);
}
function _arrayLikeToArray$j(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function ownKeys$7(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$7(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$7(Object(source), true).forEach(function(key) {
      _defineProperty$m(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$m(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classCallCheck$_(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$_(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$_(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$_(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$_(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Highlight = /* @__PURE__ */ function(_Symbol$iterator) {
  function Highlight2(options) {
    _classCallCheck$_(this, Highlight2);
    this.options = options;
    this.layerLevel = 0;
    this.cell = createHighlight$6(CELL_TYPE, options);
    this.fill = createHighlight$6(FILL_TYPE, options);
    this.areas = new Map();
    this.headers = new Map();
    this.activeHeaders = new Map();
    this.customSelections = [];
  }
  _createClass$_(Highlight2, [{
    key: "isEnabledFor",
    value: function isEnabledFor(highlightType, coords) {
      var type = highlightType;
      if (highlightType === CELL_TYPE) {
        type = "current";
      }
      var disableHighlight = this.options.disabledCellSelection(coords.row, coords.col);
      if (typeof disableHighlight === "string") {
        disableHighlight = [disableHighlight];
      }
      return disableHighlight === false || Array.isArray(disableHighlight) && !disableHighlight.includes(type);
    }
  }, {
    key: "useLayerLevel",
    value: function useLayerLevel() {
      var level = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      this.layerLevel = level;
      return this;
    }
  }, {
    key: "getCell",
    value: function getCell() {
      return this.cell;
    }
  }, {
    key: "getFill",
    value: function getFill() {
      return this.fill;
    }
  }, {
    key: "createOrGetArea",
    value: function createOrGetArea() {
      var layerLevel = this.layerLevel;
      var area;
      if (this.areas.has(layerLevel)) {
        area = this.areas.get(layerLevel);
      } else {
        area = createHighlight$6(AREA_TYPE, _objectSpread$7({
          layerLevel
        }, this.options));
        this.areas.set(layerLevel, area);
      }
      return area;
    }
  }, {
    key: "getAreas",
    value: function getAreas() {
      return _toConsumableArray$f(this.areas.values());
    }
  }, {
    key: "createOrGetHeader",
    value: function createOrGetHeader() {
      var layerLevel = this.layerLevel;
      var header;
      if (this.headers.has(layerLevel)) {
        header = this.headers.get(layerLevel);
      } else {
        header = createHighlight$6(HEADER_TYPE, _objectSpread$7({}, this.options));
        this.headers.set(layerLevel, header);
      }
      return header;
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      return _toConsumableArray$f(this.headers.values());
    }
  }, {
    key: "createOrGetActiveHeader",
    value: function createOrGetActiveHeader() {
      var layerLevel = this.layerLevel;
      var header;
      if (this.activeHeaders.has(layerLevel)) {
        header = this.activeHeaders.get(layerLevel);
      } else {
        header = createHighlight$6(ACTIVE_HEADER_TYPE, _objectSpread$7({}, this.options));
        this.activeHeaders.set(layerLevel, header);
      }
      return header;
    }
  }, {
    key: "getActiveHeaders",
    value: function getActiveHeaders() {
      return _toConsumableArray$f(this.activeHeaders.values());
    }
  }, {
    key: "getCustomSelections",
    value: function getCustomSelections() {
      return _toConsumableArray$f(this.customSelections.values());
    }
  }, {
    key: "addCustomSelection",
    value: function addCustomSelection(selectionInstance) {
      this.customSelections.push(createHighlight$6(CUSTOM_SELECTION_TYPE, _objectSpread$7(_objectSpread$7({}, this.options), selectionInstance)));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.cell.clear();
      this.fill.clear();
      arrayEach(this.areas.values(), function(highlight) {
        return void highlight.clear();
      });
      arrayEach(this.headers.values(), function(highlight) {
        return void highlight.clear();
      });
      arrayEach(this.activeHeaders.values(), function(highlight) {
        return void highlight.clear();
      });
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return [this.cell, this.fill].concat(_toConsumableArray$f(this.areas.values()), _toConsumableArray$f(this.headers.values()), _toConsumableArray$f(this.activeHeaders.values()), _toConsumableArray$f(this.customSelections))[Symbol.iterator]();
    }
  }]);
  return Highlight2;
}(Symbol.iterator);

function _classCallCheck$$(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$$(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$$(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$$(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$$(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var SelectionRange = /* @__PURE__ */ function(_Symbol$iterator) {
  function SelectionRange2(createCellRange) {
    _classCallCheck$$(this, SelectionRange2);
    this.ranges = [];
    this.createCellRange = createCellRange;
  }
  _createClass$$(SelectionRange2, [{
    key: "isEmpty",
    value: function isEmpty() {
      return this.size() === 0;
    }
  }, {
    key: "set",
    value: function set(coords) {
      this.clear();
      this.ranges.push(this.createCellRange(coords));
      return this;
    }
  }, {
    key: "add",
    value: function add(coords) {
      this.ranges.push(this.createCellRange(coords));
      return this;
    }
  }, {
    key: "pop",
    value: function pop() {
      this.ranges.pop();
      return this;
    }
  }, {
    key: "current",
    value: function current() {
      return this.peekByIndex(0);
    }
  }, {
    key: "previous",
    value: function previous() {
      return this.peekByIndex(-1);
    }
  }, {
    key: "includes",
    value: function includes(coords) {
      return this.ranges.some(function(cellRange) {
        return cellRange.includes(coords);
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ranges.length = 0;
      return this;
    }
  }, {
    key: "size",
    value: function size() {
      return this.ranges.length;
    }
  }, {
    key: "peekByIndex",
    value: function peekByIndex() {
      var offset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      var rangeIndex = this.size() + offset - 1;
      var cellRange;
      if (rangeIndex >= 0) {
        cellRange = this.ranges[rangeIndex];
      }
      return cellRange;
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this.ranges[Symbol.iterator]();
    }
  }]);
  return SelectionRange2;
}(Symbol.iterator);

function _classCallCheck$10(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$10(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$10(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$10(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$10(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Transformation = /* @__PURE__ */ function() {
  function Transformation2(range, options) {
    _classCallCheck$10(this, Transformation2);
    this.range = range;
    this.options = options;
  }
  _createClass$10(Transformation2, [{
    key: "transformStart",
    value: function transformStart(rowDelta, colDelta) {
      var force = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      var delta = this.options.createCellCoords(rowDelta, colDelta);
      var highlightCoords = this.range.current().highlight;
      var _this$options$visualT = this.options.visualToRenderableCoords(highlightCoords), renderableRow = _this$options$visualT.row, renderableColumn = _this$options$visualT.col;
      var visualCoords = highlightCoords;
      var rowTransformDir = 0;
      var colTransformDir = 0;
      this.runLocalHooks("beforeTransformStart", delta);
      if (renderableRow !== null && renderableColumn !== null) {
        var totalRows = this.options.countRows();
        var totalCols = this.options.countCols();
        var fixedRowsBottom = this.options.fixedRowsBottom();
        var minSpareRows = this.options.minSpareRows();
        var minSpareCols = this.options.minSpareCols();
        var autoWrapRow = this.options.autoWrapRow();
        var autoWrapCol = this.options.autoWrapCol();
        if (renderableRow + rowDelta > totalRows - 1) {
          if (force && minSpareRows > 0 && !(fixedRowsBottom && renderableRow >= totalRows - fixedRowsBottom - 1)) {
            this.runLocalHooks("insertRowRequire", totalRows);
            totalRows = this.options.countRows();
          } else if (autoWrapCol) {
            delta.row = 1 - totalRows;
            delta.col = renderableColumn + delta.col === totalCols - 1 ? 1 - totalCols : 1;
          }
        } else if (autoWrapCol && renderableRow + delta.row < 0 && renderableColumn + delta.col >= 0) {
          delta.row = totalRows - 1;
          delta.col = renderableColumn + delta.col === 0 ? totalCols - 1 : -1;
        }
        if (renderableColumn + delta.col > totalCols - 1) {
          if (force && minSpareCols > 0) {
            this.runLocalHooks("insertColRequire", totalCols);
            totalCols = this.options.countCols();
          } else if (autoWrapRow) {
            delta.row = renderableRow + delta.row === totalRows - 1 ? 1 - totalRows : 1;
            delta.col = 1 - totalCols;
          }
        } else if (autoWrapRow && renderableColumn + delta.col < 0 && renderableRow + delta.row >= 0) {
          delta.row = renderableRow + delta.row === 0 ? totalRows - 1 : -1;
          delta.col = totalCols - 1;
        }
        var coords = this.options.createCellCoords(renderableRow + delta.row, renderableColumn + delta.col);
        rowTransformDir = 0;
        colTransformDir = 0;
        if (coords.row < 0) {
          rowTransformDir = -1;
          coords.row = 0;
        } else if (coords.row > 0 && coords.row >= totalRows) {
          rowTransformDir = 1;
          coords.row = totalRows - 1;
        }
        if (coords.col < 0) {
          colTransformDir = -1;
          coords.col = 0;
        } else if (coords.col > 0 && coords.col >= totalCols) {
          colTransformDir = 1;
          coords.col = totalCols - 1;
        }
        visualCoords = this.options.renderableToVisualCoords(coords);
      }
      this.runLocalHooks("afterTransformStart", visualCoords, rowTransformDir, colTransformDir);
      return visualCoords;
    }
  }, {
    key: "transformEnd",
    value: function transformEnd(rowDelta, colDelta) {
      var delta = this.options.createCellCoords(rowDelta, colDelta);
      var cellRange = this.range.current();
      var visualCoords = cellRange.to;
      var rowTransformDir = 0;
      var colTransformDir = 0;
      this.runLocalHooks("beforeTransformEnd", delta);
      var _this$options$visualT2 = this.options.visualToRenderableCoords(cellRange.highlight), rowHighlight = _this$options$visualT2.row, colHighlight = _this$options$visualT2.col;
      if (rowHighlight !== null && colHighlight !== null) {
        var totalRows = this.options.countRows();
        var totalCols = this.options.countCols();
        var _this$options$visualT3 = this.options.visualToRenderableCoords(cellRange.to), rowTo = _this$options$visualT3.row, colTo = _this$options$visualT3.col;
        var coords = this.options.createCellCoords(rowTo + delta.row, colTo + delta.col);
        rowTransformDir = 0;
        colTransformDir = 0;
        if (coords.row < 0) {
          rowTransformDir = -1;
          coords.row = 0;
        } else if (coords.row > 0 && coords.row >= totalRows) {
          rowTransformDir = 1;
          coords.row = totalRows - 1;
        }
        if (coords.col < 0) {
          colTransformDir = -1;
          coords.col = 0;
        } else if (coords.col > 0 && coords.col >= totalCols) {
          colTransformDir = 1;
          coords.col = totalCols - 1;
        }
        visualCoords = this.options.renderableToVisualCoords(coords);
      }
      this.runLocalHooks("afterTransformEnd", visualCoords, rowTransformDir, colTransformDir);
      return visualCoords;
    }
  }]);
  return Transformation2;
}();
mixin(Transformation, localHooks);

function _slicedToArray$9(arr, i) {
  return _arrayWithHoles$9(arr) || _iterableToArrayLimit$9(arr, i) || _unsupportedIterableToArray$k(arr, i) || _nonIterableRest$9();
}
function _nonIterableRest$9() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$k(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$k(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$k(o, minLen);
}
function _arrayLikeToArray$k(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$9(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$9(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _typeof$x(obj) {
  "@babel/helpers - typeof";
  return _typeof$x = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$x(obj);
}
var SELECTION_TYPE_UNRECOGNIZED = 0;
var SELECTION_TYPE_EMPTY = 1;
var SELECTION_TYPE_ARRAY = 2;
var SELECTION_TYPE_OBJECT = 3;
var SELECTION_TYPES = [SELECTION_TYPE_OBJECT, SELECTION_TYPE_ARRAY];
var ARRAY_TYPE_PATTERN = [["number"], ["number", "string"], ["number", "undefined"], ["number", "string", "undefined"]];
var rootCall = Symbol("root");
var childCall = Symbol("child");
function detectSelectionType(selectionRanges) {
  var _callSymbol = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : rootCall;
  if (_callSymbol !== rootCall && _callSymbol !== childCall) {
    throw new Error("The second argument is used internally only and cannot be overwritten.");
  }
  var isArray = Array.isArray(selectionRanges);
  var isRootCall = _callSymbol === rootCall;
  var result = SELECTION_TYPE_UNRECOGNIZED;
  if (isArray) {
    var firstItem = selectionRanges[0];
    if (selectionRanges.length === 0) {
      result = SELECTION_TYPE_EMPTY;
    } else if (isRootCall && firstItem instanceof CellRange) {
      result = SELECTION_TYPE_OBJECT;
    } else if (isRootCall && Array.isArray(firstItem)) {
      result = detectSelectionType(firstItem, childCall);
    } else if (selectionRanges.length >= 2 && selectionRanges.length <= 4) {
      var isArrayType = !selectionRanges.some(function(value, index) {
        return !ARRAY_TYPE_PATTERN[index].includes(_typeof$x(value));
      });
      if (isArrayType) {
        result = SELECTION_TYPE_ARRAY;
      }
    }
  }
  return result;
}
function normalizeSelectionFactory(type) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$keepDirection = _ref.keepDirection, keepDirection = _ref$keepDirection === void 0 ? false : _ref$keepDirection, propToCol = _ref.propToCol;
  if (!SELECTION_TYPES.includes(type)) {
    throw new Error("Unsupported selection ranges schema type was provided.");
  }
  return function(selection) {
    var isObjectType = type === SELECTION_TYPE_OBJECT;
    var rowStart = isObjectType ? selection.from.row : selection[0];
    var columnStart = isObjectType ? selection.from.col : selection[1];
    var rowEnd = isObjectType ? selection.to.row : selection[2];
    var columnEnd = isObjectType ? selection.to.col : selection[3];
    if (typeof propToCol === "function") {
      if (typeof columnStart === "string") {
        columnStart = propToCol(columnStart);
      }
      if (typeof columnEnd === "string") {
        columnEnd = propToCol(columnEnd);
      }
    }
    if (isUndefined(rowEnd)) {
      rowEnd = rowStart;
    }
    if (isUndefined(columnEnd)) {
      columnEnd = columnStart;
    }
    if (!keepDirection) {
      var origRowStart = rowStart;
      var origColumnStart = columnStart;
      var origRowEnd = rowEnd;
      var origColumnEnd = columnEnd;
      rowStart = Math.min(origRowStart, origRowEnd);
      columnStart = Math.min(origColumnStart, origColumnEnd);
      rowEnd = Math.max(origRowStart, origRowEnd);
      columnEnd = Math.max(origColumnStart, origColumnEnd);
    }
    return [rowStart, columnStart, rowEnd, columnEnd];
  };
}
function transformSelectionToColumnDistance(selectionRanges) {
  var selectionType = detectSelectionType(selectionRanges);
  if (selectionType === SELECTION_TYPE_UNRECOGNIZED || selectionType === SELECTION_TYPE_EMPTY) {
    return [];
  }
  var selectionSchemaNormalizer = normalizeSelectionFactory(selectionType);
  var unorderedIndexes = new Set();
  arrayEach(selectionRanges, function(selection) {
    var _selectionSchemaNorma = selectionSchemaNormalizer(selection), _selectionSchemaNorma2 = _slicedToArray$9(_selectionSchemaNorma, 4), columnStart = _selectionSchemaNorma2[1], columnEnd = _selectionSchemaNorma2[3];
    var columnNonHeaderStart = Math.max(columnStart, 0);
    var amount = columnEnd - columnNonHeaderStart + 1;
    arrayEach(Array.from(new Array(amount), function(_, i) {
      return columnNonHeaderStart + i;
    }), function(index) {
      if (!unorderedIndexes.has(index)) {
        unorderedIndexes.add(index);
      }
    });
  });
  var orderedIndexes = Array.from(unorderedIndexes).sort(function(a, b) {
    return a - b;
  });
  var normalizedColumnRanges = arrayReduce(orderedIndexes, function(acc, visualColumnIndex, index, array) {
    if (index !== 0 && visualColumnIndex === array[index - 1] + 1) {
      acc[acc.length - 1][1] += 1;
    } else {
      acc.push([visualColumnIndex, 1]);
    }
    return acc;
  }, []);
  return normalizedColumnRanges;
}
function transformSelectionToRowDistance(selectionRanges) {
  var selectionType = detectSelectionType(selectionRanges);
  if (selectionType === SELECTION_TYPE_UNRECOGNIZED || selectionType === SELECTION_TYPE_EMPTY) {
    return [];
  }
  var selectionSchemaNormalizer = normalizeSelectionFactory(selectionType);
  var unorderedIndexes = new Set();
  arrayEach(selectionRanges, function(selection) {
    var _selectionSchemaNorma3 = selectionSchemaNormalizer(selection), _selectionSchemaNorma4 = _slicedToArray$9(_selectionSchemaNorma3, 3), rowStart = _selectionSchemaNorma4[0], rowEnd = _selectionSchemaNorma4[2];
    var rowNonHeaderStart = Math.max(rowStart, 0);
    var amount = rowEnd - rowNonHeaderStart + 1;
    arrayEach(Array.from(new Array(amount), function(_, i) {
      return rowNonHeaderStart + i;
    }), function(index) {
      if (!unorderedIndexes.has(index)) {
        unorderedIndexes.add(index);
      }
    });
  });
  var orderedIndexes = Array.from(unorderedIndexes).sort(function(a, b) {
    return a - b;
  });
  var normalizedRowRanges = arrayReduce(orderedIndexes, function(acc, rowIndex, index, array) {
    if (index !== 0 && rowIndex === array[index - 1] + 1) {
      acc[acc.length - 1][1] += 1;
    } else {
      acc.push([rowIndex, 1]);
    }
    return acc;
  }, []);
  return normalizedRowRanges;
}
function isValidCoord(coord) {
  var maxTableItemsCount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Infinity;
  return typeof coord === "number" && coord >= 0 && coord < maxTableItemsCount;
}

var _templateObject$4;
function _slicedToArray$a(arr, i) {
  return _arrayWithHoles$a(arr) || _iterableToArrayLimit$a(arr, i) || _unsupportedIterableToArray$l(arr, i) || _nonIterableRest$a();
}
function _nonIterableRest$a() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$l(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$l(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$l(o, minLen);
}
function _arrayLikeToArray$l(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$a(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$a(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _taggedTemplateLiteral$4(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
function _classCallCheck$11(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$11(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$11(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$11(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$11(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var Selection$1 = /* @__PURE__ */ function() {
  function Selection2(settings, tableProps) {
    var _this = this;
    _classCallCheck$11(this, Selection2);
    this.settings = settings;
    this.tableProps = tableProps;
    this.inProgress = false;
    this.selectedByCorner = false;
    this.selectedByRowHeader = new Set();
    this.selectedByColumnHeader = new Set();
    this.selectedRange = new SelectionRange(function(highlight, from, to) {
      return _this.tableProps.createCellRange(highlight, from, to);
    });
    this.highlight = new Highlight({
      headerClassName: settings.currentHeaderClassName,
      activeHeaderClassName: settings.activeHeaderClassName,
      rowClassName: settings.currentRowClassName,
      columnClassName: settings.currentColClassName,
      disabledCellSelection: function disabledCellSelection(row, column) {
        return _this.tableProps.isDisabledCellSelection(row, column);
      },
      cellCornerVisible: function cellCornerVisible() {
        return _this.isCellCornerVisible.apply(_this, arguments);
      },
      areaCornerVisible: function areaCornerVisible() {
        return _this.isAreaCornerVisible.apply(_this, arguments);
      },
      visualToRenderableCoords: function visualToRenderableCoords(coords) {
        return _this.tableProps.visualToRenderableCoords(coords);
      },
      renderableToVisualCoords: function renderableToVisualCoords(coords) {
        return _this.tableProps.renderableToVisualCoords(coords);
      },
      createCellCoords: function createCellCoords(row, column) {
        return _this.tableProps.createCellCoords(row, column);
      },
      createCellRange: function createCellRange(highlight, from, to) {
        return _this.tableProps.createCellRange(highlight, from, to);
      }
    });
    this.transformation = new Transformation(this.selectedRange, {
      countRows: function countRows() {
        return _this.tableProps.countRowsTranslated();
      },
      countCols: function countCols() {
        return _this.tableProps.countColsTranslated();
      },
      visualToRenderableCoords: function visualToRenderableCoords(coords) {
        return _this.tableProps.visualToRenderableCoords(coords);
      },
      renderableToVisualCoords: function renderableToVisualCoords(coords) {
        return _this.tableProps.renderableToVisualCoords(coords);
      },
      createCellCoords: function createCellCoords(row, column) {
        return _this.tableProps.createCellCoords(row, column);
      },
      fixedRowsBottom: function fixedRowsBottom() {
        return settings.fixedRowsBottom;
      },
      minSpareRows: function minSpareRows() {
        return settings.minSpareRows;
      },
      minSpareCols: function minSpareCols() {
        return settings.minSpareCols;
      },
      autoWrapRow: function autoWrapRow() {
        return settings.autoWrapRow;
      },
      autoWrapCol: function autoWrapCol() {
        return settings.autoWrapCol;
      }
    });
    this.transformation.addLocalHook("beforeTransformStart", function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _this.runLocalHooks.apply(_this, ["beforeModifyTransformStart"].concat(args));
    });
    this.transformation.addLocalHook("afterTransformStart", function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return _this.runLocalHooks.apply(_this, ["afterModifyTransformStart"].concat(args));
    });
    this.transformation.addLocalHook("beforeTransformEnd", function() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return _this.runLocalHooks.apply(_this, ["beforeModifyTransformEnd"].concat(args));
    });
    this.transformation.addLocalHook("afterTransformEnd", function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return _this.runLocalHooks.apply(_this, ["afterModifyTransformEnd"].concat(args));
    });
    this.transformation.addLocalHook("insertRowRequire", function() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return _this.runLocalHooks.apply(_this, ["insertRowRequire"].concat(args));
    });
    this.transformation.addLocalHook("insertColRequire", function() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      return _this.runLocalHooks.apply(_this, ["insertColRequire"].concat(args));
    });
  }
  _createClass$11(Selection2, [{
    key: "getSelectedRange",
    value: function getSelectedRange() {
      return this.selectedRange;
    }
  }, {
    key: "begin",
    value: function begin() {
      this.inProgress = true;
    }
  }, {
    key: "finish",
    value: function finish() {
      this.runLocalHooks("afterSelectionFinished", Array.from(this.selectedRange));
      this.inProgress = false;
    }
  }, {
    key: "isInProgress",
    value: function isInProgress() {
      return this.inProgress;
    }
  }, {
    key: "setRangeStart",
    value: function setRangeStart(coords, multipleSelection) {
      var fragment = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      var isMultipleMode = this.settings.selectionMode === "multiple";
      var isMultipleSelection = isUndefined(multipleSelection) ? this.tableProps.getShortcutManager().isCtrlPressed() : multipleSelection;
      var isRowNegative = coords.row < 0;
      var isColumnNegative = coords.col < 0;
      var selectedByCorner = isRowNegative && isColumnNegative;
      var coordsClone = coords.clone();
      this.selectedByCorner = selectedByCorner;
      this.runLocalHooks("beforeSetRangeStart".concat(fragment ? "Only" : ""), coordsClone);
      if (!isMultipleMode || isMultipleMode && !isMultipleSelection && isUndefined(multipleSelection)) {
        this.selectedRange.clear();
      }
      this.selectedRange.add(coordsClone);
      if (this.getLayerLevel() === 0) {
        this.selectedByRowHeader.clear();
        this.selectedByColumnHeader.clear();
      }
      if (!selectedByCorner && isColumnNegative) {
        this.selectedByRowHeader.add(this.getLayerLevel());
      }
      if (!selectedByCorner && isRowNegative) {
        this.selectedByColumnHeader.add(this.getLayerLevel());
      }
      if (!fragment) {
        this.setRangeEnd(coords);
      }
    }
  }, {
    key: "setRangeStartOnly",
    value: function setRangeStartOnly(coords, multipleSelection) {
      this.setRangeStart(coords, multipleSelection, true);
    }
  }, {
    key: "setRangeEnd",
    value: function setRangeEnd(coords) {
      if (this.selectedRange.isEmpty()) {
        return;
      }
      var coordsClone = coords.clone();
      this.runLocalHooks("beforeSetRangeEnd", coordsClone);
      this.begin();
      var cellRange = this.selectedRange.current();
      if (this.settings.selectionMode !== "single") {
        cellRange.setTo(this.tableProps.createCellCoords(coordsClone.row, coordsClone.col));
      }
      this.highlight.getCell().clear();
      if (this.highlight.isEnabledFor(CELL_TYPE, cellRange.highlight)) {
        this.highlight.getCell().add(this.selectedRange.current().highlight).commit().adjustCoordinates(cellRange);
      }
      var layerLevel = this.getLayerLevel();
      if (layerLevel < this.highlight.layerLevel) {
        arrayEach(this.highlight.getAreas(), function(highlight) {
          return void highlight.clear();
        });
        arrayEach(this.highlight.getHeaders(), function(highlight) {
          return void highlight.clear();
        });
        arrayEach(this.highlight.getActiveHeaders(), function(highlight) {
          return void highlight.clear();
        });
      }
      this.highlight.useLayerLevel(layerLevel);
      var areaHighlight = this.highlight.createOrGetArea();
      var headerHighlight = this.highlight.createOrGetHeader();
      var activeHeaderHighlight = this.highlight.createOrGetActiveHeader();
      areaHighlight.clear();
      headerHighlight.clear();
      activeHeaderHighlight.clear();
      if (this.highlight.isEnabledFor(AREA_TYPE, cellRange.highlight) && (this.isMultiple() || layerLevel >= 1)) {
        areaHighlight.add(cellRange.from).add(cellRange.to).commit();
        if (layerLevel === 1) {
          var previousRange = this.selectedRange.previous();
          this.highlight.useLayerLevel(layerLevel - 1).createOrGetArea().add(previousRange.from).commit().adjustCoordinates(previousRange);
          this.highlight.useLayerLevel(layerLevel);
        }
      }
      if (this.highlight.isEnabledFor(HEADER_TYPE, cellRange.highlight)) {
        var areAnyRowsRendered = this.tableProps.countRowsTranslated() === 0;
        var areAnyColumnsRendered = this.tableProps.countColsTranslated() === 0;
        var headerCellRange = cellRange;
        if (areAnyRowsRendered || areAnyColumnsRendered) {
          headerCellRange = cellRange.clone();
        }
        if (areAnyRowsRendered) {
          headerCellRange.from.row = -1;
        }
        if (areAnyColumnsRendered) {
          headerCellRange.from.col = -1;
        }
        if (this.settings.selectionMode === "single") {
          if (this.isSelectedByAnyHeader()) {
            headerCellRange.from.normalize();
          }
          headerHighlight.add(headerCellRange.from).commit();
        } else {
          headerHighlight.add(headerCellRange.from).add(headerCellRange.to).commit();
        }
        if (this.isEntireRowSelected()) {
          var isRowSelected = this.tableProps.countCols() === cellRange.getWidth();
          if (isRowSelected) {
            activeHeaderHighlight.add(this.tableProps.createCellCoords(cellRange.from.row, -1)).add(this.tableProps.createCellCoords(cellRange.to.row, -1)).commit();
          }
        }
        if (this.isEntireColumnSelected()) {
          var isColumnSelected = this.tableProps.countRows() === cellRange.getHeight();
          if (isColumnSelected) {
            activeHeaderHighlight.add(this.tableProps.createCellCoords(-1, cellRange.from.col)).add(this.tableProps.createCellCoords(-1, cellRange.to.col)).commit();
          }
        }
      }
      this.runLocalHooks("afterSetRangeEnd", coords);
    }
  }, {
    key: "isMultiple",
    value: function isMultiple() {
      var isMultipleListener = createObjectPropListener(!this.selectedRange.current().isSingle());
      this.runLocalHooks("afterIsMultipleSelection", isMultipleListener);
      return isMultipleListener.value;
    }
  }, {
    key: "transformStart",
    value: function transformStart(rowDelta, colDelta) {
      var force = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      this.setRangeStart(this.transformation.transformStart(rowDelta, colDelta, force));
    }
  }, {
    key: "transformEnd",
    value: function transformEnd(rowDelta, colDelta) {
      this.setRangeEnd(this.transformation.transformEnd(rowDelta, colDelta));
    }
  }, {
    key: "getLayerLevel",
    value: function getLayerLevel() {
      return this.selectedRange.size() - 1;
    }
  }, {
    key: "isSelected",
    value: function isSelected() {
      return !this.selectedRange.isEmpty();
    }
  }, {
    key: "isSelectedByRowHeader",
    value: function isSelectedByRowHeader() {
      var layerLevel = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getLayerLevel();
      return !this.isSelectedByCorner(layerLevel) && this.isEntireRowSelected(layerLevel);
    }
  }, {
    key: "isEntireRowSelected",
    value: function isEntireRowSelected() {
      var layerLevel = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getLayerLevel();
      return layerLevel === -1 ? this.selectedByRowHeader.size > 0 : this.selectedByRowHeader.has(layerLevel);
    }
  }, {
    key: "isSelectedByColumnHeader",
    value: function isSelectedByColumnHeader() {
      var layerLevel = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getLayerLevel();
      return !this.isSelectedByCorner() && this.isEntireColumnSelected(layerLevel);
    }
  }, {
    key: "isEntireColumnSelected",
    value: function isEntireColumnSelected() {
      var layerLevel = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getLayerLevel();
      return layerLevel === -1 ? this.selectedByColumnHeader.size > 0 : this.selectedByColumnHeader.has(layerLevel);
    }
  }, {
    key: "isSelectedByAnyHeader",
    value: function isSelectedByAnyHeader() {
      return this.isSelectedByRowHeader(-1) || this.isSelectedByColumnHeader(-1) || this.isSelectedByCorner();
    }
  }, {
    key: "isSelectedByCorner",
    value: function isSelectedByCorner() {
      return this.selectedByCorner;
    }
  }, {
    key: "inInSelection",
    value: function inInSelection(coords) {
      return this.selectedRange.includes(coords);
    }
  }, {
    key: "isCellCornerVisible",
    value: function isCellCornerVisible() {
      return this.settings.fillHandle && !this.tableProps.isEditorOpened() && !this.isMultiple();
    }
  }, {
    key: "isAreaCornerVisible",
    value: function isAreaCornerVisible(layerLevel) {
      if (Number.isInteger(layerLevel) && layerLevel !== this.getLayerLevel()) {
        return false;
      }
      return this.settings.fillHandle && !this.tableProps.isEditorOpened() && this.isMultiple();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.selectedRange.clear();
      this.highlight.clear();
    }
  }, {
    key: "deselect",
    value: function deselect() {
      if (!this.isSelected()) {
        return;
      }
      this.inProgress = false;
      this.clear();
      this.runLocalHooks("afterDeselect");
    }
  }, {
    key: "selectAll",
    value: function selectAll() {
      var includeRowHeaders = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var includeColumnHeaders = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      var nrOfRows = this.tableProps.countRows();
      var nrOfColumns = this.tableProps.countCols();
      if (!includeRowHeaders && !includeColumnHeaders && (nrOfRows === 0 || nrOfColumns === 0)) {
        return;
      }
      var startCoords = this.tableProps.createCellCoords(includeColumnHeaders ? -1 : 0, includeRowHeaders ? -1 : 0);
      this.clear();
      this.setRangeStartOnly(startCoords);
      this.selectedByRowHeader.add(this.getLayerLevel());
      this.selectedByColumnHeader.add(this.getLayerLevel());
      this.setRangeEnd(this.tableProps.createCellCoords(nrOfRows - 1, nrOfColumns - 1));
      this.finish();
    }
  }, {
    key: "selectCells",
    value: function selectCells(selectionRanges) {
      var _this2 = this;
      var selectionType = detectSelectionType(selectionRanges);
      if (selectionType === SELECTION_TYPE_EMPTY) {
        return false;
      } else if (selectionType === SELECTION_TYPE_UNRECOGNIZED) {
        throw new Error(toSingleLine(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral$4(["Unsupported format of the selection ranges was passed. To select cells pass \n        the coordinates as an array of arrays ([[rowStart, columnStart/columnPropStart, rowEnd, \n        columnEnd/columnPropEnd]]) or as an array of CellRange objects."], ["Unsupported format of the selection ranges was passed. To select cells pass\\x20\n        the coordinates as an array of arrays ([[rowStart, columnStart/columnPropStart, rowEnd,\\x20\n        columnEnd/columnPropEnd]]) or as an array of CellRange objects."]))));
      }
      var selectionSchemaNormalizer = normalizeSelectionFactory(selectionType, {
        propToCol: function propToCol(prop) {
          return _this2.tableProps.propToCol(prop);
        },
        keepDirection: true
      });
      var nrOfRows = this.tableProps.countRows();
      var nrOfColumns = this.tableProps.countCols();
      var isValid = !selectionRanges.some(function(selection) {
        var _selectionSchemaNorma = selectionSchemaNormalizer(selection), _selectionSchemaNorma2 = _slicedToArray$a(_selectionSchemaNorma, 4), rowStart = _selectionSchemaNorma2[0], columnStart = _selectionSchemaNorma2[1], rowEnd = _selectionSchemaNorma2[2], columnEnd = _selectionSchemaNorma2[3];
        var _isValid = isValidCoord(rowStart, nrOfRows) && isValidCoord(columnStart, nrOfColumns) && isValidCoord(rowEnd, nrOfRows) && isValidCoord(columnEnd, nrOfColumns);
        return !_isValid;
      });
      if (isValid) {
        this.clear();
        arrayEach(selectionRanges, function(selection) {
          var _selectionSchemaNorma3 = selectionSchemaNormalizer(selection), _selectionSchemaNorma4 = _slicedToArray$a(_selectionSchemaNorma3, 4), rowStart = _selectionSchemaNorma4[0], columnStart = _selectionSchemaNorma4[1], rowEnd = _selectionSchemaNorma4[2], columnEnd = _selectionSchemaNorma4[3];
          _this2.setRangeStartOnly(_this2.tableProps.createCellCoords(rowStart, columnStart), false);
          _this2.setRangeEnd(_this2.tableProps.createCellCoords(rowEnd, columnEnd));
          _this2.finish();
        });
      }
      return isValid;
    }
  }, {
    key: "selectColumns",
    value: function selectColumns(startColumn) {
      var endColumn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : startColumn;
      var headerLevel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      var start = typeof startColumn === "string" ? this.tableProps.propToCol(startColumn) : startColumn;
      var end = typeof endColumn === "string" ? this.tableProps.propToCol(endColumn) : endColumn;
      var nrOfColumns = this.tableProps.countCols();
      var nrOfRows = this.tableProps.countRows();
      var isValid = isValidCoord(start, nrOfColumns) && isValidCoord(end, nrOfColumns);
      if (isValid) {
        this.setRangeStartOnly(this.tableProps.createCellCoords(headerLevel, start));
        this.setRangeEnd(this.tableProps.createCellCoords(nrOfRows - 1, end));
        this.finish();
      }
      return isValid;
    }
  }, {
    key: "selectRows",
    value: function selectRows(startRow) {
      var endRow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : startRow;
      var headerLevel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      var nrOfRows = this.tableProps.countRows();
      var nrOfColumns = this.tableProps.countCols();
      var isValid = isValidCoord(startRow, nrOfRows) && isValidCoord(endRow, nrOfRows);
      if (isValid) {
        this.setRangeStartOnly(this.tableProps.createCellCoords(startRow, headerLevel));
        this.setRangeEnd(this.tableProps.createCellCoords(endRow, nrOfColumns - 1));
        this.finish();
      }
      return isValid;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var customSelections = this.highlight.getCustomSelections();
      customSelections.forEach(function(customSelection) {
        customSelection.commit();
      });
      if (!this.isSelected()) {
        return;
      }
      var cellHighlight = this.highlight.getCell();
      var currentLayer = this.getLayerLevel();
      cellHighlight.commit().adjustCoordinates(this.selectedRange.current());
      for (var layerLevel = 0; layerLevel < this.selectedRange.size(); layerLevel += 1) {
        this.highlight.useLayerLevel(layerLevel);
        var areaHighlight = this.highlight.createOrGetArea();
        var headerHighlight = this.highlight.createOrGetHeader();
        var activeHeaderHighlight = this.highlight.createOrGetActiveHeader();
        areaHighlight.commit();
        headerHighlight.commit();
        activeHeaderHighlight.commit();
      }
      this.highlight.useLayerLevel(currentLayer);
    }
  }]);
  return Selection2;
}();
mixin(Selection$1, localHooks);

var regUniversalNewLine = /^(\r\n|\n\r|\r|\n)/;
var regNextCellNoQuotes = /^[^\t\r\n]+/;
var regNextEmptyCell = /^\t/;
function parse(str) {
  var arr = [[""]];
  if (str.length === 0) {
    return arr;
  }
  var column = 0;
  var row = 0;
  var lastLength;
  while (str.length > 0) {
    if (lastLength === str.length) {
      break;
    }
    lastLength = str.length;
    if (str.match(regNextEmptyCell)) {
      str = str.replace(regNextEmptyCell, "");
      column += 1;
      arr[row][column] = "";
    } else if (str.match(regUniversalNewLine)) {
      str = str.replace(regUniversalNewLine, "");
      column = 0;
      row += 1;
      arr[row] = [""];
    } else {
      var nextCell = "";
      if (str.startsWith('"')) {
        var quoteNo = 0;
        var isStillCell = true;
        while (isStillCell) {
          var nextChar = str.slice(0, 1);
          if (nextChar === '"') {
            quoteNo += 1;
          }
          nextCell += nextChar;
          str = str.slice(1);
          if (str.length === 0 || str.match(/^[\t\r\n]/) && quoteNo % 2 === 0) {
            isStillCell = false;
          }
        }
        nextCell = nextCell.replace(/^"/, "").replace(/"$/, "").replace(/["]*/g, function(match) {
          return new Array(Math.floor(match.length / 2)).fill('"').join("");
        });
      } else {
        var matchedText = str.match(regNextCellNoQuotes);
        nextCell = matchedText ? matchedText[0] : "";
        str = str.slice(nextCell.length);
      }
      arr[row][column] = nextCell;
    }
  }
  return arr;
}
function stringify$1(arr) {
  var r;
  var rLen;
  var c;
  var cLen;
  var str = "";
  var val;
  for (r = 0, rLen = arr.length; r < rLen; r += 1) {
    cLen = arr[r].length;
    for (c = 0; c < cLen; c += 1) {
      if (c > 0) {
        str += "	";
      }
      val = arr[r][c];
      if (typeof val === "string") {
        if (val.indexOf("\n") > -1) {
          str += '"'.concat(val.replace(/"/g, '""'), '"');
        } else {
          str += val;
        }
      } else if (val === null || val === void 0) {
        str += "";
      } else {
        str += val;
      }
    }
    if (r !== rLen - 1) {
      str += "\n";
    }
  }
  return str;
}

function _typeof$y(obj) {
  "@babel/helpers - typeof";
  return _typeof$y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$y(obj);
}
function _classCallCheck$12(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$12(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$12(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$12(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$12(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var copyableLookup = cellMethodLookupFactory("copyable", false);
var DataMap = /* @__PURE__ */ function() {
  function DataMap2(instance, data, tableMeta) {
    _classCallCheck$12(this, DataMap2);
    this.instance = instance;
    this.tableMeta = tableMeta;
    this.dataSource = data;
    this.duckSchema = this.dataSource && this.dataSource[0] ? duckSchema(this.dataSource[0]) : {};
    this.colToPropCache = void 0;
    this.propToColCache = void 0;
    this.createMap();
  }
  _createClass$12(DataMap2, [{
    key: "createMap",
    value: function createMap() {
      var schema = this.getSchema();
      if (typeof schema === "undefined") {
        throw new Error("trying to create `columns` definition but you didn't provide `schema` nor `data`");
      }
      var columns = this.tableMeta.columns;
      var i;
      this.colToPropCache = [];
      this.propToColCache = new Map();
      if (columns) {
        var columnsLen = 0;
        var filteredIndex = 0;
        var columnsAsFunc = false;
        if (typeof columns === "function") {
          var schemaLen = deepObjectSize(schema);
          columnsLen = schemaLen > 0 ? schemaLen : this.countFirstRowKeys();
          columnsAsFunc = true;
        } else {
          var maxCols = this.tableMeta.maxCols;
          columnsLen = Math.min(maxCols, columns.length);
        }
        for (i = 0; i < columnsLen; i++) {
          var column = columnsAsFunc ? columns(i) : columns[i];
          if (isObject(column)) {
            if (typeof column.data !== "undefined") {
              var index = columnsAsFunc ? filteredIndex : i;
              this.colToPropCache[index] = column.data;
              this.propToColCache.set(column.data, index);
            }
            filteredIndex += 1;
          }
        }
      } else {
        this.recursiveDuckColumns(schema);
      }
    }
  }, {
    key: "countFirstRowKeys",
    value: function countFirstRowKeys$1() {
      return countFirstRowKeys(this.dataSource);
    }
  }, {
    key: "recursiveDuckColumns",
    value: function recursiveDuckColumns(schema, lastCol, parent) {
      var _this = this;
      var lastColumn = lastCol;
      var propertyParent = parent;
      var prop;
      if (typeof lastColumn === "undefined") {
        lastColumn = 0;
        propertyParent = "";
      }
      if (_typeof$y(schema) === "object" && !Array.isArray(schema)) {
        objectEach(schema, function(value, key) {
          if (value === null) {
            prop = propertyParent + key;
            _this.colToPropCache.push(prop);
            _this.propToColCache.set(prop, lastColumn);
            lastColumn += 1;
          } else {
            lastColumn = _this.recursiveDuckColumns(value, lastColumn, "".concat(key, "."));
          }
        });
      }
      return lastColumn;
    }
  }, {
    key: "colToProp",
    value: function colToProp(column) {
      if (Number.isInteger(column) === false) {
        return column;
      }
      var physicalColumn = this.instance.toPhysicalColumn(column);
      if (physicalColumn === null) {
        return column;
      }
      if (this.colToPropCache && isDefined(this.colToPropCache[physicalColumn])) {
        return this.colToPropCache[physicalColumn];
      }
      return physicalColumn;
    }
  }, {
    key: "propToCol",
    value: function propToCol(prop) {
      var cachedPhysicalIndex = this.propToColCache.get(prop);
      if (isDefined(cachedPhysicalIndex)) {
        return this.instance.toVisualColumn(cachedPhysicalIndex);
      }
      var visualColumn = this.instance.toVisualColumn(prop);
      if (visualColumn === null) {
        return prop;
      }
      return visualColumn;
    }
  }, {
    key: "getSchema",
    value: function getSchema() {
      var schema = this.tableMeta.dataSchema;
      if (schema) {
        if (typeof schema === "function") {
          return schema();
        }
        return schema;
      }
      return this.duckSchema;
    }
  }, {
    key: "createRow",
    value: function createRow(index) {
      var _this2 = this;
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      var source = arguments.length > 2 ? arguments[2] : void 0;
      var sourceRowsCount = this.instance.countSourceRows();
      var physicalRowIndex = sourceRowsCount;
      var numberOfCreatedRows = 0;
      var rowIndex = index;
      if (typeof rowIndex !== "number" || rowIndex >= sourceRowsCount) {
        rowIndex = sourceRowsCount;
      }
      if (rowIndex < this.instance.countRows()) {
        physicalRowIndex = this.instance.toPhysicalRow(rowIndex);
      }
      var continueProcess = this.instance.runHooks("beforeCreateRow", rowIndex, amount, source);
      if (continueProcess === false || physicalRowIndex === null) {
        return 0;
      }
      var maxRows = this.tableMeta.maxRows;
      var columnCount = this.instance.countCols();
      var rowsToAdd = [];
      var _loop = function _loop2() {
        var row = null;
        if (_this2.instance.dataType === "array") {
          if (_this2.tableMeta.dataSchema) {
            row = deepClone(_this2.getSchema());
          } else {
            row = [];
            rangeEach(columnCount - 1, function() {
              return row.push(null);
            });
          }
        } else if (_this2.instance.dataType === "function") {
          row = _this2.tableMeta.dataSchema(rowIndex + numberOfCreatedRows);
        } else {
          row = {};
          deepExtend(row, _this2.getSchema());
        }
        rowsToAdd.push(row);
        numberOfCreatedRows += 1;
      };
      while (numberOfCreatedRows < amount && sourceRowsCount + numberOfCreatedRows < maxRows) {
        _loop();
      }
      this.instance.rowIndexMapper.insertIndexes(rowIndex, numberOfCreatedRows);
      this.spliceData.apply(this, [physicalRowIndex, 0].concat(rowsToAdd));
      this.instance.runHooks("afterCreateRow", rowIndex, numberOfCreatedRows, source);
      this.instance.forceFullRender = true;
      return numberOfCreatedRows;
    }
  }, {
    key: "createCol",
    value: function createCol(index) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      var source = arguments.length > 2 ? arguments[2] : void 0;
      if (!this.instance.isColumnModificationAllowed()) {
        throw new Error("Cannot create new column. When data source in an object, you can only have as much columns as defined in first data row, data schema or in the 'columns' setting.If you want to be able to add new columns, you have to use array datasource.");
      }
      var dataSource = this.dataSource;
      var maxCols = this.tableMeta.maxCols;
      var columnIndex = index;
      if (typeof columnIndex !== "number" || columnIndex >= this.instance.countSourceCols()) {
        columnIndex = this.instance.countSourceCols();
      }
      var continueProcess = this.instance.runHooks("beforeCreateCol", columnIndex, amount, source);
      if (continueProcess === false) {
        return 0;
      }
      var physicalColumnIndex = this.instance.countSourceCols();
      if (columnIndex < this.instance.countCols()) {
        physicalColumnIndex = this.instance.toPhysicalColumn(columnIndex);
      }
      var numberOfSourceRows = this.instance.countSourceRows();
      var nrOfColumns = this.instance.countCols();
      var numberOfCreatedCols = 0;
      var currentIndex = physicalColumnIndex;
      while (numberOfCreatedCols < amount && nrOfColumns < maxCols) {
        if (typeof columnIndex !== "number" || columnIndex >= nrOfColumns) {
          if (numberOfSourceRows > 0) {
            for (var row = 0; row < numberOfSourceRows; row += 1) {
              if (typeof dataSource[row] === "undefined") {
                dataSource[row] = [];
              }
              dataSource[row].push(null);
            }
          } else {
            dataSource.push([null]);
          }
        } else {
          for (var _row = 0; _row < numberOfSourceRows; _row++) {
            dataSource[_row].splice(currentIndex, 0, null);
          }
        }
        numberOfCreatedCols += 1;
        currentIndex += 1;
        nrOfColumns += 1;
      }
      this.instance.columnIndexMapper.insertIndexes(columnIndex, numberOfCreatedCols);
      this.instance.runHooks("afterCreateCol", columnIndex, numberOfCreatedCols, source);
      this.instance.forceFullRender = true;
      return numberOfCreatedCols;
    }
  }, {
    key: "removeRow",
    value: function removeRow(index) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      var source = arguments.length > 2 ? arguments[2] : void 0;
      var rowIndex = Number.isInteger(index) ? index : -amount;
      var removedPhysicalIndexes = this.visualRowsToPhysical(rowIndex, amount);
      var sourceRowsLength = this.instance.countSourceRows();
      rowIndex = (sourceRowsLength + rowIndex) % sourceRowsLength;
      var actionWasNotCancelled = this.instance.runHooks("beforeRemoveRow", rowIndex, removedPhysicalIndexes.length, removedPhysicalIndexes, source);
      if (actionWasNotCancelled === false) {
        return false;
      }
      var numberOfRemovedIndexes = removedPhysicalIndexes.length;
      this.filterData(rowIndex, numberOfRemovedIndexes, removedPhysicalIndexes);
      if (rowIndex < this.instance.countRows()) {
        this.instance.rowIndexMapper.removeIndexes(removedPhysicalIndexes);
        var customDefinedColumns = isDefined(this.tableMeta.columns) || isDefined(this.tableMeta.dataSchema);
        if (this.instance.rowIndexMapper.getNotTrimmedIndexesLength() === 0 && customDefinedColumns === false) {
          this.instance.columnIndexMapper.setIndexesSequence([]);
        }
      }
      this.instance.runHooks("afterRemoveRow", rowIndex, numberOfRemovedIndexes, removedPhysicalIndexes, source);
      this.instance.forceFullRender = true;
      return true;
    }
  }, {
    key: "removeCol",
    value: function removeCol(index) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      var source = arguments.length > 2 ? arguments[2] : void 0;
      if (this.instance.dataType === "object" || this.tableMeta.columns) {
        throw new Error("cannot remove column with object data source or columns option specified");
      }
      var columnIndex = typeof index !== "number" ? -amount : index;
      columnIndex = (this.instance.countCols() + columnIndex) % this.instance.countCols();
      var logicColumns = this.visualColumnsToPhysical(columnIndex, amount);
      var descendingLogicColumns = logicColumns.slice(0).sort(function(a, b) {
        return b - a;
      });
      var actionWasNotCancelled = this.instance.runHooks("beforeRemoveCol", columnIndex, amount, logicColumns, source);
      if (actionWasNotCancelled === false) {
        return false;
      }
      var isTableUniform = true;
      var removedColumnsCount = descendingLogicColumns.length;
      var data = this.dataSource;
      for (var c = 0; c < removedColumnsCount; c++) {
        if (isTableUniform && logicColumns[0] !== logicColumns[c] - c) {
          isTableUniform = false;
        }
      }
      if (isTableUniform) {
        for (var r = 0, rlen = this.instance.countSourceRows(); r < rlen; r++) {
          data[r].splice(logicColumns[0], amount);
        }
      } else {
        for (var _r = 0, _rlen = this.instance.countSourceRows(); _r < _rlen; _r++) {
          for (var _c = 0; _c < removedColumnsCount; _c++) {
            data[_r].splice(descendingLogicColumns[_c], 1);
          }
        }
      }
      if (columnIndex < this.instance.countCols()) {
        this.instance.columnIndexMapper.removeIndexes(logicColumns);
        if (this.instance.columnIndexMapper.getNotTrimmedIndexesLength() === 0) {
          this.instance.rowIndexMapper.setIndexesSequence([]);
        }
      }
      this.instance.runHooks("afterRemoveCol", columnIndex, amount, logicColumns, source);
      this.instance.forceFullRender = true;
      return true;
    }
  }, {
    key: "spliceCol",
    value: function spliceCol(col, index, amount) {
      var colData = this.instance.getDataAtCol(col);
      var removed = colData.slice(index, index + amount);
      var after = colData.slice(index + amount);
      for (var _len = arguments.length, elements = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        elements[_key - 3] = arguments[_key];
      }
      extendArray(elements, after);
      var i = 0;
      while (i < amount) {
        elements.push(null);
        i += 1;
      }
      to2dArray(elements);
      this.instance.populateFromArray(index, col, elements, null, null, "spliceCol");
      return removed;
    }
  }, {
    key: "spliceRow",
    value: function spliceRow(row, index, amount) {
      var rowData = this.instance.getSourceDataAtRow(row);
      var removed = rowData.slice(index, index + amount);
      var after = rowData.slice(index + amount);
      for (var _len2 = arguments.length, elements = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        elements[_key2 - 3] = arguments[_key2];
      }
      extendArray(elements, after);
      var i = 0;
      while (i < amount) {
        elements.push(null);
        i += 1;
      }
      this.instance.populateFromArray(row, index, [elements], null, null, "spliceRow");
      return removed;
    }
  }, {
    key: "spliceData",
    value: function spliceData(index, amount) {
      for (var _len3 = arguments.length, elements = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        elements[_key3 - 2] = arguments[_key3];
      }
      var continueSplicing = this.instance.runHooks("beforeDataSplice", index, amount, elements);
      if (continueSplicing !== false) {
        var _this$dataSource;
        (_this$dataSource = this.dataSource).splice.apply(_this$dataSource, [index, amount].concat(elements));
      }
    }
  }, {
    key: "filterData",
    value: function filterData(index, amount, physicalRows) {
      var data = this.instance.runHooks("filterData", index, amount, physicalRows);
      if (Array.isArray(data) === false) {
        data = this.dataSource.filter(function(row, rowIndex) {
          return physicalRows.indexOf(rowIndex) === -1;
        });
      }
      this.dataSource.length = 0;
      Array.prototype.push.apply(this.dataSource, data);
    }
  }, {
    key: "get",
    value: function get(row, prop) {
      var physicalRow = this.instance.toPhysicalRow(row);
      var dataRow = this.dataSource[physicalRow];
      var modifiedRowData = this.instance.runHooks("modifyRowData", physicalRow);
      dataRow = isNaN(modifiedRowData) ? modifiedRowData : dataRow;
      var value = null;
      if (dataRow && dataRow.hasOwnProperty && hasOwnProperty(dataRow, prop)) {
        value = dataRow[prop];
      } else if (typeof prop === "string" && prop.indexOf(".") > -1) {
        var sliced = prop.split(".");
        var out = dataRow;
        if (!out) {
          return null;
        }
        for (var i = 0, ilen = sliced.length; i < ilen; i++) {
          out = out[sliced[i]];
          if (typeof out === "undefined") {
            return null;
          }
        }
        value = out;
      } else if (typeof prop === "function") {
        value = prop(this.dataSource.slice(physicalRow, physicalRow + 1)[0]);
      }
      if (this.instance.hasHook("modifyData")) {
        var valueHolder = createObjectPropListener(value);
        this.instance.runHooks("modifyData", physicalRow, this.propToCol(prop), valueHolder, "get");
        if (valueHolder.isTouched()) {
          value = valueHolder.value;
        }
      }
      return value;
    }
  }, {
    key: "getCopyable",
    value: function getCopyable(row, prop) {
      if (copyableLookup.call(this.instance, row, this.propToCol(prop))) {
        return this.get(row, prop);
      }
      return "";
    }
  }, {
    key: "set",
    value: function set(row, prop, value) {
      var physicalRow = this.instance.toPhysicalRow(row);
      var newValue = value;
      var dataRow = this.dataSource[physicalRow];
      var modifiedRowData = this.instance.runHooks("modifyRowData", physicalRow);
      dataRow = isNaN(modifiedRowData) ? modifiedRowData : dataRow;
      if (this.instance.hasHook("modifyData")) {
        var valueHolder = createObjectPropListener(newValue);
        this.instance.runHooks("modifyData", physicalRow, this.propToCol(prop), valueHolder, "set");
        if (valueHolder.isTouched()) {
          newValue = valueHolder.value;
        }
      }
      if (dataRow && dataRow.hasOwnProperty && hasOwnProperty(dataRow, prop)) {
        dataRow[prop] = newValue;
      } else if (typeof prop === "string" && prop.indexOf(".") > -1) {
        var sliced = prop.split(".");
        var out = dataRow;
        var i = 0;
        var ilen;
        for (i = 0, ilen = sliced.length - 1; i < ilen; i++) {
          if (typeof out[sliced[i]] === "undefined") {
            out[sliced[i]] = {};
          }
          out = out[sliced[i]];
        }
        out[sliced[i]] = newValue;
      } else if (typeof prop === "function") {
        prop(this.dataSource.slice(physicalRow, physicalRow + 1)[0], newValue);
      } else {
        dataRow[prop] = newValue;
      }
    }
  }, {
    key: "visualRowsToPhysical",
    value: function visualRowsToPhysical(index, amount) {
      var totalRows = this.instance.countSourceRows();
      var logicRows = [];
      var physicRow = (totalRows + index) % totalRows;
      var rowsToRemove = amount;
      var row;
      while (physicRow < totalRows && rowsToRemove) {
        row = this.instance.toPhysicalRow(physicRow);
        logicRows.push(row);
        rowsToRemove -= 1;
        physicRow += 1;
      }
      return logicRows;
    }
  }, {
    key: "visualColumnsToPhysical",
    value: function visualColumnsToPhysical(index, amount) {
      var totalCols = this.instance.countCols();
      var visualCols = [];
      var physicalCol = (totalCols + index) % totalCols;
      var colsToRemove = amount;
      while (physicalCol < totalCols && colsToRemove) {
        var col = this.instance.toPhysicalColumn(physicalCol);
        visualCols.push(col);
        colsToRemove -= 1;
        physicalCol += 1;
      }
      return visualCols;
    }
  }, {
    key: "clear",
    value: function clear() {
      for (var r = 0; r < this.instance.countSourceRows(); r++) {
        for (var c = 0; c < this.instance.countCols(); c++) {
          this.set(r, this.colToProp(c), "");
        }
      }
    }
  }, {
    key: "getLength",
    value: function getLength() {
      var maxRowsFromSettings = this.tableMeta.maxRows;
      var maxRows;
      if (maxRowsFromSettings < 0 || maxRowsFromSettings === 0) {
        maxRows = 0;
      } else {
        maxRows = maxRowsFromSettings || Infinity;
      }
      var length = this.instance.rowIndexMapper.getNotTrimmedIndexesLength();
      return Math.min(length, maxRows);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      var start = {
        row: 0,
        col: 0
      };
      var end = {
        row: Math.max(this.instance.countRows() - 1, 0),
        col: Math.max(this.instance.countCols() - 1, 0)
      };
      if (start.row - end.row === 0 && !this.instance.countSourceRows()) {
        return [];
      }
      return this.getRange(start, end, DataMap2.DESTINATION_RENDERER);
    }
  }, {
    key: "countCachedColumns",
    value: function countCachedColumns() {
      return this.colToPropCache.length;
    }
  }, {
    key: "getRange",
    value: function getRange(start, end, destination) {
      var output = [];
      var r;
      var c;
      var row;
      var maxRows = this.tableMeta.maxRows;
      var maxCols = this.tableMeta.maxCols;
      if (maxRows === 0 || maxCols === 0) {
        return [];
      }
      var getFn = destination === DataMap2.DESTINATION_CLIPBOARD_GENERATOR ? this.getCopyable : this.get;
      var rlen = Math.min(Math.max(maxRows - 1, 0), Math.max(start.row, end.row));
      var clen = Math.min(Math.max(maxCols - 1, 0), Math.max(start.col, end.col));
      for (r = Math.min(start.row, end.row); r <= rlen; r++) {
        row = [];
        var physicalRow = r >= 0 ? this.instance.toPhysicalRow(r) : r;
        for (c = Math.min(start.col, end.col); c <= clen; c++) {
          if (physicalRow === null) {
            break;
          }
          row.push(getFn.call(this, r, this.colToProp(c)));
        }
        if (physicalRow !== null) {
          output.push(row);
        }
      }
      return output;
    }
  }, {
    key: "getText",
    value: function getText(start, end) {
      return stringify$1(this.getRange(start, end, DataMap2.DESTINATION_RENDERER));
    }
  }, {
    key: "getCopyableText",
    value: function getCopyableText(start, end) {
      return stringify$1(this.getRange(start, end, DataMap2.DESTINATION_CLIPBOARD_GENERATOR));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.instance = null;
      this.tableMeta = null;
      this.dataSource = null;
      this.duckSchema = null;
      this.colToPropCache.length = 0;
      this.propToColCache.clear();
      this.propToColCache = void 0;
    }
  }], [{
    key: "DESTINATION_RENDERER",
    get: function get() {
      return 1;
    }
  }, {
    key: "DESTINATION_CLIPBOARD_GENERATOR",
    get: function get() {
      return 2;
    }
  }]);
  return DataMap2;
}();

function expandMetaType(type, metaObject) {
  var validType = typeof type === "string" ? _getItem$2(type) : type;
  if (!isObject(validType)) {
    return;
  }
  var preventSourceOverwrite = isObject(metaObject);
  var expandedType = {};
  objectEach(validType, function(value, property) {
    if (property !== "CELL_TYPE" && (!preventSourceOverwrite || preventSourceOverwrite && !hasOwnProperty(metaObject, property))) {
      expandedType[property] = value;
    }
  });
  return expandedType;
}
function columnFactory(TableMeta) {
  var conflictList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  function ColumnMeta() {
  }
  inherit(ColumnMeta, TableMeta);
  for (var i = 0; i < conflictList.length; i++) {
    ColumnMeta.prototype[conflictList[i]] = void 0;
  }
  return ColumnMeta;
}
function isUnsignedNumber(value) {
  return Number.isInteger(value) && value >= 0;
}
function assert(condition, errorMessage) {
  if (!condition()) {
    throw new Error("Assertion failed: ".concat(errorMessage));
  }
}
function isNullish(variable) {
  return variable === null || variable === void 0;
}

function _typeof$z(obj) {
  "@babel/helpers - typeof";
  return _typeof$z = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$z(obj);
}
var metaSchemaFactory = (function() {
  return {
    activeHeaderClassName: "ht__active_highlight",
    allowEmpty: true,
    allowHtml: false,
    allowInsertColumn: true,
    allowInsertRow: true,
    allowInvalid: true,
    allowRemoveColumn: true,
    allowRemoveRow: true,
    autoColumnSize: void 0,
    autoRowSize: void 0,
    autoWrapCol: false,
    autoWrapRow: false,
    bindRowsWithHeaders: void 0,
    cell: [],
    cells: void 0,
    checkedTemplate: void 0,
    className: void 0,
    colHeaders: null,
    collapsibleColumns: void 0,
    columnHeaderHeight: void 0,
    columns: void 0,
    columnSorting: void 0,
    columnSummary: void 0,
    colWidths: void 0,
    commentedCellClassName: "htCommentCell",
    comments: false,
    contextMenu: void 0,
    copyable: true,
    copyPaste: true,
    correctFormat: false,
    currentColClassName: void 0,
    currentHeaderClassName: "ht__highlight",
    currentRowClassName: void 0,
    customBorders: false,
    data: void 0,
    dataSchema: void 0,
    dateFormat: "DD/MM/YYYY",
    datePickerConfig: void 0,
    defaultDate: void 0,
    disableVisualSelection: false,
    dragToScroll: true,
    dropdownMenu: void 0,
    editor: void 0,
    enterBeginsEditing: true,
    enterMoves: {
      col: 0,
      row: 1
    },
    fillHandle: {
      autoInsertRow: false
    },
    filter: true,
    filteringCaseSensitive: false,
    filters: void 0,
    fixedColumnsLeft: 0,
    fixedColumnsStart: 0,
    fixedRowsBottom: 0,
    fixedRowsTop: 0,
    formulas: void 0,
    fragmentSelection: false,
    height: void 0,
    hiddenColumns: void 0,
    hiddenRows: void 0,
    invalidCellClassName: "htInvalid",
    isEmptyCol: function isEmptyCol(col) {
      var row;
      var rowLen;
      var value;
      for (row = 0, rowLen = this.countRows(); row < rowLen; row++) {
        value = this.getDataAtCell(row, col);
        if (isEmpty(value) === false) {
          return false;
        }
      }
      return true;
    },
    isEmptyRow: function isEmptyRow(row) {
      var col;
      var colLen;
      var value;
      var meta;
      for (col = 0, colLen = this.countCols(); col < colLen; col++) {
        value = this.getDataAtCell(row, col);
        if (isEmpty(value) === false) {
          if (_typeof$z(value) === "object") {
            meta = this.getCellMeta(row, col);
            return isObjectEqual(this.getSchema()[meta.prop], value);
          }
          return false;
        }
      }
      return true;
    },
    label: void 0,
    language: "en-US",
    layoutDirection: "inherit",
    licenseKey: void 0,
    locale: "en-US",
    manualColumnFreeze: void 0,
    manualColumnMove: void 0,
    manualColumnResize: void 0,
    manualRowMove: void 0,
    manualRowResize: void 0,
    maxCols: Infinity,
    maxRows: Infinity,
    mergeCells: false,
    minCols: 0,
    minRows: 0,
    minSpareCols: 0,
    minSpareRows: 0,
    multiColumnSorting: void 0,
    nestedHeaders: void 0,
    nestedRows: void 0,
    noWordWrapClassName: "htNoWrap",
    numericFormat: void 0,
    observeDOMVisibility: true,
    outsideClickDeselects: true,
    persistentState: void 0,
    placeholder: void 0,
    placeholderCellClassName: "htPlaceholder",
    preventOverflow: false,
    preventWheel: false,
    readOnly: false,
    readOnlyCellClassName: "htDimmed",
    renderAllRows: void 0,
    renderer: void 0,
    rowHeaders: void 0,
    rowHeaderWidth: void 0,
    rowHeights: void 0,
    search: false,
    selectionMode: "multiple",
    selectOptions: void 0,
    skipColumnOnPaste: false,
    skipRowOnPaste: false,
    sortByRelevance: true,
    source: void 0,
    startCols: 5,
    startRows: 5,
    stretchH: "none",
    strict: void 0,
    tableClassName: void 0,
    tabMoves: {
      row: 0,
      col: 1
    },
    title: void 0,
    trimDropdown: true,
    trimRows: void 0,
    trimWhitespace: true,
    type: "text",
    uncheckedTemplate: void 0,
    undo: void 0,
    validator: void 0,
    viewportColumnRenderingOffset: "auto",
    viewportRowRenderingOffset: "auto",
    visibleRows: 10,
    width: void 0,
    wordWrap: true
  };
});

function _defineProperties$13(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$13(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$13(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$13(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _classCallCheck$13(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function createTableMetaEmptyClass() {
  return /* @__PURE__ */ _createClass$13(function TableMeta() {
    _classCallCheck$13(this, TableMeta);
  });
}
var GlobalMeta = /* @__PURE__ */ function() {
  function GlobalMeta2(hot) {
    _classCallCheck$13(this, GlobalMeta2);
    this.metaCtor = createTableMetaEmptyClass();
    this.meta = this.metaCtor.prototype;
    extend(this.meta, metaSchemaFactory());
    this.meta.instance = hot;
  }
  _createClass$13(GlobalMeta2, [{
    key: "getMetaConstructor",
    value: function getMetaConstructor() {
      return this.metaCtor;
    }
  }, {
    key: "getMeta",
    value: function getMeta() {
      return this.meta;
    }
  }, {
    key: "updateMeta",
    value: function updateMeta(settings) {
      extend(this.meta, settings);
      extend(this.meta, expandMetaType(settings.type, settings));
    }
  }]);
  return GlobalMeta2;
}();

function _classCallCheck$14(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$14(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$14(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$14(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$14(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var TableMeta = /* @__PURE__ */ function() {
  function TableMeta2(globalMeta) {
    _classCallCheck$14(this, TableMeta2);
    var MetaCtor = globalMeta.getMetaConstructor();
    this.meta = new MetaCtor();
  }
  _createClass$14(TableMeta2, [{
    key: "getMeta",
    value: function getMeta() {
      return this.meta;
    }
  }, {
    key: "updateMeta",
    value: function updateMeta(settings) {
      extend(this.meta, settings);
      extend(this.meta, expandMetaType(settings.type, settings));
    }
  }]);
  return TableMeta2;
}();

function _classCallCheck$15(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$15(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$15(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$15(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$15(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var LazyFactoryMap = /* @__PURE__ */ function(_Symbol$iterator) {
  function LazyFactoryMap2(valueFactory) {
    _classCallCheck$15(this, LazyFactoryMap2);
    this.valueFactory = valueFactory;
    this.data = [];
    this.index = [];
    this.holes = new Set();
  }
  _createClass$15(LazyFactoryMap2, [{
    key: "obtain",
    value: function obtain(key) {
      assert(function() {
        return isUnsignedNumber(key);
      }, "Expecting an unsigned number.");
      var dataIndex = this._getStorageIndexByKey(key);
      var result;
      if (dataIndex >= 0) {
        result = this.data[dataIndex];
        if (result === void 0) {
          result = this.valueFactory(key);
          this.data[dataIndex] = result;
        }
      } else {
        result = this.valueFactory(key);
        if (this.holes.size > 0) {
          var reuseIndex = this.holes.values().next().value;
          this.holes.delete(reuseIndex);
          this.data[reuseIndex] = result;
          this.index[key] = reuseIndex;
        } else {
          this.data.push(result);
          this.index[key] = this.data.length - 1;
        }
      }
      return result;
    }
  }, {
    key: "insert",
    value: function insert(key) {
      var _this$index;
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      assert(function() {
        return isUnsignedNumber(key) || isNullish(key);
      }, "Expecting an unsigned number or null/undefined argument.");
      var newIndexes = [];
      var dataLength = this.data.length;
      for (var i = 0; i < amount; i++) {
        newIndexes.push(dataLength + i);
        this.data.push(void 0);
      }
      (_this$index = this.index).splice.apply(_this$index, [isNullish(key) ? this.index.length : key, 0].concat(newIndexes));
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      assert(function() {
        return isUnsignedNumber(key) || isNullish(key);
      }, "Expecting an unsigned number or null/undefined argument.");
      var removed = this.index.splice(isNullish(key) ? this.index.length - amount : key, amount);
      for (var i = 0; i < removed.length; i++) {
        var removedIndex = removed[i];
        if (typeof removedIndex === "number") {
          this.holes.add(removedIndex);
        }
      }
    }
  }, {
    key: "size",
    value: function size() {
      return this.data.length - this.holes.size;
    }
  }, {
    key: "values",
    value: function values() {
      var _this = this;
      return arrayFilter(this.data, function(_, index) {
        return !_this.holes.has(index);
      })[Symbol.iterator]();
    }
  }, {
    key: "entries",
    value: function entries() {
      var validEntries = [];
      for (var i = 0; i < this.data.length; i++) {
        var keyIndex = this._getKeyByStorageIndex(i);
        if (keyIndex !== -1) {
          validEntries.push([keyIndex, this.data[i]]);
        }
      }
      var dataIndex = 0;
      return {
        next: function next() {
          if (dataIndex < validEntries.length) {
            var value = validEntries[dataIndex];
            dataIndex += 1;
            return {
              value,
              done: false
            };
          }
          return {
            done: true
          };
        }
      };
    }
  }, {
    key: "clear",
    value: function clear() {
      this.data = [];
      this.index = [];
      this.holes.clear();
    }
  }, {
    key: "_getStorageIndexByKey",
    value: function _getStorageIndexByKey(key) {
      return this.index.length > key ? this.index[key] : -1;
    }
  }, {
    key: "_getKeyByStorageIndex",
    value: function _getKeyByStorageIndex(dataIndex) {
      return this.index.indexOf(dataIndex);
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this.entries();
    }
  }]);
  return LazyFactoryMap2;
}(Symbol.iterator);

function _classCallCheck$16(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$16(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$16(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$16(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$16(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var COLUMNS_PROPS_CONFLICTS = ["data", "width"];
var ColumnMeta = /* @__PURE__ */ function() {
  function ColumnMeta2(globalMeta) {
    var _this = this;
    _classCallCheck$16(this, ColumnMeta2);
    this.globalMeta = globalMeta;
    this.metas = new LazyFactoryMap(function() {
      return _this._createMeta();
    });
  }
  _createClass$16(ColumnMeta2, [{
    key: "updateMeta",
    value: function updateMeta(physicalColumn, settings) {
      var meta = this.getMeta(physicalColumn);
      extend(meta, settings);
      extend(meta, expandMetaType(settings.type, meta));
    }
  }, {
    key: "createColumn",
    value: function createColumn(physicalColumn, amount) {
      this.metas.insert(physicalColumn, amount);
    }
  }, {
    key: "removeColumn",
    value: function removeColumn(physicalColumn, amount) {
      this.metas.remove(physicalColumn, amount);
    }
  }, {
    key: "getMeta",
    value: function getMeta(physicalColumn) {
      return this.metas.obtain(physicalColumn);
    }
  }, {
    key: "getMetaConstructor",
    value: function getMetaConstructor(physicalColumn) {
      return this.metas.obtain(physicalColumn).constructor;
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.metas.clear();
    }
  }, {
    key: "_createMeta",
    value: function _createMeta() {
      return columnFactory(this.globalMeta.getMetaConstructor(), COLUMNS_PROPS_CONFLICTS).prototype;
    }
  }]);
  return ColumnMeta2;
}();

function _toConsumableArray$g(arr) {
  return _arrayWithoutHoles$g(arr) || _iterableToArray$g(arr) || _unsupportedIterableToArray$m(arr) || _nonIterableSpread$g();
}
function _nonIterableSpread$g() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$m(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$m(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$m(o, minLen);
}
function _iterableToArray$g(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$g(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$m(arr);
}
function _arrayLikeToArray$m(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _classCallCheck$17(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$17(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$17(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$17(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$17(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var CellMeta = /* @__PURE__ */ function() {
  function CellMeta2(columnMeta) {
    var _this = this;
    _classCallCheck$17(this, CellMeta2);
    this.columnMeta = columnMeta;
    this.metas = new LazyFactoryMap(function() {
      return _this._createRow();
    });
  }
  _createClass$17(CellMeta2, [{
    key: "updateMeta",
    value: function updateMeta(physicalRow, physicalColumn, settings) {
      var meta = this.getMeta(physicalRow, physicalColumn);
      extend(meta, settings);
      extend(meta, expandMetaType(settings.type, meta));
    }
  }, {
    key: "createRow",
    value: function createRow(physicalRow, amount) {
      this.metas.insert(physicalRow, amount);
    }
  }, {
    key: "createColumn",
    value: function createColumn(physicalColumn, amount) {
      for (var i = 0; i < this.metas.size(); i++) {
        this.metas.obtain(i).insert(physicalColumn, amount);
      }
    }
  }, {
    key: "removeRow",
    value: function removeRow(physicalRow, amount) {
      this.metas.remove(physicalRow, amount);
    }
  }, {
    key: "removeColumn",
    value: function removeColumn(physicalColumn, amount) {
      for (var i = 0; i < this.metas.size(); i++) {
        this.metas.obtain(i).remove(physicalColumn, amount);
      }
    }
  }, {
    key: "getMeta",
    value: function getMeta(physicalRow, physicalColumn, key) {
      var cellMeta = this.metas.obtain(physicalRow).obtain(physicalColumn);
      if (key === void 0) {
        return cellMeta;
      }
      return cellMeta[key];
    }
  }, {
    key: "setMeta",
    value: function setMeta(physicalRow, physicalColumn, key, value) {
      var cellMeta = this.metas.obtain(physicalRow).obtain(physicalColumn);
      cellMeta[key] = value;
    }
  }, {
    key: "removeMeta",
    value: function removeMeta(physicalRow, physicalColumn, key) {
      var cellMeta = this.metas.obtain(physicalRow).obtain(physicalColumn);
      delete cellMeta[key];
    }
  }, {
    key: "getMetas",
    value: function getMetas() {
      var metas = [];
      var rows = Array.from(this.metas.values());
      for (var row = 0; row < rows.length; row++) {
        metas.push.apply(metas, _toConsumableArray$g(rows[row].values()));
      }
      return metas;
    }
  }, {
    key: "getMetasAtRow",
    value: function getMetasAtRow(physicalRow) {
      assert(function() {
        return isUnsignedNumber(physicalRow);
      }, "Expecting an unsigned number.");
      var rowsMeta = new Map(this.metas);
      return rowsMeta.has(physicalRow) ? Array.from(rowsMeta.get(physicalRow).values()) : [];
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.metas.clear();
    }
  }, {
    key: "_createRow",
    value: function _createRow() {
      var _this2 = this;
      return new LazyFactoryMap(function(physicalColumn) {
        return _this2._createMeta(physicalColumn);
      });
    }
  }, {
    key: "_createMeta",
    value: function _createMeta(physicalColumn) {
      var ColumnMeta = this.columnMeta.getMetaConstructor(physicalColumn);
      return new ColumnMeta();
    }
  }]);
  return CellMeta2;
}();

function _classCallCheck$18(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$18(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$18(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$18(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$18(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var MetaManager = /* @__PURE__ */ function() {
  function MetaManager2(hot) {
    var _this = this;
    var customSettings = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var metaMods = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    _classCallCheck$18(this, MetaManager2);
    this.hot = hot;
    this.globalMeta = new GlobalMeta(hot);
    this.tableMeta = new TableMeta(this.globalMeta);
    this.columnMeta = new ColumnMeta(this.globalMeta);
    this.cellMeta = new CellMeta(this.columnMeta);
    metaMods.forEach(function(ModifierClass) {
      return new ModifierClass(_this);
    });
    this.globalMeta.updateMeta(customSettings);
  }
  _createClass$18(MetaManager2, [{
    key: "getGlobalMeta",
    value: function getGlobalMeta() {
      return this.globalMeta.getMeta();
    }
  }, {
    key: "updateGlobalMeta",
    value: function updateGlobalMeta(settings) {
      this.globalMeta.updateMeta(settings);
    }
  }, {
    key: "getTableMeta",
    value: function getTableMeta() {
      return this.tableMeta.getMeta();
    }
  }, {
    key: "updateTableMeta",
    value: function updateTableMeta(settings) {
      this.tableMeta.updateMeta(settings);
    }
  }, {
    key: "getColumnMeta",
    value: function getColumnMeta(physicalColumn) {
      return this.columnMeta.getMeta(physicalColumn);
    }
  }, {
    key: "updateColumnMeta",
    value: function updateColumnMeta(physicalColumn, settings) {
      this.columnMeta.updateMeta(physicalColumn, settings);
    }
  }, {
    key: "getCellMeta",
    value: function getCellMeta(physicalRow, physicalColumn, _ref) {
      var visualRow = _ref.visualRow, visualColumn = _ref.visualColumn;
      var cellMeta = this.cellMeta.getMeta(physicalRow, physicalColumn);
      cellMeta.visualRow = visualRow;
      cellMeta.visualCol = visualColumn;
      cellMeta.row = physicalRow;
      cellMeta.col = physicalColumn;
      this.runLocalHooks("afterGetCellMeta", cellMeta);
      return cellMeta;
    }
  }, {
    key: "getCellMetaKeyValue",
    value: function getCellMetaKeyValue(physicalRow, physicalColumn, key) {
      if (typeof key !== "string") {
        throw new Error("The passed cell meta object key is not a string");
      }
      return this.cellMeta.getMeta(physicalRow, physicalColumn, key);
    }
  }, {
    key: "setCellMeta",
    value: function setCellMeta(physicalRow, physicalColumn, key, value) {
      this.cellMeta.setMeta(physicalRow, physicalColumn, key, value);
    }
  }, {
    key: "updateCellMeta",
    value: function updateCellMeta(physicalRow, physicalColumn, settings) {
      this.cellMeta.updateMeta(physicalRow, physicalColumn, settings);
    }
  }, {
    key: "removeCellMeta",
    value: function removeCellMeta(physicalRow, physicalColumn, key) {
      this.cellMeta.removeMeta(physicalRow, physicalColumn, key);
    }
  }, {
    key: "getCellsMeta",
    value: function getCellsMeta() {
      return this.cellMeta.getMetas();
    }
  }, {
    key: "getCellsMetaAtRow",
    value: function getCellsMetaAtRow(physicalRow) {
      return this.cellMeta.getMetasAtRow(physicalRow);
    }
  }, {
    key: "createRow",
    value: function createRow(physicalRow) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      this.cellMeta.createRow(physicalRow, amount);
    }
  }, {
    key: "removeRow",
    value: function removeRow(physicalRow) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      this.cellMeta.removeRow(physicalRow, amount);
    }
  }, {
    key: "createColumn",
    value: function createColumn(physicalColumn) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      this.cellMeta.createColumn(physicalColumn, amount);
      this.columnMeta.createColumn(physicalColumn, amount);
    }
  }, {
    key: "removeColumn",
    value: function removeColumn(physicalColumn) {
      var amount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      this.cellMeta.removeColumn(physicalColumn, amount);
      this.columnMeta.removeColumn(physicalColumn, amount);
    }
  }, {
    key: "clearCellsCache",
    value: function clearCellsCache() {
      this.cellMeta.clearCache();
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.cellMeta.clearCache();
      this.columnMeta.clearCache();
    }
  }]);
  return MetaManager2;
}();
mixin(MetaManager, localHooks);

function _typeof$A(obj) {
  "@babel/helpers - typeof";
  return _typeof$A = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$A(obj);
}
function replaceData(data, setDataMapFunction, callbackFunction, config) {
  var hotInstance = config.hotInstance, dataMap = config.dataMap, dataSource = config.dataSource, internalSource = config.internalSource, source = config.source, firstRun = config.firstRun;
  var capitalizedInternalSource = toUpperCaseFirst(internalSource);
  var tableMeta = hotInstance.getSettings();
  if (Array.isArray(tableMeta.dataSchema)) {
    hotInstance.dataType = "array";
  } else if (isFunction(tableMeta.dataSchema)) {
    hotInstance.dataType = "function";
  } else {
    hotInstance.dataType = "object";
  }
  if (dataMap) {
    dataMap.destroy();
  }
  data = hotInstance.runHooks("before".concat(capitalizedInternalSource), data, firstRun, source);
  var newDataMap = new DataMap(hotInstance, data, tableMeta);
  setDataMapFunction(newDataMap);
  if (_typeof$A(data) === "object" && data !== null) {
    if (!(data.push && data.splice)) {
      data = [data];
    }
  } else if (data === null) {
    var dataSchema = newDataMap.getSchema();
    data = [];
    var row;
    var r = 0;
    var rlen = 0;
    for (r = 0, rlen = tableMeta.startRows; r < rlen; r++) {
      if ((hotInstance.dataType === "object" || hotInstance.dataType === "function") && tableMeta.dataSchema) {
        row = deepClone(dataSchema);
        data.push(row);
      } else if (hotInstance.dataType === "array") {
        row = deepClone(dataSchema[0]);
        data.push(row);
      } else {
        row = [];
        for (var c = 0, clen = tableMeta.startCols; c < clen; c++) {
          row.push(null);
        }
        data.push(row);
      }
    }
  } else {
    throw new Error("".concat(internalSource, " only accepts array of objects or array of arrays (").concat(_typeof$A(data), " given)"));
  }
  if (Array.isArray(data[0])) {
    hotInstance.dataType = "array";
  }
  tableMeta.data = data;
  newDataMap.dataSource = data;
  dataSource.data = data;
  dataSource.dataType = hotInstance.dataType;
  dataSource.colToProp = newDataMap.colToProp.bind(newDataMap);
  dataSource.propToCol = newDataMap.propToCol.bind(newDataMap);
  dataSource.countCachedColumns = newDataMap.countCachedColumns.bind(newDataMap);
  callbackFunction(newDataMap);
  hotInstance.runHooks("after".concat(capitalizedInternalSource), data, firstRun, source);
  if (!firstRun) {
    hotInstance.runHooks("afterChange", null, internalSource);
    hotInstance.render();
  }
}

function _classCallCheck$19(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$19(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$19(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$19(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$19(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var DynamicCellMetaMod = /* @__PURE__ */ function() {
  function DynamicCellMetaMod2(metaManager) {
    var _this = this;
    _classCallCheck$19(this, DynamicCellMetaMod2);
    this.metaManager = metaManager;
    this.metaSyncMemo = new Map();
    metaManager.addLocalHook("afterGetCellMeta", function(cellMeta) {
      return _this.extendCellMeta(cellMeta);
    });
    Hooks.getSingleton().add("beforeRender", function(forceFullRender) {
      if (forceFullRender) {
        _this.metaSyncMemo.clear();
      }
    }, this.metaManager.hot);
  }
  _createClass$19(DynamicCellMetaMod2, [{
    key: "extendCellMeta",
    value: function extendCellMeta(cellMeta) {
      var _this$metaSyncMemo$ge;
      var physicalRow = cellMeta.row, physicalColumn = cellMeta.col;
      if ((_this$metaSyncMemo$ge = this.metaSyncMemo.get(physicalRow)) !== null && _this$metaSyncMemo$ge !== void 0 && _this$metaSyncMemo$ge.has(physicalColumn)) {
        return;
      }
      var visualRow = cellMeta.visualRow, visualCol = cellMeta.visualCol;
      var hot = this.metaManager.hot;
      var prop = hot.colToProp(visualCol);
      cellMeta.prop = prop;
      hot.runHooks("beforeGetCellMeta", visualRow, visualCol, cellMeta);
      var cellType = hasOwnProperty(cellMeta, "type") ? cellMeta.type : null;
      var cellSettings = isFunction(cellMeta.cells) ? cellMeta.cells(physicalRow, physicalColumn, prop) : null;
      if (cellType) {
        if (cellSettings) {
          var _cellSettings$type;
          cellSettings.type = (_cellSettings$type = cellSettings.type) !== null && _cellSettings$type !== void 0 ? _cellSettings$type : cellType;
        } else {
          cellSettings = {
            type: cellType
          };
        }
      }
      if (cellSettings) {
        this.metaManager.updateCellMeta(physicalRow, physicalColumn, cellSettings);
      }
      hot.runHooks("afterGetCellMeta", visualRow, visualCol, cellMeta);
      if (!this.metaSyncMemo.has(physicalRow)) {
        this.metaSyncMemo.set(physicalRow, new Set());
      }
      this.metaSyncMemo.get(physicalRow).add(physicalColumn);
    }
  }]);
  return DynamicCellMetaMod2;
}();

function _classCallCheck$1a(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1a(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1a(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1a(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1a(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var ExtendMetaPropertiesMod = /* @__PURE__ */ function() {
  function ExtendMetaPropertiesMod2(metaManager) {
    _classCallCheck$1a(this, ExtendMetaPropertiesMod2);
    this.metaManager = metaManager;
    this.usageTracker = new Set();
    this.propDescriptors = new Map([["fixedColumnsLeft", {
      target: "fixedColumnsStart",
      onChange: function onChange(propName) {
        var isRtl = this.metaManager.hot.isRtl();
        if (isRtl && propName === "fixedColumnsLeft") {
          throw new Error("The `fixedColumnsLeft` is not supported for RTL. Please use option `fixedColumnsStart`.");
        }
        if (this.usageTracker.has("fixedColumnsLeft") && this.usageTracker.has("fixedColumnsStart")) {
          throw new Error("The `fixedColumnsLeft` and `fixedColumnsStart` should not be used together. Please use only the option `fixedColumnsStart`.");
        }
      }
    }], ["layoutDirection", {
      onChange: function onChange(propName, value, isInitialChange) {
        if (!isInitialChange) {
          throw new Error("The `".concat(propName, "` option can not be updated after the Handsontable is initialized."));
        }
      }
    }]]);
    this.extendMetaProps();
  }
  _createClass$1a(ExtendMetaPropertiesMod2, [{
    key: "extendMetaProps",
    value: function extendMetaProps() {
      var _this = this;
      this.propDescriptors.forEach(function(descriptor, alias) {
        var target = descriptor.target, _descriptor$onChange = descriptor.onChange, onChange = _descriptor$onChange === void 0 ? function() {
        } : _descriptor$onChange;
        var hasTarget = typeof target === "string";
        var targetProp = hasTarget ? target : alias;
        var origProp = "_".concat(targetProp);
        _this.metaManager.globalMeta.meta[origProp] = _this.metaManager.globalMeta.meta[targetProp];
        _this.installPropWatcher(alias, origProp, onChange);
        if (hasTarget) {
          _this.installPropWatcher(target, origProp, onChange);
        }
      });
    }
  }, {
    key: "installPropWatcher",
    value: function installPropWatcher(propName, origProp, onChange) {
      var self = this;
      Object.defineProperty(this.metaManager.globalMeta.meta, propName, {
        get: function get() {
          return this[origProp];
        },
        set: function set(value) {
          var isInitialChange = !self.usageTracker.has(propName);
          self.usageTracker.add(propName);
          onChange.call(self, propName, value, isInitialChange);
          this[origProp] = value;
        },
        enumerable: true,
        configurable: true
      });
    }
  }]);
  return ExtendMetaPropertiesMod2;
}();

var mappings = new Map([
  [" ", "space"],
  ["spacebar", "space"],
  ["scroll", "scrolllock"],
  ["del", "delete"],
  ["esc", "escape"],
  ["medianexttrack", "mediatracknext"],
  ["mediaprevioustrack", "mediatrackprevious"],
  ["volumeup", "audiovolumeup"],
  ["volumedown", "audiovolumedown"],
  ["volumemute", "audiovolumemute"],
  ["multiply", "*"],
  ["add", "+"],
  ["divide", "/"],
  ["subtract", "-"],
  ["left", "arrowleft"],
  ["right", "arrowright"],
  ["up", "arrowup"],
  ["down", "arrowdown"]
]);
var normalizeKeys = function normalizeKeys2(keys) {
  return keys.map(function(key) {
    var lowercaseKey = key.toLowerCase();
    if (mappings.has(lowercaseKey)) {
      return mappings.get(lowercaseKey);
    }
    return lowercaseKey;
  }).sort().join("+");
};
var getKeysList = function getKeysList2(normalizedKeys) {
  return normalizedKeys.split("+");
};
var normalizeEventKey = function normalizeEventKey2(key) {
  return key.toLowerCase();
};

var _templateObject$5;
function _toConsumableArray$h(arr) {
  return _arrayWithoutHoles$h(arr) || _iterableToArray$h(arr) || _unsupportedIterableToArray$n(arr) || _nonIterableSpread$h();
}
function _nonIterableSpread$h() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$h(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$h(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$n(arr);
}
function _slicedToArray$b(arr, i) {
  return _arrayWithHoles$b(arr) || _iterableToArrayLimit$b(arr, i) || _unsupportedIterableToArray$n(arr, i) || _nonIterableRest$b();
}
function _nonIterableRest$b() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$n(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$n(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$n(o, minLen);
}
function _arrayLikeToArray$n(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$b(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$b(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _taggedTemplateLiteral$5(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {raw: {value: Object.freeze(raw)}}));
}
var createContext = function createContext2(name) {
  var SHORTCUTS = createUniqueMap({
    errorIdExists: function errorIdExists(keys) {
      return 'The "'.concat(keys, '" shortcut is already registered in the "').concat(name, '" context.');
    }
  });
  var addShortcut = function addShortcut2() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, keys = _ref.keys, callback = _ref.callback, group = _ref.group, _ref$runOnlyIf = _ref.runOnlyIf, runOnlyIf = _ref$runOnlyIf === void 0 ? function() {
      return true;
    } : _ref$runOnlyIf, _ref$captureCtrl = _ref.captureCtrl, captureCtrl = _ref$captureCtrl === void 0 ? false : _ref$captureCtrl, _ref$preventDefault = _ref.preventDefault, preventDefault = _ref$preventDefault === void 0 ? true : _ref$preventDefault, _ref$stopPropagation = _ref.stopPropagation, stopPropagation = _ref$stopPropagation === void 0 ? false : _ref$stopPropagation, relativeToGroup = _ref.relativeToGroup, position = _ref.position;
    if (isUndefined(group)) {
      throw new Error("You need to define the shortcut's group.");
    }
    if (isFunction(callback) === false) {
      throw new Error("The shortcut's callback needs to be a function.");
    }
    if (Array.isArray(keys) === false) {
      throw new Error(toSingleLine(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral$5(["Pass the shortcut's keys as an array of arrays, \n      using the KeyboardEvent.key properties: \n      https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values."], ["Pass the shortcut\\'s keys as an array of arrays,\\x20\n      using the KeyboardEvent.key properties:\\x20\n      https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values."]))));
    }
    var newShortcut = {
      callback,
      group,
      runOnlyIf,
      captureCtrl,
      preventDefault,
      stopPropagation
    };
    if (isDefined(relativeToGroup)) {
      var _ref2 = [relativeToGroup, position];
      newShortcut.relativeToGroup = _ref2[0];
      newShortcut.position = _ref2[1];
    }
    keys.forEach(function(keyCombination) {
      var normalizedKeys = normalizeKeys(keyCombination);
      var hasKeyCombination = SHORTCUTS.hasItem(normalizedKeys);
      if (hasKeyCombination) {
        var shortcuts = SHORTCUTS.getItem(normalizedKeys);
        var insertionIndex = shortcuts.findIndex(function(shortcut) {
          return shortcut.group === relativeToGroup;
        });
        if (insertionIndex !== -1) {
          if (position === "before") {
            insertionIndex -= 1;
          } else {
            insertionIndex += 1;
          }
        } else {
          insertionIndex = shortcuts.length;
        }
        shortcuts.splice(insertionIndex, 0, newShortcut);
      } else {
        SHORTCUTS.addItem(normalizedKeys, [newShortcut]);
      }
    });
  };
  var addShortcuts = function addShortcuts2(shortcuts) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    shortcuts.forEach(function(shortcut) {
      objectEach(options, function(value, key) {
        if (Object.prototype.hasOwnProperty.call(shortcut, key) === false) {
          shortcut[key] = options[key];
        }
      });
      addShortcut(shortcut);
    });
  };
  var removeShortcutsByKeys = function removeShortcutsByKeys2(keys) {
    var normalizedKeys = normalizeKeys(keys);
    SHORTCUTS.removeItem(normalizedKeys);
  };
  var removeShortcutsByGroup = function removeShortcutsByGroup2(group) {
    var shortcuts = SHORTCUTS.getItems();
    shortcuts.forEach(function(_ref3) {
      var _ref4 = _slicedToArray$b(_ref3, 2), normalizedKeys = _ref4[0], shortcutOptions = _ref4[1];
      var leftOptions = shortcutOptions.filter(function(option) {
        return option.group !== group;
      });
      if (leftOptions.length === 0) {
        removeShortcutsByKeys(getKeysList(normalizedKeys));
      } else {
        shortcutOptions.length = 0;
        shortcutOptions.push.apply(shortcutOptions, _toConsumableArray$h(leftOptions));
      }
    });
  };
  var getShortcuts = function getShortcuts2(keys) {
    var normalizedKeys = normalizeKeys(keys);
    var shortcuts = SHORTCUTS.getItem(normalizedKeys);
    return isDefined(shortcuts) ? shortcuts.slice() : [];
  };
  var hasShortcut = function hasShortcut2(keys) {
    var normalizedKeys = normalizeKeys(keys);
    return SHORTCUTS.hasItem(normalizedKeys);
  };
  return {
    addShortcut,
    addShortcuts,
    getShortcuts,
    hasShortcut,
    removeShortcutsByKeys,
    removeShortcutsByGroup
  };
};

function createKeysObserver() {
  var PRESSED_KEYS = new Set();
  return {
    press: function press(key) {
      PRESSED_KEYS.add(key);
    },
    release: function release(key) {
      PRESSED_KEYS.delete(key);
    },
    releaseAll: function releaseAll() {
      PRESSED_KEYS.clear();
    },
    isPressed: function isPressed(key) {
      return PRESSED_KEYS.has(key);
    }
  };
}

var MODIFIER_KEYS = ["meta", "alt", "shift", "control"];
var modifierKeysObserver = createKeysObserver();
function useRecorder(ownerWindow, beforeKeyDown, afterKeyDown, callback) {
  var isModifierKey = function isModifierKey2(pressedKey) {
    return MODIFIER_KEYS.includes(pressedKey);
  };
  var getPressedModifierKeys = function getPressedModifierKeys2(event) {
    var mergeMetaKeys = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var pressedModifierKeys = [];
    if (event.altKey) {
      pressedModifierKeys.push("alt");
    }
    if (mergeMetaKeys && (event.ctrlKey || event.metaKey)) {
      pressedModifierKeys.push("control/meta");
    } else {
      if (event.ctrlKey) {
        pressedModifierKeys.push("control");
      }
      if (event.metaKey) {
        pressedModifierKeys.push("meta");
      }
    }
    if (event.shiftKey) {
      pressedModifierKeys.push("shift");
    }
    return pressedModifierKeys;
  };
  var onkeydown = function onkeydown2(event) {
    var result = beforeKeyDown(event);
    if (result === false || isImmediatePropagationStopped(event)) {
      return;
    }
    var pressedKey = normalizeEventKey(event.key);
    var extraModifierKeys = [];
    if (isModifierKey(pressedKey)) {
      modifierKeysObserver.press(pressedKey);
    } else {
      extraModifierKeys = getPressedModifierKeys(event);
    }
    var pressedKeys = [pressedKey].concat(extraModifierKeys);
    var isExecutionCancelled = callback(event, pressedKeys);
    if (!isExecutionCancelled && (isMacOS() && extraModifierKeys.includes("meta") || !isMacOS() && extraModifierKeys.includes("control"))) {
      callback(event, [pressedKey].concat(getPressedModifierKeys(event, true)));
    }
    afterKeyDown(event);
  };
  var onkeyup = function onkeyup2(event) {
    var pressedKey = normalizeEventKey(event.key);
    if (isModifierKey(pressedKey) === false) {
      return;
    }
    modifierKeysObserver.release(pressedKey);
  };
  var onblur = function onblur2() {
    modifierKeysObserver.releaseAll();
  };
  var mount = function mount2() {
    var eventTarget = ownerWindow;
    while (eventTarget) {
      eventTarget.addEventListener("keydown", onkeydown);
      eventTarget.addEventListener("keyup", onkeyup);
      eventTarget.addEventListener("blur", onblur);
      eventTarget = eventTarget.frameElement;
    }
  };
  var unmount = function unmount2() {
    var eventTarget = ownerWindow;
    while (eventTarget) {
      eventTarget.removeEventListener("keydown", onkeydown);
      eventTarget.removeEventListener("keyup", onkeyup);
      eventTarget.removeEventListener("blur", onblur);
      eventTarget = eventTarget.frameElement;
    }
  };
  return {
    mount,
    unmount,
    isPressed: function isPressed(key) {
      return modifierKeysObserver.isPressed(key);
    }
  };
}

var createShortcutManager = function createShortcutManager2(_ref) {
  var ownerWindow = _ref.ownerWindow, beforeKeyDown = _ref.beforeKeyDown, afterKeyDown = _ref.afterKeyDown;
  var CONTEXTS = createUniqueMap({
    errorIdExists: function errorIdExists(keys) {
      return 'The "'.concat(keys, '" context name is already registered.');
    }
  });
  var activeContextName = "grid";
  var addContext = function addContext2(contextName) {
    var context = createContext(contextName);
    CONTEXTS.addItem(contextName, context);
    return context;
  };
  var getActiveContextName = function getActiveContextName2() {
    return activeContextName;
  };
  var getContext = function getContext2(contextName) {
    return CONTEXTS.getItem(contextName);
  };
  var setActiveContextName = function setActiveContextName2(contextName) {
    activeContextName = contextName;
  };
  var isCtrlKeySilenced = false;
  var keyRecorder = useRecorder(ownerWindow, beforeKeyDown, afterKeyDown, function(event, keys) {
    var activeContext = getContext(getActiveContextName());
    var isExecutionCancelled = false;
    if (!activeContext.hasShortcut(keys)) {
      return isExecutionCancelled;
    }
    var shortcuts = activeContext.getShortcuts(keys);
    for (var index = 0; index < shortcuts.length; index++) {
      var _shortcuts$index = shortcuts[index], callback = _shortcuts$index.callback, runOnlyIf = _shortcuts$index.runOnlyIf, preventDefault = _shortcuts$index.preventDefault, stopPropagation = _shortcuts$index.stopPropagation, captureCtrl = _shortcuts$index.captureCtrl;
      if (runOnlyIf(event) !== false) {
        isCtrlKeySilenced = captureCtrl;
        isExecutionCancelled = callback(event, keys) === false;
        isCtrlKeySilenced = false;
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        if (isExecutionCancelled) {
          break;
        }
      }
    }
    return isExecutionCancelled;
  });
  keyRecorder.mount();
  return {
    addContext,
    getActiveContextName,
    getContext,
    setActiveContextName,
    isCtrlPressed: function isCtrlPressed() {
      return !isCtrlKeySilenced && (keyRecorder.isPressed("control") || keyRecorder.isPressed("meta"));
    },
    destroy: function destroy() {
      return keyRecorder.unmount();
    }
  };
};

function _typeof$B(obj) {
  "@babel/helpers - typeof";
  return _typeof$B = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$B(obj);
}
function _slicedToArray$c(arr, i) {
  return _arrayWithHoles$c(arr) || _iterableToArrayLimit$c(arr, i) || _unsupportedIterableToArray$o(arr, i) || _nonIterableRest$c();
}
function _nonIterableRest$c() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit$c(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$c(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _toConsumableArray$i(arr) {
  return _arrayWithoutHoles$i(arr) || _iterableToArray$i(arr) || _unsupportedIterableToArray$o(arr) || _nonIterableSpread$i();
}
function _nonIterableSpread$i() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$o(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$o(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$o(o, minLen);
}
function _iterableToArray$i(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$i(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$o(arr);
}
function _arrayLikeToArray$o(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var SHORTCUTS_GROUP = "gridDefault";
var activeGuid = null;
function Core(rootElement, userSettings) {
  var _userSettings$layoutD, _this = this;
  var rootInstanceSymbol = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var preventScrollingToCell = false;
  var instance = this;
  var eventManager = new EventManager(instance);
  var datamap;
  var dataSource;
  var grid;
  var editorManager;
  var firstRun = true;
  if (hasValidParameter(rootInstanceSymbol)) {
    registerAsRootInstance(this);
  }
  this.rootElement = rootElement;
  this.rootDocument = rootElement.ownerDocument;
  this.rootWindow = this.rootDocument.defaultView;
  this.isDestroyed = false;
  this.renderSuspendedCounter = 0;
  this.executionSuspendedCounter = 0;
  var layoutDirection = (_userSettings$layoutD = userSettings === null || userSettings === void 0 ? void 0 : userSettings.layoutDirection) !== null && _userSettings$layoutD !== void 0 ? _userSettings$layoutD : "inherit";
  var rootElementDirection = ["rtl", "ltr"].includes(layoutDirection) ? layoutDirection : this.rootWindow.getComputedStyle(this.rootElement).direction;
  this.rootElement.setAttribute("dir", rootElementDirection);
  this.isRtl = function() {
    return rootElementDirection === "rtl";
  };
  this.isLtr = function() {
    return !instance.isRtl();
  };
  this.getDirectionFactor = function() {
    return instance.isLtr() ? 1 : -1;
  };
  userSettings.language = getValidLanguageCode(userSettings.language);
  var metaManager = new MetaManager(instance, userSettings, [DynamicCellMetaMod, ExtendMetaPropertiesMod]);
  var tableMeta = metaManager.getTableMeta();
  var globalMeta = metaManager.getGlobalMeta();
  var pluginsRegistry = createUniqueMap();
  this.container = this.rootDocument.createElement("div");
  this.renderCall = false;
  rootElement.insertBefore(this.container, rootElement.firstChild);
  if (isRootInstance(this)) {
    _injectProductInfo(userSettings.licenseKey, rootElement);
  }
  this.guid = "ht_".concat(randomString());
  this.columnIndexMapper = new IndexMapper();
  this.rowIndexMapper = new IndexMapper();
  dataSource = new DataSource(instance);
  if (!this.rootElement.id || this.rootElement.id.substring(0, 3) === "ht_") {
    this.rootElement.id = this.guid;
  }
  var visualToRenderableCoords = function visualToRenderableCoords2(coords) {
    var visualRow = coords.row, visualColumn = coords.col;
    return instance._createCellCoords(visualRow >= 0 ? instance.rowIndexMapper.getRenderableFromVisualIndex(visualRow) : visualRow, visualColumn >= 0 ? instance.columnIndexMapper.getRenderableFromVisualIndex(visualColumn) : visualColumn);
  };
  var renderableToVisualCoords = function renderableToVisualCoords2(coords) {
    var renderableRow = coords.row, renderableColumn = coords.col;
    return instance._createCellCoords(renderableRow >= 0 ? instance.rowIndexMapper.getVisualFromRenderableIndex(renderableRow) : renderableRow, renderableColumn >= 0 ? instance.columnIndexMapper.getVisualFromRenderableIndex(renderableColumn) : renderableColumn);
  };
  var selection = new Selection$1(tableMeta, {
    countCols: function countCols() {
      return instance.countCols();
    },
    countRows: function countRows() {
      return instance.countRows();
    },
    propToCol: function propToCol(prop) {
      return datamap.propToCol(prop);
    },
    isEditorOpened: function isEditorOpened() {
      return instance.getActiveEditor() ? instance.getActiveEditor().isOpened() : false;
    },
    countColsTranslated: function countColsTranslated() {
      return _this.view.countRenderableColumns();
    },
    countRowsTranslated: function countRowsTranslated() {
      return _this.view.countRenderableRows();
    },
    getShortcutManager: function getShortcutManager() {
      return instance.getShortcutManager();
    },
    createCellCoords: function createCellCoords(row, column) {
      return instance._createCellCoords(row, column);
    },
    createCellRange: function createCellRange(highlight, from, to) {
      return instance._createCellRange(highlight, from, to);
    },
    visualToRenderableCoords,
    renderableToVisualCoords,
    isDisabledCellSelection: function isDisabledCellSelection(visualRow, visualColumn) {
      return instance.getCellMeta(visualRow, visualColumn).disableVisualSelection;
    }
  });
  this.selection = selection;
  var onIndexMapperCacheUpdate = function onIndexMapperCacheUpdate2(_ref) {
    var hiddenIndexesChanged = _ref.hiddenIndexesChanged;
    if (hiddenIndexesChanged) {
      _this.selection.refresh();
    }
  };
  this.columnIndexMapper.addLocalHook("cacheUpdated", onIndexMapperCacheUpdate);
  this.rowIndexMapper.addLocalHook("cacheUpdated", onIndexMapperCacheUpdate);
  this.selection.addLocalHook("beforeSetRangeStart", function(cellCoords) {
    _this.runHooks("beforeSetRangeStart", cellCoords);
  });
  this.selection.addLocalHook("beforeSetRangeStartOnly", function(cellCoords) {
    _this.runHooks("beforeSetRangeStartOnly", cellCoords);
  });
  this.selection.addLocalHook("beforeSetRangeEnd", function(cellCoords) {
    _this.runHooks("beforeSetRangeEnd", cellCoords);
    if (cellCoords.row < 0) {
      cellCoords.row = _this.view._wt.wtTable.getFirstVisibleRow();
    }
    if (cellCoords.col < 0) {
      cellCoords.col = _this.view._wt.wtTable.getFirstVisibleColumn();
    }
  });
  this.selection.addLocalHook("afterSetRangeEnd", function(cellCoords) {
    var preventScrolling = createObjectPropListener(false);
    var selectionRange = _this.selection.getSelectedRange();
    var _selectionRange$curre = selectionRange.current(), from = _selectionRange$curre.from, to = _selectionRange$curre.to;
    var selectionLayerLevel = selectionRange.size() - 1;
    _this.runHooks("afterSelection", from.row, from.col, to.row, to.col, preventScrolling, selectionLayerLevel);
    _this.runHooks("afterSelectionByProp", from.row, instance.colToProp(from.col), to.row, instance.colToProp(to.col), preventScrolling, selectionLayerLevel);
    var isSelectedByAnyHeader = _this.selection.isSelectedByAnyHeader();
    var currentSelectedRange = _this.selection.selectedRange.current();
    var scrollToCell = true;
    if (preventScrollingToCell) {
      scrollToCell = false;
    }
    if (preventScrolling.isTouched()) {
      scrollToCell = !preventScrolling.value;
    }
    var isSelectedByRowHeader = _this.selection.isSelectedByRowHeader();
    var isSelectedByColumnHeader = _this.selection.isSelectedByColumnHeader();
    if (scrollToCell !== false) {
      if (!isSelectedByAnyHeader) {
        if (currentSelectedRange && !_this.selection.isMultiple()) {
          _this.view.scrollViewport(visualToRenderableCoords(currentSelectedRange.from));
        } else {
          _this.view.scrollViewport(visualToRenderableCoords(cellCoords));
        }
      } else if (isSelectedByRowHeader) {
        _this.view.scrollViewportVertically(instance.rowIndexMapper.getRenderableFromVisualIndex(cellCoords.row));
      } else if (isSelectedByColumnHeader) {
        _this.view.scrollViewportHorizontally(instance.columnIndexMapper.getRenderableFromVisualIndex(cellCoords.col));
      }
    }
    if (isSelectedByRowHeader && isSelectedByColumnHeader) {
      addClass(_this.rootElement, ["ht__selection--rows", "ht__selection--columns"]);
    } else if (isSelectedByRowHeader) {
      removeClass(_this.rootElement, "ht__selection--columns");
      addClass(_this.rootElement, "ht__selection--rows");
    } else if (isSelectedByColumnHeader) {
      removeClass(_this.rootElement, "ht__selection--rows");
      addClass(_this.rootElement, "ht__selection--columns");
    } else {
      removeClass(_this.rootElement, ["ht__selection--rows", "ht__selection--columns"]);
    }
    _this._refreshBorders(null);
  });
  this.selection.addLocalHook("afterSelectionFinished", function(cellRanges) {
    var selectionLayerLevel = cellRanges.length - 1;
    var _cellRanges$selection = cellRanges[selectionLayerLevel], from = _cellRanges$selection.from, to = _cellRanges$selection.to;
    _this.runHooks("afterSelectionEnd", from.row, from.col, to.row, to.col, selectionLayerLevel);
    _this.runHooks("afterSelectionEndByProp", from.row, instance.colToProp(from.col), to.row, instance.colToProp(to.col), selectionLayerLevel);
  });
  this.selection.addLocalHook("afterIsMultipleSelection", function(isMultiple) {
    var changedIsMultiple = _this.runHooks("afterIsMultipleSelection", isMultiple.value);
    if (isMultiple.value) {
      isMultiple.value = changedIsMultiple;
    }
  });
  this.selection.addLocalHook("beforeModifyTransformStart", function(cellCoordsDelta) {
    _this.runHooks("modifyTransformStart", cellCoordsDelta);
  });
  this.selection.addLocalHook("afterModifyTransformStart", function(coords, rowTransformDir, colTransformDir) {
    _this.runHooks("afterModifyTransformStart", coords, rowTransformDir, colTransformDir);
  });
  this.selection.addLocalHook("beforeModifyTransformEnd", function(cellCoordsDelta) {
    _this.runHooks("modifyTransformEnd", cellCoordsDelta);
  });
  this.selection.addLocalHook("afterModifyTransformEnd", function(coords, rowTransformDir, colTransformDir) {
    _this.runHooks("afterModifyTransformEnd", coords, rowTransformDir, colTransformDir);
  });
  this.selection.addLocalHook("afterDeselect", function() {
    editorManager.destroyEditor();
    _this._refreshBorders();
    removeClass(_this.rootElement, ["ht__selection--rows", "ht__selection--columns"]);
    _this.runHooks("afterDeselect");
  });
  this.selection.addLocalHook("insertRowRequire", function(totalRows) {
    _this.alter("insert_row", totalRows, 1, "auto");
  });
  this.selection.addLocalHook("insertColRequire", function(totalCols) {
    _this.alter("insert_col", totalCols, 1, "auto");
  });
  grid = {
    alter: function alter(action, index) {
      var amount = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
      var source = arguments.length > 3 ? arguments[3] : void 0;
      var keepEmptyRows = arguments.length > 4 ? arguments[4] : void 0;
      var delta;
      var normalizeIndexesGroup = function normalizeIndexesGroup2(indexes) {
        if (indexes.length === 0) {
          return [];
        }
        var sortedIndexes = _toConsumableArray$i(indexes);
        sortedIndexes.sort(function(_ref2, _ref3) {
          var _ref4 = _slicedToArray$c(_ref2, 1), indexA = _ref4[0];
          var _ref5 = _slicedToArray$c(_ref3, 1), indexB = _ref5[0];
          if (indexA === indexB) {
            return 0;
          }
          return indexA > indexB ? 1 : -1;
        });
        var normalizedIndexes = arrayReduce(sortedIndexes, function(acc, _ref6) {
          var _ref7 = _slicedToArray$c(_ref6, 2), groupIndex = _ref7[0], groupAmount = _ref7[1];
          var previousItem = acc[acc.length - 1];
          var _previousItem = _slicedToArray$c(previousItem, 2), prevIndex = _previousItem[0], prevAmount = _previousItem[1];
          var prevLastIndex = prevIndex + prevAmount;
          if (groupIndex <= prevLastIndex) {
            var amountToAdd = Math.max(groupAmount - (prevLastIndex - groupIndex), 0);
            previousItem[1] += amountToAdd;
          } else {
            acc.push([groupIndex, groupAmount]);
          }
          return acc;
        }, [sortedIndexes[0]]);
        return normalizedIndexes;
      };
      switch (action) {
        case "insert_row":
          var numberOfSourceRows = instance.countSourceRows();
          if (tableMeta.maxRows === numberOfSourceRows) {
            return;
          }
          index = isDefined(index) ? index : numberOfSourceRows;
          delta = datamap.createRow(index, amount, source);
          if (delta) {
            metaManager.createRow(instance.toPhysicalRow(index), amount);
            var currentSelectedRange = selection.selectedRange.current();
            var currentFromRange = currentSelectedRange === null || currentSelectedRange === void 0 ? void 0 : currentSelectedRange.from;
            var currentFromRow = currentFromRange === null || currentFromRange === void 0 ? void 0 : currentFromRange.row;
            if (isDefined(currentFromRow) && currentFromRow >= index) {
              var _currentSelectedRange = currentSelectedRange.to, currentToRow = _currentSelectedRange.row, currentToColumn = _currentSelectedRange.col;
              var currentFromColumn = currentFromRange.col;
              if (selection.isSelectedByRowHeader()) {
                currentFromColumn = -1;
              }
              selection.getSelectedRange().pop();
              selection.setRangeStartOnly(instance._createCellCoords(currentFromRow + delta, currentFromColumn), true);
              selection.setRangeEnd(instance._createCellCoords(currentToRow + delta, currentToColumn));
            } else {
              instance._refreshBorders();
            }
          }
          break;
        case "insert_col":
          delta = datamap.createCol(index, amount, source);
          if (delta) {
            metaManager.createColumn(instance.toPhysicalColumn(index), amount);
            if (Array.isArray(tableMeta.colHeaders)) {
              var spliceArray = [index, 0];
              spliceArray.length += delta;
              Array.prototype.splice.apply(tableMeta.colHeaders, spliceArray);
            }
            var _currentSelectedRange2 = selection.selectedRange.current();
            var _currentFromRange = _currentSelectedRange2 === null || _currentSelectedRange2 === void 0 ? void 0 : _currentSelectedRange2.from;
            var _currentFromColumn = _currentFromRange === null || _currentFromRange === void 0 ? void 0 : _currentFromRange.col;
            if (isDefined(_currentFromColumn) && _currentFromColumn >= index) {
              var _currentSelectedRange3 = _currentSelectedRange2.to, _currentToRow = _currentSelectedRange3.row, _currentToColumn = _currentSelectedRange3.col;
              var _currentFromRow = _currentFromRange.row;
              if (selection.isSelectedByColumnHeader()) {
                _currentFromRow = -1;
              }
              selection.getSelectedRange().pop();
              selection.setRangeStartOnly(instance._createCellCoords(_currentFromRow, _currentFromColumn + delta), true);
              selection.setRangeEnd(instance._createCellCoords(_currentToRow, _currentToColumn + delta));
            } else {
              instance._refreshBorders();
            }
          }
          break;
        case "remove_row":
          var removeRow = function removeRow2(indexes) {
            var offset = 0;
            arrayEach(indexes, function(_ref8) {
              var _ref9 = _slicedToArray$c(_ref8, 2), groupIndex = _ref9[0], groupAmount = _ref9[1];
              var calcIndex = isEmpty(groupIndex) ? instance.countRows() - 1 : Math.max(groupIndex - offset, 0);
              if (Number.isInteger(groupIndex)) {
                groupIndex = Math.max(groupIndex - offset, 0);
              }
              var wasRemoved = datamap.removeRow(groupIndex, groupAmount, source);
              if (!wasRemoved) {
                return;
              }
              metaManager.removeRow(instance.toPhysicalRow(calcIndex), groupAmount);
              var totalRows = instance.countRows();
              var fixedRowsTop = tableMeta.fixedRowsTop;
              if (fixedRowsTop >= calcIndex + 1) {
                tableMeta.fixedRowsTop -= Math.min(groupAmount, fixedRowsTop - calcIndex);
              }
              var fixedRowsBottom = tableMeta.fixedRowsBottom;
              if (fixedRowsBottom && calcIndex >= totalRows - fixedRowsBottom) {
                tableMeta.fixedRowsBottom -= Math.min(groupAmount, fixedRowsBottom);
              }
              offset += groupAmount;
            });
          };
          if (Array.isArray(index)) {
            removeRow(normalizeIndexesGroup(index));
          } else {
            removeRow([[index, amount]]);
          }
          grid.adjustRowsAndCols();
          instance._refreshBorders();
          break;
        case "remove_col":
          var removeCol = function removeCol2(indexes) {
            var offset = 0;
            arrayEach(indexes, function(_ref10) {
              var _ref11 = _slicedToArray$c(_ref10, 2), groupIndex = _ref11[0], groupAmount = _ref11[1];
              var calcIndex = isEmpty(groupIndex) ? instance.countCols() - 1 : Math.max(groupIndex - offset, 0);
              var physicalColumnIndex = instance.toPhysicalColumn(calcIndex);
              if (Number.isInteger(groupIndex)) {
                groupIndex = Math.max(groupIndex - offset, 0);
              }
              var wasRemoved = datamap.removeCol(groupIndex, groupAmount, source);
              if (!wasRemoved) {
                return;
              }
              metaManager.removeColumn(physicalColumnIndex, groupAmount);
              var fixedColumnsStart = tableMeta.fixedColumnsStart;
              if (fixedColumnsStart >= calcIndex + 1) {
                tableMeta.fixedColumnsStart -= Math.min(groupAmount, fixedColumnsStart - calcIndex);
              }
              if (Array.isArray(tableMeta.colHeaders)) {
                if (typeof physicalColumnIndex === "undefined") {
                  physicalColumnIndex = -1;
                }
                tableMeta.colHeaders.splice(physicalColumnIndex, groupAmount);
              }
              offset += groupAmount;
            });
          };
          if (Array.isArray(index)) {
            removeCol(normalizeIndexesGroup(index));
          } else {
            removeCol([[index, amount]]);
          }
          grid.adjustRowsAndCols();
          instance._refreshBorders();
          break;
        default:
          throw new Error('There is no such action "'.concat(action, '"'));
      }
      if (!keepEmptyRows) {
        grid.adjustRowsAndCols();
      }
    },
    adjustRowsAndCols: function adjustRowsAndCols() {
      var minRows = tableMeta.minRows;
      var minSpareRows = tableMeta.minSpareRows;
      var minCols = tableMeta.minCols;
      var minSpareCols = tableMeta.minSpareCols;
      if (minRows) {
        var nrOfRows = instance.countRows();
        if (nrOfRows < minRows) {
          datamap.createRow(nrOfRows, minRows - nrOfRows, "auto");
        }
      }
      if (minSpareRows) {
        var emptyRows = instance.countEmptyRows(true);
        if (emptyRows < minSpareRows) {
          var emptyRowsMissing = minSpareRows - emptyRows;
          var rowsToCreate = Math.min(emptyRowsMissing, tableMeta.maxRows - instance.countSourceRows());
          datamap.createRow(instance.countRows(), rowsToCreate, "auto");
        }
      }
      {
        var emptyCols;
        if (minCols || minSpareCols) {
          emptyCols = instance.countEmptyCols(true);
        }
        var nrOfColumns = instance.countCols();
        if (minCols && !tableMeta.columns && nrOfColumns < minCols) {
          var colsToCreate = minCols - nrOfColumns;
          emptyCols += colsToCreate;
          datamap.createCol(nrOfColumns, colsToCreate, "auto");
        }
        if (minSpareCols && !tableMeta.columns && instance.dataType === "array" && emptyCols < minSpareCols) {
          nrOfColumns = instance.countCols();
          var emptyColsMissing = minSpareCols - emptyCols;
          var _colsToCreate = Math.min(emptyColsMissing, tableMeta.maxCols - nrOfColumns);
          datamap.createCol(nrOfColumns, _colsToCreate, "auto");
        }
      }
      var rowCount = instance.countRows();
      var colCount = instance.countCols();
      if (rowCount === 0 || colCount === 0) {
        selection.deselect();
      }
      if (selection.isSelected()) {
        arrayEach(selection.selectedRange, function(range) {
          var selectionChanged = false;
          var fromRow = range.from.row;
          var fromCol = range.from.col;
          var toRow = range.to.row;
          var toCol = range.to.col;
          if (fromRow > rowCount - 1) {
            fromRow = rowCount - 1;
            selectionChanged = true;
            if (toRow > fromRow) {
              toRow = fromRow;
            }
          } else if (toRow > rowCount - 1) {
            toRow = rowCount - 1;
            selectionChanged = true;
            if (fromRow > toRow) {
              fromRow = toRow;
            }
          }
          if (fromCol > colCount - 1) {
            fromCol = colCount - 1;
            selectionChanged = true;
            if (toCol > fromCol) {
              toCol = fromCol;
            }
          } else if (toCol > colCount - 1) {
            toCol = colCount - 1;
            selectionChanged = true;
            if (fromCol > toCol) {
              fromCol = toCol;
            }
          }
          if (selectionChanged) {
            instance.selectCell(fromRow, fromCol, toRow, toCol);
          }
        });
      }
      if (instance.view) {
        instance.view.adjustElementsSize();
      }
    },
    populateFromArray: function populateFromArray(start, input, end, source, method, direction, deltas) {
      var r;
      var rlen;
      var c;
      var clen;
      var setData = [];
      var current = {};
      var newDataByColumns = [];
      var startRow = start.row;
      var startColumn = start.col;
      rlen = input.length;
      if (rlen === 0) {
        return false;
      }
      var columnsPopulationEnd = 0;
      var rowsPopulationEnd = 0;
      if (isObject(end)) {
        columnsPopulationEnd = end.col - startColumn + 1;
        rowsPopulationEnd = end.row - startRow + 1;
      }
      switch (method) {
        case "shift_down":
          var populatedDataByColumns = pivot(input);
          var numberOfDataColumns = populatedDataByColumns.length;
          var numberOfColumnsToPopulate = Math.max(numberOfDataColumns, columnsPopulationEnd);
          var pushedDownDataByRows = instance.getData().slice(startRow);
          var pushedDownDataByColumns = pivot(pushedDownDataByRows).slice(startColumn, startColumn + numberOfColumnsToPopulate);
          for (c = 0; c < numberOfColumnsToPopulate; c += 1) {
            if (c < numberOfDataColumns) {
              for (r = 0, rlen = populatedDataByColumns[c].length; r < rowsPopulationEnd - rlen; r += 1) {
                populatedDataByColumns[c].push(populatedDataByColumns[c][r % rlen]);
              }
              if (c < pushedDownDataByColumns.length) {
                newDataByColumns.push(populatedDataByColumns[c].concat(pushedDownDataByColumns[c]));
              } else {
                newDataByColumns.push(populatedDataByColumns[c].concat(new Array(pushedDownDataByRows.length).fill(null)));
              }
            } else {
              newDataByColumns.push(populatedDataByColumns[c % numberOfDataColumns].concat(pushedDownDataByColumns[c]));
            }
          }
          instance.populateFromArray(startRow, startColumn, pivot(newDataByColumns));
          break;
        case "shift_right":
          var numberOfDataRows = input.length;
          var numberOfRowsToPopulate = Math.max(numberOfDataRows, rowsPopulationEnd);
          var pushedRightDataByRows = instance.getData().slice(startRow).map(function(rowData) {
            return rowData.slice(startColumn);
          });
          for (r = 0; r < numberOfRowsToPopulate; r += 1) {
            if (r < numberOfDataRows) {
              for (c = 0, clen = input[r].length; c < columnsPopulationEnd - clen; c += 1) {
                input[r].push(input[r][c % clen]);
              }
              if (r < pushedRightDataByRows.length) {
                for (var i = 0; i < pushedRightDataByRows[r].length; i += 1) {
                  input[r].push(pushedRightDataByRows[r][i]);
                }
              } else {
                var _input$r;
                (_input$r = input[r]).push.apply(_input$r, _toConsumableArray$i(new Array(pushedRightDataByRows[0].length).fill(null)));
              }
            } else {
              input.push(input[r % rlen].slice(0, numberOfRowsToPopulate).concat(pushedRightDataByRows[r]));
            }
          }
          instance.populateFromArray(startRow, startColumn, input);
          break;
        case "overwrite":
        default:
          current.row = start.row;
          current.col = start.col;
          var selected = {
            row: end && start ? end.row - start.row + 1 : 1,
            col: end && start ? end.col - start.col + 1 : 1
          };
          var skippedRow = 0;
          var skippedColumn = 0;
          var pushData = true;
          var cellMeta;
          var getInputValue = function getInputValue2(row) {
            var col = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
            var rowValue = input[row % input.length];
            if (col !== null) {
              return rowValue[col % rowValue.length];
            }
            return rowValue;
          };
          var rowInputLength = input.length;
          var rowSelectionLength = end ? end.row - start.row + 1 : 0;
          if (end) {
            rlen = rowSelectionLength;
          } else {
            rlen = Math.max(rowInputLength, rowSelectionLength);
          }
          for (r = 0; r < rlen; r++) {
            if (end && current.row > end.row && rowSelectionLength > rowInputLength || !tableMeta.allowInsertRow && current.row > instance.countRows() - 1 || current.row >= tableMeta.maxRows) {
              break;
            }
            var visualRow = r - skippedRow;
            var colInputLength = getInputValue(visualRow).length;
            var colSelectionLength = end ? end.col - start.col + 1 : 0;
            if (end) {
              clen = colSelectionLength;
            } else {
              clen = Math.max(colInputLength, colSelectionLength);
            }
            current.col = start.col;
            cellMeta = instance.getCellMeta(current.row, current.col);
            if ((source === "CopyPaste.paste" || source === "Autofill.fill") && cellMeta.skipRowOnPaste) {
              skippedRow += 1;
              current.row += 1;
              rlen += 1;
              continue;
            }
            skippedColumn = 0;
            for (c = 0; c < clen; c++) {
              if (end && current.col > end.col && colSelectionLength > colInputLength || !tableMeta.allowInsertColumn && current.col > instance.countCols() - 1 || current.col >= tableMeta.maxCols) {
                break;
              }
              cellMeta = instance.getCellMeta(current.row, current.col);
              if ((source === "CopyPaste.paste" || source === "Autofill.fill") && cellMeta.skipColumnOnPaste) {
                skippedColumn += 1;
                current.col += 1;
                clen += 1;
                continue;
              }
              if (cellMeta.readOnly && source !== "UndoRedo.undo") {
                current.col += 1;
                continue;
              }
              var visualColumn = c - skippedColumn;
              var value = getInputValue(visualRow, visualColumn);
              var orgValue = instance.getDataAtCell(current.row, current.col);
              var index = {
                row: visualRow,
                col: visualColumn
              };
              if (source === "Autofill.fill") {
                var result = instance.runHooks("beforeAutofillInsidePopulate", index, direction, input, deltas, {}, selected);
                if (result) {
                  value = isUndefined(result.value) ? value : result.value;
                }
              }
              if (value !== null && _typeof$B(value) === "object") {
                if (Array.isArray(value) && orgValue === null)
                  orgValue = [];
                if (orgValue === null || _typeof$B(orgValue) !== "object") {
                  pushData = false;
                } else {
                  var orgValueSchema = duckSchema(Array.isArray(orgValue) ? orgValue : orgValue[0] || orgValue);
                  var valueSchema = duckSchema(Array.isArray(value) ? value : value[0] || value);
                  if (isObjectEqual(orgValueSchema, valueSchema)) {
                    value = deepClone(value);
                  } else {
                    pushData = false;
                  }
                }
              } else if (orgValue !== null && _typeof$B(orgValue) === "object") {
                pushData = false;
              }
              if (pushData) {
                setData.push([current.row, current.col, value]);
              }
              pushData = true;
              current.col += 1;
            }
            current.row += 1;
          }
          instance.setDataAtCell(setData, null, null, source || "populateFromArray");
          break;
      }
    }
  };
  function setLanguage(languageCode) {
    var normalizedLanguageCode = normalizeLanguageCode(languageCode);
    if (hasLanguageDictionary(normalizedLanguageCode)) {
      instance.runHooks("beforeLanguageChange", normalizedLanguageCode);
      globalMeta.language = normalizedLanguageCode;
      instance.runHooks("afterLanguageChange", normalizedLanguageCode);
    } else {
      warnUserAboutLanguageRegistration(languageCode);
    }
  }
  function setClassName(className, classSettings) {
    var element = className === "className" ? instance.rootElement : instance.table;
    if (firstRun) {
      addClass(element, classSettings);
    } else {
      var globalMetaSettingsArray = [];
      var settingsArray = [];
      if (globalMeta[className]) {
        globalMetaSettingsArray = Array.isArray(globalMeta[className]) ? globalMeta[className] : stringToArray(globalMeta[className]);
      }
      if (classSettings) {
        settingsArray = Array.isArray(classSettings) ? classSettings : stringToArray(classSettings);
      }
      var classNameToRemove = getDifferenceOfArrays(globalMetaSettingsArray, settingsArray);
      var classNameToAdd = getDifferenceOfArrays(settingsArray, globalMetaSettingsArray);
      if (classNameToRemove.length) {
        removeClass(element, classNameToRemove);
      }
      if (classNameToAdd.length) {
        addClass(element, classNameToAdd);
      }
    }
    globalMeta[className] = classSettings;
  }
  this.init = function() {
    dataSource.setData(tableMeta.data);
    instance.runHooks("beforeInit");
    if (isMobileBrowser() || isIpadOS()) {
      addClass(instance.rootElement, "mobile");
    }
    this.updateSettings(tableMeta, true);
    this.view = new TableView(this);
    editorManager = EditorManager.getInstance(instance, tableMeta, selection);
    instance.runHooks("init");
    this.forceFullRender = true;
    this.view.render();
    if (_typeof$B(firstRun) === "object") {
      instance.runHooks("afterChange", firstRun[0], firstRun[1]);
      firstRun = false;
    }
    instance.runHooks("afterInit");
  };
  function ValidatorsQueue() {
    var resolved = false;
    return {
      validatorsInQueue: 0,
      valid: true,
      addValidatorToQueue: function addValidatorToQueue() {
        this.validatorsInQueue += 1;
        resolved = false;
      },
      removeValidatorFormQueue: function removeValidatorFormQueue() {
        this.validatorsInQueue = this.validatorsInQueue - 1 < 0 ? 0 : this.validatorsInQueue - 1;
        this.checkIfQueueIsEmpty();
      },
      onQueueEmpty: function onQueueEmpty() {
      },
      checkIfQueueIsEmpty: function checkIfQueueIsEmpty() {
        if (this.validatorsInQueue === 0 && resolved === false) {
          resolved = true;
          this.onQueueEmpty(this.valid);
        }
      }
    };
  }
  function getParsedNumber(numericData) {
    var unifiedNumericData = numericData.replace(",", ".");
    if (isNaN(parseFloat(unifiedNumericData)) === false) {
      return parseFloat(unifiedNumericData);
    }
    return numericData;
  }
  function validateChanges(changes, source, callback) {
    if (!changes.length) {
      return;
    }
    var activeEditor = instance.getActiveEditor();
    var beforeChangeResult = instance.runHooks("beforeChange", changes, source || "edit");
    var shouldBeCanceled = true;
    if (beforeChangeResult === false) {
      if (activeEditor) {
        activeEditor.cancelChanges();
      }
      return;
    }
    var waitingForValidator = new ValidatorsQueue();
    waitingForValidator.onQueueEmpty = function(isValid) {
      if (activeEditor && shouldBeCanceled) {
        activeEditor.cancelChanges();
      }
      callback(isValid);
    };
    for (var i = changes.length - 1; i >= 0; i--) {
      if (changes[i] === null) {
        changes.splice(i, 1);
      } else {
        var _changes$i = _slicedToArray$c(changes[i], 4), row = _changes$i[0], prop = _changes$i[1], newValue = _changes$i[3];
        var col = datamap.propToCol(prop);
        var cellProperties = instance.getCellMeta(row, col);
        if (cellProperties.type === "numeric" && typeof newValue === "string" && isNumericLike(newValue)) {
          changes[i][3] = getParsedNumber(newValue);
        }
        if (instance.getCellValidator(cellProperties)) {
          waitingForValidator.addValidatorToQueue();
          instance.validateCell(changes[i][3], cellProperties, function(index, cellPropertiesReference) {
            return function(result) {
              if (typeof result !== "boolean") {
                throw new Error("Validation error: result is not boolean");
              }
              if (result === false && cellPropertiesReference.allowInvalid === false) {
                shouldBeCanceled = false;
                changes.splice(index, 1);
                cellPropertiesReference.valid = true;
                var cell = instance.getCell(cellPropertiesReference.visualRow, cellPropertiesReference.visualCol);
                if (cell !== null) {
                  removeClass(cell, tableMeta.invalidCellClassName);
                }
              }
              waitingForValidator.removeValidatorFormQueue();
            };
          }(i, cellProperties), source);
        }
      }
    }
    waitingForValidator.checkIfQueueIsEmpty();
  }
  function applyChanges(changes, source) {
    var i = changes.length - 1;
    if (i < 0) {
      return;
    }
    for (; i >= 0; i--) {
      var skipThisChange = false;
      if (changes[i] === null) {
        changes.splice(i, 1);
        continue;
      }
      if ((changes[i][2] === null || changes[i][2] === void 0) && (changes[i][3] === null || changes[i][3] === void 0)) {
        continue;
      }
      if (tableMeta.allowInsertRow) {
        while (changes[i][0] > instance.countRows() - 1) {
          var numberOfCreatedRows = datamap.createRow(void 0, void 0, source);
          if (numberOfCreatedRows >= 1) {
            metaManager.createRow(null, numberOfCreatedRows);
          } else {
            skipThisChange = true;
            break;
          }
        }
      }
      if (instance.dataType === "array" && (!tableMeta.columns || tableMeta.columns.length === 0) && tableMeta.allowInsertColumn) {
        while (datamap.propToCol(changes[i][1]) > instance.countCols() - 1) {
          var numberOfCreatedColumns = datamap.createCol(void 0, void 0, source);
          if (numberOfCreatedColumns >= 1) {
            metaManager.createColumn(null, numberOfCreatedColumns);
          } else {
            skipThisChange = true;
            break;
          }
        }
      }
      if (skipThisChange) {
        continue;
      }
      datamap.set(changes[i][0], changes[i][1], changes[i][3]);
    }
    instance.forceFullRender = true;
    grid.adjustRowsAndCols();
    instance.runHooks("beforeChangeRender", changes, source);
    editorManager.lockEditor();
    instance._refreshBorders(null);
    editorManager.unlockEditor();
    instance.view.adjustElementsSize();
    instance.runHooks("afterChange", changes, source || "edit");
    var activeEditor = instance.getActiveEditor();
    if (activeEditor && isDefined(activeEditor.refreshValue)) {
      activeEditor.refreshValue();
    }
  }
  this._createCellCoords = function(row, column) {
    return instance.view._wt.createCellCoords(row, column);
  };
  this._createCellRange = function(highlight, from, to) {
    return instance.view._wt.createCellRange(highlight, from, to);
  };
  this.validateCell = function(value, cellProperties, callback, source) {
    var validator = instance.getCellValidator(cellProperties);
    function done(valid) {
      var canBeValidated = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      if (!canBeValidated || cellProperties.hidden === true) {
        callback(valid);
        return;
      }
      var col = cellProperties.visualCol;
      var row = cellProperties.visualRow;
      var td = instance.getCell(row, col, true);
      if (td && td.nodeName !== "TH") {
        var renderableRow = instance.rowIndexMapper.getRenderableFromVisualIndex(row);
        var renderableColumn = instance.columnIndexMapper.getRenderableFromVisualIndex(col);
        instance.view._wt.getSetting("cellRenderer", renderableRow, renderableColumn, td);
      }
      callback(valid);
    }
    if (isRegExp(validator)) {
      validator = function(expression) {
        return function(cellValue, validatorCallback) {
          validatorCallback(expression.test(cellValue));
        };
      }(validator);
    }
    if (isFunction(validator)) {
      value = instance.runHooks("beforeValidate", value, cellProperties.visualRow, cellProperties.prop, source);
      instance._registerImmediate(function() {
        validator.call(cellProperties, value, function(valid) {
          if (!instance) {
            return;
          }
          valid = instance.runHooks("afterValidate", valid, value, cellProperties.visualRow, cellProperties.prop, source);
          cellProperties.valid = valid;
          done(valid);
          instance.runHooks("postAfterValidate", valid, value, cellProperties.visualRow, cellProperties.prop, source);
        });
      });
    } else {
      instance._registerImmediate(function() {
        cellProperties.valid = true;
        done(cellProperties.valid, false);
      });
    }
  };
  function setDataInputToArray(row, propOrCol, value) {
    if (Array.isArray(row)) {
      return row;
    }
    return [[row, propOrCol, value]];
  }
  this.setDataAtCell = function(row, column, value, source) {
    var input = setDataInputToArray(row, column, value);
    var changes = [];
    var changeSource = source;
    var i;
    var ilen;
    var prop;
    for (i = 0, ilen = input.length; i < ilen; i++) {
      if (_typeof$B(input[i]) !== "object") {
        throw new Error("Method `setDataAtCell` accepts row number or changes array of arrays as its first parameter");
      }
      if (typeof input[i][1] !== "number") {
        throw new Error("Method `setDataAtCell` accepts row and column number as its parameters. If you want to use object property name, use method `setDataAtRowProp`");
      }
      if (input[i][1] >= this.countCols()) {
        prop = input[i][1];
      } else {
        prop = datamap.colToProp(input[i][1]);
      }
      changes.push([input[i][0], prop, dataSource.getAtCell(this.toPhysicalRow(input[i][0]), input[i][1]), input[i][2]]);
    }
    if (!changeSource && _typeof$B(row) === "object") {
      changeSource = column;
    }
    instance.runHooks("afterSetDataAtCell", changes, changeSource);
    validateChanges(changes, changeSource, function() {
      applyChanges(changes, changeSource);
    });
  };
  this.setDataAtRowProp = function(row, prop, value, source) {
    var input = setDataInputToArray(row, prop, value);
    var changes = [];
    var changeSource = source;
    var i;
    var ilen;
    for (i = 0, ilen = input.length; i < ilen; i++) {
      changes.push([input[i][0], input[i][1], dataSource.getAtCell(this.toPhysicalRow(input[i][0]), input[i][1]), input[i][2]]);
    }
    if (!changeSource && _typeof$B(row) === "object") {
      changeSource = prop;
    }
    instance.runHooks("afterSetDataAtRowProp", changes, changeSource);
    validateChanges(changes, changeSource, function() {
      applyChanges(changes, changeSource);
    });
  };
  this.listen = function() {
    if (instance && !instance.isListening()) {
      activeGuid = instance.guid;
      instance.runHooks("afterListen");
    }
  };
  this.unlisten = function() {
    if (this.isListening()) {
      activeGuid = null;
      instance.runHooks("afterUnlisten");
    }
  };
  this.isListening = function() {
    return activeGuid === instance.guid;
  };
  this.destroyEditor = function() {
    var revertOriginal = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var prepareEditorIfNeeded = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    instance._refreshBorders(revertOriginal, prepareEditorIfNeeded);
  };
  this.populateFromArray = function(row, column, input, endRow, endCol, source, method, direction, deltas) {
    if (!(_typeof$B(input) === "object" && _typeof$B(input[0]) === "object")) {
      throw new Error("populateFromArray parameter `input` must be an array of arrays");
    }
    var c = typeof endRow === "number" ? instance._createCellCoords(endRow, endCol) : null;
    return grid.populateFromArray(instance._createCellCoords(row, column), input, c, source, method, direction, deltas);
  };
  this.spliceCol = function(column, index, amount) {
    var _datamap;
    for (var _len = arguments.length, elements = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      elements[_key - 3] = arguments[_key];
    }
    return (_datamap = datamap).spliceCol.apply(_datamap, [column, index, amount].concat(elements));
  };
  this.spliceRow = function(row, index, amount) {
    var _datamap2;
    for (var _len2 = arguments.length, elements = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      elements[_key2 - 3] = arguments[_key2];
    }
    return (_datamap2 = datamap).spliceRow.apply(_datamap2, [row, index, amount].concat(elements));
  };
  this.getSelected = function() {
    if (selection.isSelected()) {
      return arrayMap(selection.getSelectedRange(), function(_ref12) {
        var from = _ref12.from, to = _ref12.to;
        return [from.row, from.col, to.row, to.col];
      });
    }
  };
  this.getSelectedLast = function() {
    var selected = this.getSelected();
    var result;
    if (selected && selected.length > 0) {
      result = selected[selected.length - 1];
    }
    return result;
  };
  this.getSelectedRange = function() {
    if (selection.isSelected()) {
      return Array.from(selection.getSelectedRange());
    }
  };
  this.getSelectedRangeLast = function() {
    var selectedRange = this.getSelectedRange();
    var result;
    if (selectedRange && selectedRange.length > 0) {
      result = selectedRange[selectedRange.length - 1];
    }
    return result;
  };
  this.emptySelectedCells = function(source) {
    var _this2 = this;
    if (!selection.isSelected() || this.countRows() === 0 || this.countCols() === 0) {
      return;
    }
    var changes = [];
    arrayEach(selection.getSelectedRange(), function(cellRange) {
      var topStart = cellRange.getTopStartCorner();
      var bottomEnd = cellRange.getBottomEndCorner();
      rangeEach(topStart.row, bottomEnd.row, function(row) {
        rangeEach(topStart.col, bottomEnd.col, function(column) {
          if (!_this2.getCellMeta(row, column).readOnly) {
            changes.push([row, column, null]);
          }
        });
      });
    });
    if (changes.length > 0) {
      this.setDataAtCell(changes, source);
    }
  };
  this.isRenderSuspended = function() {
    return this.renderSuspendedCounter > 0;
  };
  this.suspendRender = function() {
    this.renderSuspendedCounter += 1;
  };
  this.resumeRender = function() {
    var nextValue = this.renderSuspendedCounter - 1;
    this.renderSuspendedCounter = Math.max(nextValue, 0);
    if (!this.isRenderSuspended() && nextValue === this.renderSuspendedCounter) {
      if (this.renderCall) {
        this.render();
      } else {
        this._refreshBorders(null);
      }
    }
  };
  this.render = function() {
    if (this.view) {
      this.renderCall = true;
      this.forceFullRender = true;
      if (!this.isRenderSuspended()) {
        editorManager.lockEditor();
        this._refreshBorders(null);
        editorManager.unlockEditor();
      }
    }
  };
  this.batchRender = function(wrappedOperations) {
    this.suspendRender();
    var result = wrappedOperations();
    this.resumeRender();
    return result;
  };
  this.isExecutionSuspended = function() {
    return this.executionSuspendedCounter > 0;
  };
  this.suspendExecution = function() {
    this.executionSuspendedCounter += 1;
    this.columnIndexMapper.suspendOperations();
    this.rowIndexMapper.suspendOperations();
  };
  this.resumeExecution = function() {
    var forceFlushChanges = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var nextValue = this.executionSuspendedCounter - 1;
    this.executionSuspendedCounter = Math.max(nextValue, 0);
    if (!this.isExecutionSuspended() && nextValue === this.executionSuspendedCounter || forceFlushChanges) {
      this.columnIndexMapper.resumeOperations();
      this.rowIndexMapper.resumeOperations();
    }
  };
  this.batchExecution = function(wrappedOperations) {
    var forceFlushChanges = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    this.suspendExecution();
    var result = wrappedOperations();
    this.resumeExecution(forceFlushChanges);
    return result;
  };
  this.batch = function(wrappedOperations) {
    this.suspendRender();
    this.suspendExecution();
    var result = wrappedOperations();
    this.resumeExecution();
    this.resumeRender();
    return result;
  };
  this.refreshDimensions = function() {
    if (!instance.view) {
      return;
    }
    var _instance$view$getLas = instance.view.getLastSize(), lastWidth = _instance$view$getLas.width, lastHeight = _instance$view$getLas.height;
    var _instance$rootElement = instance.rootElement.getBoundingClientRect(), width = _instance$rootElement.width, height = _instance$rootElement.height;
    var isSizeChanged = width !== lastWidth || height !== lastHeight;
    var isResizeBlocked = instance.runHooks("beforeRefreshDimensions", {
      width: lastWidth,
      height: lastHeight
    }, {
      width,
      height
    }, isSizeChanged) === false;
    if (isResizeBlocked) {
      return;
    }
    if (isSizeChanged || instance.view._wt.wtOverlays.scrollableElement === instance.rootWindow) {
      instance.view.setLastSize(width, height);
      instance.render();
    }
    instance.runHooks("afterRefreshDimensions", {
      width: lastWidth,
      height: lastHeight
    }, {
      width,
      height
    }, isSizeChanged);
  };
  this.updateData = function(data, source) {
    var _this3 = this;
    replaceData(data, function(newDataMap) {
      datamap = newDataMap;
    }, function(newDataMap) {
      datamap = newDataMap;
      instance.columnIndexMapper.fitToLength(_this3.getInitialColumnCount());
      instance.rowIndexMapper.fitToLength(_this3.countSourceRows());
      grid.adjustRowsAndCols();
    }, {
      hotInstance: instance,
      dataMap: datamap,
      dataSource,
      internalSource: "updateData",
      source,
      firstRun
    });
  };
  this.loadData = function(data, source) {
    replaceData(data, function(newDataMap) {
      datamap = newDataMap;
    }, function() {
      metaManager.clearCellsCache();
      instance.initIndexMappers();
      grid.adjustRowsAndCols();
      if (firstRun) {
        firstRun = [null, "loadData"];
      }
    }, {
      hotInstance: instance,
      dataMap: datamap,
      dataSource,
      internalSource: "loadData",
      source,
      firstRun
    });
  };
  this.getInitialColumnCount = function() {
    var columnsSettings = tableMeta.columns;
    var finalNrOfColumns = 0;
    if (Array.isArray(columnsSettings)) {
      finalNrOfColumns = columnsSettings.length;
    } else if (isFunction(columnsSettings)) {
      if (instance.dataType === "array") {
        var nrOfSourceColumns = this.countSourceCols();
        for (var columnIndex = 0; columnIndex < nrOfSourceColumns; columnIndex += 1) {
          if (columnsSettings(columnIndex)) {
            finalNrOfColumns += 1;
          }
        }
      } else if (instance.dataType === "object" || instance.dataType === "function") {
        finalNrOfColumns = datamap.colToPropCache.length;
      }
    } else if (isDefined(tableMeta.dataSchema)) {
      var schema = datamap.getSchema();
      finalNrOfColumns = Array.isArray(schema) ? schema.length : deepObjectSize(schema);
    } else {
      finalNrOfColumns = this.countSourceCols();
    }
    return finalNrOfColumns;
  };
  this.initIndexMappers = function() {
    this.columnIndexMapper.initToLength(this.getInitialColumnCount());
    this.rowIndexMapper.initToLength(this.countSourceRows());
  };
  this.getData = function(row, column, row2, column2) {
    if (isUndefined(row)) {
      return datamap.getAll();
    }
    return datamap.getRange(instance._createCellCoords(row, column), instance._createCellCoords(row2, column2), datamap.DESTINATION_RENDERER);
  };
  this.getCopyableText = function(startRow, startCol, endRow, endCol) {
    return datamap.getCopyableText(instance._createCellCoords(startRow, startCol), instance._createCellCoords(endRow, endCol));
  };
  this.getCopyableData = function(row, column) {
    return datamap.getCopyable(row, datamap.colToProp(column));
  };
  this.getSchema = function() {
    return datamap.getSchema();
  };
  this.updateSettings = function(settings) {
    var init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var dataUpdateFunction = (firstRun ? instance.loadData : instance.updateData).bind(this);
    var columnsAsFunc = false;
    var i;
    var j;
    if (isDefined(settings.rows)) {
      throw new Error('The "rows" setting is no longer supported. Do you mean startRows, minRows or maxRows?');
    }
    if (isDefined(settings.cols)) {
      throw new Error('The "cols" setting is no longer supported. Do you mean startCols, minCols or maxCols?');
    }
    if (isDefined(settings.ganttChart)) {
      throw new Error('Since 8.0.0 the "ganttChart" setting is no longer supported.');
    }
    for (i in settings) {
      if (i === "data") ; else if (i === "language") {
        setLanguage(settings.language);
      } else if (i === "className") {
        setClassName("className", settings.className);
      } else if (i === "tableClassName" && instance.table) {
        setClassName("tableClassName", settings.tableClassName);
        instance.view._wt.wtOverlays.syncOverlayTableClassNames();
      } else if (Hooks.getSingleton().isRegistered(i) || Hooks.getSingleton().isDeprecated(i)) {
        if (isFunction(settings[i]) || Array.isArray(settings[i])) {
          settings[i].initialHook = true;
          instance.addHook(i, settings[i]);
        }
      } else if (!init && hasOwnProperty(settings, i)) {
        globalMeta[i] = settings[i];
      }
    }
    if (settings.data === void 0 && tableMeta.data === void 0) {
      dataUpdateFunction(null, "updateSettings");
    } else if (settings.data !== void 0) {
      dataUpdateFunction(settings.data, "updateSettings");
    } else if (settings.columns !== void 0) {
      datamap.createMap();
      instance.initIndexMappers();
    }
    var clen = instance.countCols();
    var columnSetting = tableMeta.columns;
    if (columnSetting && isFunction(columnSetting)) {
      columnsAsFunc = true;
    }
    if (settings.cell !== void 0 || settings.cells !== void 0 || settings.columns !== void 0) {
      metaManager.clearCache();
    }
    if (clen > 0) {
      for (i = 0, j = 0; i < clen; i++) {
        if (columnSetting) {
          var column = columnsAsFunc ? columnSetting(i) : columnSetting[j];
          if (column) {
            metaManager.updateColumnMeta(j, column);
          }
        }
        j += 1;
      }
    }
    if (isDefined(settings.cell)) {
      objectEach(settings.cell, function(cell) {
        instance.setCellMetaObject(cell.row, cell.col, cell);
      });
    }
    instance.runHooks("afterCellMetaReset");
    var currentHeight = instance.rootElement.style.height;
    if (currentHeight !== "") {
      currentHeight = parseInt(instance.rootElement.style.height, 10);
    }
    var height = settings.height;
    if (isFunction(height)) {
      height = height();
    }
    if (init) {
      var initialStyle = instance.rootElement.getAttribute("style");
      if (initialStyle) {
        instance.rootElement.setAttribute("data-initialstyle", instance.rootElement.getAttribute("style"));
      }
    }
    if (height === null) {
      var _initialStyle = instance.rootElement.getAttribute("data-initialstyle");
      if (_initialStyle && (_initialStyle.indexOf("height") > -1 || _initialStyle.indexOf("overflow") > -1)) {
        instance.rootElement.setAttribute("style", _initialStyle);
      } else {
        instance.rootElement.style.height = "";
        instance.rootElement.style.overflow = "";
      }
    } else if (height !== void 0) {
      instance.rootElement.style.height = isNaN(height) ? "".concat(height) : "".concat(height, "px");
      instance.rootElement.style.overflow = "hidden";
    }
    if (typeof settings.width !== "undefined") {
      var width = settings.width;
      if (isFunction(width)) {
        width = width();
      }
      instance.rootElement.style.width = isNaN(width) ? "".concat(width) : "".concat(width, "px");
    }
    if (!init) {
      if (instance.view) {
        instance.view._wt.wtViewport.resetHasOversizedColumnHeadersMarked();
        instance.view._wt.exportSettingsAsClassNames();
      }
      instance.runHooks("afterUpdateSettings", settings);
    }
    grid.adjustRowsAndCols();
    if (instance.view && !firstRun) {
      instance.forceFullRender = true;
      editorManager.lockEditor();
      instance._refreshBorders(null);
      instance.view._wt.wtOverlays.adjustElementsSize();
      editorManager.unlockEditor();
    }
    if (!init && instance.view && (currentHeight === "" || height === "" || height === void 0) && currentHeight !== height) {
      instance.view._wt.wtOverlays.updateMainScrollableElements();
    }
  };
  this.getValue = function() {
    var sel = instance.getSelectedLast();
    if (tableMeta.getValue) {
      if (isFunction(tableMeta.getValue)) {
        return tableMeta.getValue.call(instance);
      } else if (sel) {
        return instance.getData()[sel[0][0]][tableMeta.getValue];
      }
    } else if (sel) {
      return instance.getDataAtCell(sel[0], sel[1]);
    }
  };
  this.getSettings = function() {
    return tableMeta;
  };
  this.clear = function() {
    this.selectAll();
    this.emptySelectedCells();
  };
  this.alter = function(action, index, amount, source, keepEmptyRows) {
    grid.alter(action, index, amount, source, keepEmptyRows);
  };
  this.getCell = function(row, column) {
    var topmost = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var renderableColumnIndex = column;
    var renderableRowIndex = row;
    if (column >= 0) {
      if (this.columnIndexMapper.isHidden(this.toPhysicalColumn(column))) {
        return null;
      }
      renderableColumnIndex = this.columnIndexMapper.getRenderableFromVisualIndex(column);
    }
    if (row >= 0) {
      if (this.rowIndexMapper.isHidden(this.toPhysicalRow(row))) {
        return null;
      }
      renderableRowIndex = this.rowIndexMapper.getRenderableFromVisualIndex(row);
    }
    if (renderableRowIndex === null || renderableColumnIndex === null) {
      return null;
    }
    return instance.view.getCellAtCoords(instance._createCellCoords(renderableRowIndex, renderableColumnIndex), topmost);
  };
  this.getCoords = function(element) {
    var renderableCoords = this.view._wt.wtTable.getCoords(element);
    if (renderableCoords === null) {
      return null;
    }
    var renderableRow = renderableCoords.row, renderableColumn = renderableCoords.col;
    var visualRow = renderableRow;
    var visualColumn = renderableColumn;
    if (renderableRow >= 0) {
      visualRow = this.rowIndexMapper.getVisualFromRenderableIndex(renderableRow);
    }
    if (renderableColumn >= 0) {
      visualColumn = this.columnIndexMapper.getVisualFromRenderableIndex(renderableColumn);
    }
    return instance._createCellCoords(visualRow, visualColumn);
  };
  this.colToProp = function(column) {
    return datamap.colToProp(column);
  };
  this.propToCol = function(prop) {
    return datamap.propToCol(prop);
  };
  this.toVisualRow = function(row) {
    return _this.rowIndexMapper.getVisualFromPhysicalIndex(row);
  };
  this.toVisualColumn = function(column) {
    return _this.columnIndexMapper.getVisualFromPhysicalIndex(column);
  };
  this.toPhysicalRow = function(row) {
    return _this.rowIndexMapper.getPhysicalFromVisualIndex(row);
  };
  this.toPhysicalColumn = function(column) {
    return _this.columnIndexMapper.getPhysicalFromVisualIndex(column);
  };
  this.getDataAtCell = function(row, column) {
    return datamap.get(row, datamap.colToProp(column));
  };
  this.getDataAtRowProp = function(row, prop) {
    return datamap.get(row, prop);
  };
  this.getDataAtCol = function(column) {
    var _ref13;
    return (_ref13 = []).concat.apply(_ref13, _toConsumableArray$i(datamap.getRange(instance._createCellCoords(0, column), instance._createCellCoords(tableMeta.data.length - 1, column), datamap.DESTINATION_RENDERER)));
  };
  this.getDataAtProp = function(prop) {
    var _ref14;
    var range = datamap.getRange(instance._createCellCoords(0, datamap.propToCol(prop)), instance._createCellCoords(tableMeta.data.length - 1, datamap.propToCol(prop)), datamap.DESTINATION_RENDERER);
    return (_ref14 = []).concat.apply(_ref14, _toConsumableArray$i(range));
  };
  this.getSourceData = function(row, column, row2, column2) {
    var data;
    if (row === void 0) {
      data = dataSource.getData();
    } else {
      data = dataSource.getByRange(instance._createCellCoords(row, column), instance._createCellCoords(row2, column2));
    }
    return data;
  };
  this.getSourceDataArray = function(row, column, row2, column2) {
    var data;
    if (row === void 0) {
      data = dataSource.getData(true);
    } else {
      data = dataSource.getByRange(instance._createCellCoords(row, column), instance._createCellCoords(row2, column2), true);
    }
    return data;
  };
  this.getSourceDataAtCol = function(column) {
    return dataSource.getAtColumn(column);
  };
  this.setSourceDataAtCell = function(row, column, value, source) {
    var input = setDataInputToArray(row, column, value);
    var isThereAnySetSourceListener = this.hasHook("afterSetSourceDataAtCell");
    var changesForHook = [];
    if (isThereAnySetSourceListener) {
      arrayEach(input, function(_ref15) {
        var _ref16 = _slicedToArray$c(_ref15, 3), changeRow = _ref16[0], changeProp = _ref16[1], changeValue = _ref16[2];
        changesForHook.push([
          changeRow,
          changeProp,
          dataSource.getAtCell(changeRow, changeProp),
          changeValue
        ]);
      });
    }
    arrayEach(input, function(_ref17) {
      var _ref18 = _slicedToArray$c(_ref17, 3), changeRow = _ref18[0], changeProp = _ref18[1], changeValue = _ref18[2];
      dataSource.setAtCell(changeRow, changeProp, changeValue);
    });
    if (isThereAnySetSourceListener) {
      this.runHooks("afterSetSourceDataAtCell", changesForHook, source);
    }
    this.render();
    var activeEditor = instance.getActiveEditor();
    if (activeEditor && isDefined(activeEditor.refreshValue)) {
      activeEditor.refreshValue();
    }
  };
  this.getSourceDataAtRow = function(row) {
    return dataSource.getAtRow(row);
  };
  this.getSourceDataAtCell = function(row, column) {
    return dataSource.getAtCell(row, column);
  };
  this.getDataAtRow = function(row) {
    var data = datamap.getRange(instance._createCellCoords(row, 0), instance._createCellCoords(row, this.countCols() - 1), datamap.DESTINATION_RENDERER);
    return data[0] || [];
  };
  this.getDataType = function(rowFrom, columnFrom, rowTo, columnTo) {
    var _this4 = this;
    var coords = rowFrom === void 0 ? [0, 0, this.countRows(), this.countCols()] : [rowFrom, columnFrom, rowTo, columnTo];
    var rowStart = coords[0], columnStart = coords[1];
    var rowEnd = coords[2], columnEnd = coords[3];
    var previousType = null;
    var currentType = null;
    if (rowEnd === void 0) {
      rowEnd = rowStart;
    }
    if (columnEnd === void 0) {
      columnEnd = columnStart;
    }
    var type = "mixed";
    rangeEach(Math.max(Math.min(rowStart, rowEnd), 0), Math.max(rowStart, rowEnd), function(row) {
      var isTypeEqual = true;
      rangeEach(Math.max(Math.min(columnStart, columnEnd), 0), Math.max(columnStart, columnEnd), function(column) {
        var cellType = _this4.getCellMeta(row, column);
        currentType = cellType.type;
        if (previousType) {
          isTypeEqual = previousType === currentType;
        } else {
          previousType = currentType;
        }
        return isTypeEqual;
      });
      type = isTypeEqual ? currentType : "mixed";
      return isTypeEqual;
    });
    return type;
  };
  this.removeCellMeta = function(row, column, key) {
    var _ref19 = [this.toPhysicalRow(row), this.toPhysicalColumn(column)], physicalRow = _ref19[0], physicalColumn = _ref19[1];
    var cachedValue = metaManager.getCellMetaKeyValue(physicalRow, physicalColumn, key);
    var hookResult = instance.runHooks("beforeRemoveCellMeta", row, column, key, cachedValue);
    if (hookResult !== false) {
      metaManager.removeCellMeta(physicalRow, physicalColumn, key);
      instance.runHooks("afterRemoveCellMeta", row, column, key, cachedValue);
    }
    cachedValue = null;
  };
  this.spliceCellsMeta = function(visualIndex) {
    var _this5 = this;
    var deleteAmount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    for (var _len3 = arguments.length, cellMetaRows = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      cellMetaRows[_key3 - 2] = arguments[_key3];
    }
    if (cellMetaRows.length > 0 && !Array.isArray(cellMetaRows[0])) {
      throw new Error("The 3rd argument (cellMetaRows) has to be passed as an array of cell meta objects array.");
    }
    if (deleteAmount > 0) {
      metaManager.removeRow(this.toPhysicalRow(visualIndex), deleteAmount);
    }
    if (cellMetaRows.length > 0) {
      arrayEach(cellMetaRows.reverse(), function(cellMetaRow) {
        metaManager.createRow(_this5.toPhysicalRow(visualIndex));
        arrayEach(cellMetaRow, function(cellMeta, columnIndex) {
          return _this5.setCellMetaObject(visualIndex, columnIndex, cellMeta);
        });
      });
    }
    instance.render();
  };
  this.setCellMetaObject = function(row, column, prop) {
    var _this6 = this;
    if (_typeof$B(prop) === "object") {
      objectEach(prop, function(value, key) {
        _this6.setCellMeta(row, column, key, value);
      });
    }
  };
  this.setCellMeta = function(row, column, key, value) {
    var allowSetCellMeta = instance.runHooks("beforeSetCellMeta", row, column, key, value);
    if (allowSetCellMeta === false) {
      return;
    }
    var physicalRow = row;
    var physicalColumn = column;
    if (row < this.countRows()) {
      physicalRow = this.toPhysicalRow(row);
    }
    if (column < this.countCols()) {
      physicalColumn = this.toPhysicalColumn(column);
    }
    metaManager.setCellMeta(physicalRow, physicalColumn, key, value);
    instance.runHooks("afterSetCellMeta", row, column, key, value);
  };
  this.getCellsMeta = function() {
    return metaManager.getCellsMeta();
  };
  this.getCellMeta = function(row, column) {
    var physicalRow = this.toPhysicalRow(row);
    var physicalColumn = this.toPhysicalColumn(column);
    if (physicalRow === null) {
      physicalRow = row;
    }
    if (physicalColumn === null) {
      physicalColumn = column;
    }
    return metaManager.getCellMeta(physicalRow, physicalColumn, {
      visualRow: row,
      visualColumn: column
    });
  };
  this.getCellMetaAtRow = function(row) {
    return metaManager.getCellsMetaAtRow(row);
  };
  this.isColumnModificationAllowed = function() {
    return !(instance.dataType === "object" || tableMeta.columns);
  };
  var rendererLookup = cellMethodLookupFactory("renderer");
  this.getCellRenderer = function(row, column) {
    return _getItem(rendererLookup.call(this, row, column));
  };
  this.getCellEditor = cellMethodLookupFactory("editor");
  var validatorLookup = cellMethodLookupFactory("validator");
  this.getCellValidator = function(row, column) {
    var validator = validatorLookup.call(this, row, column);
    if (typeof validator === "string") {
      validator = _getItem$1(validator);
    }
    return validator;
  };
  this.validateCells = function(callback) {
    this._validateCells(callback);
  };
  this.validateRows = function(rows, callback) {
    if (!Array.isArray(rows)) {
      throw new Error("validateRows parameter `rows` must be an array");
    }
    this._validateCells(callback, rows);
  };
  this.validateColumns = function(columns, callback) {
    if (!Array.isArray(columns)) {
      throw new Error("validateColumns parameter `columns` must be an array");
    }
    this._validateCells(callback, void 0, columns);
  };
  this._validateCells = function(callback, rows, columns) {
    var waitingForValidator = new ValidatorsQueue();
    if (callback) {
      waitingForValidator.onQueueEmpty = callback;
    }
    var i = instance.countRows() - 1;
    while (i >= 0) {
      if (rows !== void 0 && rows.indexOf(i) === -1) {
        i -= 1;
        continue;
      }
      var j = instance.countCols() - 1;
      while (j >= 0) {
        if (columns !== void 0 && columns.indexOf(j) === -1) {
          j -= 1;
          continue;
        }
        waitingForValidator.addValidatorToQueue();
        instance.validateCell(instance.getDataAtCell(i, j), instance.getCellMeta(i, j), function(result) {
          if (typeof result !== "boolean") {
            throw new Error("Validation error: result is not boolean");
          }
          if (result === false) {
            waitingForValidator.valid = false;
          }
          waitingForValidator.removeValidatorFormQueue();
        }, "validateCells");
        j -= 1;
      }
      i -= 1;
    }
    waitingForValidator.checkIfQueueIsEmpty();
  };
  this.getRowHeader = function(row) {
    var rowHeader = tableMeta.rowHeaders;
    var physicalRow = row;
    if (physicalRow !== void 0) {
      physicalRow = instance.runHooks("modifyRowHeader", physicalRow);
    }
    if (physicalRow === void 0) {
      rowHeader = [];
      rangeEach(instance.countRows() - 1, function(i) {
        rowHeader.push(instance.getRowHeader(i));
      });
    } else if (Array.isArray(rowHeader) && rowHeader[physicalRow] !== void 0) {
      rowHeader = rowHeader[physicalRow];
    } else if (isFunction(rowHeader)) {
      rowHeader = rowHeader(physicalRow);
    } else if (rowHeader && typeof rowHeader !== "string" && typeof rowHeader !== "number") {
      rowHeader = physicalRow + 1;
    }
    return rowHeader;
  };
  this.hasRowHeaders = function() {
    return !!tableMeta.rowHeaders;
  };
  this.hasColHeaders = function() {
    if (tableMeta.colHeaders !== void 0 && tableMeta.colHeaders !== null) {
      return !!tableMeta.colHeaders;
    }
    for (var i = 0, ilen = instance.countCols(); i < ilen; i++) {
      if (instance.getColHeader(i)) {
        return true;
      }
    }
    return false;
  };
  this.getColHeader = function(column) {
    var columnIndex = instance.runHooks("modifyColHeader", column);
    var result = tableMeta.colHeaders;
    if (columnIndex === void 0) {
      var out = [];
      var ilen = instance.countCols();
      for (var i = 0; i < ilen; i++) {
        out.push(instance.getColHeader(i));
      }
      result = out;
    } else {
      var translateVisualIndexToColumns = function translateVisualIndexToColumns2(visualColumnIndex) {
        var arr = [];
        var columnsLen = instance.countCols();
        var index = 0;
        for (; index < columnsLen; index++) {
          if (isFunction(tableMeta.columns) && tableMeta.columns(index)) {
            arr.push(index);
          }
        }
        return arr[visualColumnIndex];
      };
      var physicalColumn = instance.toPhysicalColumn(columnIndex);
      var prop = translateVisualIndexToColumns(physicalColumn);
      if (tableMeta.colHeaders === false) {
        result = null;
      } else if (tableMeta.columns && isFunction(tableMeta.columns) && tableMeta.columns(prop) && tableMeta.columns(prop).title) {
        result = tableMeta.columns(prop).title;
      } else if (tableMeta.columns && tableMeta.columns[physicalColumn] && tableMeta.columns[physicalColumn].title) {
        result = tableMeta.columns[physicalColumn].title;
      } else if (Array.isArray(tableMeta.colHeaders) && tableMeta.colHeaders[physicalColumn] !== void 0) {
        result = tableMeta.colHeaders[physicalColumn];
      } else if (isFunction(tableMeta.colHeaders)) {
        result = tableMeta.colHeaders(physicalColumn);
      } else if (tableMeta.colHeaders && typeof tableMeta.colHeaders !== "string" && typeof tableMeta.colHeaders !== "number") {
        result = spreadsheetColumnLabel(columnIndex);
      }
    }
    return result;
  };
  this._getColWidthFromSettings = function(col) {
    var width;
    if (col >= 0) {
      var cellProperties = instance.getCellMeta(0, col);
      width = cellProperties.width;
    }
    if (width === void 0 || width === tableMeta.width) {
      width = tableMeta.colWidths;
    }
    if (width !== void 0 && width !== null) {
      switch (_typeof$B(width)) {
        case "object":
          width = width[col];
          break;
        case "function":
          width = width(col);
          break;
      }
      if (typeof width === "string") {
        width = parseInt(width, 10);
      }
    }
    return width;
  };
  this.getColWidth = function(column) {
    var width = instance._getColWidthFromSettings(column);
    width = instance.runHooks("modifyColWidth", width, column);
    if (width === void 0) {
      width = ViewportColumnsCalculator.DEFAULT_WIDTH;
    }
    return width;
  };
  this._getRowHeightFromSettings = function(row) {
    var height = tableMeta.rowHeights;
    if (height !== void 0 && height !== null) {
      switch (_typeof$B(height)) {
        case "object":
          height = height[row];
          break;
        case "function":
          height = height(row);
          break;
      }
      if (typeof height === "string") {
        height = parseInt(height, 10);
      }
    }
    return height;
  };
  this.getRowHeight = function(row) {
    var height = instance._getRowHeightFromSettings(row);
    height = instance.runHooks("modifyRowHeight", height, row);
    return height;
  };
  this.countSourceRows = function() {
    return dataSource.countRows();
  };
  this.countSourceCols = function() {
    return dataSource.countFirstRowKeys();
  };
  this.countRows = function() {
    return datamap.getLength();
  };
  this.countCols = function() {
    var maxCols = tableMeta.maxCols;
    var dataLen = this.columnIndexMapper.getNotTrimmedIndexesLength();
    return Math.min(maxCols, dataLen);
  };
  this.countRenderedRows = function() {
    return instance.view._wt.drawn ? instance.view._wt.wtTable.getRenderedRowsCount() : -1;
  };
  this.countVisibleRows = function() {
    return instance.view._wt.drawn ? instance.view._wt.wtTable.getVisibleRowsCount() : -1;
  };
  this.countRenderedCols = function() {
    return instance.view._wt.drawn ? instance.view._wt.wtTable.getRenderedColumnsCount() : -1;
  };
  this.countVisibleCols = function() {
    return instance.view._wt.drawn ? instance.view._wt.wtTable.getVisibleColumnsCount() : -1;
  };
  this.countEmptyRows = function() {
    var ending = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var emptyRows = 0;
    rangeEachReverse(instance.countRows() - 1, function(visualIndex) {
      if (instance.isEmptyRow(visualIndex)) {
        emptyRows += 1;
      } else if (ending === true) {
        return false;
      }
    });
    return emptyRows;
  };
  this.countEmptyCols = function() {
    var ending = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    if (instance.countRows() < 1) {
      return 0;
    }
    var emptyColumns = 0;
    rangeEachReverse(instance.countCols() - 1, function(visualIndex) {
      if (instance.isEmptyCol(visualIndex)) {
        emptyColumns += 1;
      } else if (ending === true) {
        return false;
      }
    });
    return emptyColumns;
  };
  this.isEmptyRow = function(row) {
    return tableMeta.isEmptyRow.call(instance, row);
  };
  this.isEmptyCol = function(column) {
    return tableMeta.isEmptyCol.call(instance, column);
  };
  this.selectCell = function(row, column, endRow, endColumn) {
    var scrollToCell = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var changeListener = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : true;
    if (isUndefined(row) || isUndefined(column)) {
      return false;
    }
    return this.selectCells([[row, column, endRow, endColumn]], scrollToCell, changeListener);
  };
  this.selectCells = function() {
    var coords = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [[]];
    var scrollToCell = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    var changeListener = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    if (scrollToCell === false) {
      preventScrollingToCell = true;
    }
    var wasSelected = selection.selectCells(coords);
    if (wasSelected && changeListener) {
      instance.listen();
    }
    preventScrollingToCell = false;
    return wasSelected;
  };
  this.selectColumns = function(startColumn) {
    var endColumn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : startColumn;
    return selection.selectColumns(startColumn, endColumn);
  };
  this.selectRows = function(startRow) {
    var endRow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : startRow;
    return selection.selectRows(startRow, endRow);
  };
  this.deselectCell = function() {
    selection.deselect();
  };
  this.selectAll = function() {
    var includeHeaders = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    var includeRowHeaders = includeHeaders && this.hasRowHeaders();
    var includeColumnHeaders = includeHeaders && this.hasColHeaders();
    preventScrollingToCell = true;
    selection.selectAll(includeRowHeaders, includeColumnHeaders);
    preventScrollingToCell = false;
  };
  var getIndexToScroll = function getIndexToScroll2(indexMapper, visualIndex) {
    return indexMapper.getFirstNotHiddenIndex(visualIndex, 1, true);
  };
  this.scrollViewportTo = function(row, column) {
    var snapToBottom = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var snapToRight = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    var considerHiddenIndexes = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var snapToTop = !snapToBottom;
    var snapToLeft = !snapToRight;
    var renderableRow = row;
    var renderableColumn = column;
    if (considerHiddenIndexes) {
      var _isRowInteger = Number.isInteger(row);
      var _isColumnInteger = Number.isInteger(column);
      var visualRowToScroll = _isRowInteger ? getIndexToScroll(this.rowIndexMapper, row) : void 0;
      var visualColumnToScroll = _isColumnInteger ? getIndexToScroll(this.columnIndexMapper, column) : void 0;
      if (visualRowToScroll === null || visualColumnToScroll === null) {
        return false;
      }
      renderableRow = _isRowInteger ? instance.rowIndexMapper.getRenderableFromVisualIndex(visualRowToScroll) : void 0;
      renderableColumn = _isColumnInteger ? instance.columnIndexMapper.getRenderableFromVisualIndex(visualColumnToScroll) : void 0;
    }
    var isRowInteger = Number.isInteger(renderableRow);
    var isColumnInteger = Number.isInteger(renderableColumn);
    if (isRowInteger && isColumnInteger) {
      return instance.view.scrollViewport(instance._createCellCoords(renderableRow, renderableColumn), snapToTop, snapToRight, snapToBottom, snapToLeft);
    }
    if (isRowInteger && isColumnInteger === false) {
      return instance.view.scrollViewportVertically(renderableRow, snapToTop, snapToBottom);
    }
    if (isColumnInteger && isRowInteger === false) {
      return instance.view.scrollViewportHorizontally(renderableColumn, snapToRight, snapToLeft);
    }
    return false;
  };
  this.destroy = function() {
    instance._clearTimeouts();
    instance._clearImmediates();
    if (instance.view) {
      instance.view.destroy();
    }
    if (dataSource) {
      dataSource.destroy();
    }
    dataSource = null;
    this.getShortcutManager().destroy();
    metaManager.clearCache();
    if (isRootInstance(instance)) {
      var licenseInfo = this.rootDocument.querySelector("#hot-display-license-info");
      if (licenseInfo) {
        licenseInfo.parentNode.removeChild(licenseInfo);
      }
    }
    empty(instance.rootElement);
    eventManager.destroy();
    if (editorManager) {
      editorManager.destroy();
    }
    instance.batchExecution(function() {
      instance.rowIndexMapper.unregisterAll();
      instance.columnIndexMapper.unregisterAll();
      pluginsRegistry.getItems().forEach(function(_ref20) {
        var _ref21 = _slicedToArray$c(_ref20, 2), plugin = _ref21[1];
        plugin.destroy();
      });
      pluginsRegistry.clear();
      instance.runHooks("afterDestroy");
    }, true);
    Hooks.getSingleton().destroy(instance);
    objectEach(instance, function(property, key, obj) {
      if (isFunction(property)) {
        obj[key] = postMortem(key);
      } else if (key !== "guid") {
        obj[key] = null;
      }
    });
    instance.isDestroyed = true;
    if (datamap) {
      datamap.destroy();
    }
    instance.rowIndexMapper = null;
    instance.columnIndexMapper = null;
    datamap = null;
    grid = null;
    selection = null;
    editorManager = null;
    instance = null;
  };
  function postMortem(method) {
    return function() {
      throw new Error('The "'.concat(method, '" method cannot be called because this Handsontable instance has been destroyed'));
    };
  }
  this.getActiveEditor = function() {
    return editorManager.getActiveEditor();
  };
  this.getPlugin = function(pluginName) {
    var unifiedPluginName = toUpperCaseFirst(pluginName);
    if (unifiedPluginName === "UndoRedo") {
      return this.undoRedo;
    }
    return pluginsRegistry.getItem(unifiedPluginName);
  };
  this.getPluginName = function(plugin) {
    if (plugin === this.undoRedo) {
      return this.undoRedo.constructor.PLUGIN_KEY;
    }
    return pluginsRegistry.getId(plugin);
  };
  this.getInstance = function() {
    return instance;
  };
  this.addHook = function(key, callback) {
    Hooks.getSingleton().add(key, callback, instance);
  };
  this.hasHook = function(key) {
    return Hooks.getSingleton().has(key, instance) || Hooks.getSingleton().has(key);
  };
  this.addHookOnce = function(key, callback) {
    Hooks.getSingleton().once(key, callback, instance);
  };
  this.removeHook = function(key, callback) {
    Hooks.getSingleton().remove(key, callback, instance);
  };
  this.runHooks = function(key, p1, p2, p3, p4, p5, p6) {
    return Hooks.getSingleton().run(instance, key, p1, p2, p3, p4, p5, p6);
  };
  this.getTranslatedPhrase = function(dictionaryKey, extraArguments) {
    return getTranslatedPhrase(tableMeta.language, dictionaryKey, extraArguments);
  };
  this.toHTML = function() {
    return instanceToHTML(_this);
  };
  this.toTableElement = function() {
    var tempElement = _this.rootDocument.createElement("div");
    tempElement.insertAdjacentHTML("afterbegin", instanceToHTML(_this));
    return tempElement.firstElementChild;
  };
  this.timeouts = [];
  this._registerTimeout = function(handle) {
    var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var handleFunc = handle;
    if (typeof handleFunc === "function") {
      handleFunc = setTimeout(handleFunc, delay);
    }
    this.timeouts.push(handleFunc);
  };
  this._clearTimeouts = function() {
    arrayEach(this.timeouts, function(handler) {
      clearTimeout(handler);
    });
  };
  this.immediates = [];
  this._registerImmediate = function(callback) {
    this.immediates.push(setImmediate(callback));
  };
  this._clearImmediates = function() {
    arrayEach(this.immediates, function(handler) {
      clearImmediate(handler);
    });
  };
  this._refreshBorders = function() {
    var revertOriginal = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var prepareEditorIfNeeded = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    editorManager.destroyEditor(revertOriginal);
    instance.view.render();
    if (prepareEditorIfNeeded && selection.isSelected()) {
      editorManager.prepareEditor();
    }
  };
  this.isRtl = function() {
    return instance.rootWindow.getComputedStyle(instance.rootElement).direction === "rtl";
  };
  this.isLtr = function() {
    return !instance.isRtl();
  };
  this.getDirectionFactor = function() {
    return instance.isLtr() ? 1 : -1;
  };
  var shortcutManager = createShortcutManager({
    beforeKeyDown: function beforeKeyDown(event) {
      if (_this.isListening() === false) {
        return false;
      }
      return _this.runHooks("beforeKeyDown", event);
    },
    afterKeyDown: function afterKeyDown(event) {
      if (_this.isDestroyed) {
        return;
      }
      instance.runHooks("afterDocumentKeyDown", event);
    },
    ownerWindow: this.rootWindow
  });
  this.getShortcutManager = function() {
    return shortcutManager;
  };
  var gridContext = shortcutManager.addContext("grid");
  var gridConfig = {
    runOnlyIf: function runOnlyIf() {
      return isDefined(instance.getSelected()) && instance.countRenderedRows() > 0 && instance.countRenderedCols() > 0;
    },
    group: SHORTCUTS_GROUP
  };
  shortcutManager.setActiveContextName("grid");
  gridContext.addShortcuts([{
    keys: [["Control/Meta", "A"]],
    callback: function callback() {
      instance.selectAll();
    }
  }, {
    keys: [["Control/Meta", "Enter"]],
    callback: function callback() {
      var selectedRange = instance.getSelectedRange();
      var _selectedRange$highli = selectedRange[selectedRange.length - 1].highlight, highlightRow = _selectedRange$highli.row, highlightColumn = _selectedRange$highli.col;
      var valueToPopulate = instance.getDataAtCell(highlightRow, highlightColumn);
      var cellValues = new Map();
      for (var i = 0; i < selectedRange.length; i++) {
        selectedRange[i].forAll(function(row, column) {
          if (row >= 0 && column >= 0 && (row !== highlightRow || column !== highlightColumn)) {
            var _instance$getCellMeta = instance.getCellMeta(row, column), readOnly = _instance$getCellMeta.readOnly;
            if (!readOnly) {
              cellValues.set("".concat(row, "x").concat(column), [row, column, valueToPopulate]);
            }
          }
        });
      }
      instance.setDataAtCell(Array.from(cellValues.values()));
    },
    runOnlyIf: function runOnlyIf() {
      return instance.getSelectedRangeLast().getCellsCount() > 1;
    }
  }, {
    keys: [["ArrowUp"]],
    callback: function callback() {
      selection.transformStart(-1, 0);
    }
  }, {
    keys: [["ArrowUp", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      selection.setRangeStart(instance._createCellCoords(instance.rowIndexMapper.getFirstNotHiddenIndex(0, 1), instance.getSelectedRangeLast().highlight.col));
    }
  }, {
    keys: [["ArrowUp", "Shift"]],
    callback: function callback() {
      selection.transformEnd(-1, 0);
    }
  }, {
    keys: [["ArrowUp", "Shift", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$getSelected = instance.getSelectedRangeLast(), from = _instance$getSelected.from, to = _instance$getSelected.to;
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(0, 1);
      selection.setRangeStart(from.clone());
      selection.setRangeEnd(instance._createCellCoords(row, to.col));
    },
    runOnlyIf: function runOnlyIf() {
      return !(instance.selection.isSelectedByCorner() || instance.selection.isSelectedByColumnHeader());
    }
  }, {
    keys: [["ArrowDown"]],
    callback: function callback() {
      selection.transformStart(1, 0);
    }
  }, {
    keys: [["ArrowDown", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      selection.setRangeStart(instance._createCellCoords(instance.rowIndexMapper.getFirstNotHiddenIndex(instance.countRows() - 1, -1), instance.getSelectedRangeLast().highlight.col));
    }
  }, {
    keys: [["ArrowDown", "Shift"]],
    callback: function callback() {
      selection.transformEnd(1, 0);
    }
  }, {
    keys: [["ArrowDown", "Shift", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$getSelected2 = instance.getSelectedRangeLast(), from = _instance$getSelected2.from, to = _instance$getSelected2.to;
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(instance.countRows() - 1, -1);
      selection.setRangeStart(from.clone());
      selection.setRangeEnd(instance._createCellCoords(row, to.col));
    },
    runOnlyIf: function runOnlyIf() {
      return !(instance.selection.isSelectedByCorner() || instance.selection.isSelectedByColumnHeader());
    }
  }, {
    keys: [["ArrowLeft"]],
    callback: function callback() {
      selection.transformStart(0, -1 * instance.getDirectionFactor());
    }
  }, {
    keys: [["ArrowLeft", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$columnIndex;
      var row = instance.getSelectedRangeLast().highlight.row;
      var column = (_instance$columnIndex = instance.columnIndexMapper).getFirstNotHiddenIndex.apply(_instance$columnIndex, _toConsumableArray$i(instance.isRtl() ? [instance.countCols() - 1, -1] : [0, 1]));
      selection.setRangeStart(instance._createCellCoords(row, column));
    }
  }, {
    keys: [["ArrowLeft", "Shift"]],
    callback: function callback() {
      selection.transformEnd(0, -1 * instance.getDirectionFactor());
    }
  }, {
    keys: [["ArrowLeft", "Shift", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$columnIndex2;
      var _instance$getSelected3 = instance.getSelectedRangeLast(), from = _instance$getSelected3.from, to = _instance$getSelected3.to;
      var column = (_instance$columnIndex2 = instance.columnIndexMapper).getFirstNotHiddenIndex.apply(_instance$columnIndex2, _toConsumableArray$i(instance.isRtl() ? [instance.countCols() - 1, -1] : [0, 1]));
      selection.setRangeStart(from.clone());
      selection.setRangeEnd(instance._createCellCoords(to.row, column));
    },
    runOnlyIf: function runOnlyIf() {
      return !(instance.selection.isSelectedByCorner() || instance.selection.isSelectedByRowHeader());
    }
  }, {
    keys: [["ArrowRight"]],
    callback: function callback() {
      selection.transformStart(0, instance.getDirectionFactor());
    }
  }, {
    keys: [["ArrowRight", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$columnIndex3;
      var row = instance.getSelectedRangeLast().highlight.row;
      var column = (_instance$columnIndex3 = instance.columnIndexMapper).getFirstNotHiddenIndex.apply(_instance$columnIndex3, _toConsumableArray$i(instance.isRtl() ? [0, 1] : [instance.countCols() - 1, -1]));
      selection.setRangeStart(instance._createCellCoords(row, column));
    }
  }, {
    keys: [["ArrowRight", "Shift"]],
    callback: function callback() {
      selection.transformEnd(0, instance.getDirectionFactor());
    }
  }, {
    keys: [["ArrowRight", "Shift", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var _instance$columnIndex4;
      var _instance$getSelected4 = instance.getSelectedRangeLast(), from = _instance$getSelected4.from, to = _instance$getSelected4.to;
      var column = (_instance$columnIndex4 = instance.columnIndexMapper).getFirstNotHiddenIndex.apply(_instance$columnIndex4, _toConsumableArray$i(instance.isRtl() ? [0, 1] : [instance.countCols() - 1, -1]));
      selection.setRangeStart(from.clone());
      selection.setRangeEnd(instance._createCellCoords(to.row, column));
    },
    runOnlyIf: function runOnlyIf() {
      return !(instance.selection.isSelectedByCorner() || instance.selection.isSelectedByRowHeader());
    }
  }, {
    keys: [["Home"]],
    captureCtrl: true,
    callback: function callback() {
      var fixedColumns = parseInt(instance.getSettings().fixedColumnsStart, 10);
      var row = instance.getSelectedRangeLast().highlight.row;
      var column = instance.columnIndexMapper.getFirstNotHiddenIndex(fixedColumns, 1);
      selection.setRangeStart(instance._createCellCoords(row, column));
    },
    runOnlyIf: function runOnlyIf() {
      return instance.view.isMainTableNotFullyCoveredByOverlays();
    }
  }, {
    keys: [["Home", "Shift"]],
    callback: function callback() {
      selection.setRangeEnd(instance._createCellCoords(selection.selectedRange.current().from.row, instance.columnIndexMapper.getFirstNotHiddenIndex(0, 1)));
    }
  }, {
    keys: [["Home", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var fixedRows = parseInt(instance.getSettings().fixedRowsTop, 10);
      var fixedColumns = parseInt(instance.getSettings().fixedColumnsStart, 10);
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(fixedRows, 1);
      var column = instance.columnIndexMapper.getFirstNotHiddenIndex(fixedColumns, 1);
      selection.setRangeStart(instance._createCellCoords(row, column));
    },
    runOnlyIf: function runOnlyIf() {
      return instance.view.isMainTableNotFullyCoveredByOverlays();
    }
  }, {
    keys: [["End"]],
    captureCtrl: true,
    callback: function callback() {
      selection.setRangeStart(instance._createCellCoords(instance.getSelectedRangeLast().highlight.row, instance.columnIndexMapper.getFirstNotHiddenIndex(instance.countCols() - 1, -1)));
    },
    runOnlyIf: function runOnlyIf() {
      return instance.view.isMainTableNotFullyCoveredByOverlays();
    }
  }, {
    keys: [["End", "Shift"]],
    callback: function callback() {
      selection.setRangeEnd(instance._createCellCoords(selection.selectedRange.current().from.row, instance.columnIndexMapper.getFirstNotHiddenIndex(instance.countCols() - 1, -1)));
    }
  }, {
    keys: [["End", "Control/Meta"]],
    captureCtrl: true,
    callback: function callback() {
      var fixedRows = parseInt(instance.getSettings().fixedRowsBottom, 10);
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(instance.countRows() - fixedRows - 1, -1);
      var column = instance.columnIndexMapper.getFirstNotHiddenIndex(instance.countCols() - 1, -1);
      selection.setRangeStart(instance._createCellCoords(row, column));
    },
    runOnlyIf: function runOnlyIf() {
      return instance.view.isMainTableNotFullyCoveredByOverlays();
    }
  }, {
    keys: [["PageUp"]],
    callback: function callback() {
      selection.transformStart(-instance.countVisibleRows(), 0);
    }
  }, {
    keys: [["PageUp", "Shift"]],
    callback: function callback() {
      var _instance$getSelected5 = instance.getSelectedRangeLast(), to = _instance$getSelected5.to;
      var nextRowIndexToSelect = Math.max(to.row - instance.countVisibleRows(), 0);
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(nextRowIndexToSelect, 1);
      if (row !== null) {
        var coords = instance._createCellCoords(row, to.col);
        var scrollPadding = to.row - instance.view.getFirstFullyVisibleRow();
        var nextVerticalScroll = Math.max(coords.row - scrollPadding, 0);
        selection.setRangeEnd(coords);
        instance.scrollViewportTo(nextVerticalScroll);
      }
    }
  }, {
    keys: [["PageDown"]],
    callback: function callback() {
      selection.transformStart(instance.countVisibleRows(), 0);
    }
  }, {
    keys: [["PageDown", "Shift"]],
    callback: function callback() {
      var _instance$getSelected6 = instance.getSelectedRangeLast(), to = _instance$getSelected6.to;
      var nextRowIndexToSelect = Math.min(to.row + instance.countVisibleRows(), instance.countRows() - 1);
      var row = instance.rowIndexMapper.getFirstNotHiddenIndex(nextRowIndexToSelect, -1);
      if (row !== null) {
        var coords = instance._createCellCoords(row, to.col);
        var scrollPadding = to.row - instance.view.getFirstFullyVisibleRow();
        var nextVerticalScroll = Math.min(coords.row - scrollPadding, instance.countRows() - 1);
        selection.setRangeEnd(coords);
        instance.scrollViewportTo(nextVerticalScroll);
      }
    }
  }, {
    keys: [["Tab"]],
    callback: function callback(event) {
      var tabMoves = typeof tableMeta.tabMoves === "function" ? tableMeta.tabMoves(event) : tableMeta.tabMoves;
      selection.transformStart(tabMoves.row, tabMoves.col, true);
    }
  }, {
    keys: [["Shift", "Tab"]],
    callback: function callback(event) {
      var tabMoves = typeof tableMeta.tabMoves === "function" ? tableMeta.tabMoves(event) : tableMeta.tabMoves;
      selection.transformStart(-tabMoves.row, -tabMoves.col);
    }
  }], gridConfig);
  getPluginsNames().forEach(function(pluginName) {
    var PluginClass = getPlugin(pluginName);
    pluginsRegistry.addItem(pluginName, new PluginClass(_this));
  });
  Hooks.getSingleton().run(instance, "construct");
}

var MIXIN_NAME$6 = "hooksRefRegisterer";
var hooksRefRegisterer = {
  _hooksStorage: Object.create(null),
  addHook: function addHook(key, callback) {
    if (!this._hooksStorage[key]) {
      this._hooksStorage[key] = [];
    }
    this.hot.addHook(key, callback);
    this._hooksStorage[key].push(callback);
    return this;
  },
  removeHooksByKey: function removeHooksByKey(key) {
    var _this = this;
    arrayEach(this._hooksStorage[key] || [], function(callback) {
      _this.hot.removeHook(key, callback);
    });
  },
  clearHooks: function clearHooks() {
    var _this2 = this;
    objectEach(this._hooksStorage, function(callbacks, name) {
      return _this2.removeHooksByKey(name);
    });
    this._hooksStorage = {};
  }
};
defineGetter(hooksRefRegisterer, "MIXIN_NAME", MIXIN_NAME$6, {
  writable: false,
  enumerable: false
});

function _typeof$C(obj) {
  "@babel/helpers - typeof";
  return _typeof$C = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$C(obj);
}
function _slicedToArray$d(arr, i) {
  return _arrayWithHoles$d(arr) || _iterableToArrayLimit$d(arr, i) || _unsupportedIterableToArray$p(arr, i) || _nonIterableRest$d();
}
function _nonIterableRest$d() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$p(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$p(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$p(o, minLen);
}
function _arrayLikeToArray$p(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$d(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$d(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _inherits$q(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$s(subClass, superClass);
}
function _setPrototypeOf$s(o, p) {
  _setPrototypeOf$s = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$s(o, p);
}
function _createSuper$q(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$s();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$q(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$q(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$q(this, result);
  };
}
function _possibleConstructorReturn$q(self, call) {
  if (call && (_typeof$C(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$q(self);
}
function _assertThisInitialized$q(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$s() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$q(o) {
  _getPrototypeOf$q = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$q(o);
}
function _classCallCheck$1b(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1b(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1b(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1b(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1b(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
var EDITOR_TYPE = "base";
var EDITOR_STATE = Object.freeze({
  VIRGIN: "STATE_VIRGIN",
  EDITING: "STATE_EDITING",
  WAITING: "STATE_WAITING",
  FINISHED: "STATE_FINISHED"
});
var SHORTCUTS_GROUP_EDITOR$1 = "baseEditor";
var BaseEditor = /* @__PURE__ */ function() {
  function BaseEditor2(instance) {
    _classCallCheck$1b(this, BaseEditor2);
    this.hot = instance;
    this.instance = instance;
    this.state = EDITOR_STATE.VIRGIN;
    this._opened = false;
    this._fullEditMode = false;
    this._closeCallback = null;
    this.TD = null;
    this.row = null;
    this.col = null;
    this.prop = null;
    this.originalValue = null;
    this.cellProperties = null;
    this.init();
  }
  _createClass$1b(BaseEditor2, [{
    key: "_fireCallbacks",
    value: function _fireCallbacks(result) {
      if (this._closeCallback) {
        this._closeCallback(result);
        this._closeCallback = null;
      }
    }
  }, {
    key: "init",
    value: function init() {
    }
  }, {
    key: "getValue",
    value: function getValue() {
      throw Error("Editor getValue() method unimplemented");
    }
  }, {
    key: "setValue",
    value: function setValue() {
      throw Error("Editor setValue() method unimplemented");
    }
  }, {
    key: "open",
    value: function open() {
      throw Error("Editor open() method unimplemented");
    }
  }, {
    key: "close",
    value: function close() {
      throw Error("Editor close() method unimplemented");
    }
  }, {
    key: "prepare",
    value: function prepare(row, col, prop, td, value, cellProperties) {
      this.TD = td;
      this.row = row;
      this.col = col;
      this.prop = prop;
      this.originalValue = value;
      this.cellProperties = cellProperties;
      this.state = EDITOR_STATE.VIRGIN;
    }
  }, {
    key: "extend",
    value: function extend() {
      return /* @__PURE__ */ function(_this$constructor) {
        _inherits$q(Editor, _this$constructor);
        var _super = _createSuper$q(Editor);
        function Editor() {
          _classCallCheck$1b(this, Editor);
          return _super.apply(this, arguments);
        }
        return _createClass$1b(Editor);
      }(this.constructor);
    }
  }, {
    key: "saveValue",
    value: function saveValue(value, ctrlDown) {
      var _this = this;
      var visualRowFrom;
      var visualColumnFrom;
      var visualRowTo;
      var visualColumnTo;
      if (ctrlDown) {
        var selectedLast = this.hot.getSelectedLast();
        visualRowFrom = Math.max(Math.min(selectedLast[0], selectedLast[2]), 0);
        visualColumnFrom = Math.max(Math.min(selectedLast[1], selectedLast[3]), 0);
        visualRowTo = Math.max(selectedLast[0], selectedLast[2]);
        visualColumnTo = Math.max(selectedLast[1], selectedLast[3]);
      } else {
        var _ref = [this.row, this.col, null, null];
        visualRowFrom = _ref[0];
        visualColumnFrom = _ref[1];
        visualRowTo = _ref[2];
        visualColumnTo = _ref[3];
      }
      var modifiedCellCoords = this.hot.runHooks("modifyGetCellCoords", visualRowFrom, visualColumnFrom);
      if (Array.isArray(modifiedCellCoords)) {
        var _modifiedCellCoords = _slicedToArray$d(modifiedCellCoords, 2);
        visualRowFrom = _modifiedCellCoords[0];
        visualColumnFrom = _modifiedCellCoords[1];
      }
      var shortcutManager = this.hot.getShortcutManager();
      var editorContext = shortcutManager.getContext("editor");
      var contextConfig = {
        runOnlyIf: function runOnlyIf() {
          return isDefined(_this.hot.getSelected());
        },
        group: SHORTCUTS_GROUP_EDITOR$1
      };
      if (this.isInFullEditMode()) {
        editorContext.addShortcuts([{
          keys: [["ArrowUp"]],
          callback: function callback() {
            _this.hot.selection.transformStart(-1, 0);
          }
        }, {
          keys: [["ArrowDown"]],
          callback: function callback() {
            _this.hot.selection.transformStart(1, 0);
          }
        }, {
          keys: [["ArrowLeft"]],
          callback: function callback() {
            _this.hot.selection.transformStart(0, -1 * _this.hot.getDirectionFactor());
          }
        }, {
          keys: [["ArrowRight"]],
          callback: function callback() {
            _this.hot.selection.transformStart(0, _this.hot.getDirectionFactor());
          }
        }], contextConfig);
      }
      this.hot.populateFromArray(visualRowFrom, visualColumnFrom, value, visualRowTo, visualColumnTo, "edit");
    }
  }, {
    key: "beginEditing",
    value: function beginEditing(newInitialValue, event) {
      if (this.state !== EDITOR_STATE.VIRGIN) {
        return;
      }
      var hotInstance = this.hot;
      var renderableRowIndex = hotInstance.rowIndexMapper.getRenderableFromVisualIndex(this.row);
      var renderableColumnIndex = hotInstance.columnIndexMapper.getRenderableFromVisualIndex(this.col);
      hotInstance.view.scrollViewport(hotInstance._createCellCoords(renderableRowIndex, renderableColumnIndex));
      this.state = EDITOR_STATE.EDITING;
      if (this.isInFullEditMode()) {
        var stringifiedInitialValue = typeof newInitialValue === "string" ? newInitialValue : stringify(this.originalValue);
        this.setValue(stringifiedInitialValue);
      }
      this.open(event);
      this._opened = true;
      this.focus();
      hotInstance.view.render();
      hotInstance.runHooks("afterBeginEditing", this.row, this.col);
    }
  }, {
    key: "finishEditing",
    value: function finishEditing(restoreOriginalValue, ctrlDown, callback) {
      var _this2 = this;
      var val;
      if (callback) {
        var previousCloseCallback = this._closeCallback;
        this._closeCallback = function(result) {
          if (previousCloseCallback) {
            previousCloseCallback(result);
          }
          callback(result);
          _this2.hot.view.render();
        };
      }
      if (this.isWaiting()) {
        return;
      }
      var shortcutManager = this.hot.getShortcutManager();
      var editorContext = shortcutManager.getContext("editor");
      editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP_EDITOR$1);
      editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP_NAVIGATION);
      if (this.state === EDITOR_STATE.VIRGIN) {
        this.hot._registerTimeout(function() {
          _this2._fireCallbacks(true);
        });
        return;
      }
      if (this.state === EDITOR_STATE.EDITING) {
        if (restoreOriginalValue) {
          this.cancelChanges();
          this.hot.view.render();
          return;
        }
        var value = this.getValue();
        if (this.hot.getSettings().trimWhitespace) {
          val = [[typeof value === "string" ? String.prototype.trim.call(value || "") : value]];
        } else {
          val = [[value]];
        }
        this.state = EDITOR_STATE.WAITING;
        this.saveValue(val, ctrlDown);
        if (this.hot.getCellValidator(this.cellProperties)) {
          this.hot.addHookOnce("postAfterValidate", function(result) {
            _this2.state = EDITOR_STATE.FINISHED;
            _this2.discardEditor(result);
          });
        } else {
          this.state = EDITOR_STATE.FINISHED;
          this.discardEditor(true);
        }
      }
    }
  }, {
    key: "cancelChanges",
    value: function cancelChanges() {
      this.state = EDITOR_STATE.FINISHED;
      this.discardEditor();
    }
  }, {
    key: "discardEditor",
    value: function discardEditor(result) {
      if (this.state !== EDITOR_STATE.FINISHED) {
        return;
      }
      if (result === false && this.cellProperties.allowInvalid !== true) {
        this.hot.selectCell(this.row, this.col);
        this.focus();
        this.state = EDITOR_STATE.EDITING;
        this._fireCallbacks(false);
      } else {
        this.close();
        this._opened = false;
        this._fullEditMode = false;
        this.state = EDITOR_STATE.VIRGIN;
        this._fireCallbacks(true);
        var shortcutManager = this.hot.getShortcutManager();
        shortcutManager.setActiveContextName("grid");
      }
    }
  }, {
    key: "enableFullEditMode",
    value: function enableFullEditMode() {
      this._fullEditMode = true;
    }
  }, {
    key: "isInFullEditMode",
    value: function isInFullEditMode() {
      return this._fullEditMode;
    }
  }, {
    key: "isOpened",
    value: function isOpened() {
      return this._opened;
    }
  }, {
    key: "isWaiting",
    value: function isWaiting() {
      return this.state === EDITOR_STATE.WAITING;
    }
  }, {
    key: "getEditedCellRect",
    value: function getEditedCellRect() {
      var _wtOverlays$getParent;
      var TD = this.getEditedCell();
      if (!TD) {
        return;
      }
      var _this$hot$view$_wt = this.hot.view._wt, wtOverlays = _this$hot$view$_wt.wtOverlays, wtViewport = _this$hot$view$_wt.wtViewport;
      var rootWindow = this.hot.rootWindow;
      var currentOffset = offset(TD);
      var cellWidth = outerWidth(TD);
      var containerOffset = offset(this.hot.rootElement);
      var containerWidth = outerWidth(this.hot.rootElement);
      var scrollableContainerTop = wtOverlays.topOverlay.holder;
      var scrollableContainerLeft = wtOverlays.inlineStartOverlay.holder;
      var containerScrollTop = scrollableContainerTop !== rootWindow ? scrollableContainerTop.scrollTop : 0;
      var containerScrollLeft = scrollableContainerLeft !== rootWindow ? scrollableContainerLeft.scrollLeft : 0;
      var gridMostRightPos = rootWindow.innerWidth - containerOffset.left - containerWidth;
      var _ref2 = (_wtOverlays$getParent = wtOverlays.getParentOverlay(TD)) !== null && _wtOverlays$getParent !== void 0 ? _wtOverlays$getParent : this.hot.view._wt, overlayTable = _ref2.wtTable;
      var overlayName = overlayTable.name;
      var scrollTop = ["master", "inline_start"].includes(overlayName) ? containerScrollTop : 0;
      var scrollLeft = ["master", "top", "bottom"].includes(overlayName) ? containerScrollLeft : 0;
      var editTopModifier = currentOffset.top === containerOffset.top ? 0 : 1;
      var topPos = currentOffset.top - containerOffset.top - editTopModifier - scrollTop;
      var inlineStartPos = 0;
      if (this.hot.isRtl()) {
        inlineStartPos = rootWindow.innerWidth - currentOffset.left - cellWidth - gridMostRightPos - 1 + scrollLeft;
      } else {
        inlineStartPos = currentOffset.left - containerOffset.left - 1 - scrollLeft;
      }
      if (["top", "top_inline_start_corner"].includes(overlayName)) {
        topPos += wtOverlays.topOverlay.getOverlayOffset();
      }
      if (["inline_start", "top_inline_start_corner"].includes(overlayName)) {
        inlineStartPos += Math.abs(wtOverlays.inlineStartOverlay.getOverlayOffset());
      }
      var hasColumnHeaders = this.hot.hasColHeaders();
      var renderableRow = this.hot.rowIndexMapper.getRenderableFromVisualIndex(this.row);
      var renderableColumn = this.hot.columnIndexMapper.getRenderableFromVisualIndex(this.col);
      var nrOfRenderableRowIndexes = this.hot.rowIndexMapper.getRenderableIndexesLength();
      var firstRowIndexOfTheBottomOverlay = nrOfRenderableRowIndexes - this.hot.view._wt.getSetting("fixedRowsBottom");
      if (hasColumnHeaders && renderableRow <= 0 || renderableRow === firstRowIndexOfTheBottomOverlay) {
        topPos += 1;
      }
      if (renderableColumn <= 0) {
        inlineStartPos += 1;
      }
      var firstRowOffset = wtViewport.rowsRenderCalculator.startPosition;
      var firstColumnOffset = wtViewport.columnsRenderCalculator.startPosition;
      var horizontalScrollPosition = Math.abs(wtOverlays.inlineStartOverlay.getScrollPosition());
      var verticalScrollPosition = wtOverlays.topOverlay.getScrollPosition();
      var scrollbarWidth = getScrollbarWidth(this.hot.rootDocument);
      var cellTopOffset = TD.offsetTop + firstRowOffset - verticalScrollPosition;
      var cellStartOffset = 0;
      if (this.hot.isRtl()) {
        var cellOffset = TD.offsetLeft;
        if (cellOffset >= 0) {
          cellStartOffset = overlayTable.getWidth() - TD.offsetLeft;
        } else {
          cellStartOffset = Math.abs(cellOffset);
        }
        cellStartOffset += firstColumnOffset - horizontalScrollPosition - cellWidth;
      } else {
        cellStartOffset = TD.offsetLeft + firstColumnOffset - horizontalScrollPosition;
      }
      var cellComputedStyle = getComputedStyle(this.TD, this.hot.rootWindow);
      var borderPhysicalWidthProp = this.hot.isRtl() ? "borderRightWidth" : "borderLeftWidth";
      var inlineStartBorderCompensation = parseInt(cellComputedStyle[borderPhysicalWidthProp], 10) > 0 ? 0 : 1;
      var topBorderCompensation = parseInt(cellComputedStyle.borderTopWidth, 10) > 0 ? 0 : 1;
      var width = outerWidth(TD) + inlineStartBorderCompensation;
      var height = outerHeight(TD) + topBorderCompensation;
      var actualVerticalScrollbarWidth = hasVerticalScrollbar(scrollableContainerTop) ? scrollbarWidth : 0;
      var actualHorizontalScrollbarWidth = hasHorizontalScrollbar(scrollableContainerLeft) ? scrollbarWidth : 0;
      var maxWidth = this.hot.view.maximumVisibleElementWidth(cellStartOffset) - actualVerticalScrollbarWidth + inlineStartBorderCompensation;
      var maxHeight = Math.max(this.hot.view.maximumVisibleElementHeight(cellTopOffset) - actualHorizontalScrollbarWidth + topBorderCompensation, 23);
      return {
        top: topPos,
        start: inlineStartPos,
        height,
        maxHeight,
        width,
        maxWidth
      };
    }
  }, {
    key: "getEditedCellsLayerClass",
    value: function getEditedCellsLayerClass() {
      var editorSection = this.checkEditorSection();
      switch (editorSection) {
        case "inline-start":
          return "ht_clone_left ht_clone_inline_start";
        case "bottom":
          return "ht_clone_bottom";
        case "bottom-inline-start-corner":
          return "ht_clone_bottom_left_corner ht_clone_bottom_inline_start_corner";
        case "top":
          return "ht_clone_top";
        case "top-inline-start-corner":
          return "ht_clone_top_left_corner ht_clone_top_inline_start_corner";
        default:
          return "ht_clone_master";
      }
    }
  }, {
    key: "getEditedCell",
    value: function getEditedCell() {
      return this.hot.getCell(this.row, this.col, true);
    }
  }, {
    key: "checkEditorSection",
    value: function checkEditorSection() {
      var totalRows = this.hot.countRows();
      var section = "";
      if (this.row < this.hot.getSettings().fixedRowsTop) {
        if (this.col < this.hot.getSettings().fixedColumnsStart) {
          section = "top-inline-start-corner";
        } else {
          section = "top";
        }
      } else if (this.hot.getSettings().fixedRowsBottom && this.row >= totalRows - this.hot.getSettings().fixedRowsBottom) {
        if (this.col < this.hot.getSettings().fixedColumnsStart) {
          section = "bottom-inline-start-corner";
        } else {
          section = "bottom";
        }
      } else if (this.col < this.hot.getSettings().fixedColumnsStart) {
        section = "inline-start";
      }
      return section;
    }
  }], [{
    key: "EDITOR_TYPE",
    get: function get() {
      return EDITOR_TYPE;
    }
  }]);
  return BaseEditor2;
}();
mixin(BaseEditor, hooksRefRegisterer);

function autoResize() {
  var defaults = {
    minHeight: 200,
    maxHeight: 300,
    minWidth: 100,
    maxWidth: 300
  }, el, body = document.body, text = document.createTextNode(""), span = document.createElement("SPAN"), observe = function observe2(element, event, handler) {
    element.addEventListener(event, handler, false);
  }, _unObserve = function unObserve(element, event, handler) {
    element.removeEventListener(event, handler, false);
  }, resize = function resize2(newChar) {
    var width, scrollHeight;
    if (!newChar) {
      newChar = "";
    } else if (!/^[a-zA-Z \.,\\\/\|0-9]$/.test(newChar)) {
      newChar = ".";
    }
    if (text.textContent !== void 0) {
      text.textContent = el.value + newChar;
    } else {
      text.data = el.value + newChar;
    }
    span.style.fontSize = getComputedStyle(el).fontSize;
    span.style.fontFamily = getComputedStyle(el).fontFamily;
    span.style.whiteSpace = "pre";
    body.appendChild(span);
    width = span.clientWidth + 2;
    body.removeChild(span);
    el.style.height = defaults.minHeight + "px";
    if (defaults.minWidth > width) {
      el.style.width = defaults.minWidth + "px";
    } else if (width > defaults.maxWidth) {
      el.style.width = defaults.maxWidth + "px";
    } else {
      el.style.width = width + "px";
    }
    scrollHeight = el.scrollHeight ? el.scrollHeight - 1 : 0;
    if (defaults.minHeight > scrollHeight) {
      el.style.height = defaults.minHeight + "px";
    } else if (defaults.maxHeight < scrollHeight) {
      el.style.height = defaults.maxHeight + "px";
      el.style.overflowY = "visible";
    } else {
      el.style.height = scrollHeight + "px";
    }
  }, delayedResize = function delayedResize2() {
    window.setTimeout(resize, 0);
  }, extendDefaults = function extendDefaults2(config) {
    if (config && config.minHeight) {
      if (config.minHeight == "inherit") {
        defaults.minHeight = el.clientHeight;
      } else {
        var minHeight = parseInt(config.minHeight);
        if (!isNaN(minHeight)) {
          defaults.minHeight = minHeight;
        }
      }
    }
    if (config && config.maxHeight) {
      if (config.maxHeight == "inherit") {
        defaults.maxHeight = el.clientHeight;
      } else {
        var maxHeight = parseInt(config.maxHeight);
        if (!isNaN(maxHeight)) {
          defaults.maxHeight = maxHeight;
        }
      }
    }
    if (config && config.minWidth) {
      if (config.minWidth == "inherit") {
        defaults.minWidth = el.clientWidth;
      } else {
        var minWidth = parseInt(config.minWidth);
        if (!isNaN(minWidth)) {
          defaults.minWidth = minWidth;
        }
      }
    }
    if (config && config.maxWidth) {
      if (config.maxWidth == "inherit") {
        defaults.maxWidth = el.clientWidth;
      } else {
        var maxWidth = parseInt(config.maxWidth);
        if (!isNaN(maxWidth)) {
          defaults.maxWidth = maxWidth;
        }
      }
    }
    if (!span.firstChild) {
      span.className = "autoResize";
      span.style.display = "inline-block";
      span.appendChild(text);
    }
  }, _init = function init(el_, config, doObserve) {
    el = el_;
    extendDefaults(config);
    if (el.nodeName == "TEXTAREA") {
      el.style.resize = "none";
      el.style.overflowY = "";
      el.style.height = defaults.minHeight + "px";
      el.style.minWidth = defaults.minWidth + "px";
      el.style.maxWidth = defaults.maxWidth + "px";
      el.style.overflowY = "hidden";
    }
    if (doObserve) {
      observe(el, "change", resize);
      observe(el, "cut", delayedResize);
      observe(el, "paste", delayedResize);
      observe(el, "drop", delayedResize);
      observe(el, "keydown", delayedResize);
      observe(el, "focus", resize);
      observe(el, "compositionstart", delayedResize);
      observe(el, "compositionupdate", delayedResize);
      observe(el, "compositionend", delayedResize);
    }
    resize();
  };
  function getComputedStyle(element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element);
  }
  return {
    init: function init(el_, config, doObserve) {
      _init(el_, config, doObserve);
    },
    unObserve: function unObserve() {
      _unObserve(el, "change", resize);
      _unObserve(el, "cut", delayedResize);
      _unObserve(el, "paste", delayedResize);
      _unObserve(el, "drop", delayedResize);
      _unObserve(el, "keydown", delayedResize);
      _unObserve(el, "focus", resize);
      _unObserve(el, "compositionstart", delayedResize);
      _unObserve(el, "compositionupdate", delayedResize);
      _unObserve(el, "compositionend", delayedResize);
    },
    resize
  };
}

function updateCaretPosition(actionName, textareaElement) {
  var caretPosition = getCaretPosition(textareaElement);
  var textLines = textareaElement.value.split("\n");
  var newCaretPosition = caretPosition;
  var lineStartIndex = 0;
  for (var i = 0; i < textLines.length; i++) {
    var textLine = textLines[i];
    if (i !== 0) {
      lineStartIndex += textLines[i - 1].length + 1;
    }
    var lineEndIndex = lineStartIndex + textLine.length;
    if (actionName === "home") {
      newCaretPosition = lineStartIndex;
    } else if (actionName === "end") {
      newCaretPosition = lineEndIndex;
    }
    if (caretPosition <= lineEndIndex) {
      break;
    }
  }
  setCaretPosition(textareaElement, newCaretPosition);
}

function _typeof$D(obj) {
  "@babel/helpers - typeof";
  return _typeof$D = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$D(obj);
}
function _slicedToArray$e(arr, i) {
  return _arrayWithHoles$e(arr) || _iterableToArrayLimit$e(arr, i) || _unsupportedIterableToArray$q(arr, i) || _nonIterableRest$e();
}
function _nonIterableRest$e() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$q(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$q(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$q(o, minLen);
}
function _arrayLikeToArray$q(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit$e(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$e(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _classCallCheck$1c(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1c(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1c(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1c(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1c(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {writable: false});
  return Constructor;
}
function _get$4() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get$4 = Reflect.get;
  } else {
    _get$4 = function _get2(target, property, receiver) {
      var base = _superPropBase$4(target, property);
      if (!base)
        return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get$4.apply(this, arguments);
}
function _superPropBase$4(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf$r(object);
    if (object === null)
      break;
  }
  return object;
}
function _inherits$r(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  Object.defineProperty(subClass, "prototype", {writable: false});
  if (superClass)
    _setPrototypeOf$t(subClass, superClass);
}
function _setPrototypeOf$t(o, p) {
  _setPrototypeOf$t = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$t(o, p);
}
function _createSuper$r(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct$t();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf$r(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf$r(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn$r(this, result);
  };
}
function _possibleConstructorReturn$r(self, call) {
  if (call && (_typeof$D(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$r(self);
}
function _assertThisInitialized$r(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$t() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf$r(o) {
  _getPrototypeOf$r = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$r(o);
}
var EDITOR_VISIBLE_CLASS_NAME = "ht_editor_visible";
var EDITOR_HIDDEN_CLASS_NAME = "ht_editor_hidden";
var SHORTCUTS_GROUP$1 = "textEditor";
var EDITOR_TYPE$1 = "text";
var TextEditor = /* @__PURE__ */ function(_BaseEditor) {
  _inherits$r(TextEditor2, _BaseEditor);
  var _super = _createSuper$r(TextEditor2);
  function TextEditor2(instance) {
    var _this;
    _classCallCheck$1c(this, TextEditor2);
    _this = _super.call(this, instance);
    _this.eventManager = new EventManager(_assertThisInitialized$r(_this));
    _this.autoResize = autoResize();
    _this.TEXTAREA = void 0;
    _this.textareaStyle = void 0;
    _this.TEXTAREA_PARENT = void 0;
    _this.textareaParentStyle = void 0;
    _this.layerClass = void 0;
    _this.createElements();
    _this.bindEvents();
    _this.hot.addHookOnce("afterDestroy", function() {
      return _this.destroy();
    });
    return _this;
  }
  _createClass$1c(TextEditor2, [{
    key: "getValue",
    value: function getValue() {
      return this.TEXTAREA.value;
    }
  }, {
    key: "setValue",
    value: function setValue(newValue) {
      this.TEXTAREA.value = newValue;
    }
  }, {
    key: "open",
    value: function open() {
      var _this2 = this;
      this.refreshDimensions();
      this.showEditableElement();
      var shortcutManager = this.hot.getShortcutManager();
      shortcutManager.setActiveContextName("editor");
      this.addHook("afterDocumentKeyDown", function(event) {
        return _this2.onAfterDocumentKeyDown(event);
      });
      this.registerShortcuts();
    }
  }, {
    key: "close",
    value: function close() {
      this.autoResize.unObserve();
      if (this.hot.rootDocument.activeElement === this.TEXTAREA) {
        this.hot.listen();
      }
      this.hideEditableElement();
      this.unregisterShortcuts();
      this.removeHooksByKey("afterDocumentKeyDown");
    }
  }, {
    key: "prepare",
    value: function prepare(row, col, prop, td, value, cellProperties) {
      var previousState = this.state;
      _get$4(_getPrototypeOf$r(TextEditor2.prototype), "prepare", this).call(this, row, col, prop, td, value, cellProperties);
      if (!cellProperties.readOnly) {
        this.refreshDimensions(true);
        var allowInvalid = cellProperties.allowInvalid, fragmentSelection = cellProperties.fragmentSelection;
        if (allowInvalid) {
          this.TEXTAREA.value = "";
        }
        if (previousState !== EDITOR_STATE.FINISHED) {
          this.hideEditableElement();
        }
        var restoreFocus = !fragmentSelection;
        if (restoreFocus && !isMobileBrowser()) {
          this.focus();
        }
      }
    }
  }, {
    key: "beginEditing",
    value: function beginEditing(newInitialValue, event) {
      if (this.state !== EDITOR_STATE.VIRGIN) {
        return;
      }
      this.TEXTAREA.value = "";
      _get$4(_getPrototypeOf$r(TextEditor2.prototype), "beginEditing", this).call(this, newInitialValue, event);
    }
  }, {
    key: "focus",
    value: function focus() {
      this.TEXTAREA.select();
      setCaretPosition(this.TEXTAREA, this.TEXTAREA.value.length);
    }
  }, {
    key: "createElements",
    value: function createElements() {
      var rootDocument = this.hot.rootDocument;
      this.TEXTAREA = rootDocument.createElement("TEXTAREA");
      this.TEXTAREA.setAttribute("data-hot-input", "");
      this.TEXTAREA.tabIndex = -1;
      addClass(this.TEXTAREA, "handsontableInput");
      this.textareaStyle = this.TEXTAREA.style;
      this.textareaStyle.width = 0;
      this.textareaStyle.height = 0;
      this.textareaStyle.overflowY = "visible";
      this.TEXTAREA_PARENT = rootDocument.createElement("DIV");
      addClass(this.TEXTAREA_PARENT, "handsontableInputHolder");
      if (hasClass(this.TEXTAREA_PARENT, this.layerClass)) {
        removeClass(this.TEXTAREA_PARENT, this.layerClass);
      }
      addClass(this.TEXTAREA_PARENT, EDITOR_HIDDEN_CLASS_NAME);
      this.textareaParentStyle = this.TEXTAREA_PARENT.style;
      this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
      this.hot.rootElement.appendChild(this.TEXTAREA_PARENT);
    }
  }, {
    key: "hideEditableElement",
    value: function hideEditableElement() {
      if (isIE() || isEdge()) {
        this.textareaStyle.textIndent = "-99999px";
      }
      this.textareaStyle.overflowY = "visible";
      this.textareaParentStyle.opacity = "0";
      this.textareaParentStyle.height = "1px";
      removeClass(this.TEXTAREA_PARENT, this.layerClass);
      addClass(this.TEXTAREA_PARENT, EDITOR_HIDDEN_CLASS_NAME);
    }
  }, {
    key: "showEditableElement",
    value: function showEditableElement() {
      this.textareaParentStyle.height = "";
      this.textareaParentStyle.overflow = "";
      this.textareaParentStyle.position = "";
      this.textareaParentStyle[this.hot.isRtl() ? "left" : "right"] = "auto";
      this.textareaParentStyle.opacity = "1";
      this.textareaStyle.textIndent = "";
      this.textareaStyle.overflowY = "hidden";
      var childNodes = this.TEXTAREA_PARENT.childNodes;
      var hasClassHandsontableEditor = false;
      rangeEach(childNodes.length - 1, function(index) {
        var childNode = childNodes[index];
        if (hasClass(childNode, "handsontableEditor")) {
          hasClassHandsontableEditor = true;
          return false;
        }
      });
      if (hasClass(this.TEXTAREA_PARENT, EDITOR_HIDDEN_CLASS_NAME)) {
        removeClass(this.TEXTAREA_PARENT, EDITOR_HIDDEN_CLASS_NAME);
      }
      if (hasClassHandsontableEditor) {
        this.layerClass = EDITOR_VISIBLE_CLASS_NAME;
        addClass(this.TEXTAREA_PARENT, this.layerClass);
      } else {
        this.layerClass = this.getEditedCellsLayerClass();
        addClass(this.TEXTAREA_PARENT, this.layerClass);
      }
    }
  }, {
    key: "refreshValue",
    value: function refreshValue() {
      var physicalRow = this.hot.toPhysicalRow(this.row);
      var sourceData = this.hot.getSourceDataAtCell(physicalRow, this.col);
      this.originalValue = sourceData;
      this.setValue(sourceData);
      this.refreshDimensions();
    }
  }, {
    key: "refreshDimensions",
    value: function refreshDimensions() {
      var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (this.state !== EDITOR_STATE.EDITING && !force) {
        return;
      }
      this.TD = this.getEditedCell();
      if (!this.TD) {
        if (!force) {
          this.close();
        }
        return;
      }
      var _this$getEditedCellRe = this.getEditedCellRect(), top = _this$getEditedCellRe.top, start = _this$getEditedCellRe.start, width = _this$getEditedCellRe.width, maxWidth = _this$getEditedCellRe.maxWidth, height = _this$getEditedCellRe.height, maxHeight = _this$getEditedCellRe.maxHeight;
      this.textareaParentStyle.top = "".concat(top, "px");
      this.textareaParentStyle[this.hot.isRtl() ? "right" : "left"] = "".concat(start, "px");
      this.showEditableElement();
      var cellComputedStyle = getComputedStyle(this.TD, this.hot.rootWindow);
      this.TEXTAREA.style.fontSize = cellComputedStyle.fontSize;
      this.TEXTAREA.style.fontFamily = cellComputedStyle.fontFamily;
      this.TEXTAREA.style.backgroundColor = this.TD.style.backgroundColor;
      var textareaComputedStyle = getComputedStyle(this.TEXTAREA);
      var horizontalPadding = parseInt(textareaComputedStyle.paddingLeft, 10) + parseInt(textareaComputedStyle.paddingRight, 10);
      var verticalPadding = parseInt(textareaComputedStyle.paddingTop, 10) + parseInt(textareaComputedStyle.paddingBottom, 10);
      var finalWidth = width - horizontalPadding;
      var finalHeight = height - verticalPadding;
      var finalMaxWidth = maxWidth - horizontalPadding;
      var finalMaxHeight = maxHeight - verticalPadding;
      this.autoResize.init(this.TEXTAREA, {
        minWidth: Math.min(finalWidth, finalMaxWidth),
        minHeight: Math.min(finalHeight, finalMaxHeight),
        maxWidth: finalMaxWidth,
        maxHeight: finalMaxHeight
      }, true);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;
      this.eventManager.addEventListener(this.TEXTAREA, "cut", function(event) {
        return event.stopPropagation();
      });
      this.eventManager.addEventListener(this.TEXTAREA, "paste", function(event) {
        return event.stopPropagation();
      });
      if (isIOS()) {
        this.eventManager.addEventListener(this.TEXTAREA, "focusout", function() {
          return _this3.finishEditing(false);
        });
      }
      this.addHook("afterScrollHorizontally", function() {
        return _this3.refreshDimensions();
      });
      this.addHook("afterScrollVertically", function() {
        return _this3.refreshDimensions();
      });
      this.addHook("afterColumnResize", function() {
        _this3.refreshDimensions();
        _this3.focus();
      });
      this.addHook("afterRowResize", function() {
        _this3.refreshDimensions();
        _this3.focus();
      });
    }
  }, {
    key: "allowKeyEventPropagation",
    value: function allowKeyEventPropagation() {
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventManager.destroy();
      this.clearHooks();
    }
  }, {
    key: "registerShortcuts",
    value: function registerShortcuts() {
      var _this4 = this;
      var shortcutManager = this.hot.getShortcutManager();
      var editorContext = shortcutManager.getContext("editor");
      var contextConfig = {
        runOnlyIf: function runOnlyIf() {
          return isDefined(_this4.hot.getSelected());
        },
        group: SHORTCUTS_GROUP$1
      };
      var insertNewLine = function insertNewLine2() {
        _this4.hot.rootDocument.execCommand("insertText", false, "\n");
      };
      editorContext.addShortcuts([{
        keys: [["Tab"]],
        callback: function callback(event) {
          var tableMeta = _this4.hot.getSettings();
          var tabMoves = typeof tableMeta.tabMoves === "function" ? tableMeta.tabMoves(event) : tableMeta.tabMoves;
          _this4.hot.selection.transformStart(tabMoves.row, tabMoves.col, true);
        }
      }, {
        keys: [["Shift", "Tab"]],
        callback: function callback(event) {
          var tableMeta = _this4.hot.getSettings();
          var tabMoves = typeof tableMeta.tabMoves === "function" ? tableMeta.tabMoves(event) : tableMeta.tabMoves;
          _this4.hot.selection.transformStart(-tabMoves.row, -tabMoves.col);
        }
      }, {
        keys: [["Control", "Enter"]],
        callback: function callback() {
          insertNewLine();
          return false;
        },
        runOnlyIf: function runOnlyIf(event) {
          return !_this4.hot.selection.isMultiple() && !event.altKey;
        },
        relativeToGroup: SHORTCUTS_GROUP_EDITOR,
        position: "before"
      }, {
        keys: [["Meta", "Enter"]],
        callback: function callback() {
          insertNewLine();
          return false;
        },
        runOnlyIf: function runOnlyIf() {
          return !_this4.hot.selection.isMultiple();
        },
        relativeToGroup: SHORTCUTS_GROUP_EDITOR,
        position: "before"
      }, {
        keys: [["Alt", "Enter"]],
        callback: function callback() {
          insertNewLine();
          return false;
        },
        relativeToGroup: SHORTCUTS_GROUP_EDITOR,
        position: "before"
      }, {
        keys: [["PageUp"]],
        callback: function callback() {
          _this4.hot.selection.transformStart(-_this4.hot.countVisibleRows(), 0);
        }
      }, {
        keys: [["PageDown"]],
        callback: function callback() {
          _this4.hot.selection.transformStart(_this4.hot.countVisibleRows(), 0);
        }
      }, {
        keys: [["Home"]],
        callback: function callback(event, _ref) {
          var _ref2 = _slicedToArray$e(_ref, 1), keyName = _ref2[0];
          updateCaretPosition(keyName, _this4.TEXTAREA);
        }
      }, {
        keys: [["End"]],
        callback: function callback(event, _ref3) {
          var _ref4 = _slicedToArray$e(_ref3, 1), keyName = _ref4[0];
          updateCaretPosition(keyName, _this4.TEXTAREA);
        }
      }, {
        keys: [["Control/Meta", "Z"]],
        preventDefault: false,
        callback: function callback() {
          _this4.hot._registerTimeout(function() {
            _this4.autoResize.resize();
          }, 10);
        }
      }, {
        keys: [["Control/Meta", "Shift", "Z"]],
        preventDefault: false,
        callback: function callback() {
          _this4.hot._registerTimeout(function() {
            _this4.autoResize.resize();
          }, 10);
        }
      }], contextConfig);
    }
  }, {
    key: "unregisterShortcuts",
    value: function unregisterShortcuts() {
      var shortcutManager = this.hot.getShortcutManager();
      var editorContext = shortcutManager.getContext("editor");
      editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP_NAVIGATION);
      editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP$1);
      editorContext.removeShortcutsByGroup(SHORTCUTS_GROUP_EDITOR$1);
    }
  }, {
    key: "onAfterDocumentKeyDown",
    value: function onAfterDocumentKeyDown(event) {
      var arrowKeyCodes = [KEY_CODES.ARROW_UP, KEY_CODES.ARROW_RIGHT, KEY_CODES.ARROW_DOWN, KEY_CODES.ARROW_LEFT];
      if (arrowKeyCodes.indexOf(event.keyCode) === -1) {
        this.autoResize.resize(String.fromCharCode(event.keyCode));
      }
    }
  }], [{
    key: "EDITOR_TYPE",
    get: function get() {
      return EDITOR_TYPE$1;
    }
  }]);
  return TextEditor2;
}(BaseEditor);

var RENDERER_TYPE = "base";
function baseRenderer(instance, TD, row, col, prop, value, cellProperties) {
  var classesToAdd = [];
  var classesToRemove = [];
  if (cellProperties.className) {
    addClass(TD, cellProperties.className);
  }
  if (cellProperties.readOnly) {
    classesToAdd.push(cellProperties.readOnlyCellClassName);
  }
  if (cellProperties.valid === false && cellProperties.invalidCellClassName) {
    classesToAdd.push(cellProperties.invalidCellClassName);
  } else {
    classesToRemove.push(cellProperties.invalidCellClassName);
  }
  if (cellProperties.wordWrap === false && cellProperties.noWordWrapClassName) {
    classesToAdd.push(cellProperties.noWordWrapClassName);
  }
  if (!value && cellProperties.placeholder) {
    classesToAdd.push(cellProperties.placeholderCellClassName);
  }
  removeClass(TD, classesToRemove);
  addClass(TD, classesToAdd);
}
baseRenderer.RENDERER_TYPE = RENDERER_TYPE;

var RENDERER_TYPE$1 = "text";
function textRenderer(instance, TD, row, col, prop, value, cellProperties) {
  baseRenderer.apply(this, [instance, TD, row, col, prop, value, cellProperties]);
  var escaped = value;
  if (!escaped && cellProperties.placeholder) {
    escaped = cellProperties.placeholder;
  }
  escaped = stringify(escaped);
  if (instance.getSettings().trimWhitespace) {
    escaped = escaped.trim();
  }
  if (cellProperties.rendererTemplate) {
    empty(TD);
    var TEMPLATE = instance.rootDocument.createElement("TEMPLATE");
    TEMPLATE.setAttribute("bind", "{{}}");
    TEMPLATE.innerHTML = cellProperties.rendererTemplate;
    HTMLTemplateElement.decorate(TEMPLATE);
    TEMPLATE.model = instance.getSourceDataAtRow(row);
    TD.appendChild(TEMPLATE);
  } else {
    fastInnerText(TD, escaped);
  }
}
textRenderer.RENDERER_TYPE = RENDERER_TYPE$1;

var CELL_TYPE$1 = "text";
var TextCellType = {
  CELL_TYPE: CELL_TYPE$1,
  editor: TextEditor,
  renderer: textRenderer
};

export { _getEditorInstance as $, getTrimmingContainer as A, BaseEditor as B, Core as C, arrayMap as D, stripTags as E, isPrintableChar as F, hasClass as G, Hooks as H, EventManager as I, isFunctionKey as J, KEY_CODES as K, deepExtend as L, empty as M, removeClass as N, objectEach as O, fastInnerHTML as P, EDITOR_STATE as Q, _register as R, SHORTCUTS_GROUP_NAVIGATION as S, TextCellType as T, baseRenderer as U, isEmpty as V, SHORTCUTS_GROUP_EDITOR as W, isNumeric as X, rangeEach as Y, _register$1 as Z, _register$3 as _, getLanguagesDictionaries as a, CONTEXTMENU_ITEMS_UNDO as a$, _register$2 as a0, defineGetter as a1, getPluginsNames as a2, arrayEach as a3, hasPlugin as a4, hasItem$3 as a5, hasItem as a6, hasItem$1 as a7, hasItem$2 as a8, isObject as a9, closest as aA, deepClone as aB, isChildOf as aC, CONTEXTMENU_ITEMS_EDIT_COMMENT as aD, CONTEXTMENU_ITEMS_ADD_COMMENT as aE, CONTEXTMENU_ITEMS_REMOVE_COMMENT as aF, CONTEXTMENU_ITEMS_READ_ONLY_COMMENT as aG, CONTEXTMENU_ITEMS_ALIGNMENT as aH, CONTEXTMENU_ITEMS_ALIGNMENT_LEFT as aI, CONTEXTMENU_ITEMS_ALIGNMENT_CENTER as aJ, CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT as aK, CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY as aL, CONTEXTMENU_ITEMS_ALIGNMENT_TOP as aM, CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE as aN, CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM as aO, CONTEXTMENU_ITEMS_CLEAR_COLUMN as aP, CONTEXTMENU_ITEMS_INSERT_LEFT as aQ, CONTEXTMENU_ITEMS_INSERT_RIGHT as aR, CONTEXTMENU_ITEMS_READ_ONLY as aS, CONTEXTMENU_ITEMS_REDO as aT, CONTEXTMENU_ITEMS_REMOVE_COLUMN as aU, transformSelectionToColumnDistance as aV, CONTEXTMENU_ITEMS_REMOVE_ROW as aW, transformSelectionToRowDistance as aX, CONTEXTMENU_ITEMS_ROW_ABOVE as aY, CONTEXTMENU_ITEMS_ROW_BELOW as aZ, CONTEXTMENU_ITEMS_NO_ITEMS as a_, PhysicalIndexToValueMap as aa, hasOwnProperty as ab, isPercentValue as ac, valueAccordingPercent as ad, ViewportColumnsCalculator as ae, arrayReduce as af, arrayFilter as ag, cancelAnimationFrame as ah, requestAnimationFrame as ai, isVisible as aj, getIncreasedIndexes as ak, getDecreasedIndexes as al, IndexMap as am, warn as an, arrayUnique as ao, fastInnerText as ap, LinkedPhysicalIndexToValueMap as aq, isRightClick as ar, staticRegister as as, IndexesSequence as at, isUndefined as au, isFunction as av, toSingleLine as aw, mixin as ax, localHooks as ay, debounce as az, registerLanguageDictionary as b, TrimmingMap as b$, getWindowScrollTop as b0, getWindowScrollLeft as b1, getParentWindow as b2, isWindowsOS as b3, isMobileBrowser as b4, isIpadOS as b5, isInput as b6, CONTEXTMENU_ITEMS_COPY as b7, CONTEXTMENU_ITEMS_CUT as b8, selectElementIfAllowed as b9, FILTERS_CONDITIONS_BEFORE as bA, FILTERS_CONDITIONS_BETWEEN as bB, FILTERS_CONDITIONS_NOT_BETWEEN as bC, FILTERS_CONDITIONS_BEGINS_WITH as bD, FILTERS_CONDITIONS_ENDS_WITH as bE, FILTERS_CONDITIONS_CONTAINS as bF, FILTERS_CONDITIONS_NOT_CONTAIN as bG, FILTERS_CONDITIONS_TOMORROW as bH, FILTERS_CONDITIONS_TODAY as bI, FILTERS_CONDITIONS_YESTERDAY as bJ, getComparisonFunction as bK, FILTERS_LABELS_CONJUNCTION as bL, FILTERS_LABELS_DISJUNCTION as bM, FILTERS_NAMESPACE as bN, FILTERS_BUTTONS_PLACEHOLDER_VALUE as bO, FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE as bP, FILTERS_CONDITIONS_NAMESPACE as bQ, isKey as bR, FILTERS_BUTTONS_PLACEHOLDER_SEARCH as bS, FILTERS_BUTTONS_SELECT_ALL as bT, FILTERS_BUTTONS_CLEAR as bU, partial as bV, dataRowToChangesArray as bW, FILTERS_VALUES_BLANK_CELLS as bX, FILTERS_BUTTONS_OK as bY, FILTERS_BUTTONS_CANCEL as bZ, curry as b_, stringify$1 as ba, _dataToHTML as bb, sanitize as bc, htmlToGridSettings as bd, parse as be, getSelectionText as bf, CONTEXTMENU_ITEMS_BORDERS_BOTTOM as bg, CONTEXTMENU_ITEMS_BORDERS_LEFT as bh, CONTEXTMENU_ITEMS_REMOVE_BORDERS as bi, CONTEXTMENU_ITEMS_BORDERS_RIGHT as bj, CONTEXTMENU_ITEMS_BORDERS_TOP as bk, detectSelectionType as bl, normalizeSelectionFactory as bm, CONTEXTMENU_ITEMS_BORDERS as bn, clone as bo, substitute as bp, FILTERS_CONDITIONS_NONE as bq, FILTERS_CONDITIONS_EMPTY as br, FILTERS_CONDITIONS_NOT_EMPTY as bs, FILTERS_CONDITIONS_EQUAL as bt, FILTERS_CONDITIONS_NOT_EQUAL as bu, FILTERS_CONDITIONS_GREATER_THAN as bv, FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL as bw, FILTERS_CONDITIONS_LESS_THAN as bx, FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL as by, FILTERS_CONDITIONS_AFTER as bz, getTranslatedPhrase as c, FILTERS_DIVS_FILTER_BY_CONDITION as c0, FILTERS_DIVS_FILTER_BY_VALUE as c1, isArrayOfArrays as c2, error as c3, toUpperCaseFirst as c4, CONTEXTMENU_ITEMS_HIDE_COLUMN as c5, CONTEXTMENU_ITEMS_SHOW_COLUMN as c6, HidingMap as c7, CONTEXTMENU_ITEMS_HIDE_ROW as c8, CONTEXTMENU_ITEMS_SHOW_ROW as c9, CONTEXTMENU_ITEMS_FREEZE_COLUMN as ca, CONTEXTMENU_ITEMS_UNFREEZE_COLUMN as cb, isDetached as cc, ViewportRowsCalculator as cd, rangeEachReverse as ce, CONTEXTMENU_ITEMS_UNMERGE_CELLS as cf, CONTEXTMENU_ITEMS_MERGE_CELLS as cg, HEADER_TYPE as ch, ACTIVE_HEADER_TYPE as ci, isLeftClick as cj, CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD as ck, CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD as cl, isArrayOfObjects as cm, isTouchSupported as cn, inherit as co, registerPlugin as cp, dictionaryKeys as d, getListWithInsertedItems$1 as e, getListWithRemovedItems$1 as f, getLanguageDictionary as g, getListWithInsertedItems as h, getListWithRemovedItems as i, extend as j, TextEditor as k, stopImmediatePropagation as l, metaSchemaFactory as m, isDefined as n, addClass as o, getScrollbarWidth as p, outerWidth as q, rootInstanceSymbol as r, setCaretPosition as s, textRenderer as t, stringify as u, getCaretPosition as v, getSelectionEndPosition as w, pivot as x, offset as y, outerHeight as z };
