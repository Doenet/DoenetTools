import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { folderDictionary, fetchDrivesQuery, loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import axios from 'axios';
import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';


export default function AssignmentInfoCap(){
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let { page } = useRecoilValue(pageToolViewAtom);
  const { numberOfAttemptsAllowed } = useRecoilValue(loadAssignmentSelector(doenetId));
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);

  let [driveId,setDriveId] = useState("");
  let [folderId,setFolderId] = useState("");
  let [doenetIdLabel,setDoenetIdLabel] = useState("");

  useEffect(()=>{
    axios.get('/api/findDriveIdFolderId.php', {
      params: { doenetId },
    }).then((resp)=>{
      setDriveId(resp.data.driveId);
      setFolderId(resp.data.parentFolderId)
    })
    if (page === 'exam'){
  axios.get('/api/getExamLabel.php', {
      params: { doenetId },
    }).then((resp)=>{
      setDoenetIdLabel(resp.data.label);
    })
    }
   

  },[doenetId])
  const driveInfo = useRecoilValue(fetchDrivesQuery)

  let contentLabel = '';

  if (page === 'course'){
  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const docInfo = folderInfo?.contentsDictionaryByDoenetId?.[doenetId]
  contentLabel = docInfo?.label;
  }else if (page === 'exam'){

    contentLabel = doenetIdLabel
  }
  // if (contentLabel)
  // if (!docInfo){ return null;}

  let image;
  let color;
  let driveLabel = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     image = info.image;
     color = info.color;
     driveLabel = info.label;
     break;
   }
 }

 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
 }
 if (color != 'none'){
  color = '#' + color;
 }
//  let imageURL = `/media/drive_pictures/${image}`
 let attemptsAllowedDescription = numberOfAttemptsAllowed;
 if (!numberOfAttemptsAllowed){
  attemptsAllowedDescription = "Unlimited";
 }

 let attemptInfo = null;
 if (recoilAttemptNumber){
  attemptInfo = <div>{recoilAttemptNumber} out of {attemptsAllowedDescription}</div>
 }

  return <div>
    <div style={{position: 'relative', paddingBottom: '135px'}}>
    <img style={{position: "absolute", height: "135px", objectFit: 'cover', backgroundImage: image, backgroundColor: color}} width='240px' />
    </div>
    <div style={{padding:'8px'}}>
    <div>{driveLabel}</div>
    <div>{contentLabel}</div>
    {attemptInfo}
    </div>
    
  </div>
}