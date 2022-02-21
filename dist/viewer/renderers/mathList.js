import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function MathList(props) {
  let {name, SVs, children} = useDoenetRender(props);
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  }, []);
  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
  }
  if (SVs.hidden) {
    return null;
  }
  if (children.length === 0 && SVs.latex) {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("span", {
      id: name
    }, "\\(" + SVs.latex + "\\)"));
  }
  if (children.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: name
    });
  }
  let withCommas = children.slice(1).reduce((a, b) => [...a, ", ", b], [children[0]]);
  return /* @__PURE__ */ React.createElement(React.Fragment, {
    key: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), withCommas);
}
