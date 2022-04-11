import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';

import { searchParamAtomFamily } from '../NewToolRoot';
import {
  useCourseChooserCrumb,
  useDashboardCrumb,
  useNavigationCrumbs,
} from '../../../_utils/breadcrumbUtil';

export default function NavigationBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const sectionId = useRecoilValue(searchParamAtomFamily('sectionId'));

  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, sectionId);

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb
        crumbs={[chooserCrumb, dashboardCrumb, ...navigationCrumbs]}
      />
    </Suspense>
  );
}
