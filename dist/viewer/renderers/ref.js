import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
import {itemByDoenetId} from "../../_reactComponents/Course/CourseActions.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Ref(props) {
  let {name, SVs, children} = useDoenetRender(props);
  const pageToolView = useRecoilValue(pageToolViewAtom);
  const itemInCourse = useRecoilValue(itemByDoenetId(SVs.doenetId));
  if (SVs.hidden) {
    return null;
  }
  let linkContent = children;
  if (children.length === 0) {
    linkContent = SVs.linkText;
  }
  let url = "";
  let targetForATag = "_blank";
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
    let usePublic = false;
    if (pageToolView.page === "public") {
      usePublic = true;
    } else if (Object.keys(itemInCourse).length === 0) {
      usePublic = true;
    }
    if (usePublic) {
      if (SVs.edit === true || SVs.edit === null && pageToolView.page === "public" && pageToolView.tool === "editor") {
        url = `tool=editor&${url}`;
      }
      url = `/public?${url}`;
    } else {
      url = `/course?tool=assignment&${url}`;
    }
    haveValidTarget = true;
    if (SVs.targetName) {
      url += "#" + SVs.targetName;
    }
  } else if (SVs.uri) {
    url = SVs.uri;
    if (url.substring(0, 8) === "https://" || url.substring(0, 7) === "http://") {
      haveValidTarget = true;
    }
  } else {
    url = "#" + SVs.targetName;
    targetForATag = null;
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
        target: targetForATag,
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
});
