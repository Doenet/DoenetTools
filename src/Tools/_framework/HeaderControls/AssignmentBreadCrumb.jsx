import React, { Suspense, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
// import axios from 'axios';
import { 
  useCourseChooserCrumb, 
  useDashboardCrumb, 
  useNavigationCrumbs,
  useAssignmentCrumb, 
} from '../../../_utils/breadcrumbUtil';
import { 
  // itemByDoenetId, 
  courseIdAtom } from '../../../_reactComponents/Course/CourseActions';

export default function AssignmentBreadCrumb() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  // const sectionId = useRecoilValue(itemByDoenetId(doenetId)).parentDoenetId;

  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId,doenetId)

  const assignmentCrumb = useAssignmentCrumb({doenetId});

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,assignmentCrumb]}  offset={98}/>
    </Suspense>
  );
}
