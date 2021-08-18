import React, {Suspense} from "../../_snowpack/pkg/react.js";
import BreadCrumb from "../../_reactComponents/Breadcrumb/BreadCrumb.js";
export default function ChooserBreadCrumb() {
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      margin: "-9px 0px 0px -25px",
      maxWidth: "850px"
    }
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    tool: "CourseChooser",
    path: ":"
  })));
}
