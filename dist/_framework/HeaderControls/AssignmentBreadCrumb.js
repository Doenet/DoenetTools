import React, {Suspense, useState, useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
  useNavigationCrumbs,
  useAssignmentCrumb
} from "../../_utils/breadcrumbUtil.js";
import {
  courseIdAtom
} from "../../_reactComponents/Course/CourseActions.js";
export default function AssignmentBreadCrumb() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, doenetId);
  const assignmentCrumb = useAssignmentCrumb({doenetId});
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading Breadcrumb...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [chooserCrumb, dashboardCrumb, ...navigationCrumbs, assignmentCrumb],
    offset: 98
  }));
}
