import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeEditor(props){
  let {name, SVs, actions} = useDoenetRenderer(props,false);
  const [currentValue,setCurrentValue] = useState(SVs.value)
  let timer = useRef(null)
  let editorRef = useRef(null)
  console.log(SVs)

if (SVs.hidden) {
  return null;
}

const inputKey = name + '_input';
const codemirrorKey = name + '_codemirror';

//Recieved update from core to immediateValue
if (SVs.immediateValue !== currentValue) {
  setCurrentValue(SVs.immediateValue)
}

let updateInternalValue = SVs.value;

//TODO: on update scrolling is wrong
//TODO: option for inline for height (and no scroll)

let input = <div 
            key={inputKey}
            id={inputKey}

            style={{
              width: sizeToCSS(SVs.width),
              height: sizeToCSS(SVs.height),
              padding: "0px",
              border: "1px solid black",
              overflowY: "scroll"
              // display: "inline"
            }}>
  <CodeMirror
  key = {codemirrorKey}
  editorRef = {editorRef}
  setInternalValue = {updateInternalValue}
  readOnly = {SVs.disabled}
   //TODO: wire up onBlur in codemirror

  onBlur={(e)=>{
    console.log("BLUR!!!!!")
    if (SVs.immediateValue !== SVs.value) {
      actions.updateValue();
    }
  }}
  onBeforeChange={(value) => {
    setCurrentValue(value);
    actions.updateImmediateValue({
      text: value
    });
   //TODO: READ ONLY SHOULD STOP TIMERS
  
    if (timer.current === null){
      timer.current = setTimeout(function(){
          actions.updateValue();
        timer.current = null;
      // },3000)//3 seconds
    },10000)//10 seconds
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