import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../_snowpack/pkg/react";
import ReactDOM from "../_snowpack/pkg/react-dom";
import axios from "../_snowpack/pkg/axios";
function DynamicLoad(props) {
  return /* @__PURE__ */ React.createElement("p", null, components, "This is a p tag");
}
ReactDOM.render(/* @__PURE__ */ React.createElement(DynamicLoad, null), document.getElementById("root"));
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
