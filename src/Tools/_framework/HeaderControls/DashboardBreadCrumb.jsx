import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { BreadCrumb } from "../../../_reactComponents/PanelHeaderComponents/BreadCrumb";
import { searchParamAtomFamily } from "../NewToolRoot";
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
} from "../../../_utils/breadcrumbUtil";

export default function DashboardBreadCrumb() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));

  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);

  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb, dashboardCrumb]} />
    </Suspense>
  );
}
