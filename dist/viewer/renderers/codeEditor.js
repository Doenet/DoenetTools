import React, {useState, useRef, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import CodeMirror from "../../_framework/CodeMirror.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function CodeEditor(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRenderer(props);
  let currentValue = useRef(SVs.immediateValue);
  let updateValueTimer = useRef(null);
  let editorRef = useRef(null);
  let updateInternalValue = useRef(SVs.immediateValue);
  let componentHeight = {...SVs.height};
  let editorHeight = {...SVs.height};
  if (SVs.showResults) {
    editorHeight.size *= 1 - SVs.viewerRatio;
  }
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
      if (updateValueTimer.current !== null) {
        clearTimeout(updateValueTimer.current);
        callAction({action: actions.updateValue});
      }
    };
  }, []);
  if (SVs.hidden) {
    return null;
  }
  const editorKey = id + "_editor";
  const codemirrorKey = id + "_codemirror";
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
    overflowX: "hidden",
    overflowY: "scroll"
  };
  if (SVs.showResults) {
    viewer = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("hr", {
      style: {width: sizeToCSS(componentWidth), maxWidth: "100%"}
    }), /* @__PURE__ */ React.createElement("div", null, children));
  }
  let editor = /* @__PURE__ */ React.createElement("div", {
    key: editorKey,
    id: editorKey,
    style: editorStyle
  }, /* @__PURE__ */ React.createElement(CodeMirror, {
    editorRef,
    setInternalValue: updateInternalValue.current,
    readOnly: SVs.disabled,
    onBlur: () => {
      clearTimeout(updateValueTimer.current);
      callAction({action: actions.updateValue});
      updateValueTimer.current = null;
    },
    onFocus: () => {
    },
    onBeforeChange: (value) => {
      currentValue.current = value;
      callAction({action: actions.updateImmediateValue, args: {text: value}});
      clearTimeout(updateValueTimer.current);
      updateValueTimer.current = setTimeout(function() {
        callAction({action: actions.updateValue});
        updateValueTimer.current = null;
      }, 3e3);
    }
  }));
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement("div", {
    style: {
      padding: "0",
      border: "var(--mainBorder)",
      borderRadius: "var(--mainBorderRadius)",
      height: sizeToCSS(componentHeight),
      width: sizeToCSS(componentWidth),
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column"
    },
    id
  }, editor, viewer)));
});
