import React from 'react';
import { useRecoilValue } from 'recoil';
import { authorItemByDoenetId, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';

export default function EditorInfoCap(){
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  let {color, image, label:course_label} = useCourse(courseId);

  const pageInfo = useRecoilValue(authorItemByDoenetId(pageId));
  const activityInfo = useRecoilValue(authorItemByDoenetId(doenetId));

  if (!pageInfo){ return null;}
 if (image != 'none'){
  image = '/media/drive_pictures/' + image;
 }
 if (color != 'none'){
  color = '#' + color;
 }

 let activityPageJSX = <>
 <div style={{ marginBottom: "1px", marginTop:"5px" }}>Activity</div> 
 <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{activityInfo.label}</div> 
 <div style={{ marginBottom: "1px", marginTop:"5px" }}>Page</div> 
 <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{pageInfo.label}</div> 
 </>

if (activityInfo.isSinglePage){
  activityPageJSX = <>
  <div style={{ marginBottom: "1px", marginTop:"5px" }}>Activity</div> 
  <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{activityInfo.label}</div> 
  </>
}


  return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img src={image} style={{ position: "absolute", width: "100%", top: "50%", transform: "translateY(-50%)" }}  />
    </div>
    <b>Editor</b>
      <div style={{ marginBottom: "1px", marginTop:"5px" }}>Course</div> 
      <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{course_label}</div> 
      {activityPageJSX}
    {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
    {/* <div>Last saved (comming soon)</div> */}
  </>
}