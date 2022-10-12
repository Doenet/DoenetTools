import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TextfieldStyling = styled.input`
  margin: 0px 4px 0px 0px;
  height: 24px;
  width: ${props => props.width}; // Menu prop
  border: 2px solid ${props => props.disabled ? 'var(--mainGray)' : (props. alert ? 'var(--mainRed)' : 'var(--canvastext)')};
  font-family: Arial;
  border-radius: var(--mainBorderRadius);
  color: var(--canvastext);
  resize: none;
  white-space: nowrap;
  /* padding: 0px 5px 0px 5px; */
  line-height: 24px;
  font-size: 14px;
  background-color: var(--canvas);
  cursor: ${props => props.disabled ? 'not-allowed' : 'auto'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  width: ${props => props.inputWidth};
  &:focus {
    outline: 2px solid ${props => props.disabled ? 'var(--mainGray)' : (props. alert ? 'var(--mainRed)' : 'var(--canvastext)')};
    outline-offset: 2px;
  }
`

export default function Textfield(props) {
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'initial' : 'flex';
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const inputRef = useRef(null);
  //Assume small

  var textfieldValue = {
    value: `${props.value}`,
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


  if (props.label) {
    label.value = props.label;
  };

  if (props.value) {
    textfieldValue.value = props.value;
  };

  if (props.placeholder) {
    textfieldValue.placeholder = props.placeholder;
  };

  var disable = "";
  var read_only = false
  if (props.disabled) {
    disable = "disabled";
    read_only = true
  };

  var inputWidth = ""
  if (props.width) {
    if (props.width === "menu") {
      inputWidth = 'var(--menuWidth)';
      if (props.label) {
        container.width = 'var(--menuWidth)';
        inputWidth = '100%';
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
            <p style={label} id="textfield-label">{label.value}</p>
            <TextfieldStyling aria-disabled={props.disabled ? true : false} aria-labelledby="textfield-label" type="text" width={inputWidth} readOnly={read_only} alert={props.alert} disabled={props.disabled} ref={inputRef} value={props.value} placeholder={textfieldValue.placeholder} aria-label={textfieldValue.ariaLabel} style={textfieldValue} data-test={props["data-test"]} onChange={(e) => { handleChange(e) }} onBlur={(e) => { handleBlur(e) }} onKeyDown={(e) => { handleKeyDown(e) }}></TextfieldStyling>
      </div>
    </>
  )
};