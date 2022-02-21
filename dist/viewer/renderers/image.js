import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
export default function Image(props) {
  let {name, SVs} = useDoenetRender(props, false);
  if (SVs.hidden) {
    return null;
  }
  if (SVs.cid) {
    let src = `https://${SVs.cid}.ipfs.dweb.link`;
    if (SVs.asFileName) {
      src = src + `/?filename=${SVs.asFileName}`;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("img", {
      id: name,
      src,
      style: {maxWidth: "850px"},
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      alt: SVs.description
    }));
  } else if (SVs.source) {
    let src = SVs.source;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("img", {
      id: name,
      src,
      style: {maxWidth: "850px"},
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      alt: SVs.description
    }));
  }
  return null;
}
