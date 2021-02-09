import React, { useRef, useState } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { 
  folderDictionarySelector, 
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearAllSelections, 
  fetchDrivesSelector,
  encodeParams
} from "../imports/Drive";
import nanoid from 'nanoid';


import {
  useHistory
} from "react-router-dom";
// import AddItem from '../imports/AddItem'
// import Switch from "../imports/Switch";
import Button from "../imports/PanelHeaderComponents/Button";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
// import { supportVisible } from "../imports/Tool/SupportPanel";
import GlobalFont from "../fonts/GlobalFont.js";
import axios from "axios";
// import Button from "../imports/PanelHeaderComponents/Button.js";
import DoenetViewer from './DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import crypto from 'crypto';


const itemVersionsSelector = selectorFamily({
  key:"itemInfoSelector",
  get:(branchId)=> async ()=>{
    // Load versions from database
    const { data } = await axios.get(
      `/api/loadVersions.php?branchId=${branchId}`
    );
    return data.versions
  }
})

const selectedInformation = selector({
  key:"selectedInformation",
  get: ({get})=>{
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1){
      return {number:globalSelected.length}
    }
    //Find information if only one item selected
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    let folderInfo = get(folderDictionary({driveId,folderId})); 
    const itemId = globalSelected[0].itemId;
    let itemInfo = folderInfo.contentsDictionary[itemId];
    let versions = [];
    if (itemInfo.itemType === "DoenetML"){
      let branchId = itemInfo.branchId;
      versions = get(itemVersionsSelector(branchId))
    }
    return {number:globalSelected.length,itemInfo,versions}
  }
})

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

function TextEditor(props){
  const [editorDoenetML,setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))

  const timeout = useRef(null);
  const autosavetimeout = useRef(null);

  return <CodeMirror
  value={editorDoenetML}
  // options={options}
  onBeforeChange={(editor, data, value) => {
    setEditorDoenetML(value)
    if (timeout.current === null){
      timeout.current = setTimeout(function(){
        setVersion({instructions:{type:"Save Draft"}})
        timeout.current = null;
      },3000)
    }
    if (autosavetimeout.current === null){
      autosavetimeout.current = setTimeout(function(){
        setVersion({instructions:{type:"Autosave"}})
        autosavetimeout.current = null;
      },10000) //TODO: Make 5 minutes 300000
    }
  }}
  // onChange={(editor, data, value) => {
  // }}
  onBlur={()=>{
    if (timeout.current !== null){
      clearTimeout(timeout.current)
      timeout.current = null;
        setVersion({instructions:{type:"Save Draft"}})
    }
  }}
/>
}

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

function DoenetViewerUpdateButton(){
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);

  return <button onClick={()=>{setViewerDoenetML((old)=>{
    let newInfo = {...old};
    newInfo.doenetML = editorDoenetML;
    newInfo.updateNumber = old.updateNumber+1;
    return newInfo;
  })}}>Update</button>
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

const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(branchId)=> async ()=>{
      if (!branchId){
        return "";
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      return data.versions
    }
  })
})

const updateItemHistorySelector = selectorFamily({
  key:"updateItemHistorySelector",
  get:(branchId)=> ({get})=>{
    return get(itemHistoryAtom(branchId))
  },
  set:(branchId)=> ({get,set},instructions)=>{
    console.log(">>>instructions.type",instructions.instructions.type)
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
       } else if (instructions.instructions.type === "Autosave"){
        title = "Autosave";
       } 

       


    let newVersion = {
      title:timestamp,
      contentId,
      timestamp,
      isDraft: "0",
      isNamed
    }

    if (!draft){
      set(itemHistoryAtom(branchId),(oldVersions)=>{return [...oldVersions,newVersion]})
      set(fileByContentId(branchId),{data:doenetML})
    }else{
      set(fileByContentId(contentId),{data:doenetML})
    }
    axios.post("/api/saveNewVersion.php",{title,branchId,doenetML,isNamed,draft})
     .then((resp)=>{console.log(">>>resp",resp.data)})
  }
})

// const saveDraftSelector = selectorFamily({
//   key:"fileByContentIdSelector",

//   set:(branchId)=>({set,get})=>{
//     const doenetML = get(editorDoenetMLAtom);
//     set(fileByContentId(branchId),{data:doenetML});
//     axios.post("/api/saveNewVersion.php",{branchId,doenetML,draft:true})
//     // .then((resp)=>{console.log(">>>resp",resp.data)})
//   }
// })

function VersionHistoryPanel(props){
  const [versionHistory,setVersion] = useRecoilStateLoadable(updateItemHistorySelector(props.branchId))

  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}

    var currentVersionInfo;

    let pastVersions = [];
  for (let version of versionHistory.contents){
    if (version.isDraft === "1"){
      currentVersionInfo = version;
    }else{
      let title = version.timestamp;
      let nameItButton = <button>Name Version</button>;

      if (version.isNamed === "1"){
        title = version.title;
        nameItButton = <button>Rename Version</button>
      }


      pastVersions.push(<div key={`pastVersion${version.timestamp}`}>
        <div><b>{title}</b></div>
        <div>{version.timestamp}</div>
        <div><button>View</button>{nameItButton}<button>Make a Copy</button></div>
        </div>)

    }
  }


  const currentVersion = <div>
    <div><b>Current Version</b></div>
    <div>{currentVersionInfo.timestamp}</div>
    <div><button>View</button>
    <button onClick={()=>{
    setVersion({instructions:{type:"Name Current Version"}}) }}>Name Version</button>
    <button>Make a Copy</button></div>
    </div>

  
  return <>
  {currentVersion}
  {pastVersions}
  </>
}

function NameCurrentVersionControl(props){
  const setVersion = useSetRecoilState(updateItemHistorySelector(props.branchId))

  return <>
  <button onClick={()=>{
    setVersion({instructions:{type:"Name Current Version"}})
    }}>Name Current Version</button>
  </>
  
}

let overlayTitleAtom = atom({
  key:"overlayTitleAtom",
  default:""
})

function DoenetViewerPanel(){
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
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

//When contentId changes then set the new loaded info into the editor atoms
function SetEditorDoenetMLandTitle(props){
  const loadedDoenetML = useRecoilValueLoadable(fileByContentId(props.contentId))
  const setEditorDoenetML = useSetRecoilState(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  let lastContentId = useRef("");
  const overlayInfo = useRecoilValue(openOverlayByName);
  const setEditorOverlayTitle = useSetRecoilState(overlayTitleAtom);

  // console.log({overlaytitle:overlayInfo?.instructions?.title})
  // console.log({lastId:lastContentId.current,propsId:props.contentId})
  // console.log({state:loadedDoenetML.state})
  //Set only once
  if (lastContentId.current !== props.contentId){
    if (loadedDoenetML.state === "hasValue"){
      let overlayTitle = overlayInfo?.instructions?.title;
      setEditorOverlayTitle(overlayTitle)
      let doenetML = loadedDoenetML?.contents?.data;
      setEditorDoenetML(doenetML);
      setViewerDoenetML((old)=>{
        let newInfo = {...old};
        newInfo.doenetML = doenetML;
        newInfo.updateNumber = old.updateNumber+1;
        return newInfo;
      })
      lastContentId.current = props.contentId; //Don't set again
    }
  }


return null;
}

const ItemInfo = function (){
  // console.log("=== 🧐 Item Info")
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  // const selectedDrive = useRecoilValue(selectedDriveAtom);

    if (infoLoad.state === "loading"){ return null;}
    if (infoLoad.state === "hasError"){ 
      console.error(infoLoad.contents)
      return null;}
   
      let itemInfo = infoLoad?.contents?.itemInfo;

    if (infoLoad.contents?.number > 1){
      return <>
      <h1>{infoLoad.contents.number} Items Selected</h1>
      </>
    }else if (infoLoad.contents?.number < 1){

    if (!itemInfo) return <h3>No Items Selected</h3>;
  }

 
  if (itemInfo?.itemType === "DoenetML"){
    
    console.log({itemInfo})

  return <div
  style={{height:"100%"}}
  >
  <h1>{itemInfo.label}</h1>
  
  <button 
  onClick={()=>setOverlayOpen({
    name: "editor", //to match the prop
    instructions: { 
      supportVisble: true,
      action: "open", //or "close"
      // contentId: draftObj.contentId,
      // branchId: itemInfo.branchId,
      // title: draftObj.title,
      // isDraft: draftObj.isDraft,
      // timestamp: draftObj.timestamp
    }
  })}>Edit</button>
  </div>
    }


  return <div
  style={{height:"100%"}}
  >
  <h1>{itemInfo.label}</h1>
  </div>
}

function AddMenuPanel(props){
  let path = Object.fromEntries(new URLSearchParams(props.route.location.search))?.path;
  if (!path){path = ":"}
  let [driveId,folderId] = path.split(":");
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}))
  const [drivesInfo,setNewDrive] = useRecoilState(fetchDrivesSelector)
  const history = useHistory();

  var activeDriveInfo = {};
  for (const driveObj of drivesInfo.driveIdsAndLabels){
    if (driveObj.driveId === driveId){
      activeDriveInfo = driveObj;
      break;
    }
  }


  let [folderLabel,setFolderLabel] = useState("")
  let [doenetMLLabel,setDoenetMLLabel] = useState("")
  // let [URLLabel,setURLLabel] = useState("")
  // let [URLLink,setURLLink] = useState("")
  let [driveLabel,setDriveLabel] = useState("")
  let [courseDriveLabel,setCourseDriveLabel] = useState("")



  let addDrive =  [<div key="new drive" style={{marginBottom:"10px"}}>
  <h3>Content Drive</h3>
  <label>Label <input size="10" type="text"  onChange={(e)=>setDriveLabel(e.target.value)} value={driveLabel}/></label><Button callback={()=>{
    const label = driveLabel === "" ? "Untitled" : driveLabel;
    let newDriveId = nanoid();
    setNewDrive({label,type:"new content drive",driveId,newDriveId})
    setDriveLabel("")
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    let newParams = {...urlParamsObj} 
    newParams['path'] = `${newDriveId}:${newDriveId}:${newDriveId}:Drive`
    history.push('?'+encodeParams(newParams))
    }} text="New Drive" />
</div>]

if (driveId === ""){
  return <>{addDrive}</>
}

if (activeDriveInfo?.type === 'content'){
  addDrive.push(<div key="course from content drive">
  <h3>Make a Course Drive</h3>
<label>Label <input size="10" type="text"  onChange={(e)=>setCourseDriveLabel(e.target.value)} value={courseDriveLabel}/></label><Button callback={()=>{
  const label = courseDriveLabel === "" ? "Untitled" : courseDriveLabel;
  let newDriveId = nanoid();
  setNewDrive({label,type:"make course drive from content drive",driveId,newDriveId})
  setCourseDriveLabel("")
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    let newParams = {...urlParamsObj} 
    newParams['path'] = `${newDriveId}:${newDriveId}:${newDriveId}:Drive`
    history.push('?'+encodeParams(newParams))
  }} text="Make Course" />
</div>)
}


  return <>
 {addDrive}
  <hr width="100"/>
  <h3>Folder</h3>
  <div>
    <label>Label <input size="10" type="text" onChange={(e)=>setFolderLabel(e.target.value)} value={folderLabel}/></label><Button callback={()=>{
     setFolderInfo({instructionType:"addItem",
      label:folderLabel === "" ? "Untitled" : folderLabel,
      itemType:"Folder"
      })
      setFolderLabel("");
    }} text="Add" />
  </div>
  <h3>DoenetML</h3>
  <div>
    <label>Label <input size="10" type="text" onChange={(e)=>setDoenetMLLabel(e.target.value)} value={doenetMLLabel}/></label><Button callback={()=>{
      setFolderInfo({instructionType:"addItem",
      label:doenetMLLabel === "" ? "Untitled" : doenetMLLabel,
      itemType:"DoenetML"
      })
      setDoenetMLLabel("");
      }} text="Add" />
  </div>
  {/* <h3>URL</h3>
  <div>
    <label>Label <input size="10" type="text" onChange={(e)=>setURLLabel(e.target.value)} value={URLLabel} /></label>
  </div>
  <div>
    <label>URL <input size="10" type="text" onChange={(e)=>setURLLink(e.target.value)} value={URLLink}/></label>
  <Button callback={()=>{
    setFolderInfo({instructionType:"addItem",
    label:URLLabel === "" ? "Untitled" : URLLabel,
    url:URLLink,
    itemType:"url"
    })
    setURLLink("");
  }} text="Add" />

  </div> */}

  </>
}

const EditorTitle = ()=>{
  const overlayTitle = useRecoilValue(overlayTitleAtom);
  return <span>{overlayTitle}</span>
}

export default function DoenetDriveTool(props) {
  console.log("=== 💾 Doenet Drive Tool");
  // const setOverlayOpen = useSetRecoilState(openOverlayByName);
  const [overlayInfo,setOverlayOpen] = useRecoilState(openOverlayByName);
  // const setSupportVisiblity = useSetRecoilState(supportVisible);
  const clearSelections = useSetRecoilState(clearAllSelections);

  const contentId = overlayInfo?.instructions?.contentId;
  const branchId = overlayInfo?.instructions?.branchId;
  
  let textEditor = null;
  let doenetViewerEditorControls = null;
  let doenetViewerEditor = null;
  let setLoadContentId = null;
  let editorTitle = null;
  let versionHistory = null;

  if (overlayInfo?.name === "editor"){
    editorTitle = <EditorTitle />
    setLoadContentId = <SetEditorDoenetMLandTitle contentId={contentId} />
    textEditor = <div><NameCurrentVersionControl branchId={branchId} /><TextEditor  branchId={branchId}/></div>
    doenetViewerEditorControls = <div><DoenetViewerUpdateButton  /></div>
    doenetViewerEditor =  <DoenetViewerPanel />
    versionHistory = <VersionHistoryPanel branchId={branchId} />
  }
  const history = useHistory();
  let encodeParams = (p) =>
    Object.entries(p)
      .map((kv) => kv.map(encodeURIComponent).join("="))
      .join("&");
  function useOutsideDriveSelector() {
    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  }
  // Breadcrumb container
  let routePathDriveId = "";
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search)
  );
  if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId
    ] = urlParamsObj.path.split(":");
  }
  let breadcrumbContainer = '';
  if(routePathDriveId){
    breadcrumbContainer = <BreadcrumbContainer />
  }
  return (
    <Tool>
      <navPanel>
      <GlobalFont/>
      <div style={{marginBottom:"40px",height:"100vh"}} 
       onClick={useOutsideDriveSelector} >
      <Drive types={['content','course']}  foldersOnly={true} />
      </div>
      </navPanel>

      <headerPanel title="my title">
        <p>Drive</p>
      </headerPanel>

      <mainPanel>
        
      {breadcrumbContainer}
        <div 
        onClick={()=>{
          clearSelections();
        }}
        style={{height:"100%",width:"100%"}}>
        <Drive types={['content','course']}  urlClickBehavior="select" 
        doenetMLDoubleClickCallback={(info)=>{
          setOverlayOpen({
            name: "editor", //to match the prop
            instructions: { 
              supportVisble: true,
              action: "open", //or "close"
              // contentId: info.item.contentId,
              contentId: info.item.branchId,
              branchId: info.item.branchId,
              title: info.item.label,
              isDraft: '1',
              timestamp: info.item.creationDate
            }
          });
          }}/>
      
        </div>
      </mainPanel>
      <supportPanel>
      <Drive types={['content','course']}  urlClickBehavior="select" />
      </supportPanel>

      <menuPanel title="Item Info">
        {/* <ItemInfo route={props.route} /> */}
        <ItemInfo  />
      </menuPanel>
      <menuPanel title="+">
       <AddMenuPanel route={props.route} />
      </menuPanel>

      <overlay name="editor">
        <headerPanel title="my title">
          {editorTitle}
          {/* <p>{overlayInfo?.instructions?.title}</p> */}
          <button
            onClick={() => {
              setOverlayOpen({
                name: "", //to match the prop
                instructions: { 
                  action: "close", //or "close"
                }
              });
            }}
          >
            Go Back
          </button>
        </headerPanel>

        <mainPanel>
          {setLoadContentId}
          {doenetViewerEditorControls}
          {doenetViewerEditor}
        </mainPanel>

        <supportPanel width="40%">
          {textEditor}
        </supportPanel>

        <menuPanel title="Version history">
        {versionHistory}
      </menuPanel>
  
      </overlay>

     
    </Tool>
  );
}
