import React, {useCallback, useEffect, useMemo, useRef} from "../_snowpack/pkg/react.js";
import {basicSetup} from "../_snowpack/pkg/@codemirror/basic-setup.js";
import {EditorState, Transaction, StateEffect} from "../_snowpack/pkg/@codemirror/state.js";
import {selectLine, deleteLine, cursorLineUp} from "../_snowpack/pkg/@codemirror/commands.js";
import {EditorView, keymap} from "../_snowpack/pkg/@codemirror/view.js";
import {styleTags, defaultHighlightStyle, tags as t} from "../_snowpack/pkg/@codemirror/highlight.js";
import {lineNumbers} from "../_snowpack/pkg/@codemirror/gutter.js";
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from "../_snowpack/pkg/@codemirror/language.js";
import {completeFromSchema} from "../_snowpack/pkg/@codemirror/lang-xml.js";
import {parser} from "../parser/doenet.js";
import {atom, useRecoilValue} from "../_snowpack/pkg/recoil.js";
const editorConfigStateAtom = atom({
  key: "editorConfigStateAtom",
  default: {
    matchTag: false
  }
});
let view;
export default function CodeMirror({setInternalValue, onBeforeChange, readOnly}) {
  if (readOnly === void 0) {
    readOnly = false;
  }
  let editorConfig = useRecoilValue(editorConfigStateAtom);
  view = useRef(null);
  let parent = useRef(null);
  const changeFunc = useCallback((tr) => {
    if (tr.docChanged) {
      let strOfDoc = tr.state.sliceDoc();
      onBeforeChange(strOfDoc);
      return true;
    }
  }, []);
  const doenetExtensions = useMemo(() => [
    basicSetup,
    doenet(doenetSchema),
    EditorView.lineWrapping,
    tabExtension,
    cutExtension,
    copyExtension,
    EditorState.changeFilter.of(changeFunc)
  ], [changeFunc]);
  const matchTag = useCallback((tr) => {
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
  }, [changeFunc]);
  const state = EditorState.create({
    doc: setInternalValue,
    extensions: doenetExtensions
  });
  useEffect(() => {
    if (view.current !== null && parent.current !== null) {
      let tr = view.current.state.update({changes: {from: 0, to: view.current.state.doc.length, insert: setInternalValue}});
      view.current.dispatch(tr);
    }
  }, [setInternalValue]);
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
          lineNumbers()
        ];
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(disabledExtensions)
        });
      } else if (!readOnly && !view.current.state.facet(EditorView.editable)) {
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(doenetExtensions)
        });
        if (editorConfig.matchTag) {
          view.current.dispatch({
            effects: StateEffect.appendConfig.of(EditorState.transactionFilter.of(matchTag))
          });
        }
      }
    }
  }, [doenetExtensions, setInternalValue, matchTag, readOnly, editorConfig.matchTag]);
  useEffect(() => {
    if (editorConfig.matchTag) {
      view.current.dispatch({
        effects: StateEffect.appendConfig.of(EditorState.transactionFilter.of(matchTag))
      });
    } else {
      view.current.dispatch({
        effects: StateEffect.reconfigure.of(doenetExtensions)
      });
    }
  }, [editorConfig, matchTag, doenetExtensions]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
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
const copyCommand = ({state, dispatch}) => {
  if (state.selection.main.empty) {
    selectLine({state, dispatch});
    document.execCommand("copy");
  } else {
    document.execCommand("copy");
  }
  return true;
};
const copyExtension = keymap.of([{
  key: "Mod-x",
  run: copyCommand
}]);
const cutCommand = ({state, dispatch}) => {
  if (state.selection.main.empty) {
    selectLine({state, dispatch});
    document.execCommand("copy");
    if (state.doc.lineAt(state.selection.main.from).number !== state.doc.lines) {
      deleteLine(view.current);
      cursorLineUp(view.current);
    } else {
      deleteLine(view.current);
    }
  } else {
    document.execCommand("copy");
    dispatch(state.update(state.replaceSelection(""), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}));
  }
  return true;
};
const cutExtension = keymap.of([{
  key: "Mod-x",
  run: cutCommand
}]);
const doenetSchema = {
  elements: []
};
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
      Comment: t.blockComment,
      Macro: t.macroName
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
export function codeMirrorFocusAndGoToEnd() {
  view.current.focus();
  view.current.dispatch(view.current.state.update({selection: {anchor: view.current.state.doc.length}}), {scrollIntoView: true});
}
const doenet = (conf = {}) => new LanguageSupport(doenetLanguage, doenetLanguage.data.of({
  autocomplete: completeFromSchema(conf.elements || [], conf.attributes || [])
}));
