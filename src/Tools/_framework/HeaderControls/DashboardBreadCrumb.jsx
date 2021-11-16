import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb } from '../../../_utils/breadcrumbUtil';

export default function DashboardBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [driveId] = path.split(':');
  
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);

  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb,dashboardCrumb]}/>
    </Suspense>
  );
}
