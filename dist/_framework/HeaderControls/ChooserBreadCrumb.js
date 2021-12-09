import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {useCourseChooserCrumb} from "../../_utils/breadcrumbUtil.js";
export default function ChooserBreadCrumb() {
  const courseChooserCrumb = useCourseChooserCrumb();
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Breadcrumbs...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [courseChooserCrumb]
  }));
}
