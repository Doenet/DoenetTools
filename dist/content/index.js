import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "react";
import ReactDOM from "react-dom";
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import {RecoilRoot} from "recoil";
import Content from "./Content.js";
import {DropTargetsProvider} from "../_reactComponents/DropTarget/index.js";
import {BreadcrumbProvider} from "../_reactComponents/Breadcrumb/index.js";
import ToolRoot from "../_framework/ToolRoot.js";
ReactDOM.render(/* @__PURE__ */ React.createElement(DropTargetsProvider, null, /* @__PURE__ */ React.createElement(BreadcrumbProvider, null, /* @__PURE__ */ React.createElement(RecoilRoot, null, /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
  path: "/",
  render: (routeprops) => /* @__PURE__ */ React.createElement(ToolRoot, {
    tool: /* @__PURE__ */ React.createElement(Content, {
      key: "BaseTool",
      route: {...routeprops}
    })
  })
})))))), document.getElementById("root"));
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
