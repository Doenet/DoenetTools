import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './editor.css';

//CodeMirror 6 Imports

//This is a mirror of DoenetEditor that uses 
//CodeMirror 6 instead of Monaco Editor

//To Do:
//How does code mirror tell if the editor was modified by a human
//Implement React component the alternates between text and form
//Think about how to structure this update architecture
//Figure how code mirror modifies text

//Work for closing tags as well
//Test Case the different tag types
//What about tags inside tags?

// Should there be a difference between quoted/unquoted attr values
// What if the user puts the same attr name twice?

function Editor(props) {

    let { mountKey, view } = props;

    useEffect(() => {
        const containerRoot = document.getElementById(mountKey);
        containerRoot.appendChild(view.dom);

        return function cleanup() {
            let editor = document.getElementById(mountKey);
            editor.removeChild(editor.childNodes[0]);
        };
    });

    return(
        <div id={mountKey}/>
    )
}

export default Editor;