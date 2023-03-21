import React from 'react';
import { useLoaderData } from 'react-router';

export async function loader(){
  // export async function loader({params}){
  let params = new URL(document.location).searchParams;
  let doenetId = params.get("doenetId"); // is the string "Jonathan Smith".
  const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${doenetId}`);
  const data = await response.json();

  return data.activityData;
}

export default function PortfilioEditorInfoCap(){
  let data = useLoaderData();
 
return <>
<div style={{ position: "relative", width: "100%", height:"124px", overflow: "hidden"}}>
  <img src={data.imagePath} alt="Activity Thumbnail"/>
</div>
<div style={{ marginBottom: "5px",padding:'1px 5px' }}>Portfolio Activity Editor</div>
{/* <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{data.label}</div> */}
</>

}