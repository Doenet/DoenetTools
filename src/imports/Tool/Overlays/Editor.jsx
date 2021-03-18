import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from "../../PanelHeaderComponents/Button";
import { nanoid } from 'nanoid';

import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/xq-light.css';
// import 'codemirror/theme/neo.css';
// import 'codemirror/theme/base16-light.css';

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
      // console.log(">>>itemHistoryAtom branchId",branchId)
      if (!branchId){
        return [];
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      // console.log(">>>data",data)
      return data.versions
    }
  })
})

const getSHAofContent = (doenetML)=>{
  if (doenetML === undefined){
    return;
  }
  let contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
  return contentId;
}

  const versionHistorySelectedAtom = atom({
    key:"versionHistorySelectedAtom",
    default:""
  })

  //Need this?
  const EditingVersionIdAtom = atom({
    key:"EditingVersionIdAtom",
    default:""
  })
  
function ReturnToEditingButton(props){
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  const returnToEditing = useRecoilCallback(({snapshot,set})=> async ()=>{
    set(versionHistorySelectedAtom,"")
    let loadableDoenetML = await snapshot.getPromise(fileByContentId(props.branchId));
    const doenetML = loadableDoenetML.data;
    set(editorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,(was)=>{
      let newObj = {...was}
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber+1;
      return newObj});
  })

  if (selectedVersionId === ""){ return null; }

  return <Button callback={()=> returnToEditing() } value="Return to editing" />
}

function VersionHistoryPanel(props){
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.branchId))
  const selectedVersionId  = useRecoilValue(versionHistorySelectedAtom);
  const [editingVersionId,setEditingVersionId] = useRecoilState(EditingVersionIdAtom);

  const saveNamedVersion = useRecoilCallback(({snapshot,set})=> async (branchId,versionId,newTitle)=>{
    set(itemHistoryAtom(branchId),(was)=>{
      let newHistory = [...was]
      let newVersion;
      for (const [i,version] of was.entries()){
        if (versionId === version.versionId){
          newVersion = {...version}
          newVersion.title = newTitle;
          newHistory.splice(i,1,newVersion)
        }
      }
      let newDBVersion = {...newVersion,
        isNewTitle:'1',
        branchId
      }
         axios.post("/api/saveNewVersion.php",newDBVersion)
          // .then((resp)=>{console.log(">>>resp saveNamedVersion",resp.data)})
      return newHistory;
    })

  });

  const versionHistorySelected = useRecoilCallback(({snapshot,set})=> async (version)=>{
    set(versionHistorySelectedAtom,version.versionId)
    let loadableDoenetML = await snapshot.getPromise(fileByContentId(version.contentId));
    const doenetML = loadableDoenetML.data;
    set(editorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,(was)=>{
      let newObj = {...was}
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber+1;
      return newObj});
  })
  


  const [editingTitleText,setEditingTitleText] = useState("")

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}

    let versions = [];
    
  for (let version of versionHistory.contents){
     
      // let nameItButton = <button>Name Version</button>;

      let titleText = version.title;
      let titleStyle = {}

      if (version.isDraft === "1"){ 
        titleText = "Current Version";
      }

      let drawer = null;
      let versionStyle = {};

      if (selectedVersionId === version.versionId){
        versionStyle = {backgroundColor:"#b8d2ea"}
        titleStyle = {border: "1px solid black", padding: "1px"}
        drawer = <>
        {/* <div>{nameItButton}</div> */}
        <div><Button value="Make a copy" /></div>
        <div><Button value="Delete Version" /></div>
        <div><Button value="Use as Current Version" /></div>
        </>
        if (version.isDraft === "1"){ 
          drawer = <>
          <div><Button value="Make a copy" /></div>
          </>
        }
      }
      let title = <div><b 
      onClick={()=>{
        if (selectedVersionId === version.versionId){
          setEditingVersionId(version.versionId);
          setEditingTitleText(titleText);
        }
      }} 
      style={titleStyle}>{titleText}</b></div>

      if (editingVersionId === version.versionId){
        title = <div><input 
        autoFocus
        onBlur={()=>{
          setEditingVersionId("");
          saveNamedVersion(props.branchId,version.versionId,editingTitleText);
        }}
        onKeyDown={(e)=>{if (e.key === 'Enter'){
          setEditingVersionId("");
          saveNamedVersion(props.branchId,version.versionId,editingTitleText);
        }}}
        onChange={(e)=>{setEditingTitleText(e.target.value)}}
        value = {editingTitleText}
      type="text" /></div>
      }

      let jsx = (<React.Fragment key={`history${version.versionId}`}>
      <div 
      onClick={()=>{
        if (version.versionId !== selectedVersionId){
          versionHistorySelected(version);
        }
      }}
    style={versionStyle}
    >
      {title}
      <div>{version.timestamp}</div>
      </div>
      {/* {drawer} */}
      </React.Fragment>)

      //Put draft at the top
        if (version.isDraft === "1"){ 
          versions.unshift(jsx)
        }else{
          versions.push(jsx)
        }

  }

  return <>
  {versions}
  </>
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
  const [selectedVersionId,setSelectedVersionId]  = useRecoilState(versionHistorySelectedAtom);

  const saveDraft = useRecoilCallback(({snapshot,set})=> async (branchId)=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));

    //Find Draft
    let newVersion;
    for (const [i,version] of oldVersions.entries()){
      if (version.isDraft === '1'){
        newVersion = {...version};
        break;
      }

    }
    newVersion.contentId = getSHAofContent(doenetML);
    newVersion.timestamp = buildTimestamp();

    let oldVersionsReplacement = [...oldVersions];
    oldVersionsReplacement[0] = newVersion;
    set(itemHistoryAtom(props.branchId),oldVersionsReplacement)
    set(fileByContentId(branchId),{data:doenetML})

    let newDBVersion = {...newVersion,
      doenetML,
      branchId:props.branchId
    }
       axios.post("/api/saveNewVersion.php",newDBVersion)
        // .then((resp)=>{console.log(">>>resp saveDraft",resp.data)})
  });
  const autoSave = useRecoilCallback(({snapshot,set})=> async ()=>{

    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const timestamp = buildTimestamp();
    const versionId = nanoid();

    let newVersion = {
      contentId,
      versionId,
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
      //  .then((resp)=>{console.log(">>>resp autoSave",resp.data)})
  
  });

  const timeout = useRef(null);
  let editorRef = useRef(null);
  const autosavetimeout = useRef(null);
  let textValue = editorDoenetML;

  function clearSaveTimeouts(){
    if (timeout.current !== null){
      clearTimeout(timeout.current)
      timeout.current = null;
      saveDraft(props.branchId);
    }
    if (autosavetimeout.current !== null){
      clearTimeout(autosavetimeout.current)
    }
  }

 //Stop timers on unmount
 //Also, clear history selection on unmount
  useEffect(() => {
    return () => {
      clearSaveTimeouts();
      setSelectedVersionId("");
    };
  },[]);

  if (selectedVersionId !== ""){
    //Read Only without timers
    clearSaveTimeouts()
    if (editorRef.current){
      editorRef.current.options.readOnly = true;
    }
  }else{
    if (editorRef.current){
      editorRef.current.options.readOnly = false;
    }
  }

  const editorInit = useRecoilValue(editorInitAtom);
  if (!editorInit){return null;}

  const options = {
      mode: 'xml',
      autoRefresh:true,
      // theme: 'neo',
      // theme: 'base16-light',
      theme: 'xq-light',
      lineNumbers: true
  }

  return <>

  {/* <button onClick={()=>{
    console.log(">>>editorRef.current",editorRef.current)
    // editorRef.current.options.readOnly = true;
    // editorRef.current.doc.undo();
    editorRef.current.doc.markText({line:1,ch:1},{line:2,ch:3});
    // let tm = editorRef.current.doc.markText({line:1,ch:1},{line:2,ch:3},{css:"background:olive"});
    // tm.css("background:olive")
    //cm.getTokenAt
    let cm = editorRef.current.doc.getEditor();
    // let token = cm.getTokenAt({line:1,ch:1},true);
    // console.log(">>>token",token)
    let tokens = cm.getLineTokens(1);
    console.log(">>>tokens",tokens)

  }}>Mark</button>
  <button onClick={()=>{
    console.log(">>>editorRef.current",editorRef.current)
    // editorRef.current.options.readOnly = false;
    // editorRef.current.doc.redo();
  }}>Redo</button> */}

  <VisibilitySensor onChange={(visible)=>{
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
    if (selectedVersionId === "") { //No timers when active version history
      setEditorDoenetML(value);
      if (timeout.current === null){
        timeout.current = setTimeout(function(){
          saveDraft(props.branchId);
          timeout.current = null;
        },3000)
      }
      if (autosavetimeout.current === null){
        autosavetimeout.current = setTimeout(function(){
          autoSave();
          autosavetimeout.current = null;
        },60000) //1 minute
      }
    }
  }}
  // onChange={(editor, data, value) => {
  // }}
/>

  </VisibilitySensor>
  </>
}

function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  const setLastHeight = useRecoilCallback(({snapshot,set})=> async ()=>{
    const height = await snapshot.getPromise(editorViewerScrollHeightAtom);
    set(editorViewerScrollBeforeUpdateHeightAtom,height)
  })
  if (selectedVersionId !== "") {return null;}
  

  return <Button value="Update" callback={()=>{
    setLastHeight();
    setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })
}} /> 
}

function NameCurrentVersionControl(props){
  const saveVersion = useRecoilCallback(({snapshot,set})=> async (branchId)=>{
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();

    let newVersion = {
      title:"Named",
      versionId,
      timestamp,
      isDraft:'0',
      isNamed:'1',
      contentId
    }
    let newDBVersion = {...newVersion,
      doenetML,
      branchId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(branchId));

    set(itemHistoryAtom(branchId),[...oldVersions,newVersion])
    set(fileByContentId(contentId),{data:doenetML});
    axios.post("/api/saveNewVersion.php",newDBVersion)
      // .then((resp)=>{console.log(">>>resp saveVersion",resp.data)})
    
    
  })
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  if (selectedVersionId !== "") {return null;}

  return <Button value="Save Version" callback={()=>saveVersion(props.branchId)} />
}

function TempEditorHeaderBar(props){
  return <div style={{height:"24px"}}>
    <NameCurrentVersionControl branchId={props.branchId} />
  </div>
}

function DoenetViewerPanel(props){
  // console.log("=== DoenetViewer Panel")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const editorInit = useRecoilValue(editorInitAtom);
  const onCoreReady = useRecoilCallback(({set,snapshot})=> async ()=>{
      let lastHeight = await snapshot.getPromise(editorViewerScrollBeforeUpdateHeightAtom);
         setTimeout(()=>{
        props.setScrollHeight(lastHeight)
      } ,500);
  })

  if (!editorInit){ return null; }

  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";


  return <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      onCoreReady={onCoreReady}
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

const editorInitAtom = atom({
  key:"editorInit",
  default:false
})

const editorViewerScrollHeightAtom = atom({
  key:"editorViewerScrollHeight",
  default:0
})

const editorViewerScrollBeforeUpdateHeightAtom = atom({
  key:"editorViewerScrollBeforeUpdateHeight",
  default:0
})

export default function Editor({ branchId, title }) {
  // console.log("===Editor!");
  const viewerRef = useRef(null);
  const setEditorViewerScrollHeight = useSetRecoilState(editorViewerScrollHeightAtom);

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    set(editorDoenetMLAtom,doenetML);
    const viewerObj = await snapshot.getPromise(viewerDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerDoenetMLAtom,{updateNumber,doenetML})
    set(editorInitAtom,true);
  })

  const setEditorInit = useSetRecoilState(editorInitAtom);

  useEffect(() => {
    initDoenetML(branchId)
    return () => {
      setEditorInit(false);
    }
}, []);


function setScrollHeight(height){
  console.log(">>>HERE",height)
  viewerRef.current.scrollTo(0,height);
}


  return (
    <Tool>
      <headerPanel title={title}>
        <ReturnToEditingButton branchId={branchId} />
      </headerPanel>

      <mainPanel>
        <div><DoenetViewerUpdateButton /></div>
        <div
        ref={viewerRef}
         onScroll={()=>{
           setEditorViewerScrollHeight(viewerRef.current.scrollTop)
          }}
         style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}>
           <DoenetViewerPanel setScrollHeight={setScrollHeight} />
         </div>
      </mainPanel>

      <supportPanel isInitOpen>
      <TempEditorHeaderBar branchId={branchId} />
          <TextEditor  branchId={branchId}/>
      </supportPanel>

      <menuPanel title="Version history">
        <VersionHistoryPanel branchId={branchId} />
      </menuPanel>
    </Tool>
  );
}
