import React, {useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import CodeMirror from "../../_framework/CodeMirror.js";
export default function CodeEditor(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRenderer(props);
  let currentValue = useRef(SVs.immediateValue);
  let timer = useRef(null);
  let editorRef = useRef(null);
  let updateInternalValue = useRef(SVs.immediateValue);
  let componentHeight = {...SVs.height};
  let editorHeight = {...SVs.height};
  if (SVs.showResults) {
    editorHeight.size *= 1 - SVs.viewerRatio;
  }
  if (SVs.hidden) {
    return null;
  }
  const editorKey = name + "_editor";
  const codemirrorKey = name + "_codemirror";
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
    overflowX: "hidden",
    overflowY: "scroll"
  };
  if (SVs.showResults) {
    viewer = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("hr", {
      style: {width: sizeToCSS(componentWidth)}
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
    onBlur: () => callAction({action: actions.updateValue}),
    onFocus: () => {
    },
    onBeforeChange: (value) => {
      currentValue.current = value;
      callAction({action: actions.updateImmediateValue, args: {text: value}});
      if (timer.current === null) {
        timer.current = setTimeout(function() {
          () => callAction({action: actions.updateValue});
          timer.current = null;
        }, 3e3);
      }
    }
  }));
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    style: {
      padding: "0",
      border: "var(--mainBorder)",
      borderRadius: "var(--mainBorderRadius)",
      height: sizeToCSS(componentHeight),
      width: sizeToCSS(componentWidth),
      display: "flex",
      flexDirection: "column"
    }
  }, editor, viewer));
}
