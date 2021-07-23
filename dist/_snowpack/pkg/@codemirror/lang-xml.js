import { C as ContextTracker, E as ExternalTokenizer, P as Parser } from '../common/index.es-1a952cf2.js';
import { N as NodeProp } from '../common/tree.es-a8ccfba9.js';
import { L as LezerLanguage, d as indentNodeProp, e as foldNodeProp, s as syntaxTree } from '../common/index-a4726552.js';
import { s as styleTags, t as tags } from '../common/index-3ba858a0.js';
import '../common/process-e9e98960.js';
import '../common/index-b03e5d4e.js';
import '../common/index-3b638331.js';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const StartTag = 1,
  StartCloseTag = 2,
  mismatchedStartCloseTag = 3,
  incompleteStartCloseTag = 4,
  commentContent = 35,
  piContent = 36,
  cdataContent = 37,
  Element = 9,
  OpenTag = 11;

/* Hand-written tokenizer for XML tag matching. */

function nameChar(ch) {
  return ch == 45 || ch == 46 || ch == 58 || ch >= 65 && ch <= 90 || ch == 95 || ch >= 97 && ch <= 122 || ch >= 161
}

function isSpace(ch) {
  return ch == 9 || ch == 10 || ch == 13 || ch == 32
}

let cachedName = null, cachedInput = null, cachedPos = 0;
function tagNameAfter(input, pos) {
  if (cachedPos == pos && cachedInput == input) return cachedName
  let next = input.get(pos);
  while (isSpace(next)) next = input.get(++pos);
  let start = pos;
  while (nameChar(next)) next = input.get(++pos);
  // Undefined to signal there's a <? or <!, null for just missing
  cachedInput = input; cachedPos = pos;
  return cachedName = pos > start ? input.read(start, pos).toLowerCase() : null
}

function ElementContext(name, parent) {
  this.name = name;
  this.parent = parent;
  this.hash = parent ? parent.hash : 0;
  for (let i = 0; i < name.length; i++) this.hash += (this.hash << 4) + name.charCodeAt(i) + (name.charCodeAt(i) << 8);
}

const elementContext = new ContextTracker({
  start: null,
  shift(context, term, input, stack) {
    return term == StartTag ? new ElementContext(tagNameAfter(input, stack.pos) || "", context) : context
  },
  reduce(context, term) {
    return term == Element && context ? context.parent : context
  },
  reuse(context, node, input, stack) {
    let type = node.type.id;
    return type == StartTag || type == OpenTag
      ? new ElementContext(tagNameAfter(input, stack.pos - node.length + 1) || "", context) : context
  },
  hash(context) { return context ? context.hash : 0 },
  strict: false
});

const startTag = new ExternalTokenizer((input, token, stack) => {
  let pos = token.start;
  if (input.get(pos++) != 60 /* '<' */) return
  let next = input.get(pos);
  if (next == 47 /* '/' */) {
    pos++;
    let name = tagNameAfter(input, pos);
    if (!name) return token.accept(incompleteStartCloseTag, pos)
    if (stack.context && name == stack.context.name) return token.accept(StartCloseTag, pos)
    for (let cx = stack.context; cx; cx = cx.parent) if (cx.name == name) return
    token.accept(mismatchedStartCloseTag, pos);
  } else if (next != 33 /* '!' */ && next != 63 /* '?' */) {
    return token.accept(StartTag, pos)
  }
});

function scanTo(type, end) {
  return new ExternalTokenizer((input, token) => {
    let pos = token.start, endPos = 0;
    for (;;) {
      let next = input.get(pos);
      if (next < 0) break
      pos++;
      if (next == end.charCodeAt(endPos)) {
        endPos++;
        if (endPos == end.length) { pos -= end.length; break }
      } else {
        endPos = 0;
      }
    }
    if (pos > token.start) token.accept(type, pos);
  })
}

const commentContent$1 = scanTo(commentContent, "-->");
const piContent$1 = scanTo(piContent, "?>");
const cdataContent$1 = scanTo(cdataContent, "?>");

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = Parser.deserialize({
  version: 13,
  states: "-OOQOaOOOcObO'#CbOkOdO'#CcOOOP'#Cu'#CuOsOaO'#DSO!XOaOOOOOQ'#Cv'#CvO!aObO,58|OOOP,58|,58|OOOS'#Cw'#CwO!iOdO,58}OOOP,58},58}OOOP-E6s-E6sO!qO`O'#CgO!yOqO'#CeOOOP'#Ce'#CeO#kOaO'#CxQ#|OPOOO$ROaOOOOOQ-E6t-E6tOOOP1G.h1G.hOOOS-E6u-E6uOOOP1G.i1G.iOOOO'#Cy'#CyO$aO`O,59RO$iO!bO,59RO$wOhO'#CpO%PO`O'#CqOOOP'#D['#D[OOOP'#C|'#C|O!yOqO,59PO%XO`O'#CrOOOP,59P,59POOOP,59d,59dOOOP-E6v-E6vO#|OPOOOOOO-E6w-E6wO%aO!bO1G.mO%aO!bO1G.mO%oO`O'#CiO%wO!bO'#CzO&VO!bO1G.mOOOP1G.m1G.mOOOP1G.z1G.zOOOW'#C}'#C}O&bOhO,59[OOOP,59[,59[O&jO`O,59]O&rO`O,59]OOOP-E6z-E6zOOOP1G.k1G.kO&zO`O,59^O'SO`O,59^O'[O!bO7+$XO'jO!bO7+$XOOOP7+$X7+$XOOOP7+$f7+$fO'uO`O,59TO'}O`O,59TO(VO!bO,59fOOOO-E6x-E6xOOOW-E6{-E6{OOOP1G.v1G.vO(eO`O1G.wO(eO`O1G.wOOOP1G.w1G.wO(mO`O1G.xO(mO`O1G.xOOOP1G.x1G.xO(uO!bO<<GsOOOP<<Gs<<GsOOOP<<HQ<<HQO'}O`O1G.oO'}O`O1G.oO)QO#tO'#ClOOOO1G.o1G.oO)`O`O7+$cOOOP7+$c7+$cO)hO`O7+$dOOOP7+$d7+$dOOOPAN=_AN=_OOOPAN=lAN=lO'}O`O7+$ZOOOO7+$Z7+$ZOOOO'#C{'#C{O)pO#tO,59WOOOO,59W,59WOOOP<<G}<<G}OOOP<<HO<<HOOOOO<<Gu<<GuOOOO-E6y-E6yOOOO1G.r1G.r",
  stateData: "*O~OxPOyRO{QOPvPWvP~OsUOwWO~OtXOzZO~OxPOyRO{QOPvXWvXrvX~OP]OWbO~OsUOwdO~OtXOzfO~O[iOygO~OP]OQoORkOSlOalOblOclOxPO{QO!QjO~OxPOyRO{QOPvPrvP~OP]O~OxPOyRO{QOPvP~O[uOygO~OYzO^wOg{OygO~Ou|O!P!OO~O[!QOygO~O[!UOygO~OY!XO^wOg!YOygO~O_![OygO~OygOYnX^nXgnX~OY!XO^wOg!YO~Ou|O!P!`O~O[!aOygO~OY!cOygO~O[!dOygO~OY!fOygO~OY!hO^wOg!iOygO~OY!hO^wOg!iO~O_!jOygO~OygO|!lO~OygOYna^nagna~OY!oOygO~OY!qOygO~OY!rO^wOg!sO~Oa!vOb!vO|!xO}!vO~OY!yOygO~OY!zOygO~Oa!vOb!vO|!}O}!vO~O",
  goto: "&R!PPPPPPP!Q!QP![P!eP!lPP!uPPP!W!W#PP#V#^#f#l#r#y%R%b%h%nPPPP%tPPPPPPP%}WROS`bTl^nU`TasTl^nZ^T^ans_xiuvy!V!W!gQ!m![S!u!j!kR!{!tQp^R!SnZ_T^ansUSO`bR[SQVPRcVQYQReYSaTsRraQh]jthv!P!T!V!Z!]!b!e!k!n!p!tQviQ!PkQ!ToQ!VuQ!ZwQ!]xQ!b!QQ!e!UQ!k![Q!n!aQ!p!dR!t!jQyiS!WuvU!^y!W!gR!g!VQ!w!lR!|!wQn^R!RnQ}jR!_}QTOQq`RsbTm^n",
  nodeNames: "⚠ StartTag StartCloseTag StartCloseTag StartCloseTag Document Comment ProcessingInst DoctypeDecl Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue EntityReference CharacterReference Text Cdata MismatchedCloseTag CloseTag SelfCloseEndTag SelfClosingTag",
  maxTerm: 48,
  context: elementContext,
  nodeProps: [
    [NodeProp.closedBy, 1,"SelfCloseEndTag EndTag",11,"CloseTag"],
    [NodeProp.openedBy, 10,"StartTag StartCloseTag",22,"OpenTag",23,"StartTag"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "Bk~R!WOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs&tsv$kvw'Uw}$k}!O(q!O!P$k!P!Q*n!Q![$k![!]+z!]!^$k!^!_/s!_!`=i!`!a>U!a!b>q!b!c$k!c!}+z!}#P$k#P#Q?}#Q#R$k#R#S+z#S#T$k#T#o+z#o%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U$k4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:jAz;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$kY$rUcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$kQ%ZRcQOv%Uw!^%U!_~%UW%iR}WOr%dsv%dw~%d_%{]cQ}WyTOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs%Usv$kw!^$k!^!_%d!_~$kZ&{R|XcQOv%Uw!^%U!_~%U~'XTOp'hqs'hst(Pt!]'h!^~'h~'kTOp'hqs'ht!]'h!]!^'z!^~'h~(POa~~(SROp(]q!](]!^~(]~(`SOp(]q!](]!]!^(l!^~(]~(qOb~Z(xWcQ}WOr$krs%Usv$kw}$k}!O)b!O!^$k!^!_%d!_~$kZ)iWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a*R!a~$kZ*[UwPcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$k^*uWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a+_!a~$k^+hUgScQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$k_,V}^S[PcQ}WOr$krs%Usv$kw}$k}!O+z!O!P+z!P!Q$k!Q![+z![!]+z!]!^$k!^!_%d!_!c$k!c!}+z!}#R$k#R#S+z#S#T$k#T#o+z#o$}$k$}%O+z%O%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U+z4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Je$k$Je$Jg+z$Jg$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:j/S;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$k_/ZWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_;=`$k;=`<%l+z<%l~$kZ/xU}WOq%dqr0[sv%dw!a%d!a!b=X!b~%dZ0aZ}WOr%dsv%dw}%d}!O1S!O!f%d!f!g1x!g!}%d!}#O5s#O#W%d#W#X:k#X~%dZ1XT}WOr%dsv%dw}%d}!O1h!O~%dZ1oRxR}WOr%dsv%dw~%dX1}T}WOr%dsv%dw!q%d!q!r2^!r~%dX2cT}WOr%dsv%dw!e%d!e!f2r!f~%dX2wT}WOr%dsv%dw!v%d!v!w3W!w~%dX3]T}WOr%dsv%dw!{%d!{!|3l!|~%dX3qT}WOr%dsv%dw!r%d!r!s4Q!s~%dX4VT}WOr%dsv%dw!g%d!g!h4f!h~%dX4kV}WOr4frs5Qsv4fvw5Qw!`4f!`!a5c!a~4fP5TRO!`5Q!`!a5^!a~5QP5cOWPX5jRWP}WOr%dsv%dw~%dY5xV}WOr%dsv%dw!e%d!e!f6_!f#V%d#V#W8w#W~%dY6dT}WOr%dsv%dw!f%d!f!g6s!g~%dY6xT}WOr%dsv%dw!c%d!c!d7X!d~%dY7^T}WOr%dsv%dw!v%d!v!w7m!w~%dY7rT}WOr%dsv%dw!c%d!c!d8R!d~%dY8WT}WOr%dsv%dw!}%d!}#O8g#O~%dY8nR}W!QQOr%dsv%dw~%dY8|T}WOr%dsv%dw#W%d#W#X9]#X~%dY9bT}WOr%dsv%dw#T%d#T#U9q#U~%dY9vT}WOr%dsv%dw#h%d#h#i:V#i~%dY:[T}WOr%dsv%dw#T%d#T#U8R#U~%dX:pT}WOr%dsv%dw#c%d#c#d;P#d~%dX;UT}WOr%dsv%dw#V%d#V#W;e#W~%dX;jT}WOr%dsv%dw#h%d#h#i;y#i~%dX<OT}WOr%dsv%dw#m%d#m#n<_#n~%dX<dT}WOr%dsv%dw#d%d#d#e<s#e~%dX<xT}WOr%dsv%dw#X%d#X#Y4f#Y~%dZ=`R{R}WOr%dsv%dw~%dZ=rU_PcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$k_>_UYTcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$kZ>xWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a?b!a~$kZ?kUzPcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$kZ@UWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_#P$k#P#Q@n#Q~$kZ@uWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!aA_!a~$kZAhU!PPcQ}WOr$krs%Usv$kw!^$k!^!_%d!_~$k_BRWcQ}WOr$krs%Usv$kw!^$k!^!_%d!_;=`$k;=`<%l+z<%l~$k",
  tokenizers: [startTag, commentContent$1, piContent$1, cdataContent$1, 0, 1, 2, 3],
  topRules: {"Document":[0,5]},
  tokenPrec: 0
});

function tagName(doc, tag) {
    let name = tag && tag.getChild("TagName");
    return name ? doc.sliceString(name.from, name.to) : "";
}
function elementName(doc, tree) {
    let tag = tree && tree.firstChild;
    return !tag || tag.name != "OpenTag" ? "" : tagName(doc, tag);
}
function attrName(doc, tag, pos) {
    let attr = tag && tag.getChildren("Attribute").find(a => a.from <= pos && a.to >= pos);
    let name = attr && attr.getChild("AttributeName");
    return name ? doc.sliceString(name.from, name.to) : "";
}
function findParentElement(tree) {
    for (let cur = tree && tree.parent; cur; cur = cur.parent)
        if (cur.name == "Element")
            return cur;
    return null;
}
function findLocation(state, pos) {
    var _a;
    let at = syntaxTree(state).resolve(pos, -1), inTag = null;
    for (let cur = at; !inTag && cur.parent; cur = cur.parent)
        if (cur.name == "OpenTag" || cur.name == "CloseTag" || cur.name == "SelfClosingTag" || cur.name == "MismatchedCloseTag")
            inTag = cur;
    if (inTag && (inTag.to > pos || inTag.lastChild.type.isError)) {
        let elt = inTag.parent;
        if (at.name == "TagName")
            return inTag.name == "CloseTag" || inTag.name == "MismatchedCloseTag"
                ? { type: "closeTag", from: at.from, context: elt }
                : { type: "openTag", from: at.from, context: findParentElement(elt) };
        if (at.name == "AttributeName")
            return { type: "attrName", from: at.from, context: inTag };
        if (at.name == "AttributeValue")
            return { type: "attrValue", from: at.from, context: inTag };
        let before = at == inTag || at.name == "Attribute" ? at.childBefore(pos) : at;
        if ((before === null || before === void 0 ? void 0 : before.name) == "StartTag")
            return { type: "openTag", from: pos, context: findParentElement(elt) };
        if ((before === null || before === void 0 ? void 0 : before.name) == "StartCloseTag" && before.to <= pos)
            return { type: "closeTag", from: pos, context: elt };
        if ((before === null || before === void 0 ? void 0 : before.name) == "Is")
            return { type: "attrValue", from: pos, context: inTag };
        if (before)
            return { type: "attrName", from: pos, context: inTag };
        return null;
    }
    else if (at.name == "StartCloseTag") {
        return { type: "closeTag", from: pos, context: at.parent };
    }
    while (at.parent && at.to == pos && !((_a = at.lastChild) === null || _a === void 0 ? void 0 : _a.type.isError))
        at = at.parent;
    if (at.name == "Element" || at.name == "Text" || at.name == "Document")
        return { type: "tag", from: pos, context: at.name == "Element" ? at : findParentElement(at) };
    return null;
}
class Element$1 {
    constructor(spec, attrs, attrValues) {
        this.attrs = attrs;
        this.attrValues = attrValues;
        this.children = [];
        this.name = spec.name;
        this.completion = Object.assign(Object.assign({ type: "type" }, spec.completion || {}), { label: this.name });
        this.openCompletion = Object.assign(Object.assign({}, this.completion), { label: "<" + this.name });
        this.closeCompletion = Object.assign(Object.assign({}, this.completion), { label: "</" + this.name + ">", boost: 2 });
        this.closeNameCompletion = Object.assign(Object.assign({}, this.completion), { label: this.name + ">" });
        this.text = spec.textContent ? spec.textContent.map(s => ({ label: s, type: "text" })) : [];
    }
}
const Identifier = /^[:\-\.\w\u00b7-\uffff]*$/;
function attrCompletion(spec) {
    return Object.assign(Object.assign({ type: "property" }, spec.completion || {}), { label: spec.name });
}
function valueCompletion(spec) {
    return typeof spec == "string" ? { label: `"${spec}"`, type: "constant" }
        : /^"/.test(spec.label) ? spec
            : Object.assign(Object.assign({}, spec), { label: `"${spec.label}"` });
}
function completeFromSchema(eltSpecs, attrSpecs) {
    let allAttrs = [], globalAttrs = [];
    let attrValues = Object.create(null);
    for (let s of attrSpecs) {
        let completion = attrCompletion(s);
        allAttrs.push(completion);
        if (s.global)
            globalAttrs.push(completion);
        if (s.values)
            attrValues[s.name] = s.values.map(valueCompletion);
    }
    let allElements = [], topElements = [];
    let byName = Object.create(null);
    for (let s of eltSpecs) {
        let attrs = globalAttrs, attrVals = attrValues;
        if (s.attributes)
            attrs = attrs.concat(s.attributes.map(s => {
                if (typeof s == "string")
                    return allAttrs.find(a => a.label == s) || { label: s, type: "property" };
                if (s.values) {
                    if (attrVals == attrValues)
                        attrVals = Object.create(attrVals);
                    attrVals[s.name] = s.values.map(valueCompletion);
                }
                return attrCompletion(s);
            }));
        let elt = new Element$1(s, attrs, attrVals);
        byName[elt.name] = elt;
        allElements.push(elt);
        if (s.top)
            topElements.push(elt);
    }
    if (!topElements.length)
        topElements = allElements;
    for (let i = 0; i < allElements.length; i++) {
        let s = eltSpecs[i], elt = allElements[i];
        if (s.children) {
            for (let ch of s.children)
                if (byName[ch])
                    elt.children.push(byName[ch]);
        }
        else {
            elt.children = allElements;
        }
    }
    return cx => {
        var _a;
        let { doc } = cx.state, loc = findLocation(cx.state, cx.pos);
        if (!loc || (loc.type == "tag" && !cx.explicit))
            return null;
        let { type, from, context } = loc;
        if (type == "openTag") {
            let children = topElements;
            let parentName = elementName(doc, context);
            if (parentName) {
                let parent = byName[parentName];
                children = (parent === null || parent === void 0 ? void 0 : parent.children) || allElements;
            }
            return {
                from,
                options: children.map(ch => ch.completion),
                span: Identifier
            };
        }
        else if (type == "closeTag") {
            let parentName = elementName(doc, context);
            return parentName ? {
                from,
                to: cx.pos + (doc.sliceString(cx.pos, cx.pos + 1) == ">" ? 1 : 0),
                options: [((_a = byName[parentName]) === null || _a === void 0 ? void 0 : _a.closeNameCompletion) || { label: parentName + ">", type: "type" }],
                span: Identifier
            } : null;
        }
        else if (type == "attrName") {
            let parent = byName[tagName(doc, context)];
            return {
                from,
                options: (parent === null || parent === void 0 ? void 0 : parent.attrs) || globalAttrs,
                span: Identifier
            };
        }
        else if (type == "attrValue") {
            let attr = attrName(doc, context, from);
            if (!attr)
                return null;
            let parent = byName[tagName(doc, context)];
            let values = ((parent === null || parent === void 0 ? void 0 : parent.attrValues) || attrValues)[attr];
            if (!values || !values.length)
                return null;
            return {
                from,
                to: cx.pos + (doc.sliceString(cx.pos, cx.pos + 1) == '"' ? 1 : 0),
                options: values,
                span: /^"[^"]*"?$/
            };
        }
        else if (type == "tag") {
            let parentName = elementName(doc, context), parent = byName[parentName];
            let closing = [], last = context && context.lastChild;
            if (parentName && (!last || last.name != "CloseTag" || tagName(doc, last) != parentName))
                closing.push(parent ? parent.closeCompletion : { label: "</" + parentName + ">", type: "type", boost: 2 });
            let options = closing.concat(((parent === null || parent === void 0 ? void 0 : parent.children) || (context ? allElements : topElements)).map(e => e.openCompletion));
            if (context && (parent === null || parent === void 0 ? void 0 : parent.text.length)) {
                let openTag = context.firstChild;
                if (openTag.to > cx.pos - 20 && !/\S/.test(cx.state.sliceDoc(openTag.to, cx.pos)))
                    options = options.concat(parent.text);
            }
            return {
                from,
                options,
                span: /^<\/?[:\-\.\w\u00b7-\uffff]*$/
            };
        }
        else {
            return null;
        }
    };
}

/// A language provider based on the [Lezer XML
/// parser](https://github.com/lezer-parser/xml), extended with
/// highlighting and indentation information.
const xmlLanguage = LezerLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Element(context) {
                    let closed = /^\s*<\//.test(context.textAfter);
                    return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit);
                },
                "OpenTag CloseTag SelfClosingTag"(context) {
                    return context.column(context.node.from) + context.unit;
                }
            }),
            foldNodeProp.add({
                Element(subtree) {
                    let first = subtree.firstChild, last = subtree.lastChild;
                    if (!first || first.name != "OpenTag")
                        return null;
                    return { from: first.to, to: last.name == "CloseTag" ? last.from : subtree.to };
                }
            }),
            styleTags({
                AttributeValue: tags.string,
                Text: tags.content,
                "StartTag StartCloseTag EndTag SelfCloseEndTag": tags.angleBracket,
                TagName: tags.tagName,
                "MismatchedCloseTag/Tagname": [tags.tagName, tags.invalid],
                AttributeName: tags.propertyName,
                UnquotedAttributeValue: tags.string,
                Is: tags.definitionOperator,
                "EntityReference CharacterReference": tags.character,
                Comment: tags.blockComment,
                ProcessingInst: tags.processingInstruction,
                DoctypeDecl: tags.documentMeta,
                Cdata: tags.special(tags.string)
            })
        ]
    }),
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/
    }
});

export { completeFromSchema };
