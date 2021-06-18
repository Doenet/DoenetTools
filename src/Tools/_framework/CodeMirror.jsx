import React, {useEffect, useRef} from "react";
import {basicSetup} from "@codemirror/basic-setup";
import {EditorState, Transaction } from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {styleTags, tags as t} from "@codemirror/highlight"
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from '@codemirror/language';
import {parser} from "../../Parser/doenet"

export default function CodeMirror(props){
    let view = props.editorRef;
    let parent = useRef(null);

    useEffect(() => {
        if(view.current === null && parent.current !== null){
            view.current = new EditorView({state, parent: parent.current});
        }
    });

    function changeFunc(tr) {
        if(tr.docChanged){
            let value = tr.state.sliceDoc();
            props.onBeforeChange(value);
            return true;
        }
    }

    // function matchTag(tr){
    //     //TODO what even is mainIndex? The docs aren't helpful
    //     if(tr.docChanged && tr.state.sliceDoc(tr.state.selection.mainIndex,tr.state.selection.mainIndex+1) === ">"){
    //         //TODO check if resolve finds the correct node
    //         let node = syntaxTree(tr.state).resolve(tr.state.selection.mainIndex,-1);
    //         console.log(">>>node in matchTag",node);
    //         if(node.name !== "OpenTag") {
    //             return;
    //         }
    //         let tagNameNode = node.firstChild();
    //         let tagName = tr.state.sliceDoc(tagNameNode.from,tagNameNode.to);
    //         //TODO
    //         //TODO need to check that 
    //         //an opening tag was just closed ('>' was just entered and an opentag is in the right spot)
    //         //then, need to get the tagname from that open tag
    //         //then need to insert a new tag right after the cursor
    //         //might need to rebind enter when an open tag and a closetag is on the same line

    //     }
    // }

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
            indentNodeProp.add({
                Element(context) {
                    let closed = /^\s*<\//.test(context.textAfter)
                    return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit)
                },
                "OpenTag CloseTag SelfClosingTag"(context) {
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
                "MismatchedCloseTag/TagNamed": t.invalid,
                AttributeName: t.propertyName,
                Is: t.definitionOperator,
                "EntityReference CharacterReference": t.character,
                Comment: t.blockComment,
                Cdata: t.special(t.string)
              })
        ]
    });

    const doenetLanguage = LezerLanguage.define({
        parser: parserWithMetadata,
        //TODO look into languageData (looks like there's more than this (undocumented of course))
        languageData: {
            commentTokens: {block: {open: "<!--", close: "-->"}},
            indentOnInput: /^\s*<\/.+>$/
        }
    });

    const doenet = new LanguageSupport(doenetLanguage, []);

    const state = EditorState.create({
        doc : props.value,
        extensions: [
            basicSetup,
            doenet,
            EditorView.lineWrapping,
            tabExtension,
            EditorState.changeFilter.of(changeFunc),
            // EditorState.changeFilter.of(matchTag),
        ]
    });


    return (
        <div ref={parent} ></div>
    )
}