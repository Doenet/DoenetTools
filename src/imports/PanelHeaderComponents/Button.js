import React from 'react';
import { doenetComponentForegroundActive } from "./theme.js"

export default function Button(props) {
  //Assume small
  var button = {
        margin: '0px',
        height: '40px',
        border: `2px hidden`,
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
    button.height = '85px',
    button.fontSize = '24px'
  };
  if (button.width < button.height) {
    button.width = '85px'
    };
  if (props.text) {
      button.text = props.text;
  };
    return (
        <>
            <button style={button}>{button.text}</button>
        </>
    )
}