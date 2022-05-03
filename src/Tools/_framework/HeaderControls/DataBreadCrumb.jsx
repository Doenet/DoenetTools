import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb, useDataCrumb } from '../../../_utils/breadcrumbUtil';

export default function DataBreadCrumb() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  let sectionId = useRecoilValue(searchParamAtomFamily('sectionId'));
  if (sectionId == ''){sectionId = courseId}
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const dataCrumbs = useDataCrumb(courseId,sectionId);
  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb,dashboardCrumb,...dataCrumbs]}/>
    </Suspense>
  );
}
