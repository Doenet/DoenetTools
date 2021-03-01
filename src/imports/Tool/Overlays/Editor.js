import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import crypto from 'crypto';
import  VisibilitySensor from 'react-visibility-sensor';
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
import './editor.css';

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


const getSHAofContent = (doenetML)=>{
  const hash = crypto.createHash('sha256');
  if (doenetML === undefined){
    return;
  }
  hash.update(doenetML);
  let contentId = hash.digest('hex');
  return contentId;
}

const updateItemHistorySelector = selectorFamily({
  key:"updateItemHistorySelector",
  get:(branchId)=> ({get})=>{
    return get(itemHistoryAtom(branchId))
  },
  set:(branchId)=> ({get,set},instructions)=>{
    console.log(">>>instructions",branchId,instructions.instructions)
    

    const doenetML = get(editorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const dt = new Date();
    const timestamp = `${
      dt.getFullYear().toString().padStart(2, '0')}-${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`

      let title = timestamp;
      let isNamed = "0";
      let draft = false;

      if (instructions.instructions.type === "Name Current Version"){
        isNamed = "1";
      }else if (instructions.instructions.type === "Save Draft"){
        draft = true;
        title = "draft";
       } else if (instructions.instructions.type === "Autosave"){
        title = "Autosave";
       } 

       if (instructions.instructions.type === "Name Version"){
        const newTitle = instructions.instructions.newTitle;
        const timestamp = instructions.instructions.timestamp;
        set(itemHistoryAtom(branchId),(oldVersions)=>{
          let newVersions = [];
          for (let version of oldVersions){
            if (version.timestamp === timestamp){
            let newVersion = {...version};
              newVersion.title = newTitle;
              newVersion.isNamed="1";
              newVersions.push(newVersion);
            }else{
              newVersions.push(version);
            }

          }
          return [...newVersions]
        })
        axios.get("/api/updateNamedVersion.php",{ params: {timestamp,newTitle,branchId,isNamed:'1'} })
        //  .then((resp)=>{console.log(">>>resp",resp.data)})

       }else{
        let newVersion = {
          title:timestamp,
          contentId,
          timestamp,
          isDraft: "0",
          isNamed
        }
    
        if (!draft){
          set(itemHistoryAtom(branchId),(oldVersions)=>{return [...oldVersions,newVersion]})
          set(fileByContentId(contentId),{data:doenetML})
        }else{

          set(fileByContentId(branchId),{data:doenetML})
        }
console.log(`>>>write file with ${doenetML}`)
        axios.post("/api/saveNewVersion.php",{title,branchId,doenetML,isNamed,draft})
        //  .then((resp)=>{console.log(">>>resp",resp.data)})
       }


    
  }
})


function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))
  // const [cancelAutoSave,setCancelAutoSave] = useRecoilState(cancelAutoSaveAtom);

  const timeout = useRef(null);
  let editorRef = useRef(null);
  // const autosavetimeout = useRef(null);
  let textValue = editorDoenetML;

  //Used to work around second mount of codemirror with the same textValue it doesn't display textValue
  useEffect(() => {
    // console.log(`>>>Mount!>${textValue}<`);
    // textValue = ""; 
    return () => {
      console.log(`>>>Unmount! textValue:>${textValue}<`);
      if (timeout.current !== null){
        clearTimeout(timeout.current)
        timeout.current = null;
        setVersion({instructions:{type:"Save Draft"}})
      }
    };
  },[]);
  console.log(`>>>textValue>${textValue}<`)

  // const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  

  // if (cancelAutoSave){
  //   if (autosavetimeout.current !== null){
  //     clearTimeout(autosavetimeout.current)
  //   }
  //   setCancelAutoSave(false);
  // }

  const options = {
      mode: 'xml',
      autoRefresh:true,
      // theme: 'material',
      lineNumbers: true
  }

  return <VisibilitySensor onChange={(visible)=>{
    if (visible){
      editorRef.current.refresh();
    }  
    }}>
<CodeMirror
  className="CodeMirror"
  editorDidMount={editor => { editorRef.current = editor;  }}
  value={textValue}
  options={options}
  onBeforeChange={(editor, data, value) => {
      // setEditorDoenetML(value)
      // if (selectedTimestamp === "") { //Only update if an inactive version history
      setEditorDoenetML(value);
      if (timeout.current === null){
        timeout.current = setTimeout(function(){
          setVersion({instructions:{type:"Save Draft"}})
          timeout.current = null;
        },3000)
      }
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

  </VisibilitySensor>
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
  if (contentId === ""){contentId = branchId;} //Load current working version when no contentId
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
       {/* <p>test</p> */}
          {/* <TextEditor  branchId={branchId}/> */}

      </menuPanel>
    </Tool>
  );
}
