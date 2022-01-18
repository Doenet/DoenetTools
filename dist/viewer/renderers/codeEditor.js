import React, {useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import CodeMirror from "../../_framework/CodeMirror.js";
export default function CodeEditor(props) {
  let {name, SVs, actions, children} = useDoenetRenderer(props, false);
  let currentValue = useRef(SVs.immediateValue);
  let timer = useRef(null);
  let editorRef = useRef(null);
  let updateInternalValue = useRef(SVs.immediateValue);
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
    minHeight: sizeToCSS(SVs.minHeight),
    maxHeight: sizeToCSS(SVs.maxHeight),
    padding: "2px",
    border: "1px solid black",
    overflowY: "scroll"
  };
  if (SVs.showResults) {
    editorWidth = {size: 300, isAbsolute: true};
    editorStyle = {
      width: sizeToCSS(editorWidth),
      minHeight: sizeToCSS(SVs.minHeight),
      maxHeight: sizeToCSS(SVs.maxHeight),
      padding: "0px",
      overflowY: "scroll",
      overflowX: "hidden"
    };
    viewer = /* @__PURE__ */ React.createElement("div", null, children);
  }
  let editor = /* @__PURE__ */ React.createElement("div", {
    key: editorKey,
    id: editorKey,
    style: editorStyle
  }, /* @__PURE__ */ React.createElement(CodeMirror, {
    editorRef,
    setInternalValue: updateInternalValue.current,
    readOnly: SVs.disabled,
    onBlur: (e) => {
      actions.updateValue();
    },
    onFocus: () => {
    },
    onBeforeChange: (value) => {
      currentValue.current = value;
      actions.updateImmediateValue({
        text: value
      });
      if (timer.current === null) {
        timer.current = setTimeout(function() {
          actions.updateValue();
          timer.current = null;
        }, 3e3);
      }
    }
  }));
  console.log("sizeToCSS(editorWidth)", sizeToCSS(editorWidth), editorWidth);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    style: {
      padding: "0px",
      border: "1px solid black",
      width: sizeToCSS(componentWidth),
      display: "flex"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      width: sizeToCSS(editorWidth),
      padding: "0px"
    }
  }, editor), viewer));
}
