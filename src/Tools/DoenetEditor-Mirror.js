import React, { useEffect } from 'react';

import ToolLayout from './ToolLayout/ToolLayout';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel';

//CodeMirror 6 Imports
import {EditorState, StateField} from '@codemirror/next/state';
import {EditorView, ViewPlugin} from '@codemirror/next/view';
import {basicSetup} from '@codemirror/next/basic-setup';
// import {htmlSyntax, html} from '@codemirror/next/lang-html';
import {doenetmlSyntax, doenetml} from './lang-doenetml.js';

//This is a mirror of DoenetEditor that uses 
//CodeMirror 6 instead of Monaco Editor

function getTag(tree, position) {//Function to get tag name from position
    let buffer = tree.children[0].buffer;
    let types = tree.children[0].group.types;
    let sym_tagname = -1;

    //Find the int corresponding to node type "TagName"
    for (let i=0; i < types.length; i++) {
        if (types[i].name == "TagName") {
            sym_tagname = i;
        }
    }

    let tag_range = [0, 0];
    if (sym_tagname > -1) {
        //Search for a TagName containing the position
        for (let i=0; i < buffer.length; i+=4) {
            if (position < buffer[i+1]) {
                break; //No more nodes will contain position in its range
            } else {
                if (position <= buffer[i+2] && buffer[i] == sym_tagname) {
                    tag_range[0] = buffer[i+1];
                    tag_range[1] = buffer[i+2];
                    break;
                }
            }
        }
    }
    return tag_range;
}

let currentTag = StateField.define({
    //Sets initial value
    create() {return ""},
    //Updates value based on transaction
    update(value, tr) {
        console.log(tr.state.tree);
        // console.log(tr.state.doc);
        // console.log(tr.state.selection);

        let position = tr.state.selection.ranges[0].to;

        let word = "";
        let tag_range = getTag(tr.state.tree, position);

        // if (istag) {
        //     const text = tr.state.doc.text;

        //     let line_count = 0;
        //     for (let i=0; i < text.length; i++) {
        //         line_count = text[i].length;

        //         if (position > line_count) {
        //             position -= line_count+1; //+1 for the linebreak
        //         } else {
        //             let line = text[i];
        //             let line1 = line.slice(0, position).split(/\s|<|>|\//);
        //             let line2 = line.slice(position, line.length).split(/\s|<|>|\/|\n/);
        //             word = line1[line1.length-1].concat(line2[0]);
        //             break;
        //         }

        //     }
        //     console.log(word);
        // }

        // word = text.sliceString(tag_range[0], tag_range[1], "\n");
        word = tr.state.sliceDoc(tag_range[0], tag_range[1]);
        if (word != "") console.log(word);

        return tr.docChanged ? word : value
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
        extensions: [basicSetup, doenetml(), currentTag, wordGetterPlugin]
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