import React, { useEffect, useRef } from "react";
import { basicSetup } from "@codemirror/basic-setup";
import { EditorState, Transaction } from "@codemirror/state";
import { EditorView, keymap  } from "@codemirror/view";


export default function CodeMirror(props){
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
            EditorState.changeFilter.of(changeFunc)
        ]

    });


    return (
        <div ref={parent} ></div>
    )
}