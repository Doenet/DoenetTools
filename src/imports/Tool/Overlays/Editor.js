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
  useRecoilState,
  useRecoilValueLoadable 
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


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


function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  // const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))
  // const [cancelAutoSave,setCancelAutoSave] = useRecoilState(cancelAutoSaveAtom);

  // const timeout = useRef(null);
  // const autosavetimeout = useRef(null);
  // const trackMount = useRef("Init");

  // const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  

  // if (cancelAutoSave){
  //   if (autosavetimeout.current !== null){
  //     clearTimeout(autosavetimeout.current)
  //   }
  //   setCancelAutoSave(false);
  // }

  //Used to work around second mount of codemirror with the same value it doesn't display value
  let value = editorDoenetML;
  // if (trackMount.current === "Init"){
  //   value = "";
  // }

  return <CodeMirror
  // editorDidMount={()=>trackMount.current = "Mount"}
  value={value}
  // options={options}
  onBeforeChange={(editor, data, value) => {
      setEditorDoenetML(value)
      // if (selectedTimestamp === "") { //Only update if an inactive version history
      // setEditorDoenetML(value)
      // if (timeout.current === null){
      //   timeout.current = setTimeout(function(){
      //     setVersion({instructions:{type:"Save Draft"}})
      //     timeout.current = null;
      //   },3000)
      // }
      // if (autosavetimeout.current === null){
      //   autosavetimeout.current = setTimeout(function(){
      //     setVersion({instructions:{type:"Autosave"}})
      //     autosavetimeout.current = null;
      //   },60000) //TODO: Make 1 minute 60000
      // }
  // }
  }}
  // onChange={(editor, data, value) => {
  // }}
  // onBlur={()=>{
  //   if (timeout.current !== null){
  //     clearTimeout(timeout.current)
  //     timeout.current = null;
  //     setVersion({instructions:{type:"Save Draft"}})
  //   }
  //   if (autosavetimeout.current !== null){
  //     clearTimeout(autosavetimeout.current)
  //   }
  // }}
/>
}

function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  // const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  // if (selectedTimestamp !== "") {return null;}

  return <button onClick={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}}>Update</button>
}

export default function Editor({ contentId, branchId }) {
  console.log("===Editor!");
  const loadedDoenetML = useRecoilValueLoadable(fileByContentId(contentId))
  let doenetML = loadedDoenetML.contents?.data;
  const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  // const setEditorOverlayTitle = useSetRecoilState(overlayTitleAtom);
  useEffect(() => {
    if (doenetML !== undefined){
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
        <div><DoenetViewerUpdateButton  /></div>
        <DoenetViewerPanel />

      </mainPanel>

      <supportPanel>
        <div>
          {/* <NameCurrentVersionControl branchId={branchId} /> */}
          <TextEditor  branchId={branchId}/>
          </div>
      </supportPanel>

      <menuPanel title={"test"}>
       <p>test</p>
      </menuPanel>
    </Tool>
  );
}
