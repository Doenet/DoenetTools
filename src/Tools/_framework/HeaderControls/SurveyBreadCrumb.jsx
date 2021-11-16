import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb, useSurveyCrumb } from '../../../_utils/breadcrumbUtil';

export default function SurveyBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const surveyCrumbs = useSurveyCrumb(driveId,doenetId);
  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb,dashboardCrumb,...surveyCrumbs]}/>
    </Suspense>
  );
}
