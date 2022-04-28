import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Ref(props) {
  let {name, SVs, children} = useDoenetRender(props);
  const pageToolView = useRecoilValue(pageToolViewAtom);
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
  if (SVs.cid || SVs.doenetId) {
    if (SVs.cid) {
      url = `cid=${SVs.cid}`;
    } else {
      url = `doenetId=${SVs.doenetId}`;
    }
    if (SVs.pageNumber) {
      url += `&page=${SVs.pageNumber}`;
    }
    if (SVs.variantIndex) {
      url += `&variant=${SVs.variantIndex}`;
    }
    if (pageToolView.page === "content") {
      if (SVs.edit === true || SVs.edit === null && pageToolView.tool === "edit") {
        url = `tool=edit&${url}`;
      }
      url = `content?${url}`;
    } else {
      url = `course?tool=assignment&${url}`;
    }
    url = `/#/${url}`;
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
