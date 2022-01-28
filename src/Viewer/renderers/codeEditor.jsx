import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeEditor(props){
  let {name, SVs, children, actions, callAction } = useDoenetRenderer(props,false);
  let currentValue = useRef(SVs.immediateValue)
  let timer = useRef(null)
  let editorRef = useRef(null)
  let updateInternalValue = useRef(SVs.immediateValue)

if (SVs.hidden) {
  return null;
}

const editorKey = name + '_editor';
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

let viewer = null;
let editorWidth = SVs.width;
let componentWidth = SVs.width;
let editorStyle = {
  width: sizeToCSS(editorWidth),
  minHeight: sizeToCSS(SVs.minHeight),
  maxHeight: sizeToCSS(SVs.maxHeight),
  padding: "2px",
  border: "1px solid black",
  overflowY: "scroll"
};

if (SVs.showResults){
  editorWidth = {size: 300, isAbsolute: true};
  editorStyle = {
    width: sizeToCSS(editorWidth),
    minHeight: sizeToCSS(SVs.minHeight),
    maxHeight: sizeToCSS(SVs.maxHeight),
    padding: "0px",
    overflowY: "scroll",
    overflowX: "hidden"
  };
  viewer = <div>
  {children}
</div>

}

let editor = <div 
            key={editorKey}
            id={editorKey}

            style={editorStyle}>
  <CodeMirror
  // key = {codemirrorKey}
  editorRef = {editorRef}
  setInternalValue = {updateInternalValue.current}
  //TODO: read only isn't working <codeeditor disabled />
  readOnly = {SVs.disabled}

  onBlur={
    ()=>callAction({action:actions.updateValue})
  }
  onFocus={()=>{
    // console.log(">>codeEditor FOCUS!!!!!")
  }}
  onBeforeChange={(value) => {
    currentValue.current = value;
    callAction({action:actions.updateImmediateValue, args:{text:value}})
   
  //TODO: when you try to leave the page before it saved you will lose work
  //so prompt the user on page leave
    if (timer.current === null){
      timer.current = setTimeout(function(){
          ()=>callAction({action:actions.updateValue})
        timer.current = null;
      },3000)//3 seconds
    }

  }}
/>
</div>

console.log("sizeToCSS(editorWidth)",sizeToCSS(editorWidth),editorWidth)

 return <><a name={name} />
 <div style={{
  padding: "0px",
  border: "1px solid black",
  width: sizeToCSS(componentWidth),
  display: 'flex'
 }}>
   <div style={{
  width: sizeToCSS(editorWidth),
  padding: "0px"}}>{editor}</div>
   {viewer}
 </div>
 </>

}