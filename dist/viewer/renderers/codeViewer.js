import React, {useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default React.memo(function CodeViewer(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRenderer(props, false);
  if (SVs.hidden) {
    return null;
  }
  let viewerHeight = {...SVs.height};
  viewerHeight.size = viewerHeight.size - 30;
  let viewerWidth = {...SVs.width};
  viewerWidth.size = viewerWidth.size - 4;
  let surroundingBoxStyle = {
    width: sizeToCSS(SVs.width)
  };
  if (!SVs.hasCodeEditorParent) {
    surroundingBoxStyle.border = "var(--mainBorder)";
    surroundingBoxStyle.borderRadius = "var(--mainBorderRadius)";
  }
  let contentPanel = /* @__PURE__ */ React.createElement("div", {
    style: {
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      padding: "12px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {height: "28px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callAction({action: actions.updateComponents}),
    value: "update"
  })), /* @__PURE__ */ React.createElement("div", {
    style: {overflowY: "scroll", width: sizeToCSS(viewerWidth), height: sizeToCSS(viewerHeight)}
  }, children));
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    style: surroundingBoxStyle,
    className: "codeViewerSurroundingBox",
    id: name
  }, contentPanel));
});
