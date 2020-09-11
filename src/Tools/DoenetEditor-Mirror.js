import React, { useEffect } from 'react';

import ToolLayout from './ToolLayout/ToolLayout';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel';

//CodeMirror 6 Imports
import {EditorState, StateField} from '@codemirror/next/state';
import {EditorView, ViewPlugin} from '@codemirror/next/view';
import {basicSetup} from '@codemirror/next/basic-setup';
import {htmlSyntax, html} from '@codemirror/next/lang-html';

console.log("Syntax Tree");

let countDocChanges = StateField.define({
    //Sets initial value
    create() {return ""},
    //Updates value based on transaction
    update(value, tr) {
        console.log(tr.state.tree);
        console.log(tr.state.doc);
        return tr.docChanged ? tr.state.tree.children : value
    }
})

//This should probably go in the useEffect
const wordGetterPlugin = ViewPlugin.fromClass(class {
    constructor(view) {
        this.dom = view.dom.appendChild(document.createElement('div'));
        this.dom.style.cssText = 
            "position: absolute; inset-block-start: 2px; inset-inline-end: 5px";
        // this.dom.textContent = view.state.field(countDocChanges);
    }

    update(update) {
        if (update.docChanged) {
            // this.dom.textContent = update.state.field(countDocChanges);
        }
    }

    destroy() {this.dom.remove}
})

function Editor(props) {
    let startState = EditorState.create({
        doc: props.content,
        extensions: [basicSetup, html(), countDocChanges, wordGetterPlugin]
    })

    let { mountKey } = props;

    let view = new EditorView({
        state: startState,
    })

    useEffect(() => {
        const containerRoot = document.getElementById(mountKey);
        containerRoot.appendChild(view.dom);

        console.log(view);
    });

    return(<div id={mountKey}/>)
}

function DoenetEditor() {

    const content = "<outer>\n <inner>\n  I am inside\n </inner>\n</outer>";

    return(
        <Editor content={content} mountKey="mountkey-1"/>
    )
}

export default DoenetEditor;