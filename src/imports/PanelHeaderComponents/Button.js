import React from 'react';
import { doenetComponentForegroundActive } from "./theme.js"

export default function Button(props) {
  //Assume small
  var button = {
        margin: '0px',
        height: '24px',
        border: `hidden`,
        backgroundColor: `${doenetComponentForegroundActive}`,
        fontFamily: 'Arial',
        color: '#FFFFFF',
        borderRadius: '20px',
        text: 'Button',
        padding: '0px 10px 0px 10px',
        cursor: 'pointer',
        fontSize: '12px'
      };
  if (props.size === "medium") {
    button.height = '36px',
    button.fontSize = '18px'
  };
  if (button.width < button.height) {
    button.width = '85px'
    };
  if (props.text) {
      button.text = props.text;
  };
  if (props.alert) {
    button.backgroundColor = "#C1292E";
  }
  function handleClick() {
    if (props.callback) props.callback()
  }
    return (
        <>
            <button style={button} onClick={() => { handleClick() }}>{button.text}</button>
        </>
    )
}