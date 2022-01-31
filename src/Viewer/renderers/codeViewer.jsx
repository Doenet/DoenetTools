import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function CodeViewer(props){
  let {name, SVs, children, actions, callAction} = useDoenetRenderer(props,false);

  if (SVs.hidden) {
    return null;
  }
  let viewerHeight = {...SVs.height};
  viewerHeight.size = viewerHeight.size - 30;

  let viewerWidth = {...SVs.width};
  viewerWidth.size = viewerWidth.size - 4;
  

  let surroundingBoxStyle = {
    width: sizeToCSS(SVs.width),
  }

  // console.log("SVs",SVs)
  // if (something){
  //   surroundingBoxStyle.border = "1px solid black";
  // }
 
  let contentPanel = <div style={{
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
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
      height: sizeToCSS(viewerHeight),
      }}>{children}</div>
  </div>

  return <>
  <a name={name} />
  <div 
  style = {surroundingBoxStyle}
  className="codeViewerSurroundingBox" 
  id={name} >
  
    {contentPanel}
    
  </div>

</>
}