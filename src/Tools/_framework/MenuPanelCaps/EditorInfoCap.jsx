import React from 'react';
import { useRecoilValue } from 'recoil';
import { folderDictionary } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';

export default function EditorInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let [driveId,folderId,doenetId] = path.split(':');
  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const docInfo = folderInfo.contentsDictionary[doenetId]
  if (!docInfo){ return null;}
  let status = "Not Released";
  if (docInfo?.isReleased === "1"){ status = "Released"}
  // if (docInfo.isAssigned === "1"){ status = "Assigned"}
  // let listed = "";
  // if (docInfo.isPublic === "1"){ listed = "Listed"}

  return <div style={{padding:"4px"}}>
    <div>{docInfo.label}</div>
    <div>{status} </div>
    <ClipboardLinkButtons doenetId={doenetId}/>
    {/* <div>Last saved (comming soon)</div> */}
  </div>
}