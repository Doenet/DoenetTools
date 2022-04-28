import React from "./_snowpack/pkg/react.js";
import ReactDOM from "./_snowpack/pkg/react-dom.js";
import {HashRouter as Router} from "./_snowpack/pkg/react-router-dom.js";
import {RecoilRoot} from "./_snowpack/pkg/recoil.js";
import ToolRoot from "./_framework/NewToolRoot.js";
import {MathJaxContext} from "./_snowpack/pkg/better-react-mathjax.js";
import {mathjaxConfig} from "./core/utils/math.js";
ReactDOM.render(/* @__PURE__ */ React.createElement(RecoilRoot, null, /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(MathJaxContext, {
  version: 2,
  config: mathjaxConfig,
  onStartup: (mathJax) => mathJax.Hub.processSectionDelay = 0
}, /* @__PURE__ */ React.createElement(ToolRoot, null)))), document.getElementById("root"));
