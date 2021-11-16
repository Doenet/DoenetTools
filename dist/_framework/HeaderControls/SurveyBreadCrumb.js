import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {BreadCrumb} from "../../_reactComponents/PanelHeaderComponents/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useCourseChooserCrumb, useDashboardCrumb, useSurveyCrumb} from "../../_utils/breadcrumbUtil.js";
export default function SurveyBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const surveyCrumbs = useSurveyCrumb(driveId, doenetId);
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Breadcrumbs...")
  }, /* @__PURE__ */ React.createElement(BreadCrumb, {
    crumbs: [courseChooserCrumb, dashboardCrumb, ...surveyCrumbs]
  }));
}
