import './es.function.name-c5ad53e4.js';

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
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
    return _toConsumableArray(subCollection.keys());
  }
  function getValues() {
    return _toConsumableArray(subCollection.values());
  }
  return {
    register,
    getItem,
    hasItem,
    getNames,
    getValues
  };
}

var _staticRegister = staticRegister("renderers"), register = _staticRegister.register, getItem = _staticRegister.getItem, hasItem = _staticRegister.hasItem;
function _getItem(name) {
  if (typeof name === "function") {
    return name;
  }
  if (!hasItem(name)) {
    throw Error('No registered renderer found under "'.concat(name, '" name'));
  }
  return getItem(name);
}
function _register(name, renderer) {
  if (typeof name !== "string") {
    renderer = name;
    name = renderer.RENDERER_TYPE;
  }
  register(name, renderer);
}

export { _register as _, _getItem as a, hasItem as h, staticRegister as s };
