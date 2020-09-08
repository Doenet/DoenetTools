import React from 'react';
import { doenetComponentForegroundInactive } from "./theme.js"

export default function Textfield(props) {
  //Assume small
  var textfield = {
        margin: '0px',
        height: '40px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        fontFamily: 'Arial',
        borderRadius: '5px',
        color: '#000'
      };
  if (props.size === "medium") {
    textfield.height = '85px'
  };
    return (
        <>
            <textarea defaultValue="Enter text here" style={textfield}></textarea>
        </>
    )
}