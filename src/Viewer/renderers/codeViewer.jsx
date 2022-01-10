import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';

export default function CodeViewer(props){
  let {name, SVs, actions, children} = useDoenetRenderer(props,false);


  if (SVs.hidden) {
    return null;
  }

  let contentPanel = <div style={{
    width: sizeToCSS(SVs.width),
    minHeight: sizeToCSS(SVs.minHeight),
    maxHeight: sizeToCSS(SVs.maxHeight),
    padding: "0px",
    border: "1px solid black",
    overflowY: "scroll"
  }}>
    {children}
  </div>

  return <>
  <a name={name} />
  <div className="codeViewerSurroundingBox" id={name} >
    {contentPanel}
    
  </div>

</>
}