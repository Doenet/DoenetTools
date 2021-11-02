import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';

import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb, useNavigationCrumbs, useCollectionCrumb } from '../../../_utils/breadcrumbUtil';


export default function CollectionBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [driveId,folderId] = path.split(':');
  const dashboardCrumb = useDashboardCrumb(driveId);

  const navigationCrumbs = useNavigationCrumbs(driveId,folderId)
  const collectionCrumb = useCollectionCrumb(doenetId,path);

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,collectionCrumb]} />
    </Suspense>
  );
}
