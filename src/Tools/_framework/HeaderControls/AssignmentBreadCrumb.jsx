import React, { Suspense, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import { 
  useCourseChooserCrumb, 
  useDashboardCrumb, 
  useNavigationCrumbs,
  useAssignmentCrumb, 
} from '../../../_utils/breadcrumbUtil';

export default function AssignmentBreadCrumb() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [courseId, setCourseId] = useState("");
  const [parentDoenetId, setParentDoenetId] = useState("");

  useEffect(()=>{
    axios.get('/api/findCourseIdAndParentDoenetId.php', {
      params: { doenetId },
    }).then((resp)=>{
      // console.log(">>>>resp",resp.data)
      setCourseId(resp.data.courseId);
      setParentDoenetId(resp.data.parentDoenetId);
    })
  },[doenetId])

  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId,parentDoenetId)
  const assignmentCrumb = useAssignmentCrumb({doenetId,courseId,sectionId: parentDoenetId});

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,assignmentCrumb]}  offset={98}/>
    </Suspense>
  );
}
