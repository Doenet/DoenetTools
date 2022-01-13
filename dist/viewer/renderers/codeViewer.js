import React, {useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import CodeMirror from "../../_framework/CodeMirror.js";
export default function CodeViewer(props) {
  let {name, SVs, actions, children} = useDoenetRenderer(props, false);
  if (SVs.hidden) {
    return null;
  }
  let viewerMaxHeight = {...SVs.maxHeight};
  viewerMaxHeight.size = viewerMaxHeight.size - 30;
  let viewerWidth = {...SVs.width};
  viewerWidth.size = viewerWidth.size - 4;
  let contentPanel = /* @__PURE__ */ React.createElement("div", {
    style: {
      width: sizeToCSS(SVs.width),
      minHeight: sizeToCSS(SVs.minHeight),
      maxHeight: sizeToCSS(SVs.maxHeight),
      padding: "2px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      height: "28px"
    }
  }, /* @__PURE__ */ React.createElement("button", {
    onClick: actions.updateComponents
  }, "update")), /* @__PURE__ */ React.createElement("div", {
    style: {
      overflowY: "scroll",
      width: sizeToCSS(viewerWidth),
      minHeight: sizeToCSS(SVs.minHeight),
      maxHeight: sizeToCSS(viewerMaxHeight)
    }
  }, children));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    className: "codeViewerSurroundingBox",
    id: name
  }, contentPanel));
}
