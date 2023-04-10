import React, { useState, useRef, useEffect } from 'react';
import useDoenetRenderer from '../useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function CodeViewer(props){
  let {name, id, SVs, children, actions, callAction} = useDoenetRenderer(props,false);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  if (SVs.hidden) {
    return null;
  }
  let viewerHeight = {...SVs.height};
  viewerHeight.size = viewerHeight.size - 30;

  let viewerWidth = {...SVs.width};
  viewerWidth.size = viewerWidth.size - 4;
  

  let surroundingBoxStyle = {
    width: sizeToCSS(SVs.width),
    maxWidth: "100%"
  }

  if (!SVs.hasCodeEditorParent){
    surroundingBoxStyle.border = "var(--mainBorder)";
    surroundingBoxStyle.borderRadius = "var(--mainBorderRadius)"
  }
 
  let contentPanel = 
    <div style={{
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      maxWidth: "100%",
      padding: "12px",
      // border: "1px solid black",
      // overflowY: "scroll"
    }}>
      <div style={{height:"28px"}}>
        <Button onClick={()=>callAction({action:actions.updateComponents})} value="update" id={id + "_updateButton"}></Button>
      </div>
      <div style={{ overflowY: "scroll", width: sizeToCSS(viewerWidth), maxWidth: "100%", height: sizeToCSS(viewerHeight) }} id={id + "_content"}>
        {children}
      </div>
    </div>

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
    <div style={{ margin: "12px 0" }}>
      <a name={id} />
      <div 
        style={surroundingBoxStyle}
        className="codeViewerSurroundingBox" 
        id={id} 
      >
        {contentPanel}
      </div>
    </div>
    </VisibilitySensor>
  )
})