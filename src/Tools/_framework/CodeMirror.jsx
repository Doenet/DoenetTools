import React, {useEffect, useRef} from "react";
import {basicSetup} from "@codemirror/basic-setup";
import {EditorState, Transaction, StateEffect} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {styleTags, tags as t} from "@codemirror/highlight"
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from '@codemirror/language';
import {completeFromSchema} from '@codemirror/lang-xml';
import {parser} from "../../Parser/doenet"

export default function CodeMirror(props){
    let matchTagEnabled = false;
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

    function matchTag(tr){
        const cursorPos = tr.newSelection.main.from;
        //if we may be closing an OpenTag
        if(tr.annotation(Transaction.userEvent) == "input" && tr.newDoc.sliceString(cursorPos-1,cursorPos) === ">"){ //TODO check if resolve finds the correct node
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
            indentNodeProp.add({
                //fun (unfixable?) glitch: If you modify the document and then create a newline before enough time has passed for a new parse (which is often < 50ms)
                //the indent wont have time to update and you're going right back to the left side of the screen.
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
                "StartTag StartCloseTag EndTag SelfCloseEndTag": t.angleBracket,
                "MismatchedCloseTag/TagName": [t.tagName,t.invalid],
                "MismatchedCloseTag/StartCloseTag": t.invalid,
                AttributeName: t.propertyName,
                Is: t.definitionOperator,
                "EntityReference CharacterReference": t.character,
                Comment: t.blockComment,
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

    const doenetSchema = {
        elements: [
            {
                name: "p",
            },
            {
                name: "div",
            },
            {
                name: "mathInput",
                children: [],
                attributes: [{name: "test"}]
            }
        ]
    }

    const doenetExtensions = [
        basicSetup,
        doenet(doenetSchema),
        EditorView.lineWrapping,
        tabExtension,
        EditorState.changeFilter.of(changeFunc)
    ]

    const state = EditorState.create({
        doc : props.value,
        extensions: doenetExtensions
        
    });

    function toggleMatchTag(){
        if(matchTagEnabled){
            view.current.dispatch({
                effects: StateEffect.reconfigure(doenetExtensions)
              })
              matchTagEnabled = false;
        } else{
            view.current.dispatch({
                effects: StateEffect.appendConfig.of(EditorState.transactionFilter.of(matchTag))
            })
            matchTagEnabled = true;
        }
    }

    return (
        <>
        <button onClick={toggleMatchTag}>Toggle matching tags</button>
        <div ref={parent} ></div>
        </>
    )
}