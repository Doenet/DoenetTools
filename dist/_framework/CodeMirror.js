import React, {useEffect, useRef} from "../_snowpack/pkg/react.js";
import {basicSetup} from "../_snowpack/pkg/@codemirror/basic-setup.js";
import {EditorState, Transaction, StateEffect} from "../_snowpack/pkg/@codemirror/state.js";
import {EditorView, keymap} from "../_snowpack/pkg/@codemirror/view.js";
import {styleTags, defaultHighlightStyle, tags as t} from "../_snowpack/pkg/@codemirror/highlight.js";
import {lineNumbers} from "../_snowpack/pkg/@codemirror/gutter.js";
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from "../_snowpack/pkg/@codemirror/language.js";
import {completeFromSchema} from "../_snowpack/pkg/@codemirror/lang-xml.js";
import {parser} from "../parser/doenet.js";
import ToggleButton from "../_reactComponents/PanelHeaderComponents/ToggleButton.js";
import {atom, useRecoilState} from "../_snowpack/pkg/recoil.js";
const matchTagState = atom({
  key: "matchTagState",
  default: false
});
export default function CodeMirror({setInternalValue, onBeforeChange, readOnly}) {
  let [matchTagEnabled, setMatchTagEnabled] = useRecoilState(matchTagState);
  let view = useRef(null);
  let parent = useRef(null);
  const doenetExtensions = [
    basicSetup,
    doenet(doenetSchema),
    EditorView.lineWrapping,
    tabExtension,
    EditorState.changeFilter.of(changeFunc)
  ];
  const state = EditorState.create({
    doc: setInternalValue,
    extensions: doenetExtensions
  });
  useEffect(() => {
    if (view.current !== null && parent.current !== null) {
      console.log(">>> setInternalValue is", setInternalValue);
      let tr = view.current.state.update({changes: {from: 0, to: view.current.state.doc.length, insert: setInternalValue}});
      view.current.dispatch(tr);
    }
  }, [setInternalValue, view]);
  useEffect(() => {
    if (view.current === null && parent.current !== null) {
      view.current = new EditorView({state, parent: parent.current});
    }
  });
  useEffect(() => {
    if (view.current !== null && parent.current !== null) {
      if (readOnly && view.current.state.facet(EditorView.editable)) {
        const disabledExtensions = [
          EditorView.editable.of(false),
          lineNumbers(),
          doenet(),
          defaultHighlightStyle.extension
        ];
        let tr = view.current.state.update({changes: {from: 0, to: view.current.state.doc.length, insert: setInternalValue}});
        view.current.dispatch(tr);
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(disabledExtensions)
        });
      } else if (!readOnly && !view.current.state.facet(EditorView.editable)) {
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(doenetExtensions.push(EditorState.transactionFilter.of(matchTag)))
        });
      }
    }
  });
  function changeFunc(tr) {
    if (tr.docChanged) {
      let strOfDoc = tr.state.sliceDoc();
      onBeforeChange(strOfDoc);
      return true;
    }
  }
  function matchTag(tr) {
    const cursorPos = tr.newSelection.main.from;
    if (tr.annotation(Transaction.userEvent) == "input" && tr.newDoc.sliceString(cursorPos - 1, cursorPos) === ">") {
      let node = syntaxTree(tr.state).resolve(cursorPos, -1);
      if (node.name !== "OpenTag") {
        return tr;
      }
      let tagNameNode = node.firstChild.nextSibling;
      let tagName = tr.newDoc.sliceString(tagNameNode.from, tagNameNode.to);
      let tra = tr.state.update({changes: {from: cursorPos, insert: "</".concat(tagName, ">")}, sequential: true});
      changeFunc(tra);
      return [tr, {changes: {from: cursorPos, insert: "</".concat(tagName, ">")}, sequential: true}];
    } else {
      return tr;
    }
  }
  function toggleMatchTag() {
    if (matchTagEnabled) {
      view.current.dispatch({
        effects: StateEffect.reconfigure.of(doenetExtensions)
      });
      setMatchTagEnabled(false);
    } else {
      view.current.dispatch({
        effects: StateEffect.appendConfig.of(EditorState.transactionFilter.of(matchTag))
      });
      setMatchTagEnabled(true);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ToggleButton, {
    value: "Enable matching tags",
    switch_value: "Disable matching tags",
    onClick: toggleMatchTag
  }), /* @__PURE__ */ React.createElement("div", {
    ref: parent
  }));
}
const tab = "  ";
const tabCommand = ({state, dispatch}) => {
  dispatch(state.update(state.replaceSelection(tab), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}));
  return true;
};
const tabExtension = keymap.of([{
  key: "Tab",
  run: tabCommand
}]);
let parserWithMetadata = parser.configure({
  props: [
    indentNodeProp.add({
      Element(context) {
        let closed = /^\s*<\//.test(context.textAfter);
        return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit);
      },
      "OpenTag CloseTag SelfClosingTag"(context) {
        if (context.node.firstChild.name == "TagName") {
          return context.column(context.node.from);
        }
        return context.column(context.node.from) + context.unit;
      }
    }),
    foldNodeProp.add({
      Element(subtree) {
        let first = subtree.firstChild;
        let last = subtree.lastChild;
        if (!first || first.name != "OpenTag")
          return null;
        return {from: first.to, to: last.name == "CloseTag" ? last.from : subtree.to};
      }
    }),
    styleTags({
      AttributeValue: t.string,
      Text: t.content,
      TagName: t.tagName,
      MismatchedCloseTag: t.invalid,
      "StartTag StartCloseTag EndTag SelfCloseEndTag": t.angleBracket,
      "MismatchedCloseTag/TagName": [t.tagName, t.invalid],
      "MismatchedCloseTag/StartCloseTag": t.invalid,
      AttributeName: t.propertyName,
      Is: t.definitionOperator,
      "EntityReference CharacterReference": t.character,
      Comment: t.blockComment
    })
  ]
});
const doenetLanguage = LezerLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {block: {open: "<!--", close: "-->"}},
    indentOnInput: /^\s*<\/$/
  }
});
const doenet = (conf = {}) => new LanguageSupport(doenetLanguage, doenetLanguage.data.of({
  autocomplete: completeFromSchema(conf.elements || [], conf.attributes || [])
}));
const doenetSchema = {
  elements: []
};
