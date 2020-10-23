import { configureHTML } from 'lezer-html';
import { LezerSyntax, indentNodeProp, delimitedIndent, continuedIndent, foldNodeProp } from '@codemirror/next/syntax';
import { styleTags } from '@codemirror/next/highlight';

//To Do
//1. Check imports
//2. Parse json to get tags
//3. Get global attrs
//4. Change html names to doenetml
//5. Remove js and css functionality

const Bool = ["true", "false"];
var Tags = require('../../docs/complete-docs.json');
const GlobalAttrs = {
  hide: Bool,
  disabled: Bool,
  modifyIndirectly: Bool,
  fixed: Bool,
  styleNumber: null,
  isResponse: Bool
};
const AllTags = Object.keys(Tags), GlobalAttrNames = Object.keys(GlobalAttrs);
function elementName(doc, tree) {
    let tag = tree.firstChild;
    if (!tag || tag.name != "OpenTag")
        return "";
    let name = tag.iterate({ enter: (type, from, to) => {
            return type.name == "TagName" ? doc.sliceString(from, to) : undefined;
        } });
    return name || "";
}
function findParentElement(tree, skip = false) {
    for (let cur = tree.parent; cur; cur = cur.parent)
        if (cur.name == "Element") {
            if (skip)
                skip = false;
            else
                return cur;
        }
    return null;
}
function allowedChildren(doc, tree) {
    let parent = findParentElement(tree, true);
    let parentInfo = parent ? Tags[elementName(doc, parent)] : null;
    return (parentInfo === null || parentInfo === void 0 ? void 0 : parentInfo.children) || AllTags;
}
function openTags(doc, tree) {
    let open = [];
    for (let parent = tree; parent = findParentElement(parent);) {
        let tagName = elementName(doc, parent);
        if (tagName && open.indexOf(tagName) < 0)
            open.push(tagName);
    }
    return open;
}
const identifier = /^[:\-\.\w\u00b7-\uffff]+$/;
function completeTag(state, tree, from, to, context) {
    let text = state.doc.sliceString(from, to).toLowerCase();
    let options = [];
    for (let tagName of allowedChildren(state.doc, tree))
        if (context.filter(tagName, text, true))
            options.push({ label: tagName, type: "type" });
    return { from, to, options, filterDownOn: identifier };
}
function completeCloseTag(state, tree, from, to, context) {
    let options = [], text = state.sliceDoc(from, to).toLowerCase();
    let end = /\s*>/.test(state.sliceDoc(to, to + 5)) ? "" : ">";
    for (let open of openTags(state.doc, tree))
        if (context.filter(open, text, true))
            options.push({ label: open, apply: open + end, type: "type" });
    return { from, to, options, filterDownOn: identifier };
}
function completeStartTag(state, tree, pos) {
    let options = [];
    for (let tagName of allowedChildren(state.doc, tree))
        options.push({ label: "<" + tagName, type: "type" });
    for (let open of openTags(state.doc, tree))
        options.push({ label: "</" + open + ">", type: "type" });
    return { from: pos, to: pos, options, filterDownOn: identifier };
}
function completeAttrName(state, tree, from, to, context) {
    let options = [];
    let elt = findParentElement(tree), info = elt ? Tags[elementName(state.doc, elt)] : null;
    let base = state.sliceDoc(from, to).toLowerCase();
    for (let attrName of (info && info.attrs ? Object.keys(info.attrs).concat(GlobalAttrNames) : GlobalAttrNames)) {
        if (context.filter(attrName, base, true))
            options.push({ label: attrName, type: "property" });
    }
    return { from, to, options, filterDownOn: identifier };
}
function completeAttrValue(state, tree, from, to, context) {
    var _a;
    let attrName = (_a = tree.parent) === null || _a === void 0 ? void 0 : _a.iterate({
        enter(type, from, to) {
            return type.name == "AttributeName" ? state.sliceDoc(from, to) : undefined;
        },
        from: tree.start,
        to: tree.parent.start
    });
    let options = [];
    if (attrName) {
        let attrs = GlobalAttrs[attrName];
        if (!attrs) {
            let elt = findParentElement(tree), info = elt ? Tags[elementName(state.doc, elt)] : null;
            attrs = (info === null || info === void 0 ? void 0 : info.attrs) && info.attrs[attrName];
        }
        if (attrs) {
            let base = state.sliceDoc(from, to).toLowerCase(), quoteStart = '"', quoteEnd = '"';
            if (/^['"]/.test(base)) {
                quoteStart = "";
                quoteEnd = state.sliceDoc(to, to + 1) == base[0] ? "" : base[0];
                base = base.slice(1);
                from++;
            }
            for (let value of attrs) {
                if (context.filter(value, base, true))
                    options.push({ label: value, apply: quoteStart + value + quoteEnd, type: "constant" });
            }
        }
    }
    return { from, to, options };
}
function completeDOENETML(context) {
    let { state, pos } = context, tree = state.tree.resolve(pos, -1);
    if (tree.name == "TagName" || tree.name == "MismatchedTagName") {
        return tree.parent && tree.parent.name == "CloseTag" ? completeCloseTag(state, tree, tree.start, pos, context)
            : completeTag(state, tree, tree.start, pos, context);
    }
    else if (tree.name == "StartTag") {
        return completeTag(state, tree, pos, pos, context);
    }
    else if (tree.name == "StartCloseTag") {
        return completeCloseTag(state, tree, pos, pos, context);
    }
    else if (context.explicit && (tree.name == "Element" || tree.name == "Text" || tree.name == "Document")) {
        return completeStartTag(state, tree, pos);
    }
    else if (context.explicit && (tree.name == "OpenTag" || tree.name == "SelfClosingTag") || tree.name == "AttributeName") {
        return completeAttrName(state, tree, tree.name == "AttributeName" ? tree.start : pos, pos, context);
    }
    else if (tree.name == "Is" || tree.name == "AttributeValue" || tree.name == "UnquotedAttributeValue") {
        return completeAttrValue(state, tree, tree.name == "Is" ? pos : tree.start, pos, context);
    }
    else {
        return null;
    }
}

/// A syntax provider based on the [Lezer HTML
/// parser](https://github.com/lezer-parser/html), wired up with the
/// JavaScript and CSS parsers to parse the content of `<script>` and
/// `<style>` tags.
const doenetmlSyntax = LezerSyntax.define(configureHTML([]
    ).withProps(indentNodeProp.add(type => {
    if (type.name == "Element")
        return delimitedIndent({ closing: "</", align: false });
    if (type.name == "OpenTag" || type.name == "CloseTag" || type.name == "SelfClosingTag")
        return continuedIndent();
    return undefined;
}), foldNodeProp.add({
    Element(subtree) {
        let first = subtree.firstChild, last = subtree.lastChild;
        if (!first || first.name != "OpenTag")
            return null;
        return { from: first.end, to: last.name == "CloseTag" ? last.start : subtree.end };
    }
}), styleTags({
    AttributeValue: "string",
    "Text RawText": "content",
    "StartTag StartCloseTag SelfCloserEndTag EndTag SelfCloseEndTag": "angleBracket",
    TagName: "typeName",
    MismatchedTagName: "typeName invalid",
    AttributeName: "propertyName",
    UnquotedAttributeValue: "string",
    Is: "operator definition",
    "EntityReference CharacterReference": "character",
    Comment: "blockComment",
    ProcessingInst: "operator meta",
    DoctypeDecl: "labelName meta"
})), {
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/
    }
});
/// HTML tag completion. Opens and closes tags and attributes in a
/// context-aware way.
const doenetmlCompletion = doenetmlSyntax.languageData.of({ autocomplete: completeDOENETML });
/// An extension that installs HTML-related functionality
/// ([`htmlCompletion`](#lang-html.htmlCompletion) and
/// [`javascriptSupport`](#lang-javascript.javascriptSupport)).
function doenetmlSupport() { return [doenetmlCompletion]; }
/// Returns an extension that installs the HTML
/// [syntax](#lang-html.htmlSyntax) and
/// [support](#lang-html.htmlSupport).
function doenetml() { return [doenetmlSyntax, doenetmlSupport()]; }

export { doenetml, doenetmlCompletion, doenetmlSupport, doenetmlSyntax };
