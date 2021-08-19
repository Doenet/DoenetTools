import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import BreadCrumb from "../../_reactComponents/Breadcrumb/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function EditorBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      margin: "-9px 0px 0px -25px",
      maxWidth: "850px"
    }
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    tool: "Content",
    tool2: "Editor",
    doenetId,
    path
  })));
}
