import React, {useEffect, useRef} from "react";
import {basicSetup} from "@codemirror/basic-setup";
import {EditorState, Transaction } from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {indentNodeProp, LezerLanguage, LanguageSupport} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {parser} from "../../Parser/doenet"
import {xml} from "@codemirror/lang-xml";

export default function CodeMirror(props){
    let openTags = [];
    const noIndentTags = ["p"];

    let view = props.editorRef;
    let parent = useRef(null);


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

    let parserWithMetadata = parser.configure({
        props : [
            // indentNodeProp.add({
            //     OpenTag(context) {
            //         console.log(">>>openTag indent")
            //         const tagNameNode = context.node.firstChild;
            //         const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
            //         if(noIndentTags.includes(tagName)){
            //             return context.baseIndent;
            //         } else  {
            //             openTags.push(tagName);
            //             return context.baseIndent + context.unit;
            //         }
            //     },
            //     CloseTag: context => {
            //         console.log(">>>closetag indent")
            //         const tagNameNode = context.node.firstChild;
            //         const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
            //         const index = openTags.indexOf(tagName);
            //         if(index === -1){
            //             return context.baseIndent;
            //         } else {
            //             //this should have the correct behavior...
            //             indentLess({state : context.state, dispatch: view.current.dispatch });

            //             openTags.splice(index,1);
            //             //TODO this might need to be minus unit
            //             return context.baseIndent;
            //         }

            //     }
            // }),
            styleTags({
                AttributeValue: t.string,
                Text: t.content,
                // "StartTag StartCloseTag EndTag SelfCloseEndTag": t.angleBracket,
                TagName: t.tagName,
                "MismatchedCloseTag/Tagname": [t.tagName, t.invalid],
                AttributeName: t.propertyName,
                Is: t.definitionOperator,
                "EntityReference CharacterReference": t.character,
                Comment: t.blockComment,
                Cdata: t.special(t.string)
              })
        ]
    });

    // const doenetLanguage = LezerLanguage.define({
    //     parser: parserWithMetadata,
    //     //TODO look into languageData (looks like there's more than this (undocumented of course))
    //     languageData: {
    //         commentTokens: {block: {open: "<!--", close: "-->"}},
    //         indentOnInput: /^\s*<\/$/
    //     }
    // });

    // const doenet = new LanguageSupport(doenetLanguage, []);

    const state = EditorState.create({
        doc : props.value,
        extensions: [
            //basicSetup also includes comment bindings based on info from a language extension.
            basicSetup,
            xml(),
            // doenet,
            EditorView.lineWrapping,
            tabExtension,
            EditorState.changeFilter.of(changeFunc),
        ]
    });


    return (
        <div ref={parent} ></div>
    )
}