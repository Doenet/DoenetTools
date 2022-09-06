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
import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';

export default function EditorBreadCrumb() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  const linkPageId = useRecoilValue(searchParamAtomFamily('linkPageId'));


  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, doenetId);
  const editorCrumb = useEditorCrumb({ doenetId, pageId, linkPageId });

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb
        crumbs={[
          chooserCrumb,
          dashboardCrumb,
          ...navigationCrumbs,
          ...editorCrumb,
        ]}
        offset={68}
      />
    </Suspense>
  );
}
