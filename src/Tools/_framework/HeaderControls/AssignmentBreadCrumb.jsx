import React, { Suspense, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import { folderDictionary } from '../../../_reactComponents/Drive/NewDrive';


export default function AssignmentBreadCrumb() {
  // const path = useRecoilValue(searchParamAtomFamily('path'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  let [path,setPath] = useState(":");

  useEffect(()=>{
    axios.get('/api/findDriveIdFolderId.php', {
      params: { doenetId },
    }).then((resp)=>{
      setPath(`${resp.data.driveId}:${resp.data.parentFolderId}`)
    })
  },[doenetId])

  let [driveId,folderId] = path.split(':');
  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const docInfo = folderInfo?.contentsDictionaryByDoenetId?.[doenetId]
  if (!docInfo){ return null;}

  if (path === ":"){ return null;}



  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb  tool="Content" tool2="Assignment" doenetId={doenetId} path={path} label={docInfo.label}/>
      </div>
    </Suspense>
  );
}
