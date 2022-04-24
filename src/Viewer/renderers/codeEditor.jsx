import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeEditor(props){
  let {name, SVs, children, actions, callAction } = useDoenetRenderer(props);
  let currentValue = useRef(SVs.immediateValue)
  let timer = useRef(null)
  let editorRef = useRef(null)
  let updateInternalValue = useRef(SVs.immediateValue)

  let componentHeight = {...SVs.height};
  let editorHeight = {...SVs.height};
  if (SVs.showResults){
    editorHeight.size *= 1-SVs.viewerRatio
  }

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
  height: sizeToCSS(editorHeight),
    padding: "0px",
    // padding: "2px",
  // border: "1px solid black",
    overflowX: "hidden",
    overflowY: "scroll"
};

if (SVs.showResults){
  viewer = <>
  <hr style={{width: sizeToCSS(componentWidth)}}/>
  <div>
  {children}
  </div>
  </>
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


 return(
  <div style={{ margin:"12px 0"}}>
    <a name={name} />
    <div style={{
      padding: "0",
      border: "var(--mainBorder)",
      borderRadius:"var(--mainBorderRadius)",
      height: sizeToCSS(componentHeight),
      width: sizeToCSS(componentWidth),
      display: 'flex',
      flexDirection: 'column',
    }}>
      {editor}
      {viewer}
    </div>
  </div>
 ) 

}