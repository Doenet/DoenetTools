import React, { useState, useRef } from 'react';
import DoenetRenderer from './DoenetRenderer';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function CodeEditor(props){
  let {name, SVs, actions} = useDoenetRenderer(props,false);
  const [currentValue,setCurrentValue] = useState(SVs.value)
  let timer = useRef(null)

if (SVs.hidden) {
  return null;
}

function onChangeHandler(e){
  setCurrentValue(e.target.value);
  actions.updateImmediateValue({
    text: e.target.value
  });

  if (timer.current === null){
    timer.current = setTimeout(function(){
        actions.updateValue();
      timer.current = null;
    },3000)//3 seconds
  }
}

function handleBlur(e) {
  if (SVs.immediateValue !== SVs.value) {
    actions.updateValue();
  }
}
const inputKey = name + '_input';

//Recieved update from core to immediateValue
if (SVs.immediateValue !== currentValue) {
  setCurrentValue(SVs.immediateValue)
}

//TODO Focus changes style
let input = <textarea
        key={inputKey}
        id={inputKey}
        value={currentValue}
        disabled={SVs.disabled}
        onChange={onChangeHandler}
        onBlur={handleBlur}
        // onFocus={this.handleFocus}
        style={{
          width: sizeToCSS(SVs.width),
          height: sizeToCSS(SVs.height),
          fontSize: "14px",
          borderWidth: "1px",
          // borderColor: surroundingBorderColor,
          padding: "4px",
        }}
      />

  return <>
  <a name={name} />
  <span className="codeEditorSurroundingBox" id={name}>
    {input}
  </span>

</>
}