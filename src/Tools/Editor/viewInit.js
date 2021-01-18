import {EditorState, StateField} from '@codemirror/next/state';
import {EditorView} from '@codemirror/next/view';
import {basicSetup} from '@codemirror/next/basic-setup';
import {doenetml} from './lang-doenetml.js';

import {getTagProps} from './parsing.js';

export function getInitView(contentInit, contentCallback, tagCallback) {
    let currentTag = StateField.define({
        //Sets initial value
        create() {return ""},
        //Updates value based on transaction
        update(value, tr) {
            // console.log(tr.state.tree);
            // console.log(tr.state.doc);
            // console.log(tr.state.selection);
    
            let position = tr.state.selection.ranges[0].to;
    
            let tag = getTagProps(tr.state.doc, tr.state.tree, position);

            contentCallback(tr.state.doc);
            tagCallback(tag);
            return tr.docChanged ? tag : value;
        }
    });

    console.log("View Init only twice");

    let startState = EditorState.create({
        doc: contentInit,
        extensions: [ basicSetup, doenetml(), currentTag]
    });

    let view_init = new EditorView({
        state: startState
    });

    return view_init;
}