import React, { useState, useRef, useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import CodeMirror from "../../Tools/_framework/CodeMirror";
import VisibilitySensor from "react-visibility-sensor-v2";

export default React.memo(function CodeEditor(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);
  let currentValue = useRef(SVs.immediateValue);
  let updateValueTimer = useRef(null);
  let editorRef = useRef(null);
  let updateInternalValueTo = useRef(SVs.immediateValue);

  let componentHeight = { ...SVs.height };
  let editorHeight = { ...SVs.height };
  if (SVs.showResults) {
    editorHeight.size *= 1 - SVs.viewerRatio;
  }

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
      if (updateValueTimer.current !== null) {
        clearTimeout(updateValueTimer.current);
        callAction({ action: actions.updateValue });
      }
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  const editorKey = id + "_editor";
  const codemirrorKey = id + "_codemirror";

  //Received update from core to immediateValue
  //NOTE: currently causes a scrolling issue
  //https://codemirror.net/doc/manual.html#events
  // cm.scrollTo(x: number, y: number)
  // Scroll the editor to a given (pixel) position. Both arguments may be left as null or undefined to have no effect.
  // cm.getScrollInfo() → {left, top, width, height, clientWidth, clientHeight}
  // Get an {left, top, width, height, clientWidth, clientHeight} object that represents the current scroll position, the size of the scrollable area, and the size of the visible area (minus scrollbars).

  if (SVs.immediateValue !== currentValue.current) {
    currentValue.current = SVs.immediateValue;
    updateInternalValueTo.current = SVs.immediateValue;
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
    overflowY: "scroll",
  };

  if (SVs.showResults) {
    viewer = (
      <>
        <hr style={{ width: sizeToCSS(componentWidth), maxWidth: "100%" }} />
        <div>{children}</div>
      </>
    );
  }

  let editor = (
    <div key={editorKey} id={editorKey} style={editorStyle}>
      <CodeMirror
        // key = {codemirrorKey}
        editorRef={editorRef}
        setInternalValueTo={updateInternalValueTo.current}
        //TODO: read only isn't working <codeeditor disabled />
        readOnly={SVs.disabled}
        onBlur={() => {
          clearTimeout(updateValueTimer.current);
          callAction({ action: actions.updateValue });
          updateValueTimer.current = null;
        }}
        onFocus={() => {
          // console.log(">>codeEditor FOCUS!!!!!")
        }}
        onBeforeChange={(value) => {
          currentValue.current = value;
          callAction({
            action: actions.updateImmediateValue,
            args: { text: value },
          });

          // Debounce update value at 3 seconds
          clearTimeout(updateValueTimer.current);

          //TODO: when you try to leave the page before it saved you will lose work
          //so prompt the user on page leave
          updateValueTimer.current = setTimeout(function () {
            callAction({ action: actions.updateValue });
            updateValueTimer.current = null;
          }, 3000); //3 seconds
        }}
      />
    </div>
  );

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={{ margin: "12px 0" }}>
        <a name={id} />
        <div
          style={{
            padding: "0",
            border: "var(--mainBorder)",
            borderRadius: "var(--mainBorderRadius)",
            height: sizeToCSS(componentHeight),
            width: sizeToCSS(componentWidth),
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          id={id}
        >
          {editor}
          {viewer}
        </div>
      </div>
    </VisibilitySensor>
  );
});
