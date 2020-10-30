import React from 'react';
import { doenetComponentForegroundInactive } from "./theme.js"

export default function ActionButton(props) {
  //Assume small
  var actionButton = {
        margin: '0px',
        height: '24px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        color: '#000',
        backgroundColor: '#FFF',
        fontFamily: 'Arial',
        borderRadius: '5px',
        text: 'Action Button',
        padding: '0px 10px 0px 10px',
        cursor: 'pointer',
        fontSize: '12px'
      };
  if (props.size === "medium") {
    actionButton.height = '36px',
    actionButton.fontSize = '18px'
  };
  if (props.text) {
      actionButton.text = props.text;
  };
    return (
        <>
            <button id="actionButton" style={actionButton} onClick={() => { handleClick() }}>{actionButton.text}</button>
        </>
    )
}