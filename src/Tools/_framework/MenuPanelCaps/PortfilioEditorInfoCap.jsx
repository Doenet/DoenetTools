import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import { useLoaderData } from 'react-router';

export async function loader(){
  // export async function loader({params}){
    // let params = new URL(document.location).searchParams;
    // let search = new URL(document.location).search;
    // console.log("search",search)
    // let doenetId = params.get("doenetId"); 
    let afterDoenetId = document.location.href?.split('&doenetId=')[1];
    let doenetId = afterDoenetId?.split('&pageId=')[0];
    //Somehow it still has the url which got us here
    if (doenetId == undefined){
      doenetId = document.location.href?.split('/')[4];
    }
    const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${doenetId}`);
    const data = await response.json();
    
  return data.activityData;
}

export default function PortfilioEditorInfoCap(){
  let data = useLoaderData();
 
return <>
<Box 
  height="130px"
  width="100%"
  // width="180px"
  background="black"
  overflow="hidden"
  // border="2px solid #949494"
  // borderRadius= "6px"
  margin= "auto"
  > 
    <Image 
    width="100%"
    height="100%"
    objectFit="contain"
    src={data.imagePath} 
    alt="Activity Image"
    />
  </Box>
<div style={{ marginBottom: "5px",padding:'1px 5px' }}>Portfolio Activity Editor</div>
{/* <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{data.label}</div> */}
</>

}