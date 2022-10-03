import React, { useState, useRef, useEffect } from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import CodeMirror from '../../Tools/_framework/CodeMirror';
import VisibilitySensor from 'react-visibility-sensor-v2';
import styled from 'styled-components';

const EditorStyling= styled.div`
&: focus {
  outline: 2px solid black;
  outline-offset: 2px;
}
`;
const InnerDiv= styled.div`
padding: 0;
border: var(--mainBorder);
border-radius: var(--mainBorderRadius);
height: sizeToCSS(componentHeight);
width: sizeToCSS(componentWidth),
max-width: 100%;
display: flex;
flex-direction: column;
&: focus {
  outline: 2px solid black;
  outline-offset: 2px;
}
`;

export default React.memo(function CodeEditor(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRenderer(props);
  let currentValue = useRef(SVs.immediateValue)
  let updateValueTimer = useRef(null)
  let editorRef = useRef(null)
  let updateInternalValue = useRef(SVs.immediateValue)

  let componentHeight = { ...SVs.height };
  let editorHeight = { ...SVs.height };
  if (SVs.showResults) {
    editorHeight.size *= 1 - SVs.viewerRatio
  }

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
      if(updateValueTimer.current !== null) {
        clearTimeout(updateValueTimer.current);
        callAction({ action: actions.updateValue });
      }

    }
  }, [])

  if (SVs.hidden) {
    return null;
  }

  const editorKey = id + '_editor';
  const codemirrorKey = id + '_codemirror';

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
    maxWidth: "100%",
    padding: "0px",
    // padding: "2px",
    // border: "1px solid black",
    overflowX: "hidden",
    overflowY: "scroll"
  };

  if (SVs.showResults) {
    viewer = <>
      <hr style={{ width: sizeToCSS(componentWidth), maxWidth: "100%" }} />
      <div>
        {children}
      </div>
    </>
  }

  let editor = <EditorStyling
    key={editorKey}
    id={editorKey}
    tabIndex="0"
    style={editorStyle}>
    <CodeMirror
      // key = {codemirrorKey}
      editorRef={editorRef}
      setInternalValue={updateInternalValue.current}
      //TODO: read only isn't working <codeeditor disabled />
      readOnly={SVs.disabled}

      onBlur={
        () => {
          clearTimeout(updateValueTimer.current);
          callAction({ action: actions.updateValue });
          updateValueTimer.current = null;
        }
      }
      onFocus={() => {
        // console.log(">>codeEditor FOCUS!!!!!")
      }}
      onBeforeChange={(value) => {
        currentValue.current = value;
        callAction({ action: actions.updateImmediateValue, args: { text: value } })


        // Debounce update value at 3 seconds
        clearTimeout(updateValueTimer.current);

        //TODO: when you try to leave the page before it saved you will lose work
        //so prompt the user on page leave
        updateValueTimer.current = setTimeout(function () {
          callAction({ action: actions.updateValue });
          updateValueTimer.current = null;
        }, 3000)//3 seconds

      }}
    />
  </EditorStyling>


  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={{ margin: "12px 0" }} >
        <a name={id} />
        <InnerDiv 
        id={id}
        >
          {editor}
          {viewer}
          

        </InnerDiv>
      </div>

    </VisibilitySensor>
  )

})