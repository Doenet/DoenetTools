import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
// import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from "../temp/Button";
import { nanoid } from 'nanoid';

import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  // selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  // useRecoilStateLoadable, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Viewer/DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/xq-light.css';
// import 'codemirror/theme/neo.css';
// import 'codemirror/theme/base16-light.css';

import './Editor.css';
import { 
  itemHistoryAtom, 
  fileByContentId 
} from '../../../_sharedRecoil/content';

import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';


const editorDoenetMLAtom = atom({
  key:"editorDoenetMLAtom",
  default:""
})

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

const getSHAofContent = (doenetML)=>{
  if (doenetML === undefined){
    return;
  }
  //NOTICE: JSON.stringify CHANGES THE CONTENT SO IT DOESN'T MATCH
  // let contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
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
    // set(versionHistorySelectedAtom,"")
    // const versionHistory = await snapshot.getPromise((itemHistoryAtom(props.branchId)));
    // const contentId = versionHistory.draft.contentId;
 
    // let loadableDoenetML = await snapshot.getPromise(fileByContentId(contentId));
    // const doenetML = loadableDoenetML.data;
    // set(editorDoenetMLAtom,doenetML);
    // set(viewerDoenetMLAtom,(was)=>{
    //   let newObj = {...was}
    //   newObj.doenetML = doenetML;
    //   newObj.updateNumber = was.updateNumber+1;
    //   return newObj});
  })

  if (selectedVersionId === ""){ return null; }

  return <Button callback={()=> returnToEditing() } value="Return to editing" />
}

function EditorInfoPanel(props){
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.branchId))

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}
  const contentId = versionHistory.contents.draft.contentId;

  const link = `http://doenet.org/content/#/?contentId=${contentId}`
  // const quoteLink = `'${link}'`

  return <>
  {/* <p><a href={quoteLink} >Content Tool Link</a></p> */}
  <p><input type="text" value={link} /></p></>
}

function VersionHistoryPanel(props){
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.branchId))
  const selectedVersionId  = useRecoilValue(versionHistorySelectedAtom);
  const [editingVersionId,setEditingVersionId] = useRecoilState(EditingVersionIdAtom);

  // const saveNamedVersion = useRecoilCallback(({snapshot,set})=> async (branchId,versionId,newTitle)=>{
  //   set(itemHistoryAtom(branchId),(was)=>{
  //     let newHistory = [...was]
  //     let newVersion;
  //     for (const [i,version] of was.entries()){
  //       if (versionId === version.versionId){
  //         newVersion = {...version}
  //         newVersion.title = newTitle;
  //         newHistory.splice(i,1,newVersion)
  //       }
  //     }
  //     let newDBVersion = {...newVersion,
  //       isNewTitle:'1',
  //       branchId
  //     }
  //        axios.post("/api/saveNewVersion.php",newDBVersion)
  //         // .then((resp)=>{console.log(">>>resp saveNamedVersion",resp.data)})
  //     return newHistory;
  //   })

  // });

  // const versionHistorySelected = useRecoilCallback(({snapshot,set})=> async (version)=>{
  //   set(versionHistorySelectedAtom,version.versionId)
  //   let loadableDoenetML = await snapshot.getPromise(fileByContentId(version.contentId));
  //   const doenetML = loadableDoenetML.data;
  //   set(editorDoenetMLAtom,doenetML);
  //   set(viewerDoenetMLAtom,(was)=>{
  //     let newObj = {...was}
  //     newObj.doenetML = doenetML;
  //     newObj.updateNumber = was.updateNumber+1;
  //     return newObj});
  // })
  


  // const [editingTitleText,setEditingTitleText] = useState("")

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}

    let namedVersions = [];
    
  for (let version of versionHistory.contents.named){
    // console.log(">>>named",version)
    let releaseButton = <div><button onClick={(e)=>console.log(">>>Release "+version.versionId)} >Release</button></div>
    let releasedIcon = '';
    if (version.isReleased === '1'){
      releaseButton = <div><button onClick={(e)=>console.log(">>>Retract "+version.versionId)} >Retract</button></div>
      releasedIcon = '•';
    }
    let namedTitle = `${releasedIcon} ${version.title}`
    namedVersions.push(<CollapseSection
      title={namedTitle}
      collapsed={true}
      widthCSS='200px'
      >
       <div><button onClick={(e)=>console.log(">>>View "+version.versionId)} >View</button></div> 
       <div><button onClick={(e)=>console.log(">>>Set As Current "+version.versionId)} >Set As Current</button></div> 
        {releaseButton}
      </CollapseSection>)
  }

  let namedVersionsTitle = `${namedVersions.length} Named Versions`
    if (namedVersions.length === 1){
      namedVersionsTitle = '1 Named Version';
    }

  const namedSection = <CollapseSection
  title={namedVersionsTitle}
  collapsed={false}
  >{namedVersions}</CollapseSection>

  let saveSection = []
  for (let version of versionHistory.contents.autoSaves){
    saveSection.push(<CollapseSection
      title={version.timestamp}
      collapsed={true}
      widthCSS='200px'
      >buttons here</CollapseSection>)
  }

    let autoSaveTitle = `${saveSection.length} Auto Saves`
    if (saveSection.length === 1){
      autoSaveTitle = '1 Auto Save';
    }
    let autoSaves = <CollapseSection
    title={autoSaveTitle}
    collapsed={true}
    >
    {saveSection}
    </CollapseSection>
     
  return <>
  <CollapseSection
    title="Current Version"
    collapsed={true}
    >
      buttons
    </CollapseSection>

  {namedSection}
  {autoSaves}
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

    let newVersion = {...oldVersions.draft};
  
    const contentId = getSHAofContent(doenetML);

    newVersion.contentId = contentId;
    newVersion.timestamp = buildTimestamp();

    let oldVersionsReplacement = {...oldVersions};
    oldVersionsReplacement.draft = newVersion;
    set(itemHistoryAtom(props.branchId),oldVersionsReplacement)
    set(fileByContentId(contentId),{data:doenetML})

    //Save in localStorage
    localStorage.setItem(contentId,doenetML)

    let newDBVersion = {...newVersion,
      doenetML,
      branchId:props.branchId
    }
       axios.post("/api/saveNewVersion.php",newDBVersion)
        // .then((resp)=>{console.log(">>>resp saveNewVersion",resp.data)})
  });
  const autoSave = useRecoilCallback(({snapshot,set})=> async ()=>{
    console.log(">>>autoSave")
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
      isReleased:'0',
      title:'Autosave'
    }
    let newDBVersion = {...newVersion,
      doenetML,
      branchId:props.branchId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    let newVersions = {...oldVersions}
    newVersions.autoSaves = [newVersion,...oldVersions.autoSaves]
      set(itemHistoryAtom(props.branchId),newVersions)
      set(fileByContentId(newVersion.contentId),{data:doenetML});
  
      axios.post("/api/saveNewVersion.php",newDBVersion)
        // .then((resp)=>{console.log(">>>resp autoSave",resp.data)})
  
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
      lineNumbers: true,
      //hot take
      indentUnit : 4,
      smartIndent : true,
      matchTags : true,
      // autoCloseTags: true,
      matchBrackets: true,
      lineWrapping: true,
      // autoCloseBrackets: true,
      // hintOptions: {schemaInfo: tags},
      extraKeys : {
        Tab: (cm) => {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
        Enter : (cm) => {
          cm.replaceSelection("\n")
          setTimeout( () => cm.execCommand("indentAuto"), 1);
        },
        "Ctrl-Space" : "autocomplete"
      }
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
  if (selectedVersionId !== "") {return null;}

  return <Button value="Update" callback={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}} />
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
      isReleased:'0',
      isDraft:'0',
      isNamed:'1',
      contentId
    }
    let newDBVersion = {...newVersion,
      doenetML,
      branchId
    }

    const oldVersions = await snapshot.getPromise(itemHistoryAtom(branchId));
    let newVersions = {...oldVersions};
    newVersions.named = [newVersion,...oldVersions.named];

    set(itemHistoryAtom(branchId),newVersions)
    set(fileByContentId(contentId),{data:doenetML});
    
    axios.post("/api/saveNewVersion.php",newDBVersion)
      //  .then((resp)=>{console.log(">>>resp saveVersion",resp.data)})
    
    
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

function DoenetViewerPanel(){
  // console.log("=== DoenetViewer Panel")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const editorInit = useRecoilValue(editorInitAtom);

  if (!editorInit){ return null; }

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
      // assignmentId={assignmentId}
      ignoreDatabase={true}
      requestedVariant={requestedVariant}
      /> 
}

const editorInitAtom = atom({
  key:"editorInit",
  default:false
})

export default function Editor({ branchId, title }) {
  // console.log("===Editor!");

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (branchId)=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(branchId)));
    const contentId = versionHistory.draft.contentId;
    
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object"){
      response = response.data;
    }
    const doenetML = response;

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


  return (
    <Tool>
      <headerPanel title={title}>
        <ReturnToEditingButton branchId={branchId} />
      </headerPanel>

      <mainPanel>
        <div><DoenetViewerUpdateButton  /></div>
        <div style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}><DoenetViewerPanel /></div>
      </mainPanel>

      <supportPanel isInitOpen>
      <TempEditorHeaderBar branchId={branchId} />
          <TextEditor  branchId={branchId}/>
      </supportPanel>

      <menuPanel title="Info">
        <EditorInfoPanel branchId={branchId}/>
      </menuPanel>
      <menuPanel title="Version history">
        <VersionHistoryPanel branchId={branchId} />
      </menuPanel>
      
    </Tool>
  );
}
