import { set } from 'idb-keyval';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { itemByDoenetId, courseIdAtom, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';
// import { find_image_label, find_color_label } from './util'

export default function PortfilioEditorInfoCap(){
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [data,setData] = useState({})
  
  // const activityInfo = useRecoilValue(itemByDoenetId(doenetId));
  // const courseId = useRecoilValue(courseIdAtom);
  // const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  // const pageInfo = useRecoilValue(itemByDoenetId(pageId));
  
  
  useEffect(()=>{
    //Move this to loader when using React Router
    async function loadData(){
    const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${doenetId}`);
    const respdata = await response.json();
    setData(respdata.activityData);
    }
    if (doenetId){
      loadData();
    }
  },[doenetId])
  
  if (!data?.label){ return null;}
  
  // console.log("data",data)


return <>
<div style={{ position: "relative", width: "100%", height:"124px", overflow: "hidden"}}>
  <img src={data.imagePath} alt="Activity Thumbnail"/>
</div>
<div style={{ marginBottom: "5px",padding:'1px 5px' }}>Portfolio Activity Editor</div>
{/* <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{data.label}</div> */}
</>

}