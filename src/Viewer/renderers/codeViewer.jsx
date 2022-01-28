import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeViewer(props){
  let {name, SVs, children, actions, callAction} = useDoenetRenderer(props,false);


  if (SVs.hidden) {
    return null;
  }
  let viewerMaxHeight = {...SVs.maxHeight};
  viewerMaxHeight.size = viewerMaxHeight.size - 30;

  let viewerWidth = {...SVs.width};
  viewerWidth.size = viewerWidth.size - 4;
  
 
  let contentPanel = <div style={{
    width: sizeToCSS(SVs.width),
    minHeight: sizeToCSS(SVs.minHeight),
    maxHeight: sizeToCSS(SVs.maxHeight),
    padding: "2px",
    // border: "1px solid black",
    // overflowY: "scroll"
  }}><div style={{
height:"28px",
  }}><button onClick={()=>callAction({action:actions.updateComponents})
    }>update</button></div>
    <div style={{
      overflowY: "scroll",
      width: sizeToCSS(viewerWidth),
    minHeight: sizeToCSS(SVs.minHeight),
    maxHeight: sizeToCSS(viewerMaxHeight),
      }}>{children}</div>
  </div>

  return <>
  <a name={name} />
  <div className="codeViewerSurroundingBox" id={name} >
  
    {contentPanel}
    
  </div>

</>
}