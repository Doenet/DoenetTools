var e = function(e2, n2) {
  let t2 = e2.match("#Value+? #Money+ #Currency+ (and #Money+ #Currency+)+?");
  return e2.match("#Money").forEach((e3) => {
    e3.lookAfter("#Currency").found || (t2 = t2.concat(e3));
  }), typeof n2 == "number" && (t2 = t2.get(n2)), t2;
};
const n = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty";
var t = function(e2, t2) {
  let r2 = e2.match("#Value+");
  if (r2.has("#NumericValue #NumericValue") && (r2.has("#Value @hasComma #Value") ? r2.splitAfter("@hasComma") : r2.has("#NumericValue #Fraction") ? r2.splitAfter("#NumericValue #Fraction") : r2 = r2.splitAfter("#NumericValue")), r2.has("#Value #Value #Value") && !r2.has("#Multiple") && r2.has("(" + n + ") #Cardinal #Cardinal") && (r2 = r2.splitAfter("(" + n + ") #Cardinal")), r2.has("#Value #Value")) {
    r2.has("#NumericValue #NumericValue") && (r2 = r2.splitOn("#Year")), r2.has("(" + n + ") (eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)") && (r2 = r2.splitAfter("(" + n + ")"));
    let e3 = r2.match("#Cardinal #Cardinal");
    if (e3.found && !r2.has("(point|decimal|#Fraction)") && !e3.has("#Cardinal (#Multiple|point|decimal)")) {
      let t3 = r2.has(`(one|two|three|four|five|six|seven|eight|nine) (${n})`), a2 = e3.has("(" + n + ") #Cardinal"), i2 = e3.has("#Multiple #Value");
      t3 || a2 || i2 || e3.terms().forEach((e4) => {
        r2 = r2.splitOn(e4);
      });
    }
    r2.match("#Ordinal #Ordinal").match("#TextValue").found && !r2.has("#Multiple") && (r2.has("(" + n + ") #Ordinal") || (r2 = r2.splitAfter("#Ordinal"))), r2.has("#Ordinal #Cardinal") && (r2 = r2.splitBefore("#Cardinal+")), r2.has("#TextValue #NumericValue") && !r2.has("(" + n + "|#Multiple)") && (r2 = r2.splitBefore("#NumericValue+"));
  }
  return r2.has("#NumberRange") && (r2 = r2.splitAfter("#NumberRange")), typeof t2 == "number" && (r2 = r2.get(t2)), r2;
};
var r = function(e2, n2) {
  let t2 = e2.match("#Fraction+");
  return t2 = t2.filter((e3) => !e3.lookBehind("#Value and$").found), typeof n2 == "number" && (t2 = t2.eq(n2)), t2;
};
var a = function(e2, n2) {
  let t2 = e2.match("#Percent+");
  return t2 = t2.concat(e2.match("[#Cardinal] percent", 0)), typeof n2 == "number" && (t2 = t2.eq(n2)), t2;
};
var i = {ones: {zeroth: 0, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9}, teens: {tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19}, tens: {twentieth: 20, thirtieth: 30, fortieth: 40, fourtieth: 40, fiftieth: 50, sixtieth: 60, seventieth: 70, eightieth: 80, ninetieth: 90, twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90}, multiples: {hundredth: 100, thousandth: 1e3, millionth: 1e6, billionth: 1e9, trillionth: 1e12, quadrillionth: 1e15, quintillionth: 1e18, sextillionth: 1e21, septillionth: 1e24, hundred: 100, thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12, quadrillion: 1e15, quintillion: 1e18, sextillion: 1e21, septillion: 1e24, grand: 1e3}};
const s = i;
const o = i;
const u = (e2) => {
  const n2 = [{reg: /^(minus|negative)[\s\-]/i, mult: -1}, {reg: /^(a\s)?half[\s\-](of\s)?/i, mult: 0.5}];
  for (let t2 = 0; t2 < n2.length; t2++)
    if (n2[t2].reg.test(e2) === true)
      return {amount: n2[t2].mult, str: e2.replace(n2[t2].reg, "")};
  return {amount: 1, str: e2};
}, l = i, m = (e2, n2) => {
  if (s.ones.hasOwnProperty(e2)) {
    if (n2.ones || n2.teens)
      return false;
  } else if (s.teens.hasOwnProperty(e2)) {
    if (n2.ones || n2.teens || n2.tens)
      return false;
  } else if (s.tens.hasOwnProperty(e2) && (n2.ones || n2.teens || n2.tens))
    return false;
  return true;
}, c = function(e2) {
  let n2 = "0.";
  for (let t2 = 0; t2 < e2.length; t2++) {
    let r2 = e2[t2];
    if (o.ones.hasOwnProperty(r2) === true)
      n2 += o.ones[r2];
    else if (o.teens.hasOwnProperty(r2) === true)
      n2 += o.teens[r2];
    else if (o.tens.hasOwnProperty(r2) === true)
      n2 += o.tens[r2];
    else {
      if (/^[0-9]$/.test(r2) !== true)
        return 0;
      n2 += r2;
    }
  }
  return parseFloat(n2);
}, h = (e2) => e2 = (e2 = (e2 = (e2 = (e2 = (e2 = (e2 = (e2 = e2.replace(/1st$/, "1")).replace(/2nd$/, "2")).replace(/3rd$/, "3")).replace(/([4567890])r?th$/, "$1")).replace(/^[$€¥£¢]/, "")).replace(/[%$€¥£¢]$/, "")).replace(/,/g, "")).replace(/([0-9])([a-z\u00C0-\u00FF]{1,2})$/, "$1"), f = /^([0-9,\. ]+)\/([0-9,\. ]+)$/, d = {"a few": 3, "a couple": 2, "a dozen": 12, "two dozen": 24, zero: 0}, y = (e2) => Object.keys(e2).reduce((n2, t2) => n2 += e2[t2], 0);
var p = function(e2) {
  if (d.hasOwnProperty(e2) === true)
    return d[e2];
  if (e2 === "a" || e2 === "an")
    return 1;
  const n2 = u(e2);
  let t2 = null, r2 = {}, a2 = 0, i2 = false;
  const s2 = (e2 = n2.str).split(/[ -]/);
  for (let e3 = 0; e3 < s2.length; e3++) {
    let o2 = s2[e3];
    if (o2 = h(o2), !o2 || o2 === "and")
      continue;
    if (o2 === "-" || o2 === "negative") {
      i2 = true;
      continue;
    }
    if (o2.charAt(0) === "-" && (i2 = true, o2 = o2.substr(1)), o2 === "point")
      return a2 += y(r2), a2 += c(s2.slice(e3 + 1, s2.length)), a2 *= n2.amount, a2;
    const u2 = o2.match(f);
    if (u2) {
      const e4 = parseFloat(u2[1].replace(/[, ]/g, "")), n3 = parseFloat(u2[2].replace(/[, ]/g, ""));
      n3 && (a2 += e4 / n3 || 0);
    } else {
      if (l.tens.hasOwnProperty(o2) && r2.ones && Object.keys(r2).length === 1 && (a2 = 100 * r2.ones, r2 = {}), m(o2, r2) === false)
        return null;
      if (/^[0-9\.]+$/.test(o2))
        r2.ones = parseFloat(o2);
      else if (l.ones.hasOwnProperty(o2) === true)
        r2.ones = l.ones[o2];
      else if (l.teens.hasOwnProperty(o2) === true)
        r2.teens = l.teens[o2];
      else if (l.tens.hasOwnProperty(o2) === true)
        r2.tens = l.tens[o2];
      else if (l.multiples.hasOwnProperty(o2) === true) {
        let n3 = l.multiples[o2];
        if (n3 === t2)
          return null;
        if (n3 === 100 && s2[e3 + 1] !== void 0) {
          const t3 = s2[e3 + 1];
          l.multiples[t3] && (n3 *= l.multiples[t3], e3 += 1);
        }
        t2 === null || n3 < t2 ? (a2 += (y(r2) || 1) * n3, t2 = n3, r2 = {}) : (a2 += y(r2), t2 = n3, a2 = (a2 || 1) * n3, r2 = {});
      }
    }
  }
  return a2 += y(r2), a2 *= n2.amount, a2 *= i2 ? -1 : 1, a2 === 0 && Object.keys(r2).length === 0 ? null : a2;
};
const b = /s$/, g = p, x = function(e2) {
  let n2 = e2.text("reduced");
  return g(n2);
};
let $ = {half: 2, halve: 2, quarter: 4};
var v = function(e2) {
  let n2 = function(e3) {
    let n3 = e3.text("reduced");
    return $.hasOwnProperty(n3) ? {numerator: 1, denominator: $[n3]} : null;
  }(e2 = e2.clone()) || function(e3) {
    let n3 = e3.text("reduced").match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
    return n3 && n3[1] && n3[0] ? {numerator: Number(n3[1]), denominator: Number(n3[2])} : null;
  }(e2) || function(e3) {
    let n3 = e3.match("[<num>#Value+] out of every? [<den>#Value+]");
    if (n3.found !== true)
      return null;
    let {num: t2, den: r2} = n3.groups();
    return t2 && r2 ? (t2 = x(t2), r2 = x(r2), typeof t2 == "number" && typeof r2 == "number" ? {numerator: t2, denominator: r2} : null) : null;
  }(e2) || function(e3) {
    let n3 = e3.match("[<num>(#Cardinal|a)+] [<dem>#Fraction+]");
    if (n3.found !== true)
      return null;
    let {num: t2, dem: r2} = n3.groups();
    t2 = t2.has("a") ? 1 : x(t2);
    let a2 = r2.text("reduced");
    return b.test(a2) && (a2 = a2.replace(b, ""), r2.replaceWith(a2)), r2 = $.hasOwnProperty(a2) ? $[a2] : x(r2), typeof t2 == "number" && typeof r2 == "number" ? {numerator: t2, denominator: r2} : null;
  }(e2) || function(e3) {
    let n3 = e3.match("^#Ordinal$");
    if (n3.found !== true)
      return null;
    if (e3.lookAhead("^of ."))
      return {numerator: 1, denominator: x(n3)};
    return null;
  }(e2) || null;
  return n2 !== null && n2.numerator && n2.denominator && (n2.decimal = n2.numerator / n2.denominator, n2.decimal = ((e3) => {
    let n3 = Math.round(1e3 * e3) / 1e3;
    return n3 === 0 && e3 !== 0 ? e3 : n3;
  })(n2.decimal)), n2;
};
const w = p, k = v;
var C = function(e2) {
  let n2 = e2.text("reduced"), t2 = /[0-9],[0-9]/.test(e2.text("text")), r2 = function(e3, n3, t3) {
    let r3 = (e3 = e3.replace(/,/g, "")).split(/^([^0-9]*)([0-9.,]*)([^0-9]*)$/);
    if (r3 && r3[2] && n3.terms().length < 2) {
      let n4 = parseFloat(r3[2] || e3);
      typeof n4 != "number" && (n4 = null);
      let a3 = r3[3] || "";
      return a3 !== "st" && a3 !== "nd" && a3 !== "rd" && a3 !== "th" || (a3 = ""), a3 !== "m" && a3 !== "M" || (n4 *= 1e6, a3 = ""), a3 !== "k" && a3 !== "k" || (n4 *= 1e3, a3 = ""), n4 = t3 ? 1 / n4 : n4, {prefix: r3[1] || "", num: n4, suffix: a3};
    }
    return null;
  }(n2, e2);
  if (r2 !== null)
    return r2.hasComma = t2, r2;
  let a2 = e2.match("#Fraction #Fraction+$");
  a2 = a2.found === false ? e2.match("^#Fraction$") : a2;
  let i2 = null;
  a2.found && (i2 = k(a2), n2 = (e2 = (e2 = e2.not(a2)).not("and$")).text("reduced"));
  let s2 = 0;
  return n2 && (s2 = w(n2) || 0), i2 && i2.decimal && (s2 += i2.decimal), {hasComma: t2, prefix: "", num: s2, suffix: ""};
};
var O = function(e2) {
  if (e2 < 1e6)
    return String(e2);
  let n2;
  return n2 = typeof e2 == "number" ? e2.toFixed(0) : e2, n2.indexOf("e+") === -1 ? n2 : n2.replace(".", "").split("e+").reduce(function(e3, n3) {
    return e3 + Array(n3 - e3.length + 2).join(0);
  });
};
const V = O, F = [["ninety", 90], ["eighty", 80], ["seventy", 70], ["sixty", 60], ["fifty", 50], ["forty", 40], ["thirty", 30], ["twenty", 20]], M = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], E = [[1e24, "septillion"], [1e20, "hundred sextillion"], [1e21, "sextillion"], [1e20, "hundred quintillion"], [1e18, "quintillion"], [1e17, "hundred quadrillion"], [1e15, "quadrillion"], [1e14, "hundred trillion"], [1e12, "trillion"], [1e11, "hundred billion"], [1e9, "billion"], [1e8, "hundred million"], [1e6, "million"], [1e5, "hundred thousand"], [1e3, "thousand"], [100, "hundred"], [1, "one"]], N = function(e2) {
  let n2 = [];
  if (e2 > 100)
    return n2;
  for (let t2 = 0; t2 < F.length; t2++)
    e2 >= F[t2][1] && (e2 -= F[t2][1], n2.push(F[t2][0]));
  return M[e2] && n2.push(M[e2]), n2;
};
var P = function(e2) {
  if (e2 === 0 || e2 === "0")
    return "zero";
  e2 > 1e21 && (e2 = V(e2));
  let n2 = [];
  e2 < 0 && (n2.push("minus"), e2 = Math.abs(e2));
  let t2 = function(e3) {
    let n3 = e3, t3 = [];
    return E.forEach((r2) => {
      if (e3 >= r2[0]) {
        let e4 = Math.floor(n3 / r2[0]);
        n3 -= e4 * r2[0], e4 && t3.push({unit: r2[1], count: e4});
      }
    }), t3;
  }(e2);
  for (let e3 = 0; e3 < t2.length; e3++) {
    let r2 = t2[e3].unit;
    r2 === "one" && (r2 = "", n2.length > 1 && n2.push("and")), n2 = n2.concat(N(t2[e3].count)), n2.push(r2);
  }
  return n2 = n2.concat(((e3) => {
    const n3 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    let t3 = [], r2 = V(e3).match(/\.([0-9]+)/);
    if (!r2 || !r2[0])
      return t3;
    t3.push("point");
    let a2 = r2[0].split("");
    for (let e4 = 0; e4 < a2.length; e4++)
      t3.push(n3[a2[e4]]);
    return t3;
  })(e2)), n2 = n2.filter((e3) => e3), n2.length === 0 && (n2[0] = ""), n2.join(" ");
};
const z = O;
const A = P, j = {one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth", twenty: "twentieth", thirty: "thirtieth", forty: "fortieth", fourty: "fourtieth", fifty: "fiftieth", sixty: "sixtieth", seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth"};
var q = (e2) => {
  let n2 = A(e2).split(" "), t2 = n2[n2.length - 1];
  return j.hasOwnProperty(t2) ? n2[n2.length - 1] = j[t2] : n2[n2.length - 1] = t2.replace(/y$/, "i") + "th", n2.join(" ");
};
var S = {prefixes: {"¢": "cents", $: "dollars", "£": "pounds", "¥": "yen", "€": "euros", "₡": "colón", "฿": "baht", "₭": "kip", "₩": "won", "₹": "rupees", "₽": "ruble", "₺": "liras"}, suffixes: {"%": "percent", s: "seconds", cm: "centimetres", km: "kilometres"}};
const T = O, R = P, L = function(e2) {
  if (!e2 && e2 !== 0)
    return null;
  let n2 = e2 % 100;
  if (n2 > 10 && n2 < 20)
    return String(e2) + "th";
  const t2 = {0: "th", 1: "st", 2: "nd", 3: "rd"};
  let r2 = z(e2), a2 = r2.slice(r2.length - 1, r2.length);
  return r2 += t2[a2] ? t2[a2] : "th", r2;
}, W = q, B = S.prefixes, D = S.suffixes, U = {usd: true, eur: true, jpy: true, gbp: true, cad: true, aud: true, chf: true, cny: true, hkd: true, nzd: true, kr: true, rub: true}, K = function(e2) {
  return B.hasOwnProperty(e2.prefix) && (e2.suffix += B[e2.prefix], e2.prefix = ""), D.hasOwnProperty(e2.suffix) && (e2.suffix = D[e2.suffix]), U.hasOwnProperty(e2.suffix) && (e2.suffix = e2.suffix.toUpperCase()), e2.suffix && (e2.suffix = " " + e2.suffix), e2;
};
var Y = function(e2, n2, t2) {
  let r2 = String(e2.num);
  return n2 ? (e2 = K(e2), t2 ? (r2 = W(r2), `${e2.prefix || ""}${r2}${e2.suffix || ""}`) : (r2 = R(r2), `${e2.prefix || ""}${r2}${e2.suffix || ""}`)) : t2 ? (r2 = L(r2), `${(e2 = K(e2)).prefix || ""}${r2}${e2.suffix || ""}`) : (e2.hasComma === true && (r2 = e2.num.toLocaleString()), r2 = T(r2), `${e2.prefix || ""}${r2}${e2.suffix || ""}`);
};
const G = C, H = function(e2, n2, t2) {
  if (e2 === false)
    return;
  let r2 = n2.lookAhead("^(#Unit|#Noun)");
  r2.has("(#Address|#Money|#Percent)") || n2.has("#Ordinal") || (t2.num === 1 ? r2.nouns().toSingular() : r2.has("#Singular") && r2.nouns().toPlural());
}, I = Y, Q = p;
let Z = {json: function(e2) {
  let n2 = null;
  typeof e2 == "number" && (n2 = e2, e2 = null), e2 = e2 || {text: true, normal: true, trim: true, terms: true};
  let t2 = [];
  return this.forEach((n3) => {
    let r2 = n3.json(e2)[0], a2 = G(n3);
    r2.prefix = a2.prefix, r2.number = a2.num, r2.suffix = a2.suffix, r2.cardinal = I(a2, false, false), r2.ordinal = I(a2, false, true), r2.textCardinal = I(a2, true, false), r2.textOrdinal = I(a2, true, true), t2.push(r2);
  }), n2 !== null ? t2[n2] : t2;
}, units: function() {
  let e2 = this.lookAhead("(#Unit|#Noun)+");
  return e2 = e2.splitAfter("@hasComma").first(), e2 = e2.not("#Pronoun"), e2.first();
}, isOrdinal: function() {
  return this.if("#Ordinal");
}, isCardinal: function() {
  return this.if("#Cardinal");
}, toNumber: function() {
  return this.forEach((e2) => {
    let n2 = G(e2);
    if (n2.num === null)
      return;
    let t2 = I(n2, false, e2.has("#Ordinal"));
    e2.replaceWith(t2, true), e2.tag("NumericValue");
  }), this;
}, toLocaleString: function() {
  return this.forEach((e2) => {
    let n2 = G(e2);
    if (n2.num === null)
      return;
    n2.num = n2.num.toLocaleString();
    let t2 = I(n2, false, e2.has("#Ordinal"));
    e2.replaceWith(t2, true);
  }), this;
}, toText: function() {
  return this.forEach((e2) => {
    let n2 = G(e2);
    if (n2.num === null)
      return;
    let t2 = I(n2, true, e2.has("#Ordinal"));
    e2.replaceWith(t2, true), e2.tag("TextValue");
  }), this;
}, toCardinal: function(e2) {
  return this.if("#Ordinal").forEach((n2) => {
    let t2 = G(n2);
    if (t2.num === null)
      return;
    let r2 = I(t2, n2.has("#TextValue"), false);
    if (n2.has("#NumberRange")) {
      let e3 = n2.termList()[0];
      e3.text && e3.post === "" && (e3.post = " ");
    }
    n2.replaceWith(r2, true), n2.tag("Cardinal"), H(e2, n2, t2);
  }), this;
}, toOrdinal: function() {
  return this.if("#Cardinal").forEach((e2) => {
    let n2 = G(e2);
    if (n2.num === null)
      return;
    let t2 = I(n2, e2.has("#TextValue"), true);
    if (e2.has("#NumberRange")) {
      let n3 = e2.termList()[0];
      n3.text && n3.post === "" && (n3.post = " ");
    }
    e2.replaceWith(t2, true), e2.tag("Ordinal");
    let r2 = this.lookAhead("^#Plural");
    r2.found && r2.nouns().toSingular();
  }), this;
}, isEqual: function(e2) {
  return this.filter((n2) => G(n2).num === e2);
}, greaterThan: function(e2) {
  return this.filter((n2) => G(n2).num > e2);
}, lessThan: function(e2) {
  return this.filter((n2) => G(n2).num < e2);
}, between: function(e2, n2) {
  return this.filter((t2) => {
    let r2 = G(t2).num;
    return r2 > e2 && r2 < n2;
  });
}, set: function(e2, n2) {
  return e2 === void 0 || (typeof e2 == "string" && (e2 = Q(e2)), this.forEach((t2) => {
    let r2 = G(t2);
    if (r2.num = e2, r2.num === null)
      return;
    let a2 = I(r2, t2.has("#TextValue"), t2.has("#Ordinal"));
    (t2 = t2.not("#Currency")).replaceWith(a2, true), H(n2, t2, r2);
  })), this;
}, add: function(e2, n2) {
  return e2 ? (typeof e2 == "string" && (e2 = Q(e2)), this.forEach((t2) => {
    let r2 = G(t2);
    if (r2.num === null)
      return;
    r2.num += e2;
    let a2 = I(r2, t2.has("#TextValue"), t2.has("#Ordinal"));
    (t2 = t2.not("#Currency")).replaceWith(a2, true), H(n2, t2, r2);
  }), this) : this;
}, subtract: function(e2, n2) {
  return this.add(-1 * e2, n2);
}, increment: function(e2) {
  return this.add(1, e2), this;
}, decrement: function(e2) {
  return this.add(-1, e2), this;
}, romanNumerals: function(e2) {
  let n2 = this.match("#RomanNumeral").numbers();
  return typeof e2 == "number" && (n2 = n2.get(e2)), n2;
}, normalize: function() {
  const e2 = {"%": true};
  return this.forEach((n2) => {
    let t2 = G(n2);
    if (t2.num !== null && t2.suffix && e2[t2.suffix] !== true) {
      let e3 = t2.prefix || "";
      n2 = n2.replaceWith(e3 + t2.num + " " + t2.suffix);
    }
  }), this;
}, get: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    n2.push(G(e3).num);
  }), e2 !== void 0 ? n2[e2] || null : n2 || null;
}};
Z.toNice = Z.toLocaleString, Z.isBetween = Z.between, Z.minus = Z.subtract, Z.plus = Z.add, Z.equals = Z.isEqual;
var J = Z;
const X = C, _ = function(e2) {
  let n2 = X(e2).num;
  return typeof n2 == "number" ? n2 / 100 : null;
};
var ee = {get: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    let t2 = _(e3);
    t2 !== null && n2.push(t2);
  }), e2 !== void 0 ? n2[e2] || null : n2 || null;
}, json: function(e2) {
  let n2 = null;
  typeof e2 == "number" && (n2 = e2, e2 = null), e2 = e2 || {text: true, normal: true, trim: true, terms: true};
  let t2 = [];
  return this.forEach((n3) => {
    let r2 = n3.json(e2)[0], a2 = _(n3);
    if (r2.number = a2, a2 !== null) {
      let e3 = 100 * a2;
      r2.textNumber = `${e3} percent`, r2.cardinal = `${e3}%`;
    }
    t2.push(r2);
  }), n2 !== null ? t2[n2] || {} : t2;
}, toFraction: function() {
  return this.forEach((e2) => {
    let n2 = _(e2);
    if (n2 !== null) {
      n2 *= 100, n2 = Math.round(100 * n2) / 100;
      let t2 = `${n2}/100`;
      this.replace(e2, t2);
    }
  }), this;
}}, ne = [{dem: "american", name: "dollar", iso: "usd", sub: "cent", sym: ["$", "US$", "U$"]}, {name: "euro", iso: "eur", sub: "cent", sym: ["€"]}, {dem: "british", name: "pound", iso: "gbp", sub: "penny", alias: {sterling: true}, sym: ["£"]}, {name: "renminbi", iso: "cny", plural: "yuán", alias: {yuan: true}, sym: ["元"]}, {dem: "japanese", name: "yen", iso: "jpy", sub: "sen", sym: ["¥", "円", "圓"]}, {dem: "swedish", name: "krona", iso: "sek", sub: "öre", alias: {ore: true, kronor: true}, sym: ["kr"]}, {dem: "estonian", name: "kroon", iso: "eek", sub: "sent", sym: ["kr"]}, {dem: "norwegian", name: "krone", iso: "nok", sub: "øre", sym: ["kr"]}, {dem: "icelandic", name: "króna", iso: "isk", sym: ["kr"]}, {dem: "danish", name: "krone", iso: "dkk", sub: "øre", sym: ["kr."]}, {dem: "zambian", name: "kwacha", iso: "zmw", sub: "ngwee", sym: ["K"]}, {dem: "malawian", name: "kwacha", iso: "mwk", sub: "tambala", sym: ["K"]}, {dem: "greek", name: "drachma", iso: "grd", sub: "leptοn", sym: ["Δρχ.", "Δρ.", "₯"]}, {dem: "eastern caribbean", name: "dollar", iso: "xcd", sub: "cent", sym: ["$"]}, {dem: "finnish", name: "markka", iso: "fim", sub: "penni", sym: ["mk"]}, {dem: "polish", name: "złoty", iso: "pln", sub: "grosz", sym: ["zł"]}, {dem: "slovenian", name: "tolar", iso: "sit", sub: "stotin", sym: []}, {dem: "australian", name: "dollar", iso: "aud", sub: "cent", sym: ["$", "A$", "AU$"]}, {dem: "deutsche", name: "mark", iso: "dem", sub: "pfennig", sym: ["DM"]}, {dem: "thai", name: "baht", iso: "thb", sub: "satang", sym: ["฿"]}, {dem: "canadian", name: "dollar", iso: "cad", sub: "cent", sym: ["$", "Can$", "C$", "CA$", "CAD"]}, {dem: "mexican", name: "peso", iso: "mxn", sub: "centavo", sym: ["$", "Mex$"]}, {dem: "spanish", name: "peseta", iso: "esp", sub: "céntimo", sym: ["Pta"]}, {dem: "new zealand", name: "dollar", iso: "nzd", sub: "cent", sym: ["$", "NZ$"]}, {dem: "chilean", name: "peso", iso: "clp", sub: "centavo", sym: ["Cifrão", "$"]}, {dem: "nigerian", name: "naira", iso: "ngn", sub: "kobo", sym: ["₦"]}, {dem: "austrian", name: "schilling", iso: "ats", sub: "groschen", sym: ["S", "öS"]}, {dem: "guatemalan", name: "quetzal", iso: "gtq", sub: "centavo", sym: ["Q"]}, {dem: "philippine", name: "peso", iso: "php", sub: "sentimo", sym: ["₱"]}, {dem: "hungarian", name: "forint", iso: "huf", sym: ["Ft"]}, {dem: "russian", name: "ruble", iso: "rub", sub: "kopeyka", sym: ["₽", "руб", "р."]}, {dem: "kuwaiti", name: "dinar", iso: "kwd", sub: "fils", sym: ["د.ك", "KD"]}, {dem: "israeli", name: "new shekel", iso: "ils", sub: "agora", sym: ["₪"]}, {dem: "latvian", name: "lats", iso: "lvl", sub: "santīms", sym: ["Ls"]}, {dem: "kazakhstani", name: "tenge", iso: "kzt", sub: "tıyn", sym: ["₸"]}, {dem: "iraqi", name: "dinar", iso: "iqd", sub: "fils", sym: ["د.ع"]}, {dem: "bahamian", name: "dollar", iso: "bsd", sub: "cent", sym: ["$", "B$"]}, {dem: "seychellois", name: "rupee", iso: "scr", sub: "cent", sym: ["SCR", "SR"]}, {dem: "albanian", name: "lek", iso: "all", sub: "qindarkë", sym: ["L"]}, {dem: "bulgarian", name: "lev", iso: "bgn", sub: "stotinka", sym: ["лв."]}, {dem: "irish", name: "pound", iso: "iep", sym: ["£", "IR£"]}, {name: "cfp franc", iso: "xpf", sym: ["f"]}, {dem: "south african", name: "rand", iso: "zar", sub: "cent", sym: ["R"]}, {dem: "south korean", name: "won", iso: "krw", sub: "jeon", plural: "won", sym: ["₩"]}, {dem: "north korean", name: "won", iso: "kpw", sub: "chon", plural: "won", sym: ["₩"]}, {dem: "portuguese", name: "escudo", iso: "pte", sub: "centavo", sym: []}, {dem: "ghanaian", name: "cedi", iso: "ghs", sub: "pesewa", sym: ["GH₵"]}, {dem: "hong kong", name: "dollar", iso: "hkd", sub: "毫", sym: ["$"]}, {dem: "new taiwan", name: "dollar", iso: "twd", sub: "dime", sym: ["NT$"]}, {dem: "east german", name: "mark", iso: "ddm", sub: "pfennig", sym: ["M"]}, {dem: "namibian", name: "dollar", iso: "nad", sub: "cent", sym: ["$"]}, {dem: "malaysian", name: "ringgit", iso: "myr", sub: "sen", sym: ["RM"]}, {dem: "swiss", name: "franc", iso: "chf", sym: ["Rp."]}, {dem: "panamanian", name: "balboa", iso: "pab", sub: "centésimo", sym: ["B/."]}, {dem: "indonesian", name: "rupiah", iso: "idr", sub: "sen", sym: ["Rp"]}, {dem: "brunei", name: "dollar", iso: "bnd", sub: "sen", sym: ["$", "B$"]}, {dem: "venezuelan", name: "bolívar", iso: "vef", sub: "céntimo", sym: ["Bs.F", "Bs."]}, {dem: "macedonian", name: "denar", iso: "mkd", sub: "deni", sym: ["den"]}, {dem: "mauritanian", name: "ouguiya", iso: "mru", sub: "khoums", sym: ["UM"]}, {dem: "argentine", name: "peso", iso: "ars", sub: "centavo", sym: ["$"]}, {dem: "libyan", name: "dinar", iso: "lyd", sub: "dirham", sym: ["LD", "ل.د"]}, {dem: "jordanian", name: "dinar", iso: "jod", sub: "dirham", sym: ["د.أ"]}, {dem: "french", name: "franc", iso: "frf", sub: "centime", sym: ["F", "Fr", "FF", "₣"]}, {dem: "syrian", name: "pound", iso: "syp", sub: "piastre", sym: ["LS", "£S"]}, {dem: "belize", name: "dollar", iso: "bzd", sub: "cent", sym: ["$"]}, {dem: "saudi", name: "riyal", iso: "sar", sub: "halalah", sym: ["SAR", "ر.س", " ﷼"]}, {dem: "surinamese", name: "dollar", iso: "srd", sub: "cent", sym: ["$"]}, {dem: "singapore", name: "dollar", iso: "sgd", sub: "cent", sym: ["S$", "$"]}, {dem: "nepalese", name: "rupee", iso: "npr", sub: "paisa", sym: ["रु ₨", "Re"]}, {dem: "nicaraguan", name: "córdoba", iso: "nio", sub: "centavo", sym: ["C$"]}, {dem: "bangladeshi", name: "taka", iso: "bdt", sub: "poysha", sym: ["৳"]}, {dem: "indian", name: "rupee", iso: "inr", sub: "paisa", sym: ["₹"]}, {dem: "maldivian", name: "rufiyaa", iso: "mvr", sub: "laari", sym: ["Rf", "MRf", "MVR", ".ރ "]}, {dem: "sri lankan", name: "rupee", iso: "lkr", sub: "cents", sym: ["Rs", "රු", "ரூ"]}, {dem: "bhutanese", name: "ngultrum", iso: "btn", sub: "chhertum", sym: ["Nu."]}, {dem: "turkish", name: "lira", iso: "try", sub: "kuruş", sym: ["YTL"]}, {dem: "serbian", name: "dinar", iso: "rsd", sub: "para", sym: ["din", "дин"]}, {dem: "bosnia and herzegovina", name: "convertible mark", iso: "bam", sub: "fening", sym: ["KM"]}, {dem: "botswana", name: "pula", iso: "bwp", sub: "thebe", sym: ["p"]}, {dem: "swazi", name: "lilangeni", iso: "szl", sub: "cent", sym: ["L", "E"]}, {dem: "lithuanian", name: "litas", iso: "ltl", sub: "centas", sym: ["Lt", "ct"]}, {dem: "mauritian", name: "rupee", iso: "mur", sub: "cent", sym: ["₨"]}, {dem: "pakistani", name: "rupee", iso: "pkr", sub: "paisa", sym: ["₨"]}, {dem: "maltese", name: "lira", iso: "mtl", sub: "cent", sym: ["₤", "Lm"]}, {dem: "cypriot", name: "pound", iso: "cyp", sub: "cent", sym: ["£"]}, {dem: "moldovan", name: "leu", iso: "mdl", sym: ["l"]}, {dem: "croatian", name: "kuna", iso: "hrk", sub: "lipa", sym: ["kn"]}, {dem: "afghan", name: "afghani", iso: "afn", sub: "pul", sym: ["؋", "Af", "Afs"]}, {dem: "ecuadorian", name: "sucre", iso: "ecs", sub: "centavo", sym: ["S/."]}, {dem: "sierra leonean", name: "leone", iso: "sll", sub: "cent", sym: ["Le"]}];
const te = ne, re = C, ae = {};
let ie = {};
te.forEach((e2) => {
  e2.sym.forEach((n2) => {
    ae[n2] = ae[n2] || e2.iso;
  }), ae[e2.iso] = ae[e2.iso] || e2.iso, e2.sub && (ie[e2.sub] = true);
});
let se = `(${Object.keys(ie).join("|")})`;
const oe = Y, ue = function(e2) {
  let n2 = 0, t2 = e2.match(`and #Money+ ${se}`);
  if (t2.found) {
    e2 = e2.not(t2);
    let r3 = re(t2.match("#Value+"));
    r3 && r3.num && (n2 = r3.num / 100);
  }
  let r2 = re(e2), a2 = r2.num || 0;
  a2 += n2;
  let i2 = ((s2 = r2).suffix && ae.hasOwnProperty(s2.suffix) ? te.find((e3) => e3.iso === ae[s2.suffix]) : s2.prefix && ae.hasOwnProperty(s2.prefix) ? te.find((e3) => e3.iso === ae[s2.prefix]) : null) || function(e3) {
    let n3 = e3.match("#Currency+");
    n3.nouns().toSingular();
    let t3 = n3.text("reduced");
    return te.find((e4) => (t3 === `${e4.dem} ${e4.name}` || t3 === e4.iso || t3 === e4.sub || t3 === e4.name || !(!e4.alias || e4.alias[t3] !== true)) && e4);
  }(e2) || {};
  var s2;
  let o2 = "";
  return i2 && i2.sym && (o2 = i2.sym[0], a2 && e2.has(`${se}`) && (a2 /= 100)), {num: a2, iso: i2.iso, demonym: i2.dem, currency: i2.name, plural: i2.plural, symbol: o2};
}, le = function(e2 = "") {
  return e2.replace(/\w\S*/g, function(e3) {
    return e3.charAt(0).toUpperCase() + e3.substr(1).toLowerCase();
  });
};
var me = {get: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    n2.push(ue(e3));
  }), e2 !== void 0 ? n2[e2] || null : n2 || null;
}, currency: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    let t2 = ue(e3);
    t2 && n2.push(t2);
  }), typeof e2 == "number" ? n2[e2] || null : n2 || null;
}, json: function(e2) {
  let n2 = null;
  typeof e2 == "number" && (n2 = e2, e2 = null), e2 = e2 || {text: true, normal: true, trim: true, terms: true};
  let t2 = [];
  return this.forEach((n3) => {
    let r2 = n3.json(e2)[0], a2 = ue(n3);
    if (r2.number = a2.num, a2.iso && (r2.iso = a2.iso.toUpperCase(), r2.symbol = a2.symbol, r2.currency = le(a2.demonym) + " " + le(a2.currency)), r2.textFmt = oe(a2, true, false), a2.currency) {
      let e3 = a2.currency;
      a2.num !== 1 && (e3 = a2.plural || e3 + "s"), r2.textFmt += " " + e3;
    }
    t2.push(r2);
  }), n2 !== null ? t2[n2] || {} : t2;
}}, ce = {};
const he = P, fe = q;
ce.toText = function(e2) {
  if (!e2.numerator || !e2.denominator)
    return "";
  let n2 = he(e2.numerator), t2 = fe(e2.denominator);
  return e2.denominator === 2 && (t2 = "half"), n2 && t2 ? (e2.numerator !== 1 && (t2 += "s"), `${n2} ${t2}`) : "";
}, ce.textCardinal = function(e2) {
  if (!e2.numerator || !e2.denominator)
    return "";
  return `${he(e2.numerator)} out of ${he(e2.denominator)}`;
}, ce.toDecimal = function(e2) {
  return e2.decimal;
};
const de = v, ye = ce, pe = {get: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    n2.push(de(e3));
  }), e2 !== void 0 ? n2[e2] || null : n2 || null;
}, toDecimal() {
  return this.forEach((e2) => {
    let n2 = de(e2);
    if (n2) {
      let t2 = ye.toDecimal(n2);
      e2.replaceWith(String(t2), true), e2.tag("NumericValue"), e2.unTag("Fraction");
    }
  }), this;
}, json: function(e2) {
  let n2 = null;
  typeof e2 == "number" && (n2 = e2, e2 = null), e2 = e2 || {text: true, normal: true, trim: true, terms: true};
  let t2 = [];
  return this.forEach((n3) => {
    let r2 = n3.json(e2)[0], a2 = de(n3) || {}, i2 = ye.toDecimal(a2);
    r2.numerator = a2.numerator, r2.denominator = a2.denominator, r2.number = i2, r2.textOrdinal = ye.toText(a2), r2.textCardinal = ye.textCardinal(a2), t2.push(r2);
  }), n2 !== null ? t2[n2] || {} : t2;
}, normalize: function() {
  return this.forEach((e2) => {
    let n2 = de(e2);
    if (n2 && typeof n2.numerator == "number" && typeof n2.denominator == "number") {
      let t2 = `${n2.numerator}/${n2.denominator}`;
      this.replace(e2, t2);
    }
  }), this;
}, toText: function(e2) {
  let n2 = [];
  return this.forEach((e3) => {
    let n3 = de(e3) || {}, t2 = ye.toText(n3);
    e3.replaceWith(t2, true), e3.tag("Fraction");
  }), e2 !== void 0 ? n2[e2] : n2;
}, toPercentage: function() {
  return this.forEach((e2) => {
    let n2 = de(e2);
    if (n2.decimal || n2.decimal === 0) {
      let t2 = 100 * n2.decimal;
      t2 = Math.round(100 * t2) / 100, this.replace(e2, `${t2}%`);
    }
  }), this;
}};
pe.toNumber = pe.toDecimal;
var be = pe;
const ge = function(e2) {
  return e2.match("(hundred|thousand|million|billion|trillion|quadrillion|quintillion|sextillion|septillion)").tag("#Multiple", "fraction-tagger"), e2.match("[(half|quarter)] of? (a|an)", 0).tag("Fraction", "millionth"), e2.match("#Adverb [half]", 0).tag("Fraction", "nearly-half"), e2.match("[half] the", 0).tag("Fraction", "half-the"), e2.match("#Value (halves|halfs|quarters)").tag("Fraction", "two-halves"), e2.match("a #Ordinal").tag("Fraction", "a-quarter"), e2.match("(#Fraction && /s$/)").lookBefore("#Cardinal+$").tag("Fraction"), e2.match("[#Cardinal+ #Ordinal] of .", 0).tag("Fraction", "ordinal-of"), e2.match("[(#NumericValue && #Ordinal)] of .", 0).tag("Fraction", "num-ordinal-of"), e2.match("(a|one) #Cardinal?+ #Ordinal").tag("Fraction", "a-ordinal"), e2.match("#Cardinal+ out? of every? #Cardinal").tag("Fraction", "fraction-tagger"), e2;
}, xe = function(e2) {
  const n2 = "money-tagger";
  e2.match("#Money and #Money #Currency?").tag("Money", "money-and-money"), e2.match("#Money").not("#TextValue").match("/\\.[0-9]{3}$/").unTag("#Money", "three-decimal money"), e2.ifNo("#Value").match("#Currency #Verb").unTag("Currency", "no-currency"), e2.match("#Value #Currency [and] #Value (cents|ore|centavos|sens)", 0).tag("Money", n2);
  let t2 = e2.match("[<num>#Value] [<currency>(mark|rand|won|rub|ore)]");
  return t2.group("num").tag("Money", n2), t2.group("currency").tag("Currency", n2), e2;
};
var $e = function(e2) {
  (e2 = xe(e2)).match("the [/[0-9]+s$/]").tag("#Plural", "number-tag"), e2.match("half a? #Value").tag("Value", "half-a-value"), e2.match("#Value [and a (half|quarter)]", 0).tag(["TextValue", "#Fraction"], "value-and-a-half"), (e2 = ge(e2)).match("#Cardinal and #Fraction #Fraction").tag("Value", "number-tag");
};
const ve = {mark: true, sucre: true, leone: true, afghani: true, rand: true, try: true, mop: true, won: true, all: true, rub: true, eek: true, sit: true, bam: true, npr: true, leu: true};
let we = {kronor: "Currency"};
ne.forEach((e2) => {
  e2.iso && !ve[e2.iso] && (we[e2.iso] = ["Acronym", "Currency"]);
  let n2 = e2.name;
  if (n2 && !ve[n2] && (we[n2] = "Currency", we[n2 + "s"] = "Currency"), e2.dem) {
    let t2 = e2.dem;
    we[`${t2} ${n2}`] = "Currency", we[`${t2} ${n2}s`] = "Currency";
  }
  e2.sub && (we[e2.sub] = "Currency");
});
const ke = e, Ce = t, Oe = r, Ve = a, Fe = J, Me = ee, Ee = me, Ne = be, Pe = $e, ze = {Fraction: {isA: ["Value"]}, Multiple: {isA: "Value"}}, Ae = we;
var je = function(e2, n2) {
  n2.addWords(Ae), n2.addTags(ze), n2.postProcess(Pe);
  class t2 extends e2 {
  }
  Object.assign(t2.prototype, Fe);
  class r2 extends t2 {
  }
  Object.assign(r2.prototype, Ee);
  class a2 extends t2 {
  }
  Object.assign(a2.prototype, Ne);
  class i2 extends t2 {
  }
  Object.assign(i2.prototype, Me);
  const s2 = {numbers: function(e3) {
    let n3 = Ce(this, e3);
    return new t2(n3.list, this, this.world);
  }, percentages: function(e3) {
    let n3 = Ve(this, e3);
    return new i2(n3.list, this, this.world);
  }, fractions: function(e3) {
    let n3 = Oe(this, e3);
    return new a2(n3.list, this, this.world);
  }, money: function(e3) {
    let n3 = ke(this, e3);
    return new r2(n3.list, this, this.world);
  }};
  return s2.values = s2.numbers, s2.percents = s2.percentages, Object.assign(e2.prototype, s2), e2;
};

export default je;
