const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var t = function(t2) {
  let r2 = (t2 = t2 || "_") + "-";
  for (let t3 = 0; t3 < 7; t3++)
    r2 += e[Math.floor(Math.random() * e.length)];
  return r2;
};
let r = {"!": "¡", "?": "¿Ɂ", '"': '“”"❝❞', "'": "‘‛❛❜", "-": "—–", a: "ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАадѦѧӐӑӒӓƛɅæ", b: "ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ", c: "¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼͽϲϹϽϾСсєҀҁҪҫ", d: "ÐĎďĐđƉƊȡƋƌǷ", e: "ÈÉÊËèéêëĒēĔĕĖėĘęĚěƎƏƐǝȄȅȆȇȨȩɆɇΈΕΞΣέεξϱϵ϶ЀЁЕЭеѐёҼҽҾҿӖӗӘәӚӛӬӭ", f: "ƑƒϜϝӺӻҒғſ", g: "ĜĝĞğĠġĢģƓǤǥǦǧǴǵ", h: "ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ", I: "ÌÍÎÏ", i: "ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії", j: "ĴĵǰȷɈɉϳЈј", k: "ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ", l: "ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ", m: "ΜϺϻМмӍӎ", n: "ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ", o: "ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϭϴОФоѲѳӦӧӨөӪӫ", p: "ƤƿΡρϷϸϼРрҎҏÞ", q: "Ɋɋ", r: "ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ", s: "ŚśŜŝŞşŠšƧƨȘșȿЅѕ", t: "ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт", u: "µÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰμυϋύ", v: "νѴѵѶѷ", w: "ŴŵƜωώϖϢϣШЩшщѡѿ", x: "×ΧχϗϰХхҲҳӼӽӾӿ", y: "ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ", z: "ŹźŻżŽžƩƵƶȤȥɀΖζ"}, a = {};
Object.keys(r).forEach(function(e3) {
  r[e3].split("").forEach(function(t2) {
    a[t2] = e3;
  });
});
var n = (e3) => {
  let t2 = e3.split("");
  return t2.forEach((e4, r2) => {
    a[e4] && (t2[r2] = a[e4]);
  }), t2.join("");
};
const i = /([A-Z]\.)+[A-Z]?,?$/, o = /^[A-Z]\.,?$/, s = /[A-Z]{2,}('s|,)?$/, l = /([a-z]\.)+[a-z]\.?$/;
var u = function(e3) {
  return i.test(e3) === true || (l.test(e3) === true || (o.test(e3) === true || s.test(e3) === true));
};
const c = n, h = u, d = /[a-z\u00C0-\u00FF] ?\/ ?[a-z\u00C0-\u00FF]/;
const g = function(e3) {
  let t2 = e3 = (e3 = (e3 = e3 || "").toLowerCase()).trim();
  return e3 = c(e3), d.test(e3) === true && (e3 = e3.replace(/\/.*/, "")), e3 = (e3 = (e3 = (e3 = (e3 = (e3 = (e3 = e3.replace(/^[#@]/, "")).replace(/[,;.!?]+$/, "")).replace(/[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]+/g, "'")).replace(/[\u0022\u00AB\u00BB\u201C\u201D\u201E\u201F\u2033\u2034\u2036\u2037\u2E42\u301D\u301E\u301F\uFF02]+/g, '"')).replace(/\u2026/g, "...")).replace(/\u2013/g, "-")).replace(/([aeiou][ktrp])in$/, "$1ing"), /^(re|un)-?[^aeiou]./.test(e3) === true && (e3 = e3.replace("-", "")), h(e3) && (e3 = e3.replace(/\./g, "")), /^[:;]/.test(e3) === false && (e3 = (e3 = (e3 = e3.replace(/\.{3,}$/g, "")).replace(/[",\.!:;\?\)]+$/g, "")).replace(/^['"\(]+/g, "")), (e3 = (e3 = e3.replace(/[\u200B-\u200D\uFEFF]/g, "")).trim()) === "" && (e3 = t2), e3 = e3.replace(/([0-9]),([0-9])/g, "$1$2");
}, p = function(e3) {
  return e3 = (e3 = e3.replace(/['’]s$/, "")).replace(/s['’]$/, "s");
}, m = /^[ \n\t\.\[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;\/⁄·&*•^†‡°¡¿※№÷×ºª%‰+−=‱¶′″‴§~\|‖¦©℗®℠™¤₳฿\u0022\uFF02\u0027\u201C\u201F\u201B\u201E\u2E42\u201A\u2035\u2036\u2037\u301D\u0060\u301F]+/, f = /[ \n\t\.'\[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;\/⁄·&*@•^†‡°¡¿※#№÷×ºª‰+−=‱¶′″‴§~\|‖¦©℗®℠™¤₳฿\u0022\uFF02\u201D\u00B4\u301E]+$/, b = /\//, y = /['’]/, v = /^[a-z]\.([a-z]\.)+/i, w = /^[-+\.][0-9]/, k = /^'[0-9]{2}/;
var A = (e3) => {
  let t2 = e3, r2 = "", a2 = "";
  (e3 = (e3 = e3.replace(m, (t3) => (r2 = t3, r2 !== "-" && r2 !== "+" && r2 !== "." || !w.test(e3) ? r2 === "'" && k.test(e3) ? (r2 = "", t3) : "" : (r2 = "", t3)))).replace(f, (n3) => (a2 = n3, y.test(n3) && /[sn]['’]$/.test(t2) && y.test(r2) === false ? (a2 = a2.replace(y, ""), "'") : v.test(e3) === true ? (a2 = a2.replace(/\./, ""), ".") : ""))) === "" && (t2 = t2.replace(/ *$/, (e4) => (a2 = e4 || "", "")), e3 = t2, r2 = "", a2 = a2);
  let n2 = g(e3);
  const i2 = {text: e3, clean: n2, reduced: p(n2), pre: r2, post: a2};
  return b.test(e3) && e3.split(b).forEach((e4) => {
    i2.alias = i2.alias || {}, i2.alias[e4.trim()] = true;
  }), i2;
}, D = {};
!function(e3) {
  const t2 = /^[A-Z][a-z'\u00C0-\u00FF]/, r2 = /^[A-Z]+s?$/;
  e3.toUpperCase = function() {
    return this.text = this.text.toUpperCase(), this;
  }, e3.toLowerCase = function() {
    return this.text = this.text.toLowerCase(), this;
  }, e3.toTitleCase = function() {
    return this.text = this.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e4) => e4.toUpperCase()), this;
  }, e3.isUpperCase = function() {
    return r2.test(this.text);
  }, e3.isTitleCase = function() {
    return t2.test(this.text);
  }, e3.titleCase = e3.isTitleCase;
}(D);
var $ = {};
!function(e3) {
  const t2 = /(\u0022|\uFF02|\u0027|\u201C|\u2018|\u201F|\u201B|\u201E|\u2E42|\u201A|\u00AB|\u2039|\u2035|\u2036|\u2037|\u301D|\u0060|\u301F)/, r2 = /(\u0022|\uFF02|\u0027|\u201D|\u2019|\u201D|\u2019|\u201D|\u201D|\u2019|\u00BB|\u203A|\u2032|\u2033|\u2034|\u301E|\u00B4|\u301E)/;
  e3.hasPost = function(e4) {
    return this.post.indexOf(e4) !== -1;
  }, e3.hasPre = function(e4) {
    return this.pre.indexOf(e4) !== -1;
  }, e3.hasQuote = function() {
    return t2.test(this.pre) || r2.test(this.post);
  }, e3.hasQuotation = e3.hasQuote, e3.hasComma = function() {
    return this.hasPost(",");
  }, e3.hasPeriod = function() {
    return this.hasPost(".") === true && this.hasPost("...") === false;
  }, e3.hasExclamation = function() {
    return this.hasPost("!");
  }, e3.hasQuestionMark = function() {
    return this.hasPost("?") || this.hasPost("¿");
  }, e3.hasEllipses = function() {
    return this.hasPost("..") || this.hasPost("…") || this.hasPre("..") || this.hasPre("…");
  }, e3.hasSemicolon = function() {
    return this.hasPost(";");
  }, e3.hasSlash = function() {
    return /\//.test(this.text);
  }, e3.hasHyphen = function() {
    const e4 = /^(-|–|—)$/;
    return e4.test(this.post) || e4.test(this.pre);
  }, e3.hasDash = function() {
    const e4 = / (-|–|—) /;
    return e4.test(this.post) || e4.test(this.pre);
  }, e3.hasContraction = function() {
    return Boolean(this.implicit);
  }, e3.addPunctuation = function(e4) {
    return e4 !== "," && e4 !== ";" || (this.post = this.post.replace(e4, "")), this.post = e4 + this.post, this;
  };
}($);
var P = {};
const E = function(e3, t2, r2 = 3) {
  if (e3 === t2)
    return 1;
  if (e3.length < r2 || t2.length < r2)
    return 0;
  const a2 = function(e4, t3) {
    let r3 = e4.length, a3 = t3.length;
    if (r3 === 0)
      return a3;
    if (a3 === 0)
      return r3;
    let n3 = (a3 > r3 ? a3 : r3) + 1;
    if (Math.abs(r3 - a3) > (n3 || 100))
      return n3 || 100;
    let i2, o2, s2, l2, u2, c2, h2 = [];
    for (let e5 = 0; e5 < n3; e5++)
      h2[e5] = [e5], h2[e5].length = n3;
    for (let e5 = 0; e5 < n3; e5++)
      h2[0][e5] = e5;
    for (let n4 = 1; n4 <= r3; ++n4)
      for (o2 = e4[n4 - 1], i2 = 1; i2 <= a3; ++i2) {
        if (n4 === i2 && h2[n4][i2] > 4)
          return r3;
        s2 = t3[i2 - 1], l2 = o2 === s2 ? 0 : 1, u2 = h2[n4 - 1][i2] + 1, (c2 = h2[n4][i2 - 1] + 1) < u2 && (u2 = c2), (c2 = h2[n4 - 1][i2 - 1] + l2) < u2 && (u2 = c2);
        let a4 = n4 > 1 && i2 > 1 && o2 === t3[i2 - 2] && e4[n4 - 2] === s2 && (c2 = h2[n4 - 2][i2 - 2] + l2) < u2;
        h2[n4][i2] = a4 ? c2 : u2;
      }
    return h2[r3][a3];
  }(e3, t2);
  let n2 = Math.max(e3.length, t2.length);
  return 1 - (n2 === 0 ? 0 : a2 / n2);
};
let H = function() {
};
H = function(e3, t2, r2, a2) {
  let n2 = function(e4, t3, r3, a3) {
    if (t3.id === e4.id)
      return true;
    if (t3.anything === true)
      return true;
    if (t3.start === true && r3 !== 0)
      return false;
    if (t3.end === true && r3 !== a3 - 1)
      return false;
    if (t3.word !== void 0) {
      if (e4.implicit !== null && e4.implicit === t3.word)
        return true;
      if (e4.alias !== void 0 && e4.alias.hasOwnProperty(t3.word))
        return true;
      if (t3.soft === true && t3.word === e4.root)
        return true;
      if (t3.fuzzy !== void 0) {
        let r4 = E(t3.word, e4.reduced);
        if (r4 > t3.fuzzy)
          return true;
        if (t3.soft === true && (r4 = E(t3.word, e4.root), r4 > t3.fuzzy))
          return true;
      }
      return t3.word === e4.clean || t3.word === e4.text || t3.word === e4.reduced;
    }
    return t3.tag !== void 0 ? e4.tags[t3.tag] === true : t3.method !== void 0 ? typeof e4[t3.method] == "function" && e4[t3.method]() === true : t3.regex !== void 0 ? t3.regex.test(e4.clean) : t3.fastOr !== void 0 ? !(!e4.implicit || t3.fastOr.hasOwnProperty(e4.implicit) !== true) || t3.fastOr.hasOwnProperty(e4.reduced) || t3.fastOr.hasOwnProperty(e4.text) : t3.choices !== void 0 && (t3.operator === "and" ? t3.choices.every((t4) => H(e4, t4, r3, a3)) : t3.choices.some((t4) => H(e4, t4, r3, a3)));
  }(e3, t2, r2, a2);
  return t2.negative === true ? !n2 : n2;
};
const j = H, N = u, x = {};
P.doesMatch = function(e3, t2, r2) {
  return j(this, e3, t2, r2);
}, P.isAcronym = function() {
  return N(this.text);
}, P.isImplicit = function() {
  return this.text === "" && Boolean(this.implicit);
}, P.isKnown = function() {
  return Object.keys(this.tags).some((e3) => x[e3] !== true);
}, P.setRoot = function(e3) {
  let t2 = e3.transforms, r2 = this.implicit || this.clean;
  if (this.tags.Plural && (r2 = t2.toSingular(r2, e3)), this.tags.Verb && !this.tags.Negative && !this.tags.Infinitive) {
    let a2 = null;
    this.tags.PastTense ? a2 = "PastTense" : this.tags.Gerund ? a2 = "Gerund" : this.tags.PresentTense ? a2 = "PresentTense" : this.tags.Participle ? a2 = "Participle" : this.tags.Actor && (a2 = "Actor"), r2 = t2.toInfinitive(r2, e3, a2);
  }
  this.root = r2;
};
var F = {};
const C = n, B = /[\s-]/, G = /^[A-Z-]+$/;
F.textOut = function(e3, t2, r2) {
  e3 = e3 || {};
  let a2 = this.text, n2 = this.pre, i2 = this.post;
  return e3.reduced === true && (a2 = this.reduced || ""), e3.root === true && (a2 = this.root || ""), e3.implicit === true && this.implicit && (a2 = this.implicit || ""), e3.normal === true && (a2 = this.clean || this.text || ""), e3.root === true && (a2 = this.root || this.reduced || ""), e3.unicode === true && (a2 = C(a2)), e3.titlecase === true && (this.tags.ProperNoun && !this.titleCase() || (this.tags.Acronym ? a2 = a2.toUpperCase() : G.test(a2) && !this.tags.Acronym && (a2 = a2.toLowerCase()))), e3.lowercase === true && (a2 = a2.toLowerCase()), e3.acronyms === true && this.tags.Acronym && (a2 = a2.replace(/\./g, "")), e3.whitespace !== true && e3.root !== true || (n2 = "", i2 = " ", B.test(this.post) !== false && !e3.last || this.implicit || (i2 = "")), e3.punctuation !== true || e3.root || (this.hasPost(".") === true ? i2 = "." + i2 : this.hasPost("?") === true ? i2 = "?" + i2 : this.hasPost("!") === true ? i2 = "!" + i2 : this.hasPost(",") === true ? i2 = "," + i2 : this.hasEllipses() === true && (i2 = "..." + i2)), t2 !== true && (n2 = ""), r2 !== true && (i2 = ""), e3.abbreviations === true && this.tags.Abbreviation && (i2 = i2.replace(/^\./, "")), n2 + a2 + i2;
};
var z = {};
const I = {Auxiliary: 1, Possessive: 1};
const O = function(e3, t2) {
  let r2 = Object.keys(e3.tags);
  const a2 = t2.tags;
  return r2 = r2.sort((e4, t3) => I[t3] || !a2[t3] ? -1 : a2[t3] ? a2[e4] ? a2[e4].lineage.length > a2[t3].lineage.length ? 1 : a2[e4].isA.length > a2[t3].isA.length ? -1 : 0 : 0 : 1), r2;
}, T = {text: true, tags: true, implicit: true, whitespace: true, clean: false, id: false, index: false, offset: false, bestTag: false};
z.json = function(e3, t2) {
  e3 = e3 || {};
  let r2 = {};
  return (e3 = Object.assign({}, T, e3)).text && (r2.text = this.text), e3.normal && (r2.normal = this.clean), e3.tags && (r2.tags = Object.keys(this.tags)), e3.clean && (r2.clean = this.clean), (e3.id || e3.offset) && (r2.id = this.id), e3.implicit && this.implicit !== null && (r2.implicit = this.implicit), e3.whitespace && (r2.pre = this.pre, r2.post = this.post), e3.bestTag && (r2.bestTag = O(this, t2)[0]), r2;
};
var V = Object.assign({}, D, $, P, F, z), M = {}, J = {};
function L() {
  return typeof window != "undefined" && window.document;
}
const S = function(e3, t2) {
  for (e3 = e3.toString(); e3.length < t2; )
    e3 += " ";
  return e3;
};
J.logTag = function(e3, t2, r2) {
  if (L())
    return void console.log("%c" + S(e3.clean, 3) + "  + " + t2 + " ", "color: #6accb2;");
  let a2 = "[33m" + S(e3.clean, 15) + "[0m + [32m" + t2 + "[0m ";
  r2 && (a2 = S(a2, 35) + " " + r2), console.log(a2);
}, J.logUntag = function(e3, t2, r2) {
  if (L())
    return void console.log("%c" + S(e3.clean, 3) + "  - " + t2 + " ", "color: #AB5850;");
  let a2 = "[33m" + S(e3.clean, 3) + " [31m - #" + t2 + "[0m ";
  r2 && (a2 = S(a2, 35) + " " + r2), console.log(a2);
}, J.isArray = function(e3) {
  return Object.prototype.toString.call(e3) === "[object Array]";
}, J.titleCase = (e3) => e3.charAt(0).toUpperCase() + e3.substr(1);
const _ = J, K = function(e3, t2, r2, a2) {
  let n2 = a2.tags;
  if (t2 === "" || t2 === "." || t2 === "-")
    return;
  if (t2[0] === "#" && (t2 = t2.replace(/^#/, "")), t2 = _.titleCase(t2), e3.tags[t2] === true)
    return;
  const i2 = a2.isVerbose();
  i2 === true && _.logTag(e3, t2, r2), e3.tags[t2] = true, n2.hasOwnProperty(t2) === true && (n2[t2].isA.forEach((t3) => {
    e3.tags[t3] = true, i2 === true && _.logTag(e3, "→ " + t3);
  }), e3.unTag(n2[t2].notA, "←", a2));
};
const q = J, W = /^[a-z]/, R = function(e3, t2, r2, a2) {
  const n2 = a2.isVerbose();
  if (t2 === "*")
    return e3.tags = {}, e3;
  var i2;
  t2 = t2.replace(/^#/, ""), W.test(t2) === true && (t2 = (i2 = t2).charAt(0).toUpperCase() + i2.substr(1)), e3.tags[t2] === true && (delete e3.tags[t2], n2 === true && q.logUntag(e3, t2, r2));
  const o2 = a2.tags;
  if (o2[t2]) {
    let r3 = o2[t2].lineage;
    for (let t3 = 0; t3 < r3.length; t3++)
      e3.tags[r3[t3]] === true && (delete e3.tags[r3[t3]], n2 === true && q.logUntag(e3, " - " + r3[t3]));
  }
  return e3;
};
const U = function(e3, t2, r2) {
  const a2 = r2.tags;
  if (t2[0] === "#" && (t2 = t2.replace(/^#/, "")), a2[t2] === void 0)
    return true;
  let n2 = a2[t2].notA || [];
  for (let t3 = 0; t3 < n2.length; t3++)
    if (e3.tags[n2[t3]] === true)
      return false;
  return a2[t2].isA === void 0 || U(e3, a2[t2].isA, r2);
};
const Q = function(e3, t2, r2, a2) {
  if (typeof t2 != "string")
    for (let n2 = 0; n2 < t2.length; n2++)
      K(e3, t2[n2], r2, a2);
  else
    K(e3, t2, r2, a2);
}, Z = function(e3, t2, r2, a2) {
  if (typeof t2 != "string" && t2)
    for (let n2 = 0; n2 < t2.length; n2++)
      R(e3, t2[n2], r2, a2);
  else
    R(e3, t2, r2, a2);
}, X = U;
M.tag = function(e3, t2, r2) {
  return Q(this, e3, t2, r2), this;
}, M.tagSafe = function(e3, t2, r2) {
  return X(this, e3, r2) && Q(this, e3, t2, r2), this;
}, M.unTag = function(e3, t2, r2) {
  return Z(this, e3, t2, r2), this;
}, M.canBe = function(e3, t2) {
  return X(this, e3, t2);
};
const Y = t, ee = A, te = V, re = M;
class ae {
  constructor(e3 = "") {
    e3 = String(e3);
    let t2 = ee(e3);
    this.text = t2.text || "", this.clean = t2.clean, this.reduced = t2.reduced, this.root = null, this.implicit = null, this.pre = t2.pre || "", this.post = t2.post || "", this.tags = {}, this.prev = null, this.next = null, this.id = Y(t2.clean), this.isA = "Term", t2.alias && (this.alias = t2.alias);
  }
  set(e3) {
    let t2 = ee(e3);
    return this.text = t2.text, this.clean = t2.clean, this.reduced = t2.reduced, this.root = null, this.implicit = null, this;
  }
}
ae.prototype.clone = function() {
  let e3 = new ae(this.text);
  return e3.pre = this.pre, e3.post = this.post, e3.clean = this.clean, e3.reduced = this.reduced, e3.root = this.root, e3.implicit = this.implicit, e3.tags = Object.assign({}, this.tags), e3;
}, Object.assign(ae.prototype, te), Object.assign(ae.prototype, re);
var ne = ae, ie = {terms: function(e3) {
  if (this.length === 0)
    return [];
  if (this.cache.terms)
    return e3 !== void 0 ? this.cache.terms[e3] : this.cache.terms;
  let t2 = [this.pool.get(this.start)];
  for (let r2 = 0; r2 < this.length - 1; r2 += 1) {
    let a2 = t2[t2.length - 1].next;
    if (a2 === null) {
      console.error("Compromise error: Linked list broken in phrase '" + this.start + "'");
      break;
    }
    let n2 = this.pool.get(a2);
    if (t2.push(n2), e3 !== void 0 && e3 === r2)
      return t2[e3];
  }
  return e3 === void 0 && (this.cache.terms = t2), e3 !== void 0 ? t2[e3] : t2;
}, clone: function(e3) {
  if (e3) {
    let e4 = this.buildFrom(this.start, this.length);
    return e4.cache = this.cache, e4;
  }
  let t2 = this.terms().map((e4) => e4.clone());
  return t2.forEach((e4, r2) => {
    this.pool.add(e4), t2[r2 + 1] && (e4.next = t2[r2 + 1].id), t2[r2 - 1] && (e4.prev = t2[r2 - 1].id);
  }), this.buildFrom(t2[0].id, t2.length);
}, lastTerm: function() {
  let e3 = this.terms();
  return e3[e3.length - 1];
}, hasId: function(e3) {
  if (this.length === 0 || !e3)
    return false;
  if (this.start === e3)
    return true;
  if (this.cache.terms) {
    let t3 = this.cache.terms;
    for (let r2 = 0; r2 < t3.length; r2++)
      if (t3[r2].id === e3)
        return true;
    return false;
  }
  let t2 = this.start;
  for (let r2 = 0; r2 < this.length - 1; r2 += 1) {
    let r3 = this.pool.get(t2);
    if (r3 === void 0)
      return console.error(`Compromise error: Linked list broken. Missing term '${t2}' in phrase '${this.start}'
`), false;
    if (r3.next === e3)
      return true;
    t2 = r3.next;
  }
  return false;
}, wordCount: function() {
  return this.terms().filter((e3) => e3.text !== "").length;
}, fullSentence: function() {
  let e3 = this.terms(0);
  for (; e3.prev; )
    e3 = this.pool.get(e3.prev);
  let t2 = e3.id, r2 = 1;
  for (; e3.next; )
    e3 = this.pool.get(e3.next), r2 += 1;
  return this.buildFrom(t2, r2);
}}, oe = {};
oe.text = function(e3 = {}, t2, r2) {
  typeof e3 == "string" && (e3 = e3 === "normal" ? {whitespace: true, unicode: true, lowercase: true, punctuation: true, acronyms: true, abbreviations: true, implicit: true, normal: true} : e3 === "clean" ? {titlecase: false, lowercase: true, punctuation: true, whitespace: true, unicode: true, implicit: true, normal: true} : e3 === "reduced" ? {punctuation: false, titlecase: false, lowercase: true, whitespace: true, unicode: true, implicit: true, reduced: true} : e3 === "implicit" ? {punctuation: true, implicit: true, whitespace: true, trim: true} : e3 === "root" ? {titlecase: false, lowercase: true, punctuation: true, whitespace: true, unicode: true, implicit: true, root: true} : {});
  let a2 = this.terms(), n2 = false;
  a2[0] && a2[0].prev === null && a2[a2.length - 1].next === null && (n2 = true);
  let i2 = a2.reduce((i3, o2, s2) => {
    if (s2 === 0 && o2.text === "" && o2.implicit !== null && !e3.implicit)
      return i3;
    e3.last = r2 && s2 === a2.length - 1;
    let l2 = true, u2 = true;
    return n2 === false && (s2 === 0 && t2 && (l2 = false), s2 === a2.length - 1 && r2 && (u2 = false)), i3 + o2.textOut(e3, l2, u2);
  }, "");
  return n2 === true && r2 && (i2 = i2.replace(/ +$/, "")), e3.trim === true && (i2 = i2.trim()), i2;
};
var se = {trim: function() {
  let e3 = this.terms();
  if (e3.length > 0) {
    e3[0].pre = e3[0].pre.replace(/^\s+/, "");
    let t2 = e3[e3.length - 1];
    t2.post = t2.post.replace(/\s+$/, "");
  }
  return this;
}}, le = {};
const ue = /[.?!]\s*$/, ce = function(e3, t2) {
  t2[0].pre = e3[0].pre;
  let r2 = e3[e3.length - 1], a2 = t2[t2.length - 1];
  a2.post = function(e4, t3) {
    if (ue.test(t3))
      return t3 + e4.match(/\s*$/);
    return e4;
  }(r2.post, a2.post), r2.post = "", r2.post === "" && (r2.post += " ");
};
const he = / /;
const de = function(e3, t2, r2) {
  let a2 = e3.terms(), n2 = t2.terms();
  ce(a2, n2), function(e4, t3, r3) {
    let a3 = e4[e4.length - 1], n3 = t3[t3.length - 1], i3 = a3.next;
    a3.next = t3[0].id, n3.next = i3, i3 && (r3.get(i3).prev = n3.id);
    let o3 = e4[0].id;
    o3 && (t3[0].prev = o3);
  }(a2, n2, e3.pool);
  let i2 = [e3], o2 = e3.start, s2 = [r2];
  return s2 = s2.concat(r2.parents()), s2.forEach((e4) => {
    let t3 = e4.list.filter((e5) => e5.hasId(o2));
    i2 = i2.concat(t3);
  }), i2 = function(e4) {
    return e4.filter((t3, r3) => e4.indexOf(t3) === r3);
  }(i2), i2.forEach((e4) => {
    e4.length += t2.length;
  }), e3.cache = {}, e3;
}, ge = function(e3, t2, r2) {
  const a2 = e3.start;
  let n2 = t2.terms();
  !function(e4) {
    let t3 = e4[e4.length - 1];
    he.test(t3.post) === false && (t3.post += " ");
  }(n2), function(e4, t3, r3) {
    let a3 = r3[r3.length - 1];
    a3.next = e4.start;
    let n3 = e4.pool, i3 = n3.get(e4.start);
    i3.prev && (n3.get(i3.prev).next = t3.start);
    r3[0].prev = e4.terms(0).prev, e4.terms(0).prev = a3.id;
  }(e3, t2, n2);
  let i2 = [e3], o2 = [r2];
  return o2 = o2.concat(r2.parents()), o2.forEach((e4) => {
    let r3 = e4.list.filter((e5) => e5.hasId(a2) || e5.hasId(t2.start));
    i2 = i2.concat(r3);
  }), i2 = function(e4) {
    return e4.filter((t3, r3) => e4.indexOf(t3) === r3);
  }(i2), i2.forEach((e4) => {
    e4.length += t2.length, e4.start === a2 && (e4.start = t2.start), e4.cache = {};
  }), e3;
}, pe = function(e3, t2) {
  let r2 = t2.pool(), a2 = e3.terms(), n2 = r2.get(a2[0].prev) || {}, i2 = r2.get(a2[a2.length - 1].next) || {};
  a2[0].implicit && n2.implicit && (n2.set(n2.implicit), n2.post += " "), function(e4, t3, r3, a3) {
    let n3 = e4.parents();
    n3.push(e4), n3.forEach((e5) => {
      let n4 = e5.list.find((e6) => e6.hasId(t3));
      n4 && (n4.length -= r3, n4.start === t3 && (n4.start = a3.id), n4.cache = {});
    }), e4.list = e4.list.filter((e5) => !(!e5.start || !e5.length));
  }(t2, e3.start, e3.length, i2), n2 && (n2.next = i2.id), i2 && (i2.prev = n2.id);
};
le.append = function(e3, t2) {
  return de(this, e3, t2), this;
}, le.prepend = function(e3, t2) {
  return ge(this, e3, t2), this;
}, le.delete = function(e3) {
  return pe(this, e3), this;
}, le.replace = function(e3, t2) {
  let r2 = this.length;
  de(this, e3, t2);
  let a2 = this.buildFrom(this.start, this.length);
  a2.length = r2, pe(a2, t2);
}, le.splitOn = function(e3) {
  let t2 = this.terms(), r2 = {before: null, match: null, after: null}, a2 = t2.findIndex((t3) => t3.id === e3.start);
  if (a2 === -1)
    return r2;
  let n2 = t2.slice(0, a2);
  n2.length > 0 && (r2.before = this.buildFrom(n2[0].id, n2.length));
  let i2 = t2.slice(a2, a2 + e3.length);
  i2.length > 0 && (r2.match = this.buildFrom(i2[0].id, i2.length));
  let o2 = t2.slice(a2 + e3.length, t2.length);
  return o2.length > 0 && (r2.after = this.buildFrom(o2[0].id, o2.length, this.pool)), r2;
};
var me = {json: function(e3 = {}, t2) {
  let r2 = {};
  return e3.text && (r2.text = this.text()), e3.normal && (r2.normal = this.text("normal")), e3.clean && (r2.clean = this.text("clean")), e3.reduced && (r2.reduced = this.text("reduced")), e3.implicit && (r2.implicit = this.text("implicit")), e3.root && (r2.root = this.text("root")), e3.trim && (r2.text && (r2.text = r2.text.trim()), r2.normal && (r2.normal = r2.normal.trim()), r2.reduced && (r2.reduced = r2.reduced.trim())), e3.terms && (e3.terms === true && (e3.terms = {}), r2.terms = this.terms().map((r3) => r3.json(e3.terms, t2))), r2;
}}, fe = {lookAhead: function(e3) {
  e3 || (e3 = ".*");
  let t2 = this.pool, r2 = [];
  const a2 = function(e4) {
    let n3 = t2.get(e4);
    n3 && (r2.push(n3), n3.prev && a2(n3.next));
  };
  let n2 = this.terms(), i2 = n2[n2.length - 1];
  return a2(i2.next), r2.length === 0 ? [] : this.buildFrom(r2[0].id, r2.length).match(e3);
}, lookBehind: function(e3) {
  e3 || (e3 = ".*");
  let t2 = this.pool, r2 = [];
  const a2 = function(e4) {
    let n3 = t2.get(e4);
    n3 && (r2.push(n3), n3.prev && a2(n3.prev));
  };
  let n2 = t2.get(this.start);
  return a2(n2.prev), r2.length === 0 ? [] : this.buildFrom(r2[r2.length - 1].id, r2.length).match(e3);
}}, be = Object.assign({}, ie, oe, se, le, me, fe), ye = {};
var ve, we = function(e3, t2) {
  if (t2.length === 0)
    return true;
  for (let e4 = 0; e4 < t2.length; e4 += 1) {
    let r2 = t2[e4];
    if (r2.optional !== true && r2.negative !== true && r2.start === true && e4 > 0)
      return true;
    if (r2.anything === true && r2.negative === true)
      return true;
  }
  return false;
}, ke = {};
(ve = ke).getGreedy = function(e3, t2) {
  let r2 = Object.assign({}, e3.regs[e3.r], {start: false, end: false}), a2 = e3.t;
  for (; e3.t < e3.terms.length; e3.t += 1) {
    if (t2 && e3.terms[e3.t].doesMatch(t2, e3.start_i + e3.t, e3.phrase_length))
      return e3.t;
    let n2 = e3.t - a2 + 1;
    if (r2.max !== void 0 && n2 === r2.max)
      return e3.t;
    if (e3.terms[e3.t].doesMatch(r2, e3.start_i + e3.t, e3.phrase_length) === false)
      return r2.min !== void 0 && n2 < r2.min ? null : e3.t;
  }
  return e3.t;
}, ve.greedyTo = function(e3, t2) {
  let r2 = e3.t;
  if (!t2)
    return e3.terms.length;
  for (; r2 < e3.terms.length; r2 += 1)
    if (e3.terms[r2].doesMatch(t2, e3.start_i + r2, e3.phrase_length) === true)
      return r2;
  return null;
}, ve.isEndGreedy = function(e3, t2) {
  if (e3.end === true && e3.greedy === true && t2.start_i + t2.t < t2.phrase_length - 1) {
    let r2 = Object.assign({}, e3, {end: false});
    if (t2.terms[t2.t].doesMatch(r2, t2.start_i + t2.t, t2.phrase_length) === true)
      return true;
  }
  return false;
}, ve.doOrBlock = function(e3, t2 = 0) {
  let r2 = e3.regs[e3.r], a2 = false;
  for (let n2 = 0; n2 < r2.choices.length; n2 += 1) {
    let i2 = r2.choices[n2];
    if (a2 = i2.every((r3, a3) => {
      let n3 = 0, i3 = e3.t + a3 + t2 + n3;
      if (e3.terms[i3] === void 0)
        return false;
      let o2 = e3.terms[i3].doesMatch(r3, i3 + e3.start_i, e3.phrase_length);
      if (o2 === true && r3.greedy === true)
        for (let t3 = 1; t3 < e3.terms.length; t3 += 1) {
          let a4 = e3.terms[i3 + t3];
          if (a4) {
            if (a4.doesMatch(r3, e3.start_i + t3, e3.phrase_length) !== true)
              break;
            n3 += 1;
          }
        }
      return t2 += n3, o2;
    }), a2) {
      t2 += i2.length;
      break;
    }
  }
  return a2 && r2.greedy === true ? ve.doOrBlock(e3, t2) : t2;
}, ve.doAndBlock = function(e3) {
  let t2 = 0;
  return e3.regs[e3.r].choices.every((r2) => {
    let a2 = r2.every((t3, r3) => {
      let a3 = e3.t + r3;
      return e3.terms[a3] !== void 0 && e3.terms[a3].doesMatch(t3, a3, e3.phrase_length);
    });
    return a2 === true && r2.length > t2 && (t2 = r2.length), a2;
  }) === true && t2;
}, ve.getGroup = function(e3, t2, r2) {
  if (e3.groups[e3.groupId])
    return e3.groups[e3.groupId];
  const a2 = e3.terms[t2].id;
  return e3.groups[e3.groupId] = {group: String(r2), start: a2, length: 0}, e3.groups[e3.groupId];
};
const Ae = t, De = ke;
var $e = function(e3, t2, r2, a2) {
  let n2 = {t: 0, terms: e3, r: 0, regs: t2, groups: {}, start_i: r2, phrase_length: a2, hasGroup: false, groupId: null, previousGroup: null};
  for (; n2.r < t2.length; n2.r += 1) {
    let e4 = t2[n2.r];
    if (n2.hasGroup = typeof e4.named == "string" || typeof e4.named == "number", n2.hasGroup === true) {
      const r4 = t2[n2.r - 1];
      r4 && r4.named === e4.named && n2.previousGroup ? n2.groupId = n2.previousGroup : (n2.groupId = Ae(e4.named), n2.previousGroup = n2.groupId);
    }
    if (!n2.terms[n2.t]) {
      if (t2.slice(n2.r).some((e5) => !e5.optional) === false)
        break;
      return null;
    }
    if (e4.anything === true && e4.greedy === true) {
      let r4 = De.greedyTo(n2, t2[n2.r + 1]);
      if (r4 === null || r4 === 0)
        return null;
      if (e4.min !== void 0 && r4 - n2.t < e4.min)
        return null;
      if (e4.max !== void 0 && r4 - n2.t > e4.max) {
        n2.t = n2.t + e4.max;
        continue;
      }
      if (n2.hasGroup === true) {
        De.getGroup(n2, n2.t, e4.named).length = r4 - n2.t;
      }
      n2.t = r4;
      continue;
    }
    if (e4.choices !== void 0 && e4.operator === "or") {
      let t3 = De.doOrBlock(n2);
      if (t3) {
        if (e4.negative === true)
          return null;
        if (n2.hasGroup === true) {
          De.getGroup(n2, n2.t, e4.named).length += t3;
        }
        n2.t += t3;
        continue;
      }
      if (!e4.optional)
        return null;
    }
    if (e4.choices !== void 0 && e4.operator === "and") {
      let t3 = De.doAndBlock(n2);
      if (t3) {
        if (e4.negative === true)
          return null;
        if (n2.hasGroup === true) {
          De.getGroup(n2, n2.t, e4.named).length += t3;
        }
        n2.t += t3;
        continue;
      }
      if (!e4.optional)
        return null;
    }
    let r3 = n2.terms[n2.t], i2 = r3.doesMatch(e4, n2.start_i + n2.t, n2.phrase_length);
    if (e4.anything === true || i2 === true || De.isEndGreedy(e4, n2)) {
      let i3 = n2.t;
      if (e4.optional && t2[n2.r + 1] && e4.negative)
        continue;
      if (e4.optional && t2[n2.r + 1]) {
        let a3 = r3.doesMatch(t2[n2.r + 1], n2.start_i + n2.t, n2.phrase_length);
        if (e4.negative || a3) {
          let e5 = n2.terms[n2.t + 1];
          e5 && e5.doesMatch(t2[n2.r + 1], n2.start_i + n2.t, n2.phrase_length) || (n2.r += 1);
        }
      }
      if (n2.t += 1, e4.end === true && n2.t !== n2.terms.length && e4.greedy !== true)
        return null;
      if (e4.greedy === true) {
        if (n2.t = De.getGreedy(n2, t2[n2.r + 1]), n2.t === null)
          return null;
        if (e4.min && e4.min > n2.t)
          return null;
        if (e4.end === true && n2.start_i + n2.t !== a2)
          return null;
      }
      if (n2.hasGroup === true) {
        const t3 = De.getGroup(n2, i3, e4.named);
        n2.t > 1 && e4.greedy ? t3.length += n2.t - i3 : t3.length++;
      }
    } else {
      if (e4.negative) {
        let t3 = Object.assign({}, e4);
        if (t3.negative = false, n2.terms[n2.t].doesMatch(t3, n2.start_i + n2.t, n2.phrase_length) === true)
          return null;
      }
      if (e4.optional !== true) {
        if (n2.terms[n2.t].isImplicit() && t2[n2.r - 1] && n2.terms[n2.t + 1]) {
          if (n2.terms[n2.t - 1] && n2.terms[n2.t - 1].implicit === t2[n2.r - 1].word)
            return null;
          if (n2.terms[n2.t + 1].doesMatch(e4, n2.start_i + n2.t, n2.phrase_length)) {
            n2.t += 2;
            continue;
          }
        }
        return null;
      }
    }
  }
  return {match: n2.terms.slice(0, n2.t), groups: n2.groups};
};
var Pe = function(e3, t2, r2) {
  if (!r2 || r2.length === 0)
    return r2;
  if (t2.some((e4) => e4.end)) {
    let t3 = e3[e3.length - 1];
    r2 = r2.filter(({match: e4}) => e4.indexOf(t3) !== -1);
  }
  return r2;
};
const Ee = /(?:^|\s)([\!\[\^]*(?:<[^<]*>)?\/.*?[^\\\/]\/[\?\]\+\*\$~]*)(?:\s|$)/, He = /([\!\[\^]*(?:<[^<]*>)?\([^\)]+[^\\\)]\)[\?\]\+\*\$~]*)(?:\s|$)/, je = / /g, Ne = (e3) => /^[\!\[\^]*(<[^<]*>)?\//.test(e3) && /\/[\?\]\+\*\$~]*$/.test(e3), xe = function(e3) {
  return e3 = (e3 = e3.map((e4) => e4.trim())).filter((e4) => e4);
};
var Fe = function(e3) {
  let t2 = e3.split(Ee), r2 = [];
  t2.forEach((e4) => {
    Ne(e4) ? r2.push(e4) : r2 = r2.concat(e4.split(He));
  }), r2 = xe(r2);
  let a2 = [];
  return r2.forEach((e4) => {
    ((e5) => /^[\!\[\^]*(<[^<]*>)?\(/.test(e5) && /\)[\?\]\+\*\$~]*$/.test(e5))(e4) || Ne(e4) ? a2.push(e4) : a2 = a2.concat(e4.split(je));
  }), a2 = xe(a2), a2;
};
const Ce = /\{([0-9]+,?[0-9]*)\}/, Be = /&&/, Ge = new RegExp(/^<\s*?(\S+)\s*?>/), ze = function(e3) {
  return e3[e3.length - 1];
}, Ie = function(e3) {
  return e3[0];
}, Oe = function(e3) {
  return e3.substr(1);
}, Te = function(e3) {
  return e3.substr(0, e3.length - 1);
}, Ve = function(e3) {
  return e3 = Oe(e3), e3 = Te(e3);
}, Me = function(e3) {
  let t2 = {};
  for (let r3 = 0; r3 < 2; r3 += 1) {
    if (ze(e3) === "$" && (t2.end = true, e3 = Te(e3)), Ie(e3) === "^" && (t2.start = true, e3 = Oe(e3)), (Ie(e3) === "[" || ze(e3) === "]") && (t2.named = true, Ie(e3) === "[" ? t2.groupType = ze(e3) === "]" ? "single" : "start" : t2.groupType = "end", e3 = (e3 = e3.replace(/^\[/, "")).replace(/\]$/, ""), Ie(e3) === "<")) {
      const r4 = Ge.exec(e3);
      r4.length >= 2 && (t2.named = r4[1], e3 = e3.replace(r4[0], ""));
    }
    if (ze(e3) === "+" && (t2.greedy = true, e3 = Te(e3)), e3 !== "*" && ze(e3) === "*" && e3 !== "\\*" && (t2.greedy = true, e3 = Te(e3)), ze(e3) === "?" && (t2.optional = true, e3 = Te(e3)), Ie(e3) === "!" && (t2.negative = true, e3 = Oe(e3)), Ie(e3) === "(" && ze(e3) === ")") {
      Be.test(e3) ? (t2.choices = e3.split(Be), t2.operator = "and") : (t2.choices = e3.split("|"), t2.operator = "or"), t2.choices[0] = Oe(t2.choices[0]);
      let r4 = t2.choices.length - 1;
      t2.choices[r4] = Te(t2.choices[r4]), t2.choices = t2.choices.map((e4) => e4.trim()), t2.choices = t2.choices.filter((e4) => e4), t2.choices = t2.choices.map((e4) => e4.split(/ /g).map(Me)), e3 = "";
    }
    if (Ie(e3) === "/" && ze(e3) === "/")
      return e3 = Ve(e3), t2.regex = new RegExp(e3), t2;
    if (Ie(e3) === "~" && ze(e3) === "~")
      return e3 = Ve(e3), t2.soft = true, t2.word = e3, t2;
  }
  return Ce.test(e3) === true && (e3 = e3.replace(Ce, (e4, r3) => {
    let a2 = r3.split(/,/g);
    return a2.length === 1 ? (t2.min = Number(a2[0]), t2.max = Number(a2[0])) : (t2.min = Number(a2[0]), t2.max = Number(a2[1] || 999)), t2.greedy = true, t2.optional = true, "";
  })), Ie(e3) === "#" ? (t2.tag = Oe(e3), t2.tag = (r2 = t2.tag).charAt(0).toUpperCase() + r2.substr(1), t2) : Ie(e3) === "@" ? (t2.method = Oe(e3), t2) : e3 === "." ? (t2.anything = true, t2) : e3 === "*" ? (t2.anything = true, t2.greedy = true, t2.optional = true, t2) : (e3 && (e3 = (e3 = e3.replace("\\*", "*")).replace("\\.", "."), t2.word = e3.toLowerCase()), t2);
  var r2;
};
const Je = Fe, Le = Me, Se = function(e3, t2 = {}) {
  return e3.filter((e4) => e4.groupType).length > 0 && (e3 = function(e4) {
    let t3, r2 = false, a2 = -1;
    for (let n2 = 0; n2 < e4.length; n2++) {
      const i2 = e4[n2];
      i2.groupType !== "single" || i2.named !== true ? (i2.groupType === "start" && (r2 = true, typeof i2.named == "string" || typeof i2.named == "number" ? t3 = i2.named : (a2 += 1, t3 = a2)), r2 && (i2.named = t3), i2.groupType === "end" && (r2 = false)) : (a2 += 1, i2.named = a2);
    }
    return e4;
  }(e3)), t2.fuzzy || (e3 = function(e4) {
    return e4.map((e5) => {
      if (e5.choices !== void 0 && e5.choices.every((e6) => {
        if (e6.length !== 1)
          return false;
        let t3 = e6[0];
        return t3.word !== void 0 && t3.negative !== true && t3.optional !== true && t3.method !== true;
      }) === true) {
        let t3 = {};
        e5.choices.forEach((e6) => {
          t3[e6[0].word] = true;
        }), e5.fastOr = t3, delete e5.choices;
      }
      return e5;
    });
  }(e3)), e3;
};
var _e = function(e3, t2 = {}) {
  if (e3 == null || e3 === "")
    return [];
  if (typeof e3 == "object") {
    if (function(e4) {
      return Object.prototype.toString.call(e4) === "[object Array]";
    }(e3)) {
      if (e3.length === 0 || !e3[0])
        return [];
      if (typeof e3[0] == "object")
        return e3;
      if (typeof e3[0] == "string")
        return function(e4) {
          return [{choices: e4.map((e5) => [{word: e5}]), operator: "or"}];
        }(e3);
    }
    return e3 && e3.isA === "Doc" ? function(e4) {
      if (!e4 || !e4.list || !e4.list[0])
        return [];
      let t3 = [];
      return e4.list.forEach((e5) => {
        let r3 = [];
        e5.terms().forEach((e6) => {
          r3.push(e6.id);
        }), t3.push(r3);
      }), [{idBlocks: t3}];
    }(e3) : [];
  }
  typeof e3 == "number" && (e3 = String(e3));
  let r2 = Je(e3);
  return r2 = r2.map((e4) => Le(e4)), r2 = Se(r2, t2), r2 = function(e4, t3) {
    return t3.fuzzy === true && (t3.fuzzy = 0.85), typeof t3.fuzzy == "number" && (e4 = e4.map((e5) => (t3.fuzzy > 0 && e5.word && (e5.fuzzy = t3.fuzzy), e5.choices && e5.choices.forEach((e6) => {
      e6.forEach((e7) => {
        e7.fuzzy = t3.fuzzy;
      });
    }), e5))), e4;
  }(r2, t2), r2;
};
const Ke = we, qe = $e, We = Pe, Re = _e, Ue = function(e3, t2) {
  let r2 = [], a2 = t2[0].idBlocks;
  for (let t3 = 0; t3 < e3.length; t3 += 1)
    a2.forEach((a3) => {
      if (a3.length === 0)
        return;
      a3.every((r3, a4) => e3[t3 + a4].id === r3) && (r2.push({match: e3.slice(t3, t3 + a3.length)}), t3 += a3.length - 1);
    });
  return r2;
};
var Qe = function(e3, t2, r2 = false) {
  if (typeof t2 == "string" && (t2 = Re(t2)), Ke(e3, t2) === true)
    return [];
  const a2 = t2.filter((e4) => e4.optional !== true && e4.negative !== true).length;
  let n2 = e3.terms(), i2 = [];
  if (t2[0].idBlocks) {
    let e4 = Ue(n2, t2);
    if (e4 && e4.length > 0)
      return We(n2, t2, e4);
  }
  if (t2[0].start === true) {
    let e4 = qe(n2, t2, 0, n2.length);
    return e4 && e4.match && e4.match.length > 0 && (e4.match = e4.match.filter((e5) => e5), i2.push(e4)), We(n2, t2, i2);
  }
  for (let e4 = 0; e4 < n2.length && !(e4 + a2 > n2.length); e4 += 1) {
    let a3 = qe(n2.slice(e4), t2, e4, n2.length);
    if (a3 && a3.match && a3.match.length > 0 && (e4 += a3.match.length - 1, a3.match = a3.match.filter((e5) => e5), i2.push(a3), r2 === true))
      return We(n2, t2, i2);
  }
  return We(n2, t2, i2);
};
const Ze = Qe;
const Xe = Qe, Ye = function(e3, t2) {
  let r2 = {};
  Ze(e3, t2).forEach(({match: e4}) => {
    e4.forEach((e5) => {
      r2[e5.id] = true;
    });
  });
  let a2 = e3.terms(), n2 = [], i2 = [];
  return a2.forEach((e4) => {
    r2[e4.id] !== true ? i2.push(e4) : i2.length > 0 && (n2.push(i2), i2 = []);
  }), i2.length > 0 && n2.push(i2), n2;
};
ye.match = function(e3, t2 = false) {
  let r2 = Xe(this, e3, t2);
  return r2 = r2.map(({match: e4, groups: t3}) => {
    let r3 = this.buildFrom(e4[0].id, e4.length, t3);
    return r3.cache.terms = e4, r3;
  }), r2;
}, ye.has = function(e3) {
  return Xe(this, e3, true).length > 0;
}, ye.not = function(e3) {
  let t2 = Ye(this, e3);
  return t2 = t2.map((e4) => this.buildFrom(e4[0].id, e4.length)), t2;
}, ye.canBe = function(e3, t2) {
  let r2 = [], a2 = this.terms(), n2 = false;
  for (let i2 = 0; i2 < a2.length; i2 += 1) {
    let o2 = a2[i2].canBe(e3, t2);
    o2 === true && (n2 === true ? r2[r2.length - 1].push(a2[i2]) : r2.push([a2[i2]]), n2 = o2);
  }
  return r2 = r2.filter((e4) => e4.length > 0).map((e4) => this.buildFrom(e4[0].id, e4.length)), r2;
};
const et = be, tt = ye;
class rt {
  constructor(e3, t2, r2) {
    this.start = e3, this.length = t2, this.isA = "Phrase", Object.defineProperty(this, "pool", {enumerable: false, writable: true, value: r2}), Object.defineProperty(this, "cache", {enumerable: false, writable: true, value: {}}), Object.defineProperty(this, "groups", {enumerable: false, writable: true, value: {}});
  }
}
rt.prototype.buildFrom = function(e3, t2, r2) {
  let a2 = new rt(e3, t2, this.pool);
  return r2 && Object.keys(r2).length > 0 ? a2.groups = r2 : a2.groups = this.groups, a2;
}, Object.assign(rt.prototype, tt), Object.assign(rt.prototype, et);
const at = {term: "terms"};
Object.keys(at).forEach((e3) => rt.prototype[e3] = rt.prototype[at[e3]]);
var nt = rt;
class it {
  constructor(e3 = {}) {
    Object.defineProperty(this, "words", {enumerable: false, value: e3});
  }
  add(e3) {
    return this.words[e3.id] = e3, this;
  }
  get(e3) {
    return this.words[e3];
  }
  remove(e3) {
    delete this.words[e3];
  }
  merge(e3) {
    return Object.assign(this.words, e3.words), this;
  }
  stats() {
    return {words: Object.keys(this.words).length};
  }
}
it.prototype.clone = function() {
  let e3 = Object.keys(this.words).reduce((e4, t2) => {
    let r2 = this.words[t2].clone();
    return e4[r2.id] = r2, e4;
  }, {});
  return new it(e3);
};
var ot = it;
var st = (e3) => {
  e3.forEach((t2, r2) => {
    r2 > 0 && (t2.prev = e3[r2 - 1].id), e3[r2 + 1] && (t2.next = e3[r2 + 1].id);
  });
};
const lt = /(\S.+?[.!?\u203D\u2E18\u203C\u2047-\u2049])(?=\s+|$)/g, ut = /\S/, ct = /[ .][A-Z]\.? *$/i, ht = /(?:\u2026|\.{2,}) *$/, dt = /((?:\r?\n|\r)+)/, gt = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i, pt = /^\s+/, mt = function(e3, t2, r2, a2) {
  if (a2.hasLetter = function(e4, t3) {
    return t3 || gt.test(e4);
  }(t2, a2.hasLetter), !a2.hasLetter)
    return false;
  if (function(e4, t3) {
    return t3.indexOf(".") !== -1 && ct.test(e4);
  }(e3, t2))
    return false;
  if (function(e4, t3) {
    return t3.indexOf(".") !== -1 && ht.test(e4);
  }(e3, t2))
    return false;
  let n2 = e3.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "").split(" "), i2 = n2[n2.length - 1].toLowerCase();
  return !r2.hasOwnProperty(i2);
};
var ft = function(e3, t2) {
  let r2 = t2.cache.abbreviations;
  e3 = e3 || "";
  let a2 = [], n2 = [];
  if (!(e3 = String(e3)) || typeof e3 != "string" || ut.test(e3) === false)
    return a2;
  let i2 = function(e4) {
    let t3 = [], r3 = e4.split(dt);
    for (let e5 = 0; e5 < r3.length; e5++) {
      let a3 = r3[e5].split(lt);
      for (let e6 = 0; e6 < a3.length; e6++)
        t3.push(a3[e6]);
    }
    return t3;
  }(e3 = e3.replace(" ", " "));
  for (let e4 = 0; e4 < i2.length; e4++) {
    let t3 = i2[e4];
    if (t3 !== void 0 && t3 !== "") {
      if (ut.test(t3) === false) {
        if (n2[n2.length - 1]) {
          n2[n2.length - 1] += t3;
          continue;
        }
        if (i2[e4 + 1]) {
          i2[e4 + 1] = t3 + i2[e4 + 1];
          continue;
        }
      }
      n2.push(t3);
    }
  }
  let o2 = n2[0] || "";
  const s2 = {hasLetter: false};
  for (let e4 = 0; e4 < n2.length; e4++) {
    let t3 = n2[e4];
    n2[e4 + 1] && mt(t3, o2, r2, s2) === false ? (o2 = n2[e4 + 1] || "", n2[e4 + 1] = t3 + o2) : t3 && t3.length > 0 && (a2.push(t3), o2 = n2[e4 + 1] || "", s2.hasLetter = false), n2[e4] = "";
  }
  if (a2.length === 0)
    return [e3];
  for (let e4 = 1; e4 < a2.length; e4 += 1) {
    let t3 = a2[e4].match(pt);
    t3 !== null && (a2[e4 - 1] += t3[0], a2[e4] = a2[e4].replace(pt, ""));
  }
  return a2;
};
const bt = /\S/, yt = /^[!?.]+$/, vt = /(\S+)/, wt = /[a-z] ?\/ ?[a-z]*$/;
let kt = [".", "?", "!", ":", ";", "-", "–", "—", "--", "...", "(", ")", "[", "]", '"', "'", "`"];
kt = kt.reduce((e3, t2) => (e3[t2] = true, e3), {});
const At = function(e3) {
  if (/^(re|un|micro|macro|trans|bi|mono|over)-?[^aeiou]./.test(e3) === true)
    return false;
  if (/^([a-z\u00C0-\u00FF/]+)(-|–|—)(like|ish|less|able)/i.test(e3) === true)
    return false;
  if (/^([a-z\u00C0-\u00FF`"'/]+)(-|–|—)([a-z0-9\u00C0-\u00FF].*)/i.test(e3) === true)
    return true;
  return /^([0-9]{1,4})(-|–|—)([a-z\u00C0-\u00FF`"'/-]+$)/i.test(e3) === true;
}, Dt = function(e3) {
  let t2 = [];
  const r2 = e3.split(/[-–—]/);
  let a2 = "-", n2 = e3.match(/[-–—]/);
  n2 && n2[0] && (a2 = n2);
  for (let e4 = 0; e4 < r2.length; e4++)
    e4 === r2.length - 1 ? t2.push(r2[e4]) : t2.push(r2[e4] + a2);
  return t2;
};
const $t = ne, Pt = nt, Et = ot, Ht = st, jt = ft, Nt = function(e3) {
  let t2 = [], r2 = [];
  if (typeof (e3 = e3 || "") == "number" && (e3 = String(e3)), function(e4) {
    return Object.prototype.toString.call(e4) === "[object Array]";
  }(e3))
    return e3;
  const a2 = e3.split(vt);
  for (let e4 = 0; e4 < a2.length; e4++)
    At(a2[e4]) !== true ? r2.push(a2[e4]) : r2 = r2.concat(Dt(a2[e4]));
  let n2 = "";
  for (let e4 = 0; e4 < r2.length; e4++) {
    let a3 = r2[e4];
    bt.test(a3) === true && kt.hasOwnProperty(a3) === false && yt.test(a3) === false ? (t2.length > 0 ? (t2[t2.length - 1] += n2, t2.push(a3)) : t2.push(n2 + a3), n2 = "") : n2 += a3;
  }
  return n2 && (t2.length === 0 && (t2[0] = ""), t2[t2.length - 1] += n2), t2 = function(e4) {
    for (let t3 = 1; t3 < e4.length - 1; t3++)
      wt.test(e4[t3]) && (e4[t3 - 1] += e4[t3] + e4[t3 + 1], e4[t3] = null, e4[t3 + 1] = null);
    return e4;
  }(t2), t2 = function(e4) {
    const t3 = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?(-|–|—) ?$/, r3 = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
    for (let a3 = 0; a3 < e4.length - 1; a3 += 1)
      e4[a3 + 1] && t3.test(e4[a3]) && r3.test(e4[a3 + 1]) && (e4[a3] = e4[a3] + e4[a3 + 1], e4[a3 + 1] = null);
    return e4;
  }(t2), t2 = t2.filter((e4) => e4), t2;
};
var xt = function(e3 = "", t2, r2) {
  let a2 = null;
  return typeof e3 != "string" && (typeof e3 == "number" ? e3 = String(e3) : function(e4) {
    return Object.prototype.toString.call(e4) === "[object Array]";
  }(e3) && (a2 = e3)), a2 = a2 || jt(e3, t2), a2 = a2.map((e4) => Nt(e4)), r2 = r2 || new Et(), a2.map((e4) => {
    e4 = e4.map((e5) => {
      let t4 = new $t(e5);
      return r2.add(t4), t4;
    }), Ht(e4);
    let t3 = new Pt(e4[0].id, e4.length, r2);
    return t3.cache.terms = e4, t3;
  });
};
const Ft = ne, Ct = nt, Bt = ot, Gt = st;
var zt = function(e3, t2) {
  let r2 = new Bt();
  return e3.map((e4, a2) => {
    let n2 = e4.terms.map((n3, i2) => {
      let o2 = new Ft(n3.text);
      return o2.pre = n3.pre !== void 0 ? n3.pre : "", n3.post === void 0 && (n3.post = " ", i2 >= e4.terms.length - 1 && (n3.post = ". ", a2 >= e4.terms.length - 1 && (n3.post = "."))), o2.post = n3.post !== void 0 ? n3.post : " ", n3.tags && n3.tags.forEach((e5) => o2.tag(e5, "", t2)), r2.add(o2), o2;
    });
    return Gt(n2), new Ct(n2[0].id, n2.length, r2);
  });
};
const It = ["Person", "Place", "Organization"];
const Ot = ["Noun", "Verb", "Adjective", "Adverb", "Value", "QuestionWord"];
const Tt = {Noun: "blue", Verb: "green", Negative: "green", Date: "red", Value: "red", Adjective: "magenta", Preposition: "cyan", Conjunction: "cyan", Determiner: "cyan", Adverb: "cyan"};
const Vt = function(e3) {
  return Object.keys(e3).forEach((t2) => {
    e3[t2].color ? e3[t2].color = e3[t2].color : Tt[t2] ? e3[t2].color = Tt[t2] : e3[t2].isA.some((r2) => !!Tt[r2] && (e3[t2].color = Tt[r2], true));
  }), e3;
}, Mt = function(e3) {
  return Object.keys(e3).forEach((t2) => {
    let r2 = e3[t2], a2 = r2.isA.length;
    for (let t3 = 0; t3 < a2; t3++) {
      let a3 = r2.isA[t3];
      e3[a3] && (r2.isA = r2.isA.concat(e3[a3].isA));
    }
    r2.isA = function(e4) {
      return e4.filter((e5, t3, r3) => r3.indexOf(e5) === t3);
    }(r2.isA);
  }), e3;
}, Jt = function(e3) {
  let t2 = Object.keys(e3);
  return t2.forEach((r2) => {
    let a2 = e3[r2];
    a2.notA = a2.notA || [], a2.isA.forEach((t3) => {
      if (e3[t3] && e3[t3].notA) {
        let r3 = typeof e3[t3].notA == "string" ? [e3[t3].isA] : e3[t3].notA || [];
        a2.notA = a2.notA.concat(r3);
      }
    });
    for (let n2 = 0; n2 < t2.length; n2++) {
      const i2 = t2[n2];
      e3[i2].notA.indexOf(r2) !== -1 && a2.notA.push(i2);
    }
    a2.notA = function(e4) {
      return e4.filter((e5, t3, r3) => r3.indexOf(e5) === t3);
    }(a2.notA);
  }), e3;
}, Lt = function(e3) {
  let t2 = Object.keys(e3);
  return t2.forEach((r2) => {
    let a2 = e3[r2];
    a2.lineage = [];
    for (let n2 = 0; n2 < t2.length; n2++)
      e3[t2[n2]].isA.indexOf(r2) !== -1 && a2.lineage.push(t2[n2]);
  }), e3;
};
var St = function(e3) {
  return e3 = function(e4) {
    return Object.keys(e4).forEach((t2) => {
      let r2 = e4[t2];
      r2.isA = r2.isA || [], typeof r2.isA == "string" && (r2.isA = [r2.isA]), r2.notA = r2.notA || [], typeof r2.notA == "string" && (r2.notA = [r2.notA]);
    }), e4;
  }(e3), e3 = Mt(e3), e3 = Jt(e3), e3 = Vt(e3), e3 = Lt(e3);
};
const _t = {Noun: {notA: ["Verb", "Adjective", "Adverb"]}, Singular: {isA: "Noun", notA: "Plural"}, ProperNoun: {isA: "Noun"}, Person: {isA: ["ProperNoun", "Singular"], notA: ["Place", "Organization", "Date"]}, FirstName: {isA: "Person"}, MaleName: {isA: "FirstName", notA: ["FemaleName", "LastName"]}, FemaleName: {isA: "FirstName", notA: ["MaleName", "LastName"]}, LastName: {isA: "Person", notA: ["FirstName"]}, NickName: {isA: "Person", notA: ["FirstName", "LastName"]}, Honorific: {isA: "Noun", notA: ["FirstName", "LastName", "Value"]}, Place: {isA: "Singular", notA: ["Person", "Organization"]}, Country: {isA: ["Place", "ProperNoun"], notA: ["City"]}, City: {isA: ["Place", "ProperNoun"], notA: ["Country"]}, Region: {isA: ["Place", "ProperNoun"]}, Address: {isA: "Place"}, Organization: {isA: ["Singular", "ProperNoun"], notA: ["Person", "Place"]}, SportsTeam: {isA: "Organization"}, School: {isA: "Organization"}, Company: {isA: "Organization"}, Plural: {isA: "Noun", notA: ["Singular"]}, Uncountable: {isA: "Noun"}, Pronoun: {isA: "Noun", notA: It}, Actor: {isA: "Noun", notA: It}, Activity: {isA: "Noun", notA: ["Person", "Place"]}, Unit: {isA: "Noun", notA: It}, Demonym: {isA: ["Noun", "ProperNoun"], notA: It}, Possessive: {isA: "Noun"}}, Kt = {Verb: {notA: ["Noun", "Adjective", "Adverb", "Value", "Expression"]}, PresentTense: {isA: "Verb", notA: ["PastTense", "FutureTense"]}, Infinitive: {isA: "PresentTense", notA: ["PastTense", "Gerund"]}, Imperative: {isA: "Infinitive"}, Gerund: {isA: "PresentTense", notA: ["PastTense", "Copula", "FutureTense"]}, PastTense: {isA: "Verb", notA: ["FutureTense"]}, FutureTense: {isA: "Verb"}, Copula: {isA: "Verb"}, Modal: {isA: "Verb", notA: ["Infinitive"]}, PerfectTense: {isA: "Verb", notA: "Gerund"}, Pluperfect: {isA: "Verb"}, Participle: {isA: "PastTense"}, PhrasalVerb: {isA: "Verb"}, Particle: {isA: "PhrasalVerb"}, Auxiliary: {notA: ["Noun", "Adjective", "Value"]}}, qt = {Value: {notA: ["Verb", "Adjective", "Adverb"]}, Ordinal: {isA: "Value", notA: ["Cardinal"]}, Cardinal: {isA: "Value", notA: ["Ordinal"]}, Fraction: {isA: "Value", notA: ["Noun"]}, RomanNumeral: {isA: "Cardinal", notA: ["Ordinal", "TextValue"]}, TextValue: {isA: "Value", notA: ["NumericValue"]}, NumericValue: {isA: "Value", notA: ["TextValue"]}, Money: {isA: "Cardinal"}, Percent: {isA: "Value"}}, Wt = {Adjective: {notA: ["Noun", "Verb", "Adverb", "Value"]}, Comparable: {isA: ["Adjective"]}, Comparative: {isA: ["Adjective"]}, Superlative: {isA: ["Adjective"], notA: ["Comparative"]}, NumberRange: {}, Adverb: {notA: ["Noun", "Verb", "Adjective", "Value"]}, Date: {notA: ["Verb", "Adverb", "Preposition", "Adjective"]}, Month: {isA: ["Date", "Singular"], notA: ["Year", "WeekDay", "Time"]}, WeekDay: {isA: ["Date", "Noun"]}, Timezone: {isA: ["Date", "Noun"], notA: ["Adjective", "ProperNoun"]}, Time: {isA: ["Date"], notA: ["AtMention"]}, Determiner: {notA: Ot}, Conjunction: {notA: Ot}, Preposition: {notA: Ot}, QuestionWord: {notA: ["Determiner"]}, Currency: {isA: ["Noun"]}, Expression: {notA: ["Noun", "Adjective", "Verb", "Adverb"]}, Abbreviation: {}, Url: {notA: ["HashTag", "PhoneNumber", "Verb", "Adjective", "Value", "AtMention", "Email"]}, PhoneNumber: {notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "Email"]}, HashTag: {}, AtMention: {isA: ["Noun"], notA: ["HashTag", "Verb", "Adjective", "Value", "Email"]}, Emoji: {notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]}, Emoticon: {notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]}, Email: {notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"]}, Acronym: {notA: ["Plural", "RomanNumeral"]}, Negative: {notA: ["Noun", "Adjective", "Value"]}, Condition: {notA: ["Verb", "Adjective", "Noun", "Value"]}}, Rt = St, Ut = function(e3, t2) {
  Object.keys(e3).forEach((r2) => {
    t2[r2] = e3[r2];
  });
};
var Qt = (() => {
  let e3 = {};
  return Ut(_t, e3), Ut(Kt, e3), Ut(qt, e3), Ut(Wt, e3), e3 = Rt(e3), e3;
})();
const Zt = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", Xt = Zt.split("").reduce(function(e3, t2, r2) {
  return e3[t2] = r2, e3;
}, {});
var Yt = function(e3) {
  if (Xt[e3] !== void 0)
    return Xt[e3];
  let t2 = 0, r2 = 1, a2 = 36, n2 = 1;
  for (; r2 < e3.length; t2 += a2, r2++, a2 *= 36)
    ;
  for (let r3 = e3.length - 1; r3 >= 0; r3--, n2 *= 36) {
    let a3 = e3.charCodeAt(r3) - 48;
    a3 > 10 && (a3 -= 7), t2 += a3 * n2;
  }
  return t2;
};
const er = function(e3, t2, r2) {
  const a2 = Yt(t2);
  return a2 < e3.symCount ? e3.syms[a2] : r2 + a2 + 1 - e3.symCount;
};
var tr = function(e3) {
  const t2 = {nodes: e3.split(";"), syms: [], symCount: 0};
  return e3.match(":") && function(e4) {
    const t3 = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
    for (let r2 = 0; r2 < e4.nodes.length; r2++) {
      const a2 = t3.exec(e4.nodes[r2]);
      if (!a2) {
        e4.symCount = r2;
        break;
      }
      e4.syms[Yt(a2[1])] = Yt(a2[2]);
    }
    e4.nodes = e4.nodes.slice(e4.symCount, e4.nodes.length);
  }(t2), function(e4) {
    const t3 = [], r2 = (a2, n2) => {
      let i2 = e4.nodes[a2];
      i2[0] === "!" && (t3.push(n2), i2 = i2.slice(1));
      const o2 = i2.split(/([A-Z0-9,]+)/g);
      for (let i3 = 0; i3 < o2.length; i3 += 2) {
        const s2 = o2[i3], l2 = o2[i3 + 1];
        if (!s2)
          continue;
        const u2 = n2 + s2;
        if (l2 === "," || l2 === void 0) {
          t3.push(u2);
          continue;
        }
        const c2 = er(e4, l2, a2);
        r2(c2, u2);
      }
    };
    return r2(0, ""), t3;
  }(t2);
};
const rr = {Comparative: "true¦better", Superlative: "true¦earlier", PresentTense: "true¦is,sounds", Value: "true¦a few", Noun: "true¦a5b4c2f1here,ie,lit,m0no doubt,pd,tce;a,d;t,y;a,ca,o0;l,rp;a,l;d,l,rc", Copula: "true¦a1is,w0;as,ere;m,re", PastTense: "true¦be3came,d2had,lied,meant,sa2taken,w0;as,e0;nt,re;id;en,gan", Condition: "true¦if,lest,unless", Preposition: "true¦'o,-,aLbIcHdGexcept,fFiDmidQnotwithstandiRoBpSqua,sAt6u3vi2w0;/o,hereNith0;!in,oR;a,s-a-vis;n1p0;!on;like,til;h0ill,owards;an,r0;ough0u;!oJ;ans,ince,o that;',f0n2ut;!f;f,n0;!to;or,rom;espite,own,u3;hez,irca;ar1e0oAy;sides,tween;ri6;',bo7cross,ft6lo5m3propos,round,s1t0;!op;! long 0;as;id0ong0;!st;ng;er;ut", Gerund: "true¦accord0be0develop0go0result0stain0;ing", Negative: "true¦n0;ever,o0;!n,t", QuestionWord: "true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s", Plural: "true¦records", Conjunction: "true¦&,aFbBcuz,how9in caEno8o7p5supposing,t2v1wh0yet;eth9ile;ers4s;h0o;eref9o0;!uC;l0rovided that;us;r,therwi6; matt1r;!ev0;er;e0ut;cau1f0;ore;se;lthou1nd,s 0;far as,if;gh", Abbreviation: "true¦a0Jb0Gc0Ad08e05f02g01h00iYjWkanVlTmNnKoJpFque,rDs8t6u5v2w0;is0r,y0B;!c;a,b,e1i0ol,s,t;tro,vo;r,t;niv,safa,t;ce,e0;l,mp,nn,x;ask,e2fc,gt,i1q,r,s,t,u0;pt,rg;r,tu;c,nJp0;!t;b,d,e0;pGs,v;a,d,ennNhd,l,p,r1s0vt;!eud;ef,o0;b,f,n;ct,kla,nt;e0ov;b0e;!r;a4d,essrs,i1lle,me,r7s0t;!tr;n1s0;c,ter;!n;!j,r,sc;at,it,lb,ng,t0;!d;!s;an,d,r,u0;l,n;a,da,e,n0;c,f;on,wy;a,en,ov;e1ig,l0m,r,t,y;!a;b,m;a,g,ng,s1tc,x0;!p;p,q,t;ak,e0ist,r;c,f,pt,t;a3ca,l,m2o0pl,res,yn;!l0m1nn,rp;!o;dr;!l0pt;!if;a,c,l1r0;ig,os;!dg,vd;d4l3p2r1ss0tty,ug,ve;n,t;c,iz;prox,r,t;!ta;!j,m,v", Pronoun: "true¦'em,elle,h4i3me,ourselves,she5th1us,we,you0;!rself;e0ou;m,y;!l,t;e0im;!'s", Singular: "true¦0:16;1:13;2:19;a16b0Tc0Kd0De0Af05g00hWiVjel0kitty,lTmPnOoNpHquestionGrEs9t6u4w3;ay,om03;nc10s 3;doll0Lst0N; rex,a4h3ic,ragedy,v show;ere,i2;l0x return;i6ky,omeoNt3uper bowl,yst15;ep4ri2u3;de0Yff;faTmoT;st1ze;al0i2o3;om,se;! mark;a7i1la6r4u3;dQrpoI;e3ie0Hobl0V;roga00ss releaG;te,y1;rt,te0N;bjWceJthers,verview;othi2umb1;a5ee08o3;del,m3nopo0rni2th1;!my;n,yf0;i3unch;ne;ci2nsect;ead start,o3uman right;l0me4u3;se;! run;adf0entlem6irl02laci1od,rand4u3;l0y; slam,fa3mo3;th1;an;a6ella,ly,ol0r4un3;di2;ee market,iWo3;nti1sP;mi0th1;conomy,gg,ner7ven4x3;ampTecu9;i2t;ad8e5inn1o3ragonf0ude;cumentGg3i0l0or;gy;ath,t3;ec3;tive;!dy;a9eili2h7i5o3redit card;ttage,u3;ri1sin;ty,vil w3;ar;andeli1ocol3;ate;n3rF;ary;aCel0lesJo8r5u3;n3tterf0;ti2;eakfa4o3;!th1;st;dy,tt5y3;!fri3;end;le;nki2r3;ri1;er;d5l0noma0u3;nt;ly; homin5verti3;si2;ng;em", FemaleName: "true¦0:J3;1:J7;2:IG;3:IF;4:IX;5:IK;6:JO;7:H0;8:JG;9:JK;A:HN;B:HY;C:IT;D:IP;E:JD;F:HC;G:I0;aGRbFLcDPdCYeBOfB4gADh9Ti9Gj8Gk7Gl60m49n3No3Jp37qu36r2Ds16t0Eu0Cv02wVxiTyOzH;aLeIineb,oHsof2;e3Uf2la,ra;h3iKlIna,ynH;ab,ep;da,ma;da,h3iHra;nab;aKeJi0Fol5BuIvH;etAonDO;i0na;le0sen2;el,gm3Jn,rGJs8W;aoHme0nyi;m62yAE;aMendDYhiDFiH;dele8lJnH;if48niHo0;e,f47;a,helmi0lHma;a,ow;ka0nB;aNeKiHusa5;cIktoriBMlAole7viH;anC3enJ0;kF9tor2;da,lA9nus,rHs0;a,nHoniH4;a,iFQ;leHnesH4;nIHrH;i1y;g8rHxH5;su5te;aYeUhRiNoLrIuHy3;i,la;acIZiHu0L;c2na,sH;hBPta;nHr0H;iBNya;aJffaEOnHs6;a,gtiH;ng;!nFQra;aIeHomasi0;a,l9Po8Ares1;l2ndolwethu;g9Go88rIssH;!a,ie;eHi,ri9;sa,za;bPlNmLnJrIs6tHwa0;ia0um;a63yn;iHya;a,ka,s6;arB6e3iHmEDra;!ka;a,iH;a,t6;at6it6;a0Fcarlet3We0BhXiTkye,neza0oRtNuIyH;bIBlvi1;e,ha,mayIEni7sIzH;an3MetAie,y;anHi9;!a,e,nH;aDe;aJeH;fHl5GphH;an4;cHZr5;b2fiA8m0OnHphi1;d3ia,ja,ya;er3lJmon1nIobh8PtH;a,i;dy;lEPv2;aMeIirHo0risF7y5;a,lDK;ba,e0i5lJrH;iHrDOyl;!d8Hfa;ia,lDX;hd,iMki3nJrIu0w0yH;la,ma,na;i,le8on,ron;aIda,ia,nHon;a,on;!ya;k6mH;!aa;lJrItaye81vH;da,inj;e0ife;en1i0ma;anA5bNd3Nh1RiBkMlLmJndIrHs6vannaD;aDi0;ra,y;aHi3;nt6ra;lDKma,ome;ee0in8Ru3;in1ri0;a05e00hYiVoIuH;by,thDH;bScRghQl2KnPsJwIxH;anAXie,y;an,e0;aIeHie,lE; merBLann9ll1marDBt7;!lHnn1;iHyn;e,nH;a,d9K;da,i,na;ayy8D;hel62io;bDKer7yn;a,cIkHmas,n9Fta,ya;ki,o;helGki;ea,iannGDoH;da,n1K;an0bJem9Agi0iInHta,y0;a88ee;han83na;a,eH;cEAkaD;bi0chIe,i0mo0nHquEKvCy0;di,ia;aEIelHiB;!e,le;een4ia0;aNeMhKipaluk,oJrHute66;iHudenCQ;scil3LyamvaB;lly,rt2;ilome0oebe,ylH;is,lis;arl,ggy,nelope,r5t3;ige,m0TnKo5rvaDGtIulH;a,etAin1;ricHsy,tBY;a,e,ia;do3i06;ctav2dIfCZis6lHphCZumC3yunbileg;a,ga,iv2;eHvAC;l2tA;aWeUiMoIurHy5;!ay,ul;a,eJor,rIuH;f,r;aDeCma;ll1mi;aNcLhariBOkKlaJna,sHta,vi;anHha;ur;!y;a,iDTki;hoGk9VolH;a,eDJ;!mh;hir,lHna,risFsreC;!a,lBT;asuLdKh2i6CnJomi9rgEPtHzanin zah3;aHhal4;li1s6;cy,etA;a,e8iEV;nngu30;a09ckenz4e01iMoJrignayani,uriDDyH;a,rH;a,lNna,tG;bi0i3llBInH;a,iH;ca,ka,qD3;a,cTkaSlNmi,nLrItzi,yH;ar;aIiam,lH;anEO;!l,nB;dy,eHh,n4;nhGrva;aKdJiCPlH;iHy;cent,e;red;!gros;!e5;ae5hH;ae5el3Z;ag5EgNi,lKrH;edi79iIjem,on,yH;em,l;em,sF;an4iHliF;nHsCE;a,da;!an,han;b0DcASd0Be,g09ha,i08ja,l06n04rLsoum60tKuIv82x9IyHz4;a,bell,ra,soB9;de,rH;a,eC;h8Fild1t4;a,cYgUiKjor4l7Sn4s6tJwa,yH;!aHbe6Wja8lAE;m,nBH;a,ha,in1;!aJbCBeIja,lEna,sHt64;!a,ol,sa;!l1H;! Jh,mInH;!a,e,n1;!awit,i;aliAHcJeduarBfernIjHlui5Y;o6Ful2;anB;ecil2la3;arJeIie,oHr44ueriA;!t;!ry;et42i37;el4Ui76y;dHon,ue5;akran7y;ak,en,iHk,lo3O;a,ka,nB;a,re,s4te;daHg4;!l3A;alEd4elHge,isDBon0;ei8in1yn;el,le;a0Ne0CiYoQuLyH;d2la,nH;!a,dIeBGnHsCL;!a,eBF;a,sCJ;aCWcJel0PiFlIna,pHz;e,i7;a,u,wa;iHy;a0Se,ja,l2JnB;is,l1SrJttIuHvel4;el5is1;e,ie;aKeIi9na,rH;a86i9;lHn1t7;ei;!in1;aSbb9CdRepa,lMnJsIv2zH;!a,be5LetAz4;a,etA;!a,dH;a,sHy;ay,ey,i,y;a,iJja,lHy;iHy;aA0e;!aH;!n5F;ia,ya;!nH;!a,ne;aPda,e0iNjYla,nMoKsJtHx4y5;iHt4;c2t2;e2LlCG;la,nHra;a,ie,o3;a,or1;a,gh,laH;!ni;!h,nH;a,d3e,n5P;cOdon97iNkes6mi9Ana,rMtJurIvHxmi,y5;ern1in2;a,e54ie,yn;as6iIoH;nya,ya;fa,s6;a,isF;a,la;ey,ie,y;a04eZhXiOlAKoNrJyH;lHra;a,ee,ie;istHy6D;a,en,iIyH;!na;!e,n59;nul,ri,urtnB0;aOerNlAZmJrHzzy;a,stH;en,in;!berlImernH;aq;eHi,y;e,y;a,stC;!na,ra;aHei3ongordzol;dij1w5;el7QiKjsi,lJnIrH;a,i,ri;d3na,za;ey,i,lBDs4y;ra,s6;bi7cAJdiat7IeB2iRlQmPnyakuma19rNss6KtKvi7yH;!e,lH;a,eH;e,i8L;a6DeIhHi4NlEri0y;ar6Ber6Bie,leCrB2y;!lyn8Gri0;a,en,iHl5Soli0yn;!ma,n3VsF;a5il1;ei8Ei,l4;a,tl6L;a07eYiVoNuH;anLdKliHst63;a8HeHsF;!n8tH;!a,te;e5Ji3Jy;a,i7;!anNcelEd6RelGhan7RlLni,sIva0yH;a,ce;eHie;fHlEph5U;a,in1;eHie;en,n1;!a,e,n41;lHng;!i1ClH;!i1B;anMle0nJrIsH;i8Csi8C;i,ri;!a,elGif2CnH;a,etAiHy;!e,f2A;a,e8EiInH;a,e8DiH;e,n1;cMd1mi,nIque4Xsmin3Ovie3y8zH;min9;a9eIiH;ce,e,n1s;!lHsFt0F;e,le;inIk4lEquelH;in1yn;da,ta;lRmPnOo0rNsIvaHzaro;!a0lu,na;aJiIlaHob84;!n9N;do3;!belHdo3;!a,e,l39;a77en1i0ma;a,di3es,gr6Yji;a8elBogH;en1;a,e8iHo0se;a0na;aSeOiJoHusFyacin2B;da,ll4rten23snH;a,i9Q;lImaH;ri;aIdHlaI;a,egard;ry;ath1CiJlInriet7rmi8sH;sa,t1B;en2Sga,mi;di;bi2Dil8IlNnMrJsItHwa,yl8Iz7H;i5St4;n5Yti;iHmo51ri52;etH;!te;aDnaD;a,ey,l4;a03eXiSlQoOrKunJwH;enHyne1Q;!dolE;ay,el;acIetHiselB;a,chC;e,ieH;!la;ld1AogooH;sh;adys,enHor2yn2H;a,da,na;aKgi,lIna,ov89selHta;a,e,le;da,liH;an;!n0;mLnJorgIrH;ald3Pi,m3Ctru8B;etAi4W;a,eHna;s26vieve;ma;bIil,le,mHrnet,yG;al5Ni5;i5FrielH;a,l1;aVeSiRloOoz2rH;anJeIiH;da,eB;da,ja;!cH;esIiHoi0O;n1s61;!ca;!rH;a,encH;e,ia;en,o0;lIn0rnH;!anB;ec2ic2;jr,n7rKtHy9;emIiHma,ouma7;ha,ma,n;eh;ah,iBrah,za0;cr4Nd0Ne0Mi0Lk7l04mWn4YrTsNtMuLvH;aJelIiH;!e,ta;in0Gyn;!ngel2S;geni1la,ni45;h5Sta;mLperanKtH;eIhHrel5;er;l30r9;za;a,eralB;iHma,nest2Jyn;cHka,n;a,ka;a,eMiJmH;aHie,y;!li8;lHn1;ee,iHy;a,e,ja;lHrald;da,y;aWeUiNlMma,no3oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c2da,f,nMsJzaH;!betHve7;e,h;aHe,ka;!beH;th;!a,or;anor,nH;!a;!in1na;leCs6;vi;eIiHna,wi0;e,th;l,n;aYeMh2iLjeneKoHul30;lor5Tminiq4In3FrHtt4;a,eCis,la,othHthy;ea,y;ba;an0AnaDon8x4ya;anQbPde,eOiMja,lJmetr2nHsir5K;a,iH;ce,se;a,iIla,orHphi8;es,is;a,l6D;dHrdH;re;!d5Cna;!b2HoraDra;a,d3nH;!a,e;hl2i0l0HmNnLphn1rIvi1XyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,etAiH;!ca,el1Cka,z;arHia;is;a0Se0Oh05i03lVoKrIynH;di,th2;istHy05;al,i0;lPnMrIurH;tn1E;aJd2NiHn2Nri8;!nH;a,e,n1;!l1X;cepci59n4sH;tanHuelo;ce,za;eHleC;en,tA;aJeoIotH;il51;!pat3;ir9rJudH;etAiH;a,ne;a,e,iH;ce,sZ;a3er3ndH;i,y;aReNloe,rH;isJyH;stH;al;sy,tH;a1Ren,iHy;!an1e,n1;deJlseIrH;!i9yl;a,y;li8;nMrH;isKlImH;ai8;a,eHotA;n1tA;!sa;d3elGtH;al,elG;cIlH;esAi44;el2ilH;e,ia,y;itlZlYmilXndWrOsMtHy5;aKeJhHri0;erHleCrEy;in1;ri0;li0ri0;a33sH;a32ie;a,iNlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eHie,o7y;ne,y;na,sF;a0Hi0H;a,e,l1;is7l4;in,yn;a0Ie02iZlXoUrH;andSeQiJoIyH;an0nn;nwEok9;an3DdgLg0XtH;n2XtH;!aInH;ey,i,y;ny;etH;!t9;an0e,nH;da,na;i9y;bbi9glarIlo05nH;i7n4;ka;ancHossom,ythe;a,he;an17lja0nHsm3I;i7tH;ou;aUcky,linTni7rPssOtJulaDvH;!erlH;ey,y;hJsy,tH;e,iHy9;e,na;!anH;ie,y;!ie;nHt6yl;adIiH;ce;etAi8;ay,da;!triH;ce,z;rbJyaH;rmH;aa;a3ie,o3ra;a2Sb2Md23g1Zi1Qj5l16m0Xn09oi,r04sUtTuPvOwa,yIzH;ra,u0;aKes6gJlIseH;!l;in;un;!nH;a,na;a,i2Ir2J;drJgus1RrIsteH;ja;el2;a,ey,i,y;aahua,he0;hIi2Gja,mi7s2DtrH;id;aMlIraqHt21;at;eIi9yH;!n;e,iHy;gh;!nH;ti;iJleIo6pi7;ta;en,n1tA;aHelG;!n1J;a00dje5eYgUiSjQnJohito,toHya;inetAnH;el5ia;!aKeIiHmJ;e,ka;!mHtA;ar4;!belIliFmU;sa;!le;a,eliH;ca;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!tA;te;! JbImHstasiNya;ar2;el;cla3jul2pau5;aLberKeliJiHy;e,l2naH;!ta;a,ja;!ly;hGiIl2nB;da;a,ra;le;aWba,ePiMlKma,thJyH;a,c2sH;a,on,sa;ea;iHys0N;e,s0M;a,cIn1sHza;a,e,ha,on,sa;e,ia,ja;c2is6jaKksaKna,sJxH;aHia;!nd3;ia,saH;nd3;ra;ia;i0nIyH;ah,na;a,is,naDoud;la;c6da,leCmNnLsH;haDlH;inHyY;g,n;!h;a,o,slH;ey;ee;en;at6g4nIusH;ti0;es;ie;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;!aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lEsH;on;yn;!lH;i8yn;ne;aKbIiHrL;!gaK;ey,i9y;!e;gaH;il;dKliyJradhIs6;ha;ya;ah;a,ya", Actor: "true¦aJbGcFdCengineIfAgardenIh9instructPjournalLlawyIm8nurse,opeOp5r3s1t0;echnCherapK;ailNcientJecretary,oldiGu0;pervKrgeon;e0oofE;ceptionGsearC;hotographClumbColi1r0sychologF;actitionBogrammB;cem6t5;echanic,inist9us4;airdress8ousekeep8;arm7ire0;fight6m2;eputy,iet0;ici0;an;arpent2lerk;ricklay1ut0;ch0;er;ccoun6d2ge7r0ssis6ttenda7;chitect,t0;ist;minist1v0;is1;rat0;or;ta0;nt", Honorific: "true¦a01bYcQdPeOfiJgIhon,jr,king,lHmCoffic00p7queen,r3s0taoiseach,vice6;e1fc,gt,ir,r,u0;ltRpt,rg;cond liInBrgeaJ;abbi,e0;ar1p9s,v0;!erend; admirX;astOhd,r0vt;esideDi1of0;!essM;me mini4nce0;!ss;a3essrs,i2lle,me,r1s0;!tr;!s;stK;gistrate,j,r6yF;i3lb,t;en,ov;eld mar3rst l0;ady,i0;eutena0;nt;shG;sq,xcellency;et,oct6r,utchess;apt6hance4mdr,o0pl;lonel,m2ngress0unci3;m0wom0;an;dr,mand5;ll0;or;!ain;ldg,rig0;!adi0;er;d0sst,tty,yatullah;j,m0v;!ir0;al", SportsTeam: "true¦0:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls", Uncountable: "true¦0:1J;a1Qb1Ic19d16e0Zf0Tg0Mh0Hi0Dj0Cknowled1Pl07mXnWoVpRrMsBt6vi5w1;a3ea0Ai2oo1;d,l;ldlife,ne;rmth,t0;neg16ol0Btae;e4h3oothpaste,r1una;affSou1;ble,sers,t;ermod1Lund0;a,nnis;a9cene09eri0Wh8il7kittl0Wnow,o6p4t2u1;g0Znshi0P;ati1Ke1;am,el;ace1De1;ci0Red;ap,cc0;k,v0;eep,ingl0O;d0Cfe17l1nd,tish;m10t;a4e2ic1;e,ke0L;c1laxa0Hsearch;ogni0Grea0G;bi0Hin;aOe3hys17last8o1ress03;l1rk,w0;it15y9;a11trY;bstetr13il,xygen;ational securi0Vews;a8e6ilk,o3u1;mps,s1;ic;n1o0G;ey,o1;gamy;a1chan0V;sl03t;chine1il,themat0T; learn09ry;aught0e3i2ogi0Qu1;ck,g0G;ce,ghtn06ngui0OteratL;a1isK;th0;ewel8usti0J;ce,mp1nformaStself;a1ortan0H;ti1;en0F;a4isto3o1;ck1mework,n1spitali09;ey;ry;ir,libut,ppiB;ene4o2r1um,ymna0B;aAound;l1ssip;d,f; 1t08;editOpo1;ol;i5lour,o2urnit1;ure;od,rgive1uri0wl;ne1;ss;c7sh;conomZduca6lectr5n3quip4thZvery1;body,o1thF;ne;joy1tertain1;ment;iciNonU;tiG;ar2iabet1raugh2;es;ts;a8elcius,h4ivPl3o1urrency;al,ld w1nfusiBttB;ar;assMoth3;aos,e1;e2w1;ing;se;r5sh;a5eef,i2lood,owls,read,utt0;er;lliar2s1;on;ds;g1ss;ga1;ge;c6dvi5ero3ir2mnes1rt,thlet8;ty;craft;b5d1naut5;ynam4;ce;id,ou1;st1;ics", Infinitive: "true¦0:6S;1:76;2:5C;3:74;4:73;5:67;6:6F;7:6Y;8:6Q;9:72;A:70;B:5X;C:6X;D:6L;E:77;F:5B;a6Kb66c57d4De3Xf3Jg3Dh37i2Uj2Sk2Ql2Hm26n23o1Yp1Jr0Rs06tYuTvOwHyG;awn,e31ield;aJe1Zhist6iIoGre6D;nd0rG;k,ry;pe,sh,th0;lk,nHrGsh,tDve;n,raE;d0t;aJiHoG;te,w;eGsC;!w;l6Jry;nHpGr4se;gra4Pli41;dGi9lo5Zpub3Q;erGo;mi5Cw1I;aMeLhKig5SoJrHuGwi7;ne,rn;aGe0Mi5Uu7y;de,in,nsf0p,v5J;r2ZuD;ank,reatB;nd,st;ke pa53lk,rg1Qs9;aZcWeVhTi4Dkip,lSmRnee3Lo52pQtJuGwitD;bmCck,ff0gge7ppHrGspe5;ge,pri1rou4Zvi3;ly,o36;aLeKoJrHuG;dy,mb6;aFeGi3;ngthBss,tD;p,re;m,p;in,ke,r0Qy;la58oil,rink6;e1Zi6o3J;am,ip;a2iv0oG;ck,rtBut;arDem,le5n1r3tt6;aHo2rG;atDew;le,re;il,ve;a05eIisk,oHuG;in,le,sh;am,ll;a01cZdu8fYgXje5lUmTnt,pQquPsKtJvGwa5V;eGiew,o36;al,l,rG;se,t;aFi2u44;eJi7oItG;!o2rG;i5uc20;l3rt;mb6nt,r3;e7i2;air,eHlGo43r0K;a8y;at;aFemb0i3Zo3;aHeGi3y;a1nt;te,x;a5Dr0J;act1Yer,le5u1;a13ei3k5PoGyc6;gni2Cnci6rd;ch,li2Bs5N;i1nG;ge,k;aTerSiRlOoMrIuG;b21ll,mp,rGsh;cha1s4Q;ai1eIiEoG;cGdu8greAhibCmi1te7vi2W;eAlaim;di5pa2ss,veE;iEp,rtr46sGur;e,t;aHead,uG;g,n4;n,y;ck,le;fo34mCsi7;ck,iErt4Mss,u1;bJccur,ff0pera9utweIverGwe;co47lap,ta22u1wG;helm;igh;ser3taF;eHotG;e,i8;ed,gle5;aMeLiIoHuG;ltip3Grd0;nit13ve;nHrr12sreprG;eseE;d,g6us;asu2lt,n0Nr4;intaFna4rHtG;ch,t0;ch,kGry;et;aMeLiJoGu1C;aHck,oGve;k,sB;d,n;ft,g35ke,mCnk,st2YveG;!n;a2Fc0Et;b0Nck,uG;gh,nD;iGno34;ck,ll,ss;am,oFuG;d4mp;gno2mQnGss3H;cOdica9flu0MhNsKtIvG;eGol3;nt,st;erGrodu8;a5fe2;i7tG;aGru5;ll;abCibC;lu1Fr1D;agi24pG;lemeEo22ro3;aKeIi2oHuG;nt,rry;n02pe,st;aGlp;d,t;nd6ppBrm,te;aKloAove1PrIuG;arGeAi15;ant39d;aGip,ow,umb6;b,sp;in,th0ze;aReaQiOlMoJrHuncG;ti3J;acGeshB;tu2;cus,lHrG;ce,eca7m,s30;d,l24;a1ZoG;at,od,w;gu2lGni1Xt,x;e,l;r,tu2;il,stBvG;or;a15cho,le5mSnPstNvalua9xG;a0AcLerKi7pGte19;a18eHi2laFoGreA;rt,se;ct,riG;en8;ci1t;el,han4;abGima9;li1J;ab6couXdHfor8ga4han8j03riDsu2t0vG;isi2Vy;!u2;body,er4pG;hasiGow0;ze;a07eUiLoKrHuG;mp;aHeAiG;ft;g,in;d4ubt;ff0p,re5sHvG;iZor8;aKcHliGmiApl1Btingui14;ke;oGuA;uGv0;ra4;gr1YppG;ear,ro3;cOeNfLliv0ma0Fny,pKsHterG;mi0G;cribe,er3iHtrG;oy;gn,re;a0Be0Ai5osC;eGi0By;at,ct;m,pB;iIlHrG;ea1;a2i06;de;ma4n8rGte;e,kB;a0Ae09h06i9l04oJrG;aHeGoAu0Hy;a9dC;ck,ve;llZmSnHok,py,uGv0;gh,nt;cePdu5fMsKtIvG;eGin8;rt,y;aFin0VrG;a7ibu9ol;iGtitu9;d0st;iHoGroE;rm;gu2rm;rn;biLfoKmaJpG;a2laF;in;re;nd;rt;ne;ap1e5;aGip,o1;im,w;aHeG;at,ck,w;llen4n4r4se;a1nt0;ll,ncIrGt0u1;eGry;!en;el;aSePloOoMrIuG;lGry;ly;igHuG;sh;htB;en;a7mb,o7rrGth0un8;ow;ck;ar,lHnefCtrG;ay;ie3ong;ng,se;band0Jc0Bd06ffo05gr04id,l01mu1nYppTrQsKttGvoid,waC;acIeHra5;ct;m0Fnd;h,k;k,sG;eIiHocia9uG;me;gn,st;mb6rt;le;chHgGri3;ue;!i3;eaJlIroG;aDve;ch;aud,y;l,r;noun8sw0tG;icipa9;ce;lHt0;er;e4ow;ee;rd;aRdIju7mCoR;it;st;!reA;ss;cJhie3knowled4tiva9;te;ge;ve;eIouEu1;se;nt;pt;on", Unit: "true¦0:19;a14b12c0Od0Ne0Lf0Gg0Ch09in0Hjoule0k02l00mNnMoLpIqHsqCt7volts,w6y4z3°2µ1;g,s;c,f,n;b,e2;a0Nb,d0Dears old,o1;tt0H;att0b;able4b3d,e2on1sp;!ne0;a2r0D;!l,sp;spo04; ft,uare 1;c0Id0Hf3i0Fkilo0Jm1ya0E;e0Mil1;e0li0H;eet0o0D;t,uart0;ascals,e2i1ou0Pt;c0Mnt0;rcent,t02;hms,uYz;an0JewtT;/s,b,e9g,i3l,m2p1²,³;h,s;!²;!/h,cro5l1;e1li08;! pFs1²;! 1;anEpD;g06s0B;gQter1;! 2s1;! 1;per second;b,i00m,u1x;men0x0;b,elvin0g,ilo2m1nR;!/h,ph,²;byZgXmeter1;! p2s1;! p1;er1; hour;e1g,r0z;ct1rtz0;aXogQ;al2b,igAra1;in0m0;!l1;on0;a4emtPl2t1;²,³; oz,uid ou1;nce0;hrenheit0rad0;b,x1;abyH;eciCg,l,mA;arat0eAg,m9oulomb0u1;bic 1p0;c5d4fo3i2meAya1;rd0;nch0;ot0;eci2;enti1;me4;!²,³;lsius0nti1;g2li1me1;ter0;ram0;bl,y1;te0;c4tt1;os1;eco1;nd0;re0;!s", Organization: "true¦0:46;a3Ab2Qc2Ad21e1Xf1Tg1Lh1Gi1Dj19k17l13m0Sn0Go0Dp07qu06rZsStFuBv8w3y1;amaha,m0Xou1w0X;gov,tu2S;a3e1orld trade organizati41;lls fargo,st1;fie22inghou16;l1rner br3D;-m11gree31l street journ25m11;an halNeriz3Wisa,o1;dafo2Gl1;kswagLvo;bs,kip,n2ps,s1;a tod2Rps;es35i1;lev2Xted natio2Uv; mobi2Kaco bePd bMeAgi frida9h3im horto2Tmz,o1witt2W;shiba,y1;ota,s r Y;e 1in lizzy;b3carpen33daily ma2Xguess w2holli0rolling st1Ms1w2;mashing pumpki2Ouprem0;ho;ea1lack eyed pe3Fyrds;ch bo1tl0;ys;l2s1;co,la m12;efoni07us;a6e4ieme2Gnp,o2pice gir5ta1ubaru;rbucks,to2N;ny,undgard1;en;a2Rx pisto1;ls;few25insbu26msu1X;.e.m.,adiohead,b6e3oyal 1yan2X;b1dutch she4;ank;/max,aders dige1Ed 1vl32;bu1c1Uhot chili peppe2Klobst28;ll;c,s;ant2Vizno2F;an5bs,e3fiz24hilip morrBi2r1;emier27octer & gamb1Rudenti14;nk floyd,zza hut;psi28tro1uge08;br2Qchina,n2Q; 2ason1Xda2G;ld navy,pec,range juli2xf1;am;us;a9b8e5fl,h4i3o1sa,wa;kia,tre dame,vart1;is;ke,ntendo,ss0K;l,s;c,st1Etflix,w1; 1sweek;kids on the block,york08;a,c;nd1Us2t1;ional aca2Fo,we0Q;a,cYd0O;aAcdonald9e5i3lb,o1tv,yspace;b1Nnsanto,ody blu0t1;ley crue,or0O;crosoft,t1;as,subisO;dica3rcedes2talli1;ca;!-benz;id,re;'s,s;c's milk,tt13z1Y;'ore09a3e1g,ittle caesa1Ktd;novo,x1;is,mark; pres5-z-boy,bour party;atv,fc,kk,m1od1K;art;iffy lu0Lo3pmorgan1sa;! cha1;se;hnson & johns1Sy d1R;bm,hop,n1tv;c,g,te1;l,rpol; & m,asbro,ewlett-packaTi3o1sbc,yundai;me dep1n1J;ot;tac1zbollah;hi;eneral 6hq,l5mb,o2reen d0Iu1;cci,ns n ros0;ldman sachs,o1;dye1g0B;ar;axo smith kliZencore;electr0Im1;oto0V;a3bi,da,edex,i1leetwood mac,oGrito-l0A;at,nancial1restoV; tim0;cebook,nnie mae;b06sa,u3xxon1; m1m1;ob0H;!rosceptics;aiml0Ae5isney,o3u1;nkin donuts,po0Wran dur1;an;j,w j1;on0;a,f leppa3ll,p2r spiegZstiny's chi1;ld;eche mode,t;rd;aEbc,hBi9nn,o3r1;aigsli5eedence clearwater reviv1ossra05;al;!ca c5l4m1o0Ast05;ca2p1;aq;st;dplMgate;ola;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r0Hy;dbury,pital o1rl's jr;ne;aGbc,eCfAl6mw,ni,o2p,r1;exiteeWos;ei3mbardiJston 1;glo1pizza;be;ng;ack & deckFo2ue c1;roX;ckbuster video,omingda1;le; g1g1;oodriN;cht3e ge0n & jer2rkshire hathaw1;ay;ryH;el;nana republ3s1xt5y5;f,kin robbi1;ns;ic;bXcSdidRerosmith,ig,lLmFnheuser-busEol,ppleAr7s3t&t,v2y1;er;is,on;hland2s1;n,ociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 4catel2t1;air;!-luce1;nt;jazeera,qae1;da;as;/dc,a3er,t1;ivisi1;on;demy of scienc0;es;ba,c", Demonym: "true¦0:16;1:13;a0Wb0Nc0Cd0Ae09f07g04h02iYjVkTlPmLnIomHpDqatari,rBs7t5u4v3wel0Rz2;am0Fimbabwe0;enezuel0ietnam0H;g9krai1;aiwThai,rinida0Iu2;ni0Qrkmen;a4cot0Ke3ingapoOlovak,oma0Tpa05udRw2y0X;edi0Kiss;negal0Br08;mo0uU;o6us0Lw2;and0;a3eru0Hhilipp0Po2;li0Ertugu06;kist3lesti1na2raguay0;ma1;ani;amiZi2orweP;caragu0geri2;an,en;a3ex0Mo2;ngo0Erocc0;cedo1la2;gasy,y08;a4eb9i2;b2thua1;e0Dy0;o,t02;azakh,eny0o2uwaiti;re0;a2orda1;ma0Bp2;anN;celandic,nd4r2sraeli,ta02vo06;a2iT;ni0qi;i0oneV;aiDin2ondur0unN;di;amDe2hanai0reek,uatemal0;or2rm0;gi0;i2ren7;lipino,n4;cuadoVgyp6ngliJsto1thiopi0urope0;a2ominXut4;niH;a9h6o4roa3ub0ze2;ch;ti0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el8o6r3ul2;gaG;aziBi2;ti2;sh;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;gent2me1;ine;ba1ge2;ri0;ni0;gh0r2;ic0;an", Possessive: "true¦anyAh5its,m3noCo1sometBthe0yo1;ir1mselves;ur0;!s;i8y0;!se4;er1i0;mse2s;!s0;!e0;lf;o1t0;hing;ne", Currency: "true¦$,aud,bScQdLeurKfJgbp,hkd,iIjpy,kGlEp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotySł;en,uanR;af,of;h0t5;e0il5;k0q0;elM;iel,oubleLp,upeeL;e2ound st0;er0;lingI;n0soH;ceGn0;ies,y;e0i8;i,mpi7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!o8;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;ad,e0ny;nt1;aht,itcoin0;!s", City: "true¦0:73;1:61;2:6G;3:5U;4:5R;a68b54c4Id4Ae46f3Yg3Jh38i2Zj2Uk2Dl22m1Kn19o16p0Uq0Sr0Ls01tPuOvLwDxiBy9z5;a7h5i4Muri4O;a5e5ongsh0;ng3J;greb,nzib5G;ang2e5okoha3Uunfu;katerin3Jrev0;a5n0O;m5Hn;arsBeAi6roclBu5;h0xi,zh5P;c7n5;d5nipeg,terth4;hoek,s1K;hi5Zkl3C;l63xford;aw;a6ern2i5ladivost5Molgogr6K;en3lni6R;lenc6Dncouv2Yr3ughn;lan bat1Drumqi,trecht;aDbilisi,eCheBi9o8r7u5;l21n63r5;in,ku;ipoli,ondh62;kyo,m34ron1QulouS;an5jua3l2Zmisoa6Era3;j4Xshui; hag65ssaloni2L;gucigal28hr0l av1W;briz,i6llinn,mpe5Ang5rtu,shk2X;i2Msh0;an,chu1n0p2Iyu0;aEeDh8kopje,owe1It7u5ydney;ra5zh51;ba0Jt;aten is59ockholm,rasbou6Auttga31;an8e6i5;jiazhua1llo1m60y0;f54n5;ya1zh4L;gh3Ot4U;att4Ao1Yv49;cramen18int DlBn5o paulo,ppo3Wrajevo; 7aa,t5;a 5ia3Io domin3I;a3fe,m1O;antonCdie3Gfrancisco,j5ped3Ssalv8;o5u0;se;em,v5z2B;ad0I;lou59peters29;aAe9i7o5;me,sar5t5A;io;ga,o5yadh;! de janei3I;cife,ykjavik;b4Uip4lei2Mnc2Swalpindi;ingdao,u5;ez2i0Q;aEeDhCiBo8r7u6yong5;ya1;eb5Aya1;ag54etor53;rt5zn0; 5la4Fo;au prin0Nelizabe29sa05;ls3Srae5Ctts2B;iladelph4Ynom pe1Doenix;r26tah tik3I;ler00naji,r4Pt5;na,r36;ak47des0Lm1Rr6s5ttawa;a3Ylo;an,d07;a8ew6i5ovosibir1Oyc;ng2Hs; 5cast39;del27orlea46taip16york;g8iro4Xn5pl2Zshv36v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0Y;aFeCi9o6u5;mb2Cni28sc40;gadishu,nt6s5;c17ul;evideo,re31;ami,l6n18s5;kolc,sissauga;an,waukee;cca,d5lbour2Pmph41;an,ell5i3;in,ín;cau,drAkass2Tl9n8r5shh4A;aca6ib5rakesh,se2N;or;i1Ty;a4EchEdal12i47;mo;id;aCeiAi8o6u5vRy2;anLckn0Rdhia3;n5s angel28;d2g bea1O;brev2De3Kma5nz,sb2verpo2A;!ss29;c5pzig;est0C; p6g5ho2Yn0Gusan27;os;az,la35;aHharFiClaipeBo9rak0Hu7y5;iv,o5;to;ala lump4n5;mi1sh0;be,hi0Llka2Zpavog4si5wlo2;ce;da;ev,n5rkuk;gSsha5;sa;k5toum;iv;bIdu3llakuric0Tmpa3Gn6ohsiu1ra5un1Lwaguc0T;c0Sj;d5o,p4;ah1Vy;a7e6i5ohannesZ;l1Xn0;dd37rusalem;ip4k5;ar2J;bad0mph1QnBrkutYs8ta01z5̇zm7;m6tapala5;pa;ir;fah0l6tanb5;ul;am2Zi2I;che2d5;ianap2Lo21;aBe8o5yder2W; chi mi6ms,nolulu,u5;st2;nh;f6lsin5rakli2;ki;ei;ifa,lifax,m7n5rb1Dva3;gAnov5oi;er;bu2Wilt2;aFdanEenDhCiPlasgBo9raz,u5;a5jr21;dal6ng5yaquil;zh1H;aja2Lupe;ld coa18then5;bu2P;ow;ent;e0Toa;sk;lw7n5za;dhi5gt1C;nag0S;ay;aisal26es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Nl paso;in5mont2;bur5;gh;aAe8ha0Visp4o7resd0Ju5;b5esseldorf,rb0shanbe;ai,l0G;ha,nggu0rtmu11;hradRl5troit;hi;donghHe5k08li0masc1Xr es sala1HugavpiY;gu,je2;aKebu,hAo5raio03uriti1P;lo7n6penhag0Ar5;do1Nk;akLst0V;gVm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;n5ttogr12;digarh,g5;ch8sha,zh06;i9lga8mayenJn6pe town,r5;acCdiff;ber18c5;un;ry;ro;aUeMhJirmingh0ToIr9u5;chareRdapeRenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil0Mtisla7zzav5;il5;le;va;goZst2;op6ubaneshw5;ar;al;iBl9ng8r5;g6l5n;in;en;aluru,hazi;fa5grade,o horizonte;st;ji1rut;ghd0BkGnAot9r7s6yan n4;ur;el,r07;celo3ranquil09;na;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a04b01cc00ddis abaZgartaYhmedWizawl,lQmNnHqaZrEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a6chora5kaNtwerp;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 8buquerq7e5giers,maty;ppo,xandr5;ia;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg", Country: "true¦0:39;1:2M;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om3DpZqat1KrXsKtCu6v4wal3yemTz2;a25imbabwe;es,lis and futu2Y;a2enezue32ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2Y;k.,s.2; 28a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Ys and caic1U; and 2-2;toba1K;go,kel0Znga;iw2Wji2nz2S;ki2U;aCcotl1eBi8lov7o5pa2Cri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Rriname;lomon1Wmal0uth 2;afr2JkLsud2P;ak0en0;erra leoEn2;gapo1Xt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele25luc0mart20;epublic of ir0Dom2Duss0w2;an26;a3eHhilippinTitcairn1Lo2uerto riM;l1rtugE;ki2Cl3nama,pua new0Ura2;gu6;au,esti2;ne;aAe8i6or2;folk1Hth3w2;ay; k2ern mariana1C;or0N;caragua,ger2ue;!ia;p2ther19w zeal1;al;mib0u2;ru;a6exi5icro0Ao2yanm05;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagasc00l6r4urit3yot2;te;an0i15;shall0Wtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed01;a5e4i2uxembourg;b2echtenste11thu1F;er0ya;ban0Hsotho;os,tv0;azakh1Ee3iriba03o2uwait,yrgyz1E;rWsovo;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an", Region: "true¦0:2M;1:2S;2:2J;a2Pb2Cc1Yd1Tes1Sf1Qg1Kh1Gi1Bj17k12l0Zm0On07o05pZqWrTsKtFuCv9w5y3zacatec2T;akut0o0Du3;cat2k07;a4est 3isconsin,yomi1L;bengal,vi6;rwick2Ashington3;! dc;er4i3;rgin0;acruz,mont;dmurt0t3;ah,tar3; 2Ka0W;a5e4laxca1Qripu1Wu3;scaDva;langa1nnessee,x2E;bas0Um3smNtar24;aulip2Cil nadu;a8i6o4taf10u3ylh1E;ffYrr03s19;me1Bno1Puth 3;cVdU;ber0c3kkim,naloa;hu2ily;n4skatchew2xo3;ny; luis potosi,ta catari1;a3hode9;j3ngp06;asth2shahi;ingh24u3;e3intana roo;bec,en5reta0Q;ara7e5rince edward3unjab; i3;sl0A;i,nnsylv3rnambu0A;an0;!na;axa0Xdisha,h3klaho1Zntar3reg6ss0Ax0F;io;aIeDo5u3;evo le3nav0V;on;r3tt16va scot0;f8mandy,th3; 3ampton15;c5d4yo3;rk13;ako1M;aroli1;olk;bras1Lva0Bw3; 4foundland3;! and labrador;brunswick,hamp0Wjers3mexiRyork state;ey;galOyarit;a9eghala0Mi5o3;nta1r3;dov0elos;ch5dlanCn4ss3zor11;issippi,ouri;as geraOneso18;ig2oac2;dhy12harasht0Gine,ni4r3ssachusetts;anhao,i el,ylF;p3toba;ur;anca0Ie3incoln0IouisH;e3iR;ds;a5e4h3omi;aka06ul1;ntucky,ra01;bardino,lmyk0ns0Qr3;achay,el0nata0X;alis5har3iangxi;kh3;and;co;daho,llino6n3owa;d4gush3;et0;ia1;is;a5ert4i3un2;dalFm0D;fordZ;mpYrya1waii;ansu,eorg0lou7oa,u3;an4erre3izhou,jarat;ro;ajuato,gdo3;ng;cesterS;lori3uji2;da;sex;ageTe6o4uran3;go;rs3;et;lawaLrbyK;aEeaDh8o3rimea ,umbr0;ahui6l5nnectic4rsi3ventry;ca;ut;i02orado;la;e4hattisgarh,i3uvash0;apQhuahua;chn4rke3;ss0;ya;ra;lFm3;bridge6peche;a8ihar,r7u3;ck3ryat0;ingham3;shi3;re;emen,itish columb0;h0ja cal7lk6s3v6;hkorto3que;st2;an;ar0;iforn0;ia;dygea,guascalientes,lAndhr8r4ss3;am;izo1kans4un3;achal 6;as;na;a 3;pradesh;a5ber4t3;ai;ta;ba4s3;ka;ma", Place: "true¦a0Eb0Bc04d03e02f00gVhUiRjfk,kOlMmJneGoFpBque,rd,s9t6u5v4w1y0;akutOyz;ake isFis1y0;!o;!c;a,ostok,t;laanbaatar,p02safa,t;ahiti,e1he 0;bronx,hamptons;nn,x;a0fo,oho,t,under7yd;khalNsk;a2e1h0itcairn;l,x;k,nnN;!cif04;kla,nt,rd;b1w eng0;land;!r;a1co,i0t,uc;dNnn;gadZlibu,nhattZ;a0gw,hr;s,x;an1osrae,rasnoyar0ul;sk;!s;a1cn,da,nd0st;ianRochina;!x;arlem,kg,nd,oHwy;a3re0;at 0enwich;brita0lakH;in;!y village;co,l0ra;!a;urope,vergladC;ak,en,fw,ist,own4xb;al5dg,gk,h2l1o0rA;lo,nn;!t;a1ina0uuk;town;morro,tham;!if;cn,e1kk,l0rooklyn;vd;l air,verly hills;frica,lta,m7n3r2sia,tl1ve,zor0;es;!ant2;ct1iz;adyr,tarct0;ic0; oce0;an;ericas,s", MaleName: "true¦0:E4;1:D5;2:DN;3:AX;4:D1;5:CF;6:B5;7:CV;8:C7;9:DJ;A:DK;B:A5;C:C1;aCNbBKcAId9Ge8Mf84g7Hh6Ti6Dj5Dk51l4Cm34n2So2Mp2Equ2Cr1Ls11t0Eu0Dv07wTxSyIzD;aDor0;cDh9Skaria,n5V;hEkD;!aCL;ar5VeCK;aLoFuD;sDu2JvBX;if,uf;nFsEusD;ouf,sD;ef;aDg;s,tD;an,h0;hli,nBLssX;avi3ho4;aMeKiFoDyaC1;jcie8Blfgang,odrow,utD;!er;lDnst1;bFey,frD0lD;aBCiD;am,e,s;e9Eur;i,nde6sD;!l8t1;de,lErrAyD;l1ne;lDt3;aA9y;aGiDladimir,ojte7Y;cEha0kt68nceDrgAIva0;!nt;e3Ut66;lentDnA4;in4X;ghBUlyss5Bnax,sm0;aXeShOiMoHrFuEyD;!l3ro7s1;n9r5B;avAVeDist0oy,um0;ntANv5Yy;bGdFmDny;!as,mDoharu;aCSie,y;!d;iBy;mDt5;!my,othy;adFeoEia8FomD;!as;!do8O;!de5;dGrD;en9KrD;an9JeDy;ll,n9I;!dy;dgh,ha,iDnn3req,tsu4S;cB4ka;aTcotRePhLiJoHpenc3tDur1Uylve9Jzym1;anFeDua8C;f0phBSvDwa8B;e61ie;!islaw,l8;lom1nBEuD;leyma7ta;dDlBm1yabonga;!dhart7An8;aFeD;lDrm0;d1t1;h7Tne,qu0Zun,wn,y7;aDbasti0k29l4Qrg4Nth,ymoAT;m5n;!tD;!ie,y;lEmDnti2Dq5Aul;!ke5LmCu4;ik,vato7W;aXeTheA9iPoHuEyD;an,ou;b7MdEf5pe7RssD;!elBY;ol3Ey;an,bJc66dIel,geHh0landBPmGnFry,sEyD;!ce;coe,s;!aAGnC;an,eo;l46r;e5Ng3n8olfo,ri79;bCeB7;cDl8;ar6Pc6OhEkDo;!ey,ie,y;a99ie;gEid,ubAx,yDza;an1InY;gA8iD;naA4s;ch70fa4lHmGndFpha4sEul,wi2HyD;an,mo82;h7Vm5;alBDol2Uy;iATon;f,ph;ent2inD;cy,t1;aIeGhilFier72ol,rD;aka16eD;m,st1;!ip,lip;dALrcy,tD;ar,e3Gr1X;b4Kdra7Ft4ZulD;!o17;ctav3Fi3liv3mAFndrej,rHsEtDum9wA;is,to;aEc9k9m0vD;al5Z;ma;i,l53vL;aLeJiFoDu3A;aDel,j5l0ma0r3K;h,m;cEg4i49kD;!au,h7Uola;holBkDolB;!olB;al,d,il,ls1vD;il8Y;hom,thD;anDy;!a4i4;aZeWiMoHuEyD;l2Jr1;hamEr6XstaD;fa,p5C;ed,mH;di0We,hamFis2FntEsDussa;es,he;e,y;ad,ed,mD;ad,ed;cIgu4hai,kGlFnEtchD;!e6;a8Aik;house,o0Bt1;ae5YeA4olD;aj;ah,hDk8;aEeD;al,l;el,l;hElv2rD;le,ri6v2;di,met;ay0ck,hTjd,ks2DlRmadWnQrKs1tFuricExD;!imilian9Nwe6;e,io;eGhEiBtDus,yB;!eo,hew,ia;eDis;us,w;j,o;cHio,kGlFqu7Dsha6tDv2;iDy;!m,n;in,on;!el,oPus;!el9IoOus;iGu4;achDcolm,ik;ai,y;amEdi,eDmoud;sh;adDm5T;ou;aXeQiOlo3EoKuEyD;le,nd1;cGiFkDth3uk;aDe;!s;gi,s,z;as,iaD;no;g0nn7SrenFuDv8Jwe6;!iD;e,s;!zo;am,oD;n4r;a8Cevi,la5JnIoGst3thaFvD;eDi;nte;bo;!nD;!a6Sel;!ny;mFnErDur5Hwr5H;ry,s;ce,d1;ar,o5A;aLeGhaled,iDrist5Iu4Vy6X;er0p,rD;by,k,ollD;os;en0iGnDrmit,v44;!dEnDt5Z;e1Ay;a6ri59;r,th;cp3j5m66na73rEsp9them,uD;ri;im,l;a02eUiSoGuD;an,lDst2;en,iD;an,en,o,us;aNeLhnKkubBnIrGsD;eEhDi8Bue;!ua;!ph;dDge;an,i,on;!aDny;h,s,th5I;!ath5Hie,nC;!l,sDy;ph;o,qu2;an,mD;!mC;d,ffIrFsD;sDus;!e;a6BemEmai7oDry;me,ni0Y;i7Ty;!e60rD;ey,y;cKdAkImHrFsEvi3yD;!dAs1;on,p3;ed,od,rDv56;e5Nod;al,es4Xis1;a,e,oDub;b,v;k,ob,quD;es;aWbQchiPgNkeMlija,nuLonut,rJsFtDv0;ai,suD;ki;aEha0i7DmaDsac;el,il;ac,iaD;h,s;a,vinDw2;!g;k,nngu5S;!r;nacDor;io;ka;ai,rahD;im;aPeJoIuDyd9;be2KgGmber4WsD;eyEsD;a2e2;in,n;h,o;m3ra3Gsse2wa4B;aHctGitGnrErD;be2Dm0;iDy;!q11;or;th;bMlLmza,nKo,rFsEyD;a4JdA;an,s0;lGo50rFuDv8;hi4Gki,tD;a,o;is1y;an,ey;k,s;!im;ib;aVeRiPlenOoLrHuD;ilEsD;!tavo;herme,lerD;mo;aFegDov3;!g,orD;io,y;dy,h5Wnt;nzaErD;an,d1;lo;!n;lbe5Ano,oD;rg3Hvan5A;ne,oFrD;aDry;ld,rd5H;ffr8rge;brElArDv2;la28r3Sth,y;e3EielD;!i5;aTePiNlLorr0NrD;anFedDitz;!dCeDri2B;ri2A;cFkD;!ie,lD;in,yn;esLisD;!co,z36;etch3oD;yd;d4lDnn,onn;ip;deriFliEng,rnD;an06;pe,x;co;bi0di,hd;ar04dZfrYit0lSmKnHo2rFsteb0th0uge7vDymAzra;an,eD;ns,re36;gi,i0DnDrol,v2w2;est4Pie;oEriqDzo;ue;ch;aJerIiEmD;aIe2Z;lErD;!h0;!iD;o,s;s1y;nu4;be0Cd1iGliFmEt1viDwood;n,s;er,o;ot1Ys;!as,j4NsD;ha;a2en;!dCg9mGoEuEwD;a2Din;arD;do;o0Wu0W;l,nD;est;a01eRiOoHrGuFwEylD;an,l0;ay7ight;a7dl8nc0st2;ag0ew;minGnEri0ugDvydBy2D;!lB;!a2MnDov0;e6ie,y;go,iDykB;cDk;!k;armuEeDll1on,rk;go;id;anKj0lbeJmetri5nHon,rGsFvEwDxt3;ay7ey;en,in;hawn,mo0B;ek,ri0I;is,nDv3;is,y;rt;!dD;re;an,lNmLnKrGvD;e,iD;! lucDd;as,ca;en,iFne6rDyl;eDin,yl;l3Bn;n,o,us;!e,i4ny;iDon;an,en,on;e,lB;as;a09e07hYiar0lNoIrGuEyrD;il,us;rtD;!is;aDistob0U;ig;dy,lGnErD;ey,neli5y;or,rD;ad;by,e,in,l2t1;aIeFiDyK;fDnt;fo0Ft1;meEt5velaD;nd;nt;rFuEyD;!t1;de;enD;ce;aIeGrisEuD;ck;!tD;i0oph3;st3;er;d,rDs;b4leD;s,y;cDdric,s9;il;lGmer1rD;ey,lEro6y;ll;!os,t1;eb,v2;a07eZiVlaUoRrEuDyr1;ddy,rtK;aLeGiFuEyD;an,ce,on;ce,no;an,ce;nEtD;!t;dEtD;!on;an,on;dEndD;en,on;!foDl8y;rd;bErDyd;is;!by;i7ke;bFlEshD;al;al,lC;ek;nHrDshoi;at,nEtD;!r1C;aDie;rd14;!edict,iEjam2nC;ie,y;to;kaMlazs,nHrD;n8rDt;eDy;tt;ey;dDeE;ar,iD;le;ar17b0Vd0Rf0Pgust2hm0Mi0Jja0Il04m00nSputsiRrIsaHuFveEyDziz;a0kh0;ry;gust5st2;us;hi;aKchJiIjun,maHnFon,tDy0;hDu09;ur;av,oD;ld;an,nd0H;!el,ki;ie;ta;aq;as,dIgel0CtD;hoGoD;i7nD;!i09y;ne;ny;er,reDy;!as,i,s,w;iFmaDos;nu4r;el;ne,r,t;an,bePdAeJfHi,lGonFphXt1vD;aNin;on;so,zo;an,en;onTrD;edU;c,jaGksandFssaGxD;!andD;er,ru;ar,er;ndD;ro;rtN;ni;dAm9;ar;en;ad,eD;d,t;in;onD;so;aEi,olfDri0vik;!o;mDn;!a;dHeGraEuD;!bakr,lfazl;hDm;am;!l;allIelFoulaye,ulD;!lDrF;ah,o;! rD;ahm0;an;ah;av,on", LastName: "true¦0:9F;1:9V;2:9H;3:9X;4:9N;5:8J;6:9K;7:A0;8:9E;9:88;A:6E;B:77;C:6J;a9Ub8Lc7Kd6Xe6Rf6Dg5Vh58i54j4Pk45l3Nm2Rn2Eo26p1Nquispe,r17s0Ft05vVwOxNyGzD;aytsADhD;aDou,u;ng,o;aGeun7ZiDoshiA9un;!lD;diDmaz;rim,z;maDng;da,guc97mo6UsDzaB;aBhiA7;iao,u;aHeGiEoDright,u;jc8Sng;lDmm0nkl0sniewsB;liA1s3;b0iss,lt0;a5Rgn0lDng,tanabe;k0sh;aHeGiEoDukA;lk5roby5;dAllalDnogr2Zr0Zss0val37;ba,obos;lasEsel7N;lGn dFrg8EsEzD;qu7;ily9Oqu7silj9O;en b35ijk,yk;enzue95verde;aLeix1JhHi4j6ka3IoGrFsui,uD;om4ZrD;c4n0un1;an,embl8TynisB;dor95lst31m2rr9th;at5Mi7LoD;mErD;are6Ylaci64;ps3s0Y;hirAkah8Dnaka;a00chWeThPiNmKoItFuEvDzabo;en8Aobod34;ar7bot2lliv4zuB;aEein0oD;i67j3Lyan8V;l6rm0;kol5lovy5re6Psa,to,uD;ng,sa;iDy5Z;rn5tD;!h;l5YmDngh,rbu;mo6Do6J;aFeDimizu;hu,vchD;en7Cuk;la,r17;gu8mDoh,pulve8Trra4R;jDyD;on5;evi6Filtz,miDneid0roed0ulz,warz;dEtD;!z;!t;ar42h6ito,lFnDr2saBto,v2;ch7d0AtDz;a4Pe,os;as,ihAm3Zo0Q;aOeNiKoGuEyD;a66oo,u;bio,iz,sD;so,u;bEc7Bdrigue57g03j73mDosevelt,ssi,ta7Nux,w3Z;a4Be0O;ertsDins3;!on;bei0LcEes,vDzzo;as,e8;ci,hards3;ag4es,it0ut0y9;dFmEnDsmu7Zv5F;tan1;ir7os;ic,u;aSeLhJiGoErDut6;asad,if5Zochazk1W;lishc24pDrti62u55we66;e2Tov48;cEe09nD;as,to;as60hl0;aDillips;k,m,n5K;de3AetIna,rGtD;ersErovDtersC;!a,ic;en,on;eDic,ry,ss3;i8ra,tz,z;ers;h71k,rk0tEvD;ic,l3T;el,t2O;bJconnor,g2ClGnei5PrEzD;demir,turk;ella3MtDwe5N;ega,iz;iDof6GsC;vDyn1F;ei8;aPri1;aLeJguy1iFoDune44ym4;rodahl,vDwak;ak3Uik5otn56;eEkolDlsCx3;ic,ov6X;ls1miD;!n1;ils3mD;co42ec;gy,kaEray4varD;ro;jiDmu8shiD;ma;aXcVeQiPoIuD;lGnFrDssoli5T;atDpUr68;i,ov2;oz,te4B;d0l0;h4lIo0HrEsDza0Z;er,s;aFeEiDoz5r3Ete4B;!n6F;au,i8no,t4M;!l9;i2Rl0;crac5Ohhail5kke3Qll0;hmeGij0j2ElFndErci0ssiDyer19;!er;e3Bo2Z;n0Io;dAti;cartDlaughl6;hy;dMe6Dgnu5Ei0jer34kLmJnci59rFtEyD;er,r;ei,ic,su1N;iEkAqu9roqu6tinD;ez,s;a54c,nD;!o;a52mD;ad5;e5Oin1;rig4Ns1;aSeMiIoGuEyD;!nch;k2nDo;d,gu;mbarDpe2Rvr2;di;!nDu,yana1R;coln,dD;bDholm;erg;bed5TfeGhtFitn0kaEn6rDw2G;oy;!j;in1on1;bvDvD;re;iDmmy,rsCu,voie;ne,t11;aTennedy,h4iSlQnez46oJrGuEvar4woD;k,n;cerDmar58znets5;a,o2G;aDem0i2Zyeziu;sni3PvD;ch3U;bay4Frh0Jsk0TvaFwalDzl5;czDsB;yk;cFlD;!cDen3Q;huk;!ev2ic,s;e6uiveD;rt;eff0l2mu8nnun1;hn,lloe,minsBrEstra31to,ur,yDzl5;a,s0;j0GlsC;aMenLha2Pim0QoEuD;ng,r2;e2JhFnErge2Ju2NvD;anA;es,ss3;anEnsD;en,on,t3;nesDsC;en,s1;ki26s1;cGkob3RnsDrv06;en,sD;enDon;!s;ks3obs1;brahimAglesi3Ake4Ll0CnoZoneFshikEto,vanoD;u,v4A;awa;scu;aPeIitchcock,jaltal6oFrist46uD;!aDb0gh9ynh;m4ng;a23dz2fEjga2Sk,rDx3B;ak0Yvat;er,fm3B;iGmingw3NnErD;nand7re8;dDriks1;ers3;kkiEnD;on1;la,n1;dz2g1lvoLmJnsCqIrr0SsFuEyD;as36es;g1ng;anEhiD;mo0Q;i,ov08;ue;alaD;in1;rs1;aMeorgLheorghe,iJjonIoGrEuDw3;o,staf2Utierr7zm4;ayDg2iffitUub0;li1G;lub3Rme0JnD;calv9zale0I;aj,i;l,mDordaL;en7;iev3B;gnJlGmaFnd2No,rDs2Nuthi0;cDza;ia;ge;eaElD;agh0i,o;no;e,on;ab0erMiIjeldsted,lor9oGrFuD;cDent9ji3F;hs;an1Wiedm4;ntaDrt6st0urni0;na;lipEsD;ch0;ovD;!ic;hatAnandeVrD;arDei8;a,i;ov2;dHinste6riksCsDva0D;cob2ZpDtra2X;inoDosiM;za;en,s3;er,is3wards;aUeMiKjurhuJoHrisco0YuEvorakD;!oQ;arte,boEmitru,rDt2U;and,ic;is;g4he0Hmingu7n2Ord19tD;to;us;aDmitr29ssanayake;s,z; GbnaFlEmirDrvis1Lvi,w4;!ov2;gado,ic;th;bo0groot,jo03lEsilDvri9;va;a cruz,e3uD;ca;hl,mcevsBnErw6t2EviD;d5es,s;ieDku1S;ls1;ki;a05e00hNiobMlarkLoFrD;ivDuz;elli;h1lGntFop0rDs26x;byn,reD;a,ia;i,rer0O;em4liD;ns;!e;anu;aLeIiu,oGriDuJwe;stD;eDiaD;ns1;i,ng,uFwDy;!dhury;!n,onEuD;ng;!g;kEnDtterjee,v7;!d,g;ma,raboD;rty;bGl09ng2rD;eghetEnD;a,y;ti;an,ota0M;cer9lder3mpbeIrFstDvadi08;iDro;llo;doEt0uDvalho;so;so,zo;ll;es;a09eXhUiSlNoGrFyD;rne,tyD;qi;ank5iem,ooks,yant;gdan5nFruya,su,uchEyHziD;c,n5;ard;darDik;enD;ko;ov;aEondD;al;nEzD;ev2;co;ancRshwD;as;a01oDuiy4;umDwmD;ik;ckNethov1gu,ktLnJrD;gGisFnD;ascoDds1;ni;ha;er,mD;ann;gtDit7nett;ss3;asD;hi;er,ham;b2ch,ez,hMiley,kk0nHrDu0;bEnDua;es,i0;ieDosa;ri;dDik;a8yopadhyD;ay;ra;er;k,ng;ic;cosZdYguilXkhtXlSnJrGsl4yD;aEd6;in;la;aEsl4;an;ujo,ya;dFgelD;ovD;!a;ersGov,reD;aDjL;ss1;en;en,on,s3;on;eksejGiyGmeiFvD;ar7es;ez;da;ev;ar;ams;ta", WeekDay: "true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s", Month: "true¦aBdec9feb7j2mar,nov9oct1sep0;!t8;!o8;an3u0;l1n0;!e;!y;!u1;!ru0;ary;!em0;ber;pr1ug0;!ust;!il", Date: "true¦ago,t2week0yesterd4; e0e0;nd;mr2o0;d0morrow;ay;!w", FirstName: "true¦aLblair,cHdevGgabrieFhinaEjCk9l8m4nelly,quinn,re3s0;h0umit;ay,e0iloh;a,lby;g6ne;a1el0ina,org5;!okuh9;naia,r0;ion,lo;ashawn,uca;asCe1ir0rE;an;lsAnyat2rry;am0ess6ie,ude;ie,m5;ta;le;an,on;as2h0;arl0eyenne;ie;ey,sidy;lex2ndr1ubr0;ey;a,ea;is", Person: "true¦ashton kutchTbScNdLeJgastOhHinez,jFkEleDmCnettKoBp9r4s3t2v0;a0irgin maH;lentino rossi,n go3;aylor,heresa may,iger woods,yra banks;addam hussain,carlett johanssKlobodan milosevic,uC;ay romano,e3o1ush limbau0;gh;d stewart,nald0;inho,o;ese witherspoFilly;a0ipJ;lmIris hiltD;prah winfrFra;essiaen,itt romnEubarek;bron james,e;anye west,iefer sutherland,obe bryant;aime,effers8k rowli0;ng;alle ber0itlBulk hogan;ry;ff0meril lagasse,zekiel;ie;a0enzel washingt2ick wolf;lt1nte;ar1lint0;on;dinal wols1son0;! palm2;ey;arack obama,rock;er", Verb: "true¦awak9born,cannot,fr8g7h5k3le2m1s0wors9;e8h3;ake sure,sg;ngth6ss6;eep tabs,n0;own;as0e2;!t2;iv1onna;ight0;en", PhrasalVerb: "true¦0:7L;1:79;2:7X;3:7N;4:72;5:80;6:7P;7:6V;8:78;9:7J;A:6W;B:5Z;C:7S;D:7K;a81b6Lc5Rd5Me5Lf4Kg41h3Kiron0j3Gk3Bl2Vm2Jn2Ho2Fp1Wquiet7Ar1Js0CtSuQvacuum 1wHyammer9zE;eroBip FonE;e0k0;by,up;aLeHhGiForErit5G;d 1k33;mp0n2Vpe0r7s7;eel Dip 85;aFiEn2J;gh 09rd0;n Dr E;d2in,o5J;it 61k7lk6rm 6Csh 7Nt6Qv51;rge9sE;e AherB;aTeRhPiLoJrGuEype 69;ckBrn E;d2in,o3Sup;aFiEot0y 2I;ckle6Rp 7T;ck6Qde Y;ne6Pp Es4O;d2o73up;ck GdFe Egh6Bme0p o0Gre0;aw3ba4d2in,up;e 61y 1;by,o7D;ink Erow 6D;ba4ov8up;aEe 5Zll53;m 1r X;ck9ke Flk E;ov8u54;aEba4d2in,o3Cup;ba4ft8p59w3;a0Jc0Ie0Ch08i05l01m00nZoYpTquare StKuIwE;earGiE;ngFtch E;aw3ba4o77; by;ck Eit 1m 1ss0;in,up;aJe0WiIoGrEuc3G;aigh1WiE;ke 6Gn3A;p Erm1Z;by,in,o6T;n3Br 1tc3T;c3Amp0nd Er6Zve6y 1;ba4d2up;d2o6Pup;ar37eHiGlFrEur9;ing9uc7;a3Fit 5B;l13n 1;e5Sll0;be2Wrt0;ap 4Sow D;ash 5Foke0;eep FiEow A;c3Wp 1;in,oE;ff,v8;gn 4XngFt Ez7;d2o5up; al54le0;aGoEu4T;ot Eut0w 6D;aw3ba4f3Go67;c2PdeBk58ve6;e Ill1And HtE; Etl4H;d2in,o5upE;!on;aw3ba4d2in,o27up;o5Mto;al51out0rap51;il6v7;aPeMiLoHuE;b 4Ule0n Estl7;aEba4d2in5Jo3Ut39u3S;c26w3;ll Got FuE;g2Tnd6;a27f30o5;arCin,o5;ng 53p6;aEel6inBnt0;c5Dd E;o31u0I;c24t0;aSeRiPlNoLrIsyc2HuE;ll Gt E;aEba4d2in,o1Ot3Gup;p3Lw3;ap3Kd2in,o5t3Eup;attle9ess FiHoE;p 1;ah1Oon;iEp 5Hr3Yur4Jwer 5H;nt0;ay4DuE;gBmp A;ck Eg0le9n Ap4A;o2Yup;el 4KncilB;c42ir 3Un0ss GtFy E;ba4o54; d2c24;aw3ba4o18;pEw3X;e3Wt D;arrow46erd0oE;d6te45;aMeJiIoGuE;ddl7lE;l 3I;c1Dp 1uth6ve E;al3Nd2in,o5up;ss0x 1;asur7lFss E;a1Gup;t A;ke Fn ArEs1Px0;k Ary6;do,o48up;aRePiKoEuck0;aIc3Hg HoEse0;k Ese3F;aft8ba4d2forw2Jin46ov8uE;nd8p;in,o0M;d A;e HghtGnFsEv1V;ten 4M;e 1k 1; 1e37;arCd2;av1Jt 37velE; o3U;c7p 1sh Etch9ugh6y20;in3Uo5;eFick6nock E;d2o3Q;eEyB;l 2Pp E;aw3ba4d2fTin,o07to,up;aGoFuE;ic7mpB;ke31t35;c3Azz 1;aQeLiIoFuE;nker32rry 1s0W;lEneBrse2X;d Ee 1;ba4d2fast,o01up;de Ft E;ba4on,up;aw3o5;aElp0;d Gl 2Ar Et 1;fEof;rom;in,oTu1H;c02m 1nFve Ez25;it,to;d Eg 2FkerG;d2in,o5;aTeMive Kloss 22oGrFunE; f0N;in3How 2B; Eof 21;aFb1Dit,oErCt0Pu18;ff,n,v8;bo5ft8hKw3;aw3ba4d2in,oEup,w3;ff,n,ut;aJek0t E;aFb17d2oErCup;ff,n,ut,v8;cFhEl1XrCt,w3;ead;ross;r 1;d aFnE;g 1;bo5;a08e01iSlOoKrGuE;cEel 1;k 1;eFighten Eown9y 1;aw3o2S;eEshe1N; 1z7;lGol E;aEwi1G;bo5rC;d Alow 1;aFeEip0;sh0;g Ake0mErE;e 2R;gLlJnHrFsEzzle0;h 2P;e Em 1;aw3ba4up;d0isE;h 1;e El 19;aw3fJ;ht ba4ure0;eJnFsE;s 1;cGd E;fEo25;or;e D;dVl 1;cIll Erm0t0W;ap04bGd2in,oFtE;hrough;ff,ut,v8;a4ehi20;e 0L;at0dge0nd 0Ky7;oHrE;aFess Aop E;aw3bUin,o1E;g9w9; 0Dubl7;aXhUlean AoHrEut 10;ack9eep Eoss D;by,d2oEup;n,ut;me HoFuntE; o1Q;k 1l E;d2o1I;aKbJforHin,oGtFuE;nd8;ogeth8;ut,v8;th,wE;ard;a4y;pErCw3;art;eEipB;ck Der E;on,up;lKncel0rHsGtch FveB; in;o19up;h Dt6;ry FvE;e Y;aw3o15;l Em05;aEba4d2o13up;rCw3;a0Ke0Bl04oVrJuE;bblGcklWil02lk AndlWrn 08st FtEy 13zz6;t D;in,o5up;e E;ov8;anOeaMiFush E;o0Oup;ghIng E;aFba4d2forEin,o5up;th;bo5lErCw3;ong;teE;n 1;k E;d2in,o5up;ch0;arLgKil An7oHssGttlFunce Ex D;aw3ba4;e A; arC;k Dt 1;e 1;d2up; d2;d 1;aJeed0oEurt0;cGw E;aw3ba4d2o5up;ck;k E;in,oL;ck0nk0st6; oKaHef 1nd E;d2ov8up;er;up;r0t E;d2in,oEup;ff,ut;ff,nE;to;ck Kil0nGrgFsE;h D;ain9e D;g Dk9; on;in,o5; o5;aw3d2o5up;ay;cNdJsk Guction6; oE;ff;arCo5;ouE;nd;d E;d2oEup;ff,n;own;t E;o5up;ut", Modal: "true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ay,ight,ust;an,o0;uld", Adjective: "true¦0:7P;1:84;2:83;3:8A;4:7W;5:5S;6:4N;7:4O;8:58;9:6I;A:81;a6Wb6Gc63d5Je54f4Hg49h3Wi39j37k36l2Vm2Ln2Bo1Wp1Dquack,r12s0Ft07uMvJwByear5;arp0eFholeEiDoB;man5oBu6P;d6Rzy;despr7Ls5S;!sa7;eClBste2A;co1Nl o4W;!k5;aCiBola4M;b89ce versa,ol5H;ca3gabo6Gnilla;ltUnHpCrb5Msu4tterB;!mo7G; Eb1SpDsBti1M;ca7etBide dKtairs;!ti2;er,i3U;f36to da1;aLbeco75convin29deIeHfair,ivers4knGprecedVrEsCwB;iel3Nritt6A;i1XuB;pervis0spec3Y;eBu5;cognHgul6Tl6T;own;ndi2v64xpect0;cid0rB;!grou5ZsB;iz0tood;b7pp0Dssu6UuthorB;iz0;i26ra;aGeEhDi6AoCrB;i1oubl0us3M;geth8p,rp6Vuc67;ough4Wril33;en60l32mpBrr2X;o6Ati2;boo,lBn;ent0;aWcVeThSiQmug,nobbi3LoOpNqueami3LtFuBymb6H;bDi gener5DpBrpri6D;erBre0N;! dup8b,i2C;du0seq52;anda77eGiFrBunni2y3F;aightCiB;ki2p0; fBfB;or5K;ll,r5S;aBreotyp0;dfa6Cmi2;a55ec2Gir1Hlend6Cot on; call0le,mb8phist1XrBu0Vvi48;d6Ary;gnifica3nB;ce51g7;am2Re8ocki2ut;cBda1em5lfi32ni1Wpa6Jre6;o1Er42;at5Gient28reec5G;cr0me;aJeEiCoB;bu60tt51uQy4;ghtBv4;!-2Bf9;ar,bel,condi1du6Dfres5AlEpublic42sCtard0vB;ea26;is4CoB;lu1na3;aQe1Cuc4A;b5TciBllyi2;al,st;aOeLicayu6lac5Ropuli5QrCuB;bl5Jmp0n51;eGiDoB;!b07fu5RmiBp8;ne3si2;mCor,sBva1;ti6;a53e;ci5MmB;a0EiB;er,um;ac20rBti1;feAma2XpleBv38;xi2;rBst;allelDtB;-tiBi4;me;!ed;bLffJkIld fashion0nHpGrg1Eth8utFvB;al,erB;!all,niCt,wB;eiBrouB;ght;do0Ter,g2Qsi4B;en,posi1; boa5Og2Oli6;!ay; gua5MbBli6;eat;eDsB;cBer0Eole1;e6u3O;d2Xse;aJeIiHoBua4X;nFrCtB;ab7;thB;!eB;rn;chala3descri58stop;ght5;arby,cessa44ighbor5xt;k0usia1A;aIeGiDoBultip7;bi7derBl0Vnth5ot,st;a1n;nBx0;dblo0RiaBor;tu37;ande3Qdi4NnaBre;ci2;cBgenta,in,j01keshift,le,mmoth,ny,sculi6;ab33ho;aKeFiCoBu15;uti14vi2;mCteraB;l,te;it0;ftEgBth4;al,eCitiB;ma1;nda3K;!-0C;ngu3Zst,tt8;ap1Xind5no0A;agg0uB;niMstifi0veni7;de4gno4Klleg4mQnEpso 20rB;a1rB;eleBita0J;va3; KaJbr0corIdGfluenQiQnFsEtCviB;go0Fti2;aAen3SoxB;ic3B;a6i2Vul0D;a1er,oce3;iCoB;or;reA;deq3Qppr33;fBsitu,vitro;ro3;mFpB;arDerfeAoBrop8;li1rtB;a3ed;ti4;eBi0S;d2Vn3C;aIeFiDoBumdr3I;ne36ok0rrBs08ur5;if2Z;ghfalut1QspB;an2X;aClB;liYpf9;li2;lEnDrB;d04roB;wi2;dy;f,low0;ainf9ener2Oiga24lHoGraDuB;ilBng ho;ty;cCtB;ef9is;ef9;ne,od;ea2Iob4;aTeNinMlKoFrB;a1VeDoz1MustB;raB;ti2;e2Gq10tf9;oDrB; keeps,eBm8tuna1;g03ign;liB;sh;aBue3;g31tte1P;al,i1;dFmCrB;ti7;a7ini6;ne;le; up;bl0i3l27r Cux,voB;ri1uri1;oBreac1E;ff;aLfficie3lKmHnFreAthere4veExB;aAcess,pe1QtraCuB;be2Nl0E;!va1E;n,ryday; BcouraEti0O;rou1sui1;erCiB;ne3;gi2;abo23dMe17i1;g8sB;t,ygB;oi2;er;aReJiDoBrea14ue;mina3ne,ubB;le,tf9;dact1Bfficu1OsCvB;er1K;creDeas0gruntl0hone1FordCtB;a3ressM;er5;et; HadpGfFgene1PliDrang0spe1PtCvoB;ut;ail0ermin0;be1Mca1ghB;tf9;ia3;an;facto;i5magBngeroUs0G;ed,i2;ly;ertaMhief,ivil,oDrB;aBowd0u0G;mp0vZz0;loImGnCrrBve0P;eAu1I;cre1fu0LgrDsCtB;empo0Dra0E;ta3;ue3;mer08pleB;te,x;ni4ss4;in;aNeIizarHlFoCrB;and new,isk,okN;gCna fiUttom,urgeoB;is;us;ank,indB;!i2;re;autif9hiDloCnBst,yoD;eUt;v0w;nd;ul;ckCnkru0WrrB;en;!wards; priori,b0Mc0Jd09fra08g04h03lYmWntiquVppSrMsIttracti06utheHvEwB;aCkB;wa0T;ke,re;ant garCerB;age;de;ntU;leep,piDsuDtonB;isB;hi2;ri2;ab,bitEroDtiB;fiB;ci4;ga3;raB;ry;are3etiNrB;oprB;ia1;at0;aJuB;si2;arEcohCeBiIl,oof;rt;olB;ic;mi2;ead;ainDgressiConiB;zi2;ve;st;id; IeGuFvB;aCerB;se;nc0;ed;lt;pt,qB;ua1;hoc,infinitB;um;cuCtu4u1;al;ra1;erLlKoIruHsCuB;nda3;e3oCtraA;ct;lu1rbi2;ng;te;pt;aBve;rd;aze,e;ra3;nt", Comparable: "true¦0:41;1:4I;2:45;3:2Y;4:4B;5:3X;a4Ob44c3Od3De35f2Rg2Fh24i1Vj1Uk1Rl1Jm1Dn17o15p0Vqu0Tr0KsTtMuIvFw7y6za13;ell27ou4;aBe9hi1Yi7r6;o4y;ck0Ode,l6n1ry,se;d,y;a6i4Mt;k,ry;n1Tr6sK;m,y;a7e6ulgar;nge5rda2xi4;g9in,st;g0n6pco3Mse5;like0t6;i1r6;ue;aAen9hi8i7ough,r6;anqu2Oen1ue;dy,g3Sme0ny,r09;ck,n,rs2P;d40se;ll,me,rt,s6wd45;te5;aVcarUeThRiQkin0FlMmKoHpGqua1FtAu7w6;eet,ift;b7dd13per0Gr6;e,re2H;sta2Ft3;aAe9iff,r7u6;pXr1;a6ict,o4;ig3Fn0U;a1ep,rn;le,rk;e22i3Fright0;ci28ft,l7o6re,ur;n,thi4;emn,id;a6el0ooth;ll,rt;e8i6ow,y;ck,g35m6;!y;ek,nd3D;ck,l0mp3;a6iTort,rill,y;dy,ll0Xrp;cu0Rve0Rxy;ce,ed,y;d,fe,int0l1Vv14;aBe9i8o6ude;mantic,o1Isy,u6;gh,nd;ch,pe,tzy;a6d,mo0H;dy,l;gg7ndom,p6re,w;id;ed;ai2i6;ck,et;aEhoDi1QlCoBr8u6;ny,r6;e,p3;egna2ic7o6;fouYud;ey,k0;li04or,te1B;ain,easa2;ny;in5le;dd,f6i0ld,ranQ;fi10;aAe8i7o6;b3isy,rm15sy;ce,mb3;a6w;r,t;ive,rr01;aAe8ild,o7u6;nda19te;ist,o1;a6ek,llX;n,s0ty;d,tuQ;aBeAi9o6ucky;f0Un7o1Du6ve0w17y0T;d,sy;e0g;g1Tke0tt3ve0;an,wd;me,r6te;ge;e7i6;nd;en;ol0ui1P;cy,ll,n6;sBt6;e6ima8;llege2r6;es7media6;te;ti4;ecu6ta2;re;aEeBiAo8u6;ge,m6ng1R;b3id;ll6me0t;ow;gh,l0;a6f04sita2;dy,v6;en0y;nd1Hppy,r6te5;d,sh;aGenFhDiClBoofy,r6;a9e8is0o6ue1E;o6ss;vy;at,en,y;nd,y;ad,ib,ooI;a2d1;a6o6;st0;t3uiY;u1y;aIeeb3iDlat,oAr8u6;ll,n6r14;!ny;aHe6iend0;e,sh;a7r6ul;get5mG;my;erce8n6rm;an6e;ciC;! ;le;ir,ke,n0Fr,st,t,ulA;aAerie,mp9sse7v6xtre0Q;il;nti6;al;ty;r7s6;tern,y;ly,th0;aFeCi9r7u6;ll,mb;u6y;nk;r7vi6;ne;e,ty;a6ep,nD;d6f,r;!ly;mp,pp03rk;aHhDlAo8r7u6;dd0r0te;isp,uel;ar6ld,mmon,ol,st0ward0zy;se;e6ou1;a6vW;n,r;ar8e6il0;ap,e6;sy;mi4;gey,lm8r6;e5i4;ful;!i4;aNiLlIoEr8u6;r0sy;ly;aAi7o6;ad,wn;ef,g7llia2;nt;ht;sh,ve;ld,r7un6;cy;ed,i4;ng;a7o6ue;nd,o1;ck,nd;g,tt6;er;d,ld,w1;dy;bsu9ng8we6;so6;me;ry;rd", TextOrdinal: "true¦bGeDf9hundredHmGnin7qu6s4t0zeroH;enGh1rFwe0;lfFn9;ir0ousandE;d,t4;e0ixt9;cond,ptAvent8xtA;adr9int9;et0th;e6ie8;i2o0;r0urt3;tie5;ft1rst;ight0lev1;e0h,ie2;en1;illion0;th", Cardinal: "true¦bHeEf8hundred,mHnineAone,qu6s4t0zero;en,h2rGw0;e0o;lve,n8;irt9ousandEree;e0ix5;pt1ven4xt1;adr0int0;illion;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illion0;!s", Expression: "true¦a02b01dXeVfuck,gShLlImHnGoDpBshAtsk,u7voi04w3y0;a1eLu0;ck,p;!a,hoo,y;h1ow,t0;af,f;e0oa;e,w;gh,h0;! 0h,m;huh,oh;eesh,hh,it;ff,hew,l0sst;ease,z;h1o0w,y;h,o,ps;!h;ah,ope;eh,mm;m1ol0;!s;ao,fao;a4e2i,mm,oly1urr0;ah;! mo6;e,ll0y;!o;ha0i;!ha;ah,ee,o0rr;l0odbye;ly;e0h,t cetera,ww;k,p;'oh,a0uh;m0ng;mit,n0;!it;ah,oo,ye; 1h0rgh;!em;la", Adverb: "true¦a08by 06d02eYfShQinPjustOkinda,mMnJoEpCquite,r9s5t2up1very,well,ye0;p,s; to,wards5;h1iny bit,o0wiO;o,t6ward;en,us;eldom,o0uch;!me1rt0; of;hYtimes,w09;a1e0;alT;ndomSthN;ar excellDer0oint blank; Nhaps;f3n0;ce0ly;! 0;ag02moW; courIten;ewKo0; longEt 0;onIwithstanding;aybe,eanwhiAore0;!ovB;! aboU;deed,steV;en0;ce;or2u0;lArther0;!moJ; 0ev3;examp0good,suH;le;n1v0;er; mas0ough;se;e0irect1; 1finite0;ly;ju8trop;far,n0;ow; DbroCd nauseam,gBl6ny3part,s2t 0w4;be6l0mo6wor6;arge,ea5; soon,ide;mo1w0;ay;re;l 1mo0one,ready,so,ways;st;b1t0;hat;ut;ain;ad;lot,posteriori", Determiner: "true¦aBboth,d9e6few,l4mu8neiDown,plenty,s3th2various,wh0;at0ich0;evC;at,e4is,ose;everal,ome;a,e0;!ast,s;a1i6l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er"}, ar = function(e3) {
  const t2 = e3.split("|").reduce((e4, t3) => {
    const r3 = t3.split("¦");
    return e4[r3[0]] = r3[1], e4;
  }, {}), r2 = {};
  return Object.keys(t2).forEach(function(e4) {
    const a2 = tr(t2[e4]);
    e4 === "true" && (e4 = true);
    for (let t3 = 0; t3 < a2.length; t3++) {
      const n2 = a2[t3];
      r2.hasOwnProperty(n2) === true ? Array.isArray(r2[n2]) === false ? r2[n2] = [r2[n2], e4] : r2[n2].push(e4) : r2[n2] = e4;
    }
  }), r2;
};
let nr = {"20th century fox": "Organization", "7 eleven": "Organization", "motel 6": "Organization", g8: "Organization", vh1: "Organization", q1: "Date", q2: "Date", q3: "Date", q4: "Date", her: ["Possessive", "Pronoun"], his: ["Possessive", "Pronoun"], their: ["Possessive", "Pronoun"], themselves: ["Possessive", "Pronoun"], your: ["Possessive", "Pronoun"], our: ["Possessive", "Pronoun"], my: ["Possessive", "Pronoun"], its: ["Possessive", "Pronoun"]};
const ir = {Unit: (e3, t2) => {
  e3[t2] = ["Abbreviation", "Unit"];
}, Cardinal: (e3, t2) => {
  e3[t2] = ["TextValue", "Cardinal"];
}, TextOrdinal: (e3, t2) => {
  e3[t2] = ["Ordinal", "TextValue"], e3[t2 + "s"] = ["TextValue", "Fraction"];
}, Singular: (e3, t2, r2) => {
  e3[t2] = "Singular";
  let a2 = r2.transforms.toPlural(t2, r2);
  e3[a2] = e3[a2] || "Plural";
}, Infinitive: (e3, t2, r2) => {
  e3[t2] = "Infinitive";
  let a2 = r2.transforms.conjugate(t2, r2), n2 = Object.keys(a2);
  for (let t3 = 0; t3 < n2.length; t3++) {
    let r3 = a2[n2[t3]];
    e3[r3] = e3[r3] || n2[t3];
  }
}, Comparable: (e3, t2, r2) => {
  e3[t2] = "Comparable";
  let a2 = r2.transforms.adjectives(t2), n2 = Object.keys(a2);
  for (let t3 = 0; t3 < n2.length; t3++) {
    let r3 = a2[n2[t3]];
    e3[r3] = e3[r3] || n2[t3];
  }
}, PhrasalVerb: (e3, t2, r2) => {
  e3[t2] = ["PhrasalVerb", "Infinitive"];
  let a2 = t2.split(" "), n2 = r2.transforms.conjugate(a2[0], r2), i2 = Object.keys(n2);
  for (let t3 = 0; t3 < i2.length; t3++) {
    let o2 = n2[i2[t3]] + " " + a2[1];
    e3[o2] = e3[o2] || ["PhrasalVerb", i2[t3]], r2.hasCompound[n2[i2[t3]]] = true;
  }
}, Demonym: (e3, t2, r2) => {
  e3[t2] = "Demonym";
  let a2 = r2.transforms.toPlural(t2, r2);
  e3[a2] = e3[a2] || ["Demonym", "Plural"];
}}, or = function(e3, t2, r2) {
  Object.keys(e3).forEach((a2) => {
    let n2 = e3[a2];
    n2 !== "Abbreviation" && n2 !== "Unit" || (r2.cache.abbreviations[a2] = true);
    let i2 = a2.split(" ");
    i2.length > 1 && (r2.hasCompound[i2[0]] = true), ir[n2] === void 0 ? t2[a2] !== void 0 ? (typeof t2[a2] == "string" && (t2[a2] = [t2[a2]]), typeof n2 == "string" ? t2[a2].push(n2) : t2[a2] = t2[a2].concat(n2)) : t2[a2] = n2 : ir[n2](t2, a2, r2);
  });
};
var sr = {buildOut: function(e3) {
  let t2 = Object.assign({}, nr);
  return Object.keys(rr).forEach((r2) => {
    let a2 = ar(rr[r2]);
    Object.keys(a2).forEach((e4) => {
      a2[e4] = r2;
    }), or(a2, t2, e3);
  }), t2;
}, addWords: or};
var lr = function(e3) {
  let t2 = e3.irregulars.nouns, r2 = Object.keys(t2);
  for (let a3 = 0; a3 < r2.length; a3++) {
    const n3 = r2[a3];
    e3.words[n3] = "Singular", e3.words[t2[n3]] = "Plural";
  }
  let a2 = e3.irregulars.verbs, n2 = Object.keys(a2);
  for (let t3 = 0; t3 < n2.length; t3++) {
    const r3 = n2[t3];
    e3.words[r3] = e3.words[r3] || "Infinitive";
    let i2 = e3.transforms.conjugate(r3, e3);
    i2 = Object.assign(i2, a2[r3]), Object.keys(i2).forEach((t4) => {
      e3.words[i2[t4]] = e3.words[i2[t4]] || t4, e3.words[i2[t4]] === "Participle" && (e3.words[i2[t4]] = t4);
    });
  }
};
const ur = {g: "Gerund", prt: "Participle", perf: "PerfectTense", pst: "PastTense", fut: "FuturePerfect", pres: "PresentTense", pluperf: "Pluperfect", a: "Actor"};
let cr = {act: {a: "_or"}, ache: {pst: "ached", g: "aching"}, age: {g: "ageing", pst: "aged", pres: "ages"}, aim: {a: "_er", g: "_ing", pst: "_ed"}, arise: {prt: "_n", pst: "arose"}, babysit: {a: "_ter", pst: "babysat"}, ban: {a: "", g: "_ning", pst: "_ned"}, be: {a: "", g: "am", prt: "been", pst: "was", pres: "is"}, beat: {a: "_er", g: "_ing", prt: "_en"}, become: {prt: "_"}, begin: {g: "_ning", prt: "begun", pst: "began"}, being: {g: "are", pst: "were", pres: "are"}, bend: {prt: "bent"}, bet: {a: "_ter", prt: "_"}, bind: {pst: "bound"}, bite: {g: "biting", prt: "bitten", pst: "bit"}, bleed: {pst: "bled", prt: "bled"}, blow: {prt: "_n", pst: "blew"}, boil: {a: "_er"}, brake: {prt: "broken"}, break: {pst: "broke"}, breed: {pst: "bred"}, bring: {pst: "brought", prt: "brought"}, broadcast: {pst: "_"}, budget: {pst: "_ed"}, build: {pst: "built", prt: "built"}, burn: {prt: "_ed"}, burst: {prt: "_"}, buy: {pst: "bought", prt: "bought"}, can: {a: "", fut: "_", g: "", pst: "could", perf: "could", pluperf: "could", pres: "_"}, catch: {pst: "caught"}, choose: {g: "choosing", prt: "chosen", pst: "chose"}, cling: {prt: "clung"}, come: {prt: "_", pst: "came", g: "coming"}, compete: {a: "competitor", g: "competing", pst: "_d"}, cost: {pst: "_"}, creep: {prt: "crept"}, cut: {prt: "_"}, deal: {pst: "_t", prt: "_t"}, develop: {a: "_er", g: "_ing", pst: "_ed"}, die: {g: "dying", pst: "_d"}, dig: {g: "_ging", pst: "dug", prt: "dug"}, dive: {prt: "_d"}, do: {pst: "did", pres: "_es"}, draw: {prt: "_n", pst: "drew"}, dream: {prt: "_t"}, drink: {prt: "drunk", pst: "drank"}, drive: {g: "driving", prt: "_n", pst: "drove"}, drop: {g: "_ping", pst: "_ped"}, eat: {a: "_er", g: "_ing", prt: "_en", pst: "ate"}, edit: {pst: "_ed", g: "_ing"}, egg: {pst: "_ed"}, fall: {prt: "_en", pst: "fell"}, feed: {prt: "fed", pst: "fed"}, feel: {a: "_er", pst: "felt"}, fight: {pst: "fought", prt: "fought"}, find: {pst: "found"}, flee: {g: "_ing", prt: "fled"}, fling: {prt: "flung"}, fly: {prt: "flown", pst: "flew"}, forbid: {pst: "forbade"}, forget: {g: "_ing", prt: "forgotten", pst: "forgot"}, forgive: {g: "forgiving", prt: "_n", pst: "forgave"}, free: {a: "", g: "_ing"}, freeze: {g: "freezing", prt: "frozen", pst: "froze"}, get: {pst: "got", prt: "gotten"}, give: {g: "giving", prt: "_n", pst: "gave"}, go: {prt: "_ne", pst: "went", pres: "goes"}, grow: {prt: "_n"}, guide: {pst: "_d"}, hang: {pst: "hung", prt: "hung"}, have: {g: "having", pst: "had", prt: "had", pres: "has"}, hear: {pst: "_d", prt: "_d"}, hide: {prt: "hidden", pst: "hid"}, hit: {prt: "_"}, hold: {pst: "held", prt: "held"}, hurt: {pst: "_", prt: "_"}, ice: {g: "icing", pst: "_d"}, imply: {pst: "implied", pres: "implies"}, is: {a: "", g: "being", pst: "was", pres: "_"}, keep: {prt: "kept"}, kneel: {prt: "knelt"}, know: {prt: "_n"}, lay: {pst: "laid", prt: "laid"}, lead: {pst: "led", prt: "led"}, leap: {prt: "_t"}, leave: {pst: "left", prt: "left"}, lend: {prt: "lent"}, lie: {g: "lying", pst: "lay"}, light: {pst: "lit", prt: "lit"}, log: {g: "_ging", pst: "_ged"}, loose: {prt: "lost"}, lose: {g: "losing", pst: "lost"}, make: {pst: "made", prt: "made"}, mean: {pst: "_t", prt: "_t"}, meet: {a: "_er", g: "_ing", pst: "met", prt: "met"}, miss: {pres: "_"}, name: {g: "naming"}, patrol: {g: "_ling", pst: "_led"}, pay: {pst: "paid", prt: "paid"}, prove: {prt: "_n"}, puke: {g: "puking"}, put: {prt: "_"}, quit: {prt: "_"}, read: {pst: "_", prt: "_"}, ride: {prt: "ridden"}, reside: {pst: "_d"}, ring: {pst: "rang", prt: "rung"}, rise: {fut: "will have _n", g: "rising", prt: "_n", pst: "rose", pluperf: "had _n"}, rub: {g: "_bing", pst: "_bed"}, run: {g: "_ning", prt: "_", pst: "ran"}, say: {pst: "said", prt: "said", pres: "_s"}, seat: {pst: "sat", prt: "sat"}, see: {g: "_ing", prt: "_n", pst: "saw"}, seek: {prt: "sought"}, sell: {pst: "sold", prt: "sold"}, send: {prt: "sent"}, set: {prt: "_"}, sew: {prt: "_n"}, shake: {prt: "_n"}, shave: {prt: "_d"}, shed: {g: "_ding", pst: "_", pres: "_s"}, shine: {pst: "shone", prt: "shone"}, shoot: {pst: "shot", prt: "shot"}, show: {pst: "_ed"}, shut: {prt: "_"}, sing: {prt: "sung", pst: "sang"}, sink: {pst: "sank", pluperf: "had sunk"}, sit: {pst: "sat"}, ski: {pst: "_ied"}, slay: {prt: "slain"}, sleep: {prt: "slept"}, slide: {pst: "slid", prt: "slid"}, smash: {pres: "_es"}, sneak: {prt: "snuck"}, speak: {fut: "will have spoken", prt: "spoken", pst: "spoke", perf: "have spoken", pluperf: "had spoken"}, speed: {prt: "sped"}, spend: {prt: "spent"}, spill: {prt: "_ed", pst: "spilt"}, spin: {g: "_ning", pst: "spun", prt: "spun"}, spit: {prt: "spat"}, split: {prt: "_"}, spread: {pst: "_"}, spring: {prt: "sprung"}, stand: {pst: "stood"}, steal: {a: "_er", pst: "stole"}, stick: {pst: "stuck"}, sting: {pst: "stung"}, stink: {pst: "stunk", prt: "stunk"}, stream: {a: "_er"}, strew: {prt: "_n"}, strike: {g: "striking", pst: "struck"}, suit: {a: "_er", g: "_ing", pst: "_ed"}, sware: {prt: "sworn"}, swear: {pst: "swore"}, sweep: {prt: "swept"}, swim: {g: "_ming", pst: "swam"}, swing: {pst: "swung"}, take: {fut: "will have _n", pst: "took", perf: "have _n", pluperf: "had _n"}, teach: {pst: "taught", pres: "_es"}, tear: {pst: "tore"}, tell: {pst: "told"}, think: {pst: "thought"}, thrive: {prt: "_d"}, tie: {g: "tying", pst: "_d"}, undergo: {prt: "_ne"}, understand: {pst: "understood"}, upset: {prt: "_"}, wait: {a: "_er", g: "_ing", pst: "_ed"}, wake: {pst: "woke"}, wear: {pst: "wore"}, weave: {prt: "woven"}, wed: {pst: "wed"}, weep: {prt: "wept"}, win: {g: "_ning", pst: "won"}, wind: {prt: "wound"}, withdraw: {pst: "withdrew"}, wring: {prt: "wrung"}, write: {g: "writing", prt: "written", pst: "wrote"}}, hr = Object.keys(cr);
for (let e3 = 0; e3 < hr.length; e3++) {
  const t2 = hr[e3];
  let r2 = {};
  Object.keys(cr[t2]).forEach((e4) => {
    let a2 = cr[t2][e4];
    a2 = a2.replace("_", t2), r2[ur[e4]] = a2;
  }), cr[t2] = r2;
}
var dr = cr;
const gr = {b: [{reg: /([^aeiou][aeiou])b$/i, repl: {pr: "$1bs", pa: "$1bbed", gr: "$1bbing"}}], d: [{reg: /(end)$/i, repl: {pr: "$1s", pa: "ent", gr: "$1ing", ar: "$1er"}}, {reg: /(eed)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing", ar: "$1er"}}, {reg: /(ed)$/i, repl: {pr: "$1s", pa: "$1ded", ar: "$1der", gr: "$1ding"}}, {reg: /([^aeiou][ou])d$/i, repl: {pr: "$1ds", pa: "$1dded", gr: "$1dding"}}], e: [{reg: /(eave)$/i, repl: {pr: "$1s", pa: "$1d", gr: "eaving", ar: "$1r"}}, {reg: /(ide)$/i, repl: {pr: "$1s", pa: "ode", gr: "iding", ar: "ider"}}, {reg: /(t|sh?)(ake)$/i, repl: {pr: "$1$2s", pa: "$1ook", gr: "$1aking", ar: "$1$2r"}}, {reg: /w(ake)$/i, repl: {pr: "w$1s", pa: "woke", gr: "waking", ar: "w$1r"}}, {reg: /m(ake)$/i, repl: {pr: "m$1s", pa: "made", gr: "making", ar: "m$1r"}}, {reg: /(a[tg]|i[zn]|ur|nc|gl|is)e$/i, repl: {pr: "$1es", pa: "$1ed", gr: "$1ing"}}, {reg: /([bd]l)e$/i, repl: {pr: "$1es", pa: "$1ed", gr: "$1ing"}}, {reg: /(om)e$/i, repl: {pr: "$1es", pa: "ame", gr: "$1ing"}}], g: [{reg: /([^aeiou][aou])g$/i, repl: {pr: "$1gs", pa: "$1gged", gr: "$1gging"}}], h: [{reg: /(..)([cs]h)$/i, repl: {pr: "$1$2es", pa: "$1$2ed", gr: "$1$2ing"}}], k: [{reg: /(ink)$/i, repl: {pr: "$1s", pa: "unk", gr: "$1ing", ar: "$1er"}}], m: [{reg: /([^aeiou][aeiou])m$/i, repl: {pr: "$1ms", pa: "$1mmed", gr: "$1mming"}}], n: [{reg: /(en)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing"}}], p: [{reg: /(e)(ep)$/i, repl: {pr: "$1$2s", pa: "$1pt", gr: "$1$2ing", ar: "$1$2er"}}, {reg: /([^aeiou][aeiou])p$/i, repl: {pr: "$1ps", pa: "$1pped", gr: "$1pping"}}, {reg: /([aeiu])p$/i, repl: {pr: "$1ps", pa: "$1p", gr: "$1pping"}}], r: [{reg: /([td]er)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing"}}, {reg: /(er)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing"}}], s: [{reg: /(ish|tch|ess)$/i, repl: {pr: "$1es", pa: "$1ed", gr: "$1ing"}}], t: [{reg: /(ion|end|e[nc]t)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing"}}, {reg: /(.eat)$/i, repl: {pr: "$1s", pa: "$1ed", gr: "$1ing"}}, {reg: /([aeiu])t$/i, repl: {pr: "$1ts", pa: "$1t", gr: "$1tting"}}, {reg: /([^aeiou][aeiou])t$/i, repl: {pr: "$1ts", pa: "$1tted", gr: "$1tting"}}], w: [{reg: /(.llow)$/i, repl: {pr: "$1s", pa: "$1ed"}}, {reg: /(..)(ow)$/i, repl: {pr: "$1$2s", pa: "$1ew", gr: "$1$2ing", prt: "$1$2n"}}], y: [{reg: /(i|f|rr)y$/i, repl: {pr: "$1ies", pa: "$1ied", gr: "$1ying"}}], z: [{reg: /([aeiou]zz)$/i, repl: {pr: "$1es", pa: "$1ed", gr: "$1ing"}}]}, pr = {pr: "PresentTense", pa: "PastTense", gr: "Gerund", prt: "Participle", ar: "Actor"}, mr = function(e3, t2) {
  let r2 = {}, a2 = Object.keys(t2.repl);
  for (let n2 = 0; n2 < a2.length; n2 += 1) {
    let i2 = a2[n2];
    r2[pr[i2]] = e3.replace(t2.reg, t2.repl[i2]);
  }
  return r2;
};
const fr = /[bcdfghjklmnpqrstvwxz]y$/;
const br = function(e3 = "") {
  let t2 = e3[e3.length - 1];
  if (gr.hasOwnProperty(t2) === true)
    for (let r2 = 0; r2 < gr[t2].length; r2 += 1) {
      if (gr[t2][r2].reg.test(e3) === true)
        return mr(e3, gr[t2][r2]);
    }
  return {};
}, yr = {Gerund: (e3) => e3.charAt(e3.length - 1) === "e" ? e3.replace(/e$/, "ing") : e3 + "ing", PresentTense: (e3) => e3.charAt(e3.length - 1) === "s" ? e3 + "es" : fr.test(e3) === true ? e3.slice(0, -1) + "ies" : e3 + "s", PastTense: (e3) => e3.charAt(e3.length - 1) === "e" ? e3 + "d" : e3.substr(-2) === "ed" ? e3 : fr.test(e3) === true ? e3.slice(0, -1) + "ied" : e3 + "ed"};
var vr = function(e3 = "", t2) {
  let r2 = {};
  return t2 && t2.irregulars && t2.irregulars.verbs.hasOwnProperty(e3) === true && (r2 = Object.assign({}, t2.irregulars.verbs[e3])), r2 = Object.assign({}, br(e3), r2), r2.Gerund === void 0 && (r2.Gerund = yr.Gerund(e3)), r2.PastTense === void 0 && (r2.PastTense = yr.PastTense(e3)), r2.PresentTense === void 0 && (r2.PresentTense = yr.PresentTense(e3)), r2;
};
const wr = [/ght$/, /nge$/, /ough$/, /ain$/, /uel$/, /[au]ll$/, /ow$/, /oud$/, /...p$/], kr = [/ary$/], Ar = {nice: "nicest", late: "latest", hard: "hardest", inner: "innermost", outer: "outermost", far: "furthest", worse: "worst", bad: "worst", good: "best", big: "biggest", large: "largest"}, Dr = [{reg: /y$/i, repl: "iest"}, {reg: /([aeiou])t$/i, repl: "$1ttest"}, {reg: /([aeou])de$/i, repl: "$1dest"}, {reg: /nge$/i, repl: "ngest"}, {reg: /([aeiou])te$/i, repl: "$1test"}];
const $r = [/ght$/, /nge$/, /ough$/, /ain$/, /uel$/, /[au]ll$/, /ow$/, /old$/, /oud$/, /e[ae]p$/], Pr = [/ary$/, /ous$/], Er = {grey: "greyer", gray: "grayer", green: "greener", yellow: "yellower", red: "redder", good: "better", well: "better", bad: "worse", sad: "sadder", big: "bigger"}, Hr = [{reg: /y$/i, repl: "ier"}, {reg: /([aeiou])t$/i, repl: "$1tter"}, {reg: /([aeou])de$/i, repl: "$1der"}, {reg: /nge$/i, repl: "nger"}];
const jr = {toSuperlative: function(e3) {
  if (Ar.hasOwnProperty(e3))
    return Ar[e3];
  for (let t2 = 0; t2 < Dr.length; t2++)
    if (Dr[t2].reg.test(e3))
      return e3.replace(Dr[t2].reg, Dr[t2].repl);
  for (let t2 = 0; t2 < kr.length; t2++)
    if (kr[t2].test(e3) === true)
      return null;
  for (let t2 = 0; t2 < wr.length; t2++)
    if (wr[t2].test(e3) === true)
      return e3.charAt(e3.length - 1) === "e" ? e3 + "st" : e3 + "est";
  return e3 + "est";
}, toComparative: function(e3) {
  if (Er.hasOwnProperty(e3))
    return Er[e3];
  for (let t2 = 0; t2 < Hr.length; t2++)
    if (Hr[t2].reg.test(e3) === true)
      return e3.replace(Hr[t2].reg, Hr[t2].repl);
  for (let t2 = 0; t2 < Pr.length; t2++)
    if (Pr[t2].test(e3) === true)
      return null;
  for (let t2 = 0; t2 < $r.length; t2++)
    if ($r[t2].test(e3) === true)
      return e3 + "er";
  return /e$/.test(e3) === true ? e3 + "r" : e3 + "er";
}};
var Nr = function(e3) {
  let t2 = {}, r2 = jr.toSuperlative(e3);
  r2 && (t2.Superlative = r2);
  let a2 = jr.toComparative(e3);
  return a2 && (t2.Comparative = a2), t2;
};
const xr = {a: [[/(antenn|formul|nebul|vertebr|vit)a$/i, "$1ae"], [/([ti])a$/i, "$1a"]], e: [[/(kn|l|w)ife$/i, "$1ives"], [/(hive)$/i, "$1s"], [/([m|l])ouse$/i, "$1ice"], [/([m|l])ice$/i, "$1ice"]], f: [[/^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves"], [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves"]], i: [[/(octop|vir)i$/i, "$1i"]], m: [[/([ti])um$/i, "$1a"]], n: [[/^(oxen)$/i, "$1"]], o: [[/(al|ad|at|er|et|ed|ad)o$/i, "$1oes"]], s: [[/(ax|test)is$/i, "$1es"], [/(alias|status)$/i, "$1es"], [/sis$/i, "ses"], [/(bu)s$/i, "$1ses"], [/(sis)$/i, "ses"], [/^(?!talis|.*hu)(.*)man$/i, "$1men"], [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, "$1i"]], x: [[/(matr|vert|ind|cort)(ix|ex)$/i, "$1ices"], [/^(ox)$/i, "$1en"]], y: [[/([^aeiouy]|qu)y$/i, "$1ies"]], z: [[/(quiz)$/i, "$1zes"]]}, Fr = /(x|ch|sh|s|z)$/;
var Cr = function(e3 = "", t2) {
  let r2 = t2.irregulars.nouns;
  if (r2.hasOwnProperty(e3))
    return r2[e3];
  let a2 = function(e4) {
    let t3 = e4[e4.length - 1];
    if (xr.hasOwnProperty(t3) === true)
      for (let r3 = 0; r3 < xr[t3].length; r3 += 1) {
        let a3 = xr[t3][r3][0];
        if (a3.test(e4) === true)
          return e4.replace(a3, xr[t3][r3][1]);
      }
    return null;
  }(e3);
  return a2 !== null ? a2 : Fr.test(e3) ? e3 + "es" : e3 + "s";
};
const Br = [[/([^v])ies$/i, "$1y"], [/ises$/i, "isis"], [/(kn|[^o]l|w)ives$/i, "$1ife"], [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f"], [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f"], [/(antenn|formul|nebul|vertebr|vit)ae$/i, "$1a"], [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, "$1us"], [/(buffal|tomat|tornad)(oes)$/i, "$1o"], [/(eas)es$/i, "$1e"], [/(..[aeiou]s)es$/i, "$1"], [/(vert|ind|cort)(ices)$/i, "$1ex"], [/(matr|append)(ices)$/i, "$1ix"], [/(x|ch|ss|sh|z|o)es$/i, "$1"], [/men$/i, "man"], [/(n)ews$/i, "$1ews"], [/([ti])a$/i, "$1um"], [/([^aeiouy]|qu)ies$/i, "$1y"], [/(s)eries$/i, "$1eries"], [/(m)ovies$/i, "$1ovie"], [/([m|l])ice$/i, "$1ouse"], [/(cris|ax|test)es$/i, "$1is"], [/(alias|status)es$/i, "$1"], [/(ss)$/i, "$1"], [/(ics)$/i, "$1"], [/s$/i, ""]];
var Gr = function(e3, t2) {
  let r2 = t2.irregulars.nouns, a2 = (n2 = r2, Object.keys(n2).reduce((e4, t3) => (e4[n2[t3]] = t3, e4), {}));
  var n2;
  if (a2.hasOwnProperty(e3))
    return a2[e3];
  for (let t3 = 0; t3 < Br.length; t3++)
    if (Br[t3][0].test(e3) === true)
      return e3 = e3.replace(Br[t3][0], Br[t3][1]);
  return e3;
};
var zr = {Participle: [{reg: /own$/i, to: "ow"}, {reg: /(.)un([g|k])$/i, to: "$1in$2"}], Actor: [{reg: /(er)er$/i, to: "$1"}], PresentTense: [{reg: /(..)(ies)$/i, to: "$1y"}, {reg: /(tch|sh)es$/i, to: "$1"}, {reg: /(ss|zz)es$/i, to: "$1"}, {reg: /([tzlshicgrvdnkmu])es$/i, to: "$1e"}, {reg: /(n[dtk]|c[kt]|[eo]n|i[nl]|er|a[ytrl])s$/i, to: "$1"}, {reg: /(ow)s$/i, to: "$1"}, {reg: /(op)s$/i, to: "$1"}, {reg: /([eirs])ts$/i, to: "$1t"}, {reg: /(ll)s$/i, to: "$1"}, {reg: /(el)s$/i, to: "$1"}, {reg: /(ip)es$/i, to: "$1e"}, {reg: /ss$/i, to: "ss"}, {reg: /s$/i, to: ""}], Gerund: [{reg: /(..)(p|d|t|g){2}ing$/i, to: "$1$2"}, {reg: /(ll|ss|zz)ing$/i, to: "$1"}, {reg: /([^aeiou])ying$/i, to: "$1y"}, {reg: /([^ae]i.)ing$/i, to: "$1e"}, {reg: /(ea[dklnrtv])ing$/i, to: "$1"}, {reg: /(ch|sh)ing$/i, to: "$1"}, {reg: /(z)ing$/i, to: "$1e"}, {reg: /(a[gdkvtc])ing$/i, to: "$1e"}, {reg: /(u[rtcbn])ing$/i, to: "$1e"}, {reg: /([^o]o[bdknprv])ing$/i, to: "$1e"}, {reg: /([tbckg]l)ing$/i, to: "$1e"}, {reg: /(c|s)ing$/i, to: "$1e"}, {reg: /(..)ing$/i, to: "$1"}], PastTense: [{reg: /(ued)$/i, to: "ue"}, {reg: /ea(rn|l|m)ed$/i, to: "ea$1"}, {reg: /a([^aeiouy])ed$/i, to: "a$1e"}, {reg: /([aeiou]zz)ed$/i, to: "$1"}, {reg: /(e|i)lled$/i, to: "$1ll"}, {reg: /(.)(sh|ch)ed$/i, to: "$1$2"}, {reg: /(tl|gl)ed$/i, to: "$1e"}, {reg: /(um?pt?)ed$/i, to: "$1"}, {reg: /(ss)ed$/i, to: "$1"}, {reg: /pped$/i, to: "p"}, {reg: /tted$/i, to: "t"}, {reg: /(..)gged$/i, to: "$1g"}, {reg: /(..)lked$/i, to: "$1lk"}, {reg: /([^aeiouy][aeiou])ked$/i, to: "$1ke"}, {reg: /(.[aeiou])led$/i, to: "$1l"}, {reg: /(..)(h|ion|n[dt]|ai.|[cs]t|pp|all|ss|tt|int|ail|ld|en|oo.|er|k|pp|w|ou.|rt|ght|rm)ed$/i, to: "$1$2"}, {reg: /(.ut)ed$/i, to: "$1e"}, {reg: /(.pt)ed$/i, to: "$1"}, {reg: /(us)ed$/i, to: "$1e"}, {reg: /(dd)ed$/i, to: "$1"}, {reg: /(..[^aeiouy])ed$/i, to: "$1e"}, {reg: /(..)ied$/i, to: "$1y"}, {reg: /(.o)ed$/i, to: "$1o"}, {reg: /(..i)ed$/i, to: "$1"}, {reg: /(.a[^aeiou])ed$/i, to: "$1"}, {reg: /([aeiou][^aeiou])ed$/i, to: "$1e"}, {reg: /([rl])ew$/i, to: "$1ow"}, {reg: /([pl])t$/i, to: "$1t"}]};
let Ir = {Gerund: ["ing"], Actor: ["erer"], Infinitive: ["ate", "ize", "tion", "rify", "then", "ress", "ify", "age", "nce", "ect", "ise", "ine", "ish", "ace", "ash", "ure", "tch", "end", "ack", "and", "ute", "ade", "ock", "ite", "ase", "ose", "use", "ive", "int", "nge", "lay", "est", "ain", "ant", "ent", "eed", "er", "le", "own", "unk", "ung", "en"], PastTense: ["ed", "lt", "nt", "pt", "ew", "ld"], PresentTense: ["rks", "cks", "nks", "ngs", "mps", "tes", "zes", "ers", "les", "acks", "ends", "ands", "ocks", "lays", "eads", "lls", "els", "ils", "ows", "nds", "ays", "ams", "ars", "ops", "ffs", "als", "urs", "lds", "ews", "ips", "es", "ts", "ns"]};
Ir = Object.keys(Ir).reduce((e3, t2) => (Ir[t2].forEach((r2) => e3[r2] = t2), e3), {});
const Or = zr, Tr = Ir;
const Vr = Qt, Mr = sr, Jr = lr, Lr = St, Sr = {nouns: {addendum: "addenda", alga: "algae", alumna: "alumnae", alumnus: "alumni", analysis: "analyses", antenna: "antennae", appendix: "appendices", avocado: "avocados", axis: "axes", bacillus: "bacilli", barracks: "barracks", beau: "beaux", bus: "buses", cactus: "cacti", chateau: "chateaux", child: "children", circus: "circuses", clothes: "clothes", corpus: "corpora", criterion: "criteria", curriculum: "curricula", database: "databases", deer: "deer", diagnosis: "diagnoses", echo: "echoes", embargo: "embargoes", epoch: "epochs", foot: "feet", formula: "formulae", fungus: "fungi", genus: "genera", goose: "geese", halo: "halos", hippopotamus: "hippopotami", index: "indices", larva: "larvae", leaf: "leaves", libretto: "libretti", loaf: "loaves", man: "men", matrix: "matrices", memorandum: "memoranda", modulus: "moduli", mosquito: "mosquitoes", mouse: "mice", nebula: "nebulae", nucleus: "nuclei", octopus: "octopi", opus: "opera", ovum: "ova", ox: "oxen", parenthesis: "parentheses", person: "people", phenomenon: "phenomena", prognosis: "prognoses", quiz: "quizzes", radius: "radii", referendum: "referenda", rodeo: "rodeos", sex: "sexes", shoe: "shoes", sombrero: "sombreros", stimulus: "stimuli", stomach: "stomachs", syllabus: "syllabi", synopsis: "synopses", tableau: "tableaux", thesis: "theses", thief: "thieves", tooth: "teeth", tornado: "tornados", tuxedo: "tuxedos", vertebra: "vertebrae"}, verbs: dr}, _r = {conjugate: vr, adjectives: Nr, toPlural: Cr, toSingular: Gr, toInfinitive: function(e3, t2, r2) {
  if (!e3)
    return "";
  if (t2.words.hasOwnProperty(e3) === true) {
    let r3 = t2.irregulars.verbs, a2 = Object.keys(r3);
    for (let t3 = 0; t3 < a2.length; t3++) {
      let n2 = Object.keys(r3[a2[t3]]);
      for (let i2 = 0; i2 < n2.length; i2++)
        if (e3 === r3[a2[t3]][n2[i2]])
          return a2[t3];
    }
  }
  if ((r2 = r2 || function(e4) {
    let t3 = e4.substr(e4.length - 3);
    if (Tr.hasOwnProperty(t3) === true)
      return Tr[t3];
    let r3 = e4.substr(e4.length - 2);
    return Tr.hasOwnProperty(r3) === true ? Tr[r3] : e4.substr(e4.length - 1) === "s" ? "PresentTense" : null;
  }(e3)) && Or[r2])
    for (let t3 = 0; t3 < Or[r2].length; t3++) {
      const a2 = Or[r2][t3];
      if (a2.reg.test(e3) === true)
        return e3.replace(a2.reg, a2.to);
    }
  return e3;
}};
let Kr = false;
class qr {
  constructor() {
    Object.defineProperty(this, "words", {enumerable: false, value: {}, writable: true}), Object.defineProperty(this, "hasCompound", {enumerable: false, value: {}, writable: true}), Object.defineProperty(this, "irregulars", {enumerable: false, value: Sr, writable: true}), Object.defineProperty(this, "tags", {enumerable: false, value: Object.assign({}, Vr), writable: true}), Object.defineProperty(this, "transforms", {enumerable: false, value: _r, writable: true}), Object.defineProperty(this, "taggers", {enumerable: false, value: [], writable: true}), Object.defineProperty(this, "cache", {enumerable: false, value: {abbreviations: {}}}), this.words = Mr.buildOut(this), Jr(this);
  }
  verbose(e3) {
    return Kr = e3, this;
  }
  isVerbose() {
    return Kr;
  }
  addWords(e3) {
    let t2 = {};
    Object.keys(e3).forEach((r2) => {
      let a2 = e3[r2];
      r2 = r2.toLowerCase().trim(), t2[r2] = a2;
    }), Mr.addWords(t2, this.words, this);
  }
  addConjugations(e3) {
    return Object.assign(this.irregulars.verbs, e3), this;
  }
  addPlurals(e3) {
    return Object.assign(this.irregulars.nouns, e3), this;
  }
  addTags(e3) {
    return e3 = Object.assign({}, e3), this.tags = Object.assign(this.tags, e3), this.tags = Lr(this.tags), this;
  }
  postProcess(e3) {
    return this.taggers.push(e3), this;
  }
  stats() {
    return {words: Object.keys(this.words).length, plurals: Object.keys(this.irregulars.nouns).length, conjugations: Object.keys(this.irregulars.verbs).length, compounds: Object.keys(this.hasCompound).length, postProcessors: this.taggers.length};
  }
}
const Wr = function(e3) {
  return JSON.parse(JSON.stringify(e3));
};
qr.prototype.clone = function() {
  let e3 = new qr();
  return e3.words = Object.assign({}, this.words), e3.hasCompound = Object.assign({}, this.hasCompound), e3.irregulars = Wr(this.irregulars), e3.tags = Wr(this.tags), e3.transforms = this.transforms, e3.taggers = this.taggers, e3;
};
var Rr = qr, Ur = {};
!function(e3) {
  e3.all = function() {
    return this.parents()[0] || this;
  }, e3.parent = function() {
    return this.from ? this.from : this;
  }, e3.parents = function(e4) {
    let t2 = [];
    const r2 = function(e5) {
      e5.from && (t2.push(e5.from), r2(e5.from));
    };
    return r2(this), t2 = t2.reverse(), typeof e4 == "number" ? t2[e4] : t2;
  }, e3.clone = function(e4) {
    let t2 = this.list.map((t3) => t3.clone(e4));
    return this.buildFrom(t2);
  }, e3.wordCount = function() {
    return this.list.reduce((e4, t2) => e4 += t2.wordCount(), 0);
  }, e3.wordcount = e3.wordCount;
}(Ur);
var Qr = {};
!function(e3) {
  e3.first = function(e4) {
    return e4 === void 0 ? this.get(0) : this.slice(0, e4);
  }, e3.last = function(e4) {
    if (e4 === void 0)
      return this.get(this.list.length - 1);
    let t2 = this.list.length;
    return this.slice(t2 - e4, t2);
  }, e3.slice = function(e4, t2) {
    let r2 = this.list.slice(e4, t2);
    return this.buildFrom(r2);
  }, e3.eq = function(e4) {
    let t2 = this.list[e4];
    return t2 === void 0 ? this.buildFrom([]) : this.buildFrom([t2]);
  }, e3.get = e3.eq, e3.firstTerms = function() {
    return this.match("^.");
  }, e3.firstTerm = e3.firstTerms, e3.lastTerms = function() {
    return this.match(".$");
  }, e3.lastTerm = e3.lastTerms, e3.termList = function(e4) {
    let t2 = [];
    for (let r2 = 0; r2 < this.list.length; r2++) {
      let a2 = this.list[r2].terms();
      for (let r3 = 0; r3 < a2.length; r3++)
        if (t2.push(a2[r3]), e4 !== void 0 && t2[e4] !== void 0)
          return t2[e4];
    }
    return t2;
  };
  e3.groups = function(e4) {
    return e4 === void 0 ? function(e5) {
      let t2 = {};
      const r2 = {};
      for (let t3 = 0; t3 < e5.list.length; t3++) {
        const a3 = e5.list[t3], n2 = Object.keys(a3.groups).map((e6) => a3.groups[e6]);
        for (let e6 = 0; e6 < n2.length; e6++) {
          const {group: t4, start: i2, length: o2} = n2[e6];
          r2[t4] || (r2[t4] = []), r2[t4].push(a3.buildFrom(i2, o2));
        }
      }
      const a2 = Object.keys(r2);
      for (let n2 = 0; n2 < a2.length; n2++) {
        const i2 = a2[n2];
        t2[i2] = e5.buildFrom(r2[i2]);
      }
      return t2;
    }(this) : (typeof e4 == "number" && (e4 = String(e4)), function(e5, t2) {
      const r2 = [];
      for (let a2 = 0; a2 < e5.list.length; a2++) {
        const n2 = e5.list[a2];
        let i2 = Object.keys(n2.groups);
        i2 = i2.filter((e6) => n2.groups[e6].group === t2), i2.forEach((e6) => {
          r2.push(n2.buildFrom(n2.groups[e6].start, n2.groups[e6].length));
        });
      }
      return e5.buildFrom(r2);
    }(this, e4) || this.buildFrom([]));
  }, e3.group = e3.groups, e3.sentences = function(e4) {
    let t2 = [];
    return this.list.forEach((e5) => {
      t2.push(e5.fullSentence());
    }), typeof e4 == "number" ? this.buildFrom([t2[e4]]) : this.buildFrom(t2);
  }, e3.sentence = e3.sentences;
}(Qr);
var Zr = {};
var Xr = function(e3, t2) {
  if (e3._cache && e3._cache.set === true) {
    let {words: r2, tags: a2} = function(e4) {
      let t3 = [], r3 = [];
      return e4.forEach((e5) => {
        e5.optional !== true && e5.negative !== true && (e5.tag !== void 0 && t3.push(e5.tag), e5.word !== void 0 && r3.push(e5.word));
      }), {tags: t3, words: r3};
    }(t2);
    for (let t3 = 0; t3 < r2.length; t3++)
      if (e3._cache.words[r2[t3]] === void 0)
        return false;
    for (let t3 = 0; t3 < a2.length; t3++)
      if (e3._cache.tags[a2[t3]] === void 0)
        return false;
  }
  return true;
};
!function(e3) {
  const t2 = _e, r2 = Xr;
  e3.match = function(e4, a2 = {}) {
    typeof a2 != "string" && typeof a2 != "number" && a2 !== null || (a2 = {group: a2});
    let n2 = t2(e4, a2);
    if (n2.length === 0)
      return this.buildFrom([]);
    if (r2(this, n2) === false)
      return this.buildFrom([]);
    let i2 = this.list.reduce((e5, t3) => e5.concat(t3.match(n2)), []);
    return a2.group !== void 0 && a2.group !== null && a2.group !== "" ? this.buildFrom(i2).groups(a2.group) : this.buildFrom(i2);
  }, e3.not = function(e4, a2 = {}) {
    let n2 = t2(e4, a2);
    if (n2.length === 0 || r2(this, n2) === false)
      return this;
    let i2 = this.list.reduce((e5, t3) => e5.concat(t3.not(n2)), []);
    return this.buildFrom(i2);
  }, e3.matchOne = function(e4, a2 = {}) {
    let n2 = t2(e4, a2);
    if (r2(this, n2) === false)
      return this.buildFrom([]);
    for (let e5 = 0; e5 < this.list.length; e5++) {
      let t3 = this.list[e5].match(n2, true);
      return this.buildFrom(t3);
    }
    return this.buildFrom([]);
  }, e3.if = function(e4, a2 = {}) {
    let n2 = t2(e4, a2);
    if (r2(this, n2) === false)
      return this.buildFrom([]);
    let i2 = this.list.filter((e5) => e5.has(n2) === true);
    return this.buildFrom(i2);
  }, e3.ifNo = function(e4, r3 = {}) {
    let a2 = t2(e4, r3), n2 = this.list.filter((e5) => e5.has(a2) === false);
    return this.buildFrom(n2);
  }, e3.has = function(e4, a2 = {}) {
    let n2 = t2(e4, a2);
    return r2(this, n2) !== false && this.list.some((e5) => e5.has(n2) === true);
  }, e3.lookAhead = function(e4, r3 = {}) {
    e4 || (e4 = ".*");
    let a2 = t2(e4, r3), n2 = [];
    return this.list.forEach((e5) => {
      n2 = n2.concat(e5.lookAhead(a2));
    }), n2 = n2.filter((e5) => e5), this.buildFrom(n2);
  }, e3.lookAfter = e3.lookAhead, e3.lookBehind = function(e4, r3 = {}) {
    e4 || (e4 = ".*");
    let a2 = t2(e4, r3), n2 = [];
    return this.list.forEach((e5) => {
      n2 = n2.concat(e5.lookBehind(a2));
    }), n2 = n2.filter((e5) => e5), this.buildFrom(n2);
  }, e3.lookBefore = e3.lookBehind, e3.before = function(e4, r3 = {}) {
    let a2 = t2(e4, r3), n2 = this.if(a2).list.map((e5) => {
      let t3 = e5.terms().map((e6) => e6.id), r4 = e5.match(a2)[0], n3 = t3.indexOf(r4.start);
      return n3 === 0 || n3 === -1 ? null : e5.buildFrom(e5.start, n3);
    });
    return n2 = n2.filter((e5) => e5 !== null), this.buildFrom(n2);
  }, e3.after = function(e4, r3 = {}) {
    let a2 = t2(e4, r3), n2 = this.if(a2).list.map((e5) => {
      let t3 = e5.terms(), r4 = t3.map((e6) => e6.id), n3 = e5.match(a2)[0], i2 = r4.indexOf(n3.start);
      if (i2 === -1 || !t3[i2 + n3.length])
        return null;
      let o2 = t3[i2 + n3.length].id, s2 = e5.length - i2 - n3.length;
      return e5.buildFrom(o2, s2);
    });
    return n2 = n2.filter((e5) => e5 !== null), this.buildFrom(n2);
  }, e3.hasAfter = function(e4, t3 = {}) {
    return this.filter((r3) => r3.lookAfter(e4, t3).found);
  }, e3.hasBefore = function(e4, t3 = {}) {
    return this.filter((r3) => r3.lookBefore(e4, t3).found);
  };
}(Zr);
var Yr = {};
const ea = function(e3, t2, r2, a2) {
  let n2 = [];
  typeof e3 == "string" && (n2 = e3.split(" ")), t2.list.forEach((i2) => {
    let o2 = i2.terms();
    r2 === true && (o2 = o2.filter((r3) => r3.canBe(e3, t2.world))), o2.forEach((r3, i3) => {
      n2.length > 1 ? n2[i3] && n2[i3] !== "." && r3.tag(n2[i3], a2, t2.world) : r3.tag(e3, a2, t2.world);
    });
  });
};
Yr.tag = function(e3, t2) {
  return e3 ? (ea(e3, this, false, t2), this) : this;
}, Yr.tagSafe = function(e3, t2) {
  return e3 ? (ea(e3, this, true, t2), this) : this;
}, Yr.unTag = function(e3, t2) {
  return this.list.forEach((r2) => {
    r2.terms().forEach((r3) => r3.unTag(e3, t2, this.world));
  }), this;
}, Yr.canBe = function(e3) {
  if (!e3)
    return this;
  let t2 = this.world, r2 = this.list.reduce((r3, a2) => r3.concat(a2.canBe(e3, t2)), []);
  return this.buildFrom(r2);
};
var ta = {map: function(e3) {
  if (!e3)
    return this;
  let t2 = this.list.map((t3, r2) => {
    let a2 = this.buildFrom([t3]);
    a2.from = null;
    let n2 = e3(a2, r2);
    return n2 && n2.list && n2.list[0] ? n2.list[0] : n2;
  });
  return t2 = t2.filter((e4) => e4), t2.length === 0 ? this.buildFrom(t2) : typeof t2[0] != "object" || t2[0].isA !== "Phrase" ? t2 : this.buildFrom(t2);
}, forEach: function(e3, t2) {
  return e3 ? (this.list.forEach((r2, a2) => {
    let n2 = this.buildFrom([r2]);
    t2 === true && (n2.from = null), e3(n2, a2);
  }), this) : this;
}, filter: function(e3) {
  if (!e3)
    return this;
  let t2 = this.list.filter((t3, r2) => {
    let a2 = this.buildFrom([t3]);
    return a2.from = null, e3(a2, r2);
  });
  return this.buildFrom(t2);
}, find: function(e3) {
  if (!e3)
    return this;
  let t2 = this.list.find((t3, r2) => {
    let a2 = this.buildFrom([t3]);
    return a2.from = null, e3(a2, r2);
  });
  return t2 ? this.buildFrom([t2]) : void 0;
}, some: function(e3) {
  return e3 ? this.list.some((t2, r2) => {
    let a2 = this.buildFrom([t2]);
    return a2.from = null, e3(a2, r2);
  }) : this;
}, random: function(e3) {
  if (!this.found)
    return this;
  let t2 = Math.floor(Math.random() * this.list.length);
  if (e3 === void 0) {
    let e4 = [this.list[t2]];
    return this.buildFrom(e4);
  }
  return t2 + e3 > this.length && (t2 = this.length - e3, t2 = t2 < 0 ? 0 : t2), this.slice(t2, t2 + e3);
}}, ra = {};
var aa = function(e3, t2, r2) {
  let a2 = function(e4, t3 = []) {
    let r3 = {};
    return e4.forEach((e5, a3) => {
      let n3 = true;
      t3[a3] !== void 0 && (n3 = t3[a3]);
      let i2 = function(e6) {
        return e6.split(/[ -]/g);
      }(e5 = (e5 = (e5 || "").toLowerCase()).replace(/[,;.!?]+$/, "")).map((e6) => e6.trim());
      r3[i2[0]] = r3[i2[0]] || {}, i2.length === 1 ? r3[i2[0]].value = n3 : (r3[i2[0]].more = r3[i2[0]].more || [], r3[i2[0]].more.push({rest: i2.slice(1), value: n3}));
    }), r3;
  }(e3, t2), n2 = [];
  for (let e4 = 0; e4 < r2.list.length; e4++) {
    const t3 = r2.list[e4];
    let i2 = t3.terms().map((e5) => e5.reduced);
    for (let e5 = 0; e5 < i2.length; e5++)
      a2[i2[e5]] !== void 0 && (a2[i2[e5]].more !== void 0 && a2[i2[e5]].more.forEach((r3) => {
        if (i2[e5 + r3.rest.length] === void 0)
          return;
        r3.rest.every((t4, r4) => t4 === i2[e5 + r4 + 1]) === true && n2.push({id: t3.terms()[e5].id, value: r3.value, length: r3.rest.length + 1});
      }), a2[i2[e5]].value !== void 0 && n2.push({id: t3.terms()[e5].id, value: a2[i2[e5]].value, length: 1}));
  }
  return n2;
};
!function(e3) {
  const t2 = aa;
  e3.lookup = function(e4) {
    let r2 = [], a2 = (n2 = e4) && Object.prototype.toString.call(n2) === "[object Object]";
    var n2;
    a2 === true && (e4 = Object.keys(e4).map((t3) => (r2.push(e4[t3]), t3))), typeof e4 == "string" && (e4 = [e4]), this._cache.set !== true && this.cache();
    let i2 = t2(e4, r2, this), o2 = this.list[0];
    if (a2 === true) {
      let e5 = {};
      return i2.forEach((t3) => {
        e5[t3.value] = e5[t3.value] || [], e5[t3.value].push(o2.buildFrom(t3.id, t3.length));
      }), Object.keys(e5).forEach((t3) => {
        e5[t3] = this.buildFrom(e5[t3]);
      }), e5;
    }
    return i2 = i2.map((e5) => o2.buildFrom(e5.id, e5.length)), this.buildFrom(i2);
  }, e3.lookUp = e3.lookup;
}(ra);
var na = {cache: function(e3) {
  e3 = e3 || {};
  let t2 = {}, r2 = {};
  return this._cache.words = t2, this._cache.tags = r2, this._cache.set = true, this.list.forEach((a2, n2) => {
    a2.cache = a2.cache || {}, a2.terms().forEach((a3) => {
      t2[a3.reduced] && !t2.hasOwnProperty(a3.reduced) || (t2[a3.reduced] = t2[a3.reduced] || [], t2[a3.reduced].push(n2), Object.keys(a3.tags).forEach((e4) => {
        r2[e4] = r2[e4] || [], r2[e4].push(n2);
      }), e3.root && (a3.setRoot(this.world), t2[a3.root] = [n2]));
    });
  }), this;
}, uncache: function() {
  return this._cache = {}, this.list.forEach((e3) => {
    e3.cache = {};
  }), this.parents().forEach((e3) => {
    e3._cache = {}, e3.list.forEach((e4) => {
      e4.cache = {};
    });
  }), this;
}}, ia = {};
const oa = xt;
ia.replaceWith = function(e3, t2 = {}) {
  return e3 ? (t2 === true && (t2 = {keepTags: true}), t2 === false && (t2 = {keepTags: false}), t2 = t2 || {}, this.uncache(), this.list.forEach((r2) => {
    let a2, n2 = e3;
    if (typeof e3 == "function" && (n2 = e3(r2)), n2 && typeof n2 == "object" && n2.isA === "Doc")
      a2 = n2.list, this.pool().merge(n2.pool());
    else {
      if (typeof n2 != "string")
        return;
      {
        t2.keepCase !== false && r2.terms(0).isTitleCase() && (n2 = (i2 = n2).charAt(0).toUpperCase() + i2.substr(1)), a2 = oa(n2, this.world, this.pool());
        let e4 = this.buildFrom(a2);
        e4.tagger(), a2 = e4.list;
      }
    }
    var i2;
    if (t2.keepTags === true) {
      let e4 = r2.json({terms: {tags: true}}).terms;
      a2[0].terms().forEach((t3, r3) => {
        e4[r3] && t3.tagSafe(e4[r3].tags, "keptTag", this.world);
      });
    }
    r2.replace(a2[0], this);
  }), this) : this.delete();
}, ia.replace = function(e3, t2, r2) {
  return t2 === void 0 ? this.replaceWith(e3, r2) : (this.match(e3).replaceWith(t2, r2), this);
};
var sa = {};
!function(e3) {
  const t2 = xt, r2 = function(e4) {
    return e4 && Object.prototype.toString.call(e4) === "[object Object]";
  }, a2 = function(e4, r3) {
    let a3 = t2(e4, r3.world)[0], n2 = r3.buildFrom([a3]);
    return n2.tagger(), r3.list = n2.list, r3;
  };
  e3.append = function(e4 = "") {
    return e4 ? this.found ? (this.uncache(), this.list.forEach((a3) => {
      let n2;
      r2(e4) && e4.isA === "Doc" ? n2 = e4.list[0].clone() : typeof e4 == "string" && (n2 = t2(e4, this.world, this.pool())[0]), this.buildFrom([n2]).tagger(), a3.append(n2, this);
    }), this) : a2(e4, this) : this;
  }, e3.insertAfter = e3.append, e3.insertAt = e3.append, e3.prepend = function(e4) {
    return e4 ? this.found ? (this.uncache(), this.list.forEach((a3) => {
      let n2;
      r2(e4) && e4.isA === "Doc" ? n2 = e4.list[0].clone() : typeof e4 == "string" && (n2 = t2(e4, this.world, this.pool())[0]), this.buildFrom([n2]).tagger(), a3.prepend(n2, this);
    }), this) : a2(e4, this) : this;
  }, e3.insertBefore = e3.prepend, e3.concat = function() {
    this.uncache();
    let e4 = this.list.slice(0);
    for (let r3 = 0; r3 < arguments.length; r3++) {
      let a3 = arguments[r3];
      if (typeof a3 == "string") {
        let r4 = t2(a3, this.world);
        e4 = e4.concat(r4);
      } else
        a3.isA === "Doc" ? e4 = e4.concat(a3.list) : a3.isA === "Phrase" && e4.push(a3);
    }
    return this.buildFrom(e4);
  }, e3.delete = function(e4) {
    this.uncache();
    let t3 = this;
    return e4 && (t3 = this.match(e4)), t3.list.forEach((e5) => e5.delete(this)), this;
  }, e3.remove = e3.delete;
}(sa);
var la = {};
const ua = {clean: true, reduced: true, root: true};
la.text = function(e3) {
  e3 = e3 || {};
  let t2 = false;
  this.parents().length === 0 && (t2 = true), (e3 === "root" || typeof e3 == "object" && e3.root) && this.list.forEach((e4) => {
    e4.terms().forEach((e5) => {
      e5.root === null && e5.setRoot(this.world);
    });
  });
  let r2 = this.list.reduce((r3, a2, n2) => {
    const i2 = !t2 && n2 === 0, o2 = !t2 && n2 === this.list.length - 1;
    return r3 + a2.text(e3, i2, o2);
  }, "");
  return ua[e3] !== true && e3.reduced !== true && e3.clean !== true && e3.root !== true || (r2 = r2.trim()), r2;
};
var ca = {};
var ha = function(e3, t2, r2) {
  let a2 = function(e4) {
    let t3 = 0, r3 = 0, a3 = {};
    return e4.termList().forEach((e5) => {
      a3[e5.id] = {index: r3, start: t3 + e5.pre.length, length: e5.text.length}, t3 += e5.pre.length + e5.text.length + e5.post.length, r3 += 1;
    }), a3;
  }(e3.all());
  (r2.terms.index || r2.index) && t2.forEach((e4) => {
    e4.terms.forEach((e5) => {
      e5.index = a2[e5.id].index;
    }), e4.index = e4.terms[0].index;
  }), (r2.terms.offset || r2.offset) && t2.forEach((e4) => {
    e4.terms.forEach((e5) => {
      e5.offset = a2[e5.id] || {};
    }), e4.offset = {index: e4.terms[0].offset.index, start: e4.terms[0].offset.start - e4.text.indexOf(e4.terms[0].text), length: e4.text.length};
  });
};
!function(e3) {
  const t2 = ha, r2 = {text: true, terms: true, trim: true};
  e3.json = function(e4 = {}) {
    if (typeof e4 == "number" && this.list[e4])
      return this.list[e4].json(r2);
    (e4 = function(e5) {
      return (e5 = Object.assign({}, r2, e5)).unique && (e5.reduced = true), e5.offset && (e5.text = true, e5.terms && e5.terms !== true || (e5.terms = {}), e5.terms.offset = true), (e5.index || e5.terms.index) && (e5.terms = e5.terms === true ? {} : e5.terms, e5.terms.id = true), e5;
    }(e4)).root === true && this.list.forEach((e5) => {
      e5.terms().forEach((e6) => {
        e6.root === null && e6.setRoot(this.world);
      });
    });
    let a2 = this.list.map((t3) => t3.json(e4, this.world));
    if ((e4.terms.offset || e4.offset || e4.terms.index || e4.index) && t2(this, a2, e4), e4.frequency || e4.freq || e4.count) {
      let e5 = {};
      this.list.forEach((t3) => {
        let r3 = t3.text("reduced");
        e5[r3] = e5[r3] || 0, e5[r3] += 1;
      }), this.list.forEach((t3, r3) => {
        a2[r3].count = e5[t3.text("reduced")];
      });
    }
    if (e4.unique) {
      let e5 = {};
      a2 = a2.filter((t3) => e5[t3.reduced] !== true && (e5[t3.reduced] = true, true));
    }
    return a2;
  }, e3.data = e3.json;
}(ca);
var da = {}, ga = {exports: {}};
!function(e3) {
  const t2 = "[0m", r2 = function(e4, t3) {
    for (e4 = e4.toString(); e4.length < t3; )
      e4 += " ";
    return e4;
  };
  const a2 = {green: "#7f9c6c", red: "#914045", blue: "#6699cc", magenta: "#6D5685", cyan: "#2D85A8", yellow: "#e6d7b3", black: "#303b50"}, n2 = {green: function(e4) {
    return "[32m" + e4 + t2;
  }, red: function(e4) {
    return "[31m" + e4 + t2;
  }, blue: function(e4) {
    return "[34m" + e4 + t2;
  }, magenta: function(e4) {
    return "[35m" + e4 + t2;
  }, cyan: function(e4) {
    return "[36m" + e4 + t2;
  }, yellow: function(e4) {
    return "[33m" + e4 + t2;
  }, black: function(e4) {
    return "[30m" + e4 + t2;
  }};
  ga.exports = function(e4) {
    return typeof window != "undefined" && window.document ? (function(e5) {
      let t3 = e5.world.tags;
      e5.list.forEach((e6) => {
        console.log('\n%c"' + e6.text() + '"', "color: #e6d7b3;"), e6.terms().forEach((e7) => {
          let n3 = Object.keys(e7.tags), i2 = e7.text || "-";
          e7.implicit && (i2 = "[" + e7.implicit + "]");
          let o2 = "'" + i2 + "'";
          o2 = r2(o2, 8);
          let s2 = n3.find((e8) => t3[e8] && t3[e8].color), l2 = "steelblue";
          t3[s2] && (l2 = t3[s2].color, l2 = a2[l2]), console.log(`   ${o2}  -  %c${n3.join(", ")}`, `color: ${l2 || "steelblue"};`);
        });
      });
    }(e4), e4) : (console.log(n2.blue("=====")), e4.list.forEach((t3) => {
      console.log(n2.blue("  -----")), t3.terms().forEach((t4) => {
        let a3 = Object.keys(t4.tags), i2 = t4.text || "-";
        t4.implicit && (i2 = "[" + t4.implicit + "]"), i2 = n2.yellow(i2);
        let o2 = "'" + i2 + "'";
        o2 = r2(o2, 18);
        let s2 = n2.blue("  ｜ ") + o2 + "  - " + function(e5, t5) {
          return (e5 = e5.map((e6) => {
            if (!t5.tags.hasOwnProperty(e6))
              return e6;
            const r3 = t5.tags[e6].color || "blue";
            return n2[r3](e6);
          })).join(", ");
        }(a3, e4.world);
        console.log(s2);
      });
    }), console.log(""), e4);
  };
}();
const pa = ga.exports, ma = function(e3) {
  let t2 = e3.json({text: false, terms: false, reduced: true}), r2 = {};
  t2.forEach((e4) => {
    r2[e4.reduced] || (e4.count = 0, r2[e4.reduced] = e4), r2[e4.reduced].count += 1;
  });
  let a2 = Object.keys(r2).map((e4) => r2[e4]);
  return a2.sort((e4, t3) => e4.count > t3.count ? -1 : e4.count < t3.count ? 1 : 0), a2;
};
da.debug = function() {
  return pa(this), this;
}, da.out = function(e3) {
  if (e3 === "text")
    return this.text();
  if (e3 === "normal")
    return this.text("normal");
  if (e3 === "json")
    return this.json();
  if (e3 === "offset" || e3 === "offsets")
    return this.json({offset: true});
  if (e3 === "array")
    return this.json({terms: false}).map((e4) => e4.text).filter((e4) => e4);
  if (e3 === "freq" || e3 === "frequency")
    return ma(this);
  if (e3 === "terms") {
    let e4 = [];
    return this.json({text: false, terms: {text: true}}).forEach((t2) => {
      let r2 = t2.terms.map((e5) => e5.text);
      r2 = r2.filter((e5) => e5), e4 = e4.concat(r2);
    }), e4;
  }
  return e3 === "tags" ? this.list.map((e4) => e4.terms().reduce((e5, t2) => (e5[t2.clean || t2.implicit] = Object.keys(t2.tags), e5), {})) : e3 === "debug" ? (pa(this), this) : this.text();
};
var fa = {};
const ba = {alpha: (e3, t2) => {
  let r2 = e3.text("clean"), a2 = t2.text("clean");
  return r2 < a2 ? -1 : r2 > a2 ? 1 : 0;
}, length: (e3, t2) => {
  let r2 = e3.text().trim().length, a2 = t2.text().trim().length;
  return r2 < a2 ? 1 : r2 > a2 ? -1 : 0;
}, wordCount: (e3, t2) => {
  let r2 = e3.wordCount(), a2 = t2.wordCount();
  return r2 < a2 ? 1 : r2 > a2 ? -1 : 0;
}};
ba.alphabetical = ba.alpha, ba.wordcount = ba.wordCount;
const ya = {index: true, sequence: true, seq: true, sequential: true, chron: true, chronological: true};
fa.sort = function(e3) {
  return (e3 = e3 || "alpha") === "freq" || e3 === "frequency" || e3 === "topk" ? function(e4) {
    let t2 = {};
    const r2 = {case: true, punctuation: false, whitespace: true, unicode: true};
    return e4.list.forEach((e5) => {
      let a2 = e5.text(r2);
      t2[a2] = t2[a2] || 0, t2[a2] += 1;
    }), e4.list.sort((e5, a2) => {
      let n2 = t2[e5.text(r2)], i2 = t2[a2.text(r2)];
      return n2 < i2 ? 1 : n2 > i2 ? -1 : 0;
    }), e4;
  }(this) : ya.hasOwnProperty(e3) ? function(e4) {
    let t2 = {};
    return e4.json({terms: {offset: true}}).forEach((e5) => {
      t2[e5.terms[0].id] = e5.terms[0].offset.start;
    }), e4.list = e4.list.sort((e5, r2) => t2[e5.start] > t2[r2.start] ? 1 : t2[e5.start] < t2[r2.start] ? -1 : 0), e4;
  }(this) : typeof (e3 = ba[e3] || e3) == "function" ? (this.list = this.list.sort(e3), this) : this;
}, fa.reverse = function() {
  let e3 = [].concat(this.list);
  return e3 = e3.reverse(), this.buildFrom(e3);
}, fa.unique = function() {
  let e3 = [].concat(this.list), t2 = {};
  return e3 = e3.filter((e4) => {
    let r2 = e4.text("reduced").trim() || e4.text("implicit").trim();
    return t2.hasOwnProperty(r2) !== true && (t2[r2] = true, true);
  }), this.buildFrom(e3);
};
var va = {};
const wa = n, ka = /[\[\]{}⟨⟩:,،、‒–—―…‹›«»‐\-;\/⁄·*\•^†‡°¡¿※№÷×ºª%‰=‱¶§~|‖¦©℗®℠™¤₳฿]/g, Aa = /['‘’“”"′″‴]+/g;
const Da = {whitespace: function(e3) {
  let t2 = e3.list.map((e4) => e4.terms());
  t2.forEach((e4, r2) => {
    e4.forEach((a2, n2) => {
      a2.hasDash() !== true ? (a2.pre = a2.pre.replace(/\s/g, ""), a2.post = a2.post.replace(/\s/g, ""), (e4.length - 1 !== n2 || t2[r2 + 1]) && (a2.implicit && Boolean(a2.text) === true || a2.hasHyphen() !== true && (a2.post += " "))) : a2.post = " - ";
    });
  });
}, punctuation: function(e3) {
  e3.forEach((e4) => {
    e4.hasHyphen() === true && (e4.post = " "), e4.pre = e4.pre.replace(ka, ""), e4.post = e4.post.replace(ka, ""), e4.post = e4.post.replace(/\.\.\./, ""), /!/.test(e4.post) === true && (e4.post = e4.post.replace(/!/g, ""), e4.post = "!" + e4.post), /\?/.test(e4.post) === true && (e4.post = e4.post.replace(/[\?!]*/, ""), e4.post = "?" + e4.post);
  });
}, unicode: function(e3) {
  e3.forEach((e4) => {
    e4.isImplicit() !== true && (e4.text = wa(e4.text));
  });
}, quotations: function(e3) {
  e3.forEach((e4) => {
    e4.post = e4.post.replace(Aa, ""), e4.pre = e4.pre.replace(Aa, "");
  });
}, adverbs: function(e3) {
  e3.match("#Adverb").not("(not|nary|seldom|never|barely|almost|basically|so)").remove();
}, abbreviations: function(e3) {
  e3.list.forEach((e4) => {
    let t2 = e4.terms();
    t2.forEach((e5, r2) => {
      e5.tags.Abbreviation === true && t2[r2 + 1] && (e5.post = e5.post.replace(/^\./, ""));
    });
  });
}}, $a = {whitespace: true, unicode: true, punctuation: true, emoji: true, acronyms: true, abbreviations: true, case: false, contractions: false, parentheses: false, quotations: false, adverbs: false, possessives: false, verbs: false, nouns: false, honorifics: false}, Pa = {light: {}, medium: {case: true, contractions: true, parentheses: true, quotations: true, adverbs: true}};
Pa.heavy = Object.assign({}, Pa.medium, {possessives: true, verbs: true, nouns: true, honorifics: true}), va.normalize = function(e3) {
  typeof (e3 = e3 || {}) == "string" && (e3 = Pa[e3] || {}), e3 = Object.assign({}, $a, e3), this.uncache();
  let t2 = this.termList();
  return e3.case && this.toLowerCase(), e3.whitespace && Da.whitespace(this), e3.unicode && Da.unicode(t2), e3.punctuation && Da.punctuation(t2), e3.emoji && this.remove("(#Emoji|#Emoticon)"), e3.acronyms && this.acronyms().strip(), e3.abbreviations && Da.abbreviations(this), (e3.contraction || e3.contractions) && this.contractions().expand(), e3.parentheses && this.parentheses().unwrap(), (e3.quotations || e3.quotes) && Da.quotations(t2), e3.adverbs && Da.adverbs(this), (e3.possessive || e3.possessives) && this.possessives().strip(), e3.verbs && this.verbs().toInfinitive(), (e3.nouns || e3.plurals) && this.nouns().toSingular(), e3.honorifics && this.remove("#Honorific"), this;
};
var Ea = {};
!function(e3) {
  const t2 = _e;
  e3.splitOn = function(e4) {
    if (!e4) {
      return this.parent().splitOn(this);
    }
    let r2 = t2(e4), a2 = [];
    return this.list.forEach((e5) => {
      let t3 = e5.match(r2);
      if (t3.length === 0)
        return void a2.push(e5);
      let n2 = e5;
      t3.forEach((e6) => {
        let t4 = n2.splitOn(e6);
        t4.before && a2.push(t4.before), t4.match && a2.push(t4.match), n2 = t4.after;
      }), n2 && a2.push(n2);
    }), this.buildFrom(a2);
  }, e3.splitAfter = function(e4) {
    if (!e4) {
      return this.parent().splitAfter(this);
    }
    let r2 = t2(e4), a2 = [];
    return this.list.forEach((e5) => {
      let t3 = e5.match(r2);
      if (t3.length === 0)
        return void a2.push(e5);
      let n2 = e5;
      t3.forEach((e6) => {
        let t4 = n2.splitOn(e6);
        t4.before && t4.match ? (t4.before.length += t4.match.length, a2.push(t4.before)) : t4.match && a2.push(t4.match), n2 = t4.after;
      }), n2 && a2.push(n2);
    }), this.buildFrom(a2);
  }, e3.split = e3.splitAfter, e3.splitBefore = function(e4) {
    if (!e4) {
      return this.parent().splitBefore(this);
    }
    let r2 = t2(e4), a2 = [];
    return this.list.forEach((e5) => {
      let t3 = e5.match(r2);
      if (t3.length === 0)
        return void a2.push(e5);
      let n2 = e5;
      t3.forEach((e6) => {
        let t4 = n2.splitOn(e6);
        t4.before && a2.push(t4.before), t4.match && t4.after && (t4.match.length += t4.after.length), n2 = t4.match;
      }), n2 && a2.push(n2);
    }), this.buildFrom(a2);
  }, e3.segment = function(e4, t3) {
    e4 = e4 || {}, t3 = t3 || {text: true};
    let r2 = this, a2 = Object.keys(e4);
    return a2.forEach((e5) => {
      r2 = r2.splitOn(e5);
    }), r2.list.forEach((t4) => {
      for (let r3 = 0; r3 < a2.length; r3 += 1)
        if (t4.has(a2[r3]))
          return void (t4.segment = e4[a2[r3]]);
    }), r2.list.map((e5) => {
      let r3 = e5.json(t3);
      return r3.segment = e5.segment || null, r3;
    });
  };
}(Ea);
var Ha = {};
const ja = function(e3, t2) {
  let r2 = e3.world;
  return e3.list.forEach((e4) => {
    e4.terms().forEach((e5) => e5[t2](r2));
  }), e3;
};
Ha.toLowerCase = function() {
  return ja(this, "toLowerCase");
}, Ha.toUpperCase = function() {
  return ja(this, "toUpperCase");
}, Ha.toTitleCase = function() {
  return ja(this, "toTitleCase");
}, Ha.toCamelCase = function() {
  return this.list.forEach((e3) => {
    let t2 = e3.terms();
    t2.forEach((e4, r2) => {
      r2 !== 0 && e4.toTitleCase(), r2 !== t2.length - 1 && (e4.post = "");
    });
  }), this;
};
var Na = {};
!function(e3) {
  e3.pre = function(e4, t2) {
    return e4 === void 0 ? this.list[0].terms(0).pre : (this.list.forEach((r2) => {
      let a2 = r2.terms(0);
      t2 === true ? a2.pre += e4 : a2.pre = e4;
    }), this);
  }, e3.post = function(e4, t2) {
    return e4 === void 0 ? this.list.map((e5) => {
      let t3 = e5.terms();
      return t3[t3.length - 1].post;
    }) : (this.list.forEach((r2) => {
      let a2 = r2.terms(), n2 = a2[a2.length - 1];
      t2 === true ? n2.post += e4 : n2.post = e4;
    }), this);
  }, e3.trim = function() {
    return this.list = this.list.map((e4) => e4.trim()), this;
  }, e3.hyphenate = function() {
    return this.list.forEach((e4) => {
      let t2 = e4.terms();
      t2.forEach((e5, r2) => {
        r2 !== 0 && (e5.pre = ""), t2[r2 + 1] && (e5.post = "-");
      });
    }), this;
  }, e3.dehyphenate = function() {
    const e4 = /(-|–|—)/;
    return this.list.forEach((t2) => {
      t2.terms().forEach((t3) => {
        e4.test(t3.post) && (t3.post = " ");
      });
    }), this;
  }, e3.deHyphenate = e3.dehyphenate, e3.toQuotations = function(e4, t2) {
    return e4 = e4 || '"', t2 = t2 || '"', this.list.forEach((r2) => {
      let a2 = r2.terms();
      a2[0].pre = e4 + a2[0].pre;
      let n2 = a2[a2.length - 1];
      n2.post = t2 + n2.post;
    }), this;
  }, e3.toQuotation = e3.toQuotations, e3.toParentheses = function(e4, t2) {
    return e4 = e4 || "(", t2 = t2 || ")", this.list.forEach((r2) => {
      let a2 = r2.terms();
      a2[0].pre = e4 + a2[0].pre;
      let n2 = a2[a2.length - 1];
      n2.post = t2 + n2.post;
    }), this;
  };
}(Na);
var xa = {join: function(e3) {
  this.uncache();
  let t2 = this.list[0], r2 = t2.length, a2 = {};
  for (let r3 = 1; r3 < this.list.length; r3++) {
    const n3 = this.list[r3];
    a2[n3.start] = true;
    let i2 = t2.lastTerm();
    e3 && (i2.post += e3), i2.next = n3.start, n3.terms(0).prev = i2.id, t2.length += n3.length, t2.cache = {};
  }
  let n2 = t2.length - r2;
  return this.parents().forEach((e4) => {
    e4.list.forEach((e5) => {
      let r3 = e5.terms();
      for (let a3 = 0; a3 < r3.length; a3++)
        if (r3[a3].id === t2.start) {
          e5.length += n2;
          break;
        }
      e5.cache = {};
    }), e4.list = e4.list.filter((e5) => a2[e5.start] !== true);
  }), this.buildFrom([t2]);
}}, Fa = {};
const Ca = /[,\)"';:\-–—\.…]/, Ba = function(e3, t2) {
  if (!e3.found)
    return;
  let r2 = e3.termList();
  for (let e4 = 0; e4 < r2.length - 1; e4++) {
    const t3 = r2[e4];
    if (Ca.test(t3.post))
      return;
  }
  r2.forEach((e4) => {
    e4.implicit = e4.clean;
  }), r2[0].text += t2, r2.slice(1).forEach((e4) => {
    e4.text = "";
  });
  for (let e4 = 0; e4 < r2.length - 1; e4++) {
    const t3 = r2[e4];
    t3.post = t3.post.replace(/ /, "");
  }
};
Fa.contract = function() {
  let e3 = this.not("@hasContraction"), t2 = e3.match("(we|they|you) are");
  return Ba(t2, "'re"), t2 = e3.match("(he|she|they|it|we|you) will"), Ba(t2, "'ll"), t2 = e3.match("(he|she|they|it|we) is"), Ba(t2, "'s"), t2 = e3.match("#Person is"), Ba(t2, "'s"), t2 = e3.match("#Person would"), Ba(t2, "'d"), t2 = e3.match("(is|was|had|would|should|could|do|does|have|has|can) not"), Ba(t2, "n't"), t2 = e3.match("(i|we|they) have"), Ba(t2, "'ve"), t2 = e3.match("(would|should|could) have"), Ba(t2, "'ve"), t2 = e3.match("i am"), Ba(t2, "'m"), t2 = e3.match("going to"), this;
};
var Ga = Object.assign({}, Ur, Qr, Zr, Yr, ta, ra, na, ia, sa, la, ca, da, fa, va, Ea, Ha, Na, xa, Fa);
let za = {};
[["terms", "."], ["hyphenated", "@hasHyphen ."], ["adjectives", "#Adjective"], ["hashTags", "#HashTag"], ["emails", "#Email"], ["emoji", "#Emoji"], ["emoticons", "#Emoticon"], ["atMentions", "#AtMention"], ["urls", "#Url"], ["adverbs", "#Adverb"], ["pronouns", "#Pronoun"], ["conjunctions", "#Conjunction"], ["prepositions", "#Preposition"]].forEach((e3) => {
  za[e3[0]] = function(t2) {
    let r2 = this.match(e3[1]);
    return typeof t2 == "number" && (r2 = r2.get(t2)), r2;
  };
}), za.emojis = za.emoji, za.atmentions = za.atMentions, za.words = za.terms, za.phoneNumbers = function(e3) {
  let t2 = this.splitAfter("@hasComma");
  return t2 = t2.match("#PhoneNumber+"), typeof e3 == "number" && (t2 = t2.get(e3)), t2;
}, za.money = function(e3) {
  let t2 = this.match("#Money #Currency?");
  return typeof e3 == "number" && (t2 = t2.get(e3)), t2;
}, za.places = function(e3) {
  let t2 = this.match("(#City && @hasComma) (#Region|#Country)"), r2 = this.not(t2).splitAfter("@hasComma");
  return r2 = r2.concat(t2), r2.sort("index"), r2 = r2.match("#Place+"), typeof e3 == "number" && (r2 = r2.get(e3)), r2;
}, za.organizations = function(e3) {
  let t2 = this.clauses();
  return t2 = t2.match("#Organization+"), typeof e3 == "number" && (t2 = t2.get(e3)), t2;
}, za.entities = function(e3) {
  let t2 = this.clauses(), r2 = t2.people();
  r2 = r2.concat(t2.places()), r2 = r2.concat(t2.organizations());
  return r2 = r2.not(["someone", "man", "woman", "mother", "brother", "sister", "father"]), r2.sort("sequence"), typeof e3 == "number" && (r2 = r2.get(e3)), r2;
}, za.things = za.entities, za.topics = za.entities;
var Ia = za;
const Oa = /^(under|over)-?.{3}/, Ta = function(e3, t2, r2) {
  let a2 = r2.words, n2 = e3[t2].reduced + " " + e3[t2 + 1].reduced;
  return a2[n2] !== void 0 && a2.hasOwnProperty(n2) === true ? (e3[t2].tag(a2[n2], "lexicon-two", r2), e3[t2 + 1].tag(a2[n2], "lexicon-two", r2), 1) : t2 + 2 < e3.length && (n2 += " " + e3[t2 + 2].reduced, a2[n2] !== void 0 && a2.hasOwnProperty(n2) === true) ? (e3[t2].tag(a2[n2], "lexicon-three", r2), e3[t2 + 1].tag(a2[n2], "lexicon-three", r2), e3[t2 + 2].tag(a2[n2], "lexicon-three", r2), 2) : t2 + 3 < e3.length && (n2 += " " + e3[t2 + 3].reduced, a2[n2] !== void 0 && a2.hasOwnProperty(n2) === true) ? (e3[t2].tag(a2[n2], "lexicon-four", r2), e3[t2 + 1].tag(a2[n2], "lexicon-four", r2), e3[t2 + 2].tag(a2[n2], "lexicon-four", r2), e3[t2 + 3].tag(a2[n2], "lexicon-four", r2), 3) : 0;
};
var Va = function(e3, t2) {
  let r2 = t2.words, a2 = t2.hasCompound;
  for (let n2 = 0; n2 < e3.length; n2 += 1) {
    let i2 = e3[n2].clean;
    if (a2[i2] === true && n2 + 1 < e3.length) {
      let r3 = Ta(e3, n2, t2);
      if (r3 > 0) {
        n2 += r3;
        continue;
      }
    }
    if (r2[i2] === void 0 || r2.hasOwnProperty(i2) !== true)
      if (i2 === e3[n2].reduced || r2.hasOwnProperty(e3[n2].reduced) !== true) {
        if (Oa.test(i2) === true) {
          let a3 = i2.replace(/^(under|over)-?/, "");
          r2.hasOwnProperty(a3) === true && e3[n2].tag(r2[a3], "noprefix-lexicon", t2);
        }
      } else
        e3[n2].tag(r2[e3[n2].reduced], "lexicon", t2);
    else
      e3[n2].tag(r2[i2], "lexicon", t2);
  }
  return e3;
};
const Ma = /[\'‘’‛‵′`´]$/, Ja = /^(m|k|cm|km|m)\/(s|h|hr)$/;
const La = [[/^[\w\.]+@[\w\.]+\.[a-z]{2,3}$/, "Email"], [/^#[a-z0-9_\u00C0-\u00FF]{2,}$/, "HashTag"], [/^@1?[0-9](am|pm)$/i, "Time"], [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, "Time"], [/^@\w{2,}$/, "AtMention"], [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, "Url"], [/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/, "Url"], [/^'[0-9]{2}$/, "Year"], [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, "Time"], [/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i, "Time"], [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i, "Time"], [/^[PMCE]ST$/, "Time"], [/^utc ?[+-]?[0-9]+?$/, "Time"], [/^[a-z0-9]*? o\'?clock$/, "Time"], [/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i, "Date"], [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, "Date"], [/^[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}$/, "Date"], [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, "Date"], [/^gmt[+-][0-9][0-9]?$/i, "Timezone"], [/^utc[+-][0-9][0-9]?$/i, "Timezone"], [/^ma?c\'.*/, "LastName"], [/^o\'[drlkn].*/, "LastName"], [/^ma?cd[aeiou]/, "LastName"], [/^(lol)+[sz]$/, "Expression"], [/^woo+a*?h?$/, "Expression"], [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, "Verb"], [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, "Date"], [/^[0-9]{3}-[0-9]{4}$/, "PhoneNumber"], [/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/, "PhoneNumber"], [/^[-+]?[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6][-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(k|m|b|bn)?\+?$/, ["Money", "Value"]], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]\+?$/, ["Money", "Value"]], [/^[-+]?[\$£]?[0-9]([0-9,.])+?(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i, ["Money", "Value"]], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/, ["Cardinal", "NumericValue"]], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/, ["Ordinal", "NumericValue"]], [/^\.[0-9]+\+?$/, ["Cardinal", "NumericValue"]], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/, ["Percent", "Cardinal", "NumericValue"]], [/^\.[0-9]+%$/, ["Percent", "Cardinal", "NumericValue"]], [/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/, ["Fraction", "NumericValue"]], [/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/, ["Value", "NumberRange"]], [/^[0-9][0-9]?(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9][0-9]?(:[0-9][0-9])?(am|pm)?$/, ["Time", "NumberRange"]], [/^[0-9.]+([a-z]{1,4})$/, "Value"]], Sa = /^[IVXLCDM]{2,}$/, _a = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const Ka = "Adjective", qa = "Infinitive", Wa = "PresentTense", Ra = "Singular", Ua = "PastTense", Qa = "Expression";
const Za = "Adjective", Xa = "Infinitive", Ya = "PresentTense", en = "Singular", tn = "PastTense", rn = "Adverb", an = "Plural", nn = "Verb", on = "LastName";
const sn = {a: [[/.[aeiou]na$/, "Noun"], [/.[oau][wvl]ska$/, "LastName"], [/.[^aeiou]ica$/, Ra], [/^([hyj]a)+$/, Qa]], c: [[/.[^aeiou]ic$/, Ka]], d: [[/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, Ua], [/.[aeo]{2}[bdgmnprvz]ed$/, Ua], [/.[aeiou][sg]hed$/, Ua], [/.[aeiou]red$/, Ua], [/.[aeiou]r?ried$/, Ua], [/.[bcdgtr]led$/, Ua], [/.[aoui]f?led$/, Ua], [/.[iao]sed$/, Ua], [/[aeiou]n?[cs]ed$/, Ua], [/[aeiou][rl]?[mnf]ed$/, Ua], [/[aeiou][ns]?c?ked$/, Ua], [/[aeiou][nl]?ged$/, Ua], [/.[tdbwxz]ed$/, Ua], [/[^aeiou][aeiou][tvx]ed$/, Ua], [/.[cdlmnprstv]ied$/, Ua], [/[^aeiou]ard$/, Ra], [/[aeiou][^aeiou]id$/, Ka], [/.[vrl]id$/, Ka]], e: [[/.[lnr]ize$/, qa], [/.[^aeiou]ise$/, qa], [/.[aeiou]te$/, qa], [/.[^aeiou][ai]ble$/, Ka], [/.[^aeiou]eable$/, Ka], [/.[ts]ive$/, Ka], [/[a-z]-like$/, Ka]], h: [[/.[^aeiouf]ish$/, Ka], [/.v[iy]ch$/, "LastName"], [/^ug?h+$/, Qa], [/^uh[ -]?oh$/, Qa], [/[a-z]-ish$/, Ka]], i: [[/.[oau][wvl]ski$/, "LastName"]], k: [[/^(k){2}$/, Qa]], l: [[/.[gl]ial$/, Ka], [/.[^aeiou]ful$/, Ka], [/.[nrtumcd]al$/, Ka], [/.[^aeiou][ei]al$/, Ka]], m: [[/.[^aeiou]ium$/, Ra], [/[^aeiou]ism$/, Ra], [/^h*u*m+$/, Qa], [/^\d+ ?[ap]m$/, "Date"]], n: [[/.[lsrnpb]ian$/, Ka], [/[^aeiou]ician$/, "Actor"], [/[aeiou][ktrp]in$/, "Gerund"]], o: [[/^no+$/, Qa], [/^(yo)+$/, Qa], [/^woo+[pt]?$/, Qa]], r: [[/.[bdfklmst]ler$/, "Noun"], [/[aeiou][pns]er$/, Ra], [/[^i]fer$/, qa], [/.[^aeiou][ao]pher$/, "Actor"], [/.[lk]er$/, "Noun"], [/.ier$/, "Comparative"]], t: [[/.[di]est$/, "Superlative"], [/.[icldtgrv]ent$/, Ka], [/[aeiou].*ist$/, Ka], [/^[a-z]et$/, "Verb"]], s: [[/.[^aeiou]ises$/, Wa], [/.[rln]ates$/, Wa], [/.[^z]ens$/, "Verb"], [/.[lstrn]us$/, Ra], [/.[aeiou]sks$/, Wa], [/.[aeiou]kes$/, Wa], [/[aeiou][^aeiou]is$/, Ra], [/[a-z]\'s$/, "Noun"], [/^yes+$/, Qa]], v: [[/.[^aeiou][ai][kln]ov$/, "LastName"]], y: [[/.[cts]hy$/, Ka], [/.[st]ty$/, Ka], [/.[gk]y$/, Ka], [/.[tnl]ary$/, Ka], [/.[oe]ry$/, Ra], [/[rdntkbhs]ly$/, "Adverb"], [/...lly$/, "Adverb"], [/[bszmp]{2}y$/, Ka], [/.(gg|bb|zz)ly$/, Ka], [/.[ai]my$/, Ka], [/[ea]{2}zy$/, Ka], [/.[^aeiou]ity$/, Ra]]}, ln = [null, null, {ea: en, ia: "Noun", ic: Za, ly: rn, "'n": nn, "'t": nn}, {oed: tn, ued: tn, xed: tn, " so": rn, "'ll": "Modal", "'re": "Copula", azy: Za, eer: "Noun", end: nn, ped: tn, ffy: Za, ify: Xa, ing: "Gerund", ize: Xa, lar: Za, mum: Za, nes: Ya, nny: Za, oid: Za, ous: Za, que: Za, rol: en, sis: en, zes: Ya}, {amed: tn, aped: tn, ched: tn, lked: tn, nded: tn, cted: tn, dged: tn, akis: on, cede: Xa, chuk: on, czyk: on, ects: Ya, ends: nn, enko: on, ette: en, fies: Ya, fore: rn, gate: Xa, gone: Za, ices: an, ints: an, ines: an, ions: an, less: rn, llen: Za, made: Za, nsen: on, oses: Ya, ould: "Modal", some: Za, sson: on, tage: Xa, teen: "Value", tion: en, tive: Za, tors: "Noun", vice: en}, {tized: tn, urned: tn, eased: tn, ances: an, bound: Za, ettes: an, fully: rn, ishes: Ya, ities: an, marek: on, nssen: on, ology: "Noun", ports: an, rough: Za, tches: Ya, tieth: "Ordinal", tures: an, wards: rn, where: rn}, {auskas: on, keeper: "Actor", logist: "Actor", teenth: "Value"}, {opoulos: on, borough: "Place", sdottir: on}];
const un = /^(\u00a9|\u00ae|[\u2319-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/, cn = {":(": true, ":)": true, ":P": true, ":p": true, ":O": true, ":3": true, ":|": true, ":/": true, ":\\": true, ":$": true, ":*": true, ":@": true, ":-(": true, ":-)": true, ":-P": true, ":-p": true, ":-O": true, ":-3": true, ":-|": true, ":-/": true, ":-\\": true, ":-$": true, ":-*": true, ":-@": true, ":^(": true, ":^)": true, ":^P": true, ":^p": true, ":^O": true, ":^3": true, ":^|": true, ":^/": true, ":^\\": true, ":^$": true, ":^*": true, ":^@": true, "):": true, "(:": true, "$:": true, "*:": true, ")-:": true, "(-:": true, "$-:": true, "*-:": true, ")^:": true, "(^:": true, "$^:": true, "*^:": true, "<3": true, "</3": true, "<\\3": true};
const hn = {lexicon: Va, punctuation: function(e3, t2, r2) {
  let a2 = e3[t2];
  if (Ma.test(a2.text) && !Ma.test(a2.pre) && !Ma.test(a2.post) && a2.clean.length > 2) {
    let e4 = a2.clean[a2.clean.length - 2];
    if (e4 === "s")
      return void a2.tag(["Possessive", "Noun"], "end-tick", r2);
    e4 === "n" && a2.tag(["Gerund"], "chillin", r2);
  }
  Ja.test(a2.text) && a2.tag("Unit", "per-sec", r2);
}, regex: function(e3, t2) {
  let r2 = e3.text;
  for (let a2 = 0; a2 < La.length; a2 += 1)
    if (La[a2][0].test(r2) === true) {
      e3.tagSafe(La[a2][1], "prefix #" + a2, t2);
      break;
    }
  e3.text.length >= 2 && Sa.test(r2) && _a.test(r2) && e3.tag("RomanNumeral", "xvii", t2);
}, suffix: function(e3, t2) {
  !function(e4, t3) {
    const r2 = e4.clean.length;
    let a2 = 7;
    r2 <= a2 && (a2 = r2 - 1);
    for (let n2 = a2; n2 > 1; n2 -= 1) {
      let a3 = e4.clean.substr(r2 - n2, r2);
      if (ln[a3.length].hasOwnProperty(a3) === true) {
        let r3 = ln[a3.length][a3];
        e4.tagSafe(r3, "suffix -" + a3, t3);
        break;
      }
    }
  }(e3, t2), function(e4, t3) {
    let r2 = e4.clean, a2 = r2[r2.length - 1];
    if (sn.hasOwnProperty(a2) === true) {
      let n2 = sn[a2];
      for (let i2 = 0; i2 < n2.length; i2 += 1)
        if (n2[i2][0].test(r2) === true) {
          e4.tagSafe(n2[i2][1], `endReg ${a2} #${i2}`, t3);
          break;
        }
    }
  }(e3, t2);
}, emoji: (e3, t2) => {
  let r2 = e3.pre + e3.text + e3.post;
  var a2;
  r2 = r2.trim(), r2 = r2.replace(/[.!?,]$/, ""), ((e4) => !(e4.charAt(0) !== ":" || e4.match(/:.?$/) === null || e4.match(" ") || e4.length > 35))(r2) === true && (e3.tag("Emoji", "comma-emoji", t2), e3.text = r2, e3.pre = e3.pre.replace(":", ""), e3.post = e3.post.replace(":", "")), e3.text.match(un) && (e3.tag("Emoji", "unicode-emoji", t2), e3.text = r2), (a2 = (a2 = r2).replace(/^[:;]/, ":"), cn.hasOwnProperty(a2)) === true && (e3.tag("Emoticon", "emoticon-emoji", t2), e3.text = r2);
}};
var dn = function(e3, t2) {
  let r2 = e3.world;
  hn.lexicon(t2, r2);
  for (let e4 = 0; e4 < t2.length; e4 += 1) {
    let a2 = t2[e4];
    hn.punctuation(t2, e4, r2), hn.regex(a2, r2), hn.suffix(a2, r2), hn.emoji(a2, r2);
  }
  return e3;
};
const gn = {beforeThisWord: {there: "Verb", me: "Verb", man: "Adjective", only: "Verb", him: "Verb", were: "Noun", took: "Noun", himself: "Verb", went: "Noun", who: "Noun", jr: "Person"}, afterThisWord: {i: "Verb", first: "Noun", it: "Verb", there: "Verb", not: "Verb", because: "Noun", if: "Noun", but: "Noun", who: "Verb", this: "Noun", his: "Noun", when: "Noun", you: "Verb", very: "Adjective", old: "Noun", never: "Verb", before: "Noun"}, beforeThisPos: {Copula: "Noun", PastTense: "Noun", Conjunction: "Noun", Modal: "Noun", Pluperfect: "Noun", PerfectTense: "Verb"}, afterThisPos: {Adjective: "Noun", Possessive: "Noun", Determiner: "Noun", Adverb: "Verb", Pronoun: "Verb", Value: "Noun", Ordinal: "Noun", Modal: "Verb", Superlative: "Noun", Demonym: "Noun", Honorific: "Person"}}, pn = Object.keys(gn.afterThisPos), mn = Object.keys(gn.beforeThisPos);
var fn = function(e3, t2) {
  for (let r2 = 0; r2 < e3.length; r2 += 1) {
    let a2 = e3[r2];
    if (a2.isKnown() === true)
      continue;
    let n2 = e3[r2 - 1];
    if (n2) {
      if (gn.afterThisWord.hasOwnProperty(n2.clean) === true) {
        let e5 = gn.afterThisWord[n2.clean];
        a2.tag(e5, "after-" + n2.clean, t2);
        continue;
      }
      let e4 = pn.find((e5) => n2.tags[e5]);
      if (e4 !== void 0) {
        let r3 = gn.afterThisPos[e4];
        a2.tag(r3, "after-" + e4, t2);
        continue;
      }
    }
    let i2 = e3[r2 + 1];
    if (i2) {
      if (gn.beforeThisWord.hasOwnProperty(i2.clean) === true) {
        let e5 = gn.beforeThisWord[i2.clean];
        a2.tag(e5, "before-" + i2.clean, t2);
        continue;
      }
      let e4 = mn.find((e5) => i2.tags[e5]);
      if (e4 !== void 0) {
        let r3 = gn.beforeThisPos[e4];
        a2.tag(r3, "before-" + e4, t2);
        continue;
      }
    }
  }
};
const bn = /^[A-Z][a-z'\u00C0-\u00FF]/, yn = /[0-9]/;
var vn = function(e3) {
  let t2 = e3.world;
  e3.list.forEach((e4) => {
    let r2 = e4.terms();
    for (let e5 = 1; e5 < r2.length; e5++) {
      const a2 = r2[e5];
      bn.test(a2.text) === true && yn.test(a2.text) === false && a2.tags.Date === void 0 && a2.tag("ProperNoun", "titlecase-noun", t2);
    }
  });
};
const wn = /^(re|un)-?[a-z\u00C0-\u00FF]/, kn = /^(re|un)-?/;
var An = function(e3, t2) {
  let r2 = t2.words;
  e3.forEach((e4) => {
    if (e4.isKnown() !== true && wn.test(e4.clean) === true) {
      let a2 = e4.clean.replace(kn, "");
      a2 && a2.length > 3 && r2[a2] !== void 0 && r2.hasOwnProperty(a2) === true && e4.tag(r2[a2], "stem-" + a2, t2);
    }
  });
};
const Dn = ["Uncountable", "Pronoun", "Place", "Value", "Person", "Month", "WeekDay", "Holiday"], $n = {isSingular: [/(ax|test)is$/i, /(octop|vir|radi|nucle|fung|cact|stimul)us$/i, /(octop|vir)i$/i, /(rl)f$/i, /(alias|status)$/i, /(bu)s$/i, /(al|ad|at|er|et|ed|ad)o$/i, /(ti)um$/i, /(ti)a$/i, /sis$/i, /(?:(^f)fe|(lr)f)$/i, /hive$/i, /s[aeiou]+ns$/i, /(^aeiouy|qu)y$/i, /(x|ch|ss|sh|z)$/i, /(matr|vert|ind|cort)(ix|ex)$/i, /(m|l)ouse$/i, /(m|l)ice$/i, /(antenn|formul|nebul|vertebr|vit)a$/i, /.sis$/i, /^(?!talis|.*hu)(.*)man$/i], isPlural: [/(^v)ies$/i, /ises$/i, /ives$/i, /(antenn|formul|nebul|vertebr|vit)ae$/i, /(octop|vir|radi|nucle|fung|cact|stimul)i$/i, /(buffal|tomat|tornad)oes$/i, /(analy|ba|diagno|parenthe|progno|synop|the)ses$/i, /(vert|ind|cort)ices$/i, /(matr|append)ices$/i, /(x|ch|ss|sh|s|z|o)es$/i, /is$/i, /men$/i, /news$/i, /.tia$/i, /(^f)ves$/i, /(lr)ves$/i, /(^aeiouy|qu)ies$/i, /(m|l)ice$/i, /(cris|ax|test)es$/i, /(alias|status)es$/i, /ics$/i]}, Pn = [/ss$/, /sis$/, /[^aeiou][uo]s$/, /'s$/], En = [/i$/, /ae$/];
var Hn = function(e3, t2) {
  if (e3.tags.Noun && !e3.tags.Acronym) {
    let r2 = e3.clean;
    if (e3.tags.Singular || e3.tags.Plural)
      return;
    if (r2.length <= 3)
      return void e3.tag("Singular", "short-singular", t2);
    if (Dn.find((t3) => e3.tags[t3]))
      return;
    if ($n.isPlural.find((e4) => e4.test(r2)))
      return void e3.tag("Plural", "plural-rules", t2);
    if ($n.isSingular.find((e4) => e4.test(r2)))
      return void e3.tag("Singular", "singular-rules", t2);
    if (/s$/.test(r2) === true) {
      if (Pn.find((e4) => e4.test(r2)))
        return;
      return void e3.tag("Plural", "plural-fallback", t2);
    }
    if (En.find((e4) => e4.test(r2)))
      return;
    e3.tag("Singular", "singular-fallback", t2);
  }
};
let jn = ["academy", "administration", "agence", "agences", "agencies", "agency", "airlines", "airways", "army", "assoc", "associates", "association", "assurance", "authority", "autorite", "aviation", "bank", "banque", "board", "boys", "brands", "brewery", "brotherhood", "brothers", "building society", "bureau", "cafe", "caisse", "capital", "care", "cathedral", "center", "central bank", "centre", "chemicals", "choir", "chronicle", "church", "circus", "clinic", "clinique", "club", "co", "coalition", "coffee", "collective", "college", "commission", "committee", "communications", "community", "company", "comprehensive", "computers", "confederation", "conference", "conseil", "consulting", "containers", "corporation", "corps", "corp", "council", "crew", "daily news", "data", "departement", "department", "department store", "departments", "design", "development", "directorate", "division", "drilling", "education", "eglise", "electric", "electricity", "energy", "ensemble", "enterprise", "enterprises", "entertainment", "estate", "etat", "evening news", "faculty", "federation", "financial", "fm", "foundation", "fund", "gas", "gazette", "girls", "government", "group", "guild", "health authority", "herald", "holdings", "hospital", "hotel", "hotels", "inc", "industries", "institut", "institute", "institute of technology", "institutes", "insurance", "international", "interstate", "investment", "investments", "investors", "journal", "laboratory", "labs", "liberation army", "limited", "local authority", "local health authority", "machines", "magazine", "management", "marine", "marketing", "markets", "media", "memorial", "mercantile exchange", "ministere", "ministry", "military", "mobile", "motor", "motors", "musee", "museum", "news", "news service", "observatory", "office", "oil", "optical", "orchestra", "organization", "partners", "partnership", "people's party", "petrol", "petroleum", "pharmacare", "pharmaceutical", "pharmaceuticals", "pizza", "plc", "police", "polytechnic", "post", "power", "press", "productions", "quartet", "radio", "regional authority", "regional health authority", "reserve", "resources", "restaurant", "restaurants", "savings", "school", "securities", "service", "services", "social club", "societe", "society", "sons", "standard", "state police", "state university", "stock exchange", "subcommittee", "syndicat", "systems", "telecommunications", "telegraph", "television", "times", "tribunal", "tv", "union", "university", "utilities", "workers"].reduce(function(e3, t2) {
  return e3[t2] = "Noun", e3;
}, {});
const Nn = function(e3) {
  return !!e3.tags.Noun && (!(e3.tags.Pronoun || e3.tags.Comma || e3.tags.Possessive) && !!(e3.tags.Organization || e3.tags.Acronym || e3.tags.Place || e3.titleCase()));
};
const xn = /^[A-Z]('s|,)?$/, Fn = /([A-Z]\.){2}[A-Z]?/i, Cn = {I: true, A: true};
const Bn = {neighbours: fn, case: vn, stem: An, plural: Hn, organizations: function(e3, t2) {
  for (let r2 = 0; r2 < e3.length; r2 += 1) {
    let a2 = e3[r2];
    if (jn[a2.clean] !== void 0 && jn.hasOwnProperty(a2.clean) === true) {
      let n2 = e3[r2 - 1];
      if (n2 !== void 0 && Nn(n2) === true) {
        n2.tagSafe("Organization", "org-word-1", t2), a2.tagSafe("Organization", "org-word-2", t2);
        continue;
      }
      let i2 = e3[r2 + 1];
      if (i2 !== void 0 && i2.clean === "of" && e3[r2 + 2] && Nn(e3[r2 + 2])) {
        a2.tagSafe("Organization", "org-of-word-1", t2), i2.tagSafe("Organization", "org-of-word-2", t2), e3[r2 + 2].tagSafe("Organization", "org-of-word-3", t2);
        continue;
      }
    }
  }
}, acronyms: function(e3, t2) {
  e3.forEach((e4) => {
    e4.tags.RomanNumeral !== true && (Fn.test(e4.text) === true && e4.tag("Acronym", "period-acronym", t2), e4.isUpperCase() && function(e5, t3) {
      let r2 = e5.reduced;
      return !!e5.tags.Acronym || !t3.words[r2] && !(r2.length > 5) && e5.isAcronym();
    }(e4, t2) ? (e4.tag("Acronym", "acronym-step", t2), e4.tag("Noun", "acronym-infer", t2)) : !Cn.hasOwnProperty(e4.text) && xn.test(e4.text) && (e4.tag("Acronym", "one-letter-acronym", t2), e4.tag("Noun", "one-letter-infer", t2)), e4.tags.Organization && e4.text.length <= 3 && e4.tag("Acronym", "acronym-org", t2), e4.tags.Organization && e4.isUpperCase() && e4.text.length <= 6 && e4.tag("Acronym", "acronym-org-case", t2));
  });
}};
var Gn = function(e3, t2) {
  let r2 = e3.world;
  return Bn.neighbours(t2, r2), Bn.case(e3), Bn.stem(t2, r2), t2.forEach((t3) => {
    t3.isKnown() === false && t3.tag("Noun", "noun-fallback", e3.world);
  }), Bn.organizations(t2, r2), Bn.acronyms(t2, r2), t2.forEach((t3) => {
    Bn.plural(t3, e3.world);
  }), e3;
};
const zn = /n't$/, In = {"won't": ["will", "not"], wont: ["will", "not"], "can't": ["can", "not"], cant: ["can", "not"], cannot: ["can", "not"], "shan't": ["should", "not"], dont: ["do", "not"], dun: ["do", "not"]};
const On = /([a-z\u00C0-\u00FF]+)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]([a-z]{1,2})$/i, Tn = {ll: "will", ve: "have", re: "are", m: "am", "n't": "not"};
const Vn = {wanna: ["want", "to"], gonna: ["going", "to"], im: ["i", "am"], alot: ["a", "lot"], ive: ["i", "have"], imma: ["I", "will"], "where'd": ["where", "did"], whered: ["where", "did"], "when'd": ["when", "did"], whend: ["when", "did"], howd: ["how", "did"], whatd: ["what", "did"], dunno: ["do", "not", "know"], brb: ["be", "right", "back"], gtg: ["got", "to", "go"], irl: ["in", "real", "life"], tbh: ["to", "be", "honest"], imo: ["in", "my", "opinion"], til: ["today", "i", "learned"], rn: ["right", "now"], twas: ["it", "was"], "@": ["at"]};
const Mn = /([a-z\u00C0-\u00FF]+)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]s$/i, Jn = {that: true, there: true}, Ln = {here: true, there: true, everywhere: true};
const Sn = /[a-z\u00C0-\u00FF]'d$/, _n = {how: true, what: true};
const Kn = /^([0-9.]{1,3}[a-z]{0,2}) ?[-–—] ?([0-9]{1,3}[a-z]{0,2})$/i, qn = /^([0-9][0-9]?(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9][0-9]?(:[0-9][0-9])?(am|pm)?)$/i;
const Wn = /^(l|c|d|j|m|n|qu|s|t)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]([a-z\u00C0-\u00FF]+)$/i, Rn = {l: "le", c: "ce", d: "de", j: "je", m: "me", n: "ne", qu: "que", s: "se", t: "tu"};
const Un = Va, Qn = xt, Zn = function(e3, t2) {
  if (In.hasOwnProperty(e3.clean) === true)
    return In[e3.clean];
  if (e3.clean === "ain't" || e3.clean === "aint")
    return function(e4, t3) {
      let r2 = t3.terms(), a2 = r2.indexOf(e4), n2 = r2.slice(0, a2).find((e5) => e5.tags.Noun);
      return n2 && n2.tags.Plural ? ["are", "not"] : ["is", "not"];
    }(e3, t2);
  if (zn.test(e3.clean) === true) {
    return [e3.clean.replace(zn, ""), "not"];
  }
  return null;
}, Xn = function(e3) {
  let t2 = e3.text.match(On);
  return t2 === null ? null : Tn.hasOwnProperty(t2[2]) ? [t2[1], Tn[t2[2]]] : null;
}, Yn = function(e3) {
  return Vn.hasOwnProperty(e3.clean) ? Vn[e3.clean] : null;
}, ei = function(e3, t2, r2) {
  let a2 = e3.text.match(Mn);
  if (a2 !== null) {
    if (((e4, t3) => {
      if (e4.tags.Possessive)
        return true;
      if (e4.tags.Pronoun || e4.tags.QuestionWord)
        return false;
      if (Jn.hasOwnProperty(e4.reduced))
        return false;
      let r3 = t3.get(e4.next);
      if (!r3)
        return true;
      if (r3.tags.Verb)
        return !!r3.tags.Infinitive || !!r3.tags.PresentTense;
      if (r3.tags.Noun)
        return Ln.hasOwnProperty(r3.reduced) !== true;
      let a3 = t3.get(r3.next);
      return !(!a3 || !a3.tags.Noun || a3.tags.Pronoun) || (r3.tags.Adjective || r3.tags.Adverb || r3.tags.Verb, false);
    })(e3, t2.pool) === true)
      return e3.tag("#Possessive", "isPossessive", r2), null;
    if (a2 !== null)
      return ((e4, t3) => {
        let r3 = t3.terms(), a3 = r3.indexOf(e4);
        return r3.slice(a3 + 1, a3 + 3).find((e5) => e5.tags.PastTense);
      })(e3, t2) ? [a2[1], "has"] : [a2[1], "is"];
  }
  return null;
}, ti = function(e3, t2) {
  if (Sn.test(e3.clean)) {
    let r2 = e3.clean.replace(/'d$/, ""), a2 = t2.terms(), n2 = a2.indexOf(e3), i2 = a2.slice(n2 + 1, n2 + 4);
    for (let e4 = 0; e4 < i2.length; e4++) {
      let t3 = i2[e4];
      if (t3.tags.Verb)
        return t3.tags.PastTense ? [r2, "had"] : _n[r2] === true ? [r2, "did"] : [r2, "would"];
    }
    return [r2, "would"];
  }
  return null;
}, ri = function(e3) {
  if (e3.tags.PhoneNumber === true)
    return null;
  let t2 = e3.text.match(Kn);
  return t2 !== null ? [t2[1], "to", t2[2]] : (t2 = e3.text.match(qn), t2 !== null ? [t2[1], "to", t2[4]] : null);
}, ai = function(e3) {
  let t2 = e3.text.match(Wn);
  if (t2 === null || Rn.hasOwnProperty(t2[1]) === false)
    return null;
  let r2 = [Rn[t2[1]], t2[2]];
  return r2[0] && r2[1] ? r2 : null;
}, ni = /^[0-9]+$/, ii = /^[0-9]+(st|nd|rd|th)$/, oi = /^[0-9:]+(am|pm)?$/, si = function(e3, t2) {
  let r2 = Qn(e3.join(" "), t2.world, t2.pool())[0], a2 = r2.terms();
  Un(a2, t2.world);
  let n2 = a2[0];
  return ii.test(n2.text) && a2[2] ? (a2[0].tag("Ordinal", "ord-range", t2.world), a2[2].tag("Ordinal", "ord-range", t2.world)) : ni.test(n2.text) && a2[2] ? (a2[0].tag("Cardinal", "num-range", t2.world), a2[2].tag("Cardinal", "num-range", t2.world)) : oi.test(n2.text) && a2[1] && a2[2] && (a2[0].tag("Time", "time-range", t2.world), a2[1].tag("Date", "time-range", t2.world), a2[2].tag("Time", "time-range", t2.world)), a2.forEach((e4) => {
    e4.implicit = e4.text, e4.text = "", e4.clean = "", e4.pre = "", e4.post = "", Object.keys(e4.tags).length === 0 && (e4.tags.Noun = true);
  }), r2;
};
var li = function(e3) {
  let t2 = e3.world;
  return e3.list.forEach((r2) => {
    let a2 = r2.terms();
    for (let n2 = 0; n2 < a2.length; n2 += 1) {
      let i2 = a2[n2], o2 = Zn(i2, r2);
      if (o2 = o2 || Xn(i2), o2 = o2 || Yn(i2), o2 = o2 || ei(i2, r2, t2), o2 = o2 || ti(i2, r2), o2 = o2 || ri(i2), o2 = o2 || ai(i2), o2 !== null) {
        let t3 = si(o2, e3);
        r2.has("#NumberRange") === true && e3.buildFrom([t3]).tag("NumberRange"), t3.terms(0).text = i2.text, r2.buildFrom(i2.id, 1, e3.pool()).replace(t3, e3, true);
      }
    }
  }), e3;
};
const ui = function(e3, t2) {
  let r2 = e3._cache.tags[t2] || [];
  return r2 = r2.map((t3) => e3.list[t3]), e3.buildFrom(r2);
};
var ci = function(e3) {
  let t2 = ui(e3, "Infinitive");
  return t2.found && (t2 = t2.ifNo("@hasQuestionMark"), t2 = t2.ifNo("(i|we|they)"), t2.not("will be").match("[#Infinitive] (#Determiner|#Possessive) #Noun").notIf("(our|their)").match("#Infinitive").tag("Imperative", "shut-the"), t2.match("^[#Infinitive] #Adverb?$", 0).tag("Imperative", "go-fast"), t2.match("[(do && #Infinitive)] not? #Verb", 0).tag("Imperative", "do-not"), t2.match("[#Infinitive] (it|some) (#Comparative|#Preposition|please|now|again)", 0).tag("Imperative", "do-it")), t2 = function(e4, t3) {
    let r2 = e4._cache.words[t3] || [];
    return r2 = r2.map((t4) => e4.list[t4]), e4.buildFrom(r2);
  }(e3, "like"), t2.match("#Adverb like").notIf("(really|generally|typically|usually|sometimes|often|just) [like]").tag("Adverb", "adverb-like"), t2 = ui(e3, "Adjective"), t2.match("#Determiner #Adjective$").notIf("(#Comparative|#Superlative)").terms(1).tag("Noun", "the-adj-1"), t2 = ui(e3, "FirstName"), t2.match("#FirstName (#Noun|@titleCase)").ifNo("^#Possessive").ifNo("(#Pronoun|#Plural)").ifNo("@hasComma .").lastTerm().tag("#LastName", "firstname-noun"), t2 = ui(e3, "Value"), t2 = t2.match("#Value #PresentTense").ifNo("#Copula"), t2.found && (t2.has("(one|1)") === true ? t2.terms(1).tag("Singular", "one-presentTense") : t2.terms(1).tag("Plural", "value-presentTense")), e3.match("^(well|so|okay)").tag("Expression", "well-"), e3.match("#Value [of a second]", 0).unTag("Value", "of-a-second"), e3.match("#Value [seconds]", 0).unTag("Value", "30-seconds").tag(["Unit", "Plural"]), t2 = ui(e3, "Gerund"), t2.match("(be|been) (#Adverb|not)+? #Gerund").not("#Verb$").tag("Auxiliary", "be-walking"), e3.match("(try|use|attempt|build|make) #Verb").ifNo("(@hasComma|#Negative|#PhrasalVerb|#Copula|will|be)").lastTerm().tag("#Noun", "do-verb"), t2 = ui(e3, "Possessive"), t2 = t2.match("#Possessive [#Infinitive]", 0), t2.lookBehind("(let|made|make|force|ask)").found || t2.tag("Noun", "her-match"), e3;
};
var hi = function(e3) {
  let t2 = {};
  for (let r2 = 0; r2 < e3.length; r2++)
    t2[e3[r2]] = true;
  return Object.keys(t2);
};
var di = [{match: "too much", tag: "Adverb Adjective", reason: "bit-4"}, {match: "u r", tag: "Pronoun Copula", reason: "u r"}, {match: "#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)", tag: "#Copula #Adverb #Adjective", reason: "sometimes-adverb"}, {match: "(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense", group: 0, tag: "Modal", reason: "i-better"}, {match: "[#Gerund] #Adverb? not? #Copula", group: 0, tag: "Activity", reason: "gerund-copula"}, {match: "[#Gerund] #Modal", group: 0, tag: "Activity", reason: "gerund-modal"}, {match: "holy (shit|fuck|hell)", tag: "Expression", reason: "swears-expression"}, {match: "#Noun #Actor", tag: "Actor", reason: "thing-doer"}, {match: "#Conjunction [u]", group: 0, tag: "Pronoun", reason: "u-pronoun-2"}, {match: "[u] #Verb", group: 0, tag: "Pronoun", reason: "u-pronoun-1"}, {match: "#Noun [(who|whom)]", group: 0, tag: "Determiner", reason: "captain-who"}, {match: "a bit much", tag: "Determiner Adverb Adjective", reason: "bit-3"}, {match: "#Verb #Adverb? #Noun [(that|which)]", group: 0, tag: "Preposition", reason: "that-prep"}, {match: "@hasComma [which] (#Pronoun|#Verb)", group: 0, tag: "Preposition", reason: "which-copula"}, {match: "#Copula just [like]", group: 0, tag: "Preposition", reason: "like-preposition"}, {match: "#Noun [like] #Noun", group: 0, tag: "Preposition", reason: "noun-like"}, {match: "[had] #Noun+ #PastTense", group: 0, tag: "Condition", reason: "had-he"}, {match: "[were] #Noun+ to #Infinitive", group: 0, tag: "Condition", reason: "were-he"}, {match: "^how", tag: "QuestionWord", reason: "how-question"}, {match: "[how] (#Determiner|#Copula|#Modal|#PastTense)", group: 0, tag: "QuestionWord", reason: "how-is"}, {match: "^which", tag: "QuestionWord", reason: "which-question"}, {match: "[so] #Noun", group: 0, tag: "Conjunction", reason: "so-conj"}, {match: "[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)", group: 0, tag: "Conjunction", reason: "how-he-is-x"}], gi = {adverbAdjective: ["dark", "bright", "flat", "light", "soft", "pale", "dead", "dim", "faux", "little", "wee", "sheer", "most", "near", "good", "extra", "all"], personDate: ["april", "june", "may", "jan", "august", "eve"], personMonth: ["january", "april", "may", "june", "jan", "sep"], personAdjective: ["misty", "rusty", "dusty", "rich", "randy", "young"], personVerb: ["pat", "wade", "ollie", "will", "rob", "buck", "bob", "mark", "jack"], personPlace: ["darwin", "hamilton", "paris", "alexandria", "houston", "kobe", "santiago", "salvador", "sydney", "victoria"], personNoun: ["art", "baker", "berg", "bill", "brown", "charity", "chin", "christian", "cliff", "daisy", "dawn", "dick", "dolly", "faith", "franco", "gene", "green", "hall", "hill", "holly", "hope", "jean", "jewel", "joy", "kelvin", "king", "kitty", "lane", "lily", "melody", "mercedes", "miles", "olive", "penny", "ray", "reed", "robin", "rod", "rose", "sky", "summer", "trinity", "van", "viola", "violet", "wang", "white"]};
const pi = `(${gi.personDate.join("|")})`;
var mi = [{match: "#Holiday (day|eve)", tag: "Holiday", reason: "holiday-day"}, {match: "[sun] the #Ordinal", tag: "WeekDay", reason: "sun-the-5th"}, {match: "[sun] #Date", group: 0, tag: "WeekDay", reason: "sun-feb"}, {match: "#Date (on|this|next|last|during)? [sun]", group: 0, tag: "WeekDay", reason: "1pm-sun"}, {match: "(in|by|before|during|on|until|after|of|within|all) [sat]", group: 0, tag: "WeekDay", reason: "sat"}, {match: "(in|by|before|during|on|until|after|of|within|all) [wed]", group: 0, tag: "WeekDay", reason: "wed"}, {match: "(in|by|before|during|on|until|after|of|within|all) [march]", group: 0, tag: "Month", reason: "march"}, {match: "[sat] #Date", group: 0, tag: "WeekDay", reason: "sat-feb"}, {match: "#Preposition [(march|may)]", group: 0, tag: "Month", reason: "in-month"}, {match: "this [(march|may)]", group: 0, tag: "Month", reason: "this-month"}, {match: "next [(march|may)]", group: 0, tag: "Month", reason: "this-month"}, {match: "last [(march|may)]", group: 0, tag: "Month", reason: "this-month"}, {match: "[(march|may)] the? #Value", group: 0, tag: "Month", reason: "march-5th"}, {match: "#Value of? [(march|may)]", group: 0, tag: "Month", reason: "5th-of-march"}, {match: "[(march|may)] .? #Date", group: 0, tag: "Month", reason: "march-and-feb"}, {match: "#Date .? [(march|may)]", group: 0, tag: "Month", reason: "feb-and-march"}, {match: "#Adverb [(march|may)]", group: 0, tag: "Verb", reason: "quickly-march"}, {match: "[(march|may)] #Adverb", group: 0, tag: "Verb", reason: "march-quickly"}, {match: "#Value of #Month", tag: "Date", reason: "value-of-month"}, {match: "#Cardinal #Month", tag: "Date", reason: "cardinal-month"}, {match: "#Month #Value to #Value", tag: "Date", reason: "value-to-value"}, {match: "#Month the #Value", tag: "Date", reason: "month-the-value"}, {match: "(#WeekDay|#Month) #Value", tag: "Date", reason: "date-value"}, {match: "#Value (#WeekDay|#Month)", tag: "Date", reason: "value-date"}, {match: "(#TextValue && #Date) #TextValue", tag: "Date", reason: "textvalue-date"}, {match: `in [${pi}]`, group: 0, tag: "Date", reason: "in-june"}, {match: `during [${pi}]`, group: 0, tag: "Date", reason: "in-june"}, {match: `on [${pi}]`, group: 0, tag: "Date", reason: "in-june"}, {match: `by [${pi}]`, group: 0, tag: "Date", reason: "by-june"}, {match: `after [${pi}]`, group: 0, tag: "Date", reason: "after-june"}, {match: `#Date [${pi}]`, group: 0, tag: "Date", reason: "in-june"}, {match: pi + " #Value", tag: "Date", reason: "june-5th"}, {match: pi + " #Date", tag: "Date", reason: "june-5th"}, {match: pi + " #ProperNoun", tag: "Person", reason: "june-smith", safe: true}, {match: pi + " #Acronym? (#ProperNoun && !#Month)", tag: "Person", reason: "june-smith-jr"}, {match: "#Cardinal [second]", tag: "Unit", reason: "one-second"}, {match: "#Month #NumberRange", tag: "Date", reason: "aug 20-21"}, {match: "(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time", tag: "Timezone", reason: "std-time"}, {match: "(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time", tag: "Timezone", reason: "eastern-time"}, {match: "#Time [(eastern|mountain|pacific|central|est|pst|gmt)]", group: 0, tag: "Timezone", reason: "5pm-central"}, {match: "(central|western|eastern) european time", tag: "Timezone", reason: "cet"}];
const fi = `(${gi.personAdjective.join("|")})`;
var bi = [{match: "[all] #Determiner? #Noun", group: 0, tag: "Adjective", reason: "all-noun"}, {match: `#Adverb [${fi}]`, group: 0, tag: "Adjective", reason: "really-rich"}, {match: fi + " #Person", tag: "Person", reason: "randy-smith"}, {match: fi + " #Acronym? #ProperNoun", tag: "Person", reason: "rusty-smith"}, {match: "#Copula [(just|alone)]$", group: 0, tag: "Adjective", reason: "not-adverb"}, {match: "#Singular is #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "is-filled"}, {match: "[#PastTense] #Singular is", group: 0, tag: "Adjective", reason: "smoked-poutine"}, {match: "[#PastTense] #Plural are", group: 0, tag: "Adjective", reason: "baked-onions"}, {match: "well [#PastTense]", group: 0, tag: "Adjective", reason: "well-made"}, {match: "#Copula [fucked up?]", tag: "Adjective", reason: "swears-adjective"}, {match: "#Singular (seems|appears) #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "seems-filled"}, {match: "(a|an) [#Gerund]", group: 0, tag: "Adjective", reason: "a|an"}, {match: "as [#Gerund] as", group: 0, tag: "Adjective", reason: "as-gerund-as"}, {match: "more [#Gerund] than", group: 0, tag: "Adjective", reason: "more-gerund-than"}, {match: "(so|very|extremely) [#Gerund]", group: 0, tag: "Adjective", reason: "so-gerund"}, {match: "(it|he|she|everything|something) #Adverb? was #Adverb? [#Gerund]", group: 0, tag: "Adjective", reason: "it-was-gerund"}, {match: "(found|found) it #Adverb? [#Gerund]", group: 0, tag: "Adjective", reason: "found-it-gerund"}, {match: "a (little|bit|wee) bit? [#Gerund]", group: 0, tag: "Adjective", reason: "a-bit-gerund"}, {match: "#Copula #Adjective? [(out|in|through)]$", group: 0, tag: "Adjective", reason: "still-out"}, {match: "^[#Adjective] (the|your) #Noun", group: 0, tag: "Infinitive", reason: "shut-the"}, {match: "the [said] #Noun", group: 0, tag: "Adjective", reason: "the-said-card"}, {match: "#Noun (that|which|whose) [#PastTense && !#Copula] #Noun", group: 0, tag: "Adjective", reason: "that-past-noun"}], yi = [{match: "there (are|were) #Adjective? [#PresentTense]", group: 0, tag: "Plural", reason: "there-are"}, {match: "#Determiner [sun]", group: 0, tag: "Singular", reason: "the-sun"}, {match: "#Verb (a|an) [#Value]", group: 0, tag: "Singular", reason: "did-a-value"}, {match: "the [(can|will|may)]", group: 0, tag: "Singular", reason: "the can"}, {match: "#FirstName #Acronym? (#Possessive && #LastName)", tag: "Possessive", reason: "name-poss"}, {match: "#Organization+ #Possessive", tag: "Possessive", reason: "org-possessive"}, {match: "#Place+ #Possessive", tag: "Possessive", reason: "place-possessive"}, {match: "(#Verb && !#Modal) (all|every|each|most|some|no) [#PresentTense]", group: 0, tag: "Noun", reason: "all-presentTense"}, {match: "#Determiner [#Adjective] #Copula", group: 0, tag: "Noun", reason: "the-adj-is"}, {match: "#Adjective [#Adjective] #Copula", group: 0, tag: "Noun", reason: "adj-adj-is"}, {match: "(had|have|#PastTense) #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "adj-presentTense"}, {match: "^#Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "start adj-presentTense"}, {match: "#Value #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "one-big-reason"}, {match: "#PastTense #Adjective+ [#PresentTense]", group: 0, tag: "Noun", reason: "won-wide-support"}, {match: "(many|few|several|couple) [#PresentTense]", group: 0, tag: "Noun", reason: "many-poses"}, {match: "#Adverb #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "very-big-dream"}, {match: "#Adjective [#Infinitive] #Noun", group: 0, tag: "Noun", reason: "good-wait-staff"}, {match: "#Adjective #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "adorable-little-store"}, {match: "#Preposition #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "of-basic-training"}, {match: "#Adjective [#Gerund]", group: 0, tag: "Noun", reason: "early-warning"}, {match: "#Gerund #Adverb? #Comparative [#PresentTense]", group: 0, tag: "Noun", reason: "higher-costs"}, {match: "#Infinitive (this|that|the) [#Infinitive]", group: 0, tag: "Noun", reason: "do-this-dance"}, {match: "(his|her|its) [#Adjective]", group: 0, tag: "Noun", reason: "his-fine"}, {match: "some [#Verb] #Plural", group: 0, tag: "Noun", reason: "determiner6"}, {match: "more #Noun", tag: "Noun", reason: "more-noun"}, {match: "(#Noun && @hasComma) #Noun (and|or) [#PresentTense]", group: 0, tag: "Noun", reason: "noun-list"}, {match: "(right|rights) of .", tag: "Noun", reason: "right-of"}, {match: "a [bit]", group: 0, tag: "Noun", reason: "bit-2"}, {match: "#Possessive #Ordinal [#PastTense]", group: 0, tag: "Noun", reason: "first-thought"}, {match: "#Gerund #Determiner [#Infinitive]", group: 0, tag: "Noun", reason: "running-a-show"}, {match: "#Determiner #Adverb [#Infinitive]", group: 0, tag: "Noun", reason: "the-reason"}, {match: "(the|this|those|these) #Adjective [#Verb]", group: 0, tag: "Noun", reason: "the-adj-verb"}, {match: "(the|this|those|these) #Adverb #Adjective [#Verb]", group: 0, tag: "Noun", reason: "determiner4"}, {match: "#Determiner [#Adjective] (#Copula|#PastTense|#Auxiliary)", group: 0, tag: "Noun", reason: "the-adj-2"}, {match: "(the|this|a|an) [#Infinitive] #Adverb? #Verb", group: 0, tag: "Noun", reason: "determiner5"}, {match: "#Determiner [#Infinitive] #Noun", group: 0, tag: "Noun", reason: "determiner7"}, {match: "#Determiner #Adjective #Adjective? [#Infinitive]", group: 0, tag: "Noun", reason: "a-nice-inf"}, {match: "the [#Verb] #Preposition .", group: 0, tag: "Noun", reason: "determiner1"}, {match: "#Determiner [#Verb] of", group: 0, tag: "Noun", reason: "the-verb-of"}, {match: "#Adjective #Noun+ [#Infinitive] #Copula", group: 0, tag: "Noun", reason: "career-move"}, {match: "#Determiner #Noun of [#Verb]", group: 0, tag: "Noun", reason: "noun-of-noun"}, {match: "#Determiner [(western|eastern|northern|southern|central)] #Noun", group: 0, tag: "Noun", reason: "western-line"}, {match: "#Possessive [#Gerund]", group: 0, tag: "Noun", reason: "her-polling"}, {match: "(his|her|its) [#PresentTense]", group: 0, tag: "Noun", reason: "its-polling"}, {match: "(#Determiner|#Value) [(linear|binary|mobile|lexical|technical|computer|scientific|formal)] #Noun", group: 0, tag: "Noun", reason: "technical-noun"}, {match: "(the|those|these|a|an) [#Participle] #Noun", group: 0, tag: "Adjective", reason: "blown-motor"}, {match: "(the|those|these|a|an) #Adjective? [#Infinitive]", group: 0, tag: "Noun", reason: "det-inf"}, {match: "(the|those|these|a|an) #Adjective? [#PresentTense]", group: 0, tag: "Noun", reason: "det-pres"}, {match: "(the|those|these|a|an) #Adjective? [#PastTense]", group: 0, tag: "Noun", reason: "det-past"}, {match: "(this|that) [#Gerund]", group: 0, tag: "Noun", reason: "this-gerund"}, {match: "at some [#Infinitive]", group: 0, tag: "Noun", reason: "at-some-inf"}, {match: "(#Noun && @hasHyphen) #Verb", tag: "Noun", reason: "hyphen-verb"}, {match: "is no [#Verb]", group: 0, tag: "Noun", reason: "is-no-verb"}, {match: "[#Verb] than", group: 0, tag: "Noun", reason: "correction"}, {match: "(go|goes|went) to [#Infinitive]", group: 0, tag: "Noun", reason: "goes-to-verb"}, {match: "(a|an) #Noun [#Infinitive] (#Preposition|#Noun)", group: 0, tag: "Noun", reason: "a-noun-inf"}, {match: "(a|an) #Noun [#Infinitive]$", group: 0, tag: "Noun", reason: "a-noun-inf2"}, {match: "do [so]", group: 0, tag: "Noun", reason: "so-noun"}, {match: "#Copula [#Infinitive] #Noun", group: 0, tag: "Noun", reason: "is-pres-noun"}, {match: "#Determiner #Adverb? [close]", group: 0, tag: "Adjective", reason: "a-close"}, {match: "#Determiner [(shit|damn|hell)]", group: 0, tag: "Noun", reason: "swears-noun"}, {match: "(the|these) [#Singular] (were|are)", group: 0, tag: "Plural", reason: "singular-were"}, {match: "#Gerund #Adjective? for [#Infinitive]", group: 0, tag: "Noun", reason: "running-for"}, {match: "#Gerund #Adjective to [#Infinitive]", group: 0, tag: "Noun", reason: "running-to"}, {match: "(many|any|some|several) [#PresentTense] for", group: 0, tag: "Noun", reason: "any-verbs-for"}, {match: "(have|had) [#Adjective] #Preposition .", group: 0, tag: "Noun", reason: "have-fun"}, {match: "co #Noun", tag: "Actor", reason: "co-noun"}, {match: "to #PresentTense #Noun [#PresentTense] #Preposition", group: 0, tag: "Noun", reason: "gas-exchange"}, {match: "a #Noun+ or #Adverb+? [#Verb]", group: 0, tag: "Noun", reason: "noun-or-noun"}, {match: "[#Gerund] system", group: 0, tag: "Noun", reason: "operating-system"}, {match: "#PastTense (until|as|through|without) [#PresentTense]", group: 0, tag: "Noun", reason: "waited-until-release"}, {match: "#Gerund like #Adjective? [#PresentTense]", group: 0, tag: "Plural", reason: "like-hot-cakes"}, {match: "some #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "some-reason"}, {match: "for some [#PresentTense]", group: 0, tag: "Noun", reason: "for-some-reason"}, {match: "(same|some|the|that|a) kind of [#PresentTense]", group: 0, tag: "Noun", reason: "some-kind-of"}, {match: "(same|some|the|that|a) type of [#PresentTense]", group: 0, tag: "Noun", reason: "some-type-of"}, {match: "#Gerund #Adjective #Preposition [#PresentTense]", group: 0, tag: "Noun", reason: "doing-better-for-x"}, {match: "(get|got|have|had) #Comparative [#PresentTense]", group: 0, tag: "Noun", reason: "got-better-aim"}, {match: "#Pronoun #Infinitive [#Gerund] #PresentTense", group: 0, tag: "Noun", reason: "tipping-sucks"}];
var vi = [{match: "[still] #Adjective", group: 0, tag: "Adverb", reason: "still-advb"}, {match: "[still] #Verb", group: 0, tag: "Adverb", reason: "still-verb"}, {match: "[so] #Adjective", group: 0, tag: "Adverb", reason: "so-adv"}, {match: "[way] #Comparative", group: 0, tag: "Adverb", reason: "way-adj"}, {match: "[way] #Adverb #Adjective", group: 0, tag: "Adverb", reason: "way-too-adj"}, {match: "[all] #Verb", group: 0, tag: "Adverb", reason: "all-verb"}, {match: "(#Verb && !#Modal) [like]", group: 0, tag: "Adverb", reason: "verb-like"}, {match: "(barely|hardly) even", tag: "Adverb", reason: "barely-even"}, {match: "[even] #Verb", group: 0, tag: "Adverb", reason: "even-walk"}, {match: "even left", tag: "#Adverb #Verb", reason: "even-left"}, {match: "(#PresentTense && !#Copula) [(hard|quick|long|bright|slow|fast|backwards|forwards)]", group: 0, tag: "Adverb", reason: "lazy-ly"}, {match: "[much] #Adjective", group: 0, tag: "Adverb", reason: "bit-1"}, {match: "#Copula [#Adverb]$", group: 0, tag: "Adjective", reason: "is-well"}, {match: "a [(little|bit|wee) bit?] #Adjective", group: 0, tag: "Adverb", reason: "a-bit-cold"}, {match: `[${`(${gi.adverbAdjective.join("|")})`}] #Adjective`, group: 0, tag: "Adverb", reason: "dark-green"}, {match: "#Adverb [#Adverb]$", group: 0, tag: "Adjective", reason: "kinda-sparkly"}, {match: "#Adverb [#Adverb] (and|or|then)", group: 0, tag: "Adjective", reason: "kinda-sparkly-and"}, {match: "[super] #Adjective #Noun", group: 0, tag: "Adverb", reason: "super-strong"}], wi = [{match: "1 #Value #PhoneNumber", tag: "PhoneNumber", reason: "1-800-Value"}, {match: "#NumericValue #PhoneNumber", tag: "PhoneNumber", reason: "(800) PhoneNumber"}, {match: "#Demonym #Currency", tag: "Currency", reason: "demonym-currency"}, {match: "[second] #Noun", group: 0, tag: "Ordinal", reason: "second-noun"}, {match: "#Value+ [#Currency]", group: 0, tag: "Unit", reason: "5-yan"}, {match: "#Value [(foot|feet)]", group: 0, tag: "Unit", reason: "foot-unit"}, {match: "(minus|negative) #Value", tag: "Value", reason: "minus-value"}, {match: "#Value [#Abbreviation]", group: 0, tag: "Unit", reason: "value-abbr"}, {match: "#Value [k]", group: 0, tag: "Unit", reason: "value-k"}, {match: "#Unit an hour", tag: "Unit", reason: "unit-an-hour"}, {match: "#Value (point|decimal) #Value", tag: "Value", reason: "value-point-value"}, {match: "(#Value|a) [(buck|bucks|grand)]", group: 0, tag: "Currency", reason: "value-bucks"}, {match: "#Determiner [(half|quarter)] #Ordinal", group: 0, tag: "Value", reason: "half-ordinal"}, {match: "a #Value", tag: "Value", reason: "a-value"}, {match: "[#Value+] #Currency", group: 0, tag: "Money", reason: "15 usd"}, {match: "(hundred|thousand|million|billion|trillion|quadrillion)+ and #Value", tag: "Value", reason: "magnitude-and-value"}, {match: "!once [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)", group: 0, tag: "Value", reason: "a-is-one"}];
const ki = `(${gi.personVerb.join("|")})`;
var Ai = [{match: "[#Adjective] #Possessive #Noun", group: 0, tag: "Verb", reason: "gerund-his-noun"}, {match: "[#Adjective] (us|you)", group: 0, tag: "Gerund", reason: "loving-you"}, {match: "(slowly|quickly) [#Adjective]", group: 0, tag: "Gerund", reason: "slowly-adj"}, {match: "(#Modal|i|they|we|do) not? [like]", group: 0, tag: "PresentTense", reason: "modal-like"}, {match: "do (simply|just|really|not)+ [(#Adjective|like)]", group: 0, tag: "Verb", reason: "do-simply-like"}, {match: "does (#Adverb|not)? [#Adjective]", group: 0, tag: "PresentTense", reason: "does-mean"}, {match: "i (#Adverb|do)? not? [mean]", group: 0, tag: "PresentTense", reason: "i-mean"}, {match: "#Noun #Adverb? [left]", group: 0, tag: "PastTense", reason: "left-verb"}, {match: "(this|that) [#Plural]", group: 0, tag: "PresentTense", reason: "this-verbs"}, {match: "[#Copula (#Adverb|not)+?] (#Gerund|#PastTense)", group: 0, tag: "Auxiliary", reason: "copula-walking"}, {match: "[(has|had) (#Adverb|not)+?] #PastTense", group: 0, tag: "Auxiliary", reason: "had-walked"}, {match: "#Adverb+? [(#Modal|did)+ (#Adverb|not)+?] #Verb", group: 0, tag: "Auxiliary", reason: "modal-verb"}, {match: "[#Modal (#Adverb|not)+? have (#Adverb|not)+? had (#Adverb|not)+?] #Verb", group: 0, tag: "Auxiliary", reason: "would-have"}, {match: "[(has|had) (#Adverb|not)+?] #PastTense", group: 0, tag: "Auxiliary", reason: "had-walked"}, {match: "[(do|does|will|have|had)] (not|#Adverb)+? #Verb", group: 0, tag: "Auxiliary", reason: "have-had"}, {match: "[about to] #Adverb? #Verb", group: 0, tag: ["Auxiliary", "Verb"], reason: "about-to"}, {match: "#Modal (#Adverb|not)+? be (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "would-be"}, {match: "(were|was) being [#PresentTense]", group: 0, tag: "PastTense", reason: "was-being"}, {match: "[#Modal (#Adverb|not)+? have (#Adverb|not)+? had (#Adverb|not)+?] #Verb", group: 0, tag: "Auxiliary", reason: "would-have"}, {match: "(#Modal|had|has) (#Adverb|not)+? been (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "had-been"}, {match: "[(be|being|been)] #Participle", group: 0, tag: "Auxiliary", reason: "being-foo"}, {match: "(#Verb && @hasHyphen) up", tag: "PhrasalVerb", reason: "foo-up"}, {match: "(#Verb && @hasHyphen) off", tag: "PhrasalVerb", reason: "foo-off"}, {match: "(#Verb && @hasHyphen) over", tag: "PhrasalVerb", reason: "foo-over"}, {match: "(#Verb && @hasHyphen) out", tag: "PhrasalVerb", reason: "foo-out"}, {match: "#PhrasalVerb [#PhrasalVerb]", group: 0, tag: "Particle", reason: "phrasal-particle"}, {match: "(lived|went|crept|go) [on] for", group: 0, tag: "PhrasalVerb", reason: "went-on"}, {match: "#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]", group: 0, tag: "Adverb", reason: "phrasal-pronoun-advb"}, {match: "[will #Adverb? not? #Adverb? be] #Gerund", group: 0, tag: "Copula", reason: "will-be-copula"}, {match: "will #Adverb? not? #Adverb? [be] #Adjective", group: 0, tag: "Copula", reason: "be-copula"}, {match: "[march] (up|down|back|to|toward)", group: 0, tag: "Infinitive", reason: "march-to"}, {match: "#Modal [march]", group: 0, tag: "Infinitive", reason: "must-march"}, {match: "(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)", group: 0, tag: "Infinitive", reason: "let-him-glue"}, {match: "will [#Adjective]", group: 0, tag: "Verb", reason: "will-adj"}, {match: "#Pronoun [#Adjective] #Determiner #Adjective? #Noun", group: 0, tag: "Verb", reason: "he-adj-the"}, {match: "#Copula [#Adjective] to #Verb", group: 0, tag: "Verb", reason: "adj-to"}, {match: "[open] #Determiner", group: 0, tag: "Infinitive", reason: "open-the"}, {match: "[#PresentTense] (are|were|was) #Adjective", group: 0, tag: "Plural", reason: "compromises-are-possible"}, {match: `#Modal [${ki}]`, group: 0, tag: "Verb", reason: "would-mark"}, {match: `#Adverb [${ki}]`, group: 0, tag: "Verb", reason: "really-mark"}, {match: "(to|#Modal) [mark]", group: 0, tag: "PresentTense", reason: "to-mark"}, {match: "^[#Infinitive] (is|was)", group: 0, tag: "Noun", reason: "checkmate-is"}, {match: ki + " #Person", tag: "Person", reason: "rob-smith"}, {match: ki + " #Acronym #ProperNoun", tag: "Person", reason: "rob-a-smith"}, {match: "[shit] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear1-verb"}, {match: "[damn] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear2-verb"}, {match: "[fuck] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear3-verb"}, {match: "(become|fall|grow) #Adverb? [#PastTense]", group: 0, tag: "Adjective", reason: "overly-weakened"}, {match: "(a|an) #Adverb [#Participle] #Noun", group: 0, tag: "Adjective", reason: "completely-beaten"}, {match: "whose [#PresentTense] #Copula", group: 0, tag: "Noun", reason: "whos-name-was"}, {match: "#PhrasalVerb #PhrasalVerb #Preposition [#PresentTense]", group: 0, tag: "Noun", reason: "given-up-on-x"}];
var Di = [{match: "(west|north|south|east|western|northern|southern|eastern)+ #Place", tag: "Region", reason: "west-norfolk"}, {match: "#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]", group: 0, tag: "Region", reason: "us-state"}, {match: "portland [or]", group: 0, tag: "Region", reason: "portland-or"}, {match: "#ProperNoun+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)", tag: "Region", reason: "foo-district"}, {match: "(district|region|province|municipality|territory|burough|state) of #ProperNoun", tag: "Region", reason: "district-of-Foo"}, {match: "in [#ProperNoun] #Place", group: 0, tag: "Place", reason: "propernoun-place"}, {match: "#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)", tag: "Address", reason: "address-st"}];
const $i = gi, Pi = `(${$i.personNoun.join("|")})`, Ei = `(${$i.personMonth.join("|")})`;
var Hi = [{match: "[(1st|2nd|first|second)] #Honorific", group: 0, tag: "Honorific", reason: "ordinal-honorific"}, {match: "[(private|general|major|corporal|lord|lady|secretary|premier)] #Honorific? #Person", group: 0, tag: "Honorific", reason: "ambg-honorifics"}, {match: "#Copula [(#Noun|#PresentTense)] #LastName", group: 0, tag: "FirstName", reason: "copula-noun-lastname"}, {match: "(lady|queen|sister) #ProperNoun", tag: "FemaleName", reason: "lady-titlecase", safe: true}, {match: "(king|pope|father) #ProperNoun", tag: "MaleName", reason: "pope-titlecase", safe: true}, {match: "[(will|may|april|june|said|rob|wade|ray|rusty|drew|miles|jack|chuck|randy|jan|pat|cliff|bill)] #LastName", group: 0, tag: "FirstName", reason: "maybe-lastname"}, {match: "#FirstName [#Determiner #Noun] #LastName", group: 0, tag: "NickName", reason: "first-noun-last"}, {match: "#Possessive [#FirstName]", group: 0, tag: "Person", reason: "possessive-name"}, {match: "#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun", tag: "Person", reason: "titlecase-acronym-titlecase", safe: true}, {match: "#Acronym #LastName", tag: "Person", reason: "acronym-latname", safe: true}, {match: "#Person (jr|sr|md)", tag: "Person", reason: "person-honorific"}, {match: "#Person #Person the? #RomanNumeral", tag: "Person", reason: "roman-numeral"}, {match: "#FirstName [/^[^aiurck]$/]", group: 0, tag: ["Acronym", "Person"], reason: "john-e"}, {match: "#Honorific #Person", tag: "Person", reason: "honorific-person"}, {match: "#Honorific #Acronym", tag: "Person", reason: "Honorific-TitleCase"}, {match: "#Noun van der? #Noun", tag: "Person", reason: "van der noun", safe: true}, {match: "(king|queen|prince|saint|lady) of #Noun", tag: "Person", reason: "king-of-noun", safe: true}, {match: "(prince|lady) #Place", tag: "Person", reason: "lady-place"}, {match: "(king|queen|prince|saint) #ProperNoun", tag: "Person", reason: "saint-foo"}, {match: "[#ProperNoun] #Person", group: 0, tag: "Person", reason: "proper-person", safe: true}, {match: "al (#Person|#ProperNoun)", tag: "Person", reason: "al-borlen", safe: true}, {match: "#FirstName de #Noun", tag: "Person", reason: "bill-de-noun"}, {match: "#FirstName (bin|al) #Noun", tag: "Person", reason: "bill-al-noun"}, {match: "#FirstName #Acronym #ProperNoun", tag: "Person", reason: "bill-acronym-title"}, {match: "#FirstName #FirstName #ProperNoun", tag: "Person", reason: "bill-firstname-title"}, {match: "#Honorific #FirstName? #ProperNoun", tag: "Person", reason: "dr-john-Title"}, {match: "#FirstName the #Adjective", tag: "Person", reason: "name-the-great"}, {match: "#FirstName (green|white|brown|hall|young|king|hill|cook|gray|price)", tag: "Person", reason: "bill-green"}, {match: Pi + " #Person", tag: "Person", reason: "ray-smith", safe: true}, {match: Pi + " #Acronym? #ProperNoun", tag: "Person", reason: "ray-a-smith", safe: true}, {match: `#Infinitive #Determiner? #Adjective? #Noun? (to|for) [${Ei}]`, group: 0, tag: "Person", reason: "ambig-person"}, {match: `#Infinitive [${Ei}]`, group: 0, tag: "Person", reason: "infinitive-person"}, {match: `[${Ei}] #Modal`, group: 0, tag: "Person", reason: "ambig-modal"}, {match: "[may] be", group: 0, tag: "Verb", reason: "may-be"}, {match: `#Modal [${Ei}]`, group: 0, tag: "Person", reason: "modal-ambig"}, {match: `#Copula [${Ei}]`, group: 0, tag: "Person", reason: "is-may"}, {match: `[${Ei}] #Copula`, group: 0, tag: "Person", reason: "may-is"}, {match: `that [${Ei}]`, group: 0, tag: "Person", reason: "that-month"}, {match: `with [${Ei}]`, group: 0, tag: "Person", reason: "with-month"}, {match: `for [${Ei}]`, group: 0, tag: "Person", reason: "for-month"}, {match: `this [${Ei}]`, group: 0, tag: "Month", reason: "this-may"}, {match: `next [${Ei}]`, group: 0, tag: "Month", reason: "next-may"}, {match: `last [${Ei}]`, group: 0, tag: "Month", reason: "last-may"}, {match: `#Date [${Ei}]`, group: 0, tag: "Month", reason: "date-may"}, {match: `[${Ei}] the? #Value`, group: 0, tag: "Month", reason: "may-5th"}, {match: `#Value of [${Ei}]`, group: 0, tag: "Month", reason: "5th-of-may"}, {match: "#ProperNoun (van|al|bin) #ProperNoun", tag: "Person", reason: "title-van-title", safe: true}, {match: "#ProperNoun (de|du) la? #ProperNoun", tag: "Person", reason: "title-de-title", safe: true}, {match: "#Singular #Acronym #LastName", tag: "#Person", reason: "title-acro-noun", safe: true}, {match: "#FirstName (#Noun && #ProperNoun) #ProperNoun?", tag: "Person", reason: "firstname-titlecase"}, {match: "#FirstName #Acronym #Noun", tag: "Person", reason: "n-acro-noun", safe: true}, {match: "#FirstName [(de|di|du|van|von) #Person]", group: 0, tag: "LastName", reason: "de-firstname"}, {match: `[${`(${$i.personPlace.join("|")})`}] (#ProperNoun && !#Place)`, group: 0, tag: "FirstName", reason: "place-firstname"}];
const ji = _e, Ni = hi;
let xi = [];
xi = xi.concat(di), xi = xi.concat(mi), xi = xi.concat(bi), xi = xi.concat(yi), xi = xi.concat(vi), xi = xi.concat(wi), xi = xi.concat(Ai), xi = xi.concat(Di), xi = xi.concat([{match: "#Noun (&|n) #Noun", tag: "Organization", reason: "Noun-&-Noun"}, {match: "#Organization of the? #ProperNoun", tag: "Organization", reason: "org-of-place", safe: true}, {match: "#Organization #Country", tag: "Organization", reason: "org-country"}, {match: "#ProperNoun #Organization", tag: "Organization", reason: "titlecase-org"}, {match: "#ProperNoun (ltd|co|inc|dept|assn|bros)", tag: "Organization", reason: "org-abbrv"}, {match: "the [#Acronym]", group: 0, tag: "Organization", reason: "the-acronym", safe: true}, {match: "(world|global|international|national|#Demonym) #Organization", tag: "Organization", reason: "global-org"}, {match: "#Noun+ (public|private) school", tag: "School", reason: "noun-public-school"}]), xi = xi.concat(Hi);
let Fi = [];
xi.forEach((e3) => {
  e3.reg = ji(e3.match);
  let t2 = function(e4) {
    let t3 = [];
    if (e4.reg.filter((e5) => e5.fastOr !== void 0).length === 1) {
      let r2 = e4.reg.findIndex((e5) => e5.fastOr !== void 0);
      Object.keys(e4.reg[r2].fastOr).forEach((a2) => {
        let n2 = Object.assign({}, e4);
        n2.reg = n2.reg.slice(0), n2.reg[r2] = Object.assign({}, n2.reg[r2]), n2.reg[r2].word = a2, delete n2.reg[r2].operator, delete n2.reg[r2].fastOr, t3.push(n2);
      });
    }
    return t3;
  }(e3);
  t2.length > 0 ? Fi = Fi.concat(t2) : Fi.push(e3);
}), Fi.forEach((e3) => (e3.required = function(e4) {
  let t2 = [], r2 = [];
  return e4.forEach((e5) => {
    e5.optional !== true && e5.negative !== true && (e5.tag !== void 0 && t2.push(e5.tag), e5.word !== void 0 && r2.push(e5.word));
  }), {tags: Ni(t2), words: Ni(r2)};
}(e3.reg), e3));
const Ci = Fi, Bi = hi;
const Gi = ci, zi = function(e3) {
  Ci.forEach((t2) => {
    let r2 = [];
    t2.required.words.forEach((t3) => {
      r2.push(e3._cache.words[t3] || []);
    }), t2.required.tags.forEach((t3) => {
      r2.push(e3._cache.tags[t3] || []);
    });
    let a2 = function(e4) {
      if (e4.length === 0)
        return [];
      let t3 = {};
      e4.forEach((e5) => {
        e5 = Bi(e5);
        for (let r4 = 0; r4 < e5.length; r4++)
          t3[e5[r4]] = t3[e5[r4]] || 0, t3[e5[r4]] += 1;
      });
      let r3 = Object.keys(t3);
      return r3 = r3.filter((r4) => t3[r4] === e4.length), r3 = r3.map((e5) => Number(e5)), r3;
    }(r2);
    if (a2.length === 0)
      return;
    let n2 = a2.map((t3) => e3.list[t3]), i2 = e3.buildFrom(n2).match(t2.reg, t2.group);
    i2.found && (t2.safe === true ? i2.tagSafe(t2.tag, t2.reason) : i2.tag(t2.tag, t2.reason));
  });
};
const Ii = dn, Oi = Gn, Ti = li, Vi = function(e3) {
  return zi(e3), Gi(e3), e3;
};
var Mi = function(e3) {
  let t2 = e3.termList();
  return e3 = Ii(e3, t2), e3 = Oi(e3, t2), (e3 = Ti(e3)).cache(), (e3 = Vi(e3)).uncache(), e3.world.taggers.forEach((t3) => {
    t3(e3);
  }), e3;
};
var Ji = function(e3) {
  class t2 extends e3 {
    stripPeriods() {
      return this.termList().forEach((e4) => {
        e4.tags.Abbreviation === true && e4.next && (e4.post = e4.post.replace(/^\./, ""));
        let t3 = e4.text.replace(/\./, "");
        e4.set(t3);
      }), this;
    }
    addPeriods() {
      return this.termList().forEach((e4) => {
        e4.post = e4.post.replace(/^\./, ""), e4.post = "." + e4.post;
      }), this;
    }
  }
  return t2.prototype.unwrap = t2.prototype.stripPeriods, e3.prototype.abbreviations = function(e4) {
    let r2 = this.match("#Abbreviation");
    return typeof e4 == "number" && (r2 = r2.get(e4)), new t2(r2.list, this, this.world);
  }, e3;
};
const Li = /\./;
var Si = function(e3) {
  class t2 extends e3 {
    stripPeriods() {
      return this.termList().forEach((e4) => {
        let t3 = e4.text.replace(/\./g, "");
        e4.set(t3);
      }), this;
    }
    addPeriods() {
      return this.termList().forEach((e4) => {
        let t3 = e4.text.replace(/\./g, "");
        t3 = t3.split("").join("."), Li.test(e4.post) === false && (t3 += "."), e4.set(t3);
      }), this;
    }
  }
  return t2.prototype.unwrap = t2.prototype.stripPeriods, t2.prototype.strip = t2.prototype.stripPeriods, e3.prototype.acronyms = function(e4) {
    let r2 = this.match("#Acronym");
    return typeof e4 == "number" && (r2 = r2.get(e4)), new t2(r2.list, this, this.world);
  }, e3;
};
var _i = function(e3) {
  return e3.prototype.clauses = function(t2) {
    let r2 = this.if("@hasComma").notIf("@hasComma @hasComma").notIf("@hasComma . .? (and|or) .").notIf("(#City && @hasComma) #Country").notIf("(#WeekDay && @hasComma) #Date").notIf("(#Date && @hasComma) #Year").notIf("@hasComma (too|also)$").match("@hasComma"), a2 = this.splitAfter(r2), n2 = a2.quotations();
    a2 = a2.splitOn(n2);
    let i2 = a2.parentheses();
    a2 = a2.splitOn(i2);
    let o2 = a2.if("#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb").match("#Conjunction");
    a2 = a2.splitBefore(o2);
    let s2 = a2.if("if .{2,9} then .").match("then");
    a2 = a2.splitBefore(s2), a2 = a2.splitBefore("as well as ."), a2 = a2.splitBefore("such as ."), a2 = a2.splitBefore("in addition to ."), a2 = a2.splitAfter("@hasSemicolon"), a2 = a2.splitAfter("@hasDash");
    let l2 = a2.filter((e4) => e4.wordCount() > 5 && e4.match("#Verb+").length >= 2);
    if (l2.found) {
      let e4 = l2.splitAfter("#Noun .* #Verb .* #Noun+");
      a2 = a2.splitOn(e4.eq(0));
    }
    return typeof t2 == "number" && (a2 = a2.get(t2)), new e3(a2.list, this, this.world);
  }, e3;
};
var Ki = function(e3) {
  class t2 extends e3 {
    constructor(e4, t3, r2) {
      super(e4, t3, r2), this.contracted = null;
    }
    expand() {
      return this.list.forEach((e4) => {
        let t3 = e4.terms(), r2 = t3[0].isTitleCase();
        t3.forEach((e5, r3) => {
          e5.set(e5.implicit || e5.text), e5.implicit = void 0, r3 < t3.length - 1 && e5.post === "" && (e5.post += " ");
        }), r2 && t3[0].toTitleCase();
      }), this;
    }
  }
  return e3.prototype.contractions = function(e4) {
    let r2 = this.match("@hasContraction+");
    return typeof e4 == "number" && (r2 = r2.get(e4)), new t2(r2.list, this, this.world);
  }, e3.prototype.expanded = e3.prototype.isExpanded, e3.prototype.contracted = e3.prototype.isContracted, e3;
};
var qi = function(e3) {
  const t2 = function(e4) {
    let t3 = e4.splitAfter("@hasComma").splitOn("(and|or) not?").not("(and|or) not?"), r3 = e4.match("[.] (and|or)", 0);
    return {things: t3, conjunction: e4.match("(and|or) not?"), beforeLast: r3, hasOxford: r3.has("@hasComma")};
  };
  class r2 extends e3 {
    conjunctions() {
      return this.match("(and|or)");
    }
    parts() {
      return this.splitAfter("@hasComma").splitOn("(and|or) not?");
    }
    items() {
      return t2(this).things;
    }
    add(e4) {
      return this.forEach((r3) => {
        let a2 = t2(r3).beforeLast;
        a2.append(e4), a2.termList(0).addPunctuation(",");
      }), this;
    }
    remove(e4) {
      return this.items().if(e4).remove();
    }
    hasOxfordComma() {
      return this.filter((e4) => t2(e4).hasOxford);
    }
    addOxfordComma() {
      let e4 = this.items(), t3 = e4.eq(e4.length - 2);
      return t3.found && t3.has("@hasComma") === false && t3.post(", "), this;
    }
    removeOxfordComma() {
      let e4 = this.items(), t3 = e4.eq(e4.length - 2);
      return t3.found && t3.has("@hasComma") === true && t3.post(" "), this;
    }
  }
  return r2.prototype.things = r2.prototype.items, e3.prototype.lists = function(e4) {
    let t3 = this.if("@hasComma+ .? (and|or) not? ."), a2 = t3.match("(#Noun|#Adjective|#Determiner|#Article)+ #Conjunction not? (#Article|#Determiner)? #Adjective? #Noun+").if("#Noun"), n2 = t3.match("(#Adjective|#Adverb)+ #Conjunction not? #Adverb? #Adjective+"), i2 = t3.match("(#Verb|#Adverb)+ #Conjunction not? #Adverb? #Verb+"), o2 = a2.concat(n2);
    return o2 = o2.concat(i2), o2 = o2.if("@hasComma"), typeof e4 == "number" && (o2 = t3.get(e4)), new r2(o2.list, this, this.world);
  }, e3;
};
const Wi = {hour: "an", heir: "an", heirloom: "an", honest: "an", honour: "an", honor: "an", uber: "an"}, Ri = {a: true, e: true, f: true, h: true, i: true, l: true, m: true, n: true, o: true, r: true, s: true, x: true}, Ui = [/^onc?e/i, /^u[bcfhjkqrstn][aeiou]/i, /^eul/i];
const Qi = {isSingular: [/(ax|test)is$/i, /(octop|vir|radi|nucle|fung|cact|stimul)us$/i, /(octop|vir)i$/i, /(rl)f$/i, /(alias|status)$/i, /(bu)s$/i, /(al|ad|at|er|et|ed|ad)o$/i, /(ti)um$/i, /(ti)a$/i, /sis$/i, /(?:(^f)fe|(lr)f)$/i, /hive$/i, /(^aeiouy|qu)y$/i, /(x|ch|ss|sh|z)$/i, /(matr|vert|ind|cort)(ix|ex)$/i, /(m|l)ouse$/i, /(m|l)ice$/i, /(antenn|formul|nebul|vertebr|vit)a$/i, /.sis$/i, /^(?!talis|.*hu)(.*)man$/i], isPlural: [/(antenn|formul|nebul|vertebr|vit)ae$/i, /(octop|vir|radi|nucle|fung|cact|stimul)i$/i, /men$/i, /.tia$/i, /(m|l)ice$/i]}, Zi = /s$/;
const Xi = {he: "his", she: "hers", they: "theirs", we: "ours", i: "mine", you: "yours", her: "hers", their: "theirs", our: "ours", my: "mine", your: "yours"};
const Yi = function(e3) {
  return e3.has("#Plural") === true || e3.has("(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)") !== true;
}, eo = function(e3) {
  if (e3.has("#Person") || e3.has("#Place"))
    return "";
  if (e3.has("#Plural"))
    return "the";
  let t2 = e3.text("normal").trim();
  if (Wi.hasOwnProperty(t2))
    return Wi[t2];
  let r2 = t2.substr(0, 1);
  if (e3.has("^@isAcronym") && Ri.hasOwnProperty(r2))
    return "an";
  for (let e4 = 0; e4 < Ui.length; e4++)
    if (Ui[e4].test(t2))
      return "a";
  return /^[aeiou]/i.test(t2) ? "an" : "a";
}, to = function(e3) {
  return !Qi.isSingular.find((t2) => t2.test(e3)) && (Zi.test(e3) === true || (!!Qi.isPlural.find((t2) => t2.test(e3)) || null));
}, ro = function(e3) {
  let t2 = e3.text("text").trim();
  return Xi.hasOwnProperty(t2) ? (e3.replaceWith(Xi[t2], true), void e3.tag("Possessive", "toPossessive")) : /s$/.test(t2) ? (t2 += "'", e3.replaceWith(t2, true), void e3.tag("Possessive", "toPossessive")) : (t2 += "'s", e3.replaceWith(t2, true), void e3.tag("Possessive", "toPossessive"));
}, ao = function(e3) {
  let t2 = {main: e3};
  if (e3.has("#Noun (of|by|for) .")) {
    let r2 = e3.splitAfter("[#Noun+]", 0);
    t2.main = r2.eq(0), t2.post = r2.eq(1);
  }
  return t2;
};
const no = {json: function(e3) {
  let t2 = null;
  typeof e3 == "number" && (t2 = e3, e3 = null), e3 = e3 || {text: true, normal: true, trim: true, terms: true};
  let r2 = [];
  return this.forEach((t3) => {
    let a2 = t3.json(e3)[0];
    a2.article = eo(t3), r2.push(a2);
  }), t2 !== null ? r2[t2] : r2;
}, adjectives: function() {
  let e3 = this.lookAhead("^(that|who|which)? (was|is|will)? be? #Adverb? #Adjective+");
  return e3 = e3.concat(this.lookBehind("#Adjective+ #Adverb?$")), e3 = e3.match("#Adjective"), e3.sort("index");
}, isPlural: function() {
  return this.if("#Plural");
}, hasPlural: function() {
  return this.filter((e3) => Yi(e3));
}, toPlural: function(e3) {
  let t2 = this.world.transforms.toPlural;
  return this.forEach((r2) => {
    if (r2.has("#Plural") || Yi(r2) === false)
      return;
    let a2 = ao(r2).main, n2 = a2.text("reduced");
    if ((a2.has("#Singular") || to(n2) !== true) && (n2 = t2(n2, this.world), a2.replace(n2).tag("#Plural"), e3)) {
      let e4 = a2.lookBefore("(an|a) #Adjective?$").not("#Adjective");
      e4.found === true && e4.remove();
    }
  }), this;
}, toSingular: function(e3) {
  let t2 = this.world.transforms.toSingular;
  return this.forEach((r2) => {
    if (r2.has("^#Singular+$") || Yi(r2) === false)
      return;
    let a2 = ao(r2).main, n2 = a2.text("reduced");
    if ((a2.has("#Plural") || to(n2) === true) && (n2 = t2(n2, this.world), a2.replace(n2).tag("#Singular"), e3)) {
      let e4 = r2, t3 = r2.lookBefore("#Adjective");
      t3.found && (e4 = t3);
      let a3 = eo(e4);
      e4.insertBefore(a3);
    }
  }), this;
}, toPossessive: function() {
  return this.forEach((e3) => {
    ro(e3);
  }), this;
}};
var io = function(e3) {
  class t2 extends e3 {
  }
  return Object.assign(t2.prototype, no), e3.prototype.nouns = function(e4, r2 = {}) {
    let a2 = this.match("(#City && @hasComma) (#Region|#Country)"), n2 = this.not(a2).splitAfter("@hasComma");
    n2 = n2.concat(a2);
    let i2 = n2.quotations();
    return i2.found && (n2 = n2.splitOn(i2.eq(0))), n2 = n2.match("#Noun+ (of|by)? the? #Noun+?"), r2.keep_anaphora !== true && (n2 = n2.not("#Pronoun"), n2 = n2.not("(there|these)"), n2 = n2.not("(#Month|#WeekDay)"), n2 = n2.not("(my|our|your|their|her|his)")), n2 = n2.not("(of|for|by|the)$"), typeof e4 == "number" && (n2 = n2.get(e4)), new t2(n2.list, this, this.world);
  }, e3;
};
const oo = /\(/, so = /\)/;
var lo = function(e3) {
  class t2 extends e3 {
    unwrap() {
      return this.list.forEach((e4) => {
        let t3 = e4.terms(0);
        t3.pre = t3.pre.replace(oo, "");
        let r2 = e4.lastTerm();
        r2.post = r2.post.replace(so, "");
      }), this;
    }
  }
  return e3.prototype.parentheses = function(e4) {
    let r2 = [];
    return this.list.forEach((e5) => {
      let t3 = e5.terms();
      for (let a2 = 0; a2 < t3.length; a2 += 1) {
        const n2 = t3[a2];
        if (oo.test(n2.pre)) {
          for (let i2 = a2; i2 < t3.length; i2 += 1)
            if (so.test(t3[i2].post)) {
              let t4 = i2 - a2 + 1;
              r2.push(e5.buildFrom(n2.id, t4)), a2 = i2;
              break;
            }
        }
      }
    }), typeof e4 == "number" ? (r2 = r2[e4] ? [r2[e4]] : [], new t2(r2, this, this.world)) : new t2(r2, this, this.world);
  }, e3;
};
var uo = function(e3) {
  class t2 extends e3 {
    constructor(e4, t3, r2) {
      super(e4, t3, r2), this.contracted = null;
    }
    strip() {
      return this.list.forEach((e4) => {
        e4.terms().forEach((e5) => {
          let t3 = e5.text.replace(/'s$/, "");
          e5.set(t3 || e5.text);
        });
      }), this;
    }
  }
  return e3.prototype.possessives = function(e4) {
    let r2 = this.match("#Noun+? #Possessive");
    return typeof e4 == "number" && (r2 = r2.get(e4)), new t2(r2.list, this, this.world);
  }, e3;
};
const co = {'"': '"', "＂": "＂", "'": "'", "“": "”", "‘": "’", "‟": "”", "‛": "’", "„": "”", "⹂": "”", "‚": "’", "«": "»", "‹": "›", "‵": "′", "‶": "″", "‷": "‴", "〝": "〞", "`": "´", "〟": "〞"}, ho = RegExp("(" + Object.keys(co).join("|") + ")");
var go = function(e3) {
  class t2 extends e3 {
    unwrap() {
      return this;
    }
  }
  return e3.prototype.quotations = function(e4) {
    let r2 = [];
    return this.list.forEach((e5) => {
      let t3 = e5.terms();
      for (let a2 = 0; a2 < t3.length; a2 += 1) {
        const n2 = t3[a2];
        if (ho.test(n2.pre)) {
          let i2 = (n2.pre.match(ho) || [])[0], o2 = co[i2];
          for (let i3 = a2; i3 < t3.length; i3 += 1)
            if (t3[i3].post.indexOf(o2) !== -1) {
              let t4 = i3 - a2 + 1;
              r2.push(e5.buildFrom(n2.id, t4)), a2 = i3;
              break;
            }
        }
      }
    }), typeof e4 == "number" ? (r2 = r2[e4] ? [r2[e4]] : [], new t2(r2, this, this.world)) : new t2(r2, this, this.world);
  }, e3.prototype.quotes = e3.prototype.quotations, e3;
};
var po = function(e3, t2) {
  let r2 = e3.verb, a2 = r2.text("reduced");
  if (r2.has("#Infinitive"))
    return a2;
  let n2 = null;
  return r2.has("#PastTense") ? n2 = "PastTense" : r2.has("#Gerund") ? n2 = "Gerund" : r2.has("#PresentTense") ? n2 = "PresentTense" : r2.has("#Participle") ? n2 = "Participle" : r2.has("#Actor") && (n2 = "Actor"), t2.transforms.toInfinitive(a2, t2, n2);
};
var mo = function(e3) {
  let t2 = e3.verb;
  if (t2.has("(are|were|does)") || e3.auxiliary.has("(are|were|does)"))
    return true;
  let r2 = function(e4) {
    return e4.lookBehind("#Noun+").last();
  }(t2);
  return !r2.has("(he|she|many|both)") && (!!r2.has("(we|they|you|i)") || !r2.has("#Person") && (!!r2.has("#Plural") || !r2.has("#Singular") && (!t2.has("(is|am|do|was)") && (!(e3.auxiliary.has("(is|am|do|was)") && !e3.negative.found) && null))));
};
const fo = po, bo = mo;
var yo = function(e3) {
  let t2 = e3.lookBehind(), r2 = t2.nouns(null, {keep_anaphora: true}).last();
  return r2.found || (r2 = t2.match("(that|this|each)").last(), r2 = r2.tag("#Noun").nouns()), r2;
};
const vo = yo;
const wo = mo;
const ko = po, Ao = (e3) => {
  let t2 = false, r2 = wo(e3), a2 = e3.negative.found;
  e3.verb.lookBehind("i (#Adverb|#Verb)?$").found && (t2 = true);
  let n2 = {PastTense: "was", PresentTense: "is", FutureTense: "will be", Infinitive: "is", Gerund: "being", Actor: "", PerfectTense: "been", Pluperfect: "been"};
  return r2 && (n2.PastTense = "were", n2.PresentTense = "are", n2.Infinitive = "are"), t2 === true && (n2.PastTense = "was", n2.PresentTense = "am", n2.Infinitive = "am"), a2 && (n2.PastTense += " not", n2.PresentTense += " not", n2.FutureTense = "will not be", n2.Infinitive += " not", n2.PerfectTense = "not " + n2.PerfectTense, n2.Pluperfect = "not " + n2.Pluperfect, n2.Gerund = "not " + n2.Gerund), n2;
}, Do = function(e3) {
  let t2 = e3.verb.text();
  return {PastTense: t2 + " have", PresentTense: t2, FutureTense: t2, Infinitive: t2};
}, $o = mo;
var Po = function(e3, t2) {
  let r2 = e3.verb;
  if (r2.has("#Copula") || r2.out("normal") === "be" && e3.auxiliary.has("will"))
    return Ao(e3);
  if (e3.auxiliary.has("are") && r2.has("#Gerund")) {
    let r3 = e3.original.clone(), a3 = r3.clone().replace("are", "were"), n3 = r3.clone().replace("are", "will be"), i3 = ko(e3, t2);
    return {PastTense: a3.text(), PresentTense: r3.text(), FutureTense: n3.text(), Infinitive: i3};
  }
  if (r2.has("#Modal"))
    return Do(e3);
  let a2 = ko(e3, t2);
  if (!a2)
    return {};
  let n2 = t2.transforms.conjugate(a2, t2);
  n2.Infinitive = a2;
  let i2 = $o(e3);
  i2 === true && (n2.PresentTense = n2.Infinitive);
  let o2 = e3.verb.termList(0).hasHyphen();
  if (e3.particle.found) {
    let t3 = e3.particle.text(), r3 = o2 === true ? "-" : " ";
    Object.keys(n2).forEach((e4) => n2[e4] += r3 + t3);
  }
  const s2 = e3.negative.found;
  return n2.FutureTense = n2.FutureTense || "will " + n2.Infinitive, s2 && (n2.PastTense = "did not " + n2.Infinitive, n2.FutureTense = "will not " + n2.Infinitive, i2 ? (n2.PresentTense = "do not " + n2.Infinitive, n2.Infinitive = "do not " + n2.Infinitive) : (n2.PresentTense = "does not " + n2.Infinitive, n2.Infinitive = "does not " + n2.Infinitive), n2.Gerund = "not " + n2.Gerund), n2;
};
const Eo = Po;
var Ho = {useParticiple: function(e3) {
  return !!e3.auxiliary.has("(could|should|would|may|can|must)") || (!!e3.auxiliary.has("am .+? being") || !!e3.auxiliary.has("had .+? been"));
}, toParticiple: function(e3, t2) {
  if (e3.auxiliary.has("(have|had)") && e3.verb.has("#Participle"))
    return;
  let r2 = Eo(e3, t2), a2 = r2.Participle || r2.PastTense;
  a2 && e3.verb.replaceWith(a2, false), e3.auxiliary.has("am .+? being") && (e3.auxiliary.remove("am"), e3.auxiliary.replace("being", "have been")), e3.auxiliary.has("have") || e3.auxiliary.append("have"), e3.verb.tag("Participle", "toParticiple"), e3.auxiliary.replace("can", "could"), e3.auxiliary.replace("be have", "have been"), e3.auxiliary.replace("not have", "have not"), e3.auxiliary.tag("Auxiliary");
}};
const jo = function(e3, t2) {
  let r2 = e3.verb;
  if (!e3.negative.found) {
    if (e3.auxiliary.found)
      return e3.auxiliary.eq(0).append("not"), void (e3.auxiliary.has("#Modal have not") && e3.auxiliary.replace("have not", "not have"));
    if (r2.has("(#Copula|will|has|had|do)"))
      r2.append("not");
    else {
      if (r2.has("#PastTense")) {
        let a2 = fo(e3, t2);
        return r2.replaceWith(a2, true), void r2.prepend("did not");
      }
      if (r2.has("#PresentTense")) {
        let a2 = fo(e3, t2);
        return r2.replaceWith(a2, true), void (bo(e3) ? r2.prepend("do not") : r2.prepend("does not"));
      }
      if (r2.has("#Gerund")) {
        let a2 = fo(e3, t2);
        return r2.replaceWith(a2, true), void r2.prepend("not");
      }
      bo(e3) ? r2.prepend("does not") : r2.prepend("do not");
    }
  }
}, No = function(e3) {
  let t2 = {adverb: e3.match("#Adverb+"), negative: e3.match("#Negative"), auxiliary: e3.match("#Auxiliary+").not("(#Negative|#Adverb)"), particle: e3.match("#Particle"), verb: e3.match("#Verb+").not("(#Adverb|#Negative|#Auxiliary|#Particle)"), original: e3, subject: vo(e3)};
  if (t2.verb.has("(#PresentTense|#PastTense|#Infinitive) #Gerund$") && (t2.verb = t2.verb.not("#Gerund$")), !t2.verb.found)
    return Object.keys(t2).forEach((e4) => {
      t2[e4] = t2[e4].not(".");
    }), t2.verb = e3, t2;
  if (t2.adverb && t2.adverb.found) {
    let r2 = t2.adverb.text("reduced") + "$";
    e3.has(r2) && (t2.adverbAfter = true);
  }
  return t2;
}, xo = mo, Fo = yo, Co = Po, {toParticiple: Bo, useParticiple: Go} = Ho, zo = function(e3) {
  return e3.auxiliary.remove("(will|are|am|being)"), e3.auxiliary.remove("(did|does)"), e3.auxiliary.remove("(had|has|have)"), e3.particle.remove(), e3.negative.remove(), e3;
};
const Io = {json: function(e3) {
  let t2 = null;
  typeof e3 == "number" && (t2 = e3, e3 = null), e3 = e3 || {text: true, normal: true, trim: true, terms: true};
  let r2 = [];
  return this.forEach((t3) => {
    let a2 = t3.json(e3)[0], n2 = No(t3);
    a2.parts = {}, Object.keys(n2).forEach((e4) => {
      n2[e4] && n2[e4].isA === "Doc" ? a2.parts[e4] = n2[e4].text("normal") : a2.parts[e4] = n2[e4];
    }), a2.isNegative = t3.has("#Negative"), a2.conjugations = Co(n2, this.world), r2.push(a2);
  }), t2 !== null ? r2[t2] : r2;
}, adverbs: function() {
  let e3 = [];
  this.forEach((t3) => {
    let r2 = No(t3).adverb;
    r2.found && (e3 = e3.concat(r2.list));
  });
  let t2 = this.lookBehind("#Adverb+$");
  return t2.found && (e3 = t2.list.concat(e3)), t2 = this.lookAhead("^#Adverb+"), t2.found && (e3 = e3.concat(t2.list)), this.buildFrom(e3);
}, isPlural: function() {
  let e3 = [];
  return this.forEach((t2) => {
    let r2 = No(t2);
    xo(r2, this.world) === true && e3.push(t2.list[0]);
  }), this.buildFrom(e3);
}, isSingular: function() {
  let e3 = [];
  return this.forEach((t2) => {
    let r2 = No(t2);
    xo(r2, this.world) === false && e3.push(t2.list[0]);
  }), this.buildFrom(e3);
}, conjugate: function() {
  let e3 = [];
  return this.forEach((t2) => {
    let r2 = No(t2), a2 = Co(r2, this.world);
    e3.push(a2);
  }), e3;
}, toPastTense: function() {
  return this.forEach((e3) => {
    let t2 = No(e3);
    if (Go(t2))
      return void Bo(t2, this.world);
    if (e3.has("#Imperative"))
      return;
    if (e3.has("be") && e3.lookBehind("to$").found)
      return;
    if (t2.verb.has("#Gerund") && t2.auxiliary.has("(is|will|was)"))
      return void e3.replace("is", "was");
    let r2 = Co(t2, this.world).PastTense;
    r2 && (t2 = zo(t2), t2.verb.replaceWith(r2, false), t2.auxiliary.remove("(do|did|will)"));
  }), this;
}, toPresentTense: function() {
  return this.forEach((e3) => {
    if (e3.has("#Imperative"))
      return;
    let t2 = No(e3), r2 = Co(t2, this.world), a2 = r2.PresentTense;
    if (e3.lookBehind("(i|we) (#Adverb|#Verb)?$").found && (a2 = r2.Infinitive), a2) {
      if (t2.auxiliary.has("(have|had) been"))
        return t2.auxiliary.replace("(have|had) been", "am being"), void (r2.Particle && (a2 = r2.Particle || r2.PastTense));
      t2.verb.replaceWith(a2, false), t2.verb.tag("PresentTense"), t2 = zo(t2), t2.auxiliary.remove("#Modal"), t2.auxiliary.remove("(do|did|will)");
    }
  }), this;
}, toFutureTense: function() {
  return this.forEach((e3) => {
    let t2 = No(e3);
    if (Go(t2))
      return;
    if (e3.has("#Imperative"))
      return;
    let r2 = Co(t2, this.world).FutureTense;
    r2 && (t2 = zo(t2), t2.auxiliary.remove("#Modal"), t2.verb.replaceWith(r2, false), t2.verb.tag("FutureTense"), t2.auxiliary.remove("(do|did|will)"));
  }), this;
}, toInfinitive: function() {
  return this.forEach((e3) => {
    let t2 = No(e3), r2 = Co(t2, this.world).Infinitive;
    r2 && (e3.replaceWith(r2, false), e3.tag("Infinitive"));
  }), this;
}, toGerund: function() {
  return this.forEach((e3) => {
    let t2 = No(e3), r2 = Co(t2, this.world).Gerund;
    r2 && (e3.replaceWith(r2, false), e3.tag("Gerund"));
  }), this;
}, toParticiple: function() {
  return this.forEach((e3) => {
    let t2 = No(e3), r2 = !t2.auxiliary.found;
    Bo(t2, this.world), r2 && (t2.verb.prepend(t2.auxiliary.text()), t2.auxiliary.remove());
  }), this;
}, isNegative: function() {
  return this.if("#Negative");
}, isPositive: function() {
  return this.ifNo("#Negative");
}, isImperative: function() {
  return this.if("#Imperative");
}, toNegative: function() {
  return this.list.forEach((e3) => {
    let t2 = this.buildFrom([e3]), r2 = No(t2);
    jo(r2, t2.world);
  }), this;
}, toPositive: function() {
  let e3 = this.match("do not #Verb");
  return e3.found && e3.remove("do not"), this.remove("#Negative");
}, subject: function() {
  let e3 = [];
  return this.forEach((t2) => {
    let r2 = Fo(t2);
    r2.list[0] && e3.push(r2.list[0]);
  }), this.buildFrom(e3);
}};
const Oo = Ia, To = [Ji, Si, _i, Ki, qi, io, lo, uo, go, function(e3) {
  class t2 extends e3 {
  }
  return Object.assign(t2.prototype, Io), t2.prototype.negate = t2.prototype.toNegative, e3.prototype.verbs = function(e4) {
    let r2 = this.match("(#Adverb|#Auxiliary|#Verb|#Negative|#Particle)+");
    r2 = r2.not("^#Adverb+"), r2 = r2.not("#Adverb+$");
    let a2 = r2.match("(#Adverb && @hasComma) #Adverb"), n2 = r2.not(a2).splitAfter("@hasComma");
    return n2 = n2.concat(a2), n2.sort("index"), n2 = n2.if("#Verb"), n2.has("(is|was)$") && (n2 = n2.splitBefore("(is|was)$")), n2.has("#PresentTense #Adverb #PresentTense") && (n2 = n2.splitBefore("#Adverb #PresentTense")), typeof e4 == "number" && (n2 = n2.get(e4)), new t2(n2.list, this, this.world);
  }, e3;
}, function(e3) {
  class t2 extends e3 {
  }
  return e3.prototype.people = function(e4) {
    let r2 = this.splitAfter("@hasComma");
    return r2 = r2.match("#Person+"), typeof e4 == "number" && (r2 = r2.get(e4)), new t2(r2.list, this, this.world);
  }, e3;
}];
const Vo = {misc: Ga, selections: Ia}, Mo = Mi, Jo = xt, Lo = function(e3) {
  return Object.keys(Oo).forEach((t2) => e3.prototype[t2] = Oo[t2]), To.forEach((t2) => t2(e3)), e3;
};
class So {
  constructor(e3, t2, r2) {
    this.list = e3, Object.defineProperty(this, "from", {enumerable: false, value: t2, writable: true}), r2 === void 0 && t2 !== void 0 && (r2 = t2.world), Object.defineProperty(this, "world", {enumerable: false, value: r2, writable: true}), Object.defineProperty(this, "_cache", {enumerable: false, writable: true, value: {}}), Object.defineProperty(this, "found", {get: () => this.list.length > 0}), Object.defineProperty(this, "length", {get: () => this.list.length}), Object.defineProperty(this, "isA", {get: () => "Doc"});
  }
  tagger() {
    return Mo(this);
  }
  pool() {
    return this.list.length > 0 ? this.list[0].pool : this.all().list[0].pool;
  }
}
So.prototype.buildFrom = function(e3) {
  return e3 = e3.map((e4) => e4.clone(true)), new So(e3, this, this.world);
}, So.prototype.fromText = function(e3) {
  let t2 = Jo(e3, this.world, this.pool());
  return this.buildFrom(t2);
}, Object.assign(So.prototype, Vo.misc), Object.assign(So.prototype, Vo.selections), Lo(So);
const _o = {untag: "unTag", and: "match", notIf: "ifNo", only: "if", onlyIf: "if"};
Object.keys(_o).forEach((e3) => So.prototype[e3] = So.prototype[_o[e3]]);
const Ko = Va;
const qo = xt, Wo = zt, Ro = So, Uo = nt, Qo = ne, Zo = ot, Xo = function(e3) {
  let t2 = e3.termList();
  return Ko(t2, e3.world), e3.world.taggers.forEach((t3) => {
    t3(e3);
  }), e3;
}, Yo = _e;
var es = function e2(t2) {
  let r2 = t2;
  const a2 = function(e3 = "", t3) {
    t3 && r2.addWords(t3);
    let a3 = qo(e3, r2), n2 = new Ro(a3, null, r2);
    return n2.tagger(), n2;
  };
  return a2.tokenize = function(e3 = "", t3) {
    let a3 = r2;
    t3 && (a3 = a3.clone(), a3.words = {}, a3.addWords(t3));
    let n2 = qo(e3, a3), i2 = new Ro(n2, null, a3);
    return (t3 || i2.world.taggers.length > 0) && Xo(i2), i2;
  }, a2.extend = function(e3) {
    return e3(Ro, r2, this, Uo, Qo, Zo), this;
  }, a2.fromJSON = function(e3) {
    let t3 = Wo(e3, r2);
    return new Ro(t3, null, r2);
  }, a2.clone = function() {
    return e2(r2.clone());
  }, a2.verbose = function(e3 = true) {
    return r2.verbose(e3), this;
  }, a2.world = function() {
    return r2;
  }, a2.parseMatch = function(e3, t3) {
    return Yo(e3, t3);
  }, a2.version = "13.11.4", a2.import = a2.load, a2.plugin = a2.extend, a2;
}(new Rr());

export default es;
