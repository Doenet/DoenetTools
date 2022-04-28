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
  let color;
  let course_label = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     color = info.color;
     image = info.image;
     course_label = info.label;
     break;
   }
 }

//  let imageURL = `/media/drive_pictures/${image}`
 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
 }
 if (color != 'none'){
  color = '#' + color;
 }

  return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img style={{ position: "absolute", width: "100%", height: "100%", backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: image, backgroundColor: color }}  />
    </div>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{course_label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{docInfo.label}</span> <br />
      <span>{ status }</span>
    {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
    {/* <div>Last saved (comming soon)</div> */}
  </div>
  </>
}