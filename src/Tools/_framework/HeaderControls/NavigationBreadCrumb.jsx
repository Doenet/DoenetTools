import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';

import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb, useNavigationCrumbs } from '../../../_utils/breadcrumbUtil';


export default function NavigationBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [driveId,folderId] = path.split(':');
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId,folderId)

  console.log("\n>>>>-------NavigationBreadCrumb--------")
  console.log(">>>>chooserCrumb",chooserCrumb)
  console.log(">>>>dashboardCrumb",dashboardCrumb)
  console.log(">>>>navigationCrumbs",navigationCrumbs)

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs]} />
    </Suspense>
  );
}
