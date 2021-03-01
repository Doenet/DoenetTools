import React from 'react';
import { doenetComponentForegroundInactive } from "./theme.js"

export default function Textfield(props) {
  //Assume small
  var textfield = {
        margin: '0px',
        height: '24px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        fontFamily: 'Arial',
        borderRadius: '5px',
        color: '#000',
        text: 'Enter text here'
      }
  if (props.size === "medium") {
    textfield.height = '36px'
  }
  if (props.text) {
    textfield.text = props.text;
  }
  if (props.alert) {
    textfield.border = '2px solid #C1292E'
  }
    return (
        <>
            <textarea defaultValue={textfield.text} style={textfield}></textarea>
        </>
    )
}