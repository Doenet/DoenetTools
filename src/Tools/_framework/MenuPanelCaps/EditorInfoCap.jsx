import React from 'react';
import { useRecoilValue } from 'recoil';
import { folderDictionary, fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';

export default function EditorInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let [driveId,folderId,doenetId] = path.split(':');
  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const driveInfo = useRecoilValue(fetchDrivesQuery)

  const docInfo = folderInfo.contentsDictionary[doenetId]
  if (!docInfo){ return null;}
  let status = "Not Released";
  if (docInfo?.isReleased === "1"){ status = "Released"}
  // if (docInfo.isAssigned === "1"){ status = "Assigned"}
  // let listed = "";
  // if (docInfo.isPublic === "1"){ listed = "Listed"}
  let image;
  let course_label = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     image = info.image;
     course_label = info.label;
     break;
   }
 }

 let imageURL = `/media/drive_pictures/${image}`

  return <>
    <div style={{position: 'relative', paddingBottom: '135px'}}>
    <img style={{position: "absolute", height: "135px", objectFit: 'cover'}} src={imageURL} alt={`${course_label} course`} width='240px' />
    </div>
    <div style={{padding:"8px"}}>
    <div>{course_label}</div>
    <div>{docInfo.label}</div>
    <div>{status} </div>
    {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
    {/* <div>Last saved (comming soon)</div> */}
  </div>
  </>
}