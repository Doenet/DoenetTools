import React, { useState, useRef } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';

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

  if (!SVs.hasCodeEditorParent){
    surroundingBoxStyle.border = "1px solid black";
  }
 
  let contentPanel = 
    <div style={{
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      padding: "12px",
      // border: "1px solid black",
      // overflowY: "scroll"
    }}>
      <div style={{height:"28px"}}>
        <Button onClick={()=>callAction({action:actions.updateComponents})} value="update"></Button>
      </div>
      <div style={{ overflowY: "scroll", width: sizeToCSS(viewerWidth), height: sizeToCSS(viewerHeight) }}>
        {children}
      </div>
    </div>

  return (
    <div style={{ margin: "12px 0" }}>
      <a name={name} />
      <div 
        style={surroundingBoxStyle}
        className="codeViewerSurroundingBox" 
        id={name} 
      >
        {contentPanel}
      </div>
    </div>
  )
}