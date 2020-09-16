import React, { useState } from 'react';
import { doenetComponentForegroundActive } from "./theme.js"

export default function ToggleButton(props) {
    const [isSelected, setSelected] = useState(false)
    //Assume small
    var toggleButton = {
        margin: '0px',
        height: '40px',
        border: `2px solid ${doenetComponentForegroundActive}`,
        color: `${doenetComponentForegroundActive}`,
        backgroundColor: '#FFF',
        fontFamily: 'Arial',
        borderRadius: '5px',
        text: 'Toggle Button',
        padding: '0px 10px 0px 10px',
        cursor: 'pointer',
        fontSize: '12px'
      }
    if (props.size === "medium") {
        toggleButton.height = '85px',
        toggleButton.fontSize = '24px'
    }
    if (props.text) {
        toggleButton.text = props.text;
    }
    if (isSelected === true) {
        toggleButton.backgroundColor = `${doenetComponentForegroundActive}`;
        toggleButton.color = '#FFF';
        toggleButton.border = '2px solid #FFF'
    }
    function handleClick() {
        if (isSelected === false) {
            setSelected(true)
        } if (isSelected === true) {
            setSelected(false)
        }
    }
    return (
        <>
            <button id="toggleButton" style={toggleButton} onClick={() => { handleClick() }}>{toggleButton.text}</button>
        </>
    )
}