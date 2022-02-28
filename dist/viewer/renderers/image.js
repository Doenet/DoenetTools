import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {retrieveMediaForCID} from "../../core/utils/retrieveMedia.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
export default function Image(props) {
  let {name, SVs} = useDoenetRender(props, false);
  let [url, setUrl] = useState(null);
  useEffect(() => {
    if (SVs.cid) {
      retrieveMediaForCID(SVs.cid, SVs.mimeType).then((result) => {
        setUrl(result.mediaURL);
      }).catch((e) => {
      });
    }
  }, []);
  if (SVs.hidden) {
    return null;
  }
  if (url) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("img", {
      id: name,
      src: url,
      style: {maxWidth: "850px"},
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      alt: SVs.description
    }));
  } else if (!SVs.cid && SVs.source) {
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
  } else if (SVs.height && SVs.width) {
    /* @__PURE__ */ React.createElement("a", {
      name
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("div", {
      id: name,
      style: {
        display: "inline-block",
        maxWidth: "850px",
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        border: "solid black 1px"
      }
    }, SVs.description));
  }
  return null;
}
