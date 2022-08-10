import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
  usePeopleCrumb,
} from '../../../_utils/breadcrumbUtil';

export default function PeopleBreadCrumb() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const peopleCrumb = usePeopleCrumb(courseId);
  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb, dashboardCrumb, peopleCrumb]} />
    </Suspense>
  );
}
