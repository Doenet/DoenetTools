import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Ref(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let linkContent = children;
  if (children.length === 0) {
    linkContent = SVs.linkText;
  }
  let url = "";
  let target = "_blank";
  let haveValidTarget = false;
  if (SVs.contentId) {
    url = `https://www.doenet.org/#/content/?contentId=${SVs.contentId}`;
    haveValidTarget = true;
  } else if (SVs.doenetId) {
    url = `https://www.doenet.org/#/course?tool=assignment&doenetId=${SVs.doenetId}`;
    haveValidTarget = true;
  } else if (SVs.uri) {
    url = SVs.uri;
    if (url.substring(0, 8) === "https://" || url.substring(0, 7) === "http://") {
      haveValidTarget = true;
    }
  } else {
    url = "#" + SVs.targetName;
    target = null;
    haveValidTarget = true;
  }
  if (SVs.createButton) {
    return /* @__PURE__ */ React.createElement("span", {
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("button", {
      id: name + "_button",
      onClick: () => window.location.href = url,
      disabled: SVs.disabled
    }, SVs.linkText));
  } else {
    if (haveValidTarget) {
      return /* @__PURE__ */ React.createElement("a", {
        target,
        id: name,
        name,
        href: url
      }, linkContent);
    } else {
      return /* @__PURE__ */ React.createElement("span", {
        id: name
      }, linkContent);
    }
  }
}
