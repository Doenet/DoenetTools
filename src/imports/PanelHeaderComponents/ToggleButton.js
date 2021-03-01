import React, { useState } from 'react';
import { doenetMainBlue } from "./theme.js";

export default function ToggleButton(props) {
    const [isSelected, setSelected] = useState(props.isSelected ? props.isSelected : false);
    const [labelVisible, setLabelVisible] = useState(props.label ? 'inline' : 'none')
    //Assume small
    var toggleButton = {
        margin: '0px',
        height: '24px',
        border: `2px solid ${doenetMainBlue}`,
        color: `${doenetMainBlue}`,
        backgroundColor: '#FFF',
        borderRadius: '5px',
        value: 'Toggle Button',
        padding: '0px 10px 0px 10px',
        cursor: 'pointer',
        fontSize: '12px',
        textAlign: 'center'
      }
    var label ={
        value: 'Label:',
        fontSize: '12px',
        display: `${labelVisible}`
    }
    var icon = '';
    if (props.size === "medium") {
        toggleButton.height = '36px',
        toggleButton.fontSize = '18px',
        label.fontSize = '18px'
    }
    if (props.value || props.icon){
        if (props.value && props.icon){
            icon = props.icon;
            toggleButton.value = props.value
        }
        else if (props.value){
            toggleButton.value = props.value
        }
        else if (props.icon){
            icon = props.icon;
            toggleButton.value = ''
        }
    }
    if (props.alert) {
        toggleButton.border = '2px solid #C1292E';
        toggleButton.color = '#C1292E'
    }
    if (isSelected === true) {
        toggleButton.backgroundColor = `${doenetMainBlue}`;
        toggleButton.color = '#f6f8ff';
        toggleButton.border = '2px solid #f6f8ff';
        if (props.switch_text) toggleButton.text = props.switch_text
        if (props.alert) {
            toggleButton.backgroundColor = '#C1292E';
        }
        
    }
    function handleClick() {
        if (isSelected === false) {
            setSelected(true)
        } if (isSelected === true) {
            setSelected(false)
        }
        if (props.callback) props.callback();
    }
    if (props.label) {
        label.value = props.label
    }
    return (
        <>
            <p style={label}>{label.value}</p>
            <button id="toggleButton" style={toggleButton} onClick={() => { handleClick() }}>{icon}{' '}{toggleButton.value}</button>
        </>
    )
}