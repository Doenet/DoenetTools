import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { 
  useCourseChooserCrumb, 
  useDashboardCrumb, 
  useNavigationCrumbs,
  useEditorCrumb, 
} from '../../../_utils/breadcrumbUtil';

export default function EditorBreadCrumb() {
  const chooserCrumb = useCourseChooserCrumb();
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [driveId,folderId,itemId] = path.split(':');
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId,folderId)
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId')); 
  const editorCrumb = useEditorCrumb({doenetId,driveId,folderId,itemId});

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,editorCrumb]} offset={62}/>
    </Suspense>
  );
}
