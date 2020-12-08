import React, { useState, useEffect, useRef } from 'react';
import ToggleButton from '../../imports/PanelHeaderComponents/ToggleButton.js';
import {attrsLookup} from './lang-doenetml.js';
import './infopanel.css';

// Button that puts quotes around an attribute value
function QuoteButton(props) {

    const onClick = function() {
        props.updateView(props.offset1, props.offset2, "\"" + props.name + "\"");
    };

    return (
        <>
        <button onClick={onClick}>{props.name}</button>
        <label> {"<-- Add Quotes!"} </label>
        </>
    )
}

function NameForm(props) {
    let { name } = props;
    const [isForm, setForm] = useState(false);
    const formEl = useRef(null);

    const handleTextClick = function() {
        setForm(!isForm);
    }

    const handleFormClick = function() {
        setForm(!isForm);
        if (name !== formEl.current.value) {
            if (formEl.current.value === "") {
                props.updateView(props.fulloffset1-1, props.fulloffset2, "");
            } else {
                props.updateView(props.offset1, props.offset2, formEl.current.value);
            }
        }
    };

    useEffect(() => {
        if (isForm) formEl.current.focus();
    });

    const handleKeyUp = function(e) {
        if (e.keyCode === 13) handleFormClick();
    }

    return (
        <>
            {(isForm) ? 
                <input type="text" ref={formEl} onClick={handleFormClick} defaultValue={name} onKeyUp={handleKeyUp}/>
            : <label onClick={handleTextClick}>
                {name}
              </label>}
        </>
    )
}

// Form that allows the user to change attr value's from the Info Panel
function ValForm(props) {
    let { name } = props;
    const [isForm, setForm] = useState(false);
    const formEl = useRef(null);

    const handleTextClick = function() {
        setForm(!isForm);
    }

    const handleFormClick = function() {
        setForm(!isForm);
        if (name !== formEl.current.value) {
            if (formEl.current.value === "") {
                props.updateView(props.offset1, props.offset2, "");
            } else if (name === "") {
                props.updateView(props.offset1, props.offset2, "\"" + formEl.current.value + "\"");
            } else {
                props.updateView(props.offset1+1, props.offset2-1, formEl.current.value);
            }
        }
    };

    useEffect(() => {
        if (isForm) formEl.current.focus();
    });

    const handleKeyUp = function(e) {
        if (e.keyCode === 13) handleFormClick();
    }

    return (
        <>
            {(isForm) ? 
                <input type="text" ref={formEl} onClick={handleFormClick} defaultValue={name} onKeyUp={handleKeyUp}/>
            : <label onClick={handleTextClick}>
                {name}
              </label>}
        </>
    )
}

// Toggle Button for switching an attr value between true and false
function ToggleButtonWrapper(props) {

    let isSelected = props.name === "true" ? true : false

    const toggleCallback = function() {
        props.updateView(props.offset1, props.offset2, isSelected ? "\"false\"" : "\"true\"");
    };

    return(
        <>
        <ToggleButton text="False" switch_text="True" 
        isSelected={isSelected}
        callback={toggleCallback}/>
        </>
    )
}

function NewForm(props) { // Form made when clicking the button in InfoPanel to add new attribute
    const [name_isForm, setNameForm] = useState(false);
    const [val_isForm, setValForm] = useState(false);
    const name_ref = useRef(null);
    const val_ref = useRef(null);

    const [currVal, setCurrVal] = useState("<Type in Me!>");

    let { offset } = props;

    const handleNameTextClick = function() {
        setNameForm(!name_isForm);
    }

    const handleValTextClick = function() {
        setValForm(!val_isForm);
    }

    const handleNameFormClick = function() {
        setNameForm(!name_isForm);
        props.setNewAttr(false);
        if (name_ref.current.value !== "") {
            let spacing = props.addSpace ? " " : "";
            let val = val_isForm ? val_ref.current.value : currVal;
            props.updateView(offset, offset, spacing + name_ref.current.value + "=" + "\"" + val + "\"");
        }
    };

    const handleValFormClick = function() {
        setValForm(!val_isForm);
        setCurrVal(val_ref.current.value);
    };

    const handleNameKeyUp = function(e) {
        if (e.keyCode === 13) handleNameFormClick();
    }

    const handleValKeyUp = function(e) {
        if (e.keyCode === 13) handleValFormClick();
    }
    
    return (
        <>
        {(name_isForm) ? 
                <input type="text" ref={name_ref} onClick={handleNameFormClick} onKeyUp={handleNameKeyUp}/>
            : <label onClick={handleNameTextClick}>
                {"<Type in Me!>"}
              </label>}
        {": "}
        {(val_isForm) ? 
                <input type="text" ref={val_ref} onClick={handleValFormClick} onKeyUp={handleValKeyUp}/>
            : <label onClick={handleValTextClick}>
                {currVal}
              </label>}
        </>
    )

}

function InfoPanel(props) {
    let { curr_tag } = props;
    let { view, setView } = props;

    let tagname = curr_tag.tagname;
    let attrs = curr_tag.attrs;

    let tag_dict = attrsLookup(tagname);

    let tags_mentioned = {};

    let furthest_val_dist = curr_tag.tagend-1; // Used to determine where to insert new attrs from AddAttrButton

    const [isNewAttr, setNewAttr] = useState(false);

    const updateView = function(offset1, offset2, newval) {
        let transaction = {changes: {from: offset1, to: offset2, insert: newval}};
        view.dispatch(transaction);
        setView(view);
        return transaction;
    };

    const attrToEntry = function(x) {
        let name_props = x.attrname_props;
        let val_props = x.attrval_props;

        if (tags_mentioned[name_props[0]]) {
            tags_mentioned[name_props[0]] += 1;
        } else {
            tags_mentioned[name_props[0]] = 1;
        }

        furthest_val_dist = val_props[2];

        if (!val_props[3]) {
            return (
                <li key={name_props[0] + tags_mentioned[name_props[0]].toString()}>
                    <NameForm name={name_props[0]}
                    offset1={name_props[1]} offset2={name_props[2]}
                    fulloffset1={name_props[1]} fulloffset2={val_props[2]}
                    updateView={updateView}/>
                    {": "}
                    <QuoteButton name={val_props[0]}
                    offset1={val_props[1]} offset2={val_props[2]}
                    updateView={updateView}/>
                </li>
            )
        }

        if (val_props[0].toLowerCase() === "true" || val_props[0].toLowerCase() === "false") {
            return (
                <li key={name_props[0] + tags_mentioned[name_props[0]].toString()}>
                    <NameForm name={name_props[0]}
                    offset1={name_props[1]} offset2={name_props[2]}
                    fulloffset1={name_props[1]} fulloffset2={val_props[2]}
                    updateView={updateView}/>
                    {": "}
                    <ToggleButtonWrapper name={val_props[0]} 
                    offset1={val_props[1]} offset2={val_props[2]}
                    updateView={updateView}/>
                </li>
            )
        }

        return(
        <li key={name_props[0] + tags_mentioned[name_props[0]].toString()}>
            <NameForm name={name_props[0]}
            offset1={name_props[1]} offset2={name_props[2]}
            fulloffset1={name_props[1]} fulloffset2={val_props[2]}
            updateView={updateView}/>
            {": "}
            <ValForm name={val_props[0]}
            offset1={val_props[1]} offset2={val_props[2]}
            updateView={updateView}/>
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
            <ul>
                {attrs!==undefined && attrs.length!=0 ? attrs.map(attrToEntry) : <></>}
                {tag_dict ? Object.keys(tag_dict["properties"]).filter(x => tags_mentioned[x] === undefined).map(propToEntry) : <></>}
                {!tag_dict && (attrs===undefined || attrs.length==0) ? <div>No props found</div> : <></>}
                {(tagname && tagname != "") ? (isNewAttr ?
                    <>
                    <li key={"temp_form"}>
                    <NewForm offset={furthest_val_dist} addSpace={furthest_val_dist+1 == curr_tag.tagend}
                    setNewAttr={setNewAttr} updateView={updateView}/>
                    </li>
                    <li key={"undo_button"}>
                    <button onClick={() => setNewAttr(!isNewAttr)}>{"Click Me to Undo"}</button>
                    </li>
                    </>
                :
                    <li key={"attr_button"}>
                    <button onClick={() => setNewAttr(!isNewAttr)}>{"Click me to add new Type!"}</button>
                    </li>)
                :
                    <></>
                }
            </ul>
        </>
    )

}

export default InfoPanel;