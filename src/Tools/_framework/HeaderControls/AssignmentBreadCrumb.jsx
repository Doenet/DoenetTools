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
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const sectionId = useRecoilValue(searchParamAtomFamily('sectionId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(courseId);
  const navigationCrumbs = useNavigationCrumbs(courseId, sectionId);

  // const [courseId, setCourseId] = useState("");
  // const [parentDoenetId, setParentDoenetId] = useState("");

  // useEffect(()=>{
  //   axios.get('/api/findCourseIdAndParentDoenetId.php', {
  //     params: { doenetId },
  //   }).then((resp)=>{
  //     // console.log(">>>>resp",resp.data)
  //     setCourseId(resp.data.courseId);
  //     setParentDoenetId(resp.data.parentDoenetId);
  //   })
  // },[doenetId])

  const assignmentCrumb = useAssignmentCrumb({doenetId,courseId,sectionId});

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,assignmentCrumb]}  offset={98}/>
    </Suspense>
  );
}
