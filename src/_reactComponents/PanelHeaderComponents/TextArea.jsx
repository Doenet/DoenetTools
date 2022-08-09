import React, { useState } from 'react';
import styled from 'styled-components';

const Textarea = styled.textarea`
  margin: 0px 4px 0px 0px;
  height: 24px;
  border: 2px solid ${props => props.disabled ? 'var(--mainGray)' : (props. alert ? 'var(--mainRed)' : 'var(--canvastext)')};
  border-radius: var(--mainBorderRadius);
  font-family: Arial;
  font-size: 14px;
  color: var(--canvastext);
  cursor: ${props => props.disabled ? 'not-allowed' : 'auto'};
  width: ${props => props.inputWidth};
  &:focus {
    outline: 2px solid ${props => props.disabled ? 'var(--mainGray)' : (props. alert ? 'var(--mainRed)' : 'var(--canvastext)')};
    outline-offset: 2px;
  }
`;

export default function TextArea(props) {
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const [text, setText] = useState("");
  //Assume small

  var textareaValue = {
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

  if (props.label) {
    label.value = props.label;
  };

  if (props.placeholder) {
    textareaValue.placeholder = props.placeholder;
  };

  var disable = "";
  if (props.disabled) {
    disable = "disabled";
  };

  if (props.value) {
    textareaValue.value = props.value;
  };

  var inputWidth = "";
  if (props.width) {
    if (props.width === "menu") {
      inputWidth = '235px';
      if (props.label) {
        container.width = '235px';
        inputWidth = '100%';
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
            <p style={label} id="textarea-label">{label.value}</p>
            <Textarea aria-disabled={props.disabled ? true : false} aria-labelledby="textarea-label" defaultValue={textareaValue.value} width={inputWidth} aria-label={textareaValue.ariaLabel} placeholder={textareaValue.placeholder} onChange={(e) => { handleChange(e) }} onKeyDown={(e) => {handleKeyDown(e) }} onBlur={(e) => { handleBlur(e) }} disabled={disable} alert={props.alert}></Textarea>
      </div>
    </>
  )
};