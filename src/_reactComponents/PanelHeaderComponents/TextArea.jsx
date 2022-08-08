import React, { useState } from 'react';

export default function TextArea(props) {
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const [text, setText] = useState("");
  //Assume small

  var textarea = {
    margin: '0px 4px 0px 0px',
    height: '24px',
    border: 'var(--mainBorder)',
    fontFamily: 'Arial',
    fontSize: '14px',
    borderRadius: 'var(--mainBorderRadius)',
    color: 'var(--canvastext)',
    value: `${text}`
  };

  var label = {
    value: 'Label:',
    fontSize: '14px',
    display: `${labelVisible}`,
    marginRight: '5px',
    marginBottom: `${align == 'flex' ? 'none' : '2px'}`
  };
    
  var container = {
    display: `${align}`,
    width: 'auto',
    alignItems: 'center'
  };

  if (props.alert) {
    textarea.border = '2px solid var(--mainRed)'
  };

  if (props.label) {
    label.value = props.label;
  };

  if (props.placeholder) {
    textarea.placeholder = props.placeholder;
  };

  if (props.ariaLabel) {
    textarea.ariaLabel = props.ariaLabel;
  };

  var disable = "";
  if (props.disabled) {
    textarea.border = '2px solid var(--mainGray)';
    textarea.cursor = 'not-allowed';
    disable = "disabled";
  };

  if (props.value) {
    textarea.value = props.value;
  };

  if (props.width) {
    if (props.width === "menu") {
      textarea.width = '235px';
      if (props.label) {
        container.width = '235px';
        textarea.width = '100%';
      }
    } 
  };

  function handleChange(e) {
    if (props.onChange) props.onChange(e.target.value)
  };

  function handleBlur(e) {
    if (props.onBlur) props.onBlur(e)
  };

  function handleKeyDown(e) {
    if (props.onKeyDown) props.onKeyDown(e)
  };

  return (
    <>
      <div style={container}>
            <p style={label}>{label.value}</p>
            <textarea defaultValue={textarea.value} style={textarea} aria-label={textarea.ariaLabel} placeholder={textarea.placeholder} onChange={(e) => { handleChange(e) }} onKeyDown={(e) => {handleKeyDown(e) }} onBlur={(e) => { handleBlur(e) }} disabled={disable}></textarea>
      </div>
    </>
  )
};