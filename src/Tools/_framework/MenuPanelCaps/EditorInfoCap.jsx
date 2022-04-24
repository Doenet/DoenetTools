import React from 'react';
import { useRecoilValue } from 'recoil';
import { authorItemByDoenetId, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';

export default function EditorInfoCap(){
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let {color, image, course_label} = useCourse(courseId);

  const docInfo = useRecoilValue(authorItemByDoenetId(doenetId));
  if (!docInfo){ return null;}
  let status = "Not Released";
  if (docInfo?.isReleased === "1"){ status = "Released"}
  // if (docInfo.isAssigned === "1"){ status = "Assigned"}
  // let listed = "";
  // if (docInfo.isPublic === "1"){ listed = "Listed"}

//  let imageURL = `/media/drive_pictures/${image}`
 if (image != 'none'){
  image = '/media/drive_pictures/' + image;
 }
 if (color != 'none'){
  color = '#' + color;
 }

  return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img src={image} style={{ position: "absolute", width: "100%", top: "50%", transform: "translateY(-50%)" }}  />
    </div>
    <b>Editor</b>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{course_label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{docInfo.label}</span> <br />
      <span>{ status }</span>
    {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
    {/* <div>Last saved (comming soon)</div> */}
  </div>
  </>
}