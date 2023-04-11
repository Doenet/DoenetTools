import { C as ContextTracker, E as ExternalTokenizer, L as LRParser } from '../common/index-ed630892.js';
import { N as NodeProp } from '../common/index-3d578c67.js';
import { s as syntaxTree } from '../common/index-a6d35803.js';
import '../common/process-e9e98960.js';
import '../common/index-04f03c08.js';
import '../common/index-b1d6eef7.js';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const StartTag = 1,
  StartCloseTag = 2,
  MissingCloseTag = 3,
  mismatchedStartCloseTag = 4,
  incompleteStartCloseTag = 5,
  commentContent$1 = 36,
  piContent$1 = 37,
  cdataContent$1 = 38,
  Element = 10,
  OpenTag = 12;

/* Hand-written tokenizer for XML tag matching. */

function nameChar(ch) {
  return ch == 45 || ch == 46 || ch == 58 || ch >= 65 && ch <= 90 || ch == 95 || ch >= 97 && ch <= 122 || ch >= 161
}

function isSpace(ch) {
  return ch == 9 || ch == 10 || ch == 13 || ch == 32
}

let cachedName = null, cachedInput = null, cachedPos = 0;
function tagNameAfter(input, offset) {
  let pos = input.pos + offset;
  if (cachedInput == input && cachedPos == pos) return cachedName
  while (isSpace(input.peek(offset))) offset++;
  let name = "";
  for (;;) {
    let next = input.peek(offset);
    if (!nameChar(next)) break
    name += String.fromCharCode(next);
    offset++;
  }
  cachedInput = input; cachedPos = pos;
  return cachedName = name || null
}

function ElementContext(name, parent) {
  this.name = name;
  this.parent = parent;
  this.hash = parent ? parent.hash : 0;
  for (let i = 0; i < name.length; i++) this.hash += (this.hash << 4) + name.charCodeAt(i) + (name.charCodeAt(i) << 8);
}

const elementContext = new ContextTracker({
  start: null,
  shift(context, term, stack, input) {
    return term == StartTag ? new ElementContext(tagNameAfter(input, 1) || "", context) : context
  },
  reduce(context, term) {
    return term == Element && context ? context.parent : context
  },
  reuse(context, node, _stack, input) {
    let type = node.type.id;
    return type == StartTag || type == OpenTag
      ? new ElementContext(tagNameAfter(input, 1) || "", context) : context
  },
  hash(context) { return context ? context.hash : 0 },
  strict: false
});

const startTag = new ExternalTokenizer((input, stack) => {
  if (input.next != 60 /* '<' */) return
  input.advance();
  if (input.next == 47 /* '/' */) {
    input.advance();
    let name = tagNameAfter(input, 0);
    if (!name) return input.acceptToken(incompleteStartCloseTag)
    if (stack.context && name == stack.context.name) return input.acceptToken(StartCloseTag)
    for (let cx = stack.context; cx; cx = cx.parent) if (cx.name == name) return input.acceptToken(MissingCloseTag, -2)
    input.acceptToken(mismatchedStartCloseTag);
  } else if (input.next != 33 /* '!' */ && input.next != 63 /* '?' */) {
    return input.acceptToken(StartTag)
  }
}, {contextual: true});

function scanTo(type, end) {
  return new ExternalTokenizer(input => {
    for (let endPos = 0, len = 0;; len++) {
      if (input.next < 0) {
        if (len) input.acceptToken(type);
        break
      } 
      if (input.next == end.charCodeAt(endPos)) {
        endPos++;
        if (endPos == end.length) {
          if (len > end.length) input.acceptToken(type, 1 - end.length);
          break
        }
      } else {
        endPos = 0;
      }
      input.advance();
    }
  })
}

const commentContent = scanTo(commentContent$1, "-->");
const piContent = scanTo(piContent$1, "?>");
const cdataContent = scanTo(cdataContent$1, "]]>");

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = LRParser.deserialize({
  version: 13,
  states: "-OOQOaOOOcObO'#CcOkOdO'#CdOOOP'#Cv'#CvOsOaO'#DTO!XOaOOOOOQ'#Cw'#CwO!aObO,58}OOOP,58},58}OOOS'#Cx'#CxO!iOdO,59OOOOP,59O,59OOOOP-E6t-E6tO!qO`O'#ChO#kOqO'#CfOOOP'#Cf'#CfO#rOaO'#CyQ$TOPOOO$YOaOOOOOQ-E6u-E6uOOOP1G.i1G.iOOOS-E6v-E6vOOOP1G.j1G.jOOOO'#Cz'#CzO$hO`O,59SO$pO!bO,59SO%OOhO'#CqO%WO`O'#CrOOOP'#D]'#D]OOOP'#C}'#C}O%`OqO,59QO%gO`O'#CsOOOP,59Q,59QOOOP,59e,59eOOOP-E6w-E6wO$TOPOOOOOO-E6x-E6xO%oO!bO1G.nO%oO!bO1G.nO%}O`O'#CjO&VO!bO'#C{O&eO!bO1G.nOOOP1G.n1G.nOOOP1G.{1G.{OOOW'#DO'#DOO&pOhO,59]OOOP,59],59]O&xO`O,59^O'QO`O,59^OOOP-E6{-E6{OOOP1G.l1G.lO'YO`O,59_O'bO`O,59_O'jO!bO7+$YO'xO!bO7+$YOOOP7+$Y7+$YOOOP7+$g7+$gO(TO`O,59UO(]O`O,59UO(eO!bO,59gOOOO-E6y-E6yOOOW-E6|-E6|OOOP1G.w1G.wO(sO`O1G.xO(sO`O1G.xOOOP1G.x1G.xO({O`O1G.yO({O`O1G.yOOOP1G.y1G.yO)TO!bO<<GtOOOP<<Gt<<GtOOOP<<HR<<HRO(]O`O1G.pO(]O`O1G.pO)`O#tO'#CmOOOO1G.p1G.pO)nO`O7+$dOOOP7+$d7+$dO)vO`O7+$eOOOP7+$e7+$eOOOPAN=`AN=`OOOPAN=mAN=mO(]O`O7+$[OOOO7+$[7+$[OOOO'#C|'#C|O*OO#tO,59XOOOO,59X,59XOOOP<<HO<<HOOOOP<<HP<<HPOOOO<<Gv<<GvOOOO-E6z-E6zOOOO1G.s1G.s",
  stateData: "*^~OyPOzRO|QOPwPXwP~OtUOxWO~OuXO{ZO~OyPOzRO|QOPwXXwXswX~OP]OXbO~OtUOxdO~OuXO{fO~O]iOzgO~OP]OQoOSkOTlOblOclOdlOyPO|QO!RjO~ORpO~P!yOyPOzRO|QOPwPswP~OP]O~OyPOzRO|QOPwP~O]uOzgO~OZzO_wOh{OzgO~Ov|O!Q!OO~O]!QOzgO~OR!SO~P!yO]!UOzgO~OZ!XO_wOh!YOzgO~O`![OzgO~OzgOZoX_oXhoX~OZ!XO_wOh!YO~Ov|O!Q!`O~O]!aOzgO~OZ!cOzgO~O]!dOzgO~OZ!fOzgO~OZ!hO_wOh!iOzgO~OZ!hO_wOh!iO~O`!jOzgO~OzgO}!lO~OzgOZoa_oahoa~OZ!oOzgO~OZ!qOzgO~OZ!rO_wOh!sO~Ob!vOc!vO}!xO!O!vO~OZ!yOzgO~OZ!zOzgO~Ob!vOc!vO}!}O!O!vO~O",
  goto: "&S!QPPPPPPP!R!RP!]P!fP!mPP!vPPP!X!X#QP#W#_#g#m#s#z%S%c%i%oPPPP%uPPPPPPP&OWROS`bTl^nU`TasTl^nZ^T^ans_xiuvy!V!W!gQ!m![S!u!j!kR!{!tQp^R!SnZ_T^ansUSO`bR[SQVPRcVQYQReYSaTsRraQh]jthv!P!T!V!Z!]!b!e!k!n!p!tQviQ!PkQ!ToQ!VuQ!ZwQ!]xQ!b!QQ!e!UQ!k![Q!n!aQ!p!dR!t!jQyiS!WuvU!^y!W!gR!g!VQ!w!lR!|!wQn^R!RnQ}jR!_}QTOQq`RsbTm^n",
  nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Comment ProcessingInst DoctypeDecl Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue EntityReference CharacterReference Text Cdata MismatchedCloseTag CloseTag SelfCloseEndTag SelfClosingTag",
  maxTerm: 49,
  context: elementContext,
  nodeProps: [
    [NodeProp.closedBy, 1,"SelfCloseEndTag EndTag",12,"CloseTag MissingCloseTag"],
    [NodeProp.openedBy, 11,"StartTag StartCloseTag",23,"OpenTag",24,"StartTag"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "Az~R!WOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs&tsv$kvw'Uw}$k}!O(q!O!P$k!P!Q*n!Q![$k![!]+z!]!^$k!^!_/s!_!`=i!`!a>U!a!b>q!b!c$k!c!}+z!}#P$k#P#Q?}#Q#R$k#R#S+z#S#T$k#T#o+z#o%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U$k4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:j/S;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$kY$rUdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$kQ%ZRdQOv%Uw!^%U!_~%UW%iR!OWOr%dsv%dw~%d_%{]dQ!OWzTOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs%Usv$kw!^$k!^!_%d!_~$kZ&{R}XdQOv%Uw!^%U!_~%U~'XTOp'hqs'hst(Pt!]'h!^~'h~'kTOp'hqs'ht!]'h!]!^'z!^~'h~(POb~~(SROp(]q!](]!^~(]~(`SOp(]q!](]!]!^(l!^~(]~(qOc~Z(xWdQ!OWOr$krs%Usv$kw}$k}!O)b!O!^$k!^!_%d!_~$kZ)iWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a*R!a~$kZ*[UxPdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$k^*uWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a+_!a~$k^+hUhSdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$k_,V}_S]PdQ!OWOr$krs%Usv$kw}$k}!O+z!O!P+z!P!Q$k!Q![+z![!]+z!]!^$k!^!_%d!_!c$k!c!}+z!}#R$k#R#S+z#S#T$k#T#o+z#o$}$k$}%O+z%O%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U+z4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Je$k$Je$Jg+z$Jg$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:j/S;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$k_/ZWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_;=`$k;=`<%l+z<%l~$kZ/xU!OWOq%dqr0[sv%dw!a%d!a!b=X!b~%dZ0aZ!OWOr%dsv%dw}%d}!O1S!O!f%d!f!g1x!g!}%d!}#O5s#O#W%d#W#X:k#X~%dZ1XT!OWOr%dsv%dw}%d}!O1h!O~%dZ1oRyR!OWOr%dsv%dw~%dX1}T!OWOr%dsv%dw!q%d!q!r2^!r~%dX2cT!OWOr%dsv%dw!e%d!e!f2r!f~%dX2wT!OWOr%dsv%dw!v%d!v!w3W!w~%dX3]T!OWOr%dsv%dw!{%d!{!|3l!|~%dX3qT!OWOr%dsv%dw!r%d!r!s4Q!s~%dX4VT!OWOr%dsv%dw!g%d!g!h4f!h~%dX4kV!OWOr4frs5Qsv4fvw5Qw!`4f!`!a5c!a~4fP5TRO!`5Q!`!a5^!a~5QP5cOXPX5jRXP!OWOr%dsv%dw~%dY5xV!OWOr%dsv%dw!e%d!e!f6_!f#V%d#V#W8w#W~%dY6dT!OWOr%dsv%dw!f%d!f!g6s!g~%dY6xT!OWOr%dsv%dw!c%d!c!d7X!d~%dY7^T!OWOr%dsv%dw!v%d!v!w7m!w~%dY7rT!OWOr%dsv%dw!c%d!c!d8R!d~%dY8WT!OWOr%dsv%dw!}%d!}#O8g#O~%dY8nR!OW!RQOr%dsv%dw~%dY8|T!OWOr%dsv%dw#W%d#W#X9]#X~%dY9bT!OWOr%dsv%dw#T%d#T#U9q#U~%dY9vT!OWOr%dsv%dw#h%d#h#i:V#i~%dY:[T!OWOr%dsv%dw#T%d#T#U8R#U~%dX:pT!OWOr%dsv%dw#c%d#c#d;P#d~%dX;UT!OWOr%dsv%dw#V%d#V#W;e#W~%dX;jT!OWOr%dsv%dw#h%d#h#i;y#i~%dX<OT!OWOr%dsv%dw#m%d#m#n<_#n~%dX<dT!OWOr%dsv%dw#d%d#d#e<s#e~%dX<xT!OWOr%dsv%dw#X%d#X#Y4f#Y~%dZ=`R|R!OWOr%dsv%dw~%dZ=rU`PdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$k_>_UZTdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$kZ>xWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a?b!a~$kZ?kU{PdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$kZ@UWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_#P$k#P#Q@n#Q~$kZ@uWdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!aA_!a~$kZAhU!QPdQ!OWOr$krs%Usv$kw!^$k!^!_%d!_~$k",
  tokenizers: [startTag, commentContent, piContent, cdataContent, 0, 1, 2, 3],
  topRules: {"Document":[0,6]},
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
    let at = syntaxTree(state).resolveInner(pos, -1), inTag = null;
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

export { completeFromSchema };