import React, { useEffect, useState } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  selectorFamily,
  useSetRecoilState,
  useRecoilValueLoadable 
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';



const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ()=>{
      if (!contentId){
        return "";
      }
      return await axios.get(`/media/${contentId}`) 
    }
  })
  
})

const editorDoenetMLAtom = atom({
  key:"editorDoenetMLAtom",
  default:""
})

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

function DoenetViewerPanel(){
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  console.log(">>>viewerDoenetML",viewerDoenetML)
  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";

  return <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
      flags={{
        showCorrectness: true,
        readOnly: false,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: true,
        showHints: true,
      }}
      attemptNumber={attemptNumber}
      assignmentId={assignmentId}
      ignoreDatabase={false}
      requestedVariant={requestedVariant}
      /> 
}

// function DoenetViewerUpdateButton(){
//   const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
//   const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
//   const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
//   if (selectedTimestamp !== "") {return null;}

//   return <button onClick={()=>{setViewerDoenetML((old)=>{
//     let newInfo = {...old};
//     newInfo.doenetML = editorDoenetML;
//     newInfo.updateNumber = old.updateNumber+1;
//     return newInfo;
//   })}}>Update</button>
// }

export default function Editor({ contentId, branchId }) {
  console.log("===Editor!");
  const loadedDoenetML = useRecoilValueLoadable(fileByContentId(contentId))
  let doenetML = loadedDoenetML.contents?.data;
  const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  // const setEditorOverlayTitle = useSetRecoilState(overlayTitleAtom);
  useEffect(() => {
    //init code here

    if (doenetML !== undefined){
    console.log(">>>Editor Init!!!!!!!",doenetML);
    setEditorDoenetML(doenetML);
    setViewerDoenetML({updateNumber:1,doenetML});
    }
    // return () => console.log(">>>Cal exit"); //cleanup code here
}, [doenetML]);

  if (loadedDoenetML.state === "loading"){ return null;}
  if (loadedDoenetML.state === "hasError"){ 
    console.error(loadedDoenetML.contents)
    return null;}




  return (
    <Tool>
      <headerPanel title="How?"></headerPanel>

      <mainPanel>
        This is the editor on branch: {branchId} with content: {contentId}
        {/* <div><DoenetViewerUpdateButton  /></div> */}
        <DoenetViewerPanel />

      </mainPanel>

      <supportPanel>
        <p>Stuff</p>
      </supportPanel>

      <menuPanel title={"test"}>
       <p>test</p>
      </menuPanel>
    </Tool>
  );
}
