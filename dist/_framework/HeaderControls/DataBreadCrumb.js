import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useCourseChooserCrumb, useDashboardCrumb, useDataCrumb} from "../../_utils/breadcrumbUtil.js";
export default function DataBreadCrumb() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let sectionId = useRecoilValue(searchParamAtomFamily("sectionId"));
  if (sectionId == "") {
    sectionId = courseId;
  }
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const dataCrumbs = useDataCrumb(courseId, sectionId);
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Breadcrumbs...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [courseChooserCrumb, dashboardCrumb, ...dataCrumbs]
  }));
}
