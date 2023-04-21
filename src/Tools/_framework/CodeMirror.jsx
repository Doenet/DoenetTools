import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { basicSetup } from "@codemirror/basic-setup";
import { EditorState, Transaction, StateEffect } from "@codemirror/state";
import { selectLine, deleteLine, cursorLineUp } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { styleTags, tags as t } from "@codemirror/highlight";
import { gutter, lineNumbers } from "@codemirror/gutter";
import {
  LRLanguage,
  LanguageSupport,
  syntaxTree,
  indentNodeProp,
  foldNodeProp,
} from "@codemirror/language";
import { HighlightStyle } from "@codemirror/highlight";
import { completeFromSchema } from "@codemirror/lang-xml";
import { parser } from "../../Parser/doenet";
import { atom, useRecoilValue } from "recoil";
import { getRenderer } from "handsontable/renderers";

const editorConfigStateAtom = atom({
  key: "editorConfigStateAtom",
  default: {
    matchTag: false,
  },
});

let view;

export default function CodeMirror({
  setInternalValue,
  onBeforeChange,
  readOnly,
  onBlur,
  onFocus,
}) {
  if (readOnly === undefined) {
    readOnly = false;
  }

  let colorTheme = EditorView.theme({
    "&": {
      color: "var(--canvastext)",
      //backgroundColor: "var(--canvas)",
    },
    ".cm-content": {
      caretColor: "#0e9",
      borderDownColor: "var(--canvastext)",
    },
    ".cm-editor": {
      caretColor: "#0e9",
      backgroundColor: "var(--canvas)",
    },
    "&.cm-focused .cm-cursor": {
      backgroundColor: "var(--lightBlue)",
      borderLeftColor: "var(--canvastext)",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "var(--lightBlue)",
    },
    "&.cm-focused": {
      color: "var(--canvastext)",
    },
    "cm-selectionLayer": {
      backgroundColor: "var(--mainGreen)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--mainGray)",
      color: "black",
      border: "none",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--lightBlue)",
      color: "black",
    },
  });

  let editorConfig = useRecoilValue(editorConfigStateAtom);
  view = useRef(null);
  let parent = useRef(null);
  const [count, setCount] = useState(0);

  const changeFunc = useCallback((tr) => {
    if (tr.docChanged) {
      let strOfDoc = tr.state.sliceDoc();
      onBeforeChange(strOfDoc);
      return true;
    }
    //trust in the system
    //eslint-disable-next-line
  }, []);

  //Make sure readOnly takes affect
  //TODO: Do this is a smarter way - async await?
  if (readOnly && view.current?.state?.facet(EditorView.editable)) {
    const disabledExtensions = [EditorView.editable.of(false), lineNumbers()];
    view.current.dispatch({
      effects: StateEffect.reconfigure.of(disabledExtensions),
    });
  }

  //Fires when the editor losses focus
  const onBlurExtension = EditorView.domEventHandlers({
    blur() {
      if (onBlur) {
        onBlur();
      }
    },
  });

  //Fires when the editor receives focus
  const onFocusExtension = EditorView.domEventHandlers({
    focus() {
      if (onFocus) {
        onFocus();
      }
    },
  });

  const doenetExtensions = useMemo(
    () => [
      basicSetup,
      doenet(doenetSchema),
      EditorView.lineWrapping,
      colorTheme,
      tabExtension,
      cutExtension,
      copyExtension,
      onBlurExtension,
      onFocusExtension,
      EditorState.changeFilter.of(changeFunc),
    ],
    [changeFunc],
  );

  const matchTag = useCallback(
    (tr) => {
      const cursorPos = tr.newSelection.main.from;
      //if we may be closing an OpenTag
      if (
        tr.annotation(Transaction.userEvent) == "input" &&
        tr.newDoc.sliceString(cursorPos - 1, cursorPos) === ">"
      ) {
        //check to see if we are actually closing an OpenTag
        let node = syntaxTree(tr.state).resolve(cursorPos, -1);
        if (node.name !== "OpenTag") {
          return tr;
        }
        //first node is the StartTag
        let tagNameNode = node.firstChild.nextSibling;
        let tagName = tr.newDoc.sliceString(tagNameNode.from, tagNameNode.to);

        //an ineffecient hack to make it so the modified document is saved directly after tagMatch
        let tra = tr.state.update({
          changes: { from: cursorPos, insert: "</".concat(tagName, ">") },
          sequential: true,
        });
        changeFunc(tra);

        return [
          tr,
          {
            changes: { from: cursorPos, insert: "</".concat(tagName, ">") },
            sequential: true,
          },
        ];
      } else {
        return tr;
      }
    },
    [changeFunc],
  );

  const state = EditorState.create({
    doc: setInternalValue,
    extensions: doenetExtensions,
  });

  useEffect(() => {
    if (view.current !== null && parent.current !== null) {
      // console.log(">>>changing setInternalValue to",setInternalValue)
      let tr = view.current.state.update({
        changes: {
          from: 0,
          to: view.current.state.doc.length,
          insert: setInternalValue,
        },
      });
      view.current.dispatch(tr);
    }
  }, [setInternalValue]);

  useEffect(() => {
    if (view.current === null && parent.current !== null) {
      view.current = new EditorView({ state, parent: parent.current });

      if (readOnly && view.current.state.facet(EditorView.editable)) {
        //Force a refresh
        setCount((old) => {
          return old + 1;
        });
      }
    }
  });

  useEffect(() => {
    if (view.current !== null && parent.current !== null) {
      if (readOnly && view.current.state.facet(EditorView.editable)) {
        // console.log(">>>read only has been set, changing");
        //NOTE: WHY DOESN'T THIS WORK?
        const disabledExtensions = [
          EditorView.editable.of(false),
          lineNumbers(),
        ];
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(disabledExtensions),
        });
      } else if (!readOnly && !view.current.state.facet(EditorView.editable)) {
        // console.log(">>>read only has been turned off, changing");
        view.current.dispatch({
          effects: StateEffect.reconfigure.of(doenetExtensions),
        });
        if (editorConfig.matchTag) {
          view.current.dispatch({
            effects: StateEffect.appendConfig.of(
              EditorState.transactionFilter.of(matchTag),
            ),
          });
        }
      }
    }
    //annoying that editorConfig is a dependency, but no real way around it
  }, [
    doenetExtensions,
    setInternalValue,
    matchTag,
    readOnly,
    editorConfig.matchTag,
  ]);

  //TODO any updates would force an update of each part of the config.
  //Doesn't matter since there's only one toggle at the moment, but could cause unneccesary work later
  useEffect(() => {
    // console.log(">>>config update")
    if (editorConfig.matchTag) {
      view.current.dispatch({
        effects: StateEffect.appendConfig.of(
          EditorState.transactionFilter.of(matchTag),
        ),
      });
    } else {
      view.current.dispatch({
        //this will also need to change when more options are added, as this paves all of the added extensions.
        effects: StateEffect.reconfigure.of(doenetExtensions),
      });
    }
  }, [editorConfig, matchTag, doenetExtensions]);

  //should rewrite using compartments once a more formal config component is established
  return (
    <>
      <div ref={parent} style={{ paddingBottom: "50vh" }}></div>
    </>
  );
}

//tabs = 2 spaces
const tab = "  ";
const tabCommand = ({ state, dispatch }) => {
  dispatch(
    state.update(state.replaceSelection(tab), {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of("input"),
    }),
  );
  return true;
};

const tabExtension = keymap.of([
  {
    key: "Tab",
    run: tabCommand,
  },
]);

const copyCommand = ({ state, dispatch }) => {
  if (state.selection.main.empty) {
    selectLine({ state: state, dispatch: dispatch });
    document.execCommand("copy");
  } else {
    document.execCommand("copy");
  }
  return true;
};

const copyExtension = keymap.of([
  {
    key: "Mod-x",
    run: copyCommand,
  },
]);

const cutCommand = ({ state, dispatch }) => {
  //if the selection is empty
  if (state.selection.main.empty) {
    selectLine({ state: state, dispatch: dispatch });
    document.execCommand("copy");
    if (
      state.doc.lineAt(state.selection.main.from).number !== state.doc.lines
    ) {
      deleteLine(view.current);
      cursorLineUp(view.current);
    } else {
      deleteLine(view.current);
    }
  } else {
    document.execCommand("copy");
    dispatch(
      state.update(state.replaceSelection(""), {
        scrollIntoView: true,
        annotations: Transaction.userEvent.of("input"),
      }),
    );
  }
  return true;
};
const cutExtension = keymap.of([
  {
    key: "Mod-x",
    run: cutCommand,
  },
]);

const doenetSchema = {
  //TODO update schema to be more complete.
  elements: [
    // {
    //     name: "p",
    // },
    // {
    //     name: "div",
    // },
    // {
    //     name: "mathInput",
    //     children: [],
    //     attributes: [{name: "TEST"}]
    // }
  ],
};

let parserWithMetadata = parser.configure({
  props: [
    indentNodeProp.add({
      //fun (unfixable?) glitch: If you modify the document and then create a newline before enough time has passed for a new parse (which is often < 50ms)
      //the indent wont have time to update and you're going right back to the left side of the screen.
      Element(context) {
        let closed = /^\s*<\//.test(context.textAfter);
        // console.log("youuuhj",context.state.doc.lineAt(context.node.from))
        return (
          context.lineIndent(context.node.from) + (closed ? 0 : context.unit)
        );
      },
      "OpenTag CloseTag SelfClosingTag"(context) {
        if (context.node.firstChild.name == "TagName") {
          return context.column(context.node.from);
        }
        return context.column(context.node.from) + context.unit;
      },
    }),
    foldNodeProp.add({
      Element(subtree) {
        let first = subtree.firstChild;
        let last = subtree.lastChild;
        if (!first || first.name != "OpenTag") return null;
        return {
          from: first.to,
          to: last.name == "CloseTag" ? last.from : subtree.to,
        };
      },
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
      Macro: t.macroName,
    }),
  ],
});

const doenetLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/$/,
  },
});

export function codeMirrorFocusAndGoToEnd() {
  view.current.focus();
  view.current.dispatch(
    view.current.state.update({
      selection: { anchor: view.current.state.doc.length },
    }),
    { scrollIntoView: true },
  );
}
const doenet = (conf = {}) =>
  new LanguageSupport(
    doenetLanguage,
    doenetLanguage.data.of({
      autocomplete: completeFromSchema(
        conf.elements || [],
        conf.attributes || [],
      ),
    }),
  );
