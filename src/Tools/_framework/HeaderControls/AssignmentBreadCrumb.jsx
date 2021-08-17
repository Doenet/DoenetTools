import React, { Suspense, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';


export default function AssignmentBreadCrumb() {
  // const path = useRecoilValue(searchParamAtomFamily('path'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  let [path,setPath] = useState(null);

  useEffect(()=>{
    axios.get('/api/findDriveIdFolderId.php', {
      params: { doenetId },
    }).then((resp)=>{
      setPath(`${resp.data.driveId}:${resp.data.parentFolderId}`)
    })
  },[doenetId])

  if (!path){ return null;}

  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb  tool="Content" tool2="Assignment" doenetId={doenetId} path={path}/>
      </div>
    </Suspense>
  );
}
