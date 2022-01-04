import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeEditor(props){
  let {name, SVs, actions} = useDoenetRenderer(props,false);
  let currentValue = useRef(SVs.immediateValue)
  let timer = useRef(null)
  let editorRef = useRef(null)
  let updateInternalValue = useRef(SVs.immediateValue)

if (SVs.hidden) {
  return null;
}

const inputKey = name + '_input';
const codemirrorKey = name + '_codemirror';

//Received update from core to immediateValue
//NOTE: currently causes a scrolling issue
//https://codemirror.net/doc/manual.html#events
// cm.scrollTo(x: number, y: number)
// Scroll the editor to a given (pixel) position. Both arguments may be left as null or undefined to have no effect.
// cm.getScrollInfo() → {left, top, width, height, clientWidth, clientHeight}
// Get an {left, top, width, height, clientWidth, clientHeight} object that represents the current scroll position, the size of the scrollable area, and the size of the visible area (minus scrollbars).

if (SVs.immediateValue !== currentValue.current) {
  currentValue.current = SVs.immediateValue;
  updateInternalValue.current = SVs.immediateValue;
}

let input = <div 
            key={inputKey}
            id={inputKey}

            style={{
              width: sizeToCSS(SVs.width),
              // height: sizeToCSS(SVs.height),
              maxHeight: sizeToCSS(SVs.height),
              minHeight: sizeToCSS(SVs.height),
              padding: "0px",
              border: "1px solid black",
              overflowY: "scroll"
              // display: "inline"
            }}>
  <CodeMirror
  key = {codemirrorKey}
  editorRef = {editorRef}
  setInternalValue = {updateInternalValue.current}
  //TODO: read only isn't working <codeeditor disabled />
  readOnly = {SVs.disabled}
   //TODO: wire up onBlur in codemirror

  onBlur={(e)=>{
    console.log("BLUR!!!!!")
    actions.updateValue();
  }}
  onBeforeChange={(value) => {
    currentValue.current = value;
    actions.updateImmediateValue({
      text: value
    });
   
  //TODO: when you try to leave the page before it saved you will lose work
  //so prompt the user on page leave
    if (timer.current === null){
      timer.current = setTimeout(function(){
          actions.updateValue();
        timer.current = null;
      },3000)//3 seconds
    }

  }}
/>
</div>

  return <>
  <a name={name} />
  <span className="codeEditorSurroundingBox" id={name}>
    {input}
  </span>

</>
}