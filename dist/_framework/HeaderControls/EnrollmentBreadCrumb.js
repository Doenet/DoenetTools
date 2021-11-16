import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useCourseChooserCrumb, useDashboardCrumb, useEnrollmentCrumb} from "../../_utils/breadcrumbUtil.js";
export default function EnrollmentBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const enrollmentCrumb = useEnrollmentCrumb(driveId);
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Breadcrumbs...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [courseChooserCrumb, dashboardCrumb, enrollmentCrumb]
  }));
}
