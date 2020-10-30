import React, { useState, useEffect, useRef } from 'react';
import ToggleButton from '../../imports/PanelHeaderComponents/ToggleButton.js';
import './editor.css';

//CodeMirror 6 Imports
import {EditorState, StateField} from '@codemirror/next/state';
import {EditorView} from '@codemirror/next/view';
import {basicSetup} from '@codemirror/next/basic-setup';
// import {htmlSyntax, html} from '@codemirror/next/lang-html';
import {doenetml, attrsLookup} from './lang-doenetml.js';

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

//Move these files into a seperate folder called Editor

// Should there be a difference between quoted/unquoted attr values
// What if the user puts the same attr name twice?

//returns an object with three fields
//(1) pos: the buffer index of the open/self-closing tag corresponding to the tag containing the given document position
//  Returns the buffer index of the closing tag if no open tag is found
//  -1 indicates no tag contains position
//(2) tagname: The name of the tag containing position
//(3) open: Boolean indicating if an open tag was found.
function findTag(doc, tree, position) {
    let tag = {pos: -1, tagname: "", open: true}

    let buffer = tree.buffer;
    let types = tree.group.types;
    let sym_open = -1;
    let sym_close = -1;
    let sym_selfclose = -1;
    let sym_tagname = -1;
    let sym_mismatch = -1; //mismatched tag names

    //find symbols
    for (let i=0; i < types.length; i++) {
        switch(types[i].name) {
            case "OpenTag":
                sym_open = i;
                break;
            case "CloseTag":
                sym_close = i;
                break;
            case "SelfClosingTag":
                sym_selfclose = i;
                break;
            case "TagName":
                sym_tagname = i;
                break;
            case "MismatchedTagName":
                sym_mismatch = i;
                break;
        }
    }

    if (sym_tagname < 0) return tag;
    //find pos
    for (let i=0; i < buffer.length; i+=4) {
        if (position < buffer[i+1]) {
            break; //No more nodes will contain position in its range
        } else {
            if (position <= buffer[i+2] && (buffer[i]==sym_open || buffer[i]==sym_selfclose || buffer[i]==sym_close)) {
                tag.pos = i;
                if (buffer[i]==sym_close) tag.open = false;
                break;
            }
        }
    }
    if (tag.pos < 0) return tag;

    //find tagname
    for (let i=tag.pos; i < buffer.length; i+=4) {
        if (buffer[i+2] > buffer[tag.pos+2]) {
            break; 
        } else {
            if (buffer[i] == sym_tagname || buffer[i] == sym_mismatch) {
                tag.tagname = doc.sliceString(buffer[i+1], buffer[i+2]);
                break;
            }
        }
    }

    //If in a closing tag find the open tag
    if (!tag.open) {
        let close_tag_i = tag.pos;
        let in_open_tag = false;
        let open_tag_end = 0;
        let possible_indices = [];
        for (let i=0; i < close_tag_i; i+=4) {
            if (in_open_tag && buffer[i+2] <= open_tag_end ) {
                if (buffer[i] == sym_tagname || buffer[i] == sym_mismatch) {
                    if (doc.sliceString(buffer[i+1],buffer[i+2]) == tag.tagname) {
                        possible_indices.push(i);
                    }
                }
            } else {
                if (in_open_tag) in_open_tag = false;
                if (buffer[i] == sym_open) {
                    in_open_tag = true;
                    open_tag_end = buffer[i+2];
                } else if (buffer[i] == sym_close) {
                    possible_indices.pop();
                }
            }
        }

        let found_open_tag = possible_indices.pop();
        if (found_open_tag !== undefined) {
            tag.pos = found_open_tag;
            tag.open = true;
        }
    }

    return tag;
}

//Finds the attributes for a tag given its buffer index init_i
function getAttrs(doc, tree, init_i) {
    let attrs = [];

    let sym_attrname = -1;
    let sym_attrval = -1;
    let sym_unquoteval = -1;

    let buffer = tree.buffer;
    let types = tree.group.types;

    for (let i=0; i < types.length; i++) {
        if (types[i].name == "AttributeName") {
            sym_attrname = i;
        } else if (types[i].name == "AttributeValue") {
            sym_attrval = i;
        } else if (types[i].name == "UnquotedAttributeValue") {
            sym_unquoteval = i;
        }
    }

    let subtree_end = buffer[init_i+2];
    let curr_index = -1;
    let name_exists = 0;
    for (let i = init_i; i < buffer.length; i+= 4) {
        if (buffer[i+2] > subtree_end) break;

        if (buffer[i] == sym_attrname) {
            let curr_attr = doc.sliceString(buffer[i+1], buffer[i+2]);
            attrs.push([curr_attr, "", 0, 0]);
            curr_index += 1;
            name_exists = 1;
        } else if (name_exists && (buffer[i] == sym_attrval || buffer[i] == sym_unquoteval)) {
            attrs[curr_index][1] = doc.sliceString(buffer[i+1], buffer[i+2]);
            attrs[curr_index][2] = buffer[i+1];
            attrs[curr_index][3] = buffer[i+2];
            name_exists = 0;
        }
    }

    return attrs;
}

//Get the smallest Tree Buffer containing the position.
//Returns null if there is none.
function getTreeBuff(tree, position) {
    let curr_tree = tree;
    let offset = position;
    while (curr_tree && curr_tree.buffer === undefined) {
        if (curr_tree.type.name === "Text") return null;
        let positions = curr_tree.positions;
        let infinum = 0;
        for (let i=1; i<positions.length; i++) {
            if (positions[i] > offset) break;
            infinum = i;
        }
        curr_tree = curr_tree.children[infinum];
        offset -= positions[infinum];
    }
    return {buffer: curr_tree, offset: offset};
}

//Returns an object representing the properties of a tag
//If given a closing tag it will only return the tag name
function getTagProps(doc, tree, position) {
    console.log("This is the init position. ", position);
    let tag_props = {tagname: "", attrs: []};
    if (tree.children.length == 0) return tag_props;

    let bufferProps = getTreeBuff(tree, position);
    if (bufferProps === null) return tag_props;

    let tree_buff = bufferProps.buffer;
    let offset = bufferProps.offset;

    console.log(tree_buff);
    console.log(offset);

    let basic_tag_props = findTag(doc, tree_buff, offset);
    if (basic_tag_props.pos < 0) return tag_props;
    tag_props.tagname = basic_tag_props.tagname;

    console.log(basic_tag_props);
    
    if (!basic_tag_props.open) return tag_props;
    tag_props.attrs = getAttrs(doc, tree_buff, basic_tag_props.pos);

    return tag_props;
}

function TextForm(props) {
    let { tagname } = props; let { tagval } = props;
    const [isForm, setForm] = useState(false);
    const formEl = useRef(null);

    if (!tagname) return null;

    const handleTextClick = function() {
        setForm(!isForm);
    }

    const handleFormClick = function() {
        setForm(!isForm);
        if (tagval !== formEl.current.value) {
            props.updateView(props.offset1, props.offset2, formEl.current.value);
        }
    };

    useEffect(() => {
        if (isForm && tagval) formEl.current.focus();
    });

    const handleKeyUp = function(e) {
        if (e.keyCode === 13) handleFormClick();
    }

    return (
        <>
            {(isForm && tagval) ? 
                <><label>{tagname}: </label><input type="text" ref={formEl} onClick={handleFormClick} defaultValue={tagval} onKeyUp={handleKeyUp}/>
                </>
            : <label onClick={handleTextClick}>{tagname}: {tagval}</label>}
        </>
    )
}

function ToggleButtonWrapper(props) {

    let isSelected = props.tagval === "true" ? true : false

    const toggleCallback = function() {
        props.updateView(props.offset1, props.offset2, isSelected ? "false" : "true");
    };

    return(
        <>
        <label>{props.tagname}:</label>
        <ToggleButton text="False" switch_text="True" 
        isSelected={isSelected}
        callback={toggleCallback}/>
        </>
    )
}

function InfoPanel(props) {
    let { curr_tag } = props;
    let { view } = props;

    let tagname = curr_tag.tagname;
    let attrs = curr_tag.attrs;

    let tag_dict = attrsLookup(tagname);

    let tags_mentioned = {};

    const updateView = function(offset1, offset2, newval) {
        let transaction = {changes: {from: offset1, to: offset2, insert: newval}};
        view.dispatch(transaction);
        props.setView(view);
        return transaction;
    };

    const attrToEntry = function(x) {
        tags_mentioned[x[0]] = 1;
        return(
        <li key={x[0]}>
            {(x[1].toLowerCase() === "true" || x[1].toLowerCase() === "false") ?
                <ToggleButtonWrapper tagname={x[0]} tagval={x[1]} 
                offset1={x[2]} offset2={x[3]}
                isSelected={false} updateView={updateView}/>
            :
                <TextForm tagname={x[0]} tagval={x[1]} 
                offset1={x[2]} offset2={x[3]}
                updateView={updateView}/>
                
            }
        </li>
        )
    }

    const propToEntry = function(x) {
        let default_val = tag_dict["properties"][x]["default"];
        if (default_val === true) default_val = "true";
        if (default_val === false) default_val = "false";
        if (default_val === "") default_val = "\"\"";
        if (default_val === undefined) 
            default_val = "{}";

        return(
        <li key={x} className="reference-tag">{x} : default : {default_val}</li>
        )
    }

    return(
        <>
        <h1>{tagname}</h1>
        {!tag_dict || !attrs ? <p>No props found</p> :
            <ul>
                {attrs.map(attrToEntry)}
                {Object.keys(tag_dict["properties"]).filter(x => tags_mentioned[x] === undefined).map(propToEntry)}
            </ul>
        } 
        </>
    )

}

function Editor(props) {
    const [curr_tag, setCurr_Tag] = useState({});

    let currentTag = StateField.define({
        //Sets initial value
        create() {return ""},
        //Updates value based on transaction
        update(value, tr) {
            console.log(tr.state.tree);
            // console.log(tr.state.doc);
            // console.log(tr.state.selection);
    
            let position = tr.state.selection.ranges[0].to;
    
            let tag = getTagProps(tr.state.doc, tr.state.tree, position);

            setCurr_Tag(tag);
            return tr.docChanged ? tag : value;
        }
    })

    let startState = EditorState.create({
        doc: props.content,
        extensions: [ doenetml(), currentTag]
    });

    let view_init = new EditorView({
        state: startState
    });

    const [view, setView] = useState(view_init);

    let { mountKey } = props;

    useEffect(() => {
        const containerRoot = document.getElementById(mountKey);
        containerRoot.appendChild(view.dom);

        // console.log(view.state.tree);

        return function cleanup() {
            let editor = document.getElementById(mountKey);
            editor.removeChild(editor.childNodes[0]);
        };
    }, [view]);

    return(
        <>
            <div id={mountKey}/>
            {(curr_tag.tagname != "") && <InfoPanel curr_tag={curr_tag} view={view} setView={setView}/>}
            <p>Hey! Look at me!</p>
        </>
    )
}

export default Editor;