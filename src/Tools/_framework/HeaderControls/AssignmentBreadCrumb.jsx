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

  let [path,setPath] = useState("::");

  useEffect(()=>{
    axios.get('/api/findDriveIdFolderId.php', {
      params: { doenetId },
    }).then((resp)=>{
      // console.log(">>>>resp",resp.data)
      setPath(`${resp.data.driveId}:${resp.data.parentFolderId}:${resp.data.itemId}`)
    })
  },[doenetId])

  let [driveId,folderId,itemId] = path.split(':');
  const chooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const navigationCrumbs = useNavigationCrumbs(driveId,folderId)
  const assignmentCrumb = useAssignmentCrumb({doenetId,driveId,folderId,itemId});

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,assignmentCrumb]}  offset={98}/>
      {/* <BreadCrumb crumbs={[chooserCrumb,dashboardCrumb,...navigationCrumbs,assignmentCrumb]}  offset={90}/> */}
    </Suspense>
  );
}
