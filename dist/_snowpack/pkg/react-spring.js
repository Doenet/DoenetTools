import { r as react } from './common/index-ecd9f9fe.js';
import { r as reactDom } from './common/index-adccaeb8.js';
import './common/_commonjsHelpers-16be0a9e.js';

let updateQueue = makeQueue();
const raf = (fn) => schedule(fn, updateQueue);
let writeQueue = makeQueue();
raf.write = (fn) => schedule(fn, writeQueue);
let onStartQueue = makeQueue();
raf.onStart = (fn) => schedule(fn, onStartQueue);
let onFrameQueue = makeQueue();
raf.onFrame = (fn) => schedule(fn, onFrameQueue);
let onFinishQueue = makeQueue();
raf.onFinish = (fn) => schedule(fn, onFinishQueue);
let timeouts = [];
raf.setTimeout = (handler, ms) => {
  let time = raf.now() + ms;
  let cancel = () => {
    let i = timeouts.findIndex((t) => t.cancel == cancel);
    if (~i)
      timeouts.splice(i, 1);
    __raf.count -= ~i ? 1 : 0;
  };
  let timeout = {time, handler, cancel};
  timeouts.splice(findTimeout(time), 0, timeout);
  __raf.count += 1;
  start();
  return timeout;
};
let findTimeout = (time) => ~(~timeouts.findIndex((t) => t.time > time) || ~timeouts.length);
raf.cancel = (fn) => {
  updateQueue.delete(fn);
  writeQueue.delete(fn);
};
raf.sync = (fn) => {
  sync = true;
  raf.batchedUpdates(fn);
  sync = false;
};
raf.throttle = (fn) => {
  let lastArgs;
  function queuedFn() {
    try {
      fn(...lastArgs);
    } finally {
      lastArgs = null;
    }
  }
  function throttled(...args) {
    lastArgs = args;
    raf.onStart(queuedFn);
  }
  throttled.handler = fn;
  throttled.cancel = () => {
    onStartQueue.delete(queuedFn);
    lastArgs = null;
  };
  return throttled;
};
let nativeRaf = typeof window != "undefined" ? window.requestAnimationFrame : () => {
};
raf.use = (impl) => nativeRaf = impl;
raf.now = typeof performance != "undefined" ? () => performance.now() : Date.now;
raf.batchedUpdates = (fn) => fn();
raf.catch = console.error;
let ts = -1;
let sync = false;
function schedule(fn, queue) {
  if (sync) {
    queue.delete(fn);
    fn(0);
  } else {
    queue.add(fn);
    start();
  }
}
function start() {
  if (ts < 0) {
    ts = 0;
    nativeRaf(loop);
  }
}
function loop() {
  if (~ts) {
    nativeRaf(loop);
    raf.batchedUpdates(update);
  }
}
function update() {
  let prevTs = ts;
  ts = raf.now();
  let count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t) => t.handler());
    __raf.count -= count;
  }
  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
}
function makeQueue() {
  let next = new Set();
  let current = next;
  return {
    add(fn) {
      __raf.count += current == next && !next.has(fn) ? 1 : 0;
      next.add(fn);
    },
    delete(fn) {
      __raf.count -= current == next && next.has(fn) ? 1 : 0;
      return next.delete(fn);
    },
    flush(arg) {
      if (current.size) {
        next = new Set();
        __raf.count -= current.size;
        eachSafely(current, (fn) => fn(arg) && next.add(fn));
        __raf.count += next.size;
        current = next;
      }
    }
  };
}
function eachSafely(values, each) {
  values.forEach((value) => {
    try {
      each(value);
    } catch (e) {
      raf.catch(e);
    }
  });
}
const __raf = {
  count: 0,
  clear() {
    ts = -1;
    timeouts = [];
    onStartQueue = makeQueue();
    updateQueue = makeQueue();
    onFrameQueue = makeQueue();
    writeQueue = makeQueue();
    onFinishQueue = makeQueue();
    __raf.count = 0;
  }
};

function noop() {
}
const defineHidden = (obj, key, value) => Object.defineProperty(obj, key, {value, writable: true, configurable: true});
const is = {
  arr: Array.isArray,
  obj: (a) => !!a && a.constructor.name === "Object",
  fun: (a) => typeof a === "function",
  str: (a) => typeof a === "string",
  num: (a) => typeof a === "number",
  und: (a) => a === void 0
};
function isEqual(a, b) {
  if (is.arr(a)) {
    if (!is.arr(b) || a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  }
  return a === b;
}
const each = (obj, fn) => obj.forEach(fn);
function eachProp(obj, fn, ctx) {
  for (const key in obj) {
    fn.call(ctx, obj[key], key);
  }
}
const toArray = (a) => is.und(a) ? [] : is.arr(a) ? a : [a];
function flush(queue, iterator) {
  if (queue.size) {
    const items = Array.from(queue);
    queue.clear();
    each(items, iterator);
  }
}
const flushCalls = (queue, ...args) => flush(queue, (fn) => fn(...args));

let createStringInterpolator;
let to;
let colors = null;
let skipAnimation = false;
let willAdvance = noop;
const assign = (globals) => {
  if (globals.to)
    to = globals.to;
  if (globals.now)
    raf.now = globals.now;
  if (globals.colors !== void 0)
    colors = globals.colors;
  if (globals.skipAnimation != null)
    skipAnimation = globals.skipAnimation;
  if (globals.createStringInterpolator)
    createStringInterpolator = globals.createStringInterpolator;
  if (globals.requestAnimationFrame)
    raf.use(globals.requestAnimationFrame);
  if (globals.batchedUpdates)
    raf.batchedUpdates = globals.batchedUpdates;
  if (globals.willAdvance)
    willAdvance = globals.willAdvance;
};

var globals = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get createStringInterpolator () { return createStringInterpolator; },
  get to () { return to; },
  get colors () { return colors; },
  get skipAnimation () { return skipAnimation; },
  get willAdvance () { return willAdvance; },
  assign: assign
});

const startQueue = new Set();
let currentFrame = [];
let prevFrame = [];
let priority = 0;
const frameLoop = {
  get idle() {
    return !startQueue.size && !currentFrame.length;
  },
  start(animation) {
    if (priority > animation.priority) {
      startQueue.add(animation);
      raf.onStart(flushStartQueue);
    } else {
      startSafely(animation);
      raf(advance);
    }
  },
  advance,
  sort(animation) {
    if (priority) {
      raf.onFrame(() => frameLoop.sort(animation));
    } else {
      const prevIndex = currentFrame.indexOf(animation);
      if (~prevIndex) {
        currentFrame.splice(prevIndex, 1);
        startUnsafely(animation);
      }
    }
  },
  clear() {
    currentFrame = [];
    startQueue.clear();
  }
};
function flushStartQueue() {
  startQueue.forEach(startSafely);
  startQueue.clear();
  raf(advance);
}
function startSafely(animation) {
  if (!currentFrame.includes(animation))
    startUnsafely(animation);
}
function startUnsafely(animation) {
  currentFrame.splice(findIndex(currentFrame, (other) => other.priority > animation.priority), 0, animation);
}
function advance(dt) {
  const nextFrame = prevFrame;
  for (let i = 0; i < currentFrame.length; i++) {
    const animation = currentFrame[i];
    priority = animation.priority;
    if (!animation.idle) {
      willAdvance(animation);
      animation.advance(dt);
      if (!animation.idle) {
        nextFrame.push(animation);
      }
    }
  }
  priority = 0;
  prevFrame = currentFrame;
  prevFrame.length = 0;
  currentFrame = nextFrame;
  return currentFrame.length > 0;
}
function findIndex(arr, test) {
  const index = arr.findIndex(test);
  return index < 0 ? arr.length : index;
}

const colors$1 = {
  transparent: 0,
  aliceblue: 4042850303,
  antiquewhite: 4209760255,
  aqua: 16777215,
  aquamarine: 2147472639,
  azure: 4043309055,
  beige: 4126530815,
  bisque: 4293182719,
  black: 255,
  blanchedalmond: 4293643775,
  blue: 65535,
  blueviolet: 2318131967,
  brown: 2771004159,
  burlywood: 3736635391,
  burntsienna: 3934150143,
  cadetblue: 1604231423,
  chartreuse: 2147418367,
  chocolate: 3530104575,
  coral: 4286533887,
  cornflowerblue: 1687547391,
  cornsilk: 4294499583,
  crimson: 3692313855,
  cyan: 16777215,
  darkblue: 35839,
  darkcyan: 9145343,
  darkgoldenrod: 3095792639,
  darkgray: 2846468607,
  darkgreen: 6553855,
  darkgrey: 2846468607,
  darkkhaki: 3182914559,
  darkmagenta: 2332068863,
  darkolivegreen: 1433087999,
  darkorange: 4287365375,
  darkorchid: 2570243327,
  darkred: 2332033279,
  darksalmon: 3918953215,
  darkseagreen: 2411499519,
  darkslateblue: 1211993087,
  darkslategray: 793726975,
  darkslategrey: 793726975,
  darkturquoise: 13554175,
  darkviolet: 2483082239,
  deeppink: 4279538687,
  deepskyblue: 12582911,
  dimgray: 1768516095,
  dimgrey: 1768516095,
  dodgerblue: 512819199,
  firebrick: 2988581631,
  floralwhite: 4294635775,
  forestgreen: 579543807,
  fuchsia: 4278255615,
  gainsboro: 3705462015,
  ghostwhite: 4177068031,
  gold: 4292280575,
  goldenrod: 3668254975,
  gray: 2155905279,
  green: 8388863,
  greenyellow: 2919182335,
  grey: 2155905279,
  honeydew: 4043305215,
  hotpink: 4285117695,
  indianred: 3445382399,
  indigo: 1258324735,
  ivory: 4294963455,
  khaki: 4041641215,
  lavender: 3873897215,
  lavenderblush: 4293981695,
  lawngreen: 2096890111,
  lemonchiffon: 4294626815,
  lightblue: 2916673279,
  lightcoral: 4034953471,
  lightcyan: 3774873599,
  lightgoldenrodyellow: 4210742015,
  lightgray: 3553874943,
  lightgreen: 2431553791,
  lightgrey: 3553874943,
  lightpink: 4290167295,
  lightsalmon: 4288707327,
  lightseagreen: 548580095,
  lightskyblue: 2278488831,
  lightslategray: 2005441023,
  lightslategrey: 2005441023,
  lightsteelblue: 2965692159,
  lightyellow: 4294959359,
  lime: 16711935,
  limegreen: 852308735,
  linen: 4210091775,
  magenta: 4278255615,
  maroon: 2147483903,
  mediumaquamarine: 1724754687,
  mediumblue: 52735,
  mediumorchid: 3126187007,
  mediumpurple: 2473647103,
  mediumseagreen: 1018393087,
  mediumslateblue: 2070474495,
  mediumspringgreen: 16423679,
  mediumturquoise: 1221709055,
  mediumvioletred: 3340076543,
  midnightblue: 421097727,
  mintcream: 4127193855,
  mistyrose: 4293190143,
  moccasin: 4293178879,
  navajowhite: 4292783615,
  navy: 33023,
  oldlace: 4260751103,
  olive: 2155872511,
  olivedrab: 1804477439,
  orange: 4289003775,
  orangered: 4282712319,
  orchid: 3664828159,
  palegoldenrod: 4008225535,
  palegreen: 2566625535,
  paleturquoise: 2951671551,
  palevioletred: 3681588223,
  papayawhip: 4293907967,
  peachpuff: 4292524543,
  peru: 3448061951,
  pink: 4290825215,
  plum: 3718307327,
  powderblue: 2967529215,
  purple: 2147516671,
  rebeccapurple: 1714657791,
  red: 4278190335,
  rosybrown: 3163525119,
  royalblue: 1097458175,
  saddlebrown: 2336560127,
  salmon: 4202722047,
  sandybrown: 4104413439,
  seagreen: 780883967,
  seashell: 4294307583,
  sienna: 2689740287,
  silver: 3233857791,
  skyblue: 2278484991,
  slateblue: 1784335871,
  slategray: 1887473919,
  slategrey: 1887473919,
  snow: 4294638335,
  springgreen: 16744447,
  steelblue: 1182971135,
  tan: 3535047935,
  teal: 8421631,
  thistle: 3636451583,
  tomato: 4284696575,
  turquoise: 1088475391,
  violet: 4001558271,
  wheat: 4125012991,
  white: 4294967295,
  whitesmoke: 4126537215,
  yellow: 4294902015,
  yellowgreen: 2597139199
};

const NUMBER = "[-+]?\\d*\\.?\\d+";
const PERCENTAGE = NUMBER + "%";
function call(...parts) {
  return "\\(\\s*(" + parts.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const rgb = new RegExp("rgb" + call(NUMBER, NUMBER, NUMBER));
const rgba = new RegExp("rgba" + call(NUMBER, NUMBER, NUMBER, NUMBER));
const hsl = new RegExp("hsl" + call(NUMBER, PERCENTAGE, PERCENTAGE));
const hsla = new RegExp("hsla" + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
const hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
const hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
const hex6 = /^#([0-9a-fA-F]{6})$/;
const hex8 = /^#([0-9a-fA-F]{8})$/;

function normalizeColor(color) {
  let match;
  if (typeof color === "number") {
    return color >>> 0 === color && color >= 0 && color <= 4294967295 ? color : null;
  }
  if (match = hex6.exec(color))
    return parseInt(match[1] + "ff", 16) >>> 0;
  if (colors && colors[color] !== void 0) {
    return colors[color];
  }
  if (match = rgb.exec(color)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | 255) >>> 0;
  }
  if (match = rgba.exec(color)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | parse1(match[4])) >>> 0;
  }
  if (match = hex3.exec(color)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + "ff", 16) >>> 0;
  }
  if (match = hex8.exec(color))
    return parseInt(match[1], 16) >>> 0;
  if (match = hex4.exec(color)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + match[4] + match[4], 16) >>> 0;
  }
  if (match = hsl.exec(color)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | 255) >>> 0;
  }
  if (match = hsla.exec(color)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | parse1(match[4])) >>> 0;
  }
  return null;
}
function hue2rgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslToRgb(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
}
function parse255(str) {
  const int = parseInt(str, 10);
  if (int < 0)
    return 0;
  if (int > 255)
    return 255;
  return int;
}
function parse360(str) {
  const int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}
function parse1(str) {
  const num = parseFloat(str);
  if (num < 0)
    return 0;
  if (num > 1)
    return 255;
  return Math.round(num * 255);
}
function parsePercentage(str) {
  const int = parseFloat(str);
  if (int < 0)
    return 0;
  if (int > 100)
    return 1;
  return int / 100;
}

function colorToRgba(input) {
  let int32Color = normalizeColor(input);
  if (int32Color === null)
    return input;
  int32Color = int32Color || 0;
  let r = (int32Color & 4278190080) >>> 24;
  let g = (int32Color & 16711680) >>> 16;
  let b = (int32Color & 65280) >>> 8;
  let a = (int32Color & 255) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const createInterpolator = (range, output, extrapolate) => {
  if (is.fun(range)) {
    return range;
  }
  if (is.arr(range)) {
    return createInterpolator({
      range,
      output,
      extrapolate
    });
  }
  if (is.str(range.output[0])) {
    return createStringInterpolator(range);
  }
  const config = range;
  const outputRange = config.output;
  const inputRange = config.range || [0, 1];
  const extrapolateLeft = config.extrapolateLeft || config.extrapolate || "extend";
  const extrapolateRight = config.extrapolateRight || config.extrapolate || "extend";
  const easing = config.easing || ((t) => t);
  return (input) => {
    const range2 = findRange(input, inputRange);
    return interpolate(input, inputRange[range2], inputRange[range2 + 1], outputRange[range2], outputRange[range2 + 1], easing, extrapolateLeft, extrapolateRight, config.map);
  };
};
function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
  let result = map ? map(input) : input;
  if (result < inputMin) {
    if (extrapolateLeft === "identity")
      return result;
    else if (extrapolateLeft === "clamp")
      result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity")
      return result;
    else if (extrapolateRight === "clamp")
      result = inputMax;
  }
  if (outputMin === outputMax)
    return outputMin;
  if (inputMin === inputMax)
    return input <= inputMin ? outputMin : outputMax;
  if (inputMin === -Infinity)
    result = -result;
  else if (inputMax === Infinity)
    result = result - inputMin;
  else
    result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  if (outputMin === -Infinity)
    result = -result;
  else if (outputMax === Infinity)
    result = result + outputMin;
  else
    result = result * (outputMax - outputMin) + outputMin;
  return result;
}
function findRange(input, inputRange) {
  for (var i = 1; i < inputRange.length - 1; ++i)
    if (inputRange[i] >= input)
      break;
  return i - 1;
}

const $get = Symbol.for("FluidValue.get");
const $observers = Symbol.for("FluidValue.observers");
const hasFluidValue = (arg) => Boolean(arg && arg[$get]);
const getFluidValue = (arg) => arg && arg[$get] ? arg[$get]() : arg;
const getFluidObservers = (target) => target[$observers] || null;
function callFluidObserver(observer, event) {
  if (observer.eventObserved) {
    observer.eventObserved(event);
  } else {
    observer(event);
  }
}
function callFluidObservers(target, event) {
  let observers = target[$observers];
  if (observers) {
    observers.forEach((observer) => {
      callFluidObserver(observer, event);
    });
  }
}
class FluidValue {
  constructor(get) {
    if (!get && !(get = this.get)) {
      throw Error("Unknown getter");
    }
    setFluidGetter(this, get);
  }
}
const setFluidGetter = (target, get) => setHidden(target, $get, get);
function addFluidObserver(target, observer) {
  if (target[$get]) {
    let observers = target[$observers];
    if (!observers) {
      setHidden(target, $observers, observers = new Set());
    }
    if (!observers.has(observer)) {
      observers.add(observer);
      if (target.observerAdded) {
        target.observerAdded(observers.size, observer);
      }
    }
  }
  return observer;
}
function removeFluidObserver(target, observer) {
  let observers = target[$observers];
  if (observers && observers.has(observer)) {
    const count = observers.size - 1;
    if (count) {
      observers.delete(observer);
    } else {
      target[$observers] = null;
    }
    if (target.observerRemoved) {
      target.observerRemoved(count, observer);
    }
  }
}
const setHidden = (target, key, value) => Object.defineProperty(target, key, {
  value,
  writable: true,
  configurable: true
});

const numberRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
const colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
let namedColorRegex;
const rgbaRegex = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi;
const rgbaRound = (_, p1, p2, p3, p4) => `rgba(${Math.round(p1)}, ${Math.round(p2)}, ${Math.round(p3)}, ${p4})`;
const createStringInterpolator$1 = (config) => {
  if (!namedColorRegex)
    namedColorRegex = colors ? new RegExp(`(${Object.keys(colors).join("|")})`, "g") : /^\b$/;
  const output = config.output.map((value) => getFluidValue(value).replace(colorRegex, colorToRgba).replace(namedColorRegex, colorToRgba));
  const keyframes = output.map((value) => value.match(numberRegex).map(Number));
  const outputRanges = keyframes[0].map((_, i) => keyframes.map((values) => {
    if (!(i in values)) {
      throw Error('The arity of each "output" value must be equal');
    }
    return values[i];
  }));
  const interpolators = outputRanges.map((output2) => createInterpolator({...config, output: output2}));
  return (input) => {
    let i = 0;
    return output[0].replace(numberRegex, () => String(interpolators[i++](input))).replace(rgbaRegex, rgbaRound);
  };
};

const prefix = "react-spring: ";
const once = (fn) => {
  const func = fn;
  let called = false;
  if (typeof func != "function") {
    throw new TypeError(`${prefix}once requires a function parameter`);
  }
  return (...args) => {
    if (!called) {
      func(...args);
      called = true;
    }
  };
};
const warnInterpolate = once(console.warn);
function deprecateInterpolate() {
  warnInterpolate(`${prefix}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const warnDirectCall = once(console.warn);
function deprecateDirectCall() {
  warnDirectCall(`${prefix}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead)`);
}

function isAnimatedString(value) {
  return is.str(value) && (value[0] == "#" || /\d/.test(value) || value in (colors || {}));
}

const useOnce = (effect) => react.useEffect(effect, emptyDeps);
const emptyDeps = [];

function useForceUpdate() {
  const update = react.useState()[1];
  const mounted = react.useState(makeMountedRef)[0];
  useOnce(mounted.unmount);
  return () => {
    if (mounted.current) {
      update({});
    }
  };
}
function makeMountedRef() {
  const mounted = {
    current: true,
    unmount: () => () => {
      mounted.current = false;
    }
  };
  return mounted;
}

function useMemoOne(getResult, inputs) {
  const [initial] = react.useState(() => ({
    inputs,
    result: getResult()
  }));
  const committed = react.useRef();
  const prevCache = committed.current;
  let cache = prevCache;
  if (cache) {
    const useCache = Boolean(inputs && cache.inputs && areInputsEqual(inputs, cache.inputs));
    if (!useCache) {
      cache = {
        inputs,
        result: getResult()
      };
    }
  } else {
    cache = initial;
  }
  react.useEffect(() => {
    committed.current = cache;
    if (prevCache == initial) {
      initial.inputs = initial.result = void 0;
    }
  }, [cache]);
  return cache.result;
}
function areInputsEqual(next, prev) {
  if (next.length !== prev.length) {
    return false;
  }
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== prev[i]) {
      return false;
    }
  }
  return true;
}

function usePrev(value) {
  const prevRef = react.useRef();
  react.useEffect(() => {
    prevRef.current = value;
  });
  return prevRef.current;
}

const useLayoutEffect = typeof window !== "undefined" && window.document && window.document.createElement ? react.useLayoutEffect : react.useEffect;

const $node = Symbol.for("Animated:node");
const isAnimated = (value) => !!value && value[$node] === value;
const getAnimated = (owner) => owner && owner[$node];
const setAnimated = (owner, node) => defineHidden(owner, $node, node);
const getPayload = (owner) => owner && owner[$node] && owner[$node].getPayload();
class Animated {
  constructor() {
    setAnimated(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}

class AnimatedValue extends Animated {
  constructor(_value) {
    super();
    this._value = _value;
    this.done = true;
    this.durationProgress = 0;
    if (is.num(this._value)) {
      this.lastPosition = this._value;
    }
  }
  static create(value) {
    return new AnimatedValue(value);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(value, step) {
    if (is.num(value)) {
      this.lastPosition = value;
      if (step) {
        value = Math.round(value / step) * step;
        if (this.done) {
          this.lastPosition = value;
        }
      }
    }
    if (this._value === value) {
      return false;
    }
    this._value = value;
    return true;
  }
  reset() {
    const {done} = this;
    this.done = false;
    if (is.num(this._value)) {
      this.elapsedTime = 0;
      this.durationProgress = 0;
      this.lastPosition = this._value;
      if (done)
        this.lastVelocity = null;
      this.v0 = null;
    }
  }
}

class AnimatedString extends AnimatedValue {
  constructor(value) {
    super(0);
    this._string = null;
    this._toString = createInterpolator({
      output: [value, value]
    });
  }
  static create(value) {
    return new AnimatedString(value);
  }
  getValue() {
    let value = this._string;
    return value == null ? this._string = this._toString(this._value) : value;
  }
  setValue(value) {
    if (is.str(value)) {
      if (value == this._string) {
        return false;
      }
      this._string = value;
      this._value = 1;
    } else if (super.setValue(value)) {
      this._string = null;
    } else {
      return false;
    }
    return true;
  }
  reset(goal) {
    if (goal) {
      this._toString = createInterpolator({
        output: [this.getValue(), goal]
      });
    }
    this._value = 0;
    super.reset();
  }
}

const TreeContext = {dependencies: null};

class AnimatedObject extends Animated {
  constructor(source) {
    super();
    this.source = source;
    this.setValue(source);
  }
  getValue(animated) {
    const values = {};
    eachProp(this.source, (source, key) => {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated);
      } else if (hasFluidValue(source)) {
        values[key] = getFluidValue(source);
      } else if (!animated) {
        values[key] = source;
      }
    });
    return values;
  }
  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }
  reset() {
    if (this.payload) {
      each(this.payload, (node) => node.reset());
    }
  }
  _makePayload(source) {
    if (source) {
      const payload = new Set();
      eachProp(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }
  _addToPayload(source) {
    if (TreeContext.dependencies && hasFluidValue(source)) {
      TreeContext.dependencies.add(source);
    }
    const payload = getPayload(source);
    if (payload) {
      each(payload, (node) => this.add(node));
    }
  }
}

class AnimatedArray extends AnimatedObject {
  constructor(source) {
    super(source);
  }
  static create(source) {
    return new AnimatedArray(source);
  }
  getValue() {
    return this.source.map((node) => node.getValue());
  }
  setValue(source) {
    const payload = this.getPayload();
    if (source.length == payload.length) {
      return payload.some((node, i) => node.setValue(source[i]));
    }
    super.setValue(source.map(makeAnimated));
    return true;
  }
}
function makeAnimated(value) {
  const nodeType = isAnimatedString(value) ? AnimatedString : AnimatedValue;
  return nodeType.create(value);
}

function getAnimatedType(value) {
  const parentNode = getAnimated(value);
  return parentNode ? parentNode.constructor : is.arr(value) ? AnimatedArray : isAnimatedString(value) ? AnimatedString : AnimatedValue;
}

const withAnimated = (Component, host) => {
  const hasInstance = !is.fun(Component) || Component.prototype && Component.prototype.isReactComponent;
  return react.forwardRef((givenProps, givenRef) => {
    const instanceRef = react.useRef(null);
    const ref = hasInstance && react.useCallback((value) => {
      instanceRef.current = updateRef(givenRef, value);
    }, [givenRef]);
    const [props, deps] = getAnimatedState(givenProps, host);
    const forceUpdate = useForceUpdate();
    const callback = () => {
      const instance = instanceRef.current;
      if (hasInstance && !instance) {
        return;
      }
      const didUpdate = instance ? host.applyAnimatedValues(instance, props.getValue(true)) : false;
      if (didUpdate === false) {
        forceUpdate();
      }
    };
    const observer = new PropsObserver(callback, deps);
    const observerRef = react.useRef();
    useLayoutEffect(() => {
      const lastObserver = observerRef.current;
      observerRef.current = observer;
      each(deps, (dep) => addFluidObserver(dep, observer));
      if (lastObserver) {
        each(lastObserver.deps, (dep) => removeFluidObserver(dep, lastObserver));
        raf.cancel(lastObserver.update);
      }
    });
    react.useEffect(callback, []);
    useOnce(() => () => {
      const observer2 = observerRef.current;
      each(observer2.deps, (dep) => removeFluidObserver(dep, observer2));
    });
    const usedProps = host.getComponentProps(props.getValue());
    return /* @__PURE__ */ react.createElement(Component, {
      ...usedProps,
      ref
    });
  });
};
class PropsObserver {
  constructor(update, deps) {
    this.update = update;
    this.deps = deps;
  }
  eventObserved(event) {
    if (event.type == "change") {
      raf.write(this.update);
    }
  }
}
function getAnimatedState(props, host) {
  const dependencies = new Set();
  TreeContext.dependencies = dependencies;
  if (props.style)
    props = {
      ...props,
      style: host.createAnimatedStyle(props.style)
    };
  props = new AnimatedObject(props);
  TreeContext.dependencies = null;
  return [props, dependencies];
}
function updateRef(ref, value) {
  if (ref) {
    if (is.fun(ref))
      ref(value);
    else
      ref.current = value;
  }
  return value;
}

const cacheKey = Symbol.for("AnimatedComponent");
const createHost = (components, {
  applyAnimatedValues = () => false,
  createAnimatedStyle = (style) => new AnimatedObject(style),
  getComponentProps = (props) => props
} = {}) => {
  const hostConfig = {
    applyAnimatedValues,
    createAnimatedStyle,
    getComponentProps
  };
  const animated = (Component) => {
    const displayName = getDisplayName(Component) || "Anonymous";
    if (is.str(Component)) {
      Component = animated[Component] || (animated[Component] = withAnimated(Component, hostConfig));
    } else {
      Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
    }
    Component.displayName = `Animated(${displayName})`;
    return Component;
  };
  eachProp(components, (Component, key) => {
    if (is.arr(components)) {
      key = getDisplayName(Component);
    }
    animated[key] = animated(Component);
  });
  return {
    animated
  };
};
const getDisplayName = (arg) => is.str(arg) ? arg : arg && is.str(arg.displayName) ? arg.displayName : is.fun(arg) && arg.name || null;

function callProp(value, ...args) {
  return is.fun(value) ? value(...args) : value;
}
const matchProp = (value, key) => value === true || !!(key && value && (is.fun(value) ? value(key) : toArray(value).includes(key)));
const resolveProp = (prop, key) => is.obj(prop) ? key && prop[key] : prop;
const getDefaultProp = (props, key) => props.default === true ? props[key] : props.default ? props.default[key] : void 0;
const noopTransform = (value) => value;
const getDefaultProps = (props, transform = noopTransform) => {
  let keys = DEFAULT_PROPS;
  if (props.default && props.default !== true) {
    props = props.default;
    keys = Object.keys(props);
  }
  const defaults = {};
  for (const key of keys) {
    const value = transform(props[key], key);
    if (!is.und(value)) {
      defaults[key] = value;
    }
  }
  return defaults;
};
const DEFAULT_PROPS = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest"
];
const RESERVED_PROPS = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,
  keys: 1,
  callId: 1,
  parentId: 1
};
function getForwardProps(props) {
  const forward = {};
  let count = 0;
  eachProp(props, (value, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value;
      count++;
    }
  });
  if (count) {
    return forward;
  }
}
function inferTo(props) {
  const to = getForwardProps(props);
  if (to) {
    const out = {to};
    eachProp(props, (val, key) => key in to || (out[key] = val));
    return out;
  }
  return {...props};
}
function computeGoal(value) {
  value = getFluidValue(value);
  return is.arr(value) ? value.map(computeGoal) : isAnimatedString(value) ? globals.createStringInterpolator({
    range: [0, 1],
    output: [value, value]
  })(1) : value;
}
function hasProps(props) {
  for (const _ in props)
    return true;
  return false;
}
function isAsyncTo(to) {
  return is.fun(to) || is.arr(to) && is.obj(to[0]);
}
function detachRefs(ctrl, ref) {
  var _a;
  (_a = ctrl.ref) == null ? void 0 : _a.delete(ctrl);
  ref == null ? void 0 : ref.delete(ctrl);
}
function replaceRef(ctrl, ref) {
  var _a;
  if (ref && ctrl.ref !== ref) {
    (_a = ctrl.ref) == null ? void 0 : _a.delete(ctrl);
    ref.add(ctrl);
    ctrl.ref = ref;
  }
}

function useChain(refs, timeSteps, timeFrame = 1e3) {
  useLayoutEffect(() => {
    if (timeSteps) {
      let prevDelay = 0;
      each(refs, (ref, i) => {
        const controllers = ref.current;
        if (controllers.length) {
          let delay = timeFrame * timeSteps[i];
          if (isNaN(delay))
            delay = prevDelay;
          else
            prevDelay = delay;
          each(controllers, (ctrl) => {
            each(ctrl.queue, (props) => {
              const memoizedDelayProp = props.delay;
              props.delay = (key) => delay + callProp(memoizedDelayProp || 0, key);
            });
            ctrl.start();
          });
        }
      });
    } else {
      let p = Promise.resolve();
      each(refs, (ref) => {
        const controllers = ref.current;
        if (controllers.length) {
          const queues = controllers.map((ctrl) => {
            const q = ctrl.queue;
            ctrl.queue = [];
            return q;
          });
          p = p.then(() => {
            each(controllers, (ctrl, i) => each(queues[i] || [], (update) => ctrl.queue.push(update)));
            return ref.start();
          });
        }
      });
    }
  });
}

const config = {
  default: {tension: 170, friction: 26},
  gentle: {tension: 120, friction: 14},
  wobbly: {tension: 180, friction: 12},
  stiff: {tension: 210, friction: 20},
  slow: {tension: 280, friction: 60},
  molasses: {tension: 280, friction: 120}
};

const linear = (t) => t;
const defaults = {
  ...config.default,
  mass: 1,
  damping: 1,
  easing: linear,
  clamp: false
};
class AnimationConfig {
  constructor() {
    this.velocity = 0;
    Object.assign(this, defaults);
  }
}
function mergeConfig(config, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = {...defaultConfig};
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = {...defaultConfig, ...newConfig};
  }
  sanitizeConfig(config, newConfig);
  Object.assign(config, newConfig);
  for (const key in defaults) {
    if (config[key] == null) {
      config[key] = defaults[key];
    }
  }
  let {mass, frequency, damping} = config;
  if (!is.und(frequency)) {
    if (frequency < 0.01)
      frequency = 0.01;
    if (damping < 0)
      damping = 0;
    config.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config.friction = 4 * Math.PI * damping * mass / frequency;
  }
  return config;
}
function sanitizeConfig(config, props) {
  if (!is.und(props.decay)) {
    config.duration = void 0;
  } else {
    const isTensionConfig = !is.und(props.tension) || !is.und(props.friction);
    if (isTensionConfig || !is.und(props.frequency) || !is.und(props.damping) || !is.und(props.mass)) {
      config.duration = void 0;
      config.decay = void 0;
    }
    if (isTensionConfig) {
      config.frequency = void 0;
    }
  }
}

const emptyArray = [];
class Animation {
  constructor() {
    this.changed = false;
    this.values = emptyArray;
    this.toValues = null;
    this.fromValues = emptyArray;
    this.config = new AnimationConfig();
    this.immediate = false;
  }
}

function scheduleProps(callId, {key, props, defaultProps, state, actions}) {
  return new Promise((resolve, reject) => {
    var _a;
    let delay;
    let timeout;
    let cancel = matchProp((_a = props.cancel) != null ? _a : defaultProps == null ? void 0 : defaultProps.cancel, key);
    if (cancel) {
      onStart();
    } else {
      if (!is.und(props.pause)) {
        state.paused = matchProp(props.pause, key);
      }
      let pause = defaultProps == null ? void 0 : defaultProps.pause;
      if (pause !== true) {
        pause = state.paused || matchProp(pause, key);
      }
      delay = callProp(props.delay || 0, key);
      if (pause) {
        state.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }
    function onPause() {
      state.resumeQueue.add(onResume);
      state.timeouts.delete(timeout);
      timeout.cancel();
      delay = timeout.time - raf.now();
    }
    function onResume() {
      if (delay > 0) {
        timeout = raf.setTimeout(onStart, delay);
        state.pauseQueue.add(onPause);
        state.timeouts.add(timeout);
      } else {
        onStart();
      }
    }
    function onStart() {
      state.pauseQueue.delete(onPause);
      state.timeouts.delete(timeout);
      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }
      try {
        actions.start({...props, callId, cancel}, resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}

const getCombinedResult = (target, results) => results.length == 1 ? results[0] : results.some((result) => result.cancelled) ? getCancelledResult(target.get()) : results.every((result) => result.noop) ? getNoopResult(target.get()) : getFinishedResult(target.get(), results.every((result) => result.finished));
const getNoopResult = (value) => ({
  value,
  noop: true,
  finished: true,
  cancelled: false
});
const getFinishedResult = (value, finished, cancelled = false) => ({
  value,
  finished,
  cancelled
});
const getCancelledResult = (value) => ({
  value,
  cancelled: true,
  finished: false
});

function runAsync(to, props, state, target) {
  const {callId, parentId, onRest} = props;
  const {asyncTo: prevTo, promise: prevPromise} = state;
  if (!parentId && to === prevTo && !props.reset) {
    return prevPromise;
  }
  return state.promise = (async () => {
    state.asyncId = callId;
    state.asyncTo = to;
    const defaultProps = getDefaultProps(props, (value, key) => key === "onRest" ? void 0 : value);
    let preventBail;
    let bail;
    const bailPromise = new Promise((resolve, reject) => (preventBail = resolve, bail = reject));
    const bailIfEnded = (bailSignal) => {
      const bailResult = callId <= (state.cancelId || 0) && getCancelledResult(target) || callId !== state.asyncId && getFinishedResult(target, false);
      if (bailResult) {
        bailSignal.result = bailResult;
        bail(bailSignal);
        throw bailSignal;
      }
    };
    const animate = (arg1, arg2) => {
      const bailSignal = new BailSignal();
      const skipAnimationSignal = new SkipAniamtionSignal();
      return (async () => {
        if (globals.skipAnimation) {
          stopAsync(state);
          skipAnimationSignal.result = getFinishedResult(target, false);
          bail(skipAnimationSignal);
          throw skipAnimationSignal;
        }
        bailIfEnded(bailSignal);
        const props2 = is.obj(arg1) ? {...arg1} : {...arg2, to: arg1};
        props2.parentId = callId;
        eachProp(defaultProps, (value, key) => {
          if (is.und(props2[key])) {
            props2[key] = value;
          }
        });
        const result2 = await target.start(props2);
        bailIfEnded(bailSignal);
        if (state.paused) {
          await new Promise((resume) => {
            state.resumeQueue.add(resume);
          });
        }
        return result2;
      })();
    };
    let result;
    if (globals.skipAnimation) {
      stopAsync(state);
      return getFinishedResult(target, false);
    }
    try {
      let animating;
      if (is.arr(to)) {
        animating = (async (queue) => {
          for (const props2 of queue) {
            await animate(props2);
          }
        })(to);
      } else {
        animating = Promise.resolve(to(animate, target.stop.bind(target)));
      }
      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target.get(), true, false);
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else if (err instanceof SkipAniamtionSignal) {
        result = err.result;
      } else {
        throw err;
      }
    } finally {
      if (callId == state.asyncId) {
        state.asyncId = parentId;
        state.asyncTo = parentId ? prevTo : void 0;
        state.promise = parentId ? prevPromise : void 0;
      }
    }
    if (is.fun(onRest)) {
      raf.batchedUpdates(() => {
        onRest(result, target, target.item);
      });
    }
    return result;
  })();
}
function stopAsync(state, cancelId) {
  flush(state.timeouts, (t) => t.cancel());
  state.pauseQueue.clear();
  state.resumeQueue.clear();
  state.asyncId = state.asyncTo = state.promise = void 0;
  if (cancelId)
    state.cancelId = cancelId;
}
class BailSignal extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.");
  }
}
class SkipAniamtionSignal extends Error {
  constructor() {
    super("SkipAnimationSignal");
  }
}

const isFrameValue = (value) => value instanceof FrameValue;
let nextId = 1;
class FrameValue extends FluidValue {
  constructor() {
    super(...arguments);
    this.id = nextId++;
    this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(priority) {
    if (this._priority != priority) {
      this._priority = priority;
      this._onPriorityChange(priority);
    }
  }
  get() {
    const node = getAnimated(this);
    return node && node.getValue();
  }
  to(...args) {
    return globals.to(this, args);
  }
  interpolate(...args) {
    deprecateInterpolate();
    return globals.to(this, args);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(count) {
    if (count == 1)
      this._attach();
  }
  observerRemoved(count) {
    if (count == 0)
      this._detach();
  }
  _attach() {
  }
  _detach() {
  }
  _onChange(value, idle = false) {
    callFluidObservers(this, {
      type: "change",
      parent: this,
      value,
      idle
    });
  }
  _onPriorityChange(priority) {
    if (!this.idle) {
      frameLoop.sort(this);
    }
    callFluidObservers(this, {
      type: "priority",
      parent: this,
      priority
    });
  }
}

const $P = Symbol.for("SpringPhase");
const HAS_ANIMATED = 1;
const IS_ANIMATING = 2;
const IS_PAUSED = 4;
const hasAnimated = (target) => (target[$P] & HAS_ANIMATED) > 0;
const isAnimating = (target) => (target[$P] & IS_ANIMATING) > 0;
const isPaused = (target) => (target[$P] & IS_PAUSED) > 0;
const setActiveBit = (target, active) => active ? target[$P] |= IS_ANIMATING | HAS_ANIMATED : target[$P] &= ~IS_ANIMATING;
const setPausedBit = (target, paused) => paused ? target[$P] |= IS_PAUSED : target[$P] &= ~IS_PAUSED;

class SpringValue extends FrameValue {
  constructor(arg1, arg2) {
    super();
    this.animation = new Animation();
    this.defaultProps = {};
    this._state = {
      paused: false,
      pauseQueue: new Set(),
      resumeQueue: new Set(),
      timeouts: new Set()
    };
    this._pendingCalls = new Set();
    this._lastCallId = 0;
    this._lastToId = 0;
    this._memoizedDuration = 0;
    if (!is.und(arg1) || !is.und(arg2)) {
      const props = is.obj(arg1) ? {...arg1} : {...arg2, from: arg1};
      if (is.und(props.default)) {
        props.default = true;
      }
      this.start(props);
    }
  }
  get idle() {
    return !(isAnimating(this) || this._state.asyncTo) || isPaused(this);
  }
  get goal() {
    return getFluidValue(this.animation.to);
  }
  get velocity() {
    const node = getAnimated(this);
    return node instanceof AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map((node2) => node2.lastVelocity || 0);
  }
  get hasAnimated() {
    return hasAnimated(this);
  }
  get isAnimating() {
    return isAnimating(this);
  }
  get isPaused() {
    return isPaused(this);
  }
  advance(dt) {
    let idle = true;
    let changed = false;
    const anim = this.animation;
    let {config, toValues} = anim;
    const payload = getPayload(anim.to);
    if (!payload && hasFluidValue(anim.to)) {
      toValues = toArray(getFluidValue(anim.to));
    }
    anim.values.forEach((node2, i) => {
      if (node2.done)
        return;
      const to = node2.constructor == AnimatedString ? 1 : payload ? payload[i].lastPosition : toValues[i];
      let finished = anim.immediate;
      let position = to;
      if (!finished) {
        position = node2.lastPosition;
        if (config.tension <= 0) {
          node2.done = true;
          return;
        }
        let elapsed = node2.elapsedTime += dt;
        const from = anim.fromValues[i];
        const v0 = node2.v0 != null ? node2.v0 : node2.v0 = is.arr(config.velocity) ? config.velocity[i] : config.velocity;
        let velocity;
        if (!is.und(config.duration)) {
          let p = 1;
          if (config.duration > 0) {
            if (this._memoizedDuration !== config.duration) {
              this._memoizedDuration = config.duration;
              if (node2.durationProgress > 0) {
                node2.elapsedTime = config.duration * node2.durationProgress;
                elapsed = node2.elapsedTime += dt;
              }
            }
            p = (config.progress || 0) + elapsed / this._memoizedDuration;
            p = p > 1 ? 1 : p < 0 ? 0 : p;
            node2.durationProgress = p;
          }
          position = from + config.easing(p) * (to - from);
          velocity = (position - node2.lastPosition) / dt;
          finished = p == 1;
        } else if (config.decay) {
          const decay = config.decay === true ? 0.998 : config.decay;
          const e = Math.exp(-(1 - decay) * elapsed);
          position = from + v0 / (1 - decay) * (1 - e);
          finished = Math.abs(node2.lastPosition - position) < 0.1;
          velocity = v0 * e;
        } else {
          velocity = node2.lastVelocity == null ? v0 : node2.lastVelocity;
          const precision = config.precision || (from == to ? 5e-3 : Math.min(1, Math.abs(to - from) * 1e-3));
          const restVelocity = config.restVelocity || precision / 10;
          const bounceFactor = config.clamp ? 0 : config.bounce;
          const canBounce = !is.und(bounceFactor);
          const isGrowing = from == to ? node2.v0 > 0 : from < to;
          let isMoving;
          let isBouncing = false;
          const step = 1;
          const numSteps = Math.ceil(dt / step);
          for (let n = 0; n < numSteps; ++n) {
            isMoving = Math.abs(velocity) > restVelocity;
            if (!isMoving) {
              finished = Math.abs(to - position) <= precision;
              if (finished) {
                break;
              }
            }
            if (canBounce) {
              isBouncing = position == to || position > to == isGrowing;
              if (isBouncing) {
                velocity = -velocity * bounceFactor;
                position = to;
              }
            }
            const springForce = -config.tension * 1e-6 * (position - to);
            const dampingForce = -config.friction * 1e-3 * velocity;
            const acceleration = (springForce + dampingForce) / config.mass;
            velocity = velocity + acceleration * step;
            position = position + velocity * step;
          }
        }
        node2.lastVelocity = velocity;
        if (Number.isNaN(position)) {
          console.warn(`Got NaN while animating:`, this);
          finished = true;
        }
      }
      if (payload && !payload[i].done) {
        finished = false;
      }
      if (finished) {
        node2.done = true;
      } else {
        idle = false;
      }
      if (node2.setValue(position, config.round)) {
        changed = true;
      }
    });
    const node = getAnimated(this);
    if (idle) {
      const value = getFluidValue(anim.to);
      if (node.setValue(value) || changed) {
        this._onChange(value);
      }
      this._stop();
    } else if (changed) {
      this._onChange(node.getValue());
    }
  }
  set(value) {
    raf.batchedUpdates(() => {
      this._stop();
      this._focus(value);
      this._set(value);
    });
    return this;
  }
  pause() {
    this._update({pause: true});
  }
  resume() {
    this._update({pause: false});
  }
  finish() {
    if (isAnimating(this)) {
      const {to, config} = this.animation;
      raf.batchedUpdates(() => {
        this._onStart();
        if (!config.decay) {
          this._set(to, false);
        }
        this._stop();
      });
    }
    return this;
  }
  update(props) {
    const queue = this.queue || (this.queue = []);
    queue.push(props);
    return this;
  }
  start(to, arg2) {
    let queue;
    if (!is.und(to)) {
      queue = [is.obj(to) ? to : {...arg2, to}];
    } else {
      queue = this.queue || [];
      this.queue = [];
    }
    return Promise.all(queue.map((props) => this._update(props))).then((results) => getCombinedResult(this, results));
  }
  stop(cancel) {
    const {to} = this.animation;
    this._focus(this.get());
    stopAsync(this._state, cancel && this._lastCallId);
    raf.batchedUpdates(() => this._stop(to, cancel));
    return this;
  }
  reset() {
    this._update({reset: true});
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._start();
    } else if (event.type == "priority") {
      this.priority = event.priority + 1;
    }
  }
  _prepareNode(props) {
    const key = this.key || "";
    let {to, from} = props;
    to = is.obj(to) ? to[key] : to;
    if (to == null || isAsyncTo(to)) {
      to = void 0;
    }
    from = is.obj(from) ? from[key] : from;
    if (from == null) {
      from = void 0;
    }
    const range = {to, from};
    if (!hasAnimated(this)) {
      if (props.reverse)
        [to, from] = [from, to];
      from = getFluidValue(from);
      if (!is.und(from)) {
        this._set(from);
      } else if (!getAnimated(this)) {
        this._set(to);
      }
    }
    return range;
  }
  _update({...props}, isLoop) {
    const {key, defaultProps} = this;
    if (props.default)
      Object.assign(defaultProps, getDefaultProps(props, (value, prop) => /^on/.test(prop) ? resolveProp(value, key) : value));
    mergeActiveFn(this, props, "onProps");
    sendEvent(this, "onProps", props, this);
    const range = this._prepareNode(props);
    if (Object.isFrozen(this)) {
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    }
    const state = this._state;
    return scheduleProps(++this._lastCallId, {
      key,
      props,
      defaultProps,
      state,
      actions: {
        pause: () => {
          if (!isPaused(this)) {
            setPausedBit(this, true);
            flushCalls(state.pauseQueue);
            sendEvent(this, "onPause", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
          }
        },
        resume: () => {
          if (isPaused(this)) {
            setPausedBit(this, false);
            if (isAnimating(this)) {
              this._resume();
            }
            flushCalls(state.resumeQueue);
            sendEvent(this, "onResume", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
          }
        },
        start: this._merge.bind(this, range)
      }
    }).then((result) => {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        const nextProps = createLoopUpdate(props);
        if (nextProps) {
          return this._update(nextProps, true);
        }
      }
      return result;
    });
  }
  _merge(range, props, resolve) {
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }
    const hasToProp = !is.und(range.to);
    const hasFromProp = !is.und(range.from);
    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }
    const {key, defaultProps, animation: anim} = this;
    const {to: prevTo, from: prevFrom} = anim;
    let {to = prevTo, from = prevFrom} = range;
    if (hasFromProp && !hasToProp && (!props.default || is.und(to))) {
      to = from;
    }
    if (props.reverse)
      [to, from] = [from, to];
    const hasFromChanged = !isEqual(from, prevFrom);
    if (hasFromChanged) {
      anim.from = from;
    }
    from = getFluidValue(from);
    const hasToChanged = !isEqual(to, prevTo);
    if (hasToChanged) {
      this._focus(to);
    }
    const hasAsyncTo = isAsyncTo(props.to);
    const {config} = anim;
    const {decay, velocity} = config;
    if (hasToProp || hasFromProp) {
      config.velocity = 0;
    }
    if (props.config && !hasAsyncTo) {
      mergeConfig(config, callProp(props.config, key), props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0);
    }
    let node = getAnimated(this);
    if (!node || is.und(to)) {
      return resolve(getFinishedResult(this, true));
    }
    const reset = is.und(props.reset) ? hasFromProp && !props.default : !is.und(from) && matchProp(props.reset, key);
    const value = reset ? from : this.get();
    const goal = computeGoal(to);
    const isAnimatable = is.num(goal) || is.arr(goal) || isAnimatedString(goal);
    const immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));
    if (hasToChanged) {
      const nodeType = getAnimatedType(to);
      if (nodeType !== node.constructor) {
        if (immediate) {
          node = this._set(goal);
        } else
          throw Error(`Cannot animate between ${node.constructor.name} and ${nodeType.name}, as the "to" prop suggests`);
      }
    }
    const goalType = node.constructor;
    let started = hasFluidValue(to);
    let finished = false;
    if (!started) {
      const hasValueChanged = reset || !hasAnimated(this) && hasFromChanged;
      if (hasToChanged || hasValueChanged) {
        finished = isEqual(computeGoal(value), goal);
        started = !finished;
      }
      if (!isEqual(config.decay, decay) || !isEqual(config.velocity, velocity)) {
        started = true;
      }
    }
    if (finished && isAnimating(this)) {
      if (anim.changed && !reset) {
        started = true;
      } else if (!started) {
        this._stop(prevTo);
      }
    }
    if (!hasAsyncTo) {
      if (started || hasFluidValue(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = hasFluidValue(to) ? null : goalType == AnimatedString ? [1] : toArray(goal);
      }
      if (anim.immediate != immediate) {
        anim.immediate = immediate;
        if (!immediate && !reset) {
          this._set(prevTo);
        }
      }
      if (started) {
        const {onRest} = anim;
        each(ACTIVE_EVENTS, (type) => mergeActiveFn(this, props, type));
        const result = getFinishedResult(this, checkFinished(this, prevTo));
        flushCalls(this._pendingCalls, result);
        this._pendingCalls.add(resolve);
        if (anim.changed)
          raf.batchedUpdates(() => {
            var _a;
            anim.changed = !reset;
            onRest == null ? void 0 : onRest(result, this);
            if (reset) {
              callProp(defaultProps.onRest, result);
            } else {
              (_a = anim.onStart) == null ? void 0 : _a.call(anim, result, this);
            }
          });
      }
    }
    if (reset) {
      this._set(value);
    }
    if (hasAsyncTo) {
      resolve(runAsync(props.to, props, this._state, this));
    } else if (started) {
      this._start();
    } else if (isAnimating(this) && !hasToChanged) {
      this._pendingCalls.add(resolve);
    } else {
      resolve(getNoopResult(value));
    }
  }
  _focus(value) {
    const anim = this.animation;
    if (value !== anim.to) {
      if (getFluidObservers(this)) {
        this._detach();
      }
      anim.to = value;
      if (getFluidObservers(this)) {
        this._attach();
      }
    }
  }
  _attach() {
    let priority = 0;
    const {to} = this.animation;
    if (hasFluidValue(to)) {
      addFluidObserver(to, this);
      if (isFrameValue(to)) {
        priority = to.priority + 1;
      }
    }
    this.priority = priority;
  }
  _detach() {
    const {to} = this.animation;
    if (hasFluidValue(to)) {
      removeFluidObserver(to, this);
    }
  }
  _set(arg, idle = true) {
    const value = getFluidValue(arg);
    if (!is.und(value)) {
      const oldNode = getAnimated(this);
      if (!oldNode || !isEqual(value, oldNode.getValue())) {
        const nodeType = getAnimatedType(value);
        if (!oldNode || oldNode.constructor != nodeType) {
          setAnimated(this, nodeType.create(value));
        } else {
          oldNode.setValue(value);
        }
        if (oldNode) {
          raf.batchedUpdates(() => {
            this._onChange(value, idle);
          });
        }
      }
    }
    return getAnimated(this);
  }
  _onStart() {
    const anim = this.animation;
    if (!anim.changed) {
      anim.changed = true;
      sendEvent(this, "onStart", getFinishedResult(this, checkFinished(this, anim.to)), this);
    }
  }
  _onChange(value, idle) {
    if (!idle) {
      this._onStart();
      callProp(this.animation.onChange, value, this);
    }
    callProp(this.defaultProps.onChange, value, this);
    super._onChange(value, idle);
  }
  _start() {
    const anim = this.animation;
    getAnimated(this).reset(getFluidValue(anim.to));
    if (!anim.immediate) {
      anim.fromValues = anim.values.map((node) => node.lastPosition);
    }
    if (!isAnimating(this)) {
      setActiveBit(this, true);
      if (!isPaused(this)) {
        this._resume();
      }
    }
  }
  _resume() {
    if (globals.skipAnimation) {
      this.finish();
    } else {
      frameLoop.start(this);
    }
  }
  _stop(goal, cancel) {
    if (isAnimating(this)) {
      setActiveBit(this, false);
      const anim = this.animation;
      each(anim.values, (node) => {
        node.done = true;
      });
      if (anim.toValues) {
        anim.onChange = anim.onPause = anim.onResume = void 0;
      }
      callFluidObservers(this, {
        type: "idle",
        parent: this
      });
      const result = cancel ? getCancelledResult(this.get()) : getFinishedResult(this.get(), checkFinished(this, goal != null ? goal : anim.to));
      flushCalls(this._pendingCalls, result);
      if (anim.changed) {
        anim.changed = false;
        sendEvent(this, "onRest", result, this);
      }
    }
  }
}
function checkFinished(target, to) {
  const goal = computeGoal(to);
  const value = computeGoal(target.get());
  return isEqual(value, goal);
}
function createLoopUpdate(props, loop = props.loop, to = props.to) {
  let loopRet = callProp(loop);
  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate({
      ...props,
      loop,
      default: false,
      pause: void 0,
      to: !reverse || isAsyncTo(to) ? to : void 0,
      from: reset ? props.from : void 0,
      reset,
      ...overrides
    });
  }
}
function createUpdate(props) {
  const {to, from} = props = inferTo(props);
  const keys = new Set();
  if (is.obj(to))
    findDefined(to, keys);
  if (is.obj(from))
    findDefined(from, keys);
  props.keys = keys.size ? Array.from(keys) : null;
  return props;
}
function declareUpdate(props) {
  const update = createUpdate(props);
  if (is.und(update.default)) {
    update.default = getDefaultProps(update);
  }
  return update;
}
function findDefined(values, keys) {
  eachProp(values, (value, key) => value != null && keys.add(key));
}
const ACTIVE_EVENTS = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume"
];
function mergeActiveFn(target, props, type) {
  target.animation[type] = props[type] !== getDefaultProp(props, type) ? resolveProp(props[type], target.key) : void 0;
}
function sendEvent(target, type, ...args) {
  var _a, _b, _c, _d;
  (_b = (_a = target.animation)[type]) == null ? void 0 : _b.call(_a, ...args);
  (_d = (_c = target.defaultProps)[type]) == null ? void 0 : _d.call(_c, ...args);
}

const BATCHED_EVENTS = ["onStart", "onChange", "onRest"];
let nextId$1 = 1;
class Controller {
  constructor(props, flush2) {
    this.id = nextId$1++;
    this.springs = {};
    this.queue = [];
    this._lastAsyncId = 0;
    this._active = new Set();
    this._changed = new Set();
    this._started = false;
    this._state = {
      paused: false,
      pauseQueue: new Set(),
      resumeQueue: new Set(),
      timeouts: new Set()
    };
    this._events = {
      onStart: new Map(),
      onChange: new Map(),
      onRest: new Map()
    };
    this._onFrame = this._onFrame.bind(this);
    if (flush2) {
      this._flush = flush2;
    }
    if (props) {
      this.start({default: true, ...props});
    }
  }
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every((spring) => spring.idle);
  }
  get item() {
    return this._item;
  }
  set item(item) {
    this._item = item;
  }
  get() {
    const values = {};
    this.each((spring, key) => values[key] = spring.get());
    return values;
  }
  set(values) {
    for (const key in values) {
      const value = values[key];
      if (!is.und(value)) {
        this.springs[key].set(value);
      }
    }
  }
  update(props) {
    if (props) {
      this.queue.push(createUpdate(props));
    }
    return this;
  }
  start(props) {
    let {queue} = this;
    if (props) {
      queue = toArray(props).map(createUpdate);
    } else {
      this.queue = [];
    }
    if (this._flush) {
      return this._flush(this, queue);
    }
    prepareKeys(this, queue);
    return flushUpdateQueue(this, queue);
  }
  stop(arg, keys) {
    if (arg !== !!arg) {
      keys = arg;
    }
    if (keys) {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].stop(!!arg));
    } else {
      stopAsync(this._state, this._lastAsyncId);
      this.each((spring) => spring.stop(!!arg));
    }
    return this;
  }
  pause(keys) {
    if (is.und(keys)) {
      this.start({pause: true});
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].pause());
    }
    return this;
  }
  resume(keys) {
    if (is.und(keys)) {
      this.start({pause: false});
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].resume());
    }
    return this;
  }
  each(iterator) {
    eachProp(this.springs, iterator);
  }
  _onFrame() {
    const {onStart, onChange, onRest} = this._events;
    const active = this._active.size > 0;
    if (active && !this._started) {
      this._started = true;
      flush(onStart, ([onStart2, result]) => {
        result.value = this.get();
        onStart2(result, this, this._item);
      });
    }
    const idle = !active && this._started;
    const changed = this._changed.size > 0 && onChange.size;
    const values = changed || idle && onRest.size ? this.get() : null;
    if (changed) {
      flush(onChange, ([onChange2, result]) => {
        result.value = values;
        onChange2(result, this, this._item);
      });
    }
    if (idle) {
      this._started = false;
      flush(onRest, ([onRest2, result]) => {
        result.value = values;
        onRest2(result, this, this._item);
      });
    }
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._changed.add(event.parent);
      if (!event.idle) {
        this._active.add(event.parent);
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else
      return;
    raf.onFrame(this._onFrame);
  }
}
function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map((props) => flushUpdate(ctrl, props))).then((results) => getCombinedResult(ctrl, results));
}
async function flushUpdate(ctrl, props, isLoop) {
  const {keys, to, from, loop, onRest, onResolve} = props;
  const defaults = is.obj(props.default) && props.default;
  if (loop) {
    props.loop = false;
  }
  if (to === false)
    props.to = null;
  if (from === false)
    props.from = null;
  const asyncTo = is.arr(to) || is.fun(to) ? to : void 0;
  if (asyncTo) {
    props.to = void 0;
    props.onRest = void 0;
    if (defaults) {
      defaults.onRest = void 0;
    }
  } else {
    each(BATCHED_EVENTS, (key) => {
      const handler = props[key];
      if (is.fun(handler)) {
        const queue = ctrl["_events"][key];
        props[key] = ({finished, cancelled}) => {
          const result2 = queue.get(handler);
          if (result2) {
            if (!finished)
              result2.finished = false;
            if (cancelled)
              result2.cancelled = true;
          } else {
            queue.set(handler, {
              value: null,
              finished: finished || false,
              cancelled: cancelled || false
            });
          }
        };
        if (defaults) {
          defaults[key] = props[key];
        }
      }
    });
  }
  const state = ctrl["_state"];
  if (props.pause === !state.paused) {
    state.paused = props.pause;
    flushCalls(props.pause ? state.pauseQueue : state.resumeQueue);
  } else if (state.paused) {
    props.pause = true;
  }
  const promises = (keys || Object.keys(ctrl.springs)).map((key) => ctrl.springs[key].start(props));
  const cancel = props.cancel === true || getDefaultProp(props, "cancel") === true;
  if (asyncTo || cancel && state.asyncId) {
    promises.push(scheduleProps(++ctrl["_lastAsyncId"], {
      props,
      state,
      actions: {
        pause: noop,
        resume: noop,
        start(props2, resolve) {
          if (cancel) {
            stopAsync(state, ctrl["_lastAsyncId"]);
            resolve(getCancelledResult(ctrl));
          } else {
            props2.onRest = onRest;
            resolve(runAsync(asyncTo, props2, state, ctrl));
          }
        }
      }
    }));
  }
  if (state.paused) {
    await new Promise((resume) => {
      state.resumeQueue.add(resume);
    });
  }
  const result = getCombinedResult(ctrl, await Promise.all(promises));
  if (loop && result.finished && !(isLoop && result.noop)) {
    const nextProps = createLoopUpdate(props, loop, to);
    if (nextProps) {
      prepareKeys(ctrl, [nextProps]);
      return flushUpdate(ctrl, nextProps, true);
    }
  }
  if (onResolve) {
    raf.batchedUpdates(() => onResolve(result, ctrl, ctrl.item));
  }
  return result;
}
function getSprings(ctrl, props) {
  const springs = {...ctrl.springs};
  if (props) {
    each(toArray(props), (props2) => {
      if (is.und(props2.keys)) {
        props2 = createUpdate(props2);
      }
      if (!is.obj(props2.to)) {
        props2 = {...props2, to: void 0};
      }
      prepareSprings(springs, props2, (key) => {
        return createSpring(key);
      });
    });
  }
  return springs;
}
function setSprings(ctrl, springs) {
  eachProp(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      addFluidObserver(spring, ctrl);
    }
  });
}
function createSpring(key, observer) {
  const spring = new SpringValue();
  spring.key = key;
  if (observer) {
    addFluidObserver(spring, observer);
  }
  return spring;
}
function prepareSprings(springs, props, create) {
  if (props.keys) {
    each(props.keys, (key) => {
      const spring = springs[key] || (springs[key] = create(key));
      spring["_prepareNode"](props);
    });
  }
}
function prepareKeys(ctrl, queue) {
  each(queue, (props) => {
    prepareSprings(ctrl.springs, props, (key) => {
      return createSpring(key, ctrl);
    });
  });
}

const SpringContext = ({
  children,
  ...props
}) => {
  const inherited = react.useContext(ctx);
  const pause = props.pause || !!inherited.pause, immediate = props.immediate || !!inherited.immediate;
  props = useMemoOne(() => ({pause, immediate}), [pause, immediate]);
  const {Provider} = ctx;
  return /* @__PURE__ */ react.createElement(Provider, {
    value: props
  }, children);
};
const ctx = makeContext(SpringContext, {});
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;
function makeContext(target, init) {
  Object.assign(target, react.createContext(init));
  target.Provider._context = target;
  target.Consumer._context = target;
  return target;
}

class SpringRef extends Function {
  constructor() {
    super("return arguments.callee._call.apply(arguments.callee, arguments)");
    this.current = [];
  }
  _call(props) {
    deprecateDirectCall();
    this.start(props);
  }
  set(values) {
    each(this.current, (ctrl) => ctrl.set(values));
  }
  start(props) {
    const results = [];
    each(this.current, (ctrl, i) => {
      if (is.und(props)) {
        results.push(ctrl.start());
      } else {
        const update = this._getProps(props, ctrl, i);
        if (update) {
          results.push(ctrl.start(update));
        }
      }
    });
    return results;
  }
  update(props) {
    each(this.current, (ctrl, i) => ctrl.update(this._getProps(props, ctrl, i)));
    return this;
  }
  add(ctrl) {
    if (!this.current.includes(ctrl)) {
      this.current.push(ctrl);
    }
  }
  delete(ctrl) {
    const i = this.current.indexOf(ctrl);
    if (~i)
      this.current.splice(i, 1);
  }
  _getProps(arg, ctrl, index) {
    return is.fun(arg) ? arg(index, ctrl) : arg;
  }
}
each(["stop", "pause", "resume"], (key) => {
  SpringRef.prototype[key] = function() {
    each(this.current, (ctrl) => ctrl[key](...arguments));
    return this;
  };
});

function useSprings(length, props, deps) {
  const propsFn = is.fun(props) && props;
  if (propsFn && !deps)
    deps = [];
  const ref = react.useMemo(() => propsFn || arguments.length == 3 ? new SpringRef() : void 0, []);
  const layoutId = react.useRef(0);
  const forceUpdate = useForceUpdate();
  const state = react.useMemo(() => ({
    ctrls: [],
    queue: [],
    flush(ctrl, updates2) {
      const springs2 = getSprings(ctrl, updates2);
      const canFlushSync = layoutId.current > 0 && !state.queue.length && !Object.keys(springs2).some((key) => !ctrl.springs[key]);
      return canFlushSync ? flushUpdateQueue(ctrl, updates2) : new Promise((resolve) => {
        setSprings(ctrl, springs2);
        state.queue.push(() => {
          resolve(flushUpdateQueue(ctrl, updates2));
        });
        forceUpdate();
      });
    }
  }), []);
  const ctrls = [...state.ctrls];
  const updates = [];
  const prevLength = usePrev(length) || 0;
  const oldCtrls = ctrls.slice(length, prevLength);
  react.useMemo(() => {
    ctrls.length = length;
    declareUpdates(prevLength, length);
  }, [length]);
  react.useMemo(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  function declareUpdates(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      const ctrl = ctrls[i] || (ctrls[i] = new Controller(null, state.flush));
      const update = propsFn ? propsFn(i, ctrl) : props[i];
      if (update) {
        updates[i] = declareUpdate(update);
      }
    }
  }
  const springs = ctrls.map((ctrl, i) => getSprings(ctrl, updates[i]));
  const context = react.useContext(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useLayoutEffect(() => {
    layoutId.current++;
    state.ctrls = ctrls;
    const {queue} = state;
    if (queue.length) {
      state.queue = [];
      each(queue, (cb) => cb());
    }
    each(oldCtrls, (ctrl) => {
      detachRefs(ctrl, ref);
      ctrl.stop(true);
    });
    each(ctrls, (ctrl, i) => {
      const values2 = springs[i];
      setSprings(ctrl, values2);
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext) {
        ctrl.start({default: context});
      }
      const update = updates[i];
      if (update) {
        replaceRef(ctrl, update.ref);
        if (ctrl.ref) {
          ctrl.queue.push(update);
        } else {
          ctrl.start(update);
        }
      }
    });
  });
  useOnce(() => () => {
    each(state.ctrls, (ctrl) => ctrl.stop(true));
  });
  const values = springs.map((x) => ({...x}));
  return ref ? [values, ref] : values;
}

function useSpring(props, deps) {
  const isFn = is.fun(props);
  const [[values], ref] = useSprings(1, isFn ? props : [props], isFn ? deps || [] : deps);
  return isFn || arguments.length == 2 ? [values, ref] : values;
}

const MOUNT = "mount";
const ENTER = "enter";
const UPDATE = "update";
const LEAVE = "leave";

function useTransition(data, props, deps) {
  const {reset, sort, trail = 0, expires = true, onDestroyed} = props;
  const ref = react.useMemo(() => arguments.length == 3 ? new SpringRef() : void 0, []);
  const items = toArray(data);
  const transitions = [];
  const usedTransitions = react.useRef(null);
  const prevTransitions = reset ? null : usedTransitions.current;
  useLayoutEffect(() => {
    usedTransitions.current = transitions;
  });
  useOnce(() => () => each(usedTransitions.current, (t) => {
    if (t.expired) {
      clearTimeout(t.expirationId);
    }
    detachRefs(t.ctrl, ref);
    t.ctrl.stop(true);
  }));
  const keys = getKeys(items, props, prevTransitions);
  const expired = reset && usedTransitions.current || [];
  useLayoutEffect(() => each(expired, ({ctrl, item, key}) => {
    detachRefs(ctrl, ref);
    callProp(onDestroyed, item, key);
  }));
  const reused = [];
  if (prevTransitions)
    each(prevTransitions, (t, i) => {
      if (t.expired) {
        clearTimeout(t.expirationId);
        expired.push(t);
      } else {
        i = reused[i] = keys.indexOf(t.key);
        if (~i)
          transitions[i] = t;
      }
    });
  each(items, (item, i) => {
    if (!transitions[i]) {
      transitions[i] = {
        key: keys[i],
        item,
        phase: MOUNT,
        ctrl: new Controller()
      };
      transitions[i].ctrl.item = item;
    }
  });
  if (reused.length) {
    let i = -1;
    each(reused, (keyIndex, prevIndex) => {
      const t = prevTransitions[prevIndex];
      if (~keyIndex) {
        i = transitions.indexOf(t);
        transitions[i] = {...t, item: items[keyIndex]};
      } else if (props.leave) {
        transitions.splice(++i, 0, t);
      }
    });
  }
  if (is.fun(sort)) {
    transitions.sort((a, b) => sort(a.item, b.item));
  }
  let delay = -trail;
  const forceUpdate = useForceUpdate();
  const defaultProps = getDefaultProps(props);
  const changes = new Map();
  each(transitions, (t, i) => {
    const key = t.key;
    const prevPhase = t.phase;
    let to;
    let phase;
    if (prevPhase == MOUNT) {
      to = props.enter;
      phase = ENTER;
    } else {
      const isLeave = keys.indexOf(key) < 0;
      if (prevPhase != LEAVE) {
        if (isLeave) {
          to = props.leave;
          phase = LEAVE;
        } else if (to = props.update) {
          phase = UPDATE;
        } else
          return;
      } else if (!isLeave) {
        to = props.enter;
        phase = ENTER;
      } else
        return;
    }
    to = callProp(to, t.item, i);
    to = is.obj(to) ? inferTo(to) : {to};
    if (!to.config) {
      const config = props.config || defaultProps.config;
      to.config = callProp(config, t.item, i, phase);
    }
    const payload = {
      ...defaultProps,
      delay: delay += trail,
      reset: false,
      ...to
    };
    if (phase == ENTER && is.und(payload.from)) {
      const from = is.und(props.initial) || prevTransitions ? props.from : props.initial;
      payload.from = callProp(from, t.item, i);
    }
    const {onResolve} = payload;
    payload.onResolve = (result) => {
      callProp(onResolve, result);
      const transitions2 = usedTransitions.current;
      const t2 = transitions2.find((t3) => t3.key === key);
      if (!t2)
        return;
      if (result.cancelled && t2.phase != UPDATE) {
        return;
      }
      if (t2.ctrl.idle) {
        const idle = transitions2.every((t3) => t3.ctrl.idle);
        if (t2.phase == LEAVE) {
          const expiry = callProp(expires, t2.item);
          if (expiry !== false) {
            const expiryMs = expiry === true ? 0 : expiry;
            t2.expired = true;
            if (!idle && expiryMs > 0) {
              if (expiryMs <= 2147483647)
                t2.expirationId = setTimeout(forceUpdate, expiryMs);
              return;
            }
          }
        }
        if (idle && transitions2.some((t3) => t3.expired)) {
          forceUpdate();
        }
      }
    };
    const springs = getSprings(t.ctrl, payload);
    changes.set(t, {phase, springs, payload});
  });
  const context = react.useContext(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useLayoutEffect(() => {
    if (hasContext)
      each(transitions, (t) => {
        t.ctrl.start({default: context});
      });
  }, [context]);
  useLayoutEffect(() => {
    each(changes, ({phase, springs, payload}, t) => {
      const {ctrl} = t;
      t.phase = phase;
      ref == null ? void 0 : ref.add(ctrl);
      replaceRef(ctrl, payload.ref);
      setSprings(ctrl, springs);
      if (hasContext && phase == ENTER) {
        ctrl.start({default: context});
      }
      ctrl[ctrl.ref ? "update" : "start"](payload);
    });
  }, reset ? void 0 : deps);
  const renderTransitions = (render) => /* @__PURE__ */ react.createElement(react.Fragment, null, transitions.map((t, i) => {
    const {springs} = changes.get(t) || t.ctrl;
    const elem = render({...springs}, t.item, t, i);
    return elem && elem.type ? /* @__PURE__ */ react.createElement(elem.type, {
      ...elem.props,
      key: is.str(t.key) || is.num(t.key) ? t.key : t.ctrl.id,
      ref: elem.ref
    }) : elem;
  }));
  return ref ? [renderTransitions, ref] : renderTransitions;
}
let nextKey = 1;
function getKeys(items, {key, keys = key}, prevTransitions) {
  if (keys === null) {
    const reused = new Set();
    return items.map((item) => {
      const t = prevTransitions && prevTransitions.find((t2) => t2.item === item && t2.phase !== LEAVE && !reused.has(t2));
      if (t) {
        reused.add(t);
        return t.key;
      }
      return nextKey++;
    });
  }
  return is.und(keys) ? items : is.fun(keys) ? items.map(keys) : toArray(keys);
}

function Spring({children, ...props}) {
  return children(useSpring(props));
}

class Interpolation extends FrameValue {
  constructor(source, args) {
    super();
    this.source = source;
    this.idle = true;
    this._active = new Set();
    this.calc = createInterpolator(...args);
    const value = this._get();
    const nodeType = getAnimatedType(value);
    setAnimated(this, nodeType.create(value));
  }
  advance(_dt) {
    const value = this._get();
    const oldValue = this.get();
    if (!isEqual(value, oldValue)) {
      getAnimated(this).setValue(value);
      this._onChange(value, this.idle);
    }
    if (!this.idle && checkIdle(this._active)) {
      becomeIdle(this);
    }
  }
  _get() {
    const inputs = is.arr(this.source) ? this.source.map(getFluidValue) : toArray(getFluidValue(this.source));
    return this.calc(...inputs);
  }
  _start() {
    if (this.idle && !checkIdle(this._active)) {
      this.idle = false;
      each(getPayload(this), (node) => {
        node.done = false;
      });
      if (globals.skipAnimation) {
        raf.batchedUpdates(() => this.advance());
        becomeIdle(this);
      } else {
        frameLoop.start(this);
      }
    }
  }
  _attach() {
    let priority = 1;
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        addFluidObserver(source, this);
      }
      if (isFrameValue(source)) {
        if (!source.idle) {
          this._active.add(source);
        }
        priority = Math.max(priority, source.priority + 1);
      }
    });
    this.priority = priority;
    this._start();
  }
  _detach() {
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        removeFluidObserver(source, this);
      }
    });
    this._active.clear();
    becomeIdle(this);
  }
  eventObserved(event) {
    if (event.type == "change") {
      if (event.idle) {
        this.advance();
      } else {
        this._active.add(event.parent);
        this._start();
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else if (event.type == "priority") {
      this.priority = toArray(this.source).reduce((highest, parent) => Math.max(highest, (isFrameValue(parent) ? parent.priority : 0) + 1), 0);
    }
  }
}
function isIdle(source) {
  return source.idle !== false;
}
function checkIdle(active) {
  return !active.size || Array.from(active).every(isIdle);
}
function becomeIdle(self) {
  if (!self.idle) {
    self.idle = true;
    each(getPayload(self), (node) => {
      node.done = true;
    });
    callFluidObservers(self, {
      type: "idle",
      parent: self
    });
  }
}

globals.assign({
  createStringInterpolator: createStringInterpolator$1,
  to: (source, args) => new Interpolation(source, args)
});

const isCustomPropRE = /^--/;
function dangerousStyleValue(name, value) {
  if (value == null || typeof value === "boolean" || value === "")
    return "";
  if (typeof value === "number" && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]))
    return value + "px";
  return ("" + value).trim();
}
const attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }
  const isFilterElement = instance.nodeName === "filter" || instance.parentNode && instance.parentNode.nodeName === "filter";
  const {style, children, scrollTop, scrollLeft, ...attributes} = props;
  const values = Object.values(attributes);
  const names = Object.keys(attributes).map((name) => isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, (n) => "-" + n.toLowerCase())));
  if (children !== void 0) {
    instance.textContent = children;
  }
  for (let name in style) {
    if (style.hasOwnProperty(name)) {
      const value = dangerousStyleValue(name, style[name]);
      if (name === "float")
        name = "cssFloat";
      else if (isCustomPropRE.test(name)) {
        instance.style.setProperty(name, value);
      } else {
        instance.style[name] = value;
      }
    }
  }
  names.forEach((name, i) => {
    instance.setAttribute(name, values[i]);
  });
  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop;
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft;
  }
}
let isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
const prefixKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.substring(1);
const prefixes = ["Webkit", "Ms", "Moz", "O"];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach((prefix) => acc[prefixKey(prefix, prop)] = acc[prop]);
  return acc;
}, isUnitlessNumber);

const domTransforms = /^(matrix|translate|scale|rotate|skew)/;
const pxTransforms = /^(translate)/;
const degTransforms = /^(rotate|skew)/;
const addUnit = (value, unit) => is.num(value) && value !== 0 ? value + unit : value;
const isValueIdentity = (value, id) => is.arr(value) ? value.every((v) => isValueIdentity(v, id)) : is.num(value) ? value === id : parseFloat(value) === id;
class AnimatedStyle extends AnimatedObject {
  constructor({x, y, z, ...style}) {
    const inputs = [];
    const transforms = [];
    if (x || y || z) {
      inputs.push([x || 0, y || 0, z || 0]);
      transforms.push((xyz) => [
        `translate3d(${xyz.map((v) => addUnit(v, "px")).join(",")})`,
        isValueIdentity(xyz, 0)
      ]);
    }
    eachProp(style, (value, key) => {
      if (key === "transform") {
        inputs.push([value || ""]);
        transforms.push((transform) => [transform, transform === ""]);
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (is.und(value))
          return;
        const unit = pxTransforms.test(key) ? "px" : degTransforms.test(key) ? "deg" : "";
        inputs.push(toArray(value));
        transforms.push(key === "rotate3d" ? ([x2, y2, z2, deg]) => [
          `rotate3d(${x2},${y2},${z2},${addUnit(deg, unit)})`,
          isValueIdentity(deg, 0)
        ] : (input) => [
          `${key}(${input.map((v) => addUnit(v, unit)).join(",")})`,
          isValueIdentity(input, key.startsWith("scale") ? 1 : 0)
        ]);
      }
    });
    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }
    super(style);
  }
}
class FluidTransform extends FluidValue {
  constructor(inputs, transforms) {
    super();
    this.inputs = inputs;
    this.transforms = transforms;
    this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let transform = "";
    let identity = true;
    each(this.inputs, (input, i) => {
      const arg1 = getFluidValue(input[0]);
      const [t, id] = this.transforms[i](is.arr(arg1) ? arg1 : input.map(getFluidValue));
      transform += " " + t;
      identity = identity && id;
    });
    return identity ? "none" : transform;
  }
  observerAdded(count) {
    if (count == 1)
      each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && addFluidObserver(value, this)));
  }
  observerRemoved(count) {
    if (count == 0)
      each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && removeFluidObserver(value, this)));
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._value = null;
    }
    callFluidObservers(this, event);
  }
}

const primitives = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];

globals.assign({
  batchedUpdates: reactDom.unstable_batchedUpdates,
  createStringInterpolator: createStringInterpolator$1,
  colors: colors$1
});
const host = createHost(primitives, {
  applyAnimatedValues: applyAnimatedValues,
  createAnimatedStyle: (style) => new AnimatedStyle(style),
  getComponentProps: ({scrollTop, scrollLeft, ...props}) => props
});
const animated = host.animated;

export { Spring, animated, useChain, useSpring, useTransition };
