import React, { useState } from 'react';
import { doenetComponentForegroundInactive } from "./theme"

export default function TextArea(props) {
  const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none')
  const [align, setAlign] = useState(props.vertical ? 'static' : 'flex');
  //Assume small
  var textarea = {
        margin: '0px 4px 0px 4px',
        height: '24px',
        border: `2px solid ${doenetComponentForegroundInactive}`,
        fontFamily: 'Arial',
        borderRadius: '5px',
        color: '#000',
        value: 'Enter text here'
      }
      var label ={
        value: 'Label:',
        fontSize: '12px',
        display: `${labelVisible}`,
        marginRight: '5px',
        marginBottom: `${align == 'flex' ? 'none' : '2px'}`
    }
    
    var container = {
        display: `${align}`,
        width: 'auto',
        alignItems: 'flex-end'
    }

    if (props.alert) {
      textarea.border = '2px solid #C1292E'
    }
    if (props.label) {
      label.value = props.label;
  }
  var disable = "";
  if (props.disabled) {
    textarea.border = '2px solid #e2e2e2';
    textarea.cursor = 'not-allowed';
    disable = "disabled";
  }
  if (props.value) {
    textarea.value = props.value;
}
if (props.width) {
  if (props.width === "menu") {
    textarea.width = '235px';
    if (props.label) {
      container.width = '235px';
      textarea.width = '100%';
    }
  } 
}
function handleChange(e) {
  if (props.onChange) props.onChange(e.target.value)
}

    return (
        <>
          <div style={container}>
                <p style={label}>{label.value}</p>
                <textarea defaultValue={textarea.value} style={textarea} onChange={(e) => { handleChange(e) }} disabled={disable}></textarea>
          </div>
        </>
    )
}