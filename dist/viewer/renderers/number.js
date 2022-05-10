import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Number(props) {
  let {name, SVs, actions, sourceOfUpdate} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let number = SVs.valueForDisplay;
  if (SVs.renderAsMath) {
    number = "\\(" + number + "\\)";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name
  }, /* @__PURE__ */ React.createElement(MathJax, {
    hideUntilTypeset: "first",
    inline: true,
    dynamic: true
  }, number)));
}
