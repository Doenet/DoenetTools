import React, {useEffect, useRef} from "react";
import {basicSetup} from "@codemirror/basic-setup";
import {EditorState, Transaction } from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {indentNodeProp, LezerLanguage, LanguageSupport} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {indentLess} from "@codemirror/commands"
import {parser} from "../../Parser/doenet"

export default function CodeMirror(props){
    let openTags = [];
    const noIndentTags = ["p"];

    let view = useRef(null);
    let parent = useRef(null);

    props.editorRef = view;

    useEffect(() => {
        if(view.current === null && parent.current !== null){
            view.current = new EditorView({state, parent: parent.current});
        }
    });

    function changeFunc(tr) {
        // get a string containing the contents of the whole document
        // this might be terribly innefecient. Consider using diffs (transactions) if so.
        // TODO determine if this should be the startState or the (end)state.
        let value = tr.state.sliceDoc();
        props.onBeforeChange(value);
        return true;
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

    const state = EditorState.create({
        doc : props.value,
        extensions: [
            EditorView.lineWrapping,
            tabExtension,
            //basicSetup also includes comment bindings based on info from a language extension.
            basicSetup,
            EditorState.changeFilter.of(changeFunc),
            doenet(view.current)
        ]
    });

    let parserWithMetadata = parser.configure({
        props : [
            styleTags({
                Comment: t.comment,
                AttributeName: t.propertyName,
                AttributeValue: t.string,
                MismatchedCloseTag: t.invalid,
                "( )": t.paren
            }),
            indentNodeProp.add({
                OpenTag: context => {
                    const tagNameNode = context.node.firstChild;
                    const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
                    if(noIndentTags.includes(tagName)){
                        return context.baseIndent;
                    } else  {
                        openTags.push(tagName);
                        return context.baseIndent + context.unit;
                    }
                },
                CloseTag: context => {
                    const tagNameNode = context.node.firstChild;
                    const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
                    const index = openTags.indexOf(tagName);
                    if(index === -1){
                        return context.baseIndent;
                    } else {
                        //this should have the correct behavior...
                        indentLess({state : context.state, dispatch: view.current.dispatch });

                        openTags.splice(index,1);
                        //TODO this might need to be minus unit
                        return context.baseIndent;
                    }

                }
            })
        ]
    })

    const doenetLanguage = LezerLanguage.define({
        parser: parserWithMetadata,
        //TODO look into languageData (looks like there's more than this (undocumented of course))
        languageData: {
            commentTokens: {block: {open: "<!--", close: "-->"}}
        }
    })
    function doenet(){
        return new LanguageSupport(doenetLanguage(), [])
    }

    return (
        <div ref={parent} ></div>
    )
}