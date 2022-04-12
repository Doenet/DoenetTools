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
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const sectionId = useRecoilValue(searchParamAtomFamily('sectionId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, sectionId);
  const editorCrumb = useEditorCrumb({ courseId, sectionId, doenetId });

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb
        crumbs={[
          chooserCrumb,
          dashboardCrumb,
          ...navigationCrumbs,
          editorCrumb,
        ]}
        offset={68}
      />
    </Suspense>
  );
}
