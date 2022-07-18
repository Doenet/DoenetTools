import React from 'react';
import { useRecoilValue } from 'recoil';
import { itemByDoenetId, courseIdAtom, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';

export default function EditorInfoCap(){
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  let {color, image, label:course_label} = useCourse(courseId);

  const pageInfo = useRecoilValue(itemByDoenetId(pageId));
  const activityInfo = useRecoilValue(itemByDoenetId(doenetId));

  if (!pageInfo || !image){ return null;}
 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
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

if (activityInfo.isSinglePage ){
  activityPageJSX = <>
  <div style={{ marginBottom: "1px", marginTop:"5px" }}>Activity</div> 
  <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{activityInfo.label}</div> 
  </>
}

if (activityInfo.type == 'bank'){
  activityPageJSX = <>
  <div style={{ marginBottom: "1px", marginTop:"5px" }}>Collection</div> 
  <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{activityInfo.label}</div> 
  <div style={{ marginBottom: "1px", marginTop:"5px" }}>Page</div> 
 <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{pageInfo.label}</div> 
  </>
}


  return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img style={{ position: "absolute", width: "100%", height: "100%", backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: image, backgroundColor: color }}  />
    </div>
    <b>Editor</b>
      <div style={{ marginBottom: "1px", marginTop:"5px" }}>Course</div> 
      <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{course_label}</div> 
      {activityPageJSX}
    {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
    {/* <div>Last saved (comming soon)</div> */}
  </>
}