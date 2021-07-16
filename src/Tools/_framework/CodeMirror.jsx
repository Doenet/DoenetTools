import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {basicSetup} from "@codemirror/basic-setup";
import {EditorState, Transaction, StateEffect} from "@codemirror/state";
import {selectLine,deleteLine} from "@codemirror/commands"
import {EditorView, keymap} from "@codemirror/view";
import {styleTags, tags as t} from "@codemirror/highlight"
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from '@codemirror/language';
import {completeFromSchema} from '@codemirror/lang-xml';
import {parser} from "../../Parser/doenet";
import { atom, useRecoilValue } from "recoil";

const editorConfigState = atom({
    key: 'editorConfigState',
    default: {
        matchTag: false
    },
});

let view;

export default function CodeMirror({editorRef,onBeforeChange,value}){
    let editorConfig  = useRecoilValue(editorConfigState);
    view = editorRef;
    let parent = useRef(null);

    useEffect(() => {
        if(view.current === null && parent.current !== null){
            view.current = new EditorView({state, parent: parent.current});
        }
    });

    const changeFunc = useCallback((tr) => {
        if(tr.docChanged){
            let value = tr.state.sliceDoc();
            onBeforeChange(value);
            return true;
        }
    },[onBeforeChange]);

    const matchTag = useCallback((tr) => {
        const cursorPos = tr.newSelection.main.from;
        //if we may be closing an OpenTag
        if(tr.annotation(Transaction.userEvent) == "input" && tr.newDoc.sliceString(cursorPos-1,cursorPos) === ">"){
            //check to se if we are actually closing an OpenTag
            let node = syntaxTree(tr.state).resolve(cursorPos,-1);
            if(node.name !== "OpenTag") {
                return tr;
            }
            //first node is the StartTag
            let tagNameNode = node.firstChild.nextSibling;
            let tagName = tr.newDoc.sliceString(tagNameNode.from,tagNameNode.to);

            //an ineffecient hack to make it so the modified document is saved directly after tagMatch
            let tra = tr.state.update({changes: {from: cursorPos, insert: "</".concat(tagName,">")}, sequential: true });
            changeFunc(tra);

            return [tr, {changes: {from: cursorPos, insert: "</".concat(tagName,">")}, sequential: true }];
        } else {
            return tr;
        }
    },[changeFunc]);

    const doenetExtensions = useMemo(() => [
        basicSetup,
        doenet(doenetSchema),
        EditorView.lineWrapping,
        tabExtension,
        cutExtension,
        EditorState.changeFilter.of(changeFunc)
    ],[changeFunc]); 

    //TODO any updates would force an update of each part of the config.
    //Doesn't matter since there's only one toggle at the moment, but could cause unneccesary work later
    useEffect(() => {
       if(editorConfig.matchTag){
          view.current.dispatch({
            effects: StateEffect.appendConfig.of(EditorState.transactionFilter.of(matchTag))
        });
       } else {
        view.current.dispatch({
            effects: StateEffect.reconfigure.of(doenetExtensions)
          }); 
       }
    },[editorConfig,matchTag,doenetExtensions])

    const state = EditorState.create({
        doc : value,
        extensions: doenetExtensions
        
    });

    //should rewrite using compartments once a more formal config component is established
    return (
        <>
        <div ref={parent} ></div>
        </>
    )
}

//tab = 2 spaces
const tab = "  ";
const tabCommand = ({state,dispatch}) => {
    dispatch(state.update(state.replaceSelection(tab), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}));
    return true
}

const tabExtension = keymap.of([{
    key : "Tab",
    run : tabCommand
}])

const cutCommand = ({state,dispatch}) => {
    //if the selection isn't empty
    if(state.selection.main.empty){
        selectLine({state: state, dispatch: dispatch});
        document.execCommand("copy");
        deleteLine(view.current);
    } else {
        document.execCommand("copy");
        dispatch(state.update(state.replaceSelection(""), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}));
    }
    return true;
}
const cutExtension = keymap.of([{
    key : "Mod-x",
    run : cutCommand 
}])

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
]
}

let parserWithMetadata = parser.configure({
props : [
    indentNodeProp.add({
        //fun (unfixable?) glitch: If you modify the document and then create a newline before enough time has passed for a new parse (which is often < 50ms)
        //the indent wont have time to update and you're going right back to the left side of the screen.
        Element(context) {
            let closed = /^\s*<\//.test(context.textAfter)
            return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit)
        },
        "OpenTag CloseTag SelfClosingTag"(context) {

            if(context.node.firstChild.name == "TagName" ){
                return context.column(context.node.from) 
            }
            return context.column(context.node.from) + context.unit
        }
        }),
        foldNodeProp.add({
        Element(subtree) {
            let first = subtree.firstChild;
            let last = subtree.lastChild;
            if (!first || first.name != "OpenTag") return null
            return {from: first.to, to: last.name == "CloseTag" ? last.from : subtree.to}
        }
        }),
    styleTags({
        AttributeValue: t.string,
        Text: t.content,
        TagName: t.tagName,
        MismatchedCloseTag: t.invalid,
        "StartTag StartCloseTag EndTag SelfCloseEndTag": t.angleBracket,
        "MismatchedCloseTag/TagName": [t.tagName,t.invalid],
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

const doenet = (conf) => new LanguageSupport(doenetLanguage, doenetLanguage.data.of({
    autocomplete: completeFromSchema(conf.elements || [], conf.attributes || [])
}));