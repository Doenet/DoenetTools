import React, { useState, useEffect, useRef } from 'react';

export default function Textfield(props) {
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const inputRef = useRef(null);
  //Assume small

  var textfield = {
    margin: '0px 4px 0px 0px',
    height: '24px',
    border: 'var(--mainBorder)',
    fontFamily: 'Arial',
    borderRadius: 'var(--mainBorderRadius)',
    color: 'var(--canvastext)',
    value: `${props.value}`,
    resize:'none',
    whiteSpace: 'nowrap',
    padding:"0px 5px 0px 5px",
    lineHeight:"24px",
    fontSize: "14px",
    backgroundColor:"var(--canvas)"
  };

  var label ={
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

  useEffect(() => {
    inputRef.current.selectionStart = cursorStart;
    inputRef.current.selectionEnd = cursorEnd;
  });

  if (props.alert) {
    textfield.border = '2px solid var(--mainRed)'
  };

  if (props.label) {
    label.value = props.label;
  };

  if (props.value) {
    textfield.value = props.value;
  };

  if (props.placeholder) {
    textfield.placeholder = props.placeholder;
  };

  if (props.ariaLabel) {
    textfield.ariaLabel = props.ariaLabel;
  };

  var disable = "";
  if (props.disabled) {
    textfield.border = '2px solid var(--mainGray)';
    textfield.cursor = 'not-allowed';
    disable = "disabled";
  };

  if (props.width) {
    if (props.width === "menu") {
      textfield.width = '200px';
      if (props.label) {
        container.width = '200px';
      }
    } 
  };

  function handleChange(e) {
    if (props.onChange) props.onChange(e)
    setCursorStart(e.target.selectionStart);
    setCursorEnd(e.target.selectionEnd);
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
            <input type="text" ref={inputRef} value={props.value} placeholder={textfield.placeholder} aria-label={textfield.ariaLabel} style={textfield} onChange={(e) => { handleChange(e) }} onBlur={(e) => { handleBlur(e) }} onKeyDown={(e) => { handleKeyDown(e) }} disabled={disable}></input>
      </div>
    </>
  )
};