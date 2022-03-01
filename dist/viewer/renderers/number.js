import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Number(props) {
  let {name, SVs, actions, sourceOfUpdate} = useDoenetRender(props);
  useEffect(() => {
    if (window.MathJax && SVs.renderAsMath) {
      window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  });
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
  }, number));
}
