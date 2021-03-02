import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import crypto from 'crypto';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from "../../../imports/PanelHeaderComponents/Button";

import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
// import 'codemirror/theme/xq-light.css';
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

const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(branchId)=> async ()=>{
      console.log(">>>itemHistoryAtom branchId",branchId)
      if (!branchId){
        return [];
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      console.log(">>>data",data)
      return data.versions
    }
  })
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
        title = "Draft";
       } 

      //  if (instructions.instructions.type === "Name Version"){
      //   const newTitle = instructions.instructions.newTitle;
      //   const timestamp = instructions.instructions.timestamp;
      //   set(itemHistoryAtom(branchId),(oldVersions)=>{
      //     let newVersions = [];
      //     for (let version of oldVersions){
      //       if (version.timestamp === timestamp){
      //       let newVersion = {...version};
      //         newVersion.title = newTitle;
      //         newVersion.isNamed="1";
      //         newVersions.push(newVersion);
      //       }else{
      //         newVersions.push(version);
      //       }

      //     }
      //     return [...newVersions]
      //   })
      //   axios.get("/api/updateNamedVersion.php",{ params: {timestamp,newTitle,branchId,isNamed:'1'} })
      //   //  .then((resp)=>{console.log(">>>resp",resp.data)})

      //  }else{
        let newVersion = {
          title:timestamp,
          contentId,
          timestamp,
          isDraft: "0",
          isNamed
        }

        if (!draft){
          console.log(">>>itemHistoryAtom",branchId,newVersion)
          // set(itemHistoryAtom(branchId),(oldVersions)=>{
          //   console.log(">>>oldVersions",oldVersions)
          //   return [...oldVersions,newVersion]
          // })
          let oldVersions = get(itemHistoryAtom(branchId));
          console.log(">>>oldVersion",oldVersions);
          // set(itemHistoryAtom(branchId),[...oldVersions,newVersion])

          console.log(">>>fileByContentId",contentId,doenetML)
          set(fileByContentId(contentId),{data:doenetML})
        }else{

          set(fileByContentId(branchId),{data:doenetML})
        }

        axios.post("/api/saveNewVersion.php",{title,branchId,doenetML,isNamed,isDraft:draft})
        //  .then((resp)=>{console.log(">>>resp",resp.data)})
       


    
  }
})

function VersionHistoryPanel(props){
  return <p>history</p>
  // const [versionHistory,setVersion] = useRecoilStateLoadable(updateItemHistorySelector(props.branchId))
  // const [selectedTimestamp,setSelectedTimestamp] = useRecoilState(versionHistorySelectedAtom);
  // const [editingTimestamp,setEditingTimestamp] = useRecoilState(EditingTimestampAtom);
  // const setEditingContentId = useSetRecoilState(EditingContentIdAtom);

  // const [editingText,setEditingText] = useState("")

  // if (versionHistory.state === "loading"){ return null;}
  // if (versionHistory.state === "hasError"){ 
  //   console.error(versionHistory.contents)
  //   return null;}

  //   let versions = [];
  // for (let version of versionHistory.contents){
  //   // console.log(">>>version",version)
  //     if (version.isDraft !== "1"){
  //     // let nameItButton = <button>Name Version</button>;

  //     let titleText = version.timestamp;
  //     let titleStyle = {}

  //     if (version.isNamed === "1"){
  //       titleText = version.title;
  //     }

  //     let drawer = null;
  //     let versionStyle = {};

  //     if (selectedTimestamp === version.timestamp){
  //       versionStyle = {backgroundColor:"#b8d2ea"}
  //       titleStyle = {border: "1px solid black", padding: "1px"}
  //       drawer = <>
  //       {/* <div>{nameItButton}</div> */}
  //       <div><Button value="Make a copy" /></div>
  //       <div><Button value="Delete Version" /></div>
  //       <div><Button value="Use as Current Version" /></div>
  //       </>
  //     }
  //     let title = <div><b 
  //     onClick={()=>{
  //       if (selectedTimestamp !== ""){
  //         setEditingText(titleText);
  //         setEditingTimestamp(version.timestamp)
  //       }
  //     }} 
  //     style={titleStyle}>{titleText}</b></div>

  //     if (editingTimestamp === version.timestamp){
  //       title = <div><input 
  //       autoFocus
  //       onBlur={()=>{
  //         setEditingTimestamp("");
  //         setVersion({instructions:{type:"Name Version",newTitle:editingText,timestamp:version.timestamp}})
  //       }}
  //       onChange={(e)=>{setEditingText(e.target.value)}}
  //       value = {editingText}
  //     type="text" /></div>
  //     }

  //     versions.push(<React.Fragment key={`pastVersion${version.timestamp}`}>
  //       <div 
  //       onClick={()=>{
  //         if (version.timestamp !== selectedTimestamp){
  //           setSelectedTimestamp(version.timestamp)
  //           // console.log(">>>version.contentId",version.contentId)
  //           setEditingContentId(version.contentId)
  //         }
  //       }}
  //     style={versionStyle}
  //     >
  //       {title}
  //       <div>{version.timestamp}</div>
  //       </div>
  //       {drawer}
  //       </React.Fragment> )

  //   }
  // }

  // //   setVersion({instructions:{type:"Name Current Version"}}) }}>Name Version</button>

  // if (versions.length === 0){
  //   versions = <b>No Saved Versions</b>
  // }
  
  // return <>
  // {versions}
  // </>
}

function buildTimestamp(){
  const dt = new Date();
  return `${
    dt.getFullYear().toString().padStart(2, '0')}-${
    (dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`
}


function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))
  const autoSave = useRecoilCallback(({snapshot,set})=> async ()=>{

    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const timestamp = buildTimestamp();
    let newVersion = {
      contentId,
      timestamp,
      isDraft:'0',
      isNamed:'0',
      title:'Autosave'
    }
    let newDBVersion = {...newVersion,
      doenetML,
      branchId:props.branchId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    set(itemHistoryAtom(props.branchId),[...oldVersions,newVersion])
    set(fileByContentId(newVersion.contentId),{data:doenetML});
    axios.post("/api/saveNewVersion.php",newDBVersion)
    //  .then((resp)=>{console.log(">>>resp",resp.data)})
  });

  const timeout = useRef(null);
  let editorRef = useRef(null);
  const autosavetimeout = useRef(null);
  let textValue = editorDoenetML;

  //Used to work around second mount of codemirror with the same textValue it doesn't display textValue
  useEffect(() => {
    return () => {
      console.log(`>>>Unmount!!!!!!!!!!!!!!!`);
      if (timeout.current !== null){
        clearTimeout(timeout.current)
        timeout.current = null;
        setVersion({instructions:{type:"Save Draft"}}) 
      }
      if (autosavetimeout.current !== null){
        clearTimeout(autosavetimeout.current)
      }
    };
  },[]);

  // const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  

  const options = {
      mode: 'xml',
      autoRefresh:true,
      // theme: 'neo',
      // theme: 'base16-light',
      // theme: 'xq-light',
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
      // if (selectedTimestamp === "") { //Only update if an inactive version history
      setEditorDoenetML(value);
      // if (timeout.current === null){
      //   timeout.current = setTimeout(function(){
      //     setVersion({instructions:{type:"Save Draft"}}) 
      //     timeout.current = null;
      //   },3000)
      // }
      if (autosavetimeout.current === null){
        autosavetimeout.current = setTimeout(function(){
          autoSave();
          autosavetimeout.current = null;
        },1000) //1 second
      // },60000) //1 minute
      }
  // }
  }}
  // onChange={(editor, data, value) => {
  // }}
/>

  </VisibilitySensor>
}





function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  // const selectedTimestamp = useRecoilValue(versionHistorySelectedAtom);
  // if (selectedTimestamp !== "") {return null;}

  return <Button value="Update" callback={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}} />
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
        <div><DoenetViewerUpdateButton  /></div>
        <DoenetViewerPanel />
      </mainPanel>

      <supportPanel>
        <div>
          {/* <NameCurrentVersionControl branchId={branchId} /> */}
          <TextEditor  branchId={branchId}/>
          </div>
      </supportPanel>

      <menuPanel title="Version history">
        <VersionHistoryPanel branchId={branchId} />
      </menuPanel>
    </Tool>
  );
}
