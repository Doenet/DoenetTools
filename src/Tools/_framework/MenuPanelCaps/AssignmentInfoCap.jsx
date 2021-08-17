import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { folderDictionary,fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';

export default function AssignmentInfoCap(){
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let [driveId,setDriveId] = useState("");
  let [folderId,setFolderId] = useState("");

  useEffect(()=>{
    axios.get('/api/findDriveIdFolderId.php', {
      params: { doenetId },
    }).then((resp)=>{
      setDriveId(resp.data.driveId);
      setFolderId(resp.data.parentFolderId)
    })
  },[doenetId])
  const driveInfo = useRecoilValue(fetchDrivesQuery)

  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const docInfo = folderInfo?.contentsDictionaryByDoenetId?.[doenetId]
  if (!docInfo){ return null;}

  let image;
  let driveLabel = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     image = info.image;
     driveLabel = info.label;
     break;
   }
 }

 let imageURL = `/media/drive_pictures/${image}`

  return <div>
    <div style={{position: 'relative', paddingBottom: '100px'}}>
    <img style={{position: "absolute", clip: "rect(0, 240px, 100px, 0)" }} src={imageURL} alt={`${driveLabel} course`} width='240px' />
    </div>
    <div>{driveLabel}</div>
    <div>{docInfo.label}</div>
  </div>
}